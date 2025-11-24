import React, { useState, useEffect } from 'react';
import { 
  Warning, 
  Tsunami, 
  Thermostat,
  Air,
  NotificationsActive,
  LocationOn,
  Schedule,
  Close,
  Settings
} from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AlertSystem.css';

const AlertSystem = () => {
  const [alerts, setAlerts] = useState([]);
  const [alertSettings, setAlertSettings] = useState({
    heatwaveThreshold: 30,
    cycloneRadius: 500,
    enableMobileNotifications: true,
    enableEmailNotifications: false,
    locationTracking: false
  });
  const [userLocation, setUserLocation] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  // Mock real-time alerts data
  const mockAlerts = React.useMemo(() => [
    {
      id: 1,
      type: 'heatwave',
      severity: 'high',
      title: 'Marine Heatwave Alert',
      message: 'Severe marine heatwave detected in Arabian Sea region. Sea surface temperatures exceeding 32°C recorded.',
      location: { lat: 15.5, lon: 72.8, name: 'Arabian Sea - West Coast' },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isActive: true,
      affectedArea: 'Arabian Sea Coastal Waters',
      recommendedActions: [
        'Avoid fishing in affected areas',
        'Monitor vessel cooling systems',
        'Reduce maritime operations during peak hours'
      ]
    },
    {
      id: 2,
      type: 'cyclone',
      severity: 'extreme',
      title: 'Cyclonic Storm Formation',
      message: 'Deep depression in Bay of Bengal intensifying into cyclonic storm. Expected to make landfall in 48-72 hours.',
      location: { lat: 18.0, lon: 85.0, name: 'Bay of Bengal' },
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      isActive: true,
      affectedArea: 'Eastern Coast - Odisha, Andhra Pradesh',
      recommendedActions: [
        'All vessels return to nearest safe harbor',
        'Suspend fishing operations',
        'Secure marine equipment and infrastructure'
      ]
    },
    {
      id: 3,
      type: 'wind',
      severity: 'moderate',
      title: 'High Wind Advisory',
      message: 'Strong winds up to 45 knots expected in coastal areas. Small craft advisory in effect.',
      location: { lat: 11.0, lon: 76.0, name: 'Kerala Coast' },
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      isActive: true,
      affectedArea: 'Southwest Coast - Kerala, Karnataka',
      recommendedActions: [
        'Small vessels avoid open waters',
        'Monitor weather conditions closely',
        'Ensure proper vessel anchoring'
      ]
    },
    {
      id: 4,
      type: 'temperature',
      severity: 'low',
      title: 'Temperature Drop Alert',
      message: 'Unusual temperature drop recorded in northern waters. Monitor marine life impacts.',
      location: { lat: 22.0, lon: 88.0, name: 'Northern Bay of Bengal' },
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      isActive: false,
      affectedArea: 'Northern Bay of Bengal',
      recommendedActions: [
        'Monitor fish behavior patterns',
        'Record temperature anomalies',
        'Report unusual marine life observations'
      ]
    }
  ], []);

  useEffect(() => {
    // Simulate real-time alert updates
    setAlerts(mockAlerts);
    
    // Request location permission
    if (navigator.geolocation && alertSettings.locationTracking) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, [alertSettings.locationTracking, mockAlerts]);

  // Separate effect for notifications to avoid infinite loop
  useEffect(() => {
    if (!alertSettings.enableMobileNotifications) return;
    
    const alertInterval = setInterval(() => {
      const activeAlerts = alerts.filter(alert => alert.isActive);
      if (activeAlerts.length > 0) {
        const randomAlert = activeAlerts[Math.floor(Math.random() * activeAlerts.length)];
        showNotification(randomAlert);
      }
    }, 60000); // Check every 60 seconds (reduced frequency)

    return () => clearInterval(alertInterval);
  }, [alerts, alertSettings.enableMobileNotifications]);

  const showNotification = (alert) => {
    const toastConfig = {
      position: "top-right",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    switch (alert.severity) {
      case 'extreme':
        toast.error(`🚨 ${alert.title}: ${alert.message}`, toastConfig);
        break;
      case 'high':
        toast.warn(`⚠️ ${alert.title}: ${alert.message}`, toastConfig);
        break;
      case 'moderate':
        toast.info(`ℹ️ ${alert.title}: ${alert.message}`, toastConfig);
        break;
      default:
        toast(`📢 ${alert.title}: ${alert.message}`, toastConfig);
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'cyclone': return <Tsunami />;
      case 'heatwave': return <Thermostat />;
      case 'temperature': return <Thermostat />;
      case 'wind': return <Air />;
      default: return <Warning />;
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'extreme': return 'severity-extreme';
      case 'high': return 'severity-high';
      case 'moderate': return 'severity-moderate';
      default: return 'severity-low';
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  };

  const dismissAlert = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, isActive: false } : alert
    ));
  };

  const activeAlerts = alerts.filter(alert => alert.isActive);
  const dismissedAlerts = alerts.filter(alert => !alert.isActive);

  return (
    <div className="alert-system-container">
      <div className="alert-header">
        <div className="header-content">
          <h1>Marine Alert System</h1>
          <p>Real-time environmental hazard monitoring for Indian Ocean waters</p>
        </div>
        <div className="header-actions">
          <div className="alert-stats">
            <span className="stat-item">
              <NotificationsActive className="stat-icon" />
              {activeAlerts.length} Active Alerts
            </span>
          </div>
          <button 
            className="settings-btn"
            onClick={() => setShowSettings(true)}
          >
            <Settings /> Settings
          </button>
        </div>
      </div>

      {/* Active Alerts Section */}
      <div className="alerts-section">
        <h2 className="section-title">🚨 Active Alerts</h2>
        {activeAlerts.length === 0 ? (
          <div className="no-alerts">
            <div className="no-alerts-icon">✅</div>
            <h3>All Clear</h3>
            <p>No active marine hazard alerts at this time</p>
          </div>
        ) : (
          <div className="alerts-grid">
            {activeAlerts.map(alert => (
              <div key={alert.id} className={`alert-card ${getSeverityClass(alert.severity)}`}>
                <div className="alert-card-header">
                  <div className="alert-type">
                    {getAlertIcon(alert.type)}
                    <span className="alert-title">{alert.title}</span>
                  </div>
                  <div className="alert-actions">
                    <span className={`severity-badge ${getSeverityClass(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <button 
                      className="dismiss-btn"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <Close />
                    </button>
                  </div>
                </div>

                <div className="alert-content">
                  <p className="alert-message">{alert.message}</p>
                  
                  <div className="alert-metadata">
                    <div className="metadata-item">
                      <LocationOn className="metadata-icon" />
                      <span>{alert.location.name}</span>
                      {userLocation && (
                        <span className="distance">
                          ({Math.round(calculateDistance(
                            userLocation.lat, userLocation.lon,
                            alert.location.lat, alert.location.lon
                          ))} km away)
                        </span>
                      )}
                    </div>
                    <div className="metadata-item">
                      <Schedule className="metadata-icon" />
                      <span>{formatTimeAgo(alert.timestamp)}</span>
                    </div>
                  </div>

                  <div className="affected-area">
                    <strong>Affected Area:</strong> {alert.affectedArea}
                  </div>

                  <div className="recommended-actions">
                    <strong>Recommended Actions:</strong>
                    <ul>
                      {alert.recommendedActions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Alerts Section */}
      {dismissedAlerts.length > 0 && (
        <div className="alerts-section">
          <h2 className="section-title">📋 Recent Alerts</h2>
          <div className="recent-alerts">
            {dismissedAlerts.slice(0, 5).map(alert => (
              <div key={alert.id} className="recent-alert-item">
                <div className="recent-alert-icon">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="recent-alert-content">
                  <h4>{alert.title}</h4>
                  <p>{alert.message}</p>
                  <span className="recent-alert-time">{formatTimeAgo(alert.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Alert Settings</h3>
              <button className="close-btn" onClick={() => setShowSettings(false)}>
                <Close />
              </button>
            </div>
            <div className="modal-body">
              <div className="setting-group">
                <label>
                  <input
                    type="checkbox"
                    checked={alertSettings.enableMobileNotifications}
                    onChange={(e) => setAlertSettings({
                      ...alertSettings,
                      enableMobileNotifications: e.target.checked
                    })}
                  />
                  Enable Mobile Notifications
                </label>
              </div>
              <div className="setting-group">
                <label>
                  <input
                    type="checkbox"
                    checked={alertSettings.enableEmailNotifications}
                    onChange={(e) => setAlertSettings({
                      ...alertSettings,
                      enableEmailNotifications: e.target.checked
                    })}
                  />
                  Enable Email Notifications
                </label>
              </div>
              <div className="setting-group">
                <label>
                  <input
                    type="checkbox"
                    checked={alertSettings.locationTracking}
                    onChange={(e) => setAlertSettings({
                      ...alertSettings,
                      locationTracking: e.target.checked
                    })}
                  />
                  Enable Location Tracking
                </label>
              </div>
              <div className="setting-group">
                <label>
                  Heatwave Temperature Threshold (°C):
                  <input
                    type="number"
                    value={alertSettings.heatwaveThreshold}
                    onChange={(e) => setAlertSettings({
                      ...alertSettings,
                      heatwaveThreshold: parseInt(e.target.value)
                    })}
                    min="25"
                    max="40"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AlertSystem;