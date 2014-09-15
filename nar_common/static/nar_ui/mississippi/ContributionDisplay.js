var nar = nar || {};
nar.ContributionDisplay = (function() {
	"use strict";
	var me = {};

	me.attributeColorMap = {
		"ATCHAFALAYA" : {
			"color" : "#B3A6A3",
			"title" : "Atchafalaya River",
			"shpAttr" : "atch"
		},
		"MISSOURI" : {
			"color" : "#BFEBA8",
			"title" : "Missouri River",
			"shpAttr" : "missouri"
		},
		"ARKANSAS" : {
			"color" : "#FFCFD5",
			"title" : "Arkansas River",
			"shpAttr" : "missouri"
		},
		"OHIO" : {
			"color" : "#FCEFBE",
			"title" : "Ohio River",
			"shpAttr" : "ohio"
		},
		"UPPERMISS" : {
			"color" : "#00C9E2",
			"title" : "Upper Mississippi",
			"shpAttr" : "upper"
		},
		"UPPERMIDDLEMISS" : {
			"color" : "#00F5FA",
			"title" : "Upper Middle Mississippi",
			"shpAttr" : "upperMiddle"
		},
		"LOWERMIDDLEMISS" : {
			"color" : "#CCE7F0",
			"title" : "Lower Middle Mississippi",
			"shpAttr" : "lowerMiddle"
		},
		"LOWERMISS" : {
			"color" : "#F3F2FB",
			"title" : "Lower Mississippi",
			"shpAttr" : "lower"
		}
	};
	
	me.getConstituentData = function (args) {
		args = args || {};
		var callbacks = args.callbacks,
			parameters = args.parameters;
		
		$.ajax(CONFIG.baseUrl + 'values/mrbSubBasinContributions/', {
			data : parameters,
			scope : me,
			success : callbacks.success,
			error : callbacks.error
		});
	};
	
	me.createPie = function (args) {
		var data = args.data,
			containerSelector = args.containerSelector,
			$container = $(containerSelector),
			placement = args.placement,
			width = args.width,
			height = args.height,
			zIndex = 1006,
			sortedData = (function(data){
				var sortedData = [];
				for (var k in data) {
					if (data.hasOwnProperty(k) && data[k] && me.attributeColorMap[k]) {
						var percentage = (data[k] * 100).toFixed(2),
							label = me.attributeColorMap[k].title,
							color = me.attributeColorMap[k].color;
						sortedData.push({
							label : label,
							data : percentage,
							color : color
						});
					}
				}
				return sortedData;
			}(data)),
			$chartDiv = $('<div />')
				.addClass('chart-miss-pie')
				.css({
					width : width,
					height : height,
					'z-index' : zIndex
				}),
			$legendContainer = $('<div />')
				.addClass('chart-miss-legend')
				.css({
					width : width,
					height : height,
					position : 'absolute',
					'z-index' : zIndex
				});
		
		if (placement === 'bl') {
			$chartDiv.css({
				'left' : 0,
				'bottom' : 0,
				'position' : 'absolute',
				'z-index' : zIndex
			});
			$legendContainer.css({
				'left' : width,
				'bottom' : 0,
				'z-index' : zIndex
			});
		} else if (placement === 'br') {
			$chartDiv.css({
				'right' : 0,
				'bottom' : 0,
				'position' : 'absolute',
				'z-index' : zIndex
			});
			$legendContainer.css({
				'left' : $container.width() - width * 2,
				'bottom' : 0,
				'z-index' : zIndex
			});
		}
		
		$container.append($chartDiv, $legendContainer);
		
		$.plot($chartDiv, sortedData, {
			series : {
				pie : {
					legendContainer : $legendContainer,
					container : $chartDiv,
					show : true,
					radius: 1,
					label : {
						show: true,
						radius: 4/5,
						formatter : function (label, series) {
							return "<div style='font-size:8pt; text-align:center; padding:2px; color:black; opacity:0.2'>" + series.percent.toFixed(2) + "%</div>";
						}
					}
				}
			},
			legend : {
				show: true,
				container : $legendContainer
				// The backgroundColor and backgroundOpacity options don't seem 
				// to work here so it's been added to CSS instead
			},
			grid : {
				hoverable : true,
				clickable : true
			}
		});
		
		$chartDiv.on('plothover', function(event, pos, obj) {
			var $legend,
				$label,
				$labels;
			if (obj) {
				$(event.target.getElementsByClassName('pieLabel')).find('div').css('opacity', '0.2');
				obj.series.pie.legendContainer.find('table tr').css('font-weight', '');
				$(obj.series.pie.legendContainer.find('table tr')[obj.seriesIndex]).css('font-weight', 'bold');
				$labels = $(event.target.getElementsByClassName('pieLabel')).find('div');
				$label = $($labels.get(obj.seriesIndex));
				$label.css('opacity', '1');
				
			} else {
				$legend = $(event.target.nextElementSibling);
				$legend.find('table tr').css('font-weight', '');
				$(event.target.getElementsByClassName('pieLabel')).find('div').css('opacity', '0.2');
			}
		});
	};
	
	me.create = function (args) {
		args = args || {};
		
		var containerSelector = args.containerSelector || 'body',
		placement = args.placement,
		width = args.width || 200,
		height = args.height || 200,
		attributeKeys = Object.keys(me.attributeColorMap);
		
		me.getConstituentData({
			parameters : args.parameters,
			callbacks : {
				success : function(data) {
					me.createPie({
						data : data,
						containerSelector : containerSelector,
						placement : placement,
						width : width,
						height : height
					});
				},
				error : function() {
					// Do nothing. The data was (probably) not found
				}
			}
		});
	};
	
	return {
		create : me.create
	};
	
})();