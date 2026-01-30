import React, {lazy,startTransition, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faArrowRight, faTimes, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const CheckoutReceipt = lazy(() => import('./CheckoutReceipt'));
const SearchBar = lazy(() => import('../search_comp/SearchBar'));
const ItemList = lazy(() => import('../search_comp/ItemList'));

const BookCheckout = () => {
  const [books, setBooks] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [searchedBook, setSearchedBook] = useState(null);
  const [searchedBorrower, setSearchedBorrower] = useState(null);
  const [confirmCheckout, setConfirmCheckout] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [showBookList, setShowBookList] = useState(true);
  const [showBorrowerList, setShowBorrowerList] = useState(true);
  const [showSelectedItems, setShowSelectedItems] = useState(false);

  // Fetch all available books on mount
  const fetchAllAvailableBooks = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/books/searchout?query=`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    }
  };

  // Fetch all borrowers on mount
  const fetchAllBorrowers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/borrowers`);
      const data = await response.json();
      setBorrowers(data);
    } catch (error) {
      console.error('Error fetching borrowers:', error);
      setBorrowers([]);
    }
  };

  useEffect(() => {
    fetchAllAvailableBooks();
    fetchAllBorrowers();
  }, []);

  const handleBookSearch = async (query) => {
    if (!query || query.trim() === '') {
      fetchAllAvailableBooks();
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/books/searchout?query=${query}`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    }
  };

  const handleBorrowerSearch = async (query) => {
    if (!query || query.trim() === '') {
      fetchAllBorrowers();
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/borrowers/search?query=${query}`);
      const data = await response.json();
      setBorrowers(data);
    } catch (error) {
      console.error('Error fetching borrowers:', error);
      setBorrowers([]);
    }
  };

  const handleItemSelect = (item, itemType) => {
    startTransition(() => {
    if (itemType === 'book') {
      setSearchedBook(item);
      setSelectedBook(item);
      setShowBookList(false);
      
    } else if (itemType === 'borrower') {
      setSearchedBorrower(item);
      setSelectedBorrower(item);
      setShowBorrowerList(false);
    }
  });
  };

  const handleContinue = () => {
    startTransition(() => {
    if (searchedBook && searchedBorrower) {
      setShowSelectedItems(true);
    } else {
      toast.warning('Please select both a book and a borrower.');
    }
  });
  }

  const handleReset = () => {
    startTransition(() => {
      setSearchedBook(null);
      setSearchedBorrower(null);
      setConfirmCheckout('');
      setSelectedBook(null);
      setSelectedBorrower(null);
      setShowSelectedItems(false);
      setShowBookList(true);
      setShowBorrowerList(true);
      fetchAllAvailableBooks();
      fetchAllBorrowers();
    });
  };
  

  const handleCheckout = () => {
    if (confirmCheckout === 'checkout' && searchedBook && searchedBorrower) {
      const bookId = searchedBook._id;
      const borrowerId = searchedBorrower._id;

      fetch(`${process.env.REACT_APP_API_URI}/books/checkout`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId,borrowerId }),
      })
        .then((response) => {
          if (response.ok) {
            toast.success('Book checked out successfully!');
            setSearchedBook(null);
            setSearchedBorrower(null);
            setConfirmCheckout('');
            setSelectedBook(null);
            setSelectedBorrower(null);
            setShowSelectedItems(false);
          } else {
            throw new Error('Failed to checkout book');
          }
        })
        .catch((error) => {
          console.error('Error checking out book:', error);
          toast.error('Error checking out book. Please try again.');
        });
    } else {
      toast.warning('Please type "checkout" in the confirmation box and select both a book and a borrower.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div className="max-w-xl mx-auto w-full">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-violet-600/20 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
            <FontAwesomeIcon icon={faShoppingCart} className="text-2xl sm:text-3xl text-violet-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Book Check Out
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">Lend a book to a borrower</p>
        </div>

        {!showSelectedItems && (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-slate-300 font-medium mb-2 sm:mb-3 text-sm sm:text-base">Select a Book</h3>
              <SearchBar
                placeholder="Search available books..."
                onSearch={handleBookSearch}
                selectedItem={selectedBook}
              />
            </div>
            <ItemList
              items={books}
              onSelectItem={(item) => handleItemSelect(item, 'book')}
              itemType="book"
              isVisible={showBookList}
            />
            
            <div>
              <h3 className="text-slate-300 font-medium mb-2 sm:mb-3 text-sm sm:text-base">Select a Borrower</h3>
              <SearchBar
                placeholder="Search borrowers..."
                onSearch={handleBorrowerSearch}
                selectedItem={selectedBorrower}
              />
            </div>
            <ItemList
              items={borrowers}
              onSelectItem={(item) => handleItemSelect(item, 'borrower')}
              itemType="borrower"
              isVisible={showBorrowerList}
            />

            <button
              type="button"
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-1 flex items-center justify-center gap-2 text-sm sm:text-base"
              onClick={handleContinue}
            >
              <span>Continue</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>

            <button
              type="button"
              className="w-full py-3 sm:py-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold rounded-lg sm:rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50 flex items-center justify-center gap-2 text-sm sm:text-base"
              onClick={handleReset}
            >
              <FontAwesomeIcon icon={faTimes} />
              Clear Selection
            </button>
          </div>
        )}
     
        {showSelectedItems && (
          <div className="space-y-4">
            <CheckoutReceipt selectedBook={selectedBook} selectedBorrower={selectedBorrower} />
            
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/50 shadow-xl">
                <label htmlFor="confirmation" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-violet-500" />
                  Confirmation
                </label>
                <input
                  type="text"
                  id="confirmation"
                  placeholder="Type 'checkout' to confirm"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/80 border-2 border-violet-600/50 rounded-lg sm:rounded-xl text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 text-sm sm:text-base"
                  value={confirmCheckout}
                  onChange={(e) => setConfirmCheckout(e.target.value)}
                />
              </div>
              
              <button
                type="button"
                className="w-full mt-4 py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-1 flex items-center justify-center gap-2 text-sm sm:text-base"
                onClick={handleCheckout}
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                Confirm Checkout
              </button>
            </form>
            
            <button
              type="button"
              className="w-full py-3 sm:py-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold rounded-lg sm:rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50 flex items-center justify-center gap-2 text-sm sm:text-base"
              onClick={handleReset}
            >
              <FontAwesomeIcon icon={faTimes} />
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCheckout;
