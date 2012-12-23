$(function() {

    //顶部菜单点击事件
    $('#top_menu a').click(function(e) {
        e.preventDefault();
        window.location.hash = this.href.replace(/.+\/([^\/]+)\/index\.html/, '$1') + '|default';
        loadPage(this.href);
        $(this).addClass('current').parent().siblings().children().removeClass('current');
    });
    
    //加载页面
    function loadPage(path) {
        var section = path.replace(/\/[^\/]+\.html/, '');
        var header = section.replace(/.+\/([^\/]+)/, '$1').replace(/_/, ' ');
        
        $('#webUiBody').load(path + ' .h-body', function() {
            console.log(44);
//                $('#demo-config-menu a').each(function() {
//                    $(this).attr('target', 'demo-frame');
//                    $(this).click(function() {
//                        $(this).parents('ul').find('li').removeClass('demo-config-on');
//                        $(this).parent().addClass('demo-config-on');
//                        $('#demo-notes').fadeOut();
//                        loadDemo('datepicker/' + this.getAttribute('href'));
//                        return false;
//                    });
//                });
            });
            
//        $('td.normal div.normal')
//                .empty()
//                .append('<h4 class="demo-subheader">Functional demo:</h4>')
//                .append('<h3 class="demo-header">' + header + '</h3>')
//                .append('<div id="demo-config"></div>')
//                .find('#demo-config')
//                .append('<div id="demo-frame"></div><div id="demo-config-menu"></div><div id="demo-link"><a class="demoWindowLink" href="#"><span class="ui-icon ui-icon-newwin"></span>Open demo in a new window</a></div>')
//                .find('#demo-config-menu')
//                .load(section + '/index.html .demos-nav', function() {
//            $('#demo-config-menu a').each(function() {
//                this.setAttribute('href', section + '/' + this.getAttribute('href').replace(/.+\/([^\/]+)/, '$1'));
//                $(this).attr('target', 'demo-frame');
//                $(this).click(function() {
//
//                    resetDemos();
//
//                    $(this).parents('ul').find('li').removeClass('demo-config-on');
//                    $(this).parent().addClass('demo-config-on');
//                    $('#demo-notes').fadeOut();
//
//                    //Set the hash to the actual page without ".html"
//                    window.location.hash = header + '|' + this.getAttribute('href').match((/\/([^\/\\]+)\.html/))[1];
//
//                    loadDemo(this.getAttribute('href'));
//
//                    return false;
//                });
//            });
//
//            if (window.location.hash) {
//                var demo = window.location.hash.split('|')[1];
//                $('#demo-config-menu a').each(function() {
//                    if (this.href.indexOf(demo + '.html') !== -1) {
//                        $(this).parents('ul').find('li').removeClass('demo-config-on');
//                        $(this).parent().addClass('demo-config-on');
//                        loadDemo(this.href);
//                    }
//                });
//            }
//
//            updateDemoNotes();
//        })
//                .end()
//                .find('#demo-link a')
//                .bind('click', function(ev) {
//            window.open(this.href);
//            ev.preventDefault();
//        })
//                .end()
//                .end()
//                ;
//
//        resetDemos();
    }
//    //定位箭头
//    var widthWidth = $('#top_menu li').outerWidth(true),
//            width = $('#top_menu li').width(),
//            i = 0;
//    $('#top_menu a').each(function(index, element) {
//        if ($(this).hasClass('current')) {
//            i = index;
//            return false;
//        }
//    });
//
//    var arrows = $('#top_menu').next(),
//            left = widthWidth * i + width / 2 - arrows.outerWidth() / 2;
//    arrows.css('left', left + 'px');
//
//    var conf = {
//        url: './platform/xml/javascriptMenu.xml',
//        asyn: true,
//        container: 'p2Menu'
//    };
//    var pMenu = new $.hopefuture.platform.P2Menu(conf);
//    pMenu.loadMenu();
//    
//    //加载右侧主面板

});