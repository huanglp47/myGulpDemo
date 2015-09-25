/**
 * 前端分页插件
 * Author HLP
 * Date 2015-06-18
 */
define(function(require, exports, module) {
    var pageHtml = '<a id="J_first_num" class="{isFirstGray}" data-href="" >上一页</a>' +
        '<a class="mySelect">' +
        '<span id="J_currentPaging" class="cur_page">{currentPage}/{pageNum}</span>' +
        '<em class="page_arrow"></em>' +
        '<select class="pagination-select" id="J_paging_select" data-current-page="{currentPage}">{selectOptions}</select>' +
        '</a>' +
        '<a id="J_last_num" class="{isLastGray}" data-href="">下一页</a>';

    var liHtml = '<li class="layout-box">' +
        '<div class="box-cols"><div class="nowrap">{listName}</div></div>' +
        '<div>' +
        '<a class="book-section-playing hide">' +
        '<img src="/images/playing/01.png">' +
        '</a>' +
        '<a class="book-section-play"><i class="iconfont"></i></a>' +
        '</div>' +
        '<input type="hidden" name="path" value="{listPath}">' +
        '<input type="hidden" name="name" value="{listName}">' +
        '<input type="hidden" name="id" value="{listAudioId}">' +
        '<input type="hidden" name="bookName" value="{listName}">' +
        '<input type="hidden" name="link" value="{link}">' +
        '</li>';

    function CreatePage(bookId, pageSize) {
        this.listNum = 1; //总条数
        this.pageNum = 1; //总页数
        this.pageSize = pageSize || 20; //一页多少条
        this.selectPage = 1; //当前页数
        this.bookId = bookId;

        this.initPage();
    };

    CreatePage.prototype = {

        initPage: function() {
            this.render();
        },

        // selectPage 选择页
        getLocalDataById: function() {
            var currentList = [], // 当前缓存的数据，如第一页1-20条，第二页21-40 
                first = null,
                second = null;
            if (!this.bookId) {
                throw new Error('bookId is required!');
            }
            this.data = window.localStorage.getItem(this.bookId);
            if (this.data) {
                this.data = JSON.parse(this.data);
                this.listNum = this.data.length || 0; //总条数
                this.pageNum = Math.ceil((this.listNum) / (this.pageSize)); //总页数

                //selectPage 1:1--21 = (1-1)*20+1 --1*20+1 
                //           2:21--41 = (2-1)*20+1 -- 2*20+1
                //           3:41--61 = (3-1)*20+1 -- 3*20+1 
                first = parseInt((this.selectPage - 1) * (this.pageSize) + 1);
                second = parseInt(this.selectPage * (this.pageSize)) + 1;

                currentList = this.data.slice(first, second);
            }
            return currentList
        },

        render: function() {           
			this.goToselectUrl();
            this.bindEventForSelect();
        },

        outputHtml: function() {
            var i = 0,
                len = 0,
                html = '',
                selectHtml = '',
                $pageing = $('#J_album_paging'), //分页容器
                isFirstGray = (this.selectPage > 1) ? '' : 'btn-gray',
                isLastGray = (this.selectPage == this.pageNum) ? 'btn-gray' : '';

            for (i, len = this.pageNum; i < len; i++) {
                selectHtml += '<option value=' + (i + 1) + ' data-href="" class="layout-box">' + (i + 1) + '</option>';
            }
            html = pageHtml.replace(/{isFirstGray}/g, isFirstGray)
                .replace(/{currentPage}/g, this.selectPage)
                .replace(/{pageNum}/g, this.pageNum)
                .replace(/{isLastGray}/g, isLastGray)
                .replace(/{selectOptions}/g, selectHtml);
            $pageing.html(html);
        },

        goToselectUrl: function() {
        	this.renderData();
        	this.outputHtml();          
        },

        stopPropagation: function(e) {
            e.preventDefault();
            e.stopPropagation();
        },

        renderData: function() {
            var html = '';
            var $container = $('.book-section ul');

            var htmlData = this.getLocalDataById(this.bookId);

            for (var i = 0, len = htmlData.length; i < len; i++) {
                html += liHtml.replace(/{listName}/g, htmlData[i].name)
                    .replace(/{listPath}/g, htmlData[i].path)
                    .replace(/{listAudioId}/g, htmlData[i].id)
                    .replace(/{listName}/g, htmlData[i].name)
                    .replace(/{link}/g, htmlData[i].link)
            }
            $container.html(html);
        },

        bindEventForSelect: function() {
            var self = this;

            //上一页
            $('#J_album_paging').on('click', '#J_first_num', function(e) {
                var $this = $(this);
                if ($this.hasClass('btn-gray')) {
                    return
                }
                self.selectPage = self.selectPage - 1;
                self.goToselectUrl(self.selectPage);

                self.stopPropagation(e);
            }).on('click', '#J_last_num', function(e) { //下一页
                var $this = $(this);
                if ($this.hasClass('btn-gray')) {
                    return
                }
                self.selectPage = parseInt(self.selectPage, 10) + 1;
                self.goToselectUrl(self.selectPage);

                self.stopPropagation(e);
            }).on('click', '#J_paging_select', function(e) { //select
                var $this = $(this),
                    $select = $('#J_currentPaging');
                $select.addClass('opacity1');

                self.stopPropagation(e);
            }).on('change', '#J_paging_select', function(e) {
                var $this = $(this),
                    href = $this.find('option:selected').attr('data-href'),
                    current = parseInt($this.attr('data-current-page'));

                self.selectPage = parseInt($this.val());
                self.goToselectUrl(self.selectPage);
            });
        }
    };
    module.exports = CreatePage;
})
