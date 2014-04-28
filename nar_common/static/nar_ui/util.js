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
}());
