/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "jqwidgets"], function($, Formatter){

    var controllerPaddy, formulaToApplyTot, formulaToApplySingle, totalValuesModified, singleCropsValuesModified

    // ------------ Support method ------------------//
    var checkAll = function(object){
        return typeof object!=='undefined' && object != null && object != '';}
    // ---------------------------------------------//

    function PaddyObserver(){}

    PaddyObserver.prototype.init = function(Controller){
        controllerPaddy = Controller;
        formulaToApplyTot = 'init';
        formulaToApplySingle = 'init';
        totalValuesModified = false;
        singleCropsValuesModified =false;
    }

    PaddyObserver.prototype.applyListeners = function(){

        this.listenToCheckboxesTotal();
        this.listenToCheckboxesSingleCrops();
        this.listenToEditCellTotGrid();
        this.listenToEditCellSingleGrid();
        this.listenToTotalEditable()
        this.listenToSingleCropsEditable();
        this.listenToRecalculateButtonSingleCrops();
        this.listenToRecalculateButtonTotalValues()
        this.listenToSaveTotalValuesButton();
        this.listenToTabs()
    }

    PaddyObserver.prototype.listenToCheckboxesSingleCrops = function () {

        var that = this;
        $("#firstCheckBoxSingleCrops").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxSingleCrops(1) :that.onUncheckBoxSingleCrops(1) ;
        })
        $("#secondCheckBoxSingleCrops").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxSingleCrops(2) :that.onUncheckBoxSingleCrops(2) ;
        })
        $("#thirdCheckBoxSingleCrops").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxSingleCrops(3) :that.onUncheckBoxSingleCrops(3) ;
        })
        $("#fourthCheckBoxSingleCrops").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxSingleCrops(4) :that.onUncheckBoxSingleCrops(4) ;
        })
    }

    PaddyObserver.prototype.onCheckBoxSingleCrops = function (clicked) {
        switch (number) {
            case 1:
                $("#secondCheckBoxSingleCrops").jqxCheckBox('check');
                $("#thirdCheckBoxSingleCrops").jqxCheckBox('disable');
                $("#fourthCheckBoxSingleCrops").jqxCheckBox('disable');
                formulaToApplySingle = 'milled';
                break;

            case 2:
                // milled
                if ($("#fourthCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#fourthCheckBoxSingleCrops").jqxCheckBox('uncheck');
                    $("#fourthCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'areaHarvested'
                }else  if ($("#fourthCheckBoxSingleCrops").attr("aria-checked") != 'true') {
                    $("#fourthCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'areaHarvested'
                }
                else if($("#firstCheckBoxSingleCrops").attr("aria-checked") == 'true'){
                    formulaToApplySingle = 'milled'
                }

                break;

            case 3:
                $("#firstCheckBoxSingleCrops").jqxCheckBox('disable');
                if ($("#fourthCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    formulaToApplySingle = 'yield'

                }else if($("#secondCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    formulaToApplySingle = 'areaHarvested'
                }
                break;

            case 4:
                if ($("#secondCheckBoxSingleCrops").attr("aria-disabled") != 'true') {
                    $("#secondCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'yield'
                }

                break;
        }
    }

    PaddyObserver.prototype.onUncheckBoxSingleCrops = function (number) {
        switch (number) {
            case 1:
                $("#thirdCheckBoxSingleCrops").jqxCheckBox('enable');
                $("#thirdCheckBoxSingleCrops").jqxCheckBox('check');
                $("#firstCheckBoxSingleCrops").jqxCheckBox('disable');
                $("#secondCheckBoxSingleCrops").jqxCheckBox('uncheck');
                $("#fourthCheckBoxSingleCrops").jqxCheckBox('enable');
                if ($("#secondCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    formulaToApplySingle = 'yield'
                }else if($("#fourthCheckBoxSingleCrops").attr("aria-checked") == 'true'){
                    formulaToApplySingle = 'areaHarvested'
                }
                break;

            case 2:
                // milled
                if ($("#firstCheckBoxSingleCrops").attr("aria-checked") != 'true') {
                    $("#fourthCheckBoxSingleCrops").jqxCheckBox('enable');
                }
                if ($("#secondCheckBoxSingleCrops").attr("aria-checked") == 'true' && $("#fourthCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    formulaToApplySingle = 'areaHarvested'
                }
                break;

            case 3:
                $("#firstCheckBoxSingleCrops").jqxCheckBox('enable');
                $("#firstCheckBoxSingleCrops").jqxCheckBox('check');
                $("#thirdCheckBoxSingleCrops").jqxCheckBox('disable');
                if ($("#fourthCheckBoxSingleCrops").attr("aria-disabled") != 'true') {
                    if($("#fourthCheckBoxSingleCrops").attr("aria-checked") == 'true'){
                        $('#fourthCheckBoxSingleCrops').jqxCheckBox('uncheck');
                    }
                    $("#fourthCheckBoxSingleCrops").jqxCheckBox('disable')
                }
                $("#secondCheckBoxSingleCrops").jqxCheckBox('enable');
                formulaToApplySingle = 'milled'
                break;

            case 4:

                if ($("#secondCheckBoxSingleCrops").attr("aria-disabled") == 'true') {
                    $("#secondCheckBoxSingleCrops").jqxCheckBox('enable');
                    $("#fourthCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'milled'
                }
                break;
        }
    }

    PaddyObserver.prototype.listenToCheckboxesTotal = function() {
        var that = this;
        $("#firstCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxTotal(1) :that.onUncheckBoxTotal(1) ;
        })
        $("#secondCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxTotal(2) :that.onUncheckBoxTotal(2) ;
        })
        $("#thirdCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxTotal(3) :that.onUncheckBoxTotal(3) ;
        })
        $("#fourthCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxTotal(4) :that.onUncheckBoxTotal(4) ;
        })
    }

    PaddyObserver.prototype.onCheckBoxTotal = function(number) {
        switch (number) {
            case 1:
                $("#secondCheckBoxTotVal").jqxCheckBox('check');
                $("#thirdCheckBoxTotVal").jqxCheckBox('disable');
                $("#fourthCheckBoxTotVal").jqxCheckBox('disable');
                formulaToApplyTot = 'milled';
                break;

            case 2:
                // milled
                if ($("#fourthCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#fourthCheckBoxTotVal").jqxCheckBox('uncheck');
                    $("#fourthCheckBoxTotVal").jqxCheckBox('disable');
                    formulaToApplyTot = 'areaHarvested'
                }else  if ($("#fourthCheckBoxTotVal").attr("aria-checked") != 'true') {
                    $("#fourthCheckBoxTotVal").jqxCheckBox('disable');
                    formulaToApplyTot = 'areaHarvested'
                }
                else if($("#firstCheckBoxTotVal").attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'milled'
                }

                break;

            case 3:
                $("#firstCheckBoxTotVal").jqxCheckBox('disable');
                if ($("#fourthCheckBoxTotVal").attr("aria-checked") == 'true') {
                    formulaToApplyTot = 'yield'

                }else if($("#secondCheckBoxTotVal").attr("aria-checked") == 'true') {
                    formulaToApplyTot = 'areaHarvested'
                }
                break;

            case 4:
                if ($("#secondCheckBoxTotVal").attr("aria-disabled") != 'true') {
                    $("#secondCheckBoxTotVal").jqxCheckBox('disable');
                    formulaToApplyTot = 'yield'
                }

                break;
        }
    }

    PaddyObserver.prototype.onUncheckBoxTotal = function(number) {
        switch (number) {
            case 1:
                $("#thirdCheckBoxTotVal").jqxCheckBox('enable');
                $("#thirdCheckBoxTotVal").jqxCheckBox('check');
                $("#firstCheckBoxTotVal").jqxCheckBox('disable');
                $("#secondCheckBoxTotVal").jqxCheckBox('uncheck');
                $("#fourthCheckBoxTotVal").jqxCheckBox('enable');
                if ($("#secondCheckBoxTotVal").attr("aria-checked") == 'true') {
                    formulaToApplyTot = 'yield'
                }else if($("#fourthCheckBoxTotVal").attr("aria-checked") == 'true'){
                    formulaToApplyTot = 'areaHarvested'
                }
                break;

            case 2:
                // milled
                if ($("#firstCheckBoxTotVal").attr("aria-checked") != 'true') {
                    $("#fourthCheckBoxTotVal").jqxCheckBox('enable');
                }
                if ($("#secondCheckBoxTotVal").attr("aria-checked") == 'true' && $("#fourthCheckBoxTotVal").attr("aria-checked") == 'true') {
                    formulaToApplyTot = 'areaHarvested'
                }
                break;

            case 3:
                $("#firstCheckBoxTotVal").jqxCheckBox('enable');
                $("#firstCheckBoxTotVal").jqxCheckBox('check');
                $("#thirdCheckBoxTotVal").jqxCheckBox('disable');
                if ($("#fourthCheckBoxTotVal").attr("aria-disabled") != 'true') {
                    if($("#fourthCheckBoxTotVal").attr("aria-checked") == 'true'){
                        $('#fourthCheckBoxTotVal').jqxCheckBox('uncheck');
                    }
                    $("#fourthCheckBoxTotVal").jqxCheckBox('disable')
                }
                $("#secondCheckBoxTotVal").jqxCheckBox('enable');
                formulaToApplyTot = 'milled'
                break;

            case 4:

                if ($("#secondCheckBoxTotVal").attr("aria-disabled") == 'true') {
                    $("#secondCheckBoxTotVal").jqxCheckBox('enable');
                    $("#fourthCheckBoxTotVal").jqxCheckBox('disable');
                    formulaToApplyTot = 'milled'
                }

                break;
        }
    }


    PaddyObserver.prototype.listenToEditCellTotGrid = function() {

        $("#gridTotalValues").on('cellendedit', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            console.log('cellEdit: listener Active')
            totalValuesModified = true;
            var columnValue = event.args.datafield;
            var oldvalue = event.args.oldvalue;
            var value = event.args.value;
            if (checkAll(oldvalue) && columnValue == 3) {
                oldvalue = parseFloat(oldvalue)
            }
                if (checkAll(value) && columnValue == 3) {
                value = parseFloat(value)
             }

            if (columnValue == 3 && (oldvalue != value)) {
                var numberOfRow = event.args.rowindex;
                var value2 = parseFloat(value)
                controllerPaddy.updateTotGridOnEditing(numberOfRow, value2, formulaToApplyTot, columnValue)
            } else if (columnValue != 3 && (oldvalue != value)) {
                var numberOfRow = event.args.rowindex;
                controllerPaddy.updateTotGridOnEditing(numberOfRow, value, formulaToApplyTot, columnValue)
            }
        })
    }

    PaddyObserver.prototype.listenToRecalculateButtonSingleCrops = function () {
        $('#applyRulesFormulaSingle').on('click', function (evt) {

            console.log('')

            // third is disabled on default
            evt.preventDefault();
            evt.stopImmediatePropagation();
            var counter = 0;
            counter += $("#firstCheckBoxSingleCrops").val() ? 1 : 0;
            counter += $("#secondCheckBoxSingleCrops").val() ? 1 : 0;
            counter += $("#thirdCheckBoxSingleCrops").val() ? 1 : 0;
            singleCropsValuesModified = true;
            console.log(counter)
            if (counter == 2) { //OK
                controllerPaddy.updateSingleCropsGridOnFormulaChanges(formulaToApplySingle);
            } else {
                var alert = '<div class="alert alert-danger alert-dismissible" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert">' +
                    '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                    '<strong>Attention!</strong> You have to select <strong>2 elements</strong></div>';
                $('#alertSingle').append(alert)
            }
        })
    }

    PaddyObserver.prototype.listenToRecalculateButtonTotalValues = function () {
        $('#applyRulesFormulaTot').on('click', function (evt) {
            // third is disabled on default
            evt.preventDefault();
            evt.stopImmediatePropagation();
            var counter = 0;
            counter += $("#firstCheckBoxTotVal").val() ? 1 : 0;
            counter += $("#secondCheckBoxTotVal").val() ? 1 : 0;
            counter += $("#thirdCheckBoxTotVal").val() ? 1 : 0;
            counter += $("#fourthCheckBoxTotVal").val() ? 1 : 0;

            singleCropsValuesModified = true;
            if (counter == 2) { //OK
                controllerPaddy.updateTotGridOnFormulaChanges(formulaToApplyTot);
            } else {
                var alert = '<div class="alert alert-danger alert-dismissible" role="alert">' +
                    '<button type="button" class="close" data-dismiss="alert">' +
                    '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                    '<strong>Attention!</strong> You have to select <strong>2 elements</strong></div>';
                $('#alertTotal').append(alert)
            }
        })
    }

    PaddyObserver.prototype.listenToTotalEditable = function(){
        $("#gridTotalValues").bind('cellbeginedit', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation()
            var toBlock = false;
            var row = event.args.rowindex;
            var column = event.args.datafield

            switch (formulaToApplyTot){
                case 'milled':
                   if(row == 0 || row == 4) {
                       toBlock = true;
                   }
                    break;
                case 'areaHarvested':
                    if(row == 1) {
                        toBlock = true;
                    }
                    break;
                case 'yield':
                    if(row == 1) {
                        toBlock = true;
                    }
                    break;
                case 'init':
                    if(row == 0 || row == 4) {
                        toBlock = true;
                    }
                    break
            }
            // condition follows
            if (toBlock) {
                $("#gridTotalValues").jqxGrid('endcelledit', row, column, true);
            }
        });
    }

    PaddyObserver.prototype.listenToSingleCropsEditable = function(){
        $("#gridSingleCrops").bind('cellbeginedit', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation()
            var toBlock = false;
            var row = event.args.rowindex;
            var column = event.args.datafield

            switch (formulaToApplyTot){
                case 'milled':
                    if(row == 0 || row == 4) {
                        toBlock = true;
                    }
                    break;
                case 'areaHarvested':
                    if(row == 1) {
                        toBlock = true;
                    }
                    break;
                case 'yield':
                    if(row == 1) {
                        toBlock = true;
                    }
                    break;
                case 'init':
                    if(row == 0 || row == 4) {
                        toBlock = true;
                    }
                    break
            }
            // condition follows
            if (toBlock) {
                $("#gridSingleCrops").jqxGrid('endcelledit', row, column, true);
            }
        });
    }


    PaddyObserver.prototype.listenToEditCellSingleGrid = function () {

        $("#gridSingleCrops").on('cellendedit', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            singleCropsValuesModified = true;
            var columnValue = event.args.datafield;
            var oldvalue = event.args.oldvalue;
            var value = event.args.value;
            if (checkAll(oldvalue)&& columnValue == 3) {
                oldvalue = parseFloat(oldvalue)
            }
            if (checkAll(value)&& columnValue == 3) {
                value = parseFloat(value)
            }

            if (columnValue == 3 && (oldvalue != value)) {
                var numberOfRow = event.args.rowindex;
                var value2 = parseFloat(value)
                controllerPaddy.updateSingleCropsGridOnEditing(numberOfRow, value2, formulaToApplySingle, columnValue)
            } else if (columnValue != 3 && (oldvalue != value)) { // if modified only flag/notes
                var numberOfRow = event.args.rowindex;
                controllerPaddy.updateSingleCropsGridOnEditing(numberOfRow, value, formulaToApplySingle, columnValue)
            }
        })

    }

    PaddyObserver.prototype.listenToSaveTotalValuesButton = function () {
        $('#saveTotalValues').on('click', function (event) {
            console.log('listenToSaveTotal values')
            event.preventDefault();
            event.stopImmediatePropagation();
            if (totalValuesModified) {
                controllerPaddy.saveTotalValues(formulaToApplyTot)
            }
        })
    }

    PaddyObserver.prototype.closeEventsBindedToTotGrid = function(){
        $("#gridTotalValues").off();
        $("#firstCheckBoxTotVal").off();
        $("#secondCheckBoxTotVal").off();
        $("#thirdCheckBoxTotVal").off();
        $("#fourthCheckBoxTotVal").off();
        $('#saveTotalValues').off()
    }

    PaddyObserver.prototype.listenToTabs = function () {
        $('#productionTabs').on('tabclick', function (event) {
            event.preventDefault()
            event.stopImmediatePropagation()   ;
            console.log('listenToTabs')
            var clickedItem = event.args.item;
            if (clickedItem == 0 && singleCropsValuesModified) { // from single crops to total values
                controllerPaddy.onSwitchingCropsValues(formulaToApplySingle)

            }
        });
    }

    PaddyObserver.prototype.getFormulaTotalValues = function(){
       var result =  formulaToApplyTot;
        return result;
    }

    PaddyObserver.prototype.setTotalValuesOnModified = function(){
        totalValuesModified = true;
    }


    return PaddyObserver;
})