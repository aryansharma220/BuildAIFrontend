import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { fetchUserProfile, updateUserPreferences, fetchCategories } from '../services/api';
import toast from 'react-hot-toast';
import { CheckIcon, AdjustmentsHorizontalIcon, BellIcon, ClockIcon, TagIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Remove the problematic import and create our own switch component
function CustomSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`${
        checked ? 'bg-indigo-600' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`${
          checked ? 'translate-x-6' : 'translate-x-1'
        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
      />
    </button>
  );
}

function UserPreferences() {
  const { userToken } = useAuth();
  const { darkMode } = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [digestFrequency, setDigestFrequency] = useState('daily');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [activeTab, setActiveTab] = useState('categories');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [profileData, categoriesData] = await Promise.all([
          fetchUserProfile(userToken),
          fetchCategories()
        ]);
        
        setProfile(profileData);
        setCategories(categoriesData);
        
        if (profileData.preferences) {
          setSelectedCategories(profileData.preferences.categories || []);
          setDigestFrequency(profileData.preferences.digestFrequency || 'daily');
          setNotificationsEnabled(profileData.preferences.notificationsEnabled !== false);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load user preferences');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (userToken) {
      fetchData();
    }
  }, [userToken]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setSaveSuccess(false);
      
      const updatedPreferences = {
        categories: selectedCategories,
        digestFrequency,
        notificationsEnabled
      };
      
      // Use the previously fixed API call
      await updateUserPreferences(updatedPreferences);
      setSaveSuccess(true);
      toast.success('Preferences saved successfully!');
      
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving preferences:', err);
      toast.error('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
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
        }`}>Loading your preferences...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`p-6 rounded-xl shadow-md ${
        darkMode ? 'bg-red-900/30 border border-red-800' : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error loading preferences</h3>
            <p className="text-red-700">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen relative overflow-hidden pb-12 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-b from-indigo-50 via-white to-white'
    }`}>
      {!darkMode && (
        <>
          <div className="absolute top-20 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-3000"></div>
          <div className="absolute bottom-20 -left-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-1000"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.07]"></div>
        </>
      )}
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fadeIn">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-12 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <AdjustmentsHorizontalIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${
                darkMode ? 'text-white' : 'bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600'
              }`}>
                User Preferences
              </h1>
              <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Customize your AI digest experience and get personalized content
              </p>
            </div>
          </div>
          
          {profile && (
            <div className={`shadow-sm rounded-xl p-4 border flex items-center ${
              darkMode 
                ? 'bg-gray-800/70 backdrop-blur-sm border-gray-700' 
                : 'bg-white/70 backdrop-blur-sm border-gray-100'
            }`}>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                {profile.name?.[0] || profile.email?.[0] || 'U'}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{profile.name || 'User'}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{profile.email}</p>
              </div>
              <div className="ml-auto">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  darkMode ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {profile.preferences?.digestFrequency || 'Daily'} digest
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className={`shadow-xl rounded-2xl border overflow-hidden animate-slideInUp ${
          darkMode 
            ? 'bg-gray-800/80 backdrop-filter backdrop-blur-sm border-gray-700' 
            : 'bg-white/80 backdrop-filter backdrop-blur-sm border-gray-100'
        }`}>
          <div className={`flex border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-4 text-sm font-medium flex items-center ${
                activeTab === 'categories' 
                  ? `${darkMode ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-indigo-600 border-b-2 border-indigo-600'}` 
                  : `${darkMode ? 'text-gray-400 hover:text-gray-300 hover:border-b-2 hover:border-gray-600' : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'}`
              }`}
            >
              <TagIcon className="h-5 w-5 mr-2" />
              Categories
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-6 py-4 text-sm font-medium flex items-center ${
                activeTab === 'notifications' 
                  ? `${darkMode ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-indigo-600 border-b-2 border-indigo-600'}` 
                  : `${darkMode ? 'text-gray-400 hover:text-gray-300 hover:border-b-2 hover:border-gray-600' : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'}`
              }`}
            >
              <BellIcon className="h-5 w-5 mr-2" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('frequency')}
              className={`px-6 py-4 text-sm font-medium flex items-center ${
                activeTab === 'frequency' 
                  ? `${darkMode ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-indigo-600 border-b-2 border-indigo-600'}` 
                  : `${darkMode ? 'text-gray-400 hover:text-gray-300 hover:border-b-2 hover:border-gray-600' : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'}`
              }`}
            >
              <ClockIcon className="h-5 w-5 mr-2" />
              Frequency
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <div className={activeTab === 'categories' ? 'block' : 'hidden'}>
                <div className="mb-4">
                  <h2 className={`text-lg font-semibold mb-2 flex items-center ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    <TagIcon className={`h-5 w-5 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    Categories of Interest
                  </h2>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Select the categories you're interested in to personalize your digest.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <div
                        key={category.category}
                        onClick={() => toggleCategory(category.category)}
                        className={`flex items-center p-3 rounded-lg border transition-all cursor-pointer ${
                          selectedCategories.includes(category.category)
                            ? `${darkMode ? 'bg-indigo-900/30 border-indigo-800 shadow-sm' : 'bg-indigo-50 border-indigo-200 shadow-sm'}`
                            : `${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`
                        }`}
                      >
                        <div className={`flex-shrink-0 h-5 w-5 rounded flex items-center justify-center mr-3 ${
                          selectedCategories.includes(category.category)
                            ? `${darkMode ? 'bg-indigo-400 text-gray-900' : 'bg-indigo-600 text-white'}`
                            : `${darkMode ? 'border border-gray-600' : 'border border-gray-300'}`
                        }`}>
                          {selectedCategories.includes(category.category) && (
                            <CheckIcon className="h-3 w-3" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{category.category}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          darkMode ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {category.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className={activeTab === 'notifications' ? 'block' : 'hidden'}>
                <div className="mb-4">
                  <h2 className={`text-lg font-semibold mb-2 flex items-center ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    <BellIcon className={`h-5 w-5 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    Notification Preferences
                  </h2>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Control how and when you want to receive notifications about new digests.
                  </p>
                  
                  <div className="space-y-4">
                    <div className={`rounded-lg border p-4 flex items-center justify-between ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <div>
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Email Notifications</h3>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receive digest updates in your inbox</p>
                      </div>
                      <CustomSwitch
                        checked={notificationsEnabled}
                        onChange={setNotificationsEnabled}
                      />
                    </div>
                    
                    <div className={`rounded-lg border p-4 flex items-center justify-between opacity-50 ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <div>
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Push Notifications</h3>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receive alerts on your browser</p>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        darkMode ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                      }`}>
                        Coming soon
                      </div>
                    </div>
                    
                    <div className={`rounded-lg border p-4 flex items-center justify-between opacity-50 ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <div>
                        <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>SMS Notifications</h3>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Get text messages for important updates</p>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        darkMode ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                      }`}>
                        Coming soon
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={activeTab === 'frequency' ? 'block' : 'hidden'}>
                <div className="mb-4">
                  <h2 className={`text-lg font-semibold mb-2 flex items-center ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    <ClockIcon className={`h-5 w-5 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    Digest Frequency
                  </h2>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Choose how often you want to receive your personalized AI digest.
                  </p>
                  
                  <div className="space-y-3">
                    <div
                      onClick={() => setDigestFrequency('daily')}
                      className={`relative rounded-lg border px-5 py-4 cursor-pointer transition-all ${
                        digestFrequency === 'daily'
                          ? `${darkMode ? 'bg-indigo-900/30 border-indigo-800 shadow-sm' : 'bg-indigo-50 border-indigo-200 shadow-sm'}`
                          : `${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-4 w-4 rounded-full border flex items-center justify-center ${
                            digestFrequency === 'daily'
                              ? `${darkMode ? 'bg-indigo-400 border-transparent' : 'bg-indigo-600 border-transparent'}`
                              : `${darkMode ? 'border-gray-600' : 'border-gray-300'}`
                          }`}>
                            {digestFrequency === 'daily' && (
                              <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-gray-900' : 'bg-white'}`}></div>
                            )}
                          </div>
                          <div className="ml-3">
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Daily Digest</h3>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receive updates every day</p>
                          </div>
                        </div>
                        <ChevronRightIcon className={`h-5 w-5 ${
                          digestFrequency === 'daily' ? `${darkMode ? 'text-indigo-400' : 'text-indigo-600'}` : `${darkMode ? 'text-gray-500' : 'text-gray-400'}`
                        }`} />
                      </div>
                    </div>
                    
                    <div
                      onClick={() => setDigestFrequency('weekly')}
                      className={`relative rounded-lg border px-5 py-4 cursor-pointer transition-all ${
                        digestFrequency === 'weekly'
                          ? `${darkMode ? 'bg-indigo-900/30 border-indigo-800 shadow-sm' : 'bg-indigo-50 border-indigo-200 shadow-sm'}`
                          : `${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-4 w-4 rounded-full border flex items-center justify-center ${
                            digestFrequency === 'weekly'
                              ? `${darkMode ? 'bg-indigo-400 border-transparent' : 'bg-indigo-600 border-transparent'}`
                              : `${darkMode ? 'border-gray-600' : 'border-gray-300'}`
                          }`}>
                            {digestFrequency === 'weekly' && (
                              <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-gray-900' : 'bg-white'}`}></div>
                            )}
                          </div>
                          <div className="ml-3">
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Weekly Digest</h3>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receive a summary once a week</p>
                          </div>
                        </div>
                        <ChevronRightIcon className={`h-5 w-5 ${
                          digestFrequency === 'weekly' ? `${darkMode ? 'text-indigo-400' : 'text-indigo-600'}` : `${darkMode ? 'text-gray-500' : 'text-gray-400'}`
                        }`} />
                      </div>
                    </div>
                    
                    <div
                      className={`relative rounded-lg border px-5 py-4 opacity-60 ${
                        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-4 w-4 rounded-full border ${
                            darkMode ? 'border-gray-600' : 'border-gray-300'
                          }`}>
                          </div>
                          <div className="ml-3">
                            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>Monthly Digest</h3>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receive a monthly summary</p>
                          </div>
                        </div>
                        <div className={`px-2 py-1 text-xs rounded-full ${
                          darkMode ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                        }`}>
                          Coming soon
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`px-6 py-4 border-t flex justify-between items-center ${
              darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <div className={`transition-all duration-300 ${saveSuccess ? 'opacity-100' : 'opacity-0'}`}>
                <div className={`flex items-center ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  <CheckIcon className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">Preferences saved!</span>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={saving}
                className={`inline-flex justify-center items-center py-2.5 px-6 border border-transparent shadow-sm text-sm font-medium rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-300 transform hover:-translate-y-0.5 ${
                  darkMode ? 'hover:from-indigo-500 hover:to-purple-500 focus:ring-indigo-400' : ''
                }`}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Preferences'
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn animation-delay-300">
          <div className={`rounded-xl shadow-sm p-5 border ${
            darkMode 
              ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700' 
              : 'bg-white/80 backdrop-blur-sm border-gray-100'
          }`}>
            <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              About Personalized Digests
            </h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Our AI uses your category preferences to tailor content specifically to your interests.
              The more categories you select, the more diverse your digest will be.
            </p>
          </div>
          
          <div className={`rounded-xl shadow-sm p-5 border ${
            darkMode 
              ? 'bg-gray-800/80 backdrop-blur-sm border-gray-700' 
              : 'bg-white/80 backdrop-blur-sm border-gray-100'
          }`}>
            <h3 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
              Digest Privacy
            </h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Your preference data is only used to personalize your content. We never share your
              personal information with third parties.
            </p>
          </div>
        </div>
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
        
        .animation-delay-300 {
          animation-delay: 0.3s;
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

export default UserPreferences;
