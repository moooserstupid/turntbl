const pool = require('../database');

const getAllPlaylistsAndTracks = async (req, res) => {
    const userId = req.user.userId[0];
    try {
        const result = await pool.query('SELECT * FROM get_playlists_and_tracks($1);', [userId]);
        if (result.rowCount > 0) {
            const formattedData = formatPlaylists(result.rows);
            res.status(200).json({ success: true, data: formattedData, message: "Successfully retrieved playlists"});
        } else {
            res.status(404).json({ success: false, message: 'No playlists have been created.' });
        }
    } catch (err) {
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
};

const createNewPlaylist = async (req, res) => {
    const userId = req.user.userId[0];
    const { playlistName } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const searchForMatchingPlaylist = await client.query('SELECT * FROM playlists WHERE playlistName = $1 AND userId = $2', [playlistName, userId]);
        if (searchForMatchingPlaylist.rowCount > 0) {
            await client.query('ROLLBACK');
            return res.status(400).send({ success: false, message: 'Playlist already exists.' });
        }
        await client.query('SELECT create_playlist($1, $2);', [playlistName, userId]);
        const newPlaylistIdResult = await client.query('SELECT id FROM playlists WHERE playlistName = $1 AND userId = $2', [playlistName, userId]);
        const playlistId = newPlaylistIdResult.rows[0].id;
        await client.query('COMMIT');
        res.status(201).json({ success: true, playlist_id: playlistId, message: 'Playlist created successfully' });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    } finally {
        client.release();
    }
};

const deletePlaylist = async (req, res) => {
    const userId = req.user.userId[0];
    const { playlistId } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const queryText = 'DELETE FROM playlists WHERE id = $1 AND userId = $2';
        const result = await client.query(queryText, [playlistId, userId]);
        if (result.rowCount > 0) {
            await client.query('COMMIT');
            res.status(204).json({ success: true, message: 'Playlist Deleted Successfully' });
        } else {
            await client.query('ROLLBACK');
            res.status(404).json({ success: false, message: 'Playlist not found.' });
        }
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).send({ success: false, message: 'Internal Server Error.' });
    } finally {
        client.release();
    }
};

// Utility function to format the playlist data
const formatPlaylists = (data) => {
    const playlistsMap = new Map();

    data.forEach(row => {
        if (!playlistsMap.has(row.playlist_id)) {
            playlistsMap.set(row.playlist_id, {
                playlist_id: row.playlist_id,
                playlist_name: row.playlist_name,
                tracks: []
            });
        }

        if (row.track_id) {
            playlistsMap.get(row.playlist_id).tracks.push({
                track_id: row.track_id,
                track_title: row.track_title,
                track_artist: row.track_artist,
                track_album: row.track_album,
                track_cover: row.track_cover,
                track_audio: row.track_audio,
                track_color: row.track_color
            });
        }
    });

    return Array.from(playlistsMap.values());
};

module.exports = {
    getAllPlaylistsAndTracks,
    createNewPlaylist,
    deletePlaylist
};
