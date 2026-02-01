const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const Book = require('../models/Book');
const Borrower = require('../models/Borrower');
const { verifyToken, isAdmin, isLibrarian, isMember } = require('../middleware/authMiddleware');

// Member Registration
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, email, phone, address } = req.body;

    if (!username || !password || !name || !email) {
      return res.status(400).json({ message: 'Username, password, name, and email are required.' });
    }

    // Check if username or email already exists in Member collection
    const existingMember = await Member.findOne({
      $or: [{ username }, { email }]
    });

    if (existingMember) {
      return res.status(400).json({
        message: existingMember.username === username
          ? 'Username already exists.'
          : 'Email already exists.'
      });
    }

    // Check if email already exists in Borrower collection
    const existingBorrower = await Borrower.findOne({ borrowerEmail: email });
    if (existingBorrower) {
      return res.status(400).json({ message: 'This email is already registered as a borrower.' });
    }

    // Create member
    const member = new Member({
      username,
      password,
      name,
      email,
      phone,
      address
    });

    await member.save();

    // Also create a borrower entry so admin can see them in borrowers list
    const borrower = new Borrower({
      borrowerName: name,
      borrowerEmail: email,
      borrowerPhone: phone || '',
      borrowerAddress: address || '',
      books: []
    });

    await borrower.save();

    // Link the borrower to member
    member.borrowerId = borrower._id;
    await member.save();

    // Generate token for auto-login after registration
    const token = jwt.sign(
      { id: member._id, username: member.username, role: 'member', name: member.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: member._id,
        username: member.username,
        name: member.name,
        email: member.email,
        role: 'member'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// Member Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const member = await Member.findOne({ username, isActive: true });
    if (!member) {
      return res.status(401).json({ message: 'Invalid credentials or account is deactivated.' });
    }

    const isMatch = await member.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: member._id, username: member.username, role: 'member', name: member.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: member._id,
        username: member.username,
        name: member.name,
        email: member.email,
        role: 'member'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// Get member profile
router.get('/profile', verifyToken, isMember, async (req, res) => {
  try {
    const member = await Member.findById(req.user.id)
      .select('-password')
      .populate('borrowedBooks.book');
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    res.json(member);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile.' });
  }
});

// Update member profile
router.put('/profile', verifyToken, isMember, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    
    const member = await Member.findById(req.user.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    if (name) member.name = name;
    if (email) member.email = email;
    if (phone) member.phone = phone;
    if (address) member.address = address;

    await member.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: member._id,
        username: member.username,
        name: member.name,
        email: member.email,
        phone: member.phone,
        address: member.address,
        role: 'member'
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile.' });
  }
});

// Change password
router.put('/change-password', verifyToken, isMember, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required.' });
    }

    const member = await Member.findById(req.user.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    const isMatch = await member.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    member.password = newPassword;
    await member.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error while changing password.' });
  }
});

// Search books (available for members)
router.get('/search-books', verifyToken, async (req, res) => {
  try {
    const { query, category, available } = req.query;
    let searchQuery = {};

    if (query) {
      const regex = new RegExp(query, 'i');
      searchQuery.$or = [
        { title: regex },
        { category: regex }
      ];
    }

    if (category) {
      searchQuery.category = new RegExp(category, 'i');
    }

    if (available === 'true') {
      searchQuery.borrower = null;
    }

    const books = await Book.find(searchQuery)
      .populate('author')
      .populate('borrower');

    res.json(books);
  } catch (error) {
    console.error('Search books error:', error);
    res.status(500).json({ message: 'Server error while searching books.' });
  }
});

// Get book details
router.get('/books/:id', verifyToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('author')
      .populate('borrower');

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    res.json(book);
  } catch (error) {
    console.error('Get book details error:', error);
    res.status(500).json({ message: 'Server error while fetching book details.' });
  }
});

// Borrow a book (member)
router.post('/borrow/:bookId', verifyToken, isMember, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    if (book.borrower) {
      return res.status(400).json({ message: 'Book is already borrowed.' });
    }

    const member = await Member.findById(req.user.id);
    
    // Check if member already has max books borrowed (e.g., 5 books)
    const currentlyBorrowed = member.borrowedBooks.filter(b => b.returnedDate === null);
    if (currentlyBorrowed.length >= 5) {
      return res.status(400).json({ message: 'You have reached the maximum number of borrowed books (5).' });
    }

    // Calculate due date (14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    // Update book
    book.borrower = member._id;
    book.borrowedDate = new Date();
    await book.save();

    // Update member's borrowed books
    member.borrowedBooks.push({
      book: book._id,
      borrowedDate: new Date(),
      dueDate: dueDate
    });
    await member.save();

    res.json({
      message: 'Book borrowed successfully',
      book: {
        id: book._id,
        title: book.title,
        borrowedDate: new Date(),
        dueDate: dueDate
      }
    });
  } catch (error) {
    console.error('Borrow book error:', error);
    res.status(500).json({ message: 'Server error while borrowing book.' });
  }
});

// Return a book (member)
router.post('/return/:bookId', verifyToken, isMember, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    const member = await Member.findById(req.user.id);
    
    // Find the borrowed book record
    const borrowedIndex = member.borrowedBooks.findIndex(
      b => b.book.toString() === req.params.bookId && b.returnedDate === null
    );

    if (borrowedIndex === -1) {
      return res.status(400).json({ message: 'You have not borrowed this book.' });
    }

    // Update member's borrowed books and add to history
    const borrowedBook = member.borrowedBooks[borrowedIndex];
    borrowedBook.returnedDate = new Date();

    // Add to borrowing history
    member.borrowingHistory.push({
      book: borrowedBook.book,
      borrowedDate: borrowedBook.borrowedDate,
      returnedDate: new Date()
    });

    await member.save();

    // Update book
    book.borrower = null;
    book.borrowedDate = null;
    await book.save();

    res.json({
      message: 'Book returned successfully',
      book: {
        id: book._id,
        title: book.title
      }
    });
  } catch (error) {
    console.error('Return book error:', error);
    res.status(500).json({ message: 'Server error while returning book.' });
  }
});

// Get current borrowed books (member)
router.get('/my-books', verifyToken, isMember, async (req, res) => {
  try {
    const member = await Member.findById(req.user.id)
      .populate({
        path: 'borrowedBooks.book',
        populate: { path: 'author' }
      });

    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    const currentBooks = member.borrowedBooks.filter(b => b.returnedDate === null);
    res.json(currentBooks);
  } catch (error) {
    console.error('Get my books error:', error);
    res.status(500).json({ message: 'Server error while fetching borrowed books.' });
  }
});

// Get borrowing history (member)
router.get('/history', verifyToken, isMember, async (req, res) => {
  try {
    const member = await Member.findById(req.user.id)
      .populate({
        path: 'borrowingHistory.book',
        populate: { path: 'author' }
      })
      .populate({
        path: 'borrowedBooks.book',
        populate: { path: 'author' }
      });

    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    // Combine current borrowed books and history
    const history = [
      ...member.borrowedBooks.map(b => ({
        ...b.toObject(),
        status: b.returnedDate ? 'returned' : 'borrowed'
      })),
      ...member.borrowingHistory.map(b => ({
        ...b.toObject(),
        status: 'returned'
      }))
    ];

    // Sort by date (most recent first)
    history.sort((a, b) => new Date(b.borrowedDate) - new Date(a.borrowedDate));

    res.json(history);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error while fetching borrowing history.' });
  }
});

// Admin/Librarian: Get all members
router.get('/', verifyToken, isLibrarian, async (req, res) => {
  try {
    const members = await Member.find()
      .select('-password')
      .populate('borrowedBooks.book')
      .sort({ membershipDate: -1 });
    res.json(members);
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ message: 'Server error while fetching members.' });
  }
});

// Admin/Librarian: Get single member
router.get('/:id', verifyToken, isLibrarian, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
      .select('-password')
      .populate('borrowedBooks.book')
      .populate('borrowingHistory.book');
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }
    res.json(member);
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({ message: 'Server error while fetching member.' });
  }
});

// Admin/Librarian: Update member
router.put('/:id', verifyToken, isLibrarian, async (req, res) => {
  try {
    const { name, email, phone, address, isActive } = req.body;
    
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    if (name) member.name = name;
    if (email) member.email = email;
    if (phone) member.phone = phone;
    if (address) member.address = address;
    if (typeof isActive === 'boolean') member.isActive = isActive;

    await member.save();

    res.json({
      message: 'Member updated successfully',
      member: {
        id: member._id,
        username: member.username,
        name: member.name,
        email: member.email,
        phone: member.phone,
        address: member.address,
        isActive: member.isActive
      }
    });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ message: 'Server error while updating member.' });
  }
});

// Admin: Delete member
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    // Check if member has borrowed books
    const currentBooks = member.borrowedBooks.filter(b => b.returnedDate === null);
    if (currentBooks.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete member with borrowed books. Please return all books first.' 
      });
    }

    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ message: 'Server error while deleting member.' });
  }
});

module.exports = router;
