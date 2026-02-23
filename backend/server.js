const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks_v2 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'To Do',
        date TEXT,
        tag TEXT,
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
});

// GET all tasks
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks_v2 ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST a new task
app.post('/api/tasks', (req, res) => {
  const { title, description, status = 'To Do', date, tag, image } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const sql = 'INSERT INTO tasks_v2 (title, description, status, date, tag, image) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(sql, [title, description, status, date, tag, image], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    db.get('SELECT * FROM tasks_v2 WHERE id = ?', [this.lastID], (err, row) => {
      res.status(201).json(row);
    });
  });
});

// PUT (update) a task
app.put('/api/tasks/:id', (req, res) => {
  const { title, description, status, date, tag, image } = req.body;
  const taskId = req.params.id;

  const sql = 'UPDATE tasks_v2 SET title = ?, description = ?, status = ?, date = ?, tag = ?, image = ? WHERE id = ?';
  db.run(sql, [title, description, status, date, tag, image, taskId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    db.get('SELECT * FROM tasks_v2 WHERE id = ?', [taskId], (err, row) => {
      res.json(row);
    });
  });
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  db.run('DELETE FROM tasks_v2 WHERE id = ?', [taskId], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
