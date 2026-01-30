import React, { lazy, useState, startTransition, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const SearchBar = lazy(() => import("../search_comp/SearchBar"));
const ItemList = lazy(() => import("../search_comp/ItemList"));
const FormComp = lazy(() => import("../search_comp/FormComp"));

const DeleteAuthor = () => {
  const [authors, setAuthors] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [showAuthorList, setShowAuthorList] = useState(true);

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
      // If search is empty, show all authors
      fetchAllAuthors();
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/authors/search?query=${query}`);
      const data = await response.json();
      setAuthors(data);
    } catch (error) {
      console.error('Error fetching authors:', error);
      setAuthors([]);
    }
  };

  const handleSelectAuthor = async (author) => {
    startTransition(() => {
      setSelectedAuthor(author);
      setShowAuthorList(false);
    });
  };

  const handleReset = () => {
    startTransition(() => {
      setSelectedAuthor(null);
      setConfirmDelete('');
      setShowAuthorList(true);
      fetchAllAuthors(); // Refresh the list
    });
  };

  const handleDelete = async () => {
    if (confirmDelete === 'delete' && selectedAuthor) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URI}/authors/${selectedAuthor._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          toast.success('Author deleted successfully');
          console.log('Author deleted successfully!');
          setConfirmDelete('');
          setSelectedAuthor(null);
          setShowAuthorList(true);
          setAuthors([]);
          handleReset();
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || 'Failed to delete author');
        }
      } catch (error) {
        toast.error('Error deleting author');
        console.error('Error deleting author:', error);
      }
    } else {
      toast.warning('Please type "delete" in the confirmation box to delete the author.');
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
            Delete Author
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">Remove an author from the system</p>
        </div>

        {!selectedAuthor ? (
          <>
            <SearchBar onSearch={handleSearch} placeholder={"Search authors to delete..."} />
            {authors.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-slate-800/30 rounded-xl sm:rounded-2xl border border-slate-700/50 mt-4">
                <FontAwesomeIcon icon={faUserTie} className="text-3xl sm:text-4xl text-slate-600 mb-3 sm:mb-4" />
                <p className="text-slate-500 text-sm sm:text-base">No authors found</p>
              </div>
            ) : (
              <ItemList items={authors} onSelectItem={handleSelectAuthor} isVisible={showAuthorList} itemType="author" />
            )}
          </>
        ) : (
          <>
            <FormComp setConfirm={setConfirmDelete} selectedItem={selectedAuthor} type="deleteauthor" />
            <div className="mt-4 sm:mt-6 space-y-3">
              <button
                type="button"
                className="w-full py-3 sm:py-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                onClick={handleReset}
              >
                <FontAwesomeIcon icon={faTimes} />
                Cancel
              </button>
              <button
                type="button"
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-red-500/30 hover:shadow-red-500/50 flex items-center justify-center gap-2 text-sm sm:text-base"
                onClick={handleDelete}
              >
                <FontAwesomeIcon icon={faTrash} />
                Delete Author
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteAuthor;
