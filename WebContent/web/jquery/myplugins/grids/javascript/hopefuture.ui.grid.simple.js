/*!
 * Hopefuture UI Selector 1.0.0
 * http://linder0209.iteye.com/
 
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function($, undefined) {

    var re = /\$\{([\w-]+)\}/g;
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
    
    function initTemplate(baseCls){
        baseCls = baseCls || 'h-ui-grid';
        var gridContainer = '<div class="' + baseCls + '-wrapper"> \n\
            <table cellspacing="0" cellpadding="0" class="' + baseCls + '"> \n\
                <thead> \n\
                    <tr> \n\
                       ${titles} \n\
                    </tr> \n\
                </thead> \n\
                <tbody>${rows}</tbody> \n\
            </table> \n\
         </div>';
        var gridTitle = '<th>${title}</th>';
        var gridColumn = '<td>${content}</td>';
        var girdRow = '<tr>${row}</tr>';
        var gridPager = '<ul class="' + baseCls + '-pager"><li class="gridPager-left">&nbsp;</li>\n\
            <li class="gridPager-center">\n\
                <span class="ui-icon ui-icon-seek-first"></span>\n\
                <span class="ui-icon ui-icon-seek-prev"></span>Page \n\
                <input class="' + baseCls + '-inputPage" type="text" value="0" maxlength="7" size="2">\n\
                of <span class="' + baseCls + '-page-number"></span>\n\
                <span class="ui-icon ui-icon-seek-next"></span>\n\
                <span class="ui-icon ui-icon-seek-end"></span>\n\
                <select class="' + baseCls + '-selectPage">${options}</select>\n\
            </li>\n\
            <li class="gridPager-right"><div></div></li></ul>';
        return {
           gridContainer :  gridContainer,
           gridTitle : gridTitle,
           gridColumn : gridColumn,
           girdRow : girdRow,
           gridPager : gridPager
        };
    }
    
    $.widget("ui.hopegrid", {
        version: "1.0.0",
        options: {
            baseCls : 'h-ui-grid',
            url: undefined,
            data: undefined,
            pager: true,
            colNames: [],
            colModel: [],
            page: 1,
            postData: {},
            rowNum: 25,
            rowList: [10,25,50,100,200],
            jsonReader: {
                root: 'data',
                page: 'currentPageNo',
                total: 'totalPageCount',
                records: 'totalCount',
                repeatitems: false
            }
        },
        
        _create: function() {
            var options = this.options,
                me = this;
            if( options.colNames.length !== options.colModel.length ) {
                alert('Length of colNames <> colModel!');
                return;
            }
            if(options.url){
                 var postData = this._initPostData();
                 $.ajax({
                    url : options.url,
                    data : postData,
                    success : function(data){
                        me._loadGrid(data);
                    }
                });
            }else if (options.data){
                var start = options.data.start,
                    end = (start + 1) * options.data.pageSize;
                options.data.data = options.data.data.slice(start,end);
                this._loadGrid(options.data);
            }
        },
        
        _initPostData: function(){
            var options = this.options,
                page = options.page,
                size = options.size;
            if(page <= 0) {
                page = 1; 
            }
            return {
                page : page,
                size : size
            };
        },
                
        _loadGrid : function(data){
            var options = this.options,
                rows = data[options.jsonReader.root],
                template = $.hopegrid.initTemplate(options.baseCls),
                titleHtml = '',
                rowHtml = '',
                rowsHtml = '',
                html = '',
                row,element;
        
            for(var i = 0, len = options.colNames.length; i < len; i++){
                titleHtml += applyTemplate(template.gridTitle, {title: options.colNames[i]});
            }
            for(var i = 0, len = rows.length; i < len; i++){
                row = rows[i];
                rowHtml = '';
                for(var j = 0, len2 = options.colModel.length; j < len2; j++){
                    element = options.colModel[j];
                    var formatter = element.formatter;
                    var content = row[element.index];
                    if(formatter && typeof formatter === 'function'){
                        content = formatter.call(null, content);
                    }
                    rowHtml += applyTemplate(template.gridColumn, {content: content});
                }
                rowsHtml += applyTemplate(template.girdRow, {row: rowHtml});
            }
            
            html = applyTemplate(template.gridContainer, {
                titles : titleHtml,
                rows : rowsHtml
            });
            
            if(options.pager === true){
                var selectOptions =  $(options.rowList).map(function(index, element){
                    return '<option value="' + element + '">' + element + '</option>';
                }).get().join('');
                var pagerHtml = applyTemplate(template.gridPager, {
                    options : selectOptions
                });
                html += pagerHtml;
            }
            this.element.html(html);
            this._loadPager(data);
            this.pagerElement = this.element.find('.' + options.baseCls + '-pager');
            this._initEvent();
        },
        
        _initEvent : function(){
            var options = this.options,
                baseCls = options.baseCls,
                events = {};
            events['change select.' + options.baseCls + '-selectPage'] = function(event) {
                 this._onChangePageSize($(event.target).val());
            };
            events['keydown input.' + options.baseCls + '-inputPage'] = function(event) {
                 if(event.keyCode === 13){
                     this._onGotoPage($(event.target).val());
                 }
            };
            this._on(this.pagerElement, events);
        },
                
        //load the pager html
        _loadPager : function(pagerData){
            var totalCount = pagerData.totalCount,
                totalPageCount = pagerData.totalPageCount,
                currentPageNo = pagerData.totalPageCount,
                pageSize = pagerData.pageSize;
          
            if(currentPageNo != 1){
                this.element.find('.ui-icon-seek-first').show();
                
            }
            this.element.find('.ui-icon-seek-first')[currentPageNo == 1 ? 'hide':'show']();
            this.element.find('.ui-icon-seek-prev')[currentPageNo == 1 ? 'hide':'show']();
            
            this.element.find('.ui-icon-seek-next')[currentPageNo == totalPageCount ? 'hide':'show']();
            this.element.find('.ui-icon-seek-end')[currentPageNo == totalPageCount ? 'hide':'show']();
            this.element.find('input').val(currentPageNo);
            this.element.find('.' + this.options.baseCls + '-page-number').text(totalPageCount);
            this.element.find('select').val(pageSize);
            
            var startRecord = (currentPageNo - 1) * pageSize + 1;
            var endRecord = currentPageNo * pageSize;
            endRecord = endRecord > totalCount ? totalCount : endRecord;
            var pagingInfo = 'View ' + startRecord + ' - ' + endRecord + 'of '+ totalCount;
            this.element.find('.gridPager-right div').text(pagingInfo);
        },
        
        _onGotoPage : function(pageNum){
            if(this.options.url){
                $.ajax({
                    url : options.url,
                    data : postData,
                    success : function(data){
                        me._loadGrid(data);
                    }
                });
            }
            this._loadPager()
        },
        
        _onChangePageSize : function(pageSize){
            
        }
    });
    
    $.hopegrid = function(){
        
    };
    
    $.hopegrid.initTemplate = function(baseCls){
        return initTemplate(baseCls);
    };
    
}(jQuery));
