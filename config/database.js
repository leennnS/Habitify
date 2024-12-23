const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config();

let pool;
/**
 * Initializes the database connection pool.
 * If the pool is not already initialized, it creates a new connection pool using the configuration from the environment variables.
 * It attempts to connect to the MySQL database and logs the result.
 * 
 * @async
 * @function initDB
 * @returns {Promise<mysql.Pool>} - Returns the MySQL connection pool instance.
 * @throws {Error} - Throws an error and exits the process if unable to connect to the database.
 */
const initDB = async () => {
    if (!pool) {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3307,
            waitForConnection: true,
            connectionLimit: 10,
            queueLimit: 0,

        });

        try {
            await pool.getConnection();
            console.log('Connected to Mysql database');

        } catch (error) {
            console.error('Unable to connect to Mysql', error);
            process.exit(1);
        }
    }
    return pool;
};

module.exports = { initDB };

