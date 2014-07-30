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
		"use strict";
		var features = response.features,
	    	$featureDescriptionHTML = $('<div />').addClass('container-fluid').attr('id', 'site-identification-popup-content-container'),
	    	wellPaddingHeight = 35,
	    	feature,
	    	popup,
	    	popupPixel,
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
	    	$popupDiv,
	    	createSiteDisplayWell = function (feature) {
				var $container = $('<div />').addClass('well well-sm text-center'),
					$titleRow = $('<div />').addClass('row site-identification-popup-content-title'),
					$stationIdRow = $('<div />').addClass('row site-identification-popup-content-station-id'),
					$reportsAndGraphsRow = $('<div />').addClass('row site-identification-popup-content-links-and-graphs'),
					$relevantLinksRow = $('<div />').addClass('row site-identification-popup-content-relevant-links'),
					$summaryGraphsLinkContainer = $('<div />').addClass('col-xs-6 col-md-4 site-identification-popup-content-summary-graph-link'),
					$detailedGraphsLinkContainer = $('<div />').addClass('col-xs-6 col-md-4 site-identification-popup-content-detailed-graph-link'),
					$downloadLinkContainer = $('<div />').addClass('col-xs-6 col-md-4 site-identification-popup-content-download-link'),
					$summaryGraphsLink = $('<a />').append($('<span />').addClass('glyphicon glyphicon-th-list').html('View Summary Graph')),
					$detailedGraphsLink = $('<a />').append($('<span />').addClass('glyphicon glyphicon-signal').html('View Detailed Graph')),
					$downloadLink = $('<a />').append($('<span />').addClass('glyphicon glyphicon-save').html('Download Water Data')),
					data = feature.data,
					title = data.staname,
					id = data.staid;
				
				$titleRow.html(title);
				$stationIdRow.html('Station ID: ' + id);
				
				$summaryGraphsLink.attr('href', CONFIG.baseUrl + 'site/' + id + '/summary-report');
				$detailedGraphsLink.attr('href',CONFIG.baseUrl + 'site/' + id + '/full-report');
				$downloadLink.attr('href', '#');
				
				$summaryGraphsLinkContainer.append($summaryGraphsLink);
				$detailedGraphsLinkContainer.append($detailedGraphsLink);
				$downloadLinkContainer.append($downloadLink);
				
				$reportsAndGraphsRow.append($summaryGraphsLinkContainer, $detailedGraphsLinkContainer, $downloadLinkContainer);
				
				$relevantLinksRow.html('Relevant Links: Some Link, Some Other Link');
				$container.append($titleRow, $stationIdRow, $reportsAndGraphsRow, $relevantLinksRow);
				return $container;
			};
    	
    	// Only care about this if user hoevered over an actual feature
    	if (features.length > 0) {
    		// If more than one feature, create a list. Otherwise, just create a single div
	    	for (var fInd = 0;fInd < features.length;fInd++) {
	    		feature = features[fInd];
	    		$featureDescriptionHTML.append(createSiteDisplayWell(feature));
	    	}
	    
	    	popup = new OpenLayers.Popup("site-identification-" + Date.now(),
	    			map.getLonLatFromPixel(new OpenLayers.Pixel(response.xy.x, response.xy.y)),
	    			null,
	    			$('<div />').append($featureDescriptionHTML).html(),
	                true);
	    	
	    	popup.autoSize = true;
	    	popup.maxSize = new OpenLayers.Size(map.size.w / 2 , map.size.h / 2);
	    	popup.displayClass = 'site-identification-popup';
	    	popup.contentDisplayClass = 'site-identification-popup-content';
	    	popup.opacity = 0.9;
	    	
	    	// If another popup is opened, close all other popups first
	    	map.popups.each(function(p) {
	    		p.destroy();
	    	});
	    	
			map.addPopup(popup);
			
			// Make sure that if the user is hovering over the popup and a site is underneath the popup, that the 
			// hover doesn't drop through and trigger that site's popup
			OpenLayers.Event.observe(popup.div, 'mouseover', OpenLayers.Function.bind(function (div, evt) {
				this.map.getControlsBy('title', 'site-identify-on-hover-control')[0].deactivate();
			}, popup, popup.div));
    		OpenLayers.Event.observe(popup.div, 'mouseout', OpenLayers.Function.bind(function (div, evt) {
    			this.map.getControlsBy('title', 'site-identify-on-hover-control')[0].activate();
			}, popup, popup.div));
			
    		// Create proper width/height/overflow styling
	    	popup.contentDiv.style.height = 'auto';
	    	popup.closeDiv.className = 'glyphicon glyphicon-remove';
	    	popup.div.style['overflow-y'] = 'auto';
			popup.div.style.width = 'auto';
			popup.div.style.height = ($(popup.contentDiv).find('.well').outerHeight() + wellPaddingHeight) + 'px';
	    	
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