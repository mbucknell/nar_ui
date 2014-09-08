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
	 */
	self.unobserve = function (handler) {
		handlers = _.without(handlers, handler);
	};
	/**
	 * @param * - any arguments you specify will be 
	 * passed to observing handlers
	 */
	self.notify = function notifyObservers() {
		var args = _.toArray(arguments);
		_.map(handlers, function(handler){
			handler.apply(null, args);
		});
	};

};

