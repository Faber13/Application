/**
 * Created by fabrizio on 9/30/14.
 */
define(['jquery','paddyEditor/model/PaddyModel', 'paddyEditor/observer/PaddyObserver', 'paddyEditor/creator/PaddyCreator',
    "specialFormulaConf/formulaHandler/FormulaHandler"],  function($,
    PaddyModel, PaddyObserver,PaddyEditor, FormulaHandler){

    var editorsController, observer, modelPaddy, editorPaddy, supportUtility,originalTotCropsModel, formulaHandler;

    // ---------------------- SUPPORT FUNCTIONS -------------------------------------------

    Element.prototype.remove = function () {
        this.parentElement.removeChild(this);
    }

    NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
        for (var i = 0, len = this.length; i < len; i++) {
            if (this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        }
    }
    // ------------------------------------------------------------------------------------

    function PaddyController(){
        observer = new PaddyObserver;
        modelPaddy = new PaddyModel;
        editorPaddy = new PaddyEditor;
        formulaHandler = new FormulaHandler;
    }

    PaddyController.prototype.init = function(clickedItem, itemsInvolved, codesInvolved, configurator, Utility, ControllerEditors){
        observer.init(this)
        editorsController = ControllerEditors;
        var involvedItems = $.extend(true, [], itemsInvolved);
        supportUtility = Utility;
        // take data and calculate initial formulas

        modelPaddy.createTotalValuesModel(involvedItems, supportUtility);
        var originalTotCropsModel = modelPaddy.getTotalValuesModel();
        var copyOriginalModelTot = $.extend(true, [], originalTotCropsModel);

        var formulaTotCrops = formulaHandler.getInitFormulaFromConf(2, 'totalValues')

        var totalCropsCalc = formulaHandler.createFormula(copyOriginalModelTot, formulaTotCrops)

        modelPaddy.createSingleCropsModel(involvedItems, supportUtility)
        var singleCropsModel = modelPaddy.getSingleCropsModel()
        editorPaddy.init(totalCropsCalc, singleCropsModel, observer)
    }

    PaddyController.prototype.updateTotGridOnEditing = function(rowNumber, newValue, formulaToApply, columnValue){

        var formulaToUpdate
        if (formulaToApply == 'init') {
            formulaToUpdate = formulaHandler.getInitFormulaFromConf(2, 'totalValues')
        } else {
            formulaToUpdate = formulaHandler.getUpdateFormula(2, 'totalValues', formulaToApply)
        }
        modelPaddy.setOriginalTotalData(rowNumber, newValue, columnValue);
        var dataUpdated = modelPaddy.getTotalValuesModel()
        var modelTotalCrops = $.extend(true, [], dataUpdated)

        var calculatedModel = formulaHandler.createFormula(modelTotalCrops, formulaToUpdate)
        var modelCalculated =  $.extend(true, [], calculatedModel);
        modelPaddy.setCalculatedTotalModel(modelCalculated)

       // observer.closeEventsBindedToTotGrid()
        editorPaddy.updateTotGrid(modelTotalCrops);
      //  observer.applyListeners()


    }

    PaddyController.prototype.updateSingleCropsGridOnEditing  = function(rowNumber, newValue, formulaToApply, columnValue){

        console.log('updateSingleCrops On editing')
        debugger;
        var formulaToUpdate;
        if (formulaToApply == 'init') {
            formulaToUpdate = formulaHandler.getInitFormulaFromConf(2, 'singleCrops')
        } else {
            formulaToUpdate = formulaHandler.getUpdateFormula(2, 'singleCrops', formulaToApply)
        }
        var belongingCrops = parseInt(rowNumber/4)+1;
        // set new value
        modelPaddy.setOriginalCropsData(newValue, rowNumber,columnValue )
        // get all the model
        var allData = modelPaddy.getSingleCropsModel();

        // filter data through crops number
        var dataForCrops = modelPaddy.filterModelSingleFromCrops(belongingCrops, allData);

        // filterData through crops number
        var calculatedDataFromCrops = formulaHandler.createFormula(dataForCrops, formulaToUpdate);

        // insert batch into model
        var newCalculatedData = modelPaddy.fuseAndGetDataTogether(calculatedDataFromCrops,allData, belongingCrops)

        var modelCalculated =  $.extend(true, [], newCalculatedData);
        modelPaddy.setCalculatedSingleModel(modelCalculated)
        editorPaddy.updateSingleGrid(newCalculatedData);
    }

    PaddyController.prototype.updateTotGridOnFormulaChanges = function(formulaToApply){
        var formulaToUpdate = formulaHandler.getUpdateFormula(2, 'totalValues', formulaToApply)
        var dataUpdated = modelPaddy.getTotalValuesModel()

        var modelTotalCrops = $.extend(true, [], dataUpdated)
        var calculatedModel = formulaHandler.createFormula(modelTotalCrops, formulaToUpdate)

        var modelCalculated =  $.extend(true, [], calculatedModel);
        modelPaddy.setCalculatedTotalModel(modelCalculated)
        modelPaddy.updateTotGrid(calculatedModel);

    }

    PaddyController.prototype.updateSingleCropsGridOnFormulaChanges = function(formulaToApply){
        var formulaToUpdate = formulaHandler.getUpdateFormula(2, 'singleCrops', formulaToApply)
        var dataUpdated = modelPaddy.getSingleCropsModel();

        var modelSingleCrops = $.extend(true, [], dataUpdated);
        var calculatedModel = formulaHandler.createFormula(modelSingleCrops, formulaToUpdate)
        var modelCalculated =  $.extend(true, [], calculatedModel);
        modelPaddy.setCalculatedSingleModel(modelCalculated)
        editorPaddy.updateSingleGrid(calculatedModel);

    }

    PaddyController.prototype.saveTotalValues = function(formulaToApply){

       var dataOriginal = modelPaddy.getAndConvertOriginalTotValues();
       var dataCalculated = modelPaddy.getCalculatedTotalModel();
       // TRUE!  editorProduction.saveDataTotGrid(dataCalculated,dataOriginal);

       editorsController.saveFormRiceProduction(dataCalculated,dataOriginal); // this is FALSE!! true is up
    }

    PaddyController.prototype.onSwitchingCropsValues = function(formulaSingleToApply){
        var originalSingleCropsModel = modelPaddy.getSingleCropsModel()
        var dataSingleCrops = $.extend(true, [], originalSingleCropsModel)
        var dataUnified = modelPaddy.unifySingleCropsData(dataSingleCrops);
        var totalValueModel = $.extend(true, [],modelPaddy.getTotalValuesModel());
        var rowIndexes = [];
        for(var i =0; i<dataUnified.length; i++) {
            for(var j=0; j<totalValueModel.length; j++) {
                if (totalValueModel[j][0] == dataUnified[i][0]) {
                    modelPaddy.setOriginalData(j, dataUnified[i][3], 3)
                }
            }
        }
        console.log('formulaSingleToApply')
        if(formulaSingleToApply == 'init'){
            formulaSingleToApply = 'yield'
        }
        observer.setTotalValuesOnModified()
        this.updateTotGridOnFormulaChanges(formulaSingleToApply)
    }

    return PaddyController;
})