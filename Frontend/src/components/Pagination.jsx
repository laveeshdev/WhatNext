import React from 'react';

const Pagination = ({ currentPage, onPageChange, totalPages }) => {

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center mt-4 space-x-2">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 text-sm rounded ${currentPage === page ? 'bg-indigo-600 text-white dark:bg-indigo-700' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-200'}`}>
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;