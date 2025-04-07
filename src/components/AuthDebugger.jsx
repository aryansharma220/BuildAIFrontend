import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

// Component to debug authentication issues in development
function AuthDebugger() {
  const { currentUser, userToken, refreshToken } = useAuth();
  const [tokenDetails, setTokenDetails] = useState(null);
  const [showDebugger, setShowDebugger] = useState(false);
  
  // Only show in development
  if (!import.meta.env.DEV && !showDebugger) {
    return null;
  }
  
  if (!showDebugger) {
    return (
      <button 
        onClick={() => setShowDebugger(true)}
        className="fixed bottom-4 right-4 bg-gray-200 text-gray-800 p-2 rounded-full"
        style={{ zIndex: 9999 }}
      >
        🔑
      </button>
    );
  }
  
  const handleDecodeToken = () => {
    if (!userToken) return;
    
    try {
      // Basic JWT decode (without verification)
      const parts = userToken.split('.');
      if (parts.length !== 3) {
        setTokenDetails({ error: 'Invalid token format' });
        return;
      }
      
      const payload = JSON.parse(atob(parts[1]));
      setTokenDetails({
        header: JSON.parse(atob(parts[0])),
        payload,
        expiry: new Date(payload.exp * 1000).toLocaleString(),
        issuedAt: new Date(payload.iat * 1000).toLocaleString(),
      });
    } catch (err) {
      console.error('Error decoding token:', err);
      setTokenDetails({ error: 'Failed to decode token' });
    }
  };
  
  const handleTestRequest = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/user/profile`;
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`
        },
        credentials: import.meta.env.VITE_ALLOW_CREDENTIALS === 'true' ? 'include' : 'same-origin',
      });
      
      const data = await response.json();
      alert(`Status: ${response.status}\n${JSON.stringify(data, null, 2)}`);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 p-4 rounded-lg shadow-lg max-w-md max-h-[80vh] overflow-auto z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">Auth Debugger</h3>
        <button onClick={() => setShowDebugger(false)} className="text-gray-500">&times;</button>
      </div>
      
      <div className="space-y-3">
        <div className="p-2 bg-gray-100 rounded">
          <div><strong>User Logged In:</strong> {currentUser ? 'Yes' : 'No'}</div>
          {currentUser && (
            <>
              <div><strong>User ID:</strong> {currentUser.uid}</div>
              <div><strong>Email:</strong> {currentUser.email}</div>
              <div><strong>Name:</strong> {currentUser.displayName || 'Not set'}</div>
            </>
          )}
        </div>
        
        <div className="p-2 bg-gray-100 rounded">
          <div><strong>Token Available:</strong> {userToken ? 'Yes' : 'No'}</div>
          {userToken && (
            <div className="text-xs text-gray-500 truncate">
              {userToken.substring(0, 20)}...
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => refreshToken(currentUser)}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            disabled={!currentUser}
          >
            Refresh Token
          </button>
          
          <button 
            onClick={handleDecodeToken}
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
            disabled={!userToken}
          >
            Decode Token
          </button>
          
          <button 
            onClick={handleTestRequest}
            className="bg-green-500 text-white px-3 py-1 rounded text-sm"
            disabled={!userToken}
          >
            Test API
          </button>
        </div>
        
        {tokenDetails && (
          <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
            <div className="font-bold mb-1">Token Details:</div>
            {tokenDetails.error ? (
              <div className="text-red-500">{tokenDetails.error}</div>
            ) : (
              <>
                <div><strong>Expires:</strong> {tokenDetails.expiry}</div>
                <div><strong>Issued:</strong> {tokenDetails.issuedAt}</div>
                <details>
                  <summary className="cursor-pointer">Show Full Payload</summary>
                  <pre className="mt-2 bg-gray-800 text-white p-2 rounded overflow-auto">
                    {JSON.stringify(tokenDetails.payload, null, 2)}
                  </pre>
                </details>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthDebugger;
