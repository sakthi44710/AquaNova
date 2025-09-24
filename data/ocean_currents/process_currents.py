#!/usr/bin/env python
import xarray as xr
import numpy as np
import json
import os
import math
from datetime import datetime

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
    # Get the directory of the script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Path to your NetCDF file
    netcdf_file = os.path.join(script_dir, "glo12_rg_6h-i_20251002-06h_3D-uovo_fcst_R20250923.nc")
    output_json = os.path.join(script_dir, "ocean_currents_processed.json")
    
    # Process with a sampling factor of 8 (to reduce data volume for web visualization)
    process_ocean_currents(netcdf_file, output_json, sample_factor=8)