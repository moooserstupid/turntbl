CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    surname TEXT,
    email TEXT,
    password TEXT
);

CREATE TABLE tracks (
    id SERIAL PRIMARY KEY,
    title TEXT,
    artist TEXT,
    album TEXT,
    userId INT,
    CONSTRAINT fk_user
        FOREIGN KEY(userId)
            REFERENCES users(id)
);