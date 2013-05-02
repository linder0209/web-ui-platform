(function($, undefined) {
    //ie8（包括ie8）以下版本不支持数组方法 indexOf
    if(!Array.prototype.indexOf){
        Array.prototype.indexOf = function(item){
            var me = this;
            if(me.length === 0){
                return -1;
            }
            for (var i = 0, len = me.length; i < len; i++) {
                if(item === me[i]){
                    return i;
                }
            }
            return -1;
        };
    }
    var element = $.hopefuture.platform.Element;
    var pub = {
        module: '', //第一级模块名
        context: 'web/',
        currentModules: '', //记录当前所有模块上下文

        /**
         * 初始化模板内容，主要是主页面显示区域<div id="webUiBody">中的内容
         * @returns {undefined}
         */
        initElement: function() {
            var webUiBodyTmpl = '<div class="h-body h-clearfix"> \n\
                    <div id="p2Menu" class="h-body-sidebar"> \n\
                        <!-- 动态加载菜单项 --> \n\
                    </div> \n\
                    <div class="h-body-container"> \n\
                        <div id="panel" class="h-body-panel"> \n\
                            <div>  \n\
                                <a id="body_description" class="h-body-content-title" href="#"><i></i>Description</a> \n\
                                <div class="h-block-radius h-padding10 h-margin10-T" style="display: none;"> \n\
                                    这里的内容为个模块的简要介绍 \n\
                                </div> \n\
                            </div> \n\
                            <div class="h-body-content h-clearfix"> \n\
                                <div class="h-body-content-menu" id="body_content_menu"> </div> \n\
                                <div class="h-body-content-ct" id="body_content_ct"> \n\
                                    <div class="h-clearfix"> \n\
                                        <span class="h-body-content-zoom h-float-r" id="body_content_zoom"></span> \n\
                                        <h5 class="h-body-content-title">Examples</h5> \n\
                                    </div> \n\
                                    <div class="h-line h-margin10-TB"></div> \n\
                                    <div class="h-body-content-frame" id="body_content_frame"> </div> \n\
                                </div> \n\
                            </div> \n\
                            <div class="h-body-content-source" id="body_content_source">  \n\
                                <a class="h-body-content-title" href="#"><i></i>Example Source</a> \n\
                                <pre style="display:none;"></pre> \n\
                            </div> \n\
                        </div> \n\
                    </div> \n\
                </div>';
            var webUiBody = $('#webUiBody');
            if(webUiBody.length > 0 ){
                webUiBody.html(webUiBodyTmpl);
            }else{
                $(document.body).html(webUiBodyTmpl);
            }
            
            this.initEvent();
        },
        
        initEvent: function() {
            //初始化描述和源代码折叠事件
            $('#body_content_source a, #body_description').click(function(e) {
                var next = $(this).next();
                $(this).toggleClass('expand');
                next.toggle();
                return false;
            });

            //放大缩小事件
            $('#body_content_zoom').click(function() {
                var el = $(this),
                        ct = $('#body_content_ct');
                if (el.hasClass('reduce')) {
                    ct.css({
                        position: 'static',
                        backgroundColor: '',
                        width: '',
                        minHeight: '',
                        paddingTop: 0
                    });
                } else {
                    ct.css({
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        backgroundColor: '#FFFFFF',
                        width: element.getViewportWidth() - $.position.scrollbarWidth(),
                        minHeight : element.getDocumentHeight(),
                        paddingTop: 5,
                        zIndex: 1
                    });
                }
                el.toggleClass('reduce');
            });
            
            /**
             * 返回到最上面处理代码
             * 此处应换成合适的图标，待换
             */
            var upward = $('#upward');
            if(upward.length == 0){
                upward = $('<div class="h-upward" id="upward">Top</div>').appendTo(document.body);
            }
            upward.click(function(e) {
                document.documentElement.scrollTop = 0;
            });
        },
                
        initWebUI: function() {
            this.initElement();
            this.initScroll();
            
            var me = this;
            //顶部菜单点击事件
            $('#top_menu a').click(function(e) {
                e.preventDefault();
                //定位箭头
                var el = $(this),
                        arrows = $('#top_menu').next(),
                        pos = el.position(),
                        width = el.outerWidth(true),
                        left = pos.left + width / 2 - arrows.outerWidth() / 2;
                arrows.css('left', left + 'px');
                //设置当前样式
                el.addClass('current').parent().siblings().children().removeClass('current');

                var section = this.href.replace(/\/[^\/]+\.html/, '');
                var module = section.replace(/.+\/([^\/]+)/, '$1');//模块名
                var xmlUrl = './web/' + module + '/xml/menu.xml';

                me.module = module;
                me.loadLeftMenu(xmlUrl);
            });

            //默认加载第一个tab
            var index = 0;
            if (window.location.hash && window.location.hash.indexOf('|') !== -1) {
                var modules = $('#top_menu a').map(function(index, element) {
                    var href = element.href;
                    var section = href.replace(/\/[^\/]+\.html/, '');
                    var module = section.replace(/.+\/([^\/]+)/, '$1');//模块名
                    return module;
                }).get();
                var module = window.location.hash.split('|')[0].substring(1);//去掉#号
                index = modules.indexOf(module);
            }
            $('#top_menu a:eq(' + index + ')').click();
        },
                
        //加载左侧菜单列表
        loadLeftMenu: function(xmlUrl, module, context) {
            if (module !== undefined) {
                this.module = module;
            }
            if (context !== undefined) {
                this.context = context;
            }
            var conf = {
                url: xmlUrl,
                asyn: true,
                container: 'p2Menu',
                scope: this,
                fn: this.linkMenuLoadContent
            };
            var pMenu = new $.hopefuture.platform.P2Menu(conf);
            pMenu.loadMenu();

            var level1Node, level2Node;
            if (window.location.hash && window.location.hash.indexOf('|') !== -1) {
                var modules = window.location.hash.split('|');
                if (module !== undefined) {//这里兼顾直接从二级根目录下访问
                    level1Node = modules[0].substring(1);//去掉#号
                    level2Node = modules[1];
                } else {
                    level1Node = modules[1];
                    level2Node = modules[2];
                }
            }
            //定位当前的菜单项
            pMenu.setCurrentMenuByModule(level1Node, level2Node);

        },
        //点击左侧菜单项时回调函数
        linkMenuLoadContent: function(url) {
            var me = this;
            var module = this.module;
            //记录所有上下文模块
            var _modules = url.split('/');
            this.currentModules = (module ? '|' : '') + _modules[1] + '|' + _modules[2];
            if (this.context && this.module) {
                url = this.context + module + url.replace('.', '');
            }
            var section = url.replace(/\/[^\/]+\.html/, '');
            $('#body_content_menu').load(url + ' .h-demo-nav-menu', function() {
                $('#body_content_menu a').each(function(index, element) {
                    var el = $(this);
                    this.setAttribute('href', section + '/' + this.getAttribute('href'));
                    el.attr('target', 'body_content_frame');
                    el.click(function() {
                        $(this).parent().addClass('current').siblings().removeClass('current');
                        var href = this.getAttribute('href'),
                                aliasName = this.getAttribute('aliasName');
                        me.loadExamples(href, aliasName);
                        //阻止默认点击事件
                        return false;
                    });
                });

                //默认加载第一篇文章
                var index = 0;
                if (window.location.hash && window.location.hash.indexOf(me.currentModules) !== -1) {//判断是否是当前上下文
                    //所有文章
                    var articles = $('#body_content_menu a').map(function(index, element) {
                        return $(element).attr('aliasName');
                    }).get();
                    var article = window.location.hash.split('|');
                    article = article[article.length - 1];//取最后一个
                    if (articles.indexOf(article) != -1) {
                        index = articles.indexOf(article);
                    }
                }
                $('#body_content_menu a:eq(' + index + ')').click();
            });
        },
        //加载代码例子
        loadExamples: function(path, aliasName) {
            //Set the hash to the actual page without ".html"
            var part = path.replace(/\/[^\/]+\.html/, '').replace(this.context, '');
            var parts = part.replace('./', '').split('/');
            var hash = parts[0];
            for (var i = 1, len = parts.length; i < len; i++) {
                hash += '|' + parts[i];
            }
            if (aliasName) {
                hash += '|' + aliasName;
            }
            window.location.hash = hash;
            var directory = path.replace(/\/[^\/]+\.html/, '');
            $.get(path, function(req, status, res) {
                var source = res.responseText;
                var repSource = source;
                //repSource = repSource.replace(/<script.*>.*<\/script>/ig,""); // Remove script tags
                //repSource = repSource.replace(/<\/?link.*>/ig,""); //Remove link tags
                //repSource = repSource.replace(/<\/?html.*>/ig, ""); //Remove html tag
                //repSource = repSource.replace(/<\/?body.*>/ig, ""); //Remove body tag
                //repSource = repSource.replace(/<\/?head.*>/ig, ""); //Remove head tag
                //repSource = repSource.replace(/<\/?meta.*>/ig, ""); //Remove meta tag
                //repSource = repSource.replace(/<\/?!doctype.*>/ig, ""); //Remove doctype
                //repSource = repSource.replace(/<title.*>.*<\/title>/ig, ""); // Remove title tags
                //直接取body标签中的值
                repSource = repSource.match(/<(body)[^>]*>(.|\s)*<\/\1>/ig)[0];
                repSource = repSource.replace(/<\/?body.*>/ig, ""); //Remove body tag
                //替换a标签和img标签相对路径，该正则表达式的意思是：替换href或src中的值，并且该值开头不是http或#。该例子中用到了零宽断言
                repSource = repSource.replace(/((href|src)=["'])(?!(http|#))/ig, '$1' + directory + '/');

                //替换样式中图片背景
                repSource = repSource.replace(/(url\(\s*["']?\s*)(?!(http|#))/ig, '$1' + directory + '/');
                $('#body_content_frame').empty().html(repSource);

                //初始化目录列表事件
                $('#body_content_frame .h-web-catalogue li a').click(function(e) {
                    e.preventDefault();
                    var paragraphNum = $(this).attr('paragraph'),
                            paragraph = $('#body_content_frame .h-web-paragraph h3[paragraph="' + paragraphNum + '"]'),
                            offset = paragraph.offset();
                    //当html文档头部包含有“文档类型声明”时，需要用document.documentElement.scrollTop获得正确的值，而document.body.scrollTop的值为0 
                    if (offset) {
                        document.documentElement.scrollTop = offset.top;
                    }
                    //当html文档头部不包含任何“文档类型声明”时，需要用document.body.scrollTop获得正确的值，而document.documentElement.scrollTop的值为0
                    //document.body.scrollTop = offset.top;
                });
                source = source.replace(/</g, '&lt;');
                /**
                 * brush: js; 
                 * html-script: true; 标识是否开启 HTML/XML 标签着色特性。（必须载入 xml 的笔刷 shBrushXml.js）
                 * quick-code: false; 设置是否启用“双击”快速代码复制和粘贴。
                 * toolbar : false 设置是否显示工具栏。
                 */
                //$('#body_content_source pre').empty();
                //$('<pre type="syntaxhighlighter" class="brush: js; html-script: true; quick-code: false; toolbar : false" ></pre>').html(source).appendTo('#body_content_source pre');
                //SyntaxHighlighter.highlight();
            }, 'html');
        },
        
        //实现当window滚动时，顶端的菜单栏位置不变，始终置于页面顶部
        initScroll: function() {
            var headerHeight = $('#header').outerHeight(true);
            $(window).scroll(function() {
                var scrollTop = $(this).scrollTop();
                if (scrollTop > headerHeight) {
                    if ($.browser['msie'] && $.browser['version'] === '6.0') {
                        $('#topMenu').css('position', 'absolute');
                        $('#topMenu').animate({
                            top: scrollTop - headerHeight
                        }, {
                            duration: 100,
                            queue: false
                        });
                    } else {
                        $('#topMenu').css('position', 'fixed').addClass('docked');
                    }
                } else {
                    $('#topMenu').css('position', 'static').removeClass('docked');
                }
            });
        }
    };

    $.hopefuture.platform.Layout = pub;

})(jQuery);