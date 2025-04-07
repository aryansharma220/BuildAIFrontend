import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CalendarIcon, TagIcon, ArrowLeftIcon, BookmarkIcon, ShareIcon, ArrowTopRightOnSquareIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { fetchDigestById, addToReadHistory } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

function DigestDetails() {
  const { id } = useParams();
  const { userToken } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readTime, setReadTime] = useState('3 min read');
  
  useEffect(() => {
    const fetchDigest = async () => {
      try {
        setLoading(true);
        const data = await fetchDigestById(id);
        setDigest(data);
        
        if (userToken) {
          await addToReadHistory(id, userToken).catch(console.error);
        }
      } catch (err) {
        console.error('Error fetching digest:', err);
        setError('Failed to fetch digest details');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchDigest();
    }
  }, [id, userToken]);
  
  // Calculate read time
  useEffect(() => {
    if (digest?.summary) {
      const wordCount = digest.summary.split(/\s+/).length;
      const minutes = Math.ceil(wordCount / 200); // Average reading speed
      setReadTime(`${minutes} min read`);
    }
  }, [digest]);

  // Get source styles for more visual appeal
  const getSourceStyles = (source) => {
    switch (source?.toLowerCase()) {
      case 'github':
        return {
          tag: 'bg-blue-100 text-blue-800 border-blue-200',
          gradient: 'from-blue-500 to-indigo-600',
          icon: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
          darkTag: 'bg-blue-900 text-blue-300 border-blue-800'
        };
      case 'huggingface':
        return {
          tag: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          gradient: 'from-yellow-500 to-orange-600',
          icon: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
          darkTag: 'bg-yellow-900 text-yellow-300 border-yellow-800'
        };
      case 'arxiv':
        return {
          tag: 'bg-red-100 text-red-800 border-red-200',
          gradient: 'from-red-500 to-pink-600',
          icon: 'https://static.arxiv.org/static/base/0.19.4/images/arxiv-logo-web.svg',
          darkTag: 'bg-red-900 text-red-300 border-red-800'
        };
      default:
        return {
          tag: 'bg-gray-100 text-gray-800 border-gray-200',
          gradient: 'from-gray-500 to-gray-600',
          icon: null,
          darkTag: 'bg-gray-800 text-gray-300 border-gray-700'
        };
    }
  };
  
  // Get category color with dark mode support
  const getCategoryColor = (category) => {
    const categories = {
      'llm': { light: 'bg-purple-100 text-purple-800 border-purple-200', dark: 'bg-purple-900 text-purple-300 border-purple-800' },
      'computer_vision': { light: 'bg-green-100 text-green-800 border-green-200', dark: 'bg-green-900 text-green-300 border-green-800' },
      'reinforcement_learning': { light: 'bg-blue-100 text-blue-800 border-blue-200', dark: 'bg-blue-900 text-blue-300 border-blue-800' },
      'nlp': { light: 'bg-indigo-100 text-indigo-800 border-indigo-200', dark: 'bg-indigo-900 text-indigo-300 border-indigo-800' },
      'mlops': { light: 'bg-gray-100 text-gray-800 border-gray-200', dark: 'bg-gray-800 text-gray-300 border-gray-700' },
      'multimodal': { light: 'bg-pink-100 text-pink-800 border-pink-200', dark: 'bg-pink-900 text-pink-300 border-pink-800' },
      'research': { light: 'bg-red-100 text-red-800 border-red-200', dark: 'bg-red-900 text-red-300 border-red-800' },
      'ai_tools': { light: 'bg-orange-100 text-orange-800 border-orange-200', dark: 'bg-orange-900 text-orange-300 border-orange-800' }
    };
    
    const categoryKey = category?.toLowerCase();
    const colorSet = categories[categoryKey] || categories['mlops'];
    return darkMode ? colorSet.dark : colorSet.light;
  };
  
  // Handle bookmark toggle
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Here you would typically call an API to save the bookmark
  };
  
  // Handle sharing
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: digest?.title,
        text: digest?.summary,
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };
  
  if (loading) {
    return (
      <div className={`flex flex-col justify-center items-center h-96 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
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
        }`}>Loading digest...</p>
      </div>
    );
  }
  
  if (error || !digest) {
    return (
      <div className={`p-6 rounded-xl shadow-md ${
        darkMode ? 'bg-red-900/30 border border-red-800 text-red-300' : 'bg-red-50 border border-red-200 text-red-700'
      }`}>
        <div className="flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium">{error || 'Digest not found'}</h3>
        </div>
        <Link 
          to="/" 
          className={`inline-flex items-center px-4 py-2 rounded-md shadow-sm ${
            darkMode 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          } transition-colors`}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>
    );
  }
  
  const { title, summary, category, source, tags, date_created, url } = digest;
  const sourceStyles = getSourceStyles(source);
  
  // Format date
  const formattedDate = date_created 
    ? formatDistanceToNow(new Date(date_created), { addSuffix: true })
    : 'Unknown date';
  
  return (
    <div className={`min-h-screen pt-24 pb-16 ${
      darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      {!darkMode && (
        <>
          <div className="absolute top-20 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-3000"></div>
          <div className="absolute bottom-20 -left-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-1000"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.07]"></div>
        </>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Link 
          to="/" 
          className={`inline-flex items-center mb-6 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            darkMode 
              ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
              : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
          }`}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <article className={`rounded-2xl shadow-lg overflow-hidden ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <div className={`bg-gradient-to-r p-8 text-white ${
            darkMode 
              ? `from-indigo-800 via-purple-800 to-indigo-900` 
              : `from-indigo-600 via-purple-600 to-blue-500`
          }`}>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`text-xs px-3 py-1 rounded-full border ${
                darkMode ? sourceStyles.darkTag : sourceStyles.tag
              } flex items-center`}>
                {sourceStyles.icon && (
                  <img src={sourceStyles.icon} alt={source} className="h-4 w-4 mr-1.5" />
                )}
                {source}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full border ${getCategoryColor(category)}`}>
                {category}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold mb-4 leading-tight">{title}</h1>
            
            <div className="flex flex-wrap items-center text-sm space-x-4 mb-2 text-gray-100">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1.5" />
                {formattedDate}
              </div>
              
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1.5" />
                {readTime}
              </div>
              
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-1.5" />
                {Math.floor(Math.random() * 1000) + 100} reads
              </div>
            </div>
          </div>
          
          <div className="p-8">
            {tags && tags.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className={`text-xs px-3 py-1 rounded-full ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300 border border-gray-600' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className={`prose max-w-none mb-8 ${
              darkMode ? 'prose-invert' : ''
            }`}>
              {summary.split('\n\n').map((paragraph, index) => (
                <p 
                  key={index} 
                  className={`mb-4 leading-relaxed ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4 items-center justify-between mt-10 pt-6 border-t border-dashed
              ${darkMode ? 'border-gray-700' : 'border-gray-200'}
            ">
              <div className="flex gap-3">
               
                
                <button
                  onClick={handleShare}
                  className={`p-2 rounded-full transition-all flex items-center ${
                    darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-label="Share"
                >
                  <ShareIcon className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>
              
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center px-6 py-2.5 rounded-full shadow-sm text-sm font-medium transition-all ${
                    darkMode 
                      ? 'bg-gradient-to-r from-indigo-700 to-purple-800 text-white hover:from-indigo-800 hover:to-purple-900' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                  }`}
                >
                  Visit Original Source
                  <ArrowTopRightOnSquareIcon className="ml-2 h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </article>
        
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
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

export default DigestDetails;
