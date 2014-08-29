var nar = nar || {};
nar.mississippi = nar.mississippi || {};
nar.mississippi.map = (function() {
	"use strict";
	
	var me = {};
	
	me.mississippiExtent = new OpenLayers.Bounds(-120.5, 22.5, -69.5, 54.5).transform(nar.commons.map.geographicProjection, nar.commons.map.projection);
	me.mississippiCenter = me.mississippiExtent.getCenterLonLat();
	me.maps = {};
	me.topics = {};
	
	me.mapEvents = function(id) {
		var callbacks,
			method,
			topic = id && me.topics[id];
		if (!topic) {
			callbacks = jQuery.Callbacks();
			topic = {
				publish : callbacks.fire,
				subscribe : callbacks.add,
				unsubscribe : callbacks.remove
			};
			if (id) {
				me.topics[id] = topic;
			}
		}
		return topic;
	};
	
	me.createDefaultOptions = function() {
		return {
			projection : nar.commons.map.projection,
			maxZoomLevel : 4,
			restrictedExtent : me.mississippiExtent,
			maxExtent : me.mississippiExtent,
			theme : CONFIG.staticUrl + 'nar_ui/js_lib/OpenLayers/theme/default/style.css',
			controls : [
				new OpenLayers.Control.Navigation(),
				new OpenLayers.Control.MousePosition({
					numDigits : 2,
					displayProjection : nar.commons.map.geographicProjection
				}), 
				new OpenLayers.Control.ScaleLine({
					geodesic : true
				}), 
				new OpenLayers.Control.LayerSwitcher({
					roundedCorner : true
				}), 
				new OpenLayers.Control.Zoom()
				],
			layers : [].add(nar.commons.mapUtils.createBaseLayers())
				.add(nar.commons.mapUtils.createMississippiBasinsLayer())
		};
	};
	
	me.createMap = function(args) {
		var mapDiv = args.div,
			options = args.options || {},
			linkMap = args.linkMap || true,
			mapId = args.mapId || mapDiv.id,
			map;
			
			options = $.extend({}, me.createDefaultOptions(), args.options);
			
			map = new OpenLayers.Map(mapDiv, options);
			map.setCenter(me.mississippiCenter, 4);
			map.options.linkMap = linkMap;
			
			if (linkMap) {
				map.events.register('move', me, function(evt) {
					me.mapEvents(evt.type).publish(evt);
				});
				
				me.mapEvents('move').subscribe(function(evt) {
					for (var key in me.maps) {
						if (me.maps.hasOwnProperty(key)) {
							var map = me.maps[key];
							if (evt.object.id !== map.id && map.options.linkMap) {
								if (map.getExtent() !== evt.object.getExtent()) {
									map.zoomToExtent(evt.object.getExtent(), true);
								}
							}
						}
					}
				});
			}
			me.maps[mapId] = map;
			return map;
	};
	
	return {
		createMap : function(args) {
			return me.createMap.call(me, args);
		},
		maps : me.maps
	};
}());