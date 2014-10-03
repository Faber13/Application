/**
 * Created by fabrizio on 9/11/14.
 */
define(["jquery", "editingSpecial/utils/DataHandler", "productionEditor/creator/ProductionEditor",
"paddyEditor/controller/PaddyController"], function($, DataHandler, ProductionEditor, PaddyController){

    var specialFormulaController, dataHandler, productionEditor, dsdConfigurator, supportUtility,
        clickedCellInfo, generalController, paddyController;

    function ControllerEditors(){
        dataHandler = new DataHandler;
        productionEditor = new ProductionEditor;
        paddyController = new PaddyController;
    }

    // Simple production
    ControllerEditors.prototype.init = function(allData,modelDataTable,resultedClicked, formulaController, DsdConfigurator, Utility,GeneralController,
        filterProductCode){

        generalController = GeneralController;
        dsdConfigurator = DsdConfigurator;
        var everyData = allData;
        var tableData = modelDataTable;
        supportUtility = Utility;
        clickedCellInfo = resultedClicked

        var takenCell =resultedClicked.clickedCell
        specialFormulaController = formulaController;
        // first take all the involvedCodes
        var codes = specialFormulaController.getInvolvedItems(takenCell, filterProductCode);
        var dataInvolved = dataHandler.getInvolvedData(codes, everyData, tableData, takenCell);

        var condition =parseInt(takenCell[0])

        switch (condition) {
           case 5 :
            if(filterProductCode !=4) {
                   productionEditor.init(takenCell, dataInvolved, codes, dsdConfigurator, supportUtility, this)
               }else{
                   paddyController.init(takenCell, dataInvolved, codes, dsdConfigurator, supportUtility, this)
               }

                break;

           case 15:
               break;

           case 998:
               break;
        }

    }


    ControllerEditors.prototype.saveFormProduction = function( calculatedData, originalData){
        generalController.saveDataFromProductionForm(calculatedData,originalData,clickedCellInfo)
    }

    ControllerEditors.prototype.saveFormRiceProduction = function(calculatedData, originalData){
        console.log('saveFormRice Production: Controller Editors')
        generalController.saveDataFromProductionRiceForm(calculatedData,originalData,clickedCellInfo)
    }

    return ControllerEditors;

    })