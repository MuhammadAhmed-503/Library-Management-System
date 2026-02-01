import React, { useState, useRef, useEffect } from 'react';
import Logo from '../app_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faBook, faUser, faEdit, faCheck, faTrash, faPlus, faPen, faTable, faBookOpen, faPenNib, faUsers, faBars, faTimes, faSun, faMoon, faSignOutAlt, faUserShield, faUserPlus, faCog } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Header = ({ onAddBookClick, onAddBorrowerClick, onAddAuthorClick, onUpdateBookClick, onUpdateBorrowerClick, onDeleteBookClick, onDeleteBorrowerClick, onDeleteAuthorClick, onUpdateAuthorClick, onCheckinClick, onCheckoutClick, onBooksTableClick, onBorrowersTableClick, onAuthorsTableClick, onBorrowedBooksTableClick, onAddLibrarianClick, onLibrariansTableClick, goHome }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUpdateDropdownOpen, setIsUpdateDropdownOpen] = useState(false);
  const [isDeleteDropdownOpen, setIsDeleteDropdownOpen] = useState(false);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState(null);
  const dropdownRef = useRef(null);
  const updateDropdownRef = useRef(null);
  const deleteDropdownRef = useRef(null);
  const viewDropdownRef = useRef(null);
  const settingsRef = useRef(null);
  
  const { user, logout, isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();

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
    if (settingsRef.current && !settingsRef.current.contains(event.target)) {
      setIsSettingsOpen(false);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleUpdateDropdown = () => setIsUpdateDropdownOpen(!isUpdateDropdownOpen);
  const toggleDeleteDropdown = () => setIsDeleteDropdownOpen(!isDeleteDropdownOpen);
  const toggleViewDropdown = () => setIsViewDropdownOpen(!isViewDropdownOpen);
  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);
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
    <div className={`p-3 sm:p-4 border-b shadow-lg sticky top-0 z-50 transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-emerald-500/20 shadow-emerald-500/5' 
        : 'bg-gradient-to-r from-white via-slate-50 to-white border-slate-200 shadow-slate-200/50'
    }`}>
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <h1 onClick={goHome} className="flex items-center text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide hover:cursor-pointer group">
          <div className="relative mr-2 sm:mr-3">
            <img src={Logo} alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-500/30 transition-all"></div>
          </div>
          <span className={`hidden sm:block text-lg sm:text-xl lg:text-2xl ${
            isDark 
              ? 'bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-400 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent'
          }`}>
            Library Management System
          </span>
        </h1>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            isDark ? 'text-white hover:bg-slate-700/50' : 'text-slate-800 hover:bg-slate-200'
          }`}
        >
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="text-xl" />
        </button>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-2 xl:space-x-3 items-center">
          {/* New Dropdown */}
          <div className="relative inline-block" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 xl:px-5 py-2 xl:py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center gap-1 xl:gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 text-sm xl:text-base">
              <FontAwesomeIcon icon={faPlus} className="text-xs xl:text-sm" />
              <span>New</span>
              <FontAwesomeIcon icon={isDropdownOpen ? faAngleUp : faAngleDown} className="text-xs xl:text-sm opacity-70" />
            </button>
            <div className={`absolute right-0 z-20 mt-2 w-56 rounded-xl overflow-hidden shadow-2xl shadow-black/50 ${isDropdownOpen ? 'block animate-fadeIn' : 'hidden'}`}>
              <div className={`border rounded-xl overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                <button onClick={onAddBookClick} className={`flex items-center w-full px-4 py-3 transition-colors border-b ${isDark ? 'text-slate-200 hover:bg-emerald-600/20 hover:text-emerald-400 border-slate-700/50' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 border-slate-100'}`}>
                  <FontAwesomeIcon icon={faBook} className="mr-3 text-emerald-500" /> Add New Book
                </button>
                <button onClick={onAddAuthorClick} className={`flex items-center w-full px-4 py-3 transition-colors border-b ${isDark ? 'text-slate-200 hover:bg-emerald-600/20 hover:text-emerald-400 border-slate-700/50' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 border-slate-100'}`}>
                  <FontAwesomeIcon icon={faUser} className="mr-3 text-emerald-500" /> Add New Author
                </button>
                <button onClick={onAddBorrowerClick} className={`flex items-center w-full px-4 py-3 transition-colors ${isDark ? 'text-slate-200 hover:bg-emerald-600/20 hover:text-emerald-400' : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-600'}`}>
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
              <div className={`border rounded-xl overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                <button onClick={onUpdateBookClick} className={`flex items-center w-full px-4 py-3 transition-colors border-b ${isDark ? 'text-slate-200 hover:bg-amber-600/20 hover:text-amber-400 border-slate-700/50' : 'text-slate-700 hover:bg-amber-50 hover:text-amber-600 border-slate-100'}`}>
                  <FontAwesomeIcon icon={faEdit} className="mr-3 text-amber-500" /> Update Book Details
                </button>
                <button onClick={onUpdateAuthorClick} className={`flex items-center w-full px-4 py-3 transition-colors border-b ${isDark ? 'text-slate-200 hover:bg-amber-600/20 hover:text-amber-400 border-slate-700/50' : 'text-slate-700 hover:bg-amber-50 hover:text-amber-600 border-slate-100'}`}>
                  <FontAwesomeIcon icon={faEdit} className="mr-3 text-amber-500" /> Update Author Details
                </button>
                <button onClick={onUpdateBorrowerClick} className={`flex items-center w-full px-4 py-3 transition-colors ${isDark ? 'text-slate-200 hover:bg-amber-600/20 hover:text-amber-400' : 'text-slate-700 hover:bg-amber-50 hover:text-amber-600'}`}>
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
              <div className={`border rounded-xl overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                <button onClick={onDeleteBookClick} className={`flex items-center w-full px-4 py-3 transition-colors border-b ${isDark ? 'text-slate-200 hover:bg-red-600/20 hover:text-red-400 border-slate-700/50' : 'text-slate-700 hover:bg-red-50 hover:text-red-600 border-slate-100'}`}>
                  <FontAwesomeIcon icon={faTrash} className="mr-3 text-red-500" /> Delete Book
                </button>
                <button onClick={onDeleteAuthorClick} className={`flex items-center w-full px-4 py-3 transition-colors border-b ${isDark ? 'text-slate-200 hover:bg-red-600/20 hover:text-red-400 border-slate-700/50' : 'text-slate-700 hover:bg-red-50 hover:text-red-600 border-slate-100'}`}>
                  <FontAwesomeIcon icon={faTrash} className="mr-3 text-red-500" /> Delete Author
                </button>
                <button onClick={onDeleteBorrowerClick} className={`flex items-center w-full px-4 py-3 transition-colors ${isDark ? 'text-slate-200 hover:bg-red-600/20 hover:text-red-400' : 'text-slate-700 hover:bg-red-50 hover:text-red-600'}`}>
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
              <div className={`border rounded-xl overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                <button onClick={onBooksTableClick} className={`flex items-center w-full px-4 py-3 transition-colors border-b ${isDark ? 'text-slate-200 hover:bg-teal-600/20 hover:text-teal-400 border-slate-700/50' : 'text-slate-700 hover:bg-teal-50 hover:text-teal-600 border-slate-100'}`}>
                  <FontAwesomeIcon icon={faBook} className="mr-3 text-teal-500" /> All Books
                </button>
                <button onClick={onAuthorsTableClick} className={`flex items-center w-full px-4 py-3 transition-colors border-b ${isDark ? 'text-slate-200 hover:bg-teal-600/20 hover:text-teal-400 border-slate-700/50' : 'text-slate-700 hover:bg-teal-50 hover:text-teal-600 border-slate-100'}`}>
                  <FontAwesomeIcon icon={faPenNib} className="mr-3 text-teal-500" /> All Authors
                </button>
                <button onClick={onBorrowersTableClick} className={`flex items-center w-full px-4 py-3 transition-colors border-b ${isDark ? 'text-slate-200 hover:bg-teal-600/20 hover:text-teal-400 border-slate-700/50' : 'text-slate-700 hover:bg-teal-50 hover:text-teal-600 border-slate-100'}`}>
                  <FontAwesomeIcon icon={faUsers} className="mr-3 text-teal-500" /> All Borrowers
                </button>
                <button onClick={onBorrowedBooksTableClick} className={`flex items-center w-full px-4 py-3 transition-colors ${isDark ? 'text-slate-200 hover:bg-amber-600/20 hover:text-amber-400' : 'text-slate-700 hover:bg-amber-50 hover:text-amber-600'}`}>
                  <FontAwesomeIcon icon={faBookOpen} className="mr-3 text-amber-500" /> Borrowed Books
                </button>
              </div>
            </div>
          </div>

          {/* Settings Dropdown */}
          <div className="relative inline-block" ref={settingsRef}>
            <button 
              onClick={toggleSettings} 
              className={`p-2.5 rounded-lg transition-all duration-300 ${
                isDark 
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white' 
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-800'
              } ${isSettingsOpen ? 'ring-2 ring-emerald-500' : ''}`}
              title="Settings"
            >
              <FontAwesomeIcon icon={faCog} className={`text-lg transition-transform duration-300 ${isSettingsOpen ? 'rotate-90' : ''}`} />
            </button>
            <div className={`absolute right-0 z-20 mt-2 w-72 rounded-xl overflow-hidden shadow-2xl shadow-black/50 ${isSettingsOpen ? 'block animate-fadeIn' : 'hidden'}`}>
              <div className={`border rounded-xl overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                {/* User Info Section */}
                <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-700/50 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      user?.role === 'admin' ? 'bg-indigo-500/20' : 'bg-emerald-500/20'
                    }`}>
                      <FontAwesomeIcon icon={user?.role === 'admin' ? faUserShield : faUser} className={`${
                        user?.role === 'admin' ? 'text-indigo-400' : 'text-emerald-400'
                      }`} />
                    </div>
                    <div>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{user?.name || 'User'}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        user?.role === 'admin' 
                          ? 'bg-indigo-500/20 text-indigo-400' 
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {user?.role || 'librarian'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Theme Toggle */}
                <button 
                  onClick={toggleTheme} 
                  className={`flex items-center justify-between w-full px-4 py-3 transition-colors border-b ${isDark ? 'text-slate-200 hover:bg-slate-700/50 border-slate-700/50' : 'text-slate-700 hover:bg-slate-50 border-slate-100'}`}
                >
                  <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={isDark ? faMoon : faSun} className={`w-5 ${isDark ? 'text-indigo-400' : 'text-amber-500'}`} />
                    <span>Theme</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-600'
                  }`}>
                    {isDark ? 'Dark' : 'Light'}
                  </div>
                </button>

                {/* Admin Section - Only for admin users */}
                {isAdmin() && (
                  <>
                    <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-500 bg-slate-900/30' : 'text-slate-400 bg-slate-50'}`}>
                      Admin Panel
                    </div>
                    <button onClick={() => { onAddLibrarianClick(); setIsSettingsOpen(false); }} className={`flex items-center w-full px-4 py-3 transition-colors border-b ${isDark ? 'text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-400 border-slate-700/50' : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border-slate-100'}`}>
                      <FontAwesomeIcon icon={faUserPlus} className="mr-3 text-indigo-500 w-5" /> Add Librarian
                    </button>
                    <button onClick={() => { onLibrariansTableClick(); setIsSettingsOpen(false); }} className={`flex items-center w-full px-4 py-3 transition-colors border-b ${isDark ? 'text-slate-200 hover:bg-indigo-600/20 hover:text-indigo-400 border-slate-700/50' : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border-slate-100'}`}>
                      <FontAwesomeIcon icon={faUsers} className="mr-3 text-indigo-500 w-5" /> Manage Librarians
                    </button>
                  </>
                )}

                {/* Logout */}
                <button 
                  onClick={logout} 
                  className={`flex items-center w-full px-4 py-3 transition-colors ${isDark ? 'text-red-400 hover:bg-red-600/20' : 'text-red-500 hover:bg-red-50'}`}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 w-5" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden fixed inset-0 top-[57px] backdrop-blur-lg z-40 overflow-y-auto animate-fadeIn ${
          isDark ? 'bg-slate-900/95' : 'bg-white/95'
        }`}>
          <div className="p-4 space-y-2">
            {/* New Section */}
            <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
              <button 
                onClick={() => setMobileSubMenu(mobileSubMenu === 'new' ? null : 'new')}
                className={`w-full flex items-center justify-between p-4 ${isDark ? 'text-white' : 'text-slate-800'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faPlus} className="text-white" />
                  </div>
                  <span className="font-semibold">New</span>
                </div>
                <FontAwesomeIcon icon={mobileSubMenu === 'new' ? faAngleUp : faAngleDown} />
              </button>
              {mobileSubMenu === 'new' && (
                <div className={`border-t ${isDark ? 'border-slate-700/50 bg-slate-900/50' : 'border-slate-200 bg-white/50'}`}>
                  <button onClick={() => handleMobileAction(onAddBookClick)} className={`w-full flex items-center gap-3 p-4 ${isDark ? 'text-slate-300 hover:bg-emerald-600/20 hover:text-emerald-400' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'}`}>
                    <FontAwesomeIcon icon={faBook} className="text-emerald-500 w-5" /> Add New Book
                  </button>
                  <button onClick={() => handleMobileAction(onAddAuthorClick)} className={`w-full flex items-center gap-3 p-4 border-t ${isDark ? 'text-slate-300 hover:bg-emerald-600/20 hover:text-emerald-400 border-slate-700/30' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 border-slate-200'}`}>
                    <FontAwesomeIcon icon={faUser} className="text-emerald-500 w-5" /> Add New Author
                  </button>
                  <button onClick={() => handleMobileAction(onAddBorrowerClick)} className={`w-full flex items-center gap-3 p-4 border-t ${isDark ? 'text-slate-300 hover:bg-emerald-600/20 hover:text-emerald-400 border-slate-700/30' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 border-slate-200'}`}>
                    <FontAwesomeIcon icon={faUser} className="text-emerald-500 w-5" /> Add New Borrower
                  </button>
                </div>
              )}
            </div>

            {/* Update Section */}
            <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
              <button 
                onClick={() => setMobileSubMenu(mobileSubMenu === 'update' ? null : 'update')}
                className={`w-full flex items-center justify-between p-4 ${isDark ? 'text-white' : 'text-slate-800'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faPen} className="text-white" />
                  </div>
                  <span className="font-semibold">Update</span>
                </div>
                <FontAwesomeIcon icon={mobileSubMenu === 'update' ? faAngleUp : faAngleDown} />
              </button>
              {mobileSubMenu === 'update' && (
                <div className={`border-t ${isDark ? 'border-slate-700/50 bg-slate-900/50' : 'border-slate-200 bg-white/50'}`}>
                  <button onClick={() => handleMobileAction(onUpdateBookClick)} className={`w-full flex items-center gap-3 p-4 ${isDark ? 'text-slate-300 hover:bg-amber-600/20 hover:text-amber-400' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-600'}`}>
                    <FontAwesomeIcon icon={faEdit} className="text-amber-500 w-5" /> Update Book
                  </button>
                  <button onClick={() => handleMobileAction(onUpdateAuthorClick)} className={`w-full flex items-center gap-3 p-4 border-t ${isDark ? 'text-slate-300 hover:bg-amber-600/20 hover:text-amber-400 border-slate-700/30' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-600 border-slate-200'}`}>
                    <FontAwesomeIcon icon={faEdit} className="text-amber-500 w-5" /> Update Author
                  </button>
                  <button onClick={() => handleMobileAction(onUpdateBorrowerClick)} className={`w-full flex items-center gap-3 p-4 border-t ${isDark ? 'text-slate-300 hover:bg-amber-600/20 hover:text-amber-400 border-slate-700/30' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-600 border-slate-200'}`}>
                    <FontAwesomeIcon icon={faEdit} className="text-amber-500 w-5" /> Update Borrower
                  </button>
                </div>
              )}
            </div>

            {/* Delete Section */}
            <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
              <button 
                onClick={() => setMobileSubMenu(mobileSubMenu === 'delete' ? null : 'delete')}
                className={`w-full flex items-center justify-between p-4 ${isDark ? 'text-white' : 'text-slate-800'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faTrash} className="text-white" />
                  </div>
                  <span className="font-semibold">Delete</span>
                </div>
                <FontAwesomeIcon icon={mobileSubMenu === 'delete' ? faAngleUp : faAngleDown} />
              </button>
              {mobileSubMenu === 'delete' && (
                <div className={`border-t ${isDark ? 'border-slate-700/50 bg-slate-900/50' : 'border-slate-200 bg-white/50'}`}>
                  <button onClick={() => handleMobileAction(onDeleteBookClick)} className={`w-full flex items-center gap-3 p-4 ${isDark ? 'text-slate-300 hover:bg-red-600/20 hover:text-red-400' : 'text-slate-600 hover:bg-red-50 hover:text-red-600'}`}>
                    <FontAwesomeIcon icon={faTrash} className="text-red-500 w-5" /> Delete Book
                  </button>
                  <button onClick={() => handleMobileAction(onDeleteAuthorClick)} className={`w-full flex items-center gap-3 p-4 border-t ${isDark ? 'text-slate-300 hover:bg-red-600/20 hover:text-red-400 border-slate-700/30' : 'text-slate-600 hover:bg-red-50 hover:text-red-600 border-slate-200'}`}>
                    <FontAwesomeIcon icon={faTrash} className="text-red-500 w-5" /> Delete Author
                  </button>
                  <button onClick={() => handleMobileAction(onDeleteBorrowerClick)} className={`w-full flex items-center gap-3 p-4 border-t ${isDark ? 'text-slate-300 hover:bg-red-600/20 hover:text-red-400 border-slate-700/30' : 'text-slate-600 hover:bg-red-50 hover:text-red-600 border-slate-200'}`}>
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
            <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
              <button 
                onClick={() => setMobileSubMenu(mobileSubMenu === 'view' ? null : 'view')}
                className={`w-full flex items-center justify-between p-4 ${isDark ? 'text-white' : 'text-slate-800'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                    <FontAwesomeIcon icon={faTable} className="text-white" />
                  </div>
                  <span className="font-semibold">View All</span>
                </div>
                <FontAwesomeIcon icon={mobileSubMenu === 'view' ? faAngleUp : faAngleDown} />
              </button>
              {mobileSubMenu === 'view' && (
                <div className={`border-t ${isDark ? 'border-slate-700/50 bg-slate-900/50' : 'border-slate-200 bg-white/50'}`}>
                  <button onClick={() => handleMobileAction(onBooksTableClick)} className={`w-full flex items-center gap-3 p-4 ${isDark ? 'text-slate-300 hover:bg-teal-600/20 hover:text-teal-400' : 'text-slate-600 hover:bg-teal-50 hover:text-teal-600'}`}>
                    <FontAwesomeIcon icon={faBook} className="text-teal-500 w-5" /> All Books
                  </button>
                  <button onClick={() => handleMobileAction(onAuthorsTableClick)} className={`w-full flex items-center gap-3 p-4 border-t ${isDark ? 'text-slate-300 hover:bg-teal-600/20 hover:text-teal-400 border-slate-700/30' : 'text-slate-600 hover:bg-teal-50 hover:text-teal-600 border-slate-200'}`}>
                    <FontAwesomeIcon icon={faPenNib} className="text-teal-500 w-5" /> All Authors
                  </button>
                  <button onClick={() => handleMobileAction(onBorrowersTableClick)} className={`w-full flex items-center gap-3 p-4 border-t ${isDark ? 'text-slate-300 hover:bg-teal-600/20 hover:text-teal-400 border-slate-700/30' : 'text-slate-600 hover:bg-teal-50 hover:text-teal-600 border-slate-200'}`}>
                    <FontAwesomeIcon icon={faUsers} className="text-teal-500 w-5" /> All Borrowers
                  </button>
                  <button onClick={() => handleMobileAction(onBorrowedBooksTableClick)} className={`w-full flex items-center gap-3 p-4 border-t ${isDark ? 'text-slate-300 hover:bg-amber-600/20 hover:text-amber-400 border-slate-700/30' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-600 border-slate-200'}`}>
                    <FontAwesomeIcon icon={faBookOpen} className="text-amber-500 w-5" /> Borrowed Books
                  </button>
                </div>
              )}
            </div>

            {/* Settings Section */}
            <div className={`rounded-xl overflow-hidden ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'}`}>
              <button 
                onClick={() => setMobileSubMenu(mobileSubMenu === 'settings' ? null : 'settings')}
                className={`w-full flex items-center justify-between p-4 ${isDark ? 'text-white' : 'text-slate-800'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`}>
                    <FontAwesomeIcon icon={faCog} className={isDark ? 'text-white' : 'text-slate-700'} />
                  </div>
                  <span className="font-semibold">Settings</span>
                </div>
                <FontAwesomeIcon icon={mobileSubMenu === 'settings' ? faAngleUp : faAngleDown} />
              </button>
              {mobileSubMenu === 'settings' && (
                <div className={`border-t ${isDark ? 'border-slate-700/50 bg-slate-900/50' : 'border-slate-200 bg-white/50'}`}>
                  {/* User Info */}
                  <div className={`p-4 border-b ${isDark ? 'border-slate-700/30' : 'border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        user?.role === 'admin' ? 'bg-indigo-500/20' : 'bg-emerald-500/20'
                      }`}>
                        <FontAwesomeIcon icon={user?.role === 'admin' ? faUserShield : faUser} className={`${
                          user?.role === 'admin' ? 'text-indigo-400' : 'text-emerald-400'
                        }`} />
                      </div>
                      <div>
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>{user?.name || 'User'}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          user?.role === 'admin' 
                            ? 'bg-indigo-500/20 text-indigo-400' 
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {user?.role || 'librarian'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Theme Toggle */}
                  <button onClick={toggleTheme} className={`w-full flex items-center justify-between p-4 border-b ${isDark ? 'text-slate-300 border-slate-700/30' : 'text-slate-600 border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={isDark ? faMoon : faSun} className={`w-5 ${isDark ? 'text-indigo-400' : 'text-amber-500'}`} />
                      <span>Theme</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-600'
                    }`}>
                      {isDark ? 'Dark' : 'Light'}
                    </div>
                  </button>

                  {/* Admin Options */}
                  {isAdmin() && (
                    <>
                      <button onClick={() => handleMobileAction(onAddLibrarianClick)} className={`w-full flex items-center gap-3 p-4 border-b ${isDark ? 'text-slate-300 hover:bg-indigo-600/20 hover:text-indigo-400 border-slate-700/30' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border-slate-200'}`}>
                        <FontAwesomeIcon icon={faUserPlus} className="text-indigo-500 w-5" /> Add Librarian
                      </button>
                      <button onClick={() => handleMobileAction(onLibrariansTableClick)} className={`w-full flex items-center gap-3 p-4 border-b ${isDark ? 'text-slate-300 hover:bg-indigo-600/20 hover:text-indigo-400 border-slate-700/30' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border-slate-200'}`}>
                        <FontAwesomeIcon icon={faUsers} className="text-indigo-500 w-5" /> Manage Librarians
                      </button>
                    </>
                  )}

                  {/* Logout */}
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 p-4 ${isDark ? 'text-red-400 hover:bg-red-600/20' : 'text-red-500 hover:bg-red-50'}`}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="w-5" /> Logout
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
