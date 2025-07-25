import { useState } from 'react'
import './App.css'

// Mock data for tasks
const initialTasks = [
  { 
    id: 1, 
    title: 'Review project proposal', 
    dueDate: new Date().toISOString().split('T')[0], // Today
    completed: false,
    priority: 'high'
  },
  { 
    id: 2, 
    title: 'Update documentation', 
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    completed: false,
    priority: 'medium'
  },
  { 
    id: 3, 
    title: 'Fix login bug', 
    dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
    completed: true,
    priority: 'high'
  },
  { 
    id: 4, 
    title: 'Prepare presentation', 
    dueDate: new Date().toISOString().split('T')[0], // Today
    completed: false,
    priority: 'low'
  },
  { 
    id: 5, 
    title: 'Code review', 
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    completed: true,
    priority: 'medium'
  }
]

function App() {
  const [tasks, setTasks] = useState(initialTasks)
  const [filter, setFilter] = useState('all')

  // BUG 1: Filter not working - the filter logic is broken
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'completed') return task.completed
    if (filter === 'pending') return !task.completed
    // BUG: This condition will never work because we're comparing wrong values
    if (filter === 'due-today') return task.dueDate === 'today' // Should compare with actual today's date
    return true
  })

  // BUG 2: Mark complete doesn't update UI - the function doesn't actually update state
  const markComplete = async (taskId) => {
    // Mock API call that "works" in backend
    console.log(`Marking task ${taskId} as complete...`)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // BUG: This line is commented out, so the UI never updates
    // setTasks(tasks.map(task => 
    //   task.id === taskId ? { ...task, completed: !task.completed } : task
    // ))
    
    console.log(`Task ${taskId} marked as complete in backend!`)
  }

  // BUG 3: Error on hover - accessing undefined property
  const handleTaskHover = (task) => {
    // BUG: Trying to access a property that doesn't exist
    console.log(`Hovering over task with category: ${task.category.name}`) // task.category is undefined
  }

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0]
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (dateString === getTodayString()) return 'Today'
    if (dateString === tomorrow.toISOString().split('T')[0]) return 'Tomorrow'
    return date.toLocaleDateString()
  }

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Task Dashboard</h1>
        <p>Manage your daily tasks efficiently</p>
      </header>

      <div className="dashboard-content">
        <div className="filters">
          <button 
            className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('all')}
          >
            All Tasks ({tasks.length})
          </button>
          <button 
            className={filter === 'pending' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('pending')}
          >
            Pending ({tasks.filter(t => !t.completed).length})
          </button>
          <button 
            className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('completed')}
          >
            Completed ({tasks.filter(t => t.completed).length})
          </button>
          <button 
            className={filter === 'due-today' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setFilter('due-today')}
          >
            Due Today ({tasks.filter(t => t.dueDate === getTodayString()).length})
          </button>
        </div>

        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="no-tasks">
              <p>No tasks found for the selected filter.</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div 
                key={task.id} 
                className={`task-item ${task.completed ? 'completed' : ''}`}
                onMouseEnter={() => handleTaskHover(task)} // BUG 3: This will cause an error
              >
                <div className="task-checkbox">
                  <input 
                    type="checkbox" 
                    checked={task.completed}
                    onChange={() => markComplete(task.id)} // BUG 2: Won't update UI
                  />
                </div>
                <div className="task-content">
                  <h3 className="task-title">{task.title}</h3>
                  <div className="task-meta">
                    <span className="task-due-date">
                      Due: {formatDate(task.dueDate)}
                    </span>
                    <span 
                      className="task-priority"
                      style={{ color: getPriorityColor(task.priority) }}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="task-actions">
                  <button 
                    className="complete-btn"
                    onClick={() => markComplete(task.id)}
                    disabled={task.completed}
                  >
                    {task.completed ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
