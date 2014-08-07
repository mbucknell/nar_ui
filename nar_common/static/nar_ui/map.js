var map;
(function() {
	var options = {};
    options.projection = nar.commons.map.projection;
    
    var continentalExtent = new OpenLayers.Bounds(-140.5, 10.5, -64.5, 53.5).transform(nar.commons.map.geographicProjection, nar.commons.map.projection);
    var continentalCenter = continentalExtent.getCenterLonLat();
    
    
    var themeFileUrl = CONFIG.staticUrl + 'nar_ui/js_lib/OpenLayers/theme/default/style.css';
   
    options.maxZoomLevel = 4;
    options.maxExtent = continentalExtent;
    options.theme = themeFileUrl;
    options.controls = [
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.MousePosition({
            numDigits: 2,
            displayProjection: nar.commons.map.geographicProjection
        }),
        new OpenLayers.Control.ScaleLine({
            geodesic: true
        }),
        new OpenLayers.Control.LayerSwitcher({
            roundedCorner: true
        }),
        new OpenLayers.Control.Zoom()
    ];
    
    var sitesLayer = nar.commons.mapUtils.createSitesLayers();
    var mapLayers = [].add(nar.commons.mapUtils.createBaseLayers())
    	.add(nar.commons.mapUtils.createNlcdLayers())
		.add(sitesLayer);
    
    options.layers = mapLayers;
    
    // Add an on-hover site identification control
    options.controls.push(new nar.SiteIdentificationControl({
    	layers : [sitesLayer]
    }));

    var getFeatureInfoControl = new OpenLayers.Control.WMSGetFeatureInfo({
        title: 'site-identify-control',
        hover: false,
        layers: [
            sitesLayer
        ],
        queryVisible: true,
        output: 'object',
        drillDown: true,
        infoFormat: 'application/vnd.ogc.gml',
        vendorParams: {
            buffer: 8
        },
        id: 'sites',
        autoActivate: true
    });
    var getFeatureInfoHandler = function(response) {
        var realFeatures = response.features[0].features;
        if(realFeatures.length) {
            //just grab first feature for now
            var feature = realFeatures[0];
            var featureId = feature.data.staid;
            var uriParam = encodeURI(featureId);
            var url = CONFIG.baseUrl + 'site/' + uriParam + '/summary-report';
            window.location.href = url;
        }
    };
    getFeatureInfoControl.events.register("getfeatureinfo", {}, getFeatureInfoHandler);
    options.controls.push(getFeatureInfoControl);
    
    var id = 'siteMap';
    var div = $('#'+id);
    if(div.length){
        div = div[0];
    }
    else{
        throw Error('Error rendering map - could not find element with id "' + id + '".');
    }

    map = new OpenLayers.Map(div, options);
    map.setCenter(continentalCenter, 4);
    sitesLayer.events.register("loadend", {}, function() {
    	map.updateSize();
    });
    
    var insetControl = new nar.inset({});
    map.addControl(insetControl, new OpenLayers.Pixel(0, map.getSize().h - 260));
    insetControl.activate();
    
    (function setupFiltering(name, layer) {
        var writeCQLFilter = function(selectedTypes) {
            var cqlFilter = "c3type IS NOT NULL";
            if (selectedTypes && 0 < selectedTypes.length) {
                cqlFilter = "c3type IN ('";
                cqlFilter = cqlFilter + selectedTypes.join("','");
                cqlFilter = cqlFilter + "')";
            }
            return cqlFilter;
        };
        $("input[name='" + name + "']").change(function() {
            var selectedTypes = $.makeArray($("input[name='" + name + "']:checked").map(function(){return $(this).val()}));
            var cqlFilter = writeCQLFilter(selectedTypes);
            layer.mergeNewParams({cql_filter: cqlFilter});
        });
    })("siteFilter", sitesLayer);
}());
