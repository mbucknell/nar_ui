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
	var TimeSeries = nar.fullReport.TimeSeries;
	var timeSeries = new TimeSeries({
		observedProperty: 'mockPropertyUrl',
		procedure: 'mockProcedureUrl',
		timeRange : new nar.fullReport.TimeRange(0, 10000)
	});
	
	it('should correctly parse SOS GetResult Responses', function(){
		var mockResponse = {resultValues:'3@1970-01-01T00:00:00Z,1@1970-01-02T00:00:00Z,2@1970-01-03T00:00:00Z,3'};
		var resultData = timeSeries.parseSosGetResultResponse(mockResponse);
		expect(resultData).not.toBe(null);
		expect(resultData.length).toBe(3);
		resultData.every(function(row){
			expect(row.length).toBe(2);
		});
		
		expect(resultData[0][0]).toBe(0);
		expect(resultData[0][1]).toBe('1');
		
		expect(resultData[1][0]).toBe(86400000);
		expect(resultData[1][1]).toBe('2');
		
		expect(resultData[2][0]).toBe(172800000);
		expect(resultData[2][1]).toBe('3');
	});
});
