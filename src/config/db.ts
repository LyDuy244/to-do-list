import mysql from "mysql2/promise"
import dotenv from 'dotenv';
dotenv.config();

let connection: mysql.Connection;
export const createConnection = async () => {
    if(!connection) {
        connection = await mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: "project_demo",
        })
    }
    return connection;
}