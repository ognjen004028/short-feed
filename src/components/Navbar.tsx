import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Video, Info, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-zinc-900 border-b border-zinc-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Video className="w-6 h-6 text-red-500" />
            <span className="font-bold text-xl">Shorts</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/about" className="hover:text-red-500 flex items-center space-x-1">
              <Info className="w-5 h-5" />
              <span>About</span>
            </Link>
            
            {user ? (
              <>
                <Link to="/profile" className="hover:text-red-500 flex items-center space-x-1">
                  <User className="w-5 h-5" />
                  <span>@{user.username}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="hover:text-red-500 flex items-center space-x-1"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}