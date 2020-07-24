var dataset = ee.ImageCollection('MODIS/006/MYD11A1')
                  .filter(ee.Filter.date('2008-01-01', '2018-05-01'))
                  .filterBounds(jharkhand);
//MODIS/006/MOD11A2
//MODIS/006/MYD11A1

var landSurfaceTemperature = dataset.select('LST_Day_1km');
var landSurfaceTemperatureVis = {
  min: -20,
  max: 40,
  palette: [
    '040274', '040281', '0502a3', '0502b8', '0502ce', '0502e6',
    '0602ff', '235cb1', '307ef3', '269db1', '30c8e2', '32d3ef',
    '3be285', '3ff38f', '86e26f', '3ae237', 'b5e22e', 'd6e21f',
    'fff705', 'ffd611', 'ffb613', 'ff8b13', 'ff6e08', 'ff500d',
    'ff0000', 'de0101', 'c21301', 'a71001', '911003'
  ],
};

//clip if you want to
// create function to crop with jharkhand's boundaries
var clipping_func = function(image) {
    // Crop by table extension
    return image.clip(jharkhand);
  };
  
  var LSTClipped = landSurfaceTemperature.map(clipping_func);

//converting to celsius 
// map over the image collection and use server side functions
var tempToDegrees = LSTClipped.map(function(image){
  return image.multiply(0.02).subtract(273.15);
});
// print and add to the map
print('image collection in temp in degrees', tempToDegrees);
Map.addLayer(tempToDegrees, {min: -20, max: 40, palette: landSurfaceTemperatureVis.palette}, 'temp in degrees');
/*
 * Legend setup
 */

// Creates a color bar thumbnail image for use in legend from the given color
// palette.
function makeColorBarParams(palette) {
  return {
    bbox: [0, 0, 1, 0.1],
    dimensions: '100x10',
    format: 'png',
    min: 0,
    max: 1,
    palette: palette,
  };
}

// Create the color bar for the legend.
var colorBar = ui.Thumbnail({
  image: ee.Image.pixelLonLat().select(0),
  params: makeColorBarParams(landSurfaceTemperatureVis.palette),
  style: {stretch: 'horizontal', margin: '0px 8px', maxHeight: '24px'},
});

// Create a panel with three numbers for the legend.
var legendLabels = ui.Panel({
  widgets: [
    ui.Label(landSurfaceTemperatureVis.min, {margin: '4px 8px'}),
    ui.Label(
        (landSurfaceTemperatureVis.max / 2),
        {margin: '4px 8px', textAlign: 'center', stretch: 'horizontal'}),
    ui.Label(landSurfaceTemperatureVis.max, {margin: '4px 8px'})
  ],
  layout: ui.Panel.Layout.flow('horizontal')
});

var legendTitle = ui.Label({
  value: 'Map Legend: Land Surface Temperature in degC',
  style: {fontWeight: 'bold'}
});

// Add the legendPanel to the map.
var legendPanel = ui.Panel([legendTitle, colorBar, legendLabels]);

//Add other layers
Map.add(legendPanel);
Map.setCenter(85.31087372191023, 23.326981621613303, 7);
//Map.addLayer(
//    landSurfaceTemperature, landSurfaceTemperatureVis,
//    'Land Surface Temperature');
Map.addLayer(jharkhand)


//adding colormapscale: 
//https://gis.stackexchange.com/questions/307652/how-to-add-color-map-scale-in-google-earth-engine 

