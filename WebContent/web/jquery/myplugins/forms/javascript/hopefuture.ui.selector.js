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
                leaf: true,//如果children有值，则leaf默认为false
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
            var me = this;

            if (element[0].tagName.toLowerCase() === 'select') {
                element.find('optgroup, option').each(function() {
                    if ($(this).is('optgroup')) {
                        var optgroup = $(this),
                             text = optgroup.attr('label'),
                             value = optgroup.attr('value');
                        me.lastOptgroup = me._addItemCt(value,text);
                    } else {
                        var value = $(this).val(),
                            text = $(this).text();
                        me._addItem(value, text, me.lastOptgroup);
                    }
                });
            }else {//可利用传入的数据来设置
                var data = this.options.data;
                data = [{
                        id: '1',
                        text: 'item1',
                        value: '1',
                        children: [{
                                id: '11',
                                text: 'item11',
                                value: '11',
                                leaf: true
                            },{
                                id: '12',
                                text: 'item12',
                                value: '12',
                                leaf: true
                            }]
                    },{
                        id: '2',
                        text: 'item1',
                        value: '2',
                        children: [{
                                id: '21',
                                text: 'item21',
                                value: '21',
                                leaf: true
                            },{
                                id: '22',
                                text: 'item22',
                                value: '22',
                                leaf: true
                            }]
                    }];
                if(data){
                    
                }
            }
            
            var events = {};
            events['click button.' + this.selectorCls.removeCls] = function(event) {
                 this._remove(event);
                 return false;
            };
            events['mouseenter .' + this.selectorCls.selectableCls] = function(event) {
                 var target = $(event.currentTarget);
                 target.addClass('ui-state-focus');
            };
            events['mouseleave .' + this.selectorCls.selectableCls] = function(event) {
                 var target = $(event.currentTarget);
                 target.removeClass('ui-state-focus');
            };
            
            events['click .' + this.selectorCls.selectableCls] = function(event) {
                 var target = $(event.currentTarget);
                 //target.toggleClass('ui-state-active');
            };
            this._on(this.uiSelector, events);
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
        },
        _destroy: function() {
            this.element.removeClass('ui-helper-hidden');
            this.uiSelectorCt.stop( true, true ).remove();
        },
        _keydown: function(event) {

        },
        _remove: function(event) {
            $(event.target).closest('li.' + this.selectorCls.liCls).remove();
            var ui = $(event.target).closest('.' + this.selectorCls.selectorUl);
            this._trigger('remove', event, ui);
        },
        /**
         * add item
         * @returns {}
         */
        _addItem: function(value, text, ct) {
            var mutable = this.options.mutable,
                    liData = {
                text: text,
                removeBtn: mutable ? '<button class="' + this.selectorCls.removeCls + '">' + this.options.removeText + '</button>' : ''
            };
            if(!ct){
                ct = this.uiSelector;
            }
            var liEl = $(this.selectorLi).appendTo(ct).addClass(this.selectorCls.selectableCls + ' ui-corner-all');
            $(applyTemplate(this.selectorContent, liData)).appendTo(liEl).data('selector-value', value);
        },
        
        _addItemCt: function(value,text, ct){
            if(!ct){
                ct = this.uiSelector;
            }
            var liEl = $(this.selectorLi).appendTo(ct).addClass(this.selectorCls.labelCls + ' ui-corner-all');
            $(applyTemplate(this.selectorContent, {text: text})).appendTo(liEl).data('selector-value', value);
            
            liEl = $(this.selectorLi).appendTo(ct);
            var ulEl = $(this.selectorUl).appendTo(liEl);
            return ulEl;
        },
                
        add: function(value, text) {
            this._addItem(value, text);
            this._trigger('remove', this.uiSelector);
        },
        select: function(event) {

        }

    });

}(jQuery));
