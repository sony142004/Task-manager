import React, { useState, useEffect } from 'react';
import {
  Layout,
  LayoutGrid,
  List,
  Columns,
  Plus,
  Search,
  Bell,
  Settings,
  Moon,
  Sun,
  Home,
  ClipboardList,
  MessageSquare,
  Slack,
  Github,
  Mail,
  Gamepad2,
  ChevronRight,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = '/api';

const Sidebar = ({ theme, setTheme }) => {
  const menuItems = [
    { icon: Home, label: 'Dashboard', active: false },
    { icon: ClipboardList, label: 'Tasks', active: true },
  ];

  const messages = [
    { icon: MessageSquare, label: 'Microsoft Team' },
    { icon: Slack, label: 'Slack' },
    { icon: Github, label: 'GitHub', count: 2 },
    { icon: MessageSquare, label: 'Messenger' },
    { icon: Mail, label: 'Gmail' },
    { icon: Gamepad2, label: 'Discord' },
  ];

  return (
    <div className="sidebar">
      <div className="logo-container">
        <Layout size={28} strokeWidth={2.5} />
        <span>ProTasks</span>
      </div>

      <div className="sidebar-nav">
        <div className="nav-section">
          <p className="nav-label">Menu</p>
          {menuItems.map((item) => (
            <div key={item.label} className={`nav-item ${item.active ? 'active' : ''}`}>
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="nav-section">
          <p className="nav-label">Messages</p>
          {messages.map((item) => (
            <div key={item.label} className="nav-item">
              <item.icon size={20} />
              <span>{item.label}</span>
              {item.count && (
                <span style={{
                  marginLeft: 'auto',
                  background: '#f43f5e',
                  color: 'white',
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '10px'
                }}>
                  {item.count}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </div>
        <div className="nav-item" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
            <span>Dark Mode</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

const Header = ({ onOpenModal }) => (
  <header className="header">
    <div className="header-left">
      <h1>Tasks</h1>
    </div>
    <div className="header-right">
      <button className="btn-create" onClick={onOpenModal}>
        <Plus size={20} />
        <span>Create Task</span>
      </button>
      <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)' }}>
        <MessageSquare size={20} />
        <Bell size={20} />
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px' }}>O</div>
      </div>
    </div>
  </header>
);

const TaskCard = ({ task, onDelete, onUpdateStatus }) => {
  const getIntegrationIcon = (tag) => {
    switch (tag?.toLowerCase()) {
      case 'github': return <Github size={14} color="#24292f" />;
      case 'slack': return <Slack size={14} color="#4A154B" />;
      case 'gmail': return <Mail size={14} color="#EA4335" />;
      case 'messenger': return <MessageSquare size={14} color="#0084FF" />;
      case 'discord': return <Gamepad2 size={14} color="#5865F2" />;
      case 'microsoft team': return <MessageSquare size={14} color="#6264A7" />;
      default: return <Github size={14} />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="task-card"
    >
      <div className="task-card-header">
        <div className="user-info">
          <img src={`https://i.pravatar.cc/150?u=${task.id}`} alt="avatar" className="avatar" />
          <div className="user-details">
            <span className="user-name">Team Member</span>
            <span className="task-date">{task.date || '02/24 12:11 PM'}</span>
          </div>
        </div>
        <button onClick={() => onDelete(task.id)} style={{ color: 'var(--text-subtle)' }}>
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="task-title">{task.title}</div>
      {task.image && (
        <div style={{ margin: '4px 0', borderRadius: '8px', overflow: 'hidden' }}>
          <img src={task.image} alt="task" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
        </div>
      )}
      {task.description && <div className="task-description">{task.description}</div>}

      <div className="task-footer">
        <div className="integration-badge">
          {getIntegrationIcon(task.tag)}
          <span>{task.tag || 'GitHub'}</span>
        </div>
        <div className="team-avatars">
          <img src="https://i.pravatar.cc/150?u=1" className="team-avatar" alt="team" />
          <img src="https://i.pravatar.cc/150?u=2" className="team-avatar" alt="team" />
          <div className="more-avatars">5+</div>
        </div>
      </div>
    </motion.div>
  );
};

const KanbanColumn = ({ title, tasks, status, onDelete, onUpdateStatus }) => {
  const getStatusColor = (s) => {
    switch (s) {
      case 'To Do': return '#64748b';
      case 'In Progress': return '#3b82f6';
      case 'In Review': return '#d946ef';
      case 'Done': return '#10b981';
      default: return '#64748b';
    }
  };

  return (
    <div className="kanban-column">
      <div className="column-header">
        <div className="column-title">
          <span style={{ color: getStatusColor(status) }}>{title}</span>
          <span className="task-count">({String(tasks.length).padStart(2, '0')})</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', color: 'var(--text-subtle)' }}>
          <Plus size={16} style={{ cursor: 'pointer' }} />
          <MoreHorizontal size={16} style={{ cursor: 'pointer' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '100px' }}>
        <AnimatePresence>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const CreateTaskModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [tag, setTag] = useState('GitHub');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ title, description, status, tag, date: new Date().toLocaleString() });
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
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Create New Task</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label>Title</label>
            <input
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add some details..."
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
              <label>Integration</label>
              <select value={tag} onChange={e => setTag(e.target.value)}>
                <option>GitHub</option>
                <option>Slack</option>
                <option>Gmail</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-create">Create Task</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [theme, setTheme] = useState('light');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState('kanban');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (newTask) => {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error('Create error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const task = tasks.find(t => t.id === id);
      await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, status })
      });
      fetchTasks();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const columns = [
    { title: 'To Do', status: 'To Do' },
    { title: 'In Progress', status: 'In Progress' },
    { title: 'In Review', status: 'In Review' },
    { title: 'Done', status: 'Done' },
  ];

  return (
    <div className="app-layout">
      <Sidebar theme={theme} setTheme={setTheme} />

      <main className="main-container">
        <Header onOpenModal={() => setIsModalOpen(true)} />

        <div className="scroll-area">
          <div className="view-header">
            <div className="view-switcher">
              <button className={`view-btn ${view === 'table' ? 'active' : ''}`} onClick={() => setView('table')}>
                <LayoutGrid size={16} /> Table
              </button>
              <button className={`view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
                <List size={16} /> List View
              </button>
              <button className={`view-btn ${view === 'kanban' ? 'active' : ''}`} onClick={() => setView('kanban')}>
                <Columns size={16} /> Kanban
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/150?u=${i + 10}`} className="team-avatar" style={{ width: 28, height: 28 }} alt="team" />
                ))}
                <div className="more-avatars" style={{ width: 28, height: 28 }}>42+</div>
              </div>
              <button style={{ width: 28, height: 28, borderRadius: '50%', border: '1px dashed var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div style={{ marginTop: '32px', height: '100%' }}>
            {view === 'kanban' ? (
              <div className="kanban-board">
                {columns.map(col => (
                  <KanbanColumn
                    key={col.status}
                    title={col.title}
                    status={col.status}
                    tasks={tasks.filter(t => t.status === col.status)}
                    onDelete={handleDelete}
                    onUpdateStatus={updateStatus}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>
                <LayoutGrid size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
                <h3>{view.charAt(0).toUpperCase() + view.slice(1)} view coming soon</h3>
                <p>Switch back to Kanban to manage your tasks.</p>
              </div>
            )}
          </div>
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
