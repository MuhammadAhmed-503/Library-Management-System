import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faUser, faEnvelope, faPhone, faTimes, faSave, faPenNib } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import SearchBar from '../search_comp/SearchBar';
import ItemList from '../search_comp/ItemList';

const UpdateAuthor = () => {
  const [showAuthorList, setShowAuthorList] = useState(true);
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    authorPhone: ''
  });

  const [authors, setAuthors] = useState([]);

  const [selectedAuthor, setSelectedAuthor] = useState(null);

  // Fetch all authors on component mount
  const fetchAllAuthors = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/authors`);
      const data = await response.json();
      setAuthors(data);
    } catch (error) {
      console.error('Error fetching authors:', error);
      setAuthors([]);
    }
  };

  useEffect(() => {
    fetchAllAuthors();
  }, []);

  const handleSearch = async (query) => {
    if (!query || query.trim() === '') {
      fetchAllAuthors();
      return;
    }
    try {
        // console.log('Query:', query);
        const response = await fetch(`${process.env.REACT_APP_API_URI}/authors/search?query=${query}`);
        const data = await response.json();
        setAuthors(data);
    } 
    catch (error) {
        console.error('Error fetching authors:', error);
        setAuthors([]);
    }
  };

  const handleSelectAuthor = async (author) => {
    setSelectedAuthor(author);
    setShowAuthorList(false);
    setFormData({
      authorName: author.authorName || '',
      authorEmail: author.authorEmail || '',
      authorPhone: author.authorPhone || ''
    });
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
      const response = await fetch(`${process.env.REACT_APP_API_URI}/authors/${selectedAuthor._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        toast.success('Author updated successfully');
        console.log('Author updated successfully!');
        setFormData({
            authorName: '',
            authorEmail: '',
            authorPhone: ''
        });
        setAuthors([]);
        setSelectedAuthor(null);
        setShowAuthorList(true);
      }
    } catch (error) {
      toast.error('Error updating author');
      console.error('Error updating author:', error);
    }
  };

  const handleReset = () => {
    setFormData({
      authotName: '',
      authorEmail: '',
      authorPhone: ''
    });
    setSelectedAuthor(null);
    setShowAuthorList(true);
    fetchAllAuthors();
  };

  useEffect(() => {
    if (selectedAuthor) {
      setFormData({
        authorName: selectedAuthor.authorName,
        authorEmail: selectedAuthor.authorEmailEmail,
        authorPhone: selectedAuthor.authorPhone
      });
    }
  }, [selectedAuthor]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div className="max-w-xl mx-auto w-full">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-cyan-500/20 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
            <FontAwesomeIcon icon={faEdit} className="text-2xl sm:text-3xl text-cyan-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Update Author
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">Modify author information</p>
        </div>

        {!selectedAuthor ? (
          <>
            <SearchBar onSearch={handleSearch} placeholder="Search authors to update..." />
            {authors.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-slate-800/30 rounded-xl sm:rounded-2xl border border-slate-700/50 mt-4">
                <FontAwesomeIcon icon={faPenNib} className="text-3xl sm:text-4xl text-slate-600 mb-3 sm:mb-4" />
                <p className="text-slate-500 text-sm sm:text-base">No authors found</p>
              </div>
            ) : (
              <ItemList items={authors} onSelectItem={handleSelectAuthor} isVisible={showAuthorList} itemType="author" />
            )}
          </>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-700/50">
                <div className="mb-4 sm:mb-5">
                  <label htmlFor="author_name" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
                    <FontAwesomeIcon icon={faUser} className="mr-2 text-cyan-400" />
                    Name
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    id="author_name"
                    placeholder="Author's Name"
                    className="w-full bg-slate-700/50 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300 text-sm sm:text-base"
                    value={formData.authorName}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4 sm:mb-5">
                  <label htmlFor="author_email" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-cyan-400" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="authorEmail"
                    id="author_email"
                    placeholder="Author's Email"
                    className="w-full bg-slate-700/50 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300 text-sm sm:text-base"
                    value={formData.authorEmail}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4 sm:mb-5">
                  <label htmlFor="author_phone" className="block text-slate-300 font-medium mb-2 text-sm sm:text-base">
                    <FontAwesomeIcon icon={faPhone} className="mr-2 text-cyan-400" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="authorPhone"
                    id="author_phone"
                    placeholder="Author's Phone Number"
                    className="w-full bg-slate-700/50 border border-slate-600 text-slate-200 placeholder-slate-500 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300 text-sm sm:text-base"
                    value={formData.authorPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mt-4 sm:mt-6 space-y-3">
                <button 
                  type="submit" 
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <FontAwesomeIcon icon={faSave} />
                  Update Author
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

export default UpdateAuthor;
