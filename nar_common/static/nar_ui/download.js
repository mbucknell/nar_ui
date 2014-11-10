var nar = nar || {};
nar.downloads = (function() {
	"use strict";
	var pubMembers = {};
	
	var NUMBER_OF_YEARS_BACK = 100;
	var SITE_LAYER_NAME = "NAR:JD_NFSN_sites0914";
	var STATION_ID_PROPERTY = "siteid";
	var STATION_NAME_PROPERTY = "staname";
	var SITE_TYPE_PROPERTY = "sitetype";
	var STATE_PROPERTY = "state";
	var MRB_VALUE = 'MRB';
	var MS_SITE_ATTR_NAME = 'MSSite';
	var MS_SITE_VALUE = 'MS';
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
	
	pubMembers.updateSelect2Options = function(select2El, values, placeHolderText, displayKey) {
		var previousValues = select2El.select2('val');
		select2El.find('option') .remove();
		for(var val in values) {
			var opt = $('<option>');
			opt.attr('value', val);
			if(displayKey) {
				opt.html(val + " - " + values[val]);
			} else {
				opt.html(values[val]);
			}
			select2El.append(opt);
		}
		select2El.select2('destroy');
		select2El.select2({
			placeholder: placeHolderText,
			allowClear: true
		});
		select2El.select2('val', previousValues).trigger("change");
	};
	
	pubMembers.getFilteredSiteTypeOptions = function(stationData, selectedStates){
		//loop through features collecting  site types
		var siteTypes = {};
		
		for(var i = 0; i < stationData.features.length; i++) {
			var props = stationData.features[i].properties;
			if(!siteTypes[props[SITE_TYPE_PROPERTY]] //only add to values object if property hasn't already been added
				&& (!selectedStates || selectedStates.length <= 0 || selectedStates.some(props[STATE_PROPERTY]))//only add if has state prop in state list (if state list exists)
				) {
				siteTypes[props[SITE_TYPE_PROPERTY]] = props[SITE_TYPE_PROPERTY];
			}
		}
		
		//Add in MRB, a special case not part of the database
		siteTypes["MRB"] = "MRB";
		
		return siteTypes;
	};
	
	pubMembers.getFilteredStationIdsOptions = function(stationData, selectedStates, selectedSiteTypes) {
		//loop through features collecting stations
		var stations = {};
		
		var mrbSelected = false; //used to detect if we have to filter down to Mississipi sites
		if(selectedSiteTypes && selectedSiteTypes.some(MRB_VALUE)) {
			mrbSelected = true;
			selectedSiteTypes.remove(MRB_VALUE); //remove so stations are not expected to have type MRB, which doesn't exist as a real site type
		}
		for(var i = 0; i < stationData.features.length; i++) {
			var props = stationData.features[i].properties;
			if(!stations[props[STATION_ID_PROPERTY]] //only add to values object if property hasn't already been added
				&& (!selectedStates || selectedStates.length <= 0 || selectedStates.some(props[STATE_PROPERTY])) //only add if has state prop in state list (if state list exists)
				&& (!selectedSiteTypes || selectedSiteTypes.length <= 0 || selectedSiteTypes.some(props[SITE_TYPE_PROPERTY]))//only add if site type prop in site type list (if site type list exists)
				) {
				if(mrbSelected) {
					//only add station if it is flagged as MS
					if(props[MS_SITE_ATTR_NAME] === MS_SITE_VALUE) {
						stations[props[STATION_ID_PROPERTY]] = props[STATION_NAME_PROPERTY];
					}
				} else {
					stations[props[STATION_ID_PROPERTY]] = props[STATION_NAME_PROPERTY];
				}
			}
		}
		
		return stations;
	};
	
	// Utility function to enable/disable elements
	pubMembers.toggleElement = function($el, enable) {
		if (enable) {
			$el.removeAttr('disabled');
		} else {
			$el.attr('disabled', 'disabled');
		}
	};
	
	pubMembers.toggleDownloadButton = function(){
		pubMembers.toggleElement($('download-button'), $('input[name="dataType"]').is(':checked'));
	};
	
	pubMembers.toggleWaterQuality = function() {
		var on = $('#waterQuality').is(':checked');
		var $constituent = $('#constituent');
		var $qwDataType = $('#qwDataType');
		
		pubMembers.toggleElement($constituent, on);
		pubMembers.toggleElement($qwDataType, on);
		if (!on) {
			$constituent.select2('val', []);
			$qwDataType.select2('val', []);
		}
	};
	
	pubMembers.toggleStreamFlow = function() {
		var on = $('#streamFlow').is(':checked');
		var $streamFlow = $('#streamFlowType');
		
		pubMembers.toggleElement($streamFlow, on);
		if (!on) {
			$streamFlow.select2('val', []);
		}
	};
	
	pubMembers.filterSiteTypesByState = function(stationData, selectedStates) {
		pubMembers.updateSelect2Options(
				$("#siteType"), 
				pubMembers.getFilteredSiteTypeOptions(stationData, selectedStates), 
				"Select a Site Type (optional)",
				false
				);
	};
	
	pubMembers.filterStationsByStateAndType = function(stationData, selectedStates, selectedSiteTypes) {
		pubMembers.updateSelect2Options(
				$("#stationId"), 
				pubMembers.getFilteredStationIdsOptions(stationData, selectedStates, selectedSiteTypes), 
				"Select a Station (optional)",
				true
				);
	};
	
	pubMembers.loadAndRenderSiteFilters = function() {
		var STATION_DATA;
		$.ajax({
			url: CONFIG.endpoint.geoserver +
			"ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + SITE_LAYER_NAME + 
			"&outputFormat=json",
			async: false,
			dataType: "json",
			success: function(data) {
				STATION_DATA = data; //save to singleton
				
				//get initial drop down states to render
				var selectedStates = $("#state").select2('val');
				var selectedSiteTypes = $("#siteType").select2('val');
				pubMembers.filterSiteTypesByState(STATION_DATA, selectedStates);
				pubMembers.filterStationsByStateAndType(STATION_DATA, selectedStates, $("#siteType").select2('val'));
				
				//wire filters
				$("#state").on('change', function() {
					var selectedStates = $("#state").select2('val');
					pubMembers.filterSiteTypesByState(STATION_DATA, selectedStates);
					pubMembers.filterStationsByStateAndType(STATION_DATA, selectedStates, $("#siteType").select2('val'));
				});
				$("#siteType").on('change', function() {
					pubMembers.filterStationsByStateAndType(STATION_DATA, $("#state").select2('val'), $("#siteType").select2('val'));
				});
			},
			context: this
		});
	};
	
	pubMembers.initDownloadPage = function() {
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
		pubMembers.updateSelect2Options($("#state"), STATE_LIST, "Select a State (optional)", true);
		
		//will hold a one time fetch of all station data
		pubMembers.loadAndRenderSiteFilters();
	
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
	
		$('input[name="dataType"]').on('click', pubMembers.toggleDownloadButton);
		pubMembers.toggleDownloadButton();
		
		$('#waterQuality').on('click', pubMembers.toggleWaterQuality);
		pubMembers.toggleWaterQuality();
		
		$('#streamFlow').on('click', pubMembers.toggleStreamFlow);	
		pubMembers.toggleStreamFlow();
		
		$('#clear-filters-button').on('click', function () {
			$('.select2-container').select2('val','');
			$('input[type="checkbox"]').prop('checked', false);
			$('.hasDatepicker').val('');
			$('.hasDatepicker').datepicker('option', defaultDateLimits);
			pubMembers.toggleDownloadButton();
			pubMembers.toggleWaterQuality();
			pubMembers.toggleStreamFlow();
		});
			
		$('#download-button').on('click', function (event) {
			event.preventDefault();
			var url = CONFIG.endpoint.nar_webservice + "download/bundle/zip?" + $('#downloadForm').serialize();
			window.open(url, 'Download');
		});
	};
	
	return pubMembers;
}());
