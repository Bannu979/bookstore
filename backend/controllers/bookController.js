const Book = require('../models/Book');
const { validationResult } = require('express-validator');

// Get all books with filtering, sorting, and pagination
exports.getBooks = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sort = 'createdAt', 
      order = 'desc',
      genre,
      search,
      minPrice,
      maxPrice
    } = req.query;

    // Build query
    let query = {};
    
    if (genre) {
      query.genre = genre;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sort]: sortOrder };

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const books = await Book.find(query)
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Book.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: books,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalBooks: total,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch books',
      message: error.message
    });
  }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found',
        message: 'No book found with the provided ID'
      });
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch book',
      message: error.message
    });
  }
};

// Create a new book
exports.addBook = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const newBook = new Book(req.body);
    await newBook.save();

    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: newBook
    });
  } catch (error) {
    console.error('Error creating book:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate Error',
        message: 'A book with this ISBN already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create book',
      message: error.message
    });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errors.array()
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        error: 'Book not found',
        message: 'No book found with the provided ID'
      });
    }

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook
    });
  } catch (error) {
    console.error('Error updating book:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate Error',
        message: 'A book with this ISBN already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update book',
      message: error.message
    });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        error: 'Book not found',
        message: 'No book found with the provided ID'
      });
    }

    res.json({
      success: true,
      message: 'Book deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete book',
      message: error.message
    });
  }
};

// Get book statistics
exports.getBookStats = async (req, res) => {
  try {
    const stats = await Book.aggregate([
      {
        $group: {
          _id: null,
          totalBooks: { $sum: 1 },
          totalValue: { $sum: '$price' },
          averagePrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    const genreStats = await Book.aggregate([
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 },
          averagePrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const yearStats = await Book.aggregate([
      {
        $group: {
          _id: { $year: '$publishedDate' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        byGenre: genreStats,
        byYear: yearStats
      }
    });
  } catch (error) {
    console.error('Error fetching book stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch book statistics',
      message: error.message
    });
  }
};