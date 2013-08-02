$(function() {
    $('frameset').attr('rows', '*,34,0');
    var mainFrame;
    var mainFrameBody;
    var footerFrame = $('frame')[1].contentDocument;
    var footerFrameBody = footerFrame.body;
    var pageIndex = 1;

    //初始化footer窗口样式
    var footerCss = '.h-bet-plugin-container{\
                    position: fixed;\
                    right: 10px;\
                    bottom: 0;\
                }\
                .h-bet-button-radius {\
                    -webkit-border-radius: 5px;\
                    -moz-border-radius: 5px;\
                    border-radius: 5px;\
                    -webkit-box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);\
                    -moz-box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);\
                    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);\
                    padding: 5px 10px;\
                    cursor: pointer;\
                }';
    var style = footerFrame.createElement('style');
    style.appendChild(footerFrame.createTextNode(footerCss));
    footerFrame.head.appendChild(style);

    $('<div class="h-bet-plugin-container"><button id="hBetFastTransaction" class="h-bet-button-radius">快捷交易</button></div>').appendTo(footerFrameBody);
    //这里需要设置上下文
    $('#hBetFastTransaction', footerFrameBody).click(function() {
        //mainFrame = document.getElementsByTagName('frameset')[0].children[0].contentDocument.getElementsByTagName('frameset')[0].children[1].children[1].contentDocument;
        mainFrame = document.body.children[0].contentDocument.body.children[1].children[1].contentDocument.body.children[1].contentDocument;
        mainFrameBody = mainFrame.body;
        var styleEl = $('#hBetFastTransactionStyle', mainFrame.head);
        if (styleEl.length == 0) {
            var mainCss = '.h-bet-plugin-dialog {\n\
                                width: 300px;\n\
                                border: 1px solid #BBBBBB;\n\
                                margin: 5px;\n\
                                box-shadow:0 2px 4px rgba(0, 0, 0, 0.4);\n\
                                -moz-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);\n\
                                -webkit-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);\n\
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);\n\
                                position:fixed;\n\
                                bottom: 0px;\n\
                                right: 0px;\n\
                            }\n\
                            .h-bet-plugin-dialog-header {\n\
                                background:#DDDDDD;\n\
                                border-radius: 0 0 0 0;\n\
                                height: 24px;\n\
                                line-height: 24px;\n\
                                padding: 5px 10px;\n\
                                font-size: 14px;\n\
                                color: #333333;\n\
                                font-weight: bold;\n\
                            }\n\
                            .h-bet-plugin-dialog-content{\n\
                               padding:20px 10px;\n\
                            }\n\
                            .h-bet-plugin-dialog-buttons{\n\
                                border-top: 1px solid #AAAAAA;\n\
                                margin: 0 5px;\n\
                                padding:10px;\n\
                                text-align: right;\n\
                            }\n\
                            .h-bet-button-radius {\
                                -webkit-border-radius: 5px;\
                                -moz-border-radius: 5px;\
                                border-radius: 5px;\
                                -webkit-box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);\
                                -moz-box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);\
                                box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);\
                                padding: 3px 10px;\
                                cursor: pointer;\
                            }';
            var mainStyle = mainFrame.createElement('style');
            mainStyle.id = 'hBetFastTransactionStyle';
            mainStyle.appendChild(mainFrame.createTextNode(mainCss));
            mainFrame.head.appendChild(mainStyle);
        }

        var dialogEl = $('#hBetFastTransactionDialog', mainFrameBody);
        if (dialogEl.length == 0) {
            var html = '<div id="hBetFastTransactionDialog" class="h-bet-plugin-dialog">\n\
                            <div class="h-bet-plugin-dialog-header">\n\
                              <span class"h-bet-plugin-dialog-title" style="float:left;">球队信息确认单</span>\n\
                              <span class"h-bet-plugin-dialog-close" style="float:right;cursor:pointer;" id="hBetFastClose">X</span>\n\
                            </div>\n\
                            <div class="h-bet-plugin-dialog-content">\n\
                               <label>球队信息： <input type="text" name="hBetTeamInfo" id="hBetTeamInfo" /></label>\n\
                            </div>\n\
                            <div class="h-bet-plugin-dialog-buttons">\n\
                                <button class="h-bet-button-radius" id="hBetFastBtnSubmit">确定</button>\n\
                                <button class="h-bet-button-radius" id="hBetFastBtnClose">关闭</button>\n\
                            </div>\n\
                        </div>';
            dialogEl = $(html).appendTo(mainFrameBody);
            $('#hBetFastClose,#hBetFastBtnClose', mainFrameBody).click(function(){
                $('#hBetFastTransactionDialog',mainFrameBody).hide();
            });
            $('#hBetFastBtnSubmit', mainFrameBody).click(function(){
                pageIndex = 1;
                var find = findByRules();
                if (!find) {
                    var pageSelect = $('#pg_txt select', mainFrameBody);
                    var options = pageSelect.children();
                    if (options.length > 1) {
                        onChangePage(1);
                    }
                }
            });
        }
        dialogEl.show();
    });
    
    //翻页函数
    function onChangePage(index){
        //页码
        var pageSelect = $('#pg_txt select',mainFrameBody);
        var pageSize = pageSelect.children().length;
        if(pageIndex > pageSize - 1){
            return;
        }
        pageSelect[0].value = index;
        pageSelect.change();
        pageIndex++;
        $(function(){
            var find = findByRules();
            if(!find){
                onChangePage(pageIndex);
            }
        });
    }
    
    //查询页面中的内容
    function findByRules(){
        var hBetTeamInfo = $('#hBetTeamInfo', mainFrameBody).val();
        var instructions = hBetTeamInfo.split('_');
        var games = $('#game_table tr td[colspan="9"]',mainFrameBody);
        var find = false;
        games.each(function(index,element){
            var team = $(element).find('table td:eq(1)').text();
            if($.trim(team) == $.trim(instructions[0])){
                find = true;
                return false;
            }
        });
        
        return find;
    }
});