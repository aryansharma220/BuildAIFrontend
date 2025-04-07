import { Link } from 'react-router-dom';
import { CalendarIcon, TagIcon, ArrowTopRightOnSquareIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

function DigestCard({ digest }) {
  const { _id, title, summary, category, source, tags, date_created, url } = digest;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { darkMode } = useTheme();
  
  // Format date
  const formattedDate = date_created 
    ? formatDistanceToNow(new Date(date_created), { addSuffix: true })
    : 'Unknown date';
  
  // Get source color and gradient
  const getSourceStyles = (source) => {
    switch (source?.toLowerCase()) {
      case 'github':
        return {
          tag: 'bg-blue-100 text-blue-800 border-blue-200',
          gradient: 'from-blue-500 to-indigo-600',
          icon: '💻'
        };
      case 'huggingface':
        return {
          tag: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          gradient: 'from-yellow-500 to-orange-600',
          icon: '🤗'
        };
      case 'arxiv':
        return {
          tag: 'bg-red-100 text-red-800 border-red-200',
          gradient: 'from-red-500 to-pink-600',
          icon: '📄'
        };
      default:
        return {
          tag: 'bg-gray-100 text-gray-800 border-gray-200',
          gradient: 'from-gray-500 to-gray-600',
          icon: '📊'
        };
    }
  };
  
  // Get category color
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'llm': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'computer_vision': return 'bg-green-100 text-green-800 border-green-200';
      case 'reinforcement_learning': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'nlp': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'mlops': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'multimodal': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'research': return 'bg-red-100 text-red-800 border-red-200';
      case 'ai_tools': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const sourceStyles = getSourceStyles(source);
  
  return (
    <div 
      className={`rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full transform ${
        darkMode 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white shadow-md'
      } ${isHovered ? 'scale-[1.02]' : 'scale-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card header with gradient */}
      <div className={`bg-gradient-to-r ${sourceStyles.gradient} p-3 flex justify-between items-center`}>
        <div className="flex items-center space-x-2">
          <span className="text-xl">{sourceStyles.icon}</span>
          <span className="text-white font-semibold">{source}</span>
        </div>
        <button 
          onClick={() => setIsBookmarked(!isBookmarked)} 
          className="text-white hover:text-yellow-300 transition-colors"
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
        >
          {isBookmarked ? (
            <BookmarkSolidIcon className="h-5 w-5 text-yellow-300" />
          ) : (
            <BookmarkIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Card content */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="mb-3">
          <span className={`text-xs px-3 py-1 rounded-full border ${getCategoryColor(category)}`}>
            {category}
          </span>
        </div>
        
        <Link to={`/digest/${_id}`} className="group">
          <h3 className={`text-lg font-semibold mb-3 group-hover:text-indigo-600 transition-colors ${
            darkMode ? 'text-gray-100' : 'text-gray-900'
          }`}>
            {title}
          </h3>
        </Link>
        
        <p className={`text-sm mb-4 line-clamp-3 flex-grow ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {summary}
        </p>
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map(tag => (
              <span key={tag} className={`text-xs px-2 py-1 rounded-full ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className={`flex items-center justify-between text-xs mt-auto ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {formattedDate}
          </div>
        </div>
      </div>
      
      {/* Card footer with actions */}
      <div className={`p-4 border-t flex justify-between items-center rounded-b-xl ${
        darkMode 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-gray-50 border-gray-100'
      }`}>
        <Link
          to={`/digest/${_id}`}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-medium transition-colors shadow-sm hover:shadow"
        >
          Read more
        </Link>
        
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-full transition-colors ${
              darkMode 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
            title="Visit original source"
          >
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}

export default DigestCard;
