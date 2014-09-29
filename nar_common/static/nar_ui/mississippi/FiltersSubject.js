/**
 * @requires _, nar.commons.Subject
 */
var nar = nar || {};
nar.mississippi = nar.mississippi || {};
(function(){
	/**
	 * @class nar.mississippi.FiltersState
	 * @property load
	 * @property chemical
	 * @property year
	 * 
	 */
	nar.mississippi.FiltersState = function(load, chemical, year){
		var self = this;
		self.load = load;
		self.chemical = chemical;
		self.year = year;
	};
	
	/**
	 * @class nar.mississipi.FiltersSubject
	 * Returns a Subject whose observers are called 
	 * with a nar.mississippi.FiltersState object.
	 */
	/**
	 * @param {jQuery} filters - the parent of several form elements
	 */
	nar.mississippi.FiltersSubject = function(filters){
		var subject = new nar.commons.Subject();
		subject.mostRecentNotification = new nar.mississippi.FiltersState();
		var filterInputs = filters.find(':input');
		
		var getNameValuePairFromFormElement = function(element){
			element = $(element);
			var nameValuePair = {};
			nameValuePair.name = element.attr('name');
			if(!nameValuePair.name){
				throw new Error('No field name defined for map filter form control');
			}
			nameValuePair.value = element.val();
			return nameValuePair;
		};
		
		filterInputs.change(function(event){
			var tempFiltersState = {};
			filterInputs.map(function(index, input){
				nameValuePair = getNameValuePairFromFormElement(input);
				tempFiltersState[nameValuePair.name] = nameValuePair.value;
			});
			
			var filtersState = new nar.mississippi.FiltersState(tempFiltersState.load, tempFiltersState.chemical, tempFiltersState.year);
			subject.mostRecentNotification=filtersState;
			subject.notify(filtersState);
		});
		return subject;
	};
}());