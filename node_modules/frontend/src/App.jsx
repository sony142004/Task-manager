import React, { useState, useEffect, useMemo } from 'react';
import {
  Layout, LayoutGrid, List, Columns, Plus, Search, Bell, Settings,
  Moon, Sun, Home, ClipboardList, ChevronRight, MoreHorizontal,
  Calendar, Flag, Users, ArrowLeft, Filter, RefreshCw, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = '/api';

const Sidebar = ({ currentView, setView, theme, setTheme }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'tasks', icon: ClipboardList, label: 'Tasks' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="sidebar">
      <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)', fontWeight: 800, fontSize: '1.25rem' }}>
        <Layout size={28} />
        <span>ProTasks</span>
      </div>
      <div style={{ marginTop: '20px' }}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => setView(item.id)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: '24px', width: '260px', padding: '0 24px' }}>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </div>
    </div>
  );
};

const CreateTaskModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [team, setTeam] = useState('Backend Team');
  const [priority, setPriority] = useState('Medium');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      title,
      description,
      status,
      team,
      priority,
      due_date: new Date().toISOString().split('T')[0]
    });
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="modal-content"
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Create New Task</h2>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label>Title</label>
            <input
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter task title..."
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter description..."
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option>To Do</option>
                <option>In Progress</option>
                <option>In Review</option>
                <option>Done</option>
              </select>
            </div>
            <div className="form-group">
              <label>Team</label>
              <select value={team} onChange={e => setTeam(e.target.value)}>
                <option>Backend Team</option>
                <option>Frontend Web Team</option>
                <option>Frontend App Team</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select value={priority} onChange={e => setPriority(e.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Create Task</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const TeamCard = ({ team, tasks, onClick }) => {
  const teamTasks = tasks.filter(t => t.team === team);
  const doneCount = teamTasks.filter(t => t.status === 'Done').length;
  const progress = teamTasks.length ? Math.round((doneCount / teamTasks.length) * 100) : 0;

  const stats = [
    { label: 'To Do', count: teamTasks.filter(t => t.status === 'To Do').length, color: '#64748b' },
    { label: 'In Progress', count: teamTasks.filter(t => t.status === 'In Progress').length, color: '#3b82f6' },
    { label: 'In Review', count: teamTasks.filter(t => t.status === 'In Review').length, color: '#d946ef' },
    { label: 'Done', count: doneCount, color: '#10b981' },
  ];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="team-card"
      onClick={() => onClick(team)}
    >
      <div className="team-card-header">
        <h3 className="team-name">{team}</h3>
        <ChevronRight size={18} color="var(--text-muted)" />
      </div>

      <div className="avatar-group">
        {[1, 2, 3, 4].map(i => (
          <img key={i} src={`https://i.pravatar.cc/150?u=${team + i}`} className="avatar-sm" alt="m" />
        ))}
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#f1f5f9', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '-8px', border: '2px solid white', fontWeight: 600 }}>+2</div>
      </div>

      <div className="stat-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-item">
            <div className="stat-dot" style={{ background: s.color }}></div>
            <span>{s.label}: {s.count}</span>
          </div>
        ))}
      </div>

      <div className="progress-container">
        <div className="progress-label">
          <span>Completion</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-bar-bg">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="progress-bar-fill"
          />
        </div>
      </div>
    </motion.div>
  );
};

const TaskCard = ({ task, onDelete }) => {
  const priorityClass = `priority-${task.priority?.toLowerCase() || 'medium'}`;
  const statusColors = { 'To Do': '#64748b', 'In Progress': '#3b82f6', 'In Review': '#d946ef', 'Done': '#10b981' };

  return (
    <motion.div layout className="task-card">
      <div className="status-strip" style={{ background: statusColors[task.status] || '#cbd5e1' }}></div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className={`priority-badge ${priorityClass}`}>{task.priority}</span>
        <button onClick={() => onDelete(task.id)} style={{ color: 'var(--text-muted)' }}><MoreHorizontal size={16} /></button>
      </div>
      <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>{task.title}</h4>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          <Calendar size={14} />
          <span>{task.due_date || 'No date'}</span>
        </div>
        <img src={`https://i.pravatar.cc/150?u=${task.id}`} className="avatar-sm" style={{ border: 'none', marginLeft: 0 }} alt="u" />
      </div>
    </motion.div>
  );
};

function App() {
  const [view, setView] = useState('dashboard');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [theme, setTheme] = useState('light');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      if (res.ok) setTasks(await res.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleCreate = async (newTask) => {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      if (res.ok) fetchTasks();
    } catch (err) { console.error(err); }
  };

  const handleTeamClick = (teamName) => {
    setSelectedTeam(teamName);
    setView('team-tasks');
  };

  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (selectedTeam && view === 'team-tasks') {
      result = result.filter(t => t.team === selectedTeam);
    }
    if (search) {
      result = result.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
    }
    return result;
  }, [tasks, selectedTeam, search, view]);

  const teams = ['Backend Team', 'Frontend Web Team', 'Frontend App Team'];

  return (
    <div className="app-layout">
      <Sidebar currentView={view} setView={setView} theme={theme} setTheme={setTheme} />

      <main className="main-container">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {view === 'team-tasks' && (
              <button onClick={() => setView('dashboard')} style={{ padding: '8px', borderRadius: '50%', background: 'var(--bg-app)' }}>
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              {view === 'dashboard' ? 'Team Overview' : selectedTeam}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tasks..."
                style={{ padding: '10px 16px 10px 40px', borderRadius: '10px', border: '1px solid var(--border-light)', width: '300px', background: 'var(--bg-app)' }}
              />
            </div>
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} />
              <span>Create Task</span>
            </button>
          </div>
        </header>

        <div className="scroll-area">
          <AnimatePresence mode="wait">
            {view === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="team-grid"
              >
                {teams.map(team => (
                  <TeamCard key={team} team={team} tasks={tasks} onClick={handleTeamClick} />
                ))}
              </motion.div>
            )}

            {view === 'team-tasks' && (
              <motion.div
                key="team-tasks"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
                      <Filter size={16} /> Filter
                    </div>
                    <select
                      value={selectedTeam}
                      onChange={e => setSelectedTeam(e.target.value)}
                      style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}
                    >
                      {teams.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', background: 'var(--border-light)', padding: '4px', borderRadius: '8px', gap: '4px' }}>
                    <button style={{ background: 'white', padding: '6px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>Kanban</button>
                    <button style={{ padding: '6px 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>List</button>
                  </div>
                </div>

                <div className="kanban-board">
                  {['To Do', 'In Progress', 'In Review', 'Done'].map(status => (
                    <div key={status} className="kanban-column">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>{status.toUpperCase()}</h3>
                        <span style={{ fontSize: '0.8rem', background: 'var(--border-light)', padding: '2px 8px', borderRadius: '10px' }}>
                          {filteredTasks.filter(t => t.status === status).length}
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '200px' }}>
                        {filteredTasks.filter(t => t.status === status).map(task => (
                          <TaskCard key={task.id} task={task} onDelete={async (id) => {
                            await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
                            fetchTasks();
                          }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreate}
        />
      </main>
    </div>
  );
}

export default App;