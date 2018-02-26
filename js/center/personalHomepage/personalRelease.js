//tab切换     动态      视频
$(function() {
    //调用获取个人信息
    findUserInformation(UserName,UserName);
    //可能认识的人
    recommendRosters(UserName);

    $('.dynamic .home .alreadyPub').click(function() {
        window.location.href = "/center/me/release.html";
    });
    //下拉加载动态
    $(".dynamic .professionalCircle .alreadyPro").on("click", function() {
        window.location.href = "/center/me/release.html?type=1"
    });


    $(document).on("click",".dynamic .home .selectPub",function() {
        $(this).next(".citType").toggle();
    });

    $(document).on("click",".dynamic .professionalCircle .selectPub",function() {
        $(this).next(".citType").toggle();
    });


    //加载所有动态
    if(getURIArgs("type") == "") {
        $('.dynamic .home').addClass('list_bg');
        $('.dynamic .home').find(".bg_br").show();
        $('.dynamic .home .selectPub').css("display","inline-block");
        findIndexTopics(1,"",1);

        var page = 1;
        var stop = false; //触发开关，防止多次调用事件
        $(window).scroll(function(event) {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height(); //整个文档的高度
            var windowHeight = $(this).height();
            if(scrollTop + windowHeight + 2>= scrollHeight) {
                if(stop == true) {
                    stop = false;
                    $(".collectionVideo").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
                    page = page + 1;
                    findIndexTopics(page,"",1,1);
                }
            }
        })
    }


    //选择已发布的产品分类
    $(document).on("click",".js_cityType a",function(){
        $(".Collect_list").html("");
        $(this).parent().hide();
        $(".js_cityType a").removeClass("ctActive");
        $(this).addClass("ctActive");
        if(getURIArgs("type")==1){
            findIndexTopics(1,$(this).attr("data-type"),0);
        }else{
            findIndexTopics(1,$(this).attr("data-type"),1);
        }
    });


    if(getURIArgs("type") == 1) {
        $('.jiazai').remove();
        $(".dynamic .professionalCircle").addClass('list_bg');
        $(".home").removeClass('list_bg');
        $(".dynamic .professionalCircle").find(".bg_br").show();
        $('.dynamic .professionalCircle .selectPub').css("display","inline-block");
        $(".home .bg_br").hide();
        $(".Collect_list").html("");
        findIndexTopics(1,"",0);
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
                    findIndexTopics(page,"",0,1);
                }
            }
        })
    }


    function findIndexTopics(page,type,isSale,load) {
        var str = "";
        $.ajax({
            type: "post",
            url: serviceHOST() + "/tcProduct/findTcProductList.do",
            data: {
                username: UserName,
                isCommit:1,
                isSale:isSale,
                type:type||"",
                pageNum:page||1,
                pageSize:10
            },
            dataType: "json",
            headers: {
                "token": qz_token()
            },
            success: function(msg) {
                $('.jiazai').remove();
                if (msg.status == 0) {
                    stop = true;
                    var mssg = msg.data;
                    if (mssg.length==0) {
                        if(load==1){
                            stop = false;
                            return false;
                        }
                        $(".Collect_list").html('<div class="no_collect"><img src="/img/nodata.png"/ align="top"><p>暂无数据</p><a href="/shangcheng/prd/hot.html">前往同城服务</a></div>')
                        return false;
                    }
                    for (var i = 0; i < mssg.length; i++) {
                        var nums = (page - 1) * mssg.length + i;
                        var imagepath = mssg[i].tcProduct.imagepath; //文章图片
                        var commentlist = mssg[i].tcLeaveWordList; //评论人列表
                        var clickMaplist = mssg[i].clickMaplist; //点赞人头像
                        if (mssg[i].user != null && mssg[i].user != "") {
                            //帖子用户信息
                            str = PostDynamicUserDetails(mssg[i],1);

                            ////工作职位薪资
                            str+=jobSalaryShowFun(mssg[i]);

                            // 加载帖子文章内容
                            str += DynamicPostArticles(mssg[i]);

                            //文章图片
                            str += TheArticleShowUsShop(mssg[i], imagepath);

                            //判断是否商品下架
                            //去编辑，去转发，发布位置
                            str += DetermineWhetherPraiseShop(mssg[i],1);

                            //帖子评论动态  评论
                            str += PostCommentsContent(mssg[i], commentlist, nums, str, $(".Collect_list"));
                            stop = true;
                        }
                    }
                }else if(msg.status==-3){
                    getToken();
                }else if(msg.status==-1){
                    stop = true;
                    var mssg = msg.data;
                    if (mssg.length==0) {
                        if(load==1){
                            stop = false;
                            return false;
                        }
                        $(".Collect_list").html('<div class="no_collect"><img src="/img/nodata.png"/ align="top"><p>暂无数据</p><a href="/shangcheng/prd/hot.html">前往同城服务</a></div>')
                        return false;
                    }
                };
            },
            error: function() {
                console.log("error")
            }

        });

    }

});