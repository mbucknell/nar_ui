var nar = nar || {};
nar.coastal = nar.coastal || {};

nar.coastal.map = (function() {
	"use strict";
	
	var GEOSERVER_URL = CONFIG.endpoint.geoserver + 'NAR/wms';
	var me = {};
	
	me.mapUS48Extent = new OpenLayers.Bounds(-136.5, 20.7, -66.4, 53.2).transform(nar.commons.map.geographicProjection, nar.commons.map.projection);
	me.mapUS48Center = me.mapUS48Extent.getCenterLonLat();
	
	me.alaskaExtent = new OpenLayers.Bounds(-175.0, 55.0, -135.0, 71.0).transform(nar.commons.map.geographicProjection, nar.commons.map.projection);
	me.alaskaCenter = me.alaskaExtent.getCenterLonLat();
	
	me.createBaseLayer = function() {
		return new OpenLayers.Layer.XYZ(
				"World Topo Map",
				"http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${y}/${x}",
				{
					sphericalMercator : true,
					layers: "0",
					isBaseLayer : true,
					units : "m",
					buffer : 3,
				}
		);		
	};
	
	me.createBasinLayer = function() {
		return new OpenLayers.Layer.WMS(
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
			}
		);
	};
	
	me.createSitesLayer = function() {
		return new OpenLayers.Layer.WMS(
			"Sites",
			GEOSERVER_URL,
			{
				layers : 'NAR:JD_NFSN_sites',
				transparent : true,
				styles: 'triangles13',
				'CQL_FILTER' : "site_type = 'Coastal Rivers'"
			}, {
				isBaseLayer : false,
				singleTile : true
			}
		);
	};
	
	me.defaultMapOptions = {
			projection : nar.commons.map.projection,
			theme : nar.commons.map.theme,
	};
	
	me.createDefaultUSMapOptions = function() {
		return Object.merge(me.defaultMapOptions, {
			restrictedExtent : me.mapUS48Extent,
			maxExtent : me.mapUS48Extent,
			maxResolution: 8041.067668,
			controls : [
						new OpenLayers.Control.ScaleLine({
							geodesic: true
						}),
						new OpenLayers.Control.Navigation(),
						new OpenLayers.Control.Zoom()
					],
			layers : [
			          me.createBaseLayer(),
			          new OpenLayers.Layer.WMS(
			        		  "Lower 48",
			        		  GEOSERVER_URL,
			        		  {
			        			  layers:'NAR:statesl48_alb',
			        			  transparent: true,
			        			  styles : 'ms_grey_outline'
			        		  },{
			        			  visibility : false,
			        			  isBaseLayer: false
			        		  }
			          ),
			          new OpenLayers.Layer.WMS(
			        		  'Major Streams',
			        		  GEOSERVER_URL,
			        		  {
			        			  layers: 'NAR:USA48_major_alb',
			        			  transparent: true,
			        			  styles : 'streams'
			        		  },
			        		  {
			        			  isBaseLayer : false
			        		  }
			          ),
			          me.createBasinLayer(),
			          me.createSitesLayer()
			         ]
		});
	};
	
	me.createDefaultAlaskaMapOptions = function() {
		return Object.merge(me.defaultMapOptions, {
			extent : me.alaskaExtent,
			restrictedExtent : me.alaskaExtent,
			maxExtent : me.alaskaExtent,
			maxResolution : 10000.0,
			projection : nar.commons.map.projection,
			controls : [
					new OpenLayers.Control.ScaleLine({
						geodesic : true
					}),
			],
			layers : [
		          me.createBaseLayer(),
		          new OpenLayers.Layer.WMS(
	        		  "Alaska",
		        		  GEOSERVER_URL,
		        		  {
		        			  layers : 'NAR:AK_AKalb',
		        			  transparent : true,
		        			  styles: 'ms_grey_outline',
		        		  }, {
		        			  visibility : false,
		        			  isBaseLayer : false,
		        			
	        		  }
		          ),
		          new OpenLayers.Layer.WMS(
		        		  "Alaska Major Streams",
		        		  GEOSERVER_URL,
		        		  {
		        			  layers: 'NAR:AK_major_AKalb',
		        			  transparent : true,
		        			  styles : 'streams'
		        		  },
		        		  {
		        			  isBaseLayer : false,
		        		  }
		          ),
			          me.createBasinLayer(),
			          me.createSitesLayer(),
		]
		});
	};
	
	me.createUS48Map = function(mapDiv) {
		var map = new OpenLayers.Map(mapDiv, me.createDefaultUSMapOptions());
		map.zoomToExtent(me.mapUS48Extent, false);
		return map;
	};
	
	me.createAlaskaMap = function(mapDiv) {
		var map = new OpenLayers.Map(mapDiv, me.createDefaultAlaskaMapOptions());
		//map.setCenter(me.alaskaCenter, 3, true, true);
		//var level = map.getZoomForExtent(me.alaskaExtent)
		//map.zoomTo(map.getZoomForExtent(me.alaskaExtent))
		map.zoomToExtent(me.alaskaExtent, true);
	};
	
	return {
		createUS48Map : function(mapDiv) {
			return me.createUS48Map.call(me, mapDiv);
		},
		createAlaskaMap : function(mapDiv) {
			return me.createAlaskaMap.call(me, mapDiv);
		}
	};
	
}());