/**
 * @requires _, nar.commons.Subject
 */
var nar = nar || {};
nar.mississippi = nar.mississippi || {};
(function(){
	/**
	 * @class nar.mississippi.FiltersState
	 * @property changed - a map of field name to field value for all changed field
	 * @property same - a map of field name to field value for all fields that have not changes
	 */
	nar.mississippi.FiltersState = function(changed, same){
		self.changed = changed;
		self.same = same;
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
			
			var changedNameValuePair = getNameValuePairFromFormElement(event.target);
			var changedFiltersStateEntry = {};
			changedFiltersStateEntry[changedNameValuePair.name] = changedNameValuePair.value;
			var sameFiltersStateEntry = {};
			sameInputs = filterInputs.not(event.target);
			sameInputs.map(function(index, input){
				nameValuePair = getNameValuePairFromFormElement(input);
				sameFiltersStateEntry[nameValuePair.name] = nameValuePair.value;
			});
			var filtersState = new nar.mississippi.FiltersState(changedFiltersStateEntry, sameFiltersStateEntry);
			subject.mostRecentNotification=filtersState;
			subject.notify(filtersState);
		});
		return subject;
	};
}());