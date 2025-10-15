import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { DragDropContext } from 'react-beautiful-dnd';

import TaskBoard from './components/TaskBoard';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import ThemeToggle from './components/ThemeToggle';

import './App.css';

const API_BASE = 'http://localhost:5001/api'; 

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  });
  const [theme, setTheme] = useState('light');

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.priority !== 'all') params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`${API_BASE}/tasks?${params}`);
      
      if (response.data.success) {
        setTasks(response.data.data);
      } else {
        setError('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Unable to load tasks. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  }, [filters.status, filters.priority, filters.search]);

  const filterTasks = useCallback(() => {
    let filtered = tasks;

    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [tasks, filters.status, filters.priority, filters.search]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (taskData) => {
    try {
      const response = await axios.post(`${API_BASE}/tasks`, taskData);
      
      if (response.data.success) {
        setTasks(prev => [...prev, response.data.data]);
        setShowForm(false);
        setError('');
      } else {
        setError(response.data.error || 'Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task');
    }
  };

  const updateTask = async (taskData) => {
    try {
      const response = await axios.put(`${API_BASE}/tasks/${taskData.id}`, taskData);
      
      if (response.data.success) {
        setTasks(prev => prev.map(task => 
          task.id === taskData.id ? response.data.data : task
        ));
        setEditingTask(null);
        setShowForm(false);
        setError('');
      } else {
        setError(response.data.error || 'Failed to update task');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE}/tasks/${taskId}`);
      
      if (response.data.success) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
        setError('');
      } else {
        setError(response.data.error || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    try {
      const response = await axios.patch(`${API_BASE}/tasks/${draggableId}/status`, { 
        status: newStatus 
      });
      
      if (response.data.success) {
        setTasks(prev => prev.map(task =>
          task.id === draggableId ? response.data.data : task
        ));
      } else {
        setError(response.data.error || 'Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      setError('Failed to update task status');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const clearError = () => {
    setError('');
  };

  const filteredTasks = filterTasks();

  return (
    <div className={`app ${theme}`}>
      <div className="container">
        <header className="header">
          <div className="header-content">
            <h1>My Task System</h1>
            <p> Boost your efficiency</p>
          </div>
          <div className="header-actions">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              + Add Task
            </button>
          </div>
        </header>

        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={clearError} className="btn-close">×</button>
          </div>
        )}

        <FilterBar 
          filters={filters} 
          onFilterChange={setFilters}
          onRefresh={fetchTasks}
          loading={loading}
        />

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <TaskBoard
              tasks={filteredTasks}
              onEdit={handleEdit}
              onDelete={deleteTask}
            />
          </DragDropContext>
        )}

        {(showForm || editingTask) && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? updateTask : createTask}
            onClose={handleFormClose}
          />
        )}
      </div>
    </div>
  );
}

export default App;