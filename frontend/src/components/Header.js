import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaBook, 
  FaPlus, 
  FaChartBar, 
  FaSun, 
  FaMoon,
  FaHome
} from 'react-icons/fa';
import { useTheme } from '../hooks/useTheme';
import './Header.css';

const Header = () => {
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Books', icon: FaHome },
    { path: '/add', label: 'Add Book', icon: FaPlus },
    { path: '/stats', label: 'Statistics', icon: FaChartBar },
  ];

  return (
    <motion.header 
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container">
        <motion.div 
          className="header-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Logo */}
          <Link to="/" className="logo">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="logo-icon"
            >
              <FaBook />
            </motion.div>
            <span className="logo-text">BookStore</span>
          </Link>

          {/* Navigation */}
          <nav className="nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="nav-item"
                  >
                    <Icon className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="nav-indicator"
                        layoutId="nav-indicator"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Theme Toggle */}
          <motion.button
            className="theme-toggle"
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? <FaSun /> : <FaMoon />}
          </motion.button>
        </motion.div>
      </div>

      {/* Animated background */}
      <div className="header-bg">
        <div className="header-bg-circle header-bg-circle-1"></div>
        <div className="header-bg-circle header-bg-circle-2"></div>
        <div className="header-bg-circle header-bg-circle-3"></div>
      </div>
    </motion.header>
  );
};

export default Header; 