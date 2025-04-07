import { Link } from 'react-router-dom';
import { BeakerIcon, LightBulbIcon, BookOpenIcon, SparklesIcon, RocketLaunchIcon, ChevronDownIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
      const sections = ['features', 'how-it-works'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen ${
      darkMode 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gradient-to-b from-indigo-50 via-white to-white'
    }`}>
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        darkMode
          ? (scrolled ? 'bg-gray-900/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4')
          : (scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4')
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex items-center space-x-2 group">
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full blur-md opacity-30 group-hover:opacity-70 transition-opacity ${
                    darkMode ? 'bg-indigo-400' : 'bg-indigo-600'
                  }`}></div>
                  <SparklesIcon className={`h-8 w-8 relative z-10 animate-pulse ${
                    darkMode ? 'text-indigo-400' : 'text-indigo-600'
                  }`} />
                </div>
                <span className={`font-bold text-xl ${
                  darkMode ? 'text-white' : 'text-indigo-800'
                }`}>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                    AI Digest
                  </span>
                </span>
              </div>
            </div>
            
            {/* Desktop nav */}
            <div className="hidden md:flex items-center space-x-1">
              <a 
                href="#features" 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSection === 'features' 
                    ? (darkMode ? 'text-white bg-indigo-700' : 'text-white bg-indigo-600')
                    : (darkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50')
                }`}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSection === 'how-it-works' 
                    ? (darkMode ? 'text-white bg-indigo-700' : 'text-white bg-indigo-600')
                    : (darkMode 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50')
                }`}
              >
                How It Works
              </a>
              
              {/* Dark mode toggle */}
              <button 
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-all ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
              
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
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              {/* Add dark mode toggle for mobile */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 mr-2 rounded-full transition-all ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-400 hover:text-indigo-600 hover:bg-gray-100'
                }`}
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </button>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  darkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-400 hover:text-indigo-600 hover:bg-gray-100'
                }`}
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
                {isMenuOpen ? (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className={`md:hidden absolute w-full backdrop-blur-md shadow-lg rounded-b-2xl border-t animate-fadeDown ${
            darkMode 
              ? 'bg-gray-800/95 border-gray-700' 
              : 'bg-white/95 border-gray-100'
          }`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a 
                href="#features" 
                className={`block px-3 py-2 rounded-full text-base font-medium transition-all ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className={`block px-3 py-2 rounded-full text-base font-medium transition-all ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                How It Works
              </a>
              <Link 
                to="/login" 
                className={`block px-3 py-2 rounded-full text-base font-medium transition-all ${
                  darkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white block px-3 py-2 rounded-full text-base font-medium my-2"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
      
      {/* Hero Section - completely redesigned for a more modern and impressive look */}
      <div className="relative overflow-hidden pt-20">
        {/* Enhanced floating particles background with 3D effect - visible in both modes */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div 
              key={i}
              className={`absolute rounded-full backdrop-blur-sm animate-floatingSlow ${
                darkMode
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20'
                  : 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10'
              }`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 80 + 20}px`,
                height: `${Math.random() * 80 + 20}px`,
                animationDuration: `${Math.random() * 15 + 15}s`,
                animationDelay: `${Math.random() * 5}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            ></div>
          ))}
        </div>
        
        {/* Modern animated background gradients - only visible in light mode */}
        {!darkMode && (
          <>
            <div className="absolute top-20 -right-20 w-96 h-96 bg-indigo-400 opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-40 -left-20 w-96 h-96 bg-purple-400 opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-20 left-40 w-96 h-96 bg-pink-400 opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            <div className="absolute bottom-40 right-20 w-96 h-96 bg-blue-400 opacity-10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-3000"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15]"></div>
          </>
        )}
        
        {/* Dark mode specific background elements */}
        {darkMode && (
          <>
            <div className="absolute top-20 -right-20 w-96 h-96 bg-indigo-800 opacity-20 rounded-full filter blur-3xl animate-blob"></div>
            <div className="absolute top-40 -left-20 w-96 h-96 bg-purple-800 opacity-20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-20 left-40 w-96 h-96 bg-pink-800 opacity-10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
          </>
        )}
        
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 lg:flex lg:items-center lg:gap-12 min-h-[calc(100vh-5rem)] py-12">
            {/* Hero content with improved animations */}
            <div className="lg:w-1/2 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
              <div className="space-y-8">
                {/* Animated badge with improved animation - updated for dark mode */}
                <div className="inline-flex animate-slideInTop">
                  <span className={`font-medium px-4 py-1.5 rounded-full text-sm flex items-center gap-2 ${
                    darkMode 
                      ? 'bg-indigo-900/60 border border-indigo-800 text-indigo-300'
                      : 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-600'
                  }`}>
                    <span className="flex h-2 w-2">
                      <span className={`animate-ping absolute h-2 w-2 rounded-full ${
                        darkMode ? 'bg-indigo-400' : 'bg-indigo-400'
                      } opacity-75`}></span>
                      <span className={`relative rounded-full h-2 w-2 ${
                        darkMode ? 'bg-indigo-300' : 'bg-indigo-500'
                      }`}></span>
                    </span>
                    AI-Powered Digest Platform
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight animate-slideInRight">
                  <span className={`block ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Stay ahead of the</span>
                  <span className="block mt-1 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 animate-gradient-x">
                    AI revolution
                  </span>
                </h1>
                
                <p className={`text-lg md:text-xl max-w-2xl animate-slideInLeft animation-delay-200 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  AI Digest automatically collects, summarizes, and categorizes the latest developments in AI from GitHub, Hugging Face, and ArXiv, delivered in a digestible format.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slideInBottom animation-delay-400">
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span>Get Started</span>
                    <svg className="ml-2 -mr-1 w-5 h-5 animate-bounce" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </Link>
                  
                  <Link
                    to="/login"
                    className={`inline-flex items-center justify-center px-8 py-3.5 text-base font-medium rounded-full shadow-sm hover:shadow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      darkMode
                        ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-transparent'
                    }`}
                  >
                    <span>Sign In</span>
                  </Link>
                </div>
              </div>
              
              {/* Trust indicators with staggered animations - updated for dark mode */}
              <div className="mt-16 grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center animate-fadeIn animation-delay-600">
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse">500+</div>
                  <div className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Daily Digests</div>
                </div>
                <div className="flex flex-col items-center animate-fadeIn animation-delay-700">
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse animation-delay-200">50K+</div>
                  <div className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>AI Researchers</div>
                </div>
                <div className="flex flex-col items-center animate-fadeIn animation-delay-800">
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse animation-delay-400">3</div>
                  <div className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Top AI Sources</div>
                </div>
              </div>
            </div>
            
            {/* Creative 3D card showcase with improved animation - updated for dark mode */}
            <div className="lg:w-1/2 mt-12 lg:mt-0 px-4 sm:px-6 lg:px-8 perspective-1000 animate-slideInRight animation-delay-300">
              <div className="relative w-full max-w-lg mx-auto animate-floatingCard">
                {/* Decorative elements */}
                <div className={`absolute top-0 -left-4 w-72 h-72 rounded-full filter blur-xl opacity-30 animate-blob animation-delay-1000 ${
                  darkMode ? 'bg-purple-700' : 'bg-purple-300 mix-blend-multiply'
                }`}></div>
                <div className={`absolute -bottom-8 right-4 w-72 h-72 rounded-full filter blur-xl opacity-30 animate-blob animation-delay-3000 ${
                  darkMode ? 'bg-indigo-700' : 'bg-indigo-300 mix-blend-multiply'
                }`}></div>
                
                {/* 3D Card Stack */}
                <div className="relative">
                  {/* Background card 3 */}
                  <div className="absolute top-12 -right-6 transform rotate-6 translate-z-[-120px]">
                    <div className="h-56 w-96 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 blur-sm opacity-60"></div>
                  </div>
                  
                  {/* Background card 2 */}
                  <div className="absolute top-6 -left-6 transform -rotate-6 translate-z-[-60px]">
                    <div className="h-56 w-96 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 blur-sm opacity-60"></div>
                  </div>
                  
                  {/* Main card */}
                  <div className={`relative rounded-2xl shadow-2xl overflow-hidden border ${
                    darkMode 
                      ? 'bg-gray-800 backdrop-blur-xl backdrop-filter border-gray-700' 
                      : 'bg-white backdrop-blur-xl backdrop-filter border-gray-200'
                  }`}>
                    {/* Card header */}
                    <div className="p-5 bg-gradient-to-r from-indigo-500 to-purple-600">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <SparklesIcon className="h-5 w-5 text-yellow-300 animate-pulse" />
                          Today's AI Digest
                        </h3>
                        <div className="text-xs text-white/80 font-medium">
                          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Card content - showing multiple digest cards */}
                    <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                      {/* Digest Item 1 */}
                      <div className={`p-4 transition-colors ${
                        darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>New LLM Achieves State-of-the-Art Results</h4>
                            <p className={`mt-1 text-sm line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Researchers introduce an improved architecture with better reasoning capabilities and reduced hallucinations.
                            </p>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">ArXiv</span>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">LLM</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Research</span>
                        </div>
                      </div>
                      
                      {/* Digest Item 2 */}
                      <div className={`p-4 transition-colors ${
                        darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Multimodal Architecture for Vision-Language Tasks</h4>
                            <p className={`mt-1 text-sm line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              A new approach combining transformer-based vision and language models for improved performance.
                            </p>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">Hugging Face</span>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-pink-100 text-pink-800">Multimodal</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">Vision</span>
                        </div>
                      </div>
                      
                      {/* Card footer */}
                      <div className={`p-4 flex justify-between items-center ${
                        darkMode ? 'bg-gray-900' : 'bg-gray-50'
                      }`}>
                        <div className={`text-sm font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>View all digests</div>
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-pink-400 border-2 border-white"></div>
                          <div className="w-6 h-6 rounded-full bg-blue-400 border-2 border-white"></div>
                          <div className="w-6 h-6 rounded-full bg-green-400 border-2 border-white"></div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                            darkMode
                              ? 'bg-gray-700 border-gray-800 text-gray-300'
                              : 'bg-gray-200 border-white text-gray-500'
                          }`}>+5</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className={`absolute -top-12 right-20 opacity-20 animate-spin-slow ${
                  darkMode ? 'text-indigo-400' : 'text-indigo-500'
                }`}>
                  <svg className="w-20 h-20" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 0 L100 50 L50 100 L0 50 Z" />
                  </svg>
                </div>
                <div className={`absolute -bottom-14 left-20 opacity-20 animate-spin-slow animation-direction-reverse animation-delay-2000 ${
                  darkMode ? 'text-purple-400' : 'text-purple-500'
                }`}>
                  <svg className="w-28 h-28" viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="50" cy="50" r="50" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section - Enhanced with 3D cards and interactive elements */}
      <div id="features" className={`py-24 relative overflow-hidden ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Background decoration - conditional based on dark mode */}
        {!darkMode && (
          <>
            <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15]"></div>
          </>
        )}
        
        {darkMode && (
          <>
            <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-700 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-700 rounded-full filter blur-3xl opacity-10 animate-blob"></div>
          </>
        )}
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <div className={`inline-flex p-1 rounded-full mb-3 animate-fadeIn ${
              darkMode ? 'bg-indigo-900' : 'bg-indigo-50'
            }`}>
              <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">FEATURES</span>
              <span className={`px-4 py-1 text-sm ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>What makes us different</span>
            </div>
            <h2 className="text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 animate-fadeIn">
              Everything you need to stay informed
            </h2>
            <p className={`mt-4 max-w-2xl text-xl lg:mx-auto animate-fadeIn animation-delay-200 ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>
              Our AI-powered platform keeps you up-to-date with the latest advancements in artificial intelligence.
            </p>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 - Enhanced 3D Card - updated for dark mode */}
              <div className="group perspective h-full">
                <div className="relative h-full transform transition-all duration-500 group-hover:rotate-y-6">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                  <div className={`relative h-full px-7 py-8 rounded-2xl shadow-xl flex flex-col items-center ${
                    darkMode 
                      ? 'bg-gray-800 ring-1 ring-gray-700' 
                      : 'bg-white ring-1 ring-gray-200'
                  }`}>
                    <div className="flex-shrink-0 mb-5">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg group-hover:shadow-xl transition-all">
                        <RocketLaunchIcon className="h-8 w-8 transform transition-transform group-hover:scale-110" />
                      </div>
                    </div>
                    <h3 className={`text-xl leading-6 font-bold text-center mb-3 ${
                      darkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>Multi-Source Aggregation</h3>
                    <p className={`text-base text-center flex-grow ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      We collect the latest AI developments from GitHub, Hugging Face, and ArXiv, ensuring you never miss important updates.
                    </p>
                    <div className="mt-5 w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Feature 2 - Enhanced 3D Card - updated for dark mode */}
              <div className="group perspective h-full">
                <div className="relative h-full transform transition-all duration-500 group-hover:rotate-y-6">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-tilt animation-delay-200"></div>
                  <div className={`relative h-full px-7 py-8 rounded-2xl shadow-xl flex flex-col items-center ${
                    darkMode 
                      ? 'bg-gray-800 ring-1 ring-gray-700' 
                      : 'bg-white ring-1 ring-gray-200'
                  }`}>
                    <div className="flex-shrink-0 mb-5">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-tr from-purple-500 to-pink-600 text-white shadow-lg group-hover:shadow-xl transition-all">
                        <SparklesIcon className="h-8 w-8 transform transition-transform group-hover:scale-110" />
                      </div>
                    </div>
                    <h3 className={`text-xl leading-6 font-bold text-center mb-3 ${
                      darkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>AI-Powered Summaries</h3>
                    <p className={`text-base text-center flex-grow ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Advanced AI models generate concise summaries of complex research papers and repositories, saving you hours of reading.
                    </p>
                    <div className="mt-5 w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Feature 3 - Enhanced 3D Card - updated for dark mode */}
              <div className="group perspective h-full">
                <div className="relative h-full transform transition-all duration-500 group-hover:rotate-y-6">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-tilt animation-delay-400"></div>
                  <div className={`relative h-full px-7 py-8 rounded-2xl shadow-xl flex flex-col items-center ${
                    darkMode 
                      ? 'bg-gray-800 ring-1 ring-gray-700' 
                      : 'bg-white ring-1 ring-gray-200'
                  }`}>
                    <div className="flex-shrink-0 mb-5">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-lg group-hover:shadow-xl transition-all">
                        <LightBulbIcon className="h-8 w-8 transform transition-transform group-hover:scale-110" />
                      </div>
                    </div>
                    <h3 className={`text-xl leading-6 font-bold text-center mb-3 ${
                      darkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>Smart Categorization</h3>
                    <p className={`text-base text-center flex-grow ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Automatic tagging and categorization helps you find exactly what you're looking for, whether it's LLMs, computer vision, or reinforcement learning.
                    </p>
                    <div className="mt-5 w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Feature 4 - Enhanced 3D Card - updated for dark mode */}
              <div className="group perspective h-full">
                <div className="relative h-full transform transition-all duration-500 group-hover:rotate-y-6">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-tilt animation-delay-600"></div>
                  <div className={`relative h-full px-7 py-8 rounded-2xl shadow-xl flex flex-col items-center ${
                    darkMode 
                      ? 'bg-gray-800 ring-1 ring-gray-700' 
                      : 'bg-white ring-1 ring-gray-200'
                  }`}>
                    <div className="flex-shrink-0 mb-5">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-tr from-green-500 to-blue-600 text-white shadow-lg group-hover:shadow-xl transition-all">
                        <BookOpenIcon className="h-8 w-8 transform transition-transform group-hover:scale-110" />
                      </div>
                    </div>
                    <h3 className={`text-xl leading-6 font-bold text-center mb-3 ${
                      darkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>Personalized Digest</h3>
                    <p className={`text-base text-center flex-grow ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Set your preferences to receive personalized digests that focus on your areas of interest.
                    </p>
                    <div className="mt-5 w-12 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* New Section: Data Sources - updated for dark mode */}
      <div className={`py-24 relative overflow-hidden ${
        darkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        {!darkMode && (
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15]"></div>
        )}
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className={`text-3xl font-extrabold tracking-tight sm:text-4xl mb-4 ${
              darkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
              Trusted Sources, Analyzed by AI
            </h2>
            <p className={`text-xl ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>
              We aggregate content from the most respected AI sources, processed by advanced language models.
            </p>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* ArXiv Source - updated for dark mode */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 shadow-xl rounded-3xl transform group-hover:scale-[1.02] transition-transform"></div>
                <div className={`relative p-6 rounded-3xl shadow-lg overflow-hidden flex flex-col items-center text-center h-full group-hover:-translate-y-1 transition-transform ${
                  darkMode
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-100'
                }`}>
                  <div className={`w-20 h-20 flex items-center justify-center rounded-full mb-4 ${
                    darkMode ? 'bg-red-900' : 'bg-red-100'
                  }`}>
                    <svg className={`w-10 h-10 ${darkMode ? 'text-red-400' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${
                    darkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>ArXiv Papers</h3>
                  <p className={`mb-4 flex-grow ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Cutting-edge research papers in machine learning, deep learning, and artificial intelligence.
                  </p>
                  <div className={`mt-auto pt-4 border-t w-full ${
                    darkMode ? 'border-gray-700' : 'border-gray-100'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Updated daily</span>
                      <span className={`text-sm font-medium ${
                        darkMode ? 'text-red-400' : 'text-red-600'
                      }`}>1,000+ papers</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* HuggingFace Source - updated for dark mode */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 shadow-xl rounded-3xl transform group-hover:scale-[1.02] transition-transform"></div>
                <div className={`relative p-6 rounded-3xl shadow-lg overflow-hidden flex flex-col items-center text-center h-full group-hover:-translate-y-1 transition-transform ${
                  darkMode
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-100'
                }`}>
                  <div className={`w-20 h-20 flex items-center justify-center rounded-full mb-4 ${
                    darkMode ? 'bg-yellow-900' : 'bg-yellow-100'
                  }`}>
                    <svg className={`w-10 h-10 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${
                    darkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>Hugging Face Models</h3>
                  <p className={`mb-4 flex-grow ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Latest models, datasets, and spaces from the leading platform for machine learning.
                  </p>
                  <div className={`mt-auto pt-4 border-t w-full ${
                    darkMode ? 'border-gray-700' : 'border-gray-100'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Real-time updates</span>
                      <span className={`text-sm font-medium ${
                        darkMode ? 'text-yellow-400' : 'text-yellow-600'
                      }`}>50,000+ models</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* GitHub Source - updated for dark mode */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 shadow-xl rounded-3xl transform group-hover:scale-[1.02] transition-transform"></div>
                <div className={`relative p-6 rounded-3xl shadow-lg overflow-hidden flex flex-col items-center text-center h-full group-hover:-translate-y-1 transition-transform ${
                  darkMode
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-gray-100'
                }`}>
                  <div className={`w-20 h-20 flex items-center justify-center rounded-full mb-4 ${
                    darkMode ? 'bg-blue-900' : 'bg-blue-100'
                  }`}>
                    <svg className={`w-10 h-10 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${
                    darkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>GitHub Repositories</h3>
                  <p className={`mb-4 flex-grow ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Trending AI repositories with implementations, tools, and libraries from the global developer community.
                  </p>
                  <div className={`mt-auto pt-4 border-t w-full ${
                    darkMode ? 'border-gray-700' : 'border-gray-100'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>Daily trending</span>
                      <span className={`text-sm font-medium ${
                        darkMode ? 'text-blue-400' : 'text-blue-600'
                      }`}>10,000+ repos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works - updated for dark mode */}
      <div id="how-it-works" className={`py-24 relative overflow-hidden ${
        darkMode
          ? 'bg-gray-800'
          : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50'
      }`}>
        {/* Background decoration - conditional based on theme */}
        {!darkMode && (
          <>
            <div className="absolute top-20 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-3000"></div>
            <div className="absolute bottom-20 -left-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-1000"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.07]"></div>
          </>
        )}
        
        {darkMode && (
          <>
            <div className="absolute top-20 -right-40 w-96 h-96 bg-purple-800 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-3000"></div>
            <div className="absolute bottom-20 -left-40 w-96 h-96 bg-indigo-800 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-1000"></div>
          </>
        )}
        
        {/* Process section content - update with dark mode conditionals */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:text-center">
            <div className={`inline-flex items-center p-1 rounded-full mb-3 animate-fadeIn ${
              darkMode ? 'bg-indigo-900' : 'bg-indigo-50'
            }`}>
              <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">PROCESS</span>
              <span className={`px-4 py-1 text-sm ${
                darkMode ? 'text-indigo-300' : 'text-indigo-600'
              }`}>How it all works</span>
            </div>
            <h2 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 animate-fadeIn">
              How AI Digest works
            </h2>
            <p className={`mt-4 max-w-2xl text-xl lg:mx-auto animate-fadeIn animation-delay-200 ${
              darkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>
              Our intelligent pipeline delivers high-quality AI insights through a sophisticated three-step process.
            </p>
          </div>
          
          {/* Steps section - update with dark mode conditionals */}
          <div className="mt-20">
            <div className="relative">              
              {/* Steps */}
              <div className="space-y-24 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-12">
                {/* Step 1 - Enhanced with better animations and effects - updated for dark mode */}
                <div className="relative group lg:perspective-1000">
                  <div className="lg:flex lg:items-start lg:flex-col">
                    <div className="flex-shrink-0 flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-xl group-hover:shadow-2xl transition-all duration-300 z-10 mx-auto mb-8 border-4 border-white group-hover:border-indigo-100 lg:translate-y-[-1rem] animate-slideInTop">
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold leading-none">01</span>
                        <div className="w-12 h-0.5 bg-white/50 my-1"></div>
                        <span className="text-xs font-medium uppercase tracking-wider">Collect</span>
                      </div>
                    </div>
                    <div className={`rounded-xl p-8 shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-1 relative z-20 lg:group-hover:rotate-y-3 animate-slideInRight border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 group-hover:bg-gradient-to-br group-hover:from-gray-800 group-hover:to-gray-900'
                        : 'bg-white border-gray-100 group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-indigo-50'
                    }`}>
                      <h3 className={`text-2xl leading-6 font-bold mb-4 text-center flex flex-col items-center ${
                        darkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}>
                        <span>Data Collection</span>
                        <div className="w-12 h-1 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full mt-3"></div>
                      </h3>
                      <p className={`text-base text-center mb-6 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Our intelligent crawlers continuously scan GitHub, Hugging Face, and ArXiv to identify and collect the latest AI repositories, models, and research papers as they're published. Using advanced filters and relevance algorithms, we prioritize high-quality content from reputable sources.
                      </p>
                      <div className="flex justify-center">
                        <div className={`flex space-x-2 items-center p-3 rounded-lg text-sm transition-all duration-300 ${
                          darkMode
                            ? 'bg-indigo-900 text-indigo-300 group-hover:bg-indigo-800 group-hover:shadow-md'
                            : 'bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100 group-hover:shadow-md'
                        }`}>
                          <svg className="w-5 h-5 group-hover:animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Updated multiple times daily</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Step 2 - Enhanced with better animations and effects - updated for dark mode */}
                <div className="relative group lg:perspective-1000">
                  <div className="lg:flex lg:items-start lg:flex-col">
                    <div className="flex-shrink-0 flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-xl group-hover:shadow-2xl transition-all duration-300 z-10 mx-auto mb-8 border-4 border-white group-hover:border-purple-100 animate-slideInTop animation-delay-400">
                      <div className="flex flex-col items-center justify-center relative">
                        <span className="text-3xl font-bold leading-none">02</span>
                        <div className="w-12 h-0.5 bg-white/50 my-1"></div>
                        <span className="text-xs font-medium uppercase tracking-wider">Process</span>
                      </div>
                    </div>
                    <div className={`rounded-xl p-8 shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-1 relative z-20 lg:group-hover:rotate-y-3 animate-slideInLeft animation-delay-300 border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 group-hover:bg-gradient-to-br group-hover:from-gray-800 group-hover:to-purple-900/50'
                        : 'bg-white border-gray-100 group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-purple-50'
                    }`}>
                      <h3 className={`text-2xl leading-6 font-bold mb-4 text-center flex flex-col items-center ${
                        darkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}>
                        <span>AI Processing</span>
                        <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mt-3"></div>
                      </h3>
                      <p className={`text-base text-center mb-6 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        State-of-the-art language models analyze and process the collected content, generating concise summaries, extracting key insights, and automatically assigning relevant categories and tags.
                      </p>
                      
                      {/* Processing stats with animated counter effect */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center">
                          <div className={`text-xl font-bold group-hover:animate-counter ${
                            darkMode ? 'text-purple-400' : 'text-purple-600'
                          }`} data-value="98">98%</div>
                          <div className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>Accuracy</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-xl font-bold group-hover:animate-counter ${
                            darkMode ? 'text-purple-400' : 'text-purple-600'
                          }`} data-value="5">5min</div>
                          <div className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>Processing time</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <div className={`flex space-x-2 items-center p-3 rounded-lg text-sm transition-all duration-300 ${
                          darkMode
                            ? 'bg-purple-900 text-purple-300 group-hover:bg-purple-800 group-hover:shadow-md'
                            : 'bg-purple-50 text-purple-700 group-hover:bg-purple-100 group-hover:shadow-md'
                        }`}>
                          <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span>Powered by advanced AI models</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Step 3 - Enhanced with better animations and effects - updated for dark mode */}
                <div className="relative group lg:mt-32 lg:perspective-1000">
                  <div className="lg:flex lg:items-start lg:flex-col">
                    <div className="flex-shrink-0 flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-700 text-white shadow-xl group-hover:shadow-2xl transition-all duration-300 z-10 mx-auto mb-8 border-4 border-white group-hover:border-indigo-100 lg:translate-y-[-1rem] animate-slideInTop animation-delay-800">
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold leading-none">03</span>
                        <div className="w-12 h-0.5 bg-white/50 my-1"></div>
                        <span className="text-xs font-medium uppercase tracking-wider">Deliver</span>
                      </div>
                    </div>
                    <div className={`rounded-xl p-8 shadow-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-1 relative z-20 lg:group-hover:rotate-y-3 animate-slideInRight animation-delay-600 border ${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 group-hover:bg-gradient-to-br group-hover:from-gray-800 group-hover:to-indigo-900/50'
                        : 'bg-white border-gray-100 group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-indigo-50'
                    }`}>
                      <h3 className={`text-2xl leading-6 font-bold mb-4 text-center flex flex-col items-center ${
                        darkMode ? 'text-gray-100' : 'text-gray-900'
                      }`}>
                        <span>Personalized Delivery</span>
                        <div className="w-12 h-1 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full mt-3"></div>
                      </h3>
                      <p className={`text-base text-center mb-6 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Our intelligent recommendation system delivers a personalized feed of AI digests tailored to your interests, ensuring you only see content that's relevant to your specific areas of focus.
                      </p>
                      
                      {/* Interactive interests display */}
                      <div className="flex flex-wrap justify-center gap-2 mb-6">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium group-hover:bg-blue-200 transition-colors">LLM</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium group-hover:bg-green-200 transition-colors">Computer Vision</span>
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium group-hover:bg-red-200 transition-colors">Research</span>
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium group-hover:bg-yellow-200 transition-colors">Tools</span>
                      </div>
                      
                      <div className="flex justify-center">
                        <div className={`flex space-x-2 items-center p-3 rounded-lg text-sm transition-all duration-300 ${
                          darkMode
                            ? 'bg-indigo-900 text-indigo-300 group-hover:bg-indigo-800 group-hover:shadow-md'
                            : 'bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100 group-hover:shadow-md'
                        }`}>
                          <svg className="w-5 h-5 group-hover:text-yellow-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                          <span>Customized to your preferences</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section - Enhanced with better animations and visual effects - dark mode by default */}
      <div className="relative overflow-hidden py-16 sm:py-24">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900"></div>
        
        {/* Animated glow effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse-slow animation-delay-2000"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-pulse-slow"></div>
        </div>
        
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white opacity-10 animate-floating"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 40 + 10}px`,
                height: `${Math.random() * 40 + 10}px`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 20 + 10}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* Background decorations with improved visual effects */}
        <div className="absolute top-0 left-0 -rotate-12 transform -translate-x-1/4 -translate-y-1/4 animate-rotate-slow">
          <div className="w-96 h-96 bg-white opacity-5 rounded-full border border-white/10"></div>
        </div>
        <div className="absolute bottom-0 right-0 rotate-12 transform translate-x-1/4 translate-y-1/4 animate-rotate-slow animation-direction-reverse">
          <div className="w-96 h-96 bg-white opacity-5 rounded-full border border-white/10"></div>
        </div>
        
        {/* Mesh gradient overlay for texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15]"></div>
        
        <div className="relative max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="animate-bounce-subtle">
            <div className="inline-block p-1 bg-white/10 rounded-full backdrop-blur-sm mb-6">
              <div className="px-4 py-1 rounded-full text-white text-sm font-medium flex items-center gap-2">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute h-2 w-2 rounded-full bg-white opacity-75"></span>
                  <span className="relative rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span>Join 50,000+ AI researchers and developers</span>
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl animate-glow">
            <span className="block">Ready to stay ahead in AI?</span>
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-100 animate-gradient-x">
              Start using AI Digest today.
            </span>
          </h2>
          
          <p className="mt-6 text-xl leading-7 text-indigo-100 animate-fadeIn animation-delay-200">
            Join the community of AI practitioners who rely on our digest to stay informed about the latest breakthroughs.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 animate-fadeIn animation-delay-400">
            <Link
              to="/signup"
              className="relative inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-indigo-700 bg-white hover:bg-indigo-50 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 group"
            >
              <span className="absolute -inset-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity"></span>
              <span className="relative flex items-center">
                Sign up for free
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </span>
            </Link>
            
            <a
              href="#features"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-base font-medium rounded-full text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/50"
            >
              Learn more
            </a>
          </div>
          
          {/* Trust markers */}
          <div className="mt-12 flex flex-wrap justify-center gap-x-12 gap-y-6 animate-fadeIn animation-delay-600">
            <div className="flex items-center text-white/80">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm">Secure login</span>
            </div>
            <div className="flex items-center text-white/80">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">Updated daily</span>
            </div>
            <div className="flex items-center text-white/80">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span className="text-sm">Satisfaction guaranteed</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - updated for dark mode */}
      <footer className={`${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto py-4 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className={`text-center text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            &copy; {new Date().toLocaleDateString('en-US', { year: 'numeric' })} AI Digest. All rights reserved.
          </p>
        </div>
      </footer>
      
      {/* Add animation keyframes for new effects */}
      <style jsx>{`
        @keyframes slideInTop {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInBottom {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gradientFlow {
          0% { background-position: 0% 0%; }
          100% { background-position: 0% 100%; }
        }
        
        .animate-slideInTop {
          animation: slideInTop 1s ease-out forwards;
        }
        
        .animate-slideInRight {
          animation: slideInRight 1s ease-out forwards;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 1s ease-out forwards;
        }
        
        .animate-slideInBottom {
          animation: slideInBottom 1s ease-out forwards;
        }
        
        .animate-gradientFlow {
          background-size: 100% 200%;
          animation: gradientFlow 3s linear infinite;
        }
        
        .lg\:group-hover\:rotate-y-3:hover {
          transform: rotateY(3deg);
        }
        
        .lg\:perspective-1000 {
          perspective: 1000px;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        
        @keyframes floating {
          0% { transform: translate(0, 0); }
          50% { transform: translate(10px, -10px); }
          100% { transform: translate(0, 0); }
        }
        
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 5px rgba(255, 255, 255, 0.5); }
          50% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-floating {
          animation: floating 8s ease-in-out infinite;
        }
        
        .animate-rotate-slow {
          animation: rotate-slow 40s linear infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 5s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        
        .animation-direction-reverse {
          animation-direction: reverse;
        }
      `}</style>
    </div>
  );
}

export default Landing;
