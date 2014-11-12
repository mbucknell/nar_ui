//https://raw.githubusercontent.com/lukesampson/flot/5922045d8bc233073ef3d102703aa74a037c7e54/jquery.flot.legendoncanvas.js
(function($) {

	function init(plot) {
		plot.hooks.processOptions.push(addLastDrawHook);
	}

	function addLastDrawHook(plot) {
		plot.hooks.draw.push(drawLegend);
	}

	// draws the legend on the canvas, using the HTML added by flot as a guide
	function drawLegend(plot, plotCtx) {
		var options = plot.getOptions();
		if(!(options.legend.show && options.legend.canvas)) return;

		var placeholder = plot.getPlaceholder();
		var legendCtx, isExternalLegend;
		var container = options.legend.container;
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
		
		var f = {
			style: placeholder.css("font-style"),
			size: Math.round(0.8 * (+placeholder.css("font-size").replace("px", "") || 13)),
			variant: placeholder.css("font-variant"),
			weight: placeholder.css("font-weight"),
			family: placeholder.css("font-family")
		};
                
		legendCtx.font = f.style + " " + f.variant + " " + f.weight + " " + f.size + "px '" + f.family + "'";
		legendCtx.textAlign = "left";
		legendCtx.textBaseline = "bottom";
                legendCtx.fillStyle="#F00";
		function fontAscent() {
			return 12;
		}

		var series = plot.getData();
		var plotOffset = isExternalLegend ? 0 : plot.getPlotOffset();
		var plotHeight = isExternalLegend ? 0 : plot.height();
		var plotWidth = isExternalLegend ? 0 : plot.width();
		var lf = options.legend.labelFormatter;
		var legendWidth = 0, legendHeight = 0;
		var num_labels = 0;
		var s, label;
		// get width of legend and number of valid legend entries
		for(var i = 0; i < series.length; ++i) {
			s = series[i];
			label = s.label;
			if(!label) continue;
			num_labels++;
			if(lf) label = lf(label, s);
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
			x = $(options.legend.container).offset().left;
			y = $(options.legend.container).offset().top;
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
			label = s.label;
			if(!label) continue;
			if(lf) label = lf(label, s);
                        if (options.legend.horizontal){
                             posy = y+2;
                        }else{
                            posx=x;
                            posy = y + (i * 18);
                        }
			
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
                        if (options.legend.horizontal){
                            posx = posx +  legendCtx.measureText(label).width+PADDING_RIGHT;
                        }
		}

		container.hide(); // hide the HTML version
	}

	$.plot.plugins.push({
		init: init,
		options: {},
		name: 'legendoncanvas',
		version: '1.0'
	});
})(jQuery);