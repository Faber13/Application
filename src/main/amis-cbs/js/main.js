// Place third party dependencies in the lib folder
requirejs.config({
    "baseUrl":              "js/scripts/libs",
    "paths": {
        jquery            : "jquery",
        preloading        :  "../amis/preloading",
        loading           :  "../amis/loading",
        utilities         :  "../component/core/balanceSheet/configuration/utilities",
        balanceSheet      :  "../component/core/balanceSheet",
        models            :  "../component/core/balanceSheet/models",
        views             :  "../component/core/balanceSheet/views",
        view              :  "../component/core/balanceSheet/views/gridDataView",
        configurator      :  "../component/core/balanceSheet/configuration/configurator",
        generalController :  "../component/core/balanceSheet/controller",
        modelController   :  "../component/core/balanceSheet/models/controllerDataModels",
        editor            :  "../component/plugins/Amis/InputTool/editing/editors",
        editorController  :  "../component/core/balanceSheet/editors/controller",
        exporter          :  "../component/core/balanceSheet/exports",
        validator         :  "../component/core/balanceSheet/validator",
        formatter         :  "../component/core/balanceSheet/formatter",
        adapter           :  "../component/core/balanceSheet/visualization/ignite/adapter",
        formulasAmis      :  "../amis/formulas",
        dataLoader        :  "../amis/loading/logic",
        editingSpecial    :  "../amis/editing/special",
        productionEditor  :  "../amis/editing/special/editors/productionEditor",
        paddyEditor       :  "../amis/editing/special/editors/paddyEditor",
        otherUsesEditor   :  "../amis/editing/special/editors/otherUsesEditor",
        paddyEditor       :  "../amis/editing/special/editors/paddyEditor",
        flagTranslator    :  "../component/plugins/Amis/InputTool/utils/flagFormatter",
        specialFormulaConf:  "../amis/editing/special/configuration",
        generalObserver   :  "../component/core/balanceSheet/observer",
        urlConfigurator   :  "../services/configurator/ServicesConfigurator",
        databaseSaver     :  "../amis/saving"
    },
    "shim": {
        "bootstrap": {
            deps: ["jquery"]
        },
        "infragistics" : {
            "deps" : ["jquery","jquery-ui"]
        },
        "jquery-ui" : {
            "deps" : ["jquery"]
        },
        "jquery.dirtyFields" : {
            deps: ["jquery"]
        },
        "timepicker":{
            deps: ["jquery-ui"]
        },
        "jquery.sidebar" :{
            deps : ["jquery", "jquery-ui"]
        },
        "chosen.jquery" : {
            deps : ["jquery"]
        },
        "bootstrap-dialog":{
            deps: ["bootstrap"]
        }
    }
});


require(["../../IndexContext", "domReady!", "bootstrap"], function(IndexContext) {
    console.log("index.js() - require() on domReady!");

   var indexContext = new IndexContext;
    indexContext.init();

});







