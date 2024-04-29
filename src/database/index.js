const { Pool } = require('pg');

// Create a new Pool instance for managing database connections
const pool = new Pool({
    user: 'admin',
    host: 'music-postgres',
    database: 'music_db',
    password: 'admin',
    port: 5432,
});

// Export the pool instance to be used throughout the application
module.exports = pool;
