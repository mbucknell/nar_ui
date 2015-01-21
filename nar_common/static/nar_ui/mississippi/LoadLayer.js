var nar = nar || {};
nar.mississippi = nar.mississippi || {};

/*
 * @returns object with functions, addToMap and updateLayer.
 */
nar.mississippi.LoadLayer = function() {
	var self = this;
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
	
	self.addToMap = function(map) {
		map.addLayer(loadLayer);
	};
	
	self.updateLayer = function(data) {
		if (data.load && data.chemical && data.year) {
			loadLayer.mergeNewParams({
				layers : 'NAR:missrivout_' + data.year,
				styles : data.chemical + '_' + data.load
			});
			loadLayer.setVisibility(true);
		}
		else {
			loadLayer.setVisibility(false);
		}		
	};
	
	return self;
};