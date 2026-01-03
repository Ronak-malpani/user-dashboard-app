import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306, 
  ssl: {
    rejectUnauthorized: false        
  }
});

db.connect((err) => {
  if (err) {
    console.error("Database connection not established", err);
  } else {
    console.log("Database connection established successfully");
  }
});

export default db;
