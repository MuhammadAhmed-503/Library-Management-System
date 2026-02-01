const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Librarian = require('../models/Librarian');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Login route (for both admin and librarians)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Check if it's admin login
    if (username === process.env.ADMIN_USERNAME) {
      if (password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign(
          { id: 'admin', username: process.env.ADMIN_USERNAME, role: 'admin', name: 'Administrator' },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );
        return res.json({
          message: 'Admin login successful',
          token,
          user: {
            id: 'admin',
            username: process.env.ADMIN_USERNAME,
            name: 'Administrator',
            role: 'admin'
          }
        });
      } else {
        return res.status(401).json({ message: 'Invalid admin credentials.' });
      }
    }

    // Check librarian login
    const librarian = await Librarian.findOne({ username, isActive: true });
    if (!librarian) {
      return res.status(401).json({ message: 'Invalid credentials or account is deactivated.' });
    }

    const isMatch = await librarian.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: librarian._id, username: librarian.username, role: librarian.role, name: librarian.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: librarian._id,
        username: librarian.username,
        name: librarian.name,
        email: librarian.email,
        role: librarian.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// Verify token route
router.get('/verify', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// Register new librarian (admin only)
router.post('/librarians', verifyToken, isAdmin, async (req, res) => {
  try {
    const { username, password, name, email } = req.body;

    if (!username || !password || !name || !email) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if username or email already exists
    const existingLibrarian = await Librarian.findOne({
      $or: [{ username }, { email }]
    });

    if (existingLibrarian) {
      return res.status(400).json({ 
        message: existingLibrarian.username === username 
          ? 'Username already exists.' 
          : 'Email already exists.' 
      });
    }

    const librarian = new Librarian({
      username,
      password,
      name,
      email,
      createdBy: req.user.username
    });

    await librarian.save();

    res.status(201).json({
      message: 'Librarian created successfully',
      librarian: {
        id: librarian._id,
        username: librarian.username,
        name: librarian.name,
        email: librarian.email,
        role: librarian.role,
        createdAt: librarian.createdAt
      }
    });
  } catch (error) {
    console.error('Create librarian error:', error);
    res.status(500).json({ message: 'Server error while creating librarian.' });
  }
});

// Get all librarians (admin only)
router.get('/librarians', verifyToken, isAdmin, async (req, res) => {
  try {
    const librarians = await Librarian.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(librarians);
  } catch (error) {
    console.error('Get librarians error:', error);
    res.status(500).json({ message: 'Server error while fetching librarians.' });
  }
});

// Get single librarian (admin only)
router.get('/librarians/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const librarian = await Librarian.findById(req.params.id).select('-password');
    if (!librarian) {
      return res.status(404).json({ message: 'Librarian not found.' });
    }
    res.json(librarian);
  } catch (error) {
    console.error('Get librarian error:', error);
    res.status(500).json({ message: 'Server error while fetching librarian.' });
  }
});

// Update librarian (admin only)
router.put('/librarians/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { name, email, isActive, password } = req.body;
    
    const librarian = await Librarian.findById(req.params.id);
    if (!librarian) {
      return res.status(404).json({ message: 'Librarian not found.' });
    }

    if (name) librarian.name = name;
    if (email) librarian.email = email;
    if (typeof isActive === 'boolean') librarian.isActive = isActive;
    if (password) librarian.password = password;

    await librarian.save();

    res.json({
      message: 'Librarian updated successfully',
      librarian: {
        id: librarian._id,
        username: librarian.username,
        name: librarian.name,
        email: librarian.email,
        role: librarian.role,
        isActive: librarian.isActive
      }
    });
  } catch (error) {
    console.error('Update librarian error:', error);
    res.status(500).json({ message: 'Server error while updating librarian.' });
  }
});

// Delete librarian (admin only)
router.delete('/librarians/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const librarian = await Librarian.findByIdAndDelete(req.params.id);
    if (!librarian) {
      return res.status(404).json({ message: 'Librarian not found.' });
    }
    res.json({ message: 'Librarian deleted successfully' });
  } catch (error) {
    console.error('Delete librarian error:', error);
    res.status(500).json({ message: 'Server error while deleting librarian.' });
  }
});

// Change own password (for logged in user)
router.put('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required.' });
    }

    // Admin cannot change password through this route
    if (req.user.role === 'admin' && req.user.id === 'admin') {
      return res.status(400).json({ message: 'Admin password must be changed in the .env file.' });
    }

    const librarian = await Librarian.findById(req.user.id);
    if (!librarian) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await librarian.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    librarian.password = newPassword;
    await librarian.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error while changing password.' });
  }
});

module.exports = router;
