import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Layout/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

// Import actual components
import OceanMap from './components/Map/OceanMap';
import DatasetsManagement from './components/Datasets/DatasetsManagement';
import AlertSystem from './components/Alerts/AlertSystem';
import TemperatureVisualization from './components/Temperature/TemperatureVisualization';
import BiodiversityModule from './components/Biodiversity/BiodiversityModule';
import AIChatbot from './components/Chatbot/AIChatbot';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/map" element={<OceanMap />} />
              <Route path="/datasets" element={<DatasetsManagement />} />
              <Route path="/alerts" element={<AlertSystem />} />
              <Route path="/temperature" element={<TemperatureVisualization />} />
              <Route path="/biodiversity" element={<BiodiversityModule />} />
              <Route path="/chatbot" element={<AIChatbot />} />
              <Route path="/ai-assistant" element={<AIChatbot />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
