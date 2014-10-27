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
	
	$("#startDateTime").datepicker({
		minDate: "-" + NUMBER_OF_YEARS_BACK + "Y",
		maxDate: "+0D",
		yearRange: "-" + NUMBER_OF_YEARS_BACK + "Y:+0D",
		changeMonth: true,
		changeYear: true
	}); 

	$("#endDateTime").datepicker({
		minDate: "-" + NUMBER_OF_YEARS_BACK + "Y",
		maxDate: "+0D",
		yearRange: "-" + NUMBER_OF_YEARS_BACK + "Y:+0D",
		changeMonth: true,
		changeYear: true
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
		placeholder: "Select a State"
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
			for(var station in stations) {
				var opt = $('<option>');
				opt.attr('value', station);
				opt.html(station + " - " + stations[station]);
				stationId.append(opt);
			}
			stationId.select2({
				placeholder: "Select a Station",
				allowClear: true
			});

			var siteTypeEl = $("#siteType");
			for(var siteType in siteTypes) {
				var opt = $('<option>');
				opt.attr('value', siteType);
				opt.html(siteTypes[siteType]);
				siteTypeEl.append(opt);
			}
			siteTypeEl.select2({
				placeholder: "Select a Site Type",
				allowClear: true
			});
		},
		context: this
	});

	$("#constituent").select2({
		placeholder: "Select a Constituent",
		allowClear: true
	});

	$("#qwDataType").select2({
		placeholder: "Select a Water Quality Data Type",
		allowClear: true
	});


	$('#clear-filters-button').on('click', function () {
		$('.select2-container').select2('val','');
		$('input[type="checkbox"]').prop('checked', false);
	});

	var getSelectedDataTypes = function() {
		var selectedTypes = $('#downloadForm').find('input[name="dataType"]:checked');
		var selectedTypesVals = [];
		for(var i = 0; i < selectedTypes.length; i++) {
			selectedTypesVals.push(selectedTypes[i].value);
		}
		return ""+selectedTypesVals;
	};
	
	var toggleDownloadButton = function(){
		var selectedDataTypes = getSelectedDataTypes();
		if(selectedDataTypes) {
			$('#download-button').removeAttr('disabled');
		} else {
			$('#download-button').attr('disabled', 'disabled');
		}
	};
	$('input[name="dataType"]').on('click', toggleDownloadButton);
	toggleDownloadButton();
	
	$('#download-button').on('click', function () {
		//collect params
		var params = {};
		var format = $('#downloadForm').find('input[name="format"]:checked').val();
		if(format) {
			params['format'] = format;
		}
		
		var selectedDataTypes = getSelectedDataTypes();
		if(selectedDataTypes) {
			params['dataType'] = selectedDataTypes;
		}
		
		var qwDataType = $('#downloadForm').find('select[name="qwDataType"]').val();
		if(qwDataType) {
			params['qwDataType'] = qwDataType;
		}
		
		var constituent = $('#downloadForm').find('select[name="constituent"]').val();
		if(constituent) {
			params['constituent'] = constituent;
		}
			
		var siteType = $('#downloadForm').find('select[name="siteType"]').val();
		if(siteType) {
			params['siteType'] = siteType;
		}
			
		var stationId = $('#downloadForm').find('select[name="stationId"]').val();
		if(stationId) {
			params['stationId'] = stationId;
		}
			
		var state = $('#downloadForm').find('select[name="state"]').val();
		if(state) {
			params['state'] = state;
		}
		
		var startDateTime = $('#downloadForm').find('input[name="startDateTime"]').val();
		if(startDateTime) {
			params['startDateTime'] = startDateTime;
		}
		
		var endDateTime = $('#downloadForm').find('input[name="endDateTime"]').val();
		if(endDateTime) {
			params['endDateTime'] = endDateTime;
		}
		
		var url = CONFIG.endpoint.download + "bundle/zip?" + jQuery.param(params, true);
		window.open(url, 'Download');
	});

});//doc ready