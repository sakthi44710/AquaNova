/**
 * Ocean Currents Data Fetcher Script
 * 
 * This script downloads ocean currents data from Copernicus Marine Service
 * and stores it in the appropriate data directory for use in the Maps page,
 * Datasets page, and for AI model training.
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const DATA_DIR = path.join(__dirname, '..', 'data', 'ocean_currents');
const FILENAME = 'ocean_currents_data.nc';
const OUTPUT_PATH = path.join(DATA_DIR, FILENAME);

// Create directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log(`Created directory: ${DATA_DIR}`);
}

// Build the Copernicus Marine CLI command
const buildCommand = (params) => {
  const {
    datasetId = 'cmems_mod_glo_phy-cur_anfc_0.083deg_PT6H-i',
    version = '202406',
    variables = ['uo', 'vo'],
    startDate = '2025-09-01T00:00:00',
    endDate = '2025-09-20T00:00:00',
    minLong = -148.165518,
    maxLong = 149.072357,
    minLat = -63.279561,
    maxLat = 80.471717,
    minDepth = 0.49402499198913574,
    maxDepth = 0.49402499198913574,
  } = params;

  let command = `copernicusmarine subset --dataset-id ${datasetId} --dataset-version ${version}`;
  
  // Add variables
  variables.forEach(variable => {
    command += ` --variable ${variable}`;
  });
  
  // Add date range
  command += ` --start-datetime ${startDate} --end-datetime ${endDate}`;
  
  // Add geographic bounds
  command += ` --minimum-longitude ${minLong} --maximum-longitude ${maxLong}`;
  command += ` --minimum-latitude ${minLat} --maximum-latitude ${maxLat}`;
  
  // Add depth range
  command += ` --minimum-depth ${minDepth} --maximum-depth ${maxDepth}`;
  
  // Add output options
  command += ` --coordinates-selection-method strict-inside --netcdf-compression-level 1`;
  command += ` --disable-progress-bar --log-level ERROR`;
  
  // Add output file
  command += ` --output-filename "${OUTPUT_PATH}"`;
  
  return command;
};

// Function to download the data
const downloadOceanCurrentsData = (params = {}) => {
  console.log('Starting download of ocean currents data...');
  
  const command = buildCommand(params);
  console.log(`Executing command: ${command}`);
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error downloading data: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.error(`Command stderr: ${stderr}`);
    }
    
    console.log(`Data successfully downloaded to: ${OUTPUT_PATH}`);
    console.log(`stdout: ${stdout}`);
    
    // Log file information
    try {
      const stats = fs.statSync(OUTPUT_PATH);
      console.log(`File size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
    } catch (err) {
      console.error(`Error accessing file: ${err.message}`);
    }
  });
};

// Execute the download if run directly
if (require.main === module) {
  downloadOceanCurrentsData();
} else {
  // Export for use in other modules
  module.exports = { downloadOceanCurrentsData };
}