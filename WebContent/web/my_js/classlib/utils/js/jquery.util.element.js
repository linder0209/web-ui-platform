/**
 * 用来处理DOM元素工具类
 * @param {jQuery} $
 * @param {type} undefined
 * @returns {}
 */
(function($, undefined) {
    $.util = $.util || {};

    $.util.Element = (function() {

        var check = function(r) {
            return r.test(navigator.userAgent.toLowerCase());
        },
                doc = document,
                isOpera = check(/opera/),
                isIE = !isOpera && check(/msie/),
                isStrict = doc.compatMode == 'CSS1Compat';

        var element = {
            //return the page viewport width
            getViewportWidth: function() {
                return !isStrict && !isOpera ? doc.body.clientWidth : isIE
                        ? doc.documentElement.clientWidth
                        : self.innerWidth;
            },
            //return the page viewport height
            getViewportHeight: function() {
                return isIE ? (isStrict
                        ? doc.documentElement.clientHeight
                        : doc.body.clientHeight) : self.innerHeight;
            }
        };
        return element;
    })();


})(jQuery);
