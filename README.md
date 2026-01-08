# 🌧️☀️ Rainfall (CHIRPS) Downscaling & Visualization — Google Earth Engine

This repository shows a simple Google Earth Engine (GEE) workflow to compute total rainfall from CHIRPS over a user-defined AOI, reproject/resample the summed rainfall to a finer grid (using a Sentinel-2 image as the projection reference), visualize both the original CHIRPS product and the resampled result, and add an on-map legend.

Important note: CHIRPS is a coarse-scale precipitation product (native resolution ≈ 0.05° / ~5 km). Reprojecting / resampling to 100 m using bilinear interpolation does not generate new observational detail at 100 m — it only interpolates values. Use such downscaling for visualization or to align rasters, not to claim true 100 m precipitation information.

---

## 🔧 What this script does

- Selects an AOI from a FeatureCollection (filter by OBJECTID).
- Loads daily CHIRPS images for the specified date range and area.
- Computes the total precipitation over the period.
- Loads a Sentinel-2 image to obtain a target projection/scale (used here as 100 m).
- Resamples and reprojects the summed CHIRPS image to that projection.
- Displays the original summed CHIRPS and the resampled image, clipped to AOI.
- Adds a legend describing the rainfall color scale.

---

## 🧾 Usage

1. Open the GEE Code Editor: https://code.earthengine.google.com/
2. Create (or open) a script and paste the code from the "Code" section below.
3. Modify the AOI selection filter (OBJECTID) or the path to the AOI FeatureCollection to match your asset.
4. Edit the date range or visualization parameters as required.
5. Run the script.

---

## 📁 Requirements

- Google Earth Engine account
- AOI shapefile uploaded as an Earth Engine asset or accessible FeatureCollection
- Access to CHIRPS and Sentinel-2 datasets (publicly available in GEE)


---

## ⚠️ Important implementation notes & caveats

- The script uses `.reproject()` with bilinear resampling to align CHIRPS to a Sentinel‑2 projection/scale (here set to 100 m). This is a spatial interpolation — CHIRPS observations do not actually become higher resolution by resampling. Use downscaling methods (statistical, machine learning, or physically based downscaling) if you need more realistic fine-scale rainfall estimates.
- Ensure the `refImage` variable is not null: if no Sentinel-2 image exists for the bounding box & date window, `refImage` will be null and the script will fail. Increase the date range or change the AOI if necessary.
- CHIRPS units are in millimeters (mm). The sum of daily precipitation across the period yields total rainfall (mm).

---

## 📚 References

- CHIRPS daily dataset — UCSB/CHG: https://developers.google.com/earth-engine/datasets/catalog/UCSB-CHG_CHIRPS_DAILY
- Sentinel-2 (Level-2A) in GEE: COPERNICUS/S2_SR
- Google Earth Engine: https://developers.google.com/earth-engine

---

## 🏷 Author / Contact

Tejas Chavan  
GIS Expert — Government of Maharashtra (Revenue & Forest Department)  
Email: tejaskchavan22@gmail.com  
Phone: +91 7028338510

