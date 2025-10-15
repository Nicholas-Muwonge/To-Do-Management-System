import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import TaskItem from './TaskItem';
import { ClipboardList, PlayCircle, CheckCircle } from 'lucide-react';

const TaskBoard = ({ tasks, onEdit, onDelete }) => {
  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      icon: <ClipboardList size={20} />,
      color: '#3b82f6'
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      icon: <PlayCircle size={20} />,
      color: '#f59e0b'
    },
    {
      id: 'done',
      title: 'Done',
      icon: <CheckCircle size={20} />,
      color: '#10b981'
    }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="board">
      {columns.map(column => (
        <div key={column.id} className="column">
          <div className="column-header">
            <div className="column-title" style={{ color: column.color }}>
              {column.icon}
              {column.title}
            </div>
            <div className="task-count">
              {getTasksByStatus(column.id).length}
            </div>
          </div>

          <Droppable droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                style={{
                  background: snapshot.isDraggingOver ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  borderRadius: '8px',
                  minHeight: '200px'
                }}
              >
                {getTasksByStatus(column.id).map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`task-item ${snapshot.isDragging ? 'dragging' : ''}`}
                      >
                        <TaskItem
                          task={task}
                          onEdit={onEdit}
                          onDelete={onDelete}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                
                {getTasksByStatus(column.id).length === 0 && (
                  <div className="empty-state">
                    <ClipboardList size={48} />
                    <p>No tasks in {column.title.toLowerCase()}</p>
                    <p className="text-muted">Drag tasks here or create new ones</p>
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;