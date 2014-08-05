describe('nar.fullReport.PlotUtils', function() {
	describe('logTickFormatter', function() {
		var testFunc = nar.fullReport.PlotUtils.logTickFormatter;
		it('numbers greater than 0 should have no decimals', function() {
			expect(testFunc(1000)).toBe('1000');
			expect(testFunc(100)).toBe('100');
			expect(testFunc(10)).toBe('10');
			expect(testFunc(1)).toBe('1');
		});
		it('numbers less than zero should have the correct significance', function() {
			expect(testFunc(0.1)).toBe('0.1');
			expect(testFunc(0.01)).toBe('0.01');
			expect(testFunc(0.001)).toBe('0.001');
		});
		it('weird inputs should be handled properly', function() {
			expect(testFunc(1000.001)).toBe('1000');
			expect(testFunc(0.0100)).toBe('0.01');
		});
	});
	describe('utcDatePlotHoverFormatter', function() {
		var testFunc = nar.fullReport.PlotUtils.utcDatePlotHoverFormatter;
		it('should be ISO date with correct value', function() {
			expect(testFunc('01/01/2010', 17)).toBe('2010-01-01 : 17');
			expect(testFunc('12/11/1929', 0.13)).toBe('1929-12-11 : 0.13');
		});
	});

	describe('getDataSplitIntoCurrentAndPreviousYears using dates not up to current date', function () {
		var yearAndRndRandomNumber = [];
		for (var year = 1980;year < new Date().getFullYear();year++) {
			yearAndRndRandomNumber.push([new Date(year,'0','1','0','0','0').getTime(), Math.floor(Math.random() * 10) + 1]);
		}
		
		var allYearsExceptFewMostCurrent = { 
				data : [yearAndRndRandomNumber.slice(0, yearAndRndRandomNumber.length - 2)]
		};
		
		var inputObjectWithoutRecentYears = {
				timeSeriesCollection : {
					timeSeries : allYearsExceptFewMostCurrent,
					map : function(c) {
						return this.timeSeries.data;
					}
				}
		};
		
		var result = nar.fullReport.PlotUtils.getDataSplitIntoCurrentAndPreviousYears(inputObjectWithoutRecentYears);
		
		it('should return the expected result object with two properties', function () {
			expect(result).not.toBe(null);
			expect(Object.keys(result).length).toBe(2);
		});
		
		it('should have a currentYearDataElement array of length 0', function () {
			expect(result.currentYearData.length).toBe(0);
		});
		it('should have a previousYearsData array of length > 1', function () {
			expect(result.previousYearsData.length).not.toBe(0);
		});
		
	});
	
	describe('getDataSplitIntoCurrentAndPreviousYears using dates including current date', function () {
		var yearAndRndRandomNumber = [];
		for (var year = 1980;year < new Date().getFullYear();year++) {
			yearAndRndRandomNumber.push([new Date(year,'0','1','0','0','0').getTime(), Math.floor(Math.random() * 10) + 1]);
		}
		
		var inputObjectWithRecentYears = {
				timeSeriesCollection : {
					timeSeries : {
						data : [yearAndRndRandomNumber]
					},
					map : function(c) {
						return this.timeSeries.data;
					}
				}
		};
		
		var result = nar.fullReport.PlotUtils.getDataSplitIntoCurrentAndPreviousYears(inputObjectWithRecentYears);
		it('should have a currentYearDataElement array of length 1', function () {
			expect(result.currentYearData.length).not.toBe(0);
			expect(result.currentYearData.length).toBe(1);
		});
		it('should have a previousYearsData array of length == 1', function () {
			expect(result.previousYearsData.length).not.toBe(0);
		});
		
	});
	
	describe('longTermMean', function() {
		var start = nar.fullReport.PlotUtils.YEAR_NINETEEN_HUNDRED;
		var end = nar.fullReport.PlotUtils.ONE_YEAR_IN_THE_FUTURE;
		it('start should be before end', function() {
			expect(start).toBeLessThan(end);
		});
		it('values should be reasonable', function() {
			expect(start).toBeLessThan(0);
			expect(end).toBeGreaterThan(0);
			// Now restrict further, these may need to change
			expect(start).toBe(-2208967200000);
			expect(end).toBeGreaterThan(1438723569000);
		});
	});
});
