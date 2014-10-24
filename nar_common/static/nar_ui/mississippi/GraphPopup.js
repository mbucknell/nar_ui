var nar = nar || {};
nar.GraphPopup = (function() {
	"use strict";
	var me = {};
	
	var DIALOG_ID = 'miss-graph-dialog-container';
	var POPUP_ID = 'miss-graph-dialog-content';
	
	var tsvRegistry = new nar.timeSeries.VisualizationRegistry();
	me.popup = undefined;
	me.timeSeriesViz = undefined;
	var mrbToSos = {
			constituentToConstituentId : {
				'tn' : 'NH3',
				'no23': 'NO23',
				'tp' : 'TP',
			},
			loadTypeToDataType : {
				'annual' : 'annual_load',
				'may' : 'may_load'
			}
	};
	
	/**
	 * Creates the load graph  
	 * @param {Object} args - with properties
	 *     siteId : String - the id of the site represented on the graph
	 *     constituent : String - the constituent to graph
	 *     loadType : String - the load type (annual or may)
	 *     target : The div element where the graph will be created.
	 * @ return a promise. The promise is resolved when the visualization has been created.
	 */
	me.createLoadGraphDisplay = function(args){
		var siteId = args.siteId,
		mrbConstituent = args.constituent,
		loadType = args.loadType,
		target = args.target,
		sosDefinitionBaseUrl = 'http://cida.usgs.gov/def/NAR/',
		observedPropertyUrlTemplate = sosDefinitionBaseUrl + 'property/{constituentId}/{dataType}',
		procedureUrlTemplate = sosDefinitionBaseUrl + 'procedure/{constituentId}';
		
		var sosUrlParams = {
				constituentId : mrbToSos.constituentToConstituentId[mrbConstituent],
				dataType : mrbToSos.loadTypeToDataType[loadType]
		};
		
		var observedProperty= observedPropertyUrlTemplate.assign(sosUrlParams);
		var procedure = procedureUrlTemplate.assign(sosUrlParams);
		
		var basicTimeSeries = new nar.timeSeries.TimeSeries({
			observedProperty: observedProperty,
			procedure: procedure,
			featureOfInterest: siteId,
		});

		// Generate additional time series for baseline average, 45% reduction targets, and baseline-average
		var siteDataDeferred = $.Deferred();
		if (args.siteId) {
			$.ajax({
				url : CONFIG.siteAveTargetUrl,
				data : {
					site_id : args.siteId,
					constituent : mrbToSos.constituentToConstituentId[mrbConstituent]
				},
				contentType : 'application/json',
				success : function(response) {
					var data = {
						mean : response[loadType + '_mean'],
						target : response[loadType + '_target'],
						movingAverage : []
					};
					var i;
					for (i = 0; i < response.moving_average.length; i++) {
						var movAve = response.moving_average[i];
						if (movAve[loadType + '_moving_average']) {
							data.movingAverage.push({
								waterYear : movAve.water_year,
								ave : movAve[loadType + '_moving_average']
							});
						}
					}

					siteDataDeferred.resolve(data);
				},
				error : function(data) {
					siteDataDeferred.resolve({});
					throw Error('Unable to retrieve average and targets');
				}
			});
		} 
		else if (loadType === 'may') {
			// In this case we will be graphing the observed hypoxic area on the
			// graph so need to retrieve it.
			$.ajax({
				url : CONFIG.gulfHypoxicExtentUrl,
				contentType : 'application/json',
				success : function(response) {
					var i;
					var data = {
						gulfHypoxicExtent : response
					};
					siteDataDeferred.resolve(data);
				},
				error : function(data) {
					siteDataDeferred.resolve({});
					throw Error('Unable to retrieve Gulf hypoxic extent data');
				}
			});
		}
		else {
			siteDataDeferred.resolve({});
		}
		
		var timeSeriesCollection = new nar.timeSeries.Collection();
		timeSeriesCollection.add(basicTimeSeries);
		
		var timeSeriesVizId = tsvRegistry.getIdForObservedProperty(observedProperty);
		
		var vizDeferred = $.Deferred();
		var promise = vizDeferred.promise();
		
		// Wait until the siteData has been retrieved before creating the visualization
		$.when(siteDataDeferred).then(function(response) {
			me.timeSeriesViz = new nar.timeSeries.Visualization({
				id : timeSeriesVizId,
				allPlotsWrapperElt : target,
				timeSeriesCollection : timeSeriesCollection,
				auxData : response
			});
			$.when(me.timeSeriesViz.visualize()).then(function(data) {
				vizDeferred.resolve(data);
			}, function(data) {
				vizDeferred.reject(data);
			});
		});

        return promise;
	};

	me.create = function(args) {
		var appendToSelector = args.appendToSelector || 'body',
			popupAnchor = args.popupAnchor,
			type = args.type,
			width = args.width || null,
			height = args.height || null,
			minHeight = args.minHeight || null,
			maxHeight = args.maxHeight || null,
			constituent = args.constituent,
			contentDiv = $('<div />').addClass('miss-content-div'),
			title = args.title || '',
			feature = args.feature,
			$container = $('<div />').attr('id', DIALOG_ID).addClass('hidden'),
			$dialog = $('<div />').attr('id', POPUP_ID),
			$closeButtonContent = $('<span />').addClass('glyphicon glyphicon-remove nar-popup-dialog-close-icon'),
			dialog;
		if (me.popup) {
			me.popup.dialog('close');
		}
		
		$dialog.append(contentDiv);
		$container.append($dialog);
		$('body').append($container);
		
		dialog = $container.children().first().dialog({
			close : me.destroyPopup,
			appendTo : appendToSelector,
			title : title,
			resizable : false,
			width: width || 'auto',
			height : height || 'auto',
			minHeight : minHeight || false,
			maxHeight : maxHeight || false,
			dialogClass : args.dialogClass || 'miss-popup-dialog',
			$closeButtonContent : $('<span />').addClass('glyphicon glyphicon-remove nar-popup-dialog-close-icon'),
			position : {
				my: 'left top',
				at: 'left top',
				of: popupAnchor
			}
		});
		
		dialog.updateConstituent = function(constituent){
			var innerContent, title;
            var YEAR_MS = nar.util.MILLISECONDS_IN_YEAR;

			innerContent = $('<div />').addClass('graph-info well well-sm text-center').append($('<div />').addClass('row mississippi-grap-pup-content-graph'));
			if(constituent){
				innerContent.html('Loading...');
				contentDiv.html('');
				me.createLoadGraphDisplay({
					siteId: feature.siteid,
					constituent: constituent,
					target: contentDiv,
					loadType: type
				}).then(
				function() {
					$('.graph-info').remove();

					// Adjust axis to match time range
					var options, timeRange;
					if (me.timeSeriesViz.plot) {
						options = me.timeSeriesViz.plot.getOptions();
						timeRange = me.timeSeriesViz.timeSeriesCollection.getTimeRange();
						// Adjust the axis so the bars are inside the plot
						options.xaxes.each(function(axis) {
							axis.min = timeRange.startTime - YEAR_MS;
							axis.max = timeRange.endTime + YEAR_MS;
						});
						me.timeSeriesViz.plot.setupGrid();
						me.timeSeriesViz.plot.draw();
					}
					
					title = type.capitalize() + ' Load for ' + 
                    nar.Constituents[me.timeSeriesViz.getComponentsOfId().constituent].name + 
                    ' at ' + feature.staname;
					dialog.dialog('option', 'title', title);
				},
				function(reason) {
					innerContent.html('Error retrieving the data');
				}) ;
			}
			else{
				title = 'Error';
				innerContent.html('Error - Select a nutrient type from the dropdown above the opposite map');
			}
			// query-ui has a hierarchy of things it tries to auto-focus on. This hack has it auto-focus on a hidden span.
			// Otherwise it trues to focus on the first link, which in some browsers will draw an outline around it. (ugly)
			// http://api.jqueryui.com/dialog/
			var $hiddenAutoFocus = $('<span />').addClass('hidden').attr('autofocus', '');
			contentDiv.append($hiddenAutoFocus, innerContent);
			dialog.dialog('option', 'title', title);
			return dialog;
		};
		dialog.updateConstituent(constituent);
		// Replace the orange button icon with a bootstrap glyphicon
		dialog.parent().find('button').empty().append($closeButtonContent);
		
		me.popup = dialog;
		
		return dialog;
	};

	/**
	 * Remove the current popup
	 */
	me.destroyPopup = function () {
		if (me.timeSeriesViz) {
			me.timeSeriesViz.remove();
			me.timeSeriesViz = null;
		}
		if (me.popup) {
			me.popup.dialog('destroy');
			$('#' + DIALOG_ID).remove();
			me.popup = null;			
		}
	};
	
	return {
		create : me.create,
		destroyPopup : me.destroyPopup
	};
})();