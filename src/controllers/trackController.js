const pool = require('../database');

const getAllTracks = async (req, res) => {
    const userId = req.user.userId;
    try {
        //const client = await pool.connect();
        const result = await pool.query('SELECT * FROM tracks WHERE userId = $1', [userId]);
        res.status(200).json(result.rows);
        //client.release();
    } catch (err) {
        //console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
    }
};

const addTrackToPlaylist = async (req, res) => {
    const userId = req.user.userId;
    const {title, cover, artist, audioUrl} = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const newPlaylistIdResult = await client.query('SELECT id FROM playlists WHERE playlistName = $1 AND userId = $2', ['my playlist', userId]);
        const playlistId = newPlaylistIdResult.rows[0].id;
        const queryText = 'INSERT INTO tracks (playlistId, title, cover, artist, audio, color, userId) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
        const result = await client.query(queryText, [playlistId, title, cover, artist, audioUrl, '{"#CD607D", "#c94043"}', userId]);
        // Check if any rows were affected by the insert operation
        if (result.rowCount === 0) {
            throw new Error('Failed to insert track into the playlist.');
        }
        // Send back the inserted track data in the response
        res.status(201).json({ success: true, data: result.rows[0], message: 'Track added successfully.' });
        await client.query('COMMIT');
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).send({sucess: false, message: 'Internal Server Error.'});
        await client.query('ROLLBACK');
    } finally {
        client.release();
    }
}

const deleteTrackFromPlaylist = async (req, res) => {
    const userId = req.user.userId;
    const {id} = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const newPlaylistIdResult = await client.query('SELECT id FROM playlists WHERE playlistName = $1 AND userId = $2', ['my playlist', userId]);
        const playlistId = newPlaylistIdResult.rows[0].id;
        const queryText = 'DELETE FROM tracks WHERE id = $1 AND playlistId = $2 AND userId = $3';
        const result = await client.query(queryText, [id, playlistId, userId]);
        if (result.rowCount > 0) {
            res.status(204).json();
        } else {
            res.status(404).send({success: false, message: 'Track not found'});
        }
        await client.query('COMMIT');
    } catch (err) {
        res.status(500).send({sucess: false, message: 'Internal Server Error.'});
        await client.query('ROLLBACK');
    } finally {
        client.release();
    }
}

const getTrackById = async (req, res) => {
    const id = parseInt(req.params.id);
    const userId = req.user.userId;
    try{
        //const client = await pool.connect();
        const result = await pool.query('SELECT * FROM tracks WHERE id = $1 AND userId = $2', [id, userId]);
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).send('Track not found');
        }
        //client.release();
    } catch (err) {
        //console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getAllTracks,
    deleteTrackFromPlaylist,
    addTrackToPlaylist,
    getTrackById,
};
