/**
 * Created by fabrizio on 9/8/14.
 */
define(["jquery", "formulasAmis/support/FormulaConfigurator", "formulasAmis/support/SupportModel"], function ($, Configurator, SupportModel) {

    var configurator, mapCodes, numberOfRows, supportModel, indexValue;



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



        model.sort(function (a,b) {
            if (a["2"] < b["2"])
                return -1;
            if (a["2"]> b["2"])
                return 1;
            return 0;
        });

        debugger;

        this.applyFormulas(model)

        model.sort(function (a,b) {
            if (mapCodes[a["0"]] < mapCodes[b["0"]]) {
                    return -1;
            }
            if (mapCodes[a["0"]]> mapCodes[b["0"]]){
                 return 1;
            }
            return 0;
        });
        debugger;
    }

    FormulaController.prototype.applyFormulas = function(model){

        var allInitFormulas = configurator.getAllInitFormulas();

        numberOfRows = Object.keys(mapCodes).length;
        var numberOfColumns = model.length/ Object.keys(mapCodes).length;
       // for each column
        for(var z= 0; z<numberOfColumns; z++) {
            // for each formula
            for (var i = 0; i < allInitFormulas.length; i++) {
                this.createFormula(model, allInitFormulas[i], z, numberOfColumns, i)
            }
        }

        return model;
    }

    FormulaController.prototype.createFormula = function(model, formula, indexColumn, numberOfColumns, indexFormula){
        console.log("createFormula")
        var addendums = [];
        var operations = [];
        var startIndex = numberOfRows*indexColumn
        // set the start index and the range
        var codeValue = formula.variable.value[0]
        console.log("variabile: " + codeValue)
        var indexRow  =supportModel.lookForCode(codeValue,model,startIndex, numberOfRows)
        console.log("indexRow: "+indexRow)
        var rowModel =  model[indexRow]
        for( var i =0; i< formula.addendums.length; i++){
            var addendum= formula.addendums[i]
            switch (addendum.dataType){
                case "code":
                    var code = addendum.value[0];
                   // console.log('code')
                   // console.log(code)
                    var index = supportModel.lookForCode(code,model,startIndex, numberOfRows)
                   // console.log('index')
                   // console.log(index)
                    addendums.push(model[index][indexValue])
                    break;
                case "operation":
                    operations.push(addendum.value)
                    break;
                case "constant":
                    addendums.push(addendum.value)
                    break;
            }
        }
        var value = addendums[0];
        for(var j =0; j< operations.length; j++){
            switch(operations[j]){
                case "+":
                    value += addendums[j+1]
                    break;
                case "-":
                    value -= addendums[j+1];
                    break;
                case "*":
                    value = value* addendums[j+1]
                    break;
                case "/":
                    if(typeof addendums[j+1] !== 'undefined' && addendums[j+1] != 0 && addendums[j+1] != null ){
                        value = value/addendums[j+1]
                    }
                    break;
            }
        }
       rowModel[indexValue] = value;
    }


    return FormulaController;
})
