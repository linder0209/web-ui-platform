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

	/**
	 * 一些常用的处理数字的方法
	 */
	$.hopefuture.platform.Number = {
		/**
		 * 是否为数字
		 * 
		 * @param value
		 * @param allowStr
		 *            是否允许验证字符串
		 * @returns {Boolean}
		 */
		isNumber : function(value, allowStr) {
			return (typeof value === 'number' && isFinite(value))
					|| (allowStr === false ? false : parseFloat(value) == value);
		},

		/**
		 * 是否为正数
		 * 
		 * @param value
		 * @param allowStr
		 * @returns
		 */
		isPositive : function(value, allowStr) {
			return this.isNumber(value, allowStr) ? parseFloat(value) > 0 : false;
		},
		
		/**
		 * 格式化数字，保留有效位数
		 * 该方法的替代方位为Number.toFixed(2)，只是后者返回字符串，而且处理的只能是Number类型
		 * @param value
		 * @param digit 默认为保留两位有效数字
		 * @returns {Number}
		 */
		format : function(value, digit) {
			if (!value) {
				return 0;
			}
			if (digit == null) {
				digit = 2;
			}

			if (!this.isNumber(value)) {
				return 0;
			}

			return Math.round(value * Math.pow(10, digit)) / Math.pow(10, digit);
		},

		/**
		 * 把字符串解析为数字类型
		 * @param value
		 * @returns
		 */
		parseNumber : function(value) {
			value = parseFloat(value);
			return isFinite(value) ? value : 0;
		},

		/**
		 * 把数字解析为千分位格式
		 * 比如 -2333111.22222的结果为-2,333,111.22222
		 * @param num
		 * @returns
		 */
		commaFy : function(num) {
			if(!this.isNumber(num)){
				return 0;
			}
			var re = /^(-?\d+)(\d{3})/,
				_split = (num + '').split('.'),
				_split1 = '';
			if(_split.length = 2){
				_split1 = _split[1];
			}
			num = _split[0];
			while (re.test(num)) {
				num = num.replace(re, '$1,$2');
			}
			return num + '.' + _split1;
		},

		commaFyBack : function(num) {
			var x = num.split(',');
			return parseFloat(x.join(''));
		},

		// formatting the number
		// formatNumber('466666444.5454'), the result is 466,666,444.55
		formatNumber : function(num, digit) {
			if (!$.hopefuture.platform.support.isNumber(num)) {
				return 0;
			}
			if (digit == undefined) {
				digit = 2;
			}
			num = parseFloat(num).toFixed(digit);
			var re = /(-?\d+)(\d{3})/;
			while (re.test(num)) {
				num = num.replace(re, '$1,$2');
			}
			return num;
		},

		// remove the comma
		// reCommaDigit('111,111,333,5.55'),the result is 1111113335.55
		reCommaDigit : function(source) {
			var re = /,/g, re2 = /[\$,£,€]/, source = source.replace(re, '').replace(re2, '');
			if (!$.hopefuture.platform.support.isNumber(source)) {
				return 0;
			}
			return parseFloat(source);
		}
	}

})(jQuery);
