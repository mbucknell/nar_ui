(function() {
	var coastalRegionMap = nar.coastalRegion.map(CONFIG.endpoint.geoserver, CONFIG.region);
	var getBasinFeatureInfoPromise = coastalRegionMap.getBasinFeatureInfoPromise(['STAID', 'STANAME']);
	
	var dataTimeRange = new nar.timeSeries.TimeRange(new Date(1992, 10, 1).getTime(), new Date(CONFIG.currentWaterYear, 9, 30).getTime());
	/*
	 * @param Array of data availability objects from call to GetDataAvailability
	 * @return TimeSeries.Collection containing a time series for each object in availability
	 */
	
	$(document).ready(function() {
		"use strict";
		
		var map = coastalRegionMap.createRegionMap('region_coast_map');
		
		var getTimeSeriesCollection = function(forFeature, availability) {
			var result = new nar.timeSeries.Collection();
			
			var thisFeatureAvailability = availability.filter(function (value) {
				return value.featureOfInterest === forFeature;
			});
			
			thisFeatureAvailability.each(function(value) {
				var ts = new nar.timeSeries.TimeSeries({
					timeRange : dataTimeRange,
					observedProperty : value.observedProperty,
					procedure : value.procedure,
					featureOfInterest : value.featureOfInterest
				});
				result.add(ts);
			});
			return result;
		};

		
		getBasinFeatureInfoPromise.then(function(response) {
			var basinFeatures = response;
			var basinSiteIds = basinFeatures.map(function(value) {
				return value.attributes.STAID;
			});
			
			// Make dataAvailability call for all sites for NO23
			var getDataAvailability = $.ajax({
				url : CONFIG.endpoint.sos,
				contentType : 'application/json',
				type: 'POST',
				dataType : 'json',
				data : JSON.stringify({
					'request' : 'GetDataAvailability',
					'service' : 'SOS',
					'version' : '2.0.0',
					'observedProperty' : CONFIG.sosDefsBaseUrl + 'property/NO23',
					'featureOfInterest' : basinSiteIds
				})
			});
			
			// We need to do this by featureOfInterest
			$.when(getDataAvailability)
				.then(
					function(availability) {
						var loadDataAvailability = availability.dataAvailability.filter(function(value) {
							return (value.procedure.has('annual_mass/') && !value.procedure.has('COMP'));
						});
						
						var yieldDataAvailability = availability.dataAvailability.filter(function(value) {
							return (value.procedure.has('annual_yield/') && !value.procedure.has('COMP'));
						});
						
						var loadTSCollections = [];
						var yieldTSCollections = [];
						basinSiteIds.forEach(function(id) {
							loadTSCollections.push(getTimeSeriesCollection(id, loadDataAvailability));
							yieldTSCollections.push(getTimeSeriesCollection(id, yieldDataAvailability));
						});
						
						// 
						var loadDataPromises = [];
						var yieldDataPromises = [];
						
						// Retrieve data for each time series collection
						loadTSCollections.forEach(function(tsCollection) {
							loadDataPromises = loadDataPromises.concat(tsCollection.retrieveData());
						});
						yieldTSCollections.forEach(function(tsCollection) {
							yieldDataPromises = yieldDataPromises.concat(tsCollection.retrieveData());
						});
						
						// Sort the data once received and plot.
						$.when.apply(null, loadDataPromises).then(function() {
							nar.plots.createCoastalBasinPlot('load_plot_div', loadTSCollections, basinFeatures, 'Tons', 'Load');
						});
						
						$.when.apply(null, yieldDataPromises).then(function() {
							nar.plots.createCoastalBasinPlot('yield_plot_div', yieldTSCollections, basinFeatures, 'Tons per square mile', 'Yield');
						});
					})
				.fail(
					function() {
						throw Error('Unable to contact the SOS server');
					}
				);
		});
	});
}());