describe('nar.commons.Subject', function() {
	var subject, 
		observers,
		numObservers = 3;
	beforeEach(function(){
		subject = new nar.commons.Subject();
		observers = [];
		(numObservers).times(function(i){
			var spy = jasmine.createSpy(i);
			observers.push(spy);
		});
	});
	it('should notify no observers if unobserved', function(){
		expect(subject.notify()).toBe(0);
	});
	it('should notify all observers if observed', function(){
		observers.each(function(observer){
			expect(observer).not.toHaveBeenCalled();
			subject.observe(observer);
			expect(observer).not.toHaveBeenCalled();
		});
		subject.notify();
		observers.each(function(observer){
			expect(observer).toHaveBeenCalled();
		});
	});
	it('should be able to pass any kind of argument to observers when notifying', function(){
		observers.each(function(observer){
			subject.observe(observer);
		});
		
		//we will call notify with each of these
		var variousArguments = [
			[1, 2, 3],
			[1, 'a', false, {}],
			[new Date(), null, undefined, function(){}]
		];
		variousArguments.each(function(argumentSet){
			subject.notify.apply(null, argumentSet);
			observers.each(function(observer){
				var expectObserver = expect(observer);
				expectObserver.toHaveBeenCalledWith.apply(expectObserver, argumentSet);
			});
		});
	});
	it('should not call former observers who are no longer observing', function(){
		//add all
		observers.each(function(observer){
			subject.observe(observer);
		});
		//remove one
		var removeMe = observers.first();
		subject.unobserve(removeMe);
		//notify
		subject.notify();
		//verify
		expect(removeMe).not.toHaveBeenCalled();
		observers.exclude(removeMe).each(function(observer){
			expect(observer).toHaveBeenCalled();
		});
	});
});