define(["jquery", "moment", "numeral"], function ($) {

    var mapLabelToCode = [];

    function DatatypesFormatter() {
    }


    // From editing or visualization to DSD format
    DatatypesFormatter.prototype.fromVisualizationToDSDFormat = function (value, datatype, formatDate) {

        var result
        switch (datatype) {
            case "month":
                result = (typeof value != 'undefined' && value !== 'undefined' && value != null) ? moment(value).format("YYYYMM") : undefined;
                break;

            case "year" :
                result = (typeof value != 'undefined' && value !== 'undefined' && value != null) ? moment(value).format("YYYY") : undefined;
                break;

            case "time" :
                result = (typeof value != 'undefined' && value !== 'undefined' && value != null) ? moment(value, formatDate).toJSON() : undefined;
                break;

            case "date":
                if (typeof value != 'undefined' && value !== 'undefined' && value != null) {
                    if (value != "Previous Year") {
                        result = moment(value).format("YYYYMMDD")
                    } else {
                        result = "20000103"
                    }
                } else {
                    result = undefined
                }
                break;

            case "code" || "codeList" || "customCode":
                result = (value !== 'undefined') ? value : undefined;
                break;

            case "boolean":
                if (typeof  value == 'undefined' || value == 'undefined') {
                    result = undefined;
                }
                else {
                    result = value;
                }
                break;

            case "number":
                result = (typeof value != 'undefined' && value !== 'undefined' && value != null) ? parseInt(value) : undefined;
                break;

            default :
                result = (value !== 'undefined' && value != '') ? value : undefined;
        }
        return result;
    }

    // From DSD format to the right visualization format
    DatatypesFormatter.prototype.fromDSDToVisualizationFormat = function (value, configurationKeyColumn, datatype, configurator) {

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
                if (typeof value != 'undefined' && value !== 'undefined' && value != null) {
                    if (value != "20000103") {
                        var year = value.substr(0, 4);
                        var month = value.substr(4, 2);
                        var day = value.substr(6, 2);
                        var date = new Date(year, month - 1, day);
                        result = moment(date).format(configurationKeyColumn.properties.cellProperties.dateFormat)
                    } else {
                        result = "Previous Year"
                    }
                } else result = undefined
                break;

            case "code" || "codeList" || "customCode":
                var codeToLabel = this.lookForCodeFromLabel(value);
                var columnsCodes = configurator.lookForCode(configurationKeyColumn.columnId);
                result = columnsCodes.mapCodeLabel[value];
                break;

            case "number":
                result = (typeof value != 'undefined' && value !== 'undefined' && value != null) ?
                    numeral(value).format(configurationKeyColumn.properties.cellProperties.numericFormat) :
                    value;
                break;
        }
        return result;

    }


    DatatypesFormatter.prototype.lookForCodeFromLabel = function (label) {
        var result;
        for (var i = 0; i < mapLabelToCode.length; i++) {
            if (typeof mapLabelToCode[i].map[label] !== 'undefined') {
                result = mapLabelToCode[i].map[label]
            }
        }
        return result;
    }

    // Convert into a fixed number of decimals
    DatatypesFormatter.prototype.convertNumberOfDecimals = function (data, numberOfDecimals) {
        var result;
        if (typeof data != 'undefined' && data != null && data != 'null') {
            result = parseInt(data).toFixed(numberOfDecimals);
        } else {
            result = data;
        }
        return result;
    }


    return DatatypesFormatter;
})