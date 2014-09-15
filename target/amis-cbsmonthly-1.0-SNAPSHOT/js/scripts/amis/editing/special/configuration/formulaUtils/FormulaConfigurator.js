/**
 * Created by fabrizio on 9/15/14.
 */
define(['../../../../../libs/jquery'], function($){

    var config;

    function FormulaConfigurator(){}

    var ulrFormulaPlugins = './js/scripts/amis/editing/special/configuration/formulaPlugin/formulaPlugins.json'
    FormulaConfigurator.prototype.init = function(){
        $.ajax({
            type: 'GET',
            url: ulrFormulaPlugins,
            success: function (data) {
                config = data;
            }
        })


    }

    FormulaConfigurator.prototype.getInitFormula = function(numberOfFormUsed, subcase){
        var result;
        switch (numberOfFormUsed){
            case 1:

                break;
        }


    }


    return FormulaConfigurator;


})