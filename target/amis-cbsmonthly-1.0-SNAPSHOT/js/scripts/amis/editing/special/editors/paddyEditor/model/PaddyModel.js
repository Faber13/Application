/**
 * Created by fabrizio on 9/30/14.
 */
define(['jquery'], function($){

    var supportUtility;

    // URL
    var cropsUrl = "http://168.202.28.178:8080/dataset/crops"

    var map=  {
        2 : "Area Harvested",
        5 : "Production",
        4 : "Yield",
        37: "Area Planted",
        998: "Production Paddy",
        3 : "Extraction Rate"
    }

    function PaddyModel(){}

    PaddyModel.prototype.init = function(){}

    PaddyModel.prototype.getTotalModel = function(involvedItems, utilitySupport){
        supportUtility = utilitySupport;



    }

    return PaddyModel;
})