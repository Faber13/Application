/**
 * Created by fabrizio on 9/15/14.
 */
define(["jquery"], function($){

// models
   var originalData, totalCropsData, originalTotalCropsModel, originalSingleCropsModel;

// variables
    var numberOfCrops;

// Modules
    var supportUtility;

// URL
    var cropsUrl = "http://168.202.28.178:8080/dataset/crops"

    var map=  {
        2 : "Area Harvested",
        5 : "Production",
        4 : "Yield",
        37: "Area Planted"
    }

    function ProductionModel(){}

    ProductionModel.prototype.getTotalCropsModel = function(involvedItems, Utility){
        originalData = involvedItems;
        var result;
        supportUtility = Utility;
        var modelData = $.extend([], true, involvedItems)
        result = this.convertOriginalToModelDataTotal('total', modelData);

        return result;
    }

    ProductionModel.prototype.setOriginalData = function(rowNumber, value){
        originalTotalCropsModel[rowNumber][3] = value;

    }

    ProductionModel.prototype.getSingleCropsModel = function(involvedItemsSingleCrops, Utility){
        var result;
        var cropsNumber = this.getCropsNumber();
        var modelDataSingCrops = $.extend([], true, involvedItemsSingleCrops)
        result =this.convertOriginalToSingleCrops(modelDataSingCrops, cropsNumber);
        return result;
    }

    ProductionModel.prototype.getOriginalTotalCropsModel = function(){
        return originalTotalCropsModel;
    }

    ProductionModel.prototype.getOriginalSingleCropsModel = function(){
        return originalSingleCropsModel;

    }

    ProductionModel.prototype.getOriginalData = function(){
        return originalData;
    }

    ProductionModel.prototype.getModelData = function(){
        return modelData;
    }

    ProductionModel.prototype.convertOriginalToModelDataTotal = function(modality, modelData){
        var result = [];
        var dataModel = $.extend([],true,modelData);
        var copyMap = $.extend([], true, map);
        if(modality == 'total') {
            // delete Area Planted from object
            delete copyMap[37]
            dataModel.splice(2,1)
        }

        for(var i =0; i< dataModel.length; i++){
            result[i] = $.extend([],true,dataModel[i])
            var code = dataModel[i][0]
            result[i].push(copyMap[code])
        }
        originalTotalCropsModel = $.extend(true,[], result);
        return result;
    }

    ProductionModel.prototype.convertOriginalToSingleCrops = function(modelData, cropsNumber){

        var result = [];
        var dataModel = $.extend([],true,modelData);
        var copyMap = $.extend([], true, map);
        for(var j =0; j< cropsNumber ; j++) {
            for (var i = 0; i < dataModel.length; i++) {
                var index =  j*dataModel[i].length+i;
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

    ProductionModel.prototype.convertModelDataToOriginal = function(){

    }

    ProductionModel.prototype.createSingleCropModel = function(numberOfCrops,modelData){
        // To create like the modelData, but with something different( the Area Planted)

    }

    ProductionModel.prototype.getCropsNumber = function(){

        if(typeof numberOfCrops ==='undefined') {
            var filterData = supportUtility.getFilterData()
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
        return numberOfCrops;

    }

    ProductionModel.prototype.filterModelSingleFromCrops = function(numberCrops, allData){
        debugger;
        var result = [];
        for( var i=0; i<allData.length; i++){
            if(allData[i][7] ==numberCrops ){
                result.push(allData[i]);
            }
        }
        return result;
    }

    ProductionModel.prototype.setOriginalCropsData = function(newValue, rowNumber){
        originalSingleCropsModel[rowNumber][3] = newValue;
    }

    ProductionModel.prototype.fuseAndGetDataTogether = function(calculatedDataFromCrops,allData, crop){
        var everyData = $.extend(true,[],allData)
        var dataCropsSelected = $.extend(true,[],calculatedDataFromCrops);
        for(var i =0; i<dataCropsSelected.length; i++) {
            for (var j = 0; j < everyData.length; j++) {
                if (dataCropsSelected[i][0] == everyData[j][0] && dataCropsSelected[j][6] == crop) {
                    everyData[j] = dataCropsSelected[i]
                }
            }
        }
        return everyData
    }

    return ProductionModel;

})