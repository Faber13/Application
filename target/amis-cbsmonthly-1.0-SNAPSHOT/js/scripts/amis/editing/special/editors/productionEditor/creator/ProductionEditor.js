/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "productionEditor/observer/ProductionObserver",
    "productionEditor/model/ProductionModel", "specialFormulaConf/formulaHandler/FormulaHandler"],
    function($, Formatter, Observer, ModelProduction, FormulaHandler){

    var observer, model, supportUtility, formulaHandler ;

    function ProductionEditor(){
        observer = new Observer;
        model = new ModelProduction;
        formulaHandler = new FormulaHandler;
    }

    ProductionEditor.prototype.init = function(clickedItem, itemsInvolved, codesInvolved, configurator, Utility){
        var involvedItems = $.extend([],true,itemsInvolved);
        supportUtility = Utility;
        console.log('before getTotlaCropsModel (invovledItems)')
        console.log(involvedItems)
        console.log(itemsInvolved)
        // take data and calculate initial formulas
        var totCropsModel =  model.getTotalCropsModel(involvedItems, supportUtility);
        var formulaTotCrops = formulaHandler.getInitFormulaFromConf(1,'totalValues')
        var totalCropsModel = formulaHandler.createFormula(totalCropsModel)
        console.log('after getTotlaCropsModel (invovledItems)')
        console.log(involvedItems)
        console.log(itemsInvolved)

        var singleCropsModel = model.getSingleCropsModel(involvedItems, supportUtility);
        var totalCropsCalculated = formulaHandler.getInitFormulaFromConf(1,'singleCrop')

        console.log('before getSingleCropsModel (invovledItems)')
        console.log(involvedItems)
        console.log(itemsInvolved)

        var ItemsObj = []


/*
        dsdConfigurator = configurator;
        var configurationColumn = dsdConfigurator.getKeyColumnConfiguration().leftKeyColumnConfiguration[0]*/

        var valueCodeItem = parseInt(clickedItem[0])

        var map=  {
            2 : "Area Harvested",
            5 : "Production",
            4 : "Yield",
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
                {name : 5, type: 'string'}
            ],
            id: 'ppp',
            localdata: totalCropsModel
        };

        var dataAdapter = new $.jqx.dataAdapter(source);

        /* To mantain generic profile
         var datatype = ["code"]
         var title = formatterDatatatypes.fromDSDToVisualizationFormat(valueCodeItem, configurationColumn, datatype, dsdConfigurator);*/
        var lab
        var modal ='<div class="modal fade" id="productionForm"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
            '<div class="modal-dialog">'+
            '<div class="modal-content">'+
            '<div class="modal-header">'+
            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
            '<h4 class="modal-title" id="myModalLabel">Production Form</h4>'+
            '</div>'+
            '<div class="modal-body" id ="toappendData">'+

            '<div id="productionTabs">' +
            '<ul>'+
            '<li>Total Values </li>' +
            '<li>Singe Crop Values </li>' +
            '</ul>'+

            '<div id="singleCrop"><br>'+
            '<div class="row"><br>' +
            '<div class="col-lg-3 col-lg-offset-1">' +
            '<div class ="singleCropBoxes" id="firstCheckBox">'+map[5]+'</div>' +
            '</div>'+

            '<div class="col-lg-3">' +
            '<div class ="singleCropBoxes" id="secondCheckBox">'+map[2]+'</div>' +
            '</div>'+
            '<div class="col-lg-3">' +
            '<div class ="singleCropBoxes" id="thirdCheckBox">'+map[4]+'</div>' +
            '</div><br><br>'+
            '<div class="row">'+
            '<div class="col-lg-3 col-lg-offset-4">'+
            '<button type="button" class="btn btn-primary" id="applyRulesFormula">Recalculate Data</button>'+
            '</div>'+
            '</div><hr>'+
            '</div>'+
             '<br>'+
            '<div id="grid"></div>'+
            '<div class="modal-footer">'+
            '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
            '<button type="button" class="btn btn-primary">Save changes</button>'+
            '</div>'+
            '</div>'+

            '<div id="totalCrop">Secondo<div></div>'+

            '<div class="modal-footer">'+
            '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
            '<button type="button" class="btn btn-primary">Save changes</button>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div'+
            '</div>';

        $("#pivotGrid").append(modal);
        $('#productionTabs').jqxTabs();
        $('#firstCheckBox').jqxCheckBox({ width: 120, height: 25 , checked: true});
        $('#secondCheckBox').jqxCheckBox({ width: 120, height: 25 , checked : true});
        $('#thirdCheckBox').jqxCheckBox({ width: 120, height: 25 , disabled:true });

        $('#grid').jqxGrid({
            source: dataAdapter,
            width: "100%",
            editable: true,
            selectionmode: 'singlecell',
            columnsresize: true,
            pageable: true,
            autoheight: true,
            columns: [
                { text: 'Element', datafield: 6 },
                { text: 'Value', datafield:3 },
                { text: 'Flag', datafield: 4 },
                { text: 'Notes', datafield: 5 }
            ]
        });

        $("#productionForm").modal({ backdrop: 'static',
            keyboard: false});
        $( "#productionForm" ).draggable();
        observer.applyListeners()
    }

    return ProductionEditor;
})