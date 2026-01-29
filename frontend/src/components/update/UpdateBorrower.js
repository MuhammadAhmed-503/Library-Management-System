import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faUser, faEnvelope, faPhone, faMapMarkerAlt, faTimes, faSave, faUsers } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import SearchBar from '../search_comp/SearchBar';
import ItemList from '../search_comp/ItemList';

const UpdateBorrower = () => {
  const [showBorrowerList, setShowBorrowerList] = useState(true);
  const [formData, setFormData] = useState({
    borrowerName: '',
    borrowerEmail: '',
    borrowerPhone: '',
    borrowerAddress: '',
  });

  const [borrowers, setBorrowers] = useState([]);

  const [selectedBorrower, setSelectedBorrower] = useState(null);

  const handleSearch = async (query) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/borrowers/search?query=${query}`);
      const data = await response.json();
      setBorrowers(data);
    } catch (error) {
      console.error('Error fetching borrowers:', error);
      setBorrowers([]);
    }
  };

  const handleSelectBorrower = async (borrower) => {
    setSelectedBorrower(borrower);
    try {
      setFormData({
        borrowerName: borrower.borrowerName,
        borrowerEmail: borrower.borrowerEmail,
        borrowerPhone: borrower.borrowerPhone,
        borrowerAddress: borrower.borrowerAddress || ''
      });
      setShowBorrowerList(false);
    } catch (error) {
      setFormData({
        borrowerName: borrower.borrowerName,
        borrowerEmail: '',
        borrowerPhone: '',
        borrowerAddress: ''
      });
    }
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
      const response = await fetch(`${process.env.REACT_APP_API_URI}/borrowers/${selectedBorrower._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success('Borrower updated successfully');
        console.log('Borrower updated successfully!');
        setFormData({
          borrowerName: '',
          borrowerEmail: '',
          borrowerPhone: '',
          borrowerAddress: '',
        });
        setBorrowers([]);
        setSelectedBorrower(null);
        setShowBorrowerList(true);
       }
    } catch (error) {
      console.error('Error updating borrower:', error);
    }
  };

  const handleReset = () => {
    setFormData({
      borrowerName: '',
      borrowerEmail: '',
      borrowerPhone: '',
      borrowerAddress: '',
    });
    setBorrowers([]);
    setSelectedBorrower(null);
    setShowBorrowerList(true);
  };

  useEffect(() => {
    if (selectedBorrower) {
      setFormData({
        borrowerName: selectedBorrower.borrowerName,
        borrowerEmail: selectedBorrower.borrowerEmail,
        borrowerPhone: selectedBorrower.borrowerPhone,
        borrowerAddress: selectedBorrower.borrowerAddress || ''
      });
    }
  }, [selectedBorrower]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div className="max-w-xl mx-auto w-full">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-violet-500/20 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
            <FontAwesomeIcon icon={faEdit} className="text-2xl sm:text-3xl text-violet-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Update Borrower
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">Modify borrower information</p>
        </div>

        {!selectedBorrower ? (
          <>
            <SearchBar onSearch={handleSearch} placeholder={"Search borrowers to update..."} />
            {borrowers.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-slate-800/30 rounded-xl sm:rounded-2xl border border-slate-700/50 mt-4">
                <FontAwesomeIcon icon={faUsers} className="text-3xl sm:text-4xl text-slate-600 mb-3 sm:mb-4" />
                <p className="text-slate-500 text-sm sm:text-base">Search for a borrower to update</p>
              </div>
            ) : (
              <ItemList items={borrowers} onSelectItem={handleSelectBorrower} isVisible={showBorrowerList} itemType="borrower" />
            )}
          </>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/50">
                <div className="mb-4 sm:mb-5">
                  <label htmlFor="borrower_name" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
                    <FontAwesomeIcon icon={faUser} className="mr-2 text-violet-400" />
                    Name
                  </label>
                  <input
                    type="text"
                    name="borrowerName"
                    id="borrower_name"
                    placeholder="Borrower's Name"
                    className="w-full bg-slate-700/50 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300 text-sm sm:text-base"
                    value={formData.borrowerName}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4 sm:mb-5">
                  <label htmlFor="borrower_email" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-violet-400" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="borrowerEmail"
                    id="borrower_email"
                    placeholder="Borrower's Email"
                    className="w-full bg-slate-700/50 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300 text-sm sm:text-base"
                    value={formData.borrowerEmail}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4 sm:mb-5">
                  <label htmlFor="borrower_phone" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
                    <FontAwesomeIcon icon={faPhone} className="mr-2 text-violet-400" />
                    Phone No
                  </label>
                  <input
                    type="tel"
                    name="borrowerPhone"
                    id="borrower_phone"
                    placeholder="Borrower's Phone No"
                    className="w-full bg-slate-700/50 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300 text-sm sm:text-base"
                    value={formData.borrowerPhone}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4 sm:mb-5">
                  <label htmlFor="borrower_address" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-violet-400" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="borrowerAddress"
                    id="borrowerAddress"
                    placeholder="Borrower's Address"
                    className="w-full bg-slate-700/50 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-300 text-sm sm:text-base"
                    value={formData.borrowerAddress}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mt-4 sm:mt-6 space-y-3">
                <button 
                  type="submit" 
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <FontAwesomeIcon icon={faSave} />
                  Update Borrower
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

export default UpdateBorrower;
