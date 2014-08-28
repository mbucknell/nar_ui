$(document).ready(
        function() {
        	// Wait for site info to load
        	$.when(nar.siteHelpInfoPromise).done(function() {
	            var ConstituentCurrentYearComparisonPlot = nar.fullReport.ConstituentCurrentYearComparisonPlot;
	            var ExceedancePlot = nar.fullReport.ExceedancePlot;
	            
	            var nitrateSeries = {
	                    constituentName : nar.Constituents.nitrate.name,
	                    constituentUnit : 'Million Tons',
	                    yearValue : 12,
	                    yearColor : nar.Constituents.nitrate.color,
	                    averageName : 'Average 1991-2013',
	                    averageValue : 10
	            };
	
	            var nitrateGraph = ConstituentCurrentYearComparisonPlot(
	                    '#barChart2', nitrateSeries);
	
	            var phosphorusSeries = {
	                    constituentName : nar.Constituents.phosphorus.name,
	                    constituentUnit : 'Million Tons',
	                    yearValue : 100,
	                    yearColor : nar.Constituents.phosphorus.color,
	                    averageName : 'Average 1985-2013',
	                    averageValue : 153
	            };
	
	            var phosphorusGraph = ConstituentCurrentYearComparisonPlot(
	                    '#barChart3', phosphorusSeries);
	
	            var streamflowSeries = {
	                    constituentName : nar.Constituents.streamflow.name,
	                    constituentUnit : 'Million acre-feet',
	                    yearValue : 1.7,
	                    yearColor : nar.Constituents.streamflow.color,
	                    averageName : 'Average 1999-2013',
	                    averageValue : 2.4
	            };
	
	            var streamflowGraph = ConstituentCurrentYearComparisonPlot(
	                    '#barChart1', streamflowSeries);
	
	            var sedimentSeries = {
	                    constituentName : nar.Constituents.sediment.name,
	                    constituentUnit : 'Million Tons',
	                    yearValue : 300,
	                    yearColor : nar.Constituents.sediment.color,
	                    averageName : 'Average 1990-2013',
	                    averageValue : 100
	            };
	
	            var sedimentGraph = ConstituentCurrentYearComparisonPlot(
	                    '#barChart4', sedimentSeries);
	            var exceedancesTitle = 'Percentage of samples with concentrations greater than benchmarks'; 
	            
	            var humanHealthExceedancePlot = ExceedancePlot(
	                'humanHealthExceedances', 
	                [
	                 {constituent: nar.Constituents.nitrate, data: [73]},
	                 {constituent: {color: '', name: ' '}, data: [' ']}
	                ],
	                exceedancesTitle
	            );
	            
	            var aquaticHealthExceedancePlot = ExceedancePlot(
	                'aquaticHealthExceedances', 
	                [
	                 {constituent: nar.Constituents.nitrogen, data: [13]},
	                 {constituent: nar.Constituents.phosphorus, data: [73]},
	                ],
	                exceedancesTitle
	            );
	            
	            nar.summaryReport.informativePopup({
	            	$anchor : $('#link-hover-benchmark-human'),
	            	content : '<div class="popover-benchmark-content">\
	            		The human-health benchmark for nitrate is<br />\
	            		a USEPA Maximum Contaminant Level<br />\
	            		MCL = 10 mg/L as N<br />\
	            		<a href="http://water.epa.gov/drink/contaminants/index.cfm" target="_new">http:// water.epa.gov/drink/contaminants/index.cfm</a></div>'
	            });

	            $.ajax(CONFIG.siteInfoUrl, {
	            	data : {
	            		'site_id' : PARAMS.siteId
	            	},
	            	success : function (data) {
	            		var $anchor = $('#link-hover-benchmark-aquatic');
	            		if (data.nutrient_ecoregion && data.tn_criteria && data.tp_criteria) {
				            nar.summaryReport.informativePopup({
				            	$anchor : $anchor,
				            	title : 'Ecoregion ' + data.nutrient_ecoregion + ' Recommended Nutrient Criteria',
				            	content : '<div class="popover-benchmark-content">\
				            		Total nitrogen = ' + data.tn_criteria + ' mg/L<br />\
				            		Total phosphorous = ' + data.tp_criteria + ' mg/L<br />\
				            		<a href="http://www2.epa.gov/nutrient-policy-data/ecoregional-nutrient-criteria-documents-rivers-streams" target="_new">\
				            		http://www2.epa.gov/nutrient-policy-data/ecoregional-nutrient-criteria-documents-rivers-streams\
				            		</a><br /><br />\
				            		See <a href="http://cfpub.epa.gov/wqsits/nnc-development/" target="_new">\
				            		http://cfpub.epa.gov/wqsits/nnc-development/\
				            		</a>for status of State development of numeric criteria for nitrogen and phosphorus</div>',
			            		placement : function () {
			            			var BOOTSTRAP_MAGIC_RESIZE_THRESHOLD = 976;
			            			// If bootstrap has the app in narrow mode, the popup needs to be on the bottom because 
				            		// otherwise it will go past the edge of the screen. In wide mode, this is not a problem
				            		var placement =  $('body').width() <= BOOTSTRAP_MAGIC_RESIZE_THRESHOLD ? 'bottom' : 'left';
				            		return placement;
			            		}
				            });
	            		} else {
	            			$anchor.removeClass('link-popover-anchor');
	            		}
		            }, error : function () {
		            	// If the webservice errors out, I don't want the "Benchmarks" text to be 
		            	// decorated
		            	$anchor.removeClass('link-popover-anchor');
		            }
	            });
        	});
        });