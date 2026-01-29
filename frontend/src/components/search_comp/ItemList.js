import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUser, faUserTie } from '@fortawesome/free-solid-svg-icons';

const ItemList = ({ items, onSelectItem, itemType, isVisible }) => {
    const getIcon = () => {
      if (itemType === 'book' || itemType === 'bookcheckin') return faBook;
      if (itemType === 'borrower') return faUser;
      if (itemType === 'author') return faUserTie;
      return faBook;
    };

    const getAccentColor = () => {
      if (itemType === 'book' || itemType === 'bookcheckin') return 'emerald';
      if (itemType === 'borrower') return 'violet';
      if (itemType === 'author') return 'cyan';
      return 'emerald';
    };

    const color = getAccentColor();

    return (
      <div className={`space-y-2 mb-4 ${isVisible ? 'block' : 'hidden'}`}>
        {items.map((item) => (
          <div
            key={item._id}
            className={`group bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 p-3 sm:p-4 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 hover:border-${color}-500/30 hover:shadow-lg hover:shadow-${color}-500/10 hover:-translate-y-0.5`}
            onClick={() => onSelectItem(item)}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-${color}-600/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                <FontAwesomeIcon icon={getIcon()} className={`text-${color}-400 text-sm sm:text-base`} />
              </div>
              <div className="text-slate-300 min-w-0 flex-1">
                {itemType === 'book' ? (
                  <div>
                    <p className="font-medium text-slate-200 text-sm sm:text-base truncate">{item.title}</p>
                    <p className="text-xs sm:text-sm text-slate-500 truncate">{item.author?.authorName} • {item.category} • ${item.price}</p>
                  </div>
                ) : itemType === 'borrower' ? (
                  <div>
                    <p className="font-medium text-slate-200 text-sm sm:text-base truncate">{item.borrowerName}</p>
                    <p className="text-xs sm:text-sm text-slate-500 truncate">{item.borrowerEmail}</p>
                  </div>
                ) : itemType === 'author' ? (
                  <div>
                    <p className="font-medium text-slate-200 text-sm sm:text-base truncate">{item.authorName}</p>
                    <p className="text-xs sm:text-sm text-slate-500 truncate">{item.authorEmail}</p>
                  </div>
                ) : itemType === 'bookcheckin' ? (
                  <div>
                    <p className="font-medium text-slate-200 text-sm sm:text-base truncate">{item.title}</p>
                    <p className="text-xs sm:text-sm text-slate-500 truncate">{item.category} • ${item.price} • Borrowed by: <span className="text-amber-400">{item.borrower?.borrowerName}</span></p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
export default ItemList;