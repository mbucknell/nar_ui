describe('nar.timeSeries.Visualization', function(){
	
	describe('getComponentsOfId', function(){
		var getComponentsOfId = nar.timeSeries.Visualization.getComponentsOfId;
		var serverSideConstituentId = 'nh3';
		var category = 'airplanes';
		
		it('parses correct components from hierarchical ids with a category and NO subcategory', function(){
			var idWithoutSubcategory = serverSideConstituentId + '/' + category;
			var components = getComponentsOfId(idWithoutSubcategory);
			expect(components.constituent).toBe('nitrogen');
			expect(components.category).toBe(category);
			expect(components.subcategory).toBeUndefined();
		});
		
		it('parses correct components from hierarchical ids with a category AND a subcategory', function(){
			var subcategory = 'blue_' + category;
			var idWithSubcategory = serverSideConstituentId + '/' + subcategory;
			var components = getComponentsOfId(idWithSubcategory);
			expect(components.constituent).toBe('nitrogen');
			expect(components.category).toBe(category);
			expect(components.subcategory).toBe(subcategory);
		});
	});
});