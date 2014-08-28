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
	
	nar.mississippi.map.createMap({
		div : document.getElementById('left-map')
	});
	nar.mississippi.map.createMap({
		div : document.getElementById('right-map')
	});
});