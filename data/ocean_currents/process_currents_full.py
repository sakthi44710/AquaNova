#!/usr/bin/env python
import xarray as xr
import numpy as np
import json
import os
import sys
import math
from datetime import datetime

# Add pandas import missing from the original script
import pandas as pd

def run_script():
    """
    Main function to run both the analysis and processing of the NetCDF file
    """
    # Get the directory of the script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Path to your NetCDF file
    netcdf_file = os.path.join(script_dir, "glo12_rg_6h-i_20251002-06h_3D-uovo_fcst_R20250923.nc")
    
    if not os.path.exists(netcdf_file):
        print(f"ERROR: NetCDF file not found: {netcdf_file}")
        print("Please ensure the file exists in the correct location.")
        sys.exit(1)
    
    # First analyze the file structure
    print("Step 1: Analyzing NetCDF file structure...")
    try:
        analyze_netcdf(netcdf_file)
    except Exception as e:
        print(f"Error during analysis: {str(e)}")
    
    # Then process the data
    print("\nStep 2: Processing ocean currents data...")
    output_json = os.path.join(script_dir, "..", "..", "public", "data", "ocean_currents", "ocean_currents_processed.json")
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(output_json), exist_ok=True)
    
    try:
        process_ocean_currents(netcdf_file, output_json, sample_factor=8)
    except Exception as e:
        print(f"Error during processing: {str(e)}")
        import traceback
        traceback.print_exc()
    
    print("\nDone!")

def analyze_netcdf(file_path):
    """
    Analyze a NetCDF file and print its structure, variables, dimensions,
    and some basic statistics about the data.
    
    Args:
        file_path (str): Path to the NetCDF file
    """
    if not os.path.exists(file_path):
        print(f"Error: File not found: {file_path}")
        return
    
    try:
        # Open the NetCDF file
        ds = xr.open_dataset(file_path)
        
        # Print general information
        print("=" * 80)
        print(f"NetCDF File: {file_path}")
        print("=" * 80)
        
        # Print dimensions
        print("\nDimensions:")
        print("-" * 40)
        for dim_name, dim_size in ds.dims.items():
            print(f"{dim_name}: {dim_size}")
        
        # Print variables
        print("\nVariables:")
        print("-" * 40)
        for var_name, var in ds.variables.items():
            dims = ", ".join([str(d) for d in var.dims])
            print(f"{var_name}: {var.dtype}, Dimensions: ({dims})")
            
            # Print variable attributes if they exist
            if var.attrs:
                print("  Attributes:")
                for attr_name, attr_value in var.attrs.items():
                    print(f"    {attr_name}: {attr_value}")
        
        # Print global attributes
        print("\nGlobal Attributes:")
        print("-" * 40)
        for attr_name, attr_value in ds.attrs.items():
            print(f"{attr_name}: {attr_value}")
        
        # For ocean current data, check for common variable names
        current_vars = ['uo', 'vo', 'u', 'v', 'water_u', 'water_v']
        found_current_vars = []
        
        for var in current_vars:
            if var in ds.variables:
                found_current_vars.append(var)
                print(f"\nFound current variable: {var}")
                print(f"  Shape: {ds[var].shape}")
                
                # Get some statistics if it's a numeric variable
                if ds[var].dtype.kind in 'iufc':  # integer, unsigned int, float, complex
                    try:
                        print(f"  Min: {ds[var].min().values}")
                        print(f"  Max: {ds[var].max().values}")
                        print(f"  Mean: {ds[var].mean().values}")
                    except Exception as e:
                        print(f"  Error computing statistics: {str(e)}")
        
        if not found_current_vars:
            print("\nNo standard ocean current variables found in this dataset.")
            print("Looking for variables with 'current' or 'velocity' in their name or attributes...")
            
            for var_name, var in ds.variables.items():
                if 'current' in var_name.lower() or 'velocity' in var_name.lower():
                    print(f"\nPotential current variable: {var_name}")
                    print(f"  Shape: {var.shape}")
                    print(f"  Dimensions: {var.dims}")
                    
                    # Get some attributes if they exist
                    if var.attrs:
                        print("  Attributes:")
                        for attr_name, attr_value in var.attrs.items():
                            print(f"    {attr_name}: {attr_value}")
        
        print("\nAnalysis complete.")
    
    except Exception as e:
        print(f"Error analyzing NetCDF file: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        try:
            ds.close()
        except:
            pass

def process_ocean_currents(netcdf_file, output_json=None, sample_factor=5, depth_layer=0):
    """
    Process ocean current data from a NetCDF file and convert to JSON format
    suitable for visualization in the AquaNova web application.
    
    Args:
        netcdf_file (str): Path to the NetCDF file
        output_json (str): Path for output JSON file. If None, uses the same name as input with .json extension
        sample_factor (int): Factor by which to sample data (to reduce data size)
        depth_layer (int): Index of depth layer to extract (0 is typically surface)
    
    Returns:
        list: List of dictionaries containing processed current data
    """
    if not os.path.exists(netcdf_file):
        print(f"Error: NetCDF file not found: {netcdf_file}")
        return []
    
    if output_json is None:
        base_name = os.path.splitext(netcdf_file)[0]
        output_json = f"{base_name}_processed.json"
    
    try:
        # Open the NetCDF file
        ds = xr.open_dataset(netcdf_file)
        print(f"Successfully opened NetCDF file: {netcdf_file}")
        
        # Try to find the ocean current variables (typically 'uo' for eastward and 'vo' for northward currents)
        u_var = None
        v_var = None
        
        # Common variable names for ocean currents
        u_names = ['uo', 'u', 'water_u', 'eastward_sea_water_velocity']
        v_names = ['vo', 'v', 'water_v', 'northward_sea_water_velocity']
        
        # Find u and v variables
        for name in u_names:
            if name in ds.variables:
                u_var = name
                break
        
        for name in v_names:
            if name in ds.variables:
                v_var = name
                break
        
        if u_var is None or v_var is None:
            print("Error: Could not find ocean current velocity variables in the dataset.")
            print(f"Available variables: {list(ds.variables.keys())}")
            return []
        
        # Get the coordinate variables
        print(f"Found current variables: {u_var} and {v_var}")
        
        # Identify coordinate dimensions
        dims = ds[u_var].dims
        coord_dims = {}
        
        # Look for latitude and longitude dimensions
        for dim in dims:
            if dim in ds.coords:
                if any(lat_name in dim.lower() for lat_name in ['lat', 'latitude']):
                    coord_dims['lat'] = dim
                elif any(lon_name in dim.lower() for lon_name in ['lon', 'longitude']):
                    coord_dims['lon'] = dim
                elif any(dep_name in dim.lower() for dep_name in ['depth', 'deptht', 'z']):
                    coord_dims['depth'] = dim
                elif any(time_name in dim.lower() for time_name in ['time', 't']):
                    coord_dims['time'] = dim
        
        print(f"Identified coordinates: {coord_dims}")
        
        # Get the first time step if time dimension exists
        time_index = 0
        if 'time' in coord_dims:
            times = ds[coord_dims['time']].values
            time_str = pd.to_datetime(str(times[time_index])).strftime('%Y-%m-%d %H:%M:%S')
            print(f"Processing data for time: {time_str}")
        
        # Choose depth layer
        depth_index = depth_layer
        if 'depth' in coord_dims:
            depths = ds[coord_dims['depth']].values
            if depth_index < len(depths):
                print(f"Processing depth layer: {depths[depth_index]} meters (index: {depth_index})")
            else:
                depth_index = 0
                print(f"Requested depth layer index {depth_layer} is out of range. Using index 0 instead.")
        
        # Extract the data for the selected time and depth
        data_slice = {}
        if 'time' in coord_dims and 'depth' in coord_dims:
            u_data = ds[u_var].isel({coord_dims['time']: time_index, coord_dims['depth']: depth_index})
            v_data = ds[v_var].isel({coord_dims['time']: time_index, coord_dims['depth']: depth_index})
        elif 'time' in coord_dims:
            u_data = ds[u_var].isel({coord_dims['time']: time_index})
            v_data = ds[v_var].isel({coord_dims['time']: time_index})
        elif 'depth' in coord_dims:
            u_data = ds[u_var].isel({coord_dims['depth']: depth_index})
            v_data = ds[v_var].isel({coord_dims['depth']: depth_index})
        else:
            u_data = ds[u_var]
            v_data = ds[v_var]
        
        # Get lat and lon values
        lats = ds[coord_dims['lat']].values
        lons = ds[coord_dims['lon']].values
        
        # Create processed data list
        processed_data = []
        
        # Determine indices to sample (to reduce data volume)
        lat_indices = range(0, len(lats), sample_factor)
        lon_indices = range(0, len(lons), sample_factor)
        
        print(f"Processing {len(lat_indices)}x{len(lon_indices)} points from original {len(lats)}x{len(lons)} grid")
        
        # Process the data
        for i in lat_indices:
            for j in lon_indices:
                try:
                    # Get values
                    u = float(u_data[i, j].values)
                    v = float(v_data[i, j].values)
                    
                    # Check for NaN or masked values
                    if math.isnan(u) or math.isnan(v):
                        continue
                    
                    # Calculate speed and direction
                    speed = math.sqrt(u**2 + v**2)
                    direction = math.degrees(math.atan2(v, u))
                    if direction < 0:
                        direction += 360
                    
                    # Create data point
                    lat = float(lats[i])
                    lon = float(lons[j])
                    
                    # Skip points outside standard lat/lon range
                    if lat < -90 or lat > 90 or lon < -180 or lon > 180:
                        continue
                    
                    data_point = {
                        "lat": lat,
                        "lon": lon,
                        "u": u,
                        "v": v,
                        "speed": speed,
                        "direction": direction,
                        "type": "current"
                    }
                    processed_data.append(data_point)
                except Exception as e:
                    print(f"Error processing point ({i},{j}): {e}")
        
        print(f"Processed {len(processed_data)} data points")
        
        # Save to JSON file
        with open(output_json, 'w') as f:
            json.dump(processed_data, f)
        
        print(f"Data saved to {output_json}")
        return processed_data
    
    except Exception as e:
        print(f"Error processing NetCDF file: {str(e)}")
        import traceback
        traceback.print_exc()
        return []
    finally:
        try:
            ds.close()
        except:
            pass

if __name__ == "__main__":
    run_script()