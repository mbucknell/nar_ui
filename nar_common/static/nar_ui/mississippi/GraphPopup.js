var nar = nar || {};
nar.GraphPopup = (function() {
	"use strict";
	var me = {};
	
	me.popups = [];
	
	me.createAnnualLoadGraphDisplay = function(args) {
		var feature = args.feature,
			$container = $('<div />').addClass('well well-sm text-center'),
			$graphRow = $('<div />').addClass('row mississippi-grap-pup-content-graph'),
			// query-ui has a hierarchy of things it tries to auto-focus on. This hack has it auto-focus on a hidden span.
			// Otherwise it trues to focus on the first link, which in some browsers will draw an outline around it. (ugly)
			// http://api.jqueryui.com/dialog/
			$hiddenAutoFocus = $('<span />').addClass('hidden').attr('autofocus', '');
	
		
		// TODO - Put graph content into the graph row
		$graphRow.append($('<img />').attr('src', CONFIG.staticUrl + 'nar_ui/images/miss-stock-graph.png'));
		
		$container.append($graphRow, $hiddenAutoFocus);
		return $container;
	};
	
	me.createMayLoadGraphDisplay = function(args) {
		// TODO - Split out functionality once we have a task to create two different graphs
		return me.createAnnualLoadGraphDisplay(args);
	};
	me.create = function(args) {
		var appendToSelector = args.appendToSelector || 'body',
			popupAnchor = args.popupAnchor,
			type = args.type,
			width = args.width || null,
			maxHeight = args.maxHeight || null,
			filtersSubject = args.filtersSubject,
			content = args.content || null,
			title = args.title || type + " load for " + filtersSubject.mostRecentNotification.chemical;,
			$container = $('<div />').attr('id', 'miss-' + type + '-container').addClass('hidden'),
			$dialog = $('<div />').attr('id', 'miss-' + type + '-content'),
			$closeButtonContent = $('<span />').addClass('glyphicon glyphicon-remove nar-popup-dialog-close-icon'),
			dialog;
		me.destroyAllPopups();
		var filtersChangeHandler = function(){
			var argsClone = Object.clone(args);
			delete argsClone.content;
			me.create(args);
			
		};
		filtersSubject.observe(filtersChangeHandler);
		if(!content){
			if (type === 'annual') {
				content = me.createAnnualLoadGraphDisplay(args);
				
			} else {
				content = me.createAnnualLoadGraphDisplay(args);
			}
		}
		$dialog.append(content);
		$container.append($dialog);
		$('body').append($container);
		
		dialog = $container.children().first().dialog({
			appendTo : 'body',
			title : title,
			resizable : false,
			width: width || 'auto',
			maxHeight : maxHeight || false,
			dialogClass : args.dialogClass || 'miss-popup-dialog',
			beforeClose: function(event, ui){
				filtersSubject.unobserve(filtersChangeHandler);
			},
			$closeButtonContent : $('<span />').addClass('glyphicon glyphicon-remove nar-popup-dialog-close-icon'),
			position : {
				my: 'left top',
				at: 'left top',
				of: popupAnchor
			}
		});
		
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