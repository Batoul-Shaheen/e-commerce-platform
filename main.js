import mysql from "mysql";
import "dotenv/config";

const dbhost = process.env.RDS_DB_HOST
const dbUsername = process.env.RDS_DB_USER_NAME
const dbPassword = process.env.RDS_DB_PASSWORD
const dbName = process.env.RDS_DB_NAME

const connection = mysql.createConnection({
    host: dbhost,
    user: dbUsername,
    password: dbPassword,
    database: dbName,
});

connection.connect((err) => {
    if (err) {
        console.error("cannot connection", err);
        return;
    }
    console.log(`connected to MySQL`)
});

connection.query("SELECT 1+1 AS solution", (error, results, fields) => {
    console.log(results[0])
});

connection.query("INSERT INTO user VALUES(2,'anwar','123456','anwar@gmail.com', '056666699', 'Admin')", (error, results) => {
    if (error) {
        console.error(error);
        return
    }
    console.log(results);
})

connection.end();