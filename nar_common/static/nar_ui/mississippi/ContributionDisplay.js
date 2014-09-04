var nar = nar || {};
nar.ContributionDisplay = (function() {
	"use strict";
	var me = {};

	me.attributeColorMap = {
		"atch" : {
			"color" : "#B3A6A3",
			"title" : "Atchafalaya River"
		},
		"missouri" : {
			"color" : "#BFEBA8",
			"title" : "Missouri River"
		},
		"arkansas" : {
			"color" : "#FFCFD5",
			"title" : "Arkansas River"
		},
		"ohio" : {
			"color" : "#FCEFBE",
			"title" : "Ohio River"
		},
		"upper" : {
			"color" : "#00C9E2",
			"title" : "Upper Mississippi"
		},
		"upperMiddle" : {
			"color" : "#00F5FA",
			"title" : "Upper Middle Mississippi"
		},
		"lowerMiddle" : {
			"color" : "#CCE7F0",
			"title" : "Lower Middle Mississippi"
		},
		"lower" : {
			"color" : "#F3F2FB",
			"title" : "Lower Mississippi"
		}
	};
	
	me.create = function (args) {
		args = args || {};
		var containerSelector = args.containerSelector || 'body',
			$container = $(containerSelector),
			placement = args.placement,
			width = args.width || 200,
			height = args.height || 200,
			attributeKeys = Object.keys(me.attributeColorMap),
			// This goes away when we have real data
			generateRands = function(max, thecount) {
				var r = [];
				var currsum = 0;
				var randombetween = function(min, max) {
					  return Math.floor(Math.random()*(max-min+1)+min);
				};
				
				for(var i=0; i<thecount-1; i++) {
					r[i] = randombetween(1, max-(thecount-i-1)-currsum);
					currsum += r[i];
				}
				r[thecount-1] = max - currsum;
				return r;
			},
			// This goes away when we have real data
			randomCounts = generateRands(100, attributeKeys.length),
			data = args.data || (function (k, d) {
				// This goes away when we have real data
				var r = [];
				for (var kIdx = 0;kIdx < k.length;kIdx++) {
					r.push({
						'label' : k[kIdx],
						'data' : d[kIdx]
					});
				}
				return r;
			}(attributeKeys, randomCounts)),
			$chartDiv = $('<div />')
				.addClass('chart-miss-pie')
				.css({
					width : width,
					height : height
				});
		
		if (placement === 'bl') {
			$chartDiv.css({
				'left' : 0,
				'bottom' : 0,
				'position' : 'absolute',
				'z-index' : 750
			});
		} else if (placement === 'br') {
			$chartDiv.css({
				'right' : 0,
				'bottom' : 0,
				'position' : 'absolute',
				'z-index' : 750
			});
		}
		
		$container.append($chartDiv);
		
		$.plot($chartDiv, data, {
		    series: {
		        pie: {
		            show: true
		        }
		    },
		    grid: {
		        hoverable: true,
		        clickable: true
		    }
		});
		
	};
	
	/**
	 * Try to get an up-to-date SLD from Geoserver.
	 */
	me.retrieveSLD = function (args) {
		args = args || {};
		var sldName = args.sldName || 'miss8';
		
		// TODO - This should go against a live geoserver instance - This can be
		// done when we have access to the styles section of the REST api without
		// needing authentication
		$.ajax(CONFIG.staticUrl + 'nar_ui/mississippi/' + sldName + '.sld', {
			scope: {
				me : me
			},
			success : function (sldXml) {
				var sld = new OpenLayers.Format.SLD().read(sldXml),
					rules = sld.namedLayers[sldName].userStyles[0].rules;
				
				while (rules.length) {
					var rule = rules.pop();
					me.attributeColorMap[rule.name] = {
							color : rule.symbolizer.Polygon.fillColor,
							title : rule.title
					};
				}
			},
			error : function () {
				// Couldn't find SLD. Use the stand-by version
			}
		});
	};
	
	me.retrieveSLD();
	
	return {
		create : me.create
	};
	
})();