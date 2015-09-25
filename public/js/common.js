var u = navigator.userAgent;
window.browser={
    trident: u.indexOf('Trident') > -1, //IE
    presto: u.indexOf('Presto') > -1, //opera
    webKit: u.indexOf('AppleWebKit') > -1,
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
    mobile: !!u.match(/AppleWebKit.*Mobile.*/),
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android
    iPhone: u.indexOf('iPhone') > -1 ,
    iPad: u.indexOf('iPad') > -1,
    webApp: u.indexOf('Safari') == -1 ,
    isWebchat: /micromessenger/i.test(u)
};
window.onload=function(){
    //隐藏地址栏
    setTimeout(function() {
        window.scrollTo(0, 1)
    }, 0);
};
/*底部搜索事件函数*/
function search(){
    var val= $('.search input').val();
    if(val){
        var url='/search?keyword='+val+'&pageNum=1&type=1&'+$('#source').val();
        localStorage.setItem('keyword',val);
        window.pageload(url);
        history.pushState('', '', url);
    }else{
        alert('请输入关键字搜索');
    }
}
function searchForTop(source){
    var val= $('.searchForTop').val();
    var url='/search?keyword='+val+'&pageNum=1&type=1&'+source;
    localStorage.setItem('keyword',val);
    window.pageload(url);
    history.pushState('', '', url);
}

/*搜索页顶部搜索事件函数*/
function search2(){
    var val= $('.searchbar input').val();
    var ss = window.location.search.indexOf('search');
    var url ='';
    if(val){
        if(ss>-1){
           // url='/search?keyword='+val+'&pageNum=1&type='+($('.tab .active').index()+1)+'&'+$('#source').val();
            url='/search?keyword='+val+'&pageNum=1&type='+($('.tab .active').index()+1)+'&search=yes&'+$('#source').val();
        }else{
            url='/search?keyword='+val+'&pageNum=1&type='+($('.tab .active').index()+1)+'&'+$('#source').val();
        }
        localStorage.setItem('keyword',val);
        window.pageload(url);
        history.pushState('', '', url);
    }else{
        alert('请输入关键字搜索');
    }
}
$(function(){
    var $body=$(document.body);
	var ua = navigator.userAgent.toLowerCase(); 
	if(ua.indexOf('android 2.3')>-1){
        $body.addClass('low-version');
	}
    //控制android或ios的显示隐藏
    if(window.browser.android){
        $body.addClass('page-android')
    }
    if(window.browser.ios){
        $body.addClass('page-ios');
    }
    //懒加载
    var lazyload=function(){
        $("img.lazy").each(function(){
            $(this).attr('src',$(this).data('original'));
        });
    }
    //页面公共事件绑定
    var BindEvent=function(){
        lazyload();
        $('.tab li').on('click',function(){
            var $this=$(this);
            $this.addClass('active').siblings().removeClass('active');
            var index=$this.index();
            $('.tab-content').children().eq(index).show().siblings().hide();
        });
        var btnAside=$('.g-btn-aside');
        btnAside.on('click',function(){
            if(btnAside.hasClass('disable')) return;
            $('.wrapper').toggleClass('aside-out');
            if($('.aside-out').length==1){
                $('.article-overlayer').show().height($(document).height());
                if(!window.myScroll){
                    window.myScroll = new IScroll('#aside', {hScroll:false, freeScroll: true,click: true });
                }
            }
        });
        $('.article-overlayer').on('touchstart',function(e){
            $('.aside-out').removeClass('aside-out');
            e.stopPropagation();
            e.preventDefault();
            btnAside.addClass('disable');
            setTimeout(function(){
                btnAside.removeClass('disable');
            },500);

        });
        $('aside a').on('click',function(){
            $('.wrapper').toggleClass('aside-out');
        });
        $('.g-goback').on('click',function(){
            if(history.length&&history.length<=1){
                window.pageload('/');
            }else{
                window.history.go(-1);
            }
        });
        $('.top-download-close').on('click',function(){
            $('.top-download').hide();
        });
        $('.search input').on('focus',function(){
            $('.search').addClass('search-focus');
        }).on('blur',function(){
            $('.search-focus').removeClass('search-focus');
        });
    }
    BindEvent();
    //手机端a链接hover效果
    $body.on('touchstart','a',function(){
        var hover=$(this);
        if(hover.attr('data-hover')!='false'){
            hover.addClass('hover');
            setTimeout(function(){
                $('.hover').removeClass('hover');
            },500);
        }
    });
    //获取分类信息
    if(top==window) {
        $.ajax({url: '/ajax/category', cache: true, success: function (data) {
            var source=$('#source').val();
            if (data) {
                var html = '';
                data = data.list;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].type == 1) {
                        html += '<li><a href="/book/category/child/' + data[i].id + '?sort=2&pageNum=1&name=' + data[i].name + '&'+source+'">' + data[i].name + '</a></li>';
                    } else {
                        html += '<li><a href="/book/category/' + data[i].id + '?name=' + data[i].name + '&'+source+ '">' + data[i].name + '</a></li>';
                    }
                }
                $('.main-category ul').html(html);
            }
        }});
    }
    //返回顶部
    var gotop=$('.g-gotop');
    $(window).on('scroll',function(){
        if($(window).scrollTop()>$(window).height()){
            gotop.show().on('click',function(){
                $(window).scrollTop(0);
            });
        }else{
            gotop.hide();
        }
    });
    //设置header高度与fixednav一致
    $('header').height($('.fixednav').height());
    /**页面跳转拦截,并使用iframe加载页面**/
    var pageloadbar = $('.page-loading-bar');
    var pageload=window.pageload=function(url,cb){
        url+=url.indexOf('?')==-1?'?':'&';
        url+='t='+Math.random();
        $('.wrapper').removeClass('aside-out').css('opacity',0.7);
        pageloadbar.show().css('width','80%');
        var iframe= document.createElement('iframe');
        iframe.style.display = "none";
        iframe.src=url;
        iframe.onload=function () {
            if($.fn.fullpage){
                $.fn.fullpage.destroy();
            }
            $('.wrapper').css('opacity',1);
            pageloadbar.show().css('width','100%');
             setTimeout(function(){
                pageloadbar.hide().width(0);
             },500);
            var doc=this.contentWindow.document;
            document.title=doc.title;
            if(doc.getElementsByTagName('article')[0]){
                $('article').html(doc.getElementsByTagName('article')[0].innerHTML);
            }else{
                $('article').html(doc.body.innerHTML);
            }
            $('header').height($('.fixednav').height());
            BindEvent();
            var script=this.contentWindow.script;
            if(script&&seajs){
                seajs.use(script,function(a){
                    a.ready();
                });
            }
            window.scrollTo(0, 1)
            $('.g-gotop').hide();
            $(iframe).remove();
            if(cb&&typeof cb=='function'){
                cb();
            }
            var searchInput=$('.searchbar input');
            if(searchInput.length==1){
                var url = window.location.search.indexOf('embedApp');
                if(url > -1){
                    var keyVal = localStorage.getItem('keyword');
                    if(!keyVal){
                        $('.search-empty').find('.big').text('请输入搜索关键词');
                        searchInput.attr('placeholder', '搜索书籍/节目/主播');
                    }else{
                        searchInput.attr('placeholder', keyVal);
                    }
                }else{
                    searchInput.val(localStorage.getItem('keyword'));
                }
                //searchInput.val(localStorage.getItem('keyword'));
            }
        }
        document.body.appendChild(iframe);
    }
    //页面约定行为跳转
    var forward=function(e){
        var $this=$(this);
        var url=$this.attr('href');
        //免流量模块不进行iframe页面拦截
        if(url.indexOf('freeflow')>-1){
            url+=url.indexOf('?')==-1?'?':'&';
            url+='t='+Math.random();
            history.pushState('', '',url );
            return;
        }
        if($this.hasClass('btn-list-more')&&$this.closest('.tab-content').length==1){
            var pageNum=$this.data('pagenum');
            var container=$this.prev('ul');
            pageNum++;
            $this.addClass('btn-loading');
            $this.data('text',$this.find('.btn-load-text').text());
            $this.find('.btn-load-text').text('正在加载...');
            $.ajax({
                url:url+='&pageNum='+pageNum,
                success:function(htmlText){
                    $this.data('pagenum',pageNum);
                    var maxlength=$this.data('maxlength')?parseInt($this.data('maxlength')):10;
                    var list=$(htmlText).find('.tab-content>li').eq($('.tab>li.active').index()).find('ul');
                    if(list.length==0){
                        container.append(htmlText);
                        if($(htmlText).filter('li').length<maxlength){
                            $this.hide();
                        }
                    }else{
                        container.append(list.html());
                        if(list.children().length<maxlength){
                            $this.hide();
                        }
                    }
                    lazyload();
                    $this.removeClass('btn-loading');
                    $this.find('.btn-load-text').text($this.data('text'));
                }
            });
            e.preventDefault();
        }else if($this.hasClass('btn-list-more')&&$this.closest('.tab-content').length==0){
            var container=$this.prev('ul');
            var referId=container.children().last().data('referid');
            if(referId){
                url+='&referId='+referId;
            }
            var pageNum=$this.data('pagenum');
            if(pageNum){
                pageNum++;
                url+='&pageNum='+pageNum;
                $this.data('pagenum',pageNum);
            }
            $this.addClass('btn-loading');
            $this.data('text',$this.find('.btn-load-text').text());
            $this.find('.btn-load-text').text('正在加载...');
            $.ajax({
                url:url,
                success:function(htmlText){
                    var list=$(htmlText).find('.list-container');
                    var maxlength=$this.data('maxlength')?parseInt($this.data('maxlength')):10;
                    if(list.length==0){
                        container.append(htmlText);
                        if($(htmlText).filter('li').length<maxlength){
                            $this.hide();
                        }
                    }else{
                        container.append(list.html());
                        if(list.children().length<maxlength){
                            $this.hide();
                        }
                    }
                    lazyload();
                    $this.removeClass('btn-loading');
                    $this.find('.btn-load-text').text($this.data('text'));
                }
            });
            e.preventDefault();
        }else if($this.closest('.tab').length==1){
            var index=$this.parent().index();
            var container=$('.tab-content>li').eq(index);
            container.addClass('loader');
            var btnMore=container.next('.btn-list-more').hide();
            $this.removeAttr('href');
            $.ajax({
                url:url,
                success:function(htmlText){
                    var list=$(htmlText).find('.tab-content>li').eq(index);
                    container.html(list.html());
                    container.removeClass('loader');
                    if(list.find('ul').children().length>=10){
                        btnMore.show();
                    }
                    lazyload();
                }
            })
            e.preventDefault();
        }else if(history.pushState&&!$this.attr('_blank')&&url!='#'&&url.indexOf('http://')==-1&&url.indexOf('https://')==-1&&url.indexOf('javascript')==-1&&url.indexOf('lazyaudio://')==-1){
            pageload(url);
            history.pushState('', '',url );
            e.preventDefault();
        }
    }
    $body.on('click','a[href]',forward);

    setTimeout(function(){
        window.onpopstate = function (e) {
            pageload(location.href);
        }
    },1000);

    /**播放器**/
    window.playerInfo={};
    var audio=document.getElementById('audio');
    var btnPlay=$('.player-mini-play');
    var btnPause=$('.player-mini-pause');
    var btnNext=$('.player-mini-next');
    var playerMini=$('.player-mini');
    btnPlay.on('click',function(){
        audio.play();
    });
    btnPause.on('click',function(){
        audio.pause();
    });
    btnNext.on('click',function(){
        window.playerInfo.index++
        var section=window.playerInfo.sections[window.playerInfo.index];
        if(section){
            window.lazyMedia.play(section);
        }
    });
    playerMini.find('.js-link').on('click',function(){
        if($('#resourceId').val()!=window.playerInfo.resourceId){
            window.pageload($(this).data('href'));
        }
    })
    var gifIndex=0;
    var gifInterval=null;
    var _boolPlayer=true;
    var showPlayer=function(){
        playerMini.show();
        $('.player-mini-wrapper').height(playerMini.height());
    }
    window.lazyMedia={
        beating:function(){
            if($('#resourceId').val()==window.playerInfo.resourceId){
                $('.book-section-playing').hide().siblings('.book-section-play').show();
                var item=$('.book-section li.layout-box').eq(window.playerInfo.index);
                if(audio.paused){
                    item.find('.book-section-play').show();
                    item.find('.book-section-playing').hide();
                }else{
                    item.find('.book-section-play').hide();
                    item.find('.book-section-playing').show();
                }
                clearInterval(gifInterval);
                gifInterval=setInterval(function(){
                    if(gifIndex==9){
                        gifIndex=1;
                    }else{
                        gifIndex++;
                    }
                    item.find('img').attr('src','/images/playing/0'+gifIndex+'.png');
                },100);
            }else{
                clearInterval(gifInterval);
            }
        },
        play:function(obj){
            for(var name in obj){
                $('#player_'+name).html(obj[name]);
            }
            if(audio.src!=obj.path){
                audio.setAttribute('title',obj.name);
                audio.setAttribute('name',obj.name);
                audio.src=obj.path;
                playerMini.find('.js-link').data('href',obj.link);
                audio.play();
            }else{
                if(audio.paused){
                    audio.play()
                }else{
                    audio.pause()
                }
            }

        }
    }
    audio.addEventListener('play',function(){
        showPlayer();
        btnPlay.hide();
        btnPause.show();
        lazyMedia.beating();
    });
    audio.addEventListener('pause',function(){
        btnPlay.show();
        btnPause.hide();
        lazyMedia.beating();
    });
    audio.addEventListener('ended',function (){
        btnNext.click();
    });
    window.secondsToTimeCode=function(time, forceHours, showFrameCount, fps) {
        //add framecount
        if (typeof showFrameCount == 'undefined') {
            showFrameCount=false;
        } else if(typeof fps == 'undefined') {
            fps = 25;
        }
        var hours = Math.floor(time / 3600) % 24,
            minutes = Math.floor(time / 60) % 60,
            seconds = Math.floor(time % 60),
            frames = Math.floor(((time % 1)*fps).toFixed(3)),
            result =
                ( (forceHours || hours > 0) ? (hours < 10 ? '0' + hours : hours) + ':' : '')
                + (minutes < 10 ? '0' + minutes : minutes) + ':'
                + (seconds < 10 ? '0' + seconds : seconds)
                + ((showFrameCount) ? ':' + (frames < 10 ? '0' + frames : frames) : '');
        return result;
    }
})