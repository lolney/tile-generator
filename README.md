Web app for generating Civilization maps from Google Earth Engine climate/terrain data.

## Development

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

## Database setup

tile-generator uses PostGIS for certain geospatial queries.

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

Download the Koppen data from https://geoafrikana.com/resources/, then:

```
shp2pgsql -s 4326 world_climates_completed_koppen_geiger.shp | psql -h loca
lhost -d tilegenerator -U postgres
```
