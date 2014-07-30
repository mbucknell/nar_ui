$(document).ready(function(){
	describe('nar.fullReport.TimeSeriesVisualizationRegistry', function(){
		var tsvRegistry,
		tsv,
		tsvId,
		elements;
		var instructionsElement = $('<div class="instructions"></div>');
		var allPlotsWrapperElement = $('<div class="plotsWrapper"></div>');
		elements = [instructionsElement, allPlotsWrapperElement];
		$('body').append(elements);
		tsvRegistry = nar.fullReport.TimeSeriesVisualizationRegistry;
		tsvId = 'purple';
		tsv = new nar.fullReport.TimeSeriesVisualization({
			id: tsvId,
			plotter: function(){
				throw Exception('not yet implemented');
			},
			timeSeriesCollection: new nar.fullReport.TimeSeriesCollection(),
			instructionsElt: instructionsElement,
			allPlotsWrapperElement: allPlotsWrapperElement
		});

			it('should register() previously unregistered TSVs without error', function(){
				expect(function(){tsvRegistry.register(tsv);}).not.toThrow();
			});
			it('should throw exceptions if a user attempts to register() a previously registered TSV', function(){
				expect(function(){tsvRegistry.register(tsv);}).toThrow();
			});
			it('gets() undefined if an unknown id is requested', function(){
				expect(tsvRegistry.get('totallyBogusId!')).toBeUndefined();
			});
			it('gets() a TSV if a known id is requested', function(){
				expect(tsvRegistry.get(tsvId)).toBe(tsv);
			});
			it('returns the correct number of TSVs when calling getAll()', function(){
				expect(tsvRegistry.getAll().length).toBe(1);
			});
			it('strips url prefixes', function(){
				var urlSuffix = 'a';
				var mockUrl = self.urlPrefix + urlSuffix;
				expect(tsvRegistry.stripUrlPrefix(mockUrl)).toBe(urlSuffix);
			});
	});
});