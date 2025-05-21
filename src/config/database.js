import { createClient } from "@libsql/client";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const database = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to Mongo database successfully");
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error}`);
    process.exit(1);
  }
}

// Initialize the table (users, notes)
async function pingTurso() {
  try {
    await database.execute("SELECT 1");
    console.log("✅ Checked successful communiation with Turso database");
  } catch (error) {
    console.error("❌ Failed to connect to Turso :", error);
  }

  await database.execute(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      tags TEXT, --JSON-encoded array of strings
      is_pinned INTEGER DEFAULT 0, -- 0 = false, 1 = true
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER
    );
  `);
  await database.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    );
  `);
}

export { database, connectMongoDB, pingTurso };
