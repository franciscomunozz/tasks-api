require('dotenv').config();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

db.connect((err) => {
    if(err) {
        console.error('Error: ', err);
        return;
    }
    console.log('Connected to database');
})

module.exports = db;