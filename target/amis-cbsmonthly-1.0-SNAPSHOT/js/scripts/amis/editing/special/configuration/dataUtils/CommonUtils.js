/**
 * Created by fabrizio on 9/19/14.
 */
define(['jquery'], function($){

    function CommonUtils(){}

    CommonUtils.prototype.getRowModelFromCode = function(code, model){
        var result;
        var found = false;
        for(var i =0; i< model.length && !found; i++){
            if(model[i][0] == code){
                result = model[i];
                found = true;
            }
        }
        return result;
    }

    return CommonUtils;
})