export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Shared classes for all buttons
  const buttonClass =
    "w-12 h-12 flex items-center justify-center rounded text-2xl font-semibold transition-colors";

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      
      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${buttonClass} bg-gray-200 hover:bg-gray-300 disabled:opacity-50`}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, idx) => (
        <button
          key={idx}
          onClick={() => onPageChange(idx + 1)}
          className={`${buttonClass} ${
            currentPage === idx + 1
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          } mx-1`}
        >
          {idx + 1}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${buttonClass} bg-gray-200 hover:bg-gray-300 disabled:opacity-50`}
      >
        Next
      </button>
    </div>
  );
}
