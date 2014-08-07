/**
 * Utilities to determine water year from regular dates and years
 */

var nar = nar || {};
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
		var sDate = date ? Date.create(date) : Date.create();
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
	 * Given a water year, provides a date that signifies the end of the water year
	 */
	var getWaterYearEnd = function (wy) {
        return Date.create(wy, 8, 30); // months are 0 indexed for some reason
    };
    

    /**
     * Given a range, provides the start and end water years
     * 
     * range : {
     *   start : Integer,
     *   end : Integer
     * }
     */
    var getWaterYearRange = function(range) {
		var wyStart,
			wyEnd,
			oct1 = Date.create(extractYear(range.start), 9, 1), // Oct 1 start year
			sep30 = Date.create(extractYear(range.end), 8, 30); // Sep 30 end year
		
		if (oct1.isAfter(range.start) || oct1.is(range.start)) {
			wyStart = oct1;
		} else {
			wyStart = oct1.advance('1 year');
		}
		
		if (sep30.isBefore(range.end) || sep30.is(range.end)) {
			wyEnd = sep30;
		} else {
			wyEnd = sep30.rewind('1 year');
		}
		return Date.range(wyStart, wyEnd);
	};
	

	/**
	 * Given a years range, gets the water years range as an array
	 */
	var getYearsAsArray = function(range, descending) {
		var years = [];
		if (range && range.start < range.end) {
			range.every('year', function(d) {
				if (descending) {
					years.unshift(convertDateToWaterYear(d));
				} else {
					years.push(convertDateToWaterYear(d));
				}
			});
		}
		return years;
	};
	
	return {
		extractYear : extractYear,
		convertDateToWaterYear : convertDateToWaterYear,
		getWaterYearStart : getWaterYearStart,
		getWaterYearEnd : getWaterYearEnd,
		getWaterYearRange : getWaterYearRange,
		getYearsAsArray : getYearsAsArray
	};

}());