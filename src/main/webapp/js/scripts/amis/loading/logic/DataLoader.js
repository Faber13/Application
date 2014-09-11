/**
 * Created by fabrizio on 9/11/14.
 */
define(["jquery", "formatter/DatatypesFormatter"], function ($, Formatter) {


    var urlActualForecast = "http://168.202.28.178:8080/dataset/national";
    var urlPopulation = "http://168.202.28.178:8080/dataset/population";
    var urlMostRecentDate = "http://168.202.28.178:8080/dataset/recentDate";
    var urlPreviousYear = "http://168.202.28.178:8080/dataset/previousYear";

    var firstForecastDateToInsert, formatter;

    function DataLoader() {
        formatter = new Formatter;
    }

    DataLoader.prototype.getActualYearForecast = function (filterActual, filterPopulationActual) {

        var actualForecast;
        // first call
        $.ajax({
            async: false,
            url: urlActualForecast,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(filterActual)

        }).done(function (result) {
            actualForecast = result;
        })

        // Put dates in DSD format
        for (var i = 0; i < actualForecast.length - 1; i++) {
            var data = actualForecast[i][2]
            actualForecast[i][2] = formatter.fromVisualizationToDSDFormat(data, "date")
            // also for updateDate
        }

        var populationActual;
        // Second call with actual population
        $.ajax({
            async: false,
            url: urlPopulation,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(filterPopulationActual)

        }).done(function (result) {
            populationActual = result;
        })

        // Inside of population insert the date(s)
        firstForecastDateToInsert = actualForecast[0][2]
        if (populationActual.length > 0) {
            populationActual[0].splice(2, 0, firstForecastDateToInsert);

            // Insert population into actual forecast
            actualForecast.push(populationActual[0])
        }

        return actualForecast;
    }

    DataLoader.prototype.getPreviousYearForecast = function (mostRecentDateFilter, filterPreviousYear, filterPrevPopulation) {
        debugger;
        var dates;
        $.ajax({
            async: false,
            url: urlMostRecentDate,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(mostRecentDateFilter)

        }).done(function (result) {
            dates = result;
        })

        var mostRecentDate = dates[0][0]
        // set the most recent date to make the query
        filterPreviousYear["date"] = mostRecentDate;

        var prevYearForecast
        $.ajax({
            async: false,
            url: urlPreviousYear,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(filterPreviousYear)

        }).done(function (result) {
            prevYearForecast = result;
        })


        // Put dates in DSD format
        for (var i = 0; i < prevYearForecast.length; i++) {
            var data = prevYearForecast[i][2]
            prevYearForecast[i][2] = formatter.fromVisualizationToDSDFormat(data, "date")
            // also for updateDate
        }

        var populationPrevYear;
        $.ajax({
            async: false,
            url: urlPopulation,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify(filterPrevPopulation)
        }).done(function (result) {
            populationPrevYear = result;
        })

        // Inside of population insert the date(s)

        if (populationPrevYear.length > 0) {
            var firstForecastPreviousDateToInsert = prevYearForecast[0][2]
            populationPrevYear[0].splice(2, 0, firstForecastDateToInsert);

            // Insert population into actual forecast
            prevYearForecast.push(populationPrevYear[0])
        }
        return prevYearForecast;
    }


    DataLoader.prototype.checkIfEqualForecastDates = function(firstActForecast, prevForecast){
        return firstActForecast[2] == prevForecast[2]
    }


    DataLoader.prototype.setFakeForecastDate = function(prevYearForecast){
        var fakeDate = "20000103";
        for(var i =0; i< prevYearForecast.length; i++){
            prevYearForecast[i][2] = fakeDate;
        }
        return prevYearForecast;
    }

    return DataLoader;

})