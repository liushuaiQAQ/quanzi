$(document).on("click", function(e) {
    e.stopPropagation();
    $(".dropMenu").hide();
    $(".retransmission").hide();
});


// $(document).on("click",".js_againCommodityFrame",function(){
//     var id=$(this).attr("proId");
//     commodityFrameFun(3,id);
// });

// $(document).on("click",".js_commodityFrame",function(){
//     var id=$(this).attr("proId");
//     commodityFrameFun(1,id);
// });
// $(document).on("click",".thoroughDelete",function(){
//     var id=$(this).attr("proId");
//     commodityFrameFun(2,id);
// });
// function commodityFrameFun(type,id){
//     $.ajax({
//         type: "post",
//         url: serviceHOST() + "/tcProduct/updateTcProduct.do",
//         data: {
//             product:JSON.stringify({id:id}),
//             type:type
//         },
//         dataType: "json",
//         headers: {
//             "token": qz_token()
//         },
//         success: function(msg) {
//                 if(msg.status==0){
//                     window.location.reload();
//                 }
//         },
//         error: function() {
//             console.log("error")
//         }

//     });
// }


//商品重新上架、下架
    $(document).on("click",".js_againCommodityFrame",function(){
        var id=$(this).attr("proId");
        var _this=this;
        commodityFrameFun(3,id,_this,1);
    });

    $(document).on("click",".js_commodityFrame",function(){
        var id=$(this).attr("proId");
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
                    window.location.reload();
                }
            },
            error: function() {
                console.log("error")
            }

        });
    };






//鼠标悬浮     收藏和播放按钮变化
$(document).on("mouseover", ".videoBox", function() { //移入
    $(this).find(".playimg").css("background", "url(/img/qz_sp_bofang_xuanzhong.png) no-repeat")
})
$(document).on("mouseleave", ".videoBox", function() { //移出
    $(this).find(".playimg").css("background", "url(/img/qz_sp_bofang.png) no-repeat")
})
$(document).on("click", ".videoImg,.brief,.playimg", function() {
    var videoId = $(this).attr("data-id")
    window.location.href = "/center/videodetail.html?id=" + videoId;
})
//视频转发
$(document).on("click", ".share", function(e) {
    $(this).parents("li").siblings().find(".sharelink").hide();
    var transmit = '<a class="share1" href="javascript:;">圈子朋友圈</a>' +
        '<a class="share2" href="javascript:;">圈子好友</a>' +
            //'<a class="share3" href="javascript:;">圈子群组</a>' +
        '<a class="share9" href="javascript:;">首页热门</a>'+
        '<a class="share5" href="javascript:;">' +
        '<span>微信朋友圈</span>' +
        '<div class="qrodeBox">' +
        '<p>分享到微信朋友圈</p>' +
        '<div></div>' +
        '</div>' +
        '</a>' +
        '<a class="share6" href="javascript:;">QQ空间</a>' +
        '<a class="share7" href="javascript:;">QQ好友</a>' +
        '<a class="share8" href="javascript:;">新浪微博</a>';
    $(this).parents("li").find(".sharelink").html(transmit);
    //生成微信朋友圈二维码
    var viId = $(this).parents("dl").siblings(".brief").attr("data-id");
    var urls = serHOST()+"/Page/videoShare/index.html?uid=" + UserName + "&vmid=" + viId
    $(this).parents("dl").siblings(".sharelink").find(".qrodeBox div").qrcode({
        render: "canvas",
        width: 30 * 4,
        height: 30 * 4,
        text: urls
    });
    $(this).parents("li").find(".sharelink").show();
    //转发弹窗位置
    if ($(this).offset().top - $(window).scrollTop() + 290 > $(window).height()) {
        $(this).parents("li").find(".sharelink").css("top", "20px");
        $(this).parents("li").find(".sharelink .qrodeBox").css("top", "54px");
    } else {
        $(this).parents("li").find(".sharelink").css("top", "270px");
    }

    e.stopPropagation();
})
$(document).on("click", function(e) {
    e.stopPropagation();
    $(".sharelink").hide();
})





/**************视频收藏接口开始*********************/
$(document).on("click", ".collectionVideo .collect", function() {
    var _this=$(this);
    var CancelList = $(this).parents("li");
    if (getCookie("username")) {
        var _thisCollction = $(this).attr("data_isCol"); //获取当前收藏的状态
        var _id=$(this).attr("data-id");
        $.im.confirm("确定要取消收藏吗？", function() {
            $.ajax({
                type: "post",
                url: serviceHOST() + "/videoMaterial/cancelVmCollection.do",
                dataType: "json",
                headers: {
                    "token": qz_token()
                },
                data: {
                    uid: getCookie("username"),
                    vmid:_id
                },
                success: function(msg) {
                    if (msg.status == 0) {
                        if (msg.data == 1) {
                            CancelList.remove();
                            if ($(".collectionVideo ul li").length == 0) {
                                $(".collectionVideo").html('<div class="no_collect"><img src="/img/nodata.png"/ align="top"><p>尚未收藏</p><a href="/center/videoLists.html">更多视频</a></div>')
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
        });
    } else {
        $(".userLogin a").click();
    }
})