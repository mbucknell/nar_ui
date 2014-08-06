$(document).ready(
        function() {
            var ConstituentCurrentYearComparisonPlot = nar.fullReport.ConstituentCurrentYearComparisonPlot;
            var ExceedancePlot = nar.fullReport.ExceedancePlot;
            
            var nitrateSeries = {
                    constituentName : nar.Constituents.nitrate.name,
                    constituentUnit : 'Million Tons',
                    yearValue : 12,
                    yearColor : nar.Constituents.nitrate.color,
                    averageName : 'Average 1991-2013',
                    averageValue : 10
            };

            var nitrateGraph = ConstituentCurrentYearComparisonPlot(
                    '#barChart3', nitrateSeries);

            var phosphorusSeries = {
                    constituentName : nar.Constituents.phosphorus.name,
                    constituentUnit : 'Million Tons',
                    yearValue : 100,
                    yearColor : nar.Constituents.phosphorus.color,
                    averageName : 'Average 1985-2013',
                    averageValue : 153
            };

            var phosphorusGraph = ConstituentCurrentYearComparisonPlot(
                    '#barChart4', phosphorusSeries);

            var streamflowSeries = {
                    constituentName : nar.Constituents.streamflow.name,
                    constituentUnit : 'Million acre-feet',
                    yearValue : 1.7,
                    yearColor : nar.Constituents.streamflow.color,
                    averageName : 'Average 1999-2013',
                    averageValue : 2.4
            };

            var streamflowGraph = ConstituentCurrentYearComparisonPlot(
                    '#barChart1', streamflowSeries);
            
            var nitrogenSeries = {
                    constituentName : nar.Constituents.nitrogen.name,
                    constituentUnit : 'Million acre-feet',
                    yearValue : 1.1,
                    yearColor : nar.Constituents.nitrogen.color,
                    averageName : 'Average 1999-2013',
                    averageValue : 1.9
            };

            var nitrogenGraph = ConstituentCurrentYearComparisonPlot(
                    '#barChart2', nitrogenSeries);

            var sedimentSeries = {
                    constituentName : nar.Constituents.sediment.name,
                    constituentUnit : 'Million Tons',
                    yearValue : 300,
                    yearColor : nar.Constituents.sediment.color,
                    averageName : 'Average 1990-2013',
                    averageValue : 100
            };

            var sedimentGraph = ConstituentCurrentYearComparisonPlot(
                    '#barChart5', sedimentSeries);
            var exceedancesTitle = 'Percentage of samples with concentrations greater than benchmarks'; 
            
            var humanHealthExceedancePlot = ExceedancePlot(
                'humanHealthExceedances', 
                [
                 {constituent: nar.Constituents.nitrate, data: [73]},
                 {constituent: {color: '', name: ' '}, data: [' ']}
                ],
                exceedancesTitle
            );
            
            var aquaticHealthExceedancePlot = ExceedancePlot(
                'aquaticHealthExceedances', 
                [
                 {constituent: nar.Constituents.nitrogen, data: [13]},
                 {constituent: nar.Constituents.phosphorus, data: [73]},
                ],
                exceedancesTitle
            );
        });