var nar = nar || {};
nar.fullReport = nar.fullReport || {};
nar.WaterYearUtils = (function () {
	"use strict";
	
	/**
	 * Extracts a 4 digit number from a date year
	 */
	var extractYear = function (date) {
		return date.format('{yyyy}').toNumber();
	};
	
	/**
	 * Converts a provided date (yyyy) to a water year
	 */
	var convertDateToWaterYear = function (date) {
		var sDate = Date.create(date);
		var year = extractYear(sDate);
		if (sDate.is('October') || sDate.is('November') || sDate.is('December')) {
			year = year + 1;
		}
		return year;
	};
	
	/**
	 * Given a water year, provides a date that signifies the start of the water year
	 */
	var getWaterYearStart = function (waterYear) {
		// Months are 0-indexed
		return Date.create(waterYear - 1, 9, 1);
	};
	
	/**
	 * 
	 */
	var getWaterYearEnd = function(wy) {
        return Date.create(wy, 8, 30); // months are 0 indexed for some reason
    };
	
	return {
		extractYear : extractYear,
		convertDateToWaterYear : convertDateToWaterYear,
		getWaterYearStart : getWaterYearStart,
		getWaterYearEnd : getWaterYearEnd
	};
	
}());