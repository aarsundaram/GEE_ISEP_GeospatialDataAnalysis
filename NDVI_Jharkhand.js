//import jharkhand state boundary shapefile from Assets 
//obtained Jharkhand state boundary using QGIS. 

var dataset = ee.ImageCollection('LANDSAT/LC08/C01/T1_ANNUAL_NDVI')
                  .filterDate('2012-01-01', '2017-12-31')
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

//Longitude: 85.31087372191023
//Latitude:  23.326981621613303
//Zoom Level: 8
//Scale (approx. m/px): 1222.99245256282

Map.setCenter(85.31087372191023, 23.326981621613303, 8);
Map.addLayer(colorized, colorizedVis, 'Colorized');
Map.addLayer(jharkhand);

