/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery", "formatter/DatatypesFormatter"], function ($, Formatter) {

    var editorProduction, formulaToApplyTot, formulaToApplySingle;

    function ProductionObserver() {
    }

    ProductionObserver.prototype.applyListeners = function (EditorProduction) {
        formulaToApplyTot = 'init';
        formulaToApplySingle = 'init';
        editorProduction = EditorProduction;
        this.listenToCheckboxesTotal();
        this.listenToCheckboxesSingleCrops()
        this.listenToRecalculateButtonTotalValues();
        this.listenToRecalculateButtonSingleCrops();
        this.listenToTabs();
        this.listenToEditCellTotGrid()
    }

    ProductionObserver.prototype.listenToCheckboxesTotal = function () {

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
        $("#thirdCheckBoxTotVal").on('change', function (event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            (event.args.checked) ? that.onCheckBoxTotal(3) : that.onUncheckBoxTotal([1, 2]);
        })


    }

    ProductionObserver.prototype.listenToCheckboxesSingleCrops = function () {

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

    ProductionObserver.prototype.onCheckBoxTotal = function (clicked) {
        var result = []
        switch (clicked) {
            case 1:
                if ($("#secondCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#thirdCheckBoxTotVal").jqxCheckBox('disable');
                    formulaToApplyTot = 'yield';

                }
                else if($("#thirdCheckBoxTotVal").attr("aria-checked") == 'true'){
                    $("#secondCheckBoxTotVal").jqxCheckBox('disable');
                    formulaToApplyTot = 'areaHarvested';
                }
                break;

            case 2:
                if ($("#firstCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#thirdCheckBoxTotVal").jqxCheckBox('disable');
                    formulaToApplyTot = 'yield';

                }else if($("#thirdCheckBoxTotVal").attr("aria-checked") == 'true'){
                    $("#firstCheckBoxTotVal").jqxCheckBox('disable');
                    formulaToApplyTot = 'production'
                }
                break;

            case 3:
                if ($("#firstCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#secondCheckBoxTotVal").jqxCheckBox('disable');
                    formulaToApplyTot = 'areaHarvested';

                }
                else if ($("#secondCheckBoxTotVal").attr("aria-checked") == 'true') {
                    $("#firstCheckBoxTotVal").jqxCheckBox('disable');
                    formulaToApplyTot = 'production'

                }
                break;
        }
    }

    ProductionObserver.prototype.onCheckBoxSingleCrops = function (clicked) {
        var result = []
        switch (clicked) {
            case 1:
                if ($("#secondCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#thirdCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'yield';

                }
                else if($("#thirdCheckBoxSingleCrops").attr("aria-checked") == 'true'){
                    $("#secondCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'areaHarvested';
                }
                break;

            case 2:
                if ($("#firstCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#thirdCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'yield';

                }else if($("#thirdCheckBoxSingleCrops").attr("aria-checked") == 'true'){
                    $("#firstCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'production'
                }
                break;

            case 3:
                if ($("#firstCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#secondCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'areaHarvested';

                }
                else if ($("#secondCheckBoxSingleCrops").attr("aria-checked") == 'true') {
                    $("#firstCheckBoxSingleCrops").jqxCheckBox('disable');
                    formulaToApplySingle = 'production'

                }
                break;
        }
    }

    ProductionObserver.prototype.onUncheckBoxTotal = function (others) {
        for (var i = 0; i < others.length; i++) {
            switch (others[i]) {
                case 1:
                    if ($("#firstCheckBoxTotVal").attr("aria-disabled") == 'true') {
                        $("#firstCheckBoxTotVal").jqxCheckBox('enable');
                    }
                    break;
                case 2:
                    if ($("#secondCheckBoxTotVal").attr("aria-disabled") == 'true') {
                        $("#secondCheckBoxTotVal").jqxCheckBox('enable');
                    }
                    break;
                case 3:
                    if ($("#thirdCheckBoxTotVal").attr("aria-disabled") == 'true') {
                        $("#thirdCheckBoxTotVal").jqxCheckBox('enable');
                    }
                    break;
            }
        }
    }

    ProductionObserver.prototype.onUncheckBoxSingleCrops = function (others) {
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

    ProductionObserver.prototype.listenToRecalculateButtonTotalValues = function(){
        $('#applyRulesFormulaTot').on('click', function(evt){
            // third is disabled on default
            evt.preventDefault();
            evt.stopImmediatePropagation();
            var counter = 0;
            counter += $("#firstCheckBoxTotVal").val()? 1:0;
            counter += $("#secondCheckBoxTotVal").val()? 1:0;
            counter += $("#thirdCheckBoxTotVal").val()? 1:0;
            if(counter == 2){ //OK
                editorProduction.updateTotalValueGridWithFormula(formulaToApplyTot);
            }else{
                var alert = '<div class="alert alert-danger alert-dismissible" role="alert">'+
                    '<button type="button" class="close" data-dismiss="alert">'+
                    '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
                    '<strong>Attention!</strong> You have to select <strong>2 elements</strong></div>';
                $('#alert').append(alert)
            }
        })
    }

    ProductionObserver.prototype.listenToRecalculateButtonSingleCrops = function(){
        $('#applyRulesFormulaTot').on('click', function(evt){
            // third is disabled on default
            evt.preventDefault();
            evt.stopImmediatePropagation();
            var counter = 0;
            counter += $("#firstCheckBoxSingleCrops").val()? 1:0;
            counter += $("#secondCheckBoxSingleCrops").val()? 1:0;
            counter += $("#thirdCheckBoxSingleCrops").val()? 1:0;
            if(counter == 2){ //OK
                editorProduction.updateTotalValueGridWithFormula(formulaToApplyTot);
            }else{
                var alert = '<div class="alert alert-danger alert-dismissible" role="alert">'+
                    '<button type="button" class="close" data-dismiss="alert">'+
                    '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
                    '<strong>Attention!</strong> You have to select <strong>2 elements</strong></div>';
                $('#alert').append(alert)
            }
        })
    }

    ProductionObserver.prototype.listenToTabs = function(){
        $('#productionTabs').on('tabclick', function (event) {
            event.preventDefault()
            var clickedItem = event.args.item;
        });
    }

    ProductionObserver.prototype.listenToEditCellTotGrid = function(){
        var checkAll = function(object){
            return typeof object!=='undefined' && object != null && object != '';
        }
        $("#gridTotalValues").on('cellendedit', function (event){
            event.preventDefault();
            event.stopPropagation()
            event.stopImmediatePropagation();
            var dataField = event.args.datafield;
            var oldvalue = event.args.oldvalue;
            var value = event.args.value;
            if(checkAll(oldvalue)){
                oldvalue = parseFloat(oldvalue)
                if(checkAll(value)){
                    value = parseFloat(value)
                }
            }
            if(dataField == 3 && (oldvalue !=value)){
                var numberOfRow = event.args.rowindex;
                editorProduction.updateTotGridOnEditing(numberOfRow, value,formulaToApplyTot)
            }
        })

    }

    return ProductionObserver;
})