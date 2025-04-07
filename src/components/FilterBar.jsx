import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { fetchCategories, fetchSources } from '../services/api';

function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { darkMode } = useTheme();
  
  const [categories, setCategories] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const selectedCategory = searchParams.get('category');
  const selectedSource = searchParams.get('source');
  
  // Fetch filter options
  useEffect(() => {
    const fetchFilters = async () => {
      setLoading(true);
      try {
        const [categoriesData, sourcesData] = await Promise.all([
          fetchCategories(),
          fetchSources().catch(err => {
            console.error('Error fetching sources:', err);
            return [];
          })
        ]);
        
        setCategories(categoriesData || []);
        setSources(sourcesData || []);
      } catch (error) {
        console.error('Error fetching filters:', error);
        setCategories([]);
        setSources([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFilters();
  }, []);
  
  // Apply filter
  const applyFilter = (type, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value) {
      newParams.set(type, value);
    } else {
      newParams.delete(type);
    }
    
    // Reset to page 1 when filter changes
    newParams.delete('page');
    
    setSearchParams(newParams);
  };
  
  if (loading) {
    return (
      <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Loading filters...
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category filter */}
        <div>
          <label 
            className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
          >
            Category
          </label>
          <select
            value={selectedCategory || ''}
            onChange={(e) => applyFilter('category', e.target.value)}
            className={`block w-full rounded-md border py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 transition-colors ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.category} value={category.category}>
                {category.category} ({category.count})
              </option>
            ))}
          </select>
        </div>
        
        {/* Source filter */}
        <div>
          <label 
            className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
          >
            Source
          </label>
          <select
            value={selectedSource || ''}
            onChange={(e) => applyFilter('source', e.target.value)}
            className={`block w-full rounded-md border py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 transition-colors ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-gray-100 focus:ring-indigo-500 focus:border-indigo-500' 
                : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
            }`}
          >
            <option value="">All Sources</option>
            {sources.map((source) => (
              <option key={source.source} value={source.source}>
                {source.source} ({source.count})
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Reset button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => {
            const newParams = new URLSearchParams();
            const view = searchParams.get('view');
            if (view) newParams.set('view', view);
            setSearchParams(newParams);
          }}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            darkMode 
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
