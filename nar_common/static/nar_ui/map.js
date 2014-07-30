var map;
(function() {
	var options = {};
    options.projection = nar.commons.map.projection;
    
    var continentalExtent = new OpenLayers.Bounds(-140.5, 10.5, -64.5, 53.5).transform(nar.commons.map.geographicProjection, nar.commons.map.projection);
    var continentalCenter = continentalExtent.getCenterLonLat();
    
    
    var themeFileUrl = CONFIG.staticUrl + 'nar_ui/js_lib/OpenLayers/theme/default/style.css';
    options.theme = themeFileUrl;
    options.controls = [
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.MousePosition({
            numDigits: 2,
            displayProjection: nar.commons.map.geographicProjection
        }),
        new OpenLayers.Control.ScaleLine({
            geodesic: true
        }),
        new OpenLayers.Control.LayerSwitcher({
            roundedCorner: true
        }),
        new OpenLayers.Control.Zoom()
    ];
    
    var sitesLayer = nar.commons.mapUtils.createSitesLayers();
    var mapLayers = [].add(nar.commons.mapUtils.createBaseLayers())
    	.add(nar.commons.mapUtils.createNlcdLayers())
		.add(sitesLayer);
    
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
