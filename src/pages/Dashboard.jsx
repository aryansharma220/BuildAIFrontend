import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { fetchDigests, fetchPersonalizedDigests } from '../services/api';
import DigestCard from '../components/DigestCard';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import { SparklesIcon, RocketLaunchIcon, BookOpenIcon, MagnifyingGlassIcon, XMarkIcon, ArrowPathIcon, FunnelIcon } from '@heroicons/react/24/outline';

function Dashboard() {
  const [searchParams] = useSearchParams();
  const { userToken } = useAuth();
  const { darkMode } = useTheme();
  
  const [digests, setDigests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDigests, setFilteredDigests] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  
  const category = searchParams.get('category');
  const source = searchParams.get('source');
  const page = parseInt(searchParams.get('page') || '1');
  const viewMode = searchParams.get('view') || 'all'; 
  
  useEffect(() => {
    const filters = {};
    if (category) filters.category = category;
    if (source) filters.source = source;
    setActiveFilters(filters);
  }, [category, source]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        let result;
        if (viewMode === 'personalized' && userToken) {
          result = await fetchPersonalizedDigests({ 
            category, 
            source, 
            page,
            limit: pagination.limit 
          }, userToken);
        } else {
          result = await fetchDigests({ 
            category, 
            source, 
            page,
            limit: pagination.limit 
          }, userToken);
        }
        
        setDigests(result.digests);
        setFilteredDigests(result.digests);
        setPagination(result.pagination);
        setError(null);
        setRefreshing(false);
      } catch (err) {
        setError('Failed to fetch digests');
        console.error(err);
        setRefreshing(false);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [category, source, page, viewMode, userToken, pagination.limit, refreshing]);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDigests(digests);
    } else {
      const filtered = digests.filter(digest => 
        digest.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        digest.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (digest.tags && digest.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ))
      );
      setFilteredDigests(filtered);
    }
  }, [searchQuery, digests]);
  
  const handleReset = () => {
    const newParams = new URLSearchParams();
    newParams.set('view', viewMode);
    window.history.pushState({}, '', `?${newParams.toString()}`);
    setActiveFilters({});
    setSearchQuery('');
    setRefreshing(true);
  };
  
  const handleRefresh = () => {
    setRefreshing(true);
  };
  
  return (
    <div className={`min-h-screen relative pb-12 pt-24 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-indigo-50 via-white to-white'
    }`}>
      {/* Background decoration - conditionally rendered based on dark mode */}
      {!darkMode && (
        <>
          <div className="absolute top-20 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-3000"></div>
          <div className="absolute bottom-20 -left-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-1000"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.07]"></div>
        </>
      )}
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className={`p-8 rounded-2xl shadow-lg mb-8 transform transition-all duration-500 hover:shadow-xl animate-fadeIn ${
          darkMode
            ? 'bg-gradient-to-r from-indigo-800 via-purple-800 to-indigo-900 text-white'
            : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 text-white'
        }`}>
          <div className="flex flex-col p-4 lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-inner">
                {viewMode === 'personalized' ? (
                  <SparklesIcon className="h-10 w-10 text-yellow-300 animate-pulse" />
                ) : (
                  <RocketLaunchIcon className="h-10 w-10 text-yellow-300" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {viewMode === 'personalized' ? 'Your Personalized AI Digest' : 'Latest AI Developments'}
                </h1>
                <p className="mt-2 text-indigo-100 max-w-2xl text-lg leading-relaxed">
                  Stay updated with the latest in AI research, tools, and models from top sources.
                </p>
              </div>
            </div>
            
            <div className="relative max-w-lg w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-white/60" />
              </div>
              <input
                type="text"
                placeholder="Search digests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-white/30 rounded-full bg-white/10 backdrop-blur-sm placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <XMarkIcon className="h-5 w-5 text-white/60 hover:text-white" />
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-3 items-center">
            <button 
              className={`px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm text-sm font-medium transition-all hover:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none ${viewMode === 'all' ? 'bg-white/20' : 'bg-transparent'}`}
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set('view', 'all');
                newParams.delete('page');
                window.history.pushState({}, '', `?${newParams.toString()}`);
                window.location.reload();
              }}
            >
              All Digests
            </button>
            <button 
              className={`px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm text-sm font-medium transition-all hover:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none ${viewMode === 'personalized' ? 'bg-white/20' : 'bg-transparent'}`}
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set('view', 'personalized');
                newParams.delete('page');
                window.history.pushState({}, '', `?${newParams.toString()}`);
                window.location.reload();
              }}
            >
              Personalized Feed
            </button>
            
            <div className="ml-auto flex space-x-2">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm text-sm font-medium transition-all hover:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none flex items-center gap-2"
                disabled={refreshing}
              >
                <ArrowPathIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              
              <button 
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                className={`px-4 py-2 rounded-full border border-white/30 backdrop-blur-sm text-sm font-medium transition-all hover:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none flex items-center gap-2 ${isFilterVisible || Object.keys(activeFilters).length > 0 ? 'bg-white/20' : 'bg-transparent'}`}
              >
                <FunnelIcon className="h-4 w-4" />
                <span>Filters</span>
                {Object.keys(activeFilters).length > 0 && (
                  <span className="bg-white text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {Object.keys(activeFilters).length}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {Object.keys(activeFilters).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-white/70 text-sm">Active filters:</span>
              {Object.entries(activeFilters).map(([key, value]) => (
                <div key={key} className="bg-white/20 rounded-full px-3 py-1 text-sm flex items-center">
                  <span className="mr-1 text-white/70">{key}:</span>
                  <span className="font-medium">{value}</span>
                  <button 
                    onClick={() => {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.delete(key);
                      window.history.pushState({}, '', `?${newParams.toString()}`);
                      window.location.reload();
                    }}
                    className="ml-2 text-white/70 hover:text-white"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button 
                onClick={handleReset}
                className="text-white/70 hover:text-white text-sm underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      
        {/* Filter section */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden mb-8 ${
          isFilterVisible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } ${darkMode ? 'bg-gray-800 shadow-md rounded-xl border border-gray-700' : 'bg-white shadow-md rounded-xl'}`}>
          <div className="p-5 transition-all duration-300 hover:shadow-lg animate-slideInUp">
            <FilterBar darkMode={darkMode} />
          </div>
        </div>
      
        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 mt-12 animate-fadeIn">
            <div className="relative w-20 h-20">
              <div className={`absolute top-0 left-0 w-full h-full border-4 rounded-full ${
                darkMode ? 'border-gray-700' : 'border-indigo-100'
              }`}></div>
              <div className={`absolute top-0 left-0 w-full h-full border-t-4 border-l-4 rounded-full animate-spin ${
                darkMode ? 'border-indigo-400' : 'border-indigo-600'
              }`}></div>
            </div>
            <p className={`mt-6 font-medium animate-pulse ${
              darkMode ? 'text-indigo-400' : 'text-indigo-600'
            }`}>
              {refreshing ? 'Refreshing your digests...' : 'Loading your digests...'}
            </p>
          </div>
        ) : error ? (
          <div className={`p-6 rounded-xl shadow-md mb-8 ${
            darkMode ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'
          } animate-fadeIn`}>
            <h3 className={`text-lg font-medium mb-2 flex items-center ${
              darkMode ? 'text-red-400' : 'text-red-800'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Error loading digests
            </h3>
            <p className={`${darkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
            <button 
              onClick={handleRefresh}
              className={`mt-4 px-6 py-2 rounded-full transition-all duration-300 shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                darkMode ? 'bg-gradient-to-r from-indigo-700 to-purple-800 text-white hover:from-indigo-800 hover:to-purple-900 focus:ring-indigo-400' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 focus:ring-indigo-500'
              }`}
            >
              Try Again
            </button>
          </div>
        ) : filteredDigests.length === 0 ? (
          <div className={`p-10 rounded-xl shadow-md text-center ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          } animate-fadeIn`}>
            <div className={`p-4 w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
              darkMode ? 'bg-gray-700' : 'bg-indigo-50'
            }`}>
              <BookOpenIcon className={`h-10 w-10 ${darkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>No digests found</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} max-w-md mx-auto`}>
              {searchQuery 
                ? `We couldn't find any digests matching "${searchQuery}". Try a different search term.` 
                : 'We couldn\'t find any digests matching your current filters. Try adjusting your filter criteria or check back later.'}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className={`px-6 py-2 rounded-full transition-all duration-300 shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                    darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-500' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-indigo-500'
                  }`}
                >
                  Clear Search
                </button>
              )}
              <button 
                onClick={handleReset}
                className={`px-6 py-2 rounded-full transition-all duration-300 shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  darkMode ? 'bg-gradient-to-r from-indigo-700 to-purple-800 text-white hover:from-indigo-800 hover:to-purple-900 focus:ring-indigo-400' : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 focus:ring-indigo-500'
                }`}
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats summary */}
            <div className={`rounded-xl shadow-sm p-4 mb-6 flex flex-wrap justify-between items-center ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
            } animate-fadeIn animation-delay-300`}>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs mr-2 ${
                  darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-600'
                }`}>
                  {searchQuery ? filteredDigests.length : pagination.total}
                </span>
                <span>digests found</span>
                {searchQuery && <span className="ml-2">for "<span className={`font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>{searchQuery}</span>"</span>}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Showing <span className={`font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                  {searchQuery 
                    ? Math.min(1, filteredDigests.length)
                    : Math.min(1 + (pagination.page - 1) * pagination.limit, pagination.total)}
                </span> to <span className={`font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                  {searchQuery 
                    ? filteredDigests.length
                    : Math.min(pagination.page * pagination.limit, pagination.total)}
                </span> of <span className={`font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                  {searchQuery ? filteredDigests.length : pagination.total}
                </span>
              </div>
            </div>
            
            {/* Pass dark mode prop to DigestCard components */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {(searchQuery ? filteredDigests : digests).map((digest, index) => (
                <div 
                  key={digest._id}
                  className="transform transition-all duration-300 hover:-translate-y-1 animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <DigestCard digest={digest} darkMode={darkMode} />
                </div>
              ))}
            </div>
          </>
        )}
        
        {!loading && !error && !searchQuery && digests.length > 0 && (
          <div className="mt-10 animate-fadeIn animation-delay-500">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              totalItems={pagination.total}
              darkMode={darkMode}
            />
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 40px) scale(1.05); }
        }
        
        .animate-blob {
          animation: blob 15s infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
