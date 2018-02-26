$(function () {
    //评论表情
    $("a.emotion").live("click", function (e) {
        var divid = $("#shuaiId");
        smohanfacebox($(this), divid, "txtId");
    });



    //	调取文章详情接口
    var strkq = "";
    findTopic_DynamicDetails(UserName);
    function findTopic_DynamicDetails(datas) {
        $.ajax({
            type: "post",
            url: serviceHOST() + '/tcProduct/selectTcProductByProductId.do',
            data: {
                "productId": getURIArgs("id"),
                "username": datas
            },
            headers: {
                "token": qz_token()
            },
            dataType: "json",
            success: function (msg) {
                if (msg.status == 0) {
                    if(msg.data.user.username==datas){
                        getDetails(msg.data,1);
                        if(msg.data.interestedProductList.length>0){
                            $(".js_interestedPro").show();
                            $(".js_interestedPro .cityHot_head a").attr("data_type",msg.data.tcProduct.type);
                            $(".js_interestedPro .cityHotList").html(contentLeftFunList(msg.data.interestedProductList.splice(0,3),2));
                        }
                    }else{
                        strkq = "login_window";
                        getDetails(msg.data,2);
                        if(msg.data.tcProductVOList.length>1){
                            $(".js_hieRelease").show();
                            $(".js_hieRelease .cityHotList").html(contentLeftFunList(msg.data.tcProductVOList.splice(0,3),1));
                        }
                        if(msg.data.interestedProductList.length>0){
                            $(".js_interestedPro").show();
                            $(".js_interestedPro .cityHot_head a").attr("data_type",msg.data.tcProduct.type);
                            $(".js_interestedPro .cityHotList").html(contentLeftFunList(msg.data.interestedProductList.splice(0,3),2));
                        }
                    }

                    autosize(document.querySelectorAll('.qz_handle textarea'));
                    //调用显示更多插件。参数是标准的 jquery 选择符
                    $.showMore(".showMoreNChildren"); //视频相关加载更多，就这一句话
                } else if (msg.status == -3) {
                    getToken();
                }
                ;
            },
            error: function () {
                console.log("error")
            }
        });
    }


    /*
     *
     *
     * 推荐里面的图片功能
     * */

    //价格
    var peiceShowAllAry= {
        0: "面议",
        1: "1000元以下/月",
        2: "1000-2000元/月",
        3: "2000-3000元/月",
        4: "3000-5000元/月",
        5: "5000-8000元/月",
        6: "8000-12000元/月",
        7: "12000-20000元/月",
        8: "20000-25000元/月",
        9: "25000元以上/月"
    }
    function getDetails(msg,type) {
        var str = "";

        //标题信息模块
        $(".dynamic_title .dynamic_title_top h3").html(msg.tcProduct.title);
        if(msg.tcProduct.type==1){
            $(".dynamic_title .dynamic_title_top span").html(msg.tcProduct.originalPrice?peiceShowAllAry[msg.tcProduct.originalPrice]:peiceShowAllAry[0]);
        }else{
            $(".dynamic_title .dynamic_title_top span").html((msg.tcProduct.price!=0)?msg.tcProduct.price+"元/月":"面议");
        }

        $(".dynamic_title .dynamic_title_bottom i").eq(0).html(formatTime(msg.tcProduct.updatetime));
        $(".dynamic_title .dynamic_title_bottom i").eq(1).html(msg.tcProduct.browseCount);

        //内容
        if(msg.tcProduct.videourl){
            $(".dynamic_video").show();
            $(".video_box video").attr("src", ImgHOST() + msg.tcProduct.videourl);
            $(".video_box video").attr("poster", ImgHOST() + msg.tcProduct.videourl+"-start");
            var urlImg=ImgHOST()+msg.tcProduct.videourl+"-start";
            $('.vjs-poster').css("background-image", 'url(' + urlImg+ ')'); //视频封面图
        }else if(msg.tcProduct.imagepath.length>0){
            $(".dyncon_picture").show();
            $(".dyncon_picture").attr("imgList",JSON.stringify(msg.tcProduct.imagepath));
            $(".dyncon_picture .leftNum,#viewNum").html("<i>1</i>/"+msg.tcProduct.imagepath.length);
            $("#leftImg").html(imgStrFun(msg.tcProduct.imagepath));
            $("#smallPic").html(imgStrFunB(msg.tcProduct.imagepath));
            $("#leftImg li").eq(0).addClass("actives");
        }
        $(".dyncon_word").html(msg.tcProduct.content);
        //定位
        $(".pos_address .pos_area_item").html(msg.tcProduct.location.split("|").join("-"));
        $(".posAddressDetails").html(msg.tcProduct.address);
        $(".js_pos_area_map").attr({lng:msg.tcProduct.longitude,dim:msg.tcProduct.dimensionality});

        //发布者头像信息
        //用户头像有无
        var strHead="";
        strHead+='<div class="circle_bg"></div>';
        if (msg.user.imgforheadlist == "") {
            strHead += '<a data-name="'+msg.user.username+'" href="javascript:;" class="circle_img"> <img src="/img/first.png"> </a>';
        } else {
            strHead += '<a data-name="'+msg.user.username+'" href="javascript:;" class="circle_img"> <img src="' + ImgHOST() + msg.user.imgforheadlist[0].imagepath + '" > </a>';
        }
        //是否有备注名
        if (msg.remark != "" && msg.remark != null && msg.remark != "null") {
            if(msg.remark!=msg.user.username)  msg.user.nickname = msg.remark;
        }
        strHead+='<p class="circle_name"><b data-name="'+msg.user.username+'" >' + (msg.user.nickname||shieldNumber(msg.user.username)) + '</b>';
        //用户等级   和会员等级   性别
        if (msg.user.level >= 16) {
            msg.user.level = "N";
        }
        if (msg.user.sex == "男" || msg.user.sex == "女") {
            strHead += '<span class="gradeImg"><img src="/img/h/sj_' + user_level[msg.user.sex.charCodeAt()] + '_' + msg.user.level + '.png"/></span>';
        } else {
            strHead += '<span class="gradeImg"><img src="/img/h/sj_boy_' + msg.user.level + '.png"/></span>';
        }
        if (msg.user.viplevel != "0") {
            strHead += '<span class="vipImg"><img src="/img/h/sj_VIP_' + msg.user.viplevel + '.png"/></span>';
        }
        strHead+='</p>'+
        '<div class="company_name"><span>'+(msg.user.hometown||"")+'</span><span>'+msg.user.myindustry+'</span></div>';
        if(type==2){
            if(msg.user.imgforheadlist && msg.user.imgforheadlist[0]) {
                strHead += '<div class="contract_name"><a class="fast_contact ' + no_login + '" href="javascript:;" data-magicno="' + msg.user.id + '" data-nick="' + (msg.user.nickname || shieldNumber(msg.user.username)) + '" data-oldname="' + msg.user.username + '@imsvrdell1" data-img="' + ImgHOST() + msg.user.imgforheadlist[0].imagepath + '" data-myindustry="' + msg.user.myindustry + '">快速联系</a></div>';
            } else {
                strHead += '<div class="contract_name"><a class="fast_contact" href="javascript:;" data-magicno="' + msg.user.id + '" data-nick="' + (msg.user.nickname || shieldNumber(msg.user.username)) + '" data-oldname="' + msg.user.username + '@imsvrdell1" data-img="/img/first.png" data-myindustry="' + msg.user.myindustry + '">快速联系</a></div>';
            }
        }
        $(".right_top").html(strHead);

        //评论收藏
        var topictypeShop="";
        if(msg.tcProduct.videourl){
            topictypeShop=2;
        }else{
            topictypeShop=0;
        }
        str += '<div class="content_items content_itemsShop" data-prdtype="' + msg.tcProduct.type + '" data-type=' +topictypeShop + ' data-id=' + msg.tcProduct.id + ' data-name=' + msg.user.username + '>';

        if(type==1){
            str+='<div class="qz_handle qz_handleShop">' +
                '<ul class="qz_row_line">' +
                '<li>'+
                '<a class="again_edit" href="/shangcheng/publish/index.html?productId='+msg.tcProduct.id+'" ><span>去编辑</span></a>'+
                '</li>'+
                '<li style="padding-left: 0;" proId="'+msg.tcProduct.id+'" >';
            if(msg.tcProduct.isSale) {
                str+='<a    class="commodityFrame js_commodityFrame" href="javascript:;"><span>商品下架</span></a>';
            }else{
                str+='<a  class="againCommodityFrame js_againCommodityFrame" href="javascript:;"><span>重新上架</span></a>';
            }
            str+='</li>'+
            '<li>';
            if(!msg.tcProduct.isSale){
                str+='<a class="thoroughDelete" proId="'+msg.tcProduct.id+'" href="javascript:;"><i></i>彻底删除</a>';
            }else{
                str+='<a class="transpond" href="javascript:;"><i></i>转发</a><div class="retransmission"></div>';
            }
                //'<a class="transpond" href="javascript:;"><i></i>转发</a><div class="retransmission"></div>'+
           str+='</li></ul>';
        }else if(type==2){
            str+='<div class="qz_handle qz_handleShop">' +
                '<ul class="qz_row_line">' +
                '<li>';
            if(msg.user.imgforheadlist && msg.user.imgforheadlist[0]) {
                str += '<a class="fast_contact ' + no_login + '" href="javascript:;" data-magicno="' + msg.user.id + '" data-nick="' + (msg.user.nickname || shieldNumber(msg.user.username)) + '" data-oldname="' + msg.user.username + '@imsvrdell1" data-img="' + ImgHOST() + msg.user.imgforheadlist[0].imagepath + '" data-myindustry="' + msg.user.myindustry + '"><span>快速联系</span></a>';
            } else {
                str += '<a class="fast_contact" href="javascript:;" data-magicno="' + msg.user.id + '" data-nick="' + (msg.user.nickname || shieldNumber(msg.user.username)) + '" data-oldname="' + msg.user.username + '@imsvrdell1" data-img="/img/first.png" data-myindustry="' + msg.user.myindustry + '"><span>快速联系</span></a>';
            }
                //'<a class="fast_contact" href="javascript:;"><span>快速联系</span></a>'+
            str +='</li>';
            //收藏
            if (msg.favorite) {
                str += '<li><a proId="'+msg.tcProduct.id+'"  data_type="'+msg.tcProduct.type+'" href="javascript:;" class="collection collection_shopCancel"><i></i><span>取消收藏</span></a></li>';
            } else {
                str += '<li><a proId="'+msg.tcProduct.id+'"  data_type="'+msg.tcProduct.type+'" class="collection collection_post_shop ' + no_login + '" href="javascript:;"><i></i><span>收藏</span></a></li>';
            }
            str+='<li>|</li>'+
                '<li>'+
                '<a class="contact_method" href="javascript:;" ><i></i><span>联系方式</span></a>'+
                '<div class="contact_showInfo">' +
                '<ul>'+
                '<li><i></i><span>'+msg.tcProduct.contacts+'</span></li>' +
                '<li><i></i><span>'+msg.tcProduct.mobile+'</span></li>';
                if(msg.tcProduct.otMobile){
                    str+='<li><i></i><span>'+msg.tcProduct.otMobile+'</span></li>';
                }
                str+='</ul>'+
                '</div>'+
                '</li>'+
                '<li>|</li>'+
                '<li>'+
                '<a class="transpond" href="javascript:;"><i></i>转发</a><div class="retransmission"></div>'+
                '</li>' +
                '<li>|</li>'+
                '<li class="more_box">' +
                '<a class="list_more" href="javascript:;"><i></i><span>更多</span></a>'+
                '<ul class="fl_menu_list">'+
                '<li class="complaint ">举报</li><ul></ul>'+
                '</ul>'+
                '</li>'+
                '</ul>';
        }

        str += '<div class="shop_publishBox"><div class="qz_publish">' +
            '<div class="qz_face">'
        //用户头像有无
        if (!getCookie("headImgkz")) {
            str += '<img src="/img/first.png" alt="" />'
        } else {
            if (getCookie("headImgkz").indexOf("http") > -1) {
                str += '<img src="' + getCookie("headImgkz") + '" alt="">';
            } else {
                str += '<img src="' + ImgHOST() + getCookie("headImgkz") + '" alt="">';
            }
        }
        str += '</div>' +
            '<div class="p_input">' +
            '<textarea class="Postcomment" id="txtId" placeholder="写留言…" name="review_1"  /></textarea>' +
            '</div>' +
            '</div>' +
            '<div class="review_1"></div></div>';

        $(".dynamic_list").append(str);
        /****************************点赞    评论   转发开始*********************************/

        /*
         *
         *帖子评论列表展示
         */
        if (UserName) {
            findTopicComments(1, UserName);
        } else {
            strkq = "login_window"
            findTopicComments(1, "nouser");
        }

        function findTopicComments(page, datas) {
            var str = "";
            $.ajax({
                type: "post",
                url: serviceHOST() + "/tcLeaveWord/select.do",
                dataType: "json",
                headers: {
                    "token": qz_token()
                },
                data: {
                    productId:getURIArgs("id")
                },
                success: function (msg) {
                    if (msg.status == 0) {

                        //一级评论内容
                        var commentlist = msg.data; //评论个数
                        if (commentlist == null) {
                            $(".chitchatBox").html("<div style='text-align: center; line-height: 200px;'>暂无评论内容，赶紧占座评论吧</div>")
                        } else {
                            str += '<ul class="stairComment commentListsOne showMoreNChildren" pagesize="20">'
                            for (var k = 0; k < commentlist.length; k++) {
                                str += Level1_comment(commentlist[k]);
                                //二级评论内容
                                if(commentlist[k].list){
                                    str += TwoList(commentlist[k].list, commentlist);
                                }
                                str += '</ul>' +
                                    '<div class="ansecondary"></div>' +
                                    '</div>' +
                                    '</li>';
                            }
                            str += '</ul>';
                        }
                    } else if (msg.status == -3) {
                        getToken();
                    }
                    $(".chitchatBox").append(str);

                    $.showMore(".showMoreNChildren"); //视频相关加载更多，就这一句话
                    $(".chitchatBox .more").html("查看更多<i>")
                },
                error: function () {
                    console.log("error")
                }
            });
        }

        /****************************点赞    评论   转发end*********************************/
            //自己发帖 点击加载  收藏 投诉   加为好友
        $(document).on("click", ".message_right .Others_d", function (e) {
            e.stopPropagation();
            $(this).siblings(".dropMenu").toggle();
        })
        $(document).on('click', function () {
            $(".dropMenu").hide();
        })
        $(document).on('click', ".dropMenu", function (e) {
            e.stopPropagation(); //阻止冒泡
        })


        //发表一级评论
        $(document).on("click", ".content_items .review_1 .publish", function () {
            if (getCookie("username")) {
                if ($(".chitchatBox .stairComment").html() == undefined) {
                    $(".chitchatBox").empty().append("<ul class='stairComment'></ul>");
                }
                var id=getURIArgs("id");
                var childusername = getCookie('username'); //评论者用户名
                var content = html2Escape($(this).parents(".qz_handle").find(".p_input .Postcomment").val()); //内容
                var comments_item = $(".chitchatBox .stairComment");
                createComment(id, 0, childusername, content,comments_item,1);
            }
        })

        //发表二级评论
        $(document).on("click", ".chitchatBox .revert_box .import .publish", function () {
            if (getCookie("username")) {
                var id=getURIArgs("id");
                var childusername = getCookie("username"); //评论者用户名
                var content = html2Escape($(this).parents(".import").find(".Postcomment").val()); //内容
                var pid=$(this).parents(".revert_box").attr("data-id");
                var comments_item = $(this).parents("li.comments-item").find(".comments-item-bd .mod-comments-sub ul");
                var stairComment = $(this).parents(".chitchatBox .stairComment");
                createComment(id, pid, childusername, content, comments_item,2);
            }
        })

        //评论
        function createComment(productId, pid, username, content, comments_item,type) {
            if ($.trim(content) == "") {
                warningMessage("评论内容不能为空");
                return false;
            } else if (content.length > 140) {
                warningMessage("评论内容不能超过140个汉字");
                return false;
            }
            $.ajax({
                type: "post",
                url: serviceHOST() + "/tcLeaveWord/create.do",
                data: {
                    productId: productId,
                    pid: pid,
                    username: username,
                    content: content
                },
                dataType: "json",
                headers: {
                    "token": qz_token()
                },
                success: function (msg) {
                    if (msg.status == 0) {
                        $(".detail_left .p_input .Postcomment").val("");
                        $(".detail_left .import .Postcomment").val("");
                        var mssg = msg.data;
                        stairComment(mssg, comments_item,type);
                        friendlyMessage("评论成功");
                        $(".detail_left .revert_box .reply").hide();
                        publish = "发表";
                    } else if (msg.status == -3) {
                        getToken();
                    }else if(msg.status=="-1"){
                        warningMessage(msg.info);
                    }
                    ;
                },
                error: function () {
                    console.log("error")
                }

            });
        }

        //一级评论  和  二级评论
        function stairComment(mssg, comments_item,type) {
            var str = '<li class="comments-item" data-id="'+mssg.id+'" data-name="'+mssg.username+'">' +
                '<div class="comments-item-bd">' +
                '<div class="ui-avatar">';
            //评论者头像
            if (UserImg == "") {
                str += '<img src="/img/first.png" />';
            } else {
                str += '<img src="' + ImgHOST() + UserImg + '" />';
            }

            str += '</div>' +
                '<div class="comments-content">';
            if (type == 1) {
                str += '<a href="javascript:;" class="qz_name"  data-name=' + mssg.userName + '>' + (mssg.nickName || shieldNumber(mssg.nickName)) + '</a>：<span>' + toFaceImg(mssg.content) + '</span>';
            } else {
                str += '<a href="javascript:;" class="qz_name" data-name=' + mssg.userName + '>' + (mssg.nickName || shieldNumber(mssg.nickName)) + '</a><span>回复</span>' +
                    '<a href="javascript:;" class="qz_name reply_content" data-name=' + mssg.parentusername + '>' + mssg.repliedGuyName + '</a>' + toFaceImg(mssg.content) + '';
            }
            str += '<div class="comments-op">' +
                '<span class="ui-mr10 state">' + formatTime(mssg.createtime) + '</span>' +
                '<a href="javascript:;" class="act-reply" title="回复"></a>' +
                '<a href="javascript:;" class="oneselfdel"></a>' +
                '</div><div class="revert_box" data-id="'+mssg.id+'" ></div>' +
                '</div>';
            if (type==1) {
                str += '<div class="comments-list mod-comments-sub"><ul></ul>' + //二级评论容器
                    '<div class="ansecondary"></div>' +
                    '</div>';
            }
            str += '</li>';
            comments_item.append(str);
        }


        $(document).on("click", ".qz_row_line .transpond", function (e) {
            var _this = $(this);
            var con = $(this).parents(".content_items");
            commonShare(_this, con);
            e.stopPropagation();
        });
        $(document).on("click", function (e) {
            $(".retransmission").hide();
            e.stopPropagation();
        });
        $(document).on("click", ".detail_right2 .right_transpond", function (e) {
            $(this).parents(".recommend_main").siblings().find(".retransmission").hide();
            var _this = $(this);
            var con = $(this).parents(".recommend_main");
            commonShare(_this, con)

            // 转发位置显示
            var zfOffset = $(".detail_right2").height() - 194;
            if (_this.offset().top - 130 > zfOffset && zfOffset > 0) {
                $(".right_handle .retransmission").css({
                    "left": "120px",
                    "top": "-168px"
                });
                $(".right_handle .retransmission .qrodeBox").css("top", 0);
            } else if (zfOffset < 0) {
                $(".right_handle .retransmission").css({
                    "left": "120px",
                    "top": "-168" - zfOffset + "px"
                });
                $(".right_handle .retransmission .qrodeBox").css("top", 0);
            } else {
                $(".right_handle .retransmission").css({
                    "left": "120px",
                    "top": "30px"
                });
            }
            e.stopPropagation();
        });
        $(document).on("click", ".qz_row_line .retransmission,.detail_right2 .right_transpond", function (e) {
            e.stopPropagation();
        });


        function commonShare(thisT, pars) {
            $(".retransmission").empty();
            var fx = '<span class="wordShare">分享到</span>' +
                '<a href="javascript:;" class="circle_zone ' + strkq + '">圈子朋友圈</a>' +
                '<a href="javascript:;" class="circle_friends ' + strkq + '">圈子好友</a>' +
                    //'<a href="javascript:;" class="circle_group '+strkq+'">圈子群组</a>' +
                '<a href="javascript:;" class="circle_indexhot ' + strkq + '">首页热门</a>' +
                '<a href="javascript:;" class="wechat_zone">' +
                '<span>微信朋友圈</span>' +
                '<div class="qrodeBox">' +
                '<p>分享到微信朋友圈</p>' +
                '<div></div>' +
                '</div>' +
                '</a>' +
                '<a href="javascript:;" class="qq_zoneShop">QQ空间</a>' +
                '<a href="javascript:;" class="qq_friendsShop">QQ好友</a>';
            thisT.siblings(".retransmission").html(fx);
            //生成微信朋友圈二维码
            var topicNum = pars.attr("data-id");
            var topicUsername = pars.attr("data-name");
            if (pars.attr("data-type") == "8") {
                var pageUrl = pars.find(".specialOn").attr("data-page");
                var urls = pageUrl;
            } else {
                var urls = serHOST() + '/Page/prd/detail.html?id=' + topicNum;
            }
            thisT.siblings(".retransmission").find(".qrodeBox div").qrcode({
                render: "canvas",
                width: 30 * 4,
                height: 30 * 4,
                text: urls
            });
            thisT.siblings(".retransmission").toggle();
        }

        //点击显示一级评论发表
        $(document).on("focus", ".content_items .qz_publish .Postcomment", function () {

            var fabiao = '<a href="javascript:;" class="emotion"></a>' +
                '<a href="javascript:;" class="publish ' + strkq + '">发表</a>' +
                '<div id="shuaiId"></div>';
            $(".content_items .review_1").html("");
            $(".content_items .comments-content .revert_box").html("");
            $(this).css({
                "border-color": "#3FA435",
                "color": "#333"
            })
            $(".detail_left .comments-content .revert_box").html("");
            $(this).parents(".qz_handle").find(".review_1").html(fabiao);
            $(".Postcomment").removeAttr("id");
            $(this).attr("id", "txtId") //表情内容框
        })

        $(document).on("blur", ".content_items .qz_publish textarea", function (e) {
            $(".content_items").find(".Postcomment").css({
                "border-color": "#ccc",
                "color": "#ccc"
            });
        })
        //点击显示二级评论发表
        $(document).on("click", ".chitchatBox .comments-content .act-reply", function (e) {

            $(".Postcomment").removeAttr("id");
            e.stopPropagation();
            var qz_name = $(this).parents(".comments-content").find("a.qz_name").html();
            var str = '<div class="reply comments-item">' +
                '<div class="ui-avatar">';
            if (UserImg == "") {
                str += '<img src="/img/first.png" />';
            } else {
                str += '<img src="' + ImgHOST() + UserImg + '" />';
            }
            str += '</div>' +
                '<div class="import">' +
                '<textarea class="Postcomment" id="txtId" placeholder="回复&nbsp;' + qz_name + '：" name="review_1"  /></textarea>' +
                '<div class="release">' +
                '<a href="javascript:;" class="emotion"></a>' +
                '<a href="javascript:;" class="publish ' + strkq + '">发表</a>' +
                '<div id="shuaiId"></div>' +
                '</div>' +
                '</div>' +
                '</div>';
            $(".detail_left .comments-content .revert_box").html("");
            $(".detail_left .review_1").html("");
            $(this).parents(".comments-content").find(".revert_box").html(str);
            $(this).parents(".comments-content").find(".revert_box input").focus();
            autosize(document.querySelectorAll('#txtId'));
        })

        // 删除评论
        $(document).on("click", ".chitchatBox .comments-op .oneselfdel", function () {
            var commentNo = $(this).parent().next(".revert_box").attr("data-id"); //评论编号
            var username = getCookie("username"); //删帖者用户名
            var commentsitem = $(this).parent().parent().parent().parent();
            $.ajax({
                type: "post",
                url: serviceHOST() + "/tcLeaveWord/delete.do",
                dataType: "json",
                data: {
                    id:commentNo,
                    username: username
                },
                headers: {
                    "token": qz_token()
                },
                success: function (msg) {
                    if (msg.status == 0) {
                        commentsitem.remove();
                        friendlyMessage("删除评论成功");
                    } else if (msg.status == -3) {
                        getToken();
                    }
                    ;
                },
                error: function () {
                    console.log("error")
                }

            });
        })

    }


    //==============================新增功能开始====================================

    //分享空间
    $(document).on('click', '.content_items .qq_zoneShop,.content_items .qq_friendsShop', function() {
        var typeA = $(this).parents(".content_items").attr("data-type");
        var conItem = $(this).parents('.content_items');
        var _this=this;
        if (typeA == 2||typeA == 8) {
            var parCh = $(this).parents('.content_items').siblings('.dyncon_word');
            var boxs = $(".video_box video"); //2视频
        } else {
            var parCh = $(this).parents('.content_items').siblings('.dyncon_word');
            var boxs = $('#leftImg li');
        }
        if($(this).hasClass("qq_zoneShop")){
            openQqzoneT(conItem, parCh, boxs, typeA,_this);
        }else{
            shareQQfriendsT(conItem, parCh, boxs, typeA,_this);
        }

    });
    function openQqzoneT(parents, parChilren, imgBox, types,_this) {
        var topicNo = parents.attr('data-id');
        var topicName = parents.attr('data-name');
        if (types == 2||types == 8) { //视频
            if(parChilren.html()==""){
                pageTitle = encodeURIComponent("视频");
            }else{
                pageTitle = encodeURIComponent(parChilren.html().substr(0,30)|| "视频");
            };
            var hasImg = imgBox.attr("poster");
            if (hasImg) {
                snsPic = encodeURIComponent(hasImg);
            }
            if(parents.attr("data-prdtype")||parents.attr("data-prdtype")=="0"){
                pageUrl = encodeURIComponent(serHOST()+'/Page/prd/detail.html?id=' + topicNo);
            }else{
                pageUrl = encodeURIComponent(serHOST()+'/Page/news_details/newsDetails.html?topicNo=' + topicNo);
            }

        } else {
            if(parChilren.html()==""){
                pageTitle = encodeURIComponent("动态");
            }else{
                pageTitle = encodeURIComponent(parChilren.html().substr(0,30) || "动态");
            };
            var hasImg = imgBox.find('img');
            if (hasImg) {
                snsPic = encodeURIComponent(hasImg.eq(0).attr('src'));
            }
            if(parents.attr("data-prdtype")||parents.attr("data-prdtype")=="0"){
                pageUrl = encodeURIComponent(serHOST()+'/Page/prd/detail.html?id=' + topicNo);
            }else{
                pageUrl = encodeURIComponent(serHOST()+'/Page/news_details/newsDetails.html?topicNo=' + topicNo);
            }
        }
        if($(_this).hasClass("qq_zoneShop")){
            var shareqqzonestring = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?summary=' + pageTitle + '&url=' + pageUrl + '&pics=' + snsPic;
            window.open(shareqqzonestring, '_blank');
        }else{
            window.open('http://connect.qq.com/widget/shareqq/index.html?url=' + pageUrl + '&title=' + pageTitle + '&pic=' + snsPic);
        }

    }
    //分享到QQ好友
    function shareQQfriendsT(parents, parChilren, imgBox, types) {
        var topicNo = parents.attr('data-id');
        var topicName = parents.attr('data-name');
        if (types == 2||types == 8) { //视频
            if(parChilren.attr("data-content")=="undefined"){
                pageTitle = encodeURIComponent("视频");
            }else{
                pageTitle = encodeURIComponent(parChilren.attr("data-content") || "视频");
            };
            var hasImg = imgBox.attr("poster");
            if (hasImg) {
                snsPic = encodeURIComponent(hasImg);
            }
            if(parents.attr("data-prdtype")||parents.attr("data-prdtype")=="0"){
                pageUrl = encodeURIComponent(serHOST()+'/Page/prd/detail.html?id=' + topicNo);
            }else{
                pageUrl = encodeURIComponent(serHOST()+'/Page/news_details/newsDetails.html?topicNo=' + topicNo);
            }
        } else {
            if(parChilren.attr("data-content")=="undefined"){
                pageTitle = encodeURIComponent("动态");
            }else{
                pageTitle = encodeURIComponent(parChilren.attr("data-content") || "动态");
            };
            var hasImg = imgBox.find('img');
            if (hasImg) {
                snsPic = encodeURIComponent(hasImg.eq(0).attr('src'));
            }
            if(parents.attr("data-prdtype")||parents.attr("data-prdtype")=="0"){
                pageUrl = encodeURIComponent(serHOST()+'/Page/prd/detail.html?id=' + topicNo);
            }else{
                pageUrl = encodeURIComponent(serHOST()+'/Page/news_details/newsDetails.html?topicNo=' + topicNo);
            }
        }
        window.open('http://connect.qq.com/widget/shareqq/index.html?url=' + pageUrl + '&title=' + pageTitle + '&pic=' + snsPic);
    }


    //举报商城列表
    $(document).on("click", ".content_items .complaint", function() {
        var doTipEx = $(this).parents(".content_items").attr("data-id");
        if(UserName) doTipExcomplaint(UserName, doTipEx, 1);

    })

    //举报
    function doTipExcomplaint(tiperid, doTipEx, tiptype) {
        console.log(isPrd);
        var ComplaintsBounced = "";
        $(".ComplaintsBounced").remove();
        var type = "",isPrd=false;
        // 7 为举报问题
        if(tiptype == 7) {
            type = 1;
        } else {
            type = tiptype;
        }
        if(tiptype==1){
            isPrd=true;
        }
        $.ajax({
            type: "post",
            url: serviceHOST() + "/tip/getTipContents.do",
            dataType: "json",
            headers: {
                "token": qz_token()
            },
            data: {
                "tiptype": type
            },
            success: function(msg) {
                if(msg.status == 0) {
                    mssg = msg.data;
                    var ComplaintsBounced = '<div class="ComplaintsBounced" data-type=' + tiptype + ' data-id=' + doTipEx + ' data-prd="'+isPrd+'">' +
                        '<h3>举报<a class="Closecomplaint" href="javascript:;"></a></h3>' +
                        '<ul>';
                    for(var i = 0; i < mssg.length; i++) {
                        ComplaintsBounced += '<li>' + mssg[i].dictvalue + '<label><input type="checkbox" /></label></li>';
                    }
                    ComplaintsBounced += '<li class="rests">其他<label><input type="checkbox" /></label></li>' +
                        '</ul><div class="text_content">' +
                        '<textarea maxlength="50" placeholder="请在此填写投诉描述，不可超过50字哦~"></textarea><p><span id="tx_num">0</span>/50</p></div>' +
                        '<div class="Complaints_btn">' +
                        '<a href="javascript:;">提交</a>' +
                        '</div>' +
                        '</div>';
                    $("#mask,#maskss").show();
                    $("body").append(ComplaintsBounced).css("overflow", "hidden");
                } else if(msg.status == -3) {
                    getToken();
                };
            },
            error: function() {
                console.log("error")
            }

        });
    }


    // 投诉选择其他
    $(document).on("click", ".Closecomplaint", function(e) {
        e.stopPropagation();
        $("#mask,#maskss").hide();
        $("body").css("overflow", "auto");
        $(".ComplaintsBounced").remove();
    })
    $(document).on("click", ".ComplaintsBounced input", function() {
        $(".ComplaintsBounced label").removeClass("checked");
        $(".ComplaintsBounced input").attr("checked", false);
        $(this).attr("checked", "checked")
        $(".ComplaintsBounced textarea").val("");
        if($(this).attr("checked") == "checked") {
            $(this).parent().addClass("checked");
            reason = $(this).parent().parent().text();
            if(reason != "" && reason != "其他") {
                $(".Complaints_btn a").addClass("ts_submit");
            } else {
                $(".Complaints_btn a").removeClass("ts_submit");
            }
        }
        if($(".ComplaintsBounced .rests input").attr("checked") == "checked") {
            $(".text_content").find("span").html(0);
            $(".ComplaintsBounced .text_content").fadeIn();
            $(".ComplaintsBounced textarea").blur(function() {
                reason = html2Escape($(".ComplaintsBounced textarea").val() || "");
            });
        } else {
            $(".ComplaintsBounced .text_content").fadeOut();
        }

        //限制字数
        $(".ComplaintsBounced textarea").on("keyup", function() {
            checkLengths($(this), '50', "#tx_num");
            if($(this).val().length != 0) {
                $(".Complaints_btn a").addClass("ts_submit");
            } else {
                $(".Complaints_btn a").removeClass("ts_submit");
            }
        })

    })

//  举报
    $(document).on("click", ".Complaints_btn .ts_submit", function(e) {
        var doTipEx = $(".ComplaintsBounced").attr("data-id");
        var tiptype = $(".ComplaintsBounced").attr("data-type");
        var isPrd=$(".ComplaintsBounced").attr("data-prd");
        var postUrl="",daTa={};
        if(isPrd){
            postUrl=serviceHOST() + '/tcReport/createTcReport.do';
            daTa={
                "reason": reason,//举报原因
                "isReportId":doTipEx,
                "type":1,
                "username":UserName

            }
            daTa={
                "tcReport":JSON.stringify(daTa)
            }
        }else{
            postUrl=serviceHOST() + '/tip/doTipEx.do';
            daTa={
                "tiperid": UserName,
                "tipedid": doTipEx,
                "tiptype": tiptype, //举报种类
                "reason": reason //举报原因
            }
        }
        e.stopPropagation();
        $.ajax({
            type: "post",
            url: postUrl,
            dataType: "json",
            headers: {
                "token": qz_token()
            },
            data: daTa,
            success: function(msg) {
                $(".ComplaintsBounced").remove();
                $("#mask").hide();
                $("body").css("overflow", "auto");
                if(msg.status == 0) {
                    friendlyMessage("举报成功", function() {
                        $("#maskss,#mask").hide();
                    });
                } else if(msg.status == -3) {
                    getToken();
                } else {
                    friendlyMessage(msg.info, function() {
                        $("#maskss").hide();
                    });
                }
                return false;
            },
            error: function() {
                console.log("error")
            }

        });
    })



    //收藏与取消收藏
    $(document).on("click", ".content_items .collection_post_shop", function() {
        var DeletePosts = $(this).attr("proId");
        var showType= $(this).attr("data_type");
        var _this = $(this);
        if (UserName) {
            collectCanFun(1,DeletePosts, _this,showType);
        }
    });
    $(document).on("click", ".content_items .collection_shopCancel", function() {
        var DeletePosts = $(this).attr("proId");
        var _this = $(this);
        if (UserName) {
            collectCanFun(2,DeletePosts, _this);
        }
    })

    //收藏与取消收藏
    function  collectCanFun(type,id,_this,showType){
        if(type==1){
            var data={
                username: UserName,
                productId:id,
                type:showType
            }
            var urlShop="/tcFavorite/createTcFavorite.do";
        }else{
            var urlShop="/tcFavorite/deleteTcFavorite.do";
            var data={
                username: UserName,
                productId:id
            }
        }
        $.ajax({
            type: "post",
            url: serviceHOST() + urlShop,
            data: data,
            dataType: "json",
            headers: {
                "token": qz_token()
            },
            success: function(msg) {
                if (msg.status == 0) {
                    if(type==1){
                        friendlyMessage("收藏成功", function() {
                            _this.addClass("collection_shopCancel").removeClass("collection_post_shop").find("span").html("取消收藏");
                        });
                    }else{
                        friendlyMessage("取消收藏成功", function() {
                            _this.addClass("collection_post_shop").removeClass("collection_shopCancel").find("span").html("收藏");
                        });
                    }

                }else if(msg.status==-3){
                    getToken();
                };
            },
            error: function() {
                console.log("error")
            }

        });
    }


    //快速联系
    $(document).on('click', '.fast_contact', function(ev) {
        var ev = ev || event;
        var $this = $(this);
        var t = "chat";
        var imgSrc = $this.attr('data-img');
        var type = $this.attr('data-nick');
        var _oldname = $this.attr('data-oldname');
        var _myindustry = $this.attr('data-myindustry');
        var magicno = $(this).attr('data-magicno');
        var strangename = '';
        if(getURIArgs('strangename')) {
            strangename = getURIArgs('strangename');
        }
        $('#image').removeAttr('disabled'); //将文件可点击
        if(isShowChatBox(_oldname)) { //判斷是否在内存中 true为没有在内存里面
            createChatWindow(_oldname, _myindustry, type, imgSrc, 1, t);
            var recent = '<li class="Chat_list" data-off="0" data-magicno="' + magicno + '" data-myindustry="">' +
                '<dl><dt><img class="img" src="' + imgSrc + '"></dt><dd class="nickname">' + type + '</dd></dl><div class="recmdCircle"></div></li>'
            //陌生人主页的最近联系人通讯录
            $('.recentChat>ul').prepend(recent);
            var c_obj = storeChatStatus(_oldname, type, imgSrc, _myindustry, t);
            changeChatBoxStatus(c_obj);
        } else {
            createCommon(_oldname, _myindustry, type, imgSrc, 1, t);
        }

        storeFocusChatBox(_oldname);
        Gab.make_top_zero(_oldname);
        Gab.getMessageCount();
    })

    //商品重新上架、下架
    $(document).on("click",".js_againCommodityFrame",function(){
        var id=$(this).parent().attr("proId");
        var _this=this;
        commodityFrameFun(3,id,_this,1);
    });

    $(document).on("click",".js_commodityFrame",function(){
        var id=$(this).parent().attr("proId");
        var _this=this;
        commodityFrameFun(1,id,_this,0);
    });
    $(document).on("click",".thoroughDelete",function(){
        var id=$(this).attr("proId");
        commodityFrameFun(2,id);
    });
    function commodityFrameFun(type,id,_this,isSale){
        var data="";
        if(type==2){
            data= {
                deleted:1,
                type:type,
                productId:id
            }
        }else{
            data= {
                isSale:isSale,
                type:type,
                productId:id,
                deleted:0
            }
        }
        $.ajax({
            type: "post",
            url: serviceHOST() + "/tcProduct/updateTcProductStatus.do",
            data: data,
            dataType: "json",
            headers: {
                "token": qz_token()
            },
            success: function(msg) {
                if(msg.status==0){
                    var str="";
                    var strHtml="";
                    if(type==3) {
                        friendlyMessage("上架成功", function() {
                            str='<a   class="commodityFrame js_commodityFrame" href="javascript:;"><span>商品下架</span></a>';
                            strHtml+='<a class="transpond" href="javascript:;"><i></i>转发</a><div class="retransmission"></div>';
                            $(_this).parent().html(str).next().html(strHtml);

                        });

                    }else if(type==1){
                        friendlyMessage("下架成功", function() {
                            str='<a  class="againCommodityFrame js_againCommodityFrame" href="javascript:;"><span>重新上架</span></a>';
                            strHtml+='<a class="thoroughDelete" proId="'+id+'" href="javascript:;"><i></i>彻底删除</a>';
                            $(_this).parent().html(str).next().html(strHtml);
                        });
                    }else {
                        window.location.href="/center/me/release.html";
                    }

                }
            },
            error: function() {
                console.log("error")
            }

        });
    };


    $(document).on("click",".contact_method",function(){
        $(this).next(".contact_showInfo").css("display","block")
    });
    $(document).on("mouseover",".contact_method",function(){
        $(this).next(".contact_showInfo").css("display","block")
    });
    $(document).on("mouseleave",".contact_method",function(){
        $(this).next(".contact_showInfo").css("display","none")
    });

    //投诉
    $(document).on("mouseleave",".more_box",function(){
        $(this).find(".fl_menu_list").css("display","none")
    });
    $(document).on("mouseover",".more_box",function(){
        $(this).find(".fl_menu_list").css("display","block")
    });


    //图片

    function imgStrFun(dataImg) {
        var str = "";
        if(dataImg.length<4){
            for (var i = 0; i < dataImg.length; i++) {
                str += '<li class="js_imgShow" data-src="' + ImgHOST() +dataImg[i] +"-s"+ '" >' +
                    '<img src="' +ImgHOST() + dataImg[i] +"-s"+ '" >' +
                    '</li>';
            }
            for (var i = 0; i < 4-dataImg.length; i++) {
                str += '<li class="bangroundColor" ></li>';
            }
        }else{
            for (var i = 0; i < dataImg.length; i++) {
                str += '<li class="js_imgShow" data-src="' + ImgHOST() +dataImg[i] +"-s"+ '" >' +
                    '<img src="' +ImgHOST() + dataImg[i] +"-s"+ '" >' +
                    '</li>';
            }
        }

        $("#smainPic").attr("src", ImgHOST() +dataImg[0]+"-s");
        return str;
    }

    function imgStrFunB(dataImg) {
        var str = "";
        for (var i = 0; i < dataImg.length; i++) {
            str += '<li data-src="' + ImgHOST() +dataImg[i] +"-s"+ '" >' +
                '<img src="' +ImgHOST() + dataImg[i] +"-s"+ '" >' +
                '</li>';
        }
        $("#mainPic").attr("src", ImgHOST() +dataImg[0]+"-s");
        return str;
    }

    $(document).on("click","#leftImg li",function () {
        var top = parseInt($("#leftImg").css("top"));
        var allNum = $("#leftImg .js_imgShow").length;
        var curNum=$(this).index("#leftImg .js_imgShow");
        if(allNum<5){
            $("#leftImg .js_imgShow").removeClass("actives").eq(curNum).addClass("actives");
        }else{
            if(curNum<=2){
                $("#leftImg .js_imgShow").removeClass("actives").eq(curNum).addClass("actives");
                $("#leftImg").animate({"top": "0px"}, 300);
            }else if(curNum>2&&(curNum < allNum - 1)){
                $("#leftImg .js_imgShow").removeClass("actives").eq(curNum).addClass("actives");
                var t =0- 96*(curNum-2);
                $("#leftImg").animate({"top": t + "px"}, 300);
            }else{
                $("#leftImg .js_imgShow").removeClass("actives").eq(curNum).addClass("actives");
            }
        }

        var showSrc = $("#leftImg .actives").attr("data-src");
        $("#smainPic").attr("src", showSrc);
        var nowNum=$("#leftImg .actives").index("#leftImg li")+1;
        $(".dyncon_picture .leftNum i").html(nowNum);
    });

    $("#srbt").on("click", function () {
        var allNum = $("#leftImg .js_imgShow").length;
        var indexNum = $("#leftImg .actives").index("#leftImg .js_imgShow");
        if(allNum<5){
            if(indexNum==allNum - 1){
                $("#leftImg .js_imgShow").removeClass("actives").eq(0).addClass("actives");
            }else{
                $("#leftImg .js_imgShow").removeClass("actives").eq(indexNum + 1).addClass("actives");
            }
        }else{
            if(indexNum<=1){
                $("#leftImg .js_imgShow").removeClass("actives").eq(indexNum + 1).addClass("actives");
            }else if(indexNum>1&&(indexNum < allNum - 1)){
                $("#leftImg .js_imgShow").removeClass("actives").eq(indexNum + 1).addClass("actives");
                if(indexNum< allNum - 2){
                    var t =0- 96*($("#leftImg .actives").index("#leftImg .js_imgShow")-2);
                    $("#leftImg").animate({"top": t + "px"}, 300);
                }
            }else{
                $("#leftImg .js_imgShow").removeClass("actives").eq(0).addClass("actives");
                $("#leftImg").animate({"top": "0px"}, 300);
            }
        }
        var showSrc = $("#leftImg .actives").attr("data-src");
        $("#smainPic").attr("src", showSrc);
        var nowNum=$("#leftImg .actives").index("#leftImg .js_imgShow")+1;
        $(".dyncon_picture .leftNum i").html(nowNum);
    });

    $("#slbt").on("click", function () {
        var allNum = $("#leftImg .js_imgShow").length;
        var indexNum = $("#leftImg .actives").index("#leftImg .js_imgShow");
        if(allNum<5){
            $("#leftImg .js_imgShow").removeClass("actives").eq(indexNum -1).addClass("actives");
        }else{
            if(indexNum<=2){
               if(indexNum==0){
                   $("#leftImg .js_imgShow").removeClass("actives").eq(indexNum -1).addClass("actives");
                   var t =0- 96*(allNum-4);
                   $("#leftImg").animate({"top": t+"px"}, 300);
               }else{
                   $("#leftImg .js_imgShow").removeClass("actives").eq(indexNum -1).addClass("actives");
               }
            }else if(indexNum>2&&(indexNum < allNum)){
                $("#leftImg .js_imgShow").removeClass("actives").eq(indexNum -1).addClass("actives");
                var t =0-96*($("#leftImg .actives").index("#leftImg li")-2);
                $("#leftImg").animate({"top": t + "px"}, 300);
            }
        }
        var showSrc = $("#leftImg .actives").attr("data-src");
        $("#smainPic").attr("src", showSrc);
        var nowNum=$("#leftImg .actives").index("#leftImg .js_imgShow")+1;
        $(".dyncon_picture .leftNum i").html(nowNum);
    });

//    大图展示
    $(".picclose").on("click",function(){
        $(".picmask,.piclayer").hide();

    });
    $("#smainPic").on("click",function(){
        var w=$("#leftImg li").length*128-8;
        $(".big-pic-list").css({"width":w+"px","margin-left":-w/2+"px"});
        var indexnum=$("#leftImg .actives").index("#leftImg li");
        $("#smallPic li").eq(indexnum).addClass("actives");
        var showSrc = $("#leftImg .actives").attr("data-src");
        $("#mainPic").attr("src", showSrc);
        var nowNum=$("#smallPic .actives").index("#smallPic li")+1;
        $("#viewNum i").html(nowNum);
        imgTop(showSrc)
        $(".picmask,.piclayer").show();
    });

    $(document).on("click","#smallPic li",function () {
        var indexNum = $(this).index("#smallPic li");
        $("#smallPic li").removeClass("actives").eq(indexNum).addClass("actives");
        var showSrc = $("#smallPic .actives").attr("data-src");
        $("#mainPic").attr("src", showSrc);
        imgTop(showSrc);
        var nowNum=$("#smallPic .actives").index("#smallPic li")+1;
        $("#viewNum i").html(nowNum);
    });


    $("#blbt").on("click", function () {
        var allNum = $("#smallPic li").length;
        var indexNum = $("#smallPic .actives").index("#smallPic li");
        if (indexNum > 0) {
            $("#smallPic li").removeClass("actives").eq(indexNum-1).addClass("actives");
        }else{
            $("#smallPic li").removeClass("actives").eq(allNum-1).addClass("actives");
        }
        var showSrc = $("#smallPic .actives").attr("data-src");
        $("#mainPic").attr("src", showSrc);
        imgTop(showSrc);
        var nowNum=$("#smallPic .actives").index("#smallPic li")+1;
        $("#viewNum i").html(nowNum);
    });
    $("#brbt").on("click", function () {
        var allNum = $("#smallPic li").length;
        var indexNum = $("#smallPic .actives").index("#smallPic li");

        if (indexNum < allNum - 1) {
            $("#smallPic li").removeClass("actives").eq(indexNum+1).addClass("actives");
        }else{
            $("#smallPic li").removeClass("actives").eq(0).addClass("actives");
        }
        var showSrc = $("#smallPic .actives").attr("data-src");
        $("#mainPic").attr("src", showSrc);
        imgTop(showSrc);
        var nowNum=$("#smallPic .actives").index("#smallPic li")+1;
        $("#viewNum i").html(nowNum);

    });


    function imgTop(imgUrl){
        var h=$(".picmask").height()*0.75;
        var img_url =imgUrl;
        var img = new Image();
        img.src = img_url;
        if(h>img.height){
            $(".big-top-bigpic img").css({"margin-top":(h-img.height)/2+"px"})
        }else{
            $(".big-top-bigpic img").css({"margin-top":0})
        }
    }

    //查看地图
    $(".js_pos_area_map").on("click",function(){
        $("#pop_container,#pop_mask").show();
        var lng=$(this).attr("lng");
        var dim=$(this).attr("dim");
        var map = new BMap.Map("detail-bdmap");
        var point = new BMap.Point(lng,dim);
        map.centerAndZoom(point, 12);
        map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

        map.addControl(new BMap.NavigationControl());
        map.addControl(new BMap.ScaleControl({anchor:BMAP_ANCHOR_TOP_LEFT }));//比例尺

        var marker = new BMap.Marker(point);  // 创建标注
        map.addOverlay(marker);              // 将标注添加到地图中

        var label = new BMap.Label($(".pos_area_item").html().split("-").join("")+$(".posAddressDetails").html(),{offset:new BMap.Size(20,-10)});
        marker.setLabel(label);
    });
    $(".close_pop_btn").on("click",function(){
        $("#pop_container,#pop_mask").hide();
    });

    //===============右侧功能列表的展示================

    //他发布的的，感兴趣的
    function contentLeftFunList(msg,type){
        var userShow="";
        var pro="";
        var str="";
        for(var i=0;i<msg.length;i++){
            userShow=msg[i].user;
            pro=msg[i].tcProduct;
            str+='<div class="cityHot_container" >'+
                '<h3><a href="/center/shopDetails.html?id='+pro.id+'" >'+pro.title+'</a></h3>';
                if(pro.videourl){
                    str+='<div class="listVideo">' +
                        '<a class="video1" href="/center/shopDetails.html?id='+pro.id+'">' +
                        '<img src="http://quanzinet.com:9090/plugins/restapi/v1/files/download?filename='+pro.videourl+'-start">' +
                        '<span class="playBtn">' +
                        '</span>' +
                        '<div class="personTime clearfix">' +
                        '</div>' +
                        '</a>' +
                        '</div>'
                }else if(pro.imagepath.length>0){
                    str+='<ul>';
                    if(pro.imagepath.length>2){
                        var imhnumLength=2;
                    }else{
                        var imhnumLength=pro.imagepath.length;
                    }
                        for(var z=0;z<imhnumLength;z++){
                            str+= '<li>'+
                                '<img src="'+ImgHOST() +pro.imagepath[z]+"-s"+'" alt="同城图片">'+
                                '</li>';
                        }
                    str+='</ul>';
                }
                str+='<div class="cityHot_price">'+
                '<span>';
                if(pro.type==1){
                    str+=pro.originalPrice?peiceShowAllAry[pro.originalPrice]:peiceShowAllAry[0];
                }else{
                    str+=(pro.price!=0)?pro.price+"元/月":"面议";
                }
                str+='</span>'+
                '</div>';
            if(type==1){
                str+='<p>';
                if(pro.content.length>35){
                    str+=pro.content.substring(0,35)+"..."
                }else{
                    str+=pro.content;
                }
                str+='</p>'+
                    '<div class="cityHot_address cityHot_addressTop"><span>'+pro.location+'</span></div></div>';
            }else{
                str+='<div class="cityHot_address"><span>'+pro.location+'</span></div>'+
                    '<p>';
                if(pro.content.length>35){
                    str+=pro.content.substring(0,35)+"..."
                }else{
                    str+=pro.content;
                }
                str+='</p>'+
                    '<div class="cityHot_person">';
                    if (userShow.imgforheadlist == "") {
                        str += '<a data-name="'+userShow.username+'" class="usermessageShop"><img src="/img/first.png" alt="" /></a>';
                    } else {
                        str += '<a data-name="'+userShow.username+'" class="usermessageShop"><img src="' + ImgHOST() + userShow.imgforheadlist[0].imagepath + '" alt="" /></a>';
                    }
                    str +='<span data-name="'+userShow.username+'" class="cityHot_name">'+userShow.nickname+'</span>'+
                    '<span>'+userShow.myindustry+'</span>'+
                    '</div></div>';
            }
        }

        return str;
    }

    $(document).on("click",".js_hieRelease .cityHot_head a",function(){
        window.location.href="/center/u/release.html?from="+$(".content_itemsShop").attr("data-name")
    });
    $(document).on("click",".js_interestedPro .cityHot_head a",function(){
        var urlShow="";
        if($(this).attr("data_type")==1){
            urlShow="/shangcheng/prd/occupation.html";//职业
        }else if($(this).attr("data_type")==2){
            urlShow="/shangcheng/prd/rent.html";
        }else if($(this).attr("data_type")==4){
            urlShow="/shangcheng/prd/housekeep.html";
        }else if($(this).attr("data_type")==3){
            urlShow="/shangcheng/prd/secondPrd.html";
        }else if($(this).attr("data_type")==5){
            urlShow="/shangcheng/prd/businessService.html";
        }
        window.location.href=urlShow;
    });


    /*
     *评论跳转主页
     */
    $(document).on("click", ".ui-avatar", function() {
        var strangename = $(this).parent().parent().attr("data-name");
        if (strangename == UserName) {
            window.location.href = '/center/me/page.html';
        } else {
            getInfo({
                myname: getCookie("username") || "nouser",
                username: strangename,
                templetName: "pageJingtai"
            });
        }
    })

    $(document).on("click", ".qz_name,.jingtai,.usermessageShop,.cityHot_name,.circle_name b,.circle_img", function() {
        var strangename = $(this).attr("data-name");
        if (strangename == UserName) {
            window.location.href = '/center/me/page.html';
        } else {
            getInfo({
                myname: getCookie("username") || "nouser",
                username: strangename,
                templetName: "pageJingtai"
            });
        }
    })






    //==============================新增功能结束====================================








    /*
     * 帖子内容展开收起
     * */
    $(document).on("click", ".recommend_main .infold_open .unfold", function () {
        $(this).parents(".recommend_main").find(".recommend_content").css("max-height", "100%");
        $(this).html("收起");
        $(this).addClass("putflod");
    })
    $(document).on("click", ".recommend_main .infold_open .putflod", function () {
        $(this).parents(".recommend_main").find(".recommend_content").css("max-height", "104px");
        $(this).html("展开全文");
        $(this).removeClass("putflod");
    })


    //处理视频的函数
    function addVideo(u, ids, h, posts) {
        var str = "";
        if (u) {
            //			str = "<iframe id='v_player' height='400' width='500' src='/player/player.html?vid=" + u + "' frameborder=0 'allowfullscreen'></iframe>";
            str = "<video class='videoName' id='" + ids + "' style='background:#000;' controls='controls' height='" + h + "' width='100%' poster='" + posts + "' src='" + u + "'></video>";
        }
        ;
        return str;
    };

})

/*
 * 加载一级评论内容
 * */
function Level1_comment(msg) {
    str = '<li class="comments-item" data-id="' + msg.id + ' "data-name="'+ msg.username+'">' +
        '<div class="comments-item-bd">' +
        '<div class="ui-avatar">';
    //评论者头像
    if (msg.headProtrait == null) {
        str += '<img src="/img/first.png" />';
    } else {
        str += '<img src="' + ImgHOST() + msg.headProtrait + '" />';
    }

    str += '</div>' +
        '<div class="comments-content">' +
        '<a href="javascript:;" class="qz_name" data-name=' + msg.username + '>' + (msg.nickName || shieldNumber(msg.nickName)) + '</a>：<span>' + toFaceImg(msg.content) + '</span>' +
        '<div class="comments-op">' +
        '<span class="ui-mr10 state">' + formatTime(msg.createtime) + '</span>' +
        '<a href="javascript:;" class="act-reply" title="回复"></a>';
    if (msg.username == UserName) {
        str += '<a href="javascript:;" class="oneselfdel"></a>';
    }
    str += '</div><div data-id="' + msg.id + '" class="revert_box"></div>' +
        '</div>' +
        '<div class="comments-list mod-comments-sub"><ul>';

    return str;
}


/*
 *
 * 加载二级评论  和三级评论
 * */

function TwoList(msg) {
    var two_comment="";
    for(var i=0;i<msg.length;i++){
        two_comment+= '<li class="comments-item comments-item2" data-id="'+msg[i].id+'"data-name="'+msg[i].username+'"><div class="comments-item-bd">' +
            '<div class="ui-avatar">';
        if (msg[i].headProtrait == null) {
            two_comment += '<img src="/img/first.png" />';
        } else {
            two_comment += '<img src="' + ImgHOST() + msg[i].headProtrait + '" />';
        }
        two_comment += '</div>' +
            '<div class="comments-content">' +
            '<a href="javascript:;" class="qz_name" data-name=' + msg[i].username + '>' + (msg[i].nickname || shieldNumber(msg[i].nickName)) + '</a><span>回复</span>' +
            '<a href="javascript:;" class="qz_name reply_content" data-name=' + msg[i].repliedGuyName + '>' + (msg[i].repliedGuyName || shieldNumber(msg[i].repliedGuyName)) + '</a>' + toFaceImg(msg[i].content) + '' +
            '<div class="comments-op">' +
            '<span class="ui-mr10 state">' + formatTime(msg[i].createtime) + '</span>' +
            '<a href="javascript:;" class="act-reply" title="回复"></a>';
        if (msg[i].username == UserName) {
            two_comment += '<a href="javascript:;" class="oneselfdel"></a>';
        }
        two_comment += '</div><div data-id="' + msg[i].id + '" class="revert_box"></div>' +
            '</div></li>';
    }
    return two_comment;
};


//鼠标滑过显示回复  和 删除
$(document).on("mouseover", ".act-reply", function () {
    $(this).html('<span class="Accordingreply">回复<i></i></span>');
})
$(document).on("mouseover", ".oneselfdel", function () {
    $(this).html('<span class="Accordingreply">删除<i></i></span>');
})
$(document).on("mouseout", ".oneselfdel,.act-reply", function () {
    $(this).empty();
})



 //触发开关，防止多次调用事件 
    document.documentElement.scrollTop=document.body.scrollTop=0;
  $(window).scroll(function(event) {
     var scrollTop = $(this).scrollTop();
     //整个文档的高度
     var scrollHeight = $(document).height(); 
     var windowHeight = $(this).height();
     var lHeight=$(".detail_left").height();
     var rHeight=$(".detail_right2").height();
     var minHeight=windowHeight-270;
     var numLr=Math.abs(lHeight-rHeight);
     
     // console.log(scrollTop);
     if(lHeight>rHeight){
        // $(".detail_right2").css({"position":"fixed";"top":"-214px";})
     }else{
        if(lHeight>minHeight){
            if(scrollTop>(lHeight-minHeight)){
                $(".detail_left").addClass("detail_Fixed").css("top","-"+(lHeight-minHeight-110)+"px");
            }else{
                $(".detail_left").removeClass("detail_Fixed").css("top","0px");
            }
        }else{
            if(scrollTop>lHeight){
                $(".detail_left").addClass("detail_Fixed").css("top","140px")
            }else{
                $(".detail_left").removeClass("detail_Fixed").css("top","0px")
            };
        }

         // $(".detail_left").addClass("detail_Fixed").css("top","0px");
        
        // if(scrollTop>numLr){
        //     $(".detail_left").addClass("detail_Fixed").css("top","-"+numLr+"px");
        // }else{
        //     $(".detail_left").removeClass("detail_Fixed").css("top","0px");
        // }

     }
    
 })