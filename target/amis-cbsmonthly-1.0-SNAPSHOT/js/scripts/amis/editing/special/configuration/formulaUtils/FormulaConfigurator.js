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
                var typeOfForm = config.formulaPlugins[numberOfFormUsed-1];
                if(type == "totalValues"){
                    result = typeOfForm.totalValues.init
                }else if(type == "singleCrops"){
                    result = typeOfForm.singleCrops.init[0]
                }
                break;
        }
        return result;
    }


    FormulaConfigurator.prototype.getUpdateFormula = function(numberOfFormUsed, type, dependentElement, particularForm){

        var result;
        switch (numberOfFormUsed){
            case 1:
                var typeOfForm = config.formulaPlugins[numberOfFormUsed-1];
                    var updateFormulas = typeOfForm[type].valuesDisabled;
                if  (dependentElement == "production") {
                    result = updateFormulas[0].production;


                }else if(dependentElement == "areaHarvested"){
                        result = updateFormulas[1].areaHarvested;
                    }else if( dependentElement == 'yield'){
                        result = updateFormulas[2].yield;
                    }
                break;

            case 2:
                var typeOfForm = config.formulaPlugins[numberOfFormUsed-1];
                var updateFormulas = typeOfForm[type].valuesDisabled;
                if  (dependentElement == "milled") {
                    if(typeof particularForm != 'undefined'){
                        console.log('PARITOCLATSDADSAD')
                        result = updateFormulas[0].milled[particularForm]
                    }else {
                        result = updateFormulas[0].milled;
                    }

                }else if(dependentElement == "areaHarvested"){
                    if(particularForm){
                        result = updateFormulas[1].areaHarvested[particularForm]
                    }else {
                        result = updateFormulas[1].areaHarvested;
                    }
                }else if( dependentElement == 'yield') {
                    if (particularForm) {
                        result = updateFormulas[2].yield[particularForm]
                    } else {
                        result = updateFormulas[2].yield;
                    }
                }
                break;
            case 3:
                break;
        }
        return result;
    }

     return FormulaConfigurator;

})