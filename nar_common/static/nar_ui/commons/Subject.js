/**
 * @requires sugarjs
 */

/**
 * @class nar.commons.Subject
 * Used to implement the observer pattern.
 */
var nar = nar || {};
nar.commons = nar.commons || {};
nar.commons.Subject = function(){
	var self = this;
	var handlers = [];
	
	/**
	 * @param {function} handler
	 */
	self.observe = function (handler) {
		console.log('added new observer');
		handlers.push(handler);
	};
	/**
	 * @param {function} handler
	 * @returns {Boolean} true if handler was observing, false if it was not observing
	 */
	self.unobserve = function (handler) {
		var handlerIndex = handlers.indexOf(handler);
		var handlerWasFound = false;
		if(-1 !== handlerIndex){
			handlers.removeAt(handlerIndex);
			handlerWasFound = true;
			console.log('removed observer');
		}
		return handlerWasFound;
	};
	/**
	 * @param * - any arguments you specify will be 
	 * passed to observing handlers
	 * @return {Integer} the number of handlers called
	 */
	self.notify = function notifyObservers() {
		var args = Array.create(arguments);
		handlers.map(function(handler){
			handler.apply(null, args);
		});
		console.log('notified ' + handlers.length + ' observers');
		return handlers.length;
	};
};

