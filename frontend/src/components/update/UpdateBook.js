import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faBook, faUser, faTag, faDollarSign, faTimes, faSave } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import SearchBar from '../search_comp/SearchBar';
import ItemList from '../search_comp/ItemList';


const UpdateBook = () => {
  const [formData, setFormData] = useState({
    bookId: '',
    title: '',
    authorName: '',
    category: '',
    price: '',
    preAuthorID: ''
  });

  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookList, setShowBookList] = useState(true);

  const handleSearch = async (query) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/books/search?query=${query}`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    }
  };

  const handleSelectBook = async (book) => {
    setSelectedBook(book);
    const authorId = book.author?._id; 
    if (!authorId) {
      throw new Error('Author ID not found');
    }
    setShowBookList(false);
    setFormData({
      bookId: book._id,
      title: book.title,
      authorName: book?.author.authorName || '', 
      category: book.category || '', 
      price: book.price ? book.price.toString() : ''
    });
  };

  const handleReset = () => {
    setFormData({
      bookId: '',
      title: '',
      authorName: '',
      category: '',
      price: '',
      preAuthorID: ''
    });
    setBooks([]);
    setSelectedBook(null);
    setShowBookList(true);
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/books`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success('Book updated successfully');
        console.log('Book updated successfully!');
        setSelectedBook(null);
        setShowBookList(true);
        setBooks([]);
        setFormData({
          bookId: '',
          title: '',
          authorName: '',
          category: '',
          price: '',
          preAuthorID: ''
        })};
    } catch (error) {
      toast.error('Error updating book');
      console.error('Error updating book:', error);
    }
  };

  useEffect(() => {
    if (selectedBook) {
      setFormData({
        bookId: selectedBook._id,
        title: selectedBook.title,
        authorName: selectedBook.authorName,
        category: selectedBook.category,
        price: selectedBook.price.toString()
      });
    }
  }, [selectedBook]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div className="max-w-xl mx-auto w-full">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-amber-500/20 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
            <FontAwesomeIcon icon={faEdit} className="text-2xl sm:text-3xl text-amber-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            Update Book
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">Modify book details</p>
        </div>

        {!selectedBook ? (
          <>
            <SearchBar onSearch={handleSearch} selectedItem={selectedBook} placeholder="Search books to update..." />
            {books.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-slate-800/30 rounded-xl sm:rounded-2xl border border-slate-700/50 mt-4">
                <FontAwesomeIcon icon={faBook} className="text-3xl sm:text-4xl text-slate-600 mb-3 sm:mb-4" />
                <p className="text-slate-500 text-sm sm:text-base">Search for a book to update</p>
              </div>
            ) : (
              <ItemList items={books} onSelectItem={handleSelectBook} itemType="book" isVisible={showBookList} />
            )}
          </>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/50">
                <div className="mb-4 sm:mb-5">
                  <label htmlFor="title" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
                    <FontAwesomeIcon icon={faBook} className="mr-2 text-amber-400" />
                    Book Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Book Title"
                    required
                    className="w-full bg-slate-700/50 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 text-sm sm:text-base"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4 sm:mb-5">
                  <label htmlFor="authorName" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
                    <FontAwesomeIcon icon={faUser} className="mr-2 text-amber-400" />
                    Author Name
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    id="authorName"
                    placeholder="Author Name"
                    required
                    className="w-full bg-slate-700/50 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 text-sm sm:text-base"
                    value={formData.authorName}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4 sm:mb-5">
                  <label htmlFor="category" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
                    <FontAwesomeIcon icon={faTag} className="mr-2 text-amber-400" />
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    id="category"
                    placeholder="Category"
                    className="w-full bg-slate-700/50 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 text-sm sm:text-base"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4 sm:mb-5">
                  <label htmlFor="price" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
                    <FontAwesomeIcon icon={faDollarSign} className="mr-2 text-amber-400" />
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    placeholder="Price"
                    required
                    className="w-full bg-slate-700/50 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300 text-sm sm:text-base"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mt-4 sm:mt-6 space-y-3">
                <button 
                  type="submit" 
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <FontAwesomeIcon icon={faSave} />
                  Update Book
                </button>
                <button 
                  type="button"
                  onClick={handleReset} 
                  className="w-full py-3 sm:py-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default UpdateBook;
