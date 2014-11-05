var nar = nar || {};
nar.downloads = (function() {
	"use strict";
	var me = {};
	
	var NUMBER_OF_YEARS_BACK = 100;
	var SITE_LAYER_NAME = "NAR:JD_NFSN_sites0914";
	var STATION_ID_PROPERTY = "siteid";
	var STATION_NAME_PROPERTY = "staname";
	var SITE_TYPE_PROPERTY = "sitetype";
	var STATE_PROPERTY = "state";
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
	
	me.updateSelect2Options = function(select2El, values, placeHolderText) {
		var previousValues = select2El.val();
		select2El.find('option') .remove();
		for(var val in values) {
			var opt = $('<option>');
			opt.attr('value', val);
			opt.html(values[val]);
			select2El.append(opt);
		}
		select2El.select2('destroy');
		select2El.select2({
			placeholder: placeHolderText,
			allowClear: true
		});
		select2El.val(previousValues).trigger("change");
	};
	
	me.getFilteredSiteTypeOptions = function(stationData, selectedStates){
		//loop through features collecting  site types
		var siteTypes = {};
		
		for(var i = 0; i < stationData.features.length; i++) {
			var props = stationData.features[i].properties;
			if(!siteTypes[props[SITE_TYPE_PROPERTY]] 
				&& (!selectedStates || selectedStates.some(props[STATE_PROPERTY]))
				) {
				siteTypes[props[SITE_TYPE_PROPERTY]] = props[SITE_TYPE_PROPERTY];
			}
		}
		
		//Add in MRB
		siteTypes["MRB"] = "MRB";
		
		//rerender
		me.updateSelect2Options($("#siteType"), siteTypes, "Select a Site Type (optional)");
	};
	
	me.getFilteredStationIds = function(stationData, selectedStates, selectedSiteTypes) {
		//loop through features collecting stations
		var stations = {};
		
		if(selectedSiteTypes) selectedSiteTypes.remove('MRB');
		for(var i = 0; i < stationData.features.length; i++) {
			var props = stationData.features[i].properties;
			if(!stations[props[STATION_ID_PROPERTY]]
				&& (!selectedStates || selectedStates.some(props[STATE_PROPERTY]))
				&& (!selectedSiteTypes || selectedSiteTypes.some(props[SITE_TYPE_PROPERTY]))
				) {
				stations[props[STATION_ID_PROPERTY]] = props[STATION_NAME_PROPERTY];
			}
		}
		
		//rerender
		me.updateSelect2Options($("#stationId"), stations, "Select a Station (optional)");
	};
	
	// Utility function to enable/disable elements
	me.toggleElement = function($el, enable) {
		if (enable) {
			$el.removeAttr('disabled');
		} else {
			$el.attr('disabled', 'disabled');
		}
	};
	
	me.toggleDownloadButton = function(){
		me.toggleElement($('download-button'), $('input[name="dataType"]').is(':checked'));
	};
	
	me.toggleWaterQuality = function() {
		var on = $('#waterQuality').is(':checked');
		var $constituent = $('#constituent');
		var $qwDataType = $('#qwDataType');
		
		me.toggleElement($constituent, on);
		me.toggleElement($qwDataType, on);
		if (!on) {
			$constituent.select2('val', []);
			$qwDataType.select2('val', []);
		}
	};
	
	me.toggleStreamFlow = function() {
		var on = $('#streamFlow').is(':checked');
		var $streamFlow = $('#streamFlowType');
		
		me.toggleElement($streamFlow, on);
		if (!on) {
			$streamFlow.select2('val', []);
		}
	};
	
	me.loadAndRenderSiteFilters = function() {
		var STATION_DATA;
		$.ajax({
			url: CONFIG.endpoint.geoserver +
			"ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + SITE_LAYER_NAME + 
			"&outputFormat=json",
			async: false,
			dataType: "json",
			success: function(data) {
				STATION_DATA = data;
				var selectedStates = $("#state").val();
				var selectedSiteTypes = $("#siteType").val();
				me.getFilteredSiteTypeOptions(STATION_DATA, selectedStates);
				me.getFilteredStationIds(STATION_DATA, selectedStates, selectedSiteTypes);
				
				//wire filters
				$("#state").on('change', function() {
					var selectedStates = $("#state").val();
					var selectedSiteTypes = $("#siteType").val();
					me.getFilteredSiteTypeOptions(STATION_DATA, selectedStates);
					me.getFilteredStationIds(STATION_DATA, selectedStates, selectedSiteTypes);
				});
				$("#siteType").on('change', function() {
					var selectedStates = $("#state").val();
					var selectedSiteTypes = $("#siteType").val();
					me.getFilteredStationIds(STATION_DATA, selectedStates, selectedSiteTypes);
				});
			},
			context: this
		});
	};
	
	me.initDownloadPage = function() {
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
		me.updateSelect2Options($("#state"), STATE_LIST, "Select a State (optional)");
		
		//will hold a one time fetch of all station data
		me.loadAndRenderSiteFilters();
	
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
	
		$('input[name="dataType"]').on('click', me.toggleDownloadButton);
		me.toggleDownloadButton();
		
		$('#waterQuality').on('click', me.toggleWaterQuality);
		me.toggleWaterQuality();
		
		$('#streamFlow').on('click', me.toggleStreamFlow);	
		me.toggleStreamFlow();
		
		$('#clear-filters-button').on('click', function () {
			$('.select2-container').select2('val','');
			$('input[type="checkbox"]').prop('checked', false);
			$('.hasDatepicker').val('');
			$('.hasDatepicker').datepicker('option', defaultDateLimits);
			me.toggleDownloadButton();
			me.toggleWaterQuality();
			me.toggleStreamFlow();
		});
			
		$('#download-button').on('click', function (event) {
			event.preventDefault();
			var url = CONFIG.endpoint.download + "bundle/zip?" + $('#downloadForm').serialize();
			window.open(url, 'Download');
		});
	};
	
	return me;
}());
