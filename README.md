<img width="1944" height="1418" alt="95606653_281827036176851_4234289681669292032_n" src="https://github.com/user-attachments/assets/f59a8826-5472-46ba-a3a1-c30fdf466300" />
<img width="1918" height="1393" alt="95684205_695074414589100_5422431318262677504_n" src="https://github.com/user-attachments/assets/eef4f8f8-a226-46e5-97ee-9d72f417d8ca" />


Web app for generating tile maps from Google Earth Engine climate/terrain data. The main use is to generate Civilization maps (Civ V or VI) based on real-world locations.

## Development

### Lerna

This project uses npm workspaces and Lerna to manage its packages: `server`,
`react-app`, `app-engine`, and `common`. Use Node 22 or newer.

To get started, run these commands in the top-level directory:

```
npm install
npm run build
```

To install a package in one of ours, use the `add` script:

```
npm install <package-name> --workspace=@tile-generator/common
```

The command `npm run reinstall-common` will update the @tile-generator/common in the

To best way to remove a dependency (pending an addition to Lerna like this [PR](https://github.com/lerna/lerna/issues/1886)) is to remove it from the package.json, delete the package from `node_modules`, then run `npm i` at the top level.

### Building and running:

```sh
# Compile on watch mode
cd packages/server
npm run watch
```

```sh
# Start the server
npm start
```

```sh
# Start the client
cd packages/react-app
npm start
```

### Database setup

tile-generator uses PostGIS for certain geospatial queries (version >= 2.3).

Create a `.env` file in `packages/server` with the following:

```
PGHOST='localhost'
PGUSER=<local postgres user>
PGDATABASE=tilegenerator
PGPASSWORD=<password if required>
PGPORT=5432
```

Run the following script to create the database:

```
npm run db:create
```

The substitute-data pipeline is reproducible and global by default. A full
production seed creates all raster tables plus an indexed `hydrorivers` vector
table used for higher-quality river rendering:

```sh
brew install postgresql@17 postgis gdal
brew services start postgresql@17

export PATH="/opt/homebrew/opt/postgresql@17/bin:/opt/homebrew/opt/postgis/bin:/opt/homebrew/bin:$PATH"
export PGDATABASE=tilegenerator
./scripts/seed_substitute_rasters.sh
```

The global run downloads or streams several large public datasets. Expect many
GB of network traffic and local scratch data, especially GEBCO elevation and
the global HydroRIVERS archive. Keep `DATA_DIR` on a volume with enough free
space if you do not want the default `data/substitute` location:

```sh
DATA_DIR=/Volumes/maps/tile-generator-seed ./scripts/seed_substitute_rasters.sh
```

For fast local development, clip the same global sources with `BBOX`
(`west south east north`):

```sh
BBOX="-121.5 36.75 -119.5 38.25" ./scripts/seed_substitute_rasters.sh
```

`./scripts/seed_local_default_area.sh` is a convenience wrapper around that
clipped command for the default UI area in California's Central Valley and
Sierra foothills.

The substitute seed uses:

- MODIS MCD12Q1 v061 `LC_Type1` for `landcover_500`
- WorldClim 2.1 BIO12 annual precipitation for `precipitation_500`
- GEBCO 2024 global elevation/bathymetry for `elevation_500`, with `slope_500`
  derived by GDAL
- `forest_500` and `marsh_500` derived from the landcover classes
- `watermask_500` from MODIS landcover water plus Natural Earth lakes/ocean
- `flow_500` from HydroRIVERS discharge values rasterized to the map grid
- `hydrorivers` from the same HydroRIVERS source, loaded as indexed PostGIS
  vectors for continuity-preserving river rendering
- `beck_kg_v1_present_0p0083` from the NatCap-hosted Koppen-Geiger COG

The `flow_500` substitute uses HydroRIVERS because it is global, topological,
and includes estimated long-term discharge plus Strahler/order attributes. The
seed keeps the app's fast raster lookup path as a fallback, while the
`hydrorivers` vector table is preferred at runtime for real-world alignment and
continuous river paths. You can tune source density before rasterization and
vector import with:

```sh
HYDRORIVERS_MIN_DISCHARGE_CMS=0.1 HYDRORIVERS_MIN_STRAHLER=1 ./scripts/seed_substitute_rasters.sh
```

Set `LOAD_HYDRORIVERS_VECTORS=0` only if you need the old raster-only behavior
or are importing into a constrained development database.

For smaller-scale maps, raise one of those thresholds or generate separate
`flow_500` copies at different thresholds and point `FLOW_DB_NAME` at the
appropriate table.

## Deployment

Deploy to GCP App Engine using the root dockerfile:

```
gcloud app deploy
```

### More information on the data sources

#### Reconstructed raster sources

The original global raster tables are generated from Google Earth Engine in
`packages/server/src/earth-engine/exportRasters.js`:

- `watermask_500`: `MODIS/MOD44W/MOD44W_005_2000_02_24`, band `water_mask`
- `slope_500`: `CGIAR/SRTM90_V4`, converted with `ee.Terrain.slope`
- `marsh_500`: `MODIS/006/MCD12Q1`, band `LC_Type1`, class `11`
- `forest_500`: `JAXA/ALOS/PALSAR/YEARLY/FNF`, 2017 `fnf` band
- `flow_500`: `WWF/HydroSHEDS/30ACC`, band `b1`

The app also expects these PostGIS raster tables:

- `elevation_500`: the elevation raster behind `slope_500`
- `landcover_500`: MODIS MCD12Q1 `LC_Type1`
- `precipitation_500`: WorldClim annual precipitation / BIO12
- `beck_kg_v1_present_0p0083`: Beck et al. Koppen-Geiger climate classes

#### Suggested non-Earth-Engine substitutes

- Landcover and marsh: MODIS MCD12Q1 v061 Cloud Optimized GeoTIFF mosaics on
  Zenodo, using `LC_Type1` and class `11` for wetlands:
  https://zenodo.org/record/8338928
- Precipitation: WorldClim 2.1 bioclimatic variable BIO12:
  https://www.worldclim.org/data/worldclim21.html
- Elevation and slope: GEBCO 2024 global elevation/bathymetry COG for a single
  global source; Copernicus DEM GLO-30 is a stronger land-only alternative when
  30 m source quality matters:
  https://data.naturalcapitalalliance.stanford.edu/download/global/gebco/gebco_bathymetry_2024_global.tif
  https://registry.opendata.aws/copernicus-dem/
- Water mask: JRC Global Surface Water occurrence/seasonality/max-water COGs,
  thresholded into a MOD44W-style binary water mask:
  https://global-surface-water.appspot.com/download
- Forest: ESA WorldCover 2021 10 m class `10` ("Tree cover") for a modern
  high-resolution tree mask, or MODIS MCD12Q1 `LC_Type1` classes `1..5` for a
  lower-resolution source aligned with the local seed:
  https://worldcover2021.esa.int/download
- Flow accumulation and rivers: HydroRIVERS vectors rasterized to the map grid
  for real-world continuity; HydroSHEDS core flow accumulation grids or MERIT
  Hydro are alternatives when raster flow accumulation is more important than
  line geometry:
  https://www.hydrosheds.org/products
  https://www.hydrosheds.org/downloads-archive
- Koppen-Geiger climate: Beck et al. 1 km present-day classification maps:
  https://www.nature.com/articles/sdata2018214

#### Downloading and adding data sources

Download the Koppen data from https://figshare.com/articles/Present_and_future_K_ppen-Geiger_climate_classification_maps_at_1-km_resolution/6396959/2, then:

```
raster2pgsql -I -t 200x200 -s 4326 ~/Downloads/Beck_KG_V1/Beck_KG_V1_present_0p0083.tif  | psql -h localhost -d tilegenerator -U postgres
```

River centerlines, downloaded from https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-rivers-lake-centerlines/:

```
shp2pgsql -I -s 4326 ~/Downloads/river_centerlines/ne_10m_rivers_lake_centerlines_scale_rank.shp | psql -h localhost -d tilegenerator -U postgres
```

GeoJSON data:

```
cd ~/Downloads
ogr2ogr -f "PostgreSQL" PG:"dbname=tilegenerator user=postgres" "rivers.geojson"
```

###### Water mask and other Google Earth Engine Sources:

- Run the script [](https://code.earthengine.google.com/67d5310441e9d02d8e630167d87f5070), exporting to Google Drive
- Download the image from Drive, then run the following:

```
raster2pgsql -I -t 200x200 -s 4326 ~/Downloads/waterMask_500.tif | psql -h localhost -d tilegenerator -U postgres
```

To include multiple rasters in the import, use a wild card:

```
raster2pgsql -I -t 200x200 -s 4326 ~/Downloads/<tablename>* <tablename> | psql -h localhost -d tilegenerator -U postgres
```

### Running pgadmin

For development purposes, pgadmin is helpful for writing and testing queries:
https://askubuntu.com/questions/831262/how-to-install-pgadmin-4-in-desktop-mode-on-ubuntu
