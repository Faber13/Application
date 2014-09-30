/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery", "formatter/DatatypesFormatter"], function($, Formatter){

    function PaddyCreator(){}

    PaddyCreator.prototype.init = function(){


        var f = document.getElementById("paddyForm");

        if (f !== null) {
            f.remove()
        }

        var modal = '<div class="modal fade" id="paddyForm"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" id="closeModal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            '<h4 class="modal-title" id="myModalLabel">Rice production Form</h4>' +
            '</div>' +
            '<div class="modal-body" id ="toappendData">' +
            '<div id="productionTabs">' +
            '<ul>' +
            '<li>Total Values </li>' +
            '<li>Singe Crop Values </li>' +
            '</ul>' +

            '<div id="totalValues"><br>' +
            '<div class="row"><br>' +
            '<div class="col-lg-4 col-lg-offset-1">' +
            '<div class ="totalValuesBoxes" id="firstCheckBoxTotVal">Paddy</div>' +
            '</div>' +
            '<div class="col-lg-4">' +
            '<div class ="totalValuesBoxes" id="secondCheckBoxTotVal">Area Harvested</div>' +
            '</div></div><br><br>'+

            '<div class="row"><br>' +
            '<div class="col-lg-4 col-lg-offset-1">' +
            '<div class ="totalValuesBoxes" id="thirdCheckBoxTotVal">Milled</div>' +
            '</div>' +
            '<div class="col-lg-4">' +
            '<div class ="totalValuesBoxes" id="fourthCheckBoxTotVal">Yield</div>' +
            '</div></div><br><br>'+

            '<div class="col-lg-3 col-lg-offset-4">' +
            '<button type="button" class="btn btn-primary" id="applyRulesFormulaTot">Recalculate Data</button>' +
            '</div>' +

            '</div><div class="row"><br><div class = "col-lg-10 col-lg-offset-1" id="alertTotal"></div></div><hr>' +
            '</div>' +
            '<br>' +
            '<div class="row"><div class="col-lg-10 col-lg-offset-1">' +
            '<div id="gridTotalValues"></div></div></div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default" data-dismiss="modal" >Close</button>' +
            '<button type="button" class="btn btn-primary" data-dismiss="modal" id="saveTotalValues">Save changes</button>' +
            '</div>' +
            '</div>' +

            // Single Crops ------------------------------------
            '<div id="singleCropValues"><br>' +
            '<div class="row"><br>' +
            '<div class="col-lg-4 col-lg-offset-1">' +
            '<div class ="singleValuesBoxes" id="firstCheckBoxSingleCrops">Paddy</div>' +
            '</div>' +
            '<div class="col-lg-4">' +
            '<div class ="singleValuesBoxes" id="secondCheckBoxSingleCrops">Area Harvested</div>' +
            '</div></div><br><br>'+

            '<div class="row"><br>' +
            '<div class="col-lg-4 col-lg-offset-1">' +
            '<div class ="singleValuesBoxes" id="thirdCheckBoxSingleCrops">Milled</div>' +
            '</div>' +
            '<div class="col-lg-4">' +
            '<div class ="singleValuesBoxes" id="fourthCheckBoxSingleCrops">Yield</div>' +
            '</div></div><br><br>'+

            '<div class="row">' +
            '<div class="col-lg-3 col-lg-offset-4">' +
            '<button type="button" class="btn btn-primary" id="applyRulesFormulaSingle">Recalculate Data</button>' +
            '</div>' +
            '</div><div class="row"><br><div class = "col-lg-10 col-lg-offset-1" id="alertSingle"></div></div><hr>' +
            '</div>' +
            '<br>' +
            '<div class="row"><div class="col-lg-10 col-lg-offset-1">' +
            '<div id="gridSingleCrops"></div></div></div>' +

            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
            '<button type="button" class="btn btn-primary" data-dismiss="modal">Save changes</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';


        $("#pivotGrid").append(modal);
        $('#firstCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, checked: true});
        $('#secondCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, checked: true});
        $('#thirdCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, disabled: true });
        $('#fourthCheckBoxTotVal').jqxCheckBox({ width: 120, height: 25, disabled: true });


        $('#firstCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, checked: true});
        $('#secondCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, checked: true});
        $('#thirdCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, disabled: true });
        $('#fourthCheckBoxSingleCrops').jqxCheckBox({ width: 120, height: 25, disabled: true });


        $('#gridTotalValues').jqxGrid({
            source: dataAdapter,
            width: "100%",
            editable: true,
            selectionmode: 'singlecell',
            columnsresize: true,
            pageable: true,
            autoheight: true,
            columns: [
                { text: 'Element', datafield: 6 },
                { text: 'Value', datafield: 3 },
                { text: 'Flag', datafield: 4 },
                { text: 'Notes', datafield: 5 }
            ]
        });

        $('#gridSingleCrops').jqxGrid({
            source: dataAdapter2,
            width: "100%",
            editable: true,
            selectionmode: 'singlecell',
            columnsresize: true,
            pageable: true,
            autoheight: true,
            columns: [
                { text: 'Element', datafield: 6 },
                { text: 'Crop',    datafield: 7},
                { text: 'Value',   datafield: 3 },
                { text: 'Flag',    datafield: 4 },
                { text: 'Notes',   datafield: 5 }
            ]
        });

        $('#paddyForm').on('shown.bs.modal', function (e) {
            $('#productionTabs').jqxTabs();
        })
        $("#paddyForm").modal({ backdrop: 'static',
            keyboard: false});

        observer.applyListeners(this, productionController)

    }

    return PaddyCreator;
})