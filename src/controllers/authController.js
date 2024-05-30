const pool = require('../database');
const jwt = require('jsonwebtoken')
//const bcrypt = require('bcryptjs')
SECRET_KEY = '1234';

const authUser = async (req, res) => {
    const userId = req.user.userId[0];
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (result.rowCount > 0) {
            res.status(201).send({success: true, message: "Authenticated successfully!"});
        } else {
            res.status(400).send({success: false, message: "Could not find user."});
        }
    } catch (err) {
        res.status(500).send({success: false, message: "Internal Server Error."});
    }
}

const registerUser = async (req, res) => {
    const {firstname, lastname, email, password} = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const searchForUserResult = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (searchForUserResult.rows.length > 0) {
            return res.status(400).send({success: false, message: "This username is already being used!"});
        }
        const queryText = 'INSERT INTO users (name, surname, email, password) VALUES ($1, $2, $3, $4) RETURNING *';
        const result = await client.query(queryText, [firstname, lastname, email, password]);

        const playlist_res = await client.query('SELECT create_playlist($1, $2);', ['my playlist', result.rows[0].id]);
        res.status(201).send({success: true, message: 'Account created successfully.'});
        await client.query('COMMIT');
    } catch (err) {
        res.status(500).send({success: false, message: 'Internal Server Error'});
        await client.query('ROLLBACK');
    } finally {
        client.release();
    }
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
        //console.log("It fucking works " + id);
        if (result.rows.length > 0) {
            const id = result.rows.map(row => row.id);
            
            const token = jwt.sign({userId: id}, SECRET_KEY, {expiresIn:'1h'});
            res.status(200).json({success: true, token});
        } else {
            res.status(401).send({success: false, message: 'Incorrect username or password.'});
        }
    } catch (err) {
        res.status(500).send({success: false, message: 'Internal Server Error'});
    }
}

module.exports = {
    authUser,
    registerUser,
    loginUser
};