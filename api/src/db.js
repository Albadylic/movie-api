const Database = require("better-sqlite3");

const db = new Database("./dev.db");

// Enable foreign keys — SQLite disables them by default
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Create tables on initial startup if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'USER',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS movies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    director TEXT NOT NULL,
    year INTEGER NOT NULL,
    genre TEXT NOT NULL,
    synopsis TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    movie_id TEXT NOT NULL REFERENCES movies(id),
    user_id TEXT NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TEXT NOT NULL,
    UNIQUE(movie_id, user_id)
  );
`);

module.exports = db;
