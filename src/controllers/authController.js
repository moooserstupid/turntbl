const pool = require('../database');
const jwt = require('jsonwebtoken')
SECRET_KEY = '1234';

const registerUser = async (req, res) => {
    const {name, lastname, email, password} = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const searchForUserResult = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (searchForUserResult.rows.length > 0) {
            return res.status(400).send("This username is already being used!");
        }
        const queryText = 'INSERT INTO users (name, surname, email, password) VALUES ($1, $2, $3, $4)';
        const result = await client.query(queryText, [name, lastname, email, password]);
        res.status(201).send('Account created successfully.');
        await client.query('COMMIT');
    } catch (err) {
        res.status(500).send('Internal Server Error');
        await client.query('ROLLBACK');
    } finally {
        client.release();
    }
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
        if (result.rows.length > 0) {
            const id = result.rows.map(row => row.id);
            console.log(id);
            const token = jwt.sign({userId: id}, SECRET_KEY);
            res.status(200).json({userId: id, token});
        } else {
            res.status(401).send('Incorrect username or password.');
        }
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    registerUser,
    loginUser
};