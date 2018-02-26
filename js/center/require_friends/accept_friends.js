$(function() {
	var type = getURIArgs("type");
	var Username = getCookie("username");
	var w = getURIArgs("w");
	/*给用户推荐好友接口recommendRosters
	 * 
	 * 
	 * */

	//点击头像跳转
	$(document).on("click", ".require_img", function() {
		var name = $(this).parents('li').attr('data-nam');
		//window.location.href = '/center/u/page.html?from=' + name;
		getInfo({
			myname: getCookie("username") || "nouser",
			username: name,
			templetName: "pageJingtai"
		});
	})


	function recommendRosters() {
		im.localLoadingOn(".require_bar .possible_list ul")
		var str = "";
		$.ajax({
			type: "post",
			url: serviceHOST() + "/recommend/recommendRosters.do",
			headers: {
				"token": qz_token()
			},
			data: {
				username: Username
			},
			dataType: "json",
			success: function(msg) {
				im.localLoadingOff(".require_bar .possible_list ul")
				if (msg.status == 0) {
					var mssg = msg.data;
					//个人信息
					for (var i = 0; i < mssg.length; i++) {
						if (mssg[i].imgforheadlist == "") {
							str += '<li class="AddBuddy_r ' + mssg[i].userNo + '" data-id=' + mssg[i].username + ' data-nam=' + mssg[i].username + '><a href="javascript:;" class="require_img fl"><img src="/img/first.png" alt="" alt="头像" class="portrait" /></a>';
						} else {
							str += '<li class="AddBuddy_r ' + mssg[i].userNo + '" data-id=' + mssg[i].username + ' data-nam=' + mssg[i].username + '><a href="javascript:;" class="require_img fl"><img src="' + ImgHOST() + mssg[i].imgforheadlist[0].imagepath + '" class="portrait"  /></a>';
						}

						str += '<dl class="list_info fl">' +
							'<dd class="require_name">' + mssg[i].nickname + '</dd>' +
							'<dd class="require_type">' + mssg[i].myindustry + '</dd>' +
							'</dl>' +
							'<div class="possible_content">' +
							'<a href="javascript:;" class="add_friend">' +
							'<i></i>加好友' +
							'</a>' +
							'<a href="javascript:;" class="focus">' +
							'<i></i>关注' +
							'</a>' +
							'<a href="javascript:;" class="close_btn dispose_del">' +
							'<i>移除</i>' +
							'</a>' +
							'</div>' +
							'<div class="clear"></div>' +
							'</li>';
					};
					$(".require_bar .possible_list ul").html(str);
				} else if (msg.status == -3) {
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}

		});
	}
	if (type != 1) {
		recommendRosters();
	}


	//换一批 推荐用户

	$(".possible .possible_top .batch").on("click", function() {
		$(".require_bar .possible_list ul").html("");
		recommendRosters();
	})



	/*
	 
	 * 
	 * 搜索好友
	 * */
	$(document).on("click", ".require_right .searchs .onrecord", function() {
		var w = html2Escape($(this).parent().find("input").val()) || "";
		window.location.href = "/center/acceptfriends.html?type=1&w=" + w;
	})

	$("#FriendsSearch").focus(function() {
		var act = $(document.activeElement).attr("id");
		if (act == "FriendsSearch") {
			$("body,html").on("keyup", function(e) {
				var code = (e ? e.keyCode : e.which);
				if (code == 13) {
					var w = html2Escape($("#FriendsSearch").val()) || "";
					window.location.href = "/center/acceptfriends.html?type=1&w=" + w;
					return false;
				};
			});
		}
	});


	if (type == 1) {
		$(".require_right h2").append('<a class="complete" href="javascript:;">完成</a>');
		$(".require_left ").html('<div class="possible require_bar"><h3>搜索结果</h3><div class="possible_list"></div></div>');
		FriendsSearch();
		$(".require_right .searchs input").val(w);
		if (w != "") {
			$(".require_right .searchs i").removeClass("onrecord");
			$(".require_right .searchs i").addClass("delrecord")
			$(".require_right .searchs i").css({
				"background": "url(/img/cha_01.png) no-repeat",
				"background-size": "16px"
			})
		}
	}


	/*清空搜索
	 */
	$(document).on("click", ".delrecord", function() {
		w = "";
		$(".require_right .searchs input").val("");
		$(this).removeClass("delrecord");
		$(".require_right .searchs i").addClass("onrecord")
		$(".require_right .searchs i").css({
			"background": "url(/img/sousuo.png) no-repeat"
		});
		$(".require_bar>h3").html("推荐好友");
		recommendRosters();
	})

	/*点击完成返回
	 */
	$(document).on("click", ".require_right .complete", function() {
		window.location.href = "/center/acceptfriends.html";
	})

	/*
	 
	 * 推荐用户加好友
	 * */

	$(document).on("click", ".possible_list .add_friend", function() {
		var _this = $(this);
		var jid2add = $(this).parents("li").attr("data-nam");
		AddfriendRequest(UserName, jid2add, _this)
	})

	function FriendsSearch() {
		var nickname = "";
		im.localLoadingOn(".require_left .possible_list");
		$.ajax({
			type: "post",
			url: serviceHOST() + "/user/searchUser.do",
			dataType: "json",
			headers: {
				token: qz_token()
			},
			data: {
				keyword: w,
				username: UserName,
				pageNum: 1
			},

			success: function(msg) {
				if (msg.status == 0) {
					im.localLoadingOff(".require_left .possible_list")
					if (msg.data == "") {
						$(".require_left .possible_list").html('<div class="ThereNo">暂无搜索结果</div>');
						return false;
					}
					var str = '<ul class="hy_search">';
					for (var i = 0; i < msg.data.length; i++) {
						var mssg = msg.data[i].user;
						if (mssg.nickname != null) {
							str += '<li data-nam="' + mssg.username + '">';
							if (mssg.avatarfile == "" && mssg.avatarfile == undefined) {
								str += '<a href="javascript:;" class="require_img fl"><img src="/img/first.png"/></a>';
							} else {
								str += '<a href="javascript:;" class="require_img fl"><img src="' + ImgHOST() + mssg.avatarfile + '"/></a>';
							}

							str += '<dl class="list_info fl"><dd class="require_name">' + mssg.nickname + '</dd>' +
								'<dd class="require_type">' + (mssg.myindustry || "--") + '</dd>' +
								'</dl>' +
								'<div class="possible_content">';
							//好友添加状态
							if (mssg.username != getCookie("username")) {
								if (mssg.relation == 0) {
									str += '<a class="Isfriends" href="javascript:;">请求已发送</a>';
								} else if (mssg.relation == 1 || mssg.relation == 2 || mssg.relation == 3) {
									str += '<a class="Isfriends" href="javascript:;">已添加</a>';
								} else if (mssg.relation == 4) {
									str += '<a class="Isfriends" href="javascript:;">已拒绝</a>';
								} else {
									str += '<a class="add_friend" href="javascript:;"><i></i>加好友</a>';
								};

							}
							str += '</div><div class="clear"></div>' +
								'</li>';
						}

					}
					str += '</ul>';
					$(".require_left .possible_list").html(str);

				} else if (msg.status == -3) {
					getToken();
				};
			},
			error: function() {
				console.log("error");
			}

		});
	}


	/*
	 * 关注
	 */
	$(document).on("click", ".possible_list .focus", function() {
		var following = $(this).parents(".AddBuddy_r").attr("data-id");
		var att = $(this);
		$.ajax({
			type: "get",
			url: serviceHOST() + '/following/setfollowing.do',
			dataType: "json",
			data: {
				following: following,
				username: UserName
			},
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				att.removeClass("focus");
				att.addClass("FocusOn")
				att.html("已关注");
				if (msg.status == 0) {
					friendlyMessage("关注成功");
				} else if (msg.status == 409) {
					friendlyMessage("已关注");
				}
			},
			error: function() {
				console.log("error")
			}

		});
	})


	/*
	 * 删除推荐用户
	 */

	$(document).on("click", ".AddBuddy_r .dispose_del", function() {
		var _friendname = $(this).parents(".AddBuddy_r").attr("data-id");
		var _this = $(this).parents(".AddBuddy_r");
		removeRecommendRosters(_friendname, _this);
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
					_this.remove();
				} else if (msg.status == -3) {
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}

		});
	}



	/*
		好友请求切换
	*/
	// 收到的好友请求
	var tag = true;
	$(".require_title ul li .Receipt").on("click", function() {
		$(".require_title ul li a").removeClass("title_active");
		$(this).addClass("title_active");
		$(".require_list .ReceiptRequest").show().next().hide();
	})

	// 发出的好友请求
	$(".require_title ul li .Making").on("click", function() {
		$(".require_title ul li a").removeClass("title_active");
		$(this).addClass("title_active");
		$(".require_list .MakingRequest").show().prev().hide();
		if (tag == true) {
			FriendRequestInterface(1);
		}
	})

	/*
		好友请求接口
		1获取已发出的好友请求 
		2 获取收到的好友请求

	*/
	FriendRequestInterface(2);

	function FriendRequestInterface(type) {
		$.ajax({
			type: "get",
			url: RestfulHOST() + "/users/roster/roster_req",
			dataType: "json",
			data: {
				type: type,
				username: UserName
			},
			headers: {
				"Authorization": "AQAa5HjfUNgCr27x",
				"Content-Type": "multipart/form-data"
			},
			success: function(msg) {
				var mssg = msg.rosterItem;
				if (type == 2) {
					FriendRequest02(mssg);
				} else {
					FriendRequest01(mssg);
				}
			},
			error: function() {
				console.log("error")
			}

		});

	}


	// 收到的好友请求   
	function FriendRequest02(mssg) {
		var str = "";
		var nikename = '';
		if (mssg == "") {
			$(".require_list .ReceiptRequest ul").html('<li class="no_request">无好友请求</li>');
			return false;
		}
		for (var i = 0; i < mssg.length; i++) {
			if (mssg[i].nickname == 'null' || mssg[i].nickname == '' || mssg[i].nickname == null) {
				nikename = shieldNumber(mssg[i].username); //屏蔽手机号中间四位
			} else {
				nikename = mssg[i].nickname;
			}
			if (i < 5) {
				str = '<li data-name=' + mssg[i].username.split("@")[0] + '>';
			} else {
				str = '<li data-name=' + mssg[i].username.split("@")[0] + ' class="hidden">';
			}

			str += '<a href="javascript:;" class="require_img fl">';
			if (mssg[i].avatarfile == "") {
				str += '<img src="/img/first.png"/>';
			} else {
				str += '<img src="' + ImgHOST() + mssg[i].avatarfile + '"/>';
			}
			str += '</a>' +
				'<dl class="list_info fl">' +
				'<dd class="require_name">' + nikename + '</dd>' +
				'<dd class="require_type">' + (mssg[i].myindustry || "--") + '</dd>' +
				'</dl>' +
				'<div class="list_content">' +
				'<a class="accept onaccept" href="javascript:;">接受</a>' +
				'<a class="delete ondelete" href="javascript:;">拒绝</a>' +
				'</div><div class="clear"></div>' +
				'</li>';

			$(".require_list .ReceiptRequest ul").append(str);
			if (i > 5) {
				$(".require_list .ReceiptRequest .more").html('查看更多请求');
			}

		}

	}

	// 发出的好友请求
	function FriendRequest01(mssg) {
		tag = false;
		var tpl = "";
		var nikename = '';
		if (mssg == "") {
			$(".require_list .MakingRequest ul").html('<li class="no_request">暂时尚无请求信息~</li>');
			return false;
		}
		for (var i = 0; i < mssg.length; i++) {

			if (i < 5) {
				tpl = '<li data-nam=' + mssg[i].username.split("@")[0] + '>';
			} else {
				tpl = '<li data-nam=' + mssg[i].username.split("@")[0] + ' class="hidden">';
			}
			tpl += '<a href="javascript:;" class="require_img fl">';
			if (mssg[i].avatarfile == "") {
				tpl += '<img src="/img/first.png"/>';
			} else {
				tpl += '<img src="' + ImgHOST() + mssg[i].avatarfile + '"/>';
			}
			if (mssg[i].nickname == 'null' || mssg[i].nickname == '' || mssg[i].nickname == null) {
				nikename = shieldNumber(mssg[i].username); //屏蔽手机号中间四位
			} else {
				nikename = mssg[i].nickname;
			}
			tpl += '</a>' +
				'<dl class="list_info fl">' +
				'<dd class="require_name">' + nikename + '</dd>' +
				'<dd class="require_type">' + (mssg[i].myindustry || "--") + '</dd>' +
				'</dl>' +
				'<div class="list_content">' +
				'<span>请求已发送</span>' +
				'</div><div class="clear"></div>' +
				'</li>';
			$(".require_list .MakingRequest ul").append(tpl);
			if (i > 5) {
				$(".require_list .MakingRequest .more").html('查看更多请求');
			}
		}

	}



	/*
		查看更多
	*/

	$(document).on("click", ".require_list .more", function() {
		$(this).parents(".require_list").find(".hidden").fadeIn(400);
		$(this).remove();
	})
})