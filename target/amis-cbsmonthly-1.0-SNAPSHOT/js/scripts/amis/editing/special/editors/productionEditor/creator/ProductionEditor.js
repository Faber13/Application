/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "productionEditor/observer/ProductionObserver",
        "productionEditor/model/ProductionModel", "specialFormulaConf/formulaHandler/FormulaHandler", "productionEditor/controller/ProductionController"],
    function ($, Formatter, Observer, ModelProduction, FormulaHandler, Controller) {

        var observer, modelProduction, supportUtility, formulaHandler, originalTotCropsModel, productionController, controllerEditors, clickedCell;

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

        function ProductionEditor() {
            observer = new Observer;
            modelProduction = new ModelProduction;
            formulaHandler = new FormulaHandler;
            productionController = new Controller;
        }

        ProductionEditor.prototype.init = function (clickedItem, itemsInvolved, codesInvolved, configurator, Utility, ControllerEditors) {
            controllerEditors = ControllerEditors;

            var involvedItems = $.extend(true, [], itemsInvolved);
            supportUtility = Utility;

            // take data and calculate initial formulas
            originalTotCropsModel = modelProduction.getTotalCropsModel(involvedItems, supportUtility);
            debugger;
            productionController.init(this, formulaHandler, modelProduction)

            var copyOriginalModelTot = $.extend(true, [], originalTotCropsModel);

            var formulaTotCrops = formulaHandler.getInitFormulaFromConf(1, 'totalValues')
            var totalCropsCalc = formulaHandler.createFormula(copyOriginalModelTot, formulaTotCrops)

            var singleCropsModel = modelProduction.getSingleCropsModel(involvedItems, supportUtility);
            var copyOriginalModelSingle = $.extend(true, [], singleCropsModel);

            var valueCodeItem = parseInt(clickedItem[0])

            var map = {
                2: "Area Harvested",
                5: "Production",
                4: "Yield",
                37: "Area Planted"
            }
            console.log('InovolvedItems')
            console.log(involvedItems)

            var source = {
                datatype: "array",
                datafields: [
                    { name: 6, type: 'string' },
                    { name: 3, type: 'float' },
                    { name: 4, type: 'string'},
                    {name: 5, type: 'string'}
                ],
                id: 'ppp',
                localdata: totalCropsCalc
            };

            var source2 = {
                datatype: "array",
                datafields: [
                    { name: 6, type: 'string' },
                    { name: 7, type: 'string' },
                    { name: 3, type: 'float' },
                    { name: 4, type: 'string'},
                    { name: 5, type: 'string'}
                ],
                id: 'ppp',
                localdata: copyOriginalModelSingle
            };

            var dataAdapter = new $.jqx.dataAdapter(source);
            var dataAdapter2 = new $.jqx.dataAdapter(source2);

            var f = document.getElementById("productionForm");

            if (f !== null) {
                f.remove()
            }

            var modal = '<div class="modal fade" id="productionForm"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                '<div class="modal-dialog">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" id="closeModal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                '<h4 class="modal-title" id="myModalLabel">Production Form</h4>' +
                '</div>' +
                '<div class="modal-body" id ="toappendData">' +
                '<div id="productionTabs">' +
                '<ul>' +
                '<li>Total Values </li>' +
                '<li>Singe Crop Values </li>' +
                '</ul>' +

                '<div id="totalValues"><br>' +
                '<div class="row"><br>' +
                '<div class="col-lg-3 col-lg-offset-1">' +
                '<div class ="totalValuesBoxes" id="firstCheckBoxTotVal">' + map[5] + '</div>' +
                '</div>' +

                '<div class="col-lg-3">' +
                '<div class ="totalValuesBoxes" id="secondCheckBoxTotVal">' + map[2] + '</div>' +
                '</div>' +
                '<div class="col-lg-3">' +
                '<div class ="totalValuesBoxes" id="thirdCheckBoxTotVal">' + map[4] + '</div>' +
                '</div><br><br>' +
                '<div class="row">' +
                '<div class="col-lg-3 col-lg-offset-4">' +
                '<button type="button" class="btn btn-primary" id="applyRulesFormulaTot">Recalculate Data</button>' +
                '</div>' +
                '</div><div class="row"><br><div class = "col-lg-10 col-lg-offset-1" id="alertTotal"></div></div><hr>' +
                '</div>' +
                '<br>' +
                '<div class="row"><div class="col-lg-10 col-lg-offset-1">' +
                '<div id="gridTotalValues"></div></div></div>' +
                '<div class="modal-footer">' +
                '<button type="button" class="btn btn-default" data-dismiss="modal" >Close</button>' +
                '<button type="button" class="btn btn-primary" data-dismiss="modal" id="saveTotalValues">Save changes</button>' +
                '</div>' +
                '</div>' +

                 // Single Crops ------------------------------------
                '<div id="singleCropValues"><br>' +
                '<div class="row"><br>' +
                '<div class="col-lg-3 col-lg-offset-1">' +
                '<div class ="singleCropsBoxes" id="firstCheckBoxSingleCrops">' + map[5] + '</div>' +
                '</div>' +

                '<div class="col-lg-3">' +
                '<div class ="singleCropsBoxes" id="secondCheckBoxSingleCrops">' + map[2] + '</div>' +
                '</div>' +
                '<div class="col-lg-3">' +
                '<div class ="singleCropsBoxes" id="thirdCheckBoxSingleCrops">' + map[4] + '</div>' +
                '</div><br><br>' +
                '<div class="row">' +
                '<div class="col-lg-3 col-lg-offset-4">' +
                '<button type="button" class="btn btn-primary" id="applyRulesFormulaSingle">Recalculate Data</button>' +
                '</div>' +
                '</div><div class="row"><br><div class = "col-lg-10 col-lg-offset-1" id="alertSingle"></div></div><hr>' +
                '</div>' +
                '<br>' +
                '<div class="row"><div class="col-lg-10 col-lg-offset-1">' +
                '<div id="gridSingleCrops"></div></div></div>' +

                '<div class="modal-footer">' +
                '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                '<button type="button" class="btn btn-primary" data-dismiss="modal">Save changes</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';


            $("#pivotGrid").append(modal);
            $('#firstCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, checked: true});
            $('#secondCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, checked: true});
            $('#thirdCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, disabled: true });

            $('#firstCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, checked: true});
            $('#secondCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, checked: true});
            $('#thirdCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, disabled: true });

            $('#gridTotalValues').jqxGrid({
                source: dataAdapter,
                width: "100%",
                editable: true,
                selectionmode: 'singlecell',
                columnsresize: true,
                pageable: true,
                autoheight: true,
                columns: [
                    { text: 'Element', datafield: 6 },
                    { text: 'Value', datafield: 3 },
                    { text: 'Flag', datafield: 4 },
                    { text: 'Notes', datafield: 5 }
                ]
            });

            $('#gridSingleCrops').jqxGrid({
                source: dataAdapter2,
                width: "100%",
                editable: true,
                selectionmode: 'singlecell',
                columnsresize: true,
                pageable: true,
                autoheight: true,
                columns: [
                    { text: 'Element', datafield: 6 },
                    { text: 'Crop',    datafield: 7},
                    { text: 'Value',   datafield: 3 },
                    { text: 'Flag',    datafield: 4 },
                    { text: 'Notes',   datafield: 5 }
                ]
            });

            $('#productionForm').on('shown.bs.modal', function (e) {
                $('#productionTabs').jqxTabs();
            })
            $("#productionForm").modal({ backdrop: 'static',
                keyboard: false});

            observer.applyListeners(this, productionController)
        }

        ProductionEditor.prototype.updateTotGrid = function (calculatedModel) {


            var source = {
                datatype: "array",
                datafields: [
                    { name: 6, type: 'string' },
                    { name: 3, type: 'float' },
                    { name: 4, type: 'string'},
                    {name: 5,  type: 'string'}
                ],
                id: 'ppp',
                localdata: calculatedModel
            };

            var dataAdapter = new $.jqx.dataAdapter(source);

            $('#gridTotalValues').jqxGrid({
                source: dataAdapter,
                width: "100%",
                editable: true,
                selectionmode: 'singlecell',
                columnsresize: true,
                pageable: true,
                autoheight: true,
                columns: [
                    { text: 'Element', datafield: 6 },
                    { text: 'Value',   datafield: 3 },
                    { text: 'Flag',    datafield: 4 },
                    { text: 'Notes',   datafield: 5 }
                ]
            });

        }

        ProductionEditor.prototype.updateSingleGrid = function (calculatedModel) {

            var source = {
                datatype: "array",
                datafields: [
                    { name: 6, type: 'string'},
                    { name: 7, type: 'string'},
                    { name: 3, type: 'float' },
                    { name: 4, type: 'string'},
                    { name: 5, type: 'string'}
                ],
                id: 'ppp',
                localdata: calculatedModel
            };

            var dataAdapter = new $.jqx.dataAdapter(source);

            $('#gridSingleCrops').jqxGrid({
                source: dataAdapter,
                width: "100%",
                editable: true,
                selectionmode: 'singlecell',
                columnsresize: true,
                pageable: true,
                autoheight: true,
                columns: [
                    { text: 'Element', datafield: 6 },
                    { text: 'Crop',    datafield: 7 },
                    { text: 'Value',   datafield: 3 },
                    { text: 'Flag',    datafield: 4 },
                    { text: 'Notes',   datafield: 5 }
                ]
            });

        }

        ProductionEditor.prototype.saveDataTotGrid = function(dataCalculated, originalData){
            controllerEditors.saveFormProduction(dataCalculated,originalData);
        }

        return ProductionEditor;
    })