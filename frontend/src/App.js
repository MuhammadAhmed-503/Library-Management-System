import React, { lazy, useState, startTransition, Suspense } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Logo from './app_logo.png';

const Home = lazy(() => import("./components/Home.js"));
const Header = lazy(() => import("./components/Header.js"));
const Login = lazy(() => import("./components/Login.js"));

const AddBook = lazy(() => import("./components/new/AddBook.js"));
const AddAuthor = lazy(() => import("./components/new/AddAuthor.js"));
const AddBorrower = lazy(() => import("./components/new/AddBorrower.js"));

const BookCheckin = lazy(() => import("./components/checkin_checkout/BookCheckin.js"));
const BookCheckout = lazy(() => import("./components/checkin_checkout/BookCheckout.js"));

const UpdateBorrower = lazy(() => import("./components/update/UpdateBorrower.js"));
const UpdateAuthor = lazy(() => import("./components/update/UpdateAuthor.js"));
const UpdateBook = lazy(() => import("./components/update/UpdateBook.js"));

const DeleteBorrower = lazy(() => import("./components/delete/DeleteBorrower.js"));
const DeleteBook = lazy(() => import("./components/delete/DeleteBook.js"));
const DeleteAuthor = lazy(() => import("./components/delete/DeleteAuthor.js"));

const ShowBorrowers = lazy(() => import("./components/show/ShowBorrowers.js"));
const ShowBooks = lazy(() => import("./components/show/ShowBooks.js"));
const ShowAuthors = lazy(() => import("./components/show/ShowAuthors.js"));

// Table Components
const BooksTable = lazy(() => import("./components/tables/BooksTable.js"));
const BorrowersTable = lazy(() => import("./components/tables/BorrowersTable.js"));
const AuthorsTable = lazy(() => import("./components/tables/AuthorsTable.js"));
const BorrowedBooksTable = lazy(() => import("./components/tables/BorrowedBooksTable.js"));

// Admin Components
const AddLibrarian = lazy(() => import("./components/admin/AddLibrarian.js"));
const LibrariansTable = lazy(() => import("./components/admin/LibrariansTable.js"));
const AdminReports = lazy(() => import("./components/admin/AdminReports.js"));
const MembersTable = lazy(() => import("./components/admin/MembersTable.js"));

// Member Components
const MemberDashboard = lazy(() => import("./components/member/MemberDashboard.js"));
const MemberProfile = lazy(() => import("./components/member/MemberProfile.js"));

// Loading Spinner Component
const LoadingSpinner = () => {
  const { isDark } = useTheme();
  return (
    <div className={`min-h-screen flex items-center justify-center ${
      isDark ? 'bg-slate-950' : 'bg-slate-100'
    }`}>
      <div className="text-center">
        <svg className="animate-spin h-12 w-12 mx-auto text-emerald-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className={`mt-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Loading...</p>
      </div>
    </div>
  );
};

// Main App Content (authenticated)
function AppContent() {
  const [activeForm, setActiveForm] = useState("goToHome");
  const { isAuthenticated, loading, isMember } = useAuth();
  const { isDark } = useTheme();

  const handleButtonClick = (formName) => {
    startTransition(() => {
      setActiveForm(formName);
    });
  };

  const handleGoHomeClick = () => {
    startTransition(() => {
      setActiveForm("goToHome");
    });
  };

  // Show loading while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show login if not authenticated
  if (!isAuthenticated()) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Login />
      </Suspense>
    );
  }

  // Member View
  if (isMember()) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <MemberApp />
      </Suspense>
    );
  }

  // Staff (Admin/Librarian) View
  return (
    <div className={`App min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-br from-slate-100 via-white to-slate-100'
    }`}>
      <Suspense fallback={<LoadingSpinner />}>
        <Header
          onAddBookClick={() => handleButtonClick("addBook")}
          onAddBorrowerClick={() => handleButtonClick("addBorrower")}
          onAddAuthorClick={() => handleButtonClick("addAuthor")}
          onUpdateBookClick={() => handleButtonClick("updateBook")}
          onUpdateBorrowerClick={() => handleButtonClick("updateBorrower")}
          onUpdateAuthorClick={() => handleButtonClick("updateAuthor")}
          onDeleteBookClick={() => handleButtonClick("deleteBook")}
          onDeleteBorrowerClick={() => handleButtonClick("deleteBorrower")}
          onDeleteAuthorClick={() => handleButtonClick("deleteAuthor")}
          onCheckinClick={() => handleButtonClick("checkinBook")}
          onCheckoutClick={() => handleButtonClick("checkoutBook")}
          onBooksTableClick={() => handleButtonClick("booksTable")}
          onBorrowersTableClick={() => handleButtonClick("borrowersTable")}
          onAuthorsTableClick={() => handleButtonClick("authorsTable")}
          onBorrowedBooksTableClick={() => handleButtonClick("borrowedBooksTable")}
          onAddLibrarianClick={() => handleButtonClick("addLibrarian")}
          onLibrariansTableClick={() => handleButtonClick("librariansTable")}
          onAdminReportsClick={() => handleButtonClick("adminReports")}
          onMembersTableClick={() => handleButtonClick("membersTable")}
          goHome={handleGoHomeClick}
        />
      </Suspense>
      <div
        className={`min-h-screen flex justify-center items-start pt-4 sm:pt-6 lg:pt-8 px-2 sm:px-4 ${
          isDark ? 'text-white' : 'text-slate-800'
        }`}
        align="center"
      >
        <div className={`backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border w-full max-w-4xl mx-0 sm:mx-4 transition-colors duration-300 ${
          isDark 
            ? 'bg-slate-900/80 shadow-slate-950/50 border-slate-800/50' 
            : 'bg-white/90 shadow-slate-200/50 border-slate-200'
        }`}>
          <Suspense fallback={<LoadingSpinner />}>
            {activeForm === "addBook" && <AddBook />}
            {activeForm === "addBorrower" && <AddBorrower />}
            {activeForm === "addAuthor" && <AddAuthor />}
            {activeForm === "updateBook" && <UpdateBook />}
            {activeForm === "updateAuthor" && <UpdateAuthor />}
            {activeForm === "updateBorrower" && <UpdateBorrower />}
            {activeForm === "deleteBorrower" && <DeleteBorrower />}
            {activeForm === "deleteBook" && <DeleteBook />}
            {activeForm === "deleteAuthor" && <DeleteAuthor />}
            {activeForm === "checkinBook" && <BookCheckin />}
            {activeForm === "checkoutBook" && <BookCheckout />}
            {activeForm === "goToHome" && (
              <Home
                showBooks={() => handleButtonClick("totalBooks")}
                showAuthors={() => handleButtonClick("totalAuthors")}
                showBorrowers={() => handleButtonClick("totalBorrowers")}
                showBorrowersWithoutBook={() => handleButtonClick("borrowersWithoutBook")}
                showCheckoutBooks={() => handleButtonClick("chckoutBook")}
                showRemainingBooks={() => handleButtonClick("remainingBooks")}
              />
            )}
            {activeForm === "totalBorrowers" && <ShowBorrowers type="all"/>}
            {activeForm === "borrowersWithoutBook" && <ShowBorrowers type="withoutbooks"/>}
            {activeForm === "totalBooks" && <ShowBooks type="all"/>}
            {activeForm === "chckoutBook" && <ShowBooks type="borrowed"/>}
            {activeForm === "remainingBooks" && <ShowBooks type="available"/>}
            {activeForm === "totalAuthors" && <ShowAuthors/>}
            {activeForm === "booksTable" && <BooksTable/>}
            {activeForm === "borrowersTable" && <BorrowersTable/>}
            {activeForm === "authorsTable" && <AuthorsTable/>}
            {activeForm === "borrowedBooksTable" && <BorrowedBooksTable/>}
            {activeForm === "addLibrarian" && <AddLibrarian/>}
            {activeForm === "librariansTable" && <LibrariansTable/>}
            {activeForm === "adminReports" && <AdminReports/>}
            {activeForm === "membersTable" && <MembersTable/>}
          </Suspense>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? "dark" : "light"}
        toastStyle={{
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
          borderRadius: '12px',
          color: isDark ? '#f1f5f9' : '#1e293b',
        }}
      />
    </div>
  );
}

// Member App Component
function MemberApp() {
  const [activeView, setActiveView] = useState("dashboard");
  const { isDark } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-br from-slate-100 via-white to-slate-100'
    }`}>
      {/* Member Header */}
      <header className={`p-4 border-b sticky top-0 z-50 ${
        isDark 
          ? 'bg-slate-900/95 border-slate-800 backdrop-blur-xl' 
          : 'bg-white/95 border-slate-200 backdrop-blur-xl'
      }`}>
        <div className="container mx-auto flex items-center justify-between">
          <h1 className={`flex items-center gap-2 text-xl font-bold ${
            isDark 
              ? 'bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent' 
              : 'text-slate-800'
          }`}>
            <img src={Logo} alt="Library Logo" className="w-8 h-8" />
            <span>Library Portal</span>
          </h1>
          <div className="flex items-center gap-4">
            <nav className="flex gap-2">
              <button
                onClick={() => setActiveView("dashboard")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeView === "dashboard"
                    ? 'bg-emerald-600 text-white'
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveView("profile")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeView === "profile"
                    ? 'bg-emerald-600 text-white'
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                My Profile
              </button>
            </nav>
            <div className={`flex items-center gap-3 pl-4 border-l ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Hello, {user?.name}
              </span>
              <button
                onClick={logout}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isDark 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                }`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Member Content */}
      <main className="container mx-auto py-6 px-4">
        <div className={`rounded-2xl border ${
          isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <Suspense fallback={<LoadingSpinner />}>
            {activeView === "dashboard" && <MemberDashboard />}
            {activeView === "profile" && <MemberProfile />}
          </Suspense>
        </div>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDark ? "dark" : "light"}
        toastStyle={{
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
          borderRadius: '12px',
          color: isDark ? '#f1f5f9' : '#1e293b',
        }}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
