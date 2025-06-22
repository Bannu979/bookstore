import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import BookView from './components/BookView';
import Statistics from './components/Statistics';
import AnimatedBackground from './components/AnimatedBackground';
import { useTheme } from './hooks/useTheme';
import './styles/App.css';

const App = () => {
  const { theme } = useTheme();

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <AnimatedBackground theme={theme} />
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <BookList />
                </motion.div>
              } 
            />
            <Route 
              path="/add" 
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <BookForm />
                </motion.div>
              } 
            />
            <Route 
              path="/edit/:id" 
              element={
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <BookForm />
                </motion.div>
              } 
            />
            <Route 
              path="/view/:id" 
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <BookView />
                </motion.div>
              } 
            />
            <Route 
              path="/stats" 
              element={
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Statistics />
                </motion.div>
              } 
            />
          </Routes>
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
};

export default App; 