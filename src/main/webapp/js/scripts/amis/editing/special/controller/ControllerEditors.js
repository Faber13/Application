/**
 * Created by fabrizio on 9/11/14.
 */
define(["jquery", "editingSpecial/utils/DataHandler", "specialEditor"], function($, DataHandler, Editor){

    var specialFormulaController, dataHandler, genericEditor;

    function ControllerEditors(){
        dataHandler = new DataHandler;
        genericEditor = new Editor;
    }

    ControllerEditors.prototype.init = function(allData,resultedClicked, formulaController){

        var tCell =resultedClicked.clickedCell
        var cell = resultedClicked.clickedcell;
        specialFormulaController = formulaController;
        var codes = specialFormulaController.getInvolvedItems(resultedClicked.clickedCell);
        var dataInvolved = dataHandler.getInvolvedData(codes, allData, resultedClicked.clickedCell);
        alert()
        debugger;
        var condition =parseInt(resultedClicked.clickedCell[0])
        switch (condition) {
            case 5 :
                alert('preso!');
                debugger;
                genericEditor.createProductionEditor(resultedClicked.clickedcell,dataInvolved,codes)
                break;

            case 15:
                break;

            case 998:
                break;
        }





    }

    return ControllerEditors;

    })