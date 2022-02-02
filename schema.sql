DROP TABLE IF EXISTS moviesAdded;

CREATE TABLE IF NOT EXISTS moviesAdded(
    id SERIAL PRIMARY KEY,
    Adult BOOLEAN,
    overview VARCHAR(10000),
    title VARCHAR(10000),
    release_date VARCHAR(10000),
    poster_path VARCHAR(10000),
    comment VARCHAR(10000)
);

