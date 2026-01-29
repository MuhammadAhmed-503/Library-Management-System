import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faEnvelope, faPhone, faBook, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const AddAuthor = () => {
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    authorPhone: '',
    books: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeBooks = (e) => {
    const { value } = e.target;
    const booksArray = value.split(',');
    setFormData((prevData) => ({
      ...prevData,
      books: booksArray
    }));
  };
  
  const handleAddAuthor = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/authors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Author added successfully!');
        console.log('Author added successfully!');
        setFormData({
          authorName: '',
          authorEmail: '',
          authorPhone: '',
          books: []
        });
      } else {
        toast.error('Failed to add Author');
        console.error('Failed to add Author:', response.statusText);
      }
    } catch (error) {
      toast.error('Error adding Author');
      console.error('Error adding Author:', error);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div className="max-w-xl mx-auto w-full">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-cyan-600/20 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
            <FontAwesomeIcon icon={faUserTie} className="text-2xl sm:text-3xl text-cyan-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Add Author
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">Register a new author in the system</p>
        </div>

        <form onSubmit={handleAddAuthor}>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/50 shadow-xl">
            <div className="mb-4 sm:mb-5">
              <label htmlFor="author_name" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
                <FontAwesomeIcon icon={faUserTie} className="mr-2 text-cyan-500" />
                Name
              </label>
              <input
                type="text"
                name="authorName"
                id="author_name"
                placeholder="Enter author's name"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/80 border-2 border-slate-600/50 rounded-lg sm:rounded-xl text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 text-sm sm:text-base"
                value={formData.authorName}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4 sm:mb-5">
              <label htmlFor="author_email" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-cyan-500" />
                Email
              </label>
              <input
                type="email"
                name="authorEmail"
                id="author_email"
                placeholder="Enter author's email"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/80 border-2 border-slate-600/50 rounded-lg sm:rounded-xl text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 text-sm sm:text-base"
                value={formData.authorEmail}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4 sm:mb-5">
              <label htmlFor="author_phone" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
                <FontAwesomeIcon icon={faPhone} className="mr-2 text-cyan-500" />
                Phone No
              </label>
              <input
                type="tel"
                name="authorPhone"
                id="author_phone"
                placeholder="Enter author's phone"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/80 border-2 border-slate-600/50 rounded-lg sm:rounded-xl text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 text-sm sm:text-base"
                value={formData.authorPhone}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4 sm:mb-5">
              <label htmlFor="books" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
                <FontAwesomeIcon icon={faBook} className="mr-2 text-cyan-500" />
                Books (Comma-separated)
              </label>
              <input
                type="text"
                name="books"
                id="books"
                placeholder="Book1, Book2, Book3..."
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/80 border-2 border-slate-600/50 rounded-lg sm:rounded-xl text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 text-sm sm:text-base"
                value={formData.books}
                onChange={handleChangeBooks}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full mt-4 sm:mt-6 py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-1 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FontAwesomeIcon icon={faUserPlus} />
            Add Author
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAuthor;
