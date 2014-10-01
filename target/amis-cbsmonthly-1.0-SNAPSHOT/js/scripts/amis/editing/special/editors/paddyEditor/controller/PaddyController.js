/**
 * Created by fabrizio on 9/30/14.
 */
define(['jquery','paddyEditor/model/PaddyModel', 'paddyEditor/observer/PaddyObserver', 'paddyEditor/creator/PaddyCreator'],  function($,
    PaddyModel, PaddyObserver,PaddyEditor){

    var editorsController, observer, modelPaddy, editorPaddy, supportUtility,
        originalTotCropsModel;

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
    }

    PaddyController.prototype.init = function(clickedItem, itemsInvolved, codesInvolved, configurator, Utility, ControllerEditors){
        observer.init(this)
        editorsController = ControllerEditors;
        var involvedItems = $.extend(true, [], itemsInvolved);
        supportUtility = Utility;
        // take data and calculate initial formulas

        modelPaddy.createTotalValuesModel(involvedItems, supportUtility);
        var originalTotCropsModel = modelPaddy.getTotalValuesModel();
        modelPaddy.createSingleCropsModel(involvedItems, supportUtility)
        var singleCropsModel = modelPaddy.getSingleCropsModel()
        editorPaddy.init(originalTotCropsModel, singleCropsModel, observer)
    }

    PaddyController.prototype.updateTotGridOnEditing = function(rowNumber, newValue, formulaToApply, columnValue){
        /* TODO
        var formulaToUpdate
        if (formulaToApply == 'init') {
            formulaToUpdate = formulaHandler.getInitFormulaFromConf(1, 'totalValues')
        } else {
            formulaToUpdate = formulaHandler.getUpdateFormula(1, 'totalValues', formulaToApply)
        }*/
        modelPaddy.setOriginalTotalData(rowNumber, newValue, columnValue);
        var dataUpdated = modelPaddy.getTotalValuesModel()
        var modelTotalCrops = $.extend(true, [], dataUpdated)
 /* TODO
        var calculatedModel = formulaHandler.createFormula(modelTotalCrops, formulaToUpdate)
        var modelCalculated =  $.extend(true, [], calculatedModel);
        modelProduction.setCalculatedTotalModel(modelCalculated)
*/
        observer.closeEventsBindedToTotGrid()
        editorPaddy.updateTotGrid(modelTotalCrops);
        observer.applyListeners()


    }

    PaddyController.prototype.updateSingleCropsGridOnEditing  = function(rowNumber, newValue, formulaToApply, columnValue){
        // TODO
    }

    PaddyController.prototype.updateTotGridOnFormulaChanges = function(formulaToApply){
        // TODO

    }

    PaddyController.prototype.updateSingleCropsGridOnFormulaChanges = function(formulaToApply){
        // TODO
    }

    PaddyController.prototype.saveTotalValues = function(formulaToApply){
        // TODO

        console.log('paddyController: saveTotalValues')
       var dataOriginal = modelPaddy.getAndConvertOriginalTotValues();
       // var dataCalculated = modelPaddy.getCalculatedTotalModel();
       // TRUE!  editorProduction.saveDataTotGrid(dataCalculated,dataOriginal);
        console.log('dataToSave:')
        console.log(dataOriginal)
       editorsController.saveFormRiceProduction(dataOriginal,dataOriginal); // this is FALSE!! true is up
    }

    PaddyController.prototype.onSwitchingCropsValues = function(formulaSingleToApply){
        // TODO
    }

    return PaddyController;
})