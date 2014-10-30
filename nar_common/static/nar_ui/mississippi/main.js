$(document).ready(function() {
	"use strict";
	
	var updateContributionDisplay = function(containerSelector, placement, selections) {
		if (selections.parameter_type && selections.constituent && selections.water_year) {
			nar.ContributionDisplay.create({
				containerSelector : containerSelector,
				placement : placement,
				parameters : selections,
				width : 200,
				height : 200
			});
		}
		else {
			nar.ContributionDisplay.remove(containerSelector);
		}
	};
	
	var updateLeftContributionDisplay = function(selections) {
		updateContributionDisplay ('#left-pie-chart-container', 'bl', selections);
	};
	
	var updateRightContributionDisplay = function(selections) {
		updateContributionDisplay('#right-pie-chart-container', 'br', selections);
	};
	
	$('#link-chart-contribution').on('click', function () {
		var loadTypeSelectCtrls = $('select[name="load"]'),
			nutrientTypeSelectCtrls = $('select[name="chemical"]'),
			yearRangeSelectCtrls = $('select[name="year"]'),
			leftSelections = {
				parameter_type : loadTypeSelectCtrls[0].value.split('_').last(),
				constituent : nutrientTypeSelectCtrls[0].value,
				water_year : yearRangeSelectCtrls[0].value
			},
			rightSelections = {
				parameter_type : loadTypeSelectCtrls[1].value.split('_').last(),
				constituent : nutrientTypeSelectCtrls[1].value,
				water_year : yearRangeSelectCtrls[1].value
			};
		updateLeftContributionDisplay (leftSelections);
		updateRightContributionDisplay(rightSelections);
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
						visibility : false,
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
						isBaseLayer : false,
						visibility : false
					});
		},
		createSiteIdentificationControl = function (args) {
			var layer = args.layer,
				popupAnchor = args.popupAnchor,
				width = args.width,
				graphContainer = args.graphContainer,
				filtersSubject = args.filtersSubject,
				virtualSite = args.virtualSite || false,//is it a virtual site or a physical site
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
							width : width,
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
							$annualLoadGraphsLinkContainer = $('<div />').addClass('col-xs-6 col-md-4 col-md-offset-2 site-identification-popup-content-annual-load-link'),
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
							id = virtualSite ? 'GULF': data.siteid,
							loadGraphData = {staname : title, siteId : id, isVirtual : virtualSite};
						$mayLoadGraphsLink.data('feature', feature);
						$mayLoadGraphsLink.append($('<span />').addClass('glyphicon glyphicon-stats'),' May Load');
						$annualLoadGraphsLink.data('feature', feature);
						$annualLoadGraphsLink.append($('<span />').addClass('glyphicon glyphicon-stats'),' Annual Load');
						
						$titleRow.html(title);
						
						$annualLoadGraphsLink.
							attr('href', '#').
							click('click', makeGraphClickHandler('annual', loadGraphData, filtersSubject.mostRecentNotification.chemical));
						$mayLoadGraphsLink.
							attr('href', '#').
							on('click', makeGraphClickHandler('may', loadGraphData, filtersSubject.mostRecentNotification.chemical));
						$summaryGraphsLink.attr('href', CONFIG.baseUrl + 'site/' + id + '/summary-report');
						$detailedGraphsLink.attr('href',CONFIG.baseUrl + 'site/' + id + '/full-report');
						$downloadLink.attr('href', CONFIG.baseUrl + 'download');
						
						$annualLoadGraphsLinkContainer.append($annualLoadGraphsLink);
						$mayLoadGraphsLinkContainer.append($mayLoadGraphsLink);
						$downloadLinkContainer.append($downloadLink);

						if (virtualSite) {
							$annualLoadGraphsLinkContainer.removeClass('col-md-offset-2');
							$reportsAndGraphsRow.append($annualLoadGraphsLinkContainer, $mayLoadGraphsLinkContainer, $downloadLinkContainer, $hiddenAutoFocus);
						}
						else {
							$summaryGraphsLinkContainer.append($summaryGraphsLink);
							$detailedGraphsLinkContainer.append($detailedGraphsLink);
							$reportsAndGraphsRow.append($summaryGraphsLinkContainer, $detailedGraphsLinkContainer, $downloadLinkContainer, $annualLoadGraphsLinkContainer, $mayLoadGraphsLinkContainer, $hiddenAutoFocus);
						}
						
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
		
	var leftFiltersName = '.left_filter';
	var leftFilters = $(leftFiltersName);
	var rightFiltersName = '.right_filter';
	var rightFilters= $(rightFiltersName);
	
	nar.mississippi.createLoadSelect(leftMap, leftFilters, function(selections) {
		if (nar.ContributionDisplay.isVisible('#left-pie-chart-container')) {
			updateLeftContributionDisplay(selections);
		}
	});
	nar.mississippi.createLoadSelect(rightMap, rightFilters, function(selections) {
		if (nar.ContributionDisplay.isVisible('#right-pie-chart-container')) {
			updateRightContributionDisplay(selections);
		}
	});
	
	var leftFiltersSubject = new nar.mississippi.FiltersSubject(leftFilters);
	var rightFiltersSubject = new nar.mississippi.FiltersSubject(rightFilters);
	
	// Default the selection menu
	leftFilters.find('option[value="long_term_wy"]').attr('selected', 'selected');
	leftFilters.find('option[value="no23"]').attr('selected', 'selected');
	leftFilters.find('option[value="1993_2012"]').attr('selected', 'selected');
	leftFilters.find(':input').change();
	
	rightFilters.find('option[value="wy"]').attr('selected', 'selected');
	rightFilters.find('option[value="no23"]').attr('selected', 'selected');
	rightFilters.find('option[value="2013"]').attr('selected', 'selected');
	rightFilters.find(':input').change();
	
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
	
	// Add the site layers to the map
	leftMap.addLayers([leftMarbLayer,leftFakeLayer]);
	rightMap.addLayers([rightMarbLayer,rightFakeLayer]);
	
	// Init sites layer toggle to off.
	var $msInfo = $('#mississippi_info');
	var $toggle = $('#toggle');
	$msInfo.hide();
	$toggle.attr('title', 'Show');
	
	$toggle.click(function() {
		$msInfo.toggle('5000', function() {
			var on = $(this).is(':visible');
			leftMarbLayer.setVisibility(on);
			leftFakeLayer.setVisibility(on);
			rightMarbLayer.setVisibility(on);
			rightFakeLayer.setVisibility(on);
			if (on) {
				$toggle.attr('title', 'Hide');
			} else {
				$toggle.attr('title', 'Show');
			}
		});
	});
	
});