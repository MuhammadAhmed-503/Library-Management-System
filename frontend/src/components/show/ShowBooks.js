import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../search_comp/SearchBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUser, faEnvelope, faTag, faDollarSign, faPhone, faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons';

const ShowItemList = ({ items, openItems, toggleItem, type }) => {
  return (
    <div className="space-y-2 sm:space-y-3">
      {items.map((item, index) => (
        <div
          key={item._id}
          className={`group bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg sm:rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 ${openItems.includes(index) ? 'ring-2 ring-emerald-500/30' : ''}`}
          onClick={() => toggleItem(index)}
        >
          {(type === "all" || type === "available") ? (
            <>
              {openItems.includes(index) ? (
                <div className="p-3 sm:p-4 animate-fadeIn">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-emerald-400">{item.title}</h3>
                    <FontAwesomeIcon icon={faChevronUp} className="text-slate-400" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    {item.author && (
                      <>
                        <p className="text-slate-300 flex items-center gap-2">
                          <FontAwesomeIcon icon={faUser} className="text-emerald-500 w-4" />
                          <span className="text-slate-500">Author:</span> {item.author.authorName}
                        </p>
                        <p className="text-slate-300 flex items-center gap-2">
                          <FontAwesomeIcon icon={faEnvelope} className="text-emerald-500 w-4" />
                          <span className="text-slate-500">Email:</span> <span className="truncate">{item.author.authorEmail}</span>
                        </p>
                      </>
                    )}
                    <p className="text-slate-300 flex items-center gap-2">
                      <FontAwesomeIcon icon={faTag} className="text-emerald-500 w-4" />
                      <span className="text-slate-500">Category:</span> {item.category}
                    </p>
                    <p className="text-slate-300 flex items-center gap-2">
                      <FontAwesomeIcon icon={faDollarSign} className="text-emerald-500 w-4" />
                      <span className="text-slate-500">Price:</span> ${item.price}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faBook} className="text-emerald-400 text-sm sm:text-base" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-200 font-medium text-sm sm:text-base truncate">{item.title}</p>
                      <p className="text-slate-500 text-xs sm:text-sm truncate">{item.author && item.author.authorName} • {item.category}</p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faChevronDown} className="text-slate-500 group-hover:text-emerald-400 transition-colors flex-shrink-0 ml-2" />
                </div>
              )}
            </>
          ) : type === "borrowed" ? (
            <>
              {openItems.includes(index) ? (
                <div className="p-3 sm:p-4 animate-fadeIn">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-amber-400">{item.title}</h3>
                    <FontAwesomeIcon icon={faChevronUp} className="text-slate-400" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                    {item.author && (
                      <p className="text-slate-300 flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} className="text-amber-500 w-4" />
                        <span className="text-slate-500">Author:</span> {item.author.authorName}
                      </p>
                    )}
                    <p className="text-slate-300 flex items-center gap-2">
                      <FontAwesomeIcon icon={faTag} className="text-amber-500 w-4" />
                      <span className="text-slate-500">Category:</span> {item.category}
                    </p>
                    <p className="text-slate-300 flex items-center gap-2">
                      <FontAwesomeIcon icon={faDollarSign} className="text-amber-500 w-4" />
                      <span className="text-slate-500">Price:</span> ${item.price}
                    </p>
                    {item.borrower && (
                      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-700/50">
                        <p className="text-xs text-amber-400 uppercase tracking-wide mb-1.5 sm:mb-2">Borrowed By</p>
                        <p className="text-slate-300 flex items-center gap-2">
                          <FontAwesomeIcon icon={faUser} className="text-violet-500 w-4" />
                          {item.borrower.borrowerName}
                        </p>
                        <p className="text-slate-300 flex items-center gap-2">
                          <FontAwesomeIcon icon={faEnvelope} className="text-violet-500 w-4" />
                          <span className="truncate">{item.borrower.borrowerEmail}</span>
                        </p>
                        <p className="text-slate-300 flex items-center gap-2">
                          <FontAwesomeIcon icon={faPhone} className="text-violet-500 w-4" />
                          {item.borrower.borrowerPhone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3 sm:p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FontAwesomeIcon icon={faBook} className="text-amber-400 text-sm sm:text-base" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-200 font-medium text-sm sm:text-base truncate">{item.title}</p>
                      <p className="text-slate-500 text-xs sm:text-sm truncate">{item.author && item.author.authorName} • Borrower: {item.borrower && item.borrower.borrowerName}</p>
                    </div>
                  </div>
                  <FontAwesomeIcon icon={faChevronDown} className="text-slate-500 group-hover:text-amber-400 transition-colors flex-shrink-0 ml-2" />
                </div>
              )}
            </>
          ) : (<></>)}
        </div>
      ))}
    </div>
  );
};


const ShowBooks = ({ type }) => {
  const initialBoooksState = [];
  const [books, setBooks] = useState(initialBoooksState);
  const [searchQuery, setSearchQuery] = useState("");
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

  const handleSearch = useCallback(
    async (query) => {
      try {
        let response = null;
        if (type === "all") {
          response = await fetch(
            `${process.env.REACT_APP_API_URI}/books/search?query=${query}`
          );
        } else if (type === "borrowed") {
          response = await fetch(
            `${process.env.REACT_APP_API_URI}/books/searchin?query=${query}`
          );
        } else if (type === "available") {
          response = await fetch(
            `${process.env.REACT_APP_API_URI}/books/searchout?query=${query}`
          );
        }

        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching borrowers:", error);
        setBooks([]);
      }
    },
    [type]
  );

  const handleClearSearch = () => {
    setSearchQuery("");
    handleSearch("");
    setBooks(initialBoooksState);
    setOpenItems([]);
  };

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  const getTitle = () => {
    if (type === "all") return "All Books";
    if (type === "borrowed") return "Checked Out Books";
    if (type === "available") return "Available Books";
    return "Book List";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-emerald-600/20 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
            <FontAwesomeIcon icon={faBook} className="text-2xl sm:text-3xl text-emerald-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {getTitle()}
          </h1>
        </div>

        <div className="flex gap-2 mb-4 sm:mb-6">
          <div className="flex-1">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder={"Search books by title, author..."}
              value={searchQuery}
              className="w-full"
            />
          </div>
          <button
            onClick={handleClearSearch}
            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg sm:rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-slate-800/30 rounded-xl sm:rounded-2xl border border-slate-700/50">
            <FontAwesomeIcon icon={faBook} className="text-3xl sm:text-4xl text-slate-600 mb-3 sm:mb-4" />
            <p className="text-slate-500 text-sm sm:text-base">No books found. Try a different search.</p>
          </div>
        ) : (
          <ShowItemList
            items={books}
            openItems={openItems}
            toggleItem={toggleItem}
            type={type}
          />
        )}
      </div>
    </div>
  );
};

export default ShowBooks;
