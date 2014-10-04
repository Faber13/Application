/**
 * Created by fabrizio on 10/4/14.
 */
define(['jquery'], function(){

    var filterActual, realPreviousDate, realDataToSave;
    function SavingModel(){}

    /* EXAMPLE PATTERN TO SAVE
     {
         "filter":{
             "region":12,
             "product":5,
             "year":2010
         },

         "data":[
             [
                 4,
                 "Tonnes/Ha",
                 "2013-07-15",
                 7.81,
                 null
             ],
             [
                 19,
                 "Million tonnes",
                 "2013-07-15",
                 27.65,
                 " "
             ],
             [
                 27,
                 "Million tonnes",
                 "2013-07-15",
                 27.65,
                 " "
             ]
         ]
     }
     */

    SavingModel.prototype.init = function(){}


    SavingModel.prototype.prepareData = function(alldata, tableData, newData,actualFilter, realPreviousYearDate){
        realPreviousDate = realPreviousYearDate;
        filterActual = actualFilter;
        //TODO
        console.log('-------------------------------------------------')
        console.log('Insertion only cell click: ')
        console.log('+++++++++++++++++++')
        console.log('newData:')
        console.log(newData)
        console.log('+++++++++++++++++++')
        console.log('TableData')
        console.log(tableData)

        console.log('allData')
        console.log(alldata)
        console.log('-------------------------------------------------')
        // dataOriginals
        var allDataWithRealDate = this.setRealDate(alldata)
        debugger;

        var allDataCleaned = this.cleanNewData(allDataWithRealDate);
        var allDataRightDate = this.setRightDateFormat(allDataCleaned)

        // data Updated
        var trueAllData = this.setRealDate(newData.updatedData)
        var trueNewUpdatedData = this.setRightDateFormat(trueAllData)

        if(typeof newData.newData!= 'undefined' && newData.length > 0){

            var trueNewData = this.cleanNewData(newData.newData)
            // set the rightDateFormat
            var newDataRightDate = this.setRightDateFormat(trueNewData)
            trueNewUpdatedData = this.mergeNewDateWithUpdatedDate(trueNewUpdatedData, newDataRightDate)
        }
        // now I have the new Data clean, ready to merge with allData
        realDataToSave = this.mergeNewDateWithUpdatedDate(allDataRightDate, trueNewUpdatedData);
    }


    SavingModel.prototype.setRealDate = function(model){
        var result = []
        for( var i=0; i< model.length; i++){
            if(model[i][2] == '20000103'){
                model[i][2] = realPreviousDate
            }
            result.push(model[i])
        }
        return result;
    }

    SavingModel.prototype.cleanNewData = function(dataNew){
        var result = []
        for(var i =0; i<dataNew.length; i++){
            if(dataNew[i][0] != 1 && dataNew[i][0] != 999 && dataNew[i] != 22){
                result.push(dataNew[i])
            }
        }
        return result;
    }

    SavingModel.prototype.mergeNewDateWithUpdatedDate = function(dataUnique, dataToMerge){
        var result = []
        result = $.extend(true,[],dataUnique);
        for(var i =0; i<dataToMerge.length; i++){
            var exist = false
            for(var j =0; j<dataUnique.length && !exist; j++){
                // if exist
                if(dataUnique[j][0] == dataToMerge[i][0] && dataUnique[j][2] == dataToMerge[i][2]){
                    result[j] = dataToMerge[i]
                    exist = true;
                }else if(j == dataUnique.length-1 && !exist){
                    result.push(dataToMerge[i])
                }
            }
        }
        return result;
    }

    SavingModel.prototype.setRightDateFormat = function(model){
     var result = []
        for(var i =0; i< model.length; i++){
            var value = model[i][2]
            // if date is in DSD format
            if(value.length == 8) {
                var year = value.substr(0, 4);
                var month = value.substr(4, 2);
                var day = value.substr(6, 2);
                var date = new Date(year, month - 1, day);
                model[i][2] = moment(date).format('YYYY-MM-DD')
            }
            result.push(model[i])
        }
        return result;
    }

    SavingModel.prototype.preparePutPayload = function(){
        var result = {};
        result['filter'] = {
            "region": filterActual.region,
            "product": filterActual.product,
            "year": filterActual.year
        }
        result["data"] = realDataToSave
        return result;
    }

    return SavingModel;
})