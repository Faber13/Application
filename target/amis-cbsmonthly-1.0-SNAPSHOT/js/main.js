// Place third party dependencies in the lib folder
requirejs.config({
    "baseUrl": "js/scripts/libs",
    "paths": {
        jquery : "//code.jquery.com/jquery-2.1.1.min",
        preloading        : "../amis/preloading",
        loading           : "../amis/loading",
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
        adapter           :  "../component/core/balanceSheet/visualization/ignite/adapter"
    },
    "shim": {
        "bootstrap": {
            deps: ["jquery"]
        },
        "infragistics" : {
            "deps" : ["jquery","jquery-ui"]
        },
        "pivot" : {
            "deps": ["webix"]
        },
        "jquery-ui" : {
            "deps" : ["jquery"]
        },
        "jquery.dirtyFields" : {
            deps: ["jquery"]
        },
        "timepicker":{
            deps: ["jquery-ui"]
        }
    }
});


require(["../../IndexContext", "domReady!", "bootstrap"], function(IndexContext) {
    console.log("index.js() - require() on domReady!");

    var indexContext = new IndexContext();
    indexContext.init();

});

/*
require([ 'jquery', "domReady!", "bootstrap"], function($) {
    console.log("index.js() - require() on domReady!");
    console.log($.fn.jquery)
   $.ajax({
        url: "http://localhost:8080/dataset/national",
        type: 'POST',
        ContentType: 'application/json',
        data: JSON.stringify({
            "region":12,
            "product":5,
            "year":2010
        }),
        success : function(data){
            console.log("SUCCESS" )
            console.log(data)
        },
        error:function(jqXHR,textStatus,errorThrown)
        {
            console.log(jqXHR)
            console.log(textStatus)
            console.log(errorThrown)
            alert("You can not send Cross Domain AJAX requests: "+errorThrown);
        }
    });
 })*/






