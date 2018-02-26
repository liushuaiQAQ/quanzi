$(function() {
	var qNo = getURIArgs("qno");
	var code = getURIArgs('code');
	recommendRosters(UserName);

	//写回答
	$(document).on("focus", ".Postcomment", function() {
		var fabiao = '<a href="javascript:;" class="emotion"></a>' +
			'<a href="javascript:;" class="publish ' + no_login + '">发表</a>' +
			'<div id="shuaiId"></div>';
		$(this).css({
			"border-color": "#3FA435",
			"color": "#333"
		})
		$(".problem_list .review_1").html("");
		$(".Postcomment").removeAttr("id");
		$(this).attr("id", "txtId");
		$(this).parents(".problem_list").find(".review_1").html(fabiao);
		autosize(document.querySelectorAll('#txtId'));
	})

	$(document).on("blur", ".Postcomment", function(e) {
		$(".problem_list .Postcomment").css({
			"border-color": "#ccc",
			"color": "#ccc"
		});
	})


	//写回答 , 评论
	$(document).on("click", ".problem .publish", function() {
		var pNo = "";
		var pName = $(".problem .problem_txt").attr("data-name");
		var content = html2Escape($("#txtId").val());
		if (content == "") warningMessage("内容不能为空");
		if (UserName && content != "") createQuestionComment(qNo, pNo, pName, content);
	})


	//写回复 , 评论
	$(document).on("click", ".comments-item .publish", function() {
		var _this = $(this).parents(".comments-item");
		var pNo = _this.attr("data-qno");
		var pName = _this.attr("data-name");
		var content = html2Escape($("#txtId").val());
		if (content == "") warningMessage("内容不能为空");
		if (UserName && content != "") createQuestionComment(qNo, pNo, pName, content, _this);
	})



	//展示评论
	$(document).on("click", ".act-reply", function() {
		if ($(this).hasClass("wt_p")) {
			var number = $(this).attr("data-num");
			$(this).html(number + "条评论").removeClass("wt_p").parents(".comments-item").find(".mod-comments-sub").fadeOut(200);
		} else {
			$(this).html("收起评论").addClass("wt_p").parents(".comments-item").find(".mod-comments-sub").fadeIn(200);
		}
	})



	//删除评论
	$(document).on("click", ".oneselfdel", function() {
		var _this = $(this).parent().parent().parent().parent();
		var qCNo = _this.attr("data-qno");
		var qNo = getURIArgs("qno");
		deleteQuestionComment(qNo, qCNo, _this);
	})



	//关注问题
	$(document).on("click", ".problem_content .join_gz", function() {
		if (UserName) followQuestion($(this));
	})


	//取消关注问题
	$(document).on("click", ".problem_content .join_qx", function() {
		if (UserName) cancelAttentionProblem(qNo,$(this),1);
	})



	//删除问题
	$(document).on("click", ".problem_b .del_wt", function() {
		$.im.problem("你确定要删除这个问题吗？相关的评论也将被删除", function() {
			deleteQuestion($(this).parents(".bottom_left"));
		});
	})



	//相关问题 - 换一批
	var xgnum = 1;
	$(document).on("click", ".related", function() {
		xgnum = xgnum + 1;
		if ($(".hotItem").length != 0) {
			recommendQuestionByQuestion(xgnum);
			$(".hotContent").html("");
		}
	})



	//点赞取消点赞clickOrStamp
	//isclicklike": "1",//是否点赞 0 没有,1 已赞, -1赞过取消,2 踩，-2 踩过取消
	var state = true;
	$(document).on("click", ".wt_pl_z", function() {
		var _this = $(this);
		var cNo = $(this).parents(".problem_list").attr("data-qno");
		var num = Number(_this.text());
		if (state && UserName) {
			state = false;
			if ($(this).hasClass("wtp_yz")) {
				clickOrStamp(cNo, -1, _this, num);
			} else {
				clickOrStamp(cNo, 1, _this, num);
			}
		}
	})


	//踩  取消踩
	$(document).on("click", ".wt_pl_c", function() {
		var _this = $(this);
		var cNo = $(this).parents(".problem_list").attr("data-qno");
		var num = Number(_this.text());
		if (state && UserName) {
			state = false;
			if ($(this).hasClass("wtp_yc")) {
				clickOrStamp(cNo, -2, _this, num);
			} else {
				clickOrStamp(cNo, 2, _this, num);
			}
		}
	})



	//问题投诉
	$(document).on("click", ".in_formation", function() {
		if (UserName != "") {
			$(".wt_complaints").toggle();
		}
	})
	$(document).on("click", ".wt_complaints", function() {
		var doTipEx = qNo;
		if (UserName) {
			doTipExcomplaint(UserName, doTipEx, 7);
		};
	})



	//问题转发
	$(document).on("click", ".forwarding", function(e) {
		$(".sharelink").toggle();
		e.stopPropagation();
		//生成微信朋友圈二维码
		var viId = getURIArgs("qno");
		var urls = "www.quanzinet.com/html/sharingproblems.html?qno=" + viId;
		$(this).siblings(".sharelink").find(".qrodeBox div").qrcode({
			render: "canvas",
			width: 30 * 4,
			height: 30 * 4,
			text: urls
		});
	})
	$(document).on("click", function(e) {
		e.stopPropagation();
		$(".sharelink").hide();
	})



	//推荐好友- 查看更多
	$(".more").on("click", function() {
		if (UserName) {
			window.location.href = '/center/acceptfriends.html';
		} else {
			$(".masks,.viewBox").show();
		}
	})



	// 查看问题详情 
	$.ajax({
		type: "post",
		url: serviceHOST() + "/question/findQuestionByQuestionNo.do",
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data:{
			username:UserName,
			questionNo:qNo
		},
		success: function(msg) {
			if (msg.status == 0) {
				var mssg = msg.data;
				var str = '<h2>' + mssg.title + '</h2>\
				<p class="wt_f"><span>来自'+ classifiedJudgement(mssg.category) +'</span><span>&nbsp;|&nbsp;</span><span>' + mssg.fromtheme + '</span></p>\
				<div class="problem_txt" data-name=' + mssg.username + '>' + toFaceImg(mssg.content) + '</div>\
				<div class="problem_b" data_id=' + qNo + ' data_tit=' + mssg.title + '>\
				<span>' + mssg.followcount + '人关注</span>\
				<a class="forwarding" href="javascript:;">转发</a>';
				str += forwarding();

				//删除 与 投诉
				if (mssg.username == UserName) {
					str += '<a class="del_wt" href="javascript:;">删除</a>';
				} else {
					if (UserName == "") {
						str += '<a class="in_formation ' + no_login + '" href="javascript:;"><span class="wt_complaints">投诉</span></a>';
					} else {
						str += '<a class="in_formation" href="javascript:;"><span class="wt_complaints">投诉</span></a>';
					}
				}

				if (mssg.isfollow == 0 || mssg.isfollow == 2) {
					str += '<a class="join_wt_x join_gz ' + no_login + '" href="javascript:;">关注问题</a>';
				} else {
					str += '<a class="join_wt_x join_qx" href="javascript:;">取消关注</a>';
				}
				str += '</div>';
				$(".problem_content").html(str);
				$(".wt_publish").show();
				$(".problem .qz_face").html('<img src="' + ImgHOST() + UserImg + '"  onerror=javascript:this.src="/img/first.png">');

				//评论信息
				if (mssg.questionCommentlist != "" && mssg.questionCommentlist != null) {
					for (var i = 0; i < mssg.questionCommentlist.length; i++) {
						var tpl = mssg.questionCommentlist[i];
						var _img = tpl.commentuser.userimagepath;
						var _name = tpl.commentuser.username;
						var _nickname = (tpl.commentuser.nickname || tpl.commentuser.username);


						if (tpl.parentCommentNo == "" || tpl.parentCommentNo == null || tpl.parentCommentNo == qNo) {
							reviewInformation(tpl, _nickname, _name, _img, mssg.questionCommentlist);
						}

					}
				} else {
					$(".bottom_left").append("<div class='no_comments'><p>暂无评论内容，赶紧占座评论吧！</p></div>")
				}

				autosize(document.querySelectorAll('#txtId'));
			}else if(msg.status==-3){
				getToken();
			} else {
				warningMessage(msg.info, function() {
					window.history.go(-1);
				});
			}
		},
		error: function() {
			console.log("error")
		}
	});



	//评论信息展示
	var num;

	function reviewInformation(msg, nickname, name, img, questionCommentlist) {
		var str = "";
		num = 0;
		var tpl = answerComments(questionCommentlist, msg.questioncommentNo);
		str += '<li class="comments-item problem_list problemComment" data-qno=' + msg.questioncommentNo + ' data-name=' + name + '>\
		<div class="comments-item-bd">\
		<div class="ui-avatar">\
		<img src="' + ImgHOST() + img + '"  onerror=javascript:this.src="/img/first.png">\
		</div>\
		<div class="comments-content">\
		<a href="javascript:;" class="qz_name">' + nickname + '</a>：<span>' + toFaceImg(msg.content) + '</span>\
		<div class="comments-op conmments_d_y">\
		<span class="ui-mr10 state">' + formatTime(msg.createtime) + '</span>\
		<a href="javascript:;" class="act-reply" title="评论" data-num=' + num + '>' + num + '条评论</a>';
		//赞
		if (msg.isclick == 1) {
			str += '<a class="wt_pl_z wtp_yz" href="javascript:;">' + (msg.isclickCount || 0) + '</a>';

		} else {
			str += '<a class="wt_pl_z ' + no_login + '" href="javascript:;">' + (msg.isclickCount || 0) + '</a>';
		}
		//踩
		if (msg.isstamp == 2) {
			str += '<a class="wt_pl_c wtp_yc" href="javascript:;">' + (msg.isstampCount || 0) + '</a>';
		} else {
			str += '<a class="wt_pl_c ' + no_login + '" href="javascript:;">' + (msg.isstampCount || 0) + '</a>';
		}

		//删除
		if (name == UserName) {
			str += '<a href="javascript:;" class="oneselfdel"></a>';
		}

		str += '</div>\
		<div class="revert_box"></div>\
		</div>\
		<div class="comments-list mod-comments-sub">\
		<ul>' + tpl + '</ul>\
		<div class="ansecondary"></div>\
		<div class="qz_publish">\
		<div class="qz_face">\
		<img src="' + ImgHOST() + UserImg + '"  onerror=javascript:this.src="/img/first.png">\
		</div>\
		<div class="p_input">\
		<textarea class="Postcomment" placeholder="回复 ' + nickname + '：" name="review_1"></textarea>\
		</div>\
		</div>\
		<div class="review_1">\
		</div>\
		</div>\
		</div>\
		</li>';
		$(".stairComment").append(str);

	}


	//回答评论
	function answerComments(msg, questioncommentNo) {
		var str = "";
		if (msg) {
			for (var j = 0; j < msg.length; j++) {
				var mssg = msg[j];

				//父评论编号 == 评论编号
				if (mssg.parentCommentNo == questioncommentNo) {
					var u = mssg.commentuser.username; //用户名
					var n = mssg.commentuser.nickname; //用户昵称
					var img = mssg.commentuser.userimagepath; //用户头像
					num = num + 1;
					str += loadResponse(mssg, u, n, img);
				}
			}
		}
		return str;
	}



	//回答评论展示
	function loadResponse(mssg, u, n, img) {
		var str = "";
		str = '<li class="comments-item" data-qno=' + mssg.questioncommentNo + ' data-name=' + u + '>\
				<div class="comments-item-bd">\
				<div class="ui-avatar">\
				<img src="' + ImgHOST() + img + '"  onerror=javascript:this.src="/img/first.png">\
				</div>\
				<div class="comments-content">\
				<a href="javascript:;" class="qz_name" data-name=' + u + '>' + (n || u) + '：</a>' + toFaceImg(mssg.content) + '\
				<div class="comments-op">\
				<span class="ui-mr10 state">' + formatTime(mssg.createtime) + '</span>';
		if (u == UserName) {
			str += '<a href="javascript:;" class="oneselfdel"></a>';
		}
		str += '</div>\
				<div class="revert_box"></div>\
				</div>\
				</div>\
				</li>';
		return str;
	}



	/*
	 *	String  questionNo	问题编号
	 *	String parentCommentNo	父评论编号
	 *	String parentusername	被评论者
	 *	String childusername	评论者
	 *	String content	评论内容
	 */
	function createQuestionComment(qNo, pNo, pName, content, _this) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/question/createQuestionComment.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data:{
				questionNo:qNo,
				parentCommentNo:pNo,
				parentusername:pName,
				childusername:UserName,
				content:content
			},
			success: function(msg) {
				if (msg.status == 0) {
					var mssg = msg.data;
					friendlyMessage("评论成功", function() {
						$("#txtId").val("");
						$('textarea#txtId').css("height", "19px");
						if (pNo) {
							_this.find(".mod-comments-sub ul").append(loadResponse(mssg, UserName, Nickname, UserImg));
							var amount = _this.find(".act-reply").attr("data-num")
							_this.find(".act-reply").attr("data-num", Number(amount) + 1);
						} else {
							$(".no_comments").fadeOut(200, function() {
								$(".no_comments").remove();
							})
							reviewInformation(mssg, Nickname, UserName, UserImg);
						}
					});
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



	/*
	String  questionNo	问题编号	
	String  questionCommentNo	评论编号	
	*/
	function deleteQuestionComment(qNo, qCNo, _this) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/question/deleteQuestionComment.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data:{
				questionNo:qNo,
				questionCommentNo:qCNo,
				username:UserName
			},
			success: function(msg) {
				if (msg.status == 0) {
					_this.fadeOut(300, function() {
						_this.remove();
						if ($(".comments-item").length == 0) {
							$(".bottom_left").append("<div class='no_comments'><p>暂无评论内容，赶紧占座评论吧！</p></div>");
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



	//关注问题
	function followQuestion(_this) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/question/followQuestion.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data:{
				questionNo:qNo,
				username:UserName
			},
			success: function(msg) {
				if (msg.status == 0) {
					friendlyMessage("关注成功", function() {
						_this.removeClass("focus_wt").addClass('join_qx').html("取消关注");

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



	//点赞 取消点赞 踩
	function clickOrStamp(cNo, tag, _this, num) {
		var _question = {
			"questionCommentClick":{
				username: UserName,
				commentNo: cNo,
				isclicklike: tag
			}
		}
		var question = JSON.stringify(_question);
		$.ajax({
			type: "post",
			url: serviceHOST() + "/question/clickOrStamp.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data:{
				questionCommentClick:question
			},
			success: function(msg) {
				if (msg.status == 0) {
					state = true;
					if (tag == 1) {
						_this.addClass("wtp_yz");
						_this.text(num + 1);
						var _next = _this.next();
						if (_next.hasClass("wtp_yc")) {
							_next.removeClass("wtp_yc");
							_next.text(Number(_next.text() - 1));
						}
					} else if (tag == -1) {
						_this.removeClass("wtp_yz");
						_this.text(num - 1);
					} else if (tag == 2) {
						_this.addClass("wtp_yc");
						_this.text(num + 1);
						var _prev = _this.prev();
						if (_prev.hasClass("wtp_yz")) {
							_prev.removeClass("wtp_yz");
							_prev.text(Number(_prev.text() - 1));
						}
					} else if (tag == -2) {
						_this.removeClass("wtp_yc");
						_this.text(num - 1);
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



	//删除问题
	function deleteQuestion(_this) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/question/deleteQuestion.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data:{
				questionNo:qNo,
				username:UserName
			},
			success: function(msg) {
				if (msg.status == 0) {
					friendlyMessage("删除成功", function() {
						window.history.back(-1);
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



	//转发
	function forwarding() {
		var transmit = '<div class="sharelink"><div>';
		if (UserName) {
			transmit += '<a class="share1" href="javascript:;">圈子朋友圈</a>' +
				'<a class="share2" href="javascript:;">圈子好友</a>'+
				'<a class="share9" href="javascript:;">首页热门</a>';
		} else {
			transmit += '<a class="share1 login_window" href="javascript:;">圈子朋友圈</a>' +
				'<a class="share2 login_window" href="javascript:;">圈子好友</a>'+
				'<a class="share9 login_window" href="javascript:;">首页热门</a>';
		}
		transmit += '<a class="share5" href="javascript:;"><span>微信朋友圈</span>' +
			'<div class="qrodeBox">' +
			'<p>分享到微信朋友圈</p>' +
			'<div></div>' +
			'</div>' +
			'</a>' +
			'<a class="share6" href="javascript:;">QQ空间</a>' +
			'<a class="share7" href="javascript:;">QQ好友</a>' +
			'<a class="share8" href="javascript:;">新浪微博</a></div></div>';
		return transmit;
	}



	//相关问题
	function recommendQuestionByQuestion(page) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/question/recommendQuestionByQuestion.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: {
				questionNo: qNo,
				pageNum: page,
				pageSize: 5
			},
			success: function(msg) {
				if (msg.status == 0) {
					for (var i = 0; i < msg.data.length; i++) {
						var mssg = msg.data[i];
						var hot = '<div class="hotItem"><a href="/center/zhiye/wentixq.html?qno=' + mssg.questionNo + '&code=' + code + '">' + mssg.title + '</a><span>' + (mssg.followcount || 0) + '人关注</span></div>';
						$(".hotContent").append(hot);
					};

				}else if(msg.status==-3){
					getToken();
				}else if (msg.status == 1) {
					if (msg.data == "" && page != 1) {
						recommendQuestionByQuestion(1);
						xgnum = 0;
					} else {
						$(".hotContent").append("<div class='no_comments'><p>暂无相关问题</p></div>");
					}
				}
			},
			error: function() {
				console.log("error")
			}
		});
	};
	recommendQuestionByQuestion(1);



})