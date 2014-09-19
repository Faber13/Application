/**
 * Created by fabrizio on 9/15/14.
 */
define(["jquery"], function($){

    var config;
    var ulrFormulaPlugins = './js/scripts/amis/editing/special/configuration/formulaPlugin/formulaPlugins.json'


    function FormulaConfigurator(){
        $.ajax({
            type: 'GET',
            url: ulrFormulaPlugins,
            success: function (data) {
                config = data;
            }
        })
    }


    // 1: Production; 2: OtherUses; 3: Paddy
    // Get one or mor formulas
    FormulaConfigurator.prototype.getInitFormula = function(numberOfFormUsed, typeOfForm){
        var result;
        switch (numberOfFormUsed){
            case 1:
                var typeOfForm = config.formulaPlugins[numberOfFormUsed-1];
                if(typeOfForm == "totalValues"){
                    result = typeOfForm.typeOfForm.init
                }else if(typeOfForm == "singleCrops"){
                    result = typeOfForm.typeOfForm.init
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