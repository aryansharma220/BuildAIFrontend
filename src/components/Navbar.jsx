import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { fetchCategories } from '../services/api';
import { 
  SparklesIcon, 
  HomeIcon, 
  AdjustmentsHorizontalIcon, 
  Bars3Icon, 
  XMarkIcon, 
  ChevronDownIcon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  
  const categoryDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Fetch categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else {
          console.error('Invalid categories data format:', categoriesData);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };
    
    getCategories();
  }, []);

  // Handle scroll events for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setIsUserDropdownOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  // Toggle dark mode
  const handleToggleDarkMode = () => {
    toggleDarkMode();
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-900/90 backdrop-blur-md text-gray-100' 
        : (scrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-md' 
            : 'bg-white')
    } py-4`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className={`absolute inset-0 rounded-full blur-md opacity-30 group-hover:opacity-70 transition-opacity ${darkMode ? 'bg-indigo-400' : 'bg-indigo-600'}`}></div>
                <SparklesIcon className={`h-8 w-8 relative z-10 animate-pulse ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              </div>
              <span className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-indigo-800'}`}>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                  AI Digest
                </span>
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Add Dashboard link */}
            <NavLink
              to="/"
              end
              className={({ isActive }) => 
                `px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive 
                    ? (darkMode ? 'text-white bg-indigo-700' : 'text-white bg-indigo-600') 
                    : (darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50')
                }`
              }
            >
              <span className="flex items-center">
                <HomeIcon className="h-5 w-5 mr-1.5" />
                Dashboard
              </span>
            </NavLink>

            
            <NavLink
              to="/preferences"
              className={({ isActive }) => 
                `px-3 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive 
                    ? (darkMode ? 'text-white bg-indigo-700' : 'text-white bg-indigo-600') 
                    : (darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50')
                }`
              }
            >
              <span className="flex items-center">
                <AdjustmentsHorizontalIcon className="h-5 w-5 mr-1.5" />
                Preferences
              </span>
            </NavLink>
            
            <button 
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
              onClick={handleToggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
            
            {/* User menu */}
            {currentUser ? (
              <div className="ml-2 relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className={`flex items-center space-x-2 pl-2 pr-3 py-1 shadow-sm border transition-all rounded-full ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                      : 'bg-white border-gray-200 hover:shadow'
                  }`}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                    {currentUser?.displayName?.[0] || 'U'}
                  </div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {currentUser?.displayName || 'User'}
                  </span>
                  <ChevronDownIcon className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'} transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isUserDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-lg ring-1 ring-opacity-5 focus:outline-none backdrop-blur-sm border ${
                    darkMode 
                      ? 'bg-gray-800 ring-gray-700 border-gray-700' 
                      : 'bg-white ring-black border-gray-100'
                  }`}>
                    <div className="py-1" role="none">
                      <div className={`px-4 py-2 text-xs border-b ${
                        darkMode 
                          ? 'text-gray-400 border-gray-700' 
                          : 'text-gray-500 border-gray-100'
                      }`}>
                        Signed in as <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {currentUser?.email}
                        </span>
                      </div>
                      
                      <button
                        onClick={handleLogout}
                        className={`block w-full text-left px-4 py-2 text-sm flex items-center ${
                          darkMode 
                            ? 'text-red-400 hover:bg-gray-700' 
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="ml-4 flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    darkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {currentUser && (
              <div className="mr-2 relative">
                <button className={`p-2 rounded-full transition-all relative ${
                  darkMode 
                    ? 'bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'bg-white text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}>
                  <BellIcon className="h-6 w-6" />
                  <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
                </button>
              </div>
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset transition-all ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700 focus:ring-gray-500' 
                  : 'text-gray-700 hover:bg-gray-100 focus:ring-indigo-500'
              }`}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMenuOpen 
          ? `max-h-[80vh] opacity-100 border-t ${darkMode ? 'border-gray-700' : 'border-gray-100'}` 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <NavLink 
            to="/"
            end
            className={({ isActive }) => 
              `block px-3 py-2 rounded-lg text-base font-medium ${
                isActive 
                  ? (darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700') 
                  : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50')
              }`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="flex items-center">
              <HomeIcon className="h-5 w-5 mr-2" />
              Dashboard
            </span>
          </NavLink>
          
          <NavLink
            to="/preferences"
            className={({ isActive }) => 
              `block px-3 py-2 rounded-lg text-base font-medium ${
                isActive 
                  ? (darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700') 
                  : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50')
              }`
            }
            onClick={() => setIsMenuOpen(false)}
          >
            <span className="flex items-center">
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Preferences
            </span>
          </NavLink>
          
          
          {/* Mobile display mode toggle */}
          <div className="px-3 py-2 flex justify-between items-center">
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Dark Mode</span>
            <button 
              onClick={handleToggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-gray-200'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
          
          {/* Mobile user menu */}
          {currentUser ? (
            <div className={`px-3 py-2 border-t mt-2 ${
              darkMode ? 'border-gray-700' : 'border-gray-100'
            }`}>
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                  {currentUser?.displayName?.[0] || 'U'}
                </div>
                <div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {currentUser?.displayName || 'User'}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {currentUser?.email}
                  </div>
                </div>
              </div>
              
              
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className={`block w-full px-3 py-2 rounded-lg text-left text-sm font-medium mt-1 flex items-center ${
                  darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'
                }`}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                Sign out
              </button>
            </div>
          ) : (
            <div className={`px-3 py-2 border-t mt-2 space-y-2 ${
              darkMode ? 'border-gray-700' : 'border-gray-100'
            }`}>
              <Link 
                to="/login" 
                className={`block w-full px-4 py-2 rounded-lg text-base font-medium text-center ${
                  darkMode ? 'text-gray-300 bg-gray-800 hover:bg-gray-700' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className={`block w-full px-4 py-2 rounded-lg text-base font-medium text-center text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
