CREATE TABLE rivers_merge AS
SELECT name, ST_LineMerge(
                 ST_Collect(
                   ST_LineMerge(
                       ST_Transform(geom, 4326)
                    )
                 )
               ) AS geom
FROM ne_10m_rivers_lake_centerlines_scale_rank
GROUP BY name;
