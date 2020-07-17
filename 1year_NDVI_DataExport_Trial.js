//import jharkhand = Jharkhand state boundary from Asset 
var dataset = ee.ImageCollection('LANDSAT/LE07/C01/T1_ANNUAL_NDVI')
                  .filterDate('2017-01-01', '2017-12-31')
                  .filterBounds(jharkhand)
                  ;
                  
var colorized = dataset.select('NDVI');
var colorizedVis = {
  min: 0.0,
  max: 1.0,
  palette: [
    'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901',
    '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01',
    '012E01', '011D01', '011301'
  ],
};
// create function to crop with table boundaries
var clipping_func = function(image) {
  // Crop by table extension
  return image.clip(jharkhand);
};

var NDVIClipped = colorized.map(clipping_func);

//Longitude: 85.31087372191023
//Latitude:  23.326981621613303
//Zoom Level: 8
//Scale (approx. m/px): 1222.99245256282

Map.setCenter(85.31087372191023, 23.326981621613303, 10);
Map.addLayer(jharkhand)
Map.addLayer(NDVIClipped, colorizedVis, 'Colorized');

//Export.image.toDrive({ 
//           image: NDVIClipped,
//           scale: 250,
//           maxPixels:1e13 });

var dictionary = ee.Image.pixelLonLat().reduceRegion({
  reducer: ee.Reducer.toCollection(['longitude', 'latitude']), 
  geometry: jharkhand, 
  scale: 1000
});

var points = ee.FeatureCollection(dictionary.get('features'))
    .map(function(feature) {
      var lon = feature.get('longitude');
      var lat = feature.get('latitude');
      return ee.Feature(ee.Geometry.Point([lon, lat]), {
        'featureID': ee.Number(lon).multiply(1000).round().format('%5.0f')
            .cat('_')
            .cat(ee.Number(lat).multiply(1000).round().format('%5.0f'))
      });
    });
//print('points', points)
Map.addLayer(points);

//print('dataset', dataset)

var triplets = dataset.map(function(image) {
  return image.reduceRegions({
    collection: points, 
    reducer: ee.Reducer.first().setOutputs(image.bandNames()), 
    scale: 1000,
  }).map(function(feature) {
    return feature.set({
      'imageID': image.id(),
      'timeMillis': image.get('system:time_start')
    })
  });
}).flatten();
//print(triplets) 

var format = function(table, rowId, colId, rowProperty, colProperty) {
  var rows = table.distinct(rowId); 
  var joined = ee.Join.saveAll('matches').apply({
    primary: rows, 
    secondary: table, 
    condition: ee.Filter.equals({
      leftField: rowId, 
      rightField: rowId
    })
  });
  return joined.map(function(row) {
      var values = ee.List(row.get('matches'))
        .map(function(feature) {
          feature = ee.Feature(feature);
          return [feature.get(colId), feature.get(colProperty)];
        }).flatten();
      return row.select([rowId, rowProperty]).set(ee.Dictionary(values));
    });
};

var results = format(triplets, 'imageID', 'featureID', 'timeMillis', 'NDVI');
//print(results)

Export.table.toDrive({
  collection: results, 
  description: 'foo1', 
  fileNamePrefix: 'foo', 
  fileFormat: 'CSV'
});

