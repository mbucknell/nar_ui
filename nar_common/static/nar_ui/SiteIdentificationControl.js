var nar = nar || {};
nar.SiteIdentificationControl = OpenLayers.Class(OpenLayers.Control.WMSGetFeatureInfo, {
	title : 'site-identify-on-hover-control',
	hover : true,
	layers : [ ],
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
	autoActivate : true,
	initialize: function (options) {
		"use strict";
		options = options || {};
		options.handlerOptions = options.handlerOptions || {};

		OpenLayers.Control.WMSGetFeatureInfo.prototype.initialize.apply(this, [options]);

		this.events.register("getfeatureinfo", this, this.onHoverIdentificationHandler);
	},
	onHoverIdentificationHandler: function (response) {
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
    	$popupDiv
    	
    	// Only care about this if user hoevered over an actual feature
    	if (features.length > 0) {
    		// If more than one feature, create a list. Otherwise, just create a single div
    		
    		// CONFIG.baseUrl + 'site/' + uriParam + '/summary-report'
    		
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
	},
	CLASS_NAME: "OpenLayers.Control.WMSGetFeatureInfo"
});