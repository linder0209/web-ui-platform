/**
 * 用来处理DOM元素工具类
 * @param {jQuery} $
 * @param {type} undefined
 * @returns {}
 */
(function($, undefined) {
    $.util = $.util || {};

    $.util.Element = (function() {
        var doc = document;

        var element = {
            /**
             * 返回页面可视化宽度
             * 该方法不同于ExtJs中的实现，与之有区别
             * $.support.boxModel 返回 true表明浏览器是严格模式即：document.compatMode 为 'CSS1Compat'
             * return the page viewport width
             * @returns {}
             */
            getViewportWidth: function() {
                return self.innerWidth ? self.innerWidth :
                        ($.support.boxModel ? doc.documentElement.clientWidth : doc.body.clientWidth);
            },
            /**
             * 返回页面可视化高度
             * return the page viewport height
             * @returns {}
             */
            getViewportHeight: function() {
                return self.innerHeight ? self.innerHeight :
                        ($.support.boxModel ? doc.documentElement.clientHeight : doc.body.clientHeight);
            }
        };
        return element;
    })();
})(jQuery);
