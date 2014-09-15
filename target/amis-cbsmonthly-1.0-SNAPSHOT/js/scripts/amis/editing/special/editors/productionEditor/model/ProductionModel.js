/**
 * Created by fabrizio on 9/15/14.
 */
define(["jquery"], function($){

// models
    var originalData, modelData, totalCropsData;

// variables
    var numberOfCrops;

// Modules
    var supportUtiltity;

// URL
    var cropsUrl = "http://168.202.28.178:8080/dataset/crops"

    var map=  {
        2 : "Area Harvested",
        5 : "Production",
        4 : "Yield",
        37: "Area Planted"
    }

    function ProductionModel(){}

    ProductionModel.prototype.init = function(data, Utility){
        supportUtiltity = Utility;
        originalData =data;
        modelData = $.extend([], true, data)
        this.convertModelDataToOriginal();
    }

    ProductionModel.prototype.getOriginalData = function(){
        return originalData;
    }

    ProductionModel.prototype.getModelData = function(){
        return modelData;
    }

    ProductionModel.prototype.convertOriginalToModelData = function(){
        var copyMap = $.extend([], true, map);
        // delete Area Planted from object
        delete copyMap[37]

        for(var i =0; i< modelData.length; i++){
            var code = modelData[i][0]
            modelData[i].push(copyMap[code])
        }
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