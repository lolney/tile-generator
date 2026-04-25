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

There is not currently a checked-in full global seed. For local development, the
script below seeds the default UI bounding box in California (`37..38`,
`-121..-120`) with enough raster data to generate maps:

```sh
brew install postgresql@17 postgis gdal
brew services start postgresql@17

export PATH="/opt/homebrew/opt/postgresql@17/bin:/opt/homebrew/opt/postgis/bin:/opt/homebrew/bin:$PATH"
./scripts/seed_local_default_area.sh
```

The local seed uses:

- MODIS MCD12Q1 v061 `LC_Type1` for `landcover_500`
- WorldClim 2.1 BIO12 annual precipitation for `precipitation_500`
- Mapzen elevation tiles for `elevation_500`, with `slope_500` derived by GDAL
- `forest_500` and `marsh_500` derived from the landcover classes
- local placeholder rasters for `watermask_500`, `flow_500`, and
  `beck_kg_v1_present_0p0083`

The placeholders are enough for the default inland California local workflow,
but they are not a replacement for the original global Earth Engine exports.

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
- Elevation and slope: Mapzen Terrain Tiles GeoTIFFs on AWS for easy tiled
  downloads, with slope derived by GDAL; Copernicus DEM GLO-30 is a stronger
  global DEM alternative when 30 m source quality matters:
  https://registry.opendata.aws/terrain-tiles/
  https://registry.opendata.aws/copernicus-dem/
- Water mask: JRC Global Surface Water occurrence/seasonality/max-water COGs,
  thresholded into a MOD44W-style binary water mask:
  https://global-surface-water.appspot.com/download
- Forest: ESA WorldCover 2021 10 m class `10` ("Tree cover") for a modern
  high-resolution tree mask, or MODIS MCD12Q1 `LC_Type1` classes `1..5` for a
  lower-resolution source aligned with the local seed:
  https://worldcover2021.esa.int/download
- Flow accumulation and rivers: HydroSHEDS core flow accumulation grids, or
  HydroRIVERS vectors rasterized to the map grid:
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
