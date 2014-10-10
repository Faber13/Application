/**
 * Created by fabrizio on 7/7/14.
 */
define(["jquery" , "views/modelView/ViewModel", "adapterGrid",  "jqwidgets" ], function ($, ViewModel, AdapterGrid) {

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
        this.renderGrid(modelView)
    }


    GridDataView2.prototype.renderGrid = function (model) {
        var columnsNumber = adapterGrid.getNumberOfColumns(model)
        var differentDates = adapterGrid.getDifferentDates();
        var columns = [];

        console.log(JSON.stringify(model))


        var source = {
            datatype: "array",
            datafields: [
                { name: 0, type: 'string' },
                { name: 3, type: 'string' }
            ],
            id: 'ppp',
            localdata: model
        };

        var dataAdapter = new $.jqx.dataAdapter(source);
        console.log('DataAdapter')
        console.log(dataAdapter)

        $('#pivotGrid').jqxGrid({
            source: dataAdapter,
            width: "100%",
            editable: true,
            selectionmode: 'singlecell',
            columnsresize: true,
            pageable: true,
            autoheight: true,
            columns: [
                { text: 'Element', datafield: 0 },
                { text: 'Values',    datafield: 3}

            ]
        });

        document.getElementById('box').style.visibility = "visible";
        var options =  document.getElementById('options')
        options.style.visibility = "visible" ;
        var toappend = document.getElementById('toAppend');
        if(toappend != null){
            toappend.remove()
        }

        var f = document.getElementById('optionsPivotGrid');
        if(typeof f != 'undefined' && f != null){
            f.remove();
        }

        var f = document.getElementById('newForecast');
        if(typeof f != 'undefined' && f != null){
            f.remove();
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

    }


    GridDataView2.prototype.updateGridView = function (newCell, indexCell) {

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


    GridDataView2.prototype.onChangeCellValue = function (datasource) {
        //TODO
    }


    GridDataView2.prototype.onAddRow = function () {
        //TODO (V2.0)
    }


    GridDataView2.prototype.onDeleteRow = function () {
        //TODO (V2.0)
    }


    GridDataView2.prototype.onAddColumn = function () {
        //TODO (V2.0)
    }


    GridDataView2.prototype.onRemoveColumn = function () {
        //TODO (V2.0)
    }

    return GridDataView2;

})