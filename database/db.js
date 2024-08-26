const mysql= require('mysql2');

const db = mysql.createPool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PSWRD,
    database: process.env.DB_DATABASE,
    charset : 'utf8mb4'
  });


module.exports = db