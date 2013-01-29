/**
 * util 工具类
 * @param {jQuery} $
 * @param {type} undefined
 * @returns {}
 */
(function($, undefined) {
    $.util = $.util || {};
    $.util.support = $.util.support || {};

    var uuid = 0;
    $.extend($.util.support, {
        /**
         * 获取唯一id值
         * @param {type} prefix 前缀
         * @returns {Number|String}
         */
        id: function(prefix) {
            prefix = prefix || 'util-gen-';
            return prefix + (++uuid);
        }
    });
})(jQuery);
