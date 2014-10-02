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
        this.listenToRecalculateButtonSingleCrops();
        this.listenToRecalculateButtonTotalValues()
        this.listenToSaveTotalValuesButton();
        this.listenToTabs()
       //his.listenToCheckboxesSingleCrops()
    }

    PaddyObserver.prototype.listenToCheckboxesSingleCrops = function () {

        var that = this;

        $("#firstCheckBoxSingleCrops").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxSingleCrops(1) : that.onUncheckBoxSingleCrops([2, 3]);
        })
        $("#secondCheckBoxSingleCrops").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxSingleCrops(2) : that.onUncheckBoxSingleCrops([1, 3]);
        })
        $("#thirdCheckBoxSingleCrops").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxSingleCrops(3) : that.onUncheckBoxSingleCrops([1, 2]);
        })
    }

    PaddyObserver.prototype.onCheckBoxSingleCrops = function (clicked) {
        var result = []
        switch (clicked) {
            case 1:
                if ($("#secondCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#thirdCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'yield';

                }
                else if ($("#thirdCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#secondCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'areaHarvested';
                }
                break;

            case 2:
                if ($("#firstCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#thirdCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'yield';

                } else if ($("#thirdCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#firstCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'production';
                }
                break;

            case 3:
                if ($("#firstCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#secondCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'areaHarvested';

                }
                else if ($("#secondCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#firstCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'production';

                }
                break;
        }
    }

    PaddyObserver.prototype.onUncheckBoxSingleCrops = function (others) {
        for (var i = 0; i < others.length; i++) {
            switch (others[i]) {
                case 1:
                    if ($("#firstCheckBoxSingleCrops").attr("aria-disabled") == 'true') {
                        $("#firstCheckBoxSingleCrops").jqxCheckBox('enable');
                    }
                    break;
                case 2:
                    if ($("#secondCheckBoxSingleCrops").attr("aria-disabled") == 'true') {
                        $("#secondCheckBoxSingleCrops").jqxCheckBox('enable');
                    }
                    break;
                case 3:
                    if ($("#thirdCheckBoxSingleCrops").attr("aria-disabled") == 'true') {
                        $("#thirdCheckBoxSingleCrops").jqxCheckBox('enable');
                    }
                    break;
            }
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
                break;

            case 2:
                // milled
                if ($("#fourthCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#fourthCheckBoxTotVal").jqxCheckBox('uncheck');
                }
                $("#fourthCheckBoxTotVal").jqxCheckBox('disable');

                break;

            case 3:
                $("#firstCheckBoxTotVal").jqxCheckBox('disable');
                break;

            case 4:
                if ($("#secondCheckBoxTotVal").attr("aria-disabled") != 'true') {
                    $("#secondCheckBoxTotVal").jqxCheckBox('disable');
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

            debugger;
            console.log('')

            // third is disabled on default
            evt.preventDefault();
            evt.stopImmediatePropagation();
            var counter = 0;
            counter += $("#firstCheckBoxTotVal").val() ? 1 : 0;
            counter += $("#secondCheckBoxTotVal").val() ? 1 : 0;
            counter += $("#thirdCheckBoxTotVal").val() ? 1 : 0;
            counter += $("#fourthCheckBoxTotVal").val() ? 1 : 0;

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


    PaddyObserver.prototype.listenToEditCellSingleGrid = function () {

        $("#gridSingleCrops").on('cellendedit', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            totalValuesModified = true;
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
                controllerPaddy.updateSingleCropsGridOnEditing(numberOfRow, value2, formulaToApplyTot, columnValue)
            } else if (columnValue != 3 && (oldvalue != value)) { // if modified only flag/notes
                var numberOfRow = event.args.rowindex;
                controllerPaddy.updateSingleCropsGridOnEditing(numberOfRow, value, formulaToApplyTot, columnValue)
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
            debugger;
            var clickedItem = event.args.item;
            if (clickedItem == 0 && singleCropsValuesModified) { // from single crops to total values
                controllerPaddy.onSwitchingCropsValues(formulaToApplySingle)

            }
        });
    }

    PaddyObserver.prototype.setTotalValuesOnModified = function(){
        totalValuesModified = true;
    }


    return PaddyObserver;
})