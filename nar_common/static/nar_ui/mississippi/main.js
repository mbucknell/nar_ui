$(document).ready(function() {
	"use strict";
	// Hide/Show the "Hover-on-click" tag
	$('#toggle').click(function() {
		$('#mississippi_info').toggle('5000', function() {
			if ($('#mississippi_info').is(':visible')) {
				$('#toggle').val('Hide');
			} else {
				$('#toggle').val('Show');
			}
		});
	});
	
	var leftMap = nar.mississippi.map.createMap({
			div : document.getElementById('left-map')
		}),
		rightMap = nar.mississippi.map.createMap({
			div : document.getElementById('right-map')
		}),
		marbLayer = new OpenLayers.Layer.WMS(
			"MARB",
			CONFIG.endpoint.geoserver + 'NAR/wms',
			{
				layers : 'NAR:NAWQA100_cy3fsmn',
				transparent : true,
				styles: 'triangles'
			}, {
				isBaseLayer : false
			}),
		fakeLayer = new OpenLayers.Layer.WMS(
			"FAKE",
			CONFIG.endpoint.geoserver + 'NAR/wms',
			{
				layers : 'NAR:MS_ATCH_delta',
				transparent : true,
				styles: 'triangles'
			}, {
				isBaseLayer : false
			}),
		cqlFilter = {
				'CQL_FILTER' : "type = 'MARB'"
		},
		siteIdentificationControl,fakeSiteIdentificationControl;
	
	// Filter only for MARB sites on the marb layer
	marbLayer.mergeNewParams(cqlFilter);
	
	// Add the layers to the map
	rightMap.addLayers([marbLayer,fakeLayer]);
	
	// Now that the layers are in the map, I want to add the identification
	// control for them
	siteIdentificationControl = new nar.SiteIdentificationControl({
		layers : [ marbLayer ],
		popupAnchor : '#right-map',
		popupWidth : rightMap.size.w,
		createSiteDisplayWell : function(feature) {
			var $container = $('<div />').addClass('well well-sm text-center'),
			$titleRow = $('<div />').addClass('row site-identification-popup-content-title'),
			$stationIdRow = $('<div />').addClass('row site-identification-popup-content-station-id'),
			$reportsAndGraphsRow = $('<div />').addClass('row site-identification-popup-content-links-and-graphs'),
			$relevantLinksRow = $('<div />').addClass('row site-identification-popup-content-relevant-links'),
			$summaryGraphsLinkContainer = $('<div />').addClass('col-xs-6 col-md-4 site-identification-popup-content-summary-graph-link'),
			$annualLoadGraphsLinkContainer = $('<div />').addClass('col-xs-6 col-md-4-offset-2 site-identification-popup-content-annual-load-link'),
			$mayLoadGraphsLinkContainer = $('<div />').addClass('col-xs-6 col-md-4 site-identification-popup-content-may-load-link'),
			$detailedGraphsLinkContainer = $('<div />').addClass('col-xs-6 col-md-4 site-identification-popup-content-detailed-graph-link'),
			$downloadLinkContainer = $('<div />').addClass('col-xs-6 col-md-4 site-identification-popup-content-download-link'),
			$annualLoadGraphsLink = $('<a />').append($('<span />').addClass('glyphicon glyphicon-stats'),' Annual Load'),
			$mayLoadGraphsLink = $('<a />').append($('<span />').addClass('glyphicon glyphicon-stats'),' May Load'),
			$summaryGraphsLink = $('<a />').append($('<span />').addClass('glyphicon glyphicon-th-list'),' Summary Graphs'),
			$detailedGraphsLink = $('<a />').append($('<span />').addClass('glyphicon glyphicon-stats'), ' Detailed Graphs'),
			$downloadLink = $('<a />').append($('<span />').addClass('glyphicon glyphicon-save'),' Download Data'),
			$hiddenAutoFocus = $('<span />').addClass('hidden').attr('autofocus', ''),
			data = feature.data,
			title = data.staname,
			id = data.staid;
		
			$titleRow.html(title);
			$stationIdRow.html('Station ID: ' + id);
			
			$annualLoadGraphsLink.
				attr('href', '#').
				click('click', function () {
					nar.GraphPopup.create({
						feature : feature,
						popupAnchor : '#left-map',
						type : 'annual',
						title : 'Annual Nitrate Load'
					});
				});
			$mayLoadGraphsLink.
				attr('href', '#').
				on('click', function () {
					nar.GraphPopup.create({
						feature : feature,
						popupAnchor : '#left-map',
						type : 'may',
						title : 'May Nitrate Load'
					});
				});
			$summaryGraphsLink.attr('href', CONFIG.baseUrl + 'site/' + id + '/summary-report');
			$detailedGraphsLink.attr('href',CONFIG.baseUrl + 'site/' + id + '/full-report');
			$downloadLink.attr('href', '#');
			
			$annualLoadGraphsLinkContainer.append($annualLoadGraphsLink);
			$mayLoadGraphsLinkContainer.append($mayLoadGraphsLink);
			$summaryGraphsLinkContainer.append($summaryGraphsLink);
			$detailedGraphsLinkContainer.append($detailedGraphsLink);
			$downloadLinkContainer.append($downloadLink);
			
			$reportsAndGraphsRow.append($summaryGraphsLinkContainer, $detailedGraphsLinkContainer, $downloadLinkContainer, $annualLoadGraphsLinkContainer, $mayLoadGraphsLinkContainer, $hiddenAutoFocus);
			
			$container.append($titleRow, $stationIdRow, $reportsAndGraphsRow);
			return $container;
		}
	});
	
	// The control should only handle MARB type sites
	siteIdentificationControl.vendorParams = cqlFilter;
	
	fakeSiteIdentificationControl = new nar.SiteIdentificationControl({
		layers : [ fakeLayer ],
		popupAnchor : '#right-map',
		popupWidth : rightMap.size.w,
		createSiteDisplayWell : function(feature) {
			var $container = $('<div />').addClass('well well-sm text-center'),
			$titleRow = $('<div />').addClass('row site-identification-popup-content-title'),
			$reportsAndGraphsRow = $('<div />').addClass('row site-identification-popup-content-links-and-graphs'),
			$summaryGraphsLinkContainer = $('<div />').addClass('col-xs-6 col-md-4 site-identification-popup-content-summary-graph-link'),
			$annualLoadGraphsLinkContainer = $('<div />').addClass('col-xs-6 col-md-4 site-identification-popup-content-annual-load-link'),
			$mayLoadGraphsLinkContainer = $('<div />').addClass('col-xs-6 col-md-4 site-identification-popup-content-may-load-link'),
			$detailedGraphsLinkContainer = $('<div />').addClass('col-xs-6 col-md-4-offset-2 site-identification-popup-content-detailed-graph-link'),
			$downloadLinkContainer = $('<div />').addClass('col-xs-6 col-md-4 site-identification-popup-content-download-link'),
			$annualLoadGraphsLink = $('<a />').append($('<span />').addClass('glyphicon glyphicon-stats'),' Annual Load'),
			$mayLoadGraphsLink = $('<a />').append($('<span />').addClass('glyphicon glyphicon-stats'),' May Load'),
			$summaryGraphsLink = $('<a />').append($('<span />').addClass('glyphicon glyphicon-th-list'),' Summary Graphs'),
			$detailedGraphsLink = $('<a />').append($('<span />').addClass('glyphicon glyphicon-stats'), ' Detailed Graphs'),
			$downloadLink = $('<a />').append($('<span />').addClass('glyphicon glyphicon-save'),' Download Data'),
			$hiddenAutoFocus = $('<span />').addClass('hidden').attr('autofocus', ''),
			data = feature.data,
			title = data.staname,
			id = data.staid;
		
			$titleRow.html('Mississippi River at Gulf');
			
			$annualLoadGraphsLink.
				attr('href', '#').
				click('click', function () {
					nar.GraphPopup.create({
						feature : feature,
						popupAnchor : '#left-map',
						type : 'annual',
						title : 'Annual Nitrate Load'
					});
				});
			$mayLoadGraphsLink.
				attr('href', '#').
				on('click', function () {
					nar.GraphPopup.create({
						feature : feature,
						popupAnchor : '#left-map',
						type : 'may',
						title : 'May Nitrate Load'
					});
				});
			$summaryGraphsLink.attr('href', CONFIG.baseUrl + 'site/' + id + '/summary-report');
			$detailedGraphsLink.attr('href',CONFIG.baseUrl + 'site/' + id + '/full-report');
			$downloadLink.attr('href', '#');
			
			$annualLoadGraphsLinkContainer.append($annualLoadGraphsLink);
			$mayLoadGraphsLinkContainer.append($mayLoadGraphsLink);
			$summaryGraphsLinkContainer.append($summaryGraphsLink);
			$detailedGraphsLinkContainer.append($detailedGraphsLink);
			$downloadLinkContainer.append($downloadLink);
			
			$reportsAndGraphsRow.append($annualLoadGraphsLinkContainer, $mayLoadGraphsLinkContainer, $downloadLinkContainer, $hiddenAutoFocus);
			
			$container.append($titleRow, $reportsAndGraphsRow);
			return $container;
		}
	});
	
	rightMap.addControls([siteIdentificationControl, fakeSiteIdentificationControl]);
});