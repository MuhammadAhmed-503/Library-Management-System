import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ placeholder, onSearch, selectedItem }) => {
    const [searchQuery, setSearchQuery] = useState('');
  
    const handleSearch = () => {
      onSearch(searchQuery);
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };
  
    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
        {selectedItem ? (
          <div className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-emerald-600/20 border-2 border-emerald-500/30 rounded-lg sm:rounded-xl text-emerald-400 text-sm sm:text-base">
            {selectedItem.title ? `Selected Book: ${selectedItem.title}` : `Selected Borrower: ${selectedItem.borrowerName}`}
          </div>
        ) : (
          <div className="relative flex-1">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm sm:text-base" 
            />
            <input
              type="text"
              placeholder={placeholder}
              className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-slate-900/80 border-2 border-slate-600/50 rounded-lg sm:rounded-xl text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-sm sm:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        )}
        <button
          type="button"
          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center gap-2 text-sm sm:text-base"
          onClick={handleSearch}
        >
          <FontAwesomeIcon icon={faSearch} />
          Search
        </button>
      </div>
    );
  };

export default SearchBar;