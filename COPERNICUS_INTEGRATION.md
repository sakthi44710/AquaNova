# Copernicus Marine CLI Integration

## Implementation Summary

We've successfully integrated the Copernicus Marine CLI for downloading ocean currents data into the AquaNova platform. Here's what we've accomplished:

1. **Data Directory Structure**:
   - Created an organized data storage structure at `c:\Users\lenovo\Desktop\SIH Project\aquanova\data\`
   - Subdirectories for ocean_currents, temperature, biodiversity, and raw_datasets

2. **JavaScript Integration Script**:
   - Created a Node.js script for executing the CLI command: `scripts/fetchOceanCurrentsData.js`
   - The script handles download parameters and error handling

3. **Maps Component Integration**:
   - Updated the OceanMap.js component to use the ocean currents data
   - Added logging and error handling for the data integration

4. **Datasets Management Integration**:
   - Added Copernicus Marine ocean currents dataset to the datasets repository
   - Created special UI elements for displaying CLI commands
   - Added helpful guidance for using the Copernicus Marine CLI

5. **API Service Layer**:
   - Enhanced the CopernicusService class to support ocean currents data
   - Added appropriate logging and error handling

6. **Documentation**:
   - Created comprehensive guide for using Copernicus Marine data
   - Added parameter explanations and troubleshooting instructions

## Using the CLI Command

The Copernicus Marine CLI command for downloading ocean currents data is:

```bash
copernicusmarine subset --dataset-id cmems_mod_glo_phy-cur_anfc_0.083deg_PT6H-i --dataset-version 202406 --variable uo --variable vo --start-datetime 2025-09-01T00:00:00 --end-datetime 2025-09-20T00:00:00 --minimum-longitude -148.165518 --maximum-longitude 149.072357 --minimum-latitude -63.279561 --maximum-latitude 80.471717 --minimum-depth 0.49402499198913574 --maximum-depth 0.49402499198913574 --coordinates-selection-method strict-inside --netcdf-compression-level 1 --disable-progress-bar --log-level ERROR
```

## Recommended Download Path

The recommended path for downloading and storing the ocean currents data is:

```
c:\Users\lenovo\Desktop\SIH Project\aquanova\data\ocean_currents\ocean_currents_data.nc
```

## Next Steps

1. Install the Copernicus Marine Python package:
   ```bash
   pip install copernicusmarine
   ```

2. Set up authentication:
   ```bash
   copernicusmarine login
   ```

3. Execute the download command with the output path:
   ```bash
   copernicusmarine subset --dataset-id cmems_mod_glo_phy-cur_anfc_0.083deg_PT6H-i --dataset-version 202406 --variable uo --variable vo --start-datetime 2025-09-01T00:00:00 --end-datetime 2025-09-20T00:00:00 --minimum-longitude -148.165518 --maximum-longitude 149.072357 --minimum-latitude -63.279561 --maximum-latitude 80.471717 --minimum-depth 0.49402499198913574 --maximum-depth 0.49402499198913574 --coordinates-selection-method strict-inside --netcdf-compression-level 1 --disable-progress-bar --log-level ERROR --output-filename "c:/Users/lenovo/Desktop/SIH Project/aquanova/data/ocean_currents/ocean_currents_data.nc"
   ```

4. Use the NetCDF data for:
   - Map visualizations
   - Dataset downloads
   - AI model training

For more details, see the comprehensive guide in the documentation:
`docs/COPERNICUS_DATA_GUIDE.md`