Web app for generating tile maps from Google Earth Engine climate/terrain data. The main use is to generate Civilization maps (Civ V or VI) based on real-world locations.

### Development

This project uses Lerna to manage its packages: `server`, `react-app`, and `common`.

To get started, run these commands in the project directory:

```
npm install
npm run build
npm install
```

```sh
# Start the server
npm run watch-server
npm start
# Start the client
npm run dev
```

Later versions of node currently don't work with node-postgres, so the configued Node version is 8.10.

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

Download the Koppen data from https://geoafrikana.com/resources/, then:

```
shp2pgsql -I -s 4326 ~/Downloads/Koppen_Geiger\ Edited\ and\ Completed/Shapefiles/world_climates_completed_koppen_geiger.shp | psql -h localhost -d tilegenerator -U postgres
```

River centerlines, downloaded from https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-rivers-lake-centerlines/:

```
shp2pgsql -I -s 4326 ~/Downloads/river_centerlines/ne_10m_rivers_lake_centerlines_scale_rank.shp | psql -h localhost -d tilegenerator -U postgres
```

###### Water mask:

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
