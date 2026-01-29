import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from '../search_comp/SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faEnvelope, faPhone, faMapMarkerAlt, faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';

const ShowItemList = ({ items, openItems, toggleItem }) => {
  return (
    <div className="space-y-2 sm:space-y-3">
      {items.map((item, index) => (
        <div
          key={item._id}
          className={`group bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/10 ${openItems.includes(index) ? 'ring-2 ring-violet-500/30' : ''}`}
          onClick={() => toggleItem(index)}
        >
          {openItems.includes(index) ? (
            <div className="p-3 sm:p-4 animate-fadeIn">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h3 className="text-base sm:text-lg font-semibold text-violet-400">{item.borrowerName}</h3>
                <FontAwesomeIcon icon={faChevronUp} className="text-slate-400" />
              </div>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <p className="text-slate-300 flex items-center gap-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-violet-500 w-4" />
                  <span className="text-slate-500">Email:</span> <span className="truncate">{item.borrowerEmail}</span>
                </p>
                <p className="text-slate-300 flex items-center gap-2">
                  <FontAwesomeIcon icon={faPhone} className="text-violet-500 w-4" />
                  <span className="text-slate-500">Phone:</span> {item.borrowerPhone}
                </p>
                <p className="text-slate-300 flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-violet-500 w-4" />
                  <span className="text-slate-500">Address:</span> {item.borrowerAddress}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-violet-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faUsers} className="text-violet-400 text-sm sm:text-base" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-slate-200 font-medium text-sm sm:text-base truncate">{item.borrowerName}</p>
                  <p className="text-slate-500 text-xs sm:text-sm truncate">{item.borrowerEmail}</p>
                </div>
              </div>
              <FontAwesomeIcon icon={faChevronDown} className="text-slate-500 group-hover:text-violet-400 transition-colors flex-shrink-0 ml-2" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ShowBorrowers = ({ type }) => {
  const initialBorrowersState = [];
  const [borrowers, setBorrowers] = useState(initialBorrowersState);
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (index) => {
    setOpenItems((prevOpenItems) => {
      if (prevOpenItems.includes(index)) {
        return prevOpenItems.filter((itemIndex) => itemIndex !== index);
      } else {
        return [...prevOpenItems, index];
      }
    });
  };

  const handleSearch = useCallback(async (query) => {
    try {
      let response = null;
      if (type === 'all') {
        response = await fetch(`${process.env.REACT_APP_API_URI}/borrowers/search?query=${query}`);
      } else if (type === 'withoutbooks') {
        response = await fetch(`${process.env.REACT_APP_API_URI}/borrowers/searchdel?query=${query}`);
      }

      const data = await response.json();
      setBorrowers(data);
    } catch (error) {
      console.error('Error fetching borrowers:', error);
      setBorrowers([]);
    }
  }, [type]);

  const handleClearSearch = () => {
    setSearchQuery('');
    handleSearch('');
    setBorrowers(initialBorrowersState);
    setOpenItems([]);
  };

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]); 

  const getTitle = () => {
    if (type === 'all') return 'All Borrowers';
    if (type === 'withoutbooks') return 'Borrowers Without Books';
    return 'Borrower List';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-violet-600/20 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
            <FontAwesomeIcon icon={faUsers} className="text-2xl sm:text-3xl text-violet-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            {getTitle()}
          </h1>
        </div>

        <div className="flex gap-2 mb-4 sm:mb-6">
          <div className="flex-1">
            <SearchBar onSearch={setSearchQuery} placeholder={"Search borrowers by name, email..."} value={searchQuery} />
          </div>
          <button 
            onClick={handleClearSearch} 
            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg sm:rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {borrowers.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-slate-800/30 rounded-xl sm:rounded-2xl border border-slate-700/50">
            <FontAwesomeIcon icon={faUsers} className="text-3xl sm:text-4xl text-slate-600 mb-3 sm:mb-4" />
            <p className="text-slate-500 text-sm sm:text-base">No borrowers found. Try a different search.</p>
          </div>
        ) : (
          <ShowItemList items={borrowers} openItems={openItems} toggleItem={toggleItem} />
        )}
      </div>
    </div>
  );
};

export default ShowBorrowers;