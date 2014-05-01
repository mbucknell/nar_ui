// copy and paste this into a browser console to run.
// requires sugarjs

    var mockObservedProperties = (function(){
        
        var wqConcentrationSuffixes = [
             'mean_annual',
             'flow_weighted',
             'sample'
        ];
        var wqConcentrations = wqConcentrationSuffixes.map(function(suffix){
            return 'conc/' + suffix;
        });
        var getWqConstituentSuffixes = function(constituentName){
            var wqConstituentSuffixes = wqConcentrations.map(function(concentration){
                return constituentName + '/' + concentration;
            });
            wqConstituentSuffixes.push(constituentName + '/loads');
            return wqConstituentSuffixes;
        };
        
        var wqConstituents = [
            'nitrogen',
            'nitrate',
            'total_phosphorous',
            'suspended_sediment',
            'pesticides',
            'ecology'
        ];
        
        var waterQualitySuffixes = wqConstituents.map(getWqConstituentSuffixes).flatten();
        var streamflowSuffixes = [
                                  'real_time',
                                  'annual',
                                  'hydrograph',
                                  'flow_duration'
                                  ].map(function(subcategory){
                                      return 'streamflow/' + subcategory;
                                  });
        var root = 'http://cida.usgs.gov/cida/nar/';
        var finalUrls = ([].concat(waterQualitySuffixes)).concat(streamflowSuffixes).map(function(suffix){
            return root + suffix;
        });
        
        return finalUrls;
    }());
    console.log(mockObservedProperties.join('\n'));
    console.log(JSON.stringify({observedProperties: mockObservedProperties}));