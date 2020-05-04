pg_dump -U postgres --format=plain --no-owner --no-acl tilegenerator\
    | sed -E 's/(DROP|CREATE|COMMENT ON) EXTENSION/-- \1 EXTENSION/g'\
    | sed -e 's/SET default_table_access_method = heap;//'\
    | gzip > ~/Downloads/tilegenerator-dump.sql.gz