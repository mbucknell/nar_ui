var nar = nar || {};
nar.coastalRegion = nar.coastalRegion || {};

nar.coastalRegion.map = (function() {
	var me = {};
	var GEOSERVER_URL = CONFIG.endpoint.geoserver + 'NAR/wms';
	var REGION_LAYER = {
			northeast : {inset : 'ne_inset', streams : 'ne_streams', labels : 'ne_streamnames'},
			southeast : {inset : 'se_inset', streams : 'se_streams', labels : 'se_streamnames'},
			gulf : {inset : 'gulf_inset', streams : 'gulf_streams', labels : 'gulf_streamnames'},
			west : {inset : 'west_inset', streams : 'west_streams', labels : 'west_streamnames'},
			alaska : {inset : 'westAKonly_inset', streams : 'westAKonly_streams', labels : 'westAKonly_streamnames'}
	};
	var NAR_NS = 'NAR:';
	
	var getFeatureBoundingBox = $.Deferred();
	
	OpenLayers.Request.GET({
		url: CONFIG.endpoint.geoserver + 'NAR/wfs',
		params : {
			service: 'wfs',
			version: '1.1.0',
			request: 'GetCapabilities'	
		},
		callback : function(request) {
			var format = new OpenLayers.Format.WFSCapabilities.v1_1_0();
			var response = format.read(request.responseXML);
			response.featureTypeList.featureTypes.forEach(function(f) {
				if (f.name === REGION_LAYER[CONFIG.region].inset) {
					getFeatureBoundingBox.resolve(f.bounds);
					return false;
				}
			});

		},
		failure : function() {
			getFeatureBoundingBox.reject();
		}
	});
	
	var mapUSExtent = new OpenLayers.Bounds(-175.0, 20.7, -66.4, 71.0).transform(nar.commons.map.geographicProjection, nar.commons.map.projection);

	var createStatesBaseLayer = function() {
		return new OpenLayers.Layer.WMS(
				"United States",
				GEOSERVER_URL,
				{
					layers : NAR_NS + 'statesl48_alb',
					transparent : true,
					styles : 'ms_grey_outline'
				},
				{
					isBaseLayer : true
				}
		);
	};
	
	var createAlaskaOutlineLayer = function() {
		return new OpenLayers.Layer.WMS(
				"Alaska",
				GEOSERVER_URL,
				{
					layers : NAR_NS + 'ak_alb',
					transparent : true,
					styles : 'ms_grey_outline'
				},
				{
					isBaseLayer : false
				}
		);
	};
	
	var createSitesLayer = function() {
		return new OpenLayers.Layer.WMS(
			"Sites",
			GEOSERVER_URL,
			{
				layers : NAR_NS + 'JD_NFSN_sites',
				transparent : true,
				styles: 'sites13_with_names',
				'CQL_FILTER' : "site_type = 'Coastal Rivers'"
			}, {
				isBaseLayer : false,
				singleTile : true
			}
		);
	};
	
	var createBasinLayers = function() {
		return [
	        new OpenLayers.Layer.WMS(
	        		CONFIG.region + ' Basin',
					GEOSERVER_URL,
					{
						layers: NAR_NS + REGION_LAYER[CONFIG.region].inset,
						transparent: true,
						styles : 'coastal_basins'
					},
					{
						isBaseLayer : false,
						singleTile : true
					}
	        ),
	        new OpenLayers.Layer.WMS(
					CONFIG.region + ' Streams',
					GEOSERVER_URL,
					{
						layers: NAR_NS + REGION_LAYER[CONFIG.region].streams,
						transparent : true,
						styles : 'streams'
					},
					{
						isBaseLayer : false,
						singleTile : true
					}
			),
			new OpenLayers.Layer.WMS(
					CONFIG.region + 'Stream Names',
					GEOSERVER_URL,
					{
						layers: NAR_NS + REGION_LAYER[CONFIG.region].labels,
						transparent : true,
						styles : 'stream_names'
					},
					{
						isBaseLayer : false,
						singleTile : true
					}
			)
	        ];
	};
	
	var createAlaskaBasinLayers = function() {
		return [
		        new OpenLayers.Layer.WMS(
		        		'Alaska Basin',
						GEOSERVER_URL,
						{
							layers: NAR_NS + REGION_LAYER.alaska.inset,
							transparent: true,
							styles : 'coastal_basins'
						},
						{
							isBaseLayer : false,
							singleTile : true
						}
		        		
		        ),
		        new OpenLayers.Layer.WMS(
						'Alaska Streams',
						GEOSERVER_URL,
						{
							layers: NAR_NS + REGION_LAYER.alaska.streams,
							transparent : true,
							styles : 'streams'
						},
						{
							isBaseLayer : false,
							singleTile : true
						}
				),
				new OpenLayers.Layer.WMS(
						CONFIG.region + 'Stream Names',
						GEOSERVER_URL,
						{
							layers: NAR_NS + REGION_LAYER.alaska.labels,
							transparent : true,
							styles : 'stream_names'
						},
						{
							isBaseLayer : false,
							singleTile : true
						}
				)
		        ];
	};
		
	var createDefaultMapOptions = function() {
		return {
			projection : nar.commons.map.projection,
			theme : nar.commons.map.theme,
			restrictedExtent : mapUSExtent,
			maxExtent : mapUSExtent,
			controls : [new OpenLayers.Control.Navigation(), new OpenLayers.Control.Zoom()],
			layers : [createStatesBaseLayer()].concat(createBasinLayers()).concat([createSitesLayer()])
		};
	};
	
	me.createRegionMap = function(mapDiv) {
		var map = new OpenLayers.Map(mapDiv, createDefaultMapOptions());
		if (CONFIG.region === 'west') {
			map.addLayer(createAlaskaOutlineLayer());
			map.addLayers(createAlaskaBasinLayers());
		}
		map.zoomToExtent(mapUSExtent);

		getFeatureBoundingBox.then(function(extent) {
			map.zoomToExtent(extent.transform(nar.commons.map.geographicProjection, nar.commons.map.projection));
		});		
		return map;
	};
	
	return {
		createRegionMap : function(mapDiv) {
			return me.createRegionMap.call(me, mapDiv);
		}
	};
	
}());