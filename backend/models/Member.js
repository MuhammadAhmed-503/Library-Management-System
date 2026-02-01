const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const memberSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    default: 'member',
    enum: ['member']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  membershipDate: {
    type: Date,
    default: Date.now
  },
  // Link to Borrower collection for admin visibility
  borrowerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Borrower'
  },
  borrowedBooks: [{
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    },
    borrowedDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date
    },
    returnedDate: {
      type: Date,
      default: null
    }
  }],
  borrowingHistory: [{
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    },
    borrowedDate: {
      type: Date
    },
    returnedDate: {
      type: Date
    }
  }]
});

// Hash password before saving
memberSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
memberSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get current borrowed books
memberSchema.methods.getCurrentBorrowedBooks = function() {
  return this.borrowedBooks.filter(b => b.returnedDate === null);
};

module.exports = mongoose.model('Member', memberSchema);
