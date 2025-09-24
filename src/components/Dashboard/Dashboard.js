import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className={`dashboard ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="dashboard-header">
        <h1>Marine Data Dashboard</h1>
        <p>Real-time oceanographic and biodiversity insights for the Indian EEZ</p>
      </div>

      <div className="dashboard-grid">
        {/* Key Metrics Cards */}
        <div className="metric-card clickable" onClick={() => handleNavigation('/temperature')}>
          <div className="metric-icon">🌊</div>
          <div className="metric-content">
            <h3>Ocean Temperature</h3>
            <p className="metric-value">28.5°C</p>
            <span className="metric-trend">+0.3°C from last week</span>
          </div>
        </div>

        <div className="metric-card clickable" onClick={() => handleNavigation('/biodiversity')}>
          <div className="metric-icon">🐟</div>
          <div className="metric-content">
            <h3>Species Monitored</h3>
            <p className="metric-value">1,247</p>
            <span className="metric-trend">+23 new this month</span>
          </div>
        </div>

        <div className="metric-card clickable" onClick={() => handleNavigation('/datasets')}>
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <h3>Active Datasets</h3>
            <p className="metric-value">156</p>
            <span className="metric-trend">Updated 2 hours ago</span>
          </div>
        </div>

        <div className="metric-card clickable" onClick={() => handleNavigation('/alerts')}>
          <div className="metric-icon">⚠️</div>
          <div className="metric-content">
            <h3>Active Alerts</h3>
            <p className="metric-value">3</p>
            <span className="metric-trend">2 heatwave, 1 cyclone</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="activity-panel">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item clickable" onClick={() => handleNavigation('/biodiversity')}>
              <span className="activity-time">2 hours ago</span>
              <span className="activity-text">New eDNA sample analyzed - Hilsa species detected</span>
            </div>
            <div className="activity-item clickable" onClick={() => handleNavigation('/temperature')}>
              <span className="activity-time">4 hours ago</span>
              <span className="activity-text">Temperature dataset updated from Copernicus Marine</span>
            </div>
            <div className="activity-item clickable" onClick={() => handleNavigation('/alerts')}>
              <span className="activity-time">6 hours ago</span>
              <span className="activity-text">Cyclone alert issued for Bay of Bengal region</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn large" onClick={() => handleNavigation('/datasets')}>
              <span className="action-icon">📊</span>
              <span className="action-text">View Latest Data</span>
            </button>
            <button className="action-btn large" onClick={() => handleNavigation('/map')}>
              <span className="action-icon">🌡️</span>
              <span className="action-text">Temperature Map</span>
            </button>
            <button className="action-btn large" onClick={() => handleNavigation('/biodiversity')}>
              <span className="action-icon">🐟</span>
              <span className="action-text">Species Search</span>
            </button>
            <button className="action-btn large" onClick={() => handleNavigation('/ai-assistant')}>
              <span className="action-icon">🤖</span>
              <span className="action-text">Ask AI Assistant</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;