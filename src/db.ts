// src/db.ts
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      // XAMPP default
  password: '',      // XAMPP default is empty
  database: 'todo_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});