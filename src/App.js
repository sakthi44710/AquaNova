import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import VantaBackground from './components/Layout/VantaBackground';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './components/Auth/ForgotPassword';
import './App.css';

// Import actual components
import OceanMap from './components/Map/OceanMap';
import DatasetsManagement from './components/Datasets/DatasetsManagement';
import AlertSystem from './components/Alerts/AlertSystem';
import TemperatureVisualization from './components/Temperature/TemperatureVisualization';
import BiodiversityModule from './components/Biodiversity/BiodiversityModule';
import AIChatbot from './components/Chatbot/AIChatbot';

// Main App Content with Vanta Background
const AppContent = () => {
  const { isDarkMode } = useTheme();

  return (
    <Router>
      <Routes>
        {/* Public routes - without Vanta background */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes - with Vanta background */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <VantaBackground darkMode={isDarkMode}>
                <div className="App has-vanta">
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
              </VantaBackground>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
