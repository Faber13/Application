/**
 * Created by fabrizio on 9/11/14.
 */
define(["jquery", "editingSpecial/utils/DataHandler", "productionEditor/creator/ProductionEditor"], function($, DataHandler, ProductionEditor){

    var specialFormulaController, dataHandler, productionEditor, dsdConfigurator, supportUtiliy;

    function ControllerEditors(){
        dataHandler = new DataHandler;
        productionEditor = new ProductionEditor;
    }

    ControllerEditors.prototype.init = function(allData,modelDataTable,resultedClicked, formulaController, DsdConfigurator, Utility){
        dsdConfigurator = DsdConfigurator;
        var everyData = allData;
        var tableData = modelDataTable;
        supportUtiliy = Utility;

        var takenCell =resultedClicked.clickedCell
        specialFormulaController = formulaController;
        // first take all the involvedCodes
        var codes = specialFormulaController.getInvolvedItems(takenCell);
        var dataInvolved = dataHandler.getInvolvedData(codes, everyData,tableData, takenCell);
        var condition =parseInt(takenCell[0])
        switch (condition) {
            case 5 :
                productionEditor.init(takenCell,dataInvolved,codes, dsdConfigurator, supportUtiliy)
                break;

            case 15:
                break;

            case 998:
                break;
        }

    }

    return ControllerEditors;

    })