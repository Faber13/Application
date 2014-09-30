/**
 * Created by fabrizio on 9/30/14.
 */
define(['jquery','paddyEditor/model/PaddyModel', 'paddyEditor/observer/PaddyObserver', 'paddyEditor/creator/PaddyCreator'],  function($,
    PaddyModel, PaddyObserver,PaddyEditor){

    var editorsController, observer, modelPaddy, editorPaddy, supportUtility,
        originalTotCropsModel;

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

    function PaddyController(){
        observer = new PaddyObserver;
        modelPaddy = new PaddyModel;
        editorPaddy = new PaddyEditor;
    }

    PaddyController.prototype.init = function(clickedItem, itemsInvolved, codesInvolved, configurator, Utility, ControllerEditors){
        editorsController = ControllerEditors;
        var involvedItems = $.extend(true, [], itemsInvolved);
        supportUtility = Utility;
        // take data and calculate initial formulas

        originalTotCropsModel = modelPaddy.getTotalCropsModel(involvedItems, supportUtility);

    }

    return PaddyController;
})