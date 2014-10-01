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
        this.listenToEditCellTotGrid();
        this.listenToSaveTotalValuesButton()
       //his.listenToCheckboxesSingleCrops()
    }

    PaddyObserver.prototype.listenToCheckboxesTotal = function(){
        var that = this;
        $("#firstCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxTotal(1) : that.onUncheckBoxTotal([2, 3]);
        })
        $("#secondCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxTotal(2) : that.onUncheckBoxTotal([1, 3]);
        })


    }

    PaddyObserver.prototype.onCheckBoxTotal = function(number) {
        switch (number) {
            case 1:
                if ($("#secondCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#firstCheckBoxTotVal").jqxCheckBox('disable');
                }
                break;

            case 2:
                if ($("#firstCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#secondCheckBoxTotVal").jqxCheckBox('disable');
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



    return PaddyObserver;
})