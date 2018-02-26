//新更改的头部
$(function() {
	var UserName = getCookie("username"); //用户名
	var UserImg = getCookie("headImgkz"); //用户头像
	var Nickname = getCookie("nickname"); //用户昵称


	// 登录超时重新登录
	if (!UserName) {
		toHomeLogin();
	};    
	function toHomeLogin() {
		warningMessage("登录超时，请重新登录", function() {
			clearCookie("username");
			clearCookie("userNo");
			clearCookie("nickname");
			clearCookie("magicnos");
			clearCookie("headImgkz");
			clearCookie("viplevel");
			clearCookie("xmpp_key");
			clearCookie("widoutTradeNo");  
			clearCookie("myindustry");
			clearCookie("isphonelog");
			store.remove('msg_history');
			store.remove('chat_status');
			store.remove('chat_focus');
			clearCookie("username");
			window.location.href = "/index.html";
		});
	};

	//跳转自媒体
	$(document).on("click", ".heaer_zmt", function() {
		window.location.href = serHOST() + '/IM/html/index.shtml';
	})

	//头像和昵称
	if(getCookie('headImgkz')!="undefined"&&getCookie('headImgkz')!=""){
		if (getCookie("headImgkz").indexOf("http") > -1) {
			$(".head_portrait img").attr("src", getCookie("headImgkz"));
		} else {
			var srcImg = ImgHOST() + getCookie("headImgkz")
			$(".head_portrait img").attr("src", srcImg);
		}
	} else {
		$(".head_portrait img").attr("src", "/img/first.png");
	}

	var nicks = $.trim(getCookie("nickname"))
	$(".nicknames").html((nicks == "" || nicks == "undefined" || nicks == undefined) ? shieldNumber(UserName) : getCookie("nickname"));



	//设置
	$(".operation_sz").on("click", function(e) {
		e.stopPropagation();
		$(".setFun").toggle()
	})


	$(".operation_sz div").on("click", function(e) {
		e.stopPropagation()
	})

	//顶部右侧推荐加好友
	$(document).on("click", ".messageContent .know_jhy", function() {
		var _this = $(this);
		var jid2add = $(this).parents("li").attr("data-id");
		AddfriendRequest(UserName, jid2add, _this)
	})


	//删除推荐用户
	$(document).on("click", ".messageContent .May_know_del", function() {
		var _friendname = $(this).parents("li").attr("data-id");
		var _this = $(this).parents("li");
		removeRecommendRosters(_friendname, _this);
	})


	//关注
	$(document).on("click", ".messageContent .attention", function() {
		var username = UserName;
		var att = $(this);
		var following = $(this).parents("li").attr("data-id");
		var params = {
			following: following,
			username: username
		};
		var par = $.param(params);
		$.ajax({
			type: "post",
			url: RestfulHOST() + '/following/setfollowing?' + par,
			dataType: "json",
			headers: {
				"Authorization": "AQAa5HjfUNgCr27x"
			},
			success: function(msg) {
				if (msg.status == 0) {
					$("#msk").remove();
					friendlyMessage("关注成功");
					$(".qz" + following).find(".attention").addClass("attention_yg");
					$(".qz" + following).find(".attention").removeClass("attention");
					$(".qz" + following).find(".attention_yg").html("已关注");
				} else if (msg.status == 409) {
					friendlyMessage("已关注");
				}
			},
			error: function() {
				console.log("error")
			}

		});
	})

	//消息  好友  设置  下拉框
	function header_right() {
		var handle = null;
		$(".messageContent .item_o").on("mouseover", function() {
			var messageContent = $(this).parents(".messageContent").find(".item_in");
			handle = setTimeout(function() {
				messageContent.fadeIn(200);
			}, 400);
		}).mouseout(function() {
			clearTimeout(handle);
		});

		$(".messageContent").on("mouseleave", function() {
			$(".Message_box").fadeOut();
			$(this).find(".item_in").fadeOut();
		})

		$(document).on("hover", ".Setup a", function() {
			$(".Setup a").removeClass("Setup_color");
			$(this).addClass("Setup_color");
		})
		$(".messageContent .item_o").on("click", function() {
			$(this).parents(".messageContent").find(".item_in").fadeIn();
		})

		$(document).on("click", ".dropOut", function() {
			clearCookie("username");
			clearCookie("userNo");
			clearCookie("nickname");
			clearCookie("magicnos");
			clearCookie("headImgkz");
			clearCookie("viplevel");
			clearCookie("xmpp_key");
			clearCookie("widoutTradeNo");  
			clearCookie("myindustry");
			clearCookie("isphonelog");
			store.remove('msg_history');
			store.remove('chat_status');
			store.remove('chat_focus');
			$(this).attr("href", "/index.html");
		})
	}
	header_right();



	//关键字搜索
	var arrs = [];
	var word = getURIArgs("word");
	var code = getURIArgs("code");
	var type = getURIArgs("type");
	var form = getURIArgs("form");
	$(document).on("click", ".search", function() {
		var word = $(".search_box input").val().trim();
		var code = "";
		var type = 1;
		var _str = '';
		var nowArr = store.get('key');
		if (word != "") {
			if (nowArr) {
				for (var i = 0; i < nowArr.length; i++) {
					_str += nowArr[i] + ',';
				}
				if (_str.indexOf(word) == -1) { //判断val值里面是否有重复    没有重复
					_str += word;
				} else {
					_str = _str.slice(0, -1);
				}
				arrs.push(_str);
				store.set('key', arrs)
			} else {
				arrs.push(word);
				store.set('key', arrs)
			}
			$(".search_box input").val("");

			//首页搜索页面判断
			if (form == 2) {
				window.location.href = '/center/searchresult.html?word=' + word + '&code=' + code + '&type=' + type + '&form=2';
			} else if (form == 3) {
				window.location.href = '/center/searchresult.html?word=' + word + '&form=3';
			} else if (form == 4) {
				window.location.href = '/center/searchresult.html?word=' + word + '&form=4';
			} else {
				window.location.href = '/center/searchresult.html?word=' + word + '&code=' + code + '&type=' + type + '&form=1';
			}
		}
	})


	//循环本地存储的关键字
	function getKeyWord() {
		if (store.get('key')) {
			var str = "";
			var strs = store.get('key')[0];
			var arrLen = strs.split(",");
			str += '<ol>';
			for (var i = 0; i < arrLen.length; i++) {
				if (arrLen[i].length > 25) {
					str += '<li>' + arrLen[i].substr(0, 25) + '...' + '</li>';
				} else {
					str += '<li>' + arrLen[i] + '</li>';
				}
			}
			str += '</ol>';
			$(".down_search .keywordbox").html(str);
		} else {
			recommendRosters();
		}
	}
	$(document).on("click", ".down_search .keywordbox ol li", function() {
		var word = $(this).html().trim();
		var code = "";
		var type = 1;
		$(".search_box input").val($(this).html());
		window.location.href = '/center/searchresult.html?word=' + word + '&code=' + code + '&type=' + type + '&form=1';
	})



	//回车搜索
	$("#TextID").focus(function() {
		var act = $(document.activeElement).attr("id")
		if (act == "TextID") {
			$("body,html").on("keyup", function(e) {
				console.log(234)
				var code = (e ? e.keyCode : e.which);
				if (code == 13) {
					$(".search").click();
					return false;
				};
			});
		}
	});



	/*
		好友请求接口
		1获取已发出的好友请求 
		2 获取收到的好友请求

	*/
	if (UserName) {
		FriendRequestInterface(2);
	}

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
				FriendRequest(mssg, type);
			},
			error: function() {
				console.log("error")
			}

		});

	}


	/*
		好友请求
	*/
	function FriendRequest(mssg, type) {
		var str = "";
		var tpl = "";
		var rosterItem = mssg.length;
		var nikename = '';
		if (mssg == "") {
			$(".friend_message ul.hy_request").html('<li class="no_request">暂时尚无请求信息~</li>');
			// $(".friend_message ul.Have_accepted").html('<li class="no_request">暂时尚无请求信息~</li>');
			return false;
		}

		if (rosterItem > 3) {
			rosterItem = 3;
		}
		for (var i = 0; i < rosterItem; i++) {
			str += '<li class="RequestList" data-name=' + mssg[i].username.split("@")[0] + '><dl><dt>';
			if (mssg[i].avatarfile == "") {
				str += '<img src="/img/first.png"/>';
			} else {
				str += '<img src="' + ImgHOST() + mssg[i].avatarfile + '"/>';
			}
			str += '</dt><dd>';
			if (mssg[i].nickname == 'null' || mssg[i].nickname == '' || mssg[i].nickname == null) {
				nikename = shieldNumber(mssg[i].username); //屏蔽手机号中间四位
			} else {
				nikename = mssg[i].nickname;
			}
			str += nikename + '</dd><dd class="informationk">请求加你为好友</dd></dl><div class="friend_m_accept">' +
				'<a class="accept onaccept" href="javascript:;">接受</a><a class="refuse" href="javascript:;">拒绝</a></div></li>';

		}
		$(".messageContent .operation_hy").html('<i class="tag">' + rosterItem + '</i>'); //显示消息条数
		$(".friend_message ul.hy_request").html(str);
	}



	//拒绝请求
	$(document).on("click", ".friend_m_accept .refuse", function() {
		var friendname = $(this).parents("li").attr("data-name");
		var _this = $(this).parents("li");
		Gab.RefuseRequest(friendname, _this);
	})



})