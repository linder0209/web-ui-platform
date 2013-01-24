/*!
 * Hopefuture UI Selector 1.0.0
 * http://linder0209.iteye.com/
 
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function($, undefined) {

    var re = /\{([\w-]+)\}/g;
    function applyTemplate(template, values) {
        if (arguments.length > 2) {
            var args = Array.prototype.slice.call(arguments, 2);
            $(args).each(function(index, element) {
                $.extend(values, element);
            });
        }
        return template.replace(re, function(m, name) {
            return values[name] !== undefined ? values[name] : "";
        });
    }

    $.widget("ui.hopeselector", {
        version: "1.0.0",
        options: {
            baseCls: 'h-ui-selector',
            cls: '', //自定义class
            style: '', //自定义style
            mutable: true, //记录可变的
            multiple: true,
            buttonIcon: '', //button 图标
            removeText: '',
            width: 200,
            height: 'auto',
            /**
             * 格式为
             [{
                id : '',
                parentId: '',
                text: '',
                value:'',
                leaf: true,//如果children有值，但leng属性不大于0 则leaf默认为true，即没有子元素就认为是叶子节点，符合客观规律
                children:[]
              }]
             */
            data : null,
            
            //event
            add: null,
            remove: null,
            select: null
        },
        
        _create: function() {
            this._createElements();
            var element = this.element.addClass('ui-helper-hidden');

            this.uiSelectorCt = $(this.container).width(this.options.width).height(this.options.height)
            .addClass('ui-widget ui-widget-content ui-corner-all');
            this.uiSelector = $(this.selectorUl).appendTo(this.uiSelectorCt);
            this.element.after(this.uiSelectorCt);
            
            if(this.options.multiple === false){
                this._setSingle();
                this.options.mutable = false;
            }
            
            var data, me = this;
            if (element[0].tagName.toLowerCase() === 'select') {
                data = this._selectElToData(element);
                this._createItem(data, 0);
            }else {//可利用传入的数据来设置
                data = this.options.data;
                if(data){
                    this._createItem(data, 0);
                }else if (this.options.url){
                    $.ajax(this.options.url,{
                        success : function(resData){
                            if(resData){
                                me._createItem(data, 0);
                            }
                        }
                    });
                }
            }
            
            var events = {};
            events['click button.' + this.selectorCls.removeCls] = function(event) {
                 this._remove(event);
                 return false;
            };
            events['mouseenter .' + this.selectorCls.contentCls] = function(event) {
                 var target = $(event.currentTarget);
                 target.parent().addClass('ui-state-focus');
            };
            events['mouseleave .' + this.selectorCls.contentCls] = function(event) {
                 var target = $(event.currentTarget);
                 target.parent().removeClass('ui-state-focus');
            };
            
            events['click .' + this.selectorCls.contentCls] = function(event) {
                 var target = $(event.currentTarget);
                 //target.toggleClass('ui-state-active');
            };
            this._on(this.uiSelector, events);
        },
        
        _setSingle : function(){
            this.uiSelectorCt.css('min-height','0');
            this.uiSelector.hide();
            var single = $('<div class="' + this.options.baseCls + '-single" > \n\
                <span></span><span class="' + this.options.baseCls + '-icon ui-icon ui-icon-carat-1-s"></span> </div>').prependTo(this.uiSelectorCt);
            
            var events = {};
            events['click .' + this.options.baseCls + '-single'] = function(){
                this.uiSelector.show();
                single.addClass('ui-widget-content ui-corner-top');
            };
            events['click .' + this.selectorCls.contentCls] = function(event) {
                 var target = $(event.currentTarget),
                     text = target.children('span').text();
                 single.removeClass('ui-widget-content ui-corner-top').children().eq(0).text(text);
                 this.uiSelector.hide();
                     
            };
            this._on(this.uiSelectorCt, events);
            
            this._on(this.document, {
                click: function(event) {
                    if (!$(event.target).closest(".h-ui-selector").length) {
                        this.uiSelector.hide();
                        single.removeClass('ui-widget-content ui-corner-top');
                    }
                }
            });
        },
                
        _selectElToData : function(element){
            var data = [],subData,children;
            element.find('optgroup, option').each(function() {
                var item = $(this);
                if (item.is('optgroup')) {
                    children = [];
                    subData = {
                        id : item.attr('id') || item.attr('value'),
                        value : item.attr('value'),
                        text : item.attr('label'),
                        leaf : false,
                        children : children
                    };
                    data.push(subData);
                }else{
                    subData = {
                        id : item.attr('id') || item.val(),
                        value : item.val(),
                        text : item.text(),
                        leaf : true
                    };
                    if(children){
                        children.push(subData);
                    }else{
                        data.push(subData);
                    }
                }
            });
            return data;
        },
                
        _createElements: function() {
            var options = this.options;
            var cls = {
                containerCls: options.baseCls,
                ulCls: options.baseCls + '-ul',
                liCls: options.baseCls + '-li',
                contentCls : options.baseCls + '-content',
                removeCls: options.baseCls + '-removeBtn',
                selectableCls: options.baseCls + '-selectable',
                labelCls: options.baseCls + '-label'
            };

            this.selectorCls = cls;
            this.container = '<div class="' + cls.containerCls + '" />';
            this.selectorUl = '<ul class="' + cls.ulCls + '"></ul>';
            this.selectorLi = '<li class="' + cls.liCls + '" />';
            this.selectorContent = '<div class="' + cls.contentCls + '"><span>{text}</span>{removeBtn}</div>';
            this.header = '<header class="' + cls.labelCls + '" />';
        },
        _destroy: function() {
            this.element.removeClass('ui-helper-hidden');
            this.uiSelectorCt.stop( true, true ).remove();
        },
        _keydown: function(event) {

        },
        _remove: function(event) {
            var target = $(event.target),
                targetLi = target.closest('li.' + this.selectorCls.liCls),
                level = targetLi.attr('level'),
                selectorData = targetLi.data('selector-data'),
                ui = $(event.target).closest('.' + this.selectorCls.ulCls);
            targetLi.remove();
            if(ui.children('li').length === 0){
                ui.parent().remove();
            }
            this._trigger('remove', selectorData,level);
        },
        
        _addItem: function(config) {
            var mutable = this.options.mutable,
                liEl;
            
            var id = config.id,
                value = config.value,
                text = config.text,
                leaf = config.leaf,
                level = config.level,
                insert = config.insert,
                ct = config.ct || this.uiSelector;
        
            liEl = $(this.selectorLi)[insert == 1 ? 'insertAfter' : 'appendTo'](ct).addClass(this.selectorCls.selectableCls + ' ui-corner-all').attr('level', level).attr('id', id)
                    .data('selector-data', {id: id, value: value, text: text});
            if (leaf) {
                liData = {
                    text: text,
                    removeBtn: mutable ? '<button class="' + this.selectorCls.removeCls + '">' + this.options.removeText + '</button>' : ''
                };
                liEl.addClass('selector-data');
                $(applyTemplate(this.selectorContent, liData)).appendTo(liEl);
            }else{//如果不是叶子节点，需要添加父元素
                $(this.header).appendTo(liEl).text(text);
                var ulEl = $(this.selectorUl).appendTo(liEl);
                return ulEl;
            }
        },
        
        /**
         * 通过传入的数据动态生成selector tree元素
         * @param {Array} data 数据
         * @param {Number} level 层次
         * @param {jQuery} ct 容器
         * @returns {}
         */
        _createItem: function(data, level, ct){
            if(!data){
                return;
            }
            if(!$.isArray(data)){
                data = [data];
            }
            var leaf, cloneData;
            for(var i = 0 ,len = data.length; i<len; i++){
                leaf = (data[i].children && data[i].children.length  > 0) ? false : true;
                cloneData = $.extend({}, data[i], {ct: ct, level : level,leaf : leaf});
                var ulEl = this._addItem(cloneData);
                if(leaf === false && ulEl){
                     this._createItem(data[i].children, level + 1, ulEl);
                }
            }
        },
        
        _insertItem: function(data, level, sibling){
            if(!data){
                return;
            }
            if(!$.isArray(data)){
                data = [data];
            }
            var leaf, cloneData,
                len = data.length;
            for(var i = len - 1; i >= 0; i--){
                leaf = (data[i].children && data[i].children.length  > 0) ? false : true;
                cloneData = $.extend({}, data[i], {ct: sibling, level : level,leaf : leaf,insert:1});
                var ulEl = this._addItem(cloneData);
                if(leaf === false && ulEl){
                     this._createItem(data[i].children, level + 1, ulEl);
                }
            }
        },
                
        add: function(data, clear) {
            if(clear === true){
                this.clear();
            }
            this._createItem(data, 0);
        },
         
        insert: function(data, position) {
            if (typeof position == 'string') {
                position = $('#' + position);
            } else {
                position = $(position);
            }
            if(position.length != 0){
                this._insertItem(data, position.attr('level'), position);
            }
        },
                
        /**
         * 清空所有数据
         * @returns {}
         */
        clear : function(){
            this.uiSelector.empty();
        },
                
        select: function(event) {

        },
                
        getData : function(selected){
            var data = [], s = 'li.selector-data';
            if(selected){
               s += ' ui-state-active'; 
            }
            this.uiSelector.find(s).each(function(){
                var selectorData = $(this).data('selector-data');
                data.push(selectorData);
            });
            return data;
        }

    });

}(jQuery));
