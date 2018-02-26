$(function() {
	var iNow = 0;
	//评论表情
	$("a.emotion").live("click", function(e) {
		var divid = $("#shuaiId");
		smohanfacebox($(this),divid,"txtId");
	});

	//	调取文章详情接口
	var strkq = "";
	if (UserName) {
		findTopic_DynamicDetails(UserName);
	} else {
		strkq = "login_window"
		findTopic_DynamicDetails("nouser");
	}

	function findTopic_DynamicDetails(datas) {
		$.ajax({
			type: "post",
			url: serviceHOST() + '/topic/findTopicInfo.do',
			data: {
				"topicNo": getURIArgs("topicNo"),
				"username": datas
			},
			headers: {
				"token": qz_token()
			},
			dataType: "json",
			success: function(msg) {
				if (msg.status == 0) {
					getDetails(msg.data)
					autosize(document.querySelectorAll('.qz_handle textarea'));
					//文章详情页的图片轮播
					//左侧轮播
					var len = $('.imgs img').length;
					var num = 0;

					$(".imgs a").eq(num).css("border", "2px solid #ff8518")
					$(".imgs img").eq(num).css({
						"width": "54px",
						"height": "54px"
					})
					$('.pre_btn').click(function() {
						$(".imgs a").eq(num).css("border", "0px")
						$(".imgs img").eq(num).css({
							"width": "58px",
							"height": "58px"
						})
						num--;
						num = (len + num) % len;
						var img = $('.imgs img').eq(num).attr('src');
						$(".imgs a").eq(num).css("border", "2px solid #ff8518")
						$(".imgs img").eq(num).css({
							"width": "54px",
							"height": "54px"
						})
						$('.wrap img').attr('src', img)
					});
					$('.next_btn').click(function() {
						$(".imgs a").eq(num).css("border", "0px")
						$(".imgs img").eq(num).css({
							"width": "58px",
							"height": "58px"
						})
						num++;
						num %= len;
						var img = $('.imgs img').eq(num).attr('src');
						$(".imgs a").eq(num + 1).css("border", "")
						$(".imgs a").eq(num).css("border", "2px solid #ff8518")
						$(".imgs img").eq(num).css({
							"width": "54px",
							"height": "54px"
						})
						$('.wrap img').attr('src', img)
					});
					$('.imgs img').click(function() {
						var img = $(this).attr('src');
						$(this).parent("a").css("border", "2px solid #ff8518");
						$(this).css({
							"width": "54px",
							"height": "54px"
						})
						$(this).parent("a").siblings().find("img").css({
							"width": "58px",
							"height": "58px"
						})
						$(this).parent("a").siblings().css("border", "")
						$('.wrap img').attr('src', img)
							//console.log($('.wrap').offset().left)
					});
					$('.wrap').on('mousemove', function(ev) {
						var ev = ev || event;
						var minLeft = $('.wrap').offset().left + $('.wrap').outerWidth() / 5;
						var midLeft = $('.wrap').offset().left + $('.wrap').outerWidth() / 2;
						var maxLeft = $('.wrap').offset().left + $('.wrap').outerWidth() * 0.8;
						if (ev.clientX > minLeft && ev.clientX < midLeft) {
							$('.next_btn').hide();
							$('.pre_btn').show();
						}
						if (ev.clientX > midLeft && ev.clientX < maxLeft) {
							$('.pre_btn').hide();
							$('.next_btn').show();
						}
					});
					$('.wrap').on('mouseleave', function() {
							$('.pre_btn').hide();
							$('.next_btn').hide();
						})
						//调用显示更多插件。参数是标准的 jquery 选择符 
					$.showMore(".showMoreNChildren"); //视频相关加载更多，就这一句话
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}
		});
	}


	//文章详情页的图片轮播
	/*
	 
	 * 
	 * 
	 * 推荐里面的图片功能
	 * */
	// $('.detail_img img').on('mousemove',function(ev){
	// 	var ev = ev || event;
	// 	$(this).css('cursor','url(/img/big_scale.cur),auto');
	// 	ev.stopPropagation();
	// });

	//右侧轮播
	$(document).on('mousemove', '.detail_img', function(ev) {
		var ev = ev || event;
		var o = $(this).offset().left;
		var w = $(this).width();
		var l = $(this).offset().left + w / 5;
		var m = $(this).offset().left + w * 0.8;
		var maxWidth = o + w;
		//console.log(o,w,l,m);
		if (ev.clientX > o && ev.clientX < l) {
			$(this).css('cursor', 'url(/img/pre_btn.cur),auto');
		} else if (ev.clientX > m && ev.clientX < maxWidth) {
			$(this).css('cursor', 'url(/img/next_btn.cur),auto');
		} else {
			$(this).css('cursor', 'url(/img/big_scale.cur),auto');
		}
	});
	$(document).on('click', '.detail_img img', function(ev) {
		var index = $(this).index();
		console.log(index);
		var ev = ev || event;
		var o = $(this).parent().offset().left;
		var w = $(this).parent().width();
		var l = $(this).parent().offset().left + w / 5;
		var m = $(this).parent().offset().left + w * 0.8;
		var maxWidth = o + w;
		console.log(o, w, l, m);
		var parent = $(this).parent();
		if (ev.clientX > o && ev.clientX < l) {
			$(this).parent().children().eq(0).appendTo(parent);
		} else if (ev.clientX > m && ev.clientX < maxWidth) {
			$(this).parent().children().last().prependTo(parent);
		} else {
			$(this).parent().hide();
			$(this).parent().next('.img_show').css('display', 'block');
			var w = $(this).width();
			var h = $(this).height();
			var img_src = $(this).attr('src');
			$(this).parent().next().find('img').attr('src', img_src);
			$(this).parent().next().find('img').width(2 * w);
			$(this).parent().next().find('img').height(2 * h);
		}

	});

	$(document).on('mousemove', '.img_show img', function(ev) {
		var ev = ev || event;
		var o = $(this).offset().left;
		var w = $(this).width();
		var l = $(this).offset().left + $(this).width() / 5;
		var m = $(this).offset().left + $(this).width() * 0.8;
		// console.log(ev.clientX,l,m,$(this).parent().offset().left)
		if (ev.clientX > l && ev.clientX < m) {
			$(this).css('cursor', 'url(/img/small_scale.cur),auto');
		} else if (ev.clientX > 0 && ev.clientX < l) {
			$(this).css('cursor', 'url(/img/pre_btn.cur),auto');
		} else if (ev.clientX > m && ev.clientX < o + w) {
			$(this).css('cursor', 'url(/img/next_btn.cur),auto');
		}
	});

	$(document).on('click', '.img_show img', function(ev) {
		var ev = ev || event;
		var o = $(this).offset().left;
		var w = $(this).width();
		var l = $(this).offset().left + $(this).width() / 5;
		var m = $(this).offset().left + $(this).width() * 0.8;
		var iNow_len = $(this).parent().prev().children().length;
		if (ev.clientX > l && ev.clientX < m) {
			$(this).parent().hide();
			$(this).parent().prev('.detail_img').css("display", "block");
		} else if (ev.clientX > o && ev.clientX < l) {
			$(this).css('cursor', 'url(/img/pre_btn.cur),auto');
			iNow--;
			iNow = (iNow + iNow_len) % iNow_len;
			var iNow_src = $(this).parent().prev().children().eq(iNow).attr('src');
			// console.log(iNow_len,iNow,iNow_src);
			$(this).attr('src', iNow_src);
		} else if (ev.clientX > m && ev.clientX < o + w) {
			$(this).css('cursor', 'url(/img/next_btn.cur),auto');
			iNow++;
			iNow %= iNow_len;
			var iNow_src = $(this).parent().prev().children().eq(iNow).attr('src');
			$(this).attr('src', iNow_src);
		}
		return false;
	});

	function getDetails(msg) {
		var str = "";

		var imagepath = msg.topic.imagepath; //文章图片
		//var commentlist = msg.commentlist; //评论人列表
		var clickMaplist = msg.clickuserheadimgs; //点赞人头像
		var headImgUser = msg.user.imgforheadlist[0] //发帖人头像
		str += '<div class="content_items" data-type=' + msg.topic.topictype + ' data-id=' + msg.topic.topicNo + ' data-name=' + msg.user.username + '>' +
			'<div class="publish_rticle">' +
			'<dl class="message_mark">';
		//用户头像有无
		if (headImgUser == undefined) {
			str += '<dt><img src="/img/first.png" alt=""></dt>';
		} else {
			if (headImgUser.imagepath.indexOf("http") > -1) {
				str += '<dt><img src="' + headImgUser.imagepath + '" alt="" /></dt>';
			} else {
				str += '<dt><img src="' + ImgHOST() + headImgUser.imagepath + '" alt="" /></dt>';
			}
		}
		str += '<dd class="authorName"><b>' + msg.user.nickname + '</b>';
		//用户等级  和会员等级  性别
		if (msg.user.level >= 16) {
			msg.user.level = "N";
		}
		if (msg.user.sex == "男" || msg.user.sex == "女") {
			str += '<span class="gradeImg"><img src="/img/h/sj_' + user_level[msg.user.sex.charCodeAt()] + '_' + msg.user.level + '.png"/></span>';
		} else {
			str += '<span class="gradeImg"><img src="/img/h/sj_boy_' + msg.user.level + '.png"/></span>';
		}
		if (msg.user.viplevel != 0) {
			str += '<span class="vipImg"><img src="/img/h/sj_VIP_' + msg.user.viplevel + '.png"/></span>';
		}
		str += '<dd class="message_time"><span class="message_industry">' + msg.user.myindustry + '</span><span>' + formatTime(msg.topic.createtime) + '</span></dd>' +
			'</dl><div class="clear"></div>' +
			'<div class="article">';

		if (msg.topic.topictype == 8) { //转发		
			var mssg = JSON.parse(msg.topic.content);
			var content = '';
			if (mssg.content != undefined && mssg.content != ""){
				if (mssg.content.indexOf("\n") > -1) { //判断有否有回车符  有则换行
					content = mssg.content.replace(/\n/g, "</br>");
				} else {
					content = mssg.content;
				}
			}
			str += '<div class="article_content" data-content="' + content + '">' + toFaceImg(content) + '</div></div>';
		} else {
			if (msg.topic.content != undefined && msg.topic.content.indexOf("\n") > -1) { //判断有否有回车符  有则换行
				var topicContent = msg.topic.content.replace(/\n/g, "</br>");
			} else {
				var topicContent = msg.topic.content;
			}
			str += '<div class="article_content" data-content="' + msg.topic.content + '">' + toFaceImg(topicContent) + '</div></div>';
		}


		str += '<div class="pictureShow spaciaMaxHeight photoblock-many">';
		//topictype==2  动态为视频        4为图文
		if (msg.topic.topictype == 2) { //视频
			str += '<div class="article_video">' + addVideo(ImgHOST() + msg.topic.videourl, msg.topic.id, 400, ImgHOST() + msg.topic.videourl + "-start-s") + '</div>';
		}else {
			//文章图片
			var imagepaths = imagepath.length;
			if (imagepaths == 1) {
				str += '<ul>' +
					'<li><img class="pictureShow_1 spaPicShow" src="' + ImgHOST() + imagepath[0] + '"/></li>' +
					'</ul>'
			}else if (imagepaths > 1) {
				str += '<div class="pic_main">' +
					'<div class="wrap">' +
					'<img src="' + ImgHOST() + imagepath[0] + '" alt="">' +
					'<a href="javascript:;" class="pre_btn" style="display: none;"></a>' +
					'<a href="javascript:;" class="next_btn" style="display: none;"></a>' +
					'</div>' +
					'<div class="imgs">'
				for (var i = 0; i < imagepaths; i++) {
					str += '<a href="javascript:;"><img src="' + ImgHOST() + imagepath[i] + '"></a>'
				}
				str += '<div class="clear"></div>' +
					'</div>' +
					'<div class="img_show"></div>' +
					'</div>'
			}else{
				if (msg.topic.topictype == 8&&msg.topic.content!="") { //转发展示
					var mssg = JSON.parse(msg.topic.content);
					var url = mssg.shareImageUrl;
					var ImgU = "";
					str += '<li class="specialOn specialOn_2" data-Surl="' + url + '" data-conType="' + mssg.shareType + '" data-content="' + mssg.shareTitle + '" class="Forwardpage" data-page="' + mssg.shareUrl + '">' +
					'<a class="clearfix" href="' + mssg.shareUrl + '">';
				
					
					if ((mssg.shareTitle != undefined && mssg.shareTitle != "undefined")&&mssg.shareTitle != "") {
						if (mssg.shareTitle.length > 40) {
							var shareTitle = mssg.shareTitle.substring(0, 40) + "...";
						} else {
							var shareTitle = mssg.shareTitle;
						}
					}else{
						var shareTitle = "分享一个链接，点击查看";
					}
					if (url != undefined && url != "") {
						if (url.indexOf("http") == -1) {
							if (url.indexOf(".jpg") > -1 || url.indexOf(".png") > -1 || url.indexOf(".gif") > -1 || url.indexOf(".jpeg") > -1) {
								//获取图片名字
								var _a = url.split("/");
								var _b = _a[_a.length - 1].split(".")[0];
								url = ImgHOST() + _b;
							} else {
								url = ImgHOST() + url;
							}
						}
						str += '<div class="shareIMG"><img src="' + url + '">';
						if (mssg.shareImageType == 1) {
							str += '<i class="Video_cover"></i>';
						}
						str += '</div>';
						str += '<dl style="width:405px;" class="shareText">';
						str+='<dd class="share_txt_top"></dd>' +
							'<dd class="Forwardpage">' + toFaceImg(shareTitle) + '</dd></dl>';
					} else {
						str += '<dl class="shareText">' +
							'<dd class="share_txt_top"></dd>' +
							'<dd class="Forwardpage">' + toFaceImg(shareTitle) + '</dd></dl>';
					}

				}
				str += '</a></li><div class="clear"></div></ul>';
			}
		}

		str += '<div class="clear"></div></div>';
		//用户文章发布位置
		if (msg.topic.address != "" && msg.topic.address != undefined) {
			str += '<div class = "location"><p> ' + msg.topic.address + ' <span> </span></p></div>';
		}
		str += '</div>' +
			'<div class="qz_handle">' +
			'<ul class="qz_row_line">' +
			'<li>';
		//判断是否赞过
		var clickcout = msg.topic.clickcout;
		var commentcount = msg.topic.commentcount;
		if (clickcout == 0) {
			clickcout = "";
		}
		if (commentcount == 0) {
			commentcount = "";
		}
		if (msg.isClickOrCannel == 1) {
			str += '<a class="like_praise like_yizan like_zan ' + strkq + '" href="javascript:;"><i></i>赞<span>' + clickcout + '</span></a>';
		} else {
			str += '<a class="like_praise like_zan ' + strkq + '" href="javascript:;"><i></i>赞<span>' + clickcout + '</span></a>';
		}
		str += '</li>' +
			'<li>|</li>' +
			'<li>' +
			'<a class="review" href="javascript:;"><i></i>评论<span>' + commentcount + '</span></a>' +
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
				'<img src="/img/dianzan_10.png" />' +
				'</div>' +
				'<div class="click_portrait_c">';
			for (var m = 0; m < clickMaplist.length; m++) {
				if (clickMaplist[m].headimg == undefined) {
					if (clickMaplist[m].username == UserName) {
						str += '<a class="Myhead clickPersonpage" data-name="'+clickMaplist[m].username+'" href="javascript:;"><img class="Myhead" src="/img/first.png"alt="" /></a>'
					} else {
						str += '<a class="clickPersonpage" data-name="'+clickMaplist[m].username+'" href="javascript:;"><img src="/img/first.png"alt="" /></a>'
					}
				} else {
					if (clickMaplist[m].username == UserName) {
						str += '<a class="Myhead clickPersonpage" data-name="'+clickMaplist[m].username+'" href="javascript:;"><img class="Myhead" src="' + ImgHOST() + clickMaplist[m].headimg + '"alt="" /></a>'
					} else {
						str += '<a class="clickPersonpage" data-name="'+clickMaplist[m].username+'" href="javascript:;"><img src="' + ImgHOST() + clickMaplist[m].headimg + '"alt="" /></a>'
					}
				}
			}

			str += '</div>' ;
			/*所有点赞人
			 */
			if (clickcout >= 12) {
				str += AllTheThumbUp(clickMaplist);
			}
			str += '</div>';
		}
		str += '<div class="qz_publish">' +
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
			'<textarea class="Postcomment" id="txtId" placeholder="写评论…" name="review_1"  /></textarea>' +
			'</div>' +
			'</div>' +
			'<div class="review_1"></div>';

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
				url: serviceHOST() + "/topic/findTopicComments.do",
				dataType: "json",
				headers: {
					"token": qz_token()
				},
				data: {
					username: datas,
					topicNo: getURIArgs("topicNo"),
					pageNum: page,
					pageSize: 10000
				},
				success: function(msg) {
					if (msg.status == 0) {

						//一级评论内容
						var commentlist = msg.data.commentlist; //评论个数
						if (commentlist == null) {
							$(".chitchatBox").html("<div style='text-align: center; line-height: 400px;'>暂无评论内容，赶紧占座评论吧</div>")
						} else {
							str += '<ul class="stairComment commentListsOne showMoreNChildren" pagesize="20">'
							for (var k = 0; k < commentlist.length; k++) {

								//parentCommentNo = null 为一级评论
								if (commentlist[k].parentCommentNo == null || commentlist[k].parentCommentNo == "") {
									
									str += Level1_comment(commentlist[k]);

									//二级评论内容
									for (var ti = 0; ti < commentlist.length; ti++) {
										if (commentlist[ti].parentCommentNo == commentlist[k].commentNo) {
											str += TwoList(commentlist[ti],commentlist);
										}
									}

									str += '</ul>' + 
										'<div class="ansecondary"></div>' +
										'</div>' +
										'</li>';
								}

							}
							str += '</ul>';
						}
					}else if(msg.status==-3){
						getToken();
					};
					$(".chitchatBox").append(str)

					$.showMore(".showMoreNChildren"); //视频相关加载更多，就这一句话
					$(".chitchatBox .more").html("查看更多<i>")
				},
				error: function() {
					console.log("error")
				}
			});
		}

		/****************************点赞    评论   转发end*********************************/
		//自己发帖 点击加载  收藏 投诉   加为好友
		$(document).on("click", ".message_right .Others_d", function(e) {
			e.stopPropagation();
			$(this).siblings(".dropMenu").toggle();
		})
		$(document).on('click', function() {
			$(".dropMenu").hide();
		})
		$(document).on('click', ".dropMenu", function(e) {
				e.stopPropagation(); //阻止冒泡
			})
			/******************关注个人*********************************/
		$(document).on("click", ".guanzhu", function() {
				if (UserName) {
					var data_status = $(this).attr("data_status");
					var nickN = $(this).parents(".message_right").siblings(".message_mark").find(".authorName b").html();
					var followId = $(this).attr("autherId"); //被关注对象的id
					//个人
					var params = {
						following: followId, //被关注对象的用户名
						username: getCookie("username") //自己的用户名 
					};
					var par = $.param(params);
					//取消关注
					if (data_status == 0 || data_status == 1) {
						$.im.confirm("确定要取消关注'" + nickN + "'吗？", function() {
							$.ajax({
								type: "post",
								url: RestfulHOST() + "/following/unsetfollowing?" + par,
								headers: {
									"Authorization": "AQAa5HjfUNgCr27x"
								},
								success: function(msg) {
									if (msg.status == 0) {
										friendlyMessage("取消关注成功", function() {
											location.reload();
										});
									}
								},
								error: function() {
									console.log("error");
								}
							});
						});
					} else if (data_status == -1) { //关注
						$.ajax({
							type: "post",
							url: RestfulHOST() + '/following/setfollowing?' + par,
							dataType: "json",
							headers: {
								"Authorization": "AQAa5HjfUNgCr27x"
							},
							success: function(msg) {

								if (msg.status == 0) {
									friendlyMessage("关注成功", function() {
										location.reload();
									});
								}
							},
							error: function() {
								console.log("error")
							}

						});
					}
				}
			})

		

		//发表一级评论
		$(document).on("click", ".content_items .review_1 .publish", function() {
			if (getCookie("username")) {
				if ($(".chitchatBox .stairComment").html() == undefined) {
					$(".chitchatBox").empty().append("<ul class='stairComment'></ul>");
				}
				var topicNo = $(this).parents(".content_items").attr("data-id"); //帖子编号
				var parentCommentNo = null; //评论的父级评论编号
				var parentusername = $(this).parents(".content_items").attr("data-name"); //被评论者用户名
				var childusername = getCookie('username'); //评论者用户名
				var content = html2Escape($(this).parents(".qz_handle").find(".p_input .Postcomment").val()); //内容
				var comments_item = $(".chitchatBox .stairComment");
				createComment(topicNo, parentCommentNo, parentusername, childusername, content, comments_item);
				var conmmentslist = $(".comments-item").length;
			}
		})

		//发表二级评论
		$(document).on("click", ".chitchatBox .revert_box .import .publish", function() {
			if (getCookie("username")) {
				var topicNo = $(".content_items").attr("data-id"); //帖子编号
				var parentCommentNo = $(this).parents("li.comments-item").attr("data-id"); //评论的父级评论编号
				var parentusername = $(this).parents("li.comments-item").attr("data-name"); //被评论者用户名
				var childusername = getCookie("username"); //评论者用户名
				var content = html2Escape($(this).parents(".import").find(".Postcomment").val()); //内容
				var username = $(this).parents("li.comments-item").find(".comments-content .qz_name").html(); //评论人名称
				var comments_item = $(this).parents("li.comments-item").find(".comments-item-bd .mod-comments-sub ul");
				var stairComment = $(this).parents(".chitchatBox .stairComment");
				createComment(topicNo, parentCommentNo, parentusername, childusername, content, comments_item, username);
			}
		})

		//评论
		function createComment(topicNo, parentCommentNo, parentusername, childusername, content, comments_item, username) {
			if ($.trim(content) == "") {
				warningMessage("评论内容不能为空");
				return false;
			} else if (content.length > 140) {
				warningMessage("评论内容不能超过140个汉字");
				return false;
			}
			$.ajax({
				type: "post",
				url: serviceHOST() + "/comment/createComment.do",
				data: {
					topicNo: topicNo,
					parentCommentNo: parentCommentNo,
					parentusername: parentusername,
					childusername: childusername,
					content: content
				},
				dataType: "json",
				headers: {
					"token": qz_token()
				},
				success: function(msg) {
					if (msg.status == 0) {
						$(".detail_left .p_input .Postcomment").val("");
						$(".detail_left .import .Postcomment").val("");
						var mssg = msg.data;
						stairComment(mssg, comments_item, parentCommentNo, username);
						friendlyMessage("评论成功");
						$(".detail_left .revert_box .reply").hide();
						publish = "发表";
					}else if(msg.status==-3){
						getToken();
					};
				},
				error: function() {
					console.log("error")
				}

			});
		}
		//一级评论  和  二级评论
		function stairComment(mssg, comments_item, parentCommentNo, username) {
			var str = '<li class="comments-item" data-id="' + mssg.commentNo + '"data-name="' + mssg.childusername + '">' +
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
			if (parentCommentNo == null) {
				str += '<a href="javascript:;" class="qz_name"  data-name=' + UserName + '>' + (Nickname || shieldNumber(UserName)) + '</a>：<span>' + toFaceImg(mssg.content) + '</span>';
			} else {
				str += '<a href="javascript:;" class="qz_name" data-name=' + UserName + '>' + (Nickname || shieldNumber(UserName)) + '</a><span>回复</span>' +
					'<a href="javascript:;" class="qz_name reply_content" data-name=' + mssg.parentusername + '>' + username + '</a>' + toFaceImg(mssg.content) + '';
			}
			str += '<div class="comments-op">' +
				'<span class="ui-mr10 state">' + formatTime(mssg.createtime) + '</span>' +
				'<a href="javascript:;" class="act-reply" title="回复"></a>' +
				'<a href="javascript:;" class="oneselfdel"></a>' +
				'</div><div class="revert_box"></div>' +
				'</div>';
			if (parentCommentNo == null) {
				str += '<div class="comments-list mod-comments-sub"><ul></ul>' + //二级评论容器
					'<div class="ansecondary"></div>' +
					'</div>';
			}
			str += '</li>';
			comments_item.append(str);
		}


		$(document).on("click", ".qz_row_line .transpond", function(e) {
			var _this = $(this);
			var con = $(this).parents(".content_items");
			commonShare(_this, con);
			e.stopPropagation();
		});
		$(document).on("click", function(e) {
			$(".retransmission").hide();
			e.stopPropagation();
		});
		$(document).on("click", ".detail_right2 .right_transpond", function(e) {
			$(this).parents(".recommend_main").siblings().find(".retransmission").hide();
			var _this = $(this);
			var con = $(this).parents(".recommend_main");
			commonShare(_this, con)

			// 转发位置显示
			var zfOffset = $(".detail_right2").height() - 194;
			if (_this.offset().top -130 > zfOffset && zfOffset > 0) {
				$(".right_handle .retransmission").css({
					"left": "120px",
					"top": "-168px"
				});
				$(".right_handle .retransmission .qrodeBox").css("top", 0);
			} else if (zfOffset < 0) {
				$(".right_handle .retransmission").css({
					"left": "120px",
					"top": "-168"- zfOffset + "px"
				});
				$(".right_handle .retransmission .qrodeBox").css("top", 0);
			}else {
				$(".right_handle .retransmission").css({
					"left": "120px",
					"top": "30px"
				});
			}
			e.stopPropagation();
		});
		$(document).on("click", ".qz_row_line .retransmission,.detail_right2 .right_transpond", function(e) {
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
				'<a href="javascript:;" class="qq_zone">QQ空间</a>' +
				'<a href="javascript:;" class="qq_friends">QQ好友</a>';
			thisT.siblings(".retransmission").html(fx);
			//生成微信朋友圈二维码
			var topicNum = pars.attr("data-id");
			var topicUsername = pars.attr("data-name");
			if(pars.attr("data-type")=="8"){
				var pageUrl=pars.find(".specialOn").attr("data-page");
				var urls = pageUrl;
			}else{
				var urls = serHOST()+'/Page/news_details/newsDetails.html?topicNo=' + topicNum;
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
		$(document).on("focus", ".content_items .qz_publish .Postcomment", function() {

			var fabiao = '<a href="javascript:;" class="emotion"></a>' +
				'<a href="javascript:;" class="publish ' + strkq + '">发表</a>' +
				'<div id="shuaiId"></div>';
			$(".content_items .review_1").html("");
			$(".content_items .comments-content .revert_box").html("");
			$(this).css({
				"border-color": "#3FA435",
				"color": "#333"
			})

			$(this).parents(".qz_handle").find(".review_1").html(fabiao);
			$(".Postcomment").removeAttr("id");
			$(this).attr("id", "txtId") //表情内容框
		})

		$(document).on("blur", ".content_items .qz_publish textarea", function(e) {
				$(".content_items").find(".Postcomment").css({
					"border-color": "#ccc",
					"color": "#ccc"
				});
			})
			//点击显示二级评论发表
		$(document).on("click", ".chitchatBox .comments-content .act-reply", function(e) {

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
		$(document).on("click", ".chitchatBox .comments-op .oneselfdel", function() {
			var topicNo = $(".content_items").attr("data-id"); //帖子编号
			var commentNo = $(this).parents("li.comments-item").attr("data-id"); //评论编号
			//		var commentsitem = $(this).parents("li.comments-item");
			var commentsitem = $(this).parent().parent().parent().parent();
			console.log(commentsitem)
			var username = getCookie("username"); //删帖者用户名
			$.ajax({
				type: "post",
				url: serviceHOST() + "/comment/deleteComment.do",
				dataType: "json",
				data: {
					topicNo: topicNo,
					commentNo: commentNo,
					username: username
				},
				headers: {
					"token": qz_token()
				},
				success: function(msg) {
					if (msg.status == 0) {
						commentsitem.remove();
						friendlyMessage("删除评论成功");
					}else if(msg.status==-3){
						getToken();
					};
				},
				error: function() {
					console.log("error")
				}

			});
		})

	}

	//文章点赞
	var handle = true;
	$(document).on("click", ".content_items .qz_row_line .like_zan", function() {
		if (getCookie("username")) {
			if (handle == false) {
				return false;
			}
			handle = false;
			var username = UserName; //点赞用户名
			var topicNo = $(this).parents(".content_items").attr("data-id"); //帖子编号
			var isClickOrCannel = "";
			var num = $(this).find("span").text();
			var _this = $(this).parents(".content_items").find(".click_portrait");
			var _likezan = $(this);
			num = Number(num);
			if ($(this).hasClass("like_yizan")) {
				isClickOrCancel = -1;
				handlerClickLike(username, topicNo, isClickOrCancel, _likezan, num, _this)
			} else {
				isClickOrCancel = 1;
				handlerClickLike(username, topicNo, isClickOrCancel, _likezan, num, _this)
			}
		}
	})

	/*
	 
	 * 点赞接口
	 * */
	function handlerClickLike(username, topicNo, isClickOrCancel, _likezan, num, _this) {
		var str = "";
		$.ajax({
			type: "post",
			url: serviceHOST() + "/clicklike/handlerClickLike.do",
			dataType: "json",
			data: {
				username: username,
				topicNo: topicNo,
				isClickOrCancel: isClickOrCancel
			},
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				handle = true;
				if(msg.status==-3){
					getToken();
				};
				if (isClickOrCancel == 1) {
					_likezan.find("span").html(num + 1);
					_likezan.addClass("like_yizan");
					if (num == "") {
						str = '<div class="click_portrait_l"><img src="/img/dianzan_10.png" /></div><div class="click_portrait_c">';
						if (UserImg == "") {
							str += '<a class="Myhead" href="/center/me/page.html"><img src="/img/first.png" alt="" /></a>';
						} else {
							str += '<a class="Myhead" href="/center/me/page.html"><img src="' + ImgHOST() + UserImg + '"alt="" /></a>'
						}
						str += '</div>';
						_this.html(str);
					} else {
						if (UserImg == "") {
							str = '<a class="Myhead" href="/center/me/page.html"><img src="/img/first.png"alt="" /></a>';
						} else {
							str = '<a class="Myhead" href="/center/me/page.html"><img src="' + ImgHOST() + UserImg + '"alt="" /></a>'
						}
						_this.find(".click_portrait_c").append(str);
					}

				} else {
					_likezan.find("span").html(num - 1);
					_likezan.removeClass("like_yizan");
					_this.find(".Myhead").remove();
					if (num - 1 == 0) {
						_this.html("");
						_likezan.find("span").html(" ");
					}
				}
			},
			error: function() {
				console.log("error")
			}

		});
	}




	/* 
	 * 查看所有点赞人
	 * */
	function AllTheThumbUp(clickMaplist) {
		str = '<div class="click_portrait_r" title="赞过的人">' +
			'<span>···</span>' +
			'<div class="all_praise">' +
			'<p>赞过的人' +
			'<a class="praise_shut" href="javascript:;">×</a>' +
			'</p>' +
			'<ul>';
		for (var m = 0; m < clickMaplist.length; m++) {
			str += '<li><dl>';
			if (clickMaplist[m].headimg == undefined) {
				str += '<dt><img src="/img/first.png"alt="" /></dt>';
			} else {
				str += '<dt><img src="' + ImgHOST() + clickMaplist[m].headimg + '"alt="" /></dt>';
			}
			str += '<dd class="recommend_name">' + clickMaplist[m].nickname + '</dd>' +
				'<dd></dd>' +
				'</dl>' +
				'<div class="dispose">' +
				'<a class="plus" data-name=' + clickMaplist[m].username + ' href="javascript:;">加为好友</a>' +
				'</div>' +
				'</li>';
		}
		str += '</ul>' +
			'</div>' +
			'</div>';
		return str;
	}






	/*
	 
	 * 
	 * 点赞
	 * */
	var handle = true;
	$(document).on("click", ".detail_right2 .recommend_main a.right_praise", function() {
		if (getCookie("username")) {
			if (handle == false) {
				return false;
			}
			var _this = $(this);
			var topicNo = $(this).parents(".recommend_main").attr("data-id"); //帖子编号
			ThumbUpContent(topicNo, _this);
		}
	})

	function ThumbUpContent(topicNo, _this) {
		handle = false;
		var username = UserName; //点赞用户名

		var isClickOrCannel = "";
		var num = _this.find("span").text();
		num = Number(num);
		if (_this.hasClass("like_yizan")) { //取消赞         1表示赞    0 取消赞或默认值
			_this.find("span").html(num - 1);
			if (num - 1 == 0) {
				_this.find("span").html("");
			}
			isClickOrCancel = -1;
			_this.removeClass("like_yizan");
			ClickLike(username, topicNo, isClickOrCancel)
		} else { //赞
			_this.find("span").html(num + 1);
			_this.addClass("like_yizan");
			isClickOrCancel = 1;
			ClickLike(username, topicNo, isClickOrCancel)
		}
	}

	function ClickLike(username, topicNo, isClickOrCancel) {
		var str = "";
		$.ajax({
			type: "post",
			url: serviceHOST() + "/clicklike/handlerClickLike.do",
			dataType: "json",
			data: {
				username: username,
				topicNo: topicNo,
				isClickOrCancel: isClickOrCancel
			},
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				handle = true;
				if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}

		});
	}



	/*
	 
	 * 
	 * 相关推荐
	 * 
	 * */

	var page = 1;
	var stop = false;
	var more = false;
	$(document).on("click", ".detail_right2 .TheRefresh", function() {
		$(".detail_right2 .Refresh").addClass("TheRefresh_animation");
		$(".detail_right2 .Refresh").removeClass("Refresh");
		if (more == true) {
			page = 2;
			stop = false;
			more = false;
			findOneUserAllTopic(2);
			return false;
		}
		if (stop == true) {
			stop = false;
			page = page + 1;
			findOneUserAllTopic(page);
		}

	})

	findOneUserAllTopic(1);

	function findOneUserAllTopic(page) {
		if (getCookie("username")) {
			var datas = getCookie("username");
		} else {
			var datas = "nouser";
		}
		var str = "";
		var data = {
			findusername: datas, //getURIArgs("topicName"),
			findedusername: getURIArgs("topicName"),
			pageNum: page
		}
		$.ajax({
			type: "post",
			url: serviceHOST() + '/topic/findOneUserAllTopic.do',
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: data,
			success: function(msg) {
				$(".detail_right2 .recommend_wrap").empty();
				$(".detail_right2 .TheRefresh_animation").addClass("Refresh").removeClass("TheRefresh_animation");
				stop = true;
				var mssg = msg.data;
				if (msg.status == 0) {
					if (mssg == "" && page != 1) {
						more = true;
						stop = false;
						findOneUserAllTopic(1);
						return;
					}
					for (var i = 0; i < mssg.length; i++) {
						var nums = (page - 1) * mssg.length + i;
						var imagepath = mssg[i].topic.imagepath; //文章图片
						var imagepaths = imagepath.length;
						str = '<div class="recommend_main" data-type="'+mssg[i].topic.topictype+ '" data-id=' + mssg[i].topic.topicNo + ' data-name=' + mssg[i].user.username + '>' +
							'<div class="recommend_title"><span class="pagePersons" data-name='+ mssg[i].user.username +'>';
						//用户头像有无
						if (mssg[i].user.imgforheadlist == "") {
							str += '<img src="/img/first.png" alt="" />';
						} else {
							str += '<img src="' + ImgHOST() + mssg[i].user.imgforheadlist[0].imagepath + '" alt="" />';
						}

						str += '</span><b>' + (mssg[i].user.nickname || shieldNumber(mssg[i].user.username)) + '</b>' +
							'<span class="date">' + formatTime(mssg[i].topic.createtime) + '</span>' +
							'</div>' +
							'<div class="recommend_content">';

						//判断有否有回车符  有则换行
						if(mssg[i].topic.topictype == 8){
							var msgs = JSON.parse(mssg[i].topic.content);
							var content = '';
							if (msgs.content != undefined && mssg.content != ""){
								if (msgs.content.indexOf("\n") > -1) { //判断有否有回车符  有则换行
									content = msgs.content.replace(/\n/g, "</br>");
								} else {
									content = msgs.content;
								}
							}
							str += '<p class="article_content" data-content="' + content + '">' + toFaceImg(content) + '</p>';
						}else{
							if (mssg[i].topic.content && mssg[i].topic.content.indexOf("\n") > -1) {
								str += '<p class="article_content" data-content="' + mssg[i].topic.content + '">' + toFaceImg(mssg[i].topic.content.replace(/\n/g, "</br>")) + '</p>';
							} else {
								str += '<p class="article_content" data-content="' + mssg[i].topic.content + '">' + toFaceImg(mssg[i].topic.content) + '</p>';
							}
						}



						str += '</div>' +
							'<div class="infold_open">' +
							'</div>';
						if (imagepaths != 0) {
							str += '<div class="detail_img">'; //图片

							str += TheArticleShowUs(imagepaths, imagepath);
							str += '</div>';
						} else if(mssg[i].topic.topictype == 8){
							//显示转发的动态
							var msgs = JSON.parse(mssg[i].topic.content);
							str += dynamicForwardedg(msgs);
						}



						//topictype==2  动态为视频
						if (mssg[i].topic.topictype == 2) {
							str += '<div class="article_video">' + addVideo(ImgHOST() + mssg[i].topic.videourl, mssg[i].topic.id, 200, ImgHOST() + mssg[i].topic.videourl + "-start-s") +
								//							'<div class="playImg"><img src="/img/qz_sp_bofang.png"/></div>'+
								'</div>';
						}
						str += '<div class="img_show">' +
							'<img src="" alt="">' +
							'</div>' +
							'<div class="right_handle">';
						str += commentsForwarding(mssg[i]);
						str += '</div><div class="qz_publish" style="display:none"></div>' +
							'</div>';

						$(".recommend_wrap").append(str);

						autosize(document.querySelectorAll('.qz_publish .Postcomment'));
						//动态文章展开收起
						var OnDisplay = $(".recommend_main").eq(nums).find(".article_content").height();
						if (OnDisplay > 104) {
							var zk = '<a class="unfold" href="javascript:;">展开全文</a>';
							$(".recommend_main").eq(nums).find(".infold_open").html(zk);
						}
					}
					//  无推荐时
					if ($(".recommend_main").length == 0) {
						$(".recommend_wrap").html("<div style='height:400px;text-align:center;line-height:400px;'>暂无相关推荐</div>");
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


	//推荐动态转发的帖子
	function dynamicForwardedg(msgs){
		var url = msgs.shareImageUrl;
		var ImgU = "";

		str = '<div class="specialOn specialOn_2" data-Surl="' +url+ '" data-content="'+msgs.shareTitle+'" data-conType="' + msgs.shareType + '" class="Forwardpage" data-page="' + msgs.shareUrl + '">' +
		'<a class="clearfix" href="' + msgs.shareUrl + '">';
		if (msgs.shareTitle != undefined && msgs.shareTitle != "undefined") {
			if (msgs.shareTitle.length > 40) {
				var shareTitle = msgs.shareTitle.substring(0, 40) + "...";
			} else {
				var shareTitle = msgs.shareTitle;
			}
		}
		if (url != undefined && url != "") {
			if (url.indexOf("http") == -1) {
				if (url.indexOf(".jpg") > -1 || url.indexOf(".png") > -1 || url.indexOf(".gif") > -1 || url.indexOf(".jpeg") > -1) {
					//获取图片名字
					var _a = url.split("/");
					var _b = _a[_a.length - 1].split(".")[0];
					url = ImgHOST() + _b;
				} else {
					url = ImgHOST() + url;
				}
			}
			str += '<div class="shareIMG"><img src="' + url + '">';
			if (msgs.shareImageType == 1) {
				str += '<i class="Video_cover"></i>';
			}
			str += '</div><dl style="width:164px;" class="shareText">'+
			    '<dd class="share_txt_top"></dd>' +
				'<dd class="Forwardpage">' + toFaceImg(shareTitle) + '</dd></dl>';
		} else {
			str += '<dl class="shareText">' +
				'<dd class="share_txt_top"></dd>' +
				'<dd class="Forwardpage">' + toFaceImg(shareTitle) + '</dd></dl>';
		}
		str += '</a></div><div class="clear"></div>';
		return str;
	}




	/*
	 
	 * 
	 * 
	 * 推荐点击显示评论发表
	 * 
	 * */

	$(document).on("click", ".recommend_main .right_review", function(e) {
		e.stopPropagation();
		var str = '<div class="p_input">' +
			'<textarea class="Postcomment" placeholder="写评论…" name="review_1"  ></textarea>' +
			'</div>' + // class="emotion"
			'<div class="review_1"><a href="javascript:;"></a><a href="javascript:;" class="publish_tj '+ strkq +'">发表</a></div>' +
			'</div>';
		$(this).parents(".recommend_main").find(".qz_publish").html(str);
		$(this).parents(".recommend_main").find(".qz_publish").toggle()
		autosize(document.querySelectorAll('.qz_publish textarea'));
	})



	/*
	 
	 * 
	 * 推荐评论
	 * */

	function commentsForwarding(msg) {
		var cfing = '<ul>' +
			'<li>';
		//判断是否赞过
		var clickcout = msg.topic.clickcout;
		var commentcount = msg.topic.commentcount;
		if (clickcout == 0) {
			clickcout = "";
		}
		if (commentcount == 0) {
			commentcount = "";
		}
		if (msg.isClickOrCannel == 1) {
			cfing += '<a class="right_praise like_yizan like_zan ' + strkq + '" href="javascript:;"><i class="right_icon"></i>赞<span>' + clickcout + '</span>|';
		} else {
			cfing += '<a class="right_praise like_zan ' + strkq + '" href="javascript:;"><i class="right_icon"></i>赞<span>' + clickcout + '</span>|';
		}
		cfing += '</a>' +
			'</li>' +
			'<li>' +
			'<a class="right_review" href="javascript:;">' +
			'<i class="right_icon"></i>' +
			'评论' +
			'<span>' + commentcount + '</span>|' +
			'</a>' +
			'</li>' +
			'<li>' +
			'<a class="right_transpond" href="javascript:;">' +
			'<i class="right_icon"></i>转发' +
			'</a>' +
			'<div class="retransmission"></div>' +
			'</li>' +
			'<br class="clear">' +
			'</ul>';
		return cfing;
	}

	/*
		 
		 * 文章图片展示
		 * */
	function TheArticleShowUs(imagepaths, imagepath) {
		var ShowUs = "";
		for (var i = 0; i < imagepaths; i++) {
			ShowUs += '<img src=" ' + ImgHOST() + imagepath[i] + '"/>';
		}

		return ShowUs;
	}

	/*
	 
	 * 
	 * 推荐帖子  评论
	 * */

	$(document).on("click", ".recommend_main .publish_tj", function() {
		if (getCookie("username")) {
			var topicNo = $(this).parents(".recommend_main").attr("data-id"); //帖子编号
			var parentCommentNo = null; //评论的父级评论编号
			var parentusername = $(this).parents(".recommend_main").attr("data-name"); //被评论者用户名
			var childusername = UserName; //评论者用户名
			var content = html2Escape($(this).parents(".recommend_main").find(".p_input .Postcomment").val()) || ""; //内容
			createComment(topicNo, parentCommentNo, parentusername, childusername, content);
		}
	})

	/*
	 
	 * 评论
	 * 
	 * */

	function createComment(topicNo, parentCommentNo, parentusername, childusername, content) {
		if (content == "") {
			warningMessage("评论内容不能为空");
			return false;
		} else if (content.length >= 140) {
			warningMessage("评论内容不能超过140个汉字");
			return false;
		}
		$.ajax({
			type: "post",
			url: serviceHOST() + "/comment/createComment.do",
			data: {
				topicNo: topicNo,
				parentCommentNo: parentCommentNo,
				parentusername: parentusername,
				childusername: childusername,
				content: content
			},
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				if (msg.status == 0) {
					$(".recommend_main .p_input .Postcomment").val("");
					var mssg = msg.data;
					friendlyMessage("评论成功");
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}

		});
	}

	
	/*
	 
	 * 帖子内容展开收起
	 * */
	$(document).on("click", ".recommend_main .infold_open .unfold", function() {
		$(this).parents(".recommend_main").find(".recommend_content").css("max-height", "100%");
		$(this).html("收起");
		$(this).addClass("putflod");
	})
	$(document).on("click", ".recommend_main .infold_open .putflod", function() {
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
		};
		return str;
	};

})



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
		'<a href="javascript:;" class="qz_name" data-name=' + msg.commentuser.username + '>' + (msg.commentuser.nickname || shieldNumber(msg.commentuser.username)) + '</a>：<span>' + toFaceImg(msg.content) + '</span>' +
		'<div class="comments-op">' +
		'<span class="ui-mr10 state">' + formatTime(msg.createtime) + '</span>' +
		'<a href="javascript:;" class="act-reply" title="回复"></a>';
	if (msg.childusername == UserName) {
		str += '<a href="javascript:;" class="oneselfdel"></a>';
	}
	str += '</div><div class="revert_box"></div>' +
		'</div>' +
		'<div class="comments-list mod-comments-sub"><ul>';

	return str;
}


/*
 
 * 
 * 加载二级评论  和三级评论
 * */

function TwoList(msg,commentlist) {
	var two_comment = '<li class="comments-item" data-id="' + msg.commentNo + '"data-name="' + msg.childusername + '"><div class="comments-item-bd">' +
		'<div class="ui-avatar">';
	if (msg.commentuser.imagepath == null) {
		two_comment += '<img src="/img/first.png" />';
	} else {
		two_comment += '<img src="' + ImgHOST() + msg.commentuser.imagepath + '" />';
	}
	two_comment += '</div>' +
		'<div class="comments-content">' +
		'<a href="javascript:;" class="qz_name" data-name=' + msg.commentuser.username + '>' + (msg.commentuser.nickname ||  shieldNumber(msg.commentuser.username)) + '</a><span>回复</span>' +
		'<a href="javascript:;" class="qz_name reply_content" data-name=' + msg.parentcommentuser.parentusername + '>' + (msg.parentcommentuser.parentnickname ||  shieldNumber(msg.parentcommentuser.parentusername)) + '</a>' + toFaceImg(msg.content) + '' +
		'<div class="comments-op">' +
		'<span class="ui-mr10 state">' + formatTime(msg.createtime) + '</span>' +
		'<a href="javascript:;" class="act-reply" title="回复"></a>';
	if (msg.childusername == UserName) {
		two_comment += '<a href="javascript:;" class="oneselfdel"></a>';
	}
	two_comment += '</div><div class="revert_box"></div>' +
		'</div></li>';

	//加载三级评论内容
	for (var flyers = 0; flyers < commentlist.length; flyers++) {
		if (commentlist[flyers].parentCommentNo == msg.commentNo) {
			two_comment += TwoList(commentlist[flyers],commentlist)
		}
	}
	return two_comment;
};


//鼠标滑过显示回复  和 删除
	$(document).on("mouseover", ".act-reply", function() {
		$(this).html('<span class="Accordingreply">回复<i></i></span>');
	})
	$(document).on("mouseover", ".oneselfdel", function() {
		$(this).html('<span class="Accordingreply">删除<i></i></span>');
	})
	$(document).on("mouseout", ".oneselfdel,.act-reply", function() {
		$(this).empty();
	})
