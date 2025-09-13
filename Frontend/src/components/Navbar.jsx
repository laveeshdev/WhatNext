import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  console.log('Navbar user (context):', user);
  let storedUser = null;
  try {
    const raw = localStorage.getItem('user');
    if (raw && raw !== 'undefined') storedUser = JSON.parse(raw);
  } catch (e) {
    console.error('Error parsing user from localStorage in Navbar:', e);
  }
  const displayedUser = user || storedUser;
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left side: User info */}
        <div className="flex items-center space-x-2">
          {displayedUser ? (
            <>
              <span className="font-bold">{displayedUser.name}</span>
              <span className="text-gray-300 text-sm">{displayedUser.email}</span>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <span className="font-bold">Guest</span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
