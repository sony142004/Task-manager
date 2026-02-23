import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks')
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      })
      if (res.ok) {
        const newTask = await res.json()
        setTasks([newTask, ...tasks])
        setTitle('')
        setDescription('')
      }
    } catch (err) {
      console.error('Failed to create task:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleComplete = async (task) => {
    const updatedStatus = !task.completed
    // Optimistic update
    setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: updatedStatus } : t))

    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, completed: updatedStatus })
      })
    } catch (err) {
      console.error('Failed to update task:', err)
      // Revert on error
      fetchTasks()
    }
  }

  const handleDelete = async (id) => {
    // Optimistic update
    setTasks(tasks.filter(t => t.id !== id))

    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
      })
    } catch (err) {
      console.error('Failed to delete task:', err)
      fetchTasks()
    }
  }

  return (
    <div className="app-container">
      <header>
        <h1>TaskHub <span>Elevate Your Productivity</span></h1>
      </header>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
            autoFocus
          />
        </div>
        <div className="input-group">
          <textarea
            placeholder="Add some details... (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={submitting || !title.trim()}>
          {submitting ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <h3>All caught up! 🎉</h3>
              <p>You have no pending tasks. Enjoy your day!</p>
            </div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <div className="task-content">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={!!task.completed}
                    onChange={() => toggleComplete(task)}
                  />
                  <div className="task-details">
                    <div className="task-title">{task.title}</div>
                    {task.description && <div className="task-desc">{task.description}</div>}
                  </div>
                </div>
                <div className="task-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleDelete(task.id)}
                    title="Delete task"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default App
