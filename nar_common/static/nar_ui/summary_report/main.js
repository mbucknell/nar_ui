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
			var isSiteForDummyNullData = PARAMS.siteId === '05451210'; //South Fork Iowa River near New Providence, IA

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
            
            // Retrieve discrete concentration data and determine the percentage of samples exceeding benchmark            
            var observedProperty = CONFIG.sosDefsBaseUrl + 'property/NO23';
            var procedure = CONFIG.sosDefsBaseUrl + 'procedure/discrete_concentration';
            
            var getDataAvailability = $.ajax({
				url : CONFIG.endpoint.sos,
				contentType : 'application/json',
				type: 'POST',
				dataType : 'json',
				data : JSON.stringify({
					'request' : 'GetDataAvailability',
					'service' : 'SOS',
					'version' : '2.0.0',
					'observedProperty' : observedProperty,
					'procedure' : procedure,
					'featureOfInterest' : PARAMS.siteId
				})
            });
            
			$.when(getDataAvailability).then(function(response){
				var ts;
				if (response.dataAvailability.length === 0) {
					throw Error ('No discrete concentration data available');
				}
				else {
					ts = new nar.timeSeries.TimeSeries({
						procedure : procedure,
						observedProperty : observedProperty,
						featureOfInterest : PARAMS.siteId,
						timeRange : new nar.timeSeries.TimeRange(
								nar.WaterYearUtils.getWaterYearStart(CONFIG.currentWaterYear, true),
								nar.WaterYearUtils.getWaterYearEnd(CONFIG.currentWaterYear, true)
						)
					});
					
					ts.retrieveData().then(
						function(response) {
							var result = calculateExceedance(response.data);
							var humanHealthExceedancePlot = ExceedancePlot(
									'humanHealthExceedances', 
									[
										{constituent: nar.Constituents.nitrate, data: result.value, label: result.label},
										{constituent: {color: '', name: ' '}, data: ' ', label: ['']}
									],
									exceedancesTitle
							);
						},
						function(reject) {
							throw Error ('Count not retrieve discrete data');
						}
					);
				}
			});
				//
            var nitrateSeries = {
                    constituentName : nar.Constituents.nitrate.name,
                    constituentUnit : 'Million Tons',
                    yearValue : isSiteForDummyNullData ? 0 : 12,
                    yearColor : nar.Constituents.nitrate.color,
                    averageName : 'Average 1991-2013',
                    averageValue : 10
            };

            var nitrateGraph = ConstituentCurrentYearComparisonPlot(
                    '#barChart2', nitrateSeries);

            var phosphorusSeries = {
                    constituentName : nar.Constituents.phosphorus.name,
                    constituentUnit : 'Million Tons',
                    yearValue : isSiteForDummyNullData ? 0 : 100,
                    yearColor : nar.Constituents.phosphorus.color,
                    averageName : 'Average 1985-2013',
                    averageValue : 153
            };

            var phosphorusGraph = ConstituentCurrentYearComparisonPlot(
                    '#barChart3', phosphorusSeries);

            var streamflowSeries = {
                    constituentName : nar.Constituents.streamflow.name,
                    constituentUnit : 'Million acre-feet',
                    yearValue : isSiteForDummyNullData ? 0: 1.7,
                    yearColor : nar.Constituents.streamflow.color,
                    averageName : 'Average 1999-2013',
                    averageValue : 2.4
            };

            var streamflowGraph = ConstituentCurrentYearComparisonPlot(
                    '#barChart1', streamflowSeries);

            var sedimentSeries = {
                    constituentName : nar.Constituents.sediment.name,
                    constituentUnit : 'Million Tons',
                    yearValue : isSiteForDummyNullData ? 0: 300,
                    yearColor : nar.Constituents.sediment.color,
                    averageName : 'Average 1990-2013',
                    averageValue : 100
            };

            var sedimentGraph = ConstituentCurrentYearComparisonPlot(
                    '#barChart4', sedimentSeries);
		});
	});