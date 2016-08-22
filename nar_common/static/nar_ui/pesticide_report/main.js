//@requires nar.fullReport.Tree, nar.timeSeries.VisualizationRegistry, nar.timeSeries.Visualization
$(document).ready(function() {
	var siteId = PARAMS.siteId;
	var selectorElementPair = function(selector) {
		var jqElt = $(selector);
		nar.util.assert_selector_present(jqElt);
		return {
			selector : selector,
			element : jqElt
		};
	};

	// dom setup
	var selectorElementPairs = {
		instructions : selectorElementPair('#instructions'),
		allPlotsWrapper : selectorElementPair('#plotsWrapper'),
		timeSlider : selectorElementPair('#timeSlider'),
		graphToggle : selectorElementPair('#plotToggleTree')
	};
	nar.timeSeries.VisualizationRegistryInstance = new nar.timeSeries.VisualizationRegistry();
	
	var getDataAvailabilityRequest = nar.util.getDataAvailability(siteId);
	
	
	var LAST_WATER_YEAR_RANGE = Date.range(nar.WaterYearUtils.getWaterYearStart(CONFIG.currentWaterYear), nar.WaterYearUtils.getWaterYearEnd(CONFIG.currentWaterYear));

	var successfulGetDataAvailability = function(data,
			textStatus, jqXHR) {
		var dataAvailability = data.filter(function(datumAvailability){
			return datumAvailability.constituentCategorization && 'PESTICIDE' === datumAvailability.constituentCategorization;
		});
		//populate the tsvRegistry with tsvs created from the GetDataAvailability response 
		dataAvailability.each(function(dataAvailability) {
						timeSeriesViz = new nar.pesticide.timeSeries.Visualization(
								{
									id : timeSeriesVizId,
									allPlotsWrapperElt : selectorElementPairs.allPlotsWrapper.element,
									timeSeriesCollection : new nar.timeSeries.Collection(),
									plotter : nar.util.Unimplemented
								});
						tsvRegistry.register(timeSeriesViz);
					}
					
					//Use the default time ranger for now. Override the hydrograph's time range 
					//later if both of its time series overlap with the most recent water year.
					var timeRange = nar.timeSeries.DataAvailabilityTimeRange(dataAvailability);
					var timeSeries = new nar.timeSeries.TimeSeries(
							{
								observedProperty : observedProperty,
								timeRange : timeRange,
								procedure : procedure,
								featureOfInterest: PARAMS.siteId
							});
					timeSeriesViz.timeSeriesCollection
							.add(timeSeries);
		
					timeSeriesViz.ancillaryData
							.each(function(props) {
								var ancilSeries = new nar.timeSeries.TimeSeries(
										{
											observedProperty : props.observedProperty,
											timeRange : timeRange,
											procedure : props.procedure,
											featureOfInterest : PARAMS.siteId
										});
								timeSeriesViz.timeSeriesCollection
										.add(ancilSeries);
							});
				}
			}
		});
		
		//Now, since every non-ignored constituent and modtype is available in the tsvRegistry,
		//and every one in the registry is about to be visualized, check to see if the hydrograph 
		//should be removed. If it shouldn't be removed, override it's time range.
		var HYDROGRAPH_AND_FLOW_DURATION_TSV_ID = 'Q/daily/flow';
		var hydrographAndFlowDurationTsv = tsvRegistry.get(HYDROGRAPH_AND_FLOW_DURATION_TSV_ID);
		if(hydrographAndFlowDurationTsv){
			if(isValidHydrographAndFlowDurationTimeSeriesCollection(hydrographAndFlowDurationTsv.timeSeriesCollection)){
				//if valid, restrict data's time range to the current water year 
				hydrographAndFlowDurationTsv.timeSeriesCollection.getAll().each(function(timeSeries){
					timeSeries.timeRange = nar.timeSeries.WaterYearTimeRange(CONFIG.currentWaterYear);
				});
			} else {
				tsvRegistry.deregister(HYDROGRAPH_AND_FLOW_DURATION_TSV_ID);
			}
		}
		
		var allTimeSeriesVizualizations = tsvRegistry.getAll();
		var timeSlider = nar.timeSeries.TimeSlider(selectorElementPairs.timeSlider.element);
		var tsvController = new nar.timeSeries.VisualizationController(
				timeSlider, selectorElementPairs.instructions.element);

		var tree = new nar.fullReport.Tree(
				allTimeSeriesVizualizations, tsvController,
				selectorElementPairs.graphToggle.element);
	};
	var failedGetDataAvailability = function(data, textStatus,
			jqXHR) {
		var msg = 'Could not determine data availability for this site';
		// Errors are caught by window and alert is displayed
		throw Error(msg);
	};

	// Wait for definitions and site_info to load.
	$.when(nar.definitionsPromise, nar.siteHelpInfoPromise).always(function(){
		// Create links
		var addLink = function(el, link) {
			if (link) {
				el.attr('href', link);
			}
			else {
				el.parent().hide();
			}
		};
		
		var addHelpPopover = function(id, additionalContent) {
			var $link = $('#' + id);
			
			additionalContent = additionalContent || '';
			$link.find('a').popover({
				content : nar.definitions[id].short_definition + additionalContent,
				trigger : 'hover',
				container : '.summary_info'
			});
		};
		
		addLink($('#realtime_link'), nar.siteHelpInfo.realtime_streamflow_link);
		addLink($('#nwisweb_link'), nar.siteHelpInfo.nwisweb_link);
		addLink($('#daily_flows_link'), nar.siteHelpInfo.flow_compared_to_historic_link);
		
		// Add help popovers
		addHelpPopover('sampleConcentrations', '. Open circle symbols in the graphs are samples with concentrations less than the laboratory reporting level.');
		addHelpPopover('annualFlowNormalizedConcentrations');
		addHelpPopover('annualLoad');
		
		$.when(getDataAvailabilityRequest).then(
			successfulGetDataAvailability,
			failedGetDataAvailability);
		selectorElementPairs.allPlotsWrapper.element.sortable();
		selectorElementPairs.allPlotsWrapper.element.disableSelection();
	});
});