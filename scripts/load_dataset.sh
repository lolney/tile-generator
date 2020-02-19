pattern="$1*"
host=localhost
raster2pgsql -I -t 200x200 -s 4326 $pattern $2 | psql -h $host -d tilegenerator -U postgres