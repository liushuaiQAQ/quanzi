//通讯录打开
$(document).on("click", ".toolbar .trigger", function() {
	var _index = $(this).index() - 1;
	$(".Group_list").find("ul").hide();
	$(".Group_list").find(".triangle").removeClass("perform");
	if ($(this).hasClass("toolbar-tabs-color")) {
		$(this).parents(".toolbar").removeClass("toolbar-qz");
		$(this).removeClass("toolbar-tabs-color");
	} else {
		$(".trigger").removeClass("toolbar-tabs-color");
		$(this).parents(".toolbar").addClass("toolbar-qz");
		$(this).addClass("toolbar-tabs-color");
		$(".Group_list").eq(_index).find("ul").show();
		$(".Group_list").eq(_index).find(".triangle").addClass("perform");
	}
	WindowAdjustment();
})

//通讯录适应屏幕高度
$(window).ready(function() {
	$(".AddressBook").css("height", $(window).height() - 130);
	$(".ChatContent").css("height", $(window).height() - 189);
	$(".AddressBook .CommunicationsGroup,.AddressBook .addressContent .SearchResults").css("height", $(window).height() - 130);
//	陌生人主页推荐好友通讯录
	$(".rightRecommondFriends").css("height", $(window).height() - 130);
	$(".rightRecommondFriends .SearchResults").css("height", $(window).height() - 130);
	$(".rightRecommondFriends .recmdList").css("height", $(window).height() - 206);
})

$(document).on("click", ".toolbar,.chatWrap", function(ev) {
	ev.stopPropagation();
})

//推送消息
$(document).on("click", ".trigger_ts", function(ev) {
	setCookie("pushMsg", true);
	$(".messageCount,.top_count").remove();
	$(this).parents(".toolbar").toggleClass("pushContent_qz");
	$(this).toggleClass("toolbar-tabs-color");
	ev.stopPropagation();
})

$(document).on("click", ".operation_wdl .RequestList", function(ev) {
	setCookie("pushMsg", true);
	$(".toolbar").addClass("pushContent_qz");
	$(".trigger_ts").addClass("toolbar-tabs-color");
	$(".messageCount,.top_count").remove();
	ev.stopPropagation();
})

//关闭未登录推送消息
$(document).on("click", ".choseDel", function() {
	$(".toolbar").removeClass("pushContent_qz");
	$(".trigger_ts").removeClass("toolbar-tabs-color");
})


// 关闭通讯录
$(document).on("click", function(ev) {
	$(".toolbar").removeClass("toolbar-qz");
	$(".trigger_ts,.trigger").removeClass("toolbar-tabs-color");
	ev.stopPropagation();
})


//通讯录窗口调整
function WindowAdjustment() {
	$(".AddressBook").css("height", $(window).height() - 130);
	$(".AddressBook .CommunicationsGroup,.AddressBook .addressContent .SearchResults").css("height", $(window).height() - 130);
	$(".ChatContent").css("height", $(window).height() - 189);
}

//浏览器窗口变化
$(window).resize(function() {
	WindowAdjustment();
	if (getCookie('username')) {
		var qz_l = $(".qzchat_frame");
		// 浏览器宽度能展示几个聊天框    最多4个，最少一个
		var lt_s = parseInt(($(window).width() - 350) / 278);
		lt_s = lt_s > 4 ? 4 : lt_s;
		lt_s = lt_s < 1 ? 1 : lt_s;
		if (qz_l && qz_l.length > lt_s) {
			var nikename = qz_l.eq(0).find('.qz_dfuser').text();
			var n_name = qz_l.eq(0).attr('data-oldname');
			var _industry = qz_l.eq(0).attr('data-myindustry');
			var _src = qz_l.eq(0).find('.df_img').attr('src');
			var type = qz_l.eq(0).attr('data-type');
			var left_str = '<li data-mysrc="' + _src + '" data-type="'+type+'" data-oldname="' + n_name + '" data-myindustry="' + _industry + '"><span>' + nikename + '</span><a class="closeDialog" href="javascript:;"></a></li>'
			qz_l.eq(0).remove();
			$('.dialogs').show();
			$('.dialogs_in ul').append(left_str);
			if(!$(".qz_chatBox").children().hasClass("titlebar_color")) $(".qzchat_frame:first").click();   
			qzchatSite()
		} else if ($('.dialogs_in ul').html() != "" && qz_l.length < lt_s) {
			for(var i = 0;i < lt_s - qz_l.length;i++){
				var item_in = $('.dialogs_in ul li').last();
				var _oldname = item_in.attr("data-oldname");
				var _myindustry = item_in.attr("data-myindustry");
				var type = item_in.find("span").text();
				var imgSrc = item_in.attr("data-mysrc");
				var t = item_in.attr("data-type");
				createChatWindow(_oldname, _myindustry, type, imgSrc, 1, t,1);
				item_in.remove();
			}
			if ($('.dialogs_in ul').html() == "") $('.dialogs').hide();
		}
	}
})

//通讯组列表展开
$(document).on("click", ".Group_list .theme", function() {
	$(this).parents(".Group_list").find("ul").toggle();
	$(this).parents(".Group_list").find(".triangle").toggleClass("perform");
})



//通讯录好友搜索
$(document).on("click", ".CommunicationsSearch .searchOn", function() {
	$(".AddressBook .SearchResults ul").empty();
	$(".AddressBook .CommunicationsSearch .Search_box i").remove();
	var txt = html2Escape($(".AddressBook .CommunicationsSearch .Search_box input").val());
	FriendsSearchResults(txt)
})

// 回车搜索
$(document).on("click", "#Communications", function() {
	var act = $(document.activeElement).attr("id")
	if (act == "Communications") {
		$("#Communications").on("keyup", function(e) {
			var code = (e ? e.keyCode : e.which);
			if (code == 13) {
				$(".CommunicationsSearch .searchOn").click();
				return false;
			};
		});
	}
});



// 搜索结果
function FriendsSearchResults(v) {
	$(".AddressBook .CommunicationsGroup").hide();
	$(".AddressBook .SearchResults").show(500);
	$(".AddressBook .CommunicationsSearch .Search_box").append('<i></i>'); //显示关闭搜索
	var _list = $(".AddressBook .CommunicationsGroup .friends .Chat_list");
	for (var i = 1; i < _list.length; i++) {
		if (_list.eq(i).attr("data-magicno").indexOf(v) >= 0 || _list.eq(i).find("dl").text().indexOf(v) >= 0) {
			var tpl = _list.eq(i).clone();
			$(".AddressBook .SearchResults ul").append(tpl);
			$(".AddressBook .SearchResults ul .time").remove();

		}

	}
	if ($(".AddressBook .SearchResults ul li").length == 0) {
		$(".AddressBook .SearchResults ul").html('<li class="Chat_list">找不到结果</li>');
	}
}


//退出通讯录搜索

$(document).on("click", ".AddressBook .CommunicationsSearch .Search_box i", function() {
	$(".AddressBook .SearchResults").hide();
	$(".AddressBook .CommunicationsGroup").show();
	$(".AddressBook .CommunicationsSearch .Search_box input").val("");
	$(this).remove();
})


//聊天界面



//关闭聊天窗口
$(document).on("click", ".closeChat", function(e) {
	var _this = $(this);
	var names = _this.parents('.qzchat_frame').attr('data-oldname');
	_this.parents(".qzchat_frame").fadeOut(300, function() {
		_this.parents(".qzchat_frame").remove();
		changeStore(names);
	});
	e.stopPropagation();
})

//关闭的时候改变存储状态
function changeStore(names) {
	var s = store('chat_status');
	// 浏览器能展示聊天框的数量
	var lt_s = parseInt(($(window).width() - 350) / 278);
		lt_s = lt_s > 4 ? 4 : lt_s;
	if (s.length > lt_s) {
		createChatWindow(s[0].name, s[0].industry, s[0].nick, s[0].src, 1, s[0].type,1); 
		for (var i in s) {
			var name = s[i].name;
			if (names == name) {
				var obj = s[0];
				s.splice(i, 1);
				s.splice(0, 1);
				s.splice(s.length-lt_s+1,0,obj);    // 隐藏聊天框根据屏幕能展示的个数插在展示聊天框第一位
				if (s) store.remove('chat_status');
				store.set('chat_status', s);
			}
		}
		var die = $('.dialogs_in ul li');
		die.eq(0).remove();
		if ($('.dialogs_in ul li').length == 0) $('.dialogs').hide();
	} else {
		for (var i in s) {
			var name = s[i].name;
			if (names == name) {
				s.splice(i, 1);
				if (s) store.remove('chat_status');
				store.set('chat_status', s);
			}
		}
	}
}

//关闭隐藏聊天列表
$(document).on("click", ".closeDialog", function(e) {
	var names = $(this).parents('li').attr('data-oldname');
	$(this).parents("li").remove();
	removeStore(names);
	if ($('.dialogs_in ul li').length == 0) $('.dialogs').hide();
	e.stopPropagation();
})

//移除掉当前删除的存储位置
function removeStore(names) {
	var s = store('chat_status');
	for (var i in s) {
		var name = s[i].name;
		if (names == name) {
			s.splice(i, 1);
			if (s) store.remove('chat_status');
			store.set('chat_status', s);
		}
	}
}


//窗口最小化
$(document).on("click", ".qzMinimize", function() {
	var $qz = $(this).parents(".qzchat_frame");
	var sname = $qz.attr('data-oldname');
	var _index = $(this).parents(".qzchat_frame").index();
	changeIsOpen(sname, 0)
	$(this).parents(".qz_chatBox").hide();
	$qz.find(".minimize").show();
	$qz.attr('data-off', 0);
	var _left = $qz.attr("position-tag");
	$qz.css({"top":"-33px","left":_left})
})

//窗口最大化
$(document).on("click", ".minimize", function() {
	var sname = $(this).parents('.qzchat_frame').attr('data-oldname');
	$(this).find('i').removeClass('qz_inform');
	changeIsOpen(sname, 1);
	$(this).hide().parents(".qzchat_frame").find(".qz_chatBox").show();
	$(this).parents(".qzchat_frame").css("top","-336px");
	params.top = "-336px";
	Gab.getBottom($(this).parents('.qzchat_frame'));
})

//左侧消息框
$(document).on('click', '.dialogs_in ul li', function() {
	var name = $(this).attr('data-oldname');
	var chat_type = $(this).attr('data-type');
	var info = getPersonInfo(name);
	$(this).remove();
	$(".titlebar").removeClass("titlebar_color");
	createChatWindow(info.name, info.industry, info.nick, info.src, 1, chat_type);
	$(".qzchat_frame:last").click();
	changeIsOpen(name, 1);
	changeFrame(name);
	storeFocusChatBox(name);
})

//得到个人信息
function getPersonInfo(sname) {
	var s = store('chat_status');
	for (var i in s) {
		var name = s[i].name;
		if (sname == name) {
			return s[i];
		}
	}
}


//左侧点击的时候改变存储状态
function changeFrame(sname) {
	var s = store('chat_status');
	for (var i in s) {
		var name = s[i].name;
		if (sname == name) {
			var obj = s[i];
			s.splice(i, 1);
			s.push(obj);
			if (s) store.remove('chat_status');
			store.set('chat_status', s);
		}
	}
}



//改变是否打开窗口的状态
function changeIsOpen(sname, status) {
	var s = store('chat_status');
	for (var i in s) {
		var name = s[i].name;
		if (sname == name) {
			s[i].is_open = status;
			if (s) store.remove('chat_status');
			store.set('chat_status', s);
		}
	}
}

//得到聊天框的打开状态
function getIsOpenStatus(sname) {
	var s = store('chat_status');
	for (var i in s) {
		var name = s[i].name;
		if (sname == name) {
			return s[i].is_open;
		}
	}
}


//选中聊天窗口
$(document).on("click", ".qzchat_frame", function() {
	var _this = $(this);
	var name = _this.attr('data-oldname');
	$(".titlebar").removeClass("titlebar_color");
	_this.find(".titlebar").addClass("titlebar_color");
	$(".textBox,.allFace").removeAttr("id");
	_this.find(".textBox").focus().attr("id", "textBox");
	_this.find(".allFace").attr("id", "allFace");
	$('.qzchat_frame .image').removeAttr('id');
	_this.find('.image').attr('id', 'image');
	storeFocusChatBox(name);
	$('.qzchat_frame').attr('data-off', 0);
	$('.memberList,.exit_btn').remove();
	//改变聊天窗口z-index
	$('.qzchat_frame').css({"zIndex":"0"});
	_this.css({"zIndex":"1"});
})

// mousedown
$(document).on("mouseenter ", ".qzchat_frame", function() {
	var _this = $(this);
	if(dragNum){
		var _index = $(this).index();
		if(_index < 0) _index = 0;
		var oBar = document.getElementsByClassName("qzchat_frame")[_index];
		var oBar1 = document.getElementsByClassName("titlebar")[_index];
		params.left = getCss(oBar, "left");
		params.top = getCss(oBar, "top");
		startDrag(oBar1, oBar,_this);
	}
  	
})


//表情
$("i.faceBtns").live("click", function(e) {
	var divid = $(this).parents(".qzchat_frame").find(".allFace");
	smohanfacebox($(this), divid, "textBox");
});

// 置顶backtop
$(document).on("click", ".toolbar_backtop", function() {
	var speed = 800; //滑动的速度
	$('body,html').animate({scrollTop: 0}, speed);
	return false;
});


