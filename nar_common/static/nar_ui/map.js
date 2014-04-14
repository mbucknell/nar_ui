var map;
(function() {
	var options = {};
	var WGS84_GOOGLE_MERCATOR = new OpenLayers.Projection('EPSG:900913'); 
	var WGS84_GEOGRAPHIC = new OpenLayers.Projection('EPSG:4326');
	options.projection = WGS84_GOOGLE_MERCATOR;
	
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

	options.restrictedExtent = new OpenLayers.Bounds(-146.0698, 19.1647, -42.9301, 52.8949).transform(WGS84_GEOGRAPHIC, WGS84_GOOGLE_MERCATOR);
		
	var zyx = '/MapServer/tile/${z}/${y}/${x}';
	var ArcGisLayer = function(name, identifier){
		return new OpenLayers.Layer.XYZ(
	 			name,
	 			"http://services.arcgisonline.com/ArcGIS/rest/services/" + identifier + zyx, 
	 			defaultLayerOptions
		)
	};
	var mapLayers = [
 		ArcGisLayer('World Street Map', 'World_Street_Map'),
 		ArcGisLayer("World Topo Map",'World_Topo_Map'),
 		ArcGisLayer("World Image", "World_Imagery"),
 		ArcGisLayer("World Terrain Base", "World_Shaded_Relief")
	];
	var sitesLayerOptions = {};
	Object.merge(
		sitesLayerOptions, 
		defaultLayerOptions
	);
	Object.merge(
		sitesLayerOptions,
		{
			isBaseLayer: false
		}
	);
	var extraUrlParams = {
		layers : 'NAWQA100_cy3fsmn',
		transparent: true,
		tiled: true
	};
	
	var sitesLayer = new OpenLayers.Layer.WMS(
		'NAWQA Sites',
		CONFIG.endpoint.geoserver + 'NAR/wms',
		extraUrlParams,
		sitesLayerOptions
	);
	
	mapLayers.push(sitesLayer);
	
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
	map.zoomToExtent(options.restrictedExtent, true);
}());