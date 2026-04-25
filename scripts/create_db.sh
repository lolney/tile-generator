host="${PGHOST:-localhost}"
user="${PGUSER:-postgres}"
database="${PGDATABASE:-tilegenerator}"

createdb -h "$host" -U "$user" "$database" 2>/dev/null || true
psql -h "$host" -d "$database" -U "$user" -c "CREATE EXTENSION IF NOT EXISTS postgis;"
psql -h "$host" -d "$database" -U "$user" -c "CREATE EXTENSION IF NOT EXISTS postgis_raster;"
