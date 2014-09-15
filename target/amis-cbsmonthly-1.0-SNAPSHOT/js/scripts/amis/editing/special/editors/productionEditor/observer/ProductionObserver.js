/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery", "formatter/DatatypesFormatter"], function ($, Formatter) {

    function ProductionObserver() {
    }

    ProductionObserver.prototype.applyListeners = function () {
        this.listenToCheckboxes();
        this.listenToRecalculateButton();
        this.listenToTabs();
    }

    ProductionObserver.prototype.listenToCheckboxes = function () {

        debugs = function () {
            debugger;
        }
        var that = this;

        $("#firstCheckBox").on('change', function (event) {
            (event.args.checked) ? that.onCheckBox(1) : that.onUncheckBox([2, 3]);
        })
        $("#secondCheckBox").on('change', function (event) {
            (event.args.checked) ? that.onCheckBox(2) : that.onUncheckBox([1, 3]);
        })
        $("#thirdCheckBox").on('change', function (event) {
            (event.args.checked) ? that.onCheckBox(3) : that.onUncheckBox([1, 2]);
        })


    }

    ProductionObserver.prototype.onUncheckBox = function (others) {
        for (var i = 0; i < others.length; i++) {
            switch (others[i]) {
                case 1:
                    if ($("#firstCheckBox").attr("aria-disabled") == 'true') {
                        $("#firstCheckBox").jqxCheckBox('enable');
                    }
                    break;
                case 2:
                    if ($("#secondCheckBox").attr("aria-disabled") == 'true') {
                        $("#secondCheckBox").jqxCheckBox('enable');
                    }
                    break;
                case 3:
                    if ($("#thirdCheckBox").attr("aria-disabled") == 'true') {
                        $("#thirdCheckBox").jqxCheckBox('enable');
                    }
                    break;
            }
        }
    }

    ProductionObserver.prototype.onCheckBox = function (clicked) {
        var result = []
        switch (clicked) {
            case 1:
                if ($("#secondCheckBox").attr("aria-checked") == 'true') {
                    $("#thirdCheckBox").jqxCheckBox('disable');
                }
                else if($("#thirdCheckBox").attr("aria-checked") == 'true'){
                    $("#secondCheckBox").jqxCheckBox('disable');
                }
                break;

            case 2:
                if ($("#firstCheckBox").attr("aria-checked") == 'true') {
                    $("#thirdCheckBox").jqxCheckBox('disable');
                }else if($("#thirdCheckBox").attr("aria-checked") == 'true'){
                    $("#firstCheckBox").jqxCheckBox('disable');
                }
                break;

            case 3:
                if ($("#firstCheckBox").attr("aria-checked") == 'true') {
                    $("#secondCheckBox").jqxCheckBox('disable');
                }
                else if ($("#secondCheckBox").attr("aria-checked") == 'true') {
                    $("#firstCheckBox").jqxCheckBox('disable');
                }
                break;
        }
    }

    ProductionObserver.prototype.listenToRecalculateButton = function(){
        $('#applyRulesFormula').on('click', function(){

        })
    }


    ProductionObserver.prototype.listenToTabs = function(){
        $('#productionTabs').on('tabclick', function (event)
        {
            var clickedItem = event.args.item;
            console.log(clickedItem)
        });
    }


    return ProductionObserver;
})