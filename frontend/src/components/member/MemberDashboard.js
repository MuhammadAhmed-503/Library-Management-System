import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, faSearch, faHistory, faUser, faBookOpen, 
  faCalendarAlt, faExclamationTriangle, faCheckCircle,
  faSync, faFilter
} from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const MemberDashboard = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [books, setBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const { isDark } = useTheme();
  const { token } = useAuth();

  useEffect(() => {
    if (activeTab === 'browse') {
      fetchBooks();
    } else if (activeTab === 'mybooks') {
      fetchMyBooks();
    } else if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      let url = `${process.env.REACT_APP_API_URI}/members/search-books?`;
      if (searchQuery) url += `query=${encodeURIComponent(searchQuery)}&`;
      if (categoryFilter) url += `category=${encodeURIComponent(categoryFilter)}&`;
      if (availableOnly) url += `available=true`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to fetch books');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyBooks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/members/my-books`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMyBooks(data);
      }
    } catch (error) {
      console.error('Error fetching my books:', error);
      toast.error('Failed to fetch your books');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/members/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Failed to fetch borrowing history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/members/borrow/${bookId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        fetchBooks();
        setSelectedBook(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
      toast.error('Failed to borrow book');
    }
  };

  const handleReturn = async (bookId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/members/return/${bookId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        fetchMyBooks();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error returning book:', error);
      toast.error('Failed to return book');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const TabButton = ({ tab, label, icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
        activeTab === tab
          ? isDark
            ? 'bg-emerald-600 text-white'
            : 'bg-emerald-500 text-white'
          : isDark
            ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
      }`}
    >
      <FontAwesomeIcon icon={icon} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="p-4 sm:p-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        <TabButton tab="browse" label="Browse Books" icon={faSearch} />
        <TabButton tab="mybooks" label="My Books" icon={faBookOpen} />
        <TabButton tab="history" label="History" icon={faHistory} />
      </div>

      {/* Browse Books Tab */}
      {activeTab === 'browse' && (
        <div>
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} 
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or category..."
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all ${
                    isDark
                      ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500'
                      : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-emerald-500'
                  }`}
                />
              </div>
              <div className="flex gap-2">
                <label className={`flex items-center gap-2 px-4 py-3 rounded-xl cursor-pointer ${
                  isDark ? 'bg-slate-800/50 text-slate-300' : 'bg-white text-slate-600'
                }`}>
                  <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                    className="accent-emerald-500"
                  />
                  <span className="text-sm">Available Only</span>
                </label>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Books Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faSync} className="animate-spin text-3xl text-emerald-500" />
              <p className={`mt-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Loading books...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <div
                  key={book._id}
                  className={`p-4 rounded-xl border transition-all hover:shadow-lg cursor-pointer ${
                    isDark
                      ? 'bg-slate-800/50 border-slate-700 hover:border-emerald-500/50'
                      : 'bg-white border-slate-200 hover:border-emerald-500'
                  }`}
                  onClick={() => setSelectedBook(book)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-xl ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                      <FontAwesomeIcon icon={faBook} className="text-emerald-500 text-xl" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      book.borrower
                        ? isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
                        : isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                    }`}>
                      {book.borrower ? 'Borrowed' : 'Available'}
                    </span>
                  </div>
                  <h3 className={`font-semibold text-lg mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {book.title}
                  </h3>
                  <p className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    by {book.author?.authorName || 'Unknown Author'}
                  </p>
                  {book.category && (
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {book.category}
                    </span>
                  )}
                </div>
              ))}
              {books.length === 0 && (
                <div className={`col-span-full text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <FontAwesomeIcon icon={faBook} className="text-4xl mb-4 opacity-50" />
                  <p>No books found. Try adjusting your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* My Books Tab */}
      {activeTab === 'mybooks' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Currently Borrowed Books ({myBooks.length}/5)
            </h2>
            <button
              onClick={fetchMyBooks}
              className={`p-2 rounded-lg transition-all ${
                isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <FontAwesomeIcon icon={faSync} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faSync} className="animate-spin text-3xl text-emerald-500" />
            </div>
          ) : myBooks.length > 0 ? (
            <div className="space-y-4">
              {myBooks.map((item) => (
                <div
                  key={item._id}
                  className={`p-4 rounded-xl border ${
                    isOverdue(item.dueDate)
                      ? isDark ? 'border-red-500/50 bg-red-500/10' : 'border-red-200 bg-red-50'
                      : isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                        <FontAwesomeIcon icon={faBookOpen} className="text-emerald-500 text-xl" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {item.book?.title || 'Unknown Book'}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          by {item.book?.author?.authorName || 'Unknown Author'}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                            Borrowed: {formatDate(item.borrowedDate)}
                          </span>
                          <span className={isOverdue(item.dueDate) 
                            ? 'text-red-500 font-medium' 
                            : isDark ? 'text-slate-500' : 'text-slate-500'
                          }>
                            <FontAwesomeIcon icon={isOverdue(item.dueDate) ? faExclamationTriangle : faCalendarAlt} className="mr-1" />
                            Due: {formatDate(item.dueDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleReturn(item.book?._id)}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-all"
                    >
                      Return Book
                    </button>
                  </div>
                  {isOverdue(item.dueDate) && (
                    <div className={`mt-3 p-2 rounded-lg text-sm ${
                      isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
                    }`}>
                      <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                      This book is overdue. Please return it as soon as possible.
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <FontAwesomeIcon icon={faBookOpen} className="text-4xl mb-4 opacity-50" />
              <p>You haven't borrowed any books yet.</p>
              <button
                onClick={() => setActiveTab('browse')}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all"
              >
                Browse Books
              </button>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Borrowing History
            </h2>
            <button
              onClick={fetchHistory}
              className={`p-2 rounded-lg transition-all ${
                isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <FontAwesomeIcon icon={faSync} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faSync} className="animate-spin text-3xl text-emerald-500" />
            </div>
          ) : history.length > 0 ? (
            <div className={`rounded-xl border overflow-hidden ${
              isDark ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <table className="w-full">
                <thead className={isDark ? 'bg-slate-800' : 'bg-slate-50'}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Book</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Borrowed</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Returned</th>
                    <th className={`px-4 py-3 text-left text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {history.map((item, index) => (
                    <tr key={index} className={isDark ? 'bg-slate-800/30' : 'bg-white'}>
                      <td className={`px-4 py-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        <div>
                          <p className="font-medium">{item.book?.title || 'Unknown Book'}</p>
                          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                            {item.book?.author?.authorName || 'Unknown Author'}
                          </p>
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {formatDate(item.borrowedDate)}
                      </td>
                      <td className={`px-4 py-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {item.returnedDate ? formatDate(item.returnedDate) : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'returned'
                            ? isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                            : isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
                        }`}>
                          <FontAwesomeIcon icon={item.status === 'returned' ? faCheckCircle : faBookOpen} className="text-xs" />
                          {item.status === 'returned' ? 'Returned' : 'Borrowed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <FontAwesomeIcon icon={faHistory} className="text-4xl mb-4 opacity-50" />
              <p>No borrowing history yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Book Details Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-2xl shadow-2xl ${
            isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-4 rounded-xl ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                  <FontAwesomeIcon icon={faBook} className="text-emerald-500 text-2xl" />
                </div>
                <div className="flex-1">
                  <h2 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {selectedBook.title}
                  </h2>
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    by {selectedBook.author?.authorName || 'Unknown Author'}
                  </p>
                </div>
              </div>

              <div className={`space-y-3 mb-6 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {selectedBook.category && (
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>Category:</span>
                    <span>{selectedBook.category}</span>
                  </div>
                )}
                {selectedBook.price && (
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>Price:</span>
                    <span>${selectedBook.price}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>Status:</span>
                  <span className={selectedBook.borrower 
                    ? 'text-red-500' 
                    : 'text-green-500'
                  }>
                    {selectedBook.borrower ? 'Currently Borrowed' : 'Available'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedBook(null)}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all ${
                    isDark
                      ? 'bg-slate-700 hover:bg-slate-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  Close
                </button>
                {!selectedBook.borrower && (
                  <button
                    onClick={() => handleBorrow(selectedBook._id)}
                    className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-all"
                  >
                    Borrow Book
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDashboard;
