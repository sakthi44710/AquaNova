import React, { useState, useEffect, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { 
  ThermostatOutlined, 
  Timeline, 
  BarChart, 
  Map as MapIcon,
  Download,
  DateRange
} from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';
import './TemperatureVisualization.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const TemperatureVisualization = () => {
  const { isDarkMode } = useTheme();
  const [temperatureData, setTemperatureData] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('arabian_sea');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [viewMode, setViewMode] = useState('timeseries');
  const [loading, setLoading] = useState(true);

  // Mock temperature data - replace with actual Copernicus Marine API
  const mockTemperatureData = useMemo(() => ({
    arabian_sea: {
      timeseries: [
        { date: '2024-09-17', temperature: 28.5, depth: 0 },
        { date: '2024-09-18', temperature: 29.1, depth: 0 },
        { date: '2024-09-19', temperature: 29.8, depth: 0 },
        { date: '2024-09-20', temperature: 30.2, depth: 0 },
        { date: '2024-09-21', temperature: 31.1, depth: 0 },
        { date: '2024-09-22', temperature: 31.8, depth: 0 },
        { date: '2024-09-23', temperature: 32.3, depth: 0 }
      ],
      depthProfile: [
        { depth: 0, temperature: 32.3 },
        { depth: 10, temperature: 31.8 },
        { depth: 25, temperature: 30.5 },
        { depth: 50, temperature: 28.2 },
        { depth: 100, temperature: 25.8 },
        { depth: 200, temperature: 22.1 },
        { depth: 500, temperature: 18.5 }
      ],
      statistics: {
        current: 32.3,
        average: 30.1,
        min: 28.5,
        max: 32.3,
        trend: '+1.8°C over 7 days'
      }
    },
    bay_of_bengal: {
      timeseries: [
        { date: '2024-09-17', temperature: 27.8, depth: 0 },
        { date: '2024-09-18', temperature: 28.2, depth: 0 },
        { date: '2024-09-19', temperature: 28.9, depth: 0 },
        { date: '2024-09-20', temperature: 29.5, depth: 0 },
        { date: '2024-09-21', temperature: 30.1, depth: 0 },
        { date: '2024-09-22', temperature: 30.8, depth: 0 },
        { date: '2024-09-23', temperature: 31.2, depth: 0 }
      ],
      depthProfile: [
        { depth: 0, temperature: 31.2 },
        { depth: 10, temperature: 30.7 },
        { depth: 25, temperature: 29.8 },
        { depth: 50, temperature: 27.5 },
        { depth: 100, temperature: 24.8 },
        { depth: 200, temperature: 21.2 },
        { depth: 500, temperature: 17.8 }
      ],
      statistics: {
        current: 31.2,
        average: 29.5,
        min: 27.8,
        max: 31.2,
        trend: '+3.4°C over 7 days'
      }
    }
  }), []);

  const regions = [
    { value: 'arabian_sea', label: 'Arabian Sea', coords: [15.0, 65.0] },
    { value: 'bay_of_bengal', label: 'Bay of Bengal', coords: [15.0, 88.0] },
    { value: 'indian_ocean_south', label: 'Southern Indian Ocean', coords: [10.0, 75.0] }
  ];

  useEffect(() => {
    // Simulate API call to fetch temperature data
    setTimeout(() => {
      setTemperatureData(mockTemperatureData);
      setLoading(false);
    }, 1000);
  }, [selectedRegion, selectedTimeRange, mockTemperatureData]);

  const getCurrentRegionData = () => {
    return temperatureData[selectedRegion] || mockTemperatureData.arabian_sea;
  };

  const timeSeriesChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Sea Surface Temperature - ${regions.find(r => r.value === selectedRegion)?.label}`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Temperature: ${context.parsed.y}°C`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MMM dd'
          }
        },
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)'
        },
        min: 15,
        max: 35
      }
    }
  };

  const depthProfileChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Temperature Depth Profile',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Temperature (°C)'
        }
      },
      y: {
        reverse: true,
        title: {
          display: true,
          text: 'Depth (m)'
        }
      }
    }
  };

  const getTimeSeriesChartData = () => {
    const regionData = getCurrentRegionData();
    return {
      labels: regionData.timeseries.map(item => new Date(item.date)),
      datasets: [
        {
          label: 'Sea Surface Temperature',
          data: regionData.timeseries.map(item => item.temperature),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4,
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6
        }
      ]
    };
  };

  const getDepthProfileChartData = () => {
    const regionData = getCurrentRegionData();
    return {
      labels: regionData.depthProfile.map(item => item.depth),
      datasets: [
        {
          label: 'Temperature',
          data: regionData.depthProfile.map(item => item.temperature),
          backgroundColor: regionData.depthProfile.map(item => {
            if (item.temperature > 30) return '#ff6b6b';
            if (item.temperature > 25) return '#ffa726';
            if (item.temperature > 20) return '#42a5f5';
            return '#26c6da';
          }),
          borderColor: '#2c3e50',
          borderWidth: 1
        }
      ]
    };
  };

  const handleExportData = () => {
    const regionData = getCurrentRegionData();
    const csvContent = [
      ['Date', 'Temperature (°C)', 'Depth (m)'],
      ...regionData.timeseries.map(item => [item.date, item.temperature, item.depth])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `temperature_data_${selectedRegion}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="temperature-loading">
        <div className="loading-spinner"></div>
        <p>Loading temperature data...</p>
      </div>
    );
  }

  const regionData = getCurrentRegionData();

  return (
    <div className={`temperature-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="temperature-header">
        <div className="header-content">
          <h1>
            <ThermostatOutlined className="header-icon" />
            Temperature Analysis
          </h1>
          <p>Advanced ocean temperature monitoring and analysis for marine ecosystems</p>
        </div>
        <button className="export-button" onClick={handleExportData}>
          <Download /> Export Data
        </button>
      </div>

      {/* Control Panel */}
      <div className="temperature-controls">
        <div className="controls-row">
          <div className="control-group">
            <label>
              <MapIcon className="control-icon" />
              Region:
            </label>
            <select 
              value={selectedRegion} 
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              {regions.map(region => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>
              <DateRange className="control-icon" />
              Time Range:
            </label>
            <select 
              value={selectedTimeRange} 
              onChange={(e) => setSelectedTimeRange(e.target.value)}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 3 Months</option>
              <option value="365d">Last Year</option>
            </select>
          </div>
        </div>

        <div className="view-mode-selector">
          <button 
            className={`view-mode-btn ${viewMode === 'timeseries' ? 'active' : ''}`}
            onClick={() => setViewMode('timeseries')}
          >
            <Timeline /> Time Series
          </button>
          <button 
            className={`view-mode-btn ${viewMode === 'depth' ? 'active' : ''}`}
            onClick={() => setViewMode('depth')}
          >
            <BarChart /> Depth Profile
          </button>
          <button 
            className={`view-mode-btn ${viewMode === 'heatmap' ? 'active' : ''}`}
            onClick={() => setViewMode('heatmap')}
          >
            <ThermostatOutlined /> Heat Map
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="temperature-stats">
        <div className="stat-card">
          <div className="stat-header">
            <ThermostatOutlined className="stat-icon" />
            <h3 className="stat-title">Current Temperature</h3>
          </div>
          <div className="stat-value">{regionData.statistics.current}°C</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <BarChart className="stat-icon" />
            <h3 className="stat-title">7-Day Average</h3>
          </div>
          <div className="stat-value">{regionData.statistics.average}°C</div>
          <div className="stat-subtitle">Mean Temperature</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <Timeline className="stat-icon" />
            <h3 className="stat-title">Temperature Range</h3>
          </div>
          <div className="stat-value">{regionData.statistics.min}°C - {regionData.statistics.max}°C</div>
          <div className="stat-subtitle">Min - Max</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <ThermostatOutlined className="stat-icon" />
            <h3 className="stat-title">Trend</h3>
          </div>
          <div className="stat-value">{regionData.statistics.trend}</div>
          <div className="stat-subtitle">Weekly Change</div>
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="temperature-content">
        {viewMode === 'timeseries' && (
          <div className="chart-container">
            <div className="chart-header">
              <h2 className="chart-title">
                <Timeline className="chart-icon" />
                Temperature Time Series
              </h2>
            </div>
            <div className="chart-wrapper">
              <Line data={getTimeSeriesChartData()} options={timeSeriesChartOptions} />
            </div>
          </div>
        )}

        {viewMode === 'depth' && (
          <div className="chart-container">
            <div className="chart-header">
              <h2 className="chart-title">
                <BarChart className="chart-icon" />
                Depth Profile
              </h2>
            </div>
            <div className="chart-wrapper">
              <Bar data={getDepthProfileChartData()} options={depthProfileChartOptions} />
            </div>
          </div>
        )}

        {viewMode === 'heatmap' && (
          <div className="chart-container">
            <div className="chart-header">
              <h2 className="chart-title">
                <ThermostatOutlined className="chart-icon" />
                Temperature Heat Map
              </h2>
            </div>
            <div className="chart-wrapper">
              <iframe 
                src="https://data.marine.copernicus.eu/-/20tcpnhuel" 
                width="100%" 
                height="600px"
                frameBorder="0"
                title="Copernicus Marine Temperature Data"
                className="temperature-map-iframe"
              />
            </div>
          </div>
        )}
      </div>

      {/* Data Quality Information */}
      <div className="data-info">
        <h4>
          <ThermostatOutlined />
          Temperature Data Overview
        </h4>
        <div className="data-info-grid">
          <div className="info-item">
            <span className="info-label">Data Source</span>
            <span className="info-value">Copernicus Marine Service</span>
          </div>
          <div className="info-item">
            <span className="info-label">Spatial Resolution</span>
            <span className="info-value">0.083° × 0.083°</span>
          </div>
          <div className="info-item">
            <span className="info-label">Temporal Resolution</span>
            <span className="info-value">Daily averages</span>
          </div>
          <div className="info-item">
            <span className="info-label">Quality Control</span>
            <span className="info-value">Automated QC applied</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemperatureVisualization;