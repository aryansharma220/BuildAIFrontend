import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DigestDetails from './pages/DigestDetails';
import UserPreferences from './pages/UserPreferences';
import NotFound from './pages/NotFound';
import AuthDebugger from './components/AuthDebugger';
import { useEffect } from 'react';
import { checkFirebaseConfig } from './utils/firebaseChecker';

// Initialize the Firebase checker in development mode
if (import.meta.env.DEV) {
  checkFirebaseConfig().then(result => {
    console.log('Firebase check result:', result);
  });
}

function AppContent() {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  // Check API health when navigating to protected routes
  useEffect(() => {
    const checkApiHealth = async () => {
      if (currentUser && ['/dashboard', '/preferences'].some(path => location.pathname.startsWith(path))) {
        try {
          const { checkApiHealth } = useAuth();
          if (checkApiHealth) {
            await checkApiHealth();
          }
        } catch (error) {
          console.error('Error checking API health:', error);
        }
      }
    };
    
    checkApiHealth();
  }, [currentUser, location.pathname]);
  
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          currentUser ? <Navigate to="/dashboard" /> : <Landing />
        } />
        <Route path="/login" element={
          currentUser ? <Navigate to="/dashboard" /> : <Login />
        } />
        <Route path="/signup" element={
          currentUser ? <Navigate to="/dashboard" /> : <Signup />
        } />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />
        </Route>
        
        {/* Fix: Make digest/:id a direct child of the Layout route */}
        <Route path="/digest/:id" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<DigestDetails />} />
        </Route>
        
        <Route path="/preferences" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<UserPreferences />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Add the Auth Debugger - will only show in development */}
      {import.meta.env.DEV && <AuthDebugger />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
