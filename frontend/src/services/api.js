import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://bookstore-opal-seven.vercel.app';

// Ensure no trailing slash on the base URL before appending /api
const cleanedBaseUrl = API_BASE_URL.replace(/\/$/, '');

const api = axios.create({
  baseURL: `${cleanedBaseUrl}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add loading state or auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject({ message, status: error.response?.status });
  }
);

// Book API methods
export const bookAPI = {
  // Get all books with optional filters
  getBooks: (params = {}) => api.get('/books', { params }),
  
  // Get a single book by ID
  getBook: (id) => api.get(`/books/${id}`),
  
  // Create a new book
  createBook: (bookData) => api.post('/books', bookData),
  
  // Update a book
  updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),
  
  // Delete a book
  deleteBook: (id) => api.delete(`/books/${id}`),
  
  // Get book statistics
  getStats: () => api.get('/books/stats'),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api; 