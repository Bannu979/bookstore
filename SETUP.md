# 🚀 BookStore API - Setup Guide

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

## 🛠️ Installation Steps

### 1. Clone and Setup Project

```bash
# Navigate to the project directory
cd bookstore-api

# Install all dependencies (backend + frontend)
npm run install-all

# Create environment file
cp backend/env.example backend/.env

# Edit backend/.env with your MongoDB URI
# For local MongoDB: MONGO_URI=mongodb://localhost:27017/bookstore
# For MongoDB Atlas: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bookstore
```

### 2. Start the Application

#### Option A: Development Mode (Recommended)

```bash
# Start both backend and frontend simultaneously
npm run dev

# Or start them separately:
# Terminal 1: Backend only
npm run server

# Terminal 2: Frontend only
npm run client
```

#### Option B: Production Mode

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health
- **API Documentation**: http://localhost:5000/api

## 📊 Database Setup

### Local MongoDB
```bash
# Install MongoDB (if not already installed)
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb
# Windows: Download from mongodb.com

# Start MongoDB service
# macOS: brew services start mongodb-community
# Ubuntu: sudo systemctl start mongodb
# Windows: Start MongoDB service from Services
```

### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Update `backend/.env` file with the connection string

## 🧪 Testing the API

### Using Postman
1. Import the `BookStore_API.postman_collection.json` file
2. Set the `baseUrl` variable to `http://localhost:5000/api`
3. Test the endpoints

### Using curl
```bash
# Health check
curl http://localhost:5000/health

# Get all books
curl http://localhost:5000/api/books

# Create a book
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Book",
    "author": "Test Author",
    "price": 19.99,
    "publishedDate": "2023-01-01"
  }'
```

## 🔧 Environment Variables

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/bookstore

# Server Configuration
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your_jwt_secret_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📁 Project Structure

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

## 🎯 Features Demonstrated

### Backend Features
- ✅ **RESTful API** with full CRUD operations
- ✅ **MongoDB** with Mongoose ODM
- ✅ **Input Validation** using express-validator
- ✅ **Error Handling** with comprehensive responses
- ✅ **Security** with Helmet, CORS, and Rate Limiting
- ✅ **Pagination** and advanced filtering
- ✅ **Search functionality** with text indexing
- ✅ **Statistics** and analytics endpoints
- ✅ **Logging** with Morgan
- ✅ **Compression** for better performance

### Frontend Features
- ✅ **Modern React** with hooks and functional components
- ✅ **Stunning UI/UX** with dynamic animations and effects
- ✅ **Responsive Design** for all devices
- ✅ **Real-time updates** and optimistic UI
- ✅ **Advanced filtering** and sorting
- ✅ **Interactive charts** and statistics
- ✅ **Dark/Light theme** toggle
- ✅ **Loading states** and error handling

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-bookstore-api

# Set environment variables
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `backend/.env`
   - Ensure network access for Atlas

2. **Port Already in Use**
   - Change PORT in `backend/.env` file
   - Kill process using the port: `lsof -ti:5000 | xargs kill -9`

3. **Frontend Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

4. **CORS Errors**
   - Verify CORS configuration in `backend/server.js`
   - Check frontend proxy settings

5. **Dependencies Issues**
   - Run `npm run install-all` to install all dependencies
   - Check if all package.json files are present

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the README.md for detailed documentation
3. Check the console logs for error messages
4. Verify all environment variables are set correctly in `backend/.env`

## 🎉 Success!

Once everything is running:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- You should see the beautiful BookStore interface with full functionality!

---

**Note**: This project demonstrates professional-grade development practices suitable for production environments and technical interviews. 