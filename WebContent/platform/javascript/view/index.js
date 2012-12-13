$(function() {

    //定位箭头
    var widthWidth = $('#top_menu li').outerWidth(true),
            width = $('#top_menu li').width(),
            i = 0;
    $('#top_menu a').each(function(index, element) {
        if ($(this).hasClass('current')) {
            i = index;
            return false;
        }
    });

    var arrows = $('#top_menu').next(),
            left = widthWidth * i + width / 2 - arrows.outerWidth() / 2;
    arrows.css('left', left + 'px');


    //加载菜单
    //测试数据
//	var data = [];
//	data.push({
//		id : 'level1_1',
//		name : 'JavaScript',
//		children : [ {
//			id : 'level1_1_1',
//			name : 'sdfsd',
//			href : ''
//		}, {
//			id : 'level1_1_2',
//			name : 'sdfsdf',
//			href : ''
//		} ]
//	});
//	
//	data.push({
//		id : 'level1_2',
//		name : 'jQuery',
//		children : [ {
//			id : 'level1_2_1',
//			name : 'sdfsd',
//			href : ''
//		}, {
//			id : 'level1_2_2',
//			name : 'sdfsdf',
//			href : ''
//		} ]
//	});
//	
//	data.push({
//		id : 'level1_3',
//		name : 'ExtJs',
//		children : [ {
//			id : 'level1_3_1',
//			name : 'sdfsd',
//			href : ''
//		}, {
//			id : 'level1_3_2',
//			name : 'sdfsdf',
//			href : ''
//		} ]
//	});
    var conf = {
        url: './platform/xml/javascriptMenu.xml',
        asyn: true,
        container: 'p2Menu'
    };
    var pMenu = new $.hopefuture.platform.P2Menu(conf);
    pMenu.loadMenu();

});