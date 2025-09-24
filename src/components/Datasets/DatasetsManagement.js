import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Info, 
  FilterList, 
  DateRange,
  DataUsage 
} from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';
import './DatasetsManagement.css';

const DatasetsManagement = () => {
  const { isDarkMode } = useTheme();
  const [datasets, setDatasets] = useState([]);
  const [filteredDatasets, setFilteredDatasets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState(null);

  // Mock datasets data - replace with actual ERDDAP API calls
  const mockDatasets = [
    {
      id: 'cmems_mod_glo_phy-cur_anfc_0.083deg_PT6H-i',
      title: 'Global Ocean Currents - Copernicus Marine',
      description: 'High-resolution ocean currents velocity components (uo, vo) from Copernicus Marine. Downloaded using CLI: copernicusmarine subset --dataset-id cmems_mod_glo_phy-cur_anfc_0.083deg_PT6H-i --dataset-version 202406.',
      category: 'Currents',
      dataType: 'NetCDF',
      size: '1.8 GB',
      lastUpdated: '2025-09-24T08:30:00Z',
      temporalCoverage: '2025-09-01 to 2025-09-20',
      spatialCoverage: 'Global Ocean (-148.16E to 149.07E, -63.28N to 80.47N)',
      parameters: ['uo', 'vo', 'velocity', 'direction', 'depth'],
      source: 'Copernicus Marine Service',
      format: ['NetCDF'],
      cliCommand: 'copernicusmarine subset --dataset-id cmems_mod_glo_phy-cur_anfc_0.083deg_PT6H-i --dataset-version 202406 --variable uo --variable vo --start-datetime 2025-09-01T00:00:00 --end-datetime 2025-09-20T00:00:00 --minimum-longitude -148.165518 --maximum-longitude 149.072357 --minimum-latitude -63.279561 --maximum-latitude 80.471717 --minimum-depth 0.49402499198913574 --maximum-depth 0.49402499198913574',
      downloadPath: 'C:/Users/lenovo/Desktop/SIH Project/aquanova/data/ocean_currents/ocean_currents_data.nc',
      downloadUrl: '/api/datasets/cmems_mod_glo_phy-cur_anfc_0.083deg_PT6H-i/download'
    },
    {
      id: 'sst_indian_ocean_2024',
      title: 'Sea Surface Temperature - Indian Ocean 2024',
      description: 'Daily sea surface temperature measurements across Indian Ocean EEZ from satellite observations and in-situ sensors.',
      category: 'Temperature',
      dataType: 'NetCDF',
      size: '2.3 GB',
      lastUpdated: '2024-09-23T12:00:00Z',
      temporalCoverage: '2024-01-01 to 2024-09-23',
      spatialCoverage: 'Indian Ocean EEZ (6°S-37°N, 68°E-97°E)',
      parameters: ['sea_surface_temperature', 'quality_flag', 'uncertainty'],
      source: 'Copernicus Marine Environment Monitoring Service',
      format: ['NetCDF', 'CSV', 'JSON'],
      downloadUrl: '/api/datasets/sst_indian_ocean_2024/download'
    },
    {
      id: 'ocean_currents_bay_bengal',
      title: 'Ocean Currents - Bay of Bengal',
      description: 'High-resolution ocean current velocity measurements from ADCP and satellite altimetry data.',
      category: 'Currents',
      dataType: 'NetCDF',
      size: '1.8 GB',
      lastUpdated: '2024-09-22T18:30:00Z',
      temporalCoverage: '2024-01-01 to 2024-09-22',
      spatialCoverage: 'Bay of Bengal (5°N-25°N, 80°E-100°E)',
      parameters: ['eastward_velocity', 'northward_velocity', 'velocity_magnitude'],
      source: 'INCOIS - Indian National Centre for Ocean Information Services',
      format: ['NetCDF', 'GRIB2'],
      downloadUrl: '/api/datasets/ocean_currents_bay_bengal/download'
    },
    {
      id: 'fish_abundance_survey_2024',
      title: 'Fish Abundance Survey Data 2024',
      description: 'Comprehensive fish species abundance and distribution data from research vessel surveys.',
      category: 'Biodiversity',
      dataType: 'CSV',
      size: '450 MB',
      lastUpdated: '2024-09-20T14:15:00Z',
      temporalCoverage: '2024-03-01 to 2024-09-15',
      spatialCoverage: 'Indian EEZ Continental Shelf',
      parameters: ['species_name', 'abundance', 'biomass_density', 'length_distribution'],
      source: 'CMLRE Survey Vessels',
      format: ['CSV', 'Excel', 'JSON'],
      downloadUrl: '/api/datasets/fish_abundance_survey_2024/download'
    },
    {
      id: 'edna_biodiversity_samples',
      title: 'Environmental DNA Biodiversity Samples',
      description: 'eDNA sequencing results for marine biodiversity assessment following medna-metadata standards.',
      category: 'eDNA',
      dataType: 'FASTQ/CSV',
      size: '3.1 GB',
      lastUpdated: '2024-09-21T09:45:00Z',
      temporalCoverage: '2024-06-01 to 2024-09-15',
      spatialCoverage: 'Coastal waters of India',
      parameters: ['sequence_data', 'taxonomy', 'abundance_estimate', 'quality_scores'],
      source: 'CMLRE Genomics Lab',
      format: ['FASTQ', 'CSV', 'FASTA'],
      downloadUrl: '/api/datasets/edna_biodiversity_samples/download'
    },
    {
      id: 'chlorophyll_concentration',
      title: 'Chlorophyll-a Concentration - Arabian Sea',
      description: 'Satellite-derived chlorophyll-a concentration measurements indicating phytoplankton biomass.',
      category: 'Biogeochemistry',
      dataType: 'NetCDF',
      size: '1.2 GB',
      lastUpdated: '2024-09-23T06:00:00Z',
      temporalCoverage: '2024-01-01 to 2024-09-23',
      spatialCoverage: 'Arabian Sea (8°N-28°N, 65°E-78°E)',
      parameters: ['chlorophyll_concentration', 'quality_flag', 'standard_deviation'],
      source: 'NASA Ocean Color',
      format: ['NetCDF', 'HDF5', 'GeoTIFF'],
      downloadUrl: '/api/datasets/chlorophyll_concentration/download'
    }
  ];

  const categories = ['all', 'Temperature', 'Currents', 'Biodiversity', 'eDNA', 'Biogeochemistry'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDatasets(mockDatasets);
      setFilteredDatasets(mockDatasets);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = datasets;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(dataset =>
        dataset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dataset.parameters.some(param => param.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(dataset => dataset.category === selectedCategory);
    }

    setFilteredDatasets(filtered);
  }, [searchTerm, selectedCategory, datasets]);

  const handleDownload = (dataset) => {
    // In production, this would trigger actual download
    alert(`Downloading ${dataset.title}...\nFormat: ${dataset.format[0]}\nSize: ${dataset.size}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="datasets-loading">
        <div className="loading-spinner"></div>
        <p>Loading datasets...</p>
      </div>
    );
  }

  return (
    <div className={`datasets-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="datasets-header">
        <h1>Marine Datasets Repository</h1>
        <p>Search, explore, and download oceanographic and biodiversity datasets</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="datasets-controls">
        <div className="search-section">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search datasets by title, description, or parameters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <FilterList className="filter-icon" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        <div className="results-count">
          {filteredDatasets.length} datasets found
        </div>
      </div>

      {/* Datasets Grid */}
      <div className="datasets-grid">
        {filteredDatasets.map(dataset => (
          <div key={dataset.id} className="dataset-card">
            <div className="dataset-header">
              <h3 className="dataset-title">{dataset.title}</h3>
              <span className={`category-badge ${dataset.category.toLowerCase()}`}>
                {dataset.category}
              </span>
            </div>

            <p className="dataset-description">{dataset.description}</p>

            <div className="dataset-metadata">
              <div className="metadata-row">
                <DateRange className="metadata-icon" />
                <span>Updated: {formatDate(dataset.lastUpdated)}</span>
              </div>
              <div className="metadata-row">
                <DataUsage className="metadata-icon" />
                <span>Size: {dataset.size}</span>
              </div>
              <div className="metadata-row">
                <span className="metadata-label">Coverage:</span>
                <span>{dataset.temporalCoverage}</span>
              </div>
              <div className="metadata-row">
                <span className="metadata-label">Region:</span>
                <span>{dataset.spatialCoverage}</span>
              </div>
            </div>

            <div className="dataset-parameters">
              <strong>Parameters:</strong>
              <div className="parameters-list">
                {dataset.parameters.slice(0, 3).map(param => (
                  <span key={param} className="parameter-tag">{param}</span>
                ))}
                {dataset.parameters.length > 3 && (
                  <span className="parameter-tag more">+{dataset.parameters.length - 3} more</span>
                )}
              </div>
            </div>

            <div className="dataset-formats">
              <strong>Available formats:</strong>
              {dataset.format.map(format => (
                <span key={format} className="format-tag">{format}</span>
              ))}
            </div>

            <div className="dataset-actions">
              <button
                className="action-btn info-btn"
                onClick={() => setSelectedDataset(dataset)}
              >
                <Info /> Details
              </button>
              <button
                className="action-btn download-btn"
                onClick={() => handleDownload(dataset)}
              >
                <Download /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dataset Detail Modal */}
      {selectedDataset && (
        <div className="modal-overlay" onClick={() => setSelectedDataset(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedDataset.title}</h2>
              <button
                className="close-btn"
                onClick={() => setSelectedDataset(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Description</h4>
                <p>{selectedDataset.description}</p>
              </div>
              <div className="detail-section">
                <h4>Temporal Coverage</h4>
                <p>{selectedDataset.temporalCoverage}</p>
              </div>
              <div className="detail-section">
                <h4>Spatial Coverage</h4>
                <p>{selectedDataset.spatialCoverage}</p>
              </div>
              <div className="detail-section">
                <h4>Parameters</h4>
                <div className="parameters-grid">
                  {selectedDataset.parameters.map(param => (
                    <span key={param} className="parameter-chip">{param}</span>
                  ))}
                </div>
              </div>
              <div className="detail-section">
                <h4>Data Source</h4>
                <p>{selectedDataset.source}</p>
              </div>
              <div className="detail-section">
                <h4>Download Information</h4>
                <p>Size: {selectedDataset.size}</p>
                <p>Last Updated: {formatDate(selectedDataset.lastUpdated)}</p>
                
                {selectedDataset.id === 'cmems_mod_glo_phy-cur_anfc_0.083deg_PT6H-i' && (
                  <div className="copernicus-cli-section">
                    <h4>Copernicus Marine CLI Command</h4>
                    <div className="cli-command-box">
                      <pre>{selectedDataset.cliCommand}</pre>
                    </div>
                    <p className="cli-help">
                      <strong>Download Path:</strong> {selectedDataset.downloadPath}
                    </p>
                    <p className="cli-help">
                      This command downloads ocean current velocity data (uo, vo) for visualization on the Maps page 
                      and for training the AI model. Use the Copernicus Marine Python package to execute this command.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-actions">
              {selectedDataset.id === 'cmems_mod_glo_phy-cur_anfc_0.083deg_PT6H-i' ? (
                <div className="copernicus-actions">
                  <button
                    className="download-btn-large"
                    onClick={() => handleDownload(selectedDataset)}
                  >
                    <Download /> Download Using CLI
                  </button>
                  <p className="cli-note">
                    Note: This requires the Copernicus Marine Python package and valid credentials. 
                    Data will be saved to: {selectedDataset.downloadPath}
                  </p>
                </div>
              ) : (
                <button
                  className="download-btn-large"
                  onClick={() => handleDownload(selectedDataset)}
                >
                  <Download /> Download Dataset
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetsManagement;