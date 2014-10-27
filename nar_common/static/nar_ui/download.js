//select2 script

$(document).ready(function() { 
	var NUMBER_OF_YEARS_BACK = 100;
	var SITE_LAYER_NAME = "NAR:JD_NFSN_sites0914";
	var STATION_ID_PROPERTY = "siteid";
	var STATION_NAME_PROPERTY = "staname";
	var SITE_TYPE_PROPERTY = "sitetype";
	var STATE_LIST = {
			"AL": "Alabama",
			"AK": "Alaska",
			"AS": "American Samoa",
			"AZ": "Arizona",
			"AR": "Arkansas",
			"CA": "California",
			"CO": "Colorado",
			"CT": "Connecticut",
			"DE": "Delaware",
			"DC": "District Of Columbia",
			"FM": "Federated States Of Micronesia",
			"FL": "Florida",
			"GA": "Georgia",
			"GU": "Guam",
			"HI": "Hawaii",
			"ID": "Idaho",
			"IL": "Illinois",
			"IN": "Indiana",
			"IA": "Iowa",
			"KS": "Kansas",
			"KY": "Kentucky",
			"LA": "Louisiana",
			"ME": "Maine",
			"MH": "Marshall Islands",
			"MD": "Maryland",
			"MA": "Massachusetts",
			"MI": "Michigan",
			"MN": "Minnesota",
			"MS": "Mississippi",
			"MO": "Missouri",
			"MT": "Montana",
			"NE": "Nebraska",
			"NV": "Nevada",
			"NH": "New Hampshire",
			"NJ": "New Jersey",
			"NM": "New Mexico",
			"NY": "New York",
			"NC": "North Carolina",
			"ND": "North Dakota",
			"MP": "Northern Mariana Islands",
			"OH": "Ohio",
			"OK": "Oklahoma",
			"OR": "Oregon",
			"PW": "Palau",
			"PA": "Pennsylvania",
			"PR": "Puerto Rico",
			"RI": "Rhode Island",
			"SC": "South Carolina",
			"SD": "South Dakota",
			"TN": "Tennessee",
			"TX": "Texas",
			"UT": "Utah",
			"VT": "Vermont",
			"VI": "Virgin Islands",
			"VA": "Virginia",
			"WA": "Washington",
			"WV": "West Virginia",
			"WI": "Wisconsin",
			"WY": "Wyoming"
		};
	
	var defaultDateLimits = {
		minDate : "-" + NUMBER_OF_YEARS_BACK + "Y",
		maxDate: "+0D",
	};
	
	var datepickerOptions = defaultDateLimits;
	$.extend(datepickerOptions, {
		yearRange: "-" + NUMBER_OF_YEARS_BACK + "Y:+0D",
		changeMonth: true,
		changeYear: true
	});
	
	$("#startDateTime").datepicker(datepickerOptions);
	$("#endDateTime").datepicker(datepickerOptions);
	
	$("#startDateTime").change(function() {
		$('#endDateTime').datepicker('option', 'minDate', $(this).datepicker('getDate'));
	});
	$('#endDateTime').change(function() {
		$('#startDateTime').datepicker('option', 'maxDate', $(this).datepicker('getDate'));
	});
	
	//populate html, then init select 2
	var stateEl = $("#state");
	for(var state in STATE_LIST) {
		var opt = $('<option>');
		opt.attr('value', state);
		opt.html(state + " - " + STATE_LIST[state]);
		stateEl.append(opt);
	}
	stateEl.select2({
		placeholder: "Select a State (optional)"
	}); 
	
	$.ajax({
		url: CONFIG.endpoint.geoserver +
		"ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + SITE_LAYER_NAME + 
		"&outputFormat=json",
		async: false,
		dataType: "json",
		success: function(data) {
			//loop through features collecting stations and site types
			var stations = {};
			var siteTypes = {};
			
			for(var i = 0; i < data.features.length; i++) {
				var props = data.features[i].properties;
				if(!siteTypes[props[SITE_TYPE_PROPERTY]]) {
					siteTypes[props[SITE_TYPE_PROPERTY]] = props[SITE_TYPE_PROPERTY];
				}
				if(!stations[props[STATION_ID_PROPERTY]]) {
					stations[props[STATION_ID_PROPERTY]] = props[STATION_NAME_PROPERTY];
				}
			}

			
			var stationId = $("#stationId");
			var opt;
			for(var station in stations) {
				opt = $('<option>');
				opt.attr('value', station);
				opt.html(station + " - " + stations[station]);
				stationId.append(opt);
			}
			stationId.select2({
				placeholder: "Select a Station (optional)",
				allowClear: true
			});

			var siteTypeEl = $("#siteType");
			for(var siteType in siteTypes) {
				opt = $('<option>');
				opt.attr('value', siteType);
				opt.html(siteTypes[siteType]);
				siteTypeEl.append(opt);
			}
			siteTypeEl.select2({
				placeholder: "Select a Site Type (optional)",
				allowClear: true
			});
		},
		context: this
	});

	$("#constituent").select2({
		placeholder: "Select a Constituent (optional)",
		allowClear: true
	});

	$("#qwDataType").select2({
		placeholder: "Select a Water Quality Data Type (optional)",
		allowClear: true
	});

	$('#streamFlowType').select2({
		placeholder : 'Select a Stream Flow Time Series',
		allowClear : true
	});

	// Utility function to enable/disable elements
	var toggleElement = function($el, enable) {
		if (enable) {
			$el.removeAttr('disabled');
		} else {
			$el.attr('disabled', 'disabled');
		}
	};

	var toggleDownloadButton = function(){
		toggleElement($('download-button'), $('input[name="dataType"]').is(':checked'));
	};
	$('input[name="dataType"]').on('click', toggleDownloadButton);
	toggleDownloadButton();
	
	var toggleWaterQuality = function() {
		var on = $('#waterQuality').is(':checked');
		var $constituent = $('#constituent');
		var $qwDataType = $('#qwDataType');
		
		toggleElement($constituent, on);
		toggleElement($qwDataType, on);
		if (!on) {
			$constituent.select2('val', []);
			$qwDataType.select2('val', []);
		}
	};
	$('#waterQuality').on('click', toggleWaterQuality);
	toggleWaterQuality();
	
	var toggleStreamFlow = function() {
		var on = $('#streamFlow').is(':checked');
		var $streamFlow = $('#streamFlowType');
		
		toggleElement($streamFlow, on);
		if (!on) {
			$streamFlow.select2('val', []);
		}
	};
	$('#streamFlow').on('click', toggleStreamFlow);	
	toggleStreamFlow();
	
	$('#clear-filters-button').on('click', function () {
		$('.select2-container').select2('val','');
		$('input[type="checkbox"]').prop('checked', false);
		$('.hasDatepicker').val('');
		$('.hasDatepicker').datepicker('option', defaultDateLimits);
		toggleDownloadButton();
		toggleWaterQuality();
		toggleStreamFlow();
	});
		
	$('#download-button').on('click', function (event) {
		event.preventDefault();
		var url = CONFIG.endpoint.download + "bundle/zip?" + $('#downloadForm').serialize();
		window.open(url, 'Download');
	});

});//doc ready