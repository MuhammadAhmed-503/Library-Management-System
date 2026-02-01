import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUsers, faUserTie, faBookOpen, faUserSlash, faLayerGroup, faSync } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext';

const Home = ({showBooks,showAuthors,showBorrowers,showBorrowersWithoutBook,showCheckoutBooks,showRemainingBooks}) => {
  const [counts, setCounts] = useState({
    books: 0,
    authors: 0,
    borrowers: 0,
    booksWithBorrower: 0,
    borrowersWithoutBook: 0,
  });
  const [forceUpdate, setForceUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchCounts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URI}/counts`);
        if (response.ok) {
          const data = await response.json();
          const parsedData = {
            books: parseInt(data.books) || 0,
            authors: parseInt(data.authors) || 0,
            borrowers: parseInt(data.borrowers) || 0,
            booksWithBorrower: parseInt(data.booksWithBorrower) || 0,
            borrowersWithoutBook: parseInt(data.borrowersWithoutBook) || 0,
          };
          setCounts(parsedData);
        } else {
          console.error('Failed to fetch counts:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching counts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, [forceUpdate]);

  const triggerUpdate = () => {
    setForceUpdate((prev) => !prev);
  };

  const StatCard = ({ title, count, onClickHandle, icon, gradient, delay }) => {
    return (
      <div
        className={`group relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fadeIn`}
        style={{ animationDelay: `${delay}ms` }}
        onClick={onClickHandle}
        tabIndex={0}
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-90`}></div>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-lg sm:rounded-xl backdrop-blur-sm">
              <FontAwesomeIcon icon={icon} className="text-lg sm:text-2xl text-white" />
            </div>
            <span className="text-2xl sm:text-4xl font-bold text-white">{isLoading ? '...' : count}</span>
          </div>
          <h3 className="text-white/90 font-medium text-sm sm:text-lg">{title}</h3>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -bottom-4 -right-4 w-16 sm:w-24 h-16 sm:h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
      </div>
    );
  };
  

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 animate-fadeIn">
          <h1 className={`text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 ${
            isDark 
              ? 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-emerald-600 via-cyan-600 to-amber-600 bg-clip-text text-transparent'
          }`}>
            Welcome to Library Management System
          </h1>
          <p className={`text-sm sm:text-lg lg:text-xl max-w-2xl mx-auto px-4 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Your complete solution for managing books, authors, and borrowers efficiently
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <StatCard 
            title="Total Books" 
            count={counts.books} 
            onClickHandle={showBooks}
            icon={faBook}
            gradient="from-emerald-600 to-emerald-800"
            delay={100}
          />
          <StatCard 
            title="Total Authors" 
            count={counts.authors} 
            onClickHandle={showAuthors}
            icon={faUserTie}
            gradient="from-cyan-600 to-cyan-800"
            delay={200}
          />
          <StatCard 
            title="Total Borrowers" 
            count={counts.borrowers} 
            onClickHandle={showBorrowers}
            icon={faUsers}
            gradient="from-violet-600 to-violet-800"
            delay={300}
          />
          <StatCard 
            title="Checked Out Books" 
            count={counts.booksWithBorrower} 
            onClickHandle={showCheckoutBooks}
            icon={faBookOpen}
            gradient="from-amber-600 to-amber-800"
            delay={400}
          />
          <StatCard 
            title="Borrowers without Books" 
            count={counts.borrowersWithoutBook} 
            onClickHandle={showBorrowersWithoutBook}
            icon={faUserSlash}
            gradient="from-rose-600 to-rose-800"
            delay={500}
          />
          <StatCard 
            title="Available Books" 
            count={parseInt(counts.books) - parseInt(counts.booksWithBorrower)} 
            onClickHandle={showRemainingBooks}
            icon={faLayerGroup}
            gradient="from-teal-600 to-teal-800"
            delay={600}
          />
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center">
          <button 
            onClick={triggerUpdate} 
            className={`group flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 border rounded-xl transition-all duration-300 shadow-lg text-sm sm:text-base ${
              isDark 
                ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-600/50 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 hover:shadow-emerald-500/20' 
                : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-emerald-500/50 text-slate-600 hover:text-emerald-600 hover:shadow-emerald-500/10'
            } ${isLoading ? 'animate-pulse' : ''}`}
          >
            <FontAwesomeIcon icon={faSync} className={`transition-transform duration-500 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
            <span className="font-medium">Refresh Statistics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
