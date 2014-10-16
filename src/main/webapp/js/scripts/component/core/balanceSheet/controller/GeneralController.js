/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery", "view/GridDataView2", "editorController/FormController",
        "exporter/controller/ExportController", "adapterGrid", "formulasAmis/controller/FormulaController",
        "editingSpecial/controller/ControllerEditors", "generalObserver/GeneralObserver" ,"editHandler","jquery.sidebar"],
    function ($, GridDataView, EditorController, ExportController, Adapter, FormulaController, SpecialEditorController, GeneralObserver,
        EditHandler) {

        var ViewGrid, ModelController, FormController, dsd, Configurator, adapterGrid, formulaController, supportUtility,
            specialControlEditor, editingOnCell, generalObserver, filterData, xCoordinate, yCoordinate, grid, editHandler;

        function GeneralController() {
            editHandler = new EditHandler;
            ViewGrid = new GridDataView;
            FormController = new EditorController;
            adapterGrid = new Adapter;
            formulaController = new FormulaController;
            specialControlEditor = new SpecialEditorController;
            generalObserver = new GeneralObserver;
            editingOnCell = true
        };

        GeneralController.prototype.init = function (gridModel, tableModel, configurator, modelController, utility) {
            generalObserver.init(this)
            ModelController = modelController;
            dsd = configurator.getDSD();
            Configurator = configurator;
            supportUtility = utility;
            // create a copy
            var tableModelWithFormula = $.extend(true,[], tableModel);
            filterData = supportUtility.getFilterData()

            // formula
            formulaController.init(tableModelWithFormula, Configurator, filterData)

            // visualization model
             grid = ViewGrid.init(tableModelWithFormula, configurator, supportUtility)
            console.log
            // append listeners to events
            this.createListeners();
            this.onChangeModalityEditing();
        }

        GeneralController.prototype.createListeners = function () {

            // Transform pivotGrid into grid
        //    var grid = $("#" + idPivot).igPivotGrid("grid");
            var self = this;
            console.log('grid')
            console.log(grid)

            grid.attachEvent("onItemClick", function(id, e, node){
                //oldValue = this.getEditorValue(id) // save the old value
                debugger;
                e.preventDefault();
                e.stopImmediatePropagation();

                xCoordinate = window.pageXOffset;
                yCoordinate = window.pageYOffset;

                var cellTableModel2 = ModelController.getTableDataModel();
                var cellTableModel = $.extend(true, {}, cellTableModel2);
                // To identify when the first new nested row starts
                var indexesObject = ModelController.getIndexesNewFirstColumnLeft();
                var resultedClicked = adapterGrid.getClickedCell(cellTableModel, Configurator, id, this, indexesObject);
                var clickedCell = resultedClicked["clickedCell"]
                var isEditable = formulaController.checkIfEditableCell(clickedCell)
                editHandler.startEditCell(resultedClicked, isEditable, editingOnCell, grid, self)
            });

            grid.attachEvent("onBeforeEditStop", function(state, editor){
                this.blockEvent()
                state.value = state.old;
              //  this.editCancel();
                this.unblockEvent();
            });

/*
                $(document.body).delegate("#" + grid.id(), "iggridcellclick", function (evt, ui) {
                debugger;
                evt.preventDefault();
                evt.stopImmediatePropagation();
                xCoordinate = window.pageXOffset;
                yCoordinate = window.pageYOffset;
                var cellTableModel2 = ModelController.getTableDataModel();
                var cellTableModel = $.extend(true, {}, cellTableModel2);
                // To identify when the first new nested row starts
                var indexesObject = ModelController.getIndexesNewFirstColumnLeft();
                var resultedClicked = adapterGrid.getClickedCell(cellTableModel, Configurator, ui, indexesObject);
                var clickedCell = resultedClicked["clickedCell"]
                var isEditable = formulaController.checkIfEditableCell(clickedCell)
                var cell = ui.cellElement;
                var oldCell = document.getElementById("clickedCell")
                if (cell.parentElement != oldCell) {
                    if (typeof oldCell !== 'undefined' && oldCell != null) {
                        if (oldCell.firstElementChild != null) {
                            $("#" + oldCell.id).igTextEditor('destroy');
                        }
                        oldCell.removeAttribute("id")
                        oldCell.removeAttribute("class")
                    }
                    if (isEditable == 1) {
                        if (editingOnCell) {
                            var functionChanges = function (evt, ui) {
                                if (ui.oldValue != ui.value) {
                                    clickedCell[3] = parseFloat(ui.value);
                                    var indTable = resultedClicked["indTable"];
                                    var rowGridIndex = resultedClicked["rowGridIndex"];
                                    var columnGridIndex = resultedClicked["columnGridIndex"];
                                    that.updateGrid(clickedCell, indTable, rowGridIndex, columnGridIndex);
                                }
                            }
                            if (typeof oldCell !== 'undefined' && oldCell != null) {
                               if (oldCell.firstElementChild != null) {
                                  $("#" + oldCell.id).igTextEditor('destroy');
                               }
                               oldCell.removeAttribute("id")
                               oldCell.removeAttribute("class")
                            }
                            console.log('clickedCell3')
                            console.log(clickedCell[3])
                            if(clickedCell[3] == null){
                                clickedCell[3] = '';
                            }
                            cell.setAttribute("id", "clickedCell");
                            $("#clickedCell").igTextEditor({
                               textMode: "text",
                               value: clickedCell[3],
                               focusOnSpin: false,
                               selectionOnFocus: 0,
                               valueChanged: functionChanges
                            });
                        }
                        else { // editing total
                            var cell = ui.cellElement;
                            var oldCell = document.getElementById("clickedCell")
                            if (document.getElementById('clickedCell') != null) {
                                $('#clickedCell').igTextEditor('destroy');
                                oldCell.removeAttribute("id")
                                oldCell.removeAttribute("class")
                            }
                            that.startFullEditing(resultedClicked)
                        }
                    }
                        // if it is a special editable value
                     else if (isEditable == 2) {
                        // production form
                        if (resultedClicked.clickedCell[0] == 5 || resultedClicked.clickedCell[0] == 2 || resultedClicked.clickedCell[0] == 4) {
                            var allData = $.extend(true, {}, ModelController.getData());
                            var tableData = $.extend(true, {}, ModelController.getTableDataModel());
                            specialControlEditor.init(allData, tableData, resultedClicked, formulaController, Configurator, supportUtility, that, filterData.productCode);
                        } else {
                            var allData = ModelController.getData();
                            var tableData = $.extend(true, {}, ModelController.getTableDataModel());
                            specialControlEditor.init(allData, tableData, resultedClicked, formulaController, Configurator, supportUtility, that,filterData.productCode);
                        }// other form
                    }
                }
            })*/


            $("#export").click(function () {
                var ExportControl = new ExportController;
                var table = ModelController.getTableDataModel();
                ExportControl.init(table, Configurator)
            })


            $('#newForecast').on("click", function(){
               that.updateWithNewForecast()
            })
        }

        GeneralController.prototype.startSpecialEditing = function(resultedClicked){
            if (resultedClicked.clickedCell[0] == 5 || resultedClicked.clickedCell[0] == 2 || resultedClicked.clickedCell[0] == 4) {
                var allData = $.extend(true, {}, ModelController.getData());
                var tableData = $.extend(true, {}, ModelController.getTableDataModel());
                specialControlEditor.init(allData, tableData, resultedClicked, formulaController, Configurator, supportUtility, this, filterData.productCode);
            } else {
                var allData = ModelController.getData();
                var tableData = $.extend(true, {}, ModelController.getTableDataModel());
                specialControlEditor.init(allData, tableData, resultedClicked, formulaController, Configurator, supportUtility, this,filterData.productCode);
            }// other form
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
                e.preventDefault()
                e.stopImmediatePropagation();
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
                formulaController.init(modelWithFormulas, Configurator, filterData)

                var formulas = formulaController.getFormulasBindedFromKey(codeNewCell)
                // Initially, order by date
                formulaController.sortByDateAtStart(modelWithFormulas);

                var rowsChanged = formulaController.applyUpdateFormulas(modelWithFormulas, formulas, columnIndex, rowIndex);
                console.log('before Row changed')
                console.log(rowsChanged)
                rowsChanged.push({'index': indTable, 'row': newCell})
                console.log('rowChanged')
                console.log(rowsChanged)
                // at the end, order like initially
                formulaController.sortInitialValue(modelWithFormulas);
                ViewGrid.updateBatchGridView(modelWithFormulas, rowsChanged, xCoordinate, yCoordinate);
            } else {
                ViewGrid.updateGridView(newCell, indTable, xCoordinate, yCoordinate);
            }
        }

        GeneralController.prototype.saveDataFromProductionRiceForm = function(newCalculatedData, newOriginalData, cellClickedInfo){

            var indexes = ModelController.saveDataFromRiceProduction(newOriginalData, cellClickedInfo.indTable, cellClickedInfo.rowGridIndex, cellClickedInfo.columnGridIndex)
            var tableModel = ModelController.getTableDataModel();
            console.log('generalController: saveDataFromProductionForm, afet getTableData')

            var modelWithFormulas = $.extend(true, [], tableModel);
            console.log('generalController: saveDataFromProductionForm, afet formula.init')

            formulaController.init(modelWithFormulas, Configurator, filterData)
            var rowsChanged= []
            for(var i =0; i<newCalculatedData.length; i++){
                for(var j =0; j<indexes.length; j++) {
                    if (newCalculatedData[i][0] == indexes[j]['key']) {
                        rowsChanged.push({'index': indexes[j]['index'], 'row': newCalculatedData[i]})
                    }
                }
            }
            console.log('generalController: saveDataFromProductionForm, before updateBatchGridView')
            ViewGrid.updateBatchGridView(modelWithFormulas, rowsChanged, xCoordinate, yCoordinate);

        }

        GeneralController.prototype.saveDataFromProductionForm = function(newCalculatedData,newOriginalData, cellClickedInfo){
            console.log('generalController: saveDataFromProductionForm, init')
            var indexes = ModelController.saveDataFromProduction(newOriginalData, cellClickedInfo.indTable, cellClickedInfo.rowGridIndex, cellClickedInfo.columnGridIndex)
            var tableModel = ModelController.getTableDataModel();
            console.log('generalController: saveDataFromProductionForm, afet getTableData')

            var modelWithFormulas = $.extend(true, [], tableModel);
            console.log('generalController: saveDataFromProductionForm, afet formula.init')

            formulaController.init(modelWithFormulas, Configurator, filterData)
            var rowsChanged= []
            for(var i =0; i<newCalculatedData.length; i++){
                for(var j =0; j<indexes.length; j++) {
                    if (newCalculatedData[i][0] == indexes[j]['key']) {
                        rowsChanged.push({'index': indexes[j]['index'], 'row': newCalculatedData[i]})
                    }
                }
            }
            console.log('generalController: saveDataFromProductionForm, before updateBatchGridView')
            ViewGrid.updateBatchGridView(modelWithFormulas, rowsChanged, xCoordinate, yCoordinate);
        }

        GeneralController.prototype.updateWithNewForecast = function(){
            var tableModel = ModelController.createNewForecast();
            var tableModelWithFormula = $.extend(true,[], tableModel);
            formulaController.init(tableModelWithFormula, Configurator, filterData)
            ViewGrid.init(tableModelWithFormula, Configurator, supportUtility)
            this.onChangeModalityEditing()
        }

        GeneralController.prototype.onChangeModalityEditing = function() {
            $("#editingChoice").bind('change', function (event) {
                event.preventDefault()
                editingOnCell = !event.args.checked;
                editHandler.updateEditingOnCell(editingOnCell)
            })
        }

        return GeneralController;

    });