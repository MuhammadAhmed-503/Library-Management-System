import React, { useState, useRef, useEffect } from 'react';
import Logo from '../app_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faBook, faUser, faEdit, faCheck, faTrash, faPlus, faPen, faTable, faBookOpen, faPenNib, faUsers, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Header = ({ onAddBookClick, onAddBorrowerClick, onAddAuthorClick, onUpdateBookClick, onUpdateBorrowerClick, onDeleteBookClick, onDeleteBorrowerClick, onDeleteAuthorClick, onUpdateAuthorClick, onCheckinClick, onCheckoutClick, onBooksTableClick, onBorrowersTableClick, onAuthorsTableClick, onBorrowedBooksTableClick, goHome }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUpdateDropdownOpen, setIsUpdateDropdownOpen] = useState(false);
  const [isDeleteDropdownOpen, setIsDeleteDropdownOpen] = useState(false);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState(null);
  const dropdownRef = useRef(null);
  const updateDropdownRef = useRef(null);
  const deleteDropdownRef = useRef(null);
  const viewDropdownRef = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
    if (updateDropdownRef.current && !updateDropdownRef.current.contains(event.target)) {
      setIsUpdateDropdownOpen(false);
    }
    if (deleteDropdownRef.current && !deleteDropdownRef.current.contains(event.target)) {
      setIsDeleteDropdownOpen(false);
    }
    if (viewDropdownRef.current && !viewDropdownRef.current.contains(event.target)) {
      setIsViewDropdownOpen(false);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleUpdateDropdown = () => setIsUpdateDropdownOpen(!isUpdateDropdownOpen);
  const toggleDeleteDropdown = () => setIsDeleteDropdownOpen(!isDeleteDropdownOpen);
  const toggleViewDropdown = () => setIsViewDropdownOpen(!isViewDropdownOpen);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setMobileSubMenu(null);
  };

  const handleMobileAction = (action) => {
    action();
    setIsMobileMenuOpen(false);
    setMobileSubMenu(null);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-3 sm:p-4 border-b border-emerald-500/20 shadow-lg shadow-emerald-500/5 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <h1 onClick={goHome} className="flex items-center text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide hover:cursor-pointer group">
          <div className="relative mr-2 sm:mr-3">
            <img src={Logo} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-500/30 transition-all"></div>
          </div>
          <span className="hidden sm:block bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-400 bg-clip-text text-transparent text-lg sm:text-xl lg:text-2xl">
            Library Management System
          </span>
        </h1>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 text-white hover:bg-slate-700/50 rounded-lg transition-colors"
        >
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="text-xl" />
        </button>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-2 xl:space-x-3">
          {/* New Dropdown */}
          <div className="relative inline-block" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 xl:px-5 py-2 xl:py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-1 xl:gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 text-sm xl:text-base">
              <FontAwesomeIcon icon={faPlus} className="text-xs xl:text-sm" />
              <span>New</span>
              <FontAwesomeIcon icon={isDropdownOpen ? faAngleUp : faAngleDown} className="text-xs xl:text-sm opacity-70" />
            </button>
            <div className={`absolute right-0 z-20 mt-2 w-56 rounded-xl overflow-hidden shadow-2xl shadow-black/50 ${isDropdownOpen ? 'block animate-fadeIn' : 'hidden'}`}>
              <div className="bg-slate-800 border border-slate-700/50 rounded-xl overflow-hidden">
                <button onClick={onAddBookClick} className="flex items-center w-full px-4 py-3 text-slate-200 hover:bg-emerald-600/20 hover:text-emerald-400 transition-colors border-b border-slate-700/50">
                  <FontAwesomeIcon icon={faBook} className="mr-3 text-emerald-500" /> Add New Book
                </button>
                <button onClick={onAddAuthorClick} className="flex items-center w-full px-4 py-3 text-slate-200 hover:bg-emerald-600/20 hover:text-emerald-400 transition-colors border-b border-slate-700/50">
                  <FontAwesomeIcon icon={faUser} className="mr-3 text-emerald-500" /> Add New Author
                </button>
                <button onClick={onAddBorrowerClick} className="flex items-center w-full px-4 py-3 text-slate-200 hover:bg-emerald-600/20 hover:text-emerald-400 transition-colors">
                  <FontAwesomeIcon icon={faUser} className="mr-3 text-emerald-500" /> Add New Borrower
                </button>
              </div>
            </div>
          </div>

          {/* Update Dropdown */}
          <div className="relative inline-block" ref={updateDropdownRef}>
            <button onClick={toggleUpdateDropdown} className="bg-amber-600 hover:bg-amber-500 text-white px-3 xl:px-5 py-2 xl:py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-1 xl:gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 text-sm xl:text-base">
              <FontAwesomeIcon icon={faPen} className="text-xs xl:text-sm" />
              <span>Update</span>
              <FontAwesomeIcon icon={isUpdateDropdownOpen ? faAngleUp : faAngleDown} className="text-xs xl:text-sm opacity-70" />
            </button>
            <div className={`absolute right-0 z-20 mt-2 w-60 rounded-xl overflow-hidden shadow-2xl shadow-black/50 ${isUpdateDropdownOpen ? 'block animate-fadeIn' : 'hidden'}`}>
              <div className="bg-slate-800 border border-slate-700/50 rounded-xl overflow-hidden">
                <button onClick={onUpdateBookClick} className="flex items-center w-full px-4 py-3 text-slate-200 hover:bg-amber-600/20 hover:text-amber-400 transition-colors border-b border-slate-700/50">
                  <FontAwesomeIcon icon={faEdit} className="mr-3 text-amber-500" /> Update Book Details
                </button>
                <button onClick={onUpdateAuthorClick} className="flex items-center w-full px-4 py-3 text-slate-200 hover:bg-amber-600/20 hover:text-amber-400 transition-colors border-b border-slate-700/50">
                  <FontAwesomeIcon icon={faEdit} className="mr-3 text-amber-500" /> Update Author Details
                </button>
                <button onClick={onUpdateBorrowerClick} className="flex items-center w-full px-4 py-3 text-slate-200 hover:bg-amber-600/20 hover:text-amber-400 transition-colors">
                  <FontAwesomeIcon icon={faEdit} className="mr-3 text-amber-500" /> Update Borrower Details
                </button>
              </div>
            </div>
          </div>

          {/* Delete Dropdown */}
          <div className="relative inline-block" ref={deleteDropdownRef}>
            <button onClick={toggleDeleteDropdown} className="bg-red-600/80 hover:bg-red-500 text-white px-3 xl:px-5 py-2 xl:py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-1 xl:gap-2 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5 text-sm xl:text-base">
              <FontAwesomeIcon icon={faTrash} className="text-xs xl:text-sm" />
              <span>Delete</span>
              <FontAwesomeIcon icon={isDeleteDropdownOpen ? faAngleUp : faAngleDown} className="text-xs xl:text-sm opacity-70" />
            </button>
            <div className={`absolute right-0 z-20 mt-2 w-52 rounded-xl overflow-hidden shadow-2xl shadow-black/50 ${isDeleteDropdownOpen ? 'block animate-fadeIn' : 'hidden'}`}>
              <div className="bg-slate-800 border border-slate-700/50 rounded-xl overflow-hidden">
                <button onClick={onDeleteBookClick} className="flex items-center w-full px-4 py-3 text-slate-200 hover:bg-red-600/20 hover:text-red-400 transition-colors border-b border-slate-700/50">
                  <FontAwesomeIcon icon={faTrash} className="mr-3 text-red-500" /> Delete Book
                </button>
                <button onClick={onDeleteAuthorClick} className="flex items-center w-full px-4 py-3 text-slate-200 hover:bg-red-600/20 hover:text-red-400 transition-colors border-b border-slate-700/50">
                  <FontAwesomeIcon icon={faTrash} className="mr-3 text-red-500" /> Delete Author
                </button>
                <button onClick={onDeleteBorrowerClick} className="flex items-center w-full px-4 py-3 text-slate-200 hover:bg-red-600/20 hover:text-red-400 transition-colors">
                  <FontAwesomeIcon icon={faTrash} className="mr-3 text-red-500" /> Delete Borrower
                </button>
              </div>
            </div>
          </div>

          {/* Check-in Button */}
          <button onClick={onCheckinClick} className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-3 xl:px-5 py-2 xl:py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-1 xl:gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 text-sm xl:text-base">
            <FontAwesomeIcon icon={faCheck} />
            <span className="hidden xl:inline">Check In</span>
            <span className="xl:hidden">In</span>
          </button>

          {/* Check-out Button */}
          <button onClick={onCheckoutClick} className="bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white px-3 xl:px-5 py-2 xl:py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-1 xl:gap-2 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:-translate-y-0.5 text-sm xl:text-base">
            <FontAwesomeIcon icon={faCheck} />
            <span className="hidden xl:inline">Check Out</span>
            <span className="xl:hidden">Out</span>
          </button>

          {/* View Tables Dropdown */}
          <div className="relative inline-block" ref={viewDropdownRef}>
            <button onClick={toggleViewDropdown} className="bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white px-3 xl:px-5 py-2 xl:py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-1 xl:gap-2 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-0.5 text-sm xl:text-base">
              <FontAwesomeIcon icon={faTable} className="text-xs xl:text-sm" />
              <span>View</span>
              <FontAwesomeIcon icon={isViewDropdownOpen ? faAngleUp : faAngleDown} className="text-xs xl:text-sm opacity-70" />
            </button>
            <div className={`absolute right-0 z-20 mt-2 w-56 rounded-xl overflow-hidden shadow-2xl shadow-black/50 ${isViewDropdownOpen ? 'block animate-fadeIn' : 'hidden'}`}>
              <div className="bg-slate-800 border border-slate-700/50 rounded-xl overflow-hidden">
                <button onClick={onBooksTableClick} className="flex items-center w-full px-4 py-3 text-slate-200 hover:bg-teal-600/20 hover:text-teal-400 transition-colors border-b border-slate-700/50">
                  <FontAwesomeIcon icon={faBook} className="mr-3 text-teal-500" /> All Books
                </button>
                <button onClick={onAuthorsTableClick} className="flex items-center w-full px-4 py-3 text-slate-200 hover:bg-teal-600/20 hover:text-teal-400 transition-colors border-b border-slate-700/50">
                  <FontAwesomeIcon icon={faPenNib} className="mr-3 text-teal-500" /> All Authors
                </button>
                <button onClick={onBorrowersTableClick} className="flex items-center w-full px-4 py-3 text-slate-200 hover:bg-teal-600/20 hover:text-teal-400 transition-colors border-b border-slate-700/50">
                  <FontAwesomeIcon icon={faUsers} className="mr-3 text-teal-500" /> All Borrowers
                </button>
                <button onClick={onBorrowedBooksTableClick} className="flex items-center w-full px-4 py-3 text-slate-200 hover:bg-amber-600/20 hover:text-amber-400 transition-colors">
                  <FontAwesomeIcon icon={faBookOpen} className="mr-3 text-amber-500" /> Borrowed Books
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[57px] bg-slate-900/95 backdrop-blur-lg z-40 overflow-y-auto animate-fadeIn">
          <div className="p-4 space-y-2">
            {/* New Section */}
            <div className="bg-slate-800/50 rounded-xl overflow-hidden">
              <button 
                onClick={() => setMobileSubMenu(mobileSubMenu === 'new' ? null : 'new')}
                className="w-full flex items-center justify-between p-4 text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faPlus} />
                  </div>
                  <span className="font-semibold">New</span>
                </div>
                <FontAwesomeIcon icon={mobileSubMenu === 'new' ? faAngleUp : faAngleDown} />
              </button>
              {mobileSubMenu === 'new' && (
                <div className="border-t border-slate-700/50 bg-slate-900/50">
                  <button onClick={() => handleMobileAction(onAddBookClick)} className="w-full flex items-center gap-3 p-4 text-slate-300 hover:bg-emerald-600/20 hover:text-emerald-400">
                    <FontAwesomeIcon icon={faBook} className="text-emerald-500 w-5" /> Add New Book
                  </button>
                  <button onClick={() => handleMobileAction(onAddAuthorClick)} className="w-full flex items-center gap-3 p-4 text-slate-300 hover:bg-emerald-600/20 hover:text-emerald-400 border-t border-slate-700/30">
                    <FontAwesomeIcon icon={faUser} className="text-emerald-500 w-5" /> Add New Author
                  </button>
                  <button onClick={() => handleMobileAction(onAddBorrowerClick)} className="w-full flex items-center gap-3 p-4 text-slate-300 hover:bg-emerald-600/20 hover:text-emerald-400 border-t border-slate-700/30">
                    <FontAwesomeIcon icon={faUser} className="text-emerald-500 w-5" /> Add New Borrower
                  </button>
                </div>
              )}
            </div>

            {/* Update Section */}
            <div className="bg-slate-800/50 rounded-xl overflow-hidden">
              <button 
                onClick={() => setMobileSubMenu(mobileSubMenu === 'update' ? null : 'update')}
                className="w-full flex items-center justify-between p-4 text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faPen} />
                  </div>
                  <span className="font-semibold">Update</span>
                </div>
                <FontAwesomeIcon icon={mobileSubMenu === 'update' ? faAngleUp : faAngleDown} />
              </button>
              {mobileSubMenu === 'update' && (
                <div className="border-t border-slate-700/50 bg-slate-900/50">
                  <button onClick={() => handleMobileAction(onUpdateBookClick)} className="w-full flex items-center gap-3 p-4 text-slate-300 hover:bg-amber-600/20 hover:text-amber-400">
                    <FontAwesomeIcon icon={faEdit} className="text-amber-500 w-5" /> Update Book
                  </button>
                  <button onClick={() => handleMobileAction(onUpdateAuthorClick)} className="w-full flex items-center gap-3 p-4 text-slate-300 hover:bg-amber-600/20 hover:text-amber-400 border-t border-slate-700/30">
                    <FontAwesomeIcon icon={faEdit} className="text-amber-500 w-5" /> Update Author
                  </button>
                  <button onClick={() => handleMobileAction(onUpdateBorrowerClick)} className="w-full flex items-center gap-3 p-4 text-slate-300 hover:bg-amber-600/20 hover:text-amber-400 border-t border-slate-700/30">
                    <FontAwesomeIcon icon={faEdit} className="text-amber-500 w-5" /> Update Borrower
                  </button>
                </div>
              )}
            </div>

            {/* Delete Section */}
            <div className="bg-slate-800/50 rounded-xl overflow-hidden">
              <button 
                onClick={() => setMobileSubMenu(mobileSubMenu === 'delete' ? null : 'delete')}
                className="w-full flex items-center justify-between p-4 text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faTrash} />
                  </div>
                  <span className="font-semibold">Delete</span>
                </div>
                <FontAwesomeIcon icon={mobileSubMenu === 'delete' ? faAngleUp : faAngleDown} />
              </button>
              {mobileSubMenu === 'delete' && (
                <div className="border-t border-slate-700/50 bg-slate-900/50">
                  <button onClick={() => handleMobileAction(onDeleteBookClick)} className="w-full flex items-center gap-3 p-4 text-slate-300 hover:bg-red-600/20 hover:text-red-400">
                    <FontAwesomeIcon icon={faTrash} className="text-red-500 w-5" /> Delete Book
                  </button>
                  <button onClick={() => handleMobileAction(onDeleteAuthorClick)} className="w-full flex items-center gap-3 p-4 text-slate-300 hover:bg-red-600/20 hover:text-red-400 border-t border-slate-700/30">
                    <FontAwesomeIcon icon={faTrash} className="text-red-500 w-5" /> Delete Author
                  </button>
                  <button onClick={() => handleMobileAction(onDeleteBorrowerClick)} className="w-full flex items-center gap-3 p-4 text-slate-300 hover:bg-red-600/20 hover:text-red-400 border-t border-slate-700/30">
                    <FontAwesomeIcon icon={faTrash} className="text-red-500 w-5" /> Delete Borrower
                  </button>
                </div>
              )}
            </div>

            {/* Check In/Out Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => handleMobileAction(onCheckinClick)} className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faCheck} /> Check In
              </button>
              <button onClick={() => handleMobileAction(onCheckoutClick)} className="bg-gradient-to-r from-violet-600 to-violet-500 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faCheck} /> Check Out
              </button>
            </div>

            {/* View Section */}
            <div className="bg-slate-800/50 rounded-xl overflow-hidden">
              <button 
                onClick={() => setMobileSubMenu(mobileSubMenu === 'view' ? null : 'view')}
                className="w-full flex items-center justify-between p-4 text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faTable} />
                  </div>
                  <span className="font-semibold">View All</span>
                </div>
                <FontAwesomeIcon icon={mobileSubMenu === 'view' ? faAngleUp : faAngleDown} />
              </button>
              {mobileSubMenu === 'view' && (
                <div className="border-t border-slate-700/50 bg-slate-900/50">
                  <button onClick={() => handleMobileAction(onBooksTableClick)} className="w-full flex items-center gap-3 p-4 text-slate-300 hover:bg-teal-600/20 hover:text-teal-400">
                    <FontAwesomeIcon icon={faBook} className="text-teal-500 w-5" /> All Books
                  </button>
                  <button onClick={() => handleMobileAction(onAuthorsTableClick)} className="w-full flex items-center gap-3 p-4 text-slate-300 hover:bg-teal-600/20 hover:text-teal-400 border-t border-slate-700/30">
                    <FontAwesomeIcon icon={faPenNib} className="text-teal-500 w-5" /> All Authors
                  </button>
                  <button onClick={() => handleMobileAction(onBorrowersTableClick)} className="w-full flex items-center gap-3 p-4 text-slate-300 hover:bg-teal-600/20 hover:text-teal-400 border-t border-slate-700/30">
                    <FontAwesomeIcon icon={faUsers} className="text-teal-500 w-5" /> All Borrowers
                  </button>
                  <button onClick={() => handleMobileAction(onBorrowedBooksTableClick)} className="w-full flex items-center gap-3 p-4 text-slate-300 hover:bg-amber-600/20 hover:text-amber-400 border-t border-slate-700/30">
                    <FontAwesomeIcon icon={faBookOpen} className="text-amber-500 w-5" /> Borrowed Books
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
