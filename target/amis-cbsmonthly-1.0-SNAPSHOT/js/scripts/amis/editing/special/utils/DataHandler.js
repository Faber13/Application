/**
 * Created by fabrizio on 9/11/14.
 */
define(['jquery'], function($){

    var originalData;

    function DataHandler(){};

    DataHandler.prototype.init = function(){

    }

    DataHandler.prototype.orderAndGetByDate = function(data, requestedDate){
        var result = [];
        originalData = data;
        var dataOrderedByDate = $.extend(true, [], cellTableModel2);
        dataOrderedByDate.sort(function (a,b) {
            if (a["2"] < b["2"])
                return -1;
            if (a["2"]> b["2"])
                return 1;
            return 0;
        });

        var startRightDate = 0;
        // return all the data of the column( the date)
        for(var i = 0; i<dataOrderedByDate.length && startRightDate !=2; i++){
            if(dataOrderedByDate[i] == requestedDate ){
                startRightDate =1
                result.push(dataOrderedByDate[i])
            }else if(dataOrderedByDate[i] != requestedDate &&  startRightDate ==1){
                startRightDate =2
            }
        }
        return result;
    }

    DataHandler.prototype.getOriginalData = function(){
        return originalData;
    }

    DataHandler.prototype.getDataFromCodes = function(data, codes){

        var result = [] ;
        for( var j=0; j< codes.length; j++ ) {
            var found = false;
            for (var i = 0; i < data.length && !found; i++) {
                if(data[i][0] == codes[j]) {
                    result.push(data[i])
                    found = true;
                }
            }
        }
        return result;
    }


    DataHandler.prototype.getInvolvedData = function(codes, data, cell){

        var result = [];
        var copyCodes = $.extend([], true, codes);
        var date = cell[2];
        for(var j = 0; j< copyCodes.length; j++){
             for(var i =0; i< data.length; i++){
                if(data[i][0] == copyCodes[j] && data[i][2] == date ){
                    copyCodes.splice(j,1)
                    result.push(data[i])
                }
            }
        }
        return result;
    }

    return DataHandler;
})