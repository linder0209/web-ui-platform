$(function() {
    //Edit
    $('#grid_demo').on('click', 'a[name="operte_edit"]', function(e) {
        e.preventDefault();
        
        var el = $(this),
            rowEl = el.closest('tr'),
            delegateEl = $(e.delegateTarget),//委托的元素，本例中即 #grid_demo
            list = delegateEl.find('tr');
        for (var i = 0, len = list.length; i < len; i++) {//判断是否有打开的编辑
            if ($(list[i]).data('editable') === false) {
                return;
            }
        }
        var textEl = rowEl.find('[name="input_label"]'),
            cancelEl = rowEl.find('a[name="operte_cancel"]'),
            saveEl = rowEl.find('a[name="operte_save"]'),
            inputEl = rowEl.find('input[name="column"]');

        el.hide();
        inputEl.val(textEl.text()).show();
        cancelEl.show();
        saveEl.show();
        textEl.hide();
        rowEl.data('editable', false);
    });
    
    //Cancel
    $('#grid_demo').on('click', 'a[name="operte_cancel"]', function(e) {
        e.preventDefault();
        
        var el = $(this),
            rowEl = el.closest('tr'),
            textEl = rowEl.find('[name="input_label"]'),
            editEl = rowEl.find('a[name="operte_edit"]'),
            saveEl = rowEl.find('a[name="operte_save"]'),
            inputEl = rowEl.find('input[name="column"]');
            
        el.hide();
        inputEl.hide();
        editEl.show();
        saveEl.hide();
        textEl.show();
        rowEl.removeData('editable');
    });

    //Save
    $('#grid_demo').on('click', 'a[name="operte_save"]', function(e) {
        e.preventDefault();
        var el = $(this),
            rowEl = el.closest('tr'),
            textEl = rowEl.find('[name="input_label"]'),
            editEl = rowEl.find('a[name="operte_edit"]'),
            cancelEl = rowEl.find('a[name="operte_cancel"]'),
            inputEl = rowEl.find('input[name="column"]'),
            recordId = inputEl.attr("recordId");
            
        $.ajax({
            url : '',
            data: {
              id:  recordId 
            },
            success: function(data){
                el.hide();
                inputEl.hide();
                editEl.show();
                cancelEl.hide();
                textEl.text(inputEl.val()).show();
                rowEl.removeData('editable');
            }
        });
    });

    //Delete
    $('#grid_demo').on('click', 'a[name="operte_delete"]', function(e) {
        e.preventDefault();
        var el = $(e.target),
            rowEl = el.closest('tr'),
            inputEl = rowEl.find('input[name="column"]'),
            recordId = inputEl.attr("recordId");
        
        $.ajax({
            url : '',
            data: {
              id:  recordId 
            },
            success: function(data){
                rowEl.remove();
            }
        });
    });
});