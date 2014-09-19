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
	
	$('#link-chart-contribution').on('click', function () {
		var loadTypeSelectCtrls = $('select[name="load"]'),
			nutrientTypeSelectCtrls = $('select[name="chemical"]'),
			yearRangeSelectCtrls = $('select[name="year"]'),
			leftSelections = {
				parameter_type : loadTypeSelectCtrls[0].value.toUpperCase(),
				constituent : nutrientTypeSelectCtrls[0].value.toUpperCase(),
				water_year : yearRangeSelectCtrls[0].value
			},
			rightSelections = {
				parameter_type : loadTypeSelectCtrls[1].value.toUpperCase(),
				constituent : nutrientTypeSelectCtrls[1].value.toUpperCase(),
				water_year : yearRangeSelectCtrls[1].value
			};
		
		if (leftSelections.parameter_type && leftSelections.constituent && leftSelections.water_year) {
			
			nar.ContributionDisplay.create({
				containerSelector : '#left-pie-chart-container',
				placement : 'bl',
				parameters : leftSelections,
				width: 200,
				height : 200
			});
		}
		
		if (rightSelections.parameter_type && rightSelections.constituent && rightSelections.water_year) {
			nar.ContributionDisplay.create({
				containerSelector : '#right-pie-chart-container',
				placement : 'br',
				parameters : rightSelections,
				width: 200,
				height : 200
			});
		}
	});
	
	var leftMapName = 'left-map',
		rightMapName = 'right-map',
		leftMap = nar.mississippi.map.createMap({
			div : document.getElementById(leftMapName)
		}),
		rightMap = nar.mississippi.map.createMap({
			div : document.getElementById(rightMapName)
		}),
		cqlFilter = {
				'CQL_FILTER' : "MSLoadSite = 'MSL'"
		},
		createMarblayer = function() {
			var layer = new OpenLayers.Layer.WMS(
					"MARB",
					CONFIG.endpoint.geoserver + 'NAR/wms',
					{
						layers : 'NAR:JD_NFSN_sites0914',
						transparent : true,
						styles: 'triangles'
					}, {
						isBaseLayer : false,
						singleTile : true
					});
			layer.mergeNewParams(cqlFilter);
			return layer;
		},
		createFakeLayer = function() {
			return new OpenLayers.Layer.WMS("FAKE",
					CONFIG.endpoint.geoserver + 'NAR/wms', {
						layers : 'NAR:MS_ATCH_delta',
						transparent : true,
						styles : 'triangles'
					}, {
						isBaseLayer : false
					});
		},
		createSiteIdentificationControl = function (args) {
			var layer = args.layer,
				popupAnchor = args.popupAnchor,
				width = args.width,
				graphContainer = args.graphContainer,
				control = new nar.SiteIdentificationControl({
					layers : [ layer ],
					popupAnchor : popupAnchor,
					popupWidth : width,
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
							id = data.siteid;
					
						$titleRow.html(title);
						$stationIdRow.html('Station ID: ' + id);
						
						$annualLoadGraphsLink.
							attr('href', '#').
							click('click', function () {
								nar.GraphPopup.create({
									feature : feature,
									popupAnchor : graphContainer,
									type : 'annual',
									title : 'Annual Nitrate Load'
								});
							});
						$mayLoadGraphsLink.
							attr('href', '#').
							on('click', function () {
								nar.GraphPopup.create({
									feature : feature,
									popupAnchor : graphContainer,
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
			
			control.vendorParams = cqlFilter;
			return control;
		},
		createFakeSiteIdentificationControl = function (args) {
			var layer = args.layer,
				popupAnchor = args.popupAnchor,
				width = args.width,
				graphContainer = args.graphContainer,
				control = new nar.SiteIdentificationControl({
					layers : [ layer ],
					popupAnchor : popupAnchor,
					popupWidth : width,
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
									popupAnchor : graphContainer,
									type : 'annual',
									title : 'Annual Nitrate Load'
								});
							});
						$mayLoadGraphsLink.
							attr('href', '#').
							on('click', function () {
								nar.GraphPopup.create({
									feature : feature,
									popupAnchor : graphContainer,
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
			
			return control;
		},
		leftMarbLayer = createMarblayer(),
		leftFakeLayer = createFakeLayer(),
		rightMarbLayer = createMarblayer(),
		rightFakeLayer = createFakeLayer(),
		rightSiteIdentificationControl,rightFakeSiteIdentificationControl,
		leftSiteIdentificationControl, leftFakeSiteIdentificationControl;

	
		
	// Add the layers to the map
	leftMap.addLayers([leftMarbLayer,leftFakeLayer]);
	rightMap.addLayers([rightMarbLayer,rightFakeLayer]);
	
	
	nar.mississippi.createLoadSelect(leftMap, $('.left_filter'));
	nar.mississippi.createLoadSelect(rightMap, $('.right_filter'));
	
	// Now that the layers are in the map, I want to add the identification
	// control for them
	rightSiteIdentificationControl = createSiteIdentificationControl({
		layer : rightMarbLayer,
		popupAnchor : '#' + rightMapName,
		width : rightMap.size.w,
		graphContainer : '#' + leftMapName
	});
	
	leftSiteIdentificationControl = createSiteIdentificationControl({
		layer : leftMarbLayer,
		popupAnchor : '#' + leftMapName,
		width : leftMap.size.w,
		graphContainer : '#' + rightMapName
	});
	
	rightFakeSiteIdentificationControl = createFakeSiteIdentificationControl({
		popupAnchor : '#' + rightMapName,
		layer : rightFakeLayer,
		width : rightMap.size.w,
		graphContainer : '#' + leftMapName
	});
	
	leftFakeSiteIdentificationControl = createFakeSiteIdentificationControl({
		popupAnchor :  '#' + leftMapName,
		layer : leftFakeLayer,
		width : leftMap.size.w,
		graphContainer : '#' + rightMapName
	});
	
	rightMap.addControls([rightSiteIdentificationControl, rightFakeSiteIdentificationControl]);
	leftMap.addControls([leftSiteIdentificationControl, leftFakeSiteIdentificationControl]);
});