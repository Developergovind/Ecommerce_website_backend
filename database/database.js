const mysql = require('mysql')
const con = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "fashion_web"
})

module.exports = con;