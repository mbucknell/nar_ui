describe('Tests for nar.util', function() {
	
	it('Expects utility functions to be defined', function() {
		expect(nar.util.assert_selector_present).toBeDefined();
		expect(nar.util.getTimeStamp).toBeDefined();
	});
	describe('getTimeStamp', function(){
		var getTimeStamp = nar.util.getTimeStamp;
		it('gets the correct timestamp for a date object', function(){
			expect(getTimeStamp(Date.utc.create(0))).toBe(0);
		});
		it('gets the correct timestamp for an ISO-8601 date string', function(){
			var unixEpoch = '1970-01-01T00:00:00Z';
			expect(getTimeStamp(unixEpoch)).toBe(0);
		});
		it('gets the correct timestamp for a number', function(){
			expect(getTimeStamp(0)).toBe(0);
		});
	});
	describe('assert_selector_present', function(){
		var assert_selector_present = nar.util.assert_selector_present;
		it('throws an exception if called with a selector that does not match an existing element', function(){
			var bogusSelector = '#noWayJoseYouArentEvenThere';
			expect(function(){assert_selector_present(bogusSelector);}).toThrow();
		});
		it('does not throw an exception if called with a selector that matches an existing element', function(){
			
			var id = 'myAwesomeId';
			var selector = '#' + id;
			//this is appending script tag to the head because 'body' is not always loaded when the spec runner
			//has loaded
			$('head').append($('<script></script>', {id: id}));
			expect(
				function(){assert_selector_present(selector);}
			).not.toThrow();
		});
	});
	
});