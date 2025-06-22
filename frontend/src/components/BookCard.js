import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaUser, 
  FaCalendar, 
  FaDollarSign, 
  FaBook
} from 'react-icons/fa';
import { format } from 'date-fns';
import './BookCard.css';

const BookCard = ({ book, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cardRef.current.style.setProperty('--mouse-x', `${x}px`);
      cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(book._id);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
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

  return (
    <motion.div
      ref={cardRef}
      className="book-card"
      onMouseMove={handleMouseMove}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
    >
      {/* Cover Image */}
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
        
        {/* Action Overlay */}
        <motion.div 
          className="action-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: showActions ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="action-buttons">
            <Link 
              to={`/edit/${book._id}`}
              className="action-btn edit-btn"
              title="Edit Book"
            >
              <FaEdit />
            </Link>
            <button 
              className="action-btn delete-btn"
              onClick={handleDelete}
              title="Delete Book"
            >
              <FaTrash />
            </button>
            <Link 
              to={`/view/${book._id}`}
              className="action-btn view-btn"
              title="View Details"
            >
              <FaEye />
            </Link>
          </div>
        </motion.div>

        {/* Genre Badge */}
        <div 
          className="genre-badge"
          style={{ backgroundColor: getGenreColor(book.genre) }}
        >
          {book.genre}
        </div>
      </div>

      {/* Book Info */}
      <div className="book-info">
        <h3 className="book-title" title={book.title}>
          {book.title}
        </h3>
        
        <div className="book-meta">
          <div className="meta-item">
            <FaUser className="meta-icon" />
            <span className="meta-text">{book.author}</span>
          </div>
          
          <div className="meta-item">
            <FaCalendar className="meta-icon" />
            <span className="meta-text">{formatDate(book.publishedDate)}</span>
          </div>
          
          <div className="meta-item">
            <FaDollarSign className="meta-icon" />
            <span className="meta-text price">${book.price.toFixed(2)}</span>
          </div>
        </div>

        {book.description && (
          <p className="book-description" title={book.description}>
            {book.description.length > 100 
              ? `${book.description.substring(0, 100)}...` 
              : book.description
            }
          </p>
        )}

        {book.isbn && (
          <div className="book-isbn">
            <span className="isbn-label">ISBN:</span>
            <span className="isbn-value">{book.isbn}</span>
          </div>
        )}

        {book.stock !== undefined && (
          <div className="book-stock">
            <span className={`stock-badge ${book.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        )}
      </div>

      {/* Hover Effect Border */}
      <motion.div 
        className="hover-border"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: showActions ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default BookCard; 