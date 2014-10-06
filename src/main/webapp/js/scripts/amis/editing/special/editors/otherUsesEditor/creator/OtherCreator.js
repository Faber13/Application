/**
 * Created by fabrizio on 9/13/14.
 */
define(["jquery", "formatter/DatatypesFormatter", "jqwidgets"], function ($, Formatter) {

    var observer;

    function OtherCreator() {
    }

    OtherCreator.prototype.init = function (totalValuesModel, Observer) {


        observer = Observer;
        var totalModel = $.extend(true, [], totalValuesModel);

        var totModelForTree = this.prepareDataForTreeGrid(totalModel)
        debugger;


        var source = {
            datatype: "json",
            datafields: [
                { name: 6, type: 'string' },
                { name: 3, type: 'float' },
                { name: 4, type: 'string'},
                {name: 5, type: 'string'}
            ],
            hierarchy: {
                root: 'children'
            },
            id: 'ppp',
            localdata: totModelForTree
        };


        var dataAdapter = new $.jqx.dataAdapter(source);

        var f = document.getElementById("specialForm");

        if (f !== null) {
            f.remove()
        }

        var modal = '<div class="modal fade" id="specialForm"  role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" id="closeModal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            '<h4 class="modal-title" id="myModalLabel">Production Form</h4>' +
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
            '<div class ="totalValuesBoxes" id="firstCheckBoxTotVal">Rice Paddy</div>' +
            '</div>' +

            '<div class="col-lg-6">' +
            '<div class ="totalValuesBoxes" id="secondCheckBoxTotVal">Area Harvested</div>' +
            '</div>' +
            '<br><br>' +
            '<div class="row"><br>' +
            '<div class="col-lg-5 col-lg-offset-1">' +
            '<div class ="totalValuesBoxes" id="thirdCheckBoxTotVal">Rice Milled</div>' +
            '</div>' +

            '<div class="col-lg-6">' +
            '<div class ="totalValuesBoxes" id="fourthCheckBoxTotVal">Yield</div>' +
            '</div></div>' +
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
            '<div id="singleCropValues"><br>' +
            '<div class="row"><br>' +
            '<div class="col-lg-5 col-lg-offset-1">' +
            '<div class ="totalValuesBoxes" id="firstCheckBoxSingleCrops">Rice Paddy</div>' +
            '</div>' +

            '<div class="col-lg-6">' +
            '<div class ="totalValuesBoxes" id="secondCheckBoxSingleCrops">Area Harvested</div>' +
            '</div>' +
            '<br><br>' +
            '<div class="row"><br>' +
            '<div class="col-lg-5 col-lg-offset-1">' +
            '<div class ="totalValuesBoxes" id="thirdCheckBoxSingleCrops">Rice Milled</div>' +
            '</div>' +

            '<div class="col-lg-6">' +
            '<div class ="totalValuesBoxes" id="fourthCheckBoxSingleCrops">Yield</div>' +
            '</div></div>' +
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


        $("#gridTotalValues").jqxTreeGrid(
            {
                width: "100%",
                source: dataAdapter,
                sortable: true,
                columns: [
                    { text: 'Element', datafield: 6 },
                    { text: 'Value', datafield: 3  },
                    { text: 'Flag', datafield: 4    },
                    { text: 'Notes', datafield: 5   }
                ]
            });


        $('#specialForm').on('shown.bs.modal', function (e) {
            $('#productionTabs').jqxTabs();
        })
        $("#specialForm").modal({ backdrop: 'static',
            keyboard: false});
        observer.applyListeners()
    }

    OtherCreator.prototype.prepareDataForTreeGrid = function (model) {
        var toObject = function (arr) {
            var rv = {};
            for (var i = 0; i < arr.length; ++i)
                if (arr[i] !== undefined) rv[i] = arr[i];
            return rv;
        }

        var result = []

        var employees = [
            {
                "EmployeeID": 2, "FirstName": "Andrew", "LastName": "Fuller", "Country": "USA", "Title": "Vice President, Sales", "HireDate": "1992-08-14 00:00:00", "BirthDate": "1952-02-19 00:00:00", "City": "Tacoma", "Address": "908 W. Capital Way", "expanded": "true",
                children: [
                    { "EmployeeID": 8, "FirstName": "Laura", "LastName": "Callahan", "Country": "USA", "Title": "Inside Sales Coordinator", "HireDate": "1994-03-05 00:00:00", "BirthDate": "1958-01-09 00:00:00", "City": "Seattle", "Address": "4726 - 11th Ave. N.E." },
                    { "EmployeeID": 1, "FirstName": "Nancy", "LastName": "Davolio", "Country": "USA", "Title": "Sales Representative", "HireDate": "1992-05-01 00:00:00", "BirthDate": "1948-12-08 00:00:00", "City": "Seattle", "Address": "507 - 20th Ave. E.Apt. 2A" },
                    { "EmployeeID": 3, "FirstName": "Janet", "LastName": "Leverling", "Country": "USA", "Title": "Sales Representative", "HireDate": "1992-04-01 00:00:00", "BirthDate": "1963-08-30 00:00:00", "City": "Kirkland", "Address": "722 Moss Bay Blvd." },
                    { "EmployeeID": 4, "FirstName": "Margaret", "LastName": "Peacock", "Country": "USA", "Title": "Sales Representative", "HireDate": "1993-05-03 00:00:00", "BirthDate": "1937-09-19 00:00:00", "City": "Redmond", "Address": "4110 Old Redmond Rd." },
                    {
                        "EmployeeID": 5, "FirstName": "Steven", "LastName": "Buchanan", "Country": "UK", "Title": "Sales Manager", "HireDate": "1993-10-17 00:00:00", "BirthDate": "1955-03-04 00:00:00", "City": "London", "Address": "14 Garrett Hill", "expanded": "true",
                        children: [
                            { "EmployeeID": 6, "FirstName": "Michael", "LastName": "Suyama", "Country": "UK", "Title": "Sales Representative", "HireDate": "1993-10-17 00:00:00", "BirthDate": "1963-07-02 00:00:00", "City": "London", "Address": "Coventry House Miner Rd." },
                            { "EmployeeID": 7, "FirstName": "Robert", "LastName": "King", "Country": "UK", "Title": "Sales Representative", "HireDate": "1994-01-02 00:00:00", "BirthDate": "1960-05-29 00:00:00", "City": "London", "Address": "Edgeham Hollow Winchester Way" },
                            { "EmployeeID": 9, "FirstName": "Anne", "LastName": "Dodsworth", "Country": "UK", "Title": "Sales Representative", "HireDate": "1994-11-15 00:00:00", "BirthDate": "1966-01-27 00:00:00", "City": "London", "Address": "7 Houndstooth Rd." }
                        ]
                    }
                ]
            }
        ];

        result[0] = {
            "0": model[0][0], "1": model[0][1], "2": model[0][2], "3": model[0][3], "4": model[0][4], "5": model[0[5]], "6": model[0][6], "expanded": "true",
            children: [
                {  "0": model[1][0], "1": model[1][1], "2": model[1][2], "3": model[1][3], "4": model[1][4], "5": model[0][5], "6": model[0][6] },
                {  "0": model[2][0], "1": model[2][1], "2": model[2][2], "3": model[2][3], "4": model[2][4], "5": model[0][5], "6": model[0][6], "expanded": "true",
                    children: [
                        {  "0": model[3][0], "1": model[3][1], "2": model[3][2], "3": model[3][3], "4": model[3][4], "5": model[3][5], "6": model[3][6] },
                        {  "0": model[4][0], "1": model[4][1], "2": model[4][2], "3": model[4][3], "4": model[4][4], "5": model[4][5], "6": model[4][6] },
                        {  "0": model[5][0], "1": model[5][1], "2": model[5][2], "3": model[5][3], "4": model[5][4], "5": model[5][5], "6": model[5][6] },
                        {  "0": model[6][0], "1": model[6][1], "2": model[6][2], "3": model[6][3], "4": model[6][4], "5": model[6][5], "6": model[6][6] }

                    ]
                }
            ]
        }
        return result;
    }


    OtherCreator.prototype.updateTotGrid = function (calculatedModel) {


        console.log('update Tot Grid!!')
        var source = {
            datatype: "array",
            datafields: [
                { name: 6, type: 'string' },
                { name: 3, type: 'float' },
                { name: 4, type: 'string'},
                {name: 5, type: 'string'}
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
                { text: 'Element', datafield: 6 },
                { text: 'Value', datafield: 3 },
                { text: 'Flag', datafield: 4 },
                { text: 'Notes', datafield: 5 }
            ]
        });
    }

    OtherCreator.prototype.updateSingleGrid = function (calculatedModel) {

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
                { text: 'Element', datafield: 6 },
                { text: 'Crop', datafield: 7 },
                { text: 'Value', datafield: 3 },
                { text: 'Flag', datafield: 4 },
                { text: 'Notes', datafield: 5 }
            ]
        });

    }

    return OtherCreator;
})