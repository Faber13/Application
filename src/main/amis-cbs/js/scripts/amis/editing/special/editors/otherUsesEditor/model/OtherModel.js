/**
 * Created by fabrizio on 9/30/14.
 */
define(['jquery'], function($){

    var supportUtility, originalTotalCropsModel, numberOfCrops, originalSingleCropsModel;

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

    function OtherModel(){}

    OtherModel.prototype.init = function(){}

    OtherModel.prototype.createTotalValuesModel = function(itemsInvolved, utilitySupport){
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

    OtherModel.prototype.getTotalValuesModel = function(){
        var result = originalTotalCropsModel;
        return result;
    }

    OtherModel.prototype.setOriginalTotalData = function(rowNumber, value, columnNumber){
        debugger;
        if(columnNumber == 3){
            originalTotalCropsModel[rowNumber][columnNumber] = parseFloat(value);
        }else {
            originalTotalCropsModel[rowNumber][columnNumber] = value;
        }

    }

    OtherModel.prototype.createSingleCropsModel = function(itemsInvolved, utilitySupport){
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

        originalSingleCropsModel = $.extend(true,[], result);
        return result;
    }

    OtherModel.prototype.initializePaddyProduction = function(row){
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

    OtherModel.prototype.getSingleCropsModel = function(){
        var result = originalSingleCropsModel;
        return result;
    }

    OtherModel.prototype.getCropsNumber = function(){
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

    OtherModel.prototype.getAndConvertOriginalTotValues = function(){
        console.log('getAnd convert originalTot Values')
        var model = $.extend(true,[],this.getTotalValuesModel())
        for(var i=0;i<model.length; i++){
            model[i].splice(6,1)
        }
        return model;
    }

    return OtherModel;
})