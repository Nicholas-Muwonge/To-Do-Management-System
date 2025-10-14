import React from 'react';
import { Search, Filter } from 'lucide-react';

const FilterBar = ({ filters, onFilterChange }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      status: '',
      priority: '',
      search: ''
    });
  };

  const hasActiveFilters = filters.status || filters.priority || filters.search;

  return (
    <div className="filter-bar">
      <div className="search-input-container" style={{ position: 'relative', flex: 1 }}>
        <Search 
          size={20} 
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-secondary)'
          }} 
        />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="search-input"
          style={{ paddingLeft: '40px' }}
        />
      </div>

      <select
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value)}
        className="filter-select"
      >
        <option value="">All Status</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select
        value={filters.priority}
        onChange={(e) => handleFilterChange('priority', e.target.value)}
        className="filter-select"
      >
        <option value="">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {hasActiveFilters && (
        <button className="btn btn-secondary" onClick={clearFilters}>
          <Filter size={16} />
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;