import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext } from 'react-beautiful-dnd';
import TaskBoard from './components/TaskBoard';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, filters]);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);

      const response = await axios.get(`${API_BASE}/tasks?${params}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredTasks(filtered);
  };

  const createTask = async (taskData) => {
    try {
      const response = await axios.post(`${API_BASE}/tasks`, taskData);
      setTasks(prev => [...prev, response.data]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async (taskData) => {
    try {
      const response = await axios.put(`${API_BASE}/tasks/${taskData.id}`, taskData);
      setTasks(prev => prev.map(task => task.id === taskData.id ? response.data : task));
      setEditingTask(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_BASE}/tasks/${taskId}`);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    try {
      await axios.patch(`${API_BASE}/tasks/${draggableId}/status`, { status: newStatus });
      setTasks(prev => prev.map(task =>
        task.id === draggableId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
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

  return (
    <div className={`app ${theme}`}>
      <div className="container">
        <header className="header">
          <h1>To-Do Manager</h1>
          <div className="header-actions">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add Task
            </button>
          </div>
        </header>

        <FilterBar filters={filters} onFilterChange={setFilters} />

        <DragDropContext onDragEnd={handleDragEnd}>
          <TaskBoard
            tasks={filteredTasks}
            onEdit={handleEdit}
            onDelete={deleteTask}
          />
        </DragDropContext>

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