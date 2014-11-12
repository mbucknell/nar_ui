$(document).ready(function(){
	describe('nar.timeSeries.VisualizationRegistry', function(){
		CONFIG = {
				sosDefsBaseUrl : 'http:/test/nar/'
		};
		var tsvRegistry,
		tsv,
		tsvId,
		elements;
		beforeEach(function(){
			tsvRegistry = new nar.timeSeries.VisualizationRegistry();
		});
		
		var instructionsElement = $('<div class="instructions"></div>');
		var allPlotsWrapperElement = $('<div class="plotsWrapper"></div>');
		elements = [instructionsElement, allPlotsWrapperElement];
		$('body').append(elements);
		tsvId = 'purple';
		tsv = new nar.timeSeries.Visualization({
			id: tsvId,
			plotter: function(){
				throw Exception('not yet implemented');
			},
			timeSeriesCollection: new nar.timeSeries.Collection(),
			instructionsElt: instructionsElement,
			allPlotsWrapperElement: allPlotsWrapperElement
		});

			it('should register() previously unregistered TSVs without error', function(){
				expect(function(){tsvRegistry.register(tsv);}).not.toThrow();
			});
			it('should throw exceptions if a user attempts to register() a previously registered TSV', function(){
				tsvRegistry.register(tsv);
				expect(function(){tsvRegistry.register(tsv);}).toThrow();
			});
			it('gets() undefined if an unknown id is requested', function(){
				expect(tsvRegistry.get('totallyBogusId!')).toBeUndefined();
			});
			it('gets() a TSV if a known id is requested', function(){
				tsvRegistry.register(tsv);
				expect(tsvRegistry.get(tsvId)).toBe(tsv);
			});
			it('returns the correct number of TSVs when calling getAll()', function(){
				var assertLength = function(length){
					expect(tsvRegistry.getAll().length).toBe(length);
				};
				assertLength(0);
				tsvRegistry.register(tsv);
				assertLength(1);
			});
			it('strips url prefixes', function(){
				var urlSuffix = 'a';
				var mockUrl = self.urlPrefix + urlSuffix;
				expect(tsvRegistry.stripUrlPrefix(mockUrl)).toBe(urlSuffix);
			});
	});
});