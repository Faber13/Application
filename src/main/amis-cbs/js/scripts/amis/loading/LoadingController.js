/**
 * Created by fabrizio on 5/20/14.
 */
define(["jquery", "balanceSheet/BalanceSheet", "dataLoader/DataLoader", "databaseSaver/controller/SavingController"],
    function($, BalanceSheet, DataLoader, SavingController) {

        var urlDSD = './js/scripts/component/core/balanceSheet/configuration/dsd/dsdStructure.json'
        var urlDSDRice = './js/scripts/component/core/balanceSheet/configuration/dsd/dsdStructureRice.json'

        var balanceSheet, dataFiltered, dataLoader, firstIstance, savingController;

        function LoadingController() {
            balanceSheet = new BalanceSheet
            dataLoader = new DataLoader;
            firstIstance = false;
            savingController = new SavingController;
        }

    LoadingController.prototype.init = function(preloadingData) {

        var notPreviousYear = false;
        dataFiltered = preloadingData;
        var currentYearFilter = parseInt(preloadingData.years.currentYearLabel.substring(0, 4));

        // if a previous year exist
        if(preloadingData.years.previousYearLabel != -1) {
            var previousYearFilter = parseInt(preloadingData.years.previousYearLabel.substring(0, 4));
        }else{
            notPreviousYear = true;
        }

        // prepare all filters to make queries
        var region = parseInt(preloadingData.post.regionCode);
        var product = parseInt(preloadingData.post.productCode)

        var filterActual = { "region": region, "product": product, "year": currentYearFilter}
        var filterPreviousYear = { "region": region, "product": product, "year": previousYearFilter}

        var filterPrevPopulation = {"region": region, "element": 1, year: previousYearFilter}
        var mostRecentDateFilter  = {"region": region, "product":product,"year":previousYearFilter }

        var filterPopulationActual = {
            "region" : region,
            "element": 1,
            "year": currentYearFilter
        }
        // take the actual forecast
        var actualForecast = dataLoader.getActualYearForecast(filterActual,filterPopulationActual);
        if(!notPreviousYear) { // if exist a previous year

            var prevYearForecast = dataLoader.getPreviousYearForecast(mostRecentDateFilter, filterPreviousYear, filterPrevPopulation)
             prevYearForecast = dataLoader.setFakeForecastDate(prevYearForecast)

            var totalForecast = prevYearForecast.concat(actualForecast)
        }else{
            var totalForecast = actualForecast;
        }
        var url;

        /* EXAMPLE PATTERN TO SAVE
         {
         "filter":{
         "region":12,
         "product":5,
         "year":2010
         },

         "data":[
         [
         4,
         "Tonnes/Ha",
         "2013-07-15",
         7.81,
         null
         ],
         [
         19,
         "Million tonnes",
         "2013-07-15",
         27.65,
         " "
         ],
         [
         27,
         "Million tonnes",
         "2013-07-15",
         27.65,
         " "
         ]
         ]
         }
         */

        //
        if(!firstIstance) {
            firstIstance = true
            // Choice of DSD dependent on the product (if rice has been chosen)
            url = (product == 4)?  urlDSDRice: urlDSD;
            balanceSheet.init(totalForecast, url, dataFiltered)
        }else {
            if(product !=4) {
                url = urlDSD
                balanceSheet.init(totalForecast, url, dataFiltered)
            }else{
                url = urlDSDRice;
                balanceSheet.init(totalForecast, url, dataFiltered)
            }
        }
        debugger;

        var realPreviousYear = dataLoader.getRealPreviousYear()
        savingController.init(balanceSheet, filterActual,realPreviousYear )


    };


        LoadingController.prototype.getFilterData = function(){
            return dataFiltered;
        }

        return LoadingController;
    });