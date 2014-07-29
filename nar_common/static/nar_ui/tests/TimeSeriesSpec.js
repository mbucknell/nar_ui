describe('nar.fullReport.TimeRange', function(){
	var TimeRange = nar.fullReport.TimeRange;
	var globalLowestTime = 0;
	var globalLargestTime = 10000;
	var timeRangeA = new TimeRange(globalLowestTime, globalLargestTime - 1);
	var timeRangeSameAsA = new TimeRange(globalLowestTime, globalLargestTime - 1);
	var timeRangeB = new TimeRange(globalLowestTime + 1, globalLargestTime);
	describe('equals', function(){
		it('should determine that two identically-valued objects are equal', function(){
			//basic case
			expect(timeRangeA.equals(timeRangeA)).toBe(true);
			//less-trivial case
			expect(timeRangeA.equals(timeRangeSameAsA)).toBe(true);
			expect(timeRangeSameAsA.equals(timeRangeA)).toBe(true);
		});
		it('should determine that two non-identically-valued objects are not equal', function(){
			expect(timeRangeA.equals(timeRangeB)).toBe(false);
			expect(timeRangeB.equals(timeRangeA)).toBe(false);
		});
	});
	describe('clone', function(){
		it('should produce clones that .equal() the original', function(){
			expect(timeRangeA.clone().equals(timeRangeA)).toBe(true);
		});
	});
	describe('nar.fullReport.TimeRange.ofAll', function(){
		it('should include the lowest of lows and highest of highs among multiple time ranges,', function(){
			var copyOfTimeRangeA = timeRangeA.clone();
			aggregateTimeRange = TimeRange.ofAll([timeRangeA, timeRangeB]);
			expect(aggregateTimeRange.startTime).toBe(globalLowestTime);
			expect(aggregateTimeRange.endTime).toBe(globalLargestTime);
			//ensure that the first time range passed in is not modified by the calculation
			expect(timeRangeA.equals(copyOfTimeRangeA)).toBe(true);
		});
	});
});
describe('nar.fullReport.TimeSeries', function(){
	
});
