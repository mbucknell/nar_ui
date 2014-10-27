//@requires nar.fullReport.Tree, nar.timeSeries.VisualizationRegistry, nar.timeSeries.Visualization
$(document).ready(function() {

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

	var getDataAvailabilityUri = CONFIG.endpoint.sos + '/json';
	var getDataAvailabilityParams = {
		"request" : "GetDataAvailability",
		"service" : "SOS",
		"version" : "2.0.0",
		"featureOfInterest" : PARAMS.siteId
	};

	var getDataAvailabilityRequest = $.ajax({
		url : getDataAvailabilityUri,
		data : JSON.stringify(getDataAvailabilityParams),
		type : 'POST',
		contentType : 'application/json'

	});
	var procedureSuffixToIgnore = ['comp'];
	var tsvRegistry = nar.timeSeries.VisualizationRegistryInstance;
	var successfulGetDataAvailability = function(data,
			textStatus, jqXHR) {
		var dataAvailability = data.dataAvailability;
		
		dataAvailability = dataAvailability.filter(function(datumAvailability){
			var ignore = datumAvailability.procedure.toLowerCase().endsWith(procedureSuffixToIgnore);
			return !ignore;
		});
		
		dataAvailability.each(function(dataAvailability) {
			var observedProperty = dataAvailability.observedProperty.toLowerCase();
			var procedure = dataAvailability.procedure.toLowerCase();
			var timeSeriesVizId = tsvRegistry
					.getTimeSeriesVisualizationId(observedProperty, procedure);
			var timeSeriesViz = tsvRegistry
					.get(timeSeriesVizId);
			if (!timeSeriesViz) {
				timeSeriesViz = new nar.timeSeries.Visualization(
						{
							id : timeSeriesVizId,
							allPlotsWrapperElt : selectorElementPairs.allPlotsWrapper.element,
							timeSeriesCollection : new nar.timeSeries.Collection(),
							plotter : nar.util.Unimplemented
						});
				tsvRegistry.register(timeSeriesViz);
			}

			var timeRange = timeSeriesViz
					.ranger(dataAvailability);

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
									procedure : props.procedure
								});
						timeSeriesViz.timeSeriesCollection
								.add(ancilSeries);
					});
		});
		
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
	$.when(nar.definitionsPromise, nar.siteHelpInfoPromise).done(function() {
		// Create links
		var addLink = function(el, link) {
			if (link) {
				el.attr('href', link);
			}
			else {
				el.parent().hide();
			}
		};
		
		addLink($('#realtime_link'), nar.siteHelpInfo.realtime_streamflow_link);
		addLink($('#nwisweb_link'), nar.siteHelpInfo.nwisweb_link);
		addLink($('#daily_flows_link'), nar.siteHelpInfo.flow_compared_to_historic_link);

		$.when(getDataAvailabilityRequest).then(
			successfulGetDataAvailability,
			failedGetDataAvailability);
		selectorElementPairs.allPlotsWrapper.element.sortable();
		selectorElementPairs.allPlotsWrapper.element.disableSelection();
	});
});