/**
 * Created by fabrizio on 9/11/14.
 */
define(["jquery"], function($){

    function GenericSpecialEditor(){}


    GenericSpecialEditor.prototype.createProductionEditor = function(cell, involvedItems, codes){
        var $newdiv1 = $("<div id='dialogForm' type='hidden'></div>");
        $("#pivotGrid").append($newdiv1);

        debugger;
        var modal ='<button class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">Launch demo modal</button>'+
        '<div class="modal fade" id="myModal"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
            '<div class="modal-dialog">'+
                '<div class="modal-content">'+
                   '<div class="modal-header">'+
                       '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
                        '<h4 class="modal-title" id="myModalLabel">Modal title</h4>'+
                   '</div>'+
                    '<div class="modal-body">'+
                   '</div>'+
                    '<div class="modal-footer">'+
                        '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>'+
                       '<button type="button" class="btn btn-primary">Save changes</button>'+
                    '</div>'+
                '</div>'+
            '</div'+
       '</div>';



        $("#pivotGrid").append(modal);


        $("#myModal").modal();



    }

    GenericSpecialEditor.prototype.createOtherUsesEditor = function(cell, involvedItems, codes){

    }

    GenericSpecialEditor.prototype.createProductionPaddyEditor = function(cell, involvedItems, codes){

    }

    return GenericSpecialEditor;
})