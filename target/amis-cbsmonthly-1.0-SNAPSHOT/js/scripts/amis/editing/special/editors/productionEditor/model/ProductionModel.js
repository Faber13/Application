/**
 * Created by fabrizio on 9/15/14.
 */
define(["jquery"], function($){

// models
   var originalData, totalCropsData, originalTotalCropsModel;

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
        result = this.convertOriginalToModelData('total', modelData);
        originalTotalCropsModel = $.extend([], false, result);


        return result;
    }

    ProductionModel.prototype.setOriginalData = function(rowNumber, value){
        debugger;
        originalTotalCropsModel[rowNumber][3] = value;

    }

    ProductionModel.prototype.getSingleCropsModel = function(involvedItemsSingleCrops, Utility){
        var result;
        supportUtility = Utility;

        var modelDataSingCrops = $.extend([], true, involvedItemsSingleCrops)
        result =this.convertOriginalToModelData('single', modelDataSingCrops);

        return result;

    }

    ProductionModel.prototype.getOriginalTotalCropsModel = function(){
        return originalTotalCropsModel;
    }

    ProductionModel.prototype.getOriginalData = function(){
        return originalData;
    }

    ProductionModel.prototype.getModelData = function(){
        return modelData;
    }

    ProductionModel.prototype.convertOriginalToModelData = function(modality, modelData){
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
        return result;
    }

    ProductionModel.prototype.convertModelDataToOriginal = function(){

    }

    ProductionModel.prototype.createSingleCropModel = function(numberOfCrops,modelData){
        // To create like the modelData, but with something different( the Area Planted)

    }

    ProductionModel.prototype.getTotalCropsData = function(){

        if(typeof numberOfCrops ==='undefined') {
            var filterData = supportUtiltity.getFilterData()
            var filterCrops = { "regionCode": filterData.country, "productCode": filterData.product}
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

    return ProductionModel;

})