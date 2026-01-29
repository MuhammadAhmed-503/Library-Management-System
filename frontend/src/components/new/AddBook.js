import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUser, faTag, faDollarSign, faPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const AddBook = () => {
  const [formData, setFormData] = useState({
    title: '',
    authorName: '',
    category: '',
    price: '',
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddBook = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }
      ,console.log('Form submitted:', JSON.stringify(formData)));

      if (response.ok) {
        toast.success('Book added successfully!');
        console.log('Book added successfully!');
        setFormData({
          title: '',
          authorName: '',
          category: '',
          price: '',
        });
      } else {
        toast.error('Failed to add book');
        console.error('Failed to add book:', response.statusText);
      }
    } catch (error) {
      toast.error('Error adding book');
      console.error('Error adding book:', error);
    }
  };

  return (
    <div className='p-4 sm:p-6 lg:p-8 animate-fadeIn'>
      <div className='max-w-xl mx-auto w-full'>
        <div className='text-center mb-6 sm:mb-8'>
          <div className='inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-emerald-600/20 rounded-xl sm:rounded-2xl mb-3 sm:mb-4'>
            <FontAwesomeIcon icon={faBook} className='text-2xl sm:text-3xl text-emerald-400' />
          </div>
          <h1 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'>
            Add New Book
          </h1>
          <p className='text-slate-400 mt-2 text-sm sm:text-base'>Enter the book details below</p>
        </div>

        <form onSubmit={handleAddBook}>
          <div className='bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/50 shadow-xl'>
            <div className='mb-4 sm:mb-5'>
              <label htmlFor='title' className='block text-slate-300 font-medium mb-2 text-sm sm:text-base'>
                <FontAwesomeIcon icon={faBook} className='mr-2 text-emerald-500' />
                Book Title
              </label>
              <input
                type='text'
                name='title'
                id='title'
                placeholder='Enter book title'
                required
                className='w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/80 border-2 border-slate-600/50 rounded-lg sm:rounded-xl text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-sm sm:text-base'
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            
            <div className='mb-4 sm:mb-5'>
              <label htmlFor='authorName' className='block text-slate-300 font-medium mb-2 text-sm sm:text-base'>
                <FontAwesomeIcon icon={faUser} className='mr-2 text-emerald-500' />
                Author Name
              </label>
              <input
                type='text'
                name='authorName'
                id='authorName'
                placeholder='Enter author name'
                required
                className='w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/80 border-2 border-slate-600/50 rounded-lg sm:rounded-xl text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-sm sm:text-base'
                value={formData.authorName}
                onChange={handleChange}
              />
            </div>

            <div className='mb-4 sm:mb-5'>
              <label htmlFor='category' className='block text-slate-300 font-medium mb-2 text-sm sm:text-base'>
                <FontAwesomeIcon icon={faTag} className='mr-2 text-emerald-500' />
                Category
              </label>
              <input
                type='text'
                name='category'
                id='category'
                placeholder='Enter category'
                className='w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/80 border-2 border-slate-600/50 rounded-lg sm:rounded-xl text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-sm sm:text-base'
                value={formData.category}
                onChange={handleChange}
              />
            </div>
            
            <div className='mb-4 sm:mb-6'>
              <label htmlFor='price' className='block text-slate-300 font-medium mb-2 text-sm sm:text-base'>
                <FontAwesomeIcon icon={faDollarSign} className='mr-2 text-emerald-500' />
                Price
              </label>
              <input
                type='number'
                name='price'
                id='price'
                placeholder='Enter price'
                className='w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/80 border-2 border-slate-600/50 rounded-lg sm:rounded-xl text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-sm sm:text-base'
                value={formData.price}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <button 
            type='submit' 
            className='w-full mt-4 sm:mt-6 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-1 flex items-center justify-center gap-2 text-sm sm:text-base'
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
