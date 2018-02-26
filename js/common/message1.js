/*
 * @Author: Shirley Zhao
 * @Date:   2017-10-18 15:13:13
 * @Last Modified by:   Shirley Zhao
 * @Last Modified time: 2018-01-02 13:18:26
 */
/*var chat_status = []; //全局变量存储聊天框的状态
var get_chat_box = store('chat_status') || [];
console.log(get_chat_box);*/
//发送消息
function sendChatMsg() {
	var msgs = html2Escape($('#textBox').val());
	var _this = $('#textBox').parents(".qzchat_frame");
	var type = _this.attr('data-type');
	var kefu_name = _this.attr('data-oldname');
	if (!$.trim(msgs)) {
		$('#textBox').val('');
		return;
	}
	if (kefu_name.indexOf('kefu') > -1) {
		sendMessage(msgs, "chat", 0, '', '', 11);
		return;
	}
	if (type == 'groupchat') {
		sendMessage(msgs, "groupchat", 0, '', '', 2);
	} else if (type == 'group') {
		sendMessage(msgs, "groupchat", 0, '', '', 3);
	} else {
		sendMessage(msgs, "chat", 0);
	}
};

//键盘事件   阻止enter键默认换行事件函数			//	Ctrl+enter
$('html,body').on('keydown', function (e) {
	if (!e.ctrlKey && e.keyCode == 13) {
		return false;//这句话阻止原有的回车换行事件的冒泡执行 
	}
})
$('html,body').on('keyup', function (e) {
	var e = e || event;
	var msgs = html2Escape($('#textBox').val()) || "";
	if (e.target.id == "textBox") {
		if (e.keyCode == 13 && e.ctrlKey) {
			msgs += String.fromCharCode(13);
			$('#textBox').val(msgs);
			return;
		}
		if (e.keyCode == 13) {
			if (msgs) sendChatMsg()
			return false;
		}
	}
})


//判断是否已经存在内存中
function isShowChatBox(name) {
	var get_chat_box = store('chat_status') || [];
	//console.log(store('chat_status'))
	for (var i in get_chat_box) {
		var sname = get_chat_box[i].name;
		if (sname == name) {
			return false;
		}
	}
	return true;
}



/*好友 聊天框*/
$(document).on('click', '.addressContent .friends .Chat_list,.SearchResults .Chat_list', function (ev) {
	var ev = ev || event,
		$this = $(this),
		t = $this.attr('data-type'),
		imgSrc = $this.find('img').attr('src'),
		type = $this.find('.nickname').text(),
		_oldname = $this.attr('data-oldname'),
		_myindustry = $this.attr('data-myindustry'),
		magicno = $(this).attr('data-magicno'),
		strangename = '';
	if (getURIArgs('strangename')) {
		strangename = getURIArgs('strangename');
	}
	$('#image').removeAttr('disabled'); //将文件可点击
	if (isShowChatBox(_oldname)) { //判斷是否在内存中 true为没有在内存里面
		createChatWindow(_oldname, _myindustry, type, imgSrc, 1, t);
		var recent = '<li class="Chat_list" data-off="0" data-magicno="' + magicno + '" data-myindustry="">' +
			'<dl><dt><img class="img" src="' + imgSrc + '"></dt><dd class="nickname">' + type + '</dd></dl><div class="recmdCircle"></div></li>'
		//陌生人主页的最近联系人通讯录
		//$('.recentChat>ul').prepend(recent);
		var c_obj = storeChatStatus(_oldname, type, imgSrc, _myindustry, t);
		changeChatBoxStatus(c_obj);
	} else {
		createCommon(_oldname, _myindustry, type, imgSrc, 1, t);
	}
	var qzLength = $(".qzchat_frame").length;
	storeFocusChatBox(_oldname);
	Gab.make_top_zero(_oldname);
	qzchatSite(qzLength);
	Gab.getMessageCount();
})


//聊天室
$(document).on('click', '.group ul .Chat_list', function (ev) {
	var $this = $(this),
		t = $this.attr('data-type'),
		imgSrc = $this.find('img').attr('src'),
		naturalName = $this.find('.naturalName').text(),
		roomName = $this.attr('data-name'),
		roomoldname = $this.attr('data-oldname'),
		num = $this.attr('data-num'),
		actNum = Math.ceil(num / 2),
		txt = num + '人加入' + ' | ' + actNum + '人活跃',
		id = $this.attr('data-roomid');
	$('#image').removeAttr('disabled'); //将文件可点击
	if (isShowChatBox(roomoldname)) { //判斷是否在内存中
		createChatWindow(roomoldname, txt, naturalName, imgSrc, 1, t);
		var c_obj = storeChatStatus(roomoldname, naturalName, imgSrc, txt, t, id);
		changeChatBoxStatus(c_obj);
	} else {
		createCommon(roomoldname, txt, naturalName, imgSrc, 1, t);
	}
	storeFocusChatBox(roomoldname);
	Gab.make_top_zero(roomoldname);
	Gab.getMessageCount();
	ev.stopPropagation();
})



//群聊
$(document).on('click', '.Groupchat ul .Chat_list', function (ev) {
	$('#image').removeAttr('disabled'); //将文件可点击
	var $this = $(this),
		t = $this.attr('data-type'),
		imgSrc = $this.find('dt').html(),
		imgNum = $this.find('img').length, //处理多个头像
		naturalName = $this.attr('data-naturename'),
		roomoldname = $this.attr('data-oldname'),
		num = $this.attr('data-num'),
		id = $this.attr('data-roomid'),
		txt = num + '人加入';
	if (isShowChatBox(roomoldname)) { //判斷是否在内存中
		createChatWindow(roomoldname, txt, naturalName, imgSrc, 1, t);
		var c_obj = storeChatStatus(roomoldname, naturalName, imgSrc, txt, t, id);
		changeChatBoxStatus(c_obj);
	} else {
		createCommon(roomoldname, txt, naturalName, imgSrc, 1, t);
	}
	storeFocusChatBox(roomoldname);
	Gab.make_top_zero(roomoldname);
	Gab.getMessageCount();
	ev.stopPropagation();
})

//创建聊天框的公共部分代码
function createCommon(_oldname, _myindustry, type, imgSrc, isOpen, chatType) {
	if (isInChatBox(_oldname)) { //表示没有在聊天框里面  在左侧里面
		createChatWindow(_oldname, _myindustry, type, imgSrc, isOpen, chatType);
		$('.dialogs_in ul li').each(function () {
			var n = $(this).attr('data-oldname');
			if (n == _oldname) {
				$(this).remove();
				moveStorePosition(_oldname);
			}
		})
	} else {
		$('.qzchat_frame').each(function () {
			var $this = $(this);
			var name = $this.attr('data-oldname');
			if (name == _oldname) {
				if ($this.find('.qz_chatBox').css('display') == 'none') {
					$this.find('.qz_chatBox').css('display', 'block');
					$this.find('.minimize').hide();
				}
				changeIsOpen(_oldname, 1);
				$(".textBox,.allFace").removeAttr("id");
				$this.find(".textBox").focus().attr("id", "textBox");
				$(".titlebar").removeClass("titlebar_color");
				$this.find(".titlebar").addClass("titlebar_color");
			}
		})
	}
}

//顶部消息框点击时将消息清为零
$(document).on('click', '.top_msglist', function () {
	var _this = $(this),
		t = _this.attr('data-type'),
		nikename = _this.find('.topMsg_nikename').text(),
		_name = _this.attr('data-oldname'),
		_myindustry = _this.attr('data-myindustry'),
		type = _this.find('.topMsg_nikename').text(),
		imgSrc = '';
	if (t == 'group') {
		imgSrc = _this.find('dt').html().split('<i class="topMsg_count"')[0];
	} else {
		imgSrc = _this.find('img').attr('src');
	}
	if (_name == robotName) { //如果是和机器人聊天的话设置为不可点击
		$('#image').attr('disabled', 'disabled');       //上传图片按钮
	} else {
		$('#image').removeAttr('disabled'); //否则设置为不可点击
	}
	_this.find('.Message_state').css('background', 'url("/img/07_2yidu.png") no-repeat center');
	_this.find('.topMsg_count').text(0).hide();
	if (isShowChatBox(_name)) { //判斷是否在内存中
		createChatWindow(_name, _myindustry, type, imgSrc, 1, t);
		var c_obj = storeChatStatus(_name, type, imgSrc, _myindustry, t);
		changeChatBoxStatus(c_obj);
	} else {
		createCommon(_name, _myindustry, type, imgSrc, 1, t);
	}
	storeFocusChatBox(_name);
	Gab.getMessageCount();
})

//存储聊天框正在聊的那个人的名字
function storeFocusChatBox(name) {
	var f = store('chat_focus');
	if (f) store.remove('chat_focus');
	store.set('chat_focus', name);
	// 选中一个聊天框并关闭其他聊天框时不做处理
	// 从通讯录打开 会选中最后打开的这个新的聊天框
	if (!$(".qz_chatBox").children().hasClass("titlebar_color")) $(".qzchat_frame:last").click();
}

//改变存储位置
function moveStorePosition(names) {
	var s = store('chat_status');
	for (var i in s) {
		var name = s[i].name;
		if (names == name) {
			var obj = s[i];
			s.splice(i, 1);
			s.push(obj);
			if (s) store.remove('chat_status');
			store.set('chat_status', s);
		}

	}
}

//改变聊天盒子的状态
function changeChatBoxStatus(obj) {
	var get_chat_box = store('chat_status') || [];
	get_chat_box.push(obj);
	if (store('chat_status')) {
		store.remove('chat_status');
	}
	store.set('chat_status', get_chat_box);
}



//判断是否已经显示的聊天框
function isInChatBox(name) {
	var a = true;
	$('.qzchat_frame').each(function () {
		var _oldname = $(this).attr('data-oldname');
		if (name == _oldname) {
			a = false;
		}
	})
	return a;
}

//存储聊天状态信息
function storeChatStatus(name, nickname, src, industry, type, id) { //type为聊天类型
	var obj = {};
	obj.name = name;
	obj.is_open = 1;
	obj.nick = nickname;
	obj.src = src;
	obj.industry = industry;
	obj.type = type;
	obj.id = id;
	return obj;
}



//创建新的聊天框
//change ： 浏览器窗口大小变化时聊天框出现顺序 prepend()
function createChatWindow(_oldname, _myindustry, type, imgSrc, isOpen, chatType, change) {
	var qzLength = $(".qzchat_frame").length;
	$(".textBox,.allFace").removeAttr("id");
	var a = isOpen ? '' : 'style="display:block;"';
	var b = isOpen ? '' : 'style="display:none;"';
	var top = a ? '-33px' : "-336px";
	var str = '<div class="qzchat_frame" style="top:' + top + ';" data-type="' + chatType + '" data-oldname="' + _oldname + '" data-myindustry="' + _myindustry + '" data-naturename=' + type + '>' +
		'<div class="minimize"' + a + '><a href="javascript:;" title=' + type + '>与' + type + '聊天</a><i></i></div>' +
		'<div class="qz_chatBox"' + b + '><div class="titlebar"><div class="titlebarWrapper"><a href="javascript:;">与' + type + '聊天</a></div>' +
		'<ul class="options"><li><a class="qzMinimize" title="窗口最小化" href="javascript:;"></a></li>';
	if (chatType != 'chat') { //群
		str += '<li><a class="qzMember" href="javascript:;"></a></li><li><a class="qzSet" href="javascript:;"></a></li>';
	}
	str += '<li><a class="closeChat" href="javascript:;"></a></li></ul></div><div class="qzMsgContent">' +
		'<div class="UserInformation"><dl>';
	if (chatType == 'group') {
		str += '<dt class="groupInformation">' + imgSrc;
	} else {
		str += '<dt><img class="df_img" src="' + imgSrc + '">';
	}
	str += '</dt>' +
		'<dd class="qz_dfuser">' + type + '</dd>' +
		'<dd class="occupation">' + _myindustry + '</dd>' +
		'</dl></div><div class="qzcht_msg">' +
		'</div></div><div class="qzChtFooter"><div class="msg_box">' +
		'<textarea class="textBox" placeholder="按Enter发送消息"></textarea>' +
		'</div><div class="sendTop"><i class="faceBtns"></i>' +
		'<div class="allFace"></div><span class="imgBtn">' +
		'<input type="file" name="file" class="image" multiple="multiple">' +
		'</span></div></div></div></div>';

	// change ：聊天框出现位置 
	if (change) {
		$(".chatFrameList").prepend(str);
	} else {
		$(".titlebar").removeClass("titlebar_color");
		$(".chatFrameList").append(str);
	}
	var qz_l = $(".qzchat_frame");
	var lt_s = parseInt(($(window).width() - 350) / 278); //根据屏幕尺寸显示聊天框
	var msg_history = getChatHistory(_oldname);
	if (change) {
		qz_l.first().find('.qzcht_msg').empty().append(msg_history);
		Gab.getBottom(qz_l.first());
	} else {
		qz_l.last().find('.qzcht_msg').empty().append(msg_history);
		Gab.getBottom(qz_l.last());
	}
	if (chatType == 'group') {
		if (change) {          //判断是从前面添加聊天框还是从后面添加的
			var n = qz_l.first().find('.UserInformation').find('img').length;
			qz_l.first().find('dt').addClass('img_list_' + n);
		} else {
			var n = qz_l.last().find('.UserInformation').find('img').length;
			qz_l.last().find('dt').addClass('img_list_' + n);
		}
	}
	if (_oldname == '1001001@imsvrdell1') {
		qz_l.last().find('.image').attr('disabled', 'disabled');
		qz_l.last().find('.imgBtn').addClass("imgBtnRobot");
		qz_l.last().attr("data-type", "");
	}


	lt_s = lt_s > 4 ? 4 : lt_s;
	if (qz_l.length > lt_s) {
		var nikename = qz_l.eq(0).find('.qz_dfuser').text(),
			n_name = qz_l.eq(0).attr('data-oldname'),
			_industry = qz_l.eq(0).attr('data-myindustry'),
			_src = qz_l.eq(0).find('.df_img').attr('src'),
			_t = qz_l.eq(0).attr('data-type'),
			left_str = '<li class="hide_dialog_l" data-type="' + _t + '" data-mysrc="' + _src + '" data-oldname="' + n_name + '" data-myindustry="' + _industry + '"><span>' + nikename + '</span><a class="closeDialog" href="javascript:;"></a></li>';
		qz_l.eq(0).remove();
		$('.dialogs_in ul').append(left_str);
		$('.dialogs').show();
	}
	qzchatSite()
}

//加载正在聊天的那个人的页面
function getFocusBox() {
	$(".titlebar").removeClass("titlebar_color");
	var focusName = store('chat_focus');
	$('.qzchat_frame').each(function () {
		var _this = $(this);
		var c = _this.attr('data-oldname');
		if (c == focusName) {
			_this.find(".titlebar").addClass("titlebar_color");
			$(".textBox,.allFace").removeAttr("id");
			_this.find(".textBox").focus().attr("id", "textBox");
			_this.find(".allFace").attr("id", "allFace");
			_this.find('.image').attr('id', 'image');
		}
	})
}


//聊天框展示
function qzchatSite(num) {
	var qzLength = $(".qzchat_frame").length;
	var qzChat0 = $(".qzchat_frame").eq(0),
		qzChat1 = $(".qzchat_frame").eq(1),
		qzChat2 = $(".qzchat_frame").eq(2),
		qzChat3 = $(".qzchat_frame").eq(3);
	if (qzChat0.css('top') == "-336px" || qzChat0.css('top') == "-33px") qzChat0.css({ "left": -278 * (qzLength + 1 - 1) + "px" });
	if (qzChat1.css('top') == "-336px" || qzChat1.css('top') == "-33px") qzChat1.css({ "left": -278 * (qzLength + 1 - 2) + "px" });
	if (qzChat2.css('top') == "-336px" || qzChat2.css('top') == "-33px") qzChat2.css({ "left": -278 * (qzLength + 1 - 3) + "px" });
	if (qzChat3.css('top') == "-336px" || qzChat3.css('top') == "-33px") qzChat3.css({ "left": -278 * (qzLength + 1 - 4) + "px" });
	qzChat0.attr("position-tag", -278 * (qzLength + 1 - 1) + "px");
	qzChat1.attr("position-tag", -278 * (qzLength + 1 - 2) + "px");
	qzChat2.attr("position-tag", -278 * (qzLength + 1 - 3) + "px");
	qzChat3.attr("position-tag", -278 * (qzLength + 1 - 4) + "px");

	//隐藏聊天列表显示位置
	var diaLeft = Number(qzLength * -278) - 50;
	$(".dialogs").css("left", diaLeft + "px");
}
