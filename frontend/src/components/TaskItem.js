import React from 'react';
import { Edit3, Trash2, Calendar } from 'lucide-react';

const TaskItem = ({ task, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'priority-high',
      medium: 'priority-medium',
      low: 'priority-low'
    };
    return colors[priority] || 'priority-medium';
  };

  return (
    <div className="task-item">
      <div className="task-header">
        <div>
          <h3 className="task-title">{task.title}</h3>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
        </div>
        <div className="task-actions">
          <button 
            className="icon-btn" 
            onClick={() => onEdit(task)}
            aria-label="Edit task"
          >
            <Edit3 size={16} />
          </button>
          <button 
            className="icon-btn" 
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="task-meta">
        <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="due-date">
            <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskItem;