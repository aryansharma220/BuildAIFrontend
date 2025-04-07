import { NavLink } from 'react-router-dom';
import { XMarkIcon, HomeIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { fetchCategories } from '../services/api';

function Sidebar({ open, onClose }) {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    getCategories();
  }, []);
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-30 h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center justify-between px-4 bg-indigo-600 text-white">
          <h2 className="text-lg font-semibold">AI Digest</h2>
          <button className="md:hidden" onClick={onClose}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-5 px-2">
          <NavLink 
            to="/"
            className={({ isActive }) => 
              `flex items-center px-4 py-2 mt-2 rounded-md ${
                isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
            end
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Dashboard
          </NavLink>
          
          <NavLink
            to="/preferences"
            className={({ isActive }) => 
              `flex items-center px-4 py-2 mt-2 rounded-md ${
                isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
            Preferences
          </NavLink>
          
          <div className="mt-6 px-4">
            <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Categories</h3>
            <div className="mt-2 space-y-1">
              {categories.map((category) => (
                <NavLink
                  key={category.category}
                  to={`/?category=${category.category}`}
                  className={({ isActive }) => 
                    `block px-4 py-2 rounded-md text-sm ${
                      isActive ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  {category.category} ({category.count})
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
