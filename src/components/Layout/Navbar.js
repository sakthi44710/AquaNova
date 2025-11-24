import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { logout, currentUser } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/map', label: 'Map', icon: '🌊' },
    { path: '/datasets', label: 'Datasets', icon: '📊' },
    { path: '/alerts', label: 'Alerts', icon: '⚠️' },
    { path: '/temperature', label: 'Temperature', icon: '🌡️' },
    { path: '/biodiversity', label: 'Biodiversity', icon: '🐟' },
    { path: '/chatbot', label: 'AI Assistant', icon: '🤖' }
  ];

  return (
    <nav className={`navbar ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="navbar-brand">
        <h2>🌊 AquaNova - Marine Data Platform</h2>
        <p>CMLRE - Ministry of Earth Sciences</p>
      </div>
      <ul className="navbar-nav">
        {navItems.map((item) => (
          <li key={item.path} className="nav-item">
            <Link 
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
        <li className="nav-item">
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="theme-icon">{isDarkMode ? '☀️' : '🌙'}</span>
          </button>
        </li>
        <li className="nav-item user-menu">
          <div className="user-info">
            <span className="user-icon">👤</span>
            <span className="user-name">{currentUser?.name || 'User'}</span>
          </div>
          <button 
            className="logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <span className="logout-icon">🚪</span>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;