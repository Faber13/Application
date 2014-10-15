/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery" , "views/modelView/ViewModel", "adapterGrid",  "webix" ], function ($, ViewModel, AdapterGrid) {

    var model, table, Configurator, titlesUp, titlesLeft, accessorMap, fullModel, configurationKeys, indexValues, modelView,
        leftDimensions, upDimensions, valueColumn, dataSource2, idOlapGrid, language, viewModel, adapterGrid, supportUtility

    function GridDataView2() {

    }


    GridDataView2.prototype.init = function (tableModel, configurator, utility) {

        supportUtility = utility
        adapterGrid = new AdapterGrid;
        viewModel = new ViewModel;
        table = tableModel;
        Configurator = configurator;
        language = Configurator.getComponentLanguage();
        this.createFullGrid();
    }

    GridDataView2.prototype.createFullGrid = function () {

        fullModel = Configurator.getAllColumnModels();
        configurationKeys = Configurator.getKeyColumnConfiguration();
        accessorMap = Configurator.getAccessorMap();
        // leftDimensions = this.createLeftPivotDimension(fullModel["leftColumnsModel"], configurationKeys["lefKeyColumnConfiguration"]);
        // upDimensions = this.createUpPivotDimension(fullModel["upColumnsModel"], configurationKeys["upKeyColumnConfiguration"]);
        valueColumn = Configurator.getValueColumnConfiguration();
        indexValues = Configurator.getValueIndex();
        idOlapGrid = Configurator.getIdOlapGrid();
        modelView = viewModel.init(table, Configurator, supportUtility)
        var grid = this.renderGrid(modelView)
        return grid;
    }


    GridDataView2.prototype.renderGrid = function (model) {

        adapterGrid.createPropertiesFromModel(model)
        var columnsNumber = adapterGrid.getNumberOfColumns(model)
        var differentDates = adapterGrid.getDifferentDates();
        var titlesMap = adapterGrid.getTitlesMap()
        console.log('---------titlesMap -------------------')
        console.log(titlesMap)

        var dataSource = this.createDataSource(columnsNumber, differentDates, titlesMap, model)
        console.log('DATASORUCE')
        console.log(dataSource)
        debugger;

        var columns = this.createColumns(dataSource, differentDates)
        console.log('*********** columns ********************')
        console.log(columns)


        document.getElementById('box').style.visibility = "visible";
        var options = document.getElementById('options')
        options.style.visibility = "visible";
        var toappend = document.getElementById('toAppend');
        if (toappend != null) {
            toappend.remove()
        }

        var f = document.getElementById('optionsPivotGrid');
        if (typeof f != 'undefined' && f != null) {
            f.remove();
        }

        var f = document.getElementById('newForecast');
        if (typeof f != 'undefined' && f != null) {
            f.remove();
        }

        var fa = document.querySelectorAll('[view_id="grid"]');
        if (typeof fa != 'undefined' && fa != null) {
            fa.remove();
        }


        var grid =
            webix.ui({
                container: "pivotGrid",
                view: "datatable",
                id: "grid",
                editable:true,
                leftSplit:1,
                scheme:{
                    $change:function(item){
                        switch(item.data0) {
                            case 'Population (1000s)':
                                item.$css = "blueLine"
                                break;
                            default :
                                item.$css = "default"
                                break;
                        }
                    }
                },
                columns: columns,
                datatype: "jsarray",
                data: dataSource
            });


        $('#options').append('<div class="btn-group"><button class="btn btn-primary" id="newForecast">Create a new forecast for season '+filterData.season+'</button></div><div class="btn-group-vertical" id="optionsPivotGrid">' +
            '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">' +
            '<span class="caret"></span><span>Options</span></button>' +
            '<ul class="dropdown-menu" role="menu"><li>' +
            '<div class="row"><div class="col-lg-1"><div id="editingChoice"/></div>' +
            '<div class="col-lg-9"><span>Edit flag and notes</span></div></div><hr></li></ul></div>') ;
        $('#editingChoice').jqxCheckBox({width: 30, height: 25});

        return grid;
    }

        GridDataView2.prototype.createColumns = function(dataSource, differentDates){
            var filterData = supportUtility.getFilterData()

            debugger;
            var columns = [];
            var arrDiffDates = Object.keys(differentDates)
           /* columns.push({id : "data0",width:400,header: [
                {text:  'Forecast for season: '+filterData.season+', '
                    +filterData.country+' , '+filterData.product+' , '
                    +filterData.dataSource+' ',  colspan: arrDiffDates.length+1},

                {text: 'Elements'}]})*/
            columns.push({id : "data0",width:400,header:'Elements', css:"firstColumn" })

            for(var i =0; i< arrDiffDates.length; i++){
                if(i==0) {
                    columns.push({id: "data" + 1, header: [
                   //   {text: ''},
                        {text: 'Input dates' ,colspan: arrDiffDates.length},
                        {text: arrDiffDates[i]}
                    ], editor: 'text'})
                }else{
                    if(i == arrDiffDates.length -1){

                    }
                    columns.push({id: "data" + (i+1),header: [
                      //{text: ''},
                        {text: null},
                        {text: arrDiffDates[i]}], editor: 'text'})
                }
            }
            return columns;
        }





    GridDataView2.prototype.createDataSource = function(columnsNumber,differentDates,titlesMap, model  ){

        debugger;

        var viewRowModel = []
        var index =0;
        for(var key in titlesMap){
            viewRowModel[index] = [key];
            for(var i =0; i<titlesMap[key].length; i++){
                var indexValue = titlesMap[key][i]
                viewRowModel[index].push(model[indexValue][3])
            }
            index++;
        }

        return viewRowModel;
    }

    GridDataView2.prototype.updateGridView = function (newCell, indexCell) {
        var filterData = supportUtility.getFilterData()

        var cellTransformed = viewModel.updateItem(newCell)
        modelView[indexCell] = cellTransformed;
        dataSource2 = new $.ig.OlapFlatDataSource({
            dataSource: modelView,
            metadata: {
                cube: {
                    name: "Sales",
                    caption: "Sales",
                    measuresDimension: {
                        caption: "Measures",
                        measures: [ //for each measure, name and aggregator are required
                            { caption: "value", name: "value", aggregator: getValue(indexValues) }
                        ]
                    },
                    dimensions: [ // for each dimension
                        {
                            // For each dimension at least one hierarchy must be defined.
                            caption: "Rows", name: "Rows", hierarchies: leftDimensions
                        },
                        {
                            caption: "Columns", name: "Columns", displayFolder: "Folder1\\Folder2", hierarchies: upDimensions
                        }
                    ]

                }
            },
            // Preload hiearhies for the rows, columns, filters and measures
            rows: "[Rows].[" + titlesLeft[0] + "],[Rows].[" + titlesLeft[1] + "]",
            columns: "[Columns].[" + titlesUp[0] + "],[Columns].[" + titlesUp[1] + "]",
            measures: "[Measures].[value]"

        });

        $("#pivotGrid").igPivotGrid("option", "dataSource", dataSource2)

    }


    GridDataView2.prototype.setPropertiesDatasource = function () {

        var result = {};
        result["rows"] = "[Rows].[" + titlesLeft[0] + "]";
        if (titlesLeft.length > 1) {
            result["rows"] += ",[Rows].[" + titlesLeft[1] + "]";
        }
        result["Columns"] = "[Columns].[" + titlesUp[0] + "]";
        if (titlesLeft.length > 1) {
            result["Columns"] += ",[Columns].[" + titlesUp[1] + "]";
        }
        result["Measures"] = "[Measures].[value]"

        return result;
    }


    GridDataView2.prototype.createLeftPivotDimension1 = function (keyColumns, keyColumnConf) {

        var that = this;
        titlesLeft = [];
        var keysLeft = [];
        var that = this;
        titlesLeft.push(keyColumns["leftColumns"][0].domain.title[language])
        var key = {
            caption: keyColumns["leftColumns"][0].domain.title[language],
            name: keyColumns["leftColumns"][0].domain.title[language],
            levels: [
                {
                    name: keyColumns["leftColumns"][0].domain.supplemental[language],
                    caption: keyColumns["leftColumns"][0].domain.title[language],
                    memberProvider: function (item) {
                        return item[keyColumns["leftKeyIndexes"][0]];
                    }

                }
            ]
        }
        keysLeft.push(key);
        if (keyColumns["leftColumns"].length > 1) {
            titlesLeft.push(keyColumns["leftColumns"][1].domain.title[language])
            var key2 = {
                caption: keyColumns["leftColumns"][1].domain.title[language],
                name: keyColumns["leftColumns"][1].domain.title[language],
                levels: [
                    {
                        name: keyColumns["leftColumns"][1].domain.supplemental[language],
                        caption: keyColumns["leftColumns"][1].domain.title[language],
                        memberProvider: function (item) {
                            return item[keyColumns["leftKeyIndexes"][1]];
                        }
                    }
                ]
            }
            keysLeft.push(key2);
        }
        return keysLeft;
    }


    GridDataView2.prototype.createUpPivotDimension = function (keyColumns, keyColumnConf) {

        var that = this;
        titlesUp = []
        titlesUp.push(keyColumns["upColumns"][0].domain.title[language]);

        var keysUp = [];
        var key = {
            caption: keyColumns["upColumns"][0].domain.title[language],
            name: keyColumns["upColumns"][0].domain.title[language],
            levels: [
                {
                    name: keyColumns["upColumns"][0].domain.supplemental[language],
                    caption: keyColumns["upColumns"][0].domain.title[language],
                    memberProvider: function (item) {
                        return item[keyColumns["upKeyIndexes"][0]];
                    }
                }
            ]}
        keysUp.push(key);
        if (keyColumns["upColumns"].length > 1) {
            titlesUp.push(keyColumns["upColumns"][1].domain.title[language])
            var key2 = {
                caption: keyColumns["upColumns"][1].domain.title[language],
                name: keyColumns["upColumns"][1].domain.title[language],
                levels: [
                    {
                        name: keyColumns["upColumns"][1].domain.supplemental[language],
                        caption: keyColumns["upColumns"][1].domain.title[language],
                        memberProvider: function (item) {
                            return item[keyColumns["upKeyIndexes"][1]];
                        }                    }
                ]}
            keysUp.push(key2);
        }
        return keysUp;
    }


    GridDataView2.prototype.renderFormatDate = function (value, configurationKeyColumn, datatype) {

        var result;
        switch (datatype[0]) {
            case "time":
                var date = new Date(value);
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                break;

            case "month":
                var year = value.substr(0, 4);
                var month = value.substr(4, 2);
                var date = new Date(year, month - 1);
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                break;

            case "year":
                var year = value.substr(0, 4);
                var date = new Date(year);
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                break;

            case "date":
                var year = value.substr(0, 4);
                var month = value.substr(4, 2);
                var day = value.substr(6, 2);
                var date = new Date(year, month - 1, day);
                result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)

                break;
        }
        return result;

    }


    /*
     columns.push({ text: 'Elements', datafield: 0})
     var keys = Object.keys(differentDates)
     for (var j = 0; j < keys.length; j++) {
     columns.push({text: keys[j], datafield: 3 })
     }


     console.log('columns')
     console.log(columns)

     var datafields = []

     for (var i = 0; i < columns.length; i++) {
     datafields.push({name: 0, type: 'string'},{name: 3, type: 'string'})
     }

     console.log('datafields')
     console.log(datafields)

     debugger;
     var source = {
     datatype: "array",
     datafields: datafields,
     id: 'ppp',
     localdata: model
     };

     var dataAdapter = new $.jqx.dataAdapter(source);


     $('#pivotGrid').jqxGrid({
     source: dataAdapter,
     width: "100%",
     editable: true,
     selectionmode: 'singlecell',
     columnsresize: true,
     pageable: true,
     autoheight: true,
     columns: columns
     });
     */


    return GridDataView2;

})