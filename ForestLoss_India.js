// Load country features from Large Scale International Boundary (LSIB) dataset.
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');

// Subset the Indian feature from countries.
var india = countries.filter(ee.Filter.eq('country_na', 'India'));

// Get the forest loss image.
var gfc2014 = ee.Image('UMD/hansen/global_forest_change_2015');
var lossImage = gfc2014.select(['loss']);
var areaImage = lossImage.multiply(ee.Image.pixelArea());

// Sum the values of forest loss pixels in India.
var stats = areaImage.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: india,
  scale: 30,
  maxPixels: 10000000,
  bestEffort: true
});
print('pixels representing loss: ', stats.get('loss'), 'square meters');
print(stats);


//pixels representing loss: 12143593015.101345  square meter 