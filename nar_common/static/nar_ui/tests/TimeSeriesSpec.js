describe('nar.timeSeries.TimeRange', function(){
	
	var TimeRange = nar.timeSeries.TimeRange;
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
	describe('nar.timeSeries.TimeRange.ofAll', function(){
		it('should include the lowest of lows and highest of highs among multiple time ranges,', function(){
			var copyOfTimeRangeA = timeRangeA.clone();
			aggregateTimeRange = TimeRange.ofAll([timeRangeA, timeRangeB]);
			expect(aggregateTimeRange.startTime).toBe(globalLowestTime);
			expect(aggregateTimeRange.endTime).toBe(globalLargestTime);
			//ensure that the first time range passed in is not modified by the calculation
			expect(timeRangeA.equals(copyOfTimeRangeA)).toBe(true);
		});
	});

	describe('cutoff', function() {
		var cutoffStartTime = nar.timeSeries.TimeRange.START_TIME_CUTOFF;
		var customCutoffStartTime = new Date(1995, 0, 1).getTime();
		var startTime = new Date(1990, 0, 1).getTime();
		var currentWaterYear = nar.WaterYearUtils.convertDateToWaterYear(Date.create());
		var endTime = new Date(currentWaterYear, 0, 1).getTime();
		var cutoffEndTime = nar.timeSeries.TimeRange.END_TIME_CUTOFF;
		var customCutoffEndTime = new Date(2011, 0, 1).getTime();

		it('can cutoff at default times', function() {
			var result = new nar.timeSeries.TimeRange(startTime, endTime);

			expect(result).not.toBe(null);
			expect(result.startTime).toBe(startTime);
			expect(result.endTime).toBe(endTime);

			result.trimStartTime();
			expect(result.startTime).not.toBe(startTime);
			expect(result.endTime).toBe(endTime);
			expect(result.startTime).toBe(cutoffStartTime);

			result.trimEndTime();
			expect(result.endTime).not.toBe(endTime);
			expect(result.endTime).toBe(cutoffEndTime);
			expect(result.startTime).toBe(cutoffStartTime);
		});

		it('can specify custom cutoff dates', function(){
			var result = new nar.timeSeries.TimeRange(startTime, endTime);

			expect(result).not.toBe(null);
			expect(result.startTime).toBe(startTime);
			expect(result.endTime).toBe(endTime);

			result.trimStartTime();
			expect(result.startTime).not.toBe(startTime);
			expect(result.endTime).toBe(endTime);
			expect(result.startTime).toBe(cutoffStartTime);

			result.trimEndTime();
			expect(result.endTime).not.toBe(endTime);
			expect(result.endTime).toBe(cutoffEndTime);
			expect(result.startTime).toBe(cutoffStartTime);

			result.trimStartTime(customCutoffStartTime);
			expect(result.startTime).not.toBe(startTime);
			expect(result.startTime).not.toBe(cutoffStartTime);
			expect(result.startTime).toBe(customCutoffStartTime);

			result.trimEndTime(customCutoffEndTime);
			expect(result.endTime).not.toBe(endTime);
			expect(result.endTime).not.toBe(cutoffEndTime);
			expect(result.endTime).toBe(customCutoffEndTime);
		});

		it("doesn't cutoff if real data is within the time", function() {
			var result = new nar.timeSeries.TimeRange(customCutoffStartTime, customCutoffEndTime);

			expect(result).not.toBe(null);
			expect(result.startTime).toBe(customCutoffStartTime);
			expect(result.endTime).toBe(customCutoffEndTime);
			expect(result.startTime).toBeGreaterThan(cutoffStartTime);
			expect(result.endTime).toBeLessThan(cutoffEndTime);

			result.trimStartTime();
			result.trimEndTime();

			expect(result.startTime).toBe(customCutoffStartTime);
			expect(result.startTime).not.toBe(cutoffStartTime);
			expect(result.startTime).toBeGreaterThan(cutoffStartTime);
			expect(result.endTime).toBe(customCutoffEndTime);
			expect(result.endTime).not.toBe(cutoffEndTime);
			expect(result.endTime).toBeLessThan(cutoffEndTime);
		});
	});
});
describe('nar.timeSeries.TimeSeries', function(){
	
	var TimeSeries = nar.timeSeries.TimeSeries;
	var timeSeries = new TimeSeries({
		observedProperty: 'mockPropertyUrl',
		procedure: 'mockProcedureUrl',
		timeRange : new nar.timeSeries.TimeRange(0, 10000)
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
	
	describe('retrieveData', function() {
		var server, successSpy, errorSpy;
		
		beforeEach(function() {
			timeSeries.parseSosGetResultResponse = jasmine.createSpy('parseSosGetResultRepsonse');
			server = sinon.fakeServer.create();
			successSpy = jasmine.createSpy('successSpy');
			errorSpy = jasmine.createSpy('errorSpy');
		});
		afterEach(function() {
			server.restore();
		});
	
		it('should return a resolved promise when successfully retrieving data', function() {
			CONFIG = {
					endpoint : {
						sos : 'http://fakesosendpoint'
					}
			};
			var promise = timeSeries.retrieveData().then(successSpy, errorSpy);
			server.requests[0].respond(200, {'Content-type' : 'application/json'}, '{"resultValues": {"prop1" : "Prop1"}}');
			
			expect(successSpy).toHaveBeenCalled();
		});
		it('should return a resolved promise when successfully retrieving data', function() {
			CONFIG = {
					endpoint : {
						sos : 'http://fakesosendpoint'
					}
			};
			var promise = timeSeries.retrieveData().then(successSpy, errorSpy);
			server.requests[0].respond(500, {'Content-type' : 'application/json'}, '{"resultValues": {"prop1" : "Prop1"}}');
			
			expect(errorSpy).toHaveBeenCalled();
		});
	});
});

describe('nar.timeSeries.DataAvailabilityTimeRange', function() {
	var cutoffStartTime = nar.timeSeries.TimeRange.START_TIME_CUTOFF;
	var startTime = new Date(1990, 0, 1).getTime();
	var currentWaterYear = nar.WaterYearUtils.convertDateToWaterYear(Date.create());
	var endTime = new Date(currentWaterYear, 0, 1).getTime();
	var cutoffEndTime = nar.timeSeries.TimeRange.END_TIME_CUTOFF;
	
	it('should give me start and end dates by trimming', function() {
		var result = new nar.timeSeries.DataAvailabilityTimeRange({
			phenomenonTime : [startTime, endTime]
		})
		
		expect(result).not.toBe(null);
		expect(result.startTime).toBe(cutoffStartTime);
		expect(result.startTime).not.toBe(startTime);
		expect(result.endTime).toBe(cutoffEndTime);
		expect(result.endTime).not.toBe(endTime);
	});
	
	it('should give me start and end dates by not trimming', function() {
		var useOriginalStartTime = true;
		
		var result = new nar.timeSeries.DataAvailabilityTimeRange({
			phenomenonTime : [startTime, endTime]
		}, useOriginalStartTime)
		
		expect(result).not.toBe(null);
		expect(result.startTime).not.toBe(cutoffStartTime);
		expect(result.startTime).toBe(startTime);
		expect(result.endTime).not.toBe(cutoffEndTime);
		expect(result.endTime).toBe(endTime);
	});
});
