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
	
	var getBoundingBoxPromise = $.ajax({
		url: CONFIG.endpoint.geoserver + 'NAR/wfs',
		data : {
			service: 'wfs',
			version: '2.0.0',
			request: 'GetCapabilities',
		},
		dataType: 'xml',
		type : 'GET',
		success : function(data) {
			var flist = $(data).find('FeatureType');
			var lowerCorner, upperCorner;
			flist.each(function() {
				if ($(this).find('Name').text() === 'NAR:' + REGION_LAYER[CONFIG.region].inset) {
					lowerCorner = $(this).find('LowerCorner').text();
					upperCorner = $(this).find('UpperCorner').text();
					return false;
				}
			});
			me.featureExtent = OpenLayers.Bounds.fromString(lowerCorner.replace(' ', ',') + ',' + upperCorner.replace(' ', ','));
		}
	});
	
	var mapUSExtent = new OpenLayers.Bounds(-175.0, 20.7, -66.4, 71.0).transform(nar.commons.map.geographicProjection, nar.commons.map.projection);

	
	var createStatesBaseLayer = function() {
		return new OpenLayers.Layer.WMS(
				"United States",
				GEOSERVER_URL,
				{
					layers : 'NAR:statesl48_alb',
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
				"Alask",
				GEOSERVER_URL,
				{
					layers : 'NAR:ak_alb',
					transparent : true,
					styles : 'ms_grey_outline'
				},
				{
					isBaseLayer : true
				}
		);
	}
	
	var createBasinLayer = function() {
		return new OpenLayers.Layer.WMS(
				CONFIG.region + ' Basin',
				GEOSERVER_URL,
				{
					layers: 'NAR:' + REGION_LAYER[CONFIG.region].inset,
					transparent: true,
					styles : 'coastal_basins'
				}
		);
	};
	
	var createStreamsLayer = function() {
		//TODO: Ignore Alaska for now
		return new OpenLayers.Layer.WMS(
				CONFIG.region + ' Streams',
				GEOSERVER_URL,
				{
					layers: 'NAR:' + REGION_LAYER[CONFIG.region].streams,
					transparent : true,
					styles : 'streams'
				},
				{
					isBaseLayer : false,
					singleTile : true
				}
		);
	};
	
	var createLabelsLayer = function() {
		return new OpenLayers.Layer.WMS(
				CONFIG.region + 'Stream Names',
				GEOSERVER_URL,
				{
					layers: 'NAR:' + REGION_LAYER[CONFIG.region].labels,
					transparent : true,
					styles : 'stream_names'
				},
				{
					isBaseLayer : false,
					singleTile : true
				}
		);
	};
	
	var createAlaskaLayers = function() {
		return [
		        new OpenLayers.Layer.WMS()
		        ]
	}
	
	
	var createDefaultMapOptions = function() {
		return {
			projection : nar.commons.map.projection,
			theme : nar.commons.map.theme,
			restrictedExtent : mapUSExtent,
			maxExtent : mapUSExtent,
			controls : [new OpenLayers.Control.Navigation(), new OpenLayers.Control.Zoom()],
			layers : [createBasinLayer(), createStatesBaseLayer(), createLabelsLayer(), createStreamsLayer()]
		};
	};
	
	me.createRegionMap = function(mapDiv) {
		var map = new OpenLayers.Map(mapDiv, createDefaultMapOptions());
		getBoundingBoxPromise.then(function() {
			map.zoomToExtent(me.featureExtent.transform(nar.commons.map.geographicProjection, nar.commons.map.projection));
		});

		map.zoomToExtent(mapUSExtent);
		
		return map;
	};
	
	return {
		createRegionMap : function(mapDiv) {
			return me.createRegionMap.call(me, mapDiv);
		}
	};
	
}());