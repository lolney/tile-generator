Web app for generating Civilization maps from Google Earth Engine climate/terrain data.

### Development

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
shp2pgsql -s 4326 world_climates_completed_koppen_geiger.shp | psql -h loca
lhost -d tilegenerator -U postgres
```

River centerlines, downloaded from https://www.naturalearthdata.com/downloads/10m-physical-vectors/10m-rivers-lake-centerlines/:

```
shp2pgsql -s 4326 /home/luke/Downloads/river_centerlines/ne_10m_rivers_lake_centerlines_scale_rank.shp | psql -h localhost -d tilegenerator -U postgres
```
