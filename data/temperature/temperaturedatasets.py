import copernicusmarine

copernicusmarine.subset(
  dataset_id="cmems_mod_glo_phy-thetao_anfc_0.083deg_PT6H-i",
  dataset_version="202406",
  variables=["thetao"],
  minimum_longitude=-148.165518,
  maximum_longitude=149.072357,
  minimum_latitude=-63.279561,
  maximum_latitude=80.471717,
  start_datetime="2025-09-01T00:00:00",
  end_datetime="2025-09-20T00:00:00",
  minimum_depth=0.49402499198913574,
  maximum_depth=0.49402499198913574,
  coordinates_selection_method="strict-inside",
  netcdf_compression_level=1,
  disable_progress_bar=True,
)