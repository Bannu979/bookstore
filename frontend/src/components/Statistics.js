import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  FaChartBar, 
  FaBook, 
  FaDollarSign, 
  FaTag
} from 'react-icons/fa';
import { bookAPI } from '../services/api';
import toast from 'react-hot-toast';
import './Statistics.css';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await bookAPI.getStats();
      setStats(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading statistics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="error-container">
        <h3>Failed to load statistics</h3>
        <button className="btn btn-primary" onClick={fetchStats}>
          Try Again
        </button>
      </div>
    );
  }

  const { overview, byGenre, byYear } = stats;

  return (
    <div className="statistics-container">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="stats-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="page-title">📊 Book Statistics</h1>
          <p className="page-subtitle">
            Comprehensive analytics and insights about your book collection
          </p>
        </motion.div>

        {/* Overview Cards */}
        <motion.div 
          className="overview-cards"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FaBook />
              </div>
              <div className="stat-content">
                <h3>{overview.totalBooks || 0}</h3>
                <p>Total Books</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FaDollarSign />
              </div>
              <div className="stat-content">
                <h3>${(overview.totalValue || 0).toFixed(2)}</h3>
                <p>Total Value</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FaChartBar />
              </div>
              <div className="stat-content">
                <h3>${(overview.averagePrice || 0).toFixed(2)}</h3>
                <p>Average Price</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FaTag />
              </div>
              <div className="stat-content">
                <h3>{byGenre.length}</h3>
                <p>Genres</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="charts-section">
          {/* Genre Distribution */}
          <motion.div 
            className="chart-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="chart-header">
              <h3>📚 Genre Distribution</h3>
              <p>Books by genre category</p>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={byGenre}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {byGenre.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Books by Year */}
          <motion.div 
            className="chart-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="chart-header">
              <h3>📅 Books by Publication Year</h3>
              <p>Distribution of books by publication date</p>
            </div>
            <div className="chart-content">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={byYear}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Detailed Stats */}
        <motion.div 
          className="detailed-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="stats-details">
            <div className="detail-section">
              <h3>📈 Price Range</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Lowest Price:</span>
                  <span className="detail-value">${(overview.minPrice || 0).toFixed(2)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Highest Price:</span>
                  <span className="detail-value">${(overview.maxPrice || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>🏷️ Top Genres</h3>
              <div className="genre-list">
                {byGenre.slice(0, 5).map((genre, index) => (
                  <div key={genre._id} className="genre-item">
                    <span className="genre-name">{genre._id}</span>
                    <span className="genre-count">{genre.count} books</span>
                    <span className="genre-avg">${genre.averagePrice?.toFixed(2) || '0.00'} avg</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Statistics; 