//@requires nar.timeSeries.VisualizationRegistry, nar.timeSeries.Visualization
$(document).ready(
	function() {
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
                       
			//variables to hold water year values to plot 
			var nitrateSeriesYearValue = 0;
			var phosphorusSeriesYearValue = 0;
			var streamflowSeriesYearValue = 0;
			var sedimentSeriesYearValue = 0;

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
					'featureOfInterest' : PARAMS.siteId
				})
			});
        	
			var successfulGetDataAvailability = function(data, textStatus, jqXHR) {
				var dataAvailability = data.dataAvailability;
        				
				dataAvailability.each(function(dataAvailability) {
					var observedProperty = dataAvailability.observedProperty;
					var procedure = dataAvailability.procedure;
					//ignore MODTYPE = 'COMP'
					if(procedure.endsWith('COMP')){
						return;//continue
					}
					else
					{	
						//not sure if these are the correct procedures and properties needed
						if((procedure.endsWith('discrete_concentration') &&
								observedProperty.endsWith('NO23') ||
								observedProperty.endsWith('TP') ||
								observedProperty.endsWith('SSC')) ||
								procedure.endsWith('annual_flow') && 
								observedProperty.endsWith('Q')	) {
                    		
							var timeSeries = new nar.timeSeries.TimeSeries(
								{
								observedProperty : observedProperty,
								procedure : procedure,
								featureOfInterest: PARAMS.siteId,
								timeRange : new nar.timeSeries.TimeRange(
										nar.WaterYearUtils.getWaterYearStart(CONFIG.currentWaterYear, true),
										nar.WaterYearUtils.getWaterYearEnd(CONFIG.currentWaterYear, true))
								});
        					
							timeSeries.retrieveData().then(
								function(response) {
									switch (procedure+observedProperty) {
									
									case CONFIG.sosDefsBaseUrl + 'procedure/discrete_concentration' + 
										CONFIG.sosDefsBaseUrl + 'property/NO23':

										//need to know how to handle remark data and also 
										//how to calculate graph value
										nitrateSeriesYearValue = response.data[0][1];	
										var nitrateSeries = {
											constituentName : nar.Constituents.nitrate.name,
											constituentUnit : 'Million Tons',
											yearValue : nitrateSeriesYearValue ? nitrateSeriesYearValue : 8,
											yearColor : nar.Constituents.nitrate.color,
											averageName : 'Average 1991-2013',
											averageValue : 10
										};

										var nitrateGraph = ConstituentCurrentYearComparisonPlot(
												'#barChart2', nitrateSeries);
										
										var result = calculateExceedance(response.data);
										var humanHealthExceedancePlot = ExceedancePlot('humanHealthExceedances', 
											[
											 {constituent: nar.Constituents.nitrate, data: result.value, label: result.label},
											 {constituent: {color: '', name: ' '}, data: ' ', label: ['']}
											],
											exceedancesTitle
										);
										break;
										
									case CONFIG.sosDefsBaseUrl + 'procedure/discrete_concentration' + 
										CONFIG.sosDefsBaseUrl + 'property/TP':

										//need to know how to calculate graph value
										phosphorusSeriesYearValue = response.data[0][1];	
										var phosphorusSeries = {
											constituentName : nar.Constituents.phosphorus.name,
											constituentUnit : 'Million Tons',
											yearValue : phosphorusSeriesYearValue ? phosphorusSeriesYearValue : 8,
											yearColor : nar.Constituents.phosphorus.color,
											averageName : 'Average 1985-2013',
											averageValue : 153
										};

										var phosphorusGraph = ConstituentCurrentYearComparisonPlot(
												'#barChart3', phosphorusSeries);
										break;
										
									case CONFIG.sosDefsBaseUrl + 'procedure/discrete_concentration' + 
										CONFIG.sosDefsBaseUrl + 'property/SSC':

										//need to know how to calculate graph value
										sedimentSeriesYearValue = response.data[0][1];	
										var sedimentSeries = {
											constituentName : nar.Constituents.sediment.name,
											constituentUnit : 'Million Tons',
											yearValue : sedimentSeriesYearValue ? sedimentSeriesYearValue : 8,
											yearColor : nar.Constituents.sediment.color,
											averageName : 'Average 1990-2013',
											averageValue : 100
										};

										var sedimentGraph = ConstituentCurrentYearComparisonPlot(
												'#barChart4', sedimentSeries);
										break;
										
									case CONFIG.sosDefsBaseUrl + 'procedure/annual_flow' + 
										CONFIG.sosDefsBaseUrl + 'property/Q':
										//find out how to get convert to million acre feet
										streamflowSeriesYearValue = response.data[0][1]/10000;	
										var streamflowSeries = {
											constituentName : nar.Constituents.streamflow.name,
											constituentUnit : 'Million acre-feet',
											yearValue : streamflowSeriesYearValue ? streamflowSeriesYearValue : 8,
											yearColor : nar.Constituents.streamflow.color,
											averageName : 'Average 1999-2013',
											averageValue : 2.4
										};

										var streamflowGraph = ConstituentCurrentYearComparisonPlot(
												'#barChart1', streamflowSeries);
										break;
										
									default:
										break;
        							}
        						},
        						function(reject) {
        							throw Error ('Could not retrieve discrete data');
        						}
        					);
                    	}
                    }
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