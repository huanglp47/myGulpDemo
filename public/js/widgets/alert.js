/*
 * alert 插件
 * Author Lipeng 2015-08-11
 * 使用 var GlobalAlert = require('../alert');
 *      GlobalAlert.show('test' [,'3000',css])//[]：可选
 * 
 */

define(function(require, exports, module){

    var alertHtml = '<div class="crm_prompt_box">'+ 
					    '<span class="crm_prompt_image hide"></span>'+
					    '<span class="crm_prompt_text ">{text}</span>'+
				    '</div>';
    var MyAlert={
        'alertObj': null,
        'timer': null,
        'timeout': 2500,
        'show': function(text, delayTime, cssSetting) {
            var textHtml = alertHtml.replace(/{text}/, text),
                delayTime = delayTime || this.timeout,
                self = this;
            this.close();
            this.alertObj = $(textHtml);
            $(document.body).append(this.alertObj);
            this.setPosition(cssSetting);
            this.timer = setTimeout(function() {
                self.close();
            }, delayTime)
        },
        'close': function() {
            clearTimeout(this.timer);
            this.alertObj && this.alertObj.remove();
            this.alertObj = null;
        },
        'setPosition': function(cssSetting) {
            var winWidth = $(window).width(),
                winHeight = $(window).height(),
                selfWidth = $(this.alertObj).width(),
                selfHeight = $(this.alertObj).height(),
                paddingH = parseInt($(this.alertObj).css('paddingLeft'),10),
                paddingV = parseInt($(this.alertObj).css('paddingTop'),10),
                defaultCss = {},
                allCss = {},
                left = 0,
                top = 0;
            left = 0.5 * (winWidth - selfWidth-2*paddingH);
            top = 0.5*(winHeight - selfHeight-2*paddingV);
            defaultCss = {
                'left': left + 'px',
                'top': top + 'px',
                'textAlign': 'center'
            };
            allCss = $.extend({}, defaultCss, cssSetting);
            this.alertObj.css(allCss);
        }
    }

    module.exports = MyAlert;
})
