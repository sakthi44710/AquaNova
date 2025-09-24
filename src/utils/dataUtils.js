// Utility functions for marine data processing

// Date and time utilities
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getTimeRange = (days = 7) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  
  return {
    start: start.toISOString(),
    end: end.toISOString()
  };
};

// Geographic utilities for Indian EEZ
export const INDIAN_EEZ_BOUNDS = {
  north: 37.0,
  south: 6.0,
  east: 97.0,
  west: 68.0
};

export const isWithinIndianEEZ = (lat, lon) => {
  return lat >= INDIAN_EEZ_BOUNDS.south && 
         lat <= INDIAN_EEZ_BOUNDS.north && 
         lon >= INDIAN_EEZ_BOUNDS.west && 
         lon <= INDIAN_EEZ_BOUNDS.east;
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Data processing utilities
export const processTemperatureData = (rawData) => {
  if (!rawData || !rawData.table || !rawData.table.rows) {
    return [];
  }
  
  return rawData.table.rows.map(row => ({
    lat: parseFloat(row[0]),
    lon: parseFloat(row[1]),
    temperature: parseFloat(row[2]),
    time: row[3],
    depth: row[4] ? parseFloat(row[4]) : 0
  }));
};

export const processSpeciesData = (rawData) => {
  return rawData.map(species => ({
    ...species,
    migrationRoute: species.migration || [],
    eDNAConfidence: species.edna?.confidence || 0,
    lastSighting: species.lastSighting || null
  }));
};

// Temperature analysis utilities
export const classifyTemperature = (temp) => {
  if (temp < 20) return { class: 'cold', color: '#0066cc' };
  if (temp < 25) return { class: 'cool', color: '#00ccff' };
  if (temp < 28) return { class: 'moderate', color: '#00ff99' };
  if (temp < 30) return { class: 'warm', color: '#ffff00' };
  if (temp < 32) return { class: 'hot', color: '#ff9900' };
  return { class: 'extreme', color: '#ff0000' };
};

export const detectHeatwave = (temperatureData, threshold = 30) => {
  return temperatureData.filter(point => point.temperature > threshold);
};

// Alert severity classification
export const classifyAlertSeverity = (alertType, value) => {
  const thresholds = {
    temperature: { moderate: 30, high: 32, extreme: 35 },
    windSpeed: { moderate: 40, high: 60, extreme: 80 },
    waveHeight: { moderate: 3, high: 5, extreme: 8 }
  };
  
  const typeThreshold = thresholds[alertType];
  if (!typeThreshold) return 'low';
  
  if (value >= typeThreshold.extreme) return 'extreme';
  if (value >= typeThreshold.high) return 'high';
  if (value >= typeThreshold.moderate) return 'moderate';
  return 'low';
};

// Data validation utilities
export const validateCoordinates = (lat, lon) => {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};

export const validateTemperature = (temp) => {
  return temp >= -5 && temp <= 50; // Reasonable range for sea surface temperature
};

// Color mapping utilities for visualization
export const getTemperatureColor = (temp) => {
  const { color } = classifyTemperature(temp);
  return color;
};

export const getDepthColor = (depth) => {
  if (depth < 50) return '#87CEEB';   // Sky blue for shallow
  if (depth < 200) return '#4682B4';  // Steel blue
  if (depth < 1000) return '#191970'; // Midnight blue
  return '#000080';                   // Navy for deep
};

// Statistical utilities
export const calculateStats = (data, field) => {
  if (!data || data.length === 0) return null;
  
  const values = data.map(item => item[field]).filter(val => val !== null && !isNaN(val));
  if (values.length === 0) return null;
  
  const sorted = values.sort((a, b) => a - b);
  const sum = values.reduce((acc, val) => acc + val, 0);
  
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean: sum / values.length,
    median: values.length % 2 === 0 
      ? (sorted[values.length / 2 - 1] + sorted[values.length / 2]) / 2
      : sorted[Math.floor(values.length / 2)],
    count: values.length
  };
};

// Export utilities object
const DataUtils = {
  formatDate,
  getTimeRange,
  INDIAN_EEZ_BOUNDS,
  isWithinIndianEEZ,
  calculateDistance,
  processTemperatureData,
  processSpeciesData,
  classifyTemperature,
  detectHeatwave,
  classifyAlertSeverity,
  validateCoordinates,
  validateTemperature,
  getTemperatureColor,
  getDepthColor,
  calculateStats
};

export default DataUtils;