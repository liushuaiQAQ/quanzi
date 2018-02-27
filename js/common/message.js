/*
 1.登录存储base64位的字符
 2.转发页面的js
 */

var base = new Base64();
var username = getCookie('username');
var xmpp_key = getCookie('xmpp_key');
var userData = {
	jid: username + '@imsvrdell1/web',
	password: base.decode(xmpp_key)
};
var chat_num = 0,
	send_num = 0,
	receive_num = 0; //收到received消息代表消息发出去了。
var robotName = '1001001@imsvrdell1';
var mySrc = getMySrc(); //图片地址的处理
var friendArr = []; //用来存储好友关系
var groupArr = []; //用来存储聊天室
var groupChatArr = []; //用于存储群聊
// var objArr = [];//弃用
var num = 0;
var count = 0;
var serverCode = ["kefu_1", "kefu_2", "kefu_3", "kefu_4", "kefu_5", "kefu_6"];
var chat_version = [];
var receive_timer = null;
var Gab = {
	connection: null,
	connectXMPP: function() {
		var conn = new Strophe.Connection(
			xmppHOST());
		conn.connect(userData.jid, userData.password, function(status) {
			if (status === Strophe.Status.CONNECTED) {
				$(document).trigger('connected');
			} else if (status === Strophe.Status.DISCONNECTED) {
				$(document).trigger('disconnected');
			}
		});
		Gab.connection = conn;
	},
	// 进度条控制到底部
	getBottom: function(that) {
		var h = that.find('.qzcht_msg').outerHeight();
		var _h = h - 241 + 60;
		if (h >= 200) {
			that.find('.qzMsgContent').scrollTop(_h);
		}
	},

	//顶部消息变为零
	make_top_zero: function(name) {
		$('.Message_box').find('.top_msglist').each(function() { //顶部的消息条数变为0
			var _n = $(this).attr('data-oldname');
			if (name == _n) {
				$(this).find('.topMsg_count').text(0).hide();
				$(this).find('.Message_state').css('background', 'url("/img/07_2yidu.png") no-repeat center');
			}
		})
	},

	getMessageCount: function() {
		var topLen = $('.topMsg_count').length;
		var num = 0;
		for (var j = 0; j < topLen; j++) {
			var a = $('.topMsg_count').eq(j).text() * 1;
			num += a;
		}
		if (num == 0) {
			$('.messageCount').hide();
		} else {
			$('.messageCount').text(num).show();
		}
	},

	jid_to_name: function(jid) {
		return jid.split('@')[0];
	},
	on_roster: function(iq) {
		Gab.connection.addHandler(Gab.on_presence, null, "presence");
		Gab.connection.send($pres());       
	},
	pending_subscriber: null,
	on_presence: function(presence) { //用户出席 ，监听用户有没有上线
//		console.log(presence);
		var ptype = $(presence).attr('type');
		var from = $(presence).attr('from');
		return true;
	},

	on_roster_changed: function(iq) {			//好友关系变化时触发该函数    比如加好友，拒绝好友
		//console.log(iq)
		$(iq).find('item').each(function() {
			var sub = $(this).attr('subscription');
			var jid = $(this).attr('jid');
			jid = Gab.jid_to_name(jid);
			if (sub === 'remove') {
				var strangename = getURIArgs('from'); //陌生人页面的好友状态变化
				if (strangename == jid) {
					// friendlyMess("对方拒绝了你的好友请求");
					$('.like_addfriend').find('a').html('<i class="personal_jiahaoyou"></i>加为好友').attr('data-relation', 5).addClass('friendBtn');
				}
			}
		});
		return true;
	},

	//获取右侧通讯录信息
	get_Contacts_info: function(fromName, carbon, hasDelay) {
		var info = {};
		if (fromName.indexOf('kefu') > -1) {
			if (carbon) {
				info.imgSrc = mySrc;
			} else {
				info.imgSrc = '/img/xs_zaixiankefu.png';
			}
			info.nickname = '在线客服(官方)';
			info.industry = '';
			return info;
		}
		$('.AddressBook').find('.Chat_list').each(function() {
			var $this = $(this);
			var fName = $this.attr('data-oldname');
			if (fromName == fName) {
				if ($this.attr('data-type') == 'group') { //判断是否为群聊
					var num = $this.attr('data-num');
					var actNum = Math.ceil(num / 2);
					var txt = num + '人加入' + ' | ' + actNum + '人活跃';
					info.chatType = 'group';
					info.imgLength = $this.find('img').length;
					info.isgroup = true;
					info.imgSrc = $this.find('dt').html();
					info.nickname = $this.attr('data-naturename');
					info.industry = txt;
				} else if ($this.attr('data-type') == 'groupchat') { //群组
					var num = $this.attr('data-num');
					var txt = num + '人加入';
					info.chatType = 'groupchat';
					info.imgSrc = $this.find('img').attr('src');
					info.nickname = $this.attr('data-naturename');
					info.industry = txt;
				} else {
					info.chatType = 'chat';
					info.imgSrc = $this.find('img').attr('src');
					info.nickname = $this.find('.nickname').text();
					info.industry = $this.attr("data-myindustry");
				}
				if (!hasDelay) {
					$this.attr('data-off', 1); //将通讯录里面的数据开关变成1，让其不能再点
				}
			}
		});
		return info;
	},
	//监听服务器推送的iq消息
	on_receive: function(iq) {
		console.log(iq);
		var id = $(iq).attr('id');
		var iq = $iq({
			id: id,
			type: 'result'
		}).c('sync', {
			xmlns: 'fc:msg:sync'
		});
		Gab.connection.sendIQ(iq);
		return true;
	},
	//确认收到消息向服务器发送消息
	send_finish: function(version) {
//		console.log(version)
		var a = $iq({                           
			type: 'set'
		}).c('fin', {
			xmlns: 'fc:msg:sync',
			version: version
		});
//		a的解释：服务器端收到类似这样的<iq type="set" id ="F8mQv-5">
//										<fin xmlns="fc:msg:sync"  version="1423450823107" />
//									</iq>
		console.log('确认消息已接收')
		Gab.connection.sendIQ(a);
	},
	//160s活跃期的消息回复
	message_setTime: function(version) {
		clearInterval(receive_timer);
		receive_timer = setInterval(function() {
			Gab.send_finish(version);
		}, 160000);
	},

	//过滤掉无用的重复的消息
	filter_repeat_message: function(version) {
		var off = true;
		for (var i in chat_version) {
			if (chat_version[i] == version) {
				off = false;
				break;
			}
		}
		if (off) chat_version.push(version);
		return off;
	},
	//拉黑
	pull_black: function (msg) {
		var codeAttr = $(msg).find("error").attr("code");
		if (codeAttr == 503 || codeAttr == 406) {
			warningMessage("由于您或对方已被拉黑，该消息被拒收。");
		}
		return true;
	},
	//离线消息
	off_message: function (version) {
		console.log(version)
		var count = $iq({
			type: 'get'
		}).c('query', {
			xmlns: 'fc:msg:offline:amount',
			version: version
		});
		Gab.connection.sendIQ(count);
	},
	//离线消息数量
	off_amount: function (iq) {   
		console.log(iq)
		var amount = $(iq).find('query');
		if (amount.attr("xmlns") == "fc:msg:offline:amount") {
			Gab.off_messagePage();
		}
		if (amount.attr("xmlns") == "fc:msg:offline:page") {
			var l = amount.find('message').length;
			var version = amount.find('message')[l - 1];
			if (amount.attr("count") != 0) Gab.off_messagePage($(version).attr("version"));     //最后一条消息的版本号

			for (var i = 0; i < amount.find('message').length; i++) {
				Gab.on_message(amount.find('message')[i]);
			}
		}
		return true;
	},
	//分页拉取离线消息
	off_messagePage: function (version) {
		// if(num >2000) return false;
		// var page = Math.ceil(num / 20);
		var count = $iq({
			type: 'get'
		}).c('query', {
			xmlns: 'fc:msg:offline:page',
			limit: 20,
			version: version || versionTag
		});
		Gab.connection.sendIQ(count);
	},
	//消息最后一条version  离线消息
	offline_version: function (version) {
		var versionArr = store('version') || [];
		if (versionArr.length == 0) {
			var versionObj = {};
			versionObj.name = username;
			versionObj.version = version;
			versionArr.push(versionObj)
		} else {
			var tag_v = true;
			for (var i in versionArr) {
				if (versionArr[i].name == username) {
					versionArr[i].version = version;
					tag_v = false;
				}
			}
			if (tag_v) {
				var versionObj1 = {};
				versionObj1.name = username;
				versionObj1.version = version;
				versionArr.push(versionObj1)
			}
		}
		store.set("version", versionArr);
	},
	//监听收到消息
	on_message: function(message) { //收到消息
	console.log(message)
		var msgtype = $(message).attr("type"); //聊天类型
		var delay = $(message).find('delay');
		var from = $(message).attr('from').split('/')[0];
		
		//获取这条消息的用户名
		if(msgtype != "chat"){          //群聊或者聊天室
			var fromUser = $(message).attr('from').split('-')[1] || $(message).attr('from').split('/')[1];
			var fromUser2 = from.split('@')[0];
		} else{
			var fromUser = from.split('@')[0];
		}
		var carbon = $(message).find('carbon').attr('xmlns');
		var g_name = ''; //用来过滤收到来自于自己的群组消息
		var receipt = $(message).find('receipt').attr('xmlns');          //用于消息可靠性客户端发给服务器的消息，以<receipt xmlns="fc:msg:clt"/>标签，表示需要确认；服务器以<receipt xmlns="fc:msg:srv"/>标签的进行确认，并带有相同的message id
		var msg = $(message).find('body');
		var redenvelope = $(message).find('redenvelope');      //收到红包的消息标记
		if(redenvelope.length > 0){
			var type = 500;      //红包  自己定义的；
		};
		var version = $(message).attr('version');
		if (version) Gab.offline_version(version);      //离线消息
		chat_num++;
		Gab.message_setTime(version);
		if (chat_num % 4 == 1) {
			Gab.send_finish(version);
			Gab.message_setTime(version);
		}
		if (from != 'quanzinet.com' && from != 'system' && receipt != 'fc:msg:srv') { //去掉系统发送的无用信息
			if (Gab.filter_repeat_message(version) || from == robotName || from == 'imsvrdell1') { //机器人收到的消息没有版本号
				if (from == 'imsvrdell1') { //来自手机端的自己发出去的消息接收处理
					from = $(message).find('carbon').find('message').attr('to').split('/')[0];
				}
				var info = Gab.get_Contacts_info(from, carbon);
				for (var i = 0; i < msg.length; i++) {
					var lang = msg.eq(i).attr("xml:lang");
					var text = msg.eq(i).text();
					if (lang == "type") {
						var type = $.trim(text); //消息类型
					} else if (lang == "avatarfile") {
						var otherSrc = text; //用户头像
						if (!otherSrc || otherSrc == 'null') {
							otherSrc = '/img/first.png';
						} else if (otherSrc.indexOf('http') == -1) {
							if (otherSrc != '/img/first.png') {
								otherSrc = ImgHOST() + otherSrc;
							}
						}
					} else if (lang == "nickname") {
						var nickname = text; //用户昵称
					} else if (lang == "naturename") {
						var naturename = text; //群组昵称
					} else if (lang == "msg") {
						var body = text; //消息内容
						var dealMsg = '';
						if (body.indexOf('\n') > -1) {
							dealMsg = body.replace(/\n/g, '<br/>');
						} else {
							dealMsg = text;
						}
					} else if (lang == "file") {
						var file = text; //图片消息
					} else if (lang == "userType") {  
						var userType = text; //群聊的消息类型
					} else if (lang == "sendTime") {
						var recordTime = text; //群聊的消息类型
					}
				};
				if(type=="204"||type=="205"){        //解决app创建的聊天室群聊  pc端没打开通讯录，读取到的消息让当前用户上线 ，解决pc端发不出去消息的bug
					if(type=='204'){       //聊天室       
						MucgroupMy(1)       //获取成员
					}else if(type=='205'){      //群聊
						MucgroupMy(2)
					};
					var bodyMsg=JSON.parse(body);  
					Gab.connection.send(
				 		$pres({
				 			to:bodyMsg.roomname+ "@conference.imsvrdell1" + "/" + bodyMsg.naturalName + "-" + username
			 			})
				 	);
				}else if (type == "206") {      //被提出群
					MucgroupMy(2);
					var bodyMsg = JSON.parse(body);
					$(".qzchat_frame").each(function () {
						var _thisName = $(this).attr("data-oldname").split("@")[0];
						if (_thisName == bodyMsg.roomname) {
							$(this).find(".closeChat").click();
						}
					});
					removeHistory(bodyMsg.roomname + '@conference.imsvrdell1');
				}

				if (!info.imgSrc || username.indexOf('kefu') > -1) {
					info.imgSrc = otherSrc;
					info.nickname = nickname;
					info.industry = '';
				}
				if(from.indexOf("kefu")>-1){
					clearInterval(times);       //当收到客服发的消息时，清除定时器
				};
				if (from == robotName) {
					info.imgSrc = '/img/friendShareDefalt.png';
					info.nickname = '圈子(机器人)';
					info.industry = '';
				}

				if (msgtype == 'groupchat') {
					g_name = $(message).attr('from').split('-')[1] || $(message).attr('from').split('/')[1];    //群聊自己发送的消息不用再显示
					var app_name = $(message).attr('from').split('/')[1];
					if (app_name == username) {        //判断来自自己的消息
						carbon = 1;
					}
				}

				// pc群聊自己发的消息不展示      app 消息有id  群聊消息同步 
				//server-pushed是系统发的消息
				if ((g_name != username || $(message).attr("id"))&&from != 'server-pushed') {
					if (type == 0 || type == 1 || type == 4 || type == 2 || type == 3 || type == 500) { //2语音   3位置  4视频   500红包
						//收到图文消息
						if (type == 1 || type == 4) body = file;
						if (info.imgSrc == '/img/xs_zaixiankefu.png') {
							otherSrc = info.imgSrc;
						}
						Gab.append_other_message(from, fromUser, otherSrc, dealMsg && dealMsg != 'null' ? dealMsg : body, type, recordTime, carbon ? 1 : '');
					} else if (type == 20 || type == 21 || type == 22) {
						//收到名片消息  ||  推荐圈子
						Gab.append_other_cardMessage(from, fromUser, otherSrc, dealMsg, type, carbon ? 1 : '')
					}
					if (userType == 3 || info.chatType == "group") {					//群聊
						if(info.imgSrc.indexOf("<img") == -1){
							info.imgSrc = "<img src='/img/first.png' />";
							info.nickname = naturename;
						};
						 for (var i in groupChatArr) {                //解决多端登录  app创建群聊，pc端没有出席，重新做出席
						 	if(fromUser2==groupChatArr[i].name){
						 		var statueOnline=true;
						 	}
						 }
						 if(!statueOnline){       //出席
						 	 Gab.connection.send(
						 		$pres({
						 			to: fromUser2 + "@conference.imsvrdell1" + "/" + fromUser2 + "-" + username
						 		})
						 	);
						 };
						Gab.append_top_message(from, info.imgSrc, info.nickname, info.industry, body, type, 'group', naturename, userType, info.imgLength);
					} else if (userType == 2 || info.chatType == "groupchat") {     //    聊天室
						if(info.imgSrc.indexOf("<img") == -1){
							info.imgSrc = "/img/first.png";
							info.nickname = naturename;
						};
						for (var i in groupArr) {                //解决多端登录  app创建群聊，pc端没有出席，重新做出席
						 	if(fromUser2==groupArr[i].name){
						 		var statueOnline=true;
						 	}
						 }
						 if(!statueOnline){       //出席
						 	 Gab.connection.send(
						 		$pres({
						 			to: fromUser2 + "@conference.imsvrdell1" + "/" + fromUser2 + "-" + username
						 		})
						 	);
						 };
						Gab.append_top_message(from, info.imgSrc, info.nickname, info.industry, body, type, msgtype, naturename, userType, info.imgLength);
					} else {
						Gab.append_top_message(from, info.imgSrc, info.nickname, info.industry, body, type, msgtype, naturename);
					}
					Gab.append_red_bottom(from);
				}
			}

		}

		return true;
	},

	append_my_message: function(name, msgs) {
		var a = msgs;
		if (a.indexOf('\n') > -1) {
			a = msgs.replace(/\n/g, '<br>');
		}
		var myStr = '<div class="qz_xx qz_xx02 clear">'+
			'<div class="lt_xx">'+
				'<span class="txt">' + toFaceImg(a) + '</span>'+
				'</div>'+
				'</div>';
		$('#textBox').parents('.qzchat_frame').find('.qzcht_msg').append(myStr);
		//存储点击发送的内容
		storeSendData(name, a);
		Gab.getBottom($('#textBox').parents('.qzchat_frame'));
	},

	append_red_bottom: function(oldname) {
		$('.qzchat_frame').each(function() {
			var name = $(this).attr('data-oldname');
			if (oldname == name && $(this).find('.minimize').css('display') == 'block') {
				$(this).find('.minimize').find('i').addClass('qz_inform');
			}
		})
	},

	// 收到消息
	//Gab.append_other_message(from, fromUser, otherSrc, dealMsg && dealMsg != 'null' ? dealMsg : body, type, recordTime, carbon ? 1 : '');
	append_other_message: function(othername, fromUser, otherSrc, msgs, msgtype, recordTime, carbon) { //carbon用来区分是否是自己发送的消息
		var resStr = '';
		if (msgtype == 1 || msgtype == 4) {
			if (msgs.indexOf('http') == -1) {
				msgs = ImgHOST() + msgs;
			}
		}
		if (msgtype == 0) { //0 文字   1图片
			if (carbon) {
				resStr += '<div class="qz_xx qz_xx02 clear">\
				<div class="lt_xx"><span class="txt">' + toFaceImg(msgs) + '</span></div></div>';
			} else {
				resStr += '<div class="qz_xx qz_xx01 clear"><div class="yh_t1" data-name='+ fromUser +'><a class="df_img" href="javascript:;">' +
					'<img src="' + otherSrc + '"></a></div><div class="lt_xx"><span class="txt">' + toFaceImg(msgs) + '</span></div></div>'
			}
		} else if (msgtype == 1) {
			if (carbon) {
				resStr += '<div class="qz_xx qz_xx02 clear">' +
					'<div class="lt_xx"><img class="msg-img" src="' + msgs + '"></div></div>';
			} else {
				resStr += '<div class="qz_xx qz_xx01 clear"><div class="yh_t1" data-name='+ fromUser +'><a class="df_img" href="javascript:;">' +
					'<img src="' + otherSrc + '"></a></div><div class="lt_xx"><img class="msg-img" src="' + msgs + '"></div></div>'
			}
		} else if (msgtype == 2) {
			msgs = '[收到语音消息,请在app上查看]';
			if (carbon) {
				resStr += '<div class="qz_xx qz_xx02 clear">' +
					'<div class="lt_xx"><img class="msg-img" src="' + msgs + '"></div></div>';
			}else{
				resStr += '<div class="qz_xx qz_xx01 clear"><div class="yh_t1" data-name='+ fromUser +'><a class="df_img" href="javascript:;">' +
				'<img src="' + otherSrc + '"></a></div><div class="lt_xx"><span class="txt">' + msgs + '</span></div></div>';
			}
		}  else if (msgtype == 3) {       //地理位置
			msgs = '[收到位置消息,请在app上查看]';
			if (carbon) {
				resStr += '<div class="qz_xx qz_xx02 clear">' +
					'<div class="lt_xx"><img class="msg-img" src="' + msgs + '"></div></div>';
			}else{
				resStr += '<div class="qz_xx qz_xx01 clear"><div class="yh_t1" data-name='+ fromUser +'><a class="df_img" href="javascript:;">' +
				'<img src="' + otherSrc + '"></a></div><div class="lt_xx"><span class="txt">' + msgs + '</span></div></div>';
			}
		} else if (msgtype == 500) {    //红包信息
			msgs = '[收到红包消息,请在app上查看]';
			if (carbon) {
				resStr += '<div class="qz_xx qz_xx02 clear">' +
					'<div class="lt_xx"><img class="msg-img" src="' + msgs + '"></div></div>';
			}else{
				resStr += '<div class="qz_xx qz_xx01 clear"><div class="yh_t1" data-name='+ fromUser +'><a class="df_img" href="javascript:;">' +
				'<img src="' + otherSrc + '"></a></div><div class="lt_xx"><span class="txt">' + msgs + '</span></div></div>';
			}
		}else if (msgtype == 4) {
			msgs = msgs + '-s';
			if (carbon) {
				resStr += '<div class="qz_xx qz_xx02 clear">' +    
					'<div class="lt_xx"><img class="video-show" src="' + msgs + '"><div class="chat_video_play"></div></div></div>';
			} else {
				resStr += '<div class="qz_xx qz_xx01 clear"><div class="yh_t1" data-name='+ fromUser +'><a class="df_img" href="javascript:;">' +
					'<img src="' + otherSrc + '"></a></div>' +
					'<span class="chat_video_wrap">' +
					'<img class="video-show" src="' + msgs + '">' +
					'<div class="chat_video_play"></div></span></div>';
			}

		}

		if (carbon) { //将自己的消息放进消息框当中     存储自己发出的消息   othername发消息着的名字            msgs消息内容
			storeSendData(othername, msgs);
		} else {                                          //存储收到的消息    othername收到发来消息着的名字            msgs消息内容    otherSrc收到发来的消息人的头像   fromUser 消息来自谁
			storeMsgData(othername, msgs, otherSrc,fromUser);
		}
		$('.qzchat_frame').each(function() {
			var _this = $(this);
			var n = _this.attr('data-oldname');
			if (n == othername) {
				_this.find('.qzcht_msg').append(resStr);
				Gab.getBottom(_this);
			}
		});
	},

	// 收到名片消息
	append_other_cardMessage: function(othername, fromUser, Src, body, type, carbon) {
		$('.no_message').hide(); //来消息将上部显示内容隐藏掉
		var msgs = JSON.parse(body);
		var resStr = '';
		if (type == 20) { //收到名片
			msgs.type = "20";
			var otherSrc = '';
			if (msgs.image.indexOf('http') > -1) {
				otherSrc = msgs.image;
			} else {
				otherSrc = ImgHOST() + msgs.image;
			}
			resStr += '<div class="qz_xx qz_xx01 clear">' +
				'<div class="yh_t1" data-name='+ fromUser +'><a class="df_img" href="javascript:;"><img src="' + Src + '"></a></div>' +
				'<div class="idCard" data-othername="' + msgs.username + '"><p class="idCardTittle">个人名片</p><dl>' +
				'<dt class="cardImg"><img src="' + otherSrc + '""></dt><dd class="cardNikeName"><span>' + msgs.nickname + '</span></dd>' +
				'<dd class="cardTel">圈子号：<span>' + msgs.magicno + '</span></dd><div class="clear"></div></dl></div></div>';


		} else if (type == 22) { //转发
			msgs.type = "22";
			resStr += '<div class="qz_xx qz_xx01 clear">' +
				'<div class="yh_t1" data-name='+ fromUser +'><a class="df_img" href="javascript:;">' +
				'<img src="' + Src + '"></a></div>' +
				'<div class="friendShare" style="float: ' + (carbon ? 'right' : 'left') + ';">' +
				'<dl>' +
				'<dt class="friendShareImg"><a href="' + msgs.shareUrl + '">' +
				'<img style="width: 100%;height: 100%;" src="' + msgs.shareImageUrl + '">';
			if (msgs.shareImageType == 1) {
				resStr += '<div class="videoPoster"><img src="/img/xx_shipin.png"></div>';
			}
			resStr += '</a></dt>' +
				'<dd class="shareTittle">圈子分享</dd>' +
				' <dd><a class="shareContent" href="' + msgs.shareUrl + '">' + msgs.shareTitle + '</a></dd>' +
				'<div class="clear"></div></dl></div></div>';
		} else if (type == 21) {
			msgs.type = "21";
			resStr += '<div class="qz_xx qz_xx01 clear">' +
				'<div class="yh_t1" data-name='+ fromUser +'><a class="df_img" href="javascript:;">' +
				'<img src="' + Src + '"></a></div>' +
				'<div class="idCard sendCicleInfo" data-code="' + msgs.circleNo + '" style="float: ' + (carbon ? 'right' : 'left') + ';" data-cache="' + msgs.category + '">' +
				'<p class="idCardTittle">推荐圈子</p>' +
				'<dl><dt class="cardImg">' +
				'<img src="' + msgs.image + '"></dt>' +
				'<dd class="cardNikeName">' +
				'<span>' + msgs.nickname + '</span>' +
				'</dd><div class="clear"></div>' +
				'</dl></div></div>';
		}

		if (carbon) { //将自己的消息放进消息框当中       存储发出的 消息
			storeSendData(othername, msgs);
		} else {
			storeMsgData(othername, msgs, Src,fromUser); //存储收到的消息
		}

		$('.qzchat_frame').each(function() {
			var _this = $(this);
			var n = _this.attr('data-oldname');
			if (n == othername) {
				_this.find('.qzcht_msg').append(resStr);
				Gab.getBottom(_this);
			}
		});
	},
	/*聊天框左侧通讯信息*/          //旧的聊天框左侧信息，现在已弃用。。。。。。。           
//	append_left_message: function(name, msgImg, msgName, industry, msgs, type, msgtype, naturename, groupType, imgLength) {
//		if (type == 1) {
//			msgs = '[图片]';
//		} else if (type == 4) {
//			msgs = '[视频]';
//		} else if (type == 2) {
//			msgs = '[收到语音消息,请在app上查看]';
//		} else if (type == 3) {    //位置
//			msgs = '[收到位置消息,请在app上查看]';
//		} else if (type == 500) {
//			msgs = '[收到红包消息,请在app上查看]';
//		} else if (type == 20) {
//			msgs = '[个人名片]';
//		} else if (type == 21) {
//			msgs = '[推荐圈子]';
//		} else if (type == 22) {
//			msgs = '[分享动态]';
//		}
//		var msgInfo = '<li class="msgs_list"  data-type="' + msgtype + '" data-naturename="' + naturename + '" data-myindustry="' + industry + '" data-oldname="' + name + '"><dl>' +
//			'<dt class="_userImg';
//		if (groupType == 3) {
//			msgInfo += ' img_list_' + imgLength + '">' + msgImg;
//		} else {
//			msgInfo += '"><img src="' + msgImg + '">';
//		}
//		msgInfo += '<i class="countMsg">1</i></dt>' +
//			'<dd class="user"><span class="username">' + msgName + '</span><span class="sendTime">' + getNowFormatDate() + '</span></dd>' +
//			'<dd class="userInfo">' + toFaceImg(msgs) + '</dd><div class="clear"></div></dl></li>';
//		// console.log(groupType, msgInfo)
//		if ($('.groupWrap>ul>li').hasClass('msgs_list') == false) {
//			$('.groupWrap>ul').prepend(msgInfo);
//		} else {
//			var handle = false;
//			$('.msgs_list').each(function() {
//				var _n = $(this).attr('data-oldname');
//				if (name == _n) {
//					/*如果来的消息的用户已发送过消息
//					1.改变聊天框左侧通讯的内容 2.改变顶部导航消息的内容*/
//					var n = $(this).find('.countMsg').text() * 1;
//					if ($(this).hasClass('chatActive') == false) {
//						n++;
//						$(this).find('.countMsg').text(n).show();
//					}
//					$(this).find('.userInfo').html(toFaceImg(msgs));
//					$(this).find('.sendTime').text(getNowFormatDate());
//					handle = true;
//				}
//			});
//			if (handle == false) {
//				$('.groupWrap>ul').prepend(msgInfo);
//			}
//		};
//	},

	append_top_message: function(toName, msgImg, msgName, industry, msgs, type, msgtype, naturename, groupType, imgLength) {
		if (type == 1) {
			msgs = '[图片]';
		} else if (type == 4) {
			msgs = '[视频]';
		} else if (type == 2) {
			msgs = '[收到语音消息,请在app上查看]';
		} else if (type == 3) {
			msgs = '[收到位置消息,请在app上查看]';
		} else if (type == 500) {
			msgs = '[收到红包消息,请在app上查看]';
		} else if (type == 20) {
			msgs = '[个人名片]';
		} else if (type == 21) {
			msgs = '[推荐圈子]';
		} else if (type == 22) {
			msgs = '[分享动态]';
		}
		/*导航顶部的消息框    显示为[图片]   */
		var topMsg = '<li class="top_msglist RequestList" data-naturename="' + naturename + '" data-myindustry="' + industry + '" data-type="' + msgtype + '" data-oldname="' + toName +
			'"><dl><dt style="position:relative;"';
		if (groupType == 3 || msgtype == "group") {   //群聊
			topMsg += ' class="img_list_' + imgLength + '">' + msgImg;
		}else{
			topMsg += '><img src="' + msgImg + '">';
		}
		topMsg += '<i class="topMsg_count">1</i></dt><dd class="topMsg_name"><span class="topMsg_nikename">' + msgName + '</span><i class="topMsg_time">' + getNowFormatDate() + '</i></dd>' +
			'<dd><span class="topMsg_data">' + toFaceImg(msgs) + '</span><a class="Message_del del" href="javascript:;"></a>' +
			'<span class="Message_state" style="background: url("/img/07_2yidu.png") center center no-repeat;"></span></dd></dl></li>';
		var topLen = $('.Message_box').find('.top_msglist').length;

		$('.no_message').hide();
		if (topLen == 0) {
			$('.Message_box ul').prepend(topMsg);
			if (toName == robotName) { //如果是机器人聊天的话
				$('.topMsg_count').text(0).hide();
				$('.Message_state').css('background', 'url(/img/07_2yidu.png) no-repeat center');
			}
		} else {
			var topOff = true;
			if (topLen >6) {
				$(".Message_box .msg-parentBox").css('overflow-y',"auto");
			};
			for (var i = 0; i < topLen; i++) {
				var $top = $('.Message_box').find('.top_msglist');
				var _name = $top.eq(i).attr('data-oldname');
				var m = $top.eq(i).find('.topMsg_count').text() * 1;
				if (toName == robotName && _name == robotName) {
					$top.eq(i).find('.topMsg_count').text(0).hide();
					$top.eq(i).find('.Message_state').css('background', 'url(/img/07_2yidu.png) no-repeat center');
					$top.eq(i).find('.topMsg_data').html(msgs);
					topOff = false;
					break;
				} else {
					if (toName == _name) {
						//再此遍历聊天框的显示的
						var rName = $('.rightTop').attr('data-oldname');
						var handle = false;
						$top.eq(i).find('.topMsg_data').html(msgs);
						$top.eq(i).find('.topMsg_time').text(getNowFormatDate());
						$('.qzchat_frame').each(function() {
							var _this = $(this);
							var off = _this.find(".titlebar").hasClass('titlebar_color');
							var name = _this.attr('data-oldname');
							if (off && name == toName) {
								$top.eq(i).find('.topMsg_count').text(0).hide();
								handle = true;
							}
						})
						if (!handle) {
							m++;
							$top.eq(i).find('.topMsg_count').text(m).show();
						}
						topOff = false;
						break;
					}
				}

			}
			if (topOff) {
				$('.Message_box ul').prepend(topMsg);
			}
		}
		Gab.getMessageCount();

	},

	AgreedToTheRequest: function(name, _this) { //同意请求
		Gab.connection.send($pres({
			to: name,
			"type": "subscribed"
		}));
		Gab.connection.send($pres({
			to: name,
			"type": "subscribe"
		}));
		Gab.pending_subscriber = null;
		_this.removeClass("accept");
		_this.html("已添加");
		_this.parents("li").find(".delete,.refuse").remove();
		// 确定请求后标记条数操作
		var num = $(".messageContent .operation_hy .tag").text();
		if (num == 1) {
			$(".messageContent .operation_hy .tag").remove();
			return;
		}
		$(".messageContent .operation_hy .tag").html(num - 1);
	},

	RefuseRequest: function(fr, _this) { //拒绝请求
		/*Gab.connection.send($pres({
			to:fr,
			"type": "unsubscribed"
		}));
		Gab.pending_subscriber = null;
		_this.fadeOut(300, function() {
			_this.remove();
			location.reload()
		});*/
		$.ajax({
			type: "GET",
			url: RestfulHOST() + "/users/roster/reject",
			dataType: "json",
			data: {
				username: username,
				friendname: fr
			},
			headers: {
				"Authorization": "AQAa5HjfUNgCr27x"
			},
			success: function(msg) {
				var tag = $(".tag").text();
				_this.fadeOut(300, function() {
					_this.remove();
					if (tag) {
						if (tag == 1) $(".tag").remove();
						$(".tag").html(Number(tag) - 1);
					}
				});
			},
			error: function() {
				console.log("error")
			}

		});
	}
};

//   群组聊天
var Groupie = { //暂时无用到，忽略
	connection: null,
	room: null,
	nickname: null,

	NS_MUC: "http://jabber.org/protocol/muc",

	joined: null,
	participants: null,

	on_presence: function(presence) {
		return true;
	},

	// 收到群组消息
	on_public_message: function(message) {
		return true;
	},

	add_message: function(msg) {
		// detect if we are scrolled all the way down
		var chat = $('#chat').get(0);
		var at_bottom = chat.scrollTop >= chat.scrollHeight -
			chat.clientHeight;

		$('#chat').append(msg);

		// if we were at the bottom, keep us at the bottom
		if (at_bottom) {
			chat.scrollTop = chat.scrollHeight;
		}
	},

	on_private_message: function(message) {
		var from = $(message).attr('from');
		var room = Strophe.getBareJidFromJid(from);
		var nick = Strophe.getResourceFromJid(from);

		// make sure this message is from the correct room
		if (room === Groupie.room) {
			var body = $(message).children('body').text();
			Groupie.add_message("<div class='message private'>" +
				"@@ &lt;<span class='nick'>" +
				nick + "</span>&gt; <span class='body'>" +
				body + "</span> @@</div>");

		}

		return true;
	}
};

$(function() {
	usersroster();
	MucgroupMy(1)
	MucgroupMy(2);
	Gab.connectXMPP();
})


$(document).bind('connected', function() {
	//单聊
	var iq = $iq({
		type: 'get'
	}).c('query', {
		xmlns: 'jabber:iq:roster'
	});
	Gab.connection.sendIQ(iq, Gab.on_roster);

	Gab.connection.addHandler(Gab.on_roster_changed,
		"jabber:iq:roster", "iq", "set");

	Gab.connection.addHandler(Gab.on_receive,
		null, "iq", "get");
	Gab.connection.addHandler(Gab.on_message,
		null, "message", "chat");
	//黑名单
	Gab.connection.addHandler(Gab.pull_black,
		null, "message", "error");
	
	//离线消息
	Gab.connection.addHandler(Gab.off_amount,
		null, "iq", "result");
	var versionArr = store('version') || [];

	for (var i in versionArr) {
		if (versionArr[i].name == username) {
			versionTag = versionArr[i].version;
		}
	}
	if (versionTag != "") Gab.off_message(versionTag);
	// 群组
	// Groupie.joined = false;
	Groupie.participants = {};
	Gab.connection.send($pres());
	Gab.connection.addHandler(Groupie.on_presence,
		null, "presence");
	Gab.connection.addHandler(Gab.on_message,
		null, "message", "groupchat");
	Gab.connection.addHandler(Groupie.on_private_message,
		null, "message", "chat");

	// 群组上线
//	 for (var i in groupArr) {
//	 	Gab.connection.send(
//	 		$pres({
//	 			to: groupArr[i].name + "@conference.imsvrdell1" + "/" + groupArr[i].nname + "-" + username
//	 		})); 
//	 }

	// for (var i in groupChatArr) {
	// 	Gab.connection.send(
	// 		$pres({
	// 			to: groupChatArr[i].name + "@conference.imsvrdell1" + "/" + groupChatArr[i].nname + "-" + username
	// 		}));
	// }
	
});

$(document).bind('disconnected', function() {
	var msg = '';
	msg = '您已下线，请重新登录';
	if (username) {
		checkNetwork(msg);
	}
	console.log('faile')
	Gab.connection = null;
	Gab.pending_subscriber = null;
});
//网络掉线弹出框
function checkNetwork(msg) {
	$("body").append('<div id="msk" style="z-index:99999999;"><div class="masks1"></div><div class="viewBox1"><span><img src="/img/qz_qqq_!.png"/></span><p>' + msg + '</p></div></div>');
}

//发送图片消息
$(document).on("change", "#image", function() {
	var _this = this;
	if (!isFileType(["jpg", "png", "gif"], _this)) {
		knowMessage("请选择jpg、png、gif格式的图片");
		return false;
	};
	if (!checkFileSize(_this, 5)) {
		knowMessage("上传文件大于5M，请重新上传");
		return false;
	};
	//获取上传的文件大小
	if (navigator.userAgent.indexOf("MSIE 6.0") < 0) {
		if (navigator.userAgent.indexOf("MSIE 7.0") < 0) {
			if (navigator.userAgent.indexOf("MSIE 8.0") < 0) {
				if (navigator.userAgent.indexOf("MSIE 9.0") < 0) {
					var file = $(this)[0].files[0];
					var fileSize = (Math.round(file.size / (1024 * 1024)));
				}
			}
		}
	}
	imgMessageUpload("image", {
		"type": 1,
		"size": fileSize
	});
})


//消息中上传图片  upmsgfilesWeb
function imgMessageUpload(id, data) {
	document.domain = 'quanzinet.com';
	$.ajaxFileUpload({
		url: RestfulHOST() + "/files/upmsgfilesWeb",
		secureuri: false,
		fileElementId: id,
		dataType: 'json',
		timeout: 100000, //超时时间设置
		data: data,
		success: function(msg) {
			var type = $('#textBox').parents('.qzchat_frame').attr('data-type');
			if (type == 'groupchat') {
				sendMessage("", "groupchat", 1, '', ImgHOST() + msg.filename, 2);
			} else if (type == 'group') {
				sendMessage("", "groupchat", 1, '', ImgHOST() + msg.filename, 3);

			} else {
				sendMessage("", "chat", 1, '', ImgHOST() + msg.filename);

			}
		},
		error: function() {
			console.log("error");
		}
	});
}

//发送图片
function sendImage(toName, file) {
	var myStr = '<div class="qz_xx qz_xx02 clear">'+
				'<div class="lt_xx">'+
				'<img class="msg-img" src="' + file + '">'+
				'</div>'+
				'</div>';
	var $textBox = $('#textBox').parents('.qzchat_frame');
	$textBox.find('.qzcht_msg').append(myStr);
	Gab.getBottom($textBox);
	//存储图片的信息
	storeSendData(toName, file);
};

/* type=0 //文本消息
 type=1 // 图片消息
 type=2 // 语音消息
 type=3 //地理位置消息
 type=4 //视频消息
 type=5 //文件消息
 type=6 //系统消息 
 type = 7 //未知的消息类型 
 type = 8 //未知的消息类型 
 type=9 //视频通话
 type=10 //音频通话
 type=14 //焚毁消息
 type = 20 //个人名片 
 type = 21 // 群名片
 type = 22 // 帖子 
 type = 23 //公众号名片
 type = 30 //消息撤回 
 
 //群组相关
 type=201, //群组申请
 type=202, //同意加群申请
 type=203, //拒绝加群申请
 type=204, //邀请加入群     聊天室
 type=205, //邀请加入讨论组      群聊
 type=206, //踢出群
 type=207, //踢出讨论组
 type=209, //群组更新
 
 type=220, //管理员关闭闪聊
 type=221, //管理员重启闪聊
 type=222, //禁言
 type=223, //解禁言
 
 //关注与粉丝
 type=301,    //新增一个粉丝，被关注
 type=302,  //减少一个粉丝，被取消关注
 type=303,    //减少一个关注，被移除粉丝
 
 //for ios
 type = 387, //成为好友,
 type=388, //消息时间
 
 //订阅号相关
 type=400, //订阅号回复的消息      没有这个
 type=401, //订阅号首次订阅时发的欢迎消息、纯文字消息
 type=402, //订阅号发的推送图文（1条）
 type=403, //订阅号发的推送图文（多条）
 type=404, //订阅号发的纯图片
 type=405, //订阅号发的纯视频（视频图文形式展示）*/



//发送
var times="";
function sendMessage(msgs, msgtype, type, to_name, file, userType) {
	var $right = $('#textBox').parents(".qzchat_frame");
	var to_name = to_name || $right.attr('data-oldname'); //发送到的那个人的原始用户名s
	var naturename = $right.attr('data-naturename');
	var timestamp = new Date().getTime();
	var to_src = '';
	var file = file || '';
	var userType = userType || '';
	var info = Gab.get_Contacts_info(to_name);
	var to_industry = $right.find('.occupation').text(); //职业
	var to_nickname = $right.find('.qz_dfuser').text(); //昵称
	var my_data = {
		src: mySrc,
		nickname: getCookie("nickname"),
		realindustry: getCookie('myindustry')
	};
	if ($right.attr('data-type') == 'group') {
		to_src = info.imgSrc;
	} else {
		to_src = $right.find('.df_img').attr('src');
	}
	if (msgs != '' || file != '') {
//		if (msgs != '' && msgs.indexOf('\n') > -1) {
//			msgs = msgs.slice(0, -1);
	var kfWord = '当前客服繁忙，请继续等待。<br>如有问题请发送至 客服邮箱：<br>	kefu@quanzinet.com';
    var kfMsg = '<div class="qz_xx qz_xx01 clear"><div class="yh_t1" data-name="kefu_5"><a class="df_img" href="javascript:;"><img src="/img/xs_zaixiankefu.png"></a></div><div class="lt_xx"><span class="txt">当前客服繁忙，请继续等待。<br>如有问题请发送至 客服邮箱：<br>	kefu@quanzinet.com</span></div></div>'
	if(to_name.indexOf("kefu")>-1){       //客服繁忙时的处理
		clearInterval(times);
		times=setTimeout(function(){
			$('.qzchat_frame').each(function() {
				var _this = $(this);
				var n = _this.attr('data-oldname');
				if (n.indexOf("kefu")>-1) {
					_this.find('.qzcht_msg').append(kfMsg);
					Gab.getBottom(_this);
					storeMsgData(to_name, kfWord, to_src,to_name);
				}
			});	
		},5000)
	};
		var message = $msg({
				to: to_name,
				type: msgtype,
				realindustry: my_data.realindustry
			})
			.c('body', {"xml:lang": "sendTime"}).t(timestamp).up() //时间戳
			.c('body', {"xml:lang": "type"}).t(type).up() //消息类型  
			.c('body', {"xml:lang": "avatarfile"}).t(my_data.src).up() //用户头像
			.c('body', {"xml:lang": "nickname"}).t(my_data.nickname).up() //用户昵称
			.c('body', {"xml:lang": "naturename"}).t(naturename).up() //群昵称
			.c('body', {"xml:lang": "file"}).t(file).up() //图片消息
			.c('body', {"xml:lang": "msg"}).t(msgs).up() //消息内容
			.c('body', {"xml:lang": "userType"}).t(userType).up() //群聊类型
		Gab.connection.send(message);
		var msg = Gab.get_Contacts_info(to_name);
		if (msgtype == "chat") {
			if (type == 0) {
				Gab.append_my_message(to_name, msgs);
			} else if (type == 1) {
				sendImage(to_name, file);
			} else if (type == 20 || type == 21 || type == 22) {
				to_src = msg.imgSrc;
				to_industry = msg.industry;
				to_nickname = msg.nickname;
				sendContact(type, to_name, msgs, my_data.src)
			}
		} else {
			sendMucMsg(msgs ? msgs : file, my_data.src, to_name); //发送群组消息
		}
		if (userType == 3) {
			var len = $('#textBox').parents(".qzchat_frame").find('.groupInformation').children().length;
			Gab.append_top_message(to_name, to_src, to_nickname, to_industry, msgs, type, 'group', naturename, userType, len);
		} else if (userType == 2) {
			Gab.append_top_message(to_name, to_src, to_nickname, to_industry, msgs, type, msgtype, naturename, userType);
		} else {
			Gab.append_top_message(to_name, to_src, to_nickname, to_industry, msgs, type, msgtype, naturename);
		}
	}
	$('#textBox').val('').focus();
}

//获取聊天历史记录
function getChatHistory(_name) {
	var objArr = store('msg_history') || [];
	var info = Gab.get_Contacts_info(_name);
	var _str = '';
	for (var i = 0; i < objArr.length; i++) {
		if (objArr[i].name == _name) {
			for (var j = 0; j < objArr[i].data.length; j++) {
				//判断收到的消息
				if (objArr[i].data[j].from != '') {
					if (objArr[i].data[j].from.type) {
						if (objArr[i].data[j].from.type == 22) {
							var shareStr = objArr[i].data[j].from.shareImageUrl;
							if (shareStr == '') {
								shareStr = '/img/friendShareDefalt.png';
							}
							_str += '<div class="qz_xx qz_xx01 clear">' +
								'<div class="yh_t1" data-name='+ objArr[i].data[j].fromUser +'><a class="df_img" href="javascript:;">' +
								'<img src="' + objArr[i].data[j].fromSrc + '"></a></div>' +
								'<div class="friendShare" style="float: left;">' +
								'<dl>' +
								'<dt class="friendShareImg"><a href="' + objArr[i].data[j].from.shareUrl + '">' +
								'<img style="width: 100%;height: 100%;" src="' + shareStr + '">';
							if (objArr[i].data[j].from.shareImageType == 1) {
								_str += '<div class="videoPoster"><img src="/img/xx_shipin.png"></div>';
							}
							_str += '</a></dt>' +
								'<dd class="shareTittle">圈子分享</dd>' +
								' <dd><a class="shareContent" href="' + objArr[i].data[j].from.shareUrl + '">' + objArr[i].data[j].from.shareTitle + '</a></dd>' +
								'<div class="clear"></div>' +
								'</dl>' +
								'</div>' +
								'</div>';
						} else if (objArr[i].data[j].from.type == 20) {
							var cardSrc = '';
							if (objArr[i].data[j].from.image.indexOf('http') > -1) {
								cardSrc = objArr[i].data[j].from.image;
							} else {
								cardSrc = ImgHOST() + objArr[i].data[j].from.image;
							}
							_str += '<div class="qz_xx qz_xx01 clear">' +
								'<div class="yh_t1" data-name='+ objArr[i].data[j].fromUser +'><a class="df_img" href="javascript:;">' +
								'<img src="' + objArr[i].data[j].fromSrc + '"></a></div>' +
								'<div class="idCard"  data-othername="' + objArr[i].data[j].from.username + '" style="float: left;"><p class="idCardTittle">个人名片</p>' +
								'<dl><dt class="cardImg" ><img src="' + cardSrc + '"></dt>' +
								'<dd class="cardNikeName" ><span>' + objArr[i].data[j].from.nickname + '</span></dd>' +
								'<dd class="cardTel">圈子号：<span>' + objArr[i].data[j].from.magicno + '</span></dd>' +
								'<div class="clear"></div></dl><div class="clear"></div></div></div>';
						} else if (objArr[i].data[j].from.type == 21) {
							_str += '<div class="qz_xx qz_xx01 clear">' +
								'<div class="yh_t1" data-name='+ objArr[i].data[j].fromUser +'><a class="df_img" href="javascript:;">' +
								'<img src="' + objArr[i].data[j].fromSrc + '"></a></div>' +
								'<div class="idCard sendCicleInfo" data-code="' + objArr[i].data[j].from.circleNo +
								' "data-cache="' + objArr[i].data[j].from.category + '" style="float: left;"><p class="idCardTittle">推荐圈子</p>' +
								'<dl><dt class="cardImg"><img src="' + objArr[i].data[j].from.image + '">' +
								'</dt><dd class="cardNikeName"><span>' + objArr[i].data[j].from.nickname + '</span>' +
								'<div class="clear"></div></dl></div></div>';
						}
					} else {
						var userAvatar = objArr[i].data[j].fromSrc;
						if (objArr[i].data[j].from.indexOf('-s') > -1) { //收到视频消息
							_str += '<div class="qz_xx qz_xx01 clear"><div class="yh_t1" data-name='+ objArr[i].data[j].fromUser +'><a class="df_img" href="javascript:;">' +
								'<img src="' + ((userAvatar) ? userAvatar : info.src) + '"></a></div>' +
								'<span class="chat_video_wrap">' +
								'<img class="video-show" src="' + objArr[i].data[j].from + '">' +
								'<div class="chat_video_play"></div></span></div>';
						} else if (objArr[i].data[j].from.indexOf('http') > -1) {
							_str += '<div class="qz_xx qz_xx01 clear"><div class="yh_t1" data-name='+ objArr[i].data[j].fromUser +'><a class="df_img" href="javascript:;">' +
								'<img src="' + ((userAvatar) ? userAvatar : info.src) + '"></a></div><div class="lt_xx"><img class="msg-img" src="' + objArr[i].data[j].from + '"></div></div>'
						} else {
							_str += '<div class="qz_xx qz_xx01 clear"><div class="yh_t1" data-name='+ objArr[i].data[j].fromUser +'><a class="df_img" href="javascript:;">' +
								'<img src="' + ((userAvatar) ? userAvatar : info.src) + '"></a></div><div class="lt_xx"><span class="txt">' +
								toFaceImg(objArr[i].data[j].from) + '</span></div></div>'
						}
					}
				}
				//判断发出去的消息
				if (objArr[i].data[j].to != '') {
					if (objArr[i].data[j].to.type) {
						if (objArr[i].data[j].to.type == 22) {
							var shareStr = objArr[i].data[j].to.shareImageUrl;
							if (shareStr == '') {
								shareStr = '/img/friendShareDefalt.png';
							}
							_str += '<div class="qz_xx qz_xx02 clear">' +
								'<div class="friendShare">' +
								'<dl>' +
								'<dt class="friendShareImg"><a href="' + objArr[i].data[j].to.shareUrl + '">' +
								'<img style="width: 100%;height: 100%;" src="' + shareStr + '">';
							if (objArr[i].data[j].to.shareImageType == 1) {
								_str += '<div class="videoPoster"><img src="/img/xx_shipin.png"></div>';
							}
							_str += '</a></dt>' +
								'<dd class="shareTittle">圈子分享</dd>' +
								' <dd><a class="shareContent" href="' + objArr[i].data[j].to.shareUrl + '">' + objArr[i].data[j].to.shareTitle + '</a></dd>' +
								'<div class="clear"></div>' +
								'</dl>' +
								'</div>' +
								'</div>';
						} else if (objArr[i].data[j].to.type == 20) {
							var card_str = objArr[i].data[j].to.image; //名片的图片地址判断
							if (card_str.indexOf('http') == -1) {
								card_str = ImgHOST() + card_str;
							}
							_str += '<div class="qz_xx qz_xx02 clear">' +
								'<div class="idCard" data-othername="' + objArr[i].data[j].to.username + '"><p class="idCardTittle">个人名片</p>' +
								'<dl><dt class="cardImg" ><img src="' + card_str + '"></dt>' +
								'<dd class="cardNikeName" ><span>' + objArr[i].data[j].to.nickname + '</span></dd>' +
								'<dd class="cardTel">圈子号：<span>' + objArr[i].data[j].to.magicno + '</span></dd>' +
								'<div class="clear"></div></dl></div></div>';
						} else if (objArr[i].data[j].to.type == 21) {
							_str += '<div class="qz_xx qz_xx02 clear">' +
								'<div class="idCard sendCicleInfo" data-code="' + objArr[i].data[j].to.circleNo + ' "data-cache="' + objArr[i].data[j].to.category + '">' +
								'<p class="idCardTittle">推荐圈子</p><dl><dt class="cardImg">' +
								'<img src="' + objArr[i].data[j].to.image + '"></dt>' +
								'<dd class="cardNikeName"><span>' + objArr[i].data[j].to.nickname + '</span>' +
								'<div class="clear"></div></dl></div></div>';
						}
					} else {
						if (objArr[i].data[j].to.indexOf('-s') > -1) {
							_str += '<div class="qz_xx qz_xx02 clear">' +
								'<div class="lt_xx"><img class="video-show" src="' + objArr[i].data[j].to + '"><div class="chat_video_play"></div></div></div>';

						} else if (objArr[i].data[j].to.indexOf('http') > -1) {
							_str += '<div class="qz_xx qz_xx02 clear">'+
							'<div class="lt_xx"><img class="msg-img" src="' + objArr[i].data[j].to + '">'+
						'</div></div>';
						} else {
							var a = objArr[i].data[j].to;
							if (a.indexOf('\n') > -1) {
								a = a.replace(/\n/g, '<br>');
							}
							_str += '<div class="qz_xx qz_xx02 clear">'+
							'<div class="lt_xx"><span class="txt">' + toFaceImg(a) + '</span>'+
							'</div></div>';
						}
					}
				}
			};
			return _str;
		}
	}
};

//得到自己的头像
function getMySrc() {
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
};

/*存储发送的信息*/
function storeSendData(sendName, sendContent) {
	var objArr = store('msg_history') || [];
	var objLen = objArr.length;
	if (objLen == 0) {
		var obj1 = {};
		var dataArr1 = [];
		var dataObj1 = {};
		obj1.name = sendName;
		dataObj1.from = '';
		dataObj1.fromDate = '';
		dataObj1.to = sendContent;
		dataObj1.toData = getNowFormatDate();
		dataArr1.push(dataObj1);
		obj1.data = dataArr1;
		objArr.push(obj1);
	} else {
		var dataOff = true;
		for (var i = 0; i < objArr.length; i++) {
			if (objArr[i].name == sendName) {            //判断数组里有没有存在的对象   有的话就往里面添加数据
				var dataObj = {};
				dataObj.from = '';
				dataObj.fromDate = '';
				dataObj.to = sendContent;
				dataObj.toData = getNowFormatDate();
				objArr[i].data.push(dataObj);
				dataOff = false;
			}
		}
		if (dataOff) {
			var obj2 = {};
			var dataArr2 = [];
			var dataObj = {};
			dataObj.from = '';
			dataObj.fromDate = '';
			dataObj.to = sendContent;
			dataObj.toData = getNowFormatDate();
			obj2.name = sendName;
			obj2.data = dataArr2;
			dataArr2.push(dataObj);
			objArr.push(obj2);
		}
	}
	if (objArr) store.set('msg_history', objArr)

	console.log(store.get('msg_history'));
};

/*存储收到的信息
	可存储文字，图片地址，名片按照ext扩展
*/
function storeMsgData(msgname, msgcontent, fromSrc,fromUser) {
	var objArr = store('msg_history') || [];
	var objLen = objArr.length;
	if (objLen == 0) {
		var obj1 = {};
		var dataArr1 = [];
		var dataObj1 = {};
		obj1.name = msgname;
		dataObj1.from = msgcontent;
		dataObj1.fromDate = getNowFormatDate();
		dataObj1.fromSrc = (fromSrc) ? fromSrc : '';
		dataObj1.fromUser = fromUser;
		dataObj1.to = '';
		dataObj1.toData = '';
		dataArr1.push(dataObj1);
		obj1.data = dataArr1;
		objArr.push(obj1);
	} else {
		var dataOff = true;
		for (var i = 0; i < objArr.length; i++) {
			if (objArr[i].name == msgname) {
				var dataObj = {};
				dataObj.from = msgcontent;
				dataObj.fromDate = getNowFormatDate();
				dataObj.fromSrc = (fromSrc) ? fromSrc : '';
				dataObj.fromUser = fromUser;
				dataObj.to = '';
				dataObj.toData = '';
				objArr[i].data.push(dataObj);
				dataOff = false;
			}
		}
		if (dataOff) {
			var obj2 = {};
			var dataArr2 = [];
			var dataObj2 = {};
			dataObj2.from = msgcontent;
			dataObj2.fromDate = getNowFormatDate();
			dataObj2.fromSrc = (fromSrc) ? fromSrc : '';
			dataObj2.fromUser = fromUser;
			dataObj2.to = '';
			dataObj2.toData = '';
			obj2.name = msgname;
			dataArr2.push(dataObj2);
			obj2.data = dataArr2;
			objArr.push(obj2);
		}
	};
	if (objArr) store.set('msg_history', objArr);
	console.log(store.get('msg_history'));
};

//加好友
function AddfriendRequest(username, jid2add, _this) {
	var nicks = '我是' + getCookie('nickname');
	var params = {
		username: username,
		jid2add: jid2add,
		markname: "",
		groupname: "",
		noteword: nicks
	};
	var par = $.param(params);
	$.ajax({
		type: "post",
		url: RestfulHOST() + '/users/roster?' + par,
		dataType: "json",
		headers: {
			"Authorization": "AQAa5HjfUNgCr27x"
		},
		success: function(msg) {
			if (msg.status == 0) {
				_this.removeClass();
				_this.html("已请求");
				friendlyMessage(msg.info);
			} else {
				warningMessage(msg.info);
			}
		},
		error: function() {
			console.log("error")
		}
	});
}
$(document).on('click', '.AddBuddy', function() {
	var jid2add = $(this).parents("li").attr("data-id");
	var mySrc = $('.userImg img').attr('src');
	if (username) AddfriendRequest(username, jid2add, $(this));
})

// 2.	同意请求
$(document).on("click", ".onaccept", function() {
	var name = $(this).parents('li').attr('data-name') + '@imsvrdell1';
	var _this = $(this);
	Gab.AgreedToTheRequest(name, _this);
	usersroster();
})

// 3.	拒绝请求
$(document).on("click", ".list_content a.delete", function() {
	var friendname = $(this).parents("li").attr("data-name");
	var _this = $(this).parents("li");
	Gab.RefuseRequest(friendname, _this);
})

