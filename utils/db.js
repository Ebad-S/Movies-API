// db.js
const knex = require('knex');
const knexfile = require('../knexfile');

let db = null;

try {
    db = knex(knexfile.development);
    
    // Test the connection
    db.raw('SELECT 1')
        .then(() => {
            console.log('Database connected successfully');
        })
        .catch((err) => {
            console.error('Database connection failed:', err);
            console.error('Connection details:', {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                database: process.env.DB_NAME,
                // Don't log password
            });
            process.exit(1);
        });
} catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
}

// Add event listeners for connection issues
db.on('error', (err) => {
    console.error('Unexpected database error:', err);
});

process.on('SIGINT', () => {
    db.destroy(() => {
        console.log('Database connection closed');
        process.exit(0);
    });
});

module.exports = db;