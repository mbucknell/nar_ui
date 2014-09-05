var nar = nar || {};
nar.mississippi = nar.mississippi || {};
nar.mississippi.createLoadSelect = function(map, filterDiv) {
	var loadLayer = new OpenLayers.Layer.WMS(
		'Nutrient Load',
		CONFIG.endpoint.geoserver + 'NAR/wms',
		{
			transparent : true,
		},
		{
			isBaseLayer : false
		}
	);
	
	var mapHasLayer = function() {
		return (map.getLayersByName('Nutrient Load').length > 0);
	}
	
	var loadSelect = filterDiv.find('select[name="load"]');
	var chemicalSelect = filterDiv.find('select[name="chemical"]');
	var yearSelect = filterDiv.find('select[name="year"]');
	
	// Enable year types to match the selected load
	loadSelect.change(function() {
		var yearType = $(this).find('option:selected').data('year');
		var rangeYearOptions = yearSelect.find('option[data-is-range="True"]');
		var discreteYearOptions = yearSelect.find('option[data-is-range="False"]');
		
		if (yearType === 'range') {
			rangeYearOptions.removeAttr('disabled');
			discreteYearOptions.attr('disabled', 'disabled');
			if (yearSelect.find('option:selected').data('is-range') === 'False') {
				yearSelect.val('');
			}
		}
		else {
			rangeYearOptions.attr('disabled', 'disabled');
			discreteYearOptions.removeAttr('disabled');
			if (yearSelect.find('option:selected').data('is-range') === 'True') {
				yearSelect.val('');
			}
		}
		
	});
	
	filterDiv.find('select').change(function() {
		var load = loadSelect.val().split('_');
		var chemical = chemicalSelect.val();
		var year = yearSelect.val();
		if (load.length > 0 && chemical && year) {
			loadLayer.mergeNewParams({
				layers : 'NAR:missrivout_' + year,
				styles : chemical + '_' + load[load.length - 1]
			});
			if (!mapHasLayer()) {
				map.addLayer(loadLayer);
			}
		}
		else if (mapHasLayer()) {
			map.removeLayer(loadLayer);
		}
	});
		
};