/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery","formatter/DatatypesFormatter", "jqwidgets"], function($, Formatter){

    var observer ;


    var cellclassname = function (row, column, value, data) {
        if (data[4] == 'C')
            return "calculatedRowGrid";
        };

    function PaddyCreator(){}

    PaddyCreator.prototype.init = function(totalValuesModel, singleCropsModel, Observer){

        var map = {
            2: "Area Harvested",
            5: "Production",
            4: "Yield",
            37: "Area Planted"
        }

        observer = Observer;
        var totalModel = $.extend(true,[], totalValuesModel);
        var singleModel = $.extend(true, [], singleCropsModel);

        var source = {
            datatype: "array",
            datafields: [
                { name: 6, type: 'string' },
                { name: 3, type: 'float' },
                { name: 4, type: 'string'},
                {name: 5, type: 'string'}
            ],
            id: 'ppp',
            localdata: totalModel
        };

        var source2 = {
            datatype: "array",
            datafields: [
                { name: 6, type: 'string' },
                { name: 7, type: 'string' },
                { name: 3, type: 'float' },
                { name: 4, type: 'string'},
                { name: 5, type: 'string'}
            ],
            id: 'ppp',
            localdata: singleModel
        };

        var dataAdapter = new $.jqx.dataAdapter(source);
        var dataAdapter2 = new $.jqx.dataAdapter(source2);

        var f = document.getElementById("specialForm");

        if (f !== null) {
            f.remove()
        }

        var modal = '<div class="modal fade" id="specialForm"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" id="closeModal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            '<h4 class="modal-title" id="myModalLabel">Production Rice Form</h4>' +
            '</div>' +
            '<div class="modal-body" id ="toappendData">' +
            '<div id="productionTabs">' +
            '<ul>' +
            '<li>Total Values </li>' +
            '<li>Singe Crop Values </li>' +
            '</ul>' +

            '<div id="totalValues"><br>' +
            '<div class="row"><br>' +
            '<div class="col-lg-5 col-lg-offset-1">' +
            '<small class = "labelRice">Select the <strong>ITEM</strong> to enter</small><br><br>'+
            '<div class ="totalValuesBoxes" id="firstCheckBoxTotVal">Rice Paddy</div>' +
            '</div>' +

            '<div class="col-lg-6">' +
            '<small class = "labelRice">Select the <strong>ELEMENT</strong> to enter</small><br><br>'+
            '<div class ="totalValuesBoxes" id="secondCheckBoxTotVal">Area Harvested</div>' +
            '</div>' +
            '<br><br>' +
            '<br>' +
            '<div class="col-lg-5 col-lg-offset-1">' +
            '<div class ="totalValuesBoxes" id="thirdCheckBoxTotVal">Rice Milled</div>' +
            '</div>' +

            '<div class="col-lg-6">' +
            '<div class ="totalValuesBoxes" id="fourthCheckBoxTotVal">Yield</div>' +
            '</div>' +
            '<br><br>' +
            '<div class="row">' +
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
            '<div id="totalValues"><br>' +
            '<div class="row"><br>' +
            '<div class="col-lg-5 col-lg-offset-1">' +
            '<small class = "labelRice">Select the <strong>ITEM</strong> to enter</small><br><br>'+
            '<div class ="singleCropsBoxes" id="firstCheckBoxSingleCrops">Rice Paddy</div>' +
            '</div>' +

            '<div class="col-lg-6">' +
            '<small class = "labelRice">Select the <strong>ELEMENT</strong> to enter</small><br><br>'+
            '<div class ="singleCropsBoxes" id="secondCheckBoxSingleCrops">Area Harvested</div>' +
            '</div>' +
            '<br><br>' +
            '<br>' +
            '<div class="col-lg-5 col-lg-offset-1">' +
            '<div class ="singleCropsBoxes" id="thirdCheckBoxSingleCrops">Rice Milled</div>' +
            '</div>' +

            '<div class="col-lg-6">' +
            '<div class ="singleCropsBoxes" id="fourthCheckBoxSingleCrops">Yield</div>' +
            '</div>' +
            '<br><br>' +
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
            '<button type="button" class="btn btn-default" data-dismiss="modal" >Close</button>' +
            '<button type="button" class="btn btn-primary" data-dismiss="modal" id="saveTotalValues">Save changes</button>' +
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
                { text: 'Element', datafield: 6,cellclassname:cellclassname  },
                { text: 'Value', datafield: 3 ,cellclassname:cellclassname },
                { text: 'Flag', datafield: 4 ,cellclassname:cellclassname },
                { text: 'Notes', datafield: 5 ,cellclassname:cellclassname }
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
                { text: 'Element', datafield: 6 ,cellclassname:cellclassname },
                { text: 'Crop',    datafield: 7, cellclassname: cellclassname },
                { text: 'Value',   datafield: 3, cellclassname: cellclassname  },
                { text: 'Flag',    datafield: 4, cellclassname: cellclassname  }
            ]
        });

        $('#specialForm').on('shown.bs.modal', function (e) {
            $('#productionTabs').jqxTabs();
        })
        $("#specialForm").modal({ backdrop: 'static',
            keyboard: false});


        observer.applyListeners()
    }


    PaddyCreator.prototype.updateTotGrid = function (calculatedModel) {
        var that  =this;

        console.log('update Tot Grid!!')
        var source = {
            datatype: "array",
            datafields: [
                { name: 6, type: 'string' },
                { name: 3, type: 'float' },
                { name: 4, type: 'string'},
                {name: 5,  type: 'string'}
            ],
            id: 'ppp',
            localdata: calculatedModel
        };

        var dataAdapter = new $.jqx.dataAdapter(source);

        $('#gridTotalValues').jqxGrid({
            source: dataAdapter,
            width: "100%",
            editable: true,
            selectionmode: 'singlecell',
            columnsresize: true,
            pageable: true,
            autoheight: true,
            columns: [
                { text: 'Element', datafield: 6,cellclassname:cellclassname  },
                { text: 'Value', datafield: 3 ,cellclassname:cellclassname },
                { text: 'Flag', datafield: 4 ,cellclassname:cellclassname },
                { text: 'Notes', datafield: 5 ,cellclassname:cellclassname }
            ]

        });
    }

    PaddyCreator.prototype.updateSingleGrid = function (calculatedModel) {
        console.log('updateSingelGRid')

        var source = {
            datatype: "array",
            datafields: [
                { name: 6, type: 'string'},
                { name: 7, type: 'string'},
                { name: 3, type: 'float' },
                { name: 4, type: 'string'},
                { name: 5, type: 'string'}
            ],
            id: 'ppp',
            localdata: calculatedModel
        };

        var dataAdapter = new $.jqx.dataAdapter(source);

        $('#gridSingleCrops').jqxGrid({
            source: dataAdapter,
            width: "100%",
            editable: true,
            selectionmode: 'singlecell',
            columnsresize: true,
            pageable: true,
            autoheight: true,
            columns: [
                { text: 'Element', datafield: 6 ,cellclassname:cellclassname },
                { text: 'Crop',    datafield: 7, cellclassname: cellclassname },
                { text: 'Value',   datafield: 3, cellclassname: cellclassname  },
                { text: 'Flag',    datafield: 4, cellclassname: cellclassname  }
            ]
        });

    }

    return PaddyCreator;
})