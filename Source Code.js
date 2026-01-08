var aoi = ee.FeatureCollection("projects/gee-trial2/assets/IND_Shapefiles/IND")
                                           .filter(ee.Filter.eq('OBJECTID', 5));;
Map.centerObject(aoi, 5);


// Load CHIRPS precipitation dataset
var chirps = ee.ImageCollection("UCSB-CHG/CHIRPS/DAILY")
                  .filterDate('2023-10-01', '2024-01-31') // 3-month period
                  .filterBounds(aoi)
                  .select('precipitation');

// Compute total precipitation over the period
var totalPrecip = chirps.sum();

// Load a Sentinel-2 image for projection reference
var refImage = ee.ImageCollection("COPERNICUS/S2_SR")
                  .filterBounds(aoi)
                  .filterDate('2023-10-01', '2023-10-15')  // Narrow range to ensure single image
                  .first()
                  .select('B4'); // Select a single band for consistent projection

// Get 500-meter projection from reference
var targetProjection = refImage.projection().atScale(100); 

// Resample and reproject CHIRPS to 500 meters
var downscaledPrecip = totalPrecip
                          .resample('bilinear')
                          .reproject({crs: targetProjection});

// // Display
 Map.addLayer(totalPrecip.clip(aoi),{
    min: 0,
    max: 100,
    palette: ['#f7fbff', '#c6dbef', '#6baed6', '#2171b5', '#08306b']  // Light to dark blue 
  }, 
  ' Original CHIRPS'
  
);

Map.addLayer(downscaledPrecip.clip(aoi),{
    min: 0,
    max: 100,
   palette: ['#f7fbff', '#c6dbef', '#6baed6', '#2171b5', '#08306b']  // Light to dark blue
  }, 
  'Downscaled to 100m'
);


// =========================================
// Rainfall Legend (CHIRPS – mm)
// Light Blue → Dark Blue
// =========================================

var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 12px'
  }
});

// Legend Title
legend.add(ui.Label({
  value: 'Rainfall (mm)',
  style: {
    fontWeight: 'bold',
    fontSize: '14px',
    margin: '0 0 6px 0'
  }
}));

// Function to create legend row
var makeRow = function(color, label) {
  return ui.Panel({
    widgets: [
      ui.Label({
        style: {
          backgroundColor: color,
          padding: '8px',
          margin: '0 8px 4px 0'
        }
      }),
      ui.Label({
        value: label,
        style: { margin: '0 0 4px 0' }
      })
    ],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

// Legend classes (matching visualization)
legend.add(makeRow('#f7fbff', 'Very Low (0–20 mm)'));
legend.add(makeRow('#c6dbef', 'Low (20–40 mm)'));
legend.add(makeRow('#6baed6', 'Moderate (40–60 mm)'));
legend.add(makeRow('#2171b5', 'High (60–80 mm)'));
legend.add(makeRow('#08306b', 'Very High (80–100 mm)'));

// Add legend to map
Map.add(legend);
