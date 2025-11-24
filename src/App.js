import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
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
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
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
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
