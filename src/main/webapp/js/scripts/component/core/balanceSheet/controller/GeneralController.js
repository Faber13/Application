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
            // create a copy
            var tableModelWithFormula = $.extend(true, [], tableModel);
            // formula
            formulaController.init(tableModelWithFormula, Configurator)

            // visualization model
            ViewGrid.init(tableModelWithFormula, configurator)
            // append listeners to events
            this.createListeners()
        }


        GeneralController.prototype.createListeners = function () {

            var idPivot = Configurator.getIdOlapGrid()
            // Transform pivotGrid into grid
            var grid = $("#" + idPivot).igPivotGrid("grid");
            var that = this;

            // attach the listener on click
            $(document.body).delegate("#" + grid.id(), "iggridcellclick", function (evt, ui) {
                // Only the FIRST ROW column indexes start from 2!
                evt.stopImmediatePropagation()
                var cellTableModel2 = ModelController.getTableDataModel();
                var cellTableModel = $.extend(true, [], cellTableModel2);
                // To identify when the first new nested row starts
                var indexesObject = ModelController.getIndexesNewFirstColumnLeft();
                var resultedClicked = adapterPivot.getClickedCell(cellTableModel, Configurator, ui, indexesObject);
                var clickedCell = resultedClicked["clickedCell"]
                var indTable = resultedClicked["indTable"];
                var rowGridIndex = resultedClicked["rowGridIndex"];
                var columnGridIndex = resultedClicked["columnGridIndex"];
                FormController.init(Configurator, clickedCell, dsd)
                that.onSaveButton(indTable, clickedCell, rowGridIndex, columnGridIndex);
            });

            $("#exportButton").click(function () {
                var ExportControl = new ExportController;
                var table = ModelController.getTableDataModel();
                ExportControl.init(table, Configurator)
            })
        }


        GeneralController.prototype.onSaveButton = function (indTable, cell, rowIndex, columnIndex) {
            debugger;
            var bindedKeys = formulaController.getBindedKeys();
            $("#saveButton").on('click', function (e) {
                e.stopImmediatePropagation();
                $('#saveButton').off();
                var newCell = FormController.getValue(cell)
                if (newCell.length > 0) {
                    ModelController.updateModels(newCell, indTable, rowIndex, columnIndex)
                    // check if need to apply a formula
                    var codeNewCell = newCell[0]
                    if (formulaController.checkIfBindedCode(bindedKeys, codeNewCell)) {
                        debugger;
                        var tableModel = ModelController.getTableDataModel();
                        var modelWithFormulas =  $.extend(true, [], tableModel);
                        formulaController.init(modelWithFormulas, Configurator)

                         var formulas = formulaController.getFormulasBindedFromKey(codeNewCell)
                          // Initially, order by date
                         formulaController.sortByDateAtStart(modelWithFormulas);

                         var rowsChanged =formulaController.applyUpdateFormulas(modelWithFormulas, formulas, columnIndex, rowIndex);
                         rowsChanged.push({'index': indTable,'row': newCell})
                          // at the end, order like initially
                         formulaController.sortInitialValue(modelWithFormulas);
                        ViewGrid.updateBatchGridView(modelWithFormulas, rowsChanged);
                    } else {
                        ViewGrid.updateGridView(newCell, indTable);
                    }
                }
            });
        }

        return GeneralController;

    });