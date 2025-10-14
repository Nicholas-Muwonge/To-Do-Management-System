const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let tasks = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finish the project proposal document',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-01-15',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Team meeting',
    description: 'Weekly team sync meeting',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2024-01-10',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

app.get('/api/tasks', (req, res) => {
  const { status, priority, search } = req.query;
  let filteredTasks = [...tasks];

  if (status) {
    filteredTasks = filteredTasks.filter(task => task.status === status);
  }

  if (priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === priority);
  }

  if (search) {
    const searchLower = search.toLowerCase();
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower)
    );
  }

  res.json(filteredTasks);
});

app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

app.post('/api/tasks', (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: uuidv4(),
    title,
    description: description || '',
    status: 'todo',
    priority: priority || 'medium',
    dueDate: dueDate || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const updatedTask = {
    ...tasks[taskIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

app.delete('/api/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

app.patch('/api/tasks/:id/status', (req, res) => {
  const { status } = req.body;
  const taskIndex = tasks.findIndex(t => t.id === req.params.id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    status,
    updatedAt: new Date().toISOString()
  };

  res.json(tasks[taskIndex]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});