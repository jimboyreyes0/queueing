const mysql = require('mysql')
const dotenv = require('dotenv')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)

dotenv.config()

const options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
}

const conn = mysql.createConnection(options)
const sessionStore = new MySQLStore({}, conn)

conn.connect((error) => {
    if(error) {throw error}
    console.log(`Connected to db`)
})

module.exports = {conn, sessionStore}