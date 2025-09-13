import React from 'react';
import TaskForm from '../components/TaskForm';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const TaskCreate = () => {
  const navigate = useNavigate();

  const handleCreateTask = async (task) => {
    try {
      const config = {
        withCredentials: true,
      };
  await axiosInstance.post('/todos', task, config);
      navigate('/tasks'); // Redirect to tasks page on successful creation
    } catch (err) {
      console.error('Failed to create task:', err.response?.data?.message || err.message);
      alert('Failed to create task: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto dark:bg-gray-900 dark:text-gray-100">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Create Task</h1>
      <TaskForm onSubmit={handleCreateTask} />
    </div>
  );
};

export default TaskCreate;
