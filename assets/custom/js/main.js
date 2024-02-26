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

  // Add click event listener to the map to display school images and animate car
  map.on('click', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
      return feature;
    });
    if (feature && feature.get('imageSrc')) {
      var imageSrc = feature.get('imageSrc');
      displayImageInControl(imageSrc);
    } else if (feature && feature.getGeometry() instanceof ol.geom.LineString) {
      animateCar(feature.getGeometry(), schoolsLayer.getSource().getFeatures()[0]);
    }
  });

  map.addLayer(schoolsLayer);

  // Draw a line between School 1 and School 2
  var lineFeature = new ol.Feature({
    geometry: new ol.geom.LineString([
      ol.proj.fromLonLat([35.68413328, -1.26880208]), // School 1 coordinates
      ol.proj.fromLonLat([35.68003944, -1.33729112])  // School 2 coordinates
    ])
  });

  var lineStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'green',
      width: 2
    })
  });

  lineFeature.setStyle(lineStyle);

  var vectorSource = new ol.source.Vector({
    features: [lineFeature]
  });

  var vectorLayer = new ol.layer.Vector({
    source: vectorSource
  });

  map.addLayer(vectorLayer);
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
        "name": "Parbursh Primary School",
        "imageSrc": "./images/school A.jpg" // Image for School 1
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [35.68003944, -1.33729112] // School 2 coordinates
      },
      "properties": {
        "name": "Kikurku Primary School",
        "imageSrc": "./images/school B.jpg" // Image for School 2
      }
    },
    // Add more schools as needed
  ]
};

// Add schools to the map
addSchools(schoolsData);

// Function to display the image in the geolocateControl div
function displayImageInControl(imageSrc) {
  var geolocateControl = document.getElementById('geolocateControl');
  geolocateControl.innerHTML = ''; // Clear previous content
  var img = document.createElement('img');
  img.src = imageSrc;
  img.style.width = '100%';
  img.style.height = '80%';
  geolocateControl.appendChild(img);
}

// Function to animate the car moving along the line
function animateCar(lineGeometry, schoolFeature) {
  var carIconFeature = new ol.Feature({
    geometry: new ol.geom.Point(schoolFeature.getGeometry().getCoordinates())
  });

  var carIconStyle = new ol.style.Style({
    image: new ol.style.Icon({
      src: './images/car_icon.png', // Car icon image URL
      scale: 0.2 // Adjust scale as needed
    })
  });

  carIconFeature.setStyle(carIconStyle);

  var vectorSource = new ol.source.Vector({
    features: [carIconFeature]
  });

  var vectorLayer = new ol.layer.Vector({
    source: vectorSource
  });

  map.addLayer(vectorLayer);

  var coordinates = lineGeometry.getCoordinates();
  var index = 0;

  var moveCar = function() {
    index++;
    if (index < coordinates.length) {
      carIconFeature.setGeometry(new ol.geom.Point(coordinates[index]));
      setTimeout(moveCar, 1000); // Move car every 5 seconds
    } else {
      // Car reached the end of the line
    }
  };

  moveCar();
}

// Add a button to the control for geolocation
var geolocateButton = document.createElement('img');
geolocateButton.src = './images/location.png'; // Replace with the URL of your PNG image
geolocateButton.className = 'geolocate-button';

// Add the button to the map's control
var geolocateControl = document.createElement('div');
geolocateControl.id = 'geolocateControl';
geolocateControl.className = 'ol-control geolocate-control ol-unselectable ol-control';
geolocateControl.appendChild(geolocateButton);

// Create left and right arrow images
var leftArrow = document.createElement('img');
leftArrow.src = './images/arrow_left.png';
leftArrow.className = 'arrow';
geolocateControl.appendChild(leftArrow);

var rightArrow = document.createElement('img');
rightArrow.src = './images/arrow_right.png';
rightArrow.className = 'arrow';
rightArrow.id= 'arrow_right';
rightArrow.onclick = function() {
  animateCar(new ol.geom.LineString([
    ol.proj.fromLonLat([35.68003944, -1.33729112]),  // School 2 coordinates
    ol.proj.fromLonLat([35.68413328, -1.26880208]) // School 1 coordinates
  ]), map.getLayers().item(1).getSource().getFeatures()[1]);
};
geolocateControl.appendChild(rightArrow);

document.body.appendChild(geolocateControl);

// Styling for the button and arrows
var style = document.createElement('style');
style.textContent = `
  .geolocate-control {
    position: absolute;
    bottom: 100px;
    right: 5px;
    width: 300px;
    height: 300px;
    border: 1px solid #ccc;
    overflow: hidden;
  }
  
  .geolocate-button {
    width: 100%;
    height: 80%;
    cursor: pointer;
  }

  .arrow {
    width: 20%;
    height: 10%;
    cursor: pointer;
  }
  #arrow_right {
  margin-left:120px;
  }
`;
document.head.appendChild(style);
