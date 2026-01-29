import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenNib, faSearch, faSpinner, faExclamationTriangle, faSort, faSortUp, faSortDown, faEnvelope, faPhone, faBook } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const AuthorsTable = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'authorName', direction: 'asc' });

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/authors`);
      const data = await response.json();
      setAuthors(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching authors:', error);
      toast.error('Failed to load authors');
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FontAwesomeIcon icon={faSort} className="ml-1 text-slate-500" />;
    return sortConfig.direction === 'asc' 
      ? <FontAwesomeIcon icon={faSortUp} className="ml-1 text-cyan-400" />
      : <FontAwesomeIcon icon={faSortDown} className="ml-1 text-cyan-400" />;
  };

  const sortedAuthors = [...authors].sort((a, b) => {
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredAuthors = sortedAuthors.filter(author =>
    author.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.authorEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <FontAwesomeIcon icon={faSpinner} className="text-4xl text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 animate-fadeIn">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-cyan-500/20 rounded-2xl mb-3">
          <FontAwesomeIcon icon={faPenNib} className="text-xl sm:text-2xl text-cyan-400" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
          All Authors
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">{authors.length} authors registered</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-9 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-700/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800/80">
              <th 
                className="px-4 py-3 text-left text-slate-300 font-semibold cursor-pointer hover:text-cyan-400 transition-colors"
                onClick={() => handleSort('authorName')}
              >
                Name {getSortIcon('authorName')}
              </th>
              <th 
                className="px-4 py-3 text-left text-slate-300 font-semibold cursor-pointer hover:text-cyan-400 transition-colors"
                onClick={() => handleSort('authorEmail')}
              >
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-cyan-400/50" />
                Email {getSortIcon('authorEmail')}
              </th>
              <th 
                className="px-4 py-3 text-left text-slate-300 font-semibold cursor-pointer hover:text-cyan-400 transition-colors"
                onClick={() => handleSort('authorPhone')}
              >
                <FontAwesomeIcon icon={faPhone} className="mr-2 text-cyan-400/50" />
                Phone {getSortIcon('authorPhone')}
              </th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">
                <FontAwesomeIcon icon={faBook} className="mr-2 text-cyan-400/50" />
                Books
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAuthors.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-slate-500">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                  No authors found
                </td>
              </tr>
            ) : (
              filteredAuthors.map((author, index) => (
                <tr 
                  key={author._id} 
                  className={`border-t border-slate-700/50 hover:bg-slate-800/50 transition-colors ${index % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/10'}`}
                >
                  <td className="px-4 py-3 text-slate-200 font-medium">{author.authorName}</td>
                  <td className="px-4 py-3 text-slate-400">{author.authorEmail || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-400">{author.authorPhone || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400">
                      {author.books?.length || 0} books
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filteredAuthors.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            No authors found
          </div>
        ) : (
          filteredAuthors.map((author) => (
            <div 
              key={author._id} 
              className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-slate-200 font-semibold text-sm">{author.authorName}</h3>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400">
                  <FontAwesomeIcon icon={faBook} className="mr-1" />
                  {author.books?.length || 0}
                </span>
              </div>
              
              <div className="space-y-2 text-xs">
                {author.authorEmail && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <FontAwesomeIcon icon={faEnvelope} className="text-cyan-400/50 w-4" />
                    <span className="truncate">{author.authorEmail}</span>
                  </div>
                )}
                {author.authorPhone && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <FontAwesomeIcon icon={faPhone} className="text-cyan-400/50 w-4" />
                    <span>{author.authorPhone}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AuthorsTable;
