/**
 * Created by fabrizio on 9/15/14.
 */
define(["jquery"], function($){

    var config;
    var ulrFormulaPlugins = './js/scripts/amis/editing/special/configuration/formulaPlugin/formulaPlugins.json'


    function FormulaConfigurator(){
        $.ajax({
            async:false,
            type: 'GET',
            url: ulrFormulaPlugins,
            success: function (data) {
                config = data;
            }
        })

    }


    // 1: Production; 2: OtherUses; 3: Paddy
    // Get one or mor formulas
    FormulaConfigurator.prototype.getInitFormula = function(numberOfFormUsed, type){

        var result;
        switch (numberOfFormUsed){
            case 1:
                var typeOfForm = config.formulaPlugins[numberOfFormUsed-1];
                if(type == "totalValues"){
                    result = typeOfForm.totalValues.init[0]
                }else if(type == "singleCrops"){
                    result = typeOfForm.singleCrops.init[0]
                }
                break;

            case 2:
                //TODO (other uses)
                break;
            case 3:
                //TODO (paddy form)
                break;
        }
        return result;
    }

     return FormulaConfigurator;

})