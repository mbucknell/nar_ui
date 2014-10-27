describe('Tests for nar.util', function() {
	
	it('Expects utility functions to be defined', function() {
		expect(nar.util.assert_selector_present).toBeDefined();
		expect(nar.util.getTimeStamp).toBeDefined();
		expect(nar.util.objectHasKeysAndValues).toBeDefined();
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
	describe('nar.util.objectHasKeysAndValues', function(){
		var objectHasKeysAndValues = nar.util.objectHasKeysAndValues; 
		var base = {a: 1, b:undefined, c:null, d:'blah'};

		//identical case
		expect(objectHasKeysAndValues(base, base)).toBe(true);
		//clone case
		var baseClone = {a: 1, b:undefined, c:null, d:'blah'};
		expect(objectHasKeysAndValues(base, baseClone)).toBe(true);
		//subset cases
		var baseSubset1 = {a: 1, b:undefined, c:null};
		var baseSubset2 = {b:undefined, c:null, d: 'blah'};
		expect(objectHasKeysAndValues(base, baseSubset1)).toBe(true);
		expect(objectHasKeysAndValues(base, baseSubset2)).toBe(true);
		//superset cases
		var baseSuperset1 ={a: 1, b:undefined, c:null, d:'blah', e: '34'};
		var baseSuperset2 ={a: 1, b:undefined, c:null, d:'blah', e: '34', f: 42};
		expect(objectHasKeysAndValues(base, baseSuperset1)).toBe(false);
		expect(objectHasKeysAndValues(base, baseSuperset2)).toBe(false);
		//case where objects have same keys, but fail strict-equality value comparison
		var a = {d:[]};
		var b = {d:[]};
		var e = {g:{}};
		var f = {g:{}};
		expect(objectHasKeysAndValues(a, b)).toBe(false);
		expect(objectHasKeysAndValues(e, f)).toBe(false);
		//case where objects have no shared keys
		var noSharedBase = {w:'', x:'', y:'', z:''}
		expect(objectHasKeysAndValues(base, noSharedBase)).toBe(false);
		//case where objects have matching keys but no matching values
		var sharedKeysButDifferentValues = {a: 42, b:235, c:3456, d:302498}
		expect(objectHasKeysAndValues(base, noSharedBase)).toBe(false);
	});
	
});