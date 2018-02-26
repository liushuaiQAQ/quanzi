/*
 *2.6.15 获取我加入的群组 mucgroup/my
 * grouptype	群组类型	1群 2讨论组 如果该参数不设置或为空，也为群；
 */
var flags=true;

function usersroster() {
	$.ajax({
		type: "get",
		url: RestfulHOST() + '/users/roster?username=' + username,
		dataType: "json",
		headers: {
			"Authorization": "AQAa5HjfUNgCr27x",
			"Accept": "application/json"
		},
		success: function(msg) {
			// console.log(msg)
			$(".AddressBook .friends ul .Chat_list").remove();
			if (msg.status == 0) {
				var number = 0;
				var s = "";
				var str = "";
				for (var i = 0; i < msg.rosterItem.length; i++) {
					var mssg = msg.rosterItem[i];
					if (mssg.subscriptionType != 0 && mssg.subscriptionType != 4) {
						var oldname = mssg.username,
							dName = mssg.username.split('@')[0],
							myindustry = mssg.myindustry,
							nikename = '';
						friendArr.push(dName);
						number = number + 1;
						str = '<li class="Chat_list" data-type="chat" data-off="0" data-magicno="' + mssg.magicno + '" data-oldname="' + oldname + '" data-myindustry="';
						s += '<li class="Chat_list" data-type="chat" data-off="0" data-magicno="' + mssg.magicno + '" data-oldname="' + oldname + '" data-myindustry="';
						if (myindustry == null) {
							myindustry = '';
						}
						str += myindustry + '">' + '<dl>';
						s += myindustry + '">' + '<dl>';
						if (mssg.avatarfile == "") {
							str += '<dt><img class="img" src="/img/first.png"></dt>';
							s += '<dt><img class="img" src="/img/first.png"></dt>';
						} else {
							str += '<dt><img class="img" src="' + ImgHOST() + mssg.avatarfile + '"></dt>';
							s += '<dt><img class="img" src="' + ImgHOST() + mssg.avatarfile + '"></dt>';
						}

						
						if (mssg.markname != undefined && mssg.markname != '' && mssg.markname != 'null' && mssg.markname != null) {
							dName = dName.split("@")[0];
							if (mssg.markname == dName) {
								str += '<dd class="nickname">' + (mssg.nickname || shieldNumber(dName)) + '</dd>';
								s += '<dd class="nickname">' + (mssg.nickname || shieldNumber(dName)) + '</dd>';
							} else {
								str += '<dd class="nickname">' + mssg.markname + '</dd>';
								s += '<dd class="nickname">' + mssg.markname + '</dd>';
							}
						} else {
							str += '<dd class="nickname">' + (mssg.nickname || shieldNumber(dName)) + '</dd>';
							s += '<dd class="nickname">' + (mssg.nickname || shieldNumber(dName)) + '</dd>';
						}
					
						s += '</dl></li>';
						str += '</dl>' +
							'<div class="time">' + formatTime(mssg.lastlogintime).substring(0, 10) + '</div>' +
							'</li>';

						$(".AddressBook .friends ul").append(str);
					}
					$(".CommunicationsGroup .friends .theme span").html(number)
				}
				$(".recmdList .CommunicationsGroup .friends ul").html(s);
			}
		},
		error: function() {
			console.log("error")
		}

	});
}

function MucgroupMy(type) {
	$.ajax({
		type: "get",
		url: RestfulHOST() + '/mucgroup/my',
		dataType: "json",
		headers: {
			"Authorization": "AQAa5HjfUNgCr27x",
			"Accept": "application/json"
		},
		data: {
			username: username,
			grouptype: type,
			cursor: 0
		},
		success: function(msg) {
			if (msg.status == 0) {
				if (type == 1) {
					ForIGoinTheGroup(msg); //获取我加入的群组
				} else {
					GetMeToJoinDiscussionGroup(msg); //取我加入的讨论组
				}
			}
		},
		error: function() {
			console.log("error")
		}

	});
}



/*获取我加入的群组 mucgroup/my       聊天室
 */
function ForIGoinTheGroup(msg) {  
	var str = "";
	groupArr = [];
	for (var i = 0; i < msg.chatRoom.length; i++) {
		var groupObj = {};
		var mssg = msg.chatRoom[i];
		var avatar = '';
		var membercnt = mssg.membercnt; //成员的拼接
		var dealMember = mssg.members;
		dealMember.push(mssg.owners[0]);
		if (mssg.avatarlist == "" || mssg.avatarlist == undefined || mssg.avatarlist == null) {
			avatar = '/img/first.png';
		} else {
			avatar = ImgHOST() + mssg.avatarlist[0];
		}
		str += '<li class="Chat_list" data-roomid="' + mssg.roomid + '" data-type="groupchat" data-num="' + membercnt + '" data-name="' + mssg.roomName + '" data-oldname="' + mssg.roomName + '@conference.imsvrdell1" data-naturename="' + mssg.naturalName + '" data-off="0">' +
			'<dl><dt><img class="img" src="' + avatar + '"></dt>' + '<dd class="naturalName">' + mssg.naturalName + '</dd>' +
			'</dl></li>';
		groupObj.name = mssg.roomName;
		groupObj.src = avatar;
		groupObj.nname = mssg.naturalName;
		groupObj.members = dealMember;
		groupObj.owners = mssg.owners[0];
		groupArr.push(groupObj);
	}
	$(".CommunicationsGroup .group .theme span").html(msg.chatRoom.length)
	if (store('groupmsg')) {         //防止刷新后重复存储 
		store.remove('groupmsg');
	}
	store.set('groupmsg', groupArr);
	// console.log(groupArr)
	$(".AddressBook .CommunicationsGroup .group ul").html(str);
}

/*
 * 获取我加入的讨论组      群聊
 */
function GetMeToJoinDiscussionGroup(msg) {
	var str = "";
	var srcArr = []; //群聊所需的图片存储
	if (msg.chatRoom == "") {
		return false;
	}
	for (var i = 0; i < msg.chatRoom.length; i++) {
		var mssg = msg.chatRoom[i];
		var members = mssg.members.length + 1; //成员数加1才是总人数
		var groupChat = {};
		var ownersSrc = ImgHOST() + mssg.owners[0].avatarfile;
		var dealMember = mssg.members;
		dealMember.push(mssg.owners[0]);
		if (members >= 9) {
			members = 9;
		}
		srcArr.push(ownersSrc); //将拥有者的头像也存储起来
		str += '<li class="Chat_list" data-roomid="' + mssg.roomid + '" data-off="0" data-type="group" data-num="' + members + '" data-name="' + mssg.roomName + '" data-oldname="' + mssg.roomName + '@conference.imsvrdell1" data-naturename="' + mssg.naturalName + '">' +
			'<dl><dt class="img_list_' + members + '">' +
			'<img src="' + ownersSrc + '">'; //先加上拥有者的头像
		for (var j = 0; j < mssg.members.length; j++) {
			var avatar = '';
			if (mssg.members[j].avatarfile == "" || mssg.members[j].avatarfile == null || mssg.members[j].avatarfile == 'null') {
				avatar = '/img/first.png';
			} else {
				avatar = ImgHOST() + mssg.members[j].avatarfile;
			}
			if (j < 8 && j < mssg.members.length - 1) {
				str += '<img src="' + avatar + '">';
			}
			srcArr.push(avatar);
		}
		str += '</dt><dd class="naturalName">' + mssg.naturalName + '</dd>' +
			'</dl>' + '</li>';
		groupChat.name = mssg.roomName;
		groupChat.src = srcArr;
		groupChat.nname = mssg.naturalName;
		groupChat.members = dealMember;
		groupChat.owners = mssg.owners[0];
		groupChatArr.push(groupChat);
	}
	$(".CommunicationsGroup .Groupchat .theme span").html(msg.chatRoom.length)
	$(".AddressBook .CommunicationsGroup .Groupchat ul").html(str);
	if (store('groupchatmsg')) {
		store.remove('groupchatmsg');
	}
	// console.log(groupChatArr)
	store.set('groupchatmsg', groupChatArr);

}

function memberHidden() {
	$('.right').show();
	$('.chatMain').css('background', '#fff');
	$('.member').hide();
}


$(document).on('focus', '#textBox', function(ev) {
	var ev = ev || event;
	$('.member').hide();
	return false;
	ev.stopPropagation();
})

//得到聊天框的位置
function getChatBoxPosition() {
	var t = ($(window).height() - 590) / 2;
	var l = ($(window).width() - 800) / 2;
	if ($('.chatWrap').attr('data-off') == 0) {
		$('.chatWrap').show().css({
			'left': l,
			'top': t
		}).attr('data-off', 1);
	} else {
		$('.chatWrap').show();
	}
}

function isAppendLeftContent(name) {
	var handle = false;
	$('.groupWrap').find('.msgs_list').each(function() {
		var leftName = $(this).attr('data-oldname');
		if (name == leftName) {
			handle = true;
		}
	})
	return handle;
}

// 发送群组消息
function sendMucMsg(msg, mySrc, roomname) {
	if (msg.indexOf('http') > -1) {
		myStr = '<div class="qz_xx qz_xx02 clear">'+
							'<div class="lt_xx"><img class="msg-img" src="' + msg + '">'+
							'</div></div>';
	} else {
		if (msg.indexOf('\n') > -1) {
			msg = msg.replace(/\n/g, '<br>');
		}
		myStr = '<div class="qz_xx qz_xx02 clear">'+
				'<div class="lt_xx"><span class="txt">' + toFaceImg(msg) + '</span>'+
				'</div></div>';
	}
	var $textBox = $('#textBox').parents('.qzchat_frame');
	$textBox.find('.qzcht_msg').append(myStr);
	Gab.getBottom($textBox);
	//存储点击发送的内容
	storeSendData(roomname, msg);
	var len = $('.msgs_list').length;
	for (var j = 0; j < len; j++) {
		var _n = $('.msgs_list').eq(j).attr('data-name');
		if (roomname == _n) {
			$('.msgs_list').eq(j).prependTo($('.groupWrap>ul'));
		}
	}
}


//删除单个聊天框
$(document).on('contextmenu', '.msgs_list', function(ev) {
	var ev = ev || event;
	var x = ev.clientX;
	var y = ev.clientY;
	var str = '<p class="deleteChat">删除聊天</p>';
	$('.deleteChat').remove();
	$(this).append(str);
	$('.deleteChat').css({
		'left': x,
		'top': y
	})
	return false;
	ev.stopPropagation();
})

$(document).on('click', '.deleteChat', function(e) {
	var $this = $(this);
	var l = $('.AddressBook').find('.Chat_list');
	var len = $('.msgs_list').length;
	var name = $this.parents('.msgs_list').attr('data-name');
	$this.parents('.msgs_list').remove();
	if (len == 1) {
		$('.closeBtn').click();
	} else {
		console.log($this.parents('.msgs_list').hasClass('.chatActive'));
		if ($this.parents('.msgs_list').hasClass('chatActive')) {
			$('.right').hide();
			$('.chatMain').css({
				'background': '#fff url(/img/xx_logo_.png) 480px 252px no-repeat'
			});
		}
	}
	for (var i = 0; i < l.length; i++) {
		var _name = l.eq(i).attr('data-name');
		if (_name == name) {
			l.eq(i).attr('data-off', 0);
			break;
		}
	}
	e.stopPropagation();
})

function dealSrcShow(_this) {
	var imgSrc = '';
	if (_this.attr('data-type') == 'group') {
		var imgNum = _this.find('img').length; //处理多个头像
		imgSrc = _this.find('dt').html();
		$('.topImg').removeClass().addClass('topImg _userImg');
		$('.topImg').html(imgSrc).addClass('img_list_' + imgNum);
	} else {
		imgSrc = _this.find('img').attr('src');
		$('.topImg').removeClass().addClass('topImg _userImg');
		$('.topImg').html('<img src="' + imgSrc + '">');
	}
}


//关闭
$(document).on('click', '.closeBtn', function() {
	$('.chatWrap').hide();
	$('body').css('overflow', 'auto');
})



//机器人聊天
function robotChat(msg) {
	var params = {
		username: $.md5(username),
		msgbody: msg
	};
	var str = $.param(params);
	var name = robotName;
	$.ajax({
		type: "post",
		url: RestfulHOST() + "/msg/sendmsg?" + str,
		dataType: "json",
		headers: {
			"Authorization": "AQAa5HjfUNgCr27x"
		},
		success: function(msgs) {
			console.log(msgs);
			var myStr = '<div class="myMessage">' +
				'<span>' +
				'<img style="width: 100%;height: 100%;" src="' + mySrc + '">' +
				'</span><i>' +
				'</i><span style="background: #9ce554;color: #333333;display: inline-block;padding-left: 10px;padding-right: 10px;' +
				'font-size: 12px;line-height: 34px;float: right;border-radius: 2px;word-wrap: break-word;max-width:300px;">' + toFaceImg(msg) + '</span><div class="clear"></div></div>'; //消息部分
			$('.message').append(myStr);
			Gab.getBottom();
			//存储点击发送的内容
			storeSendData(name, msg);
			var len = $('.msgs_list').length;
			for (var j = 0; j < len; j++) {
				var _n = $('.msgs_list').eq(j).attr('data-name');
				if (name == _n) {
					$('.msgs_list').eq(j).find('.userInfo').html(toFaceImg(msgs));
					$('.msgs_list').eq(j).find('.sendTime').text(getNowFormatDate());
					$('.msgs_list').eq(j).prependTo($('.groupWrap>ul'));
				}
			}
		},
		error: function() {
			console.log("error");
		}
	})
}



/*陌生人   推荐给朋友名片的通讯录开始*/
$(document).on('click', '.recmdList .Chat_list', function() {
	var _this = $(this);
	var strangeName = getURIArgs('from');
	var code = getURIArgs('code');
	var imgSrc = $(this).find('img').attr('src');
	var nickname = $(this).find('.nickname').text();
	var magicno = $(this).attr('data-magicno');
	var othername = $(this).attr('data-oldname');
	var nikeName = $(this).find('.nickname').text();
	var industry = $(this).attr('data-myindustry');
	if (code) {
		var circleName = $('.right_top .circle_name').text();
		var circleImg = $('.circle_img img').attr('src') || '/img/zhiyequan.png';
		var member = $('.bottom_type .join_num').text();
		var activeNum = $('.dynamic_num').text();
		var cache = getCatetory();
		var data = {
			nickname: circleName, //圈子名称
			image: circleImg, //圈子头像
			circleNo: code,
			category: cache, //圈子类型（web判断使用）	1 职业圈  2 全球圈   3 生活圈
			username: othername, //要发送的人的用户名
			imgSrc: imgSrc,
			industry: industry,
			mynickname: nickname
		};
		var circledData = JSON.stringify(data);
		if ($(this).attr('data-off') == 0) {
			$(this).attr('data-off', 1);
			$.im.confirm("确定要发送给 “" + nikeName + "” 吗？", function() {
				$('.recmdList .Chat_list').attr('data-off', 0);
				$('.like_message').attr('data-off', 1);
				sendMessage(circledData, 'chat', 21, othername);
				friendlyMessage('已发送');
			})
		}
	}
	if (strangeName) {
		var data = { //个人名片
			image: imgSrc, //要发送的那个人的头像
			nickname: nickname, //要发送的人的昵称
			magicno: magicno, //要发送的人圈子号	
			username: othername.split('@')[0] //要发送的人的用户名
		};
		var cardData = JSON.stringify(data);
		if ($(this).attr('data-off') == 0) {
			$(this).attr('data-off', 1);
			$.im.confirm("确定要发送吗？", function() {
				$('.recmdList .Chat_list').attr('data-off', 0);
				$('.like_message').attr('data-off', 1);
				sendMessage(cardData, 'chat', 20, strangeName + "@imsvrdell1")
				friendlyMessage('已发送');
			})
		}
	}


})

//推荐给好友圈子名片
$(document).on('click', '.recommend_friends', function() {
	if (!getCookie('username')) {
		$(".masks,.viewBox").show();
		return false;
	} else {
		$('.rightRecommondFriends').show();
		$('.recentChat>ul').show();
	}
})

$(document).on('click', '.recmdBtn', function() {
	$('.rightRecommondFriends').hide();
});
/*	推荐给朋友名片的通讯录end*/

//头像滑过显示的发消息=》陌生人
$(document).on('click', '.information', function() {
	var $parent = $(this).parents('.content_items');
	var _oldname = $parent.attr('data-name') + '@imsvrdell1';
	var imgSrc = $parent.find('.usermessage>img').attr('src');
	var type = $parent.find('.authorName').children().first().text(); //昵称
	var _myindustry = $parent.find('.message_professinal').text().trim();
	var t = 'chat';
	if (isShowChatBox(_oldname)) { //判斷是否在内存中 true为没有在内存里面
		createChatWindow(_oldname, _myindustry, type, imgSrc, 1, t);
		var recent = '<li class="Chat_list" data-off="0" data-myindustry="">' +
			'<dl><dt><img class="img" src="' + imgSrc + '"></dt><dd class="nickname">' + type + '</dd></dl><div class="recmdCircle"></div></li>'
			//陌生人主页的最近联系人通讯录
		//$('.recentChat>ul').prepend(recent);
		var c_obj = storeChatStatus(_oldname, type, imgSrc, _myindustry, t);
		changeChatBoxStatus(c_obj);
	} else {
		createCommon(_oldname, _myindustry, type, imgSrc, 1, t);
	}
	storeFocusChatBox(_oldname);
	Gab.make_top_zero(_oldname);
	Gab.getMessageCount();
})


//funs 和 关注页面的发消息按钮		==》个人或陌生人主页的发消息按钮
$(document).on('click', '.sendMessageBtn', function() {
	var $parent = $(this).parents('li');
	var _oldname = $parent.attr('data-username') + '@imsvrdell1';
	var imgSrc = $parent.find('.guanzhu_img>img').attr('src');
	var type = $parent.find('.guanzhu_name').text(); //昵称
	var _myindustry = $parent.find('.guanzhu_type').text();
	var t = 'chat';
	if (isShowChatBox(_oldname)) { //判斷是否在内存中 true为没有在内存里面
		createChatWindow(_oldname, _myindustry, type, imgSrc, 1, t);
		var recent = '<li class="Chat_list" data-off="0" data-myindustry="">' +
			'<dl><dt><img class="img" src="' + imgSrc + '"></dt><dd class="nickname">' + type + '</dd></dl><div class="recmdCircle"></div></li>'
			//陌生人主页的最近联系人通讯录
//		$('.recentChat>ul').prepend(recent);
		var c_obj = storeChatStatus(_oldname, type, imgSrc, _myindustry, t);
		changeChatBoxStatus(c_obj);
	} else {
		createCommon(_oldname, _myindustry, type, imgSrc, 1, t);
	}
	storeFocusChatBox(_oldname);
	Gab.make_top_zero(_oldname);
	Gab.getMessageCount();
})

//陌生人主页的消息按钮
$(document).on('click', '.like_message', function() {
	var $parent = $(this).parents('.funsList');
	var _oldname = getURIArgs('from') + '@imsvrdell1';
	var imgSrc = $('.userImg>img').attr('src');
	var type = $('.personal_nikename').text(); //昵称
	var _myindustry = $('.myindustry').text();
	var t = 'chat';
	if (isShowChatBox(_oldname)) { //判斷是否在内存中 true为没有在内存里面
		createChatWindow(_oldname, _myindustry, type, imgSrc, 1, t);
		var recent = '<li class="Chat_list" data-off="0" data-myindustry="">' +
			'<dl><dt><img class="img" src="' + imgSrc + '"></dt><dd class="nickname">' + type + '</dd></dl><div class="recmdCircle"></div></li>'
			//陌生人主页的最近联系人通讯录
		// $('.recentChat>ul').prepend(recent);
		var c_obj = storeChatStatus(_oldname, type, imgSrc, _myindustry, t);
		changeChatBoxStatus(c_obj);
	} else {
		createCommon(_oldname, _myindustry, type, imgSrc, 1, t);
	}
	storeFocusChatBox(_oldname);
	Gab.make_top_zero(_oldname);
	Gab.getMessageCount();
})

/*图片点击的时候*/
$(document).on('click', '.msg-img', function(ev) {
	var imgSrc = $(this).attr('src');
	var theImage = new Image();
	theImage.src = imgSrc;
	var imageWidth = theImage.width;
	var imageHeight = theImage.height;
	var scale = imageWidth / imageHeight
	var h = $(window).height() - 200;
	var w = $(window).width() - 800;
	if (scale == 1) {
		if (imageWidth > w || imageHeight > h) {
			imageWidth = 600;
			imageHeight = 600;
		}
	} else {
		if (imageWidth > w) {
			imageWidth = 600;
			var hh = 600 / scale;
			imageHeight = hh;
		}
		if (imageHeight > h) {
			imageHeight = h;
			var ww = h * scale;
			imageWidth = ww;
		}
	}
	//console.log(imageHeight,imageWidth)
	$(".wrap_img").css({
		"width": imageWidth,
		"height": imageHeight,
		"position": "absolute",
		"left": "50%",
		"top": "50%",
		"margin-top": -(imageHeight / 2),
		"margin-left": -(imageWidth / 2)
	})
	$('.showImg').show();
	$('.wrap_img>img').attr('src', imgSrc).css({
		'width': '100%',
		'height': '100%',
		'display': 'block'
	});
	ev.stopPropagation();
})

$(document).on('click', function() {
	$('.showImg').hide();
	$('.deleteChat').hide();
	$('.memberList').parents('.qzchat_frame').attr('data-off', 0);
	$('.memberList').remove();
	$('.exit_btn').remove();
})

//视频关闭按钮
$(document).on('click', '.video_close', function(ev) {
	$('.showVideo').hide();
	ev.stopPropagation();
})

/*视频点击的时候*/
$(document).on('click', '.video-show', function(ev) {
	var videoUrl = $(this).attr('src').slice(0, -2);
	// console.log(videoUrl);
	$('#msgVideoShow').attr('src', videoUrl);
	$('.showVideo').show();
	ev.stopPropagation();
})

$(document).on('click', '.chat_video_play', function(ev) {
	var videoUrl = $(this).siblings('.video-show').attr('src').slice(0, -2);
	// console.log(videoUrl);
	$('#msgVideoShow').attr('src', videoUrl);
	$('.showVideo').show();
	ev.stopPropagation();
})

/*机器人聊天时候*/
$(document).on('click', '.robot', function(ev) { //点击机器人时候的弹窗
	$('#image').attr('disabled', 'disabled');
	var len = $('.msgs_list').length;
	var imgSrc = $(this).find('img').attr('src');
	var name = robotName;
	var nikename = '圈子(机器人)';
	if (isShowChatBox(name)) { //判斷是否在内存中
		createChatWindow(name, '', nikename, imgSrc, 1, 'chat');
		var c_obj = storeChatStatus(name, nikename, imgSrc, '', 'chat');
		changeChatBoxStatus(c_obj);
	} else {
		createCommon(name, '', nikename, imgSrc, 1, 'chat');
	}
	storeFocusChatBox(name);
	Gab.make_top_zero(name);
	Gab.getMessageCount();
	ev.stopPropagation();
})

$(document).on('click', '.audio', function(ev) { //点击机器人时候的弹窗
	playPause($(this).find('audio').get(0));
})


/*图片的拖拽*/
function drag(obj) {
	obj.onmousedown = function(ev) {

		var ev = ev || event;
		var disX = ev.clientX - obj.offsetLeft;
		var disY = ev.clientY - obj.offsetTop;

		if (obj.setCapture) obj.setCapture();

		document.onmousemove = function(ev) {

			var ev = ev || event;
			var l = ev.clientX - disX;
			var t = ev.clientY - disY;

			/*吸附的拖拽需要自己根据实际情况去修改值的范围*/
			if (l < 0) l = 0;
			if (t < 0) t = 0;

			if (l > (view().w - obj.offsetWidth)) {

				l = view().w - obj.offsetWidth;

			}

			if (t > (view().h - obj.offsetHeight)) {

				t = view().h - obj.offsetHeight;

			}

			obj.style.left = l + 'px';
			obj.style.top = t + 'px';

			obj.style.cursor = 'move';

		};

		obj.onmouseup = function() {
			if (obj.releaseCapture) obj.releaseCapture();
			document.onmouseup = document.onmousemove = null;
		};
		return false;
	};
};



function playPause(myAudio) {
	if (myAudio.paused) {
		myAudio.play();
	} else {
		myAudio.pause();
		myAudio.currentTime = 0;
	}
}

//推荐用户    推荐圈子 进入详情
$(document).on('click', '.cardImg,.cardNikeName,.cardTel', function() {
	var strangename = $(this).parents('.idCard').attr('data-othername');
	var code = $(this).parents('.idCard').attr('data-code');
	if (strangename) {
		if (strangename == UserName) {
			window.location.href = '/center/me/page.html';
		} else {
			getInfo({
				myname: getCookie("username") || "nouser",
				username: strangename,
				templetName: "pageJingtai"
			});
		}
	}
	//推荐圈子  进入详情
	if (code) {
		var cache = $(this).parents('.idCard').attr('data-cache');
		var str = getTypeStr(cache);
		window.location.href = '/center/' + str + '/mydynamic.html?code=' + code;
	}
})


//得到圈子类型
function getCatetory() {
	var href = window.location.href;
	var catetory;
	if (href.indexOf('zhiye') > -1) {
		catetory = 1;
	}
	if (href.indexOf('global') > -1) {
		catetory = 2;
	}
	if (href.indexOf('life') > -1) {
		catetory = 3;
	}
	return catetory;
}

function getTypeStr(cache) {
	var str = '';
	if (cache == 1) {
		str = 'zhiye';
	} else if (cache == 2) {
		str = 'global';
	} else if (cache == 3) {
		str = 'life';
	}
	return str;
}

//获取视频时间
function getVideoTime(t) {
	function fun(_sT) {
		var _ss = "";
		_sT < 10 ? _ss = "0" + _sT : _ss = _sT;
		return _ss;
	}
	var str = '';
	var min = fun(Math.floor(t / 60000));
	var sec = fun(Math.floor(t % 60000 / 1000));
	str += min + ':' + sec
	return str;
}


//处理陌生人主页消息
function dealStrangeMsg(fromName) {
	var strangename = $.md5(getURIArgs('strangename'));
	if (fromName == strangename) {
		$('.like_message').attr('data-off', 1);
	}
};


//得到自己的头像
function getMySrc() {
	var mySrc = '';
	if (getCookie('headImgkz') == '' || getCookie('headImgkz') == 'undefined') {
		mySrc = '/img/first.png';
	} else {
		if (getCookie("headImgkz").indexOf("http") > -1) {
			mySrc = getCookie('headImgkz');
		} else {
			mySrc = ImgHOST() + getCookie('headImgkz');
		}
	}
	return mySrc;
}



//加入圈子
function joinCircle(url, data, _this, roomName, roomid, imgSrc, naturalName, type) {
	var str = '';
	$.ajax({
		type: "post",
		url: serviceHOST() + '/' + url + '.do',
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: data,
		success: function(msg) {
			if (msg.status == 0) {
				joinFlashChat(roomName, roomid, imgSrc, naturalName, _this);
				// _this.attr('data-isjoin', true);
			} else if (msg.status == -1 && type == 1) {
				circlelimit("您不是" + naturalName + "圈的成员，无法进入聊天室，请更改你的职业圈或升级VIP后进入。");
			} else if (msg.status == -3) {
				getToken();
			} else {
				warningMessage(msg.info);
			}
		},
		error: function() {
			console.log("error")
		}
	})
};



//加入闪聊			需要先加入圈子再加入聊天室
function joinFlashChat(roomName, roomid, imgSrc, naturalName, _this) {
	var myStr = '';
	var username = getCookie('username');
	var params = {
		username: username,
		roomname: roomName,
		roomid: roomid,
		grouptype: 1, //1群 2讨论组
		noteword: ''
	};
	var str = $.param(params);
	$.ajax({
		type: "post",
		url: RestfulHOST() + "/mucgroup/member?" + str,
		dataType: "json",
		headers: {
			"Authorization": "AQAa5HjfUNgCr27x"
		},
		success: function(msgs) {
			if (msgs.status == 0) { // 0 成功  -1 失败  -2 已经存在
				MucgroupMy(1);
				showChatBox(imgSrc, naturalName, roomName, _this)
				_this.parents(".finish").html('<span class="openchat" data-off="1" data-natural="' + naturalName + '" data-name="' + roomName + '">聊天室</span><span class="circle_xq">圈子</span>');
				Gab.connection.send(
					$pres({
						to: roomName + "@conference.imsvrdell1" + "/" + naturalName + "-" + username
					}));
			} else if (msgs.status == 404) {
				warningMessage('此聊天室已解散');
			} else if (msgs.status == -1) {
				warningMessage('加入聊天室失败');
			} else if (msgs.status == -2) {
				warningMessage('您已加入聊天室');
			} else {
				// friendlyMessage(msgs.info);
			}
		},
		error: function() {
			console.log("error");
		}
	})
}


//取消圈子的同时，需要将聊天室也退出
function deleteChatroom(roomName) {
	var myStr = '';
	var params = {
		username: username,
		roomname: roomName
	};
	var str = $.param(params);
	$.ajax({
		type: "delete",
		url: RestfulHOST() + "/mucgroup/member?" + str,
		dataType: "json",
		headers: {
			"Authorization": "AQAa5HjfUNgCr27x"
		},
		success: function(msgs) {
			console.log(msgs);
			if (msgs.status == 0) {
				MucgroupMy(1);
				// showChatBox(imgSrc, naturalName, roomName, _this)
			} else {
				friendlyMessage(msgs.info);
			}
		},
		error: function() {
			console.log("error");
		}
	})
}


//显示聊天框
function showChatBox(imgSrc, naturalName, roomName, _this) {
	var xmppName = roomName + '@conference.imsvrdell1';
	var t = 'groupchat';
	var num, actNum, txt = '';
	$('#image').removeAttr('disabled'); //将文件可点击
	$('.AddressBook .group').find('.Chat_list').each(function() {
		var fName = $(this).attr('data-oldname');
		if (xmppName == fName) {
			num = $(this).attr('data-num');
			actNum = Math.ceil(num / 2);
			txt = num + '人加入' + ' | ' + actNum + '人活跃';
		}
	})
	if (isShowChatBox(xmppName)) { //判斷是否在内存中
		createChatWindow(xmppName, txt, naturalName, imgSrc, 1, t);
		var c_obj = storeChatStatus(xmppName, naturalName, imgSrc, txt, t);
		changeChatBoxStatus(c_obj);
	} else {
		createCommon(xmppName, txt, naturalName, imgSrc, 1, t);
	}
	storeFocusChatBox(xmppName);
	getChatHistory(xmppName);
	Gab.getMessageCount();
}



//闪聊 聊天室
$(document).on('click', '.chatRoom', function() {
	if (!getCookie('username')) {
		$(".masks,.viewBox").show();
		return false;
	}
	if ($('.joinUs').attr('data-status') == 0) {
		warningMessage('请先加入圈子');
	} else {
		var imgSrc = '';
		var _this = $(this);
		var naturalName = _this.attr('data-naturalname');
		var roomName = _this.attr('data-roomname');
		var roomid = _this.attr('data-roomid');
		if (_this.attr('data-type') == 1) {
			imgSrc = '/img/zhiyequan.png';
		} else {
			imgSrc = _this.parents('.right_top').find('img').attr('src');
		}

		if (isJoinChatRoom(roomName)) { //判断是否已经加入聊天室
			showChatBox(imgSrc, naturalName, roomName, _this);
		} else {
			joinFlashChat(roomName, roomid, imgSrc, naturalName, _this);
		}
	}

})

function isJoinChatRoom(roomName) {
	var _groupname = store('groupmsg');
	var off = false;
	for (var i = 0; i < _groupname.length; i++) {
		var _names = _groupname[i].name;
		if (_names == roomName) {
			off = true;
			break;
		}
	}
	return off;
}

//加入闪聊		闪聊页面
$(document).on('click', '.joins', function(e) {
	if (!getCookie('username')) {
		$(".masks,.viewBox").show();
		return false;
	}
	var type = $(this).parents('li').attr('data-type');
	var roomName = $(this).attr('data-name');
	var roomid = $(this).parents('li').attr('data-roomid');
	var naturalName = $(this).attr('data-natural');
	var imgSrc = $(this).parents('li').find('img').attr('src');
	var _this = $(this);
	var url = '';
	var data = {};
	var code = $(this).parents('li').attr('data-code')
	if (type == 1) {
		url = 'jobstree/joinedJobStree';
		var arr = [code];
		code = JSON.stringify(arr);
		data = {
			"username": username,
			"codes": code
		};
	} else if (type == 2) {
		url = 'citycircleusermap/joinCitycircle';
		data = {
			citycircleId: code,
			username: username
		};
	} else if (type == 3) {
		url = 'theme/createThemeofusermap';
		data = {
			username: username,
			themeNo: code
		};
	}
	if ($(this).attr('data-isjoinedcircle') == 'false') { //判读是否加入了圈子     没加入先加入圈子，后加入聊天室   。    若加入了去找你true,直接加入聊天室
		joinCircle(url, data, _this, roomName, roomid, imgSrc, naturalName, type);
	} else {
		joinFlashChat(roomName, roomid, imgSrc, naturalName, _this);
	}
	e.stopPropagation();
})



/*
	通讯录好友搜索
*/
$(document).on("click", ".rightRecommondFriends .searchOn", function() {
	$(".rightRecommondFriends .SearchResults ul").empty();
	$(".recmdSearch .recmdSearchBox i").remove();
	var txt = html2Escape($(".recmdSearch .recmdSearchBox input").val());
	recentFriendsSearchResults(txt)
})

// 回车搜索
$(document).on("click", '#searching', function() {
	var act = $(document.activeElement).attr("id");
	if (act == "searching") {
		$("#searching").on("keyup", function(e) {
			var code = (e ? e.keyCode : e.which);
			if (code == 13) {
				$(".rightRecommondFriends .searchOn").click();
				return false;
			};
		});
	}
});



// 搜索结果
function recentFriendsSearchResults(v) {
	$(".rightRecommondFriends .recmdList").hide();
	$(".rightRecommondFriends .SearchResults").show(500);
	$(".recmdSearch .recmdSearchBox").append('<i></i>'); //显示关闭搜索
	var _list = $(".recmdList .friends li");
	for (var i = 0; i < _list.length; i++) {
		if (_list.eq(i).attr("data-magicno").indexOf(v) >= 0 || _list.eq(i).find("dl").text().indexOf(v) >= 0) {
			var tpl = _list.eq(i).clone();
			$(".rightRecommondFriends .SearchResults ul").append(tpl);
		}
	}
	if ($(".rightRecommondFriends .SearchResults ul li").length == 0) {
		$(".rightRecommondFriends .SearchResults ul").html('<li style="margin-top: 10px;height:40px;">找不到结果</li>');
	}
}


/*
		退出通讯录搜索
   */
$(document).on("click", ".recmdSearch .recmdSearchBox i", function() {
	$(".rightRecommondFriends .SearchResults").hide();
	$(".rightRecommondFriends .recmdList").show();
	$(".recmdSearch .recmdSearchBox input").val("");
	$(this).remove();
})

//在线客服
$(document).on('click', '.serverOnline,.service', function() {
	if (!getCookie('username')) {
		$(".masks,.viewBox").show();
		return false;
	}
	var imgSrc = $(this).find('img').attr('src') || '/img/xs_zaixiankefu.png';
	getServerCode(imgSrc, $(this));
})


//客服
function getServerCode(imgSrc, _this) {
	$.ajax({
		type: "get",
		url: RestfulHOST() + '/kefu/getKefu.do',
		dataType: "json",
		headers: {
			"Authorization": "AQAa5HjfUNgCr27x",
			"Accept": "application/json"
		},
		success: function(msg) {
			if (msg.status == 0) {
				var _oldname = msg.data + '@imsvrdell1';
				$('#image').removeAttr('disabled'); //将文件可点击
				var type = '在线客服',
					t = 'chat';
				if (isShowChatBox(_oldname)) { //判斷是否在内存中 true为没有在内存里面
					createChatWindow(_oldname, '', type, imgSrc, 1, t);
					var c_obj = storeChatStatus(_oldname, type, imgSrc, '', t);
					changeChatBoxStatus(c_obj);
				} else {
					createCommon(_oldname, '', type, imgSrc, 1, t);
				}
				storeFocusChatBox(_oldname);
				Gab.make_top_zero(_oldname);
				Gab.getMessageCount();
			} else {
				$('.serverBox').show();
			}
		},
		error: function() {
			console.log("error")
		}
	});
}

$(document).on('click', '.knowClose button', function() {
	$(this).parents('.serverBox').hide()
})


function isFriendShip(name) {
	var off = false;
	for (var i = 0; i < friendArr.length; i++) {
		var _name = friendArr[i];
		if (name == _name) {
			off = true;
			break;
		}
	}
	return off;
}

var membership = ""; //正在点击的成员列表
//群组成员列表点击查看信息
$(document).on('click', '.memberList ul li', function(ev) {
	membership = $(this);
	var ev = ev || event,
		$this = $(this),
		name = $this.attr('data-name'),
		_index = $this.index(),
		h = $this.height() + 27,
		age = $this.attr('data-age'),
		sex = $this.attr('data-sex'),
		nikename = $this.attr('data-nikename'),
		src = $this.find('.member_src').attr('src'),
		relation = $this.attr('data-relation'),
		isfollower = $this.attr('data-isfollower'),
		str = '<div class="memberShow" data-nikename="' + nikename + '" data-name="' + name + '">' +
		'<a class="memberAvarWrap" href="javascript:;">' +
		'<img class="memberAvar" src="' + src + '"></a><div class="message_person_data">' +
		'<span class="memberNikename">' + (nikename || shieldNumber(name)) + '</span>' +
		'<span class="memberColor"></span></div>' +
		'<p class="message_ship">' +
		'<a class="message_addFriend" data-relation="' + relation + '" href="javascript:;"><i></i>加好友</a>' +
		'<a class="focus_status" href="javascript:;">取消关注</a></p></div>',
		x = ev.clientX - $this.offset().left + 15,
		a; //用来计算高度,
	if (name == username) {
		a = 220;
	} else {
		a = 256;
	}
	var y = ev.clientY - $('.memberList').offset().top + $(window).scrollTop() - a;
	if ($('.memberList').attr('data-off') == 0) { //0的时候显示
		$('.memberShow').remove();
		$('.memberList').append(str);
		if(age) $('.memberColor').text(age).addClass("memberSex");
		$('.memberShow').css({
			'left': x + 'px',
			'top': y + 'px'
		})
		if (sex == '女') {
			$('.memberSex').css({
				'background': 'fda0ba url(/img/nv02.png) 1px center no-repeat'
			})
		}
		if (name == username) {
			$('.message_ship').hide();
		}
		if (relation == 0) {
			$('.message_addFriend').html('已请求');
		} else if (relation == 3 || relation == 1 || relation == 2) {
			$('.message_addFriend').html('发消息')
		} else if (relation == 4) {
			$('.message_addFriend').html('已拒绝');
		} else {
			$('.message_addFriend').html('<i></i>加好友')
		};

		if (isfollower == 0) {
			$('.focus_status').html('<i></i>关注').attr('data-isfollower', 0);
		} else {
			$('.focus_status').html('取消关注').attr('data-isfollower', 1);
		}
		$('.memberShow').show();
		$('.memberList').attr('data-off', 1);
	} else {
		$('.memberShow').hide();
		$('.memberList').attr('data-off', 0);
	}
	ev.stopPropagation();
})

//点击群聊成员关注
$(document).on('click', '.focus_status', function(e) {
	var name = $(this).parents('.memberShow').attr('data-name');
	if ($(this).attr('data-isfollower') == 0) {
		setFocus(username, name);
		$(this).attr('data-isfollower', 1).html('取消关注');
		membership.attr('data-isfollower', 1);    //改变成员列表关注状态
		changeFocusShipStatus(name, 1)
	} else {
		unsetFocus(username, name);
		$(this).attr('data-isfollower', 0).html('<i></i>关注');
		membership.attr('data-isfollower', 0);
		changeFocusShipStatus(name, 0);
	}
	MucgroupMy(1);
	e.stopPropagation();
});


//群成员加好友 
$(document).on('click', '.message_addFriend', function(ev) {
	var ev = ev || event,
		name = $(this).parents('.memberShow').attr('data-name'),
		relation = $(this).attr('data-relation'),
		imgSrc = $(this).parents('.memberShow').find('img').attr('src');
	if (relation == 5) {
		AddfriendRequest(username, name, $(this));
		changeFriendShipStatus(name, 0);
		MucgroupMy(1);
	} else if (relation == 0) {
		return false;
	} else {
		//群成员好友发送消息
		$(".memberList").remove();
		var l = $('.AddressBook .friends').find('.Chat_list');
		for (var i = 0; i < l.length; i++) { //pc端收到正常消息
			var fName = l.eq(i).attr('data-oldname'),
				_n = name + '@imsvrdell1'; //xmpp类型的名字
			if (_n == fName) {
				var type = l.eq(i).find('.nickname').text(),
					_name = l.eq(i).attr('data-oldname'),
					_myindustry = l.eq(i).attr('data-myindustry'),
					len = $('.msgs_list').length,
					magicno = l.eq(i).attr('data-magicno'),
					strangename = '',
					t = 'chat';
				$('#image').removeAttr('disabled'); //将文件可点击
				if (getURIArgs('strangename')) {
					strangename = getURIArgs('strangename')
				}
				if (name == strangename) {
					$('.like_message').attr('data-off', 1);
				}
				if (l.eq(i).attr('data-off') == 0) {
					if (isShowChatBox(_n)) { //判斷是否在内存中
						createChatWindow(_n, _myindustry, type, imgSrc, 1, t);
						var recent = '<li class="Chat_list" data-off="0" data-magicno="' + magicno + '" data-myindustry="">' +
							'<dl><dt><img class="img" src="' + imgSrc + '"></dt><dd class="nickname">' + type + '</dd></dl><div class="recmdCircle"></div></li>'
							//陌生人主页的最近联系人通讯录
						//$('.recentChat>ul').prepend(recent);
						var c_obj = storeChatStatus(_n, type, imgSrc, _myindustry, t);
						changeChatBoxStatus(c_obj);
					} else {
						createCommon(_n, _myindustry, type, imgSrc, 1, t);
					}
				} else {
					createCommon(_n, _myindustry, type, imgSrc, 1, t);
				}
				storeFocusChatBox(_n);
				getChatHistory(_n);
				Gab.make_top_zero(_n);
				Gab.getMessageCount();
				l.eq(i).attr('data-off', 1); //将通讯录里面的数据开关变成1，让其不能再点
				break;
			}
		};
	}
	ev.stopPropagation();
})


//改变好友状态(成员列表)
function changeFriendShipStatus(name, value) {
	$('.member ul li').each(function() {
		var mname = $(this).attr('data-name');
		if (name == mname) {
			$(this).attr('data-relation', value)
		}
	})
}
//改变粉丝状态(成员列表)
function changeFocusShipStatus(name, value) {
	$('.member ul li').each(function() {
		var mname = $(this).attr('data-name');
		if (name == mname) {
			$(this).attr('data-isfollower', value)
		}
	})
}

//聊天室以及群聊菜单点击
$(document).on('click', '.qzMember', function(ev) {
	var ev = ev || event;
	// $(".exit_btn").remove();
	var $rightop = $(this).parents('.qzchat_frame');
	var name = $rightop.attr('data-oldname').split('@')[0];
	// var nname = $rightop.attr('data-naturename');
	var nikename = $rightop.find('.userNickname').text();
	var _type = $rightop.attr('data-type');
	var str = '';
	if ($rightop.find('.memberList').length == 1) {
		$rightop.find('.memberList').remove();
	} else {
		$(".titlebar .exit_btn").remove();
		$('.memberList').remove(); //先将之前的所有内容移除掉
		var memberStr = '<div class="memberList" data-off="0"><p>圈子成员</p><ul></ul></div>';
		$rightop.append(memberStr);
		$(".titlebar").removeClass("titlebar_color");
		$rightop.find('.titlebar').addClass("titlebar_color");
	}
	if (_type == 'groupchat') {
		var _groupChat = store('groupmsg');
		for (var i = 0; i < _groupChat.length; i++) {
			var _name = _groupChat[i].name;
			// var _nname = _groupChat[i].nname;
			if (name == _name) {
				var owns = _groupChat[i].owners.username.split('@')[0];
				/*if (owns == getCookie('username')) {
					$('.exit_btn').text('解散聊天室');
				}*/
				for (var j = 0; j < _groupChat[i].members.length; j++) {
					var avatar = _groupChat[i].members[j].avatarfile;
					var age = _groupChat[i].members[j].age;
					var sex = _groupChat[i].members[j].sex;
					var username = _groupChat[i].members[j].username;
					var nickname = _groupChat[i].members[j].nickname;
					var relation = _groupChat[i].members[j].relation;
					var isfollower = _groupChat[i].members[j].isfollower;
					if (username.indexOf('@') > -1) {
						username = username.split('@')[0];
					}
					if (avatar == '' || avatar == null) {
						avatar = '/img/first.png';
					} else {
						avatar = ImgHOST() + avatar;
					}
					if (nickname == null) nickname = '';
					if (age == null) age = '';
					if (sex == null) sex = '';
					str += '<li data-relation="' + relation + '" data-isfollower="' + isfollower + '" data-name="' + username + '" data-age="' + age + '" data-sex="' + sex + '" data-nikename="' + nickname + '">'+
					'<a href="javascript:;"><img class="member_src" src="' + avatar + '"></a><span>' + (nickname || shieldNumber(username)) + '</span></li>';
				}
				break;
			}
		}
	} else if (_type == 'group') {
		/*$('.cicle_text').text('群聊名称');
		$('.exit_btn').text('删除并退出');*/
		var _group = store('groupchatmsg');
		// console.log(_group)
		for (var i = 0; i < _group.length; i++) {
			var _name = _group[i].name;
			// var _nname = _group[i].nname;
			if (name == _name) {
				var owns = _group[i].owners.username.split('@')[0];
				/*if (owns == getCookie('username')) {
					$('.exit_btn').text('解散群聊');
				}*/
				for (var j = 0; j < _group[i].members.length; j++) {
					var avatar = _group[i].members[j].avatarfile;
					var age = _group[i].members[j].age;
					var sex = _group[i].members[j].sex;
					var username = _group[i].members[j].username;
					var nickname = _group[i].members[j].nickname;
					var relation = _group[i].members[j].relation;
					var isfollower = _group[i].members[j].isfollower;
					if (username.indexOf('@') > -1) {
						username = username.split('@')[0];
					}
					if (avatar == '') {
						avatar = '/img/first.png';
					} else {
						avatar = ImgHOST() + avatar;
					}
					if (nickname == null) nickname = '';
					if (age == null) age = '';
					if (sex == null) sex = '';
					str += '<li data-relation="' + relation + '" data-isfollower="' + isfollower + '" data-name="' + username + '" data-age="' + age + '" data-sex="' + sex + '" data-nikename="' + nickname + '"><a href="javascript:;"><img class="member_src" src="' + avatar + '"></a><span>' + (nickname || username) + '</span></li>'
				}
				break;
			}
		}
	}
	$('.memberList').find('ul').html(str)
	ev.stopPropagation();
})


//点击设置按钮
$(document).on('click', '.qzSet', function(e) {
		var e = e || event;
		var _str = '';
		var $this = $(this);
		var type = $this.parents('.qzchat_frame').attr('data-type');
		var name = $this.parents('.qzchat_frame').attr('data-oldname').split('@')[0];
		if (type == 'groupchat') {
			if (isOwnCreate(name, type)) {
				_str = '解散聊天室';
			} else {
				_str = '退出聊天室';
			}
		} else if (type == 'group') {
			if (isOwnCreate(name, type)) {
				_str = '解散群聊';
			} else {
				_str = '退出群聊';
			}
		}
		var str = '<p class="exit_btn">' + _str + '</p>';
		if($(this).parents(".titlebar").has(".exit_btn").length == 0){
			$(".exit_btn").remove();
			$(".titlebar").removeClass("titlebar_color");
			$this.parents('.titlebar').addClass("titlebar_color").append(str);
		}else{
			$(this).parents(".titlebar").find(".exit_btn").remove();
		}
		e.stopPropagation();
	
})


//得到自己是否是聊天室的创建者
function isOwnCreate(name, _type) {
	var handle = false;
	if (_type == 'groupchat') {
		var _groupChat = store('groupmsg');
		for (var i = 0; i < _groupChat.length; i++) {
			var _name = _groupChat[i].name;
			if (name == _name) {
				var owns = _groupChat[i].owners.username.split('@')[0];
				if (owns == getCookie('username')) {
					handle = true;
				}
			}
		}
	} else if (_type == 'group') {
		var _group = store('groupchatmsg');
		for (var i = 0; i < _group.length; i++) {
			var _name = _group[i].name;
			if (name == _name) {
				var owns = _group[i].owners.username.split('@')[0];
				if (owns == getCookie('username')) {
					handle = true;
				}
			}
		}
	}
	return handle;
}

//退出聊天室  退出群聊
$(document).on('click', '.exit_btn', function() {
	var $this = $(this);
	var type = $this.parents('.qzchat_frame').attr('data-type');
	var name = $this.parents('.qzchat_frame').attr('data-oldname');
	var dataNaturename=$this.parents('.qzchat_frame').find(".minimize").find("a").attr('title');   //新加的
	var roomname = name.split('@')[0];
	var msg = ''; //聊天室和群聊的区分
	if(type == "group"){
		msg = "群聊";
	}else{
		msg = "聊天室"
	}
	if (isOwnCreate(roomname, type)) {
		var str = '<div id="mskocc" class="exitChat"><div style="z-index:10000000;" class="maskocc"></div>' +
			'<div style="z-index:99999999;" class="viewBoxocc">' +
			'<p class="parBox"><span class="exitChatCancel">×</span></p>' +
			'<div class="viewTop">' +
			'<h3>提示</h3>' +
			'<p style="line-height:21px;">您将解散该' + msg + '，且' + msg + '成员将无法继续发布聊天消息。确定要解散吗？</p>' +
			'</div>' +
			'<div class="viewBot"><a class="exitChatBtn" data-oldname="' + name + '" style="margin-right:10px;" href="javascript:;">确定</a>' +
			'<a class="exitChatCancel" href="javascript:;" style="margin-left:10px;" >取消</a>' +
			'</div></div></div>';
		$('body').append(str);
	} else {
		exitGroupChat(username, roomname, name,dataNaturename);
	}
})

//取消退出聊天室
$(document).on('click', '.exitChatCancel', function() {
	$(this).parents('.exitChat').hide().remove();
})


//解散聊天室
$(document).on('click', '.exitChatBtn', function() {
	var name = $('#textBox').parents(".qzchat_frame").attr('data-oldname');
	var roomid = '';
	$('.AddressBook').find('.Chat_list').each(function() {
		var _name = $(this).attr('data-oldname');
		var id = $(this).attr('data-roomid');
		if (_name == name) {
			roomid = id;
		}
	});
	
	if($('#textBox').parents(".qzchat_frame").attr("data-type")=="group"){
		dismissChat(username, roomid,name);
	}else if($('#textBox').parents(".qzchat_frame").attr("data-type")=="groupchat"){
		dismissChat2(username,roomid,0,name);      //1是开通   0是关闭
	};
	$(this).parents('.exitChat').hide().remove();
})
//解散群聊以及聊天室
function dismissChat(username, roomid, name) { //name用来判断 解散的那个聊天室
	var params = {
		username: username,
		roomid: roomid
	};
	var str = $.param(params);
	var winUrl = window.location.href;
	$.ajax({
		type: "POST",
		url: RestfulHOST() + "/mucgroup/deleteroom?" + str,
		dataType: "json",
		headers: {
			"Authorization": "AQAa5HjfUNgCr27x"
		},
		success: function(msgs) {
			//console.log(msgs);
			if (msgs.status == 0) {
				$('.chatRoom').attr('data-off', 0);
				$('.chatActive').remove();
				MucgroupMy(1);
				MucgroupMy(2);
				$('.qzchat_frame').each(function() {
					var n = $(this).attr('data-oldname');
					if (n == name) {
						$(this).hide(300, function() {
							$(this).remove();
							changeStore(name);
						});
					}
				});
				
				if (winUrl.indexOf('flashchat') > -1) {
					$(".classify .lists li").each(function(k, v) {
						if ($(".classify .lists li").eq(k).attr("data-roomid") == roomid) { 
							$(".classify .lists li").eq(k).remove();
						}
					})
				}else if(winUrl.indexOf('searchresult.html') >-1&&getURIArgs("form")==4){
					$("#dynamic_list .lists li").each(function(k,v){
						if($("#dynamic_list .lists li").eq(k).attr("data-roomid")==roomid){
							$("#dynamic_list .lists li").eq(k).remove();
							
						}
					})
				}
			} else {
				friendlyMessage(msgs.info);
			}
		},
		error: function() {
			console.log("error");
		}
	})
};


function dismissChat2(username,roomid,candiscoverjid,name) {       //聊天室          群主解散退出聊天室
	var params = {
		username: username,
		roomid:roomid,
		candiscoverjid:candiscoverjid
	};
	var str = $.param(params);
	var winUrl = window.location.href;
	$.ajax({
		type: "POST",
		url: serviceHOST() + "/citycircle/updateCircleRoom.do?" + str,
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		success: function(msgs) {
			console.log(msgs);
			if (msgs.status == 0) {
				$('.chatRoom').attr('data-off', 0);
				$('.chatActive').remove();
				MucgroupMy(1);
				MucgroupMy(2);
				$('.qzchat_frame').each(function() {
					var n = $(this).attr('data-oldname');
					if (n == name) {
						$(this).hide(300, function() {
							$(this).remove();
							changeStore(name);
						});
					}
				});
				
				if (winUrl.indexOf('flashchat') > -1) {
					$(".classify .lists li").each(function(k, v) {
						if ($(".classify .lists li").eq(k).attr("data-roomid") == roomid) { 
							$(".classify .lists li").eq(k).remove();
						}
					})
				}else if(winUrl.indexOf('searchresult.html') >-1&&getURIArgs("form")==4){
					$("#dynamic_list .lists li").each(function(k,v){
						if($("#dynamic_list .lists li").eq(k).attr("data-roomid")==roomid){
							$("#dynamic_list .lists li").eq(k).remove();
							
						}
					})
				}
				
			} else {
				warningMessage(msgs.info);
			}
		},
		error: function() {
			console.log("error");
		}
	})
}



//退出群聊 聊天室
function exitGroupChat(username, roomName, name,dataNaturename) {
	var params = {
		username: username,
		roomname: roomName
	};
	var str = $.param(params);
	var winUrl = window.location.href;
	$.ajax({
		type: "DELETE",
		url: RestfulHOST() + "/mucgroup/member?" + str,
		dataType: "json",
		headers: {
			"Authorization": "AQAa5HjfUNgCr27x"
		},
		success: function(msgs) {
			console.log(msgs);
			if (msgs.status == 0) {
				var $list = $('.msgs_list');
				var len = $list.length;
				$('.chatRoom').attr('data-off', 0);  
				$('.chatActive').remove();
				MucgroupMy(1);
				MucgroupMy(2);
				$('.qzchat_frame').each(function() {
					var n = $(this).attr('data-oldname');
					if (n == name) {
						$(this).hide(300, function() {
							$(this).remove();
							changeStore(name);
						});
					}
				});
				if (winUrl.indexOf('flashchat') > -1) {
					$(".classify .lists li").each(function(k, v) {
						if ($(".classify .lists li").eq(k).attr("data-name") == roomName) {  
							$(".classify .lists li").eq(k).find(".openchat").remove();
							var spans='<span class="joins on isjoin" data-isjoinedcircle="true" data-isjoin="false" data-off="0" data-natural="'+dataNaturename+'" data-name="'+roomName+'">加入聊天室</span>';
							$(".classify .lists li").eq(k).find(".finish").prepend(spans);
						}
					})
				}else if(winUrl.indexOf('searchresult.html') >-1&&getURIArgs("form")==4){
					$("#dynamic_list .lists li").each(function(k,v){
						if($("#dynamic_list .lists li").eq(k).attr("data-name")==roomName){
							$("#dynamic_list .lists li").eq(k).find(".openchat").remove();
							var spans='<span class="joins on isjoin" data-isjoinedcircle="true" data-isjoin="false" data-off="0" data-natural="'+dataNaturename+'" data-name="'+roomName+'">加入聊天室</span>';
							$("#dynamic_list .lists li").eq(k).find(".finish").prepend(spans);
						}
					})
				}

			} else {
				friendlyMessage(msgs.info);
			}
		},
		error: function() {
			console.log("error");
		}
	})
}


function deleteGroupLater() {
	$('.right').show();
	$('.chatMain').css('background', '#fff')
}

/*上导航消息删除功能start*/
$(document).on('click', '.Message_del', function(ev) {
	$(this).parents('.top_msglist').remove();
	var len = $('.top_msglist').length;
	if (len == 0) {
		$('.no_message').show();
	}
	Gab.getMessageCount();
	ev.stopPropagation();
})


// 发送名片消息

function sendContact(type, to_name, msgs, my_src) {
	var msg = JSON.parse(msgs);
	var str = '';
	//发送名片的时候			20.名片    22.转发好友  21.推荐圈子
	/*如果是发送名片时候(注意将右侧的  通讯录的数据开关变为1)*/
	if (type == 20) {
		msgs = "[个人名片]";
		msg.type = "20"
		var l = $('.AddressBook .friends').find('.Chat_list');
		var msgImg = '';
		var msgName = '';
		var myindustry = '';
		var resStr = ''; //存储发过来消息
		$('.no_message').hide();
		for (var i = 0; i < l.length; i++) {
			var fName = l.eq(i).attr('data-oldname');
			if (to_name == fName) {
				msgImg = l.eq(i).find('img').attr('src');
				msgName = l.eq(i).find('.nickname').text();
				myindustry = l.eq(i).attr("data-myindustry");
				l.eq(i).attr('data-off', 1); //将通讯录里面的数据开关变成1，让其不能再点
			}
		};
		/*发送名片的下侧通讯录*/
		str += '<div class="qz_xx qz_xx02 clear">' +
			'<div class="idCard" data-othername="' + msg.username + '"><p class="idCardTittle">个人名片</p><dl>' +
			'<dt class="cardImg"><img src="' + msg.image + '"></dt><dd class="cardNikeName"><span>' + msg.nickname + '</span></dd>' +
			'<dd class="cardTel">圈子号：<span>' + msg.magicno + '</span></dd><div class="clear"></div></dl></div></div>';

	} else if (type == 22) {
		msgs = "[分享动态]";
		msg.type = "22"
			//动态转发的时候
		var shareImageUrl = '';
		if (msg.shareImageUrl == '') { //图片显示的处理
			shareImageUrl = '/img/friendShareDefalt.png';
		} else {
			shareImageUrl = msg.shareImageUrl;
		}
		str += '<div class="qz_xx qz_xx02 clear">' +
			'<div class="friendShare"><dl>' +
			'<dt class="friendShareImg"><a href="' + msg.shareUrl + '">' +
			'<img style="width: 100%;height: 100%;" src="' + shareImageUrl + '">';
		if (msg.shareImageType == 1) {
			str += '<div class="videoPoster"><img  src="/img/xx_shipin.png"></div>';
		}
		str += '</a></dt>' +
			'<dd class="shareTittle">圈子分享</dd>' +
			' <dd><a class="shareContent" href="' + msg.shareUrl + '">' + msg.shareTitle + '</a></dd>' +
			'<div class="clear"></div>' +
			'</div>' +
			'</div>';
	} else if (type == 21) { //发送推荐的圈子
		msgs = "[圈子名片]";
		msg.type = "21"
		str += '<div class="qz_xx qz_xx02 clear">' +
			'<div class="idCard sendCicleInfo" data-code="' + msg.circleNo + '" data-cache="' + msg.category + '">' +
			'<p class="idCardTittle">推荐圈子</p><dl>' +
			'<dt class="cardImg"><img src="' + msg.image + '">' +
			'</dt><dd class="cardNikeName"><span>' + msg.nickname + '</span>' +
			'</dd><div class="clear"></div>' +
			'</dl></div></div>';
	}
	//过滤以及添加消息框的内容
	$('.qzchat_frame').each(function() {
		var _this = $(this);
		var n = _this.attr('data-oldname');
		if (n == to_name) {
			_this.find('.qzcht_msg').append(str);
			Gab.getBottom(_this);
		}
	});
	storeSendData(to_name, msg); //存储发送的名片信息
}

//聊天框用户主页点击头像跳转
$(document).on("click", ".UserInformation .df_img,.titlebarWrapper", function() { //1职业圈 2全球圈   3.生活圈
	var fromType = $(this).parents(".qzchat_frame").attr("data-type");
	if (fromType == "chat") { //好友
		var strangename = $(this).parents(".qzchat_frame").attr("data-oldname").split("@")[0];
		getInfo({
			myname: getCookie("username") || "nouser",
			username: strangename,
			templetName: "pageJingtai"
		});
	}
})


//聊天框消息用户头像跳转主页
$(document).on("click",".yh_t1",function(){
	getInfo({
		myname: UserName || "nouser",
		username: $(this).attr("data-name"),
		templetName: "pageJingtai"
	});
})



//滑过聊天框title显示下划线
$(document).on("hover",".titlebarWrapper>a",function(){
	if($(this).parents(".qzchat_frame").attr("data-type") == "chat"){
		$(this).addClass("titlebarName");
	}
})