const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const tasks = [
    {
        title: 'Darlene Robertson',
        description: 'Lorem Ipsum is simply dummy text printing and typesetting industry. Lorem Ipsum has been...',
        status: 'To Do',
        date: '02/24 12:11 PM',
        tag: 'GitHub',
        image: null
    },
    {
        title: 'Savannah Nguyen',
        description: 'Project kickoff meeting and resource allocation for the next quarter.',
        status: 'To Do',
        date: '04/24 1:14 PM',
        tag: 'Gmail',
        image: null
    },
    {
        title: 'Leslie Alexander',
        description: 'Do the best password option when login & send email for doting this...',
        status: 'In Progress',
        date: '02/22 09:33 AM',
        tag: 'Slack',
        image: null
    },
    {
        title: 'Graphic Design Work',
        description: 'Create new brand assets and social media templates for the spring campaign.',
        status: 'In Progress',
        date: '02/22 09:33 AM',
        tag: 'Messenger',
        image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=400&auto=format&fit=crop'
    },
    {
        title: 'Brand Guideline Design',
        description: 'Review and finalize the typography and color palette for the new sub-brand.',
        status: 'In Review',
        date: '02/22 09:33 AM',
        tag: 'Gmail',
        image: null
    },
    {
        title: 'Competitor Analysis',
        description: 'Do the best password option when login & send email for doting this...',
        status: 'In Review',
        date: '02/22 09:33 AM',
        tag: 'GitHub',
        image: null
    },
    {
        title: 'Component Making Work',
        description: 'Build reusable UI components for the task manager dashboard.',
        status: 'Done',
        date: '12/22 6:16 PM',
        tag: 'Slack',
        image: 'https://images.unsplash.com/photo-1581291518062-c12f27a98fb6?q=80&w=400&auto=format&fit=crop'
    },
    {
        title: 'Brooklyn Simmons',
        description: 'Lorem Ipsum is simply dummy text printing and typesetting industry. Lorem Ipsum has been...',
        status: 'Done',
        date: '11/23 4:28 PM',
        tag: 'Slack',
        image: null
    },
];

db.serialize(() => {
    db.run('DROP TABLE IF EXISTS tasks_v2');
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

    db.run('DELETE FROM tasks_v2');
    const stmt = db.prepare('INSERT INTO tasks_v2 (title, description, status, date, tag, image) VALUES (?, ?, ?, ?, ?, ?)');
    tasks.forEach(t => {
        stmt.run(t.title, t.description, t.status, t.date, t.tag, t.image);
    });
    stmt.finalize();
    console.log('Database seeded with image tasks!');
});

db.close();
