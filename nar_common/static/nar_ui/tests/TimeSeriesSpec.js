
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
