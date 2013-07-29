$(function(){
    $('frameset').attr('rows','*,30,0');
    var html = '<!DOCTYPE html>\n\
            <html>\n\
            <head>\n\
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n\
                <title></title>\n\
            </head>\n\
            <body>\n\
            </body>\n\
        </html>';
    $($('frame')[0]).html(html);
    var parentContainer = $('frame')[1].contentDocument.body;
    $('<div class="h-bet-plugin-container"><button id="hBetFastTransaction" class="h-bet-button-radius">快捷交易</button></div>').appendTo(parentContainer);
    $('#hBetFastTransaction').click(function(){
        var dialogEl = $('#hBetFastTransactionDialog');
        if(dialogEl.length == 0){
            var html = '<div id="hBetFastTransactionDialog"></div>';
            dialogEl = $(html).appendTo(parentContainer);
            dialogEl.dialog({
                title: '球队信息确认单',
                autoOpen: false,
                modal: true,
                resizable: false,
                buttons: {
                    Ok: {
                        click: function() {
                           $(this).dialog('close');
                        },
                        text: '确定'
                    },
                    Cancel: {
                        click: function() {
                            $(this).dialog('close');
                        },
                        text: '关闭'
                    }
                }
            });
        }
        dialogEl.dialog('open');
    });
});