import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUser, faLock, faEnvelope, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const AddLibrarian = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const { isDark } = useTheme();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.name || !formData.email) {
      toast.error('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/auth/librarians`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          name: formData.name,
          email: formData.email
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Librarian added successfully!');
        setFormData({
          username: '',
          password: '',
          confirmPassword: '',
          name: '',
          email: ''
        });
      } else {
        toast.error(data.message || 'Failed to add librarian');
      }
    } catch (error) {
      console.error('Add librarian error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = `w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 ${
    isDark 
      ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20' 
      : 'bg-slate-50 border-slate-300 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
  }`;

  const labelClasses = `block text-sm font-medium mb-2 ${
    isDark ? 'text-slate-300' : 'text-slate-700'
  }`;

  const iconClasses = `absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${
    isDark ? 'text-slate-500' : 'text-slate-400'
  }`;

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
          isDark 
            ? 'bg-gradient-to-br from-indigo-500 to-indigo-700' 
            : 'bg-gradient-to-br from-indigo-400 to-indigo-600'
        }`}>
          <FontAwesomeIcon icon={faUserPlus} className="text-2xl text-white" />
        </div>
        <h2 className={`text-2xl font-bold ${
          isDark ? 'text-white' : 'text-slate-800'
        }`}>
          Add New Librarian
        </h2>
        <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Create login credentials for a new librarian
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
        {/* Full Name */}
        <div>
          <label className={labelClasses}>Full Name</label>
          <div className="relative">
            <div className={iconClasses}>
              <FontAwesomeIcon icon={faIdCard} />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Enter full name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={labelClasses}>Email Address</label>
          <div className="relative">
            <div className={iconClasses}>
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Enter email address"
            />
          </div>
        </div>

        {/* Username */}
        <div>
          <label className={labelClasses}>Username</label>
          <div className="relative">
            <div className={iconClasses}>
              <FontAwesomeIcon icon={faUser} />
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Choose a username"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className={labelClasses}>Password</label>
          <div className="relative">
            <div className={iconClasses}>
              <FontAwesomeIcon icon={faLock} />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Create a password (min 6 characters)"
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className={labelClasses}>Confirm Password</label>
          <div className="relative">
            <div className={iconClasses}>
              <FontAwesomeIcon icon={faLock} />
            </div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Confirm password"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            isLoading 
              ? 'bg-slate-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 hover:shadow-lg hover:shadow-indigo-500/30'
          } text-white mt-6`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Adding Librarian...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faUserPlus} />
              Add Librarian
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddLibrarian;
