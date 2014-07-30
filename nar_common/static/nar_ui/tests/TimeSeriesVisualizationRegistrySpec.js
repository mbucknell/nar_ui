$(document).ready(function(){
	describe('nar.fullReport.TimeSeriesVisualizationRegistry', function(){
		var tsvRegistry = nar.fullReport.TimeSeriesVisualizationRegistry;
		var tsvId = 'purple';
		//html fixtures:
		var instructionsElement = $('<div class="instructions"></div>');
		var allPlotsWrapperElement = $('<div class="plotsWrapper"></div>');
		$('body').append([instructionsElement, allPlotsWrapperElement]);
		
		var tsv = new nar.fullReport.TimeSeriesVisualization({
			id: tsvId,
			plotter: function(){
				throw Exception('not yet implemented');
			},
			timeSeriesCollection: new nar.fullReport.TimeSeriesCollection(),
			instructionsElt: instructionsElement,
			allPlotsWrapperElement: allPlotsWrapperElement
		});
		
		describe('register', function(){
			it('should register previously unregistered TSVs without error', function(){
				expect(function(){tsvRegistry.register(tsv);}).not.toThrow();
			});
			it('should throw exceptions if a user attempts to register a previously registered TSV', function(){
				expect(function(){tsvRegistry.register(tsv);}).toThrow();
			});
		});
		describe('get', function(){
			it('returns undefined if an unknown id is requested', function(){
				expect(tsvRegistry.get('totallyBogusId!')).toBeUndefined();
			});
			it('returns a TSV if a known id is requested', function(){
				expect(tsvRegistry.get(tsvId)).toBe(tsv);
			});
		});
		describe('getAll', function(){
			it('returns the correct number of TSVs', function(){
				expect(tsvRegistry.getAll().length).toBe(1);
			});
		});
		describe('stripUrlPrefix', function(){
			it('strips url prefixes', function(){
				var urlSuffix = 'a';
				var mockUrl = self.urlPrefix + urlSuffix;
				expect(tsvRegistry.stripUrlPrefix(mockUrl)).toBe(urlSuffix);
			});
		});
	});
});