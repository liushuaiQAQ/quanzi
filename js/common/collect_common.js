$(document).on("click", function(e) {
	e.stopPropagation();
	$(".dropMenu").hide();
	$(".retransmission").hide();
})


function findIndexTopics(page) {
	var str = "";
	$.ajax({
		type: "post",
		url: serviceHOST() + "/collections/findCollections.do",
		data: {
			username: UserName,
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
				if (mssg == "") {
					$(".Collect_list").html('<div class="no_collect"><img src="/img/nodata.png"/ align="top"><p>尚未收藏</p><a href="/center/index.html">前往首页</a></div>')
					return false;
				}
				for (var i = 0; i < mssg.length; i++) {
					var nums = (page - 1) * mssg.length + i;
					var imagepath = mssg[i].topic.imagepath; //文章图片
					var commentlist = mssg[i].commentlist; //评论人列表
					var clickMaplist = mssg[i].clickMaplist; //点赞人头像
					if (mssg[i].user != null && mssg[i].user != "") {
						//帖子用户信息
						str = PostDynamicUserDetails(mssg[i]);


						// 加载帖子文章内容

						str += DynamicPostArticles(mssg[i]);


						//文章图片
						str += TheArticleShowUs(mssg[i], imagepath);


						//判断是否赞过
						//加载点赞人头像

						str += DetermineWhetherPraise(mssg[i], clickMaplist);

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

}



function getVmcollection(page) {
	var userId = UserName;
	var str = "";
	$.ajax({
		type: "post",
		url: serviceHOST() + '/videoMaterial/getVmcollection.do',
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			uid: userId,
			pageNum: page
		},
		success: function(msg) {
			$(".Toloadmore").remove();
			if ($(".collectionVideo ul li").length == 0 && msg.data == "") {
				$(".collectionVideo").html('<div class="no_collect"><img src="/img/nodata.png"/ align="top"><p>尚未收藏</p><a href="/center/videoLists.html">更多视频</a></div>')
			}
			if (msg.data == "") {
				stop = false;
				return false;
			}

			if (msg.status == 0) {
				stop = true;
				$('.jiazai').remove();
				var len = msg.data.length;
				var subLen = "";
				var mssg = msg.data
				for (var i = 0; i < len; i++) {
					var briefs = mssg[i].brief;
					if(briefs!="undefined"){
						if (briefs.length > 36) {
							subLen = briefs.substr(0, 36) + "...";
						} else {
							subLen = briefs;
						};
					}else{
						subLen = '';
					};
					var visites = (Math.round((mssg[i].visites / 10000) * 100) / 100).toFixed(1);
					if(mssg[i].authoravatar=='"null"'||mssg[i].authoravatar==''||mssg[i].authoravatar==null){
						var authoravatar="/img/first.png";
					}else{
						if(mssg[i].authoravatar.indexOf("http")>-1){
							var authoravatar=mssg[i].authoravatar;
						}else{
							var authoravatar=ImgHOST()+mssg[i].authoravatar;
						}
					}
					str += '<li>' +
						'<div class="videoBox">' +
						'<div class="videoImg" data-collection="' + mssg[i].iscollection + '" data-id="' + mssg[i].id + '">' +
						'<img src="' + mssg[i].vpicurl + '"/>' +
						'</div>' +
						'<span class="playNum">'+visites+'万</span>'+
						//'<span class="times">' + "12:15" + '</span>' +
						'<div class="playimg" data-id="' + mssg[i].id + '"></div>' +
						'<div class="opacityBg"></div>' +
						'</div>' +
						'<a class="brief" data-id="' + mssg[i].id + '" data-content="' + briefs + '" href="javascript:;">' + subLen + '</a>' +
						'<div class="userName" style="background:url(' + authoravatar + ') no-repeat 10px center;background-size:20px 20px;">' + mssg[i].author + '</div>' +
						'<dl>';
//						'<dt>' + visites + '万' + '</dt>';
						var commentNum=mssg[i].comments;
						if(commentNum>10000){
							commentNum=change (commentNum);
						}else{
							commentNum=commentNum||0;
						}
						if(mssg[i].iscollection==1){     // 1是已收藏
							str+='<dd class="collect" data-id="'+mssg[i].id+'" data_isCol="'+mssg[i].iscollection+'">取消收藏</dd>';
							str+='<dd class="colloction">'+commentNum+'</dd>'+
									'<dd class="share">分享</dd>';
						}else{
							str+='<dd class="collect" data-id="'+mssg[i].id+'" data_isCol="'+mssg[i].iscollection+'">收藏</dd>';
							str+='<dd class="colloction">'+commentNum+'</dd>'+
									'<dd class="share">分享</dd>';
						}
						// '<dd class="share">分享</dd>' +
						// '<dd class="colloction">' + mssg[i].comments + '</dd>' +
						str+='<br class="clear" />' +
						'</dl>' +
						'<div class="sharelink">' +
						'</div>' +
						'</li>'
				}
				$(".collectionVideo ul").prepend(str)
			}else if(msg.status==-3){
				getToken();
			};
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