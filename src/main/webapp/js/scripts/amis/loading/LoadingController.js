/**
 * Created by fabrizio on 5/20/14.
 */
define(["jquery", "balanceSheet/BalanceSheet", "formatter/DatatypesFormatter"],
    function($, BalanceSheet, Formatter) {

    var urlElements = "http://localhost:8080/dataset/national";
    var urlPopulation = "http://localhost:8080/dataset/population"
    var mostRecentUlr = "http://localhost:8080/dataset/recentDate"
    var previousForecastUrl =  "http://localhost:8080/dataset/recentDate"

    var balanceSheet, dataFiltered,firstIstance;

    function LoadingController(){
        balanceSheet = new BalanceSheet
        formatter = new Formatter;
        firstIstance = false;
    }


    LoadingController.prototype.init = function(preloadingData) {
        dataFiltered = preloadingData;

        var previousYearFilter = parseInt(preloadingData.years.previousYearLabel.substring(0, 4));
        var currentYearFilter = parseInt(preloadingData.years.currentYearLabel.substring(0, 4));

        var region = parseInt(preloadingData.post.regionCode);
        var product = parseInt(preloadingData.post.productCode)

        var filterActual = { "region": region, "product": product, "year": currentYearFilter}
        var filterPreviuous = { "region": region, "product": product, "year": previousYearFilter}

        var actualForecast;

        $.ajax({
            async: false,
            url: "http://168.202.28.178:8080/dataset/national",
            type: 'POST',
            contentType : "application/json",
            dataType : 'json',
            data : JSON.stringify( filterActual)

        }).done(function(result) {
            actualForecast = result;
        })


        // Put dates in DSD format
        for(var i =0; i<actualForecast.length -1; i++){

            var data = actualForecast[i][2]

            actualForecast[i][2] = formatter.fromVisualizationToDSDFormat(data, "date")
            // also for updateDate
        }



        var filterPopulationActual = {
            "region" : region,
            "element": 1,
            "year": currentYearFilter
        }

        var populationActual
        $.ajax({
            async: false,
            url: "http://168.202.28.178:8080/dataset/population",
            type: 'POST',
            contentType : "application/json",
            dataType : 'json',
            data : JSON.stringify( filterPopulationActual)

        }).done(function(result) {
            populationActual = result;
        })


        // Second call with actual population


        // Inside of population insert the date(s)
        var firstForecastDateToInsert = actualForecast[0][2]
        if(populationActual.length >0) {
            populationActual[0].splice(2, 0, firstForecastDateToInsert);

            // Insert population into actual forecast
            actualForecast.push(populationActual[0])
        }

        // take the most recent date betweeen the previous year

        var mostRecentDateFilter  = {"region": region, "product":product,"year":previousYearFilter }
     //   var dates =  [ [ "2013-07-15" ], [ "2014-07-25" ] ]
        var dates;
        $.ajax({
            async: false,
            url: "http://168.202.28.178:8080/dataset/recentDate",
            type: 'POST',
            contentType : "application/json",
            dataType : 'json',
            data : JSON.stringify( mostRecentDateFilter)

        }).done(function(result) {
            dates = result;
        })

        var mostRecentDate = dates[0][0]

        var filterPreviousYear = {"region": region, "product": product, "year": previousYearFilter, "date": mostRecentDate}

        var prevYearForecast
        $.ajax({
            async: false,
            url: "http://168.202.28.178:8080/dataset/previousYear",
            type: 'POST',
            contentType : "application/json",
            dataType : 'json',
            data : JSON.stringify( filterPreviousYear)

        }).done(function(result) {
            prevYearForecast = result;
        })



        // Put dates in DSD format
        for(var i =0; i<prevYearForecast.length; i++){
            var data = prevYearForecast[i][2]
            prevYearForecast[i][2] = formatter.fromVisualizationToDSDFormat(data, "date")
            // also for updateDate
        }

        var filterPrevPopulation = {"region": region, "element": 1, year: previousYearFilter}
      //  var populationPrevYear = [ [ 1, "1000s", 504630.0, "" ] ];
        var populationPrevYear;
        $.ajax({
            async: false,
            url: "http://168.202.28.178:8080/dataset/population",
            type: 'POST',
            contentType : "application/json",
            dataType : 'json',
            data : JSON.stringify( filterPopulationActual)

        }).done(function(result) {
            populationPrevYear = result;
        })

       // Inside of population insert the date(s)
        var firstForecastPreviousDateToInsert = prevYearForecast[0][2]
        if(populationPrevYear.length >0) {

            populationPrevYear[0].splice(2, 0, firstForecastDateToInsert);

            // Insert population into actual forecast
            prevYearForecast.push(populationPrevYear[0])
        }

        var totalForecast = prevYearForecast.concat(actualForecast)
        var url;

        var urlDSD = './js/scripts/component/core/balanceSheet/configuration/dsd/dsdStructure.json'
        var urlDSDRice = './js/scripts/component/core/balanceSheet/configuration/dsd/dsdStructureRice.json'
        if(!firstIstance) {
            firstIstance = true
            // Choice of DSD dependent on the product (if rice has been chosen)
             url = (product == 4)?  urlDSDRice: urlDSD;
            balanceSheet.init(totalForecast, url)
        }else {
            if(product !=4) {
                url = urlDSD
                balanceSheet.init(totalForecast, url)
            }else{
                url = urlDSDRice;
                balanceSheet.init(totalForecast, url)
            }
        }

        $("#controlData").bind('click', function(){
            debugger;
        })
    };
        return LoadingController;
    });