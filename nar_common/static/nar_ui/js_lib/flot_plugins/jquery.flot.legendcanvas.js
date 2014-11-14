//based on https://raw.githubusercontent.com/lukesampson/flot/5922045d8bc233073ef3d102703aa74a037c7e54/jquery.flot.legendoncanvas.js
/**
 * user specifies canvas legend configuration by modifying the legend.canvas options object
 * {
 * .
 * .
 * .
 * legend:{
 * 		canvas: {
 * 			show: optional boolean, defaulting to true
 * 			position: "ne" or "nw" or "se" or "sw". Ignored if "container" option is specified.
 * 			height: Number, defaulting to null. Ignored if "container" option is specified.
 * 			width: Number, defaulting to null. Ignored if "container" option is specified.
 * 			margin: number of pixels or [x margin, y margin]. Ignored if "container" option is specified.
 * 			container: optional jQuery object wrapping a canvas element, or an actual canvas element, or null, defaulting to null.
 * 					If null, legend will be drawn on the plot's canvas. Else, legend will be drawn in the specified canvas and the "margin" and "position" options will be ignored.
 * 			sorted: optional null, false, true, "ascending", "descending", "reverse", or (function(seriesA, seriesB)->Number), defaulting to null.
 * 					If null or false, series are displayed in whatever order flot provides. If a function, the function is used to sort the order 
 * 					in which the series' legend entries are passed to the "render" function based on whether the function returns a positive or negative number.  
 * 			layout: optional (function(seriesIndex, previousEntryOriginX, previousEntryOriginY, previousEntryHeight, previousEntryWidth)->{nextEntryOriginX: Number, nextEntryOriginY: Number}) or null, defaulting to null.
 * 					If null, a vertical layout will be used. If a function, the resulting object's properties will be passed as entryOriginX and entryOriginY to the "render" function.
 * 					Ignored if "position" option is specified.
 * 			renderEntry: optional (function(legendCtx, series, options, entryOriginX, entryOriginY, fontOptions)->{entryWidth: Number, entryHeight: Number}), or null, defaulting to null.
 * 					If null, a box matching the color of the series is drawn to the left of the series text.
 * 			
 * 		}
 * }
 * 
 */

(function($) {

	function init(plot) {
		plot.hooks.processOptions.push(addLastDrawHook);
	}

	function addLastDrawHook(plot) {
		plot.hooks.draw.push(drawLegend);
	}
	function defaultRender(legendCtx, series, options, entryOriginX, entryOriginY, fontOptions){
		legendCtx.font = fontOptions.style + " " + fontOptions.variant + " " + fontOptions.weight + " " + fontOptions.size + "px '" + fontOptions.family + "'";
		legendCtx.textAlign = "left";
		legendCtx.textBaseline = "bottom";
        legendCtx.fillStyle="#F00";
        
	}
	function defaultLayout(seriesIndex, previousEntryOriginX, previousEntryOriginY, previousEntryHeight, previousEntryWidth){
		
	}
	// draws the legend on the canvas, using the HTML added by flot as a guide
	function drawLegend(plot, plotCtx) {
		var options = plot.getOptions();
		if(!(options.legend.canvas && options.legend.canvas.show)) return;

		var placeholder = plot.getPlaceholder();
		var fontOptions = {
				style: placeholder.css("font-style"),
				size: Math.round(+placeholder.css("font-size").replace("px", "") || 13),
				variant: placeholder.css("font-variant"),
				weight: placeholder.css("font-weight"),
				family: placeholder.css("font-family")
		};
		var render = options.legend.canvas.render || defaultRender;
		var layout = options.legend.canvas.layout || defaultLayout;
		//the legendCtx will either be plotCtx or the context from an external canvas,
		//depending on what is contained in canvas.container
		var legendCtx, isExternalLegend;
		var container = options.legend.canvas.container;
		if(container){
			isExternalLegend = true;
			if(!container.is('canvas')){
				container = $('<canvas/>').insertAfter(container);
			}
			legendCtx = $(container)[0].getContext('2d');
		}else{
			isExternalLegend = false;
			container = placeholder.find('.legend');;
			legendCtx = plotCtx;
		}
                

		function fontAscent() {
			return 12;
		}

		var series = plot.getData();
		var plotOffset = plot.getPlotOffset();
		var plotHeight = plot.height();
		var plotWidth = plot.width();
		var legendWidth = 0, legendHeight = 0;
		var num_labels = 0;
		var s, label;
		// get width of legend and number of valid legend entries
		for(var i = 0; i < series.length; ++i) {
			s = series[i];
			label = s.label;
			if(!label) continue;
			num_labels++;
			labelWidth = legendCtx.measureText(label).width;
                        if(options.legend.horizontal){
                            legendWidth+=labelWidth;
                        }else {
                            if(labelWidth > legendWidth) legendWidth = labelWidth}
		}
		var LEGEND_BOX_WIDTH = 22; // color box
		var PADDING_RIGHT = 5;
		var LEGEND_BOX_LINE_HEIGHT = 18;
                if (options.legend.horizontal){
                    legendWidth = legendWidth + num_labels*(LEGEND_BOX_WIDTH + PADDING_RIGHT);
                    legendHeight = LEGEND_BOX_LINE_HEIGHT;
                }else {
                    legendWidth = legendWidth + LEGEND_BOX_WIDTH + PADDING_RIGHT;
                    legendHeight = num_labels * LEGEND_BOX_LINE_HEIGHT;
                }
		
		var x, y;
		if(isExternalLegend) {
			x = 0
			y = 0;
		} else {
			var pos = "";
			var p = options.legend.position;
			var m = options.legend.margin;
			if(m[0] == null) m = [m, m];
			if(p.charAt(0) == "n"){
				y = Math.round(plotOffset.top + options.grid.borderWidth + m[1]);
			}
			else if(p.charAt(0) == "s"){
				y = Math.round(plotOffset.top + options.grid.borderWidth + plotHeight - m[0] - legendHeight);
			}
			if(p.charAt(1) == "e"){
				x = Math.round(plotOffset.left + options.grid.borderWidth + plotWidth - m[0] - legendWidth);
			}
			else if(p.charAt(1) == "w"){
				x = Math.round(plotOffset.left + options.grid.borderWidth + m[0]);
			}
			if(options.legend.backgroundOpacity != 0.0) {
				var c = options.legend.backgroundColor;
				if(c == null) c = options.grid.backgroundColor;
				if(c && typeof c == "string") {
					legendCtx.globalAlpha = options.legend.backgroundOpacity;
					legendCtx.fillStyle = c;
					legendCtx.fillRect(x, y, legendWidth, legendHeight);
					legendCtx.globalAlpha = 1.0;
				}
			}
		}
		var posx=x+2, posy;
		for(var i = 0; i < series.length; ++i) {
			s = series[i];
			if (options.legend.horizontal){
	            posy = y+2;
			}else{
	           posx=x;
	           posy = y + (i * 18);
			}
			boxLegend(legendCtx, s, options, posx, posy, lf, fontOptions);
			if (options.legend.horizontal){
	            posx = posx +  legendCtx.measureText(label).width+PADDING_RIGHT;
	        }
		}
		if(!isExternalLegend){
			container.hide(); // hide the HTML version
		}
	}
	/**
	 * @returns [Number, Number] - an array [the width of the drawn legend entry, and the height of the drawn legend entry]
	 */
	function boxLegend(legendCtx, series, options, posx, posy, labelFormatter, fontOptions){
		label = series.label;
		if(!label) continue;
		if(lf) label = labelFormatter(label, series);
                    
		
		legendCtx.fillStyle = options.legend.labelBoxBorderColor;
		legendCtx.fillRect(posx, posy, 18, 14);
		legendCtx.fillStyle = "#FFF";
		legendCtx.fillRect(posx + 1, posy + 1, 16, 12);
		legendCtx.fillStyle = s.color;
		legendCtx.fillRect(posx + 2, posy + 2, 14, 10);
		posx = posx + 22;
		posy = posy + f.size + 2;

		legendCtx.fillStyle = options.legend.color;
		legendCtx.fillText(label, posx, posy);
	}

	$.plot.plugins.push({
		init: init,
		options: {},
		name: 'legendoncanvas',
		version: '1.0'
	});
})(jQuery);