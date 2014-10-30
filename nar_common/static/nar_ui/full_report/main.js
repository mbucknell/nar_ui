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
	var modtypeToIgnore = 'comp';
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
	
	/**
	 * Given time series visualization components, return a hierarchical id that will produce a tree like the one in the mockups
	 *  @param {nar.timeSeries.Visualization.IdComponents} timeSeriesIdComponents
	 *  @returns {String}, a '/'-delimited string denoting tree display hierarchy
	 */
	var getTreeDisplayHierarchy = function(timeSeriesIdComponents){
		var constituentId = timeSeriesIdComponents.constituent;
		var constituent = nar.Constituents[constituentId];
		var constituentName = constituent.name;
		var topLevel, bottomLevel;
		if('streamflow' === constituentId){
			if(timeSeriesIdComponents.timestepDensity === 'annual'){
				topLevel = 'Annual';
			}
			else if (timeSeriesIdComponents.timestepDensity === 'daily'){
				topLevel = 'Hydrograph and Flow Duration';
			}
		}
		else{
			//non-flow constituents
			if(timeSeriesIdComponents.category === 'concentration'){
				topLevel = 'Concentrations';
				if(timeSeriesIdComponents.timestepDensity === 'discrete'){
					bottomLevel = 'Sample';
				}
				else{
					bottomLevel = timeSeriesIdComponents.subcategory.split('_').map(String.capitalize).join(' ');
				}
			}
			else if (timeSeriesIdComponents.category === 'mass'){
				topLevel = 'Loads';
				if(timeSeriesIdComponents.timestepDensity === 'annual'){
					bottomLevel = 'Annual';
				}
				else{
					console.dir(timeSeriesIdComponents);
					throw Error("Can't place time series visualization in tree hierarchy");
				}
			}
			else{
				console.dir(timeSeriesIdComponents);
				throw Error("Can't place time series visualization in tree hierarchy");
			}
		}
		var newIdElements =[constituentName, topLevel];
		if(bottomLevel){
			newIdElements.push(bottomLevel);
		}
		var newId = newIdElements.join('/');
		return newId;
	};
	
	var tsvRegistry = nar.timeSeries.VisualizationRegistryInstance;
	var successfulGetDataAvailability = function(data,
			textStatus, jqXHR) {
		var dataAvailability = data.dataAvailability;
				
		dataAvailability.each(function(dataAvailability) {
			var observedProperty = dataAvailability.observedProperty;
			var procedure = dataAvailability.procedure;
			var timeSeriesVizId = tsvRegistry
					.getTimeSeriesVisualizationId(observedProperty, procedure);
			var timeSeriesIdComponents = nar.timeSeries.Visualization.getComponentsOfId(timeSeriesVizId);
			
			if(		timeSeriesIdComponents.modtype === modtypeToIgnore 
					|| !constituentsToKeep.some(timeSeriesIdComponents.constituent) 
					|| componentsAreIgnorable(timeSeriesIdComponents, acceptableComponentsGroup)){
				return;//continue
			}
			else{
				var treeDisplayHierarchy = getTreeDisplayHierarchy(timeSeriesIdComponents);
				var timeSeriesViz = tsvRegistry
						.get(newTsvId);
				if (!timeSeriesViz) {
					timeSeriesViz = new nar.timeSeries.Visualization(
							{
								id : newTsvId,
								treeDisplayHierarchy: treeDisplayHierarchy,
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