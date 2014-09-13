/**
 * Created by fabrizio on 9/11/14.
 */
define(["jquery", "formatter/DatatypesFormatter"], function($, Formatter){

    var formatterDatatatypes, dsdConfigurator;

    function GenericSpecialEditor(){
        formatterDatatatypes = new Formatter;

    }


    GenericSpecialEditor.prototype.createProductionEditor = function(clickedItem, itemsInvolved, codesInvolved, configurator){

        var map=  {
            2 : "Area Harvested",
            5 : "Production",
            4 : "Yield",
            37: "Area Planted"
        }

        dsdConfigurator = configurator;

        var configurationColumn = dsdConfigurator.getKeyColumnConfiguration().leftKeyColumnConfiguration[0]

        var valueCodeItem = parseInt(clickedItem[0])

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

                                    '<div id="singleCrop">'+
                                        '<div class="row">' +
                                             '<div class="col-lg-3 col-lg-offset-1">' +
                                                '<div id="firstCheckBox">'+map[5]+'</div>' +
                                             '</div>'+

                                             '<div class="col-lg-3">' +
                                                '<div id="secondCheckBox">'+map[4]+'</div>' +
                                              '</div>'+
                                            '<div class="col-lg-3">' +
                                                '<div id="thirdCheckBox">'+map[2]+'</div>' +
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
            /*
                                            '<div class="col-lg-4>">' +
                                                '<div id="firstCheckBox">'+map[5]+'</div>' +
                                            '</div>' +
                                            '<div class="col-lg-4>">' +
                                                '<div id="secondCheckBox">'+map[4]+'</div>' +
                                            '</div>' +
                                            '<div class="col-lg-4>">' +
                                                '<div id="thirdCheckBox">'+map[2]+'</div>' +
                                            '</div>' +
                                        '</div>'+
                                    '</div>'+*/

                                    '<div id="totalCrop">Secondo<div></div>'+
                                  /*  '<div class="row">' +
                                        '<div class="col-lg-3>">' +

                                        '<div class="col-lg-3>">' +

                                        '<div class="col-lg-3>">' +
                                            '<div class="thirdCheckBox">'+map[2]+'</div></div>' +
                                        '<div class="col-lg-3>">' +
                                            '<div class="fourthCheckBox">'+map[37]+'</div></div>' +
                                    '</div>'+
                                '</div>'+*/

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
        $('#firstCheckBox').jqxCheckBox({ width: 120, height: 25 });
        $('#secondCheckBox').jqxCheckBox({ width: 120, height: 25 });
        $('#thirdCheckBox').jqxCheckBox({ width: 120, height: 25 });

        $("#myModal").modal();



    }

    GenericSpecialEditor.prototype.createOtherUsesEditor = function(cell, involvedItems, codes){

    }

    GenericSpecialEditor.prototype.createProductionPaddyEditor = function(cell, involvedItems, codes){

    }

    return GenericSpecialEditor;
})