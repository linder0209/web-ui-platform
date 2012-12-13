/**
 * tools 工具类
 * 
 * @author : linder
 * @date : 2012-12-12
 */
(function($, undefined) {

	// init package
	$.hopefuture = $.hopefuture || {};
	$.hopefuture.platform = $.hopefuture.platform || {};

	var re = /\{([\w-]+)\}/g;

	$.hopefuture.platform.util = {

		// deal with template
		// 该方法支持键值即json格式的数据
		applyTemplate : function(template, values) {
			return template.replace(re, function(m, name) {
				return values[name] !== undefined ? values[name] : '';
			});
		}

	};

})(jQuery);
