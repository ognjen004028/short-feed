import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Video, Loader } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { signIn, signUp, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await signIn(username, password);
      } else {
        await signUp(username, email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Video className="w-12 h-12 text-red-500" />
        </div>
        
        <div className="bg-zinc-900 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                minLength={3}
                maxLength={20}
                pattern="^[a-zA-Z0-9_]+$"
                title="Username can only contain letters, numbers, and underscores"
              />
            </div>
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                minLength={6}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                isLogin ? 'Sign In' : 'Sign Up'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-400 hover:text-white"
              disabled={isLoading}
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}