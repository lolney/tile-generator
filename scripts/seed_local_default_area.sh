#!/usr/bin/env sh
set -eu

# Seeds enough real local raster data to run the default UI selection:
# California, lat 37..38 and lon -121..-120.
#
# Required tools:
# - PostgreSQL with PostGIS and postgis_raster
# - GDAL command line tools
# - curl

export PATH="/opt/homebrew/opt/postgresql@17/bin:/opt/homebrew/opt/postgis/bin:/opt/homebrew/bin:$PATH"

db_name="${PGDATABASE:-tilegenerator}"
data_dir="${1:-data}"

mkdir -p "$data_dir/elevation_tiles"

createdb "$db_name" 2>/dev/null || true
psql -d "$db_name" -c "CREATE EXTENSION IF NOT EXISTS postgis;"
psql -d "$db_name" -c "CREATE EXTENSION IF NOT EXISTS postgis_raster;"

# MODIS MCD12Q1 v061 LC_Type1, clipped from the Zenodo GeoTIFF archive.
gdal_translate -q \
  -projwin -121 38 -120 37 \
  -of GTiff \
  /vsicurl/https://zenodo.org/api/records/8367523/files/lc_mcd12q1v061.t1_c_500m_s_20190101_20191231_go_epsg.4326_v20230818.tif/content \
  "$data_dir/landcover_500.tif"

# WorldClim 2.1 BIO12 annual precipitation, clipped to the default bounds.
gdal_translate -q \
  -projwin -121 38 -120 37 \
  -of GTiff \
  /vsizip//vsicurl/https://geodata.ucdavis.edu/climate/worldclim/2_1/base/wc2.1_10m_bio.zip/wc2.1_10m_bio_12.tif \
  "$data_dir/precipitation_500.tif"

# Mapzen terrain tiles provide local elevation. Slope is derived from it.
for x in 41 42; do
  for y in 98 99; do
    curl -fsSL "https://s3.amazonaws.com/elevation-tiles-prod/geotiff/8/$x/$y.tif" \
      -o "$data_dir/elevation_tiles/$x-$y.tif"
  done
done

gdalbuildvrt -q "$data_dir/elevation.vrt" "$data_dir"/elevation_tiles/*.tif
gdalwarp -q \
  -t_srs EPSG:4326 \
  -te -121 37 -120 38 \
  -tr 0.01 0.01 \
  -r bilinear \
  "$data_dir/elevation.vrt" \
  "$data_dir/elevation_500.tif"
gdaldem slope -q "$data_dir/elevation_500.tif" "$data_dir/slope_500.tif"

# The app's forest and marsh layers only need simple masks from landcover.
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

# Local placeholders for the default inland bounding box. The original project
# expects global Earth Engine exports for these tables.
gdal_create -q -of GTiff -ot Byte -outsize 100 100 -burn 0 \
  -a_srs EPSG:4326 -a_ullr -121 38 -120 37 "$data_dir/watermask_500.tif"
gdal_create -q -of GTiff -ot Float32 -outsize 100 100 -burn 0 \
  -a_srs EPSG:4326 -a_ullr -121 38 -120 37 "$data_dir/flow_500.tif"
gdal_create -q -of GTiff -ot Byte -outsize 100 100 -burn 8 \
  -a_srs EPSG:4326 -a_ullr -121 38 -120 37 "$data_dir/beck_kg_v1_present_0p0083.tif"

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
