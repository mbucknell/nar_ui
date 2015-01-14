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
	var acceptableComponentsGroup = [
          {
    	  	  timestepDensity: 'discrete',
        	  category: 'concentration'
          },
          {
        	  timestepDensity: 'annual',
        	  category: 'flow',
          },
          {
        	  timestepDensity: 'daily',
        	  category: 'flow',
          },
          {
        	  timestepDensity: 'annual',
        	  category: 'concentration',
          },
          {
        	  timestepDensity: 'annual',
        	  category: 'mass',
        	  subcategory: undefined
          }
    ];
	var constituentsToKeep = ['nitrogen', 'nitrate', 'streamflow', 'phosphorus', 'sediment'];
	/**
	 * Determines if 'components' should be displayed on the client or not
	 * @param {nar.timeSeries.Visualization.IdComponents} components, as returned by nar.TimeSeries.Visualization.getComponentsOfId 
	 * @param {array<nar.timeSeries.Visualization.IdComponents>} acceptableComponentsGroup
	 * @returns Boolean - True if ignorable, false otherwise
	 */
	var componentsAreIgnorable = function(components, acceptableComponentsGroup){
		var ignore = true;
		acceptableComponentsGroup.each(function(acceptableComponents){
			if(nar.util.objectHasAllKeysAndValues(components, acceptableComponents)){
				ignore = false;
				return false; //break
			};
		});
		return ignore;
	};
	
	var tsvRegistry = nar.timeSeries.VisualizationRegistryInstance;
	var successfulGetDataAvailability = function(data,
			textStatus, jqXHR) {
		var dataAvailability = data.dataAvailability;
				
		dataAvailability.each(function(dataAvailability) {
			var observedProperty = dataAvailability.observedProperty;
			var procedure = dataAvailability.procedure;
			//ignore MODTYPE = 'COMP'
			if(procedure.endsWith('COMP')){
				return;//continue
			}
			else{
				
				var timeSeriesVizId = tsvRegistry
						.getTimeSeriesVisualizationId(observedProperty, procedure);
				var timeSeriesIdComponents = nar.timeSeries.Visualization.getComponentsOfId(timeSeriesVizId);
				
				if(		!constituentsToKeep.some(timeSeriesIdComponents.constituent) 
						|| componentsAreIgnorable(timeSeriesIdComponents, acceptableComponentsGroup)){
					return;//continue
				}
				else{
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
											procedure : props.procedure,
											featureOfInterest : PARAMS.siteId
										});
								timeSeriesViz.timeSeriesCollection
										.add(ancilSeries);
							});
				}
			}
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
		
		var addHelpPopover = function(id) {
			var $link = $('#' + id);
			$link.find('span').html(nar.definitions[id].term);
			$link.find('a').popover({
				content : nar.definitions[id].short_definition,
				trigger : 'hover',
				container : '.summary_info'
			});
		};
		
		addLink($('#realtime_link'), nar.siteHelpInfo.realtime_streamflow_link);
		addLink($('#nwisweb_link'), nar.siteHelpInfo.nwisweb_link);
		addLink($('#daily_flows_link'), nar.siteHelpInfo.flow_compared_to_historic_link);
		
		// Add help popovers
		addHelpPopover('sampleConcentrations');
		addHelpPopover('annualFlowNormalizedConcentrations');
		addHelpPopover('annualLoad');
		
		$.when(getDataAvailabilityRequest).then(
			successfulGetDataAvailability,
			failedGetDataAvailability);
		selectorElementPairs.allPlotsWrapper.element.sortable();
		selectorElementPairs.allPlotsWrapper.element.disableSelection();
	});
});