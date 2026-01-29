import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faSearch, faSpinner, faExclamationTriangle, faSort, faSortUp, faSortDown, faEnvelope, faPhone, faBook } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const BorrowersTable = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'borrowerName', direction: 'asc' });

  useEffect(() => {
    fetchBorrowers();
  }, []);

  const fetchBorrowers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/borrowers`);
      const data = await response.json();
      setBorrowers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching borrowers:', error);
      toast.error('Failed to load borrowers');
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
      ? <FontAwesomeIcon icon={faSortUp} className="ml-1 text-violet-400" />
      : <FontAwesomeIcon icon={faSortDown} className="ml-1 text-violet-400" />;
  };

  const sortedBorrowers = [...borrowers].sort((a, b) => {
    const aValue = a[sortConfig.key] || '';
    const bValue = b[sortConfig.key] || '';
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredBorrowers = sortedBorrowers.filter(borrower =>
    borrower.borrowerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrower.borrowerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    borrower.borrowerPhone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <FontAwesomeIcon icon={faSpinner} className="text-4xl text-violet-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 animate-fadeIn">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-violet-500/20 rounded-2xl mb-3">
          <FontAwesomeIcon icon={faUsers} className="text-xl sm:text-2xl text-violet-400" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
          All Borrowers
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">{borrowers.length} registered members</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <FontAwesomeIcon icon={faSearch} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-9 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
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
                className="px-4 py-3 text-left text-slate-300 font-semibold cursor-pointer hover:text-violet-400 transition-colors"
                onClick={() => handleSort('borrowerName')}
              >
                Name {getSortIcon('borrowerName')}
              </th>
              <th 
                className="px-4 py-3 text-left text-slate-300 font-semibold cursor-pointer hover:text-violet-400 transition-colors"
                onClick={() => handleSort('borrowerEmail')}
              >
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-violet-400/50" />
                Email {getSortIcon('borrowerEmail')}
              </th>
              <th 
                className="px-4 py-3 text-left text-slate-300 font-semibold cursor-pointer hover:text-violet-400 transition-colors"
                onClick={() => handleSort('borrowerPhone')}
              >
                <FontAwesomeIcon icon={faPhone} className="mr-2 text-violet-400/50" />
                Phone {getSortIcon('borrowerPhone')}
              </th>
              <th className="px-4 py-3 text-left text-slate-300 font-semibold">
                Books Borrowed
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBorrowers.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-slate-500">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                  No borrowers found
                </td>
              </tr>
            ) : (
              filteredBorrowers.map((borrower, index) => (
                <tr 
                  key={borrower._id} 
                  className={`border-t border-slate-700/50 hover:bg-slate-800/50 transition-colors ${index % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/10'}`}
                >
                  <td className="px-4 py-3 text-slate-200 font-medium">{borrower.borrowerName}</td>
                  <td className="px-4 py-3 text-slate-400">{borrower.borrowerEmail || 'N/A'}</td>
                  <td className="px-4 py-3 text-slate-400">{borrower.borrowerPhone || 'N/A'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      borrower.books?.length > 0 
                        ? 'bg-violet-500/20 text-violet-400' 
                        : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {borrower.books?.length || 0} books
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
        {filteredBorrowers.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            No borrowers found
          </div>
        ) : (
          filteredBorrowers.map((borrower) => (
            <div 
              key={borrower._id} 
              className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-slate-200 font-semibold text-sm">{borrower.borrowerName}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  borrower.books?.length > 0 
                    ? 'bg-violet-500/20 text-violet-400' 
                    : 'bg-slate-500/20 text-slate-400'
                }`}>
                  <FontAwesomeIcon icon={faBook} className="mr-1" />
                  {borrower.books?.length || 0}
                </span>
              </div>
              
              <div className="space-y-2 text-xs">
                {borrower.borrowerEmail && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <FontAwesomeIcon icon={faEnvelope} className="text-violet-400/50 w-4" />
                    <span className="truncate">{borrower.borrowerEmail}</span>
                  </div>
                )}
                {borrower.borrowerPhone && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <FontAwesomeIcon icon={faPhone} className="text-violet-400/50 w-4" />
                    <span>{borrower.borrowerPhone}</span>
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

export default BorrowersTable;
