const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const { 
  getBooks, 
  getBookById, 
  addBook, 
  updateBook, 
  deleteBook,
  getBookStats 
} = require('../controllers/bookController');

// Validation middleware
const validateBook = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be between 1 and 200 characters'),
  body('author')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author is required and must be between 1 and 100 characters'),
  body('price')
    .isFloat({ min: 0, max: 10000 })
    .withMessage('Price must be a number between 0 and 10,000'),
  body('publishedDate')
    .isISO8601()
    .withMessage('Published date must be a valid date'),
  body('isbn')
    .optional()
    .matches(/^(?:\d{10}|\d{13})$/)
    .withMessage('ISBN must be 10 or 13 digits'),
  body('genre')
    .optional()
    .isIn(['Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 'Romance', 'Biography', 'History', 'Self-Help', 'Other'])
    .withMessage('Invalid genre'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('coverImage')
    .optional()
    .isURL()
    .withMessage('Cover image must be a valid URL'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];

const validateId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid book ID format')
];

const validateQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isIn(['title', 'author', 'price', 'publishedDate', 'createdAt', 'updatedAt'])
    .withMessage('Invalid sort field'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be either asc or desc'),
  query('genre')
    .optional()
    .isIn(['Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 'Romance', 'Biography', 'History', 'Self-Help', 'Other'])
    .withMessage('Invalid genre filter'),
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a non-negative number'),
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a non-negative number')
];

// Routes
router.get('/', validateQuery, getBooks);
router.get('/stats', getBookStats);
router.get('/:id', validateId, getBookById);
router.post('/', validateBook, addBook);
router.put('/:id', [...validateId, ...validateBook], updateBook);
router.delete('/:id', validateId, deleteBook);

module.exports = router;