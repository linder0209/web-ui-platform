$(function(){
    $('frameset').attr('rows','*,100');
    var html1 = '<!DOCTYPE html>\n\
            <html>\n\
            <head>\n\
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n\
                <title>mainBody</title>\n\
            </head>\n\
            <link rel="stylesheet" href="../../../../platform/javascript/jquery-ui/css/jquery-ui.css" type="text/css"/>\n\
            <body>\n\
            主窗体\n\
            </body>\n\
        </html>';
    var html2 = '<!DOCTYPE html>\n\
            <html>\n\
            <head>\n\
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />\n\
                <title></title>\n\
            </head>\n\
            <body>\n\
            </body>\n\
        </html>';
    $($('frame')[0]).html(html1);
    $($('frame')[1]).html(html2);
    
    var bodyFrame = $('frame')[0].contentDocument.body;
    $('<button id="btn1" onclick="console.info(11);">fgfdgdfg</button>').appendTo(bodyFrame);
    var footerFrame = $('frame')[1].contentDocument.body;
    $('<div class="h-bet-plugin-container"><button id="hBetFastTransaction" class="h-bet-button-radius">快捷交易</button></div>').appendTo(footerFrame);
    $('#hBetFastTransaction',footerFrame).click(function(){
        var dialogEl = $('#hBetFastTransactionDialog',bodyFrame);
        if(dialogEl.length == 0){
            var html = '<div id="hBetFastTransactionDialog"></div>';
            dialogEl = $(html).appendTo(bodyFrame);
            dialogEl.dialog({
                title: '球队信息确认单',
                autoOpen: false,
                modal: true,
                resizable: false,
                buttons: {
                    Ok: {
                        click: function() {
                            $('#btn1',bodyFrame).click();
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