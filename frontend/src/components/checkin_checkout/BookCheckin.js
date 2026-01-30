import React, {lazy,useState,startTransition, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateLeft, faTimes, faBook } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const SearchBar = lazy(() => import("../search_comp/SearchBar"));
const ItemList = lazy(() => import("../search_comp/ItemList"));
const FormComp = lazy(() => import("../search_comp/FormComp"));

const CheckinBook = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [confirmCheckin, setConfirmCheckin] = useState("");
  const [showBookList, setShowBookList] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    borrowerName: "",
    category: "",
    price: "",
  });

  // Fetch all borrowed books on component mount
  const fetchAllBorrowedBooks = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/books/borrowed`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    }
  };

  useEffect(() => {
    fetchAllBorrowedBooks();
  }, []);

  const handleSearch = async (query) => {
    if (!query || query.trim() === '') {
      fetchAllBorrowedBooks();
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/books/searchin?query=${query}`
      );
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    }
  };

  const handleSelectBook = async (book) => {
    startTransition(() => {
      setSelectedBook(book);
      setShowBookList(false);
      setFormData({
        title: book.title,
        borrowerName: book.borrower.borrowerName || "",
        category: book.category || "",
        price: book.price ? book.price.toString() : "",
      });
    });
    try {
      const borrowerId = book.borrower;
      if (!borrowerId) {
        throw new Error("Borrower ID not found");
      }
    } catch (error) {
      console.error("Error fetching borrower details:", error);
      setFormData({
        title: book.title,
        borrowerName: "",
        category: book.category || "",
        price: book.price || "",
      });
    }
  };

  const handleReset = () => {
    startTransition(() => {
      setSelectedBook(null);
      setShowBookList(true);
      setConfirmCheckin("");
      fetchAllBorrowedBooks();
    });
  };

  const handleCheckin = async () => {
    if (confirmCheckin === "checkin" && selectedBook) {
      const { _id: bookId, borrower } = selectedBook;

      const requestBody = {
        bookId,
        borrowerId: borrower || null,
      };

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URI}/books/checkin`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (response.ok) {
          toast.success("Book checked in successfully");
          console.log("Book checked in successfully!");
          setConfirmCheckin("");
          setSelectedBook(null);
          setShowBookList(true);
          setBooks([]);
        } else {
          throw new Error("Failed to check in book");
        }
      } catch (error) {
        toast.error("Error checking in book");
        console.error("Error checking in book:", error);
      }
    } else {
      toast.warning(
        'Please type "checkin" in the confirmation box to check in the book.'
      );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div className="max-w-xl mx-auto w-full">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-cyan-600/20 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
            <FontAwesomeIcon icon={faArrowRotateLeft} className="text-2xl sm:text-3xl text-cyan-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Book Check In
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">Return a borrowed book to the library</p>
        </div>

        {!selectedBook ? (
          <>
            <SearchBar
              onSearch={handleSearch}
              selectedItem={selectedBook}
              placeholder="Search borrowed books..."
            />
            {books.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-slate-800/30 rounded-xl sm:rounded-2xl border border-slate-700/50 mt-4">
                <FontAwesomeIcon icon={faBook} className="text-3xl sm:text-4xl text-slate-600 mb-3 sm:mb-4" />
                <p className="text-slate-500 text-sm sm:text-base">No borrowed books found</p>
              </div>
            ) : (
              <ItemList
                items={books}
                onSelectItem={handleSelectBook}
                itemType="bookcheckin"
                isVisible={showBookList}
              />
            )}
          </>
        ) : (
          <>
            <FormComp
              form_data={formData}
              setConfirm={setConfirmCheckin}
              handler={handleCheckin}
              type="checkin"
            />
            <button
              type="button"
              className="w-full mt-4 py-3 sm:py-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold rounded-lg sm:rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50 flex items-center justify-center gap-2 text-sm sm:text-base"
              onClick={handleReset}
            >
              <FontAwesomeIcon icon={faTimes} />
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckinBook;
