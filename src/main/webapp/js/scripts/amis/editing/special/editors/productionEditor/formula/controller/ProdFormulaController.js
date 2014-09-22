/**
 * Created by fabrizio on 9/15/14.
 */
define(['jquery'], function($){

    function ProdFormulaController(){}

    ProdFormulaController.prototype.applyFormulas = function(model){

        var allInitFormulas = configurator.getAllInitFormulas();


        // for each column
        for(var z= 0; z<numberOfColumns; z++) {
            // for each formula
            for (var i = 0; i < allInitFormulas.length; i++) {
                this.createFormula(model, allInitFormulas[i], z, numberOfColumns, i)
            }
        }
        return model;
    }

    ProdFormulaController.prototype.createFormula = function(modelData, formulaData, indexColumnData, indexRow2, indexFormula) {
        var model = modelData;
        var formula = formulaData;
        var indexColumn = indexColumnData
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
            // Insert the flag
            rowModel[4] = 'C';
            var newIndexRow = supportModel.createIndexOriginalModel(numberOfColumns, indexColumn,mapCodes, codeValue)

        }else{
            rowModel[indexValue] = rowModel[indexValue];
        }
        if(typeof newIndexRow!== ' undefined')
            return {"index": newIndexRow, "row": rowModel}
        return null;
    }



    return ProdFormulaController;
})