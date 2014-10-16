/**
 * Created by fabrizio on 10/16/14.
 */
define(['jquery'], function($){

    var isEditable, editingOnCell, generalController

    function EditHandler(){}

    EditHandler.prototype.startEditCell = function(resultedClicked, isEditable, editingOnCell, grid, GeneralController){
        var clickedCell =   resultedClicked["clickedCell"]
        generalController = GeneralController
        switch(isEditable){
            case 0:
                //not editable
                grid.editCancel();
                break;

            case 1:
                // editable

                if(editingOnCell){
                    grid.getEditor().setValue(clickedCell[3]) // change the value
                    debugger;

                }else{
                    grid.editCancel();
                    generalController.startFullEditing(resultedClicked)
                }


                break;

            case 2:
                // Special editing
                grid.editCancel();
                generalController.startSpecialEditing(resultedClicked)
                break;
        }
    }

    EditHandler.prototype.updateEditingOnCell = function(updated){
        editingOnCell = updated
    }

    return EditHandler;
})