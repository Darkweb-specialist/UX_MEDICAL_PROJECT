const db = require('../config/database');

exports.getAllDiaryEntries = (req, res) => {
  db.all('SELECT * FROM diary_entries ORDER BY date DESC, time DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.createDiaryEntry = (req, res) => {
  const {
    id = `diary-${Date.now()}`,
    date = new Date().toISOString().split('T')[0],
    time,
    symptoms,
    temperature,
    bloodPressure,
    pulse,
    notes,
    location,
    createdAt = new Date().toISOString(),
  } = req.body;

  const query = `
    INSERT INTO diary_entries (id, date, time, symptoms, temperature, bloodPressure, pulse, notes, location, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [id, date, time, symptoms, temperature, bloodPressure, pulse, notes, location, createdAt],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id, date, time, symptoms, notes });
    }
  );
};

exports.deleteDiaryEntry = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM diary_entries WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Diary entry deleted successfully', id });
  });
};
