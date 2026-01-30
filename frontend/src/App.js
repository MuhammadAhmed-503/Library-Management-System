import React, { lazy, useState, startTransition } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import Home from "./components/Home.js";
// import Header from "./components/Header.js";
// import AddBook from "./components/new/AddBook.js";
// import AddAuthor from "./components/new/AddAuthor.js";
// import AddBorrower from "./components/new/AddBorrower.js";
// import BookCheckin from "./components/checkin_checkout/BookCheckin.js";
// import BookCheckout from "./components/checkin_checkout/BookCheckout.js";
// import UpdateBorrower from "./components/update/UpdateBorrower.js";
// import UpdateAuthor from "./components/update/UpdateAuthor.js";
// import UpdateBook from "./components/update/UpdateBook.js";
// import DeleteBorrower from "./components/delete/DeleteBorrower.js";
// import DeleteBook from "./components/delete/DeleteBook.js";
// import ShowBorrowers from "./components/show/ShowBorrowers.js";
// import ShowBooks from "./components/show/ShowBooks.js";
// import ShowAuthors from "./components/show/ShowAuthors.js";

const Home = lazy(() => import("./components/Home.js"));
const Header = lazy(() => import("./components/Header.js"));

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

function App() {
  const [activeForm, setActiveForm] = useState("goToHome");

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

  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
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
        goHome={handleGoHomeClick}
      />
      <div
        className="min-h-screen text-white flex justify-center items-start pt-4 sm:pt-6 lg:pt-8 px-2 sm:px-4"
        align="center"
      >
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl shadow-slate-950/50 border border-slate-800/50 w-full max-w-4xl mx-0 sm:mx-4">
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
        theme="dark"
        toastStyle={{
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
        }}
      />
    </div>
  );
}

export default App;
