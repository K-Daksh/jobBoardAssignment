import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  // Always show 5 pages if possible
  if (endPage - startPage < 4) {
    if (startPage === 1) {
      endPage = Math.min(5, totalPages);
    } else {
      startPage = Math.max(1, totalPages - 4);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg ${
          currentPage === 1
            ? "bg-slate-700 text-gray-400 cursor-not-allowed"
            : "bg-slate-700 text-white hover:bg-slate-600"
        }`}
      >
        First
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-lg ${
          currentPage === 1
            ? "bg-slate-700 text-gray-400 cursor-not-allowed"
            : "bg-slate-700 text-white hover:bg-slate-600"
        }`}
      >
        Previous
      </button>

      <div className="flex space-x-2">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === number
                ? "bg-indigo-500 text-white"
                : "bg-slate-700 text-white hover:bg-slate-600"
            }`}
          >
            {number}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg ${
          currentPage === totalPages
            ? "bg-slate-700 text-gray-400 cursor-not-allowed"
            : "bg-slate-700 text-white hover:bg-slate-600"
        }`}
      >
        Next
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-lg ${
          currentPage === totalPages
            ? "bg-slate-700 text-gray-400 cursor-not-allowed"
            : "bg-slate-700 text-white hover:bg-slate-600"
        }`}
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
