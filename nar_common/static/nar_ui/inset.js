var nar = nar || {};

(function() {
	var WGS84_GOOGLE_MERCATOR = new OpenLayers.Projection('EPSG:900913'); 
    var WGS84_GEOGRAPHIC = new OpenLayers.Projection('EPSG:4326');
	var alaskaExtent = new OpenLayers.Bounds(-178.0, 50.0, -130.0, 71.5).transform(WGS84_GEOGRAPHIC, WGS84_GOOGLE_MERCATOR);
    var alaskaCenter = alaskaExtent.getCenterLonLat();
	
	nar.inset = OpenLayers.Class(OpenLayers.Control, {
		type : OpenLayers.Control.TYPE_TOOL,
		displayClass : 'narAlaskaMapInset',
		insetContainerDivId : 'narAlaskaMapInsetInnerContainer',
		allowSelection : true,
		dragStart : null,
		mapInsetContainerElement : null,
		element : null,
		size: new OpenLayers.Size(250, 250),
		insetMap : null,
		insetOptions : {},
		handlers : {},
		initialize : function(options) {
			"use strict";
			options = options || {};
			options.displayClass = this.displayClass;
			options.allowSelection = this.allowSelection;

			OpenLayers.Control.prototype.initialize.apply(this, [options]);
		},
		destroy : function() {
			"use strict";
			OpenLayers.Control.prototype.destroy.apply(this, arguments);
		},
		draw : function() {
			"use strict";
			// Create the primary element
			OpenLayers.Control.prototype.draw.apply(this, arguments);
			this.element = document.createElement('div');
			this.element.className = this.displayClass + 'Element' + ' olScrollable';
			this.element.style.overflow = 'auto';
			this.element.style.display = '';

			// Create the actual container div inside of that div inside of that
			if (!this.mapInsetContainerElement) {
				this.mapInsetContainerElement = document.createElement('div');
				this.mapInsetContainerElement.id = this.insetContainerDivId;
			}

			this.element.appendChild(this.mapInsetContainerElement);
			this.div.appendChild(this.element);
			
		    var defaultLayerOptions = {
	            sphericalMercator : true,
	            layers : "0",
	            isBaseLayer : true,
	            projection : WGS84_GOOGLE_MERCATOR,
	            units : "m",
	            buffer : 3,
	            wrapDateLine : false
	        };
	        var addBaseLayersTo = function(mapLayers, defaultLayerOptions) {
	            var zyx = '/MapServer/tile/${z}/${y}/${x}';
	            var ArcGisLayer = function(name, identifier) {
	                return new OpenLayers.Layer.XYZ(
	                    name,
	                    "http://services.arcgisonline.com/ArcGIS/rest/services/" + identifier + zyx,
	                    defaultLayerOptions
	                );
	            };
	            var baseLayers = 
	            [ 
	                ArcGisLayer("World Topo Map", 'World_Topo_Map'),
	                ArcGisLayer("World Image", "World_Imagery"),
	                ArcGisLayer("World Shaded Relief", "World_Shaded_Relief"),
	                ArcGisLayer('World Street Map', 'World_Street_Map')
	            ];
	            mapLayers.add(baseLayers);
	            return baseLayers;
	        };
	            
	        var addNlcdLayersTo = function(mapLayers, defaultLayerOptions) {
	            var nlcdUrl = 'http://raster.nationalmap.gov/ArcGIS/services/TNM_LandCover/MapServer/WMSServer';
	            
	            var nlcdProjection = 'EPSG:3857';
	            
	            var nlcdContiguousUsOptions = Object.clone(defaultLayerOptions);
	            nlcdContiguousUsOptions.displayInLayerSwitcher = true;
	            nlcdContiguousUsOptions.isBaseLayer = false;
	            nlcdContiguousUsOptions.projection = nlcdProjection;
	            nlcdContiguousUsOptions.visibility = false;
	            
	            var nlcdContiguousUsParams = {
	                layers : '24',
	                transparent: true,
	                tiled: true
	            };
	            
	            var nlcdContiguousUsLayer = new OpenLayers.Layer.WMS('NLCD', nlcdUrl, nlcdContiguousUsParams, nlcdContiguousUsOptions); 
	            
	                
	            var nlcdAlaskaOptions = Object.clone(defaultLayerOptions);
	            nlcdAlaskaOptions.displayInLayerSwitcher = false;
	            nlcdAlaskaOptions.isBaseLayer = false;
	            nlcdAlaskaOptions.projection = nlcdProjection;
	            nlcdAlaskaOptions.visibility = false;
	            var nlcdAlaskaParams = {
	                layers : '18',
	                transparent: true,
	                tiled: true
	            };
	            
	            var nlcdAlaskaLayer = new OpenLayers.Layer.WMS('NLCD Alaska', nlcdUrl, nlcdAlaskaParams, nlcdAlaskaOptions); 
	                    
	            nlcdContiguousUsLayer.events.register('visibilitychanged', {}, function(){
	                 nlcdAlaskaLayer.setVisibility(nlcdContiguousUsLayer.visibility); 
	            });
	            
	            var nlcdLayers = [
	                 nlcdContiguousUsLayer,
	                 nlcdAlaskaLayer
	            ];
	            mapLayers.add(nlcdLayers);
	            return nlcdLayers;
	        };
	        
	        var addSitesLayerTo = function(mapLayers, defaultLayerOptions) {
	            var sitesLayerOptions = Object.clone(defaultLayerOptions);
	            sitesLayerOptions.singleTile = true; //If we're not going to cache, might as well singleTile
	            sitesLayerOptions.isBaseLayer =  false;

	            var sitesLayerParams = {
	                layers : 'NAWQA100_cy3fsmn',
	                buffer: 8,
	                transparent: true,
	                styles: 'triangles'
	            };
	            
	            var sitesLayer = new OpenLayers.Layer.WMS(
	                'NAWQA Sites',
	                CONFIG.endpoint.geoserver + 'NAR/wms',
	                sitesLayerParams,
	                sitesLayerOptions
	            );
	            
	            mapLayers.push(sitesLayer);
	            return sitesLayer;
	        };
	        
	        var mapLayers = [];
	        addBaseLayersTo(mapLayers, defaultLayerOptions);
	        addNlcdLayersTo(mapLayers, defaultLayerOptions);
	        sitesLayer = addSitesLayerTo(mapLayers, defaultLayerOptions);

			this.insetOptions = {
					extent : alaskaExtent,
		            restrictedExtent : alaskaExtent,
		            layers : mapLayers,
		            projection : WGS84_GOOGLE_MERCATOR,
		            size : this.size.clone(),
		            numZoomLevels: 7,
		            controls : [
                        new OpenLayers.Control.Navigation(),
                        new OpenLayers.Control.ScaleLine({
                            geodesic: true
                        })
                    ]
			};
	        
			this.insetMap = new OpenLayers.Map(this.mapInsetContainerElement, this.insetOptions);
			this.insetMap.setCenter(alaskaCenter, 4, true, true);
		    mapLayers[0].events.register("loadend", this, function() {
		    	this.insetMap.updateSize();
			});
		    
			if (!this.outsideViewport) {
				this.div.className += " " + this.displayClass + 'Container';
			}

			this.handlers.drag = new OpenLayers.Handler.Drag(
				this, {}, {
				documentDrag: false,
				map: this.map
			});

			// Cancel or catch events 
			OpenLayers.Event.observe(this.div, 'click', OpenLayers.Function.bind(function (ctrl, evt) {
				OpenLayers.Event.stop(evt ? evt : window.event);
			}, this, this.div));
			OpenLayers.Event.observe(this.div, 'dblclick', OpenLayers.Function.bind(function (ctrl, evt) {
				OpenLayers.Event.stop(evt ? evt : window.event);
			}, this, this.div));
			OpenLayers.Event.observe(this.div, 'mouseover', OpenLayers.Function.bind(function () {
				this.handlers.drag.activate();
			}, this, this.div));
			OpenLayers.Event.observe(this.div, 'mouseout', OpenLayers.Function.bind(function () {
				this.handlers.drag.deactivate();
			}, this, this.div));
			OpenLayers.Event.observe(this.div, 'touchstart', OpenLayers.Function.bind(function (ele, evt) {
				// The user is actually dragging the legend (or at least touched it) so mark the y coord where
				// that happened because dragging (touchmove) directionality and distance will  be based on 
				// this delta
				this.dragStart = evt.changedTouches[0].clientY;
				OpenLayers.Event.stop(evt);
			}, this, this.div));
			OpenLayers.Event.observe(this.div, 'touchmove', OpenLayers.Function.bind(function (ele, evt) {
				// The user is actively dragging the legend. I need to figure out the scroll amount so I take the starting
				// point (dragStart) and as the user scrolls, I calculate the distance from the starting point and 
				// programatically scroll the container
				var container = this.mapInsetContainerElement,
					currentY = evt.changedTouches[0].clientY,
					scrollAmount = currentY - this.dragStart,
					scrollToY = -scrollAmount + container.scrollTop;

				container.scrollTop = scrollToY;
				OpenLayers.Event.stop(evt ? evt : window.event);
			}, this, this.div));
			OpenLayers.Event.observe(this.div, 'touchend', OpenLayers.Function.bind(function (ele, evt) {
				OpenLayers.Event.stop(evt);
			}, this, this.div));

			this.map.events.on({
				buttonclick: this.onButtonClick,
				scope: this,
				updatesize: this.updateSize
			});

			return this.div;
		},
		CLASS_NAME: 'NAR.map.inset'
	});
}());