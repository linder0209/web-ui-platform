$(function() {
    
	var pub = {
		//模块名	
		module : '',
		initPage : function(){
			var me = this;
			//顶部菜单点击事件
		    $('#top_menu a').click(function(e) {
		        e.preventDefault();
		        window.location.hash = this.href.replace(/.+\/([^\/]+)\/index\.html/, '$1') + '|index';
			    //定位箭头
			    var el = $(this),
			    	arrows = $('#top_menu').next(),
			        pos = el.position(),
			    	width = el.outerWidth(true),
			    	left = pos.left + width / 2 - arrows.outerWidth() / 2;
			    arrows.css('left', left + 'px');
			    //设置当前样式
			    el.addClass('current').parent().siblings().children().removeClass('current');
			    
			    me.loadPage(this.href);
		    });
		    
		    //默认加载第一个tab
		    var index = 0;
		    if (window.location.hash) {
				if (window.location.hash.indexOf('|') !== -1) {
					var modules = $('#top_menu a').map(function(index, element){
						var href = element.href;
						var section = href.replace(/\/[^\/]+\.html/, '');
				        var module = section.replace(/.+\/([^\/]+)/, '$1');//模块名
						return module;
					}).get();
					var module = window.location.hash.split('|')[0].substring(1);
					index = modules.indexOf(module);
				}			
			}	
		    //加载第一个tab
		    $('#top_menu a:eq(' + index + ')').click();
		},
		
		//点击左侧菜单项时回调函数
		linkMenuLoadContent : function(url){
			var me = this;
			var module = this.module;
			url = './web/' + module + url.replace('.', '');
			var section = url.replace(/\/[^\/]+\.html/, '');
	    	$('#body_content_menu').load( url + ' .h-demo-nav-menu', function() {
	    		$('#body_content_menu a').each(function() {
	    			var el = $(this);
					this.setAttribute('href', section + '/' + this.getAttribute('href').replace(/.+\/([^\/]+)/,'$1'));
					el.attr('target', 'body_content_frame');
					el.click(function() {
						$(this).parent().addClass('current').siblings().removeClass('current');
						//Set the hash to the actual page without ".html"
						var href = this.getAttribute('href');
						var part = href.replace(/\/[^\/]+\.html/, '').replace('./web/' + module + '/', '');
						var hash = module;
						var parts = part.split('/');
						for ( var i = 0, len = parts.length; i < len; i++) {
							hash += '|' + parts[i];
						}
						window.location.hash = hash;
						me.loadExamples(href);
						//阻止默认点击事件
						return false;
					});
				});
	    	});
	    	
	    	$('#body_content_source a').click(function(e){
	    		var pre = $(this).next();
	    		$(this).toggleClass('expand');
	    		pre.toggle();
	    		return false;
	    	});
	    },
	    
	    //加载页面
	    loadPage:function (path) {
	    	var me = this;
	        var section = path.replace(/\/[^\/]+\.html/, '');
	        var module = section.replace(/.+\/([^\/]+)/, '$1');//模块名
	        var url = './web/' + module + '/xml/' + module + 'Menu.xml';;
	        this.module = module;
	        
	        $('#webUiBody').load(path + ' .h-body', function() {
	        	var conf = {
	                url: url,
	                asyn: true,
	                container: 'p2Menu',
	                scope : me,
	                fn: me.linkMenuLoadContent
	            };
	            var pMenu = new $.hopefuture.platform.P2Menu(conf);
	            pMenu.loadMenu();
	        });
	    },
	    
	    //加载代码例子
	    loadExamples : function(path) {
	    	$.get(path, function(req, status, res) {
	    		var source = res.responseText;
	    		$('#body_content_frame').empty().html(source);
	    	});
	    	
//			var directory = path.match(/([^\/]+)\/[^\/\.]+\.html$/)[1];
//			$.get(path, function(data) {
//				var source = data;
//				data = data.replace(/<script.*>.*<\/script>/ig,""); // Remove script tags
//				data = data.replace(/<\/?link.*>/ig,""); //Remove link tags
//				data = data.replace(/<\/?html.*>/ig,""); //Remove html tag
//				data = data.replace(/<\/?body.*>/ig,""); //Remove body tag
//				data = data.replace(/<\/?head.*>/ig,""); //Remove head tag
//				data = data.replace(/<\/?!doctype.*>/ig,""); //Remove doctype
//				data = data.replace(/<title.*>.*<\/title>/ig,""); // Remove title tags
//				data = data.replace(/((href|src)=["'])(?!(http|#))/ig, "$1" + directory + "/");
//
//				$('#demo-style').remove();
//				$('#demo-frame').empty().html(data);
//				$('#demo-frame style').clone().appendTo('head').attr('id','demo-style');
//				$('#demo-link a').attr('href', path);
//				updateDemoNotes();
//				updateDemoSource(source);
//				
//				if (/default.html$/.test(path)) {
//					$.get("documentation/docs-" + path.match(/demos\/(.+)\//)[1] + ".html", function(html) {
//						$("#demo-source").after(html);
//						$("#widget-docs").tabs();
//						$(".param-header").click(function() {
//							$(this).parent().toggleClass("param-open").end().next().toggle();
//						});
//						$(".docs-list-header").each(function() {
//							var header = $(this);
//							var details = header.next().find(".param-details").hide();
//							$("a:first", header).click(function() {
//								details.show().parent().addClass("param-open");
//								return false;
//							});
//							$("a:last", header).click(function() {
//								details.hide().parent().removeClass("param-open");
//								return false;
//							});
//						});
//					}, "html" );
//				}
//			}, "html" );
	    	
		}
	};
	
	pub.initPage();
});