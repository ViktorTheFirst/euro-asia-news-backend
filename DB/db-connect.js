import mysql from 'mysql2';

const pool = mysql
  .createPool({
    user: process.env.SQL_DB_USER,
    password: process.env.SQL_DB_PASSWORD,
    host: process.env.SQL_DB_HOST,
    port: process.env.SQL_DB_PORT,
    database: process.env.SQL_DB_NAME,
  })
  .promise();

export default pool;
