/**
 * @requires _, nar.commons.Subject
 */
var nar = nar || {};
nar.mississippi = nar.mississippi || {};
(function(){
	/**
	 * @class nar.mississippi.FiltersState
	 * @property changed - a map of field name to field value
	 * @property same - a map of field name to field value
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
			var nameValuePair = {};
			nameValuePair.name = element.attr('name');
			if(!nameValuePair.name){
				throw new Error('No field name defined for map filter form control');
			}
			nameValuePair.value = element.val();
			return nameValuePair;
		};
		
		filterInputs.change(function(event){
			
			/**
			 * Each handler observing the filters subject will receive
			 * an object with two properties. Both properties are a map of 
			 * field name to field value. The 'changed' property is a map of 
			 * the newly changed field. The 'same' property is a map of the
			 * other unchanged fields
			 */
			var changedNameValuePair = getNameValuePairFromFormElement(event.target);
			var changedFiltersStateEntry = {};
			changedFilterStateEntry[changedNameValuePair.name] = changedNameValuePair.value;
			var sameFiltersStateEntry = {};
			sameInputs = filterInputs.not(event.target);
			_.map(sameInputs, function(input){
				nameValuePair = getNameValuePairFromFormElement(input);
				sameFiltersStateEntry[nameValuePair.name] = nameValuePair.value;
			});
			var filtersState = new nar.mississippi.FiltersState(changedFiltersStateEntry, sameFiltersStateEntry);
			subject.notify(filterState);
		});
		return subject;
	};
}());