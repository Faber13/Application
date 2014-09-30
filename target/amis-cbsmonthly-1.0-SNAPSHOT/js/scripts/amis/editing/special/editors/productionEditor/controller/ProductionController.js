/**
 * Created by fabrizio on 9/24/14.
 */
define(['jquery'], function($){

    var formulaHandler, editorProduction, modelProduction

    function ProductionController(){};

    ProductionController.prototype.init = function(EditorProduction, HandlerFormulas, ModelProduction){
        formulaHandler = HandlerFormulas;
        editorProduction = EditorProduction;
        modelProduction = ModelProduction;

    }

    ProductionController.prototype.updateTotGridOnEditing = function(rowNumber, newValue, formulaToApply, columnValue){

        var formulaToUpdate
        if (formulaToApply == 'init') {
            formulaToUpdate = formulaHandler.getInitFormulaFromConf(1, 'totalValues')
        } else {
            formulaToUpdate = formulaHandler.getUpdateFormula(1, 'totalValues', formulaToApply)
        }

        modelProduction.setOriginalData(rowNumber, newValue, columnValue);
        var dataUpdated = modelProduction.getOriginalTotalCropsModel()
        var modelTotalCrops = $.extend(true, [], dataUpdated)


        var calculatedModel = formulaHandler.createFormula(modelTotalCrops, formulaToUpdate)
        var modelCalculated =  $.extend(true, [], calculatedModel);
        modelProduction.setCalculatedTotalModel(modelCalculated)
        editorProduction.updateTotGrid(calculatedModel);

    }

    ProductionController.prototype.updateTotGridOnFormulaChanges = function(formulaToApply){
        var formulaToUpdate = formulaHandler.getUpdateFormula(1, 'totalValues', formulaToApply)
        var dataUpdated = modelProduction.getOriginalTotalCropsModel()

        var modelTotalCrops = $.extend(true, [], dataUpdated)

        var calculatedModel = formulaHandler.createFormula(modelTotalCrops, formulaToUpdate)
        var modelCalculated =  $.extend(true, [], calculatedModel);
        modelProduction.setCalculatedTotalModel(modelCalculated)
        editorProduction.updateTotGrid(calculatedModel);

    }

    ProductionController.prototype.updateSingleCropsGridOnFormulaChanges = function(formulaToApply){
        var formulaToUpdate = formulaHandler.getUpdateFormula(1, 'singleCrops', formulaToApply)
        var dataUpdated = modelProduction.getOriginalSingleCropsModel();

        var modelSingleCrops = $.extend(true, [], dataUpdated);
        var calculatedModel = formulaHandler.createFormula(modelSingleCrops, formulaToUpdate)
        var modelCalculated =  $.extend(true, [], calculatedModel);
        modelProduction.setCalculatedSingleModel(modelCalculated)
        editorProduction.updateSingleGrid(calculatedModel);

    }

    ProductionController.prototype.updateSingleCropsGridOnEditing = function(rowNumber, newValue, formulaToApply, columnValue){

        var formulaToUpdate;
        if (formulaToApply == 'init') {
            formulaToUpdate = formulaHandler.getInitFormulaFromConf(1, 'singleCrops')
        } else {
            formulaToUpdate = formulaHandler.getUpdateFormula(1, 'singleCrops', formulaToApply)
        }
        var belongingCrops = parseInt(rowNumber/4)+1;
        // set new value
        modelProduction.setOriginalCropsData(newValue, rowNumber,columnValue )
        // get all the model
        var allData = modelProduction.getOriginalSingleCropsModel();
        // filter data through crops number
        var dataForCrops = modelProduction.filterModelSingleFromCrops(belongingCrops, allData);
        // filterData through crops number
        var calculatedDataFromCrops = formulaHandler.createFormula(dataForCrops, formulaToUpdate);
        // insert batch into model
        var newCalculatedData = modelProduction.fuseAndGetDataTogether(calculatedDataFromCrops,allData, belongingCrops)
        var modelCalculated =  $.extend(true, [], newCalculatedData);
        modelProduction.setCalculatedSingleModel(modelCalculated)
        editorProduction.updateSingleGrid(newCalculatedData);
    }

    ProductionController.prototype.saveTotalValues = function(formulaToApply){
        var dataOriginal = modelProduction.getOriginalTotalCropsModelOriginalConverted();
        var dataCalculated = modelProduction.getCalculatedTotalModel();
        editorProduction.saveDataTotGrid(dataCalculated,dataOriginal);
    }

    ProductionController.prototype.onSwitchingCropsValues = function(formulaSingleToApply){
        var originalSingleCropsModel = modelProduction.getOriginalSingleCropsModel()
        var dataSingleCrops = $.extend(true, [], originalSingleCropsModel)
        var dataUnified = modelProduction.unifySingleCropsData(dataSingleCrops);
        var totalValueModel = $.extend(true, [],modelProduction.getOriginalTotalCropsModel());
        var rowIndexes = [];
        for(var i =0; i<dataUnified.length; i++) {
            for(var j=0; j<totalValueModel.length; j++) {
                if (totalValueModel[j][0] == dataUnified[i][0]) {
                    modelProduction.setOriginalData(j, dataUnified[i][3], 3)
                }
            }
        }
        console.log('formulaSingleToApply')
        if(formulaSingleToApply == 'init'){
            formulaSingleToApply = 'yield'
        }
        editorProduction.setTotalValuesOnModified()
        this.updateTotGridOnFormulaChanges(formulaSingleToApply)
    }

    return ProductionController;
})