$(function() {
	var _username = getCookie('username');
	//获取个人信息
	findUserInformation(_username, _username);
	//可能认识的人
	recommendRosters(_username);
	//获取关注列表
	getFouseList(_username, '.personal_guanzhu ul');
	//关注设置
	$(document).on('click', '.focus_setting', function(e) {
		$('.setting_box').hide();
		$(this).children().show();
		e.stopPropagation();
	});
	$(document).on('click', function() {
		$('.setting_box').hide();
	});

	//添加好友
	$(document).on("click", ".addFriendBtn", function() {
		var _this = $(this);
		var jid2add = $(this).parents(".funsList").attr("data-username");
		AddfriendRequest(_username, jid2add, _this);
	});

	//取消关注
	$(document).on("click", ".cancelGuanzhu", function() {
		var following = $(this).parents(".funsList").attr("data-username");
		var _this = $(this);
		unsetFocus(_username, following,_this);
	});


	$(document).on('click', '#page>a', function() {
		var pageNo = $(this).attr('pageno');
		window.location.href = '/center/me/focus.html?pageno=' + pageNo;
	})

	//获取关注列表
	function getFouseList(username, wrap) {
		var str = "";
		var pagenum = (getURIArgs('pageno')) ? getURIArgs('pageno'):1
		$.ajax({
			type: "get",
			url: serviceHOST() + "/following/getmyfollowingsWeb.do",
			dataType: "json",
			data: {
				username: username,
				pagenum: pagenum,
				pagesize: 12
			},
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				$('.jiazai').remove();
				if (msg.data.followerEntities.length == 0) {
					$('.no_publish').show();
					return false;
				}
				for (var i = 0; i < msg.data.followerEntities.length; i++) {
					var mssg = msg.data.followerEntities[i];
					var avatfile = mssg.blogger.avatarfile;
					str += '<li class="funsList" data-username="' + mssg.blogger.username + '"><a href="javascript:;" class="guanzhu_img"><img src="'
					if (avatfile == '' || avatfile == null || avatfile == 'null') {
						str += '/img/first.png">';
					} else {
						str += ImgHOST() + mssg.blogger.avatarfile + '">';
					}
					str += '</a><dl class="guanzhu_info"><dd class="guanzhu_name">';
					if (mssg.blogger.nickname == null) {
						mssg.blogger.nickname = '';
					}
					str += mssg.blogger.nickname + '</dd><dd class="guanzhu_type">';
					if (mssg.blogger.myindustry == null) {
						mssg.blogger.myindustry = '';
					}
					str += mssg.blogger.myindustry + '</dd></dl><div class="funs_content"><a href="javascript:;" class="cancelGuanzhu focus">取消关注</a><a href="javascript:;" class="funs_guanzhu">';
					if (mssg.relation == 5) {
						str += '<span class="addFriendBtn"><i></i>好友</span>';
					} else if (mssg.relation == 1 || mssg.relation == 2 || mssg.relation == 3) {
						str += '<span class="sendMessageBtn">发消息</span>';
					} else if (mssg.relation == 0) {
						str += '<span>已申请</span>';
					} else if (mssg.relation == 4) {
						str += '<span>已拒绝</span>';
					};
					str += '</a></div><div class="clear"></div></li>';

				};
				$(wrap).html(str);
				$('.personal_guanzhu').show();
				var pageStr = printPage({
					pageNo: getURIArgs('pageno') || 1,
					pageSize: 12,
					dataSum: msg.data.totalcnt
				});
				$(".page").empty().append(pageStr);
			},
			error: function() {
				console.log("error")
			}
		})
	};


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
				myname: getCookie("username") || "nouser",
				username: strangename,
				templetName: "pageJingtai"
			});
		}
	})


})