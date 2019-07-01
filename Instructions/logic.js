// Store our API endpoint inside queryUrl
//var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
 // "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";
 var queryUrl2 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
 // Perform a GET request to the query URL
 d3.json(queryUrl2, function(data) {
   // Once we get a response, send the data.features object to the createFeatures function
   createFeatures(data.features);
 });
 
 
 // Function to create features using the earthquake data.
 function createFeatures(earthquakeData) {
 
   // Define a function we want to run once for each feature in the features array
   // Give each feature a popup describing the place and time of the earthquake
   function onEachFeature(feature, layer) {
     layer.bindPopup("<h3>" + feature.properties.place +
       "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
   }
 
   // // Create a GeoJSON layer containing the features array on the earthquakeData object
   // // Run the onEachFeature function once for each piece of data in the array
   // var earthquakes = L.geoJSON(earthquakeData, {
   //   onEachFeature: onEachFeature
   // });
 
   var earthquakes = L.geoJSON(earthquakeData, {
     pointToLayer: function (feature, latlng) {
               return L.circleMarker(latlng, {
         radius: markerSize(feature.properties.mag),
         fillColor: fillColor(feature.properties.mag),
         color: "black",
         weight: 0.6,
         opacity: 0.4,
         fillOpacity: 0.6
       });
       },
 
       // Create popups
       onEachFeature: function (feature, layer) {
         return layer.bindPopup(`<strong>Place:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${feature.properties.mag}`);
       }
     });
 
   // Sending our earthquakes layer to the createMap function
   createMap(earthquakes);
 }
 //creting  map using two layers.
 function createMap(earthquakes) {
 
   // Define streetmap and darkmap layers
   var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
     maxZoom: 18,
     id: "mapbox.streets",
     accessToken: API_KEY
   });
 
   var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
     maxZoom: 18,
     id: "mapbox.dark",
     accessToken: API_KEY
   });
 
   // Define a baseMaps object to hold our base layers
   var baseMaps = {
     "Street Map": streetmap,
     "Dark Map": darkmap
   };
 
   // Create overlay object to hold our overlay layer
   var overlayMaps = {
     Earthquakes: earthquakes
   };
 
   // Create our map, giving it the streetmap and earthquakes layers to display on load
   var myMap = L.map("map", {
     center: [
       37.09, -95.71
     ],
     zoom: 3,
     layers: [streetmap, earthquakes]
   });
 
   // Create a layer control
   // Pass in our baseMaps and overlayMaps
   // Add the layer control to the map
   L.control.layers(baseMaps, overlayMaps, {
     collapsed: false
   }).addTo(myMap);
 // }
 // Set up the legend and the colour variance for magnitude from leaflet documentation
 var legend = L.control({ position: 'bottomright'});
 
 
   legend.onAdd = function() {
     var div = L.DomUtil.create('div', 'info legend'),
         magnitude = [0,1,2,3,4,5,6],
         labels = [];
 
     // loop through our density intervals and generate a label with a colored square for each interval
     for (var i = 0; i < magnitude.length; i++) {
         div.innerHTML +=
             '<i style="background:' + fillColor(magnitude[i] + 1) + '"></i> ' +
             magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
     }
 
     return div;
 };
 
 legend.addTo(myMap);
 };
    // Adding legend to the map
 
 // Define colors depending on the magnituge of the earthquake
 function fillColor(magnituge) {
 
     switch (true) {
       case magnituge >= 6.0:
         return 'red';
         break;
       
       case magnituge >= 5.0:
         return 'orangered';
         break;
 
       case magnituge >= 4.0:
         return 'darkorange';
         break;
       
       case magnituge >= 3.0:
         return 'orange';
         break;
 
       case magnituge >= 2.0:
         return 'gold';
         break;
 
       case magnituge >= 1.0:
         return 'yellow';
         break;
 
       default:
         return 'greenyellow';
     };
     // legend.addTo(myMap);
 };
 
 
 // Reflect the earthquake magnitude
 function markerSize(magnituge) {
   return magnituge*3;
 }