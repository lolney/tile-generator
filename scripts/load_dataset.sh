raster2pgsql -I -t 200x200 -s 4326 "$1*" $2 | psql -h localhost -d tilegenerator -U postgres
