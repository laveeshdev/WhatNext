import React, { useState } from 'react';

const TaskForm = ({ onSubmit, task = {} }) => {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState(task.priority || 'low');
  const [completed, setCompleted] = useState(task.completed || false);
  const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      alert('Title is required.');
      return;
    }
    if (!dueDate) {
      alert('Due Date is required.');
      return;
    }

    // New validation for past due date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    const selectedDate = new Date(dueDate);
    selectedDate.setHours(0, 0, 0, 0); // Set to start of selected date

    if (selectedDate < today) {
      alert('Due Date cannot be in the past.');
      return;
    }

    const utcDueDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString();

    onSubmit({ title, description, priority, completed, dueDate: utcDueDate });
    setTitle('');
    setDescription('');
    setPriority('low');
    setCompleted(false);
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div>
        <label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Title
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Description
        </label>
        <textarea
          id="description"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
        ></textarea>
      </div>
      <div>
        <label htmlFor="priority" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="flex items-center">
        <input
          id="completed"
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <label htmlFor="completed" className="block ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Completed
        </label>
      </div>
      <div>
        <label htmlFor="dueDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Due Date
        </label>
        <input
          id="dueDate"
          type="date"
          required
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600"
      >
        {task._id ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
};

export default TaskForm;