var nar = nar || {};
nar.util = {};
(function(){
    var selectorNotPresentMessagePrefix ='Could not find element with jquery selector "';
    var selectorNotPresentMessageSuffix = '".';
    /**
     * @param {selector} mixed jquery selection string or jquery object that results from a selection
     * @throws Error if selector is not present
     */
    nar.util.assert_selector_present = function(selector){
        if($(selector).length === 0){
            throw Error( selectorNotPresentMessagePrefix + selector + selectorNotPresentMessageSuffix);
        }
    };
    /**
     * {Date|String|Number} dateLike - A valid Date Object, an ISO-8601 date string, or a Number timestamp
     */
    nar.util.getTimeStamp = function(dateLike){
        var dateObj = Date.create(dateLike);
        var timestamp = dateObj.getTime();
        return timestamp;
    };
    /**
     * sugar doesn't let me leave out millis and n52 doesn't like millis
     */
    nar.util.toISOString = function(dateLike) {
        var dateObj = Date.create(dateLike);
        return dateObj.getUTCFullYear().pad(4) + '-' +
            (dateObj.getUTCMonth() + 1).pad(2) + '-' +
            dateObj.getUTCDate().pad(2) + 'T' +
            dateObj.getUTCHours().pad(2) + ':' +
            dateObj.getUTCMinutes().pad(2) + ':' +
            dateObj.getUTCSeconds().pad(2) + 'Z';
    };
    
    nar.util.Unimplemented = function() {
        throw Error('This functionality is not yet implemented');
    };
    
    nar.util.MILLISECONDS_IN_YEAR = 365 *24 * 60 * 60 * 1000;

    window.onerror = function(errorMsg, url, lineNumber) {
        var msg = errorMsg.replace(/Uncaught .*Error: /, '');
        $('#alert').html(msg).show().alert();
        $('#alert').delay(5000).fadeOut();
    };
}());
