import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  FaSave, 
  FaArrowLeft, 
  FaBook, 
  FaUser, 
  FaDollarSign, 
  FaCalendar,
  FaTag,
  FaLink,
  FaBoxes,
  FaFileAlt
} from 'react-icons/fa';
import { bookAPI } from '../services/api';
import toast from 'react-hot-toast';
import './BookForm.css';

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();

  const genres = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 
    'Romance', 'Biography', 'History', 'Self-Help', 'Other'
  ];

  const isEditing = !!id;

  const fetchBook = useCallback(async () => {
    try {
      setInitialLoading(true);
      const response = await bookAPI.getBook(id);
      const book = response.data;
      
      // Set form values
      Object.keys(book).forEach(key => {
        if (key === 'publishedDate') {
          setValue(key, new Date(book[key]).toISOString().split('T')[0]);
        } else {
          setValue(key, book[key]);
        }
      });
    } catch (error) {
      toast.error(error.message || 'Failed to fetch book');
      navigate('/');
    } finally {
      setInitialLoading(false);
    }
  }, [id, setValue, navigate]);

  useEffect(() => {
    if (isEditing) {
      fetchBook();
    }
  }, [isEditing, fetchBook]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Convert date string to Date object
      if (data.publishedDate) {
        data.publishedDate = new Date(data.publishedDate);
      }
      
      // Convert price to number
      if (data.price) {
        data.price = parseFloat(data.price);
      }
      
      // Convert stock to number
      if (data.stock) {
        data.stock = parseInt(data.stock);
      }

      if (isEditing) {
        await bookAPI.updateBook(id, data);
        toast.success('Book updated successfully!');
      } else {
        await bookAPI.createBook(data);
        toast.success('Book added successfully!');
      }
      
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading book details...</p>
      </div>
    );
  }

  return (
    <div className="book-form-container">
      <div className="container">
        <motion.div 
          className="form-header"
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
            <h1 className="page-title">
              {isEditing ? '✏️ Edit Book' : '📖 Add New Book'}
            </h1>
          </div>
        </motion.div>

        <motion.div 
          className="form-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="book-form">
            <div className="form-grid">
              {/* Title */}
              <div className="form-group">
                <label className="form-label">
                  <FaBook /> Book Title *
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  placeholder="Enter book title..."
                  {...register('title', { 
                    required: 'Title is required',
                    minLength: { value: 1, message: 'Title must be at least 1 character' },
                    maxLength: { value: 200, message: 'Title cannot exceed 200 characters' }
                  })}
                />
                {errors.title && (
                  <span className="error-message">{errors.title.message}</span>
                )}
              </div>

              {/* Author */}
              <div className="form-group">
                <label className="form-label">
                  <FaUser /> Author *
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.author ? 'error' : ''}`}
                  placeholder="Enter author name..."
                  {...register('author', { 
                    required: 'Author is required',
                    minLength: { value: 1, message: 'Author must be at least 1 character' },
                    maxLength: { value: 100, message: 'Author name cannot exceed 100 characters' }
                  })}
                />
                {errors.author && (
                  <span className="error-message">{errors.author.message}</span>
                )}
              </div>

              {/* Price */}
              <div className="form-group">
                <label className="form-label">
                  <FaDollarSign /> Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10000"
                  className={`form-input ${errors.price ? 'error' : ''}`}
                  placeholder="0.00"
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 0, message: 'Price cannot be negative' },
                    max: { value: 10000, message: 'Price cannot exceed $10,000' }
                  })}
                />
                {errors.price && (
                  <span className="error-message">{errors.price.message}</span>
                )}
              </div>

              {/* Published Date */}
              <div className="form-group">
                <label className="form-label">
                  <FaCalendar /> Published Date *
                </label>
                <input
                  type="date"
                  className={`form-input ${errors.publishedDate ? 'error' : ''}`}
                  {...register('publishedDate', { 
                    required: 'Published date is required',
                    validate: value => {
                      if (new Date(value) > new Date()) {
                        return 'Published date cannot be in the future';
                      }
                      return true;
                    }
                  })}
                />
                {errors.publishedDate && (
                  <span className="error-message">{errors.publishedDate.message}</span>
                )}
              </div>

              {/* Genre */}
              <div className="form-group">
                <label className="form-label">
                  <FaTag /> Genre
                </label>
                <select
                  className={`form-input form-select ${errors.genre ? 'error' : ''}`}
                  {...register('genre')}
                >
                  <option value="">Select a genre</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                {errors.genre && (
                  <span className="error-message">{errors.genre.message}</span>
                )}
              </div>

              {/* ISBN */}
              <div className="form-group">
                <label className="form-label">
                  <FaBook /> ISBN
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.isbn ? 'error' : ''}`}
                  placeholder="Enter 10 or 13-digit ISBN"
                  {...register('isbn', {
                    pattern: {
                      value: /^(?:\d{10}|\d{13})$/,
                      message: 'ISBN must be 10 or 13 digits'
                    }
                  })}
                />
                {errors.isbn && (
                  <span className="error-message">{errors.isbn.message}</span>
                )}
              </div>

              {/* Cover Image URL */}
              <div className="form-group">
                <label className="form-label">
                  <FaLink /> Cover Image URL
                </label>
                <input
                  type="url"
                  className={`form-input ${errors.coverImage ? 'error' : ''}`}
                  placeholder="https://example.com/cover.jpg"
                  {...register('coverImage', {
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: 'Please enter a valid URL'
                    }
                  })}
                />
                {errors.coverImage && (
                  <span className="error-message">{errors.coverImage.message}</span>
                )}
              </div>

              {/* Stock */}
              <div className="form-group">
                <label className="form-label">
                  <FaBoxes /> Stock
                </label>
                <input
                  type="number"
                  min="0"
                  className={`form-input ${errors.stock ? 'error' : ''}`}
                  placeholder="Enter stock quantity"
                  {...register('stock', {
                    valueAsNumber: true,
                    min: { value: 0, message: 'Stock cannot be negative' }
                  })}
                />
                {errors.stock && (
                  <span className="error-message">{errors.stock.message}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="form-group full-width">
              <label className="form-label">
                <FaFileAlt /> Description
              </label>
              <textarea
                className={`form-input form-textarea ${errors.description ? 'error' : ''}`}
                rows="4"
                placeholder="Enter book description (optional)"
                {...register('description', {
                  maxLength: { value: 1000, message: 'Description cannot exceed 1000 characters' }
                })}
              />
              {errors.description && (
                <span className="error-message">{errors.description.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner spinner-sm"></div>
                    {isEditing ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <FaSave />
                    {isEditing ? 'Update Book' : 'Add Book'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default BookForm; 