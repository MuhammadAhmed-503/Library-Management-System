import React, { lazy, startTransition, useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faEnvelope, faPhone, faBook, faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';
const SearchBar = lazy(() => import("../search_comp/SearchBar"));

const ShowItemList = ({ items, openItems, toggleItem }) => {
  return (
    <div className="space-y-2 sm:space-y-3">
      {items.map((item, index) => (
        <div
          key={item._id}
          className={`group bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 ${openItems.includes(index) ? 'ring-2 ring-cyan-500/30' : ''}`}
          onClick={() => toggleItem(index)}
        >
          {openItems.includes(index) ? (
            <div className="p-3 sm:p-4 animate-fadeIn">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h3 className="text-base sm:text-lg font-semibold text-cyan-400">{item.authorName}</h3>
                <FontAwesomeIcon icon={faChevronUp} className="text-slate-400" />
              </div>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <p className="text-slate-300 flex items-center gap-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-cyan-500 w-4" />
                  <span className="text-slate-500">Email:</span> <span className="truncate">{item.authorEmail}</span>
                </p>
                <p className="text-slate-300 flex items-center gap-2">
                  <FontAwesomeIcon icon={faPhone} className="text-cyan-500 w-4" />
                  <span className="text-slate-500">Phone:</span> {item.authorPhone}
                </p>
                <p className="text-slate-300 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBook} className="text-cyan-500 w-4" />
                  <span className="text-slate-500">Books:</span> <span className="truncate">{item.books.map(book => book.title).join(', ')}</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faUserTie} className="text-cyan-400 text-sm sm:text-base" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-slate-200 font-medium text-sm sm:text-base truncate">{item.authorName}</p>
                  <p className="text-slate-500 text-xs sm:text-sm truncate">{item.authorEmail}</p>
                </div>
              </div>
              <FontAwesomeIcon icon={faChevronDown} className="text-slate-500 group-hover:text-cyan-400 transition-colors flex-shrink-0 ml-2" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ShowAuthors = () => {
  const initialAuthorsState = [];
  const [authors, setAuthors] = useState(initialAuthorsState);
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
      const response = await fetch(`${process.env.REACT_APP_API_URI}/authors/search?query=${query}`);
      const data = await response.json();
      startTransition(() => {
        setAuthors(data);
        setOpenItems([]);
      });
    } catch (error) {
      console.error('Error fetching authors:', error);
      setAuthors([]);
    }
  }, []);
  

  const handleClearSearch = () => {
    startTransition(() => {
      setAuthors([]);
      handleSearch('');
      setAuthors(initialAuthorsState);
      setOpenItems([]);
      setSearchQuery('');
    });
  };

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]); 

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-cyan-600/20 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
            <FontAwesomeIcon icon={faUserTie} className="text-2xl sm:text-3xl text-cyan-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Author List
          </h1>
        </div>

        <div className="flex gap-2 mb-4 sm:mb-6">
          <div className="flex-1">
            <SearchBar onSearch={setSearchQuery} placeholder={"Search authors by name, email..."} value={searchQuery} />
          </div>
          <button 
            onClick={handleClearSearch} 
            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg sm:rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {authors.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-slate-800/30 rounded-xl sm:rounded-2xl border border-slate-700/50">
            <FontAwesomeIcon icon={faUserTie} className="text-3xl sm:text-4xl text-slate-600 mb-3 sm:mb-4" />
            <p className="text-slate-500 text-sm sm:text-base">No authors found. Try a different search.</p>
          </div>
        ) : (
          <ShowItemList items={authors} openItems={openItems} toggleItem={toggleItem} />
        )}
      </div>
    </div>
  );
};

export default ShowAuthors;