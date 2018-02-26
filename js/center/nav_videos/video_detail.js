$(function() {
	var Vmid = getURIArgs("id");

	//评论表情
	$("a.emotion").live("click", function(e) {
		var divid = $("#shuaiId");
		smohanfacebox($(this),divid,"txtId");
	});

	//获取视频详情
	getVideoDetail()

	function getVideoDetail() {
		var str = "";
		var strs = "";
		var user_level = {
				30007: "boy",
				22899: "gril"
			}
			//区分登录和未登录
		var userNamess = "";
		if (getCookie("username")) {
			userNamess = getCookie("username");
		} else {
			userNamess = "";
		}
		$.ajax({
			type: "post",
			url: serviceHOST() + "/videoMaterial/getVmById.do",
			"dataType": "json",
			headers: {
				"token": qz_token()
			},
			data: {
				uid: userNamess,
				vmid: Vmid
			},
			success: function(msg) {
				if (msg.status == 0) {
					$(".video_box video").attr("src", msg.data.vurl);
					$(".video_box video").attr("poster", msg.data.vpicurl);
					$('.vjs-poster').css("background-image", 'url(' + msg.data.vpicurl + ')'); //视频封面图
					var videoNear = msg.data.nearVms //得到视频相关
						//视频下的详情
					str += '<div class="info_top" data-imgURL="' + msg.data.vpicurl + '">' +
						'<dl class="info_left">';
						if(msg.data.brief!="undefined"){
							str+='<dd class="info_title" data-content="' + msg.data.brief + '">' + msg.data.brief + '</dd>';
						}else{
							str+='<dd class="info_title" data-content="视频"></dd>';
						}
						str+='<dd class="info_time">' + msg.data.visites + '次播放' + '</dd>' +
						'</dl>';

					if (msg.data.isThisUserClicklike == 1) { //1是点赞     0 是没有点赞
						str += '<p class="info_right video_zan like_yizan">';
					} else {
						str += '<p class="info_right video_zan">';
					}
					str += '<i></i>' +
						'<span>' + msg.data.clicklikes + '</span>' +
						'</p>' +
						'<br class="clear">' +
						'</div>' +
						'<div class="info_bottom">' +
						'<dl class="message_mark">';
						if(msg.data.fromtype == 1){   //判断发布的类型       1 是在app上传的      2    代表在自媒体上上传的
							str+='<dt class="jingtai-v" data-name="'+msg.data.authorid+'">';
								if (msg.data.authoravatar == '"null"' || msg.data.authoravatar == '' || msg.data.authoravatar == null) {
									str += '<img src="/img/first.png" alt="">';
								} else {
									if (msg.data.authoravatar.indexOf("http") > -1) {
										str += '<img src="' + msg.data.authoravatar + '" alt="">'
									} else {
										str += '<img src="' + ImgHOST() + msg.data.authoravatar + '" alt="">'
									}
								}
							str += '</dt>';
							str+='<dd class="authorNames">'+'<b class="jingtai-v" data-name="'+msg.data.authorid+'">' + msg.data.author + '</b>';
						}else if(msg.data.fromtype == 2){
							str+='<dt>';
								if (msg.data.authoravatar == '"null"' || msg.data.authoravatar == '' || msg.data.authoravatar == null) {
									str += '<img src="/img/first.png" alt="">';
								} else {
									if (msg.data.authoravatar.indexOf("http") > -1) {
										str += '<img src="' + msg.data.authoravatar + '" alt="">'
									} else {
										str += '<img src="' + ImgHOST() + msg.data.authoravatar + '" alt="">'
									}
								}
							str += '</dt>';
							str+='<dd class="authorNames">'+'<b>' + msg.data.author + '</b>';
						}
					
						//用户等级   和会员等级   性别
						if (msg.data.leavel >= 16) {
							msg.data.leavel = "N";
						}
					if (msg.data.sex != "" && msg.data.sex != null) {
						str += '<span class="gradeImg"><img src="/img/h/sj_' + user_level[msg.data.sex.charCodeAt()] + '_' + msg.data.leavel + '.png"/></span>';
					} else {
						str += '<span class="gradeImg"><img src="/img/h/sj_boy_' + msg.data.leavel + '.png"/></span>';
					}
					if (msg.data.vipleavel != "0") {
						str += '<span class="vipImg"><img src="/img/h/sj_VIP_' + msg.data.vipleavel + '.png"/></span>';
					}
					str += '</dd>'
					if (msg.data.fromtype == 1 && msg.data.myindustry != null) { //判断发布的类型       1 是在app上传的      2    代表在自媒体上上传的     不用有职业
						str += '<dd class="message_time"><span class="message_industry">' + msg.data.myindustry + '</span><span>' + formatTime(msg.data.creatime, true).substring(0, 10) + '</span>' + '</dd>';
					} else if (msg.data.fromtype == 2) {
						str += '<dd class="message_time"><span style="padding:0px;">' + formatTime(msg.data.creatime, true).substring(0, 10) + '</span>' + '</dd>';
					}

					str += '</dl>';
					if (getCookie("username")) {
						if (msg.data.username != getCookie("username")) { //看是不是自己的帖子     等于不等于cookie;   
							str += '<div class="message_right" usersId="' + msg.data.authorid + '" vimId="' + msg.data.id + '">';
							if (msg.data.fromtype == 1) { //判断在哪发布的 是app还是自媒体                          
								if (msg.data.ismutual == -1) {  //-1代表未关注    0代表已关注     1代表相互关注
									str += '<a class="guanzhu" data_types="" autherId="' + msg.data.authorid + '" data_status="' + msg.data.ismutual + '" href="javascript:;">' + '<b>＋</b>' + '<i>关注</i>' + '</a>';
								} else if (msg.data.ismutual == 0 || msg.data.ismutual == 1) {
									str += '<a class="guanzhu" data_types="" autherId="' + msg.data.authorid + '" data_status="' + msg.data.ismutual + '" href="javascript:;">' + '<i>取消关注</i>' + '</a>';
								}
							} else if (msg.data.fromtype == 2) { //自媒体
//								console.log(getWemedia({wemediaid:msg.data.authorid,username:getCookie("username")}))
								if (msg.data.ismutual == -1) { //-1代表未关注    0代表已关注     1代表相互关注
									str += '<a class="guanzhu" data_types="' + msg.data.fromtype + '"  autherId="' + msg.data.authorid + '" data_status="' + msg.data.ismutual + '" href="javascript:;">' + '<b>＋</b>' + '<i>关注</i>' + '</a>';
								} else if (msg.data.ismutual == 0 || msg.data.ismutual == 1) {
									str += '<a class="guanzhu" data_types="' + msg.data.fromtype + '" autherId="' + msg.data.authorid + '" data_status="' + msg.data.ismutual + '" href="javascript:;">' + '<i>取消关注</i>' + '</a>';
								}
							}
							// str += '<span class="Others_d">' +
							// 	'<img src="/img/daosanjiao.png"></span>';
							// str += '<div class="dropMenu" dataType="' + msg.data.fromtype + '">';
							// if (msg.data.fromtype == 1) { //判断在哪发布的       1 是在app上传的      2    代表在自媒体上上传的
							// 	//添加好友状态
							// 	if (msg.data.relation == 5) { //判断二者是不是好友关系        是的话就是发消息       不是就是加为好友      autherId为加好友设置     0代表已申请   1，2，3代表已是好友  4代表拒绝  5代表不是好友        
							// 		str += '<a data_rel="' + msg.data.relation + '" autherId="' + msg.data.authorid + '" class="friendsyesOrno" href="javascript:;">加为好友</a>';
							// 	} else if (msg.data.relation == 1 || msg.data.relation == 2 || msg.data.relation == 3) {
							// 		str += '<a data_rel="' + msg.data.relation + '" autherId="' + msg.data.authorid + '" data-off="0" class="videoSend" class="friendsyesOrno" href="javascript:;">发消息</a>';
							// 	} else if (msg.data.relation == 0) {
							// 		str += '<a data_rel="' + msg.data.relation + '" autherId="' + msg.data.authorid + '" class="friendsyesOrno" href="javascript:;">已申请</a>';
							// 	} else if (msg.data.relation == 4) {
							// 		str += '<a data_rel="' + msg.data.relation + '" autherId="' + msg.data.authorid + '" class="friendsyesOrno" href="javascript:;">已拒绝</a>';
							// 	}
							// }
							// //用户是否已收藏         0代表未收藏      1 代表已收藏  
							// if (msg.data.iscollection == 0) {
							// 	str += '<a data_isCol="' + msg.data.iscollection + '" class="collection_post" href="javascript:;">收藏</a>';
							// } else if (msg.data.iscollection == 1) {
							// 	str += '<a data_isCol="' + msg.data.iscollection + '" class="collection_post" href="javascript:;">取消收藏</a>';
							// }
							// str += '<a class="complains" sourseId="' + msg.data.id + '" autherId="' + msg.data.authorid + '" href="javascript:;">投诉</a>' +
							// 	'</div>';
							//								        else if(msg.data.fromtype==2){
							//								        	str+='<div class="dropMenu" dataType="'+msg.data.fromtype+'">'+
							//													'<a class="collection_post" href="javascript:;">收藏</a>' +
							//													'<a class="complains" href="javascript:;">投诉</a>'+
							//								        		'</div>';
							//								        }
							str += '</div>';
						} else {
							str += '<div class="message_right" usersId="' + msg.data.authorid + '" vimId="' + msg.data.id + '">';
							// str += '<span class="Others_d">' +
							// 	'<img src="/img/daosanjiao.png"></span>';
							// str += '<div class="dropMenu" dataType="' + msg.data.fromtype + '">';
							// //用户是否已收藏         0代表未收藏      1 代表已收藏  
							// if (msg.data.iscollection == 0) {
							// 	str += '<a data_isCol="' + msg.data.iscollection + '" class="collection_post" href="javascript:;">收藏</a>';
							// } else if (msg.data.iscollection == 1) {
							// 	str += '<a data_isCol="' + msg.data.iscollection + '" class="collection_post" href="javascript:;">取消收藏</a>';
							// }
							// str += '<a class="complains delTopicNo" sourseId="' + msg.data.id + '" autherId="' + msg.data.authorid + '" href="javascript:;">删除</a>' +
							// 	'</div>';
							//								        else if(msg.data.fromtype==2){
							//								        	str+='<div class="dropMenu" dataType="'+msg.data.fromtype+'">'+
							//													'<a class="collection_post" href="javascript:;">收藏</a>' +
							//													'<a class="complains" href="javascript:;">投诉</a>'+
							//								        		'</div>';
							//								        }
							str += '</div>';
						}
					} else {
						str += '<div class="message_right" usersId="' + msg.data.authorid + '" vimId="' + msg.data.id + '">';
						if (msg.data.fromtype == 1) { //判断在哪发布的 是app还是自媒体                          
							str += '<a class="guanzhu" data_types="" autherId="' + msg.data.authorid + '" data_status="' + msg.data.ismutual + '" href="javascript:;">' + '<b>＋</b>' + '<i>关注</i>' + '</a>';
						} else if (msg.data.fromtype == 2) { //自媒体
							//-1代表未关注    0代表已关注     1代表相互关注
							str += '<a class="guanzhu" data_types="' + msg.data.fromtype + '"  autherId="' + msg.data.authorid + '" data_status="' + msg.data.ismutual + '" href="javascript:;">' + '<b>＋</b>' + '<i>关注</i>' + '</a>';
						}
						// str += '<span class="Others_d">' +
						// 	'<img src="/img/daosanjiao.png"></span>';
						// str += '<div class="dropMenu" dataType="' + msg.data.fromtype + '">';
						// if (msg.data.fromtype == 1) { //判断在哪发布的       1 是在app上传的      2    代表在自媒体上上传的
						// 	//添加好友状态
						// 	//判断二者是不是好友关系        是的话就是发消息       不是就是加为好友      autherId为加好友设置     0代表已申请   1，2，3代表已是好友  4代表拒绝  5代表不是好友        
						// 	str += '<a data_rel="' + msg.data.relation + '" autherId="' + msg.data.authorid + '" class="friendsyesOrno" href="javascript:;">加为好友</a>';
						// }
						// //用户是否已收藏         0代表未收藏      1 代表已收藏  
						// str += '<a data_isCol="' + msg.data.iscollection + '" class="collection_post" href="javascript:;">收藏</a>';
						// str += '<a class="complains" sourseId="' + msg.data.id + '" autherId="' + msg.data.authorid + '" href="javascript:;">投诉</a>' +
						// 	'</div>';
						//								        else if(msg.data.fromtype==2){
						//								        	str+='<div class="dropMenu" dataType="'+msg.data.fromtype+'">'+
						//													'<a class="collection_post" href="javascript:;">收藏</a>' +
						//													'<a class="complains" href="javascript:;">投诉</a>'+
						//								        		'</div>';
						//								        }
						str += '</div>';

					}
					str += '<div class="clear"></div>' +
						'</div>'
					$(".video_info").html(str)

					//赞 评论 转发
					strs += '<div class="content_items" data-id="' + getURIArgs("id") + '" data-name="' + msg.data.username + '">';
					strs += '<div class="qz_handle">' +
						'<ul class="qz_row_line">' +
						'<li>';
					//判断是否赞过
					var clickcout = msg.data.clicklikes;
					var commentcount = msg.data.comments;
					if (clickcout == 0) {
						clickcout = "";
					}
					if (commentcount == 0) {
						commentcount = "";
					}
					if (msg.data.isThisUserClicklike == 1) { //1是点赞     0 是没有点赞
						strs += '<a class="video_zan like_yizan" href="javascript:;"><i></i>赞<span>' + clickcout + '</span></a>';
					} else {
						strs += '<a class="video_zan" href="javascript:;"><i></i>赞<span>' + clickcout + '</span></a>';
					}
					strs += '</li>' +
						'<li>|</li>' +
						'<li>' +
						'<a class="review" href="javascript:;"><i></i>评论<span>' + commentcount + '</span></a>' +
						'</li>' +
						'<li>|</li>' +
						'<li>' +
						'<a  class="transpond" href="javascript:;"><i></i>转发</a>' +
						'<div class="sharelink spacVideoShare">' +
						'<div>';
					if (UserName) {
						strs += '<a class="share1" href="javascript:;">圈子朋友圈</a>' +
							'<a class="share2" href="javascript:;">圈子好友</a>'+
						//'<a class="share3" href="javascript:;">圈子群组</a>';
						'<a class="share9" href="javascript:;">首页热门</a>';
					} else {
						strs += '<a class="share1 item_6 login_window" href="javascript:;">圈子朋友圈</a>' +
							'<a class="share2 item_6 login_window" href="javascript:;">圈子好友</a>'+
						//'<a class="share3 item_6 login_window" href="javascript:;">圈子群组</a>';
						'<a class="share9 item_6 login_window" href="javascript:;">首页热门</a>';
					}
					strs += '<a class="share5" href="javascript:;"><span>微信朋友圈</span>' +
						'<div class="qrodeBox">' +
						'<p>分享到微信朋友圈</p>' +
						'<div></div>' +
						'</div>' +
						'</a>' +
						'<a class="share6" href="javascript:;">QQ空间</a>' +
						'<a class="share7" href="javascript:;">QQ好友</a>' +
						'<a class="share8" href="javascript:;">新浪微博</a>' +
						'</div>' +
						'</div>' +
						'</li>' +
						'<li>|</li>' +
						'<li>';
						if(msg.data.iscollection==1){
							strs+='<a class="collectss" data_isCol="'+msg.data.iscollection+'"  href="javascript:;"><i></i>取消收藏</a>';
						}else{
							strs+='<a class="collectss" data_isCol="'+msg.data.iscollection+'"  href="javascript:;"><i class="on"></i>收藏</a>';
						};
						strs+='</li>' +
						'<br class="clear"/>' +
						'</ul>';
					strs += '</div">';
					strs += '</div">';
					strs += '<div class="qz_publish">' +
						'<div class="qz_face">'
						//用户头像有无
					if (!getCookie("headImgkz")) {
						strs += '<a class="login_window" href="javascript:;"><img src="/img/first.png" alt="" /></a>'
					} else {
						if (getCookie("headImgkz").indexOf("http") > -1) {
							strs += '<a href="/center/me/page.html"><img src="' + getCookie("headImgkz") + '" alt=""></a>';
						} else {
							strs += '<a href="/center/me/page.html"><img src="' + ImgHOST() + getCookie("headImgkz") + '" alt=""></a>';
						}
					}
					strs += '</div>' +
						'<div class="p_input">' +
						'<textarea class="Postcomment" placeholder="写评论…" name="review_1" /></textarea>' +
						'</div>' +
						'</div>' +
						'<div class="review_1"></div>';
					//一级评论内容
					var commentlist = msg.data.commentList;
					if (commentlist != 0) {
						strs += '<div class="chitchatBox clear"><ul class="stairComment">';
						for (var k = 0; k < commentlist.length; k++) {
							//parentCommentNo = null 为一级评论
							strs += '<li class="comments-item ' + commentlist[k].id + '" data-id="' + commentlist[k].id + '" data-name = "' + commentlist[k].observerName + '">' +
								'<div class="comments-item-bd">' +
								'<div class="ui-avatar">';
							//评论者头像
							if (commentlist[k].observerImgPath.length == 0) {
								strs += '<img src="/img/first.png" />';
							} else {
								strs += '<img src="' + ImgHOST() + commentlist[k].observerImgPath[0] + '" />';
							}
							strs += '</div>' +
								'<div class="comments-content">' +
								'<a href="javascript:;" class="qz_name" data-name = ' + commentlist[k].observerName + '>' + commentlist[k].observerNickName + '</a>：<span>' + toFaceImg(commentlist[k].content) + '</span>' +
								'<div class="comments-op">' +
								'<span class="ui-mr10 state">' + formatTime(commentlist[k].creatime) + '</span>';
							if (commentlist[k].observer != getCookie("username")) {
								strs += '<a href="javascript:;" class="act-reply" title="回复"></a>';
							};
							if (commentlist[k].observer == getCookie("username")) {
								strs += '<a href="javascript:;" class="oneselfdel"></a>';
							}
							strs += '</div><div class="revert_box"></div>' +
								'</div>' +
								'<div class="comments-list mod-comments-sub"><ul>';
							//二级评论容器、
							var pid = commentlist[k].id;
							var parentnickname = commentlist[k].observerNickName;
							var parentname = commentlist[k].observer;
							getCommentClass2(pid, parentnickname, parentname);

							strs += '</ul>' +
								'<div class="ansecondary"></div>' +
								'</div>' +
								'</li>';

						}
						strs += '</ul><div class="To_view_more"></div></div>';
					} else { //暂无评论内容
						strs += '<div class="chitchatBox clear onchitchatBox">暂无评论内容，赶紧占座评论吧！</div>';
					}

					$(".bgBOXSS").append(strs)
					autosize(document.querySelectorAll('.qz_handle textarea'));
					getRelateVideo(videoNear); //得到视频相关视频
					//调用显示更多插件。参数是标准的 jquery 选择符 
					$.showMore(".showMoreNChildren"); //视频相关加载更多，就这一句话
					//生成微信朋友圈二维码 
					var viId = getURIArgs("id");
					var urls = serHOST()+"/Page/videoShare/index.html?uid=" + UserName + "&vmid=" + viId
					$(".qrodeBox div").qrcode({
						render: "canvas",
						width: 30 * 4,
						height: 30 * 4,
						text: urls
					});
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("err")
			}
		});
	}

	/*
	 
	 * 
	 * 跳转到用户主页
	 * 
	 * */
	$(document).on("click",".jingtai-v",function() {
		var strangename = $(this).attr("data-name");
		if (strangename == getCookie("username")) {
			window.location.href = '/center/me/page.html';
		} else {
			//window.location.href = '/center/u/page.html?from=' + strangename;
			getInfo({
				myname:getCookie("username")||"nouser",
				username:strangename,
				templetName:"pageJingtai"
			});
		}
	});
	//得到自媒体的详情
//	var strs="";
//	function getWemedia(datas){
//		$.ajax({
//			type:"get",
//			url:RestfulHOST()+"/wemedia/getdetail",
//			headers:{
//				Authorization:"AQAa5HjfUNgCr27x"	
//			},
//			data:datas,
//			success:function(msg){
//				if(msg.status==0){
//					strs=msg.data.relation;
//					return strs;
//				}
//			},
//			error:function(){
//				console.log("error");
//			}
//		});
//		
//	}
	//转发的部分
	$(document).on("click", ".transpond", function() {
		if ($(".sharelink").is(":hidden")) {
			$(".sharelink").show();
		} else {
			$(".sharelink").hide();
		}
	})
	$(document).on("click", function() {
			$(".sharelink").hide();
		})
		/*
		 *
		 * 获取视频二级评论
		 * */
		//	getCommentClass2()

	function getCommentClass2(pid, parentnickname, parentname) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/vmComment/getVmCommByVmId.do",
			"dataType": "json",
			headers: {
				"token": qz_token()
			},
			data: {
				vmid: Vmid,
				pid: pid,
				pageNum: 1,
				order: 1
			},
			success: function(mssg) {
				if (mssg.status == 0) {
					for (var i = 0; i < mssg.data.length; i++) {
						var msg = mssg.data[i];

						TheSecondaryComment(pid, msg, parentnickname, parentname)
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

	function TheSecondaryComment(pid, msg, parentnickname, parentname) {
		var two_comment = "";
		two_comment += '<li class="comments-item" data-id="' + msg.id + '"data-name="' + msg.observer + '"><div class="comments-item-bd">' +
			'<div class="ui-avatar">';
		if (msg.observerImgPath == "") {
			two_comment += '<img src="/img/first.png" />';
		} else {
			two_comment += '<img src="' + ImgHOST() + msg.observerImgPath[0] + '" />';
		}
		two_comment += '</div>' +
			'<div class="comments-content">' +
			'<a href="javascript:;" class="qz_name" data-name=' + msg.observer + '>' + msg.observerNickName + '</a><span>回复</span>' +
			'<a href="javascript:;" class="qz_name reply_content" data-name=' + parentname + '>' + parentnickname + '</a>' + toFaceImg(msg.content) + '' +
			'<div class="comments-op">' +
			'<span class="ui-mr10 state">' + formatTime(msg.creatime) + '</span>';
		if (msg.observer == UserName) {
			two_comment += '<a href="javascript:;" class="oneselfdel"></a>';
		}
		two_comment += '</div><div class="revert_box"></div>' +
			'</div></li>';
		$("." + pid).find(".mod-comments-sub ul").append(two_comment)
	}

	/*****************************点赞 评论 转发开始*******************************/
	//视频点赞开始
	var handle = true;
	$(document).on("click", ".video_zan", function() {
		if (getCookie("username")) {
			if (handle == false) {
				return false;
			}
			handle = false;
			var username = getCookie("username"); //点赞用户名
			var topicNo = $(".content_items").attr("data-id"); //视频id
			var isClickOrCannel = "";
			var num = $(this).find("span").text();
			num = Number(num);
			if ($(".video_zan").hasClass("like_yizan")) { //取消赞         1表示赞    0 取消赞或默认值
				$(".video_zan").find("span").html(num - 1);
				if (num - 1 == 0) {
					$(".video_zan").find("span").html("");
				}
				isClickOrCancel = 0;
				$(".video_zan").removeClass("like_yizan");
				handlerClickLike(username, topicNo, isClickOrCancel)
			} else { //赞
				$(".video_zan").find("span").html(num + 1);
				$(".video_zan").addClass("like_yizan");
				isClickOrCancel = 1;
				handlerClickLike(username, topicNo, isClickOrCancel)
			}
		} else {
			$(".userLogin a").click();
		}
	})


	//点赞接口
	function handlerClickLike(username, topicNo, isClickOrCancel) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/videoMaterial/VmClickLike.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: {
				uid: username,
				vmid: topicNo,
				isClickLike: isClickOrCancel
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
	//评论

	/*****************************点赞 评论 转发结束*******************************/
	//自己发帖 点击加载  收藏 投诉   加为好友
	$(document).on("click", ".message_right .Others_d", function(e) {
		e.stopPropagation();
		$(this).siblings(".dropMenu").toggle();
	})
	$(document).on('click', function() {
			$(".dropMenu").hide();
		})
		//	$(document).on('click', ".dropMenu", function(e) {
		//			e.stopPropagation(); //阻止冒泡
		//		})
		/******************关注个人*********************************/
	$(document).on("click", ".guanzhu", function() {
		if (getCookie("username")) {
			var data_status = $(this).attr("data_status");
			var nickN = $(this).parents(".message_right").siblings(".message_mark").find(".authorNames b").html();
			var followId = $(this).attr("autherId"); //被关注对象的id

			if ($(this).attr("data_types") == 2) { //自媒体
				var params = {
					wemediaid: followId, //被关注对象的用户名
					username: getCookie("username") //自己的用户名 
				};
				var par = $.param(params);
				//取消关注
				if (data_status == 0 || data_status == 1) {
					$.im.confirm("确定要取消关注'" + nickN + "'吗？", function() {
						$.ajax({
							type: "post",
							url: RestfulHOST() + "/wemedia/unsetfollowing?" + par,
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
						url: RestfulHOST() + '/wemedia/setfollowing?' + par,
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
			} else { //个人
				var params = {
					following: followId, //被关注对象的用户名
					username: getCookie("username") //自己的用户名 
				};
				var par = $.param(params);
				//取消关注
				if (data_status == 0 || data_status == 1) {
					$.im.confirm("确定要取消关注'" + nickN + "'吗？", function() {
						$.ajax({
							type: "get",
							url: serviceHOST() + "/following/unsetfollowing.do",
							data:{
								following: followId, //被关注对象的用户名
								username: getCookie("username") //自己的用户名 
							},
							headers: {
								"token": qz_token()
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
						type: "get",
						url: serviceHOST() + '/following/setfollowing.do',
						dataType: "json",
						data:{
							following: followId, //被关注对象的用户名
							username: getCookie("username") //自己的用户名 
						},
						headers: {
							"token": qz_token()
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
		} else {
			$(".userLogin a").click();
		}

	})

	//加好友       收藏       投诉
	$(document).on("click", ".friendsyesOrno", function() { //加好友
			if (getCookie("username")) {
				var username = getCookie("username"); //自己的用户名
				var jid2add = $(this).attr("autherid"); //获取帖子的id;
				var relationST = $(this).attr("data_rel"); //获取好友关系状态
				if (relationST == 5) { //不是好友   才能加好友
					//自己用户名        好友用户名  
					$("body").append(AddBuddyValidation);
					$(".addFriend .confirm_cancel").on("click", function() {
						$(".addFriend").remove();
						return false;
					});

					$(".confirm_active").on("click", function() {
						var noteword = html2Escape($(".addFriend .addInformation").val());
						var params = {
							username: username,
							jid2add: jid2add,
							markname: "",
							groupname: "",
							noteword: noteword
						};
						var par = $.param(params);
						$.ajax({
							type: "post",
							url: RestfulHOST() + '/users/roster?' + par,
							dataType: "json",
							headers: {
								"Authorization": "AQAa5HjfUNgCr27x"
							},
							success: function(msg) {
								$(".addFriend").remove();
								if (msg.status == 0) {
									console.log(msg)
									friendlyMessage("好友请求成功", function() {
										location.reload();
									});
								} else {
									friendlyMessage(msg.info);
								}
							},
							error: function() {
								console.log("error")
							}

						});
					});
				}
			} else {
				$(".userLogin a").click();
			}

		})
		//加好友
	var AddBuddyValidation = '<div class="addFriend"><div class="addWrap"><p class="addTitle">添加朋友</p><p>请输入验证信息</p>' +
		'<textarea class="addInformation"></textarea><div class="addInfo">你需要发送验证请求，对方通知后你才能添加其为好友</div>' +
		'<div class="confirm"><button class="confirm_active">确定</button><button class="confirm_cancel">取消</button></div>' +
		'</div>' +
		'</div>';
	/********************收藏**************************/
	$(document).on("click", ".collectss", function() {
		var _this=$(this);
			if (getCookie("username")) {
				var _thisCollction = $(this).attr("data_isCol"); //获取当前收藏的状态
				if (_thisCollction == 0) { //未收藏
					$.ajax({
						type: "post",
						url: serviceHOST() + "/videoMaterial/vmcollection.do",
						dataType: "json",
						headers: {
							"token": qz_token()
						},
						data: {
							uid: getCookie("username"),
							vmid: getURIArgs("id")
						},
						success: function(msg) {
							if (msg.status == 0) {
								if (msg.data == 1) { //1代表收藏成功     0表示已经收藏过，不可以再收藏
									friendlyMessage("收藏成功", function() {
										_this.html('<i></i>'+'取消收藏').attr("data_isCol", 1);
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
				} else if (_thisCollction == 1) { //取消收藏
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
								vmid: getURIArgs("id")
							},
							success: function(msg) {
								if (msg.status == 0) {
									if (msg.data == 1) {
										_this.html('<i class="on"></i>'+'收藏').attr("data_isCol", 0);
									}
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
			} else {
				$(".userLogin a").click();
			}
		})
		//投诉     删除帖子
	var doTipEx = ""; //被举报人id
	var tiperid = ""; //举报人id
	$(document).on('click', ".complains", function() {
			if (getCookie("username")) {
				if ($(this).hasClass("delTopicNo")) { //是楼主自己发的的帖子，根据帖子编号，可以进行删除
					var DeletePosts = $(this).parents(".message_right").attr("usersId"); //用户Id
					var content_items = $(this).parents(".message_right").attr("vimId"); //视频Id
					$.ajax({
						type: "post",
						url: serviceHOST() + "/videoMaterial/deletedVideo.do",
						dataType: "json",
						headers: {
							"token": qz_token()
						},
						data: {
							uid: DeletePosts,
							vmid: content_items
						},
						success: function(msg) {
							if (msg.status == 0) {
								friendlyMessage("删帖成功", function() {
									window.location.href = "/center/videoLists.html";
								});
							}else if(msg.status==-3){
								getToken();
							};
						},
						error: function() {
							console.log("error")
						}
					});
				} else {
					$(".bgBOX,.ComplaintsBox").show();
					getTipContents({
						tiptype: 3
					})
					doTipEx = $(this).attr("sourseId"); //被视频id
					tiperid = getCookie("username"); //举报人id
				}
			} else {
				$(".userLogin a").click();
			}
		})
		//投诉提交
	$(".ComplaintsBox .Complaints_btn a").on("click", function() {
		if (reason == "") {
			$(".titRen").show();
			setTimeout(function() {
				$(".titRen").hide();
			}, 1000)
			return false;
		}
		$.ajax({
			type: "post",
			url: serviceHOST() + '/tip/doTipEx.do',
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: {
				tiperid: tiperid,
				tipedid: doTipEx,
				tiptype: 3, //举报种类     3视频
				reason: reason //举报原因
			},
			success: function(msg) {
				if (msg.status == 0) {
					friendlyMessage("投诉成功", function() {
						location.reload();
					});
					//					$(".Closecomplaint").click();
				} else if (msg.status == -1) {
					friendlyMessage(msg.info);
					$(".Closecomplaint").click();
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}

		});
	})

	function getTipContents(datas) {
		im.loadingOn()
		var str = "";
		$.ajax({
			type: "post",
			url: serviceHOST() + "/tip/getTipContents.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: datas,
			success: function(msg) {
				im.loadingOff()
				if (msg.status == 0) {
					for (var i = 0; i < msg.data.length; i++) {
						str += '<li>' + msg.data[i].dictvalue + '<label><input type="checkbox" /></label><br class="clear"/></li>'
					}
					str += '<li class="rests">其他<label><input type="checkbox" /></label></li>';
					$(".ComplaintsBox ul").html(str)
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}
		});
	}
	$(document).on("click", ".Closecomplaint", function() {
		$(".bgBOX,.ComplaintsBox").hide();
	})
	var reason = "";
	$(document).on("click", ".ComplaintsBox input", function() {
		$(".ComplaintsBox label").removeClass("checked");
		$(".ComplaintsBox input").attr("checked", false);
		$(this).attr("checked", "checked")
		$(".ComplaintsBox textarea").val("");
		if ($(this).attr("checked") == "checked" && $(this).parent().parent().text() != "其他") {
			$(this).parent().addClass("checked");
			reason = $(this).parent().parent().text();
		}
		if ($(".ComplaintsBox .rests input").attr("checked") == "checked") {
			$(this).parent().addClass("checked");
			$(".ComplaintsBox .parentS").fadeIn();
			$(".ComplaintsBox textarea").blur(function() {
				reason = html2Escape($(".ComplaintsBox textarea").val());
			});
		} else {
			$(".ComplaintsBox .parentS").fadeOut();
		}
	})

	//发表一级评论
	$(document).on("click", ".content_items .review_1 .publishOn", function() {
		if (getCookie("username")) {
			var topicNo = $(this).parents(".content_items").attr("data-id"); //帖子编号
			var parentCommentNo = 0; //评论的父级评论编号
			var parentusername = $(this).parents(".content_items").attr("data-name"); //被评论者用户名
			var childusername = UserName; //评论者用户名
			var content = html2Escape($(this).parents(".qz_handle").find(".p_input .Postcomment").val()); //内容
			if ($(".chitchatBox .stairComment").html() == undefined && content != "") {
				$(".chitchatBox").html("").append("<ul class='stairComment'></ul>");
				$(".chitchatBox").removeClass("onchitchatBox");
			}
			var comments_item = $(this).parents(".qz_handle").find(".chitchatBox .stairComment");
			createComment(topicNo, parentCommentNo, parentusername, childusername, content, comments_item, UserName);
		} else {
			$(".userLogin a").click();
		}
	})

	//发表二级评论
	$(document).on("click", ".content_items .revert_box .import .publishOn", function() {
		if (getCookie("username")) {
			var topicNo = $(this).parents(".content_items").attr("data-id"); //帖子编号
			var parentCommentNo = $(this).parents("li.comments-item").attr("data-id"); //评论的父级评论编号
			var parentusername = $(this).parents("li.comments-item").attr("data-name"); //被评论者用户名
			var childusername = UserName; //评论者用户名
			var content = html2Escape($(this).parents(".import").find(".Postcomment").val()); //内容
			var username = $(this).parents("li.comments-item").find(".comments-content .qz_name").html(); //评论人名称
			var comments_item = $(this).parents("li.comments-item").find(".comments-item-bd .mod-comments-sub ul");
			var stairComment = $(this).parents(".qz_handle").find(".chitchatBox .stairComment");
			var conmmentslist = $(this).parents(".content_items").find(".comments-item").length;
			if (conmmentslist >= 20) {
				$(this).parents(".content_items").find(".To_view_more").html(more);
			}
			//是否评论自己  放到一级评论里
			if (parentusername == childusername) {
				parentCommentNo = 0;
				createComment(topicNo, parentCommentNo, parentusername, childusername, content, stairComment, username);
			} else {
				createComment(topicNo, parentCommentNo, parentusername, childusername, content, comments_item, username);
			}
		} else {
			$(".userLogin a").click();
		}
	})

	/*
	 
	 * 
	 * 
	 * 
	 * 	发表视频评论createVmComment
		发送方式	函数名称	备注
		soap	createVmComment	发表视频评论接口--返回该条评论
		参数类型及名称	描述	样例
		int  vmid	评论归属视频ID	1
		int vmcommentid	评论的父级评论编号
		若为根评论,值为0	2 
		若为顶级评论则传值为0
		String  observeredid	被评论者用户ID
		若为根评论,值为空	例如 " lukang1"
		若为根评论,则不传任何值
		String  observerid	评论者用户ID	例如 " lukang2"
		String  content	评论内容	例如 "最近天气好冷！！！" 

	 * 
	 * */
	function createComment(vmid, vmcommentid, observeredid, observerid, content, comments_item, username) {
		if ($.trim(content) == "") {
			warningMessage("评论内容不能为空");
			return false;
		} else if (content.length > 140) {
			warningMessage("评论内容不能超过140个汉字");
			return false;
		}
		
		$.ajax({
			type: "post",
			url: serviceHOST() + "/vmComment/createVmComment.do",
			data: {
				vmid: vmid,
				pid: vmcommentid,
				observeredid: observeredid,
				observerid: observerid,
				content: content
			},
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				if (msg.status == 0) {
					$(".content_items .p_input .Postcomment").val("");
					$(".content_items .import .Postcomment").val("");
					var mssg = msg.data;
					stairComment(mssg, vmcommentid, comments_item, username);
					friendlyMessage("评论成功");
					$('.qz_handle textarea').css("height", "19px");
					$(".content_items .revert_box .reply").hide(500);
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
	function stairComment(mssg, parentCommentNo, comments_item, username) {
		var str = '<li class="comments-item" data-id="' + mssg.id + '"data-name="' + mssg.observer + '">' +
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
		if (parentCommentNo == 0) {
			str += '<a href="javascript:;" class="qz_name"  data-name=' + UserName + '>' + Nickname + '</a>：<span>' + toFaceImg(mssg.content) + '</span>' +
				'<div class="comments-op">' +
				'<span class="ui-mr10 state">' + formatTime(mssg.creatime) + '</span>';
			//			'<a href="javascript:;" class="act-reply" title="回复"></a>';
		} else {
			//			str += '<a href="javascript:;" class="qz_name">' + Nickname + '</a><span>回复</span>' +
			str += '<a href="javascript:;" class="qz_name reply_content"  data-name=' + mssg.parentusername + '>' + username + '</a>' + toFaceImg(mssg.content) + '' +
				'<div class="comments-op">' +
				'<span class="ui-mr10 state">' + formatTime(mssg.creatime) + '</span>';
		}
		str +=
			/*'<div class="comments-op">' +
			'<span class="ui-mr10 state">' + formatTime(mssg.creatime) + '</span>' +
			'<a href="javascript:;" class="act-reply" title="回复"></a>' +*/
			'<a href="javascript:;" class="oneselfdel"></a>' +
			'</div><div class="revert_box"></div>' +
			'</div>';
		if (parentCommentNo == 0) {
			str += '<div class="comments-list mod-comments-sub"><ul></ul>' + //二级评论容器
				'<div class="ansecondary"></div>' +
				'</div>';
		}
		str += '</li>';
		comments_item.append(str);
	}

	//自己发帖 点击加载  收藏 投诉   加为好友
	$(document).on("click", ".message_right .Others_d", function(e) {
		$(".message_right .dropMenu").hide();
		$(this).siblings(".dropMenu").toggle();
		e.stopPropagation();
	})

	//点击加载  收藏 投诉   加为好友
	$(document).on("click", ".message_right .oneself_d", function(e) {
		$(".message_right .dropMenu").hide();
		$(this).siblings(".dropMenu").toggle();
		e.stopPropagation();
	})

	//鼠标滑过显示回复  和 删除
	$(document).on("mouseover", ".content_items .act-reply", function() {
		$(this).html('<span class="Accordingreply">回复<i></i></span>');
	})
	$(document).on("mouseout", ".content_items .act-reply", function() {
		$(this).html('');
	})
	$(document).on("mouseover", ".content_items .oneselfdel", function() {
		$(this).html('<span class="Accordingreply">删除<i></i></span>');
	})
	$(document).on("mouseout", ".content_items .oneselfdel", function() {
		$(this).html('');
	})

	//点击显示一级评论发表
	$(document).on("focus", ".content_items .qz_publish .Postcomment", function() {

		var fabiao = '<a href="javascript:;" class="emotion"></a>' +
			'<a href="javascript:;" class="publishOn">发表</a>' +
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
	$(document).on("click", ".content_items .comments-content .act-reply", function(e) {
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
			'<textarea class="Postcomment" id="txtId" placeholder="回复&nbsp;' + qz_name + '：" name="review_1" /></textarea>' +
			'<div class="release">' +
			'<a href="javascript:;" class="emotion"></a>' +
			'<a href="javascript:;" class="publishOn">发表</a>' +
			'<div id="shuaiId"></div>' +
			'</div>' +
			'</div>' +
			'</div>';
		$(".content_items .comments-content .revert_box").html("");
		$(".content_items .review_1").html("");
		$(this).parents(".comments-content").find(".revert_box").html(str);
		$(this).parents(".comments-content").find(".revert_box input").focus();
		autosize(document.querySelectorAll('.qz_handle textarea'));
	})

	/*
	 
	 * 
	 * 
	 * 
	 * 删除视频评论子评论deleteVmComment
		uid	用户ID	d48181a-b5d0-11e5-b0a0-a2f8f3db6e95
		ivmcommentid	评论编号	

	 * */

	$(document).on("click", ".content_items .comments-op .oneselfdel", function() {
		var topicNo = $(this).parents(".content_items").attr("data-id"); //帖子编号
		var commentNo = $(this).parents("li.comments-item").attr("data-id"); //评论编号
		//		var commentsitem = $(this).parents("li.comments-item");
		var commentsitem = $(this).parent().parent().parent().parent();
		console.log(commentsitem)
		$.ajax({
			type: "post",
			url: serviceHOST() + "/vmComment/deleteVmComment.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: {
				uid: UserName,
				vmcommentid: commentNo
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
	});

	/***************************相关推荐***********************************************/
	function getRelateVideo(msgs) {
		if (msgs.length == "") {
			$(".video_wrap").css({
				"padding-bottom": "0px",
				"border-bottom": "0px",
				"margin-bottom": "0px"
			})
			$(".video_wrap").html('<p style="font-size:14px;color:#333;height:30px;text-align:center;line-height:30px;">暂无相关视频推荐</p>')
		} else {
			var strs = "";
			var numTit
			for (var i = 0; i < msgs.length; i++) {
				//访问量已万为单位处理
				var briefs = msgs[i].brief;
				if(briefs!="undefined"){
					if (briefs.length > 23) {
						numTit = briefs.substr(0, 23) + "...";
					} else {
						numTit = briefs;
					}
				}else{
					numTit = "视频";
				}
				//				var visite1=Math.round((msgs[i].visites/10000)*100);
				//				var visite2=visite1.toFixed(1)
				//				console.log(visite1)
				//				console.log(visite2)
				var visite = (Math.round((msgs[i].visites / 10000) * 100) / 100).toFixed(1);
				strs += '<div class="video_content" data_id="' + msgs[i].id + '">' +
					'<div class="video_item">' +
					'<div class="videoBgs">' +
					'<img src="' + msgs[i].vpicurl + '">' +
					'</div>' +
					//'<span class="timess">12:18</span>' +
					'</div>' +
					'<div class="item_right">' +
					'<a href="javascript:;" class="content_title">' + numTit + '</a>';
				if (msgs[i].authoravatar == '"null"' || msgs[i].authoravatar == null || msgs[i].authoravatar == "") {
					strs += '<i><img src="/img/first.png"/></i>';
				} else {
					if (msgs[i].authoravatar.indexOf("http") > -1) {
						strs += '<i><img src="' + msgs[i].authoravatar + '"/></i>';
					} else {
						strs += '<i><img src="' + ImgHOST() + msgs[i].authoravatar + '"/></i>';
					}
				}
				strs += '<span class="video_name">' + msgs[i].author + '</span>' +
					'<span class="vide0_time">' + visite + '万次播放' + '</span>' +
					'</div>' +
					'<br class="clear">' +
					'</div>'
			}
			$(".video_wrap").html(strs)
		}
	}
	$(document).on("click", ".video_content", function() {
		var videoId = $(this).attr("data_id");
		window.location.href = "/center/videodetail.html?id=" + videoId;
	})

})

//判断字数
function checkLength(which, count, name) {
	var maxChars = count;
	if (which.value.length > maxChars)
		which.value = which.value.substring(0, maxChars);
	var curr = maxChars - which.value.length;
	document.getElementById(name).innerHTML = curr.toString();
}