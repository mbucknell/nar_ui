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
	});
	var rightMap = nar.mississippi.map.createMap({
		div : document.getElementById('right-map')
	});
	
	// Add the MARB and FAKE layers to the secondary map
	var marbLayer = new OpenLayers.Layer.WMS(
			"MARB",
			CONFIG.endpoint.geoserver + 'NAR/wms',
			{
				layers : 'NAR:NAWQA100_cy3fsmn',
				transparent : true
			}, {
				isBaseLayer : false
			}),
		fakeLayer = new OpenLayers.Layer.WMS(
			"FAKE",
			CONFIG.endpoint.geoserver + 'NAR/wms',
			{
				layers : 'NAR:MS_ATCH_delta',
				transparent : true
			}, {
				isBaseLayer : false
			});
	
	// Filter only for MARB sites on the marb layer
	marbLayer.mergeNewParams({
		'CQL_FILTER' : "type = 'MARB'"
	});
	
	rightMap.addLayers([marbLayer,fakeLayer]);
});