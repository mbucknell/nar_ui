var nar = nar || {};
nar.GraphPopup = (function() {
	"use strict";
	var me = {};
	var tsvRegistry = new nar.fullReport.TimeSeriesVisualizationRegistry();
	me.popups = [];
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
		var timeRange = new nar.fullReport.TimeRange(nar.fullReport.TimeRange.START_TIME_CUTOFF, nar.fullReport.TimeRange.END_TIME_CUTOFF);
		
		var basicTimeSeries = new nar.fullReport.TimeSeries({
			observedProperty: observedProperty,
			procedure: procedure,
			featureOfInterest: siteId,
			timeRange: timeRange
		});

		//@todo: add more time series for  moving average,
		//@todo: baseline average,reduction target are not time series, so need to figure out another way to draw those
		//values on the plot
		
		var timeSeriesCollection = new nar.fullReport.TimeSeriesCollection();
		timeSeriesCollection.add(basicTimeSeries);
		
		var timeSeriesVizId = tsvRegistry.getIdForObservedProperty(observedProperty);
		var timeSeriesViz = new nar.fullReport.TimeSeriesVisualization({
			id: timeSeriesVizId,
			allPlotsWrapperElt:target,
			timeSeriesCollection: timeSeriesCollection
		});
		var promise = timeSeriesViz.visualize();
		
		return promise;
	};

	me.create = function(args) {
		var appendToSelector = args.appendToSelector || 'body',
			popupAnchor = args.popupAnchor,
			type = args.type,
			width = args.width || null,
			maxHeight = args.maxHeight || null,
			constituent = args.constituent,
			contentDiv = $('<div />').addClass('miss-content-div'),
			content,
			title,
			feature = args.feature,
			$container = $('<div />').attr('id', 'miss-' + type + '-container').addClass('hidden'),
			$dialog = $('<div />').attr('id', 'miss-' + type + '-content'),
			$closeButtonContent = $('<span />').addClass('glyphicon glyphicon-remove nar-popup-dialog-close-icon'),
			dialog;
		me.destroyAllPopups();
		
		$dialog.append(contentDiv);
		$container.append($dialog);
		$('body').append($container);
		
		dialog = $container.children().first().dialog({
			appendTo : 'body',
			title : title,
			resizable : false,
			width: width || 'auto',
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
			innerContent = $('<div />').addClass('well well-sm text-center').append($('<div />').addClass('row mississippi-grap-pup-content-graph'));
			if(constituent){
				innerContent.html('Loading...');
				me.createLoadGraphDisplay({
					siteId: feature.data.siteid,
					constituent: constituent,
					target: innerContent,
					loadType: type
				});

				title = type + ' load for ' + constituent + ' at ' + feature.data.staname;
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
		
		me.popups.push(dialog);
		
		return dialog;
	};

	/**
	 * Remove all current popups
	 */
	me.destroyAllPopups = function () {
		while (me.popups.length > 0) {
			var popup = me.popups.pop();
			popup.dialog('close');
			popup.dialog('destroy');
		}
	};
	
	return {
		create : me.create,
		createMayLoadGraph : me.createMayLoadGraph,
		createAnnualLoadGraph : me.createAnnualLoadGraph,
		destroyAllPopups : me.destroyAllPopups
	};
})();