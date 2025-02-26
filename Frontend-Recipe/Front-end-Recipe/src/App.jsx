import './App.css';
import Navbar from './component/Navbar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/login';
import Register from './component/register';
import Mainpage from './component/Mainpage';
import { useState, useEffect } from 'react';
import Favourite from './component/Favourite';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState({
    isLoggedIn: false,
    user: null
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userDataString = localStorage.getItem('userData');
        
        if (token && userDataString) {
          const userData = JSON.parse(userDataString);
          setIsAuthenticated({
            isLoggedIn: true,
            user: userData
          });
        } else {
          setIsAuthenticated({
            isLoggedIn: false,
            user: null
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated({
          isLoggedIn: false,
          user: null
        });
      }
    };

    checkAuth();

    if (typeof window !== 'undefined') {
      window.addEventListener('auth-change', checkAuth);
      return () => window.removeEventListener('auth-change', checkAuth);
    }
  }, []);

  useEffect(() => {
    console.log('Authentication state:', isAuthenticated);
  }, [isAuthenticated]);

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated.isLoggedIn ? 
            <Navigate to="/" replace /> : 
            <Login setIsAuthenticated={setIsAuthenticated} />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated.isLoggedIn ? 
            <Navigate to="/" replace /> : 
            <Register setIsAuthenticated={setIsAuthenticated} />
          } 
        />
         <Route path="/recipes" element={<Favourite />} />
        <Route 
          path="/" 
          element={
            isAuthenticated.isLoggedIn ? 
            <Mainpage /> : 
            <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
);
}
export default App;