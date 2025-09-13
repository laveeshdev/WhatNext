import React, { useState, useEffect, useCallback } from 'react';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';
import SortControls from '../components/SortControls';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [priorityFilter, setPriorityFilter] = useState('all'); // default to "all"
  const [completedFilter, setCompletedFilter] = useState('all'); // default to "all"
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
  
    try {
      // Only include filters if they are not 'all'
      const params = {
        page,
        limit,
        q: searchTerm,
        sort: sortOrder,
      };
  
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (completedFilter !== 'all') params.completed = completedFilter;
  
      const config = {
        withCredentials: true,
        params,
      };
  
      const response = await axios.get('http://localhost:5000/api/todos', config);
      setTasks(response.data.data);
      setTotalTasks(response.data.total);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      setLoading(false);
    }
  }, [page, limit, priorityFilter, completedFilter, searchTerm, sortOrder]);
  

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  

  const handlePageChange = (newPage) => setPage(newPage);

  const handleFilter = (filterType, value) => {
    setPage(1); // reset to first page
    if (filterType === 'priority') setPriorityFilter(value);
    if (filterType === 'completed') setCompletedFilter(value);
  };
  

  const handleSearch = (query) => {
    setPage(1);
    setSearchTerm(query);
  };

  const handleSort = (sortParam) => {
    setPage(1);
    setSortOrder(sortParam);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:5000/api/todos/${id}`, { withCredentials: true });
        fetchTasks();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const handleToggleComplete = async (id, currentCompletedStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/todos/${id}`, { completed: !currentCompletedStatus }, { withCredentials: true });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle task status');
    }
  };

  if (loading) return <div className="text-center dark:text-white">Loading tasks...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="container px-4 py-8 mx-auto dark:bg-gray-900 dark:text-gray-100">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Task List</h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate('/create')}
          className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Create New Task
        </button>
      </div>
      <div className="flex flex-col mb-4 w-full">
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-start mb-4 gap-4">
        <SortControls onSort={handleSort} />
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-start mb-4 gap-4">
        <FilterBar priorityFilter={priorityFilter} completedFilter={completedFilter} onFilter={handleFilter} />
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task._id} className={`p-4 rounded-lg shadow-md ${task.completed ? 'bg-green-100 dark:bg-green-800 dark:text-white' : 'bg-white dark:bg-gray-800'}`}>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{task.title}</h2>
            <p className="text-gray-700 dark:text-gray-300">{task.description}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Priority: {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => navigate(`/edit/${task._id}`)}
                className="px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleToggleComplete(task._id, task.completed)}
                className={`px-2 py-1 text-sm text-white rounded ${task.completed ? 'bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-700 dark:hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600'}`}
              >
                {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <Pagination currentPage={page} onPageChange={handlePageChange} totalPages={totalPages} />
    </div>
  );
};

export default TaskList;
