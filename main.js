import express from "express";
import mysql from "mysql";
import "dotenv/config";

const PORT = process.env.PORT || 3000;
const dbhost = process.env.DB_HOST
const dbUsername = process.env.DB_USER_NAME
const dbPassword = process.env.DB_PASSWORD
const dbName = process.env.DB_NAME

const connection = mysql.createConnection({
    host:dbhost,
    user:dbUsername,
    password:dbPassword,
    database:dbName,
});

connection.connect((err) => {
    if (err){
        console.error ("cannot connection",err);
        return;
    }
    console.log(`connected to MySQL`)
});

connection.query("SELECT 1+1 AS solution", (error, results, fields) => {
    console.log(results[0])
});

connection.query("INSERT INTO user VALUES(1,'anwar','123456','anwar@gmail.com', '056666699', 'Admin')", (error, results)=>{
    if(error){
        console.error(error);
        return
    }
    console.log(results);
})

connection.end();