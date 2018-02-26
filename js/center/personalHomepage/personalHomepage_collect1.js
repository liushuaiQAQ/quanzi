//tab切换     动态      视频    信息中心
$(function() {
    //调用获取个人信息
    findUserInformation(UserName,UserName);
    //可能认识的人
    recommendRosters(UserName);

    $('.dynamic .home').click(function() {
        window.location.href = "/center/me/collect.html";
    });
    //下拉加载动态
    $(".dynamic .professionalCircle").on("click", function() {
        window.location.href = "/center/me/collect.html?type=1"
    });

    $(".dynamic .inforCenter .alreadyPub").on("click", function() {
        window.location.href = "/center/me/shopCollect.html?type=2"
    });
    $(document).on("click",".dynamic .inforCenter .selectPub",function() {
        $(this).next(".citType").toggle();
    });

    //选择已发布的产品分类
    $(document).on("click",".js_cityType a",function(){
        $(".Collect_list").html("");
        $(this).parent().hide();
        $(".js_cityType a").removeClass("ctActive");
        $(this).addClass("ctActive");
        informationCenter(1,$(this).attr("data-type"));
    });




    //加载所有动态
    if(getURIArgs("type") == "") {
        $('.dynamic .home').addClass('list_bg');
        $('.dynamic .home').find(".bg_br").show();
        findIndexTopics(1);
    }

    if(getURIArgs("type") == 1) {
        $('.jiazai').remove();
        $(".dynamic .professionalCircle").addClass('list_bg');
        $(".home").removeClass('list_bg');
        $(".dynamic .professionalCircle").find(".bg_br").show();
        $(".home .bg_br").hide();
        $(".Collect_list").html("");
        getVmcollection(1);
        var page = 1;
        var stop = false; //触发开关，防止多次调用事件
        $(window).scroll(function(event) {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height(); //整个文档的高度
            var windowHeight = $(this).height();
            if(scrollTop + windowHeight + 2 >= scrollHeight) {
                if(stop == true) {
                    stop = false;
                    $(".collectionVideo").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
                    page = page + 1;
                    getVmcollection(page);
                }
            }
        })
    }




    //信息中心
    if(getURIArgs("type") == "2") {
        $('.jiazai').remove();
        $('.dynamic ul li').removeClass('list_bg');
        $('.dynamic ul .bg_br').hide();
        $('.dynamic .inforCenter').addClass('list_bg');
        $('.dynamic .inforCenter').find(".bg_br").show();
        $(".Collect_list").html("");
        informationCenter(1,"");

        var page = 1;
        var stop = false; //触发开关，防止多次调用事件
        $(window).scroll(function(event) {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height(); //整个文档的高度
            var windowHeight = $(this).height();
            if(scrollTop + windowHeight + 2>= scrollHeight) {
                if(stop == true) {
                    console.log(page);
                    stop = false;
                    $(".collectionVideo").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
                    page = page + 1;
                    informationCenter(page,$(".js_cityType a").attr("data-type"),1);
                }
            }
        })
    }

    function informationCenter(page,type,load) {
        var str = "";
        $.ajax({
            type: "post",
            url: serviceHOST() + "/tcFavorite/findTcFavorite.do",
            data: {
                username: UserName,
                type:type||"",
                pageNum:page||1,
                pageSize:10
            },
            dataType: "json",
            headers: {
                "token": qz_token()
            },
            success: function(msg) {
                $('.jiazai,.Toloadmore').remove();
                if (msg.status == 0) {
                    stop = true;
                    var mssg = msg.data;
                    if (mssg.length==0) {
                        if(load==1){
                            stop = false;
                            return false;
                        }
                        $(".Collect_list").html('<div class="no_collect"><img src="/img/nodata.png"/ align="top"><p>尚未收藏</p><a href="/shangcheng/prd/hot.html">前往同城服务</a></div>')
                        return false;
                    }
                    for (var i = 0; i < mssg.length; i++) {
                        var nums = (page - 1) * mssg.length + i;
                        var imagepath = mssg[i].tcProduct.imagepath||[]; //文章图片
                        var commentlist = mssg[i].tcLeaveWordList; //评论人列表
                        var clickMaplist = mssg[i].clickMaplist; //点赞人头像
                        if (mssg[i].user != null && mssg[i].user != "") {
                            //帖子用户信息
                            str = PostDynamicUserDetails(mssg[i]);


                            //工作职位薪资
                            str+=jobSalaryShowFun(mssg[i]);

                            // 加载帖子文章内容
                            str += DynamicPostArticles(mssg[i]);

                            //文章图片
                            str += TheArticleShowUsShop(mssg[i], imagepath);

                            //判断是否商品下架
                            //去编辑，去转发，发布位置
                            str += DetermineWhetherPraiseShop(mssg[i],2);

                            //帖子评论动态  评论
                            str += PostCommentsContent(mssg[i], commentlist, nums, str, $(".Collect_list"));
                            stop = true;

                        }

                    }
                }else if(msg.status==-3){
                    getToken();
                };
            },
            error: function() {
                console.log("error")
            }

        });
    };
});
