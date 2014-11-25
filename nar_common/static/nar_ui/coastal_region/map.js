var nar = nar || {};
nar.coastalRegion = nar.coastalRegion || {};

nar.coastalRegion.map = function(geoserverEndpoint, region) {
	var me = {};
	
	var WMS_URL = geoserverEndpoint + 'NAR/wms';
	var WFS_URL = geoserverEndpoint + 'NAR/wfs';
		
	var REGION = {
			northeast : {
				inset : 'ne_inset', 
				streams : 'ne_streams', 
				labels : 'ne_streamnames',
				extent : new OpenLayers.Bounds(-81.0, 37.5,  -70.5, 46.0).transform(nar.commons.map.geographicProjection, nar.commons.map.projection),
				resolution : 2500
			},
			southeast : {
				inset : 'se_inset', 
				streams : 'se_streams', 
				labels : 'se_streamnames',
				extent : new OpenLayers.Bounds(-85.0, 31.0, -79.0, 35.0).transform(nar.commons.map.geographicProjection, nar.commons.map.projection),
				resolution: 1250
			},
			gulf : {
				inset : 'gulf_inset', 
				streams : 'gulf_streams', 
				labels : 'gulf_streamnames',
				resolution: 8000,
				extent : new OpenLayers.Bounds(-115.0, 24.5, -77.0, 50.5).transform(nar.commons.map.geographicProjection, nar.commons.map.projection),
			},
			west : {
				inset : 'west_inset', 
				streams : 'west_streams',
				labels : 'west_streamnames',
				extent : new OpenLayers.Bounds(-138.0, 26.0, -104.0, 53.5).transform(nar.commons.map.geographicProjection, nar.commons.map.projection),
				resolution: 7100
			},
			alaska : {
				inset : 'westAKonly_inset', 
				streams : 'westAKonly_streams', 
				labels : 'westAKonly_streamnames',
				extent : new OpenLayers.Bounds(-175.0, 55.0, -135.0, 71.0).transform(nar.commons.map.geographicProjection, nar.commons.map.projection),
				resolution: 8000
			}
	};
	var NAR_NS = 'NAR:';
	
	var ALASKA_EXTENT = new OpenLayers.Bounds(-175.0, 55.0, -135.0, 71.0).transform(nar.commons.map.geographicProjection, nar.commons.map.projection);
	
	var getFeatureBoundingBox = $.Deferred();
	
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
						layers: NAR_NS + REGION[region].inset,
						transparent: true,
						styles : 'coastal_basins'
					},
					{
						isBaseLayer : false,
						singleTile : true
					}
	        ),
	        new OpenLayers.Layer.WMS(
	        		region + ' Basin',
					WMS_URL,
					{
						layers: NAR_NS + REGION[region].streams,
						transparent: true,
						styles : 'streams'
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
							layers: NAR_NS + REGION.alaska.inset,
							transparent: true,
							styles : 'coastal_basins'
						},
						{
							isBaseLayer : false,
							singleTile : true
						}
		        		
		        ),
		        new OpenLayers.Layer.WMS(
		        		region + ' Basin',
						WMS_URL,
						{
							layers: NAR_NS + REGION.alaska.streams,
							transparent: true,
							styles : 'streams'
						},
						{
							isBaseLayer : false,
							singleTile : true
						}
				),
		        //TODO add estuaries when available
		        ];
	};
		
	var createDefaultMapOptions = function() {
		return {
			projection : nar.commons.map.projection,
			theme : nar.commons.map.theme,
			restrictedExtent : REGION[region].extent,
			maxExtent : REGION[region].extent,
			maxResolution: REGION[region].resolution,
			controls : [],
			layers : [createStatesBaseLayer()].concat(createBasinLayers()).concat([createSitesLayer()])
		};
	};
	
	var createDefaultAlaskaMapOptions = function() {
		return {
			projection : nar.commons.map.projection,
			theme : nar.commons.map.theme,
			restrictedExtent : REGION.alaska.extent,
			maxExtent : REGION.alaska.extent,
			controls : [],
			layers : [createStatesBaseLayer()].concat([createAlaskaOutlineLayer()]).concat(createAlaskaBasinLayers()).concat([createSitesLayer()])
		};
	};
	
	me.createRegionMap = function(mapDiv, akInsetMapDiv) {
		var map = new OpenLayers.Map(mapDiv, createDefaultMapOptions());
		var akMap;
		if (region === 'west') {
			$('#' + akInsetMapDiv).parent().show();
			akMap = new OpenLayers.Map(akInsetMapDiv, createDefaultAlaskaMapOptions());
			akMap.zoomToExtent(REGION.alaska.extent);
		}
		else { // Make sure inset map is not visible
			$('#' + akInsetMapDiv).parent().hide();
		}
		map.zoomToExtent(REGION[region].extent);
			
		return map;
	};
	
	/*
	 * @param {Array of String} properties - name of properties to retrieve. If not specified will retrieve all properties
	 * @return promise which when successful resolved returns the list of features.
	 */
	me.getBasinFeatureInfoPromise = function(properties) {
		var regionDeferred = $.Deferred();
		var alaskaDeferred = $.Deferred();
		
		var deferred = $.Deferred();
		
		if (!properties) {
			properties = [];
		}
		
		$.ajax({
			url: WFS_URL,
			method: 'GET',
			data : {
				service: 'wfs',
				version: '1.1.0',
				dataType: 'text',
				request: 'GetFeature',
				typeNames : NAR_NS + REGION[region].inset,
				propertyName : properties.join(',')
			},
			success : function(response) {
				var gmlReader = new OpenLayers.Format.GML.v3();
				regionDeferred.resolve(gmlReader.read(response));
			},
			error : function () {
				regionDeferred.reject();
			}
		});
		
		if (region === 'west') {
			alaskaDeferred = $.Deferred();
			$.ajax({
				url: WFS_URL,
				method: 'GET',
				data : {
					service: 'wfs',
					version: '1.1.0',
					dataType: 'text',
					request: 'GetFeature',
					typeNames : NAR_NS + REGION.alaska.inset,
					propertyName : properties.join(',')
				},
				success : function(response) {
					var gmlReader = new OpenLayers.Format.GML.v3();
					alaskaDeferred.resolve(gmlReader.read(response));
				},
				error : function () {
					alaskaDeferred.reject();
				}
			});
		}
		else {
			alaskaDeferred.resolve([]);
		}
		
		$.when(regionDeferred, alaskaDeferred).then(function(f1, f2) {
			deferred.resolve(f1.concat(f2));
		}).fail(function() {
			deferred.reject();
		});
		
		return deferred;
	};
	
	return me;
};
