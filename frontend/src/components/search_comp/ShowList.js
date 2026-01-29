import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUser, faPenNib, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const ShowList = ({ items, onSelectItem, itemType, isVisible }) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);

  const handleItemClick = (index) => {
    if (index === selectedItemIndex) {
      setSelectedItemIndex(-1);
    } else {
      setSelectedItemIndex(index);
    }
  };

  const getAccentColor = () => {
    switch (itemType) {
      case 'book': return 'emerald';
      case 'borrower': return 'violet';
      case 'author': return 'cyan';
      default: return 'emerald';
    }
  };

  const getIcon = () => {
    switch (itemType) {
      case 'book': return faBook;
      case 'borrower': return faUser;
      case 'author': return faPenNib;
      default: return faBook;
    }
  };

  const accent = getAccentColor();

  return (
    <div className={`mt-4 space-y-2 sm:space-y-3 ${isVisible ? 'block' : 'hidden'}`}>
      {items.map((item, index) => (
        <div
          key={item._id}
          className={`bg-slate-800/50 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-700/50 cursor-pointer transition-all duration-300 hover:bg-slate-700/50 hover:border-${accent}-500/30`}
          onClick={() => handleItemClick(index)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-${accent}-500/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0`}>
                <FontAwesomeIcon icon={getIcon()} className={`text-${accent}-400 text-sm sm:text-base`} />
              </div>
              <div className="min-w-0 flex-1">
                {itemType === 'book' ? (
                  <>
                    <p className="text-slate-200 font-medium text-sm sm:text-base truncate">{item.title}</p>
                    <p className="text-slate-400 text-xs sm:text-sm truncate">{item.author?.authorName} • {item.category} • ${item.price}</p>
                  </>
                ) : itemType === 'borrower' ? (
                  <>
                    <p className="text-slate-200 font-medium text-sm sm:text-base truncate">{item.borrowerName}</p>
                    <p className="text-slate-400 text-xs sm:text-sm truncate">{item.borrowerEmail}</p>
                  </>
                ) : itemType === 'author' ? (
                  <>
                    <p className="text-slate-200 font-medium text-sm sm:text-base truncate">{item.authorName}</p>
                    <p className="text-slate-400 text-xs sm:text-sm truncate">{item.authorEmail}</p>
                  </>
                ) : null}
              </div>
            </div>
            <FontAwesomeIcon 
              icon={selectedItemIndex === index ? faChevronUp : faChevronDown} 
              className="text-slate-500 flex-shrink-0 ml-2" 
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowList;
