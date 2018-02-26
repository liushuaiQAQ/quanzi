$(function() {
	var page = 1;
	var index = getURIArgs("t");
	var keyList = $(".classification li").eq(index);
	var base = new Base64();
	// 可能认识的人
	recommendRosters();

	//热门分类切换
	/*
	未登录状态推荐帖子recommendTopic
	Int catetory 分类：0-全部帖子；1-职业圈帖子；2-全球圈帖子；3-生活圈帖子
	*/
	$(document).on("click",".classification .qz_classify", function() {
		var catetory = $(this).index();
		$(".classification li").removeClass("pitch");
		$(".dynamic .home a").html($(this).text());
		$(this).addClass("pitch");
		$(".content_items").remove();
		stop = false;
		$(".jiazai").show();
		$(".Toloadmore").remove();
		page = 1;
		window.location.href = "/index.html?t="+catetory
	});



	//下拉加载动态
	var page = 1;
	//触发开关，防止多次调用事件 
	var stop = false;
	$(window).scroll(function(event) {
		var scrollTop = $(this).scrollTop();
		//整个文档的高度
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();

		if (scrollTop + windowHeight + 130 >= scrollHeight) {
			if(stop == true && getURIArgs("w") && getURIArgs("t")){
				stop = false;
				$("#dynamic_list").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
				page = page + 1;
				keywordSearch(page,getURIArgs("w"));
			}else if (stop == true || (stop == true && getURIArgs("t"))) {
				stop = false;
				$("#dynamic_list").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
				page = page + 1;
				findIndexTopics(keyList.attr("data-fl"), page);
			}
		}
	})


	
	//按关键字搜索
	$(document).on("click",".classification .s_keyword",function(){
		$(".dynamic .home a").html($(this).text());
		var t = $(this).index();
		var w = $(this).html();
		$(".content_items").remove();
		$(".jiazai").show();
		window.location.href = "/index.html?t=" + t + "&w=" + w 
	})


	function keywordSearch(page,word) {
		var str = "";
		$.ajax({
			type: "post",
			url: serviceHOST() + "/topic/getHomePageSearch.do",
			data: {
				pageNum: page,
				username: UserName,
				word: word, 		//当用关键字搜索时传 
				code: "", 		//当按职业搜索时传
				type: 1 			//1：表示首页，2：表示职业圈，3:表示生活圈，4：表示全球圈
			},
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				if(msg.status == 0) {
					var mssg = msg.data;
					UnknownDynamicContent(page,msg);
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}

		});

	}


	// 推荐动态
	// t 推荐圈子动态
	// w 搜索关键字查询动态
	if(getURIArgs("w") || getURIArgs("t")){
		if(getURIArgs("w") && getURIArgs("t")){
			keywordSearch(1,getURIArgs("w"));
		}else if(getURIArgs("t")){
			var index = getURIArgs("t")
			findIndexTopics(keyList.attr("data-fl"),1);
		}
		
		$(".classification li").removeClass("pitch");
		keyList.addClass("pitch");
		$(".dynamic .list_bg").html(keyList.html()||getURIArgs("w"));
	}else if (getURIArgs("qz")) {             //朋友圈
		var cf = '<div class="not_friends chartlet"><p>登录后，朋友圈消息会在这里展现</p><a class="registered" href="/center/register.html">注册</a><a class="userLogin login_window" href="javascript:;">登录</a></div>';
		$("#dynamic_list").html(cf);
		$(".bg_br").remove();
		$(".pyq").find("a").css("color", "#3ea436");
		$(".pyq").append('<span class="bg_br"></span>');
		$(".home a").css("color", "#bdbdbd");
		$(".nav_c_r").remove();
	}else{
		//推荐动态
		findIndexTopics(0, 1);
	}




	//加载所有动态
	function findIndexTopics(catetory, page) {
		var str = "";
		$.ajax({
			type: "post",
			url: serviceHOST() + "/topic/recommendTopic.do",
			data: {
				"catetory": catetory,
				"pageNum": page,
				"pageSize": 10
			},
			headers: {
				"token": qz_token()
			},
			dataType: "json",
			success: function(msg) {
				if(msg.status==-3){
					getToken();
				};
				UnknownDynamicContent(page, msg)
			},
			error: function() {
				console.log("error")
			}

		});

	}




	//分享
	$(document).on("click", ".qz_row_line .transpond", function(e) {
		$(".retransmission").empty();
		var fx = '<span class="wordShare">分享到</span>' +
			'<a href="javascript:;" class="circle_zone login_window">圈子朋友圈</a>' +
			'<a href="javascript:;" class="circle_friends login_window">圈子好友</a>' +
			'<a href="javascript:;" class="circle_group login_window">圈子群组</a>' +
			'<a href="javascript:;" class="circle_indexhot login_window">首页热门</a>' +
			'<a href="javascript:;" class="wechat_zone">' + '<span>微信朋友圈</span>' +
			'<div class="qrodeBox">' +
			'<p>分享到微信朋友圈</p>' +
			'<div></div>' +
			'</div>' +
			'</a>' +
			'<a href="javascript:;" class="qq_zone">QQ空间</a>' +
			'<a href="javascript:;" class="qq_friends">QQ好友</a>';
		$(this).siblings(".retransmission").html(fx);
		//生成微信朋友圈二维码
		var topicNum = $(this).parents(".content_items").attr("data-id");
		var topicUsername = $(this).parents(".content_items").attr("data-name");
		//var urls = serHOST()+'/Page/news_details/newsDetails.html?topicNo=' + topicNum;
		if ($(this).parents(".content_items").attr("data-type") == 8) {
			var urls = $(this).parents(".content_items").find(".specialOn").attr("data-page");
		} else {
			var urls = serHOST()+'/Page/news_details/newsDetails.html?topicNo=' + topicNum;
		}
		$(this).siblings(".retransmission").find(".qrodeBox div").qrcode({
			render: "canvas",
			width: 30 * 4,
			height: 30 * 4,
			text: urls
		});
		$(this).siblings(".retransmission").toggle();
		$(this).parents(".content_items").siblings(".content_items").find(".retransmission").hide();
		e.stopPropagation();
	})
	$(document).on("click", ".qz_row_line .retransmission", function(e) {
		e.stopPropagation();
	})
	$(document).on("click", function() {
		$(".retransmission").hide();
	})
	
	//点击显示一级评论发表
	$(document).on("click", ".content_items .qz_publish .Postcomment", function() {
		var fabiao = '<a href="javascript:;" class="emotion"></a>' +
			'<a href="javascript:;" class="publish login_window">发表</a>' +
			'<div id="shuaiId"></div>';
		$(".content_items .review_1").empty();
		$(".content_items .comments-content .revert_box").empty();
		$(this).css({
			"border-color": "#3FA435",
			"color": "#333"
		})

		$(this).parents(".qz_handle").find(".review_1").html(fabiao);
		$(".Postcomment").removeAttr("id");
		$(this).attr("id", "txtId") //表情内容框
	})

	$(document).on("blur", ".content_items .qz_publish textarea", function(e) {
		$(".content_items").find(".Postcomments").css({
			"border-color": "#ccc",
			"color": "#ccc"
		});
	})

	//点击显示二级评论发表
	$(document).on("click", ".content_items .comments-content .act-reply", function(e) {
		$(".Postcomments").removeAttr("id");
		e.stopPropagation();
		var qz_name = $(this).parents(".comments-content").find("a.qz_name").html();
		var str = '<div class="reply comments-item">' +
			'<div class="ui-avatar">';
		str += '<img src="/img/first.png" />'
		str += '</div>' +
			'<div class="import">' +
			'<textarea class="Postcomments" id="txtId" placeholder="回复&nbsp;' + qz_name + '：" name="review_1"  autoHeight="true" /></textarea>' +
			'<div class="release">' +
			'<a href="javascript:;" class="emotion"></a>' +
			'<a href="javascript:;" class="publish login_window">发表</a>' +
			'<div id="shuaiId"></div>' +
			'</div>' +
			'</div>' +
			'</div>';
		$(".content_items .comments-content .revert_box").empty();
		$(".content_items .review_1").empty();
		$(this).parents(".comments-content").find(".revert_box").html(str);
		$(this).parents(".comments-content").find(".revert_box input").focus();
		autosize(document.querySelectorAll('.qz_handle textarea'));

	})

	/***********加载表情***********************/

	$("a.faceBtn").live("click", function(e) {
		var divid = $("#FaceBox");
		smohanfacebox($(this),divid,"FaceBoxText");
	});

	$("a.emotion").live("click", function(e) {
		var divid = $("#shuaiId");
		smohanfacebox($(this),divid,"txtId");
	});


	// 文章图片轮播
	ByShowingPictures();


	//动态文章展开收起
	$(document).on("click", ".publish_rticle .unfold", function() {
		$(this).parents(".content_items").find(".publish_rticle .article").css("max-height", "100%");
		$(this).html("收起");
		$(this).addClass("putflod");
	})
	$(document).on("click", ".publish_rticle .putflod", function() {
		$(this).parents(".content_items").find(".publish_rticle .article").css("max-height", "144px");
		$(this).html("展开");
		$(this).removeClass("putflod");
	})
	$(document).on("click", ".prompt .determine,.prompt .del", function() {
		$("#mask").hide();
		$(".prompt").hide();
	})



	



	// 动态内容
	function UnknownDynamicContent(page, msg) {
		var user_level = {
			30007: "boy",
			22899: "gril"
		}
		$(".Toloadmore").remove();
		if (msg.status == 0) {
			$(".jiazai").hide();
			stop = true;
			var mssg = msg.data;
			var nums = "";
			if (msg.data == "" && $(".content_items").length == 0 && page == 1) {
				stop = false;
				$(".dynamic_list").html('<div class="Isempty"><p>圈子里尚无动态</p></div>')
			} else if (msg.data == "") {
				stop = false;
			}

			for (var i = 0; i < mssg.length; i++) {
				var nums = (page - 1) * mssg.length + i;
				var imagepath = mssg[i].topic.imagepath; //文章图片
				var commentlist = mssg[i].commentlist; //评论人列表
				var clickMaplist = mssg[i].clickMaplist; //点赞人头像

				str = '<div class="content_items" data-type=' + mssg[i].topic.topictype + ' data-id=' + mssg[i].topic.topicNo + ' data-name=' + mssg[i].user.username + '>' +
					'<div class="publish_rticle">' +
					'<dl class="message_mark messagebox">' +
					'<div class="messagein"></div>';
				//用户头像有无
				if (mssg[i].user.imgforheadlist == "") {
					str += '<dt><img src="/img/first.png" alt="" /></dt>';
				} else {
					str += '<dt><img src="' + ImgHOST() + mssg[i].user.imgforheadlist[0].imagepath + '" alt="" /></dt>';
				}
				str += '<dd class="authorName"><b>' + mssg[i].user.nickname + '</b>';
				//用户等级   和会员等级   性别

				if (mssg[i].user.level >= 16) {
					mssg[i].user.level = "N";
				}

				if (mssg[i].user.sex == "男" || mssg[i].user.sex == "女") {
					str += '<span class="gradeImg"><img src="/img/h/sj_' + user_level[mssg[i].user.sex.charCodeAt()] + '_' + mssg[i].user.level + '.png"/></span>';
				} else {
					str += '<span class="gradeImg"><img src="/img/h/sj_boy_' + mssg[i].user.level + '.png"/></span>';
				}
				if (mssg[i].user.viplevel != "0") {
					str += '<span class="vipImg"><img src="/img/h/sj_VIP_' + mssg[i].user.viplevel + '.png"/></span>';
				}
				str += '<dd class="message_time">' + mssg[i].user.myindustry + '<span>' + formatTime(mssg[i].topic.createtime) + '</span></dd>' +
					'</dl>' +
					'<div class="clear"></div>' +
					'<div class="article">';
					///////////////////////////////////////////////
					if (mssg[i].topic.topictype == 8&&mssg[i].topic.content!="") { //转发		
						var mgs = JSON.parse(mssg[i].topic.content);
						if (mgs.content.indexOf("\n") > -1) { //判断有否有回车符  有则换行
							var content = mgs.content.replace(/\n/g, "</br>");
						} else {
							var content = mgs.content;
						}
						str += '<div class="article_content" data-content="' + content + '">' + toFaceImg(content) + '</div>';
					} else {  
						if (mssg[i].topic.content != undefined && mssg[i].topic.content.indexOf("\n") > -1) { //判断有否有回车符  有则换行
							var topicContent = mssg[i].topic.content.replace(/\n/g, "</br>");
						} else {
							var topicContent = mssg[i].topic.content;
						}
						str += '<div class="article_content" data-content="' + mssg[i].topic.content + '">' + toFaceImg(topicContent) + '</div>';
					}
					str+='</div>';
				////////////////////////////////////////////////////////////////////////
				// if (mssg[i].topic.content != undefined && mssg[i].topic.content.indexOf("\n") > -1) { //判断有否有回车符  有则换行
				// 	str += '<div class="article_content" data-content="'+mssg[i].topic.content+'">' + toFaceImg(mssg[i].topic.content.replace(/\n/g, "</br>")) + '</div></div>';
				// } else {
				// 	str += '<div class="article_content" data-content="'+mssg[i].topic.content+'">' + toFaceImg(mssg[i].topic.content) + '</div></div>';
				// }

				str += '<div class="onDisplay"></div>' +
					'<div class="pictureShow photoblock-many">' +
					'<ul>';

				//topictype==2  动态为视频
				if (mssg[i].topic.topictype == 2) {
					str += '<div class="article_video">' + addVideo(ImgHOST() + mssg[i].topic.videourl, mssg[i].topic.id, ImgHOST() + mssg[i].topic.videourl + "-start-s") +'</div>';
				}


				//文章图片
				var imagepaths = imagepath.length;
				var picShow = '<div class="pic_main"><div class="wrap"><img src="" alt=""><a href="javascript:;" class="pre_btn" style="display: none;"></a><a href="javascript:;" class="next_btn" style="display: none;"></a></div>';
				var picStr = '';
				if (imagepaths != 0) {
					for (var j = 0; j < imagepaths; j++) {
						str += '<li class="pictureShow_img"><img src="' + ImgHOST() + imagepath[j] + '"/></li>';
						picStr += '<a href="javascript:;"><img src=" ' + ImgHOST() + imagepath[j] + '"></a>';
					}
					str += '</ul><div class="clear"></div></div>' + picShow + '<div class="imgs">' + picStr + '<div class="clear"></div></div></div>';
				} else {
					if (mssg[i].topic.topictype == 8&&mssg[i].topic.content!="") { //转发展示
						var mtc = JSON.parse(mssg[i].topic.content);
						var urls = mtc.shareImageUrl;
						var ImgU = "";
						if(window.location.href.indexOf("searchresult.html")>-1){
							str += '<li class="specialOn specialOn_1" data-Surl="' + urls + '" data-conType="' + mtc.shareType + '" data-content="' + mtc.shareTitle + '" class="Forwardpage" data-page="' + mtc.shareUrl + '">' +
							'<a class="clearfix" href="' + mtc.shareUrl + '">';
						}else{
							str += '<li class="specialOn specialOn_2" data-Surl="' + urls + '" data-conType="' + mtc.shareType + '" data-content="' + mtc.shareTitle + '" class="Forwardpage" data-page="' + mtc.shareUrl + '">' +
							'<a class="clearfix" href="' + mtc.shareUrl + '">';
						};
						if ((mtc.shareTitle != undefined && mtc.shareTitle != "undefined")&&mtc.shareTitle != "") {
							if (mtc.shareTitle.length > 40) {
								var shareTitle = mtc.shareTitle.substring(0, 40) + "...";
							} else {
								var shareTitle = mtc.shareTitle;
							}
						}else{
							var shareTitle = "分享一个链接，点击查看";
						}
						if (urls != undefined && urls != "") {
							if (urls.indexOf("http") == -1) {
								if (urls.indexOf(".jpg") > -1 || urls.indexOf(".png") > -1 || urls.indexOf(".gif") > -1 || urls.indexOf(".jpeg") > -1) {
									//获取图片名字
									var _a = urls.split("/");
									var _b = _a[_a.length - 1].split(".")[0];
									urls = ImgHOST() + _b;
								} else {
									urls = ImgHOST() + urls;
								}
							}
							str += '<div class="shareIMG" style="float: left;"><img src="' + urls + '" style="width: 100px;height: 100px;display:block;margin-right: 14px;cursor:pointer;">';
							if (mtc.shareImageType == 1) {
								str += '<i class="Video_cover"></i>';
							}
							str += '</div>';
							if(window.location.href.indexOf("searchresult.html")>-1){
								str += '<dl style="width:530px;" class="shareText">'; 
							}else{
								str += '<dl style="width:405px;" class="shareText">';
							};
							str+='<dd style="line-height: 26px;font-size: 14px;font-weight: bold;"></dd>' +
							'<dd class="Forwardpage" style="padding:5px;line-height:32px;font-size: 11px;cursor:pointer;">' + toFaceImg(shareTitle) + '</dd></dl>';
						} else {
							str += '<dl style="float:left;">' +
								'<dd style="line-height: 26px;font-size: 14px;font-weight: bold;"></dd>' +
								'<dd class="Forwardpage" style="padding:5px;line-height:32px;font-size: 11px;cursor:pointer;">' + toFaceImg(shareTitle) + '</dd></dl>';
						}
			
					}
					str += '</a></li><div class="clear"></div></ul><div class="clear"></div></div>';
					//str += '</div>';
				}


				var from = "";
				var qzfl = "";
				var qzUrl = "";
				var dataNames = "";
				if (mssg[i].fromCircle) {
					if (mssg[i].fromCircle == 1) {
						dataNames = mssg[i].fromCircleName;
						if (dataNames.indexOf("\/") > -1) {
							dataNames = dataNames.replace(/\//g, "_");
						} else {
							dataNames = dataNames;
						}
						qzfl = "<a href='/center/zyq.html'>来自职业圈</a>";
						qzUrl = "/center/zhiye/mydynamic.html?code=" + mssg[i].circleNo + '&dataName=' + dataNames;
					} else if (mssg[i].fromCircle == 2) {
						qzfl = "<a href='/center/qqq.html'>来自全球圈</a>";
						qzUrl = "/center/global/mydynamic.html?code=" + mssg[i].circleNo;
					} else if (mssg[i].fromCircle == 3) {
						qzfl = "<a href='/center/shq.html'>来自生活圈</a>";
						qzUrl = "/center/life/mydynamic.html?code=" + mssg[i].circleNo;
					}
					from = qzfl + '<span></span><a href="' + qzUrl + '">' + mssg[i].fromCircleName + '</a>';
				}


				//用户文章发布位置
				if (mssg[i].topic.address != "" && mssg[i].topic.address != null) {
					str += '<div class = "location"><p> ' + mssg[i].topic.address + ' <span> </span></p></div>';
				}
				str += '</div><div class="qz_from">' + from + '</div>' +
					'<div class="qz_handle">' +
					'<ul class="qz_row_line">' +
					'<li>';
				//判断是否赞过
				var clickcout = mssg[i].topic.clickcout;
				var commentcount = mssg[i].topic.commentcount;
				if (clickcout == 0) {
					clickcout = "";
				}
				if (commentcount == 0) {
					commentcount = "";
				}

				str += '<a class="like_praise login_window" href="javascript:;"><i></i>赞<span>' + clickcout + '</span></a>' +
					'</li>' +
					'<li>|</li>' +
					'<li>' +
					'<a class="review login_window" href="javascript:;"><i></i>评论<span>' + commentcount + '</span></a>' +
					'</li>' +
					'<li>|</li>' +
					'<li>' +
					'<a  class="transpond" href="javascript:;"><i></i>转发</a>' +
					'<div class="retransmission">' +
					'</div>' +
					'</li>' +
					'<br class="clear"/>' +
					'</ul>';
				//点赞人头像		
				if (clickMaplist != "") {
					str += '<div class="click_portrait clear">' +
						'<div class="click_portrait_l">' +
						'<img src="/img/dianzan_10.png" />';
					str += '</div>' +
						'<div class="click_portrait_c">';
					for (var m = 0; m < clickMaplist.length; m++) {
						if (clickMaplist[m].headimg == undefined) {
							str += '<a class="clickPersonpage" data-name="'+clickMaplist[m].username+'" href="javascript:;"><img src="/img/first.png"alt="" /></a>';
						} else {
							str += '<a class="clickPersonpage" data-name="'+clickMaplist[m].username+'" href="javascript:;"><img src="' + ImgHOST() + clickMaplist[m].headimg + '"alt="" /></a>';
						}
					}
					str += '</div>';

					/*所有点赞人
					 */
					if (clickcout >= 12) {
						str += AllTheThumbUp(clickMaplist);
					}
					str += '</div>';
				} else {
					str += '<div class="click_portrait clear"></div>';
				}

				//评论内容
				str += PostCommentsContent(mssg[i], commentlist, nums, str, $("#dynamic_list"));  

			}
			autosize(document.querySelectorAll('.qz_handle textarea'));
		}

	}



	/*
	 *	帖子评论内容
	 */
	function PostCommentsContent(mssg, commentlist, nums, str, cl) {
		str += '<div class="chitchatBox clear"><ul class="stairComment">';
		str += CommentOnContent(commentlist);
		if (commentlist != null) {
			if (mssg.commentlist.length > 20) {
				var ThereAre = mssg.commentlist.length - 20;
				str += '</ul><div class="To_view_more"><a href="/center/circledetail.html?topicNo=' + mssg.topic.topicNo + '&topicName=' + mssg.user.username + '" class="view_more">后面还有' + ThereAre + '条点击查看&gt;</a></div></div>';
			} else {
				str += '</ul><div class="To_view_more"></div></div>';
			}
		}
		//评论框
		str += '<div class="qz_publish">' +
			'<div class="qz_face">';
		if (UserImg == "") {
			str += '<a class="login_window" href="javascript:;"><img src="/img/first.png" /></a>';
		} else {
			if (UserImg.indexOf("http") > -1) {
				str += '<a href="/center/me/page.html"><img src="' + UserImg + '" /></a>';
			} else {
				str += '<a href="/center/me/page.html"><img src="' + ImgHOST() + UserImg + '" /></a>';
			}
		}
		str += '</div>' +
			'<div class="p_input">' +
			'<textarea class="Postcomment" placeholder="写评论…" name="review_1"   /></textarea>' +
			'</div>' +
			'</div>' +
			'<div class="review_1"></div>' +
			'</div>' +
			'</div>';

		//时间轴
		/*if(i< mssg.length-1 && formatTime(mssg[i].topic.createtime,true).split('-')[0] - formatTime(mssg[i+1].topic.createtime,true).split('-')[0] == 1){
			str += '<div style="width: 550px;height: 108px;border:1px solid #e5e5e5;box-sizing: border-box;background: #ffffff;margin-top: 10px;margin-bottom:10px;"><div class="timeImg" style="width: 100%;height: 55px;background: url(/img/time.png) center bottom no-repeat;"></div><p style="line-height: 37px;height: 37px;font-size: 18px;text-align: center;">'+ formatTime(mssg[i+1].topic.createtime,true).split('-')[0] +'年帖子</p></div>';
		}*/

		cl.append(str);
		if(nums > 9) AfterTheLoadCompleted();   //侧导航下移 
		autosize(document.querySelectorAll('#txtId'));
		//动态文章展开收起
		var OnDisplay = $(".content_items").eq(nums).find(".article .article_content").height();
		if (OnDisplay > 144) {
			var zk = '<a class="unfold" href="javascript:;">展开</a>';
			$(".content_items").eq(nums).find(".publish_rticle .onDisplay").html(zk);
		}
	}
	



	/*
	 
	 * 获取帖子动态
	 * 
	 * dynamic_list  帖子容器
	 * 
	 * */
	var plnumberof = "";
	function CommentOnContent(commentlist) {
		var str = "";
		if (commentlist != null) {
			for (var k = 0; k < commentlist.length; k++) {
				if (k < 20) {
					//parentCommentNo = null 为一级评论
					if (commentlist[k].parentCommentNo == null || commentlist[k].parentCommentNo == "") {

						str += Level1_comment(commentlist[k]);

						//二级评论内容
						plnumberof = 1;
						for (var ti = 0; ti < commentlist.length; ti++) {
							if (commentlist[ti].parentCommentNo == commentlist[k].commentNo) {
								str += TwoList(commentlist[ti], plnumberof,commentlist);
							}
						}

						//二级评论限制个数 
						if (plnumberof > 3) {
							str += '</ul><div class="ansecondary"><a class="itemzk" href="javascript:;">展开</a></div>' +
								'</div>' +
								'</li>';
						} else {
							str += '</ul><div class="ansecondary"></div>' +
								'</div>' +
								'</li>';
						}

					}
				}

			}

		}
		return str;

	}


	/*
 
	 * 加载一级评论内容
	 * */

	function Level1_comment(msg) {
		str = '<li class="comments-item" data-id="' + msg.commentNo + '"data-name="' + msg.childusername + '">' +
			'<div class="comments-item-bd">' +
			'<div class="ui-avatar">';
		//评论者头像
		if (msg.commentuser.imagepath == null) {
			str += '<img src="/img/first.png" />';
		} else {
			str += '<img src="' + ImgHOST() + msg.commentuser.imagepath + '" />';
		}

		str += '</div>' +
			'<div class="comments-content">' +
			'<a href="javascript:;" class="qz_name" data-name=' + msg.commentuser.username + '>' + (msg.commentuser.nickname || msg.commentuser.username) + '</a>：<span>' + toFaceImg(msg.content) + '</span>' +
			'<div class="comments-op">' +
			'<span class="ui-mr10 state">' + formatTime(msg.createtime) + '</span>' +
			'<a href="javascript:;" class="act-reply" title="回复"></a>'+
			'</div><div class="revert_box"></div>' +
			'</div>' +
			'<div class="comments-list mod-comments-sub"><ul>';

		return str;
	}



	/*
	 
	 * 
	 * 加载二级评论  和三级评论
	 * */

	function TwoList(msg, numberof,commentlist) {
		if (plnumberof > 3) {

			var two_comment = '<li class="comments-item HideComments" data-id="' + msg.commentNo + '"data-name="' + msg.childusername + '"><div class="comments-item-bd">' +
				'<div class="ui-avatar">';
		} else {
			var two_comment = '<li class="comments-item" data-id="' + msg.commentNo + '"data-name="' + msg.childusername + '"><div class="comments-item-bd">' +
				'<div class="ui-avatar">';
		}
		if (msg.commentuser.imagepath == null) {
			two_comment += '<img src="/img/first.png" />';
		} else {
			two_comment += '<img src="' + ImgHOST() + msg.commentuser.imagepath + '" />';
		}
		two_comment += '</div>' +
			'<div class="comments-content">' +
			'<a href="javascript:;" class="qz_name" data-name=' + msg.commentuser.username + '>' + (msg.commentuser.nickname || shieldNumber(msg.commentuser.username)) + '</a><span>回复</span>' +
			'<a href="javascript:;" class="qz_name reply_content" data-name=' + msg.parentcommentuser.parentusername + '>' + msg.parentcommentuser.parentnickname + '</a>' + toFaceImg(msg.content) + '' +
			'<div class="comments-op">' +
			'<span class="ui-mr10 state">' + formatTime(msg.createtime) + '</span>' +
			'<a href="javascript:;" class="act-reply" title="回复"></a>'+
			'</div><div class="revert_box"></div>' +
			'</div></li>';

		//加载三级评论内容
		for (var flyers = 0; flyers < commentlist.length; flyers++) {
			if (commentlist[flyers].parentCommentNo == msg.commentNo) {
				plnumberof ++
				two_comment += TwoList(commentlist[flyers], plnumberof,commentlist)
			}
		}
		return two_comment;
	};



	//跳转到用户主页
	$(document).on("click", ".messagebox dt,.messagebox .authorName", function() {
		var strangename = $(this).parents(".content_items").attr("data-name");
		getInfo({
			myname:getCookie("username")||"nouser",
			username:strangename,
			templetName:"pageJingtai"
		})
	});
	

	//点赞头像跳转到用户主页
	$(document).on("click", ".clickPersonpage", function() {
		var strangename = $(this).attr("data-name");
		getInfo({
			myname:getCookie("username")||"nouser",
			username:strangename,
			templetName:"pageJingtai"
		})
	});


	//评论跳转主页
	$(document).on("click", ".ui-avatar", function() {
		var strangename = $(this).parent().parent().attr("data-name");
		getInfo({
			myname: getCookie("username") || "nouser",
			username: strangename,
			templetName: "pageJingtai"
		});
	})
	
	//处理视频的函数
	function addVideo(u, ids, posterBG) {
		var str = "";
		if (u) {
			str = "<video class='videoName' poster='" + posterBG + "' id='" + ids + "' style='background:#000;' controls='controls' height='400' width='100%' src='" + u + "'></video>";
		};
	  '</video>'

		return str;
	};

})



