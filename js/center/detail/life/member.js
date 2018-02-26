$(function() {
	getRememberList(code, cache);

	function getRememberList(circleNo, category) {
		var pagenum = (getURIArgs('pageno')) ? getURIArgs('pageno') : 1
		$('.change_new').attr('data-page', pagenum);
		var str = '';
		$.ajax({
			type: "post",
			url: serviceHOST() + '/userCircle/selectAllUserByCircleNo.do',
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: {
				username: UserName,
				circleNo: circleNo,
				category: category,
				pageNum: pagenum,
				pageSize: 12
			},
			success: function(msg) {
				if(msg.status==-3){
					getToken();
				};
				$('.jiazai').remove();
				$('.remember').show();
				if (msg.data.userlist.length > 0) {
					for (var i = 0; i < msg.data.userlist.length; i++) {
						var avatfile = msg.data.userlist[i].imagepath;
						var nikename = msg.data.userlist[i].nickname;
						var myindustry = msg.data.userlist[i].myindustry;
						if (nikename == null || nikename == 'null') {
							nikename = '';
						}
						if (myindustry == null || myindustry == 'null') {
							myindustry = '';
						}
						str += '<li class="funsList" data-username="' + msg.data.userlist[i].username + '"><a href="javascript:;" class="guanzhu_img">';
						if (avatfile == '' || avatfile == 'null' || avatfile == null) {
							str += '<img src="/img/first.png">';
						} else {
							str += '<img src="' + ImgHOST() + msg.data.userlist[i].imagepath + '">';
						}
						str += '</a><dl class="guanzhu_info"><dd class="guanzhu_name">' + nikename + '</dd><dd class="guanzhu_type">' + myindustry + '</dd></dl>';
						if (UserName == "") {
							str += '<div class="funs_content"><a href="javascript:;" class="funs_guanzhu ' + no_login + '"><i></i>关注</a>';
							str += '<a href="javascript:;" class="addFriendBtn ' + no_login + '"><span><i></i>好友</span></a></div><div class="clear"></div></li>';
						} else {
							if (msg.data.userlist[i].username != UserName) {
								str += '<div class="funs_content">';
								if (msg.data.userlist[i].ismutual == 0) { //判断是否关注
									str += '<a href="javascript:;" class="funs_guanzhu ' + no_login + '"><i></i>关注</a>';
								} else {
									str += '<a href="javascript:;" class="cancelGuanzhu ' + no_login + '">取消关注</a>';
								}
								if (msg.data.userlist[i].relation == 0) {
									str += '<a href="javascript:;"><span>已申请</span></a>';
								} else if (msg.data.userlist[i].relation == 1 || msg.data.userlist[i].relation == 2 || msg.data.userlist[i].relation == 3) {
									str += '<a href="javascript:;" class="sendMessageBtn"><span>发消息</span></a>';
								} else {
									str += '<a href="javascript:;" class="addFriendBtn"><span><i></i>好友</span></a>'
								}
							}
							str += '</div><div class="clear"></div></li>';
						}
					};
					$('.guanzhu_wrap').html(str);
					$('.change_new').attr('data-num', Math.ceil(msg.data.usercount / 12));
				} else {
					$('.guanzhu_wrap').html('<div class="Isempty"><p>圈子里暂无成员</p></div>');
				}
			},
			error: function() {
				console.log("error")
			}
		})
	}

	//点击分页时候
	$(document).on('click', '.change_new', function() {
		var page = $(this).attr('data-page');
		var num = $(this).attr('data-num');
		page++;
		if (page > num) {
			warningMessage('暂无更多成员');
		} else {
			window.location.href = '/center/life/active.html?code=' + code + '&pageno=' + page;
		}
	})


	//关注
	$(document).on('click', '.funs_guanzhu', function() {
		if (UserName != "") {
			var following = $(this).parents('.funsList').attr("data-username");
			if (UserName) {
				setFocus(UserName, following,$(this),5);
			}
		}
	});

	//取消关注
	$(document).on('click', '.cancelGuanzhu', function() {
		var following = $(this).parents('.funsList').attr("data-username");
		unsetFocus(UserName, following,$(this),5);
	});

	//添加好友
	$(document).on('click', '.addFriendBtn', function(e) {
		var _jid2add = $(this).parents('.funsList').attr("data-username");
		if (UserName) {
			AddfriendRequest(UserName, _jid2add, $(this));
		}
	});



	/*
	 * 
	 * 跳转到用户主页
	 * 
	 * */
	$(document).on("click", ".guanzhu_img", function() {
		var strangename = $(this).parents('li').attr("data-username");
		if (strangename == UserName) {
			window.location.href = '/center/me/page.html';
		} else {
			getInfo({
				myname: UserName || "nouser",
				username: strangename,
				templetName: "pageJingtai"
			})
		}
	})
})