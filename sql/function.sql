
DROP FUNCTION create_compression_table;
CREATE OR REPLACE FUNCTION create_compression_table(original_table_name TEXT, column_name TEXT, row_limit INT)
RETURNS TABLE (
    UNCOMP_time DOUBLE PRECISION,  -- ms
    RLE_time DOUBLE PRECISION,  -- ms
    TADOC_time DOUBLE PRECISION,  -- ms
    LZW_time DOUBLE PRECISION,  -- ms
    PGLZ_time DOUBLE PRECISION,  -- ms
    LZ4_time DOUBLE PRECISION,  -- ms

    UNCOMP_size BIGINT,
    RLE_size BIGINT,
    TADOC_size BIGINT,
    LZW_size BIGINT,
    PGLZ_size BIGINT,
    LZ4_size BIGINT
) AS $$
DECLARE
    new_table_name TEXT := 'comp_' || original_table_name || '_'  || column_name ;
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    uncompressed_time DOUBLE PRECISION;
    rle_time DOUBLE PRECISION;
    tadoc_time DOUBLE PRECISION;
    lzw_time DOUBLE PRECISION;
    pglz_time DOUBLE PRECISION;
    lz4_time DOUBLE PRECISION;
    uncompressed_size BIGINT;
    rle_size BIGINT;
    tadoc_size BIGINT;
    lzw_size BIGINT;
    pglz_size BIGINT;
    lz4_size BIGINT;
BEGIN
    -- Check if the table exists and drop it if it does
    IF EXISTS (SELECT 1 FROM pg_catalog.pg_class WHERE relname = new_table_name AND relkind = 'r') THEN
        EXECUTE format('DROP TABLE %I', new_table_name);
        RAISE NOTICE 'Existing table % dropped.', new_table_name;
    END IF;

    -- create new table
    EXECUTE format('CREATE TABLE %I (id SERIAL PRIMARY KEY, 
                    %I_UNCOMP TEXT STORAGE External,
                    %I_RLE TEXT COMPRESSION RLE, 
                    %I_TADOC TEXT COMPRESSION TADOC, 
                    %I_LZW TEXT COMPRESSION LZW, 
                    %I_PGLZ TEXT COMPRESSION PGLZ, 
                    %I_LZ4 TEXT COMPRESSION LZ4)', 
                    new_table_name, column_name, column_name, column_name, column_name, column_name, column_name);

    -- insert data and apply various compression schemes
    start_time := clock_timestamp();
    EXECUTE format('INSERT INTO %I (id, %I_UNCOMP) SELECT nextval(''%I_id_seq''), %I FROM (SELECT %I FROM %I LIMIT %s) AS subquery', 
                    new_table_name, column_name, new_table_name, column_name, column_name, original_table_name, row_limit);
    end_time := clock_timestamp();
    -- RAISE NOTICE 'Time to insert uncompressed data: %', end_time - start_time;
    -- uncompressed_time := end_time - start_time;
    uncompressed_time := EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
    EXECUTE format('SELECT sum(pg_column_size(%I_UNCOMP)) FROM %I', column_name, new_table_name) INTO uncompressed_size;

    -- add RLE data
    start_time := clock_timestamp();
    EXECUTE format('UPDATE %I SET %I_RLE = subquery.%I 
            FROM (
                SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) as id, %I 
                FROM %I 
                LIMIT %L
            ) AS subquery 
            WHERE %I.id = subquery.id',
                    new_table_name, column_name, column_name, column_name, original_table_name, row_limit, new_table_name);
    end_time := clock_timestamp();
    -- RAISE NOTICE 'Time to insert RLE data: %', end_time - start_time;
    -- rle_time := end_time - start_time;
    rle_time := EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
    EXECUTE format('SELECT sum(pg_column_size(%I_RLE)) FROM %I', column_name, new_table_name) INTO rle_size;

    -- -- add TADOC data
    -- start_time := clock_timestamp();
    -- EXECUTE format('UPDATE %I SET %I_TADOC = subquery.%I 
    --         FROM (
    --             SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) as id, %I 
    --             FROM %I 
    --             LIMIT %L
    --         ) AS subquery 
    --         WHERE %I.id = subquery.id',
    --                 new_table_name, column_name, column_name, column_name, original_table_name, row_limit, new_table_name);
    -- end_time := clock_timestamp();
    -- -- RAISE NOTICE 'Time to insert TADOC data: %', end_time - start_time;
    -- -- tadoc_time := end_time - start_time;
    -- tadoc_time := EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
    -- EXECUTE format('SELECT sum(pg_column_size(%I_TADOC)) FROM %I', column_name, new_table_name) INTO tadoc_size;

    -- add LZW data
    start_time := clock_timestamp();
    EXECUTE format('UPDATE %I SET %I_LZW = subquery.%I 
            FROM (
                SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) as id, %I 
                FROM %I 
                LIMIT %L
            ) AS subquery 
            WHERE %I.id = subquery.id',
                    new_table_name, column_name, column_name, column_name, original_table_name, row_limit, new_table_name);
    end_time := clock_timestamp();
    -- RAISE NOTICE 'Time to insert LZW data: %', end_time - start_time;
    -- lzw_time := end_time - start_time;
    lzw_time := EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
    EXECUTE format('SELECT sum(pg_column_size(%I_LZW)) FROM %I', column_name, new_table_name) INTO lzw_size;

    -- add PGLZ data
    start_time := clock_timestamp();
    EXECUTE format('UPDATE %I SET %I_PGLZ = subquery.%I 
            FROM (
                SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) as id, %I 
                FROM %I 
                LIMIT %L
            ) AS subquery 
            WHERE %I.id = subquery.id',
                    new_table_name, column_name, column_name, column_name, original_table_name, row_limit, new_table_name);
    end_time := clock_timestamp();
    -- RAISE NOTICE 'Time to insert PGLZ data: %', end_time - start_time;
    -- pglz_time := end_time - start_time;
    pglz_time := EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
    EXECUTE format('SELECT sum(pg_column_size(%I_PGLZ)) FROM %I', column_name, new_table_name) INTO pglz_size;

    -- add LZ4 data
    start_time := clock_timestamp();
    EXECUTE format('UPDATE %I SET %I_LZ4 = subquery.%I 
            FROM (
                SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) as id, %I 
                FROM %I 
                LIMIT %L
            ) AS subquery 
            WHERE %I.id = subquery.id',
                    new_table_name, column_name, column_name, column_name, original_table_name, row_limit, new_table_name);
    end_time := clock_timestamp();
    -- RAISE NOTICE 'Time to insert LZ4 data: %', end_time - start_time;
    -- lz4_time := end_time - start_time;
    lz4_time := EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
    EXECUTE format('SELECT sum(pg_column_size(%I_LZ4)) FROM %I', column_name, new_table_name) INTO lz4_size;

    RAISE NOTICE 'Table % created and data inserted.', new_table_name;
    -- Return the times
    RETURN QUERY SELECT uncompressed_time, rle_time, tadoc_time, lzw_time, pglz_time, lz4_time, uncompressed_size, rle_size, tadoc_size, lzw_size, pglz_size, lz4_size;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION compress_scheme_comparison;
CREATE OR REPLACE FUNCTION compress_scheme_comparison(original_table_name TEXT, column_name TEXT, row_limit INT)
RETURNS void AS $$
DECLARE
    new_table_name TEXT := 'comp_info_' || original_table_name || '_' || column_name;
    time_table_name TEXT := 'comp_time_info_' || original_table_name || '_' || column_name;
    size_table_name TEXT := 'comp_size_info_' || original_table_name || '_' || column_name;
BEGIN
    IF EXISTS (SELECT 1 FROM pg_catalog.pg_class WHERE relname = new_table_name AND relkind = 'r') THEN
        EXECUTE format('DROP TABLE %I', new_table_name);
        RAISE NOTICE 'Existing table % dropped.', new_table_name;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_catalog.pg_class WHERE relname = time_table_name AND relkind = 'r') THEN
        EXECUTE format('DROP TABLE %I', time_table_name);
        RAISE NOTICE 'Existing table % dropped.', time_table_name;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_catalog.pg_class WHERE relname = size_table_name AND relkind = 'r') THEN
        EXECUTE format('DROP TABLE %I', size_table_name);
        RAISE NOTICE 'Existing table % dropped.', size_table_name;
    END IF;

    -- Create a new table from the results of another function
    -- Ensure create_compression_table is designed to return a set that can be directly selected into a table
    EXECUTE format('CREATE TABLE %I AS SELECT * FROM create_compression_table(%L, %L, %s)',
                    new_table_name, original_table_name, column_name, row_limit);
    EXECUTE format('CREATE TABLE %I AS SELECT UNCOMP_time, RLE_time, TADOC_time, LZW_time, PGLZ_time, LZ4_time FROM create_compression_table(%L, %L, %s)',
                    time_table_name, original_table_name, column_name, row_limit);
    EXECUTE format('CREATE TABLE %I AS SELECT UNCOMP_size, RLE_size, TADOC_size, LZW_size, PGLZ_size, LZ4_size FROM create_compression_table(%L, %L, %s)',
                    size_table_name, original_table_name, column_name, row_limit);
END;
$$ LANGUAGE plpgsql;


DROP FUNCTION get_compression_sizes;
CREATE OR REPLACE FUNCTION get_compression_sizes(original_table_name TEXT, column_name TEXT)
RETURNS TABLE(
    size_uncomp INTEGER,
    size_rle INTEGER,
    size_lzw INTEGER,
    size_tadoc INTEGER,
    size_pglz INTEGER,
    size_lz4 INTEGER
) AS $$
DECLARE
    table_name TEXT := 'comp_' || original_table_name || '_' || column_name;
BEGIN
    RETURN QUERY EXECUTE format('SELECT pg_column_size(%I_uncomp) AS size_uncomp, 
                    pg_column_size(%I_rle) AS size_rle, 
                    pg_column_size(%I_tadoc) AS size_tadoc, 
                    pg_column_size(%I_lzw) AS size_lzw, 
                    pg_column_size(%I_pglz) AS size_pglz, 
                    pg_column_size(%I_lz4) AS size_lz4 
                    FROM %I',
                    column_name, column_name, column_name, column_name, column_name, column_name, table_name);
END;
$$ LANGUAGE plpgsql;