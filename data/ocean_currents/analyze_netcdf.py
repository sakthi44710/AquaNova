#!/usr/bin/env python
import xarray as xr
import os

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
    
    analyze_netcdf(netcdf_file)