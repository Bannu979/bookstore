import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>📚 BookStore</h3>
            <p>A modern book management system built with React and Node.js</p>
          </div>
          
          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li>Book Management</li>
              <li>Advanced Filtering</li>
              <li>Statistics Dashboard</li>
              <li>Responsive Design</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Tech Stack</h4>
            <ul>
              <li>React 18</li>
              <li>Node.js & Express</li>
              <li>MongoDB</li>
              <li>Framer Motion</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>
            © {currentYear} BookStore. Made with <FaHeart className="heart" /> Badugu Prabhas
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer; 