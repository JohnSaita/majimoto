// Define OpenLayers map
var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([35.72369436, -1.36005208]), // Default center
    zoom: 12 // Default zoom
  })
});

// Function to add schools to the map
function addSchools(schoolsData) {
  var schoolsLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: (new ol.format.GeoJSON()).readFeatures(schoolsData, {
        featureProjection: 'EPSG:3857'
      })
    }),
    style: function(feature) {
      return new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: 'https://openlayers.org/en/latest/examples/data/icon.png'
        }),
        text: new ol.style.Text({
          text: feature.get('name'),
          offsetY: -20,
          fill: new ol.style.Fill({ color: '#000' }),
          stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
        })
      });
    }
  });
  map.addLayer(schoolsLayer);
}

// Example data for schools
var schoolsData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [35.68413328, -1.26880208] // School 1 coordinates
      },
      "properties": {
        "name": "Parbursh Primary SchooL"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [35.68003944, -1.33729112] // School 2 coordinates
      },
      "properties": {
        "name": "Kikurku Primary School"
      }
    },
    // Add more schools as needed
  ]
};

// Add schools to the map
addSchools(schoolsData);

// Function to add user location as a blue dot on the map
function addUserLocation(position) {
  var userLocation = ol.proj.fromLonLat([position.coords.longitude, position.coords.latitude]);
  map.getView().setCenter(userLocation);
  var userMarker = new ol.Feature({
    geometry: new ol.geom.Point(userLocation)
  });
  userMarker.setStyle(new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({ color: 'blue' }),
      stroke: new ol.style.Stroke({ color: 'white', width: 2 })
    })
  }));
  var userMarkerSource = new ol.source.Vector({
    features: [userMarker]
  });
  var userMarkerLayer = new ol.layer.Vector({
    source: userMarkerSource
  });
  map.addLayer(userMarkerLayer);
}

// Flag to track if user's location has been retrieved
var userLocationRetrieved = false;

// Function to handle geolocation
function handleGeolocation() {
  // Check if geolocation is supported and user's location has not been retrieved yet
  if ("geolocation" in navigator && !userLocationRetrieved) {
    // Get user's current position
    navigator.geolocation.getCurrentPosition(function(position) {
      addUserLocation(position);
      userLocationRetrieved = true;
    }, function(error) {
      console.error('Error getting user location:', error);
      alert('Error getting user location. Please make sure you have allowed location access.');
    });
  } else if (userLocationRetrieved) {
    // Center map on user's location if it has been retrieved already
    var userLayer = map.getLayers().getArray().find(layer => layer.get('name') === 'userLayer');
    if (userLayer) {
      var userSource = userLayer.getSource();
      var userFeatures = userSource.getFeatures();
      if (userFeatures.length > 0) {
        var userGeometry = userFeatures[0].getGeometry();
        map.getView().setCenter(userGeometry.getCoordinates());
      }
    }
  } else {
    alert('Geolocation is not supported by your browser');
  }
}

// Add a button to the control for geolocation
var geolocateButton = document.createElement('button');
geolocateButton.innerHTML = 'G';
geolocateButton.className = 'geolocate-button';
geolocateButton.addEventListener('click', handleGeolocation);

// Add the button to the map's control
var geolocateControl = document.createElement('div');
geolocateControl.className = 'ol-control geolocate-control ol-unselectable ol-control';
geolocateControl.appendChild(geolocateButton);
map.addControl(new ol.control.Control({element: geolocateControl}));

// Styling for the button
var style = document.createElement('style');
style.textContent = '.geolocate-control { position: absolute; top: 10px; right: 10px; background: rgba(255, 255, 255, 0.4); border: 1px solid #ccc; border-radius: 4px; padding: 5px; } .geolocate-button { background-color: #fff; color: #333; border: 1px solid #ccc; border-radius: 4px; cursor: pointer; }';
document.head.appendChild(style);
