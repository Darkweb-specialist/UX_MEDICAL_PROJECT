const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../medicare.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log(`Connected to SQLite database at: ${dbPath}`);
  }
});

// Initialize Schema Tables
db.serialize(() => {
  // Medicines Table
  db.run(`
    CREATE TABLE IF NOT EXISTS medicines (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      dosage TEXT NOT NULL,
      type TEXT,
      instructions TEXT,
      frequency TEXT,
      times TEXT,
      startDate TEXT,
      endDate TEXT,
      category TEXT,
      imageUri TEXT,
      notes TEXT,
      createdAt TEXT
    )
  `);

  // Dose Logs Table
  db.run(`
    CREATE TABLE IF NOT EXISTS dose_logs (
      id TEXT PRIMARY KEY,
      medicineId TEXT NOT NULL,
      medicineName TEXT NOT NULL,
      scheduledTime TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL,
      loggedAt TEXT NOT NULL
    )
  `);

  // Diary Entries Table
  db.run(`
    CREATE TABLE IF NOT EXISTS diary_entries (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      time TEXT,
      symptoms TEXT,
      temperature TEXT,
      bloodPressure TEXT,
      pulse TEXT,
      notes TEXT,
      location TEXT,
      createdAt TEXT
    )
  `);
});

module.exports = db;
