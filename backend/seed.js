const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const tasks = [
    // Backend Team
    { title: 'API Authentication', description: 'Implement JWT based auth', status: 'In Progress', priority: 'High', team: 'Backend Team', due_date: '2026-03-01' },
    { title: 'Database Migration', description: 'Move to unified schema', status: 'To Do', priority: 'Medium', team: 'Backend Team', due_date: '2026-03-05' },
    { title: 'Cache Layer', description: 'Setup Redis caching', status: 'In Review', priority: 'Low', team: 'Backend Team', due_date: '2026-02-28' },
    { title: 'Logging System', description: 'Integrate Winston logger', status: 'Done', priority: 'Medium', team: 'Backend Team', due_date: '2026-02-20' },

    // Frontend Web Team
    { title: 'Dashboard UI', description: 'Build team overview cards', status: 'In Progress', priority: 'High', team: 'Frontend Web Team', due_date: '2026-02-25' },
    { title: 'Kanban Board', description: 'Integrate drag and drop', status: 'To Do', priority: 'High', team: 'Frontend Web Team', due_date: '2026-03-10' },
    { title: 'Theme Switching', description: 'Add dark mode support', status: 'Done', priority: 'Low', team: 'Frontend Web Team', due_date: '2026-02-22' },

    // Frontend App Team
    { title: 'Mobile Login', description: 'Responsive login screen', status: 'To Do', priority: 'Medium', team: 'Frontend App Team', due_date: '2026-03-15' },
    { title: 'Push Notifications', description: 'Setup Firebase messaging', status: 'In Review', priority: 'High', team: 'Frontend App Team', due_date: '2026-03-02' },
];

db.serialize(() => {
    db.run('DROP TABLE IF EXISTS tasks_v2');
    db.run(`
    CREATE TABLE IF NOT EXISTS tasks_v2 (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'To Do',
      priority TEXT DEFAULT 'Medium',
      team TEXT DEFAULT 'Backend Team',
      due_date TEXT,
      date TEXT,
      tag TEXT,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    const stmt = db.prepare('INSERT INTO tasks_v2 (title, description, status, priority, team, due_date) VALUES (?, ?, ?, ?, ?, ?)');
    tasks.forEach(t => {
        stmt.run(t.title, t.description, t.status, t.priority, t.team, t.due_date);
    });
    stmt.finalize();
    console.log('Database seeded with team tasks!');
});

db.close();
