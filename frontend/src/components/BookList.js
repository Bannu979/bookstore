import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
// import { FaBook, FaFilter, FaSearch, FaSort, FaTag } from 'react-icons/fa';
import { FaSearch, FaFilter, FaSort, FaBook, FaTag, FaDollarSign } from 'react-icons/fa';
import { bookAPI } from '../services/api';
import toast from 'react-hot-toast';
import BookCard from './BookCard';
import './BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    minPrice: '',
    maxPrice: '',
    sort: 'createdAt',
    order: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0,
    limit: 12
  });
  const [showFilters, setShowFilters] = useState(false);

  const genres = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 
    'Romance', 'Biography', 'History', 'Self-Help', 'Other'
  ];

  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'author', label: 'Author' },
    { value: 'price', label: 'Price' },
    { value: 'publishedDate', label: 'Published Date' },
    { value: 'createdAt', label: 'Date Added' }
  ];

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.currentPage,
        limit: pagination.limit
      };
      
      const response = await bookAPI.getBooks(params);
      setBooks(response.data);
      setPagination(prev => ({
        ...prev,
        totalPages: response.pagination.totalPages,
        totalBooks: response.pagination.totalBooks
      }));
    } catch (error) {
      toast.error(error.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.limit]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookAPI.deleteBook(id);
        toast.success('Book deleted successfully');
        fetchBooks();
      } catch (error) {
        toast.error(error.message || 'Failed to delete book');
      }
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      genre: '',
      minPrice: '',
      maxPrice: '',
      sort: 'createdAt',
      order: 'desc'
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="book-list-container">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="book-list-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <div>
              <h1 className="page-title">�� Book Collection</h1>
              <p className="page-subtitle">
                Discover and manage your literary treasures
              </p>
            </div>
            <Link to="/add" className="btn btn-primary">
              <FaBook />
              Add New Book
            </Link>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="filters-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="filters-header">
            <button 
              className="btn btn-secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
            {Object.values(filters).some(v => v !== '' && v !== 'createdAt' && v !== 'desc') && (
              <button className="btn btn-secondary" onClick={clearFilters}>
                Clear Filters
              </button>
            )}
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                className="filters-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="filters-grid">
                  {/* Search */}
                  <div className="form-group">
                    <label className="form-label">
                      <FaSearch /> Search
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Search by title or author..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </div>

                  {/* Genre */}
                  <div className="form-group">
                    <label className="form-label">
                      <FaTag /> Genre
                    </label>
                    <select
                      className="form-select"
                      value={filters.genre}
                      onChange={(e) => handleFilterChange('genre', e.target.value)}
                    >
                      <option value="">All Genres</option>
                      {genres.map(genre => (
                        <option key={genre} value={genre}>{genre}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="form-group">
                    <label className="form-label">
                      <FaDollarSign /> Min Price
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <FaDollarSign /> Max Price
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="1000"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </div>

                  {/* Sort */}
                  <div className="form-group">
                    <label className="form-label">
                      <FaSort /> Sort By
                    </label>
                    <select
                      className="form-select"
                      value={filters.sort}
                      onChange={(e) => handleFilterChange('sort', e.target.value)}
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Order */}
                  <div className="form-group">
                    <label className="form-label">Order</label>
                    <select
                      className="form-select"
                      value={filters.order}
                      onChange={(e) => handleFilterChange('order', e.target.value)}
                    >
                      <option value="desc">Descending</option>
                      <option value="asc">Ascending</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Info */}
        <motion.div 
          className="results-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p>
            Showing {books.length} of {pagination.totalBooks} books
            {filters.search && ` for "${filters.search}"`}
            {filters.genre && ` in ${filters.genre}`}
          </p>
        </motion.div>

        {/* Books Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading books...</p>
          </div>
        ) : (
          <motion.div 
            className="books-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="wait">
              {books.map((book) => (
                <motion.div
                  key={book._id}
                  variants={itemVariants}
                  layout
                >
                  <BookCard 
                    book={book} 
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <motion.div 
            className="pagination"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button
              className="btn btn-secondary"
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
            >
              Previous
            </button>
            
            <div className="pagination-pages">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`btn ${page === pagination.currentPage ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              className="btn btn-secondary"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
            >
              Next
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && books.length === 0 && (
          <motion.div 
            className="empty-state"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="empty-icon">
              <FaBook />
            </div>
            <h3>No books found</h3>
            <p>Try adjusting your filters or add a new book to get started.</p>
            <Link to="/add" className="btn btn-primary">
              Add Your First Book
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookList; 