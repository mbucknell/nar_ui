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
				filtersSubject = args.filtersSubject,
				virtualSite = args.virtualSite,//is it a virtual site or a physical site
				makeGraphClickHandler = function(type, feature, chemical){
					return function () {
						
						var filtersChangeHandler = function(filtersState){
							dialog.updateConstituent(filtersState.chemical);
						};
						filtersSubject.observe(filtersChangeHandler);
						var onClose = function(){
							filtersSubject.unobserve(filtersChangeHandler);
						};
						var dialog = nar.GraphPopup.create({
							feature : feature,
							popupAnchor : graphContainer,
							type : type,
							constituent: chemical
						}).on('dialogclose', onClose);

					};
				},
				loadGraphLinkClass = 'load-graph-link',
				mayLoadGraphLinkClass = 'may-load-link',
				annualLoadGraphLinkClass = 'annual-load-link',
				control = new nar.SiteIdentificationControl({
					vendorParams : virtualSite ? undefined : cqlFilter,
					layers : [ layer ],
					popupAnchor : popupAnchor,
					popupWidth : width,
					updateConstituent: function(constituent, linkParent){
						var loadGraphLinks = linkParent.find('.' + loadGraphLinkClass);
						if(loadGraphLinks.length){
							
							loadGraphLinks.off('click');
							var mayGraphLinks = linkParent.find('.' + mayLoadGraphLinkClass);
							mayGraphLinks.each(function(index, link){
								link = $(link);
								var feature = link.data('feature');
								link.click(
									makeGraphClickHandler('may', feature, filtersSubject.mostRecentNotification.chemical)
								);
							});
							var annualGraphLinks = linkParent.find('.' + annualLoadGraphLinkClass);
							annualGraphLinks.each(function(index, link){
								link = $(link);
								var feature = link.data('feature');
								link.click(
									makeGraphClickHandler('annual', feature, filtersSubject.mostRecentNotification.chemical)
								);
							});
						}
					},
					createSiteDisplayWell : function(feature) {
						var $container = $('<div />').addClass('well well-sm text-center'),
							$titleRow = $('<div />').addClass('row site-identification-popup-content-title'),
							$reportsAndGraphsRow = $('<div />').addClass('row site-identification-popup-content-links-and-graphs'),
							$relevantLinksRow = $('<div />').addClass('row site-identification-popup-content-relevant-links'),
							$summaryGraphsLinkContainer = $('<div />').addClass('col-xs-6 col-md-4 site-identification-popup-content-summary-graph-link'),
							$annualLoadGraphsLinkContainer = $('<div />').addClass('col-xs-6 col-md-4-offset-2 site-identification-popup-content-annual-load-link'),
							$mayLoadGraphsLinkContainer = $('<div />').addClass('col-xs-6 col-md-4 site-identification-popup-content-may-load-link'),
							$detailedGraphsLinkContainer = $('<div />').addClass('col-xs-6 col-md-4 site-identification-popup-content-detailed-graph-link'),
							$downloadLinkContainer = $('<div />').addClass('col-xs-6 col-md-4 site-identification-popup-content-download-link'),
							$annualLoadGraphsLink = $('<a />').addClass(loadGraphLinkClass).addClass(annualLoadGraphLinkClass),
							$mayLoadGraphsLink = $('<a />').addClass(loadGraphLinkClass).addClass(mayLoadGraphLinkClass),
							$summaryGraphsLink = $('<a />').append($('<span />').addClass('glyphicon glyphicon-th-list'),' Summary Graphs'),
							$detailedGraphsLink = $('<a />').append($('<span />').addClass('glyphicon glyphicon-stats'), ' Detailed Graphs'),
							$downloadLink = $('<a />').append($('<span />').addClass('glyphicon glyphicon-save'),' Download Data'),
							$hiddenAutoFocus = $('<span />').addClass('hidden').attr('autofocus', ''),
							data = feature.data,
							title = data.staname,
							id = data.siteid;
						$mayLoadGraphsLink.data('feature', feature);
						$mayLoadGraphsLink.append($('<span />').addClass('glyphicon glyphicon-stats'),' May Load');
						$annualLoadGraphsLink.data('feature', feature);
						$annualLoadGraphsLink.append($('<span />').addClass('glyphicon glyphicon-stats'),' Annual Load');
						
						$titleRow.html(title);
						
						$annualLoadGraphsLink.
							attr('href', '#').
							click('click', makeGraphClickHandler('annual', feature, filtersSubject.mostRecentNotification.chemical));
						$mayLoadGraphsLink.
							attr('href', '#').
							on('click', makeGraphClickHandler('may', feature, filtersSubject.mostRecentNotification.chemical));
						$summaryGraphsLink.attr('href', CONFIG.baseUrl + 'site/' + id + '/summary-report');
						$detailedGraphsLink.attr('href',CONFIG.baseUrl + 'site/' + id + '/full-report');
						$downloadLink.attr('href', '#');
						
						$annualLoadGraphsLinkContainer.append($annualLoadGraphsLink);
						$mayLoadGraphsLinkContainer.append($mayLoadGraphsLink);
						$summaryGraphsLinkContainer.append($summaryGraphsLink);
						$detailedGraphsLinkContainer.append($detailedGraphsLink);
						$downloadLinkContainer.append($downloadLink);
						
						$reportsAndGraphsRow.append($summaryGraphsLinkContainer, $detailedGraphsLinkContainer, $downloadLinkContainer, $annualLoadGraphsLinkContainer, $mayLoadGraphsLinkContainer, $hiddenAutoFocus);
						
						$container.append($titleRow);
						if(!virtualSite){
							var $stationIdRow = $('<div />').addClass('row site-identification-popup-content-station-id');
							$stationIdRow.html('Station ID: ' + id);
							$container.append($stationIdRow);
						}
						$container.append($reportsAndGraphsRow);
						this.$container = $container;
						return $container;
					}
				});
			
			//We don't store a reference to this observer because we don't need it to unobserve the filters subject later;
			//the controls are created once on page load and are not destroyed except when leaving the page.
			//Observers will not persist between page loads, so no cleanup needed!
			filtersSubject.observe(function(filtersState){
				var linkParent = $('#' + control.siteIdentificationPopupContainerId);
				control.updateConstituent(filtersState.chemical, linkParent);
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
	
	var leftFiltersName = '.left_filter';
	var leftFilters = $(leftFiltersName);
	var rightFiltersName = '.right_filter';
	var rightFilters= $(rightFiltersName);
	
	nar.mississippi.createLoadSelect(leftMap, leftFilters);
	nar.mississippi.createLoadSelect(rightMap, rightFilters);
	
	var leftFiltersSubject = new nar.mississippi.FiltersSubject(leftFilters);
	var rightFiltersSubject = new nar.mississippi.FiltersSubject(rightFilters);
	
	// Now that the layers are in the map, I want to add the identification
	// control for them
	rightSiteIdentificationControl = createSiteIdentificationControl({
		layer : rightMarbLayer,
		popupAnchor : '#' + rightMapName,
		width : rightMap.size.w,
		graphContainer : '#' + leftMapName,
		filtersSubject: rightFiltersSubject
	});
	
	leftSiteIdentificationControl = createSiteIdentificationControl({
		layer : leftMarbLayer,
		popupAnchor : '#' + leftMapName,
		width : leftMap.size.w,
		graphContainer : '#' + rightMapName,
		filtersSubject: leftFiltersSubject,
	});
	
	rightFakeSiteIdentificationControl = createSiteIdentificationControl({
		popupAnchor : '#' + rightMapName,
		layer : rightFakeLayer,
		width : rightMap.size.w,
		graphContainer : '#' + leftMapName,
		filtersSubject: rightFiltersSubject,
		virtualSite: true
	});
	
	leftFakeSiteIdentificationControl = createSiteIdentificationControl({
		popupAnchor :  '#' + leftMapName,
		layer : leftFakeLayer,
		width : leftMap.size.w,
		graphContainer : '#' + rightMapName,
		filtersSubject: leftFiltersSubject,
		virtualSite: true
	});
	
	rightMap.addControls([rightSiteIdentificationControl, rightFakeSiteIdentificationControl]);
	leftMap.addControls([leftSiteIdentificationControl, leftFakeSiteIdentificationControl]);
});