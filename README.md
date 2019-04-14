Web app for generating Civilization maps from Google Earth Engine climate/terrain data.

### Development

Later versions of node currently don't work with node-postgres:

```
nvm use 8.10
```

```
npm install
```

then

```
npm run watch-all
```

or, separately:

```
npm run watch-server
```

```
npm run dev
```

```
npm start
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

With postgres installed, access the command line with `sudo -u postgres psql postgres` and enter the following:

```
CREATE DATABASE tilegenerator;
CREATE EXTENSION postgis;
```

### Downloading and adding data sources

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
