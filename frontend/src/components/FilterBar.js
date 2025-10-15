import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';

const FilterBar = ({ filters, onFilterChange, onRefresh, loading }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      status: 'all',
      priority: 'all',
      search: ''
    });
  };

  const hasActiveFilters = filters.status !== 'all' || filters.priority !== 'all' || filters.search;

  return (
    <div className="filter-bar">
        <Search 
          size={20} 

        />
        <input
          type="text"
          placeholder="Search tasks by title or description..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="search-input"
        />

      <select
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value)}
        className="filter-select"
      >
        <option value="all">All Status</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <select
        value={filters.priority}
        onChange={(e) => handleFilterChange('priority', e.target.value)}
        className="filter-select"
      >
        <option value="all">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <button 
        className="btn btn-secondary" 
        onClick={onRefresh}
        disabled={loading}
        title="Refresh tasks"
      >
        <RefreshCw size={16} className={loading ? 'spinning' : ''} />
        Refresh
      </button>

      {hasActiveFilters && (
        <button 
          className="btn btn-secondary" 
          onClick={clearFilters}
          title="Clear all filters"
        >
          <Filter size={16} />
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;