describe('Tests for nar.util', function() {
	
	it('Expects utility functions to be defined', function() {
		expect(nar.util.assert_selector_present).toBeDefined();
		expect(nar.util.getTimeStamp).toBeDefined();
	});
});