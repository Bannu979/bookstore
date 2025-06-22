import React, { useState, useEffect, useCallback } from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
// import { 
//   FaArrowLeft,
//   FaBook, 
//   FaCalendar, 
//   FaDollarSign, 
//   FaEdit,
//   FaEye,
//   FaTrash,
//   FaUser
// } from 'react-icons/fa';
import { FaSearch, FaFilter, FaSort, FaBook, FaTag } from 'react-icons/fa';
import { bookAPI } from '../services/api';
import './BookView.css';

const BookView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBook = useCallback(async () => {
    try {
      setLoading(true);
      const response = await bookAPI.getBook(id);
      setBook(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch book details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookAPI.deleteBook(id);
        toast.success('Book deleted successfully');
        navigate('/');
      } catch (error) {
        toast.error(error.message || 'Failed to delete book');
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const getGenreColor = (genre) => {
    const colors = {
      'Fiction': '#3b82f6',
      'Non-Fiction': '#10b981',
      'Science Fiction': '#8b5cf6',
      'Mystery': '#f59e0b',
      'Romance': '#ec4899',
      'Biography': '#06b6d4',
      'History': '#84cc16',
      'Self-Help': '#f97316',
      'Other': '#6b7280'
    };
    return colors[genre] || colors['Other'];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading book details...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="error-container">
        <h3>Book not found</h3>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          Back to Books
        </button>
      </div>
    );
  }

  return (
    <div className="book-view-container">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="view-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-content">
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              <FaArrowLeft />
              Back to Books
            </button>
            <h1 className="page-title">📖 Book Details</h1>
          </div>
        </motion.div>

        {/* Book Details */}
        <motion.div 
          className="book-details-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="book-details-grid">
            {/* Cover Image */}
            <div className="book-cover-section">
              <div className="book-cover">
                {book.coverImage ? (
                  <img 
                    src={book.coverImage} 
                    alt={book.title}
                    className="cover-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="cover-placeholder">
                  <FaBook />
                </div>
              </div>
              
              {/* Genre Badge */}
              <div 
                className="genre-badge"
                style={{ backgroundColor: getGenreColor(book.genre) }}
              >
                {book.genre}
              </div>
            </div>

            {/* Book Information */}
            <div className="book-info-section">
              <h2 className="book-title">{book.title}</h2>
              
              <div className="book-meta">
                <div className="meta-item">
                  <FaUser className="meta-icon" />
                  <span className="meta-label">Author:</span>
                  <span className="meta-value">{book.author}</span>
                </div>
                
                <div className="meta-item">
                  <FaCalendar className="meta-icon" />
                  <span className="meta-label">Published:</span>
                  <span className="meta-value">{formatDate(book.publishedDate)}</span>
                </div>
                
                <div className="meta-item">
                  <FaDollarSign className="meta-icon" />
                  <span className="meta-label">Price:</span>
                  <span className="meta-value price">${book.price.toFixed(2)}</span>
                </div>

                {book.isbn && (
                  <div className="meta-item">
                    <FaBook className="meta-icon" />
                    <span className="meta-label">ISBN:</span>
                    <span className="meta-value">{book.isbn}</span>
                  </div>
                )}

                {book.stock !== undefined && (
                  <div className="meta-item">
                    <FaEye className="meta-icon" />
                    <span className="meta-label">Stock:</span>
                    <span className={`meta-value ${book.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {book.stock > 0 ? `${book.stock} available` : 'Out of stock'}
                    </span>
                  </div>
                )}
              </div>

              {book.description && (
                <div className="book-description">
                  <h3>Description</h3>
                  <p>{book.description}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate(`/edit/${id}`)}
                >
                  <FaEdit />
                  Edit Book
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  <FaTrash />
                  Delete Book
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookView; 