import React, { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

const TaskEdit = () => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Get task ID from URL

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const config = {
          withCredentials: true,
        };
  const response = await axiosInstance.get(`/todos/${id}`, config);
  setTask(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch task');
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleUpdateTask = async (updatedTask) => {
    try {
      const config = {
        withCredentials: true,
      };
  await axiosInstance.put(`/todos/${id}`, updatedTask, config);
      navigate('/tasks'); // Redirect to tasks page on successful update
    } catch (err) {
      console.error('Failed to update task:', err.response?.data?.message || err.message);
      alert('Failed to update task: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <div className="text-center dark:text-white">Loading task...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;
  if (!task) return <div className="text-center dark:text-white">Task not found.</div>;

  return (
    <div className="container px-4 py-8 mx-auto dark:bg-gray-900 dark:text-gray-100">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Edit Task</h1>
      <TaskForm onSubmit={handleUpdateTask} task={task} />
    </div>
  );
};

export default TaskEdit;
