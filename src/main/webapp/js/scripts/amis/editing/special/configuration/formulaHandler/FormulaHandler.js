/**
 * Created by fabrizio on 9/19/14.
 */

define(["jquery", "specialFormulaConf/formulaUtils/FormulaConfigurator", "specialFormulaConf/dataUtils/CommonUtils"],
    function ($, FormulaConfigurator, CommonUtils) {

    var formulaConfigurator, commonUtils;

    function FormulaHandler() {
        formulaConfigurator = new FormulaConfigurator;
        commonUtils = new CommonUtils;
    }

    FormulaHandler.prototype.getInitFormulaFromConf = function (numberOfForm, typeOfForm) {
        return formulaConfigurator.getInitFormula(numberOfForm, typeOfForm)
    }


    FormulaHandler.prototype.createFormula = function (modelData, formulaData) {
        console.log("createFormula")
        var model = modelData;
        var formula =  formulaData;
        var addendums = [];
        var operations = [];
        var startIndex, indexRow;
        // set the start index and the range
        var codeValue = formula.variable.value[0]

        var notRealizeable = false;

        //  initialize a label
        label1:
            for (var i = 0; i < formula.addendums.length; i++) {
                var addendum = formula.addendums[i]
                switch (addendum.dataType) {
                    case "code":
                        var code = addendum.value[0];

                        if (typeof model[index][3] != 'undefined' && model[index][3] != null) {
                            if (addendum.hasConditions && addendum.condition == "exists")
                                addendums.push(model[index][3])
                        } else {
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

        if (!notRealizeable) {
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
        if (!notRealizeable) {
            model[3] = value;
            // Insert the flag
            model[4] = 'C';
        } else {
            model[3] = model[3];
        }

        return model;

    }

    return FormulaHandler;
})