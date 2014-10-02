/**
 * Created by fabrizio on 9/30/14.
 */
define(['jquery'], function($){

    var supportUtility, originalTotalCropsModel, numberOfCrops, originalSingleCropsModel, calculatedSingleModel, calculatedTotalModel;

    // URL
    var cropsUrl = "http://168.202.28.178:8080/dataset/crops"

    var map=  {
        2 : "Area Harvested",
        5 : "Production",
        4 : "Yield",
        37: "Area Planted",
        998: "Production Paddy",
        3 : "Extraction Rate"
    }

    function PaddyModel(){}

    PaddyModel.prototype.init = function(){}

    PaddyModel.prototype.createTotalValuesModel = function(itemsInvolved, utilitySupport){
        var copyMap = $.extend([], true, map);
        var result = []
        supportUtility = utilitySupport;
        var dataModel = $.extend(true, [], itemsInvolved);
        for(var i =0; i<dataModel.length; i++) {
            if( dataModel[i].length == 3 || dataModel[i].length == 2){
                dataModel[i] = this.initializePaddyProduction(dataModel[i])
            }
            var code = dataModel[i][0]
            if (code != 37) {
                result[i] = $.extend([], true, dataModel[i])
                result[i].push(copyMap[code])
            }
        }
        originalTotalCropsModel = $.extend(true,[], result);
    }

    PaddyModel.prototype.getTotalValuesModel = function(){
        var result = originalTotalCropsModel;
        return result;
    }

    PaddyModel.prototype.setOriginalTotalData = function(rowNumber, value, columnNumber){
        debugger;
        if(columnNumber == 3){
            originalTotalCropsModel[rowNumber][columnNumber] = parseFloat(value);
        }else {
            originalTotalCropsModel[rowNumber][columnNumber] = value;
        }

    }

    PaddyModel.prototype.createSingleCropsModel = function(itemsInvolved, utilitySupport){
        var result = [];
        var copyMap = $.extend([], true, map);
        supportUtility = utilitySupport;
        var dataModel = $.extend(true, [], itemsInvolved);
        var cropsNumber = this.getCropsNumber();
        for(var j =0; j< cropsNumber ; j++) {
            console.log('converting!!')
            for (var i = 0; i < dataModel.length; i++) {
                var index =  (j*dataModel.length )+i;


                if( dataModel[i].length == 3 || dataModel[i] == 2){
                    dataModel[i] = this.initializePaddyProduction(dataModel[i])
                }
                result[index] = []
                for(var x =0; x< dataModel[i].length +2; x++) {
                    switch (x) {
                        case 3:
                            result[index][x] = null;
                            break;
                        case dataModel[i].length:
                            result[index][x] = copyMap[dataModel[i][0]];
                            break;
                        case dataModel[i].length + 1 :
                            result[index][x] = j + 1;
                            break;
                        default:
                            result[index][x] = dataModel[i][x];
                            break;
                    }
                }
            }
        }

        result = this.cleanSingleModel(result)
        originalSingleCropsModel = $.extend(true,[], result);
        return result;
    }

    PaddyModel.prototype.cleanSingleModel = function(model){
        var result = []
        for( var i=0; i< model.length; i++){
            if(model[i][0] != 3 && model[i][0] != 998){
                result.push(model[i])
            }
        }
        return result;

    }

    PaddyModel.prototype.initializePaddyProduction = function(row){
        var result = []
        for(var i =0; i<6; i++) {
            if (i == 0 || i == 2) {
                result[i] = row[i]
            }else{
                result[i] = null
            }
        }
        return result;
    }

    PaddyModel.prototype.getSingleCropsModel = function(){
       var result = originalSingleCropsModel;
       return result;
    }

    PaddyModel.prototype.setOriginalCropsData = function(newValue, rowNumber,columnValue){
        originalSingleCropsModel[rowNumber][columnValue] = newValue;
    }

    PaddyModel.prototype.getCropsNumber = function(){
        var result;
        var filterData = supportUtility.getFilterData()
        // if it is a new instance
        if(typeof filterCrops == 'undefined' || (filterCrops.regionCode !=filterData.countryCode || filterCrops.productCode != filterData.productCode )){
            var filterCrops = { "regionCode": filterData.countryCode, "productCode": filterData.productCode}

            // first call
            $.ajax({
                async: false,
                url: cropsUrl,
                type: 'POST',
                contentType: "application/json",
                dataType: 'json',
                data: JSON.stringify(filterCrops)

            }).done(function (result) {
                numberOfCrops = result;
            })
        }

        result = numberOfCrops;
        return result;
    }

    PaddyModel.prototype.setCalculatedTotalModel = function(calculatedModel){
        calculatedTotalModel = calculatedModel
    }

    PaddyModel.prototype.setCalculatedSingleModel = function(calculatedModel){
        console.log('setCalucaletd model')
        calculatedSingleModel = calculatedModel;
    }


    PaddyModel.prototype.fuseAndGetDataTogether = function(calculatedDataFromCrops,allData, crop){
        console.log('fuseandGet DatTogheter!')
        var everyData = $.extend(true,[],allData)
        var dataCropsSelected = $.extend(true,[],calculatedDataFromCrops);
        console.log('dataCtopsSelectd')
        console.log(dataCropsSelected)
        for(var i =0; i<dataCropsSelected.length; i++) {
            for (var j = 0; j < everyData.length; j++) {
                if (dataCropsSelected[i][0] == everyData[j][0] && dataCropsSelected[i][6] == crop) {
                    everyData[j] = dataCropsSelected[i]
                }
            }
        }
        return everyData
    }

    PaddyModel.prototype.filterModelSingleFromCrops = function(numberCrops, allData){
        console.log('filterModelSingleFromCrops')
        var result = [];
        for( var i=0; i<allData.length; i++){
            if(allData[i][7] ==numberCrops ){
                result.push(allData[i]);
            }
        }
        return result;
    }

    PaddyModel.prototype.getAndConvertOriginalTotValues = function(){
        console.log('getAnd convert originalTot Values')
        var model = $.extend(true,[],this.getTotalValuesModel())
        for(var i=0;i<model.length; i++){
            model[i].splice(6,1)
        }
        return model;
    }

    PaddyModel.prototype.unifySingleCropsData = function(singleCropsData){
        var result = [];
        var listChecked = {}
        // check if total values need to be changed
        if(this.checkIfCompletedSingleCrops(singleCropsData)) {
            // case number of crops ==1
            var elementPosition = 0
            for (var i = 0; i < singleCropsData.length; i++) {
                var code = singleCropsData[i][0]
                if(code != 'undefined' && code != null && code != "" && typeof listChecked[singleCropsData[i][0]] == 'undefined') {
                    listChecked[singleCropsData[i][0]] = elementPosition;
                    var row = [ singleCropsData[i][0],singleCropsData[i][1], singleCropsData[i][2], singleCropsData[i][3],null, null ,singleCropsData[i][6] ]
                    result.push(row)
                    elementPosition++;
                }else{
                    var indexList = listChecked[singleCropsData[i][0]]
                    result[indexList][3] += singleCropsData[i][3]
                }
            }
        }
        return result;
    }

     PaddyModel.prototype.checkIfCompletedSingleCrops = function(singleCropsData){
        var result = false;
        for( var i =0; i< singleCropsData.length && !result ; i++){
            var flag = singleCropsData[i][4]
            if(typeof flag != "undefined" && flag != null && flag != "" )
                result = true;
        }
        return result;
    }

    return PaddyModel;
})