Web app for generating tile maps from Google Earth Engine climate/terrain data. The main use is to generate Civilization maps (Civ V or VI) based on real-world locations.

## Development

### Lerna

This project uses Lerna to manage its packages: `server`, `react-app`, `app-engine`, and `common`.

To get started, run these commands in the top-level directory:

```
npm install
npm run build
npm install
```

To install a package in one of ours, use the `add` script:

```
lerna add @package/name -- --scope=@tile-generator/common
```

The command `npm run reinstall-common` will update the @tile-generator/common in the

To best way to remove a dependency (pending an addition to Lerna like this [PR](https://github.com/lerna/lerna/issues/1886)) is to remove it from the package.json, delete the package from `node_modules`, then run `npm i` at the top level.

### Building and running:

```sh
# Compile on watch mode
cd packages/server
npm run watch-server
```

```sh
# Start the server
npm start
```

```sh
# Start the proxy server (used for rate limiting)
cd packages/app-engine
npm gcp-build && npm start
```

```sh
# Start the client
cd packages/react-app
npm run start-with-proxy
```

### Database setup

tile-generator uses PostGIS for certain geospatial queries (version >= 2.3).

Create a .env file in the root project directory with the following:

```
PGHOST='localhost'
PGUSER=postgres
PGDATABASE=tilegenerator
PGPASSWORD=<password>
PGPORT=5432
```

Run the following scripts to setup and seed the database:

```
npm run db:create
npm run db:seed
```

### More information on the data sources

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
