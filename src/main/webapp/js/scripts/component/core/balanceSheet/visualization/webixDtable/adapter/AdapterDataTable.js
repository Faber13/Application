/**
 * Created by fabrizio on 10/14/14.
 */
define(['jquery'], function($){

    var numberOfColumns, differentDates,mapTitles
    function AdapterDataTable(){
        differentDates = [];
        mapTitles = {}
    }

    AdapterDataTable.prototype.init = function(){

    }

    AdapterDataTable.prototype.createPropertiesFromModel = function(model){
            differentDates = {};
            differentDates[ model[0][2]] = true
            numberOfColumns = 1
            for(var i =0; i< model.length; i++){
                // not exist in map
               if(typeof mapTitles[model[i][0]] == 'undefined') {
                   mapTitles[model[i][0]] = [i]
               }
               else{
                   mapTitles[model[i][0]].push(i)
               }
                if(typeof differentDates[model[i][2]] === 'undefined'){
                    differentDates[model[i][2]] = true
                    numberOfColumns++;
                }
            }
    }

    AdapterDataTable.prototype.getNumberOfColumns = function(){

        return numberOfColumns;
    }

    AdapterDataTable.prototype.getDifferentDates = function() {

        return differentDates;
    }

    AdapterDataTable.prototype.getTitlesMap = function(){
        return mapTitles;

    }

    return AdapterDataTable
})