	var _type = "";
	var _word = "";
	var username = getCookie('username') || "";

	function getHotChat(type, word, page) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/mucgroup/findOfmucroomList.do",
			dataType: "json",
			data: {
				username: username,
				pageNum: page || 1,
				pageSize:15,
				type: type, //1综合  2最新  3人气  4活跃  5搜索
				keyword: word //搜索关键字
			},
			headers: {
				"token": qz_token()
			},
			success: function(msgs) {
				if(msgs.status==-3){
					getToken();
				};
				if (msgs.status == 0 && msgs.data != undefined) {
					flashChatList(msgs, word, page);
					_type = type;
					_word = word;
				}else if(msgs.data == undefined && page == undefined){
					$(".jiazai").hide();
					$('.lists').html("<div class='Isempty'><p>暂无搜索结果</p></div>");
				}else{
					stop = false;
					$(".Toloadmore").remove();
				}

			},
			error: function() {
				console.log("error");
			}
		})
	};


	var page = 1;
	var stop = false;
	$(window).scroll(function(event) {
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if (scrollTop + windowHeight + 2 >= scrollHeight) {
			if (stop == true) {
				stop = false;
				page++
				getHotChat(_type, _word, page);
				$("#dynamic_list").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
			}
		}
	})


	//加载闪聊列表
	function flashChatList(msgs, word, p) {
		$(".jiazai").hide();
		$(".Toloadmore").remove();
		if (p == undefined) {
			$(".lists>ul").empty();
			page = 1;
		}
		var str = '';
		var msgs = msgs.data.chatRoom;
		var category = "";
		var texts = "";
		for (var i = 0; i < msgs.length; i++) {
			var avat = '';
			if (msgs[i].avatarlist.length == 0 || msgs[i].avatarlist[0] == '') {
				avat = '/img/first.png';
			} else {
				avat = ImgHOST() + msgs[i].avatarlist[0];
			}
			if (msgs[i].category == 1) {
				category = "职业圈";
			} else if (msgs[i].category == 2) {
				category = "全球圈";
			} else if (msgs[i].category == 3) {
				category = "生活圈";
			}

			// 搜索关键字标注
			if (word != "" && msgs[i].naturalname.indexOf(word) > -1) {
				texts = msgs[i].naturalname.replace(word, "<span style='color:#ff8a00;font-size:14px;'>" + word + "</span>");
			} else {
				texts = msgs[i].naturalname;
			}


			str += '<li data-roomid="' + msgs[i].roomid + '" data-name="'+msgs[i].name+'" data-code="' + msgs[i].circleNo + '" data-name="' + msgs[i].naturalname + '" data-type="' + msgs[i].category + '">' +
				'<a href="javascript:;" class="boxs">' +
				'<span class="themeImg">' +
				'<img src="' + avat + '">' +
				'</span>' +
				'<div class="themes">' +
				'<p><span class="chatName">' + texts + '</span>';
			if (msgs[i].membercnt > 3) str += '<em></em>'; //超过3个人在聊天室 聊天就会有火苗
			str += '</p>' +
				'<div>' +
				'<span><i class="item_01">' + msgs[i].membercnt + '</i>人加入</span><span>|</span>' +
				'<span><i class="item_02">' + msgs[i].membercnt + '</i>条消息</span>' +
				'</div>' +
				'<div class="information_f">' +
				'<span class="information_f_l">来自' + category + '</span><span>|</span>' +
				'<span class="chatName">' + (msgs[i].classsub || msgs[i].naturalname) + '</span>' +
				'</div>' +
				'</div>' +
				'<br class="clear">' +
				'</a>' +
				'<div class="finish">';
			// if (msgs[i].isJoined == true) {    //是否已经加入聊天室msgs[i].isJoined    是否已经加入圈子msgs[i].isJoinedCircle
			// 	str += '<span class="openchat" data-isJoinedCircle="'+msgs[i].isJoinedCircle+'" data-isjoin="' + msgs[i].isJoined + '" data-off="0" data-natural="' + msgs[i].naturalname + '" data-name="' + msgs[i].name + '">聊天室</span><span class="circle_xq">圈子</span>';
			// } else {
			// 	str += '<div class="joins on" data-isJoinedCircle="'+msgs[i].isJoinedCircle+'" data-isjoin="' + msgs[i].isJoined + '" data-off="0" data-natural="' + msgs[i].naturalname + '" data-name="' + msgs[i].name + '">加入</div>';
			// }
			if (msgs[i].isJoined == true&&msgs[i].isJoinedCircle==true) {       //是否已经加入聊天室msgs[i].isJoined    是否已经加入圈子msgs[i].isJoinedCircle
				str += '<span class="openchat" data-isJoinedCircle="'+msgs[i].isJoinedCircle+'" data-isjoin="' + msgs[i].isJoined + '" data-off="0" data-natural="' + msgs[i].naturalname + '" data-name="' + msgs[i].name + '">聊天室</span><span class="circle_xq">圈子</span>';
			} else if(msgs[i].isJoined ==false&&msgs[i].isJoinedCircle==true){    //加入了圈子没有加入聊天室
				str += '<span class="joins on isjoin" data-isJoinedCircle="'+msgs[i].isJoinedCircle+'" data-isjoin="' + msgs[i].isJoined + '" data-off="0" data-natural="' + msgs[i].naturalname + '" data-name="' + msgs[i].name + '">加入聊天室</span><span class="circle_xq">圈子</span>';
			}else if(msgs[i].isJoined ==false&&msgs[i].isJoinedCircle==false){    //既没有加入圈子又没有加入聊天室
				str += '<div class="joins on" data-isJoinedCircle="'+msgs[i].isJoinedCircle+'" data-isjoin="' + msgs[i].isJoined + '" data-off="0" data-natural="' + msgs[i].naturalname + '" data-name="' + msgs[i].name + '">加入</div>';
			}
			str += '</div>' +
				// 
				'</li>';
		}
		$('.lists>ul').append(str);
		if(p != 1 && p != undefined) AfterTheLoadCompleted();   //侧导航下移 
		if(msgs !="") stop = true;
	}



	$(document).on('click', '.lists>ul>li,.circle_xq', function(event) {
		var type = $(this).attr('data-type') || $(this).parents("li").attr('data-type');
		var _code = $(this).attr('data-code') || $(this).parents("li").attr('data-code');
		//1-职业圈帖子；2-全球圈帖子；3-生活圈帖子
		if (type == 1) {
			var dataName = $(this).attr('data-name');
			window.location.href = '/center/zhiye/mydynamic.html?code=' + _code + "&dataName=" + dataName;
		} else if (type == 2) {
			window.location.href = '/center/global/mydynamic.html?code=' + _code;
		} else {
			window.location.href = '/center/life/mydynamic.html?code=' + _code;
		}
		event.stopPropagation();
	})

	$(document).on("click", '.information_f_l', function(event) {
		var type = $(this).parents("li").attr('data-type');
		if (type == 1) {
			window.location.href = '/center/zyq.html';
		} else if (type == 2) {
			window.location.href = '/center/qqq.html';
		} else {
			window.location.href = '/center/shq.html';
		}
		event.stopPropagation();
	})



	//打开聊天室
	$(document).on("click", ".openchat", function(event) {
		var roomName = $(this).attr('data-name');
		var naturalName = $(this).attr('data-natural');
		var imgSrc = $(this).parents('li').find('img').attr('src');
		var _this = $(this);
		var url = '';
		showChatBox(imgSrc, naturalName, roomName, _this);
		event.stopPropagation();
	})