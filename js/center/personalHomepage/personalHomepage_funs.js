$(function() {
	var _username = getCookie('username');
	//获取个人信息
	findUserInformation(_username, _username);
	//可能认识的人
	recommendRosters(_username);
	getFunsList(_username);
	//更多设置
	$(document).on('click', '.funs_more', function(e) {
		$(this).find('.more_box').toggle();
		$(this).parents('li').siblings().find('.more_box').hide();
		e.stopPropagation();
	});
	$(document).on('click', '.setting_box span', function(e) {
		$(this).parent().hide();
		e.stopPropagation();
	});

	//关闭发布窗口
	$(document).on('click', function(e) {
		$('.setting_box').hide();
		e.stopPropagation();
	});

	//添加好友

	$(document).on('click', '.addFriendBtn', function(e) {
		var jid2add = $(this).parents("li").attr("data-username");
		if (username) AddfriendRequest(_username, jid2add, $(this));
	});




	function getFunsList(username) {
		var str = "";
		var pagenum = (getURIArgs('pageno')) ? getURIArgs('pageno'):1
		$.ajax({
			type: "get",
			url: serviceHOST() + "/following/getmyfollowersWeb.do",
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
				//如果粉丝为0
				if (msg.data.followerEntities.length == 0) {
					$('.no_publish').show();
					return false;
				}
				for (var i = 0; i < msg.data.followerEntities.length; i++) {
					var mssg = msg.data.followerEntities[i];
					var avatfile = mssg.follower.avatarfile;
					var nikename = mssg.follower.nickname;
					var myindustry = mssg.follower.myindustry;
					if (nikename == null || nikename == 'null' || nikename == '') {
							nikename = shieldNumber(mssg.follower.username)
					}
					if (myindustry == null || myindustry == 'null') {
						myindustry = '';
					}
					str += '<li class="funsList" data-username="' + mssg.follower.username + '"><a href="javascript:;" class="guanzhu_img"><img src="';
					if (avatfile == '' || avatfile == 'null' || avatfile == null) {
						str += '/img/first.png" >';
					} else {
						str += ImgHOST() + mssg.follower.avatarfile + '">';
					}
					str += '</a><dl class="guanzhu_info"><dd class="guanzhu_name">' + nikename + '</dd><dd class="guanzhu_type">' + myindustry + '</dd></dl><div class="funs_content">';
					if (mssg.ismutual == 0) { //判断是否关注
						str += '<a href="javascript:;" class="funs_guanzhu"><i></i>关注</a><a href="javascript:;" class="funs_more">更多<i></i><div class="more_box setting_box">';
					} else {
						str += '<a href="javascript:;" class="focus"><i></i>已关注</a><a href="javascript:;" class="funs_more">更多<i></i><div class="more_box setting_box">';
					}
						if (mssg.relation == 5) {
						str += '<span class="addFriendBtn">加好友</span>';
					} else if (mssg.relation == 1 || mssg.relation == 2 || mssg.relation == 3) {
						str += '<span class="sendMessageBtn">发消息</span>';
					} else if (mssg.relation == 0) {
						str += '<span>已申请</span>';
					} else if (mssg.relation == 4) {
						str += '<span>已拒绝</span>';
					};
					if (mssg.ismutual == 0) {
						//<span class="complaint">投诉</span>			将投诉去掉
						str += '<span class="removeFuns">移除粉丝</span></div></a></div><div class="clear"></div></li>';
					} else {
						str += '<span class="cancelGuanzhu">取消关注</span><span class="removeFuns">移除粉丝</span></div></a></div><div class="clear"></div></li>';
					}
				};
				$('.guanzhu_wrap').html(str);
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
	//点击分页时候
	$(document).on('click', '#page>a', function() {
		var pageNo = $(this).attr('pageno');
		window.location.href = '/center/me/funs.html?pageno=' + pageNo;
	})

	//关注
	$(document).on('click', '.funs_guanzhu', function() {
		var following = $(this).parents('.funsList').attr("data-username");
		setFocus(_username, following);
		$(this).siblings('.funs_more').find('span').first().after('<span class="cancelGuanzhu">取消关注</span>');
		$(this).addClass('focus').removeClass('funs_guanzhu').html('<i></i>已关注');

	});

	//取消关注
	$(document).on('click', '.cancelGuanzhu', function() {
		var following = $(this).parents('.funsList').attr("data-username");
		unsetFocus(_username, following);
		$(this).parents('.funs_content').children().eq(0).addClass('funs_guanzhu').removeClass('focus').html('<i></i>关注');
		$(this).remove();
	});

	//移除粉丝

	$(document).on('click', '.removeFuns', function() {
		var follower = $(this).parents('.funsList').attr("data-username");
		var _this=$(this);
		removeFuns(_username, follower,_this);
	});

	function removeFuns(username, follower,_this) {
		var params = {
			username: username,
			following: follower
		};
		var str = $.param(params);
		$.ajax({
			type: "post",
			url: serviceHOST() + "/following/removefollower.do?" + str,
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				if(msg.status==0){
					friendlyMessage('移除粉丝成功',function(){
						_this.parents('.funsList').remove();
						if($(".personal_guanzhu .guanzhu_wrap").has("li").length==0){
							$(".no_publish").show();
							$(".personal_guanzhu").hide();
						}
					});
				}
			},
			error: function() {
				warningMessage("移除粉丝失败");
			}
		})
	}



	$(document).click(function(e) {
		if (e.target.className == 'publish_box') {
			$('.publish_box').hide();
		}
	})



	//投诉
	$(document).on('click', '.complaint', function(e) {
		var doTipEx = $(this).parents('.funsList').attr('data-username');
		doTipExcomplaint(_username, doTipEx, 2)
		e.stopPropagation();
	})


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
			})
		}
	})

	//立即发布点击
	$(document).on('click', '.releaseBtn', function(e) {
		window.location.href = '/center/index.html?posting=1';
		e.stopPropagation();
	})

})