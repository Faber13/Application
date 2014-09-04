/**
 * Created by fabrizio on 5/20/14.
 */
define(["jquery","preloading/countrySelection/CountrySelector",
        "preloading/countrySelection/DatabaseSelector",
        "preloading/countrySelection/CommoditySelector",
        "preloading/countrySelection/YearSelector",
        "loading/LoadingController"],
    function($, CountrySelector, DataBaseSelector, CommSelector, YearSelector, LoadingObserver) {

        // vars that represent the models
        var countrySelector,dbSelector,commSelector, yearSelector, loadingObserver;

        // vars returned from the models
        var regionCode, databaseText,databaseValue, productCode ,yearPost, yearPostNat, yearChosen;

        function PreloadingController(){
            countrySelector = new CountrySelector;
            dbSelector      = new DataBaseSelector;
            commSelector    = new CommSelector;
            yearSelector    = new YearSelector;


            yearPost = {
                regionCode:     regionCode,
                productCode:    productCode,
                databaseText:   databaseText,
                databaseValue : databaseValue
            };
        };


        PreloadingController.prototype.init = function(){

            var that = this;

            // Country
            regionCode= countrySelector.init();
            that.updateRegionCode(regionCode);

            // Database
            databaseText=  dbSelector.init(regionCode);
            that.updateDBSel(databaseText);

            // Commodity
            productCode = commSelector.init();
            that.updateproductCode(productCode);

            yearChosen = yearSelector.init(yearPost);
        };


        PreloadingController.prototype.onChangingCountry = function(event){
            regionCode =   countrySelector.change(event);
            dbSelector.changeRadio(regionCode);
            this.updateRegionCode(regionCode);
            this.updateDBSel(databaseText);
            //this.printUpdate();
            yearSelector.init(yearPost);
        }


        PreloadingController.prototype.onChangingCommodity = function(event) {
            this.updateproductCode(commSelector.change(event));
            this.updateDBSel(databaseText);
            //this.printUpdate();
            if (yearPost.databaseText != "CBS") {
                var yearPostNat =  {};
                //copy all the fields of yearPost in yearPostNat
                for (var key in yearPost) {
                    yearPostNat[key] = yearPost[key];
                }
                yearPostNat.databaseText = "NATIONAL";
                yearSelector.init(yearPost);
            }else
                yearSelector.init(yearPost);

        };


        PreloadingController.prototype.onSelectingYear = function(event) {
            yearChosen = yearSelector.change(event);
        };



        PreloadingController.prototype.onSelectNatDB = function(event) {
            databaseText = dbSelector.selectNational(event);
            this.updateDBSel(databaseText);
            //this.printUpdate();
            yearSelector.init(yearPost);

        };


        PreloadingController.prototype.onSelectCBS = function(event) {
            databaseText = dbSelector.selectCBS(event);
            this.updateDBSel(databaseText);
            //this.printUpdate();
            yearSelector.init(yearPost);

        };


        PreloadingController.prototype.updateRegionCode = function(regionCode) {
            yearPost.regionCode = regionCode;
        }


        PreloadingController.prototype.updateDBSel      = function(databaseText) {
            yearPost.databaseText = databaseText;
            if( yearPost.databaseText != "CBS"){
                yearPost.databaseValue = "NATIONAL";
            }else{
                yearPost.databaseValue = "CBS";
            }
        }


        PreloadingController.prototype.updateproductCode = function(commCode) {
            yearPost.productCode = commCode;
        }


        PreloadingController.prototype.printUpdate = function(){
            console.log("---------------- UPDATE  ------------------");
            console.log('REGIONCODE: '+yearPost.regionCode);
            console.log('DATABASE: '+  yearPost.databaseText);
            console.log('COMMDOITY: '+ yearPost.productCode);
        }


        PreloadingController.prototype.getCountrySelector = function(){
            return countrySelector;
        };


        PreloadingController.prototype.getDbSelector = function(){
            return dbSelector;
        };


        PreloadingController.prototype.getcommSelector = function(){
            return commSelector;
        };


        PreloadingController.prototype.getYearSelector = function(){
            return yearSelector;
        };

        PreloadingController.prototype.passDataToLoading = function(){
            loadingObserver = new LoadingObserver;

            var preloadingData = {
                post:  yearPost,
                years: yearChosen
            }
            loadingObserver.init(preloadingData);
        }


        return PreloadingController;
    });