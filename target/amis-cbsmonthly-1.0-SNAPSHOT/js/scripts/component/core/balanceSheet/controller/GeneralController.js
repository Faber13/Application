/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery", "view/GridDataView", "editorController/FormController",
    "exporter/controller/ExportController", "adapter/AdapterPivot", "formulasAmis/controller/FormulaController"],
    function ($, GridDataView, EditorController, ExportController, Adapter, FormulaController) {

    var ViewGrid, ModelController, FormController, dsd, Configurator, adapterPivot, formulaController;

    function GeneralController() {
        ViewGrid = new GridDataView;
        FormController = new EditorController;
        adapterPivot = new Adapter;
        formulaController = new FormulaController;

    };


    GeneralController.prototype.init = function (gridModel, tableModel, configurator, modelController) {
        ModelController = modelController;
        dsd = configurator.getDSD();
        Configurator = configurator;

        // formula
       formulaController.init(tableModel, configurator)

        // create a copy
        var tableModelInstance = $.extend(true, [], tableModel);
        // visualization model
        ViewGrid.init(tableModelInstance, configurator)
        // append listeners to events
        this.createListeners()
    }


    GeneralController.prototype.createListeners = function () {

        var idPivot = Configurator.getIdOlapGrid()
        // Transform pivotGrid into grid
        var grid = $("#"+idPivot).igPivotGrid("grid");
        var that = this;

        // attach the listener on click
        $(document.body).delegate("#" + grid.id(), "iggridcellclick", function (evt, ui) {
            // Only the FIRST ROW column indexes start from 2!
            evt.stopImmediatePropagation()
            var cellTableModel2 = ModelController.getTableDataModel();
            var cellTableModel = $.extend(true, [], cellTableModel2);
            // To identify when the first new nested row starts
            var indexesObject = ModelController.getIndexesNewFirstColumnLeft();
            var resultedClicked= adapterPivot.getClickedCell(cellTableModel, Configurator, ui, indexesObject);
            var clickedCell = resultedClicked["clickedCell"]
            var indTable = resultedClicked["indTable"] ;
            var rowGridIndex = resultedClicked["rowGridIndex"];
            var columnGridIndex = resultedClicked["columnGridIndex"];
            var grid = $("#pivotGrid").igPivotGrid("grid");
            FormController.init(Configurator, clickedCell, dsd)     
            that.onSaveButton(indTable, clickedCell, rowGridIndex, columnGridIndex);
        });

            $("#exportButton").click(function() {
            var ExportControl = new ExportController;
            var table = ModelController.getTableDataModel();
            ExportControl.init(table, Configurator)
        })
    }



    GeneralController.prototype.onSaveButton = function (indTable, cell, rowIndex, columnIndex) {
            
        $("#saveButton").on('click', function (e) {
            e.stopImmediatePropagation();
            $('#saveButton').off();
            var newCell = FormController.getValue(cell)
            if (newCell.length > 0) {
                ModelController.updateModels(newCell, indTable, rowIndex, columnIndex)
                ViewGrid.updateGridView(newCell, indTable);
            }
        });
    }


        return GeneralController;

    });