const db = require('../config/database');

exports.getAllMedicines = (req, res) => {
  db.all('SELECT * FROM medicines ORDER BY createdAt DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const formatted = rows.map((r) => ({
      ...r,
      times: r.times ? JSON.parse(r.times) : [],
    }));
    res.json(formatted);
  });
};

exports.getMedicineById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM medicines WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Medicine not found' });
    res.json({
      ...row,
      times: row.times ? JSON.parse(row.times) : [],
    });
  });
};

exports.createMedicine = (req, res) => {
  const {
    id = `med-${Date.now()}`,
    name,
    dosage,
    type,
    instructions,
    frequency,
    times = [],
    startDate,
    endDate,
    category,
    imageUri,
    notes,
    createdAt = new Date().toISOString(),
  } = req.body;

  if (!name || !dosage) {
    return res.status(400).json({ error: 'Name and dosage are required' });
  }

  const timesString = JSON.stringify(times);

  const query = `
    INSERT INTO medicines (id, name, dosage, type, instructions, frequency, times, startDate, endDate, category, imageUri, notes, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [id, name, dosage, type, instructions, frequency, timesString, startDate, endDate, category, imageUri, notes, createdAt],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id, name, dosage, times, createdAt });
    }
  );
};

exports.deleteMedicine = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM medicines WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Medicine deleted successfully', id });
  });
};

exports.updateMedicine = (req, res) => {
  const { id } = req.params;
  const {
    name,
    dosage,
    type,
    instructions,
    frequency,
    times,
    startDate,
    endDate,
    category,
    imageUri,
    notes,
  } = req.body;

  const timesString = times !== undefined ? JSON.stringify(times) : null;

  const query = `
    UPDATE medicines
    SET name = COALESCE(?, name),
        dosage = COALESCE(?, dosage),
        type = COALESCE(?, type),
        instructions = COALESCE(?, instructions),
        frequency = COALESCE(?, frequency),
        times = COALESCE(?, times),
        startDate = COALESCE(?, startDate),
        endDate = COALESCE(?, endDate),
        category = COALESCE(?, category),
        imageUri = COALESCE(?, imageUri),
        notes = COALESCE(?, notes)
    WHERE id = ?
  `;

  db.run(
    query,
    [name, dosage, type, instructions, frequency, timesString, startDate, endDate, category, imageUri, notes, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Medicine not found' });
      res.json({ message: 'Medicine updated successfully', id });
    }
  );
};

exports.recordDoseLog = (req, res) => {
  const {
    id = `log-${Date.now()}`,
    medicineId,
    medicineName,
    scheduledTime,
    date,
    status,
    loggedAt = new Date().toISOString(),
  } = req.body;

  if (!medicineId || !status || !date) {
    return res.status(400).json({ error: 'medicineId, date, and status are required' });
  }

  const query = `
    INSERT OR REPLACE INTO dose_logs (id, medicineId, medicineName, scheduledTime, date, status, loggedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [id, medicineId, medicineName, scheduledTime, date, status, loggedAt],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id, medicineId, status, date });
    }
  );
};

exports.getDoseLogs = (req, res) => {
  db.all('SELECT * FROM dose_logs ORDER BY loggedAt DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};
