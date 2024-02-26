ol.proj.proj4.register(proj4);
ol.proj.get("EPSG:32336").setExtent([766459.692529, 9814281.925923, 843529.818146, 9856082.672021]);
var wms_layers = [];


        var lyr_OpenStreetMap_0 = new ol.layer.Tile({
            'title': 'OpenStreetMap',
            'type': 'base',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
    attributions: ' ',
                url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
        });
var format_schools_in_majimoto_1 = new ol.format.GeoJSON();
var features_schools_in_majimoto_1 = format_schools_in_majimoto_1.readFeatures(json_schools_in_majimoto_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:32336'});
var jsonSource_schools_in_majimoto_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_schools_in_majimoto_1.addFeatures(features_schools_in_majimoto_1);cluster_schools_in_majimoto_1 = new ol.source.Cluster({
  distance: 10,
  source: jsonSource_schools_in_majimoto_1
});
var lyr_schools_in_majimoto_1 = new ol.layer.Vector({
                declutter: true,
                source:cluster_schools_in_majimoto_1, 
                style: style_schools_in_majimoto_1,
                popuplayertitle: "schools_in_majimoto",
                interactive: true,
                title: '<img src="styles/legend/schools_in_majimoto_1.png" /> schools_in_majimoto'
            });

lyr_OpenStreetMap_0.setVisible(true);lyr_schools_in_majimoto_1.setVisible(true);
var layersList = [lyr_OpenStreetMap_0,lyr_schools_in_majimoto_1];
lyr_schools_in_majimoto_1.set('fieldAliases', {'id': 'id', 'Schools': 'Schools', });
lyr_schools_in_majimoto_1.set('fieldImages', {'id': 'Hidden', 'Schools': 'TextEdit', });
lyr_schools_in_majimoto_1.set('fieldLabels', {'Schools': 'inline label - always visible', });
lyr_schools_in_majimoto_1.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});