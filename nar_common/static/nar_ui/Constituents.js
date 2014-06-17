var nar = nar || {};
(function() {
    /**
     * A map of a constituent's programmatic identifier to its metadata
     */
    nar.Constituents = {
        nitrogen : {
            color : '#7FFF00',
            //R-Color:chartreuse1
            name : 'Nitrogen'
        },
        pesticides : {
            color : 'rgb(0, 128, 128)',
            name: 'Pesticides'
        },
        ecology : {
            color : 'rgb(128, 128, 0)',
            name : 'Ecology'
        },
        nitrate : {
            name : 'Nitrate',
            color : 'rgb(0,255,0)'
        },
        total_phosphorous : {
            color : '#66CD00',
            //R-Color:chartreuse3
            name : 'Total Phosphorous'
        },
        suspended_sediment : {
            color : '#8B0000',
            //R-Color:darkred
            name : 'Suspended Sediment'
        },
        streamflow : {
            color : '#0000CD',
            //R-Color:mediumblue
            name : 'Streamflow'
        }
    };

})();
