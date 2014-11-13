var nar = nar || {};
nar.coastal = nar.coastal || {};

nar.coastal.map = (function() {
	"use strict";
	var GEOSERVER_URL = CONFIG.endpoint.geoserver + 'NAR/wms';
	var me = {};
	me.extent = new OpenLayers.Bounds(-127.5, 22.0, -63.0, 55.0).transform(nar.commons.map.geographicProjection, nar.commons.map.projection);
	me.center = me.extent.getCenterLonLat();
	
	me.createDefaultOptions = function() {
		return {
			projection : nar.commons.map.projection,
			restrictedExtent : me.extent,
			maxExtent : me.extent,
			maxResolution: 9041.067668,
			theme : nar.commons.map.them,
			controls : [
				new OpenLayers.Control.ScaleLine({
					geodesic: true
				}),
				new OpenLayers.Control.Navigation(),
				new OpenLayers.Control.MousePosition({displayProjection: nar.commons.map.geographicProjection}),
				new OpenLayers.Control.Zoom()
			],
			layers : [
				new OpenLayers.Layer.WMS(
						"Lower 48",
						GEOSERVER_URL,
						{
							layers:'NAR:statesl48_alb',
							transparent: true,
							styles : 'ms_grey_outline'
						},{
							isBaseLayer: true
						}),
				new OpenLayers.Layer.WMS(
						'Coastal Basins',
						GEOSERVER_URL,
						{
							layers: 'NAR:all_coast_bas',
							transparent : true,
							styles: 'coastal_basins'
						},
						{
							isBaseLayer : false,
							singleTile : true
						}),
				new OpenLayers.Layer.WMS(
						"Sites",
						GEOSERVER_URL,
						{
							layers : 'NAR:JD_NFSN_sites',
							transparent : true,
							styles: 'triangles',
							'CQL_FILTER' : "site_type = 'Coastal Rivers'"
						}, {
							isBaseLayer : false,
							singleTile : true
						})
			]
		};
						
	};
	
	me.createMap = function(mapDiv) {
		var map = new OpenLayers.Map(mapDiv, me.createDefaultOptions());
		map.zoomToExtent(me.extent, false);
		return map;
	};
	
	return {
		createMap : function(mapDiv) {
			return me.createMap.call(me, mapDiv);
		}
	};
	
	
	
}());