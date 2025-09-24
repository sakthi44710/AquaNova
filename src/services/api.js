import axios from 'axios';

// Base API configuration
const API_CONFIG = {
  ERDDAP_BASE: 'https://erddap.marine.ie/erddap',
  COPERNICUS_BASE: 'https://data.marine.copernicus.eu/service-portfolio',
  QARTOD_BASE: 'https://qartod.ioos.us/api',
  // Add other API endpoints as needed
};

// ERDDAP Service for oceanographic data
export class ERDDAPService {
  static async getDatasets() {
    try {
      const response = await axios.get(`${API_CONFIG.ERDDAP_BASE}/info/index.json`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ERDDAP datasets:', error);
      throw error;
    }
  }

  static async getDatasetInfo(datasetId) {
    try {
      const response = await axios.get(`${API_CONFIG.ERDDAP_BASE}/info/${datasetId}/index.json`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dataset info:', error);
      throw error;
    }
  }

  static async getTemperatureData(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        dataset: params.dataset || 'temperature_dataset',
        format: 'json',
        time: params.timeRange || 'latest',
        latitude: params.lat || '8.0:25.0',
        longitude: params.lon || '68.0:98.0',
        ...params
      });
      
      const response = await axios.get(`${API_CONFIG.ERDDAP_BASE}/tabledap/temperature.json?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching temperature data:', error);
      throw error;
    }
  }

  static async getOceanCurrents(params = {}) {
    try {
      const queryParams = new URLSearchParams({
        dataset: params.dataset || 'currents_dataset',
        format: 'json',
        ...params
      });
      
      const response = await axios.get(`${API_CONFIG.ERDDAP_BASE}/tabledap/currents.json?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ocean currents:', error);
      throw error;
    }
  }
}

// Copernicus Marine Service for satellite and model data
export class CopernicusService {
  static async getTemperatureNC(params = {}) {
    try {
      // This would typically require authentication and specific dataset IDs
      const response = await axios.get(`${API_CONFIG.COPERNICUS_BASE}/temperature`, {
        params: {
          format: 'netcdf',
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Copernicus temperature data:', error);
      throw error;
    }
  }

  static async getChlorophyllData(params = {}) {
    try {
      const response = await axios.get(`${API_CONFIG.COPERNICUS_BASE}/chlorophyll`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chlorophyll data:', error);
      throw error;
    }
  }
  
  static async getOceanCurrentsData(params = {}) {
    try {
      // In a production environment, this would call the CLI through a backend service
      // For the demo, we return the mock data
      console.log('Fetching ocean currents with params:', params);
      console.log('In production, this would execute:');
      console.log(`copernicusmarine subset --dataset-id cmems_mod_glo_phy-cur_anfc_0.083deg_PT6H-i --dataset-version 202406 --variable uo --variable vo --start-datetime ${params.startDate || '2025-09-01T00:00:00'} --end-datetime ${params.endDate || '2025-09-20T00:00:00'} --minimum-longitude ${params.minLong || -148.165518} --maximum-longitude ${params.maxLong || 149.072357} --minimum-latitude ${params.minLat || -63.279561} --maximum-latitude ${params.maxLat || 80.471717} --minimum-depth ${params.minDepth || 0.49402499198913574} --maximum-depth ${params.maxDepth || 0.49402499198913574} --coordinates-selection-method strict-inside --netcdf-compression-level 1 --disable-progress-bar --log-level ERROR --output-filename "./data/ocean_currents/ocean_currents_data.nc"`);
      
      // Return the path where data would be stored
      return {
        dataPath: './data/ocean_currents/ocean_currents_data.nc',
        metadata: {
          datasetId: 'cmems_mod_glo_phy-cur_anfc_0.083deg_PT6H-i',
          version: '202406',
          variables: ['uo', 'vo'],
          startDate: params.startDate || '2025-09-01T00:00:00',
          endDate: params.endDate || '2025-09-20T00:00:00',
          bounds: {
            longitude: [params.minLong || -148.165518, params.maxLong || 149.072357],
            latitude: [params.minLat || -63.279561, params.maxLat || 80.471717],
            depth: [params.minDepth || 0.49402499198913574, params.maxDepth || 0.49402499198913574],
          }
        }
      };
    } catch (error) {
      console.error('Error with ocean currents data:', error);
      throw error;
    }
  }
}

// QARTOD Service for quality assurance
export class QARTODService {
  static async validateData(data, parameters) {
    try {
      const response = await axios.post(`${API_CONFIG.QARTOD_BASE}/validate`, {
        data,
        parameters
      });
      return response.data;
    } catch (error) {
      console.error('Error validating data with QARTOD:', error);
      throw error;
    }
  }
}

// Biodiversity and eDNA Service
export class BiodiversityService {
  static async getSpeciesData(speciesName) {
    try {
      // This would integrate with medna-metadata standards
      const response = await axios.get(`/api/species/${encodeURIComponent(speciesName)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching species data:', error);
      throw error;
    }
  }

  static async getEDNAData(params = {}) {
    try {
      const response = await axios.get('/api/edna', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching eDNA data:', error);
      throw error;
    }
  }

  static async getFishMigrationData(species) {
    try {
      const response = await axios.get(`/api/migration/${encodeURIComponent(species)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching migration data:', error);
      throw error;
    }
  }
}

// Alert Service for environmental warnings
export class AlertService {
  static async getActiveAlerts(location = null) {
    try {
      const params = location ? { lat: location.lat, lon: location.lon } : {};
      const response = await axios.get('/api/alerts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  }

  static async subscribeToAlerts(userData) {
    try {
      const response = await axios.post('/api/alerts/subscribe', userData);
      return response.data;
    } catch (error) {
      console.error('Error subscribing to alerts:', error);
      throw error;
    }
  }
}

// Mock data for development
export const mockData = {
  temperature: [
    { lat: 10.0, lon: 75.0, temp: 28.5, time: '2024-09-23T12:00:00Z' },
    { lat: 12.0, lon: 77.0, temp: 27.8, time: '2024-09-23T12:00:00Z' },
    { lat: 15.0, lon: 80.0, temp: 29.2, time: '2024-09-23T12:00:00Z' },
  ],
  species: [
    {
      name: 'Hilsa ilisha',
      commonName: 'Hilsa',
      habitat: 'Coastal and estuarine waters',
      migration: [
        { lat: 21.5, lon: 88.0, season: 'monsoon' },
        { lat: 22.0, lon: 89.0, season: 'post-monsoon' },
      ],
      edna: {
        sequence: 'ATCGATCGATCG...',
        confidence: 0.95,
        lastDetected: '2024-09-20T08:30:00Z'
      }
    }
  ],
  alerts: [
    {
      id: 1,
      type: 'heatwave',
      severity: 'moderate',
      location: { lat: 15.0, lon: 75.0 },
      message: 'Marine heatwave detected in Arabian Sea',
      timestamp: '2024-09-23T10:00:00Z'
    },
    {
      id: 2,
      type: 'cyclone',
      severity: 'high',
      location: { lat: 18.0, lon: 85.0 },
      message: 'Cyclone formation likely in Bay of Bengal',
      timestamp: '2024-09-23T11:30:00Z'
    }
  ]
};

const APIServices = {
  ERDDAPService,
  CopernicusService,
  QARTODService,
  BiodiversityService,
  AlertService,
  mockData
};

export default APIServices;