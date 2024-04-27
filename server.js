// 'use strict';

// const express = require('express')

// const PORT = 8080;
// const HOST = '0.0.0.0'

// const app = express();
// app.get('/', (req, res) => {
//     res.send('Hiii');
// });

// app.listen(PORT, HOST);

// console.log('Running on http://${HOST}:${PORT}');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'admin',
    host: 'music-postgres',
    database: 'music_db',
    password: 'admin',
    port: 5432,
});


app.use(bodyParser.json());

app.use(cors());


app.get('/tracks', async(req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM tracks');
        res.json(result.rows);
        client.release();
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/tracks', async(req, res) => {
    const {title, artist, album} = req.body;
    try {
        const client = await pool.connect();
        const result = await client.query('INSERT INTO tracks (title, artist, album) VALUES ($1, $2, $3) RETURNING *', [title, artist, album]);
        res.status(201).json(result.rows[0]);
        client.release();
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/tracks/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT * FROM tracks WHERE id = " + id);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Track not found');
        }
        client.release();
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
    }
});

app.put('/tracks/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const {title, artist, album} = req.body;
    try {
        const client = await pool.connect();
        const result = await client.query("UPDATE tracks SET title = $1, artist = $2, album = $3 WHERE id = $4 RETURNING *", [title, artist, album, id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).send('Track not found');
        }
        client.release();
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/tracks/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const client = await pool.connect();
        const result = await client.query("DELETE FROM tracks WHERE id = $1", [id]);
        res.status(204).end();
        client.release();
    } catch(err) {
        console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log('Server running at https://localhost:${port}');
});