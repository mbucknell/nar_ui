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
                    '#barChart2', nitrateSeries);

            var phosphorousSeries = {
                    constituentName : nar.Constituents.total_phosphorous.name,
                    constituentUnit : 'Million Tons',
                    yearValue : 100,
                    yearColor : nar.Constituents.total_phosphorous.color,
                    averageName : 'Average 1985-2013',
                    averageValue : 153
            };

            var phosphorousGraph = ConstituentCurrentYearComparisonPlot(
                    '#barChart3', phosphorousSeries);

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

            var sedimentSeries = {
                    constituentName : nar.Constituents.suspended_sediment.name,
                    constituentUnit : 'Million Tons',
                    yearValue : 300,
                    yearColor : nar.Constituents.suspended_sediment.color,
                    averageName : 'Average 1990-2013',
                    averageValue : 100
            };

            var sedimentGraph = ConstituentCurrentYearComparisonPlot(
                    '#barChart4', sedimentSeries);
            
            var humanHealthExceedancePlot = ExceedancePlot('#humanHealthExceedances',  [[ [ "Nitrate", 10], [ "Phosphorous", 50]]]);
        });