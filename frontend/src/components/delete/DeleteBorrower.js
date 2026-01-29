import React, {lazy,useState,startTransition } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes, faUsers } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const SearchBar = lazy(() => import("../search_comp/SearchBar"));
const ItemList = lazy(() => import("../search_comp/ItemList"));
const FormComp = lazy(() => import("../search_comp/FormComp"));

const DeleteBorrower = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState('');
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [showBorrowerList, setShowBorrowerList] = useState(true);

  const handleSearch = async (query) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URI}/borrowers/searchdel?query=${query}`);
      const data = await response.json();
      setBorrowers(data);
    } catch (error) {
      console.error('Error fetching borrowers:', error);
      setBorrowers([]);
    }
  };

  const handleSelectBorrower = async (borrower) => {
    startTransition(() => {
      setSelectedBorrower(borrower);
    });
  };

  const handleReset = () => {
    startTransition(() => {
      setSelectedBorrower(null);
      setBorrowers([]);
      setConfirmDelete('');
      setShowBorrowerList(true);
    });
  };

  const handleDelete = async () => {
    if (confirmDelete === 'delete' && selectedBorrower) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URI}/borrowers/${selectedBorrower._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          toast.success('Borrower deleted successfully');
          console.log('Borrower deleted successfully!');
          setConfirmDelete('');
          setSelectedBorrower(null);
          setShowBorrowerList(true);
          setBorrowers([]);
          handleReset();
        }
      } catch (error) {
        toast.error('Error deleting borrower');
        console.error('Error deleting borrower:', error);
      }
    } else {
      toast.warning('Please type "delete" in the confirmation box to delete the borrower.');
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
            Delete Borrower
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">Remove a borrower from the system</p>
        </div>

        {!selectedBorrower ? (
          <>
            <SearchBar onSearch={handleSearch} placeholder={"Search borrowers to delete..."} />
            {borrowers.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-slate-800/30 rounded-xl sm:rounded-2xl border border-slate-700/50 mt-4">
                <FontAwesomeIcon icon={faUsers} className="text-3xl sm:text-4xl text-slate-600 mb-3 sm:mb-4" />
                <p className="text-slate-500 text-sm sm:text-base">Search for a borrower to delete</p>
              </div>
            ) : (
              <ItemList items={borrowers} onSelectItem={handleSelectBorrower} isVisible={showBorrowerList} itemType="borrower" />
            )}
          </>
        ) : (
          <>
            <FormComp setConfirm={setConfirmDelete} selectedItem={selectedBorrower} type="deleteborrower" />
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
                Delete Borrower
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DeleteBorrower;
