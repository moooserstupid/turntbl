const pool = require('../database');

const getAllTracks = async (req, res) => {
    try {
        //const client = await pool.connect();
        const result = await pool.query('SELECT * FROM tracks');
        res.json(result.rows);
        //client.release();
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
    }
};

const getTrackById = async (req, res) => {
    const id = parseInt(req.params.id);
    try{
        //const client = await pool.connect();
        const result = await pool.query('SELECT * FROM tracks WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Track not found');
        }
        //client.release();
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
    }
}

const createTrack = async (req, res) => {
    const {title, artist, album} = req.body;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const queryText = 'INSERT INTO tracks (title, artist, album) VALUES ($1, $2, $3) RETURNING *';
        const result = await client.query(queryText, [title, artist, album]);
        res.status(201).json(result.rows[0]);
        await client.query('COMMIT');
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
        await client.query('ROLLBACK');
    } finally {
        client.release();
    }
}

const updateTrack = async (req, res) => {
    const id = parseInt(req.params.id);
    const {title, artist, album} = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const queryText = 'UPDATE tracks SET title = $1, artist = $2, album = $3 WHERE id = $4 RETURNING *';
        const result = await client.query(queryText, [title, artist, album, id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Track not found');
        }
        await client.query('COMMIT');
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
        await client.query('ROLLBACK');
    } finally {
        client.release();
    }
}

const deleteTrack = async (req, res) => {
    const id = parseInt(req.params.id);
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const queryText = 'DELETE FROM tracks WHERE id = $1';
        const result = await client.query(queryText, [id]);
        if (result.rowCount > 0) {
            res.status(204).send('Track deleted successfully');
        } else {
            res.status(404).send('Track not found');
        }
        await client.query('COMMIT');
    } catch(err) {
        console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
        await client.query('ROLLBACK');
    } finally {
        client.release();
    }
}

module.exports = {
    getAllTracks,
    getTrackById,
    createTrack,
    updateTrack,
    deleteTrack
};
