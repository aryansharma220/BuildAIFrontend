import { useSearchParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

function Pagination({ currentPage, totalPages, totalItems }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { darkMode } = useTheme();
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page and current page
      pages.push(1);
      
      // Calculate range around current page
      let rangeStart = Math.max(2, currentPage - 1);
      let rangeEnd = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis if needed
      if (rangeStart > 2) {
        pages.push('...');
      }
      
      // Add range pages
      for (let i = rangeStart; i <= rangeEnd; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (rangeEnd < totalPages - 1) {
        pages.push('...');
      }
      
      // Add last page if not already included
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };
  
  // Don't render pagination if only one page
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${
      darkMode ? 'text-gray-300' : 'text-gray-700'
    }`}>
      <div className="text-sm">
        Showing <span className={`font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
          {totalItems === 0 ? 0 : (currentPage - 1) * 10 + 1}
        </span> to <span className={`font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
          {Math.min(currentPage * 10, totalItems)}
        </span> of <span className={`font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
          {totalItems}
        </span> results
      </div>
      
      <div className="flex justify-center space-x-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`inline-flex items-center justify-center w-9 h-9 rounded-md transition-colors ${
            darkMode 
              ? (currentPage === 1 
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-gray-400 hover:bg-gray-700 hover:text-white')
              : (currentPage === 1 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700')
          }`}
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span 
              key={`ellipsis-${index}`} 
              className={`inline-flex items-center justify-center w-9 h-9 ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}
            >
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => handlePageChange(page)}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-md transition-colors ${
                page === currentPage
                  ? (darkMode 
                    ? 'bg-indigo-700 text-white' 
                    : 'bg-indigo-600 text-white')
                  : (darkMode 
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700')
              }`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`inline-flex items-center justify-center w-9 h-9 rounded-md transition-colors ${
            darkMode 
              ? (currentPage === totalPages 
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-gray-400 hover:bg-gray-700 hover:text-white')
              : (currentPage === totalPages 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700')
          }`}
          aria-label="Next page"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
