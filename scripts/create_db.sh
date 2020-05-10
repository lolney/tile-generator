host=localhost
psql -h $host -U postgres -c "CREATE DATABASE tilegenerator;"
psql -h $host -d tilegenerator -U postgres -c "CREATE EXTENSION IF NOT EXISTS postgis;"
psql -h $host -d tilegenerator -U postgres -c "CREATE EXTENSION IF NOT EXISTS postgis_raster;"