var map;
(function() {
	var options = {};
	var WGS84_GOOGLE_MERCATOR = new OpenLayers.Projection('EPSG:900913'); 
	var WGS84_GEOGRAPHIC = new OpenLayers.Projection('EPSG:4326');
	options.projection = WGS84_GOOGLE_MERCATOR;
	
	var continentalExtent = new OpenLayers.Bounds(-120.33, 25.8767, -72.6054, 47.9275).transform(WGS84_GEOGRAPHIC, WGS84_GOOGLE_MERCATOR);
	var continentalCenter = continentalExtent.getCenterLonLat();
	
	
	var themeFileUrl = CONFIG.staticUrl + 'nar_ui/OpenLayers/theme/default/style.css';
	options.theme = themeFileUrl;
	options.controls = [
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.MousePosition({
            prefix: 'POS: '
        }),
        new OpenLayers.Control.ScaleLine({
            geodesic: true
        }),
        new OpenLayers.Control.LayerSwitcher({
            roundedCorner: true
        }),
        new OpenLayers.Control.Zoom()
    ];
	var defaultLayerOptions = {
		sphericalMercator : true,
		layers : "0",
		isBaseLayer : true,
		projection : options.projection,
		units : "m",
		buffer : 3,
		wrapDateLine : false
	};
	var addBaseLayersTo = function (mapLayers, defaultLayerOptions){
		var zyx = '/MapServer/tile/${z}/${y}/${x}';
		var ArcGisLayer = function(name, identifier){
			return new OpenLayers.Layer.XYZ(
		 			name,
		 			"http://services.arcgisonline.com/ArcGIS/rest/services/" + identifier + zyx, 
		 			defaultLayerOptions
			)
		};
		var baseLayers = 
		[ 
            ArcGisLayer("World Topo Map", 'World_Topo_Map'),
            ArcGisLayer("World Image", "World_Imagery"),
            ArcGisLayer("World Shaded Relief", "World_Shaded_Relief"),
            ArcGisLayer('World Street Map', 'World_Street_Map')
     	];
		mapLayers.add(baseLayers);
		return baseLayers;
	};
		
	var addNlcdLayersTo = function(mapLayers, defaultLayerOptions){
		var nlcdUrl = 'http://raster.nationalmap.gov/ArcGIS/services/TNM_LandCover/MapServer/WMSServer';
		
		var nlcdProjection = 'EPSG:3857';
		
		var nlcdContiguousUsOptions = Object.clone(defaultLayerOptions);
		nlcdContiguousUsOptions.displayInLayerSwitcher = true;
		nlcdContiguousUsOptions.isBaseLayer = false;
		nlcdContiguousUsOptions.projection = nlcdProjection;
		nlcdContiguousUsOptions.visibility = false;
		
		var nlcdContiguousUsParams = {
			layers : '24',
			transparent: true,
			tiled: true
		};
		
		var nlcdContiguousUsLayer = new OpenLayers.Layer.WMS('NLCD', nlcdUrl, nlcdContiguousUsParams, nlcdContiguousUsOptions); 
		
			
		var nlcdAlaskaOptions = Object.clone(defaultLayerOptions);
		nlcdAlaskaOptions.displayInLayerSwitcher = false;
		nlcdAlaskaOptions.isBaseLayer = false;
		nlcdAlaskaOptions.projection = nlcdProjection;
		nlcdAlaskaOptions.visibility = false;
		var nlcdAlaskaParams = {
			layers : '18',
			transparent: true,
			tiled: true
		};
		
		var nlcdAlaskaLayer = new OpenLayers.Layer.WMS('NLCD Alaska', nlcdUrl, nlcdAlaskaParams, nlcdAlaskaOptions); 
				
		nlcdContiguousUsLayer.events.register('visibilitychanged', {}, function(){
			 nlcdAlaskaLayer.setVisibility(nlcdContiguousUsLayer.visibility); 
	    });
		
		var nlcdLayers = [
             nlcdContiguousUsLayer,
             nlcdAlaskaLayer
        ];
		mapLayers.add(nlcdLayers);
		return nlcdLayers;
	};
	
	var addSitesLayerTo = function(mapLayers, defaultLayerOptions){
		var sitesLayerOptions = Object.clone(defaultLayerOptions);
		sitesLayerOptions.isBaseLayer =  false;

		var sitesLayerParams = {
			layers : 'NAWQA100_cy3fsmn',
			transparent: true,
			tiled: true
		};
		
		var sitesLayer = new OpenLayers.Layer.WMS(
			'NAWQA Sites',
			CONFIG.endpoint.geoserver + 'NAR/wms',
			sitesLayerParams,
			sitesLayerOptions
		);
		
		mapLayers.push(sitesLayer);
		return sitesLayer;
	};
	
	
	mapLayers = [];
	addBaseLayersTo(mapLayers, defaultLayerOptions);
	addNlcdLayersTo(mapLayers, defaultLayerOptions);
	sitesLayer = addSitesLayerTo(mapLayers, defaultLayerOptions);
	
	options.layers = mapLayers;
	
	var getFeatureInfoControl = new OpenLayers.Control.WMSGetFeatureInfo({
        title: 'site-identify-control',
        hover: false,
        layers: [
            sitesLayer
        ],
        queryVisible: true,
        output: 'object',
        drillDown: true,
        infoFormat: 'application/vnd.ogc.gml',
        vendorParams: {
            radius: 5
        },
        id: 'sites',
        autoActivate: true
    });
	var getFeatureInfoHandler = function(response) {
		var realFeatures = response.features[0].features;
		if(realFeatures.length) {
			//just grab first feature for now
			var feature = realFeatures[0];
			var featureId = feature.data.staid;
			var uriParam = encodeURI(featureId);
			var url = CONFIG.baseUrl + 'site/' + uriParam + '/summary-report';
			window.location.href = url;
		}
	};
	getFeatureInfoControl.events.register("getfeatureinfo", {}, getFeatureInfoHandler);
	options.controls.push(getFeatureInfoControl);
	
	var id = 'siteMap'
	var div = $('#'+id);
	if(div.length){
		div = div[0];
	}
	else{
		throw Error('Error rendering map - could not find element with id "' + id + '".');
	}

	map = new OpenLayers.Map(div, options);

	map.setCenter(continentalCenter, 4);
}());