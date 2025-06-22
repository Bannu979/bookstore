# 📚 Book Store REST API

A comprehensive and modern Book Store REST API built with Node.js, Express, and MongoDB, featuring a stunning React frontend with dynamic styling effects.

## ✨ Features

### Backend Features
- **RESTful API** with full CRUD operations
- **MongoDB** database with Mongoose ODM
- **Input Validation** using express-validator
- **Error Handling** with comprehensive error responses
- **Security** with Helmet, CORS, and Rate Limiting
- **Pagination** and advanced filtering
- **Search functionality** with text indexing
- **Statistics** and analytics endpoints
- **Logging** with Morgan
- **Compression** for better performance

### Frontend Features
- **Modern React** with hooks and functional components
- **Stunning UI/UX** with dynamic animations and effects
- **Responsive Design** for all devices
- **Real-time updates** and optimistic UI
- **Advanced filtering** and sorting
- **Interactive charts** and statistics
- **Dark/Light theme** toggle
- **Loading states** and error handling

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd bookstore-api
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment example
   cp backend/env.example backend/.env
   
   # Edit backend/.env with your MongoDB URI
   MONGO_URI=mongodb://localhost:27017/bookstore
   ```

4. **Start the application**
   ```bash
   # Start both backend and frontend
   npm run dev
   
   # Or start them separately:
   # Backend only
   npm run server
   
   # Frontend only
   npm run client
   ```

## 📖 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Get All Books
```http
GET /books
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `sort` (string): Sort field (title, author, price, publishedDate, createdAt, updatedAt)
- `order` (string): Sort order (asc, desc)
- `genre` (string): Filter by genre
- `search` (string): Search in title and author
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalBooks": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### Get Book by ID
```http
GET /books/:id
```

#### Create Book
```http
POST /books
```

**Request Body:**
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "price": 12.99,
  "publishedDate": "1925-04-10",
  "isbn": "9780743273565",
  "genre": "Fiction",
  "description": "A story of the fabulously wealthy Jay Gatsby...",
  "coverImage": "https://example.com/cover.jpg",
  "stock": 25
}
```

#### Update Book
```http
PUT /books/:id
```

#### Delete Book
```http
DELETE /books/:id
```

#### Get Statistics
```http
GET /books/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalBooks": 50,
      "totalValue": 1250.50,
      "averagePrice": 25.01,
      "minPrice": 5.99,
      "maxPrice": 89.99
    },
    "byGenre": [...],
    "byYear": [...]
  }
}
```

## 🎨 Frontend Features

### Components
- **BookList**: Displays books with filtering and pagination
- **BookCard**: Individual book display with hover effects
- **BookForm**: Add/Edit book form with validation
- **Statistics**: Interactive charts and analytics
- **Header**: Navigation with theme toggle
- **Footer**: Project information and links

### Styling
- **CSS Modules** for component-specific styles
- **CSS Variables** for theme management
- **Animations** with CSS transitions and transforms
- **Responsive Grid** layout
- **Modern Design** with gradients and shadows

## 🛠️ Development

### Scripts
```bash
# Root level commands
npm run dev          # Start both backend and frontend
npm run server       # Start backend only
npm run client       # Start frontend only
npm run install-all  # Install all dependencies
npm run build        # Build frontend for production

# Backend commands (from root)
npm run test         # Run backend tests
npm run lint         # Lint backend code
npm run format       # Format backend code

# Frontend commands (from frontend directory)
cd frontend
npm start           # Start development server
npm build           # Build for production
npm test            # Run tests
```

### Project Structure
```
bookstore-api/
├── backend/                 # Backend application
│   ├── config/
│   │   └── db.js           # Database configuration
│   ├── controllers/
│   │   └── bookController.js # Book CRUD operations
│   ├── models/
│   │   └── Book.js         # Book schema and model
│   ├── routes/
│   │   └── bookRoutes.js   # API routes
│   ├── server.js           # Express server
│   ├── package.json        # Backend dependencies
│   └── env.example         # Environment variables example
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   └── styles/         # CSS files
│   └── package.json        # Frontend dependencies
├── package.json            # Root package.json
├── README.md
└── SETUP.md
```

## 🧪 Testing

### Backend Tests
```bash
npm run test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set environment variables in `backend/.env`
2. Build the application
3. Deploy to your preferred platform (Heroku, Vercel, etc.)

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the `frontend/build` folder to your hosting service

## 📊 Performance Features

- **Database Indexing** for faster queries
- **Compression** middleware for smaller responses
- **Rate Limiting** to prevent abuse
- **Caching** strategies for better performance
- **Optimized Images** and assets

## 🔒 Security Features

- **Input Validation** and sanitization
- **CORS** configuration
- **Helmet** for security headers
- **Rate Limiting** to prevent DDoS
- **Error Handling** without exposing sensitive data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name - [GitHub](https://github.com/yourusername)

---

**Note**: This project demonstrates advanced Node.js development practices, modern React patterns, and professional-grade application architecture suitable for production environments.