$(document).ready(
	function() {
		// Wait for site info to load
		$.when(nar.siteHelpInfoPromise).done(function() {
			var isSiteForDummyNullData = PARAMS.siteId === '05451210'; //South Fork Iowa River near New Providence, IA

            var ConstituentCurrentYearComparisonPlot = nar.fullReport.ConstituentCurrentYearComparisonPlot;
            var ExceedancePlot = nar.fullReport.ExceedancePlot;            

			var exceedancePlotLabel = function(data) {
				/*
				 * NOTE: Product Owner has requested the number of samples to be in the string
				 * if no exceedances. This function can be updated with that information if available.
				 * At this time we are still using mock data and we aren't sure if this information will
				 * be available
				 */
				var result = [];
				data.forEach(function(value) {
					if (value === 0) {
						result.push('No detections above benchmarks');
					} 
					else {
						result.push(value);
					}
				});
				return result;
			};
            
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
            var exceedancesTitle = 'Percentage of samples with concentrations greater than benchmarks'; 
            
            var nitrateData = isSiteForDummyNullData ? [0]: [73];
            var humanHealthExceedancePlot = ExceedancePlot(
                'humanHealthExceedances', 
                [
                 {constituent: nar.Constituents.nitrate, data: nitrateData, label: exceedancePlotLabel(nitrateData)},
                 {constituent: {color: '', name: ' '}, data: [' '], label: ['']}
                ],
                exceedancesTitle
            );

            nar.informativePopup({
            	$anchor : $('#link-hover-benchmark-human'),
            	content : '<div class="popover-benchmark-content">\
            		Measured concentrations in water samples from <br/>\
            		streams and rivers are compared to one of three <br/>\
            		types of human-health benchmarks to place the data <br/>\
            		in a human-health context. Generally, concentrations <br/>\
            		above a benchmark may indicate a potential human-health<br/>\
            		concern if the water were to be consumed without <br/>\
            		treatment for many years. None of the samples were <br/>\
            		collected from drinking-water intakes.</div>'
			});

	});
});