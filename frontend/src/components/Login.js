import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faSignInAlt, faBook, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import logo from '../app_logo.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    const result = await login(username, password);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-br from-slate-100 via-white to-slate-100'
    }`}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 ${
          isDark 
            ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' 
            : 'bg-white text-slate-800 hover:bg-slate-100 shadow-lg'
        }`}
      >
        <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="text-xl" />
      </button>

      <div className={`w-full max-w-md transition-colors duration-300 ${
        isDark 
          ? 'bg-slate-900/80 backdrop-blur-xl border-slate-800/50' 
          : 'bg-white/90 backdrop-blur-xl border-slate-200'
      } rounded-2xl shadow-2xl border p-8`}>
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 ${
            isDark 
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-700' 
              : 'bg-gradient-to-br from-emerald-400 to-emerald-600'
          }`}>
            <img src={logo} alt="App Logo" className="w-20 h-20" />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${
            isDark 
              ? 'bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent' 
              : 'text-slate-800'
          }`}>
            Library Management System
          </h1>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Sign in to continue
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Username
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}>
                <FontAwesomeIcon icon={faUser} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20' 
                    : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                }`}
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Password
            </label>
            <div className="relative">
              <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}>
                <FontAwesomeIcon icon={faLock} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20' 
                    : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                }`}
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              isLoading 
                ? 'bg-slate-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 hover:shadow-lg hover:shadow-emerald-500/30'
            } text-white`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSignInAlt} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className={`mt-8 pt-6 border-t text-center text-sm ${
          isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-500'
        }`}>
          <p>Admin: Use credentials from .env file</p>
          <p className="mt-1">Librarians: Use credentials set by admin</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
