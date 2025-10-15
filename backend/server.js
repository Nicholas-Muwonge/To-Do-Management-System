const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let tasks = [
  {
    id: '1',
    title: 'Welcome to To-Do Manager',
    description: 'This is your first task. You can edit, delete, or drag it between columns.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2024-01-20',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Learn React Drag & Drop',
    description: 'Implement drag and drop functionality in the to-do app',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2024-01-18',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the to-do application',
    status: 'done',
    priority: 'low',
    dueDate: '2024-01-15',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const findTaskById = (id) => tasks.find(task => task.id === id);
const findTaskIndex = (id) => tasks.findIndex(task => task.id === id);


app.get('/api/tasks', (req, res) => {
  try {
    const { status, priority, search } = req.query;
    let filteredTasks = [...tasks];

    if (status && status !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }

    if (priority && priority !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      data: filteredTasks,
      total: filteredTasks.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks'
    });
  }
});

app.get('/api/tasks/:id', (req, res) => {
  try {
    const task = findTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task'
    });
  }
});

app.post('/api/tasks', (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Task title is required'
      });
    }

    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      description: description ? description.trim() : '',
      status: 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);

    res.status(201).json({
      success: true,
      data: newTask,
      message: 'Task created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create task'
    });
  }
});

app.put('/api/tasks/:id', (req, res) => {
  try {
    const taskIndex = findTaskIndex(req.params.id);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    const { title, description, priority, dueDate, status } = req.body;

    if (title && title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Task title cannot be empty'
      });
    }

    const updatedTask = {
      ...tasks[taskIndex],
      ...(title && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(priority && { priority }),
      ...(dueDate !== undefined && { dueDate }),
      ...(status && { status }),
      updatedAt: new Date().toISOString()
    };

    tasks[taskIndex] = updatedTask;

    res.json({
      success: true,
      data: updatedTask,
      message: 'Task updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update task'
    });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  try {
    const taskIndex = findTaskIndex(req.params.id);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    res.json({
      success: true,
      data: deletedTask,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete task'
    });
  }
});

app.patch('/api/tasks/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const taskIndex = findTaskIndex(req.params.id);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    if (!status || !['todo', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Valid status is required'
      });
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      status,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      data: tasks[taskIndex],
      message: 'Task status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update task status'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'To-Do API is running',
    timestamp: new Date().toISOString()
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 To-Do API: http://localhost:${PORT}/api`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
});