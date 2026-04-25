#!/usr/bin/env sh
set -eu

# Reproducibly builds substitute PostGIS raster tables from global public data.
#
# By default this script prepares global rasters. Set BBOX for a faster clipped
# development import:
#
#   BBOX="-121.5 36.75 -119.5 38.25" ./scripts/seed_substitute_rasters.sh
#
# BBOX order is: west south east north.

export PATH="/opt/homebrew/opt/postgresql@17/bin:/opt/homebrew/opt/postgis/bin:/opt/homebrew/bin:$PATH"
export CPL_VSIL_CURL_ALLOWED_EXTENSIONS=".tif,.zip,content"

db_name="${PGDATABASE:-tilegenerator}"
data_dir="${DATA_DIR:-data/substitute}"
target_res="${TARGET_RES:-0.0083333333333333}"
bbox="${BBOX:-}"
hydrorivers_url="${HYDRORIVERS_URL:-https://data.hydrosheds.org/file/HydroRIVERS/HydroRIVERS_v10_shp.zip}"
hydrorivers_min_discharge_cms="${HYDRORIVERS_MIN_DISCHARGE_CMS:-0.1}"
hydrorivers_min_strahler="${HYDRORIVERS_MIN_STRAHLER:-1}"

landcover_url="/vsicurl/https://zenodo.org/api/records/8367523/files/lc_mcd12q1v061.t1_c_500m_s_20190101_20191231_go_epsg.4326_v20230818.tif/content"
precipitation_url="/vsizip//vsicurl/https://geodata.ucdavis.edu/climate/worldclim/2_1/base/wc2.1_10m_bio.zip/wc2.1_10m_bio_12.tif"
koppen_url="/vsicurl/https://data.naturalcapitalalliance.stanford.edu/download/global/koppen_geiger_climatezones/koppen_geiger_climatezones_1991_2020_1km.tif"
elevation_url="/vsicurl/https://data.naturalcapitalalliance.stanford.edu/download/global/gebco/gebco_bathymetry_2024_global.tif"

mkdir -p "$data_dir/vectors"

createdb "$db_name" 2>/dev/null || true
psql -d "$db_name" -c "CREATE EXTENSION IF NOT EXISTS postgis;"
psql -d "$db_name" -c "CREATE EXTENSION IF NOT EXISTS postgis_raster;"

rm -f \
  "$data_dir/landcover_500.tif" \
  "$data_dir/precipitation_500.tif" \
  "$data_dir/elevation_500.tif" \
  "$data_dir/slope_500.tif" \
  "$data_dir/forest_500.tif" \
  "$data_dir/marsh_500.tif" \
  "$data_dir/watermask_500.tif" \
  "$data_dir/flow_500.tif" \
  "$data_dir/beck_kg_v1_present_0p0083.tif"

projwin_args=""
te_args=""
if [ -n "$bbox" ]; then
  # shellcheck disable=SC2086
  set -- $bbox
  west="$1"
  south="$2"
  east="$3"
  north="$4"
  projwin_args="-projwin $west $north $east $south"
  te_args="-te $west $south $east $north"
else
  printf '%s\n' "No BBOX set; preparing global substitute rasters. This can process many GB."
fi

translate() {
  source="$1"
  dest="$2"
  # shellcheck disable=SC2086
  gdal_translate -q $projwin_args -of GTiff "$source" "$dest"
}

warp_to_grid() {
  source="$1"
  dest="$2"
  # shellcheck disable=SC2086
  gdalwarp -q -t_srs EPSG:4326 $te_args -tr "$target_res" "$target_res" -r bilinear "$source" "$dest"
}

translate "$landcover_url" "$data_dir/landcover_500.tif"
translate "$precipitation_url" "$data_dir/precipitation_500.tif"
translate "$koppen_url" "$data_dir/beck_kg_v1_present_0p0083.tif"
warp_to_grid "$elevation_url" "$data_dir/elevation_500.tif"
gdaldem slope -q "$data_dir/elevation_500.tif" "$data_dir/slope_500.tif"

# MODIS MCD12Q1 LC_Type1 classes 1..5 are forest. Class 11 is wetlands.
gdal_calc.py --quiet \
  -a "$data_dir/landcover_500.tif" \
  --outfile="$data_dir/forest_500.tif" \
  --calc="logical_and(a>=1,a<=5)*1 + logical_or(a<1,a>5)*2" \
  --type=Byte \
  --NoDataValue=0 \
  --overwrite
gdal_calc.py --quiet \
  -a "$data_dir/landcover_500.tif" \
  --outfile="$data_dir/marsh_500.tif" \
  --calc="(a==11)*1" \
  --type=Byte \
  --NoDataValue=0 \
  --overwrite

# Start with MODIS landcover water and add global Natural Earth oceans/lakes.
gdal_calc.py --quiet \
  -a "$data_dir/landcover_500.tif" \
  --outfile="$data_dir/watermask_500.tif" \
  --calc="(a==17)*1" \
  --type=Byte \
  --NoDataValue=255 \
  --overwrite

for dataset in ne_10m_lakes ne_10m_ocean ne_10m_rivers_lake_centerlines; do
  if [ ! -f "$data_dir/vectors/$dataset.shp" ]; then
    curl -fsSL "https://naturalearth.s3.amazonaws.com/10m_physical/$dataset.zip" \
      -o "$data_dir/vectors/$dataset.zip"
    unzip -q -o "$data_dir/vectors/$dataset.zip" -d "$data_dir/vectors"
  fi
done

gdal_rasterize -q -burn 1 -at \
  -l ne_10m_lakes \
  "$data_dir/vectors/ne_10m_lakes.shp" \
  "$data_dir/watermask_500.tif"
gdal_rasterize -q -burn 1 -at \
  -l ne_10m_ocean \
  "$data_dir/vectors/ne_10m_ocean.shp" \
  "$data_dir/watermask_500.tif"

# HydroRIVERS is extracted from HydroSHEDS flow data and includes discharge,
# Strahler order, and downstream topology attributes. Rasterizing discharge
# keeps the existing fast raster query path while preserving real river paths.
gdal_calc.py --quiet \
  -a "$data_dir/landcover_500.tif" \
  --outfile="$data_dir/flow_500.tif" \
  --calc="a*0" \
  --type=Float32 \
  --NoDataValue=-9999 \
  --overwrite

hydrorivers_zip="$data_dir/vectors/$(basename "$hydrorivers_url")"
if [ ! -f "$hydrorivers_zip" ]; then
  curl -fsSL "$hydrorivers_url" -o "$hydrorivers_zip"
fi
unzip -q -o "$hydrorivers_zip" -d "$data_dir/vectors/hydrorivers"
hydrorivers_shp="$(find "$data_dir/vectors/hydrorivers" -name 'HydroRIVERS*.shp' | head -n 1)"
if [ -n "$hydrorivers_shp" ]; then
  hydrorivers_layer="$(basename "$hydrorivers_shp" .shp)"
  gdal_rasterize -q -at \
    -a DIS_AV_CMS \
    -where "DIS_AV_CMS >= $hydrorivers_min_discharge_cms AND ORD_STRA >= $hydrorivers_min_strahler" \
    -l "$hydrorivers_layer" \
    "$hydrorivers_shp" \
    "$data_dir/flow_500.tif"
else
  printf '%s\n' "HydroRIVERS shapefile not found; falling back to Natural Earth rivers."
  gdal_rasterize -q -burn 100 -at \
    -l ne_10m_rivers_lake_centerlines \
    "$data_dir/vectors/ne_10m_rivers_lake_centerlines.shp" \
    "$data_dir/flow_500.tif"
fi

for table in \
  watermask_500 \
  slope_500 \
  forest_500 \
  marsh_500 \
  flow_500 \
  elevation_500 \
  landcover_500 \
  precipitation_500 \
  beck_kg_v1_present_0p0083
do
  raster2pgsql -d -I -t 200x200 -s 4326 "$data_dir/$table.tif" "$table" | psql -d "$db_name"
done

psql -d "$db_name" -Atc "select tablename from pg_tables where schemaname='public' order by tablename;"
