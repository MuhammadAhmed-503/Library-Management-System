import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faSearch, faSpinner, faExclamationTriangle, faSort, faSortUp, faSortDown, faUser, faDollarSign, faTag } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const BooksTable = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/books`);
      const data = await response.json();
      setBooks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books');
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
      ? <FontAwesomeIcon icon={faSortUp} className="ml-1 text-emerald-400" />
      : <FontAwesomeIcon icon={faSortDown} className="ml-1 text-emerald-400" />;
  };

  const sortedBooks = [...books].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    if (sortConfig.key === 'authorName') {
      aValue = a.author?.authorName || '';
      bValue = b.author?.authorName || '';
    }
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredBooks = sortedBooks.filter(book =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <FontAwesomeIcon icon={faSpinner} className="text-4xl text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 animate-fadeIn">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500/20 rounded-2xl mb-3">
          <FontAwesomeIcon icon={faBook} className="text-xl sm:text-2xl text-emerald-400" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          All Books
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">{books.length} books in library</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-9 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
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
                className="px-4 py-3 text-left text-slate-300 font-semibold cursor-pointer hover:text-emerald-400 transition-colors"
                onClick={() => handleSort('title')}
              >
                Title {getSortIcon('title')}
              </th>
              <th 
                className="px-4 py-3 text-left text-slate-300 font-semibold cursor-pointer hover:text-emerald-400 transition-colors"
                onClick={() => handleSort('authorName')}
              >
                Author {getSortIcon('authorName')}
              </th>
              <th 
                className="px-4 py-3 text-left text-slate-300 font-semibold cursor-pointer hover:text-emerald-400 transition-colors"
                onClick={() => handleSort('category')}
              >
                Category {getSortIcon('category')}
              </th>
              <th 
                className="px-4 py-3 text-left text-slate-300 font-semibold cursor-pointer hover:text-emerald-400 transition-colors"
                onClick={() => handleSort('price')}
              >
                Price {getSortIcon('price')}
              </th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                  No books found
                </td>
              </tr>
            ) : (
              filteredBooks.map((book, index) => (
                <tr 
                  key={book._id} 
                  className={`border-t border-slate-700/50 hover:bg-slate-800/50 transition-colors ${index % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/10'}`}
                >
                  <td className="px-4 py-3 text-slate-200 font-medium">{book.title}</td>
                  <td className="px-4 py-3 text-slate-400">{book.author?.authorName || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-400">{book.category || 'N/A'}</td>
                  <td className="px-4 py-3 text-emerald-400 font-medium">${book.price}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      book.borrower 
                        ? 'bg-amber-500/20 text-amber-400' 
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {book.borrower ? 'Borrowed' : 'Available'}
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
        {filteredBooks.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            No books found
          </div>
        ) : (
          filteredBooks.map((book) => (
            <div 
              key={book._id} 
              className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-slate-200 font-semibold text-sm">{book.title}</h3>
                  <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                    <FontAwesomeIcon icon={faUser} className="text-slate-500" />
                    <span>{book.author?.authorName || 'N/A'}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  book.borrower 
                    ? 'bg-amber-500/20 text-amber-400' 
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {book.borrower ? 'Borrowed' : 'Available'}
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <FontAwesomeIcon icon={faTag} className="text-slate-500" />
                  <span>{book.category || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-emerald-400">
                  <FontAwesomeIcon icon={faDollarSign} className="text-xs" />
                  <span>{book.price}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BooksTable;
