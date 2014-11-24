var nar = nar || {};
nar.coastalRegion = nar.coastalRegion || {};

nar.coastalRegion.map = function(geoserverEndpoint, region) {
	var me = {};
	
	var WMS_URL = geoserverEndpoint + 'NAR/wms';
	var WFS_URL = geoserverEndpoint + 'NAR/wfs';
	
	var REGION_LAYER = {
			northeast : {inset : 'ne_inset', streams : 'ne_streams', labels : 'ne_streamnames'},
			southeast : {inset : 'se_inset', streams : 'se_streams', labels : 'se_streamnames'},
			gulf : {inset : 'gulf_inset', streams : 'gulf_streams', labels : 'gulf_streamnames'},
			west : {inset : 'west_inset', streams : 'west_streams', labels : 'west_streamnames'},
			alaska : {inset : 'westAKonly_inset', streams : 'westAKonly_streams', labels : 'westAKonly_streamnames'}
	};
	var NAR_NS = 'NAR:';
	
	var ALASKA_EXTENT = new OpenLayers.Bounds(-175.0, 55.0, -135.0, 71.0).transform(nar.commons.map.geographicProjection, nar.commons.map.projection);
	
	var getFeatureBoundingBox = $.Deferred();
	
	OpenLayers.Request.GET({
		url: WFS_URL,
		params : {
			service: 'wfs',
			version: '1.1.0',
			request: 'GetCapabilities'	
		},
		callback : function(request) {
			var format = new OpenLayers.Format.WFSCapabilities.v1_1_0();
			var response = format.read(request.responseXML);
			response.featureTypeList.featureTypes.forEach(function(f) {
				if (f.name === REGION_LAYER[region].inset) {
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
				WMS_URL,
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
				WMS_URL,
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
			WMS_URL,
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
	        		region + ' Basin',
					WMS_URL,
					{
						layers: NAR_NS + REGION_LAYER[region].inset,
						transparent: true,
						styles : 'coastal_basins'
					},
					{
						isBaseLayer : false,
						singleTile : true
					}
	        ),
	        //TODO add estuaries when available
	        ];
	};
	
	var createAlaskaBasinLayers = function() {
		return [
		        new OpenLayers.Layer.WMS(
		        		'Alaska Basin',
						WMS_URL,
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
						WMS_URL,
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
						'Alaska Stream Names',
						WMS_URL,
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
	
	var createDefaultAlaskaMapOptions = function() {
		return {
			projection : nar.commons.map.projection,
			theme : nar.commons.map.theme,
			restrictedExtent : ALASKA_EXTENT,
			maxExtent : ALASKA_EXTENT,
			controls : [new OpenLayers.Control.Navigation(), new OpenLayers.Control.Zoom()],
			layers : [createStatesBaseLayer()].concat([createAlaskaOutlineLayer()]).concat(createAlaskaBasinLayers()).concat([createSitesLayer()])
		};
	};
	
	me.createRegionMap = function(mapDiv, akInsetMapDiv) {
		var map = new OpenLayers.Map(mapDiv, createDefaultMapOptions());
		var akMap;
		if (region === 'west') {
			$('#' + akInsetMapDiv).show();
			akMap = new OpenLayers.Map(akInsetMapDiv, createDefaultAlaskaMapOptions());
			akMap.zoomToExtent(ALASKA_EXTENT);
		}
		else { // Make sure inset map is not visible
			$('#' + akInsetMapDiv).hide();
		}
		map.zoomToExtent(mapUSExtent);

		getFeatureBoundingBox.then(function(extent) {
			map.zoomToExtent(extent.transform(nar.commons.map.geographicProjection, nar.commons.map.projection));
		});		
		return map;
	};
	
	/*
	 * @param {Array of String} properties - name of properties to retrieve. If not specified will retrieve all properties
	 * @return promise which when successfully resolved returns the list of features.
	 */
	me.getBasinFeatureInfoPromise = function(properties) {
		var deferred = $.Deferred();
		
		if (!properties) {
			properties = [];
		}
		
		OpenLayers.Request.GET({
			url: WFS_URL,
			params : {
				service: 'wfs',
				version: '1.1.0',
				request: 'GetFeature',
				typeNames : NAR_NS + REGION_LAYER[region].inset,
				propertyName : properties.join(',')
			},
			callback : function(response) {
				var gmlReader = new OpenLayers.Format.GML.v3();
				deferred.resolve(gmlReader.read(response.responseXML));
			},
			error : function () {
				deferred.reject();
			}
		});
		return deferred;
	};
	
	return me;
};
