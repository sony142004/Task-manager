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
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
});

// GET all tasks
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// POST a new task
app.post('/api/tasks', (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const sql = 'INSERT INTO tasks (title, description, completed) VALUES (?, ?, 0)';
  db.run(sql, [title, description], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Return the newly created task
    db.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => {
      res.status(201).json(row);
    });
  });
});

// PUT (update) a task
app.put('/api/tasks/:id', (req, res) => {
  const { title, description, completed } = req.body;
  const taskId = req.params.id;
  
  const sql = 'UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?';
  db.run(sql, [title, description, completed ? 1 : 0, taskId], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, row) => {
      res.json(row);
    });
  });
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  db.run('DELETE FROM tasks WHERE id = ?', [taskId], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
