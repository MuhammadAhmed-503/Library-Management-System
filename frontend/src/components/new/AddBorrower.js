import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faMapMarkerAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const AddBorrower = () => {
  const [formData, setFormData] = useState({
    borrowerName: '',
    borrowerEmail: '',
    borrowerPhone: '',
    borrowerAddress: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddBorrower = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/borrowers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Borrower added successfully!');
        console.log('Borrower added successfully!');
        // Clear form data after successful submission if needed
        setFormData({
          borrowerName: '',
          borrowerEmail: '',
          borrowerPhone: '',
          borrowerAddress: '',
        });
      } else {
        toast.error('Failed to add borrower');
        console.error('Failed to add borrower:', response.statusText);
      }
    } catch (error) {
      toast.error('Error adding borrower');
      console.error('Error adding borrower:', error);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div className="max-w-xl mx-auto w-full">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-violet-600/20 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
            <FontAwesomeIcon icon={faUser} className="text-2xl sm:text-3xl text-violet-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Add Borrower
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">Register a new library member</p>
        </div>

        <form onSubmit={handleAddBorrower}>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/50 shadow-xl">
            <div className="mb-4 sm:mb-5">
              <label htmlFor="borrower_name" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
                <FontAwesomeIcon icon={faUser} className="mr-2 text-violet-500" />
                Name
              </label>
              <input
                type="text"
                name="borrowerName"
                id="borrower_name"
                placeholder="Enter borrower's name"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/80 border-2 border-slate-600/50 rounded-lg sm:rounded-xl text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 text-sm sm:text-base"
                value={formData.borrowerName}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4 sm:mb-5">
              <label htmlFor="borrower_email" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-violet-500" />
                Email
              </label>
              <input
                type="email"
                name="borrowerEmail"
                id="borrower_email"
                placeholder="Enter borrower's email"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/80 border-2 border-slate-600/50 rounded-lg sm:rounded-xl text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 text-sm sm:text-base"
                value={formData.borrowerEmail}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4 sm:mb-5">
              <label htmlFor="borrower_phone" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
                <FontAwesomeIcon icon={faPhone} className="mr-2 text-violet-500" />
                Phone No
              </label>
              <input
                type="tel"
                name="borrowerPhone"
                id="borrower_phone"
                placeholder="Enter borrower's phone"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/80 border-2 border-slate-600/50 rounded-lg sm:rounded-xl text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 text-sm sm:text-base"
                value={formData.borrowerPhone}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-4 sm:mb-5">
              <label htmlFor="borrower_address" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-violet-500" />
                Address
              </label>
              <input
                type="text"
                name="borrowerAddress"
                id="borrower_address"
                placeholder="Enter borrower's address"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/80 border-2 border-slate-600/50 rounded-lg sm:rounded-xl text-slate-200 placeholder-slate-500 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all duration-300 text-sm sm:text-base"
                value={formData.borrowerAddress}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full mt-4 sm:mt-6 py-3 sm:py-4 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-1 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FontAwesomeIcon icon={faUserPlus} />
            Add Borrower
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBorrower;
