const express = require('express');
const router = express.Router();
const Author = require('../models/Author');
const Book = require('../models/Book');

// Route to create a new author
router.post('/', async (req, res) => {
  try {
    const { authorName, authorEmail, authorPhone, books } = req.body;

    const bookIds = [];
    for (const bookName of books) {
      const trimmedBookName = bookName.trim();
      if (!trimmedBookName) continue; // Skip empty book names

      // Check if a book with this title already exists
      let existingBook = await Book.findOne({ title: trimmedBookName });
      
      if (existingBook && existingBook.author) {
        // Book already exists and has an author assigned - create a new book with same title for this author
        const newBook = await Book.create({ 
          title: trimmedBookName, 
          author: null, 
          category: '', 
          price: 0, 
          borrower: null 
        });
        bookIds.push(newBook._id);
      } else if (existingBook && !existingBook.author) {
        // Book exists but has no author - assign it to this new author
        bookIds.push(existingBook._id);
      } else {
        // Book doesn't exist - create a new one
        const newBook = await Book.create({ 
          title: trimmedBookName, 
          author: null, 
          category: '', 
          price: 0, 
          borrower: null 
        });
        bookIds.push(newBook._id);
      }
    }

    const newAuthor = await Author.create({
      authorName,
      authorEmail,
      authorPhone,
      books: bookIds,
    });

    // Only update author reference for books that belong to this new author
    for (const bookId of bookIds) {
      let book = await Book.findById(bookId);
      book.author = newAuthor._id;
      await book.save();
    }

    res.status(201).json({ message: 'Author and books created successfully', data: newAuthor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all authors
router.get('/', async (req, res) => {
  try {
    const authors = await Author.find().populate('books');
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
    try {
      const query = req.query.query;
      const regex = new RegExp(query, 'i'); 
      const authors = await Author.find({
        $or: [
          { authorName: { $regex: regex } }, 
          { authorEmail: { $regex: regex } },  
        ],
      }).populate('books');
      res.json(authors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Route to get author by ID
router.get('/:id', async (req, res) => {
  try {
    const authorId = req.params.id;
    const author = await Author.findById(authorId);
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
    try {
      const authorId = req.params.id;
      const { authorName, authorEmail, authorPhone } = req.body;
  
      const updatedAuthor = await Author.findByIdAndUpdate(
        authorId,
        { authorName, authorEmail, authorPhone },
        { new: true }
      );
  
      if (!updatedAuthor) {
        return res.status(404).json({ error: 'Author not found' });
      }
  
      res.status(200).json(updatedAuthor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Route to delete an author
router.delete('/:id', async (req, res) => {
  try {
    const authorId = req.params.id;
    
    // Find the author first
    const author = await Author.findById(authorId);
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    // Remove author reference from all books associated with this author
    await Book.updateMany(
      { author: authorId },
      { $set: { author: null } }
    );

    // Delete the author
    await Author.findByIdAndDelete(authorId);

    res.status(200).json({ message: 'Author deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
  

module.exports = router;
