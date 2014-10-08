var nar = nar || {};
nar.GraphPopup = (function() {
	"use strict";
	var me = {};
	
	var DIALOG_ID = 'miss-graph-dialog-container';
	var POPUP_ID = 'miss-graph-dialog-content';
	
	var tsvRegistry = new nar.fullReport.TimeSeriesVisualizationRegistry();
	me.popup;
	me.timeSeriesViz;
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
		
		var basicTimeSeries = new nar.fullReport.TimeSeries({
			observedProperty: observedProperty,
			procedure: procedure,
			featureOfInterest: siteId,
		});

		//@todo: add more time series for  moving average,
		//@todo: baseline average,reduction target are not time series, so need to figure out another way to draw those
		//values on the plot
		
		var timeSeriesCollection = new nar.fullReport.TimeSeriesCollection();
		timeSeriesCollection.add(basicTimeSeries);
		
		var timeSeriesVizId = tsvRegistry.getIdForObservedProperty(observedProperty);
		me.timeSeriesViz = new nar.fullReport.TimeSeriesVisualization({
			id: timeSeriesVizId,
			allPlotsWrapperElt:target,
			timeSeriesCollection: timeSeriesCollection
		});
		var promise = me.timeSeriesViz.visualize();
		
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
			innerContent = $('<div />').addClass('graph-info well well-sm text-center').append($('<div />').addClass('row mississippi-grap-pup-content-graph'));
			if(constituent){
				innerContent.html('Loading...');
				contentDiv.html('');
				me.createLoadGraphDisplay({
					siteId: feature.data.siteid,
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
						options.xaxes.each(function(axis) {
							axis.min = timeRange.startTime;
							axis.max = timeRange.endTime;
						});
						me.timeSeriesViz.plot.setupGrid();
						me.timeSeriesViz.plot.draw();
					}
				},
				function(reason) {
					innerContent.html('Error retrieving the data');
				}) ;

				title = type.capitalize() + ' Load for ' + 
					nar.Constituents[me.timeSeriesViz.getComponentsOfId().constituent].name + 
					' at ' + feature.data.staname;
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