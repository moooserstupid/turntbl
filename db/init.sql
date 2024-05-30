-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Playlists Table
CREATE TABLE playlists (
    id SERIAL PRIMARY KEY,
    playlistName VARCHAR(255) NOT NULL,
    userId INT NOT NULL,
    UNIQUE (playlistName, userId),
    CONSTRAINT fk_user_playlist
        FOREIGN KEY(userId)
            REFERENCES users(id)
            ON DELETE CASCADE
);

-- Tracks Table
CREATE TABLE tracks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    album VARCHAR(255),
    cover VARCHAR(255) NOT NULL,
    audio VARCHAR(255) NOT NULL,
    color TEXT NOT NULL,
    playlistId INT NOT NULL,
    userId INT NOT NULL,
    CONSTRAINT fk_user_track
        FOREIGN KEY(userId)
            REFERENCES users(id)
            ON DELETE CASCADE,
    CONSTRAINT fk_playlist_track
        FOREIGN KEY(playlistId)
            REFERENCES playlists(id)
            ON DELETE CASCADE
);


-- Insert the user
INSERT INTO users (name, surname, email, password)
VALUES ('Ali', 'Asghar', 'aligulli123@gmail.com', '$2a$10$lmMW6Pxo4uQOpgMOudpAfeWHFQl2PHFcpBPaCn1tr5WIWgdFt/iDm');

-- Retrieve the user ID
WITH user_info AS (
    SELECT id
    FROM users
    WHERE email = 'aligulli123@gmail.com'
)
-- Insert the playlist
INSERT INTO playlists (userId, playlistName)
SELECT id, 'my playlist'
FROM user_info;

-- Retrieve the playlist ID
WITH playlist_info AS (
    SELECT id, userId
    FROM playlists
    WHERE playlistName = 'my playlist'
)
-- Insert all the songs
INSERT INTO tracks (playlistId, title, cover, artist, audio, color, userId)
SELECT 
    pi.id,
    unnest(array['Oasis', 'Beaver Creek', 'Daylight', 'Keep Going']) AS title,
    unnest(array['https://chillhop.com/wp-content/uploads/2020/11/f78c39b4bb6313ddd0354bef896c591bfb490ff8-1024x1024.jpg', 'https://chillhop.com/wp-content/uploads/2020/09/0255e8b8c74c90d4a27c594b3452b2daafae608d-1024x1024.jpg', 'https://chillhop.com/wp-content/uploads/2020/07/ef95e219a44869318b7806e9f0f794a1f9c451e4-1024x1024.jpg', 'https://chillhop.com/wp-content/uploads/2020/07/ff35dede32321a8aa0953809812941bcf8a6bd35-1024x1024.jpg']) AS cover,
    unnest(array['Makzo', 'Aso, Middle School, Aviino', 'Aiguille', 'Swørn']) AS artist,
    unnest(array['https://mp3.chillhop.com/serve.php/?mp3=11768', 'https://mp3.chillhop.com/serve.php/?mp3=10075', 'https://mp3.chillhop.com/serve.php/?mp3=9272', 'https://mp3.chillhop.com/serve.php/?mp3=9222']) AS audio,
    unnest(array['{"#47609D", "#E88774"}', '{"#205950", "#2ab3bf"}', '{"#EF8EA9", "#ab417f"}', '{"#CD607D", "#c94043"}']) AS color,
    pi.userId
FROM playlist_info pi;

-- RAISE NOTICE 'User created successfully and songs inserted.';

-- Function to create a new playlist
CREATE OR REPLACE FUNCTION create_playlist(p_playlistName TEXT, p_userId INT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO playlists (playlistName, userId)
    VALUES (p_playlistName, p_userId);
END;
$$ LANGUAGE plpgsql;

-- Function to get playlists and tracks
CREATE OR REPLACE FUNCTION get_playlists_and_tracks(p_userId INT)
RETURNS TABLE(
    playlist_id INT,
    playlist_name TEXT,
    track_id INT,
    track_title TEXT,
    track_artist TEXT,
    track_album TEXT,
    track_cover TEXT,
    track_audio TEXT,
    track_color TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id AS playlist_id,
        p.playlistName::TEXT AS playlist_name,
        t.id AS track_id,
        t.title::TEXT AS track_title,
        t.artist::TEXT AS track_artist,
        t.album::TEXT AS track_album,
        t.cover::TEXT AS track_cover,
        t.audio::TEXT AS track_audio,
        t.color::TEXT AS track_color
    FROM 
        playlists p
    LEFT JOIN 
        tracks t ON p.id = t.playlistId
    WHERE 
        p.userId = p_userId
    ORDER BY 
        p.id, t.id;
END;
$$ LANGUAGE plpgsql;

-- Indexes to improve search performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_playlists_userId ON playlists(userId);
CREATE INDEX idx_tracks_playlistId ON tracks(playlistId);
CREATE INDEX idx_tracks_userId ON tracks(userId);
