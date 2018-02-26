$(function() {
	//发帖表情
	$("a.faceBtn").live("click", function(e) {
		var divid = $("#FaceBox");
		smohanfacebox($(this),divid,"FaceBoxText");
	});

	//评论表情
	$("a.emotion").live("click", function(e) {
		var divid = $("#shuaiId");
		smohanfacebox($(this),divid,"txtId");
	})


	//大图轮播展示
	ByShowingPictures();

	// 可能认识的人
	recommendRosters(UserName);


	//赞过的人
	$(document).on("click", ".click_portrait_r", function(event) {
		$(".click_portrait_r .all_praise").show();
		event.stopPropagation();
	})
	$(document).on("click", ".praise_shut", function(event) {
		$(".click_portrait_r .all_praise").hide();
		event.stopPropagation();
	})
	$(document).on("click", function(event) {
		$(".click_portrait_r .all_praise").hide();
		$(".HideRecommended ul").hide();
		$(".fl_menu_list").hide();  //屏蔽设置
		event.stopPropagation();
	})

	//发帖选择框
	$(document).on('click', '.seeDynamic', function(ev) {
		$(this).find("ul").toggle();
		ev.stopPropagation();
	});
	$(document).on("click", function(ev) {
		$(".seeDynamic ul").hide();
		ev.stopPropagation();
	})

	/*
	 *    动态文章展开收起
	 */
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


	//隐藏好友关系框和转发框
	$(document).on("click", function(e) {
		$(".dropMenu").hide();
		$(".retransmission").hide();
		e.stopPropagation();
	})


	//滑过显示移除
	$(document).on("mouseover", ".DeleteRecommended", function() {
		$(this).html('<span class="Accordingreply">移除</span>');
	})
	$(document).on("mouseout", ".DeleteRecommended", function() {
		$(this).empty();
	})

	//鼠标滑过显示回复  和 删除
	$(document).on("mouseover", ".content_items .act-reply", function() {
		$(this).html('<span class="Accordingreply">回复<i></i></span>');
	})
	$(document).on("mouseover", ".content_items .oneselfdel", function() {
		$(this).html('<span class="Accordingreply">删除<i></i></span>');
	})
	$(document).on("mouseout", ".content_items .oneselfdel,.content_items .act-reply", function() {
		$(this).empty();
	})



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

	$(document).on("click", ".qz_name,.jingtai", function() {
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
});




/*
 * 举报接口     举报人ID 被举报项的ID  举报种类
 * 说明1:举报帖子  2:举报用户  3:举报视频  4:举报群组5：举报自媒体 6：举报二手商品  7：举报职业问题
 * 
 * */
var reason = "";

function doTipExcomplaint(tiperid, doTipEx, tiptype) {
	var ComplaintsBounced = "";
	$(".ComplaintsBounced").remove();
	var type = "";
	// 7 为投诉问题
	if (tiptype == 7) {
		type = 1;
	} else {
		type = tiptype;
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
			if (msg.status == 0) {
				mssg = msg.data;
				var ComplaintsBounced = '<div class="ComplaintsBounced" data-type=' + tiptype + ' data-id=' + doTipEx + '>' +
					'<h3>投诉<a class="Closecomplaint" href="javascript:;"></a></h3>' +
					'<ul>';
				for (var i = 0; i < mssg.length; i++) {
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
			}else if(msg.status==-3){
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
	if ($(this).attr("checked") == "checked") {
		$(this).parent().addClass("checked");
		reason = $(this).parent().parent().text();
		if (reason != "" && reason != "其他") {
			$(".Complaints_btn a").addClass("ts_submit");
		} else {
			$(".Complaints_btn a").removeClass("ts_submit");
		}
	}
	if ($(".ComplaintsBounced .rests input").attr("checked") == "checked") {
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
		if ($(this).val().length != 0) {
			$(".Complaints_btn a").addClass("ts_submit");
		} else {
			$(".Complaints_btn a").removeClass("ts_submit");
		}
	})


})


//  投诉
$(document).on("click", ".Complaints_btn .ts_submit", function(e) {
	var doTipEx = $(".ComplaintsBounced").attr("data-id");
	var tiptype = $(".ComplaintsBounced").attr("data-type");
	e.stopPropagation();
	$.ajax({
		type: "post",
		url: serviceHOST() + '/tip/doTipEx.do',
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			tiperid: UserName,
			tipedid: doTipEx,
			tiptype: tiptype, //举报种类
			reason: reason //举报原因
		},
		success: function(msg) {
			$(".ComplaintsBounced").remove();
			$("#mask").hide();
			$("body").css("overflow","auto");
			if (msg.status == 0) {
				friendlyMessage("投诉成功",function(){
					$("#maskss").hide();
				});
			} else if(msg.status==-3){
				getToken();
			}else {
				friendlyMessage(msg.info,function(){
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



/*
 *修改好友备注名字 users/roster/update_markname 
 * username	本人的名字
 * friendjid	要更改备注名称的好友jid
 * markname	新的备注名称
 * */
var Setname = '<div class="SetNote">' +
	'<h3>设置备注名<a href="javascript:;" class="del"></a></h3>' +
	'<div class="SetNote_input">备注名：<input type="text" maxlength="6"/></div>' +
	'<div class="SetNote_btn"><a class="determine" href="javascript:;">确定</a><a class="cancel del" href="javascript:;">取消</a></div>' +
	'</div>';

function update_markname(Username, fId) {
	$("body").append(Setname);
	$("#mask").show();
	$(document).on("click", ".SetNote a.determine", function() {
		var Mar = html2Escape($(this).parents(".SetNote").find("input").val());
		if (Mar == "") {
			friendlyMess("请填写备注", "Y");
			return false;
		}
		var params = {
			"username": Username,
			"friendjid": fId,
			"markname": Mar
		};
		var par = $.param(params);
		$.ajax({
			type: "post",
			url: RestfulHOST() + '/users/roster/update_markname?' + par,
			dataType: "json",
			headers: {
				"Authorization": "AQAa5HjfUNgCr27x",
				"Accept": "application/json"
			},
			success: function(msg) {
				if (msg.status == 0) {
					friendlyMessage("设置备注名成功");
					$(".SetNote .del").click();
				}
			},
			error: function() {
				console.log("error")
			}

		});
	})
}

//关闭      取消
$(document).on("click", ".SetNote .del", function() {
	$("#mask").hide();
	$(".SetNote").remove();
});


//投诉帖子
$(document).on("click", ".content_items .complaint", function() {
	var doTipEx = $(this).parents(".content_items").attr("data-id");
	if (UserName) doTipExcomplaint(UserName, doTipEx, 1);
})


//投诉用户
$(document).on("click", ".content_items .operation_in .complaint_in", function() {
	var doTipEx = $(this).parents(".content_items").attr("data-name");
	if (UserName) doTipExcomplaint(UserName, doTipEx, 2);
})


//修改好友备注名字 users/roster/update_markname
$(document).on("click", ".content_items .operation_in .remark_in", function() {
	var fId = $(this).parents(".content_items").attr("data-name");
	update_markname(UserName, fId)
})

//帖子里加好友
$(document).on("click", ".content_items .AddFriend", function() {
	var _this = $(this);
	var jid2add = $(this).parents(".content_items").attr("data-name");
	if (UserName) AddfriendRequest(UserName, jid2add, _this)
})


//加点赞人好友
$(document).on("click", ".content_items .dispose .plus", function() {
	var _this = $(this);
	var jid2add = $(this).attr("data-name");
	if (UserName) AddfriendRequest(UserName, jid2add, _this)
})


//删除好友 users/roster
$(document).on("click", ".content_items .messagein .attention_sc", function() {
	var jid2add = $(this).parents(".content_items").attr("data-name");
	var attention = $(this).parent();
	if (UserName) RemovBuddy(UserName, jid2add, attention)
})



/*
 *	删除好友 users/roster
 * */
function RemovBuddy(UserName, jid2add, attention) {
	var params = {
		username: UserName,
		jid2delete: jid2add
	};
	var par = $.param(params);
	$.ajax({
		type: "DELETE",
		url: RestfulHOST() + '/users/roster?' + par,
		dataType: "json",
		headers: {
			"Authorization": "AQAa5HjfUNgCr27x",
			"Accept": "application/json"
		},
		success: function(msg) {
			if (msg.status == 0) {
				friendlyMess("删除成功");
				attention.addClass("AddFriend");
				attention.removeClass("SendMessage");
				attention.html("加好友");
			}
		},
		error: function() {
			console.log("error")
		}

	});
}



/* 
 * 
 * 鼠标滑过显示个人资料信息
 * */

var handle = null;
$(document).on("mouseover", ".content_items .message_mark .usermessage", function() {
	var myname = UserName;
	var username = $(this).parents(".content_items").attr("data-name");
	var messagein = $(this).parents(".content_items").find(".messagein");
	$(".content_items .messagein").empty();
	if (UserName) {
		handle = setTimeout(function() {
			$.ajax({
				type: "post",
				url: serviceHOST() + "/user/findUserInformationEx.do",
				dataType: "json",
				headers: {
					"token": qz_token()
				},
				data: {
					myname: myname, //调用者的用户名
					username: username //查询对象的用户名
				},
				success: function(mssg) {
					if (mssg.status == 0) {
						var str = "";
						var msg = mssg.data;
						//鼠标滑过显示信息
						if (msg.username == UserName) {
							str += '<div class="userinformation myuserinformation">';
						} else {
							str += '<div class="userinformation">';
						}

						//用户背景
						if (msg.imgforuserbglist == undefined || msg.imgforuserbglist == "") {
							str += '<dl class="message_mark">';
						} else {
							str += '<dl class="message_mark" style="background:url(' + ImgHOST() + msg.imgforuserbglist[0].imagepath + ')">';
						}
						//用户头像有无
						if (msg.imgforheadlist == "") {
							str += '<dt class="usermessage_t"><img src="/img/first.png" alt="" /></dt>';
						} else {
							str += '<dt class="usermessage_t"><img src="' + ImgHOST() + msg.imgforheadlist[0].imagepath + '" alt="" /></dt>';
						}
						str += '<dd class="authorName"><b>' + msg.nickname + '</b>';
						//用户等级   和会员等级   性别

						if (msg.level >= 16) {
							msg.level = "N";
						}

						if (msg.sex == "" || msg.sex != "男" || msg.sex != "女") {
							str += '<span class="gradeImg"><img src="/img/h/sj_boy_' + msg.level + '.png"/></span>';
						} else {
							str += '<span class="gradeImg"><img src="/img/h/sj_' + user_level[msg.sex.charCodeAt()] + '_' + msg.level + '.png"/></span>';
						}
						if (msg.viplevel != 0) {
							str += '<span class="vipImg"><img src="/img/h/sj_VIP_' + msg.viplevel + '.png"/></span>';
						}
						str += '</dd><dd class="message_time">' + msg.sign + '</dd>' +
							'</dl>' +
							'<div class="clear g_f_d">';
						if (msg.username == UserName) {
							str += '<a href="/center/me/focus.html">关注<b>' + msg.followingcnt + '</b></a>|' +
								'<a href="/center/me/funs.html">粉丝<b>' + msg.followercnt + '</b></a>|' +
								'<a href="/center/me/page.html">动态<b>' + msg.topictotal + '</b></a>';
						} else {
							str += '<a href="/center/u/focus.html?from=' + msg.username + '">关注<b>' + msg.followingcnt + '</b></a>|' +
								'<a href="/center/u/funs.html?from=' + msg.username + '">粉丝<b>' + msg.followercnt + '</b></a>|' +
								'<a class="jingtai" href="javascript:;" data-name="' + msg.username + '">动态<b>' + msg.topictotal + '</b></a>';
						}
						'</div>';
						if (msg.username != UserName) { //判断滑过自己的头像
							str += '<div class="userinformation_b">' +
								'<p>' + (msg.hometown || "") + '</p>';
							if (msg.isfollowing == 1) {
								str += '<a class="attention_yg" href="javascript:;">已关注<div class="attention_qx">取消关注</div></a>';
							} else {
								str += '<a class="attention" href="javascript:;">关注</a>';
							}
							str += '<a class="information" data-off="0" href="javascript:;">消息</a>';
							//是否是好友
							//好友添加状态
							if (msg.relation == 0) {
								str += '<a style="padding:5px;" href="javascript:;">请求已发送</a>';
							} else if (msg.relation == 1 || msg.relation == 2 || msg.relation == 3) {
								str += '<a class="SendMessage" href="javascript:;">好友<div class="attention_sc">删除好友</div></a>';
							} else {
								str += '<a class="AddFriend" href="javascript:;">加好友</a>';
							};
							str += '<a class="operation" href="javascript:;">' +
								'<div class="operation_in">' +
								'<ul>';
							if (msg.relation == 1 || msg.relation == 2 || msg.relation == 3) {
								str += '<li class="remark_in">设置备注名</li>' +
									'<li>推荐给好友</li>' +
									'<li class="complaint_in">投诉</li>';
							} else {
								str += '<li class="complaint_in">投诉</li>';
							}
							str += '</ul>' +
								'</div>' +
								'</a>' +
								'</div>';
						} else {
							str += '<div class="userinformation_b"><p>' + msg.hometown + '</p></div>';
						}
						str += '</div><div class="PointThe"></div>';
						messagein.html(str);
						$(".userinformation").fadeIn(400);


						//div与浏览器的距离小 就会出现在下面
						var distance = $(".userinformation").offset().top - $("body").scrollTop()
						if (distance < 0) {
							$(".userinformation").css("top", "45px");
							$(".PointThe").remove();
							$(".userinformation").prepend('<div class="PointTop"></div>');
						}


					}else if(msg.status==-3){
						getToken();
					};
				},
				error: function() {
					console.log("error")
				}

			});
		}, 300);
	}
}).mouseout(function() {
	clearTimeout(handle);
});



$(document).on("mouseleave ", ".content_items .messagebox", function() {
	$(".publish_rticle .userinformation").fadeOut(500);
})

//头像信息操作
$(document).on("click", ".operation", function() {
	$(".operation_in").toggle();
})



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
			'<dd>UE设计</dd>' +
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
		'<span><a href="javascript:;" class="qz_name" data-name=' + msg.commentuser.username + '>' + (msg.commentuser.nickname||shieldNumber(msg.commentuser.username)) + '</a>：</span>' + toFaceImg(msg.content) +
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



//评论展开收起                                                                         
$(document).on("click", ".ansecondary", function() {
	if ($(this).text() == "展开") {
		$(this).parents(".mod-comments-sub").find("li.HideComments").show(500);
		$(this).find("a").html("收起");
	} else {
		$(this).parents(".mod-comments-sub").find("li.HideComments").hide(500);
		$(this).find("a").html("展开");
	}
})



//处理视频的函数
function addVideo(u, ids, posterBG) {
	var str = "";
	if (u) {
		str = "<video class='videoName' poster='" + posterBG + "' id='" + ids + "' style='background:#000;' controls='controls' height='400' width='100%' src='" + u + "'></video>";
	};
	//if (u) {
	//
	//		str='<video id="'+ids+'" class="videoName video-js vjs-default-skin" controls preload="none" style="background:#000;" width="100%" height="400" poster="'+posterBG+'" data-setup="{}">'+
	//		    '<source src="'+u+'" type="video/mp4" />'+
	//		    '<source src="'+u+'" type="video/webm" />'+
	//		    '<source src="'+u+'" type="video/ogg" />'+
	//		    '<track kind="captions" src="'+u+'" srclang="en" label="English" />'+
	//		  '</video>'
	//	};
	return str;
};



/*
 * 评论
 * */
function createComment(topicNo, parentCommentNo, parentusername, childusername, content, comments_item, username) {
	$("#msk").remove();
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
				$(".content_items .p_input .Postcomment").val("");
				$(".content_items .import .Postcomment").val("");

				var mssg = msg.data;
				stairComment(mssg, comments_item, parentCommentNo, username);
				friendlyMessage("评论成功");
				$('.qz_handle textarea').css("height", "19px");
				$(".content_items .revert_box .reply").hide(500);
				publish = "发表";
			}else if(msg.status==-3){
				getToken();
			};
		},
		error: function() {
			console.log("error");
		}

	});
}



/*
 
 * 一级评论  和  二级评论
 * */
function stairComment(mssg, comments_item, parentCommentNo, username) {
	var str = '<li class="comments-item" data-id="' + mssg.commentNo + '"data-name="' + mssg.childusername + '">' +
		'<div class="comments-item-bd">' +
		'<div class="ui-avatar">';
	//评论者头像
	if (UserImg == "") {
		str += '<img src="/img/first.png" />';
	} else {
		if (UserImg.indexOf("http") > -1) {
			str += '<img src="' + UserImg + '" />';
		} else {
			str += '<img src="' + ImgHOST() + UserImg + '" />';
		}
	}

	str += '</div>' +
		'<div class="comments-content"><span><a href="javascript:;" class="qz_name"  data-name=' + UserName + '>' + (Nickname || shieldNumber(UserName)) + '</a>';
	if (parentCommentNo == null) {
		str += '：</span>' + toFaceImg(mssg.content);
	} else {
		str += '<span>回复</span>' +
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
		'<a href="javascript:;" class="qz_name reply_content" data-name=' + msg.parentcommentuser.parentusername + '>' + (msg.parentcommentuser.parentnickname||shieldNumber(msg.parentcommentuser.parentusername)) + '</a>' + toFaceImg(msg.content) + '' +
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
			plnumberof ++
			two_comment += TwoList(commentlist[flyers], plnumberof,commentlist)
		}
	}
	return two_comment;
};





/*
 
 * 
 * 帖子图片大图轮播切换
 * */
function TheArticleShowUs(mssg, imagepath) {
	var imagepaths = imagepath.length;
	var str = "";
	var picShow = '<div class="pic_main"><div class="wrap"><img src="" alt=""><a href="javascript:;" class="pre_btn" style="display: none;"></a><a href="javascript:;" class="next_btn" style="display: none;"></a></div>';
	var oneImglen = '<div class="oneUrl"><img src="" alt=""></div>'
	var picStr = '';
	if (imagepaths != 0) {
		for (var i = 0; i < imagepaths; i++) {
			str += '<li class="pictureShow_img"><img src="' + ImgHOST() + imagepath[i] + '-s"/></li>';
			picStr += '<a href="javascript:;"><img src=" ' + ImgHOST() + imagepath[i] + '"></a>';
		}
		str += '</ul><div class="clear"></div></div>' + picShow + '<div class="imgs">' + picStr + '<div class="clear"></div></div></div>';
	} else {
		if (mssg.topic.topictype == 8&&mssg.topic.content!="") { //转发展示
			mssg.topic.content = JSON.parse(mssg.topic.content);
			var url = mssg.topic.content.shareImageUrl;
			var ImgU = "";
			if(window.location.href.indexOf("searchresult.html")>-1){
				str += '<li class="specialOn specialOn_1" data-Surl="' +  mssg.topic.content.shareImageUrl + '" data-conType="' + mssg.topic.content.shareType + '" data-content="' + mssg.topic.content.shareTitle + '" class="Forwardpage" data-page="' + mssg.topic.content.shareUrl + '">' +
				'<a class="clearfix" href="' + mssg.topic.content.shareUrl + '">';
			}else{
				str += '<li class="specialOn specialOn_2" data-Surl="' +  mssg.topic.content.shareImageUrl + '" data-conType="' + mssg.topic.content.shareType + '" data-content="' + mssg.topic.content.shareTitle + '" class="Forwardpage" data-page="' + mssg.topic.content.shareUrl + '">' +
				'<a class="clearfix" href="' + mssg.topic.content.shareUrl + '">';
			};
			if ((mssg.topic.content.shareTitle != undefined && mssg.topic.content.shareTitle != "undefined")&&mssg.topic.content.shareTitle != "") {
				if (mssg.topic.content.shareTitle.length > 40) {
					var shareTitle = mssg.topic.content.shareTitle.substring(0, 40) + "...";
				} else {
					var shareTitle = mssg.topic.content.shareTitle;
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
				if (mssg.topic.content.shareImageType == 1) {
					str += '<i class="Video_cover"></i>';
				}
				str += '</div>';
				if(window.location.href.indexOf("searchresult.html")>-1){
					str += '<dl style="width:530px;" class="shareText">'; 
				}else{
					str += '<dl style="width:405px;" class="shareText">';
				};
				str+='<dd class="share_txt_top"></dd>' +
					'<dd class="Forwardpage">' + toFaceImg(shareTitle) + '</dd></dl>';
			} else {
				str += '<dl class="shareText">' +
					'<dd class="share_txt_top"></dd>' +
					'<dd class="Forwardpage">' + toFaceImg(shareTitle) + '</dd></dl>';
			}

		}
		str += '</a></li><div class="clear"></div></ul><div class="clear"></div></div>';
	}

	return str;


}



/*
 *判断是否赞过
 * 加载点赞人头像
 */

function DetermineWhetherPraise(mssg, clickMaplist, type) {
	var str = "";
	var from = "";
	//来自圈子
	if (mssg.fromCircle) {
		var qzfl = "";
		var qzUrl = "";
		var dataNames = "";
		if (mssg.fromCircle == 1) {
			qzfl = "<a href='/center/zyq.html'>来自职业圈</a>";
			dataNames = mssg.fromCircleName;
			if (dataNames.indexOf("\/") > -1) {
				dataNames = dataNames.replace(/\//g, "_");
			} else {
				dataNames = dataNames;
			}
			qzUrl = "/center/zhiye/mydynamic.html?code=" + mssg.circleNo + "&dataName=" + dataNames;
		} else if (mssg.fromCircle == 2) {
			qzfl = "<a href='/center/qqq.html'>来自全球圈</a>";
			qzUrl = "/center/global/mydynamic.html?code=" + mssg.circleNo;
		} else if (mssg.fromCircle == 3) {
			qzfl = "<a href='/center/shq.html'>来自生活圈</a>";
			qzUrl = "/center/life/mydynamic.html?code=" + mssg.circleNo;
		}
		from = qzfl + '<span></span><a href="' + qzUrl + '">' + mssg.fromCircleName + '</a>';
	}



	//用户文章发布位置
	if (mssg.topic.address != "" && mssg.topic.address != "null" && mssg.topic.address != null) {
		str += '<div class = "location"><p> ' + mssg.topic.address + ' <span> </span></p></div>';
	}
	str += '</div><div class="qz_from">' + from + '</div>' +
		'<div class="qz_handle">' +
		'<ul class="qz_row_line">' +
		'<li>';
	//判断是否赞过
	var clickcout = mssg.topic.clickcout;
	var commentcount = mssg.topic.commentcount;
	if (clickcout == 0) {
		clickcout = "";
	}
	if (commentcount == 0) {
		commentcount = "";
	}
	if (!UserName) {
		str += '<a class="like_praise login_window" href="javascript:;"><i></i>赞<span>' + clickcout + '</span></a>';
	} else if (mssg.isClickOrCannel == 1) {
		str += '<a class="like_praise like_yizan like_zan" href="javascript:;"><i></i>赞<span>' + clickcout + '</span></a>';
	} else {
		str += '<a class="like_praise like_zan" href="javascript:;"><i></i>赞<span>' + clickcout + '</span></a>';
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
		'</li><li>|</li>';

	//删除
	if (type == 1 || mssg.user.username == UserName) {
		str += '<li>' +
			'<a class="delete" href="javascript:;"><i style="background:url(/img/delete.png) no-repeat center;"></i>删除</a>' +
			'</li><li>|</li>';
	}

	//收藏
	if (mssg.isCollections == 1) {
		str += '<li><a href="javascript:;" class="collection collection_Cancel"><i></i><span>取消收藏</span></a></li>';
	} else {
		str += '<li><a class="collection collection_post ' + no_login + '" href="javascript:;"><i></i><span>收藏</span></a></li>';
	}


	str += '<br class="clear"/>' +
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
				if (clickMaplist[m].username == UserName) {
					str += '<a class="Myhead clickPersonpage" data-name="'+clickMaplist[m].username+'" href="javascript:;"><img src="/img/first.png"alt="" /></a>';
				} else {
					str += '<a class="clickPersonpage" data-name="'+clickMaplist[m].username+'" href="javascript:;"><img src="/img/first.png"alt="" /></a>';
				}
			} else {
				if (clickMaplist[m].username == UserName) {
					str += '<a class="Myhead clickPersonpage" data-name="'+clickMaplist[m].username+'" href="javascript:;"><img src="' + ImgHOST() + clickMaplist[m].headimg + '"alt="" /></a>'
				} else {
					str += '<a class="clickPersonpage" data-name="'+clickMaplist[m].username+'" href="javascript:;"><img src="' + ImgHOST() + clickMaplist[m].headimg + '"alt="" /></a>'
				}

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
	return str;
}


/*
 * 
 * 文章点赞
 * */
var handle = true;
$(document).on("click", ".content_items .qz_row_line .like_zan", function() {
	var username = UserName; //点赞用户名
	var topicNo = $(this).parents(".content_items").attr("data-id"); //帖子编号
	var isClickOrCannel = "";
	var num = $(this).find("span").text();
	var _this = $(this).parents(".content_items").find(".click_portrait");
	var _likezan = $(this);
	num = Number(num);
	if ($('.joinUs').attr('data-status') == 0) {
		warningMessage('请先加入圈子');
	} else {
		if (handle == false) {
			return false;
		}
		handle = false;
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
 
 *  文章点赞接口
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
					str = '<div class="click_portrait_l"><img src="/img/dianzan_10.png" /></div><div class="click_portrait_c"><a class="Myhead" href="/center/me/page.html">';
					if (UserImg == "") {
						str += '<img src="/img/first.png" alt="" />';
					} else {
						str += '<img src="' + ImgHOST() + UserImg + '"alt="" />'
					}
					str += '</a></div>';
					_this.html(str);
				} else {
					if (UserImg == "") {
						str = '<a class="Myhead" href="/center/me/page.html"><img src="/img/first.png"alt="" /></a>';
					} else {
						str = '<a class="Myhead" href="/center/me/page.html"><img src="' + ImgHOST() + UserImg + '"alt="" /></a>'
					}
					_this.find(".click_portrait_c").prepend(str);
				}

			} else {
				_likezan.find("span").html(num - 1);
				_likezan.removeClass("like_yizan");
				_this.find(".Myhead").remove();
				if (num - 1 == 0) {
					_this.empty();
					_likezan.find("span").empty();
				}
			}
		},
		error: function() {
			console.log("error")
		}

	});
}

/*
 
 * 
 * 添加帖子收藏
 * */
$(document).on("click", ".content_items .collection_post", function() {
	var DeletePosts = $(this).parents(".content_items").attr("data-id");
	var _this = $(this);
	if (UserName) {
		if ($('.joinUs').attr('data-status') == 0) {
			warningMessage('请先加入圈子');
		} else {
			createCollections(DeletePosts, _this);
		}
	}
})

// 添加帖子收藏
function createCollections(DeletePosts, _this) {
	$.ajax({
		type: "post",
		url: serviceHOST() + "/collections/createCollections.do",
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			title: "", //标题	收藏时候添加可无
			content: "", //添加时的备注信息
			type: 1,
			username: UserName,
			topicNo: DeletePosts
		},
		success: function(msg) {
			if (msg.status == 0) {
				friendlyMessage("收藏成功", function() {
					_this.addClass("collection_Cancel").removeClass("collection_post").find("span").html("取消收藏");
				});
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
 
 * 
 * 取消收藏
 * */
$(document).on("click", ".content_items .collection_Cancel", function() {
	var topicNo = $(this).parents(".content_items").attr("data-id"); //帖子编号
	var _this = $(this);
	// if ($('.joinUs').attr('data-status') == 0) {
	// 	warningMessage('请先加入圈子');
	// } else {
		$.im.confirm("确定要取消收藏吗？", function() {
			$.ajax({
				type: "post",
				url: serviceHOST() + "/collections/deleteCollections.do",
				dataType: "json",
				headers: {
					"token": qz_token()
				},
				data: {
					username: UserName,
					topicNo: topicNo
				},
				success: function(msg) {
					if (msg.status == 0) {
						friendlyMessage("取消收藏成功", function() {
							_this.addClass("collection_post").removeClass("collection_Cancel").find("span").html("收藏");
							var url = window.location.href;
							if (url.indexOf("collect.html") > -1) {
								_this.parents('.content_items').remove();
								if ($(".Collect_list .content_items").length == 0) {
									$(".Collect_list").html('<div class="no_collect"><img src="/img/nodata.png"/ align="top"><p>尚未收藏</p><a href="/center/index.html">前往首页</a></div>')
								}
							}
						});
					}else if(msg.status==-3){
						getToken();
					};
				},
				error: function() {
					console.log("error")
				}
			});
		});
	//}
})

/*
 
 * 
 *  删除评论
 * */
$(document).on("click", ".content_items .comments-op .oneselfdel", function() {
	var topicNo = $(this).parents(".content_items").attr("data-id"); //帖子编号
	var commentNo = $(this).parents("li.comments-item").attr("data-id"); //评论编号
	var commentsitem = $(this).parent().parent().parent().parent();
	var username = UserName; //删帖者用户名
	$.ajax({
		type: "post",
		url: serviceHOST() + "/comment/deleteComment.do",
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			topicNo: topicNo,
			commentNo: commentNo,
			username: username
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



/*
 
 * 
 * 根据帖子编号删除帖子
 * */
$(document).on("click", ".content_items .DeletePosts,.content_items .delete", function() {
	var DeletePosts = $(this).parents(".content_items").attr("data-id");
	var content_items = $(this).parents(".content_items");
	$.im.confirm("确定要删除这个动态吗？", function() {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/topic/deleteTopic.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: {
				topicNo: DeletePosts
			},
			success: function(msg) {
				if (msg.status == 0) {
					content_items.fadeOut(300, function() {
						content_items.remove();
						if ($('.content_items').length == 0) {
							window.location.reload();
						}
					});

				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}

		});
	});
})



if (UserName) {
	//发表一级评论
	$(document).on("click", ".content_items .review_1 .publish", function() {
		var topicNo = $(this).parents(".content_items").attr("data-id"); //帖子编号
		var parentCommentNo = null; //评论的父级评论编号
		var parentusername = $(this).parents(".content_items").attr("data-name"); //被评论者用户名
		var childusername = UserName; //评论者用户名
		var content = html2Escape($(this).parents(".qz_handle").find(".p_input .Postcomment").val()); //内容
		var comments_item = $(this).parents(".qz_handle").find(".chitchatBox .stairComment");
		var conmmentslist = $(this).parents(".content_items").find(".comments-item").length;
		if ($('.joinUs').attr('data-status') == 0) {
			warningMessage('请先加入圈子');
		} else {
			createComment(topicNo, parentCommentNo, parentusername, childusername, content, comments_item);
		}
		if (conmmentslist >= 20) {
			$(this).parents(".content_items").find(".To_view_more").html(more);
		}
	})

	//发表二级评论
	$(document).on("click", ".content_items .revert_box .import .publish", function() {
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
		if ($('.joinUs').attr('data-status') == 0) {
			warningMessage('请先加入圈子');
		} else {
			createComment(topicNo, parentCommentNo, parentusername, childusername, content, comments_item, username);
		}
	})
}



//点击显示一级评论发表
$(document).on("focus", ".content_items .qz_publish .Postcomment", function() {
	var fabiao = '<a href="javascript:;" class="emotion"></a>' +
		'<a href="javascript:;" class="publish ' + no_login + '">发表</a>' +
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
		'<textarea class="Postcomment" id="txtId" placeholder="回复&nbsp;' + qz_name + '：" name="review_1"  autoHeight="true" /></textarea>' +
		'<div class="release">' +
		'<a href="javascript:;" class="emotion"></a>' +
		'<a href="javascript:;" class="publish ' + no_login + '">发表</a>' +
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
	autosize(document.querySelectorAll('.qz_handle textarea'));
	//动态文章展开收起
	var OnDisplay = $(".content_items").eq(nums).find(".article .article_content").height();
	if (OnDisplay > 144) {
		var zk = '<a class="unfold" href="javascript:;">展开</a>';
		$(".content_items").eq(nums).find(".publish_rticle .onDisplay").html(zk);
	}
}



/*
 *  帖子动态顶部  用户详情
 */
function PostDynamicUserDetails(mssg,type) {
	var str = "";
	str = '<div class="content_items" data-type=' + mssg.topic.topictype + ' data-id=' + mssg.topic.topicNo + ' data-name=' + mssg.user.username + '>' +
		'<div class="publish_rticle clearfix">' +
		'<dl class="message_mark messagebox">' +
		'<div class="messagein"></div>';
	//用户头像有无
	if (mssg.user.imgforheadlist == "") {
		str += '<dt class="usermessage"><img src="/img/first.png" alt="" /></dt>';
	} else {
		str += '<dt class="usermessage"><img src="' + ImgHOST() + mssg.user.imgforheadlist[0].imagepath + '" alt="" /></dt>';
	}
	//是否有备注名
	if (mssg.remark != "" && mssg.remark != null && mssg.remark != "null") {
		if(mssg.remark!=mssg.user.username)  mssg.user.nickname = mssg.remark;
	}
	str += '<dd class="authorName"><b>' + (mssg.user.nickname||shieldNumber(mssg.user.username)) + '</b>';

	//用户等级   和会员等级   性别
	if (mssg.user.level >= 16) {
		mssg.user.level = "N";
	}
	if (mssg.user.sex == "男" || mssg.user.sex == "女") {
		str += '<span class="gradeImg"><img src="/img/h/sj_' + user_level[mssg.user.sex.charCodeAt()] + '_' + mssg.user.level + '.png"/></span>';
	} else {
		str += '<span class="gradeImg"><img src="/img/h/sj_boy_' + mssg.user.level + '.png"/></span>';
	}
	if (mssg.user.viplevel != "0") {
		str += '<span class="vipImg"><img src="/img/h/sj_VIP_' + mssg.user.viplevel + '.png"/></span>';
	}
	str += '<dd class="message_time"><span class="message_professinal">' + mssg.user.myindustry + '</span><span>' + formatTime(mssg.topic.createtime) + '</span></dd>' +
		'</dl>';

	if(mssg.user.username != UserName && mssg.isCollections != 1 && !type){
		str += '<div class="shield"><a class="fl_menu" href="javascript:;"></a><ul class="fl_menu_list"><li class="shield_dt">屏蔽此动态</li><li class="shield_dt_all">不看他动态</li><li class="complaint">投诉</li><ul></div>'
	}

	return str;
}



/*
	分享
*/
$(document).on("click", ".qz_row_line .transpond", function(e) {
	$(".retransmission").empty();
	var fx = '<span class="wordShare">分享到</span>' +
		'<a href="javascript:;" class="circle_zone ' + no_login + '">圈子朋友圈</a>' +
		'<a href="javascript:;" class="circle_friends ' + no_login + '">圈子好友</a>' +
		//'<a href="javascript:;" class="circle_group '+no_login+'">圈子群组</a>' +         有群组时在启用
		'<a href="javascript:;" class="circle_indexhot ' + no_login + '">首页热门</a>' +
		'<a href="javascript:;" class="wechat_zone">' +
		'<span>微信朋友圈</span>' +
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
//	if ($('.joinUs').attr('data-status') == 0) {
//		warningMessage('请先加入圈子');
//	} else {
		$(this).siblings(".retransmission").toggle();
//	}
	$(this).parents(".content_items").siblings(".content_items").find(".retransmission").hide();


	//转发显示位置
	if ($(this).offset().top - $(window).scrollTop() + 290 > $(window).height()) {
		$(".retransmission").css("top", "-162px");
	} else {
		$(".retransmission").css("top", "35px");
	}

	e.stopPropagation();
})


/*
*	帖子文章内容
*/
function DynamicPostArticles(mssg) {
	var str = "";
		str += '<div class="article">';
		if (mssg.topic.topictype == 8&&mssg.topic.content!="") { //转发	
				var msg = JSON.parse(mssg.topic.content);
				var content = '';
				if (msg.content != undefined && msg.content != ""){
					if (msg.content.indexOf("\n") > -1) { //判断有否有回车符  有则换行
						content = msg.content.replace(/\n/g, "</br>");
					} else {
						content = msg.content;
					}
				}
				str += '<div class="article_content" data-content="' + content + '">' + toFaceImg(content) + '</div>';
		} else {
			if (mssg.topic.content != undefined && mssg.topic.content.indexOf("\n") > -1) { //判断有否有回车符  有则换行
				var topicContent = mssg.topic.content.replace(/\n/g, "</br>");
			} else {
				var topicContent = mssg.topic.content;
			}
			str += '<div class="article_content" data-content="' + mssg.topic.content + '">' + toFaceImg(topicContent) + '</div>';
		}
		str+='</div>';
	str += '<div class="onDisplay"></div>' +
		'<div class="pictureShow photoblock-many">' +
		'<ul>';
	//topictype==2  动态为视频
	if (mssg.topic.topictype == 2) {
		str += '<div class="article_video">' + addVideo(ImgHOST() + mssg.topic.videourl, mssg.topic.id, ImgHOST() + mssg.topic.videourl + "-start-s") +
			'</div>';
	}
	return str;
}


//滑过显示移除
$(document).on("mouseover", ".recommend .dispose_del", function() {
	$(this).html('<span class="Accordingreply">移除</span>');
	$(this).addClass("on");
})
$(document).on("mouseout", ".recommend .dispose_del", function() {
	$(this).removeClass("on");
	$(this).find(".Accordingreply").remove();
})

//推荐用户加好友
$(document).on("click", ".AddBuddy_r .plus", function() {
	var jid2add = $(this).parents(".AddBuddy_r").attr("data-id");
	if (UserName) AddfriendRequest(UserName, jid2add, $(this));
})



/**
 * 移除好友推荐
 * @param username
 * @param friendname
 * @return
 */
$(document).on("click", ".personage_list .DeleteRecommended", function() {
	var _friendname = $(this).parents(".personage_list").attr("data-id");
	var _this = $(this).parents(".personage_list");
	if (UserName) removeRecommendRosters(_friendname, _this);
	//少于四个用户时去除滑动
	if ($(".personage_list").length < 4) {
		$(".main_bottom_ad_change").hide();
	}
})

$(document).on("click", ".AddBuddy_r .dispose_del", function() {
	var _friendname = $(this).parents(".AddBuddy_r").attr("data-id");
	var _this = $(this).parents(".AddBuddy_r");
	if (UserName) removeRecommendRosters(_friendname, _this);
})

function removeRecommendRosters(tpl, _this) {
	$.ajax({
		type: "post",
		url: serviceHOST() + "/recommend/removeRecommendRosters.do",
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			"username": UserName,
			"friendname": tpl
		},
		success: function(msg) {
			if (msg.status == 0) {
				_this.fadeOut(200, function() {
					_this.remove();
					if ($(".recommend .AddBuddy_r").length < 1 && $(".personage_list").length < 1) {
						recommendRosters(UserName);
						$(".main_bottom_ad_change").show();
					}
				})
			}else if(msg.status==-3){
				getToken();
			};
		},
		error: function() {
			console.log("error")
		}

	});
}

// 我的圈子 - 发帖 + 右侧
function myFindJoinedAllCircleBy(type) {
	im.localLoadingOn(".myCircle_t");
	$.ajax({
		type: "post",
		url: serviceHOST() + "/userCircle/findJoinedAllCircleByUsername.do",
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			username: UserName
		},
		success: function(msg) {
			im.localLoadingOff(".myCircle_t");
			if(msg.status==-3){
				getToken();
			};
			myCirclePosts(msg);
		},
		error: function() {
			console.log("error")
		}
	})
}

function rightmyFindJoinedAllCircleBy(type) {
	im.localLoadingOn(".myCircle_t");
	$.ajax({
		type: "post",
		url: serviceHOST() + "/userCircle/indexfindJoinedAllCircleByUsername.do",
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			username: UserName
		},
		success: function(msg) {
			im.localLoadingOff(".myCircle_t");
			if(msg.status==-3){
				getToken();
			};
			SideColumnMyCircle(msg);
		},
		error: function() {
			console.log("error")
		}
	})
}


//我的圈子-发帖选择
function myCirclePosts(msg) {
	var zy = "",
		sh = "",
		qq = "",
		str = "";
	for (var i = 0; i < msg.data.length; i++) {
		var mssg = msg.data[i];
		// 职业圈
		if (mssg.category == 1) {
			$(".xz_classify").html(mssg.themename).attr("data-code", mssg.code).attr("type", 1);
			zy += '<li data-code=' + mssg.code + ' type=1>\
			<img src="' + ImgHOST() + mssg.imagepath + '" onerror=javascript:this.src="/img/qz_wdqz_zhiyequan.png" align="top">\
			<span>' + mssg.themename + '</span>\
			</li>';
		} else if (mssg.category == 2) { //全球圈
			qq += '<li data-code=' + mssg.cityCircleId + ' type=2>\
			<img src="' + ImgHOST() + mssg.imagepath + '" onerror=javascript:this.src="/img/first.png" align="top">\
			<span>' + mssg.themename + '</span>\
			</li>';
		} else if (mssg.category == 3) { //生活圈
			sh += '<li data-code=' + mssg.themeNo + ' type=3>\
			<img src="' + ImgHOST() + mssg.imagepath + '" onerror=javascript:this.src="/img/first.png" align="top">\
			<span>' + mssg.themename + '</span>\
			</li>';
		}
	}

	if (zy) {
		str += '<h4>职业圈</h4>\
		<ul class="ft_m_zyq">\
		' + zy + '\
		</li>\
		</ul>';
	}
	if (sh) {
		str += '<h4>生活圈</h4>\
		<ul class="ft_m_zyq">\
		' + sh + '\
		</li>\
		</ul>';
	}
	if (qq) {
		str += '<h4>全球圈</h4>\
		<ul class="ft_m_qq">\
		' + qq + '\
		</li>\
		</ul>';
	}
	$(".all_my_circle").html(str);
}



//侧边我的圈子
function SideColumnMyCircle(msg) {
	var tpl = "";
	var dataLength = msg.data.length;
	if (dataLength >= 5) dataLength = 5;
	for (var i = 0; i < dataLength; i++) {
		var mssg = msg.data[i];
		if(mssg.themename.length>7){
			var themeNames=mssg.themename.substr(0, 7) + "...";
		}else{
			var themeNames=mssg.themename;
		}
		tpl += '<li class="my_join" data-type=' + mssg.category + ' data-code=' + (mssg.cityCircleId || mssg.code || mssg.themeNo) + '>\
		<a href="javascript:;" class="boxs">\
		<span class="themeImg"><img src="' + ImgHOST() + mssg.imagepath + '" onerror=javascript:this.src="/img/first.png"></span>\
		<div class="themes"><p>' + themeNames;
		if(mssg.isAttention==1){      //用户创建的
			tpl+='<span class="joinssCircle">';
		}else{
			tpl+='<span class="joinssCircle on">';
		}
		
		tpl+='</span></p><div>\
		<span><i class="item_01">' + change(mssg.usercount) + '</i>人加入</span><span>|</span><span>\
		<i class="item_02">' + change(mssg.activecount) + '</i>人活跃</span></div>\
		</div>\
		</a>\
		</li>';
	}
	$(".myCircle_t").html(tpl);
	if (dataLength == 0) $(".myCircle_t").html("<li class='no_join'><span>尚未加入</span></li>");
}



//设置关注用户

$(document).on("click", ".content_items .attention", function() {
	var following = $(this).parents(".content_items").attr("data-name");
	setFocus(UserName, following,$(this),1);
});



//取消关注
$(document).on("click", ".content_items .attention_yg", function() {
	var following = $(this).parents(".content_items").attr("data-name");
	unsetFocus(UserName, following,$(this),1);
})



//关注问题followQuestion
$(document).on("click", ".askNumber .focus_wt", function() {
	qNo = $(this).parents(".askItem").attr("data-id");
	var _this = $(this);
	if (UserName) followQuestion(qNo, _this);
})



//取消关注问题
$(document).on("click", ".cancelAttention_wt", function() {
	qNo = $(this).parents(".askItem").attr("data-id");
	var _this = $(this);
	if (UserName) cancelAttentionProblem(qNo, _this);
})


//忽略问题ignoreQuestion
$(document).on("click", ".ignore", function() {
	qNo = $(this).parents(".askItem").attr("data-id");
	var _this = $(this).parents(".askItem");
	if (UserName) ignoreQuestion(qNo, _this);
})



//关注问题followQuestion
function followQuestion(qNo, _this) {
	$.ajax({
		type: "post",
		url: serviceHOST() + "/question/followQuestion.do",
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			questionNo: qNo,
			username: UserName
		},
		success: function(msg) {
			if (msg.status == 0) {
				friendlyMessage("关注成功", function() {
					var num = Number(_this.parents(".askItem").find(".attention_num").text());
					_this.parents(".askItem").find(".attention_num").text(num + 1);
					_this.addClass('cancelAttention_wt').removeClass("focus_wt").html("取消关注");
				})
			} else if(msg.status==-3){
				getToken();
			}else {
				warningMessage(msg.info);
			}
		},
		error: function() {
			console.log("error")
		}
	});
}


//取消关注问题  unFollowQuestion
function cancelAttentionProblem(qNo, _this, type) {
	$.ajax({
		type: "post",
		url: serviceHOST() + "/question/unFollowQuestion.do",
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			questionNo: qNo,
			username: UserName
		},
		success: function(msg) {
			if (msg.status == 0) {
				friendlyMessage("取消关注成功", function() {
					if (!type) {
						var num = Number(_this.parents(".askItem").find(".attention_num").text());
						_this.parents(".askItem").find(".attention_num").text(num - 1);
						_this.addClass('focus_wt').removeClass("cancelAttention_wt").html("关注问题");
					} else {
						_this.addClass('join_gz').removeClass("join_qx").html("关注问题");
					}
				})
			}else if(msg.status==-3){
				getToken();
			}else {
				warningMessage(msg.info);
			}
		},
		error: function() {
			console.log("error")
		}
	});
}



//忽略问题
function ignoreQuestion(qNo, _this) {
	$.ajax({
		type: "post",
		url: serviceHOST() + "/question/ignoreQuestion.do",
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			questionNo: qNo,
			username: UserName
		},
		success: function(msg) {
			if (msg.status == 0) {
				friendlyMessage("忽略成功", function() {
					_this.fadeOut(200, function() {
						_this.remove();
						if($(".askItem").length == 0) {
							$(".bottom_left").append("<div class='no_comments'><p>圈子里暂无问题</p></div>");
						}
					});
				})
			}else if(msg.status==-3){
				getToken();
			}else {
				warningMessage(msg.info);
			}
		},
		error: function() {
			console.log("error")
		}
	});
}


// 创建问题 createQuestion
function createQuestion(category) {
	var title = html2Escape($(".askBox input").val());
	var contet = html2Escape($(".askBox #txtId").val());
	var fromtheme = $(".right_top .circle_name").text();
	if ($(".lift_dt").attr("data-cj") != 1 && $('.joinUs').attr('data-status') != 1) {
		warningMessage("请先加入圈子");
		return false;
	} else if (!UserName) {
		$(".masks,.viewBox").show();
		return false;
	} else if (!title) {
		$(".askBox input").css("borderColor", "red");
		return false;
	}

	var _question = {
		"question": {
			username: UserName,
			title: title,
			fromtheme: fromtheme,
			magicimagepath: "",
			content: contet,
			category: category,
			code: code
		}
	}
	var question = JSON.stringify(_question);
	$.ajax({
		type: "post",
		url: serviceHOST() + "/question/createQuestion.do",
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			question: question
		},
		success: function(msg) {
			if (msg.status == 0) {
				friendlyMessage("提问成功", function() {
					$(".askBox input,#txtId").val("");
					$(".no_comments").remove();
					questionList(msg.data, 1);
				})
			}else if(msg.status==-3){
				getToken();
			}else {
				warningMessage(msg.info);
			}
		},
		error: function() {
			console.log("error")
		}
	});
}


$(".askBox input").on("focus", function() {
	$(".askBox input").css("borderColor", "#e5e5e5");
})


//所有问题
function questionList(mssg, type) {
	var str = '<div class="askItem" data-id=' + mssg.questionNo + '>\
            <p>' + mssg.title + '</p>\
            <div class="askInfo">\
                <em class="askNikename">' + (mssg.nickname || mssg.username) + '</em>\
                <span>' + mssg.fromtheme + '</span>\
            </div>\
            <div class="askContent">' + toFaceImg(mssg.content) + '</div>\
            <div class="askNumber">\
                <span class="writeReply">写回答</span>\
		                <span><em class="attention_num">' + mssg.followcount + '</em>人关注</span>';
			if (mssg.isfollow == 1) { //0  创建， 1 关注， 2 忽略；
				str += '<span class="wt_b cancelAttention_wt">取消关注</span><span class="ignore wt_b">忽略</span>';
			} else if (mssg.isfollow == 2) {
				str += '<span class="focus_wt wt_b">关注问题</span><span>已忽略</span>';
			} else {
				str += '<span class="focus_wt wt_b ' + no_login + '">关注问题</span><span class="ignore wt_b ' + no_login + '">忽略</span>';
			}
			str += '<div class="askFrom">\
                    <span>' + classifiedJudgement(mssg.category) + '</span>';
                    if(mssg.fromtheme!=""){
                    	str+='<span>|</span>\
                    	<span>' + mssg.fromtheme + '</span>';
                    };
                str+='</div>\
            </div>\
        </div>';
        
	if (type) {
		$(".subAsk").append(str);
	} else {
		$(".subAsk").append(str);
	}
	stop = true;
}



//查询所有问题findAllQuestionList
function findAllQuestionList_qb(page, code) {
	$.ajax({
		type: "post",
		url: serviceHOST() + "/question/findAllQuestionList.do",
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			username: UserName,
			pageNum: page,
			catetory: 0,
			jobcode: code
		},
		success: function(msg) {
			$(".Toloadmore").remove();
			if (msg.status == 0 || msg.status == 1) {
				if (msg.data == "" && $(".askItem").length == 0) {
					var emptyH = $(".detail_right").height() - $(".askBox").height() - 240;
					if(emptyH < 458) emptyH = 458;
					$(".bottom_left").append("<div class='no_comments' style='height:"+ emptyH +"px'><p>圈子里暂无问题</p></div>");
					stop = false;
					return false;
				} else if (msg.data == "") {
					stop = false;
				}
				for (var i = 0; i < msg.data.length; i++) {
					var mssg = msg.data[i];
					questionList(mssg);
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


//圈子分类
function classifiedJudgement(msgs) {
	var category = "";
	if (msgs == 1) {
		category = "职业圈";
	} else if (msgs == 2) {
		category = "全球圈";
	} else if (msgs == 3) {
		category = "生活圈";
	}
	return category;
}


//屏蔽设置
$(document).on("click",".fl_menu",function(ev){
	$(this).next().toggle(200);
	$(".fl_menu_list").not($(this).next()).each(function() {
        $(this).hide();
    });
	ev.stopPropagation();
})


//屏蔽动态
$(document).on("click",".shield_dt",function(){
	var _this = $(this).parents(".content_items");
	$.im.shieldHint("确定要屏蔽此条动态吗？",function(){
		var topicno = _this.attr("data-id");   //帖子编号
		var screenUsername = "";  //被屏蔽者的username
		dynamicScreening(topicno,screenUsername,0,_this);
	})
})


//屏蔽ta所有动态
$(document).on("click",".shield_dt_all",function(){
	var _this = $(this);
	$.im.shieldHint("确定要屏蔽此人动态吗？",function(){
		var topicno = _this.parents(".content_items").attr("data-id");   //帖子编号
		var screenUsername = _this.parents(".content_items").attr("data-name");  //被屏蔽者的username
		dynamicScreening(topicno,screenUsername,1,_this);
	})
})

//屏蔽动态 userScreenTopic
function dynamicScreening(topicno,screenUsername,t,_this){
	$.ajax({
		type: "post",
		url: serviceHOST() + "/topic/userScreenTopic.do",
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			username: UserName,
			topicno: topicno,        			//被屏蔽的帖子编号
			screenUsername: screenUsername,  	//被屏蔽者的username
			type:t                   			//屏蔽的类型 0 屏蔽帖子  1 屏蔽用户
		},
		success: function(msg) {
			if (msg.status == 0) {
				if(t == 0){
					_this.hide(200,function(){_this.remove()});
				}else{
					$(".content_items").each(function(){
						if($(this).attr("data-name") == screenUsername){
							$(this).hide(200,function(){
								$(this).remove();
							});
						}
					})
				}
			}else if(msg.status==-3){
				getToken();
			}else {
				warningMessage(msg.info);
			}
		},
		error: function() {
			console.log("error")
		}
	});
}