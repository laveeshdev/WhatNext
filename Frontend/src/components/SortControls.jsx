import React from 'react';

const SortControls = ({ onSort }) => {
  return (
    <div className="flex flex-wrap justify-center space-x-2 space-y-2 sm:space-y-0">
      <button onClick={() => onSort('title:asc')} className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600">Title (A-Z)</button>
      <button onClick={() => onSort('title:desc')} className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600">Title (Z-A)</button>
      <button onClick={() => onSort('dueDate:asc')} className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600">Due Date (Asc)</button>
      <button onClick={() => onSort('dueDate:desc')} className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600">Due Date (Desc)</button>
    </div>
  );
};

export default SortControls;