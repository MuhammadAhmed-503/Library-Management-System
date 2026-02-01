import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faLock, faEnvelope, faPhone, faMapMarkerAlt, 
  faUserPlus, faArrowLeft, faSun, faMoon 
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import logo from '../../app_logo.png';

// InputField component defined OUTSIDE to prevent re-creation on every render
const InputField = ({ icon, name, type, placeholder, required, value, onChange, isDark }) => (
  <div className="relative">
    <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ${
      isDark ? 'text-slate-500' : 'text-slate-400'
    }`}>
      <FontAwesomeIcon icon={icon} />
    </div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      autoComplete="off"
      className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all duration-300 ${
        isDark
          ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
          : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
      }`}
    />
  </div>
);

const Register = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { login } = useAuth();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim() || !formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required fields');
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

    setIsLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URI || 'http://localhost:5000/api';
      console.log('Registering at:', `${apiUrl}/members/register`);
      
      const response = await fetch(`${apiUrl}/members/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        })
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (response.ok) {
        toast.success('Registration successful! Welcome to the library.');
        // Auto-login after successful registration
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.reload();
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(`Registration failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
        : 'bg-gradient-to-br from-slate-100 via-white to-slate-100'
    }`}>
      {/* Theme Toggle */}
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
        {/* Back Button */}
        <button
          onClick={onBackToLogin}
          className={`flex items-center gap-2 mb-6 transition-colors ${
            isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to Login</span>
        </button>

        {/* Logo and Title */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
            isDark
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-700'
              : 'bg-gradient-to-br from-emerald-400 to-emerald-600'
          }`}>
            <img src={logo} alt="App Logo" className="w-16 h-16" />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${
            isDark
              ? 'bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent'
              : 'text-slate-800'
          }`}>
            Create an Account
          </h1>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Join our library community
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Username <span className="text-red-500">*</span>
            </label>
            <InputField icon={faUser} name="username" type="text" placeholder="Choose a username" required value={formData.username} onChange={handleChange} isDark={isDark} />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Full Name <span className="text-red-500">*</span>
            </label>
            <InputField icon={faUser} name="name" type="text" placeholder="Your full name" required value={formData.name} onChange={handleChange} isDark={isDark} />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Email <span className="text-red-500">*</span>
            </label>
            <InputField icon={faEnvelope} name="email" type="email" placeholder="your@email.com" required value={formData.email} onChange={handleChange} isDark={isDark} />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Phone (Optional)
            </label>
            <InputField icon={faPhone} name="phone" type="tel" placeholder="Your phone number" value={formData.phone} onChange={handleChange} isDark={isDark} />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Address (Optional)
            </label>
            <InputField icon={faMapMarkerAlt} name="address" type="text" placeholder="Your address" value={formData.address} onChange={handleChange} isDark={isDark} />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Password <span className="text-red-500">*</span>
            </label>
            <InputField icon={faLock} name="password" type="password" placeholder="Choose a password (min 6 chars)" required value={formData.password} onChange={handleChange} isDark={isDark} />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <InputField icon={faLock} name="confirmPassword" type="password" placeholder="Confirm your password" required value={formData.confirmPassword} onChange={handleChange} isDark={isDark} />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
              isLoading
                ? 'bg-emerald-600/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faUserPlus} />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
