// copy and paste this into a browser console to run.
// requires sugarjs

    var mockObservedProperties = function(){
        
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
        var root = 'http://cida.usgs.gov/def/nar/';
        var finalUrls = ([].concat(waterQualitySuffixes)).concat(streamflowSuffixes).map(function(suffix){
            return root + suffix;
        });
        
        return finalUrls;
    };
    
    var mockGetDataAvailabilityResponse = function(observedProperties){
        var featureOfInterest = 'http://waterdata.usgs.gov/nwis/nwisman/?site_no=03303280';
        var createEntry = function(observedProperty){
            return {
                 "procedure" : observedProperty,
                 "observedProperty" : observedProperty,
                 "featureOfInterest" : featureOfInterest,
                  "phenomenonTime" : [
                    "1977-10-19T00:00:00.000Z",
                    "2012-08-22T00:00:00.000Z"
                  ],
                  "valueCount" : 78
            };
        };    
        
        var entries = observedProperties.map(createEntry);
        var mockResponse = {
                "request" : "GetDataAvailability",
                "version" : "2.0.0",
                "service" : "SOS",
                "dataAvailability" : entries
        };
        return mockResponse;
    };
    observedProperties = mockObservedProperties(); 
    console.log(observedProperties.join('\n'));
    var mockResponse = mockGetDataAvailabilityResponse(observedProperties);
    console.dir(mockResponse);
    console.log(JSON.stringify(mockResponse));