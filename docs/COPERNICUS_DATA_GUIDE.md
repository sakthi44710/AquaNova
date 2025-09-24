# Copernicus Marine Data Integration Guide

## Overview

This guide explains how to use the Copernicus Marine CLI to download ocean currents data for the AquaNova platform. This data is used for:

1. Visualizing ocean currents on the interactive map
2. Including in the datasets repository for user downloads
3. Training the AI chatbot for marine data insights

## Data Storage Structure

All downloaded datasets are stored in the following directory structure:

```
/data/
├── ocean_currents/   # For current velocity data from Copernicus Marine
├── temperature/      # For temperature datasets
├── biodiversity/     # For species and eDNA data
└── raw_datasets/     # For miscellaneous raw datasets
```

## CLI Command Reference

### Download Ocean Currents Data

The following command downloads ocean currents data (uo, vo components) from the Copernicus Marine Service:

```bash
copernicusmarine subset --dataset-id cmems_mod_glo_phy-cur_anfc_0.083deg_PT6H-i --dataset-version 202406 --variable uo --variable vo --start-datetime 2025-09-01T00:00:00 --end-datetime 2025-09-20T00:00:00 --minimum-longitude -148.165518 --maximum-longitude 149.072357 --minimum-latitude -63.279561 --maximum-latitude 80.471717 --minimum-depth 0.49402499198913574 --maximum-depth 0.49402499198913574 --coordinates-selection-method strict-inside --netcdf-compression-level 1 --disable-progress-bar --log-level ERROR --output-filename "./data/ocean_currents/ocean_currents_data.nc"
```

### Parameters Explained

- **dataset-id**: `cmems_mod_glo_phy-cur_anfc_0.083deg_PT6H-i` - The Copernicus Marine dataset identifier for global ocean currents
- **dataset-version**: `202406` - Version of the dataset
- **variable**: `uo` and `vo` - Eastward and northward velocity components
- **start-datetime** and **end-datetime**: Time range for the data (e.g., `2025-09-01T00:00:00` to `2025-09-20T00:00:00`)
- **minimum-longitude** and **maximum-longitude**: Spatial coverage in east-west direction
- **minimum-latitude** and **maximum-latitude**: Spatial coverage in north-south direction
- **minimum-depth** and **maximum-depth**: Depth range for data extraction
- **coordinates-selection-method**: `strict-inside` ensures all data points are within the specified bounds
- **netcdf-compression-level**: `1` provides a balance between file size and access speed
- **disable-progress-bar** and **log-level**: Reduce output verbosity
- **output-filename**: Path where the dataset will be saved

## Installation Instructions

1. Install the Copernicus Marine Python package:

```bash
pip install copernicusmarine
```

2. Set up authentication:

```bash
copernicusmarine login
```

3. Execute the download command:

```bash
copernicusmarine subset --dataset-id cmems_mod_glo_phy-cur_anfc_0.083deg_PT6H-i --dataset-version 202406 --variable uo --variable vo --start-datetime 2025-09-01T00:00:00 --end-datetime 2025-09-20T00:00:00 --minimum-longitude -148.165518 --maximum-longitude 149.072357 --minimum-latitude -63.279561 --maximum-latitude 80.471717 --minimum-depth 0.49402499198913574 --maximum-depth 0.49402499198913574 --coordinates-selection-method strict-inside --netcdf-compression-level 1 --disable-progress-bar --log-level ERROR --output-filename "./data/ocean_currents/ocean_currents_data.nc"
```

## Using the Data in AquaNova

### Maps Page

The ocean currents data is used in the Maps page to visualize current flows. The data is loaded from the NetCDF file and converted to directional vectors displayed on the interactive map.

### Datasets Page

The ocean currents dataset is listed in the Datasets Management page with full metadata and download instructions. Users can access the Copernicus Marine CLI command directly from the dataset details.

### AI Chatbot Training

The ocean currents data, along with other marine datasets, are used to train the AquaNova AI chatbot, enabling it to answer questions about ocean currents, patterns, and their impact on marine ecosystems.

## Troubleshooting

- **Authentication Issues**: Run `copernicusmarine login` to refresh credentials
- **Download Errors**: Check internet connection and available disk space
- **Data Processing Errors**: Ensure NetCDF libraries are installed (`pip install netCDF4`)
- **File Not Found**: Verify the correct path is specified in `--output-filename`

## Resources

- [Copernicus Marine Documentation](https://help.marine.copernicus.eu/en/collections/4060068-copernicus-marine-toolbox)
- [NetCDF File Format](https://www.unidata.ucar.edu/software/netcdf/)
- [Python NetCDF4 Library](https://unidata.github.io/netcdf4-python/)