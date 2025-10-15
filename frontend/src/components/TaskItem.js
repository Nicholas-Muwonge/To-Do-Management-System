import React from 'react';
import { Edit3, Trash2, Calendar, Clock } from 'lucide-react';

const TaskItem = ({ task, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if date is today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    // Check if date is tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    // Check if date is in the past
    if (date < today) {
      const daysAgo = Math.floor((today - date) / (1000 * 60 * 60 * 24));
      return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    }

    // Future date
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'priority-high',
      medium: 'priority-medium',
      low: 'priority-low'
    };
    return colors[priority] || 'priority-medium';
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="task-item">
      <div className="task-header">
        <div className="task-content">
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
            title="Edit task"
          >
            <Edit3 size={16} />
          </button>
          <button 
            className="icon-btn" 
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="task-meta">
        <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <span className={`due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
          {isOverdue(task.dueDate) ? <Clock size={14} /> : <Calendar size={14} />}
          {formatDate(task.dueDate)}
        </span>
      </div>

      <style jsx>{`
        .overdue {
          color: var(--error-color);
          font-weight: 600;
        }
        .text-muted {
          color: var(--text-secondary);
          font-size: 0.85rem;
        }
      `}</style>
    </div>
  );
};

export default TaskItem;