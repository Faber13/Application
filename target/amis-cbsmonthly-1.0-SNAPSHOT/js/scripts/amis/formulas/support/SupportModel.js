/**
 * Created by fabrizio on 9/8/14.
 */
define(["jquery" ], function ($) {

    var configuratorDSD, mapCodes, tableMapCodes

    function SupportModel() {
    }

    SupportModel.prototype.init = function (dsdConfigurator) {
        configuratorDSD = dsdConfigurator;
        tableMapCodes = {};
    }

    SupportModel.prototype.getMapCodes = function () {
        var result;
        if (typeof mapCodes === 'undefined') {
            var result = {}
            var allDSDCodes = configuratorDSD.getLeftKeyColumn().leftColumns[0].domain.codes;
            for (var i = 0; i < allDSDCodes.length; i++)
                result[allDSDCodes[i].code.code] = i;
            mapCodes = result;

        } else {
            result = this.getMapCodesInstance()
        }
        return result;
    }

    // singleton
    SupportModel.prototype.getMapCodesInstance = function () {
        return mapCodes;
    }

    // get or find into the table model
    SupportModel.prototype.lookForCode = function (code, model, startIndex, numberOfRows) {
        var result;
        var found = false;
        for (var i = startIndex; !found && i < startIndex + numberOfRows; i++) {
            if (model[i][0] == code) {
                found = true
                result = i;
            }
        }

        return result;
    }

    return SupportModel;
})