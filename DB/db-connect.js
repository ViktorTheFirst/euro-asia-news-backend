const mysql = require('mysql2/promise');
//import { createPool } from 'mysql2/promise';

const pool = mysql.createPool({
  user: process.env.SQL_DB_USER,
  password: process.env.SQL_DB_PASSWORD,
  host: process.env.SQL_DB_HOST,
  port: process.env.SQL_DB_PORT,
  database: process.env.SQL_DB_NAME,
});

module.exports = pool;
