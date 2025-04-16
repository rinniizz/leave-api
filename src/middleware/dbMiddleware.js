const mysql = require('mysql2');
const dbConfig = require('../config/dbConfig');

function handleDatabaseConnection(req, res, next) {
    req.db = mysql.createConnection(dbConfig);
    req.db.connect((err) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send({ error: { fatal: true } });
        }
        next();
    });

    req.db.on('error', (err) => {
        console.error('Database error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code === 'ECONNRESET') {
            console.error('Database connection was reset.');
        }
    });

    res.on('finish', () => {
        req.db.end((err) => {
            if (err) {
                console.error('Error closing database connection:', err);
            }
        });
    });
}

module.exports = handleDatabaseConnection;