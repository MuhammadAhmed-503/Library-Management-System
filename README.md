# 📚 Library Management System

A full-stack web application for managing library operations including books, authors, borrowers, members, and librarian accounts. Built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).

---

## 🎯 What Does This Product Do?

The **Library Management System** is a comprehensive solution designed to digitize and streamline library operations. It provides multiple user roles with different access levels and functionalities.

---

## 👥 User Roles & Capabilities

### 📖 User / Member
Members are library patrons who can:
- **Register / Login** – Create an account or sign in to the system
- **Search Books** – Find books by title, author, or category
- **View Book Details** – See detailed information (author, availability, category, etc.)
- **Borrow Book** – Check out available books (max 5 books at a time)
- **Return Book** – Return borrowed books
- **View Borrowing History** – Track all past and current borrowings
- **Manage Profile** – Update personal information and change password

### 👨‍💼 Librarian
Librarians have all Member capabilities plus:
- **Manage Books** – Add, update, and delete books
- **Manage Authors** – Add, update, and delete author records
- **Manage Borrowers** – Register and manage traditional borrowers
- **Process Check-ins/Check-outs** – Handle book transactions
- **View All Members** – Access member information and borrowing status
- **View Statistics** – Access dashboard with library metrics

### 👑 Admin
Administrators have full system control:
- **All Librarian Capabilities** – Complete library management
- **Manage Librarians** – Add, modify, and deactivate librarian accounts
- **Manage Members** – Full control over member accounts
- **Reports & Analytics** – Access detailed reports and statistics
- **System Oversight** – Monitor all library operations

---

## 🎨 Key Features

### 📖 Book Management
- **Add New Books** – Register books with title, author, category, and price
- **Update Book Details** – Modify existing book information
- **Delete Books** – Remove books from the inventory
- **View All Books** – Browse complete book catalog with search
- **Track Availability** – Monitor borrowed vs available books

### ✍️ Author Management
- **Add Authors** – Register author profiles
- **Update Author Information** – Edit author details
- **Delete Authors** – Remove author records
- **Author-Book Linking** – Automatic association with books

### 👥 Borrower/Member Management
- **Self-Registration** – Members can create their own accounts
- **Profile Management** – Users can update their information
- **Borrowing Limits** – Maximum 5 books per member
- **14-Day Loan Period** – Automatic due date calculation
- **Overdue Tracking** – Identify overdue books

### 🔄 Check-in/Check-out System
- **Book Checkout** – Issue books with automatic date tracking
- **Book Check-in** – Return books to inventory
- **Checkout Receipt** – Generate transaction receipts
- **Borrowed Books Tracking** – View all currently borrowed books

### 🔐 Authentication & Security
- **Role-Based Access** – Different permissions per role
- **Secure Login** – JWT-based authentication
- **Password Encryption** – Bcrypt hashing
- **Session Management** – Token-based sessions
- **Protected Routes** – Middleware-based protection

### 📊 Dashboard & Reports
- **Real-time Statistics** – Books, authors, members counts
- **Utilization Reports** – Book availability percentages
- **Top Borrowers** – Most active members
- **Overdue Reports** – Books past due date
- **Recent Activity** – Latest borrowing transactions

### 🎨 User Interface
- **Dark/Light Theme** – Toggle between themes
- **Responsive Design** – Works on all devices
- **Modern UI** – Built with TailwindCSS
- **Toast Notifications** – Real-time feedback
- **Loading States** – Smooth user experience

---

## 🧩 Project Modules

### Backend Modules (`/backend`)

| Module | File | Description |
|--------|------|-------------|
| **Server** | `server.js` | Main Express server with MongoDB connection |
| **Book Model** | `models/Book.js` | Schema for books |
| **Author Model** | `models/Author.js` | Schema for authors |
| **Borrower Model** | `models/Borrower.js` | Schema for borrowers |
| **Librarian Model** | `models/Librarian.js` | Schema for librarians |
| **Member Model** | `models/Member.js` | Schema for library members |
| **Book Routes** | `routes/bookRoutes.js` | API for book operations |
| **Author Routes** | `routes/authorRoutes.js` | API for author operations |
| **Borrower Routes** | `routes/borrowerRoutes.js` | API for borrower operations |
| **Auth Routes** | `routes/authRoutes.js` | Authentication endpoints |
| **Member Routes** | `routes/memberRoutes.js` | Member portal endpoints |
| **Count Routes** | `routes/countRoutes.js` | Statistics endpoints |
| **Auth Middleware** | `middleware/authMiddleware.js` | JWT & role verification |

### Frontend Modules (`/frontend/src`)

| Module | Path | Description |
|--------|------|-------------|
| **App Entry** | `App.js` | Main app with routing |
| **Home Dashboard** | `components/Home.js` | Statistics dashboard |
| **Header** | `components/Header.js` | Navigation bar |
| **Login** | `components/Login.js` | Multi-role login form |
| **Member Dashboard** | `components/member/MemberDashboard.js` | Member portal |
| **Member Profile** | `components/member/MemberProfile.js` | Profile management |
| **Member Register** | `components/member/Register.js` | Member registration |
| **Admin Reports** | `components/admin/AdminReports.js` | Reports & analytics |
| **Members Table** | `components/admin/MembersTable.js` | Manage members |
| **Add Book** | `components/new/AddBook.js` | Add new books |
| **Add Author** | `components/new/AddAuthor.js` | Add new authors |
| **Add Borrower** | `components/new/AddBorrower.js` | Register borrowers |
| **Update Book** | `components/update/UpdateBook.js` | Update book details |
| **Update Author** | `components/update/UpdateAuthor.js` | Update author info |
| **Update Borrower** | `components/update/UpdateBorrower.js` | Update borrower info |
| **Delete Book** | `components/delete/DeleteBook.js` | Delete books |
| **Delete Author** | `components/delete/DeleteAuthor.js` | Delete authors |
| **Delete Borrower** | `components/delete/DeleteBorrower.js` | Interface to delete borrowers |
| **Book Checkout** | `components/checkin_checkout/BookCheckout.js` | Issue books to borrowers |
| **Book Check-in** | `components/checkin_checkout/BookCheckin.js` | Return books to library |
| **Checkout Receipt** | `components/checkin_checkout/CheckoutReceipt.js` | Generate transaction receipts |
| **Books Table** | `components/tables/BooksTable.js` | Tabular view of all books |
| **Authors Table** | `components/tables/AuthorsTable.js` | Tabular view of all authors |
| **Borrowers Table** | `components/tables/BorrowersTable.js` | Tabular view of all borrowers |
| **Borrowed Books Table** | `components/tables/BorrowedBooksTable.js` | View currently borrowed books |
| **Show Books** | `components/show/ShowBooks.js` | Display books (all/borrowed/available) |
| **Show Authors** | `components/show/ShowAuthors.js` | Display all authors |
| **Show Borrowers** | `components/show/ShowBorrowers.js` | Display borrowers (all/without books) |
| **Add Librarian** | `components/admin/AddLibrarian.js` | Admin: Add new librarian accounts |
| **Librarians Table** | `components/admin/LibrariansTable.js` | Admin: Manage librarian accounts |
| **Search Components** | `components/search_comp/` | Search bar, form components, and item lists |
| **Auth Context** | `context/AuthContext.js` | Authentication state management |
| **Theme Context** | `context/ThemeContext.js` | Dark/Light theme state management |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js, TailwindCSS, React Toastify, FontAwesome Icons |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens), Bcrypt.js |
| **Development** | dotenv, CORS |

---

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud)
- Git

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/sayakghorai34/Library-Management-System.git
cd Library-Management-System
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Create `.env` file in `/backend` directory
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

4. Start the backend server
```bash
npm start
```

### Frontend Setup

1. Open a new terminal and navigate to frontend
```bash
cd frontend
npm install
```

2. Create `.env` file in `/frontend` directory
```env
REACT_APP_API_URI=http://localhost:5000/api
```

3. Start the frontend application
```bash
npm start
```

4. Open your browser and visit `http://localhost:3000`

---

## 📁 Project Structure

```
Library-Management-System/
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Author.js
│   │   ├── Book.js
│   │   ├── Borrower.js
│   │   ├── Librarian.js
│   │   └── Member.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── authorRoutes.js
│   │   ├── bookRoutes.js
│   │   ├── borrowerRoutes.js
│   │   ├── countRoutes.js
│   │   └── memberRoutes.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── AddLibrarian.js
│   │   │   │   ├── AdminReports.js
│   │   │   │   ├── LibrariansTable.js
│   │   │   │   └── MembersTable.js
│   │   │   ├── member/
│   │   │   │   ├── MemberDashboard.js
│   │   │   │   ├── MemberProfile.js
│   │   │   │   └── Register.js
│   │   │   ├── checkin_checkout/
│   │   │   ├── delete/
│   │   │   ├── new/
│   │   │   ├── search_comp/
│   │   │   ├── show/
│   │   │   ├── tables/
│   │   │   ├── update/
│   │   │   ├── Header.js
│   │   │   ├── Home.js
│   │   │   └── Login.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── ThemeContext.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── DemoPreview/
└── README.md
```

---

## 🔗 Live Demo

- [Library Manager Live](https://sg34-library-manager.netlify.app/)
- [UI Preview](frontend/README.md)

---

## 📝 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Staff login (Admin/Librarian) |
| GET | `/api/auth/verify` | Verify token |
| POST | `/api/auth/librarians` | Add librarian (Admin) |
| GET | `/api/auth/librarians` | Get all librarians (Admin) |
| PUT | `/api/auth/librarians/:id` | Update librarian (Admin) |
| DELETE | `/api/auth/librarians/:id` | Delete librarian (Admin) |

### Member Portal
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/members/register` | Member registration |
| POST | `/api/members/login` | Member login |
| GET | `/api/members/profile` | Get member profile |
| PUT | `/api/members/profile` | Update profile |
| PUT | `/api/members/change-password` | Change password |
| GET | `/api/members/search-books` | Search available books |
| GET | `/api/members/books/:id` | Get book details |
| POST | `/api/members/borrow/:bookId` | Borrow a book |
| POST | `/api/members/return/:bookId` | Return a book |
| GET | `/api/members/my-books` | Get borrowed books |
| GET | `/api/members/history` | Get borrowing history |

### Books
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| POST | `/api/books` | Add new book |
| PUT | `/api/books` | Update book |
| DELETE | `/api/books` | Delete book |
| PUT | `/api/books/checkout` | Checkout book |
| PUT | `/api/books/checkin` | Check-in book |
| GET | `/api/books/borrowed` | Get borrowed books |

### Authors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/authors` | Get all authors |
| POST | `/api/authors` | Add author |
| PUT | `/api/authors` | Update author |
| DELETE | `/api/authors` | Delete author |

### Borrowers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/borrowers` | Get all borrowers |
| POST | `/api/borrowers` | Add borrower |
| PUT | `/api/borrowers` | Update borrower |
| DELETE | `/api/borrowers` | Delete borrower |
| GET | `/api/counts` | Get dashboard statistics |

---

## 👨‍💻 Author

**Sayak Ghorai**

---

## 📄 License

This project is open source and available for educational purposes

app.use('/api/counts', countRoutes);    //replace these /api wwith your URI trailer
```
3. Run the following command to start the client
```
npm start
```
4. Open the browser and navigate to `http://localhost:3000/` to view the client

# Note:
 - Test(useless).js is just a checking file to see if the server is running or not. It is not a part of the project
 - Run the server before running the client(else the client will not fetch data until the server is running)
 - The project is still under development and some features may not work as expecte 
 - the `npm start` command will start the server using nodemon. To change the behaviour, change the `start` script in `package.json` file in the `backend` directory
 - The project is still under development and hence the Demo UI or the video may not be exact same as the current UI

# Contributed by:
 - Sayak Ghorai [(github/sayakghorai34)](https://github.com/sayakghorai34), 29th May 2024 
