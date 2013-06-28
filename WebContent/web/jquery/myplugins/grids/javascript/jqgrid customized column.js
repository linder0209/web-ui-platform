$(function() {
    var url = $('#jqgrid_json').attr('href');
    jQuery("#jqgridList").jqGrid({
        url: url, 
        datatype: "json", 
        height: 'auto',
        loadtext: 'Loading',
        autowidth: true,
        colNames: ['Inv No', 'Date', 'Client', 'Amount', 'Tax', 'Total', 'Notes'], 
        colModel: [
            {name: 'id', index: 'id', width: 55},
            {name: 'invdate', index: 'invdate', width: 90},
            {name: 'name', index: 'name asc, invdate', width: 100},
            {name: 'amount', index: 'amount', width: 80, align: "right"},
            {name: 'tax', index: 'tax', width: 80, align: "right"},
            {name: 'total', index: 'total', width: 80, align: "right"},
            {name: 'note', index: 'note', width: 150, sortable: false}
        ], 
        rowNum: 10, 
        rowList: [10, 20, 30], 
        pager: '#jqgridPager', 
        sortname: 'id', 
        viewrecords: true, 
        sortorder: "desc",
        gridComplete: function(){
            var headers = $("#jqgridList")[0].grid.headers;
            var setColumnsDiv = $('#setColumnsDiv');
            if(setColumnsDiv.length == 0){
                setColumnsDiv = $('<div id="setColumnsDiv" class="customized-columns">&nbsp;</div>').appendTo(document.body).click(function(){
                    var options = {
                        caption: "Show/Hide Columns",
                        bSubmit: "Submit",
                        bCancel: "Cancel",
                        width: 300,
                        closeAfterSubmit: true,
                        //jqModal: true,
                        modal:true
                    };
                    jQuery("#jqgridList").setColumns(options);
                });
            }
            $(headers).each(function(){
                $(this.el).mouseover(function(){
                    $('#setColumnsDiv').data('attach',this);
                    var me = this;
                    var height = $(this).outerHeight();
                    $('#setColumnsDiv').height(height).show().position({
                        my: 'right top',
                        at: 'right top',
                        of : me
                    });
                }).mouseout(function(){
                    $('#setColumnsDiv').hide();
                });
            });
            
        }
    });
    
    $('#showHideColumns').click(function() {
        var options = {
            caption: "Show/Hide Columns",
            bSubmit: "Submit",
            bCancel: "Cancel",
            width: 300,
            closeAfterSubmit: true,
            //jqModal: true,
            modal:true
        };
        jQuery("#jqgridList").setColumns(options);
    });
});