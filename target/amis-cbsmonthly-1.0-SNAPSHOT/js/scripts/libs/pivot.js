/*
 This software is allowed to use under GPL or you need to obtain Commercial or Enterprise License
 to use it in non-GPL project. Please contact sales@webix.com for details
 */
webix.i18n.pivot = {
    apply: "Apply",
    cancel: "Cancel",
    columns: "Columns",
    count: "count",
    fields: "Fields",
    filters: "Filters",
    max: "max",
    min: "min",
    operationNotDefined: "Operation is not defined",
    pivotMessage: "[Click to configure]",
    rows: "Rows",
    select: "select",
    sum: "sum",
    text: "text",
    values: "Values",
    windowMessage: "[move fields into required sector]"
};

webix.protoUI({
    name:"pivot",
    defaults: {
        fieldMap: {},
        yScaleWidth: 300,
        columnWidth: 150,
        filterLabelWidth: 100
    },
    $divider: "_'_",
    $init: function(config) {
        if (!config.structure)
            config.structure = {};
        webix.extend(config.structure, { rows:[], columns:[], values:[], filters:[] });

        this.$view.className +=" webix_pivot";
        webix.extend(config, this._get_ui(config));
        this.$ready.push(this.render);
        this.data.attachEvent("onStoreUpdated", webix.bind(function() {
            // call render if pivot is initialized
            if (this.$$("data")) this.render();
        }, this));
    },
    _get_ui: function(config) {
        var filters = { id:"filters", view:"toolbar", hidden:true, cols:[
            {  }
        ]};

        var table = {
            view:"treetable",
            id:"data",
            select: "row",
            navigation:true,
            leftSplit:1,
            resizeColumn:true,
            on:{
                "onHeaderClick": function(id){
                    if (this.getColumnIndex(id.column) == 0)
                        this.getTopParentView().configure();
                }
            },
            columns:[
                { }
            ]
        };

        if(config.datatable && typeof config.datatable == "object" ){
            delete config.datatable.id;
            webix.extend(table,config.datatable,true);
        }

        return { rows: [ filters, table ] };
    },
    configure: function() {
        if (!this._config_popup) {
            var config = { id:"popup", view:"webix_pivot_config", operations:[], pivot: this.config.id };
            webix.extend(config , this.config.popup||{});
            this._config_popup = webix.ui(config);
            this._config_popup.attachEvent("onApply", webix.bind(function(structure) {
                this.define("structure", structure);
                this.render();
            }, this));
        }

        var functions = [];
        for (var i in this.operations) functions.push({name: i, title: this._apply_locale(i)});

        this._config_popup.define("operations", functions);
        var pos = webix.html.offset(this.$$("data").getNode());
        this._config_popup.setPosition(pos.x + 10, pos.y + 10);
        this._config_popup.define("data", this.getFields());
        this._config_popup.show();
    },

    render: function(without_filters) {
        //alert("ROWID")

        var data = this._process_data(this.data.pull, this.data.order);
        // data sara un oggetto tipo:
        // { data: [Figli], name: "nomePadre"}

       // se sono ssettati i flitri
        if (!without_filters) {
            var filters = this._process_filters();
            if (filters.length > 0) {
                this.$$("filters").show();
                this.$$("filters").define("cols", filters);
                this._filter_events();
            } else {
                this.$$("filters").hide();
            }
        }

        this.$$("data").config.columns = data.header;
        this.$$("data").refreshColumns();
        this.$$("data").clearAll();
        this.$$("data").parse(data.data);

    },

    toPDF: function() {
        this.$$("data").exportToPDF.apply(this.$$("data"), arguments);
    },

    toExcel: function() {
        this.$$("data").exportToExcel.apply(this.$$("data"), arguments);
    },
    _apply_locale: function(value){
        return webix.i18n.pivot[value]||value
    },
    _apply_map: function(value){
        return this.config.fieldMap[value]||value
    },
    _process_filters: function() {
        var filters = this.config.structure.filters || [];
        var items = [];
        for (var i = 0; i < filters.length; i++) {
            var f = filters[i];
            var item = { value: f.value, labelAlign: "right", label: this._apply_map(f.name), labelWidth: this.config.filterLabelWidth, field: f.name, view: f.type };
            if (f.type == "select")
                item.options = this._distinct_values(f.name);
            items.push(item);
        }
        return items;
    },

    _distinct_values: function(field) {
        var values = [{value:"",id:""}];
        var data = this.data.pull;
        var hash = {};
        for (var obj in data) {
            var value = data[obj][field];
            if (!webix.isUndefined(value)){
                if (!hash[value]) {
                    values.push({ value:value, id:value });
                    hash[value] = true;
                }
            }
        }
        return values;
    },

    _filter_events: function() {
        var filters = this.$$("filters");
        filters.reconstruct();

        var children = filters.getChildViews();
        var pivot = this;
        for (var i = 0; i < children.length; i++) {
            var el = children[i];
            if (el.name == "select")
                el.attachEvent("onChange", function(newvalue) {
                    pivot._set_filter_value(this.config.field, newvalue);
                });
            else
                el.attachEvent("onTimedKeyPress", function() {
                    pivot._set_filter_value(el.config.field, el.getValue());
                });
        }
    },

    _set_filter_value: function(field, value) {
        var filters = this.config.structure.filters;
        for (var i = 0; i < filters.length; i++)
            if (filters[i].name == field) {
                filters[i].value = value;
                this.render(true);
                return true;
            }
        return false;
    },

    _process_data: function(data, order) {
        this._init_filters();

        var structure = this.config.structure;
        structure._header = [];
        structure._header_hash = {};

        for (var i = 0; i < structure.values.length; i++) {
            structure.values[i].operation = structure.values[i].operation || ["sum"];
            if (!webix.isArray(structure.values[i].operation))
                structure.values[i].operation = [structure.values[i].operation];
        }
        var fields = structure.rows.concat(structure.columns);
        var items = this._group(data, order, fields);
        var header = {};
        if (structure.rows.length > 0){
            items = this._process_rows(items, structure.rows, structure, header);}

        else {
            // there are no rows in structure, only columns and values
            this._process_columns(items, structure.columns, structure, header);
            items = [];
        }
       // alert("ITems")
       // debugger;

        header = this._process_header(header);

        return { header: header, data: items };
    },

    _group: function(data, order, fields) {
        var value;
        var hash = {};
        if (fields.length == 0) return hash;

        for (var i = 0; i < order.length; i++) {
            var id = order[i];
            if (!data[id]) continue;

            // filtering
            if (!this._filter_item(data[id])) continue;

            value = data[id][fields[0]];
            if (webix.isUndefined(hash[value]))
                hash[value] = {};
            hash[value][id] = data[id];
        }
        if (fields.length > 1)
            for (value in hash) {
                hash[value] = this._group(hash[value], order, fields.slice(1));
            }
        return hash;
    },

    _process_rows: function(data, rows, structure, header) {
        var items = [];
        // se il numero di rhge e >1
        if (rows.length > 1) {
            //alert("IF")
            // per ogni elemento in data
            for (var i in data)
                data[i] = this._process_rows(data[i], rows.slice(1), structure, header);
            var values = structure._header;
            for (var i in data) {
                var item = { data: data[i] };
                for (var j = 0; j < item.data.length; j++) {
                    for (var k = 0; k < values.length; k++) {
                        var value = values[k];
                        if (webix.isUndefined(item[value]))
                            item[value] = [];
                        item[value].push(item.data[j][value]);
                    }
                }
                item = this._calculate_item(item, structure);
                item = this._minmax_in_row(item, structure);
                item.name = i;
                item.open = true;
                items.push(item);
            }
        } else {
           // alert("elese")
            for (var i in data) {
                var item = this._process_columns(data[i], this.config.structure.columns, structure, header);
                item.name = i;
                item = this._calculate_item(item, structure);
                item = this._minmax_in_row(item, structure);
                items.push(item);
            }
        }
  //      debugger;
        return items;
    },

    _process_columns: function(data, columns, structure, header, item, name) {
        item = item || {};
        if (columns.length > 0) {
            name = name || "";
            for (var i in data) {
                if(!header[i])
                    header[i] = {};
                data[i] = this._process_columns(data[i], columns.slice(1), structure, header[i], item, (name.length>0 ? (name + this.$divider) :"") + i);
            }
        } else {
            if (!webix.isUndefined(name)) {
                var values = this.config.structure.values;
                for (var id in data) {
                    for (var i = 0; i < values.length; i++) {
                        for (var j = 0; j < values[i].operation.length; j++) {
                            var vname = name + this.$divider + values[i].operation[j] + this.$divider + values[i].name;
                            if (!structure._header_hash[vname]) {
                                structure._header.push(vname);
                                structure._header_hash[vname] = true;
                            }
                            if (webix.isUndefined(item[vname])) {
                                item[vname] = [];
                                header[values[i].operation[j] + this.$divider + values[i].name] = {};

                            }
                            item[vname].push(data[id][values[i].name]);
                        }
                    }
                }
            }
        }
        return item;
    },

    _process_header: function(header) {
        header = this._render_header(header);
        for (var i = 0; i < header.length; i++) {
            var parts = [];
            for (var j = 0; j < header[i].length; j++)
                parts.push(header[i][j].name);

            header[i] = {id: parts.join(this.$divider), header: header[i], sort:"int", width: this.config.columnWidth};
        }
        header.splice(0, 0, {id:"name", exportAsTree:true, template:"{common.treetable()} #name#", header:{ text: webix.i18n.pivot.pivotMessage }, width: this.config.yScaleWidth});
       // alert("header")
       // debugger;
        return header;
    },

    _render_header: function(data) {
        var header = [];
        for (var i in data) {

            // is the last level?
            var empty = true;
            //noinspection JSUnusedLocalSymbols
            for (var k in data[i]) {
                empty = false;
                break;
            }

            if (!empty) {
                data[i] = this._render_header(data[i]);
                var first = false;
                for (var j = 0; j < data[i].length; j++) {
                    var h = data[i][j];
                    h.splice(0, 0, { name:i, text: i});
                    if (!first) {
                        h[0].colspan = data[i].length;
                        first = true;
                    }
                    header.push(h);
                }
            } else {
                var tmp = i.split(this.$divider);
                if (tmp.length > 1)
                    header.push([{ name:i, text: this._apply_map(tmp[1]) + " (" + this._apply_locale(tmp[0]) + ")" }]);
                else
                // there are no values in structure, only rows and columns
                    header.push([{ name:i, text: i}]);
            }
        }
        return header;
    },
    _calculate_item: function(item, structure) {
        for (var i = 0; i < structure._header.length; i++) {
            var key = structure._header[i];
            var tmp = key.split(this.$divider);

            var op = tmp[tmp.length-2];

            webix.assert(this.operations[op], webix.i18n.pivot.operationNotDefined);
            if (item[key])
                item[key] = this.operations[op].call(this, item[key]);
            else
                item[key] = '';
            item[key] = Math.round(item[key]*100000)/100000;
        }
        return item;
    },
    _minmax_in_row: function(item, structure) {
        // nothing to do
        if (!this.config.min && !this.config.max) return item;

        var values = this.config.structure.values;
        if (!item.$cellCss) item.$cellCss = {};

        // calculating for each value
        for (var i = 0; i < values.length; i++) {
            var value = values[i];

            var max=[], max_value=-99999999;
            var min=[], min_value=99999999;

            for (var j = 0; j < structure._header.length; j++) {
                var key = structure._header[j];
                if (window.isNaN(item[key])) continue;
                // it's a another value
                if (key.indexOf(value.name, this.length - value.name.length) === -1) continue;

                if (this.config.max && item[key] > max_value) {
                    max = [ key ];
                    max_value = item[key];
                } else if (item[key] == max_value) {
                    max.push(key);
                }
                if (this.config.min && item[key] < min_value) {
                    min = [ key ];
                    min_value = item[key];
                } else if (item[key] == min_value) {
                    min.push(key);
                }
            }

            for (var j = 0; j < min.length; j++) {
                item.$cellCss[min[j]] = "webix_min";
            }
            for (var j = 0; j < max.length; j++) {
                item.$cellCss[max[j]] = "webix_max";
            }
        }
        return item;
    },
    operations: {
        sum: function(args) {
            var sum = 0;
            for (var i = 0; i < args.length; i++) {
                var value = args[i];
                value = parseFloat(value, 10);
                if (!window.isNaN(value))
                    sum += args[i];
            }
            return sum;
        },
        count: function(args) {
            return args.length;
        },
        max: function(args) {
            if (args.length == 1) return args[0];
            return Math.max.apply(this, args);
        },
        min: function(args) {
            if (args.length == 1) return args[0];
            return Math.min.apply(this, args);
        }
    },

    getFields: function() {
        var fields = [];
        var fields_hash = {};
        for (var i = 0; i < Math.min(this.data.count() || 5); i++) {
            var item = this.data.getItem(this.data.getIdByIndex(i));
            for (var field in item) {
                if (!fields_hash[field]) {
                    fields.push(field);
                    fields_hash[field] = webix.uid();
                }
            }
        }

        var str = this.config.structure;
        var result = { fields:[], rows:[], columns:[], values:[], filters:[] };
        for (var i = 0; i < str.rows.length; i++) {
            var field = str.rows[i];
            if (!webix.isUndefined(fields_hash[field])) {
                result.rows.push({name: field, text: this._apply_map(field), id: fields_hash[field]});
                delete fields_hash[field];
            }
        }

        for (var i = 0; i < str.columns.length; i++) {
            var field = str.columns[i];
            if (!webix.isUndefined(fields_hash[field])) {
                result.columns.push({name: field, text: this._apply_map(field), id: fields_hash[field]});
                delete fields_hash[field];
            }
        }

        for (var i = 0; i < str.values.length; i++) {
            var field = str.values[i];
            if (!webix.isUndefined(fields_hash[field.name])) {
                var text = this._apply_map(field.name);
                result.values.push({name: field.name, text: text, operation:field.operation, id: fields_hash[field.name]});
                //delete fields_hash[field.name];   // values allows to drag a field multiple times
            }
        }

        for (var i = 0; i < (str.filters || []).length; i++) {
            var field = str.filters[i];
            if (!webix.isUndefined(fields_hash[field.name])) {
                var text = this._apply_map(field.name);
                result.filters.push({name: field.name, text: text, type:field.type, value:field.value, id: fields_hash[field]});
                delete fields_hash[field.name];
            }
        }

        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if (!webix.isUndefined(fields_hash[field]))
                result.fields.push({name:field, text: this._apply_map(field), id: fields_hash[field]});
        }
        return result;
    },
    _init_filters: function() {
        var filters = this.config.structure.filters || [];
        for (var i = 0; i < filters.length; i++) {
            var f = filters[i];
            var fvalue = (f.value || "").trim();

            if (fvalue.substr(0,1) == "=") {
                f.func = this.filters.equals;
                fvalue = fvalue.substr(1);
            } else if (fvalue.substr(0,2) == ">=") {
                f.func = this.filters.more_equals;
                fvalue = fvalue.substr(2);
            } else if (fvalue.substr(0,1) == ">") {
                f.func = this.filters.more;
                fvalue = fvalue.substr(1);
            } else if (fvalue.substr(0,2) == "<=") {
                f.func = this.filters.less_equals;
                fvalue = fvalue.substr(2);
            } else if (fvalue.substr(0,1) == "<") {
                f.func = this.filters.less;
                fvalue = fvalue.substr(1);
            } else
                f.func = this.filters.contains;

            f.fvalue = fvalue;
        }
    },

    _filter_item: function(item) {
        var filters = this.config.structure.filters || [];
        for (var i = 0; i < filters.length; i++) {
            var f = filters[i];
            if (f.fvalue == "") continue;
            if (webix.isUndefined(item[f.name])) return false;

            var value = item[f.name].toString().toLowerCase();
            var result = f.func.call(this.filters, f.fvalue, value);

            if (!result) return false;
        }
        return true;
    },
    filters: {
        _num_helper: function(fvalue, value, func) {
            fvalue = window.parseFloat(fvalue, 10);
            value = window.parseFloat(value, 10);
            // if filter value is not a number then ignore such filter
            if (window.isNaN(fvalue)) return true;
            // if row value is not a number then don't show this row
            if (window.isNaN(value)) return false;
            return func(fvalue, value);
        },
        contains: function(fvalue, value) {
            return value.indexOf(fvalue.toString().toLowerCase()) >= 0;
        },
        equals: function(fvalue, value) {
            return this._num_helper(fvalue, value, function(fvalue, value) {
                return (fvalue == value);
            });
        },
        more: function(fvalue, value) {
            return this._num_helper(fvalue, value, function(fvalue, value) {
                return (value > fvalue);
            });
        },
        more_equals: function(fvalue, value) {
            return this._num_helper(fvalue, value, function(fvalue, value) {
                return (value >= fvalue);
            });
        },
        less: function(fvalue, value) {
            return this._num_helper(fvalue, value, function(fvalue, value) {
                return (value < fvalue);
            });
        },
        less_equals: function(fvalue, value) {
            return this._num_helper(fvalue, value, function(fvalue, value) {
                return (value <= fvalue);
            });
        }
    },
    getStructure: function() {
        return this.config.structure;
    },
    getConfigWindow: function(){
        return this._config_popup;
    },
    profile_setter:function(value){
        var c = console;
        if (value){
            this.attachEvent("onBeforeLoad", function(){ c.time("data loading");  });
            this.data.attachEvent("onParse", function(){ c.timeEnd("data loading"); c.time("data parsing");  });
            this.data.attachEvent("onStoreLoad", function(){ c.timeEnd("data parsing"); c.time("data processing");  });
            this.$ready.push(function(){
                this.$$("data").attachEvent("onBeforeRender", function(){ if (this.count()) { c.timeEnd("data processing"); c.time("data rendering"); } });
                this.$$("data").attachEvent("onAfterRender", function(){ if (this.count()) webix.delay(function(){ c.timeEnd("data rendering"); });  });
            });
        }
    }
}, webix.IdSpace, webix.ui.layout, webix.DataLoader, webix.EventSystem, webix.Settings);




webix.protoUI({
    name: "webix_pivot_config",

    $init: function(config) {
        this.$view.className += " webix_popup webix_pivot";
        webix.extend(config,this.defaults);
        webix.extend(config, this._get_ui(config));
        this.$ready.push(this._after_init);
    },
    defaults:{
        padding:8,
        height: 420,
        width: 600,
        cancelButtonWidth: 100,
        applyButtonWidth: 100,
        fieldsColumnWidth: 130,
        head: false,
        modal:true,
        move: true
    },
    _get_ui: function(config) {
        return {
            head:{
                /*type: "space",
                 margin: 5,
                 padding: 5,
                 borderless: true,*/
                view:"toolbar",
                cols: [
                    { id: "config_title", data:{value: "windowMessage"}, css:"webix_pivot_transparent", borderless: true, template: this._popup_templates.popupHeaders},
                    { view: "button", id: "cancel", type: "iconButton", icon: "times", label: webix.i18n.pivot["cancel"], width: config.cancelButtonWidth },
                    { view: "button", id: "apply", type: "iconButton", icon: "check", css:"webix_pivot_apply", label: webix.i18n.pivot["apply"], width:config.applyButtonWidth }

                ]
            },
            body: {
                type: "wide",
                //  margin: 5,
                rows:[

                    {
                        type: "wide",
                        margin: 5,

                        cols: [
                            // {width:1},
                            {
                                width: config.fieldsColumnWidth,
                                rows: [
                                    { id: "fieldsHeader", data:{value: "fields"}, template: this._popup_templates.popupHeaders, type: "header" },
                                    { id: "fields", view: "list", scroll: false, type: {height: 35}, drag: true, template: "<span class='webix_pivot_list_marker'></span>#text#",
                                        on:{
                                            onBeforeDropOut: webix.bind(this._check_values_drag,this)
                                        }
                                    }
                                ]
                            },
                            { view: "resizer"},
                            { cols: [

                                { rows:[
                                    { id: "filtersHeader", data:{value: "filters"}, template: this._popup_templates.popupIconHeaders, type: "header" },
                                    { id: "filters", view: "list", scroll: false, type: "PivotList", drag: true, css: "webix_pivot_values",
                                        template: function (obj) {
                                            obj.type = obj.type || "select";
                                            return "<a class='webix_pivot_link'>" + obj.text+ " <span class='webix_link_selection'>" + obj.type + "</span></a> "
                                        },
                                        type: {
                                            height: 35
                                        },
                                        onClick: { "webix_pivot_link": webix.bind(this._filter_selector, this) }
                                    },
                                    { id: "rowsHeader", data:{value: "rows"}, template: this._popup_templates.popupIconHeaders, type: "header" },
                                    { id: "rows", view: "list", type: "PivotList", scroll: false, drag: true, template: "#text#", type: {height: 35}}
                                ]},
                                {   rows:[
                                    { id: "columnsHeader", data:{value: "columns"}, template: this._popup_templates.popupIconHeaders, type: "header" },
                                    { id: "columns", view: "list", type: "PivotList", scroll: false, drag: true, type: {height: 35}, template: "#text#" },

                                    { id: "valuesHeader", data:{value: "values"}, template: this._popup_templates.popupIconHeaders, type: "header" },
                                    { id: "values", view: "list", scroll: true, drag: true, css: "webix_pivot_values", type: { height: "auto" },
                                        template: webix.bind(this._function_template, this),
                                        onClick: {
                                            "webix_pivot_link": webix.bind(this._function_selector, this),
                                            "webix_pivot_plus": webix.bind(this._function_add, this),
                                            "webix_pivot_minus": webix.bind(this._function_remove, this)
                                        },
                                        on:{
                                            onBeforeDrop: webix.bind(this._copy_values_field,this),
                                            onBeforeDropOut: webix.bind(this._check_values_drag,this)
                                        }
                                    }
                                ]}
                            ]
                            }
                        ]
                    }
                ]

            }
        };
    },
    _popup_templates: {
        popupHeaders: function(obj){
            return webix.i18n.pivot[obj.value];
        },
        popupIconHeaders: function(obj){
            return "<span class='webix_pivot_popup_icon "+obj.value+"'></span>"+webix.i18n.pivot[obj.value];
        }
    },
    _check_values_drag: function(ctx){
        if(ctx.to != ctx.from){
            var id = ctx.source[0];

            if(ctx.from == this.$$("values")){
                if(this.$$("fields").getItem(id))
                    this.$$("fields").remove(id);
            }
            else if(ctx.from == this.$$("fields") && ctx.to != this.$$("values")){
                if(this.$$("values").getItem(id))
                    this.$$("values").remove(id);
            }


        }
    },
    _copy_values_field: function(ctx){
        if( ctx.to && ctx.from != ctx.to ){
            var id = ctx.source;
            var item = ctx.from.getItem(id);
            if(ctx.from == this.$$("fields")){
                if(ctx.to.getItem(id)){
                    this._function_add({},id);
                }
                else{
                    ctx.to.add(webix.copy(item),ctx.index);
                }
                return false
            }
            else{
                if(!this.$$("fields").getItem(id))
                    this.$$("fields").add(webix.copy(item));
            }
        }
        return true
    },
    _after_init: function() {
        this.attachEvent("onItemClick", function(id){
            if (this.$eventSource.name == "button"){
                //transform button clicks to events
                this.callEvent("on"+this.innerId(id), [this.getStructure()]);
                this.hide();
            }
        });
    },

    _function_template: function (obj) {
        obj.operation = obj.operation || ["sum"];
        if (!webix.isArray(obj.operation))
            obj.operation = [obj.operation];

        var ops = [];
        var locale = $$(this.config.pivot)._apply_locale;
        for (var i = 0; i < obj.operation.length; i++) {
            var op = "<span class='webix_pivot_link' webix_operation='" + i + "'>";
            op += "<span>" + obj.text + "</span>";
            op += "<span class='webix_link_selection'>" + locale(obj.operation[i]) + "</span>";
            op += "<span class='webix_pivot_minus webix_icon fa-times'></span>";
            op += "</span>";
            ops.push(op);
        }

        return ops.join(" ");
    },

    _function_selector: function(e,id) {
        var func_selector = {
            view: "webix_pivot_popup", autofit:true,
            height: 150, width: 150,
            data: this.config.operations||[]
        };
        var p = webix.ui(func_selector);
        p.show(e);
        p.attachEvent("onHide", webix.bind(function() {
            var index = webix.html.locate(e, "webix_operation");
            var sel = p.getSelected();
            if (sel !== null) {
                this.$$("values").getItem(id).operation[index] = sel.name;
                this.$$("values").updateItem(id);
            }

            p.close();
        }, this));
    },

    _function_add: function(e,id) {
        var item = this.$$("values").getItem(id);
        item.operation.push("sum");
        this.$$("values").updateItem(id);

        webix.delay(function(){
            var index = item.operation.length-1;
            var els = this.$$("values").getItemNode(id).childNodes;
            var el = null;
            for (var i = 0; i < els.length; i++) {
                el = els[i];
                if (!el.getAttribute) continue;
                var op = el.getAttribute("webix_operation");
                if (!webix.isUndefined(op) && op == index) break;
            }
            if (el!==null)
                this._function_selector(el, id);
        }, this)
    },
    _function_remove: function(e, id) {
        var index = webix.html.locate(e, "webix_operation");
        var item = this.$$("values").getItem(id);
        if (item.operation.length > 1) {
            item.operation.splice(index, 1);
            this.$$("values").updateItem(id);
        } else {
            this.$$("values").remove(id);
            //this.$$("values").move(id, null, this.$$("fields"));
        }
        return false;
    },

    _filter_selector: function(e,id) {
        var locale = $$(this.config.pivot)._apply_locale;
        var selector = {
            view: "webix_pivot_popup", autofit:true,
            height: 150, width: 150,
            data: [{name:"select", title: locale("select")},{name:"text", title: locale("text")}]
        };
        var p = webix.ui(selector);
        p.show(e);
        p.attachEvent("onHide", webix.bind(function() {
            var sel = p.getSelected();
            if (sel !== null) {
                var item = this.$$('filters').getItem(id);
                item.type = sel.name;
                this.$$('filters').updateItem(id);
            }

            p.close();
        }, this));
    },

    data_setter: function(value) {
        this.$$("fields").clearAll();
        this.$$("fields").parse(value.fields);

        this.$$("filters").clearAll();
        this.$$("filters").parse(value.filters);

        this.$$("columns").clearAll();
        this.$$("columns").parse(value.columns);

        this.$$("rows").clearAll();
        this.$$("rows").parse(value.rows);

        this.$$("values").clearAll();
        this.$$("values").parse(value.values);
    },
    setStructure: function(config){
        this.define("structure", config);
        this.render();
    },
    getStructure: function() {
        var structure = { rows:[], columns:[],values:[],filters:[] };

        var rows = this.$$("rows");
        rows.data.each(function(obj){
            structure.rows.push(obj.name); })

        var columns = this.$$("columns");
        columns.data.each(function(obj){
            structure.columns.push(obj.name); })


        var values = this.$$("values");
        values.data.each(function(obj){
            structure.values.push(obj); })

        var filters = this.$$("filters");
        filters.data.each(function(obj){
            structure.filters.push(obj); })

        return structure;
    }
}, webix.ui.window, webix.IdSpace);


webix.protoUI({
    name:"webix_pivot_popup",
    _selected: null,
    $init: function(config) {
        webix.extend(config, this._get_ui(config));
        this.$ready.push(this._after_init);
    },
    _get_ui: function(config) {
        return {
            body: {
                id:"list", view:"list", scroll:false, autoheight:true, template:"#title#", data: config.data
            }
        }
    },
    _after_init: function() {
        this.attachEvent("onItemClick", function(id){
            this._selected = this.$eventSource.getItem(id);
            this.hide();
        });
    },
    getSelected: function() {
        return this._selected;
    }
}, webix.ui.popup, webix.IdSpace);

