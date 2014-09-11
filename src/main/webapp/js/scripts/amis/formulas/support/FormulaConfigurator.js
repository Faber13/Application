/**
 * Created by fabrizio on 9/8/14.
 */
define(["jquery" ], function ($) {

    var ulrFormulas = "./js/scripts/amis/formulas/configuration/formula.json"

    var config;

    function FormulaConfigurator() {}

    FormulaConfigurator.prototype.init = function () {

        // Get json configuration
        $.ajax({
            async: false,
            type: 'GET',
            url: ulrFormulas,
            success: function (data) {
                config = data;
            }
        })

        console.log("formulaConfigurator")
        console.log(config)

    }

    FormulaConfigurator.prototype.getAllInitFormulas = function(){
        return config.initFormulas;
    }

    FormulaConfigurator.prototype.getAllVariablesInitFormulas = function(){
        var result = [];
        var allFormulasInit = this.getAllInitFormulas();
        for(var i =0; i< allFormulasInit.length; i++){
            result.push(allFormulasInit[i].variable);
        }
        return result;
    }

    FormulaConfigurator.prototype.getEntireFormulaFromNumber = function(number){
       return this.getAllInitFormulas()[number-1];
    }

    FormulaConfigurator.prototype.getAddendumsFromNumberFormula = function(){
        var entireFormula = this.getAllInitFormulas()[number-1];
        return entireFormula.addendums;
    }

    FormulaConfigurator.prototype.checkIfInterColumnFormula= function(formula){
        var interColumns = false;
        if(!formula.variable.otherColumns){
            for(var i =0; !interColumns && i< formula.addendums.length; i++){
                interColumns = formula.addendums[i].otherColumns;
            }
        }
        return interColumns;
    }

    FormulaConfigurator.prototype.getAllFormulaOnUpdate = function(){
        return config.onUpdate.formulas;
    }

    FormulaConfigurator.prototype.getBindedKeys = function(){
        return config.onUpdate.bindedKeys;
    }

    FormulaConfigurator.prototype.getFormulasBindedFromKey = function(key){
        var result;
        var allFormula = this.getAllFormulaOnUpdate()
        var found = false;
        for( var i=0; i<allFormula.length && !found; i++){
            if(allFormula[i].key[0] == key) {
                found = true;
                result = allFormula[i].formulasBinded;
            }
        }
        return result;
    }

    FormulaConfigurator.prototype.getDirectEditableValues = function(){
       return config.editableValues.directEditing.values;
    }

    FormulaConfigurator.prototype.getSpecialEditableValues = function(){
        return config.editableValues.specialEditing.values;
    }

    FormulaConfigurator.prototype.getAllEditableValues = function(){
        var result = this.getDirectEditableValues();
        var special = this.getSpecialEditableValues();
        for(var i = 0; i<special.length; i++){
            result.push(special[i])
        }
        return special;
    }

    return FormulaConfigurator;
});
