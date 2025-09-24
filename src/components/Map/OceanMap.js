import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, LayersControl, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockData } from '../../services/api';
import { getTemperatureColor, INDIAN_EEZ_BOUNDS } from '../../utils/dataUtils';
import { useTheme } from '../../contexts/ThemeContext';
import './OceanMap.css';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const OceanMap = () => {
  const { isDarkMode } = useTheme();
  const [temperatureData, setTemperatureData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLayer, setActiveLayer] = useState('temperature');
  const [showCurrentsIframe, setShowCurrentsIframe] = useState(false);
  const [showTemperatureIframe, setShowTemperatureIframe] = useState(true);

  // Indian Ocean center coordinates
  const center = [15.0, 75.0];
  const bounds = [
    [INDIAN_EEZ_BOUNDS.south, INDIAN_EEZ_BOUNDS.west],
    [INDIAN_EEZ_BOUNDS.north, INDIAN_EEZ_BOUNDS.east]
  ];

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      setLoading(true);
      
      // For now, using mock data. In production, replace with actual API calls
      setTemperatureData(mockData.temperature);
      setAlerts(mockData.alerts);
      
      // Ocean currents will be displayed using embedded Copernicus Marine iframe
      console.log('Ocean currents will be displayed using Copernicus Marine embedded visualization');
      
    } catch (error) {
      console.error('Error loading map data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTemperatureLayer = () => {
    return temperatureData.map((point, index) => (
      <CircleMarker
        key={`temp-${index}`}
        center={[point.lat, point.lon]}
        radius={8}
        pathOptions={{
          color: getTemperatureColor(point.temp),
          fillColor: getTemperatureColor(point.temp),
          fillOpacity: 0.7,
          weight: 2
        }}
      >
        <Popup>
          <div className="popup-content">
            <h4>Sea Surface Temperature</h4>
            <p><strong>Temperature:</strong> {point.temp}°C</p>
            <p><strong>Location:</strong> {point.lat.toFixed(2)}°N, {point.lon.toFixed(2)}°E</p>
            <p><strong>Time:</strong> {new Date(point.time).toLocaleString()}</p>
          </div>
        </Popup>
      </CircleMarker>
    ));
  };



  const renderAlertsLayer = () => {
    return alerts.map((alert) => (
      <CircleMarker
        key={`alert-${alert.id}`}
        center={[alert.location.lat, alert.location.lon]}
        radius={12}
        pathOptions={{
          color: alert.severity === 'high' ? '#ff0000' : '#ff9900',
          fillColor: alert.severity === 'high' ? '#ff0000' : '#ff9900',
          fillOpacity: 0.8,
          weight: 3
        }}
      >
        <Popup>
          <div className="popup-content alert-popup">
            <h4>⚠️ {alert.type.toUpperCase()} ALERT</h4>
            <p><strong>Severity:</strong> {alert.severity}</p>
            <p><strong>Message:</strong> {alert.message}</p>
            <p><strong>Time:</strong> {new Date(alert.timestamp).toLocaleString()}</p>
          </div>
        </Popup>
      </CircleMarker>
    ));
  };

  if (loading) {
    return (
      <div className="map-loading">
        <div className="loading-spinner"></div>
        <p>Loading oceanographic data...</p>
      </div>
    );
  }

  return (
    <div className={`ocean-map-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="map-header">
        <h2>Interactive Ocean Map - Indian EEZ</h2>
        <div className="map-controls">
          <button 
            className={`control-btn ${activeLayer === 'temperature' ? 'active' : ''}`}
            onClick={() => {
              setActiveLayer('temperature');
              setShowCurrentsIframe(false);
              setShowTemperatureIframe(true);
            }}
          >
            🌡️ Temperature
          </button>
          <button 
            className={`control-btn ${activeLayer === 'currents' ? 'active' : ''}`}
            onClick={() => {
              setActiveLayer('currents');
              setShowCurrentsIframe(true);
              setShowTemperatureIframe(false);
            }}
          >
            🌊 Currents
          </button>
          <button 
            className={`control-btn ${activeLayer === 'alerts' ? 'active' : ''}`}
            onClick={() => {
              setActiveLayer('alerts');
              setShowCurrentsIframe(false);
              setShowTemperatureIframe(false);
            }}
          >
            ⚠️ Alerts
          </button>
        </div>
      </div>

      <div className="map-content">
        <div className="map-wrapper">
          {showCurrentsIframe ? (
            <div className="currents-iframe-container">
              <iframe 
                src="https://data.marine.copernicus.eu/-/tcy7jrz98k" 
                width="100%" 
                height="100%"
                frameBorder="0"
                title="Ocean Currents Visualization"
                className="ocean-currents-iframe"
              />
            </div>
          ) : showTemperatureIframe ? (
            <div className="temperature-iframe-container">
              <iframe 
                src="https://data.marine.copernicus.eu/-/djiqy05vlo" 
                width="100%" 
                height="100%"
                frameBorder="0"
                title="Sea Water Temperature Visualization"
                className="temperature-iframe"
              />
            </div>
          ) : (
            <MapContainer
              center={center}
              zoom={6}
              bounds={bounds}
              className="leaflet-container"
            >
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="OpenStreetMap">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                </LayersControl.BaseLayer>
                
                <LayersControl.BaseLayer name="Satellite">
                  <TileLayer
                    attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  />
                </LayersControl.BaseLayer>

                <LayersControl.Overlay name="Temperature">
                  <>{activeLayer === 'temperature' && renderTemperatureLayer()}</>
                </LayersControl.Overlay>

                <LayersControl.Overlay name="Alerts">
                  <>{activeLayer === 'alerts' && renderAlertsLayer()}</>
                </LayersControl.Overlay>
              </LayersControl>
              
              {/* Render active layer directly on map */}
              {activeLayer === 'temperature' && renderTemperatureLayer()}
              {activeLayer === 'alerts' && renderAlertsLayer()}
            </MapContainer>
          )}
        </div>

        <div className="map-sidebar">
          {activeLayer === 'temperature' && (
            <div className="legend-section">
              <h4>🌡️ Sea Water Potential Temperature</h4>
              <div className="temperature-info">
                <p><strong>Interactive Temperature Map</strong></p>
                <p>Global temperature distribution at 5m depth</p>
              </div>
              <div className="temperature-scale">
                <h5>Temperature Scale (°C)</h5>
                <div className="temperature-gradient">
                  <div className="temp-scale-item">
                    <span className="temp-color-box" style={{backgroundColor: '#000080'}}></span>
                    <span>0°C</span>
                  </div>
                  <div className="temp-scale-item">
                    <span className="temp-color-box" style={{backgroundColor: '#0040C0'}}></span>
                    <span>2°C</span>
                  </div>
                  <div className="temp-scale-item">
                    <span className="temp-color-box" style={{backgroundColor: '#0080FF'}}></span>
                    <span>4°C</span>
                  </div>
                  <div className="temp-scale-item">
                    <span className="temp-color-box" style={{backgroundColor: '#00C0FF'}}></span>
                    <span>6°C</span>
                  </div>
                  <div className="temp-scale-item">
                    <span className="temp-color-box" style={{backgroundColor: '#40E0E0'}}></span>
                    <span>8°C</span>
                  </div>
                  <div className="temp-scale-item">
                    <span className="temp-color-box" style={{backgroundColor: '#80FF80'}}></span>
                    <span>10°C</span>
                  </div>
                  <div className="temp-scale-item">
                    <span className="temp-color-box" style={{backgroundColor: '#C0FF40'}}></span>
                    <span>12°C</span>
                  </div>
                  <div className="temp-scale-item">
                    <span className="temp-color-box" style={{backgroundColor: '#FFFF00'}}></span>
                    <span>14°C</span>
                  </div>
                  <div className="temp-scale-item">
                    <span className="temp-color-box" style={{backgroundColor: '#FFC000'}}></span>
                    <span>16°C</span>
                  </div>
                  <div className="temp-scale-item">
                    <span className="temp-color-box" style={{backgroundColor: '#FF8000'}}></span>
                    <span>18°C</span>
                  </div>
                  <div className="temp-scale-item">
                    <span className="temp-color-box" style={{backgroundColor: '#FF4000'}}></span>
                    <span>20°C</span>
                  </div>
                </div>
              </div>
              <div className="temperature-source">
                <p><small>🔗 Source: Copernicus Marine Service</small></p>
                <p><small>📊 Data: Sea water potential temperature</small></p>
                <p><small>📅 Date: 24/09/2023 12:00 - 9.5 m depth</small></p>
                <p><small>⏱️ Updated: Global hourly analysis</small></p>
              </div>
            </div>
          )}
          
          {activeLayer === 'currents' && (
            <div className="legend-section">
              <h4>🌊 Ocean Currents Visualization</h4>
              <div className="current-info">
                <p><strong>Interactive Ocean Currents Map</strong></p>
                <p>This visualization shows real-time ocean current patterns and flows.</p>
                <ul>
                  <li>🔄 Real-time current patterns</li>
                  <li>🌊 Flow direction and velocity</li>
                  <li>📊 Interactive controls available</li>
                  <li>🔍 Zoom and pan to explore</li>
                </ul>
              </div>
              <div className="current-source">
                <p><small>🔗 Source: Copernicus Marine Service</small></p>
                <p><small>📊 Data: Ocean current velocity and direction</small></p>
                <p><small>⏱️ Updated: Real-time visualization</small></p>
              </div>
            </div>
          )}

          {activeLayer === 'alerts' && (
            <div className="legend-section">
              <h4>⚠️ Alert Information</h4>
              <div className="alert-info">
                <p><strong>Environmental Alerts</strong></p>
                <p>Monitor critical oceanographic conditions and warnings.</p>
                <div className="alert-types">
                  <div className="alert-type-item">
                    <span className="alert-indicator high"></span>
                    <span>High Severity</span>
                  </div>
                  <div className="alert-type-item">
                    <span className="alert-indicator medium"></span>
                    <span>Medium Severity</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OceanMap;