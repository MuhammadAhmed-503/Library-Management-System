import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faSearch, faSpinner, faExclamationTriangle, faSort, faSortUp, faSortDown, faUser, faCalendarAlt, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const BorrowedBooksTable = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/books/borrowed`);
      const data = await response.json();
      setBorrowedBooks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
      toast.error('Failed to load borrowed books');
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
      ? <FontAwesomeIcon icon={faSortUp} className="ml-1 text-amber-400" />
      : <FontAwesomeIcon icon={faSortDown} className="ml-1 text-amber-400" />;
  };

  const sortedBooks = [...borrowedBooks].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    if (sortConfig.key === 'borrowerName') {
      aValue = a.borrower?.borrowerName || '';
      bValue = b.borrower?.borrowerName || '';
    }
    if (sortConfig.key === 'authorName') {
      aValue = a.author?.authorName || '';
      bValue = b.author?.authorName || '';
    }
    if (sortConfig.key === 'borrowedDate') {
      aValue = new Date(a.borrowedDate || 0);
      bValue = new Date(b.borrowedDate || 0);
    }
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredBooks = sortedBooks.filter(book =>
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.borrower?.borrowerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.authorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <FontAwesomeIcon icon={faSpinner} className="text-4xl text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 animate-fadeIn">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-amber-500/20 rounded-2xl mb-3">
          <FontAwesomeIcon icon={faBookOpen} className="text-xl sm:text-2xl text-amber-400" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
          Borrowed Books
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">{borrowedBooks.length} books currently borrowed</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-9 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
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
                className="px-4 py-3 text-left text-slate-300 font-semibold cursor-pointer hover:text-amber-400 transition-colors"
                onClick={() => handleSort('title')}
              >
                Book Title {getSortIcon('title')}
              </th>
              <th 
                className="px-4 py-3 text-left text-slate-300 font-semibold cursor-pointer hover:text-amber-400 transition-colors"
                onClick={() => handleSort('authorName')}
              >
                Author {getSortIcon('authorName')}
              </th>
              <th 
                className="px-4 py-3 text-left text-slate-300 font-semibold cursor-pointer hover:text-amber-400 transition-colors"
                onClick={() => handleSort('borrowerName')}
              >
                <FontAwesomeIcon icon={faUser} className="mr-2 text-amber-400/50" />
                Borrower {getSortIcon('borrowerName')}
              </th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">
                Contact
              </th>
              <th 
                className="px-4 py-3 text-left text-slate-300 font-semibold cursor-pointer hover:text-amber-400 transition-colors"
                onClick={() => handleSort('borrowedDate')}
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-amber-400/50" />
                Borrowed Date {getSortIcon('borrowedDate')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                  No borrowed books found
                </td>
              </tr>
            ) : (
              filteredBooks.map((book, index) => (
                <tr 
                  key={book._id} 
                  className={`border-t border-slate-700/50 hover:bg-slate-800/50 transition-colors ${index % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/10'}`}
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-slate-200 font-medium">{book.title}</p>
                      <p className="text-slate-500 text-xs">{book.category || 'Uncategorized'}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{book.author?.authorName || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <span className="text-amber-400 font-medium">{book.borrower?.borrowerName || 'N/A'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs">
                      <p className="text-slate-400">{book.borrower?.borrowerEmail || 'N/A'}</p>
                      <p className="text-slate-500">{book.borrower?.borrowerPhone || ''}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
                      {formatDate(book.borrowedDate)}
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
            No borrowed books found
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
                  <p className="text-slate-500 text-xs">{book.category || 'Uncategorized'}</p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 whitespace-nowrap ml-2">
                  {formatDate(book.borrowedDate)}
                </span>
              </div>
              
              <div className="text-xs text-slate-400">
                <span className="text-slate-500">Author:</span> {book.author?.authorName || 'N/A'}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} className="text-amber-400/60 text-xs" />
                  <span className="text-amber-400 font-medium text-sm">{book.borrower?.borrowerName || 'N/A'}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 text-xs">
                {book.borrower?.borrowerEmail && (
                  <div className="flex items-center gap-1 text-slate-400">
                    <FontAwesomeIcon icon={faEnvelope} className="text-slate-500" />
                    <span className="truncate max-w-[150px]">{book.borrower.borrowerEmail}</span>
                  </div>
                )}
                {book.borrower?.borrowerPhone && (
                  <div className="flex items-center gap-1 text-slate-400">
                    <FontAwesomeIcon icon={faPhone} className="text-slate-500" />
                    <span>{book.borrower.borrowerPhone}</span>
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

export default BorrowedBooksTable;
