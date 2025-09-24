import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Popup, Polyline, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Search, 
  FilterList, 
  Map as MapIcon,
  ViewList,
  Science as DNA,
  Timeline,
  Info,
  LocationOn,
  Warning,
  TrendingUp,
  WaterDrop
} from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';
import './BiodiversityModule.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const BiodiversityModule = () => {
  const { isDarkMode } = useTheme();
  const [viewMode, setViewMode] = useState('map');
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [speciesData, setSpeciesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['all', 'Fish', 'Reptile', 'Mammal', 'Crustacean', 'Mollusk'];

  // Comprehensive mock data with complete structure
  const mockBiodiversityData = useMemo(() => [
    {
      id: 'hilsa_ilisha',
      scientificName: 'Tenualosa ilisha',
      commonName: 'Hilsa Shad',
      localName: 'Ilish',
      category: 'Fish',
      conservationStatus: 'Near Threatened',
      habitat: 'Anadromous - Rivers and coastal waters',
      distribution: 'Bay of Bengal, Arabian Sea',
      description: 'Economically important fish species, highly prized for its taste. The Hilsa is the national fish of Bangladesh and highly valued in Bengali cuisine.',
      physicalCharacteristics: {
        length: '30-60 cm',
        weight: '0.5-3.0 kg',
        color: 'Silver with dark stripes'
      },
      location: { lat: 21.7679, lon: 88.2426 },
      eDNA: {
        detected: true,
        confidence: 95.8,
        lastDetected: '2024-09-15',
        locations: [
          { lat: 21.7679, lon: 88.2426, concentration: 85.2, date: '2024-09-15' },
          { lat: 22.3384, lon: 87.8758, concentration: 92.1, date: '2024-09-14' },
          { lat: 21.2514, lon: 89.5467, concentration: 78.9, date: '2024-09-13' }
        ]
      },
      migration: {
        pattern: 'Anadromous',
        season: 'Monsoon (June-September)',
        route: [
          { lat: 21.7679, lon: 88.2426, location: 'Sundarbans', season: 'Monsoon', depth: 5 },
          { lat: 22.3384, lon: 87.8758, location: 'Howrah', season: 'Pre-monsoon', depth: 8 },
          { lat: 23.8103, lon: 90.4125, location: 'Dhaka', season: 'Monsoon', depth: 12 }
        ]
      },
      threats: ['Overfishing', 'Dam construction', 'Water pollution'],
      images: ['/api/images/hilsa_shad.jpg']
    },
    {
      id: 'olive_ridley',
      scientificName: 'Lepidochelys olivacea',
      commonName: 'Olive Ridley Sea Turtle',
      localName: 'Olive Ridley',
      category: 'Reptile',
      conservationStatus: 'Vulnerable',
      habitat: 'Marine waters and nesting beaches',
      distribution: 'Indian Ocean coastlines',
      description: 'Small marine turtle known for synchronized mass nesting behavior called arribada.',
      physicalCharacteristics: {
        length: '60-70 cm',
        weight: '35-45 kg',
        color: 'Olive green carapace'
      },
      location: { lat: 19.2973, lon: 84.8597 },
      eDNA: {
        detected: true,
        confidence: 88.5,
        lastDetected: '2024-09-12',
        locations: [
          { lat: 19.2973, lon: 84.8597, concentration: 76.3, date: '2024-09-12' },
          { lat: 20.2961, lon: 85.8245, concentration: 82.1, date: '2024-09-11' }
        ]
      },
      migration: {
        pattern: 'Seasonal nesting migration',
        season: 'November-March',
        route: [
          { lat: 19.2973, lon: 84.8597, location: 'Rushikulya Beach', season: 'Nesting', depth: 2 },
          { lat: 20.2961, lon: 85.8245, location: 'Gahirmatha Beach', season: 'Nesting', depth: 3 }
        ]
      },
      threats: ['Plastic pollution', 'Coastal development', 'Fishing nets'],
      images: ['/api/images/olive_ridley.jpg']
    },
    {
      id: 'dugong_dugon',
      scientificName: 'Dugong dugon',
      commonName: 'Dugong',
      localName: 'Sea Cow',
      category: 'Mammal',
      conservationStatus: 'Vulnerable',
      habitat: 'Shallow coastal waters with seagrass beds',
      distribution: 'Gulf of Mannar, Palk Bay',
      description: 'Large marine mammal that feeds on seagrass. Related to manatees and elephants.',
      physicalCharacteristics: {
        length: '2.4-4.0 m',
        weight: '230-420 kg',
        color: 'Grey to brown'
      },
      location: { lat: 9.2647, lon: 79.1355 },
      eDNA: {
        detected: false,
        confidence: 45.2,
        lastDetected: '2024-08-28',
        locations: [
          { lat: 9.2647, lon: 79.1355, concentration: 23.1, date: '2024-08-28' }
        ]
      },
      migration: {
        pattern: 'Seasonal movement following seagrass',
        season: 'Year-round',
        route: [
          { lat: 9.2647, lon: 79.1355, location: 'Gulf of Mannar', season: 'Year-round', depth: 8 }
        ]
      },
      threats: ['Seagrass degradation', 'Boat strikes', 'Fishing nets'],
      images: ['/api/images/dugong.jpg']
    },
    {
      id: 'horseshoe_crab',
      scientificName: 'Tachypleus gigas',
      commonName: 'Asian Horseshoe Crab',
      localName: 'King Crab',
      category: 'Crustacean',
      conservationStatus: 'Endangered',
      habitat: 'Muddy coastal areas and mangroves',
      distribution: 'West Bengal, Odisha coastlines',
      description: 'Ancient arthropod with blue blood valuable for medical research.',
      physicalCharacteristics: {
        length: '30-50 cm',
        weight: '1.5-4.5 kg',
        color: 'Brown carapace'
      },
      location: { lat: 21.6445, lon: 87.7362 },
      eDNA: {
        detected: true,
        confidence: 91.3,
        lastDetected: '2024-09-16',
        locations: [
          { lat: 21.6445, lon: 87.7362, concentration: 89.4, date: '2024-09-16' },
          { lat: 21.8269, lon: 87.4204, concentration: 76.2, date: '2024-09-15' }
        ]
      },
      migration: {
        pattern: 'Spawning migration to beaches',
        season: 'Full moon nights',
        route: [
          { lat: 21.6445, lon: 87.7362, location: 'Balasore Beach', season: 'Spawning', depth: 1 },
          { lat: 21.8269, lon: 87.4204, location: 'Chandipur', season: 'Feeding', depth: 15 }
        ]
      },
      threats: ['Habitat destruction', 'Over-harvesting for biomedical use', 'Coastal development'],
      images: ['/api/images/horseshoe_crab.jpg']
    },
    {
      id: 'green_mussel',
      scientificName: 'Perna viridis',
      commonName: 'Asian Green Mussel',
      localName: 'Green Mussel',
      category: 'Mollusk',
      conservationStatus: 'Least Concern',
      habitat: 'Intertidal rocky shores and artificial structures',
      distribution: 'All Indian coastlines',
      description: 'Fast-growing bivalve mollusk, important for aquaculture and ecosystem services.',
      physicalCharacteristics: {
        length: '8-16 cm',
        weight: '15-45 g',
        color: 'Green shell with brown markings'
      },
      location: { lat: 15.2993, lon: 74.1240 },
      eDNA: {
        detected: true,
        confidence: 98.7,
        lastDetected: '2024-09-17',
        locations: [
          { lat: 15.2993, lon: 74.1240, concentration: 95.3, date: '2024-09-17' },
          { lat: 15.4909, lon: 73.8278, concentration: 87.6, date: '2024-09-16' },
          { lat: 14.8546, lon: 74.3250, concentration: 92.1, date: '2024-09-15' }
        ]
      },
      migration: {
        pattern: 'Larval dispersal by currents',
        season: 'Monsoon season',
        route: [
          { lat: 15.2993, lon: 74.1240, location: 'Goa Coast', season: 'Spawning', depth: 5 },
          { lat: 15.4909, lon: 73.8278, location: 'Panaji', season: 'Settlement', depth: 3 }
        ]
      },
      threats: ['Water pollution', 'Ocean acidification', 'Overharvesting'],
      images: ['/api/images/green_mussel.jpg']
    }
  ], []);

  useEffect(() => {
    // Simulate loading biodiversity data with error handling
    const loadData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSpeciesData(mockBiodiversityData);
      } catch (error) {
        console.error('Error loading biodiversity data:', error);
        setSpeciesData([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [mockBiodiversityData]);

  // Memoized filtered species for performance
  const filteredSpecies = useMemo(() => {
    if (!Array.isArray(speciesData)) return [];
    
    return speciesData.filter(species => {
      if (!species) return false;
      
      const matchesSearch = (
        species.commonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        species.scientificName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        species.localName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const matchesCategory = filterCategory === 'all' || species.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [speciesData, searchTerm, filterCategory]);

  // Optimized status color function
  const getStatusColor = useCallback((status) => {
    const colorMap = {
      'Critically Endangered': '#d32f2f',
      'Endangered': '#f57c00',
      'Vulnerable': '#fbc02d',
      'Near Threatened': '#689f38',
      'Least Concern': '#388e3c'
    };
    return colorMap[status] || '#757575';
  }, []);

  // Optimized migration route renderer with error handling
  const renderMigrationRoute = useCallback((species) => {
    if (!species?.migration?.route || !Array.isArray(species.migration.route)) return null;
    
    const route = species.migration.route;
    const positions = route.map(point => [point.lat, point.lon]).filter(pos => pos[0] && pos[1]);
    
    if (positions.length < 2) return null;
    
    return (
      <React.Fragment key={`migration-${species.id}`}>
        <Polyline
          positions={positions}
          pathOptions={{
            color: isDarkMode ? '#A78BFA' : '#8B5CF6',
            weight: 3,
            opacity: 0.8,
            dashArray: '10, 10'
          }}
        />
        {route.map((point, index) => (
          point.lat && point.lon && (
            <CircleMarker
              key={`${species.id}-route-${index}`}
              center={[point.lat, point.lon]}
              radius={6}
              pathOptions={{
                color: isDarkMode ? '#E879F9' : '#EC4899',
                fillColor: isDarkMode ? '#A78BFA' : '#8B5CF6',
                fillOpacity: 0.8,
                weight: 2
              }}
            >
              <Popup>
                <div className="migration-popup">
                  <strong>{species.commonName}</strong><br/>
                  Location: {point.location || 'Unknown'}<br/>
                  Season: {point.season || 'Unknown'}<br/>
                  Depth: {point.depth || 0}m
                </div>
              </Popup>
            </CircleMarker>
          )
        ))}
      </React.Fragment>
    );
  }, [isDarkMode]);

  // Optimized eDNA locations renderer with error handling
  const renderEDNALocations = useCallback((species) => {
    if (!species?.eDNA?.locations || !Array.isArray(species.eDNA.locations)) return null;
    
    return species.eDNA.locations.map((location, index) => (
      location.lat && location.lon && (
        <CircleMarker
          key={`${species.id}-edna-${index}`}
          center={[location.lat, location.lon]}
          radius={8}
          pathOptions={{
            color: species.eDNA.detected ? '#4CAF50' : '#F44336',
            fillColor: species.eDNA.detected ? '#4CAF50' : '#F44336',
            fillOpacity: 0.6,
            weight: 2
          }}
        >
          <Popup>
            <div className="edna-popup">
              <strong>eDNA Detection</strong><br/>
              Species: {species.commonName}<br/>
              Confidence: {species.eDNA.confidence}%<br/>
              Concentration: {location.concentration || 0}ng/L<br/>
              Date: {location.date || 'Unknown'}
            </div>
          </Popup>
        </CircleMarker>
      )
    ));
  }, []);

  // Handle species selection
  const handleSpeciesSelect = useCallback((species) => {
    setSelectedSpecies(species);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className={`biodiversity-loading ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="loading-spinner"></div>
        <p>Loading marine biodiversity data...</p>
        <div className="loading-stats">
          <span>Analyzing eDNA samples...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`biodiversity-module ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="biodiversity-header">
        <div className="header-content">
          <h1>
            <DNA className="header-icon" />
            Marine Biodiversity Analysis
          </h1>
          <p>Explore species distribution, eDNA detection, and migration patterns</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-card">
            <TrendingUp className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">{filteredSpecies.length}</span>
              <span className="stat-label">Species Tracked</span>
            </div>
          </div>
          <div className="stat-card">
            <WaterDrop className="stat-icon" />
            <div className="stat-info">
              <span className="stat-value">
                {filteredSpecies.filter(s => s.eDNA?.detected).length}
              </span>
              <span className="stat-label">eDNA Detected</span>
            </div>
          </div>
        </div>
      </div>

      <div className="biodiversity-controls">
        <div className="search-filter-section">
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search species by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-section">
            <FilterList className="filter-icon" />
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="view-controls">
          <button
            onClick={() => setViewMode('map')}
            className={`view-btn ${viewMode === 'map' ? 'active' : ''}`}
          >
            <MapIcon />
            Map View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
          >
            <ViewList />
            Species List
          </button>
        </div>

        <div className="results-count">
          <Info className="info-icon" />
          {filteredSpecies.length} species found
        </div>
      </div>

      {viewMode === 'map' && (
        <div className="biodiversity-map">
          <MapContainer 
            center={[15.0, 75.0]} 
            zoom={6} 
            style={{ height: '600px', width: '100%' }}
            className="leaflet-container"
          >
            <TileLayer
              url={isDarkMode 
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              }
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Migration Routes */}
            {filteredSpecies.map(species => renderMigrationRoute(species))}
            
            {/* eDNA sampling locations */}
            {filteredSpecies.map(species => renderEDNALocations(species))}
          </MapContainer>
        </div>
      )}

      {viewMode === 'list' && (
        <div className="species-list">
          {filteredSpecies.map(species => (
            <div 
              key={species.id} 
              className={`species-card ${selectedSpecies?.id === species.id ? 'selected' : ''}`}
              onClick={() => handleSpeciesSelect(species)}
            >
              <div className="species-header">
                <div className="species-names">
                  <h3 className="common-name">{species.commonName}</h3>
                  <p className="scientific-name">{species.scientificName}</p>
                  <span className="local-name">Local: {species.localName}</span>
                </div>
                <div className="species-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(species.conservationStatus) }}
                  >
                    {species.conservationStatus}
                  </span>
                  <span className="category-badge">{species.category}</span>
                </div>
              </div>

              <div className="species-info">
                <div className="info-section">
                  <h4><LocationOn /> Habitat & Distribution</h4>
                  <p><strong>Habitat:</strong> {species.habitat}</p>
                  <p><strong>Distribution:</strong> {species.distribution}</p>
                </div>

                <div className="info-section">
                  <h4><DNA /> eDNA Analysis</h4>
                  <div className={`edna-status ${species.eDNA?.detected ? 'detected' : 'not-detected'}`}>
                    <span className="edna-indicator"></span>
                    {species.eDNA?.detected ? 'Detected' : 'Not Detected'}
                  </div>
                  <p><strong>Confidence:</strong> {species.eDNA?.confidence}%</p>
                  <p><strong>Last Detection:</strong> {species.eDNA?.lastDetected}</p>
                  <p><strong>Sample Locations:</strong> {species.eDNA?.locations?.length || 0}</p>
                </div>

                <div className="info-section">
                  <h4><Timeline /> Migration Pattern</h4>
                  <p><strong>Pattern:</strong> {species.migration?.pattern}</p>
                  <p><strong>Season:</strong> {species.migration?.season}</p>
                  <p><strong>Route Points:</strong> {species.migration?.route?.length || 0}</p>
                </div>

                <div className="info-section">
                  <h4><Warning /> Threats</h4>
                  <div className="threats-list">
                    {species.threats?.map((threat, index) => (
                      <span key={index} className="threat-tag">{threat}</span>
                    )) || <span>No threats listed</span>}
                  </div>
                </div>
              </div>

              <div className="species-description">
                <p>{species.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedSpecies && (
        <div className="species-detail-modal">
          <div className="modal-content">
            <button 
              className="close-modal" 
              onClick={() => setSelectedSpecies(null)}
            >
              ×
            </button>
            
            <div className="species-detail">
              <div className="detail-header">
                <h2>{selectedSpecies.commonName}</h2>
                <p className="scientific-name">{selectedSpecies.scientificName}</p>
                <span 
                  className="status-badge large"
                  style={{ backgroundColor: getStatusColor(selectedSpecies.conservationStatus) }}
                >
                  {selectedSpecies.conservationStatus}
                </span>
              </div>

              <div className="detail-content">
                <div className="detail-section">
                  <h3>Physical Characteristics</h3>
                  <div className="characteristics">
                    <p><strong>Length:</strong> {selectedSpecies.physicalCharacteristics?.length}</p>
                    <p><strong>Weight:</strong> {selectedSpecies.physicalCharacteristics?.weight}</p>
                    <p><strong>Color:</strong> {selectedSpecies.physicalCharacteristics?.color}</p>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Migration Route</h3>
                  <div className="migration-details">
                    {selectedSpecies.migration?.route?.map((point, index) => (
                      <div key={index} className="route-point">
                        <strong>{point.location}</strong>
                        <span>Season: {point.season}</span>
                        <span>Depth: {point.depth}m</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Conservation Information</h3>
                  <p><strong>Status:</strong> {selectedSpecies.conservationStatus}</p>
                  <p><strong>Primary Threats:</strong></p>
                  <ul>
                    {selectedSpecies.threats?.map((threat, index) => (
                      <li key={index}>{threat}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredSpecies.length === 0 && !loading && (
        <div className="no-results">
          <Info className="no-results-icon" />
          <h3>No species found</h3>
          <p>Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};

export default BiodiversityModule;