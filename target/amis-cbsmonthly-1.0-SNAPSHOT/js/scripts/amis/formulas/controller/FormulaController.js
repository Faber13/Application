/**
 * Created by fabrizio on 9/8/14.
 */
define(["jquery", "formulasAmis/support/FormulaConfigurator", "formulasAmis/support/SupportModel"], function ($, Configurator, SupportModel) {

    var configurator, mapCodes, numberOfRows, supportModel, indexValue, numberOfColumns;

    function FormulaController(){
        configurator = new Configurator;
        supportModel = new SupportModel;
    }

    FormulaController.prototype.init = function(model, dsdConfigurator){

        // initialization of configurator
        supportModel.init(dsdConfigurator)
        mapCodes = supportModel.getMapCodes();

        configurator.init();
        indexValue = dsdConfigurator.getValueIndex();

        this.sortByDateAtStart(model)

        this.applyFormulas(model)

        this.sortInitialValue(model)

    }

    FormulaController.prototype.applyFormulas = function(model){

        var allInitFormulas = configurator.getAllInitFormulas();

        numberOfRows = Object.keys(mapCodes).length;
        numberOfColumns = model.length/ Object.keys(mapCodes).length;
       // for each column
        for(var z= 0; z<numberOfColumns; z++) {
            // for each formula
            for (var i = 0; i < allInitFormulas.length; i++) {
                this.createFormula(model, allInitFormulas[i], z, numberOfColumns, i)
            }
        }
        return model;
    }

    FormulaController.prototype.createFormula = function(model, formula, indexColumn, indexRow, indexFormula) {
        console.log("createFormula")
        var addendums = [];
        var operations = [];
        var startIndex, indexRow;
        // set the start index and the range
        var codeValue = formula.variable.value[0]
            if (formula.otherColumn) {
                var indexColumnVariable = formula.columnNumber;
                startIndex = numberOfRows * indexColumnVariable;
            } else {
                startIndex = numberOfRows * indexColumn
            }
        var notRealizeable = false;

        indexRow  =supportModel.lookForCode(codeValue,model,startIndex, numberOfRows)
        var rowModel =  model[indexRow]
        //  initialize a label
        label1:
        for( var i =0; i< formula.addendums.length; i++){
            var addendum= formula.addendums[i]
            switch (addendum.dataType){
                case "code":
                    var code = addendum.value[0];
                    if (addendum.otherColumn) {
                        var indexColumnVariable = addendum.columnNumber;
                        startIndex = numberOfRows * indexColumnVariable;
                    } else {
                        startIndex = numberOfRows * indexColumn
                    }
                    var index = supportModel.lookForCode(code,model,startIndex, numberOfRows)
                    if(typeof model[index][indexValue] != 'undefined' && model[index][indexValue] !=null) {
                        addendums.push(model[index][indexValue])
                    }else{
                        notRealizeable = true;
                        break label1;
                    }
                    break;
                case "operation":
                    operations.push(addendum.value)
                    break;
                case "constant":
                    addendums.push(addendum.value)
                    break;
            }
        }

        if(!notRealizeable) {
            var value = addendums[0];
            label2:
                for (var j = 0; j < operations.length; j++) {
                    switch (operations[j]) {
                        case "+":
                            if (typeof addendums[j + 1] !== 'undefined' && addendums[j + 1] != null && addendums[j + 1] != '') {
                                value += addendums[j + 1]
                            } else {
                                notRealizeable = true;
                                break label2;
                            }
                            break;

                        case "-":
                            if (typeof addendums[j + 1] !== 'undefined' && addendums[j + 1] != null && addendums[j + 1] != '') {
                                value -= addendums[j + 1];
                            } else {
                                notRealizeable = true;
                                break label2;
                            }
                            break;
                        case "*":
                            if (typeof addendums[j + 1] !== 'undefined' && addendums[j + 1] != null && addendums[j + 1] != '') {
                                value = value * addendums[j + 1]
                            } else {
                                notRealizeable = true;
                                break label2;
                            }
                            break;
                        case "/":
                            if (typeof addendums[j + 1] !== 'undefined' && addendums[j + 1] != 0 && addendums[j + 1] != null && addendums[j + 1] != '') {
                                value = value / addendums[j + 1]
                            } else {
                                notRealizeable = true;
                                break label2;
                            }
                            break;
                    }
                }
        }
            if(!notRealizeable) {
                rowModel[indexValue] = value;
                rowModel[4] = 2;
                var newIndexRow = supportModel.createIndexOriginalModel(numberOfColumns, indexColumn,mapCodes, codeValue)

            }else{
                rowModel[indexValue] = rowModel[indexValue];
            }
        if(typeof newIndexRow!== ' undefined')
            return {"index": newIndexRow, "row": rowModel}
        return null;
    }




    FormulaController.prototype.checkIfBindedCode = function(listOfBindedCodes, code){
        var result =false;
        for(var i=0; i<listOfBindedCodes.length && !result; i++) {
            if (listOfBindedCodes[i] == code) {
                result = true;
            }
        }
        return result;
    }

    FormulaController.prototype.applyUpdateFormulas = function(model, formulas, indexColumn, indexRow) {
        var newValues = [];
        for (var i = 0; i < formulas.length; i++) {
            var indexFormula = formulas[i];
            var formula = configurator.getEntireFormulaFromNumber(indexFormula);
            debugger;
            var newValue = this.createFormula(model, formula, indexColumn, indexRow)
            if(newValue != null && typeof newValue !== 'undefined')
                newValues.push(newValue);
        }
        return newValues
    }

    FormulaController.prototype.getBindedKeys = function(){
        return configurator.getBindedKeys();
    }

    FormulaController.prototype.getFormulasBindedFromKey = function(key){
        return configurator.getFormulasBindedFromKey(key)
    }

    FormulaController.prototype.sortByDateAtStart = function(model){
        model.sort(function (a,b) {
            if (a["2"] < b["2"])
                return -1;
            if (a["2"]> b["2"])
                return 1;
            return 0;
        });

    }

    FormulaController.prototype.sortInitialValue = function(model){
        model.sort(function (a,b) {
            if (mapCodes[a["0"]] < mapCodes[b["0"]]) {
                if (a["2"] < b["2"])
                    return -2;
                return -1;
            }
            if (mapCodes[a["0"]]> mapCodes[b["0"]]){
                if (a["2"]> b["2"])
                    return 2;
                return 1;
            }else{
                if (a["2"] < b["2"])
                    return -1;
                if (a["2"]> b["2"])
                    return 1;
                return 0;
            }
        });
    }

    return FormulaController;
})
