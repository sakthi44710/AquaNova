import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { logout, currentUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/map', label: 'Map', icon: '🗺️' },
    { path: '/datasets', label: 'Datasets', icon: '📁' },
    { path: '/alerts', label: 'Alerts', icon: '🔔' },
    { path: '/temperature', label: 'Temperature', icon: '🌡️' },
    { path: '/biodiversity', label: 'Biodiversity', icon: '🐠' },
    { path: '/chatbot', label: 'AI Assistant', icon: '🤖' }
  ];

  return (
    <>
      <nav className={`navbar ${isDarkMode ? 'dark-mode' : ''} ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Brand */}
          <div className="navbar-brand">
            <Link to="/" onClick={closeMobileMenu} className="brand-link">
              <div className="brand-logo">
                <span className="logo-wave">🌊</span>
              </div>
              <div className="brand-text">
                <h1>AquaNova</h1>
                <span className="brand-tagline">Marine Intelligence</span>
              </div>
            </Link>
          </div>

          {/* Center Navigation */}
          <div className={`navbar-center ${isMobileMenuOpen ? 'active' : ''}`}>
            <ul className="navbar-nav">
              {navItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link 
                    to={item.path} 
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    {location.pathname === item.path && <span className="nav-indicator"></span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Actions */}
          <div className="navbar-actions">
            <button 
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="theme-icon">{isDarkMode ? '☀️' : '🌙'}</span>
            </button>

            <div className="user-menu">
              <div className="user-profile">
                <span className="user-avatar">
                  {currentUser?.name ? currentUser.name[0].toUpperCase() : 'U'}
                </span>
                <div className="user-details">
                  <span className="user-name">{currentUser?.name || 'User'}</span>
                  <span className="user-role">Researcher</span>
                </div>
              </div>
              <button 
                className="logout-btn"
                onClick={handleLogout}
                title="Logout"
              >
                <svg className="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`} 
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && <div className="mobile-overlay" onClick={closeMobileMenu}></div>}
    </>
  );
};

export default Navbar;