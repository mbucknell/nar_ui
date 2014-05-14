// copy and paste this into a browser console to run.
// requires sugarjs

    var mockData = function(minYear, maxYear, minValue, maxValue){
        var mockDataSet = [];
        var minYearDate = Date.create(''+minYear);
        var maxYearDate = Date.create(''+maxYear); 
        Date.range(minYearDate, maxYearDate).every("month", function(date){
            var value = Number.random(minValue, maxValue);
            var timestamp = date.getTime();
            mockDataSet.push([timestamp, value]);
        });
        //remove the last month -- it is in the next year.
        mockDataSet.pop();
        return mockDataSet;
    };
    
    var mockDataParameters = [
                              [1983, 2000, 0, 100],
                              [1992, 2012, 0, 1000]
                              ];
    var mockDataSets = mockDataParameters.map(function(parameters){
        return {
            data: mockData.apply({}, parameters)
        };
    });
    
    mockDataSets.each(function(dataSet){
        console.log(JSON.stringify(dataSet));
    });