/**
 * Created by fabrizio on 5/20/14.
 */
define(["jquery", "jqwidgets"], function($) {

    var  combo, productCode;

    function CommoditySelector(){ }


    CommoditySelector.prototype.init = function(){

     /*   var that = this;
        combo = $("#selectionCommodity")
        var url = "http://faostat3.fao.org:7777/msd/cl/system/AMIS_PRODUCTS/1.0";
        var sources = [];

        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success : function(data){

                var localdata = that.sortAndFilter(data);

                // prepare the data
                var source =
                {
                    datatype: "json",
                    datafields: [
                        { name: 'code' },
                        { name: 'label', map: "title>EN" }
                    ],
                    localdata: localdata
                };

                var dataAdapter = new $.jqx.dataAdapter(source);

                // comboBox
                combo.jqxComboBox({
                    source: dataAdapter ,
                    displayMember: "label",
                    valueMember: "code",
                    selectedIndex: 0,
                    width: '200px',
                    height: '25px'
                })
            }
        });

        // Take the Preselected Value
        productCode = combo.jqxComboBox('getItem', combo.jqxComboBox('selectedIndex')).value;
*/

        combo = $("#selectionCommodity")
        var data = {"code":5, "label":"Maize"}
        var source =
        {
            datatype: "json",
            datafields: [
                { name: 'code' },
                { name: 'label' }
            ],
            localdata: data
        };

        var dataAdapter = new $.jqx.dataAdapter(source);

        // comboBox
        combo.jqxComboBox({
            source: dataAdapter ,
            displayMember: "label",
            valueMember: "code",
            selectedIndex: 0,
            width: '200px',
            height: '25px'
        })

        var commodityCode = combo.jqxComboBox('getItem', combo.jqxComboBox('selectedIndex')).value;
        return commodityCode;
    };


    CommoditySelector.prototype.getcombo = function(){
        return combo;
    };


    CommoditySelector.prototype.change = function(event) {

        // To pass the value
        var args = event.args;
        var item = combo.jqxComboBox('getItem', args.index);

        this.productCode = item.value;
        return this.productCode;
    };


    CommoditySelector.prototype.sortAndFilter = function(data){

        // Sort
        var localdata = data.rootCodes.sort(function(a, b){
            if ( a.title.EN < b.title.EN )
                return -1;
            if ( a.title.EN > b.title.EN )
                return 1;
            return 0;
        });

        // Filter
        localdata.splice(0,1);
        localdata.splice(3,1);

        // Return
        return localdata;
    }


    return CommoditySelector;

});


