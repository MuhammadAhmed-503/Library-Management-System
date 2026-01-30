import React, { lazy, startTransition, useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes, faBook } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const SearchBar = lazy(() => import("../search_comp/SearchBar"));
const ItemList = lazy(() => import("../search_comp/ItemList"));
const FormComp = lazy(() => import("../search_comp/FormComp"));

const DeleteBook = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [showBookList, setShowBookList] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    authorName: "",
    category: "",
    price: "",
  });

  // Fetch all books on component mount
  const fetchAllBooks = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/books`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const handleSearch = async (query) => {
    if (!query || query.trim() === '') {
      fetchAllBooks();
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URI}/books/searchout?query=${query}`
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
        authorName: book?.author?.authorName || "",
        category: book.category || "",
        price: book.price ? book.price.toString() : "",
      });
    });
  };

  const handleReset = () => {
    startTransition(() => {
      setFormData({
        title: "",
        authorName: "",
        category: "",
        price: "",
      });
      setSelectedBook(null);
      setShowBookList(true);
      setConfirmDelete("");
      fetchAllBooks();
    });
  };

  const handleDelete = async () => {
    if (confirmDelete === "delete" && selectedBook) {
      const { _id: bookId, author } = selectedBook;

      const requestBody = {
        bookId,
        authorId: author?._id || null,
      };

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URI}/books`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });
        if (response.ok) {
          toast.success("Book deleted successfully");
          console.log("Book deleted successfully!");
          setConfirmDelete("");
          setSelectedBook(null);
          handleReset();
        }
      } catch (error) {
        toast.error("Error deleting book");
        console.error("Error deleting book:", error);
      }
    } else {
      toast.warning('Please type "delete" in the confirmation box to delete the book.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div className="max-w-xl mx-auto w-full">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-red-600/20 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
            <FontAwesomeIcon icon={faTrash} className="text-2xl sm:text-3xl text-red-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
            Delete Book
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">Remove a book from the library</p>
        </div>

        {!selectedBook ? (
          <>
            <SearchBar
              onSearch={handleSearch}
              selectedItem={selectedBook}
              placeholder="Search books to delete..."
            />
            {books.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-slate-800/30 rounded-xl sm:rounded-2xl border border-slate-700/50 mt-4">
                <FontAwesomeIcon icon={faBook} className="text-3xl sm:text-4xl text-slate-600 mb-3 sm:mb-4" />
                <p className="text-slate-500 text-sm sm:text-base">No books found</p>
              </div>
            ) : (
              <ItemList
                items={books}
                onSelectItem={handleSelectBook}
                itemType="book"
                isVisible={showBookList}
              />
            )}
          </>
        ) : (
          <>
            <FormComp 
              form_data={formData}
              setConfirm={setConfirmDelete}
              type="deletebook" />
            <div className="mt-4 sm:mt-6 space-y-3">
              <button
                onClick={handleReset}
                className="w-full py-3 sm:py-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <FontAwesomeIcon icon={faTimes} />
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 flex items-center justify-center gap-2 text-sm sm:text-base">
                <FontAwesomeIcon icon={faTrash} />
                Delete Book
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteBook;
