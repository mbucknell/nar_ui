(function() {
	var coastalRegionMap = nar.coastalRegion.map(CONFIG.endpoint.geoserver, CONFIG.region);
	var getBasinFeatureInfoPromise = coastalRegionMap.getBasinFeatureInfoPromise(['STAID']);
	
	var dataTimeRange = new nar.timeSeries.TimeRange(new Date(1992, 10, 1).getTime(), new Date(CONFIG.currentWaterYear, 9, 30).getTime());
	/*
	 * @param Array of data availability objects from call to GetDataAvailability
	 * @return TimeSeries.Collection containing a time series for each object in availability
	 */
	var getTimeSeriesCollection = function(availability) {
		var result = new nar.timeSeries.Collection();
		
		availability.each(function(value) {
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

	$(document).ready(function() {
		"use strict";
		
		var basinFeatures;
		var map = coastalRegionMap.createRegionMap('region_coast_map');
		
		getBasinFeatureInfoPromise.then(function(response) {
			var basinSiteIds = response.map(function(value) {
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
			
			$.when(getDataAvailability)
				.then(
					function(availability) {
						var loadDataAvailability = availability.dataAvailability.filter(function(value) {
							return (value.procedure.has('annual_mass/') && !value.procedure.has('COMP'));
						});
						
						var yieldDataAvailability = availability.dataAvailability.filter(function(value) {
							return (value.procedure.has('annual_yield/') && !value.procedure.has('COMP'));
						});
						
						if ((loadDataAvailability.length === 0) && (yieldDataAvailability.length === 0)) {
							throw Error('No load or yield data available for this basin');
						}
						
						var loadTSCollection = getTimeSeriesCollection(loadDataAvailability);
						var yieldTSCollection = getTimeSeriesCollection(yieldDataAvailability);
						
						var loadDataPromises = loadTSCollection.retrieveData();
						var yieldDataPromises = yieldTSCollection.retrieveData();
						
						$.when.apply(null, loadDataPromises).then(function() {
							var tsData = loadTSCollection.getDataMerged();
							console.log('Got Load Data');
						});
						
						$.when.apply(null, yieldDataPromises).then(function(response) {
							var tsData = yieldTSCollection.getDataMerged();
							console.log('Got Yield Data');
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