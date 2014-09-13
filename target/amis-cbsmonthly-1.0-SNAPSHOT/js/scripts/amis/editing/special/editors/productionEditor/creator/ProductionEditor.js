/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "productionEditor/observer/ProductionObserver"], function($, Formatter, Observer){

    var observer ;

    function ProductionEditor(){
        observer = new Observer;
    }

    ProductionEditor.prototype.init = function(clickedItem, itemsInvolved, codesInvolved, configurator){
        var involvedItems = itemsInvolved;
        var map=  {
            2 : "Area Harvested",
            5 : "Production",
            4 : "Yield",
            37: "Area Planted"
        }

        var ItemsObj = []

        for(var i =0; i< involvedItems.length; i++){
            var code = involvedItems[i][0]
            involvedItems[i].push(map[code])
        }
/*
        dsdConfigurator = configurator;

        var configurationColumn = dsdConfigurator.getKeyColumnConfiguration().leftKeyColumnConfiguration[0]*/

        var valueCodeItem = parseInt(clickedItem[0])
        debugger;

        var source = {
            datatype: "array",
            datafields: [
                { name: '0', type: 'string' },
                { name: '1', type: 'string' },
                { name: '2', type: 'string'},
            ],
            id: 'ppp',
            localdata: involvedItems
        };

        var dataAdapter = new $.jqx.dataAdapter(source);




        /* To mantain generic profile
         var datatype = ["code"]
         var title = formatterDatatatypes.fromDSDToVisualizationFormat(valueCodeItem, configurationColumn, datatype, dsdConfigurator);*/
        var lab
        var modal ='<div class="modal fade" id="myModal"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
            '<div class="modal-dialog">'+
            '<div class="modal-content">'+
            '<div class="modal-header">'+
            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
            '<h4 class="modal-title" id="myModalLabel">Modal title</h4>'+
            '</div>'+
            '<div class="modal-body" id ="toappendData">'+

            '<div id="jqxTabs">' +
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
            '<div class ="singleCropBoxes" id="secondCheckBox">'+map[4]+'</div>' +
            '</div>'+
            '<div class="col-lg-3">' +
            '<div class ="singleCropBoxes" id="thirdCheckBox">'+map[2]+'</div>' +
            '</div>'+
            '</div>'+
             '<br>'+
            '<div id="grid"></div>'+

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
        $('#jqxTabs').jqxTabs();
        $('#firstCheckBox').jqxCheckBox({ width: 120, height: 25 , checked: true});
        $('#secondCheckBox').jqxCheckBox({ width: 120, height: 25 , checked : true});
        $('#thirdCheckBox').jqxCheckBox({ width: 120, height: 25 , disabled:true });

        alert('Grid')
        debugger;

        $('#grid').jqxGrid({
            source: dataAdapter,
            width: "100%",
            columnsresize: true,
            pageable: true,
            autoheight: true,
            columns: [
                { text: 'Code', datafield: '[0]' },
                { text: 'Value', datafield: '[1]' },
                { text: 'Flag', datafield: '[2]' }
            ]
        });

        $("#myModal").modal();
        observer.listenToCheckboxes()
    }






    return ProductionEditor;
})