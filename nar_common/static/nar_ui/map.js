var map;
(function() {
    var options = {};
    var WGS84_GOOGLE_MERCATOR = new OpenLayers.Projection('EPSG:900913'); 
    var WGS84_GEOGRAPHIC = new OpenLayers.Projection('EPSG:4326');
    options.projection = WGS84_GOOGLE_MERCATOR;
    
    var continentalExtent = new OpenLayers.Bounds(-120.33, 25.8767, -72.6054, 47.9275).transform(WGS84_GEOGRAPHIC, WGS84_GOOGLE_MERCATOR);
    var continentalCenter = continentalExtent.getCenterLonLat();
    
    
    var themeFileUrl = CONFIG.staticUrl + 'nar_ui/js_lib/OpenLayers/theme/default/style.css';
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
    var addBaseLayersTo = function(mapLayers, defaultLayerOptions) {
        var zyx = '/MapServer/tile/${z}/${y}/${x}';
        var ArcGisLayer = function(name, identifier) {
            return new OpenLayers.Layer.XYZ(
                name,
                "http://services.arcgisonline.com/ArcGIS/rest/services/" + identifier + zyx,
                defaultLayerOptions
            );
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
        
    var addNlcdLayersTo = function(mapLayers, defaultLayerOptions) {
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
        sitesLayerOptions.singleTile = true; //If we're not going to cache, might as well singleTile
        sitesLayerOptions.isBaseLayer =  false;

        var sitesLayerParams = {
            layers : 'NAWQA100_cy3fsmn',
            buffer: 8,
            transparent: true,
            styles: 'triangles'
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
    
    
    var mapLayers = [];
    addBaseLayersTo(mapLayers, defaultLayerOptions);
    addNlcdLayersTo(mapLayers, defaultLayerOptions);
    sitesLayer = addSitesLayerTo(mapLayers, defaultLayerOptions);
    
    options.layers = mapLayers;
 
    // Create the on-hover identification control
    var onHoverIdentificationControl = new OpenLayers.Control.WMSGetFeatureInfo({
		title : 'site-identify-on-hover-control',
		hover : true,
		layers : [ sitesLayer ],
		queryVisible : true,
		output : 'object',
		drillDown : false,
		infoFormat : 'application/vnd.ogc.gml',
		vendorParams : {
			buffer : 8
		},
		handlerOptions : {
			hover : {
				delay: 500
			}
		},
		autoActivate : true
	});
    var onHoverIdentificationHandler = function(response) {
    	var features = response.features,
    	$featureDescriptionHTML = $('<ul />'),
    	feature,
    	popup,
    	mapWidth = map.size.w,
    	mapHeight = map.size.h,
    	popupWidth,
    	popupHeight,
    	popupTop,
    	popupLeft,
    	newLeft,
    	newTop,
    	newPx,
    	newLonLat,
    	$popupDiv;
    	
    	// Only care about this if user hoevered over an actual feature
    	if (features.length > 0) {
    		// If more than one feature, create a list. Otherwise, just create a single div
	    	if (features.length > 1) {
		    	for (var fInd = 0;fInd < features.length;fInd++) {
		    		feature = features[fInd];
		    		$li = $('<li />').html('Name: ' + feature.data.staname + ', ID: ' + feature.data.staid);
		    		$featureDescriptionHTML.append($li);
		    	}
	    	} else {
	    		$featureDescriptionHTML = $('<div />').html('Name: ' + features[0].data.staname + ', ID: ' + features[0].data.staid);
	    	}
	    
	    	popup = new OpenLayers.Popup("site-identification-" + Date.now(),
	    			map.getLonLatFromPixel(new OpenLayers.Pixel(response.xy.x, response.xy.y)),
	    			null,
	    			null,
	                true);
	    	
	    	popup.autoSize = true;
	    	popup.displayClass = 'site-identification-popup';
	    	popup.contentDisplayClass = 'site-identification-popup-content';
	    	popup.opacity = 0.9;
	    	
	    	// If another popup is opened, close all other popups first
	    	map.popups.each(function(p) {
	    		p.destroy();
	    	});
	    	
			map.addPopup(popup);
			popup.setContentHTML($('<div />').append($featureDescriptionHTML).html());
			popup.div.style.height = 'auto';
			popup.div.style.width = 'auto';
	    	popup.contentDiv.style.height = 'auto';
	    	popup.closeDiv.className = 'glyphicon glyphicon-remove';
	    	
	    	// Figure out if popup scrolls off the side/bottom of the map and reposition if so
	    	$popupDiv = $(popup.div);
	    	popupPixel = map.getPixelFromLonLat(popup.lonlat),
	    	popupLeft = popupPixel.x;
	    	popupTop = popupPixel.y;
	    	popupWidth = $popupDiv.width();
	    	popupHeight = $popupDiv.height();
	    	newLeft = popupLeft;
	    	newTop = popupTop;
	    	newLonLat = popup.lonlat;
	    	
	    	// Check of the width of the popup goes beyond the right side of the map
	    	if (popupLeft + popupWidth > mapWidth) {
	    		newLeft = popupLeft - popupWidth;
	    	}
	    	
	    	// Check if the height of the popup goes below the bottom of the map
	    	if (popupTop + popupHeight > mapHeight) {
	    		newTop = popupTop - popupHeight;
	    	}
	    	
	    	// If the popup needs to be repositioned, do so
	    	newPx = new OpenLayers.Pixel(newLeft, newTop);
	    	newLonLat = map.getLonLatFromPixel(newPx);
	    	if (popup.lonlat !== newLonLat) {
	    		popup.lonlat = newLonLat;
	    		popup.updatePosition();
	    	}
	    	
    	}
    }
    onHoverIdentificationControl.events.register("getfeatureinfo", {}, onHoverIdentificationHandler);
    options.controls.push(onHoverIdentificationControl);
    
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
            buffer: 8
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
    
    var id = 'siteMap';
    var div = $('#'+id);
    if(div.length){
        div = div[0];
    }
    else{
        throw Error('Error rendering map - could not find element with id "' + id + '".');
    }

    map = new OpenLayers.Map(div, options);
    map.setCenter(continentalCenter, 4);
    sitesLayer.events.register("loadend", {}, function() {
    	map.updateSize();
    });
    
    var insetControl = new nar.inset({});
    map.addControl(insetControl, new OpenLayers.Pixel(0, map.getSize().h - 260));
    insetControl.activate();
    
    (function setupFiltering(name, layer) {
        var writeCQLFilter = function(selectedTypes) {
            var cqlFilter = "c3type IS NOT NULL";
            if (selectedTypes && 0 < selectedTypes.length) {
                cqlFilter = "c3type IN ('";
                cqlFilter = cqlFilter + selectedTypes.join("','");
                cqlFilter = cqlFilter + "')";
            }
            return cqlFilter;
        };
        $("input[name='" + name + "']").change(function() {
            var selectedTypes = $.makeArray($("input[name='" + name + "']:checked").map(function(){return $(this).val()}));
            var cqlFilter = writeCQLFilter(selectedTypes);
            layer.mergeNewParams({cql_filter: cqlFilter});
        });
    })("siteFilter", sitesLayer);
}());
