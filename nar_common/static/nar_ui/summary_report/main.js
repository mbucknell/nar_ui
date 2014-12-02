//@requires nar.timeSeries.VisualizationRegistry, nar.timeSeries.Visualization
$(document).ready(
	function() {
		var id = PARAMS.siteId;
		CONFIG.startWaterYear = 1993;
		var currentDataTimeRange = new nar.timeSeries.TimeRange(
				nar.WaterYearUtils.getWaterYearStart(CONFIG.currentWaterYear, true),
				nar.WaterYearUtils.getWaterYearEnd(CONFIG.currentWaterYear, true));
		var averageDataTimeRange = new nar.timeSeries.TimeRange(
				nar.WaterYearUtils.getWaterYearStart(CONFIG.startWaterYear, true),
				nar.WaterYearUtils.getWaterYearEnd(CONFIG.currentWaterYear, true));
		var ConstituentCurrentYearComparisonPlot = nar.plots.ConstituentCurrentYearComparisonPlot;
		var ExceedancePlot = nar.plots.ExceedancePlot;            

		nar.informativePopup({
			$anchor : $('#link-hover-benchmark-human'),
			content : '<div class="popover-benchmark-content">\
				Measured concentrations in water samples from <br/>\
				streams and rivers are compared to one of three <br/>\
				types of <a href="' + CONFIG.techInfoUrl + '">human-health benchmarks</a> to place the data <br/>\
				in a human-health context. Generally, concentrations <br/>\
				above a benchmark may indicate a potential human-health<br/>\
				concern if the water were to be consumed without <br/>\
				treatment for many years. None of the samples were <br/>\
				collected from drinking-water intakes. Click on each <br/> \
				bar in the graph to obtain specific benchmark <br /> \
				information for each constituent.</div>'
		});
		
		// Wait for site info to load
		$.when(nar.siteHelpInfoPromise).done(function() {
//			var isSiteForDummyNullData = PARAMS.siteId === '05451210'; //South Fork Iowa River near New Providence, IA

			var exceedancesTitle = 'Percent of samples with concentrations greater than benchmarks';
            
			var calculateExceedance = function(tsData) {
				var BENCHMARK_THRESHOLD = 10; // mg/L
				var resultCount = tsData.length;
				var exceedCount = tsData.exclude(function(value) {
					return value[1] <= BENCHMARK_THRESHOLD;
				}).length;
				if (exceedCount === 0) {
					return {
						value : 0,
						label : 'No detections above benchmark (' + resultCount + ' samples)'
					};
				}
				else {
					var ans = (exceedCount / resultCount) * 100;
					return {
						value : ans,
						label : ans.format(2)
					};
				}
			};
			
			/*
			 * @param {String} - feature for which data should be retrieved
			 * @param {Array} availability of data availability objects to be used to retrieve data
			 * @return TimeSeries.Collection containing a time series for each object in availability
			 */
			var getTimeSeriesCollection = function(forFeature, availability) {
				var result = new nar.timeSeries.Collection();
				
				var thisFeatureAvailability = availability.filter(function (value) {
					return value.featureOfInterest === forFeature;
				});
				
				thisFeatureAvailability.each(function(value) {
					var ts = new nar.timeSeries.TimeSeries({
						timeRange : averageDataTimeRange,
						observedProperty : value.observedProperty,
						procedure : value.procedure,
						featureOfInterest : value.featureOfInterest
					});
					result.add(ts);
				});
				return result;
			};
            
			var getPlotValues = function(tsCollections) {			
				var avgData = [];
				var currentYearData = [];
				
				var dataValue = function(dataPoint) {
					return parseFloat(dataPoint[1]);
				};
				
				// Create data series for each collection for the avg up to the current water year and the current year.
				tsCollections.forEach(function(tsC) {
					var sortedData = tsC.getDataMerged();
					var splitData = nar.plots.PlotUtils.getDataSplitIntoCurrentAndPreviousYears(sortedData);
					
					if (splitData.previousYearsData.length === 0) {
						avgData.push(0);
					}
					else {
						avgData.push(splitData.previousYearsData.average(dataValue));
					}
					if (splitData.currentYearData.length === 0) {
						currentYearData.push(0);
					}
					else {
						currentYearData.push(dataValue(splitData.currentYearData.first()));
					}	
				});
				
				return {
					average : avgData,
					current : currentYearData
				};
			};

			//find out what data is available for the site
			var getDataAvailability = $.ajax({
				url : CONFIG.endpoint.sos + '/json',
				contentType : 'application/json',
				type: 'POST',
				dataType : 'json',
				data : JSON.stringify({
					'request' : 'GetDataAvailability',
					'service' : 'SOS',
					'version' : '2.0.0',
					'featureOfInterest' : id
				})
			});

			var streamflowDataAvailability = [];
			var nitrateDataAvailability = [];
			var phosphorusDataAvailability = [];
			var sedimentDataAvailability = [];
			
			var successfulGetDataAvailability = function(data, textStatus, jqXHR) {

				var dataAvailability = data.dataAvailability;
        				
				dataAvailability.each(function(dataAvailability) {
					var observedProperty = dataAvailability.observedProperty;
					var procedure = dataAvailability.procedure;
					//ignore MODTYPE = 'COMP'
					if(procedure.endsWith('COMP')){
						return;//continue
					}
					else if (procedure.endsWith('discrete_concentration') &&
							observedProperty.endsWith('NO23')) {

						var timeSeries = new nar.timeSeries.TimeSeries(
						{
							observedProperty : observedProperty,
							procedure : procedure,
							featureOfInterest: id,
							timeRange : currentDataTimeRange
						});
	        					
						timeSeries.retrieveData().then(
							function(response) {
								//warning, this is broken, remark data not being handled! 											
								var result = calculateExceedance(response.data);
								var humanHealthExceedancePlot = ExceedancePlot('humanHealthExceedances', 
								[
									{constituent: nar.Constituents.nitrate, data: result.value, label: result.label},
									{constituent: {color: '', name: ' '}, data: ' ', label: ['']}
								],
								exceedancesTitle
								);
		        			},
	        				function(reject) {
	        					throw Error ('Could not retrieve discrete data');
	        				}
	        			);
					}
					else if (procedure.endsWith('annual_flow') && 
							observedProperty.endsWith('Q')) {

						streamflowDataAvailability.push(dataAvailability);						
                    }
					else if (procedure.has('annual_mass/') &&
							(observedProperty.endsWith('NO23'))) {
						
						nitrateDataAvailability.push(dataAvailability);						
					}	
					else if (procedure.has('annual_mass/') &&
							(observedProperty.endsWith('TP'))) {
						
						phosphorusDataAvailability.push(dataAvailability);						
					}	
					else if (procedure.has('annual_mass/') &&
							(observedProperty.endsWith('SSC'))) {
						
						sedimentDataAvailability.push(dataAvailability);						
					}
				});
		
				var loadStreamflowTSCollections = [];
				loadStreamflowTSCollections.push(getTimeSeriesCollection(id, streamflowDataAvailability));
				var loadStreamflowDataPromises = [];
				
				// Retrieve data for each time series collection
				loadStreamflowTSCollections.forEach(function(tsCollection) {
					loadStreamflowDataPromises = loadStreamflowDataPromises.concat(tsCollection.retrieveData());
				});
				
				// Sort the data once received and plot.
				$.when.apply(null, loadStreamflowDataPromises).then(function() {
					var result = getPlotValues(loadStreamflowTSCollections);
						
					var streamflowSeries = {
						constituentName : nar.Constituents.streamflow.name,
						constituentUnit : 'Million acre-feet',
						yearValue : result.current,
						yearColor : nar.Constituents.streamflow.color,
						averageName : 'Average 1999-2013',
						averageValue : result.average
					};

					var streamflowGraph = ConstituentCurrentYearComparisonPlot(
							'#barChart1', streamflowSeries);										
				});
				
				var loadNitrateTSCollections = [];
				loadNitrateTSCollections.push(getTimeSeriesCollection(id, nitrateDataAvailability));
				var loadNitrateDataPromises = [];
				
				// Retrieve data for each time series collection
				loadNitrateTSCollections.forEach(function(tsCollection) {
					loadNitrateDataPromises = loadNitrateDataPromises.concat(tsCollection.retrieveData());
				});
				
				// Sort the data once received and plot.
				$.when.apply(null, loadNitrateDataPromises).then(function() {
					var result = getPlotValues(loadNitrateTSCollections);
						
					var nitrateSeries = {
						constituentName : nar.Constituents.nitrate.name,
						constituentUnit : 'Million Tons',
						yearValue : result.current,
						yearColor : nar.Constituents.nitrate.color,
						averageName : 'Average 1991-2013',
						averageValue : result.average
					};

					var nitrateGraph = ConstituentCurrentYearComparisonPlot(
							'#barChart2', nitrateSeries);
				});
				
				var loadPhosphorusTSCollections = [];
				loadPhosphorusTSCollections.push(getTimeSeriesCollection(id, phosphorusDataAvailability));
				var loadPhosphorusDataPromises = [];
				
				// Retrieve data for each time series collection
				loadPhosphorusTSCollections.forEach(function(tsCollection) {
					loadPhosphorusDataPromises = loadPhosphorusDataPromises.concat(tsCollection.retrieveData());
				});
				
				// Sort the data once received and plot.
				$.when.apply(null, loadPhosphorusDataPromises).then(function() {
					var result = getPlotValues(loadPhosphorusTSCollections);
					
					var phosphorusSeries = {
						constituentName : nar.Constituents.phosphorus.name,
						constituentUnit : 'Million Tons',
						yearValue : result.current,
						yearColor : nar.Constituents.phosphorus.color,
						averageName : 'Average 1985-2013',
						averageValue : result.average
					};

					var phosphorusGraph = ConstituentCurrentYearComparisonPlot(
							'#barChart3', phosphorusSeries);
				});
				
				var loadSedimentTSCollections = [];
				loadSedimentTSCollections.push(getTimeSeriesCollection(id, sedimentDataAvailability));
				var loadSedimentDataPromises = [];
				
				// Retrieve data for each time series collection
				loadSedimentTSCollections.forEach(function(tsCollection) {
					loadSedimentDataPromises = loadSedimentDataPromises.concat(tsCollection.retrieveData());
				});
				
				// Sort the data once received and plot.
				$.when.apply(null, loadSedimentDataPromises).then(function() {
					var result = getPlotValues(loadSedimentTSCollections);
					
					var sedimentSeries = {
						constituentName : nar.Constituents.sediment.name,
						constituentUnit : 'Million Tons',
						yearValue : result.current,
						yearColor : nar.Constituents.sediment.color,
						averageName : 'Average 1990-2013',
						averageValue : result.average
					};

					var sedimentGraph = ConstituentCurrentYearComparisonPlot(
							'#barChart4', sedimentSeries);			
				});
			};
			var failedGetDataAvailability = function(data, textStatus,jqXHR) {
				var msg = 'Could not determine data availability for this site';
				// Errors are caught by window and alert is displayed
				throw Error(msg);
			};

			$.when(getDataAvailability).then(
				successfulGetDataAvailability,
				failedGetDataAvailability);	
		});
	});