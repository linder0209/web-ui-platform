(function($, undefined) {
    
	var pub = {
		//模块名	
		module : '',
		context : 'web/',
		initWebUI : function(){
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
		        var xmlUrl = './web/' + module + '/xml/' + module + 'Menu.xml';;
		        me.module = module;
		        $('#webUiBody').load(this.href + ' .h-body', function() {
		        	me.loadLeftMenu(xmlUrl);
		        });
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
			if(this.context && this.module){
				url = this.context + module + url.replace('.', '');
			}
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
						var part = href.replace(/\/[^\/]+\.html/, '').replace(me.context, '');
						var parts = part.replace('./', '').split('/');
						var hash = parts[0];
						for ( var i = 1, len = parts.length; i < len; i++) {
							hash += '|' + parts[i];
						}
						window.location.hash = hash;
						me.loadExamples(href);
						//阻止默认点击事件
						return false;
					});
				});
	    		
	    		$('#body_content_menu a:eq(0)').click();
	    	});
	    	
	    	$('#body_content_source a').click(function(e){
	    		var pre = $(this).next();
	    		$(this).toggleClass('expand');
	    		pre.toggle();
	    		return false;
	    	});
	    },
	    
	    //加载左侧菜单列表
	    loadLeftMenu:function (xmlUrl, module, context) {
	    	if(module !== undefined){
	    		this.module = module;
	    	}
	    	if(context !== undefined){
	    		this.context = context;
	    	}
        	var conf = {
                url: xmlUrl,
                asyn: true,
                container: 'p2Menu',
                scope : this,
                fn: this.linkMenuLoadContent
            };
            var pMenu = new $.hopefuture.platform.P2Menu(conf);
            pMenu.loadMenu();
            
            var level1Node , level2Node;
            if (window.location.hash) {
				if (window.location.hash.indexOf('|') !== -1) {
					var modules = window.location.hash.split('|'),
					    len = modules.length;
					level1Node = modules[len - 2];
					level2Node = modules[len - 1];
				}			
			}	
            pMenu.setCurrentMenuByModule(level1Node, level2Node);
	    },
	    
	    //加载代码例子
	    loadExamples : function(path) {
	    	$.get(path, function(req, status, res) {
	    		var source = res.responseText;
	    		var repSource = source;
	    		//repSource = repSource.replace(/<script.*>.*<\/script>/ig,""); // Remove script tags
	    		//repSource = repSource.replace(/<\/?link.*>/ig,""); //Remove link tags
	    		repSource = repSource.replace(/<\/?html.*>/ig,""); //Remove html tag
	    		repSource = repSource.replace(/<\/?body.*>/ig,""); //Remove body tag
	    		repSource = repSource.replace(/<\/?head.*>/ig,""); //Remove head tag
	    		repSource = repSource.replace(/<\/?meta.*>/ig,""); //Remove meta tag
	    		repSource = repSource.replace(/<\/?!doctype.*>/ig,""); //Remove doctype
	    		repSource = repSource.replace(/<title.*>.*<\/title>/ig,""); // Remove title tags
				//repSource = repSource.replace(/((href|src)=["'])(?!(http|#))/ig, "$1" + directory + "/");
	    		
	    		$('#body_content_frame').empty().html(repSource);
	    		
	    		source = source.replace(/</g, '&lt;');
	    		/**
	    		 * brush: js; 
	    		 * html-script: true; 标识是否开启 HTML/XML 标签着色特性。（必须载入 xml 的笔刷 shBrushXml.js）
	    		 * quick-code: false; 设置是否启用“双击”快速代码复制和粘贴。
	    		 * toolbar : false 设置是否显示工具栏。
	    		 */
	    		$('#body_content_source pre').empty();
	    		$('<pre type="syntaxhighlighter" class="brush: js; html-script: true; quick-code: false; toolbar : false" ></pre>').html(source).appendTo('#body_content_source pre');
	    		SyntaxHighlighter.highlight();
	    	}, 'html');
		}
	};
	
	$.hopefuture.platform.Layout = pub;
	
})(jQuery);