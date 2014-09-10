/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery", "view/GridDataView", "editorController/FormController",
        "exporter/controller/ExportController", "adapter/AdapterPivot", "formulasAmis/controller/FormulaController", "jqwidgets"],
    function ($, GridDataView, EditorController, ExportController, Adapter, FormulaController) {

        var ViewGrid, ModelController, FormController, dsd, Configurator, adapterPivot, formulaController, supportUtility;

        function GeneralController() {
            ViewGrid = new GridDataView;
            FormController = new EditorController;
            adapterPivot = new Adapter;
            formulaController = new FormulaController;
        };


        GeneralController.prototype.init = function (gridModel, tableModel, configurator, modelController, utility) {
            ModelController = modelController;
            dsd = configurator.getDSD();
            Configurator = configurator;
            supportUtility = utility;
            // create a copy
            var tableModelWithFormula = $.extend(true, [], tableModel);

            // formula
            formulaController.init(tableModelWithFormula, Configurator)

            // visualization model
            ViewGrid.init(tableModelWithFormula, configurator, supportUtility)
            // append listeners to events
            this.createListeners()
        }


        GeneralController.prototype.createListeners = function () {

            var idPivot = Configurator.getIdOlapGrid()
            // Transform pivotGrid into grid
            var grid = $("#" + idPivot).igPivotGrid("grid");
            var that = this;

            var DELAY = 250,
                clicks = 0,
                timer = null;

            $(document.body).delegate("#" + grid.id(), "iggridcellclick", function (evt, ui) {

                evt.stopImmediatePropagation();

                var cellTableModel2 = ModelController.getTableDataModel();
                var cellTableModel = $.extend(true, [], cellTableModel2);
                // To identify when the first new nested row starts
                var indexesObject = ModelController.getIndexesNewFirstColumnLeft();
                var resultedClicked = adapterPivot.getClickedCell(cellTableModel, Configurator, ui, indexesObject);
                var clickedCell = resultedClicked["clickedCell"]
                clicks++;

                // Editing Cell
                if(clicks === 1) {
                    timer = setTimeout(function () {
                        evt.preventDefault();
                        clicks = 0;
                        var cell = ui.cellElement;
                        var oldCell = document.getElementById("clickedCell")
                        var functionChanges = function (evt, ui) {
                            if (ui.oldValue != ui.value) {
                                clickedCell[3] = parseFloat(ui.value);
                                var indTable = resultedClicked["indTable"];
                                var rowGridIndex = resultedClicked["rowGridIndex"];
                                var columnGridIndex = resultedClicked["columnGridIndex"];
                                that.updateGrid(clickedCell, indTable, rowGridIndex, columnGridIndex);
                            }
                        }
                        if (cell.parentElement !== oldCell) {
                            if (typeof oldCell !== 'undefined' && oldCell != null) {
                                if(oldCell.firstElementChild != null) {
                                    $("#" + oldCell.id).igTextEditor('destroy');
                                }
                                oldCell.removeAttribute("id")
                                oldCell.removeAttribute("class")
                            }
                            cell.setAttribute("id", "clickedCell");
                            console.log("clickCell")
                            $("#clickedCell").igTextEditor({
                                width: 160,
                                height: 41,
                                value: clickedCell[3],
                                valueChanged: functionChanges
                            });
                        }
                    }, DELAY)
                }else{
                    if(document.getElementById('clickedCell') != null){
                        $('#clickedCell').igTextEditor('destroy');
                    }
                    that.startFullEditing(resultedClicked)
                    clicks = 0;

                    console.log('doubleClick')
                }

            //    $('#clickedCell').dblclick(that.startFullEditing(resultedClicked))
            })
            $('#clickedCell').dblclick(function(e){
                e.preventDefault()
            })

            $("#exportButton").click(function () {
                var ExportControl = new ExportController;
                var table = ModelController.getTableDataModel();
                ExportControl.init(table, Configurator)
            })
        }

        GeneralController.prototype.startFullEditing = function (resultedClicked) {


            var clickedCell = resultedClicked["clickedCell"]
            var indTable = resultedClicked["indTable"];
            var rowGridIndex = resultedClicked["rowGridIndex"];
            var columnGridIndex = resultedClicked["columnGridIndex"];
            FormController.init(Configurator, clickedCell, dsd)
            this.onSaveButton(indTable, clickedCell, rowGridIndex, columnGridIndex);

        }


        GeneralController.prototype.onSaveButton = function (indTable, cell, rowIndex, columnIndex) {

            var that = this;
            $("#saveButton").on('click', function (e) {
                e.stopImmediatePropagation();
                $('#saveButton').off();
                var newCell = FormController.getValue(cell)
                if (newCell.length > 0) {
                    that.updateGrid(newCell, indTable, rowIndex, columnIndex)
                }
            });
        }


        GeneralController.prototype.updateGrid = function (newCell, indTable, rowIndex, columnIndex) {
            var bindedKeys = formulaController.getBindedKeys();
            ModelController.updateModels(newCell, indTable, rowIndex, columnIndex)
            // check if need to apply a formula
            var codeNewCell = newCell[0]
            if (formulaController.checkIfBindedCode(bindedKeys, codeNewCell)) {

                var tableModel = ModelController.getTableDataModel();
                var modelWithFormulas = $.extend(true, [], tableModel);
                formulaController.init(modelWithFormulas, Configurator)

                var formulas = formulaController.getFormulasBindedFromKey(codeNewCell)
                // Initially, order by date
                formulaController.sortByDateAtStart(modelWithFormulas);

                var rowsChanged = formulaController.applyUpdateFormulas(modelWithFormulas, formulas, columnIndex, rowIndex);
                rowsChanged.push({'index': indTable, 'row': newCell})
                // at the end, order like initially
                formulaController.sortInitialValue(modelWithFormulas);
                ViewGrid.updateBatchGridView(modelWithFormulas, rowsChanged);
            } else {
                ViewGrid.updateGridView(newCell, indTable);
            }
        }

        return GeneralController;

    });