$(function() {
	//	分享转发	
	var pageUrl = "";
	var pageTitle = "";
	var postEventShare = "";
	var snsPic = "";
	var UserName = getCookie("username"); //用户名
	var dataObj = { //转发时app所需信息
		data: {
			myusername: getCookie("username"), //我的用户名
			myheadimg: getCookie("headImgkz"), //我的头像
			nickname: getCookie("nickname"), //我的昵称
		}
	};
	//分享到QQ空间  
	function openQqzone(pageTitle, pageUrl, snsPic) {
		var shareqqzonestring = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?summary=' + pageTitle + '&url=' + pageUrl + '&pics=' + snsPic;
		window.open(shareqqzonestring, '_blank');
	}
	$(document).on('click', '.share6', function() {
			if ($(this).parents().hasClass("spacVideoShare")) { //视频详情页
				var topicId = $(this).parents('.content_items').attr('data-id');
				if($(this).parents('.video_left').find(".info_title").attr("data-content")=="undefined"){
					pageTitle = encodeURIComponent("#视频"); //标题
				}else{
					pageTitle = encodeURIComponent("#" + $(this).parents('.video_left').find(".info_title").attr("data-content")); //标题
				};
				var hasImg = $(this).parents('.video_left').find(".info_top").attr("data-imgurl"); //封面图
				if (hasImg) {
					snsPic = encodeURIComponent(hasImg); //图片
				}
			} else {
				var topicId = $(this).parents('li').find(".brief").attr('data-id');
				if($(this).parents('li').find(".brief").attr("data-content")=="undefined"){
					pageTitle = encodeURIComponent("#视频"); //标题
				}else{
					pageTitle = encodeURIComponent("#" + $(this).parents('li').find(".brief").attr("data-content")); //标题
				};
				var hasImg = $(this).parents('li').find('.videoImg').find('img');
				if (hasImg) {
					snsPic = encodeURIComponent(hasImg.eq(0).attr('src')); //图片
				}
			}
			pageUrl = encodeURIComponent(serHOST()+"/Page/videoShare/index.html?uid=" + UserName + "&vmid=" + topicId); //路径
			openQqzone(pageTitle, pageUrl, snsPic);
		})
		//新浪微博
	function openSina(pageTitle, pageUrl, snsPic) {
		window.open('http://v.t.sina.com.cn/share/share.php?url=' + pageUrl + '&title=' + pageTitle + '&pic=' + snsPic);
	}
	$(document).on('click', '.share8', function() {
			if ($(this).parents().hasClass("spacVideoShare")) { //视频详情页
				var topicId = $(this).parents('.content_items').attr('data-id');
				if($(this).parents('.video_left').find(".info_title").attr("data-content")=="undefined"){
					pageTitle = encodeURIComponent("#视频"); //标题
				}else{
					pageTitle = encodeURIComponent("#" + $(this).parents('.video_left').find(".info_title").attr("data-content")); //标题
				};
				var hasImg = $(this).parents('.video_left').find(".info_top").attr("data-imgurl"); //封面图
				if (hasImg) {
					snsPic = encodeURIComponent(hasImg); //图片
				}
			} else {
				var topicId = $(this).parents('li').find(".brief").attr('data-id');
				if($(this).parents('li').find(".brief").attr("data-content")=="undefined"){
					pageTitle = encodeURIComponent("#视频"); //标题
				}else{
					pageTitle = encodeURIComponent("#" + $(this).parents('li').find(".brief").attr("data-content")); //标题
				};
				var hasImg = $(this).parents('li').find('.videoImg').find('img');
				if (hasImg) {
					snsPic = encodeURIComponent(hasImg.eq(0).attr('src')); //图片
				}
			}
			pageUrl = encodeURIComponent(serHOST()+"/Page/videoShare/index.html?uid=" + UserName + "&vmid=" + topicId); //路径
			openSina(pageTitle, pageUrl, snsPic);
		})
		//分享给qq好友
	function shareQQfriends(pageTitle, pageUrl, snsPic) {
		window.open('http://connect.qq.com/widget/shareqq/index.html?url=' + pageUrl + '&title=' + pageTitle + '&pic=' + snsPic);
	}
	$(document).on('click', '.share7', function() {
			if ($(this).parents().hasClass("spacVideoShare")) { //视频详情页
				var topicId = $(this).parents('.content_items').attr('data-id');
				if($(this).parents('.video_left').find(".info_title").attr("data-content")=="undefined"){
					pageTitle = encodeURIComponent("#视频"); //标题
				}else{
					pageTitle = encodeURIComponent("#" + $(this).parents('.video_left').find(".info_title").attr("data-content")); //标题
				};
				var hasImg = $(this).parents('.video_left').find(".info_top").attr("data-imgurl"); //封面图
				if (hasImg) {
					snsPic = encodeURIComponent(hasImg); //图片
				}
			} else {
				var topicId = $(this).parents('li').find(".brief").attr('data-id');
				if($(this).parents('li').find(".brief").attr("data-content")=="undefined"){
					pageTitle = encodeURIComponent("#视频"); //标题
				}else{
					pageTitle = encodeURIComponent("#" + $(this).parents('li').find(".brief").attr("data-content")); //标题
				};
				var hasImg = $(this).parents('li').find('.videoImg').find('img');
				if (hasImg) {
					snsPic = encodeURIComponent(hasImg.eq(0).attr('src')); //图片
				}
			}
			pageUrl = encodeURIComponent(serHOST()+"/Page/videoShare/index.html?uid=" + UserName + "&vmid=" + topicId); //路径
			shareQQfriends(pageTitle, pageUrl, snsPic);
		})
		//圈子朋友圈   圈子好友  圈子群组   表情
	$(".expression_01").live("click", function(e) {
		var divid = $("#FaceBox_01");
		smohanfacebox($(this),divid,"textArea_01");
	});
	$(".expression_02").live("click", function(e) {
		var divid = $("#FaceBox_02");
		smohanfacebox($(this),divid,"textArea_02");
	});
	$(".expression_03").live("click", function(e) {
		var divid = $("#FaceBox_03");
		smohanfacebox($(this),divid,"textArea_03");
	});
	$(".expression_04").live("click", function(e) {
		var divid = $("#FaceBox_04");
		smohanfacebox($(this),divid,"textArea_04");
	});
	//点击差号
	$(document).on("click", ".nav_tit span", function() {
			$(".fixBoxs,.centetCon").hide();
			$("#textArea_01,#textArea_02,#textArea_03,#textArea_04").val("");
			//清空圈子朋友圈
			$(".textArea_01").val("");
			//清空圈子好友
			$(".JSfriendsList").hide();
			$(".goodFriends").val("");
			$(".goodFriends").attr("getname", "");
			$("#textArea_02").val("");
			//清空圈子群组
			//		$(".JS_gtoupList").hide();
			//		$(".JSgroup").val("");
			//		$(".JSgroup").attr("getname","");
			//		$("#textArea_03").val("");
			//首页热门
			$(".textArea_04").val("");
		})
		//tab切换
	$(document).on('click', ".tab_nav li", function() {
		var index = $(this).index();
		$(this).siblings("li").removeClass("on");
		$(this).addClass("on");
		$(".circlesList").children("div").eq(index).show().siblings().hide();
	})
	var da = {
			"username": UserName,
			"userNo": getCookie("userNo"),
			"topicNo": "",
			"ImgName": "",
			"fc": "",
			"imgLen": "",
			"shareTit": "",
			"shareType": 1, //1代表是视频帖子
		}
		//分享圈子朋友圈
	$(document).on("click", ".share1", function() {
		if (getCookie("username")) {
			$(".fixBoxs,.centetCon").show();
			$(".tab_1").siblings("li").removeClass("on");
			$(".tab_1").addClass("on");
			$(".friendsCircles").show().siblings().hide();
			//开始
			//var shareType=$(this).parents(".content_items").attr("data-type");
			if ($(this).parents().hasClass("spacVideoShare")) {
				da.shareTit = $(this).parents('.video_left').find(".info_title").attr("data-content") || '';
				da.topicNo = $(this).parents('.content_items').attr('data-id');
				da.ImgName = $(this).parents('.video_left').find(".info_top").attr("data-imgurl"); //封面图
			} else {
				da.shareTit = $(this).parents(".sharelink").siblings(".brief").attr("data-content") || '';
				da.topicNo = $(this).parents(".sharelink").siblings(".brief").attr("data-id");
				da.ImgName = $(this).parents(".sharelink").siblings(".videoBox").find(".videoImg").find('img').attr("src");
			}
		}
	});
	//分享到首页热门
	$(document).on("click", ".share9", function() {
		if (getCookie("username")) {
			$(".fixBoxs,.centetCon").show();
			$(".tab_4").siblings("li").removeClass("on");
			$(".tab_4").addClass("on");
			$(".indexhotCircle").show().siblings().hide();
			//开始
			//var shareType=$(this).parents(".content_items").attr("data-type");
			if ($(this).parents().hasClass("spacVideoShare")) {
				da.shareTit = $(this).parents('.video_left').find(".info_title").attr("data-content");
				da.topicNo = $(this).parents('.content_items').attr('data-id');
				da.ImgName = $(this).parents('.video_left').find(".info_top").attr("data-imgurl"); //封面图
			} else {
				da.shareTit = $(this).parents(".sharelink").siblings(".brief").attr("data-content");
				da.topicNo = $(this).parents(".sharelink").siblings(".brief").attr("data-id");
				da.ImgName = $(this).parents(".sharelink").siblings(".videoBox").find(".videoImg").find('img').attr("src");
			}
		}
	});
	/**************************朋友圈好友可见性开始***********************/
	$(document).on("click", ".partiallyVisible i", function() {
			$(this).siblings("ul").toggle();
		})
		//好友可见
	$(document).on("click", ".partiallyVisible .visible", function() {
		var txt = $(this).html();
		$(".partiallyVisible i").html(txt);
		$(".partiallyVisible ul").hide();
		rosterlist = [];
	})
		//私密
	$(document).on("click", ".partiallyVisible .private", function() {
		var txt = $(this).html();
		$(".partiallyVisible i").html(txt);
		$(".partiallyVisible ul").hide();
		rosterlist = [UserName];
	})
		//部分好友可见
	$(document).on("click", ".partiallyVisible .bf_visible", function(ev) {
		if($(".friends .theme span").html() == 0){
			warningMessage("您还没有好友");
			return false;
		}
		$('.JSsee_xz,#mask').fadeIn();
		$(".seeDynamic>span").html("部分好友可见");
		$("body").css("overflow","hidden");
		var groupname = "";
		var newgroupname = "";
		var rosterlist = "";
		OperationUserPostGroup(6,groupname,rosterlist,newgroupname);
		ev.stopPropagation();
	})

	$(document).on('click', '.JSsee_xz .cancelBtn', function(ev) {
		$('.JSsee,#mask').fadeOut();
		$("body").css("overflow","auto");
		ev.stopPropagation();
	});

	$(document).on('click', '.JSsee_tj .cancelBtn', function(ev) {
		$('.JSsee_tj').hide();
		$('.JSsee_xz').show();
	});


	//选择部分好友可见
	$(document).on("click",".JSsee .selectLabel_t ul li b", function() {
		if($(this).hasClass("on")) {
			$(this).removeClass("on");
		} else {
			$(this).addClass("on");
		}
	})
		/*
		 * 选择联系人
		 */
	SelectTheContact()
	var rosterlength;

	function SelectTheContact() {
		$.ajax({
			type: "get",
			url: RestfulHOST() + '/users/roster?username=' + UserName,
			dataType: "json",
			headers: {
				"Authorization": "AQAa5HjfUNgCr27x",
				"Accept": "application/json"
			},
			success: function(msg) {
				if (msg.status == 0) {
					var str = "";
					var number = 0;
					rosterlength = msg.rosterItem;
					for (var i = 0; i < msg.rosterItem.length; i++) {
						var mssg = msg.rosterItem[i];
						number = number + 1;
						var dName = mssg.username.split('@')[0];
						if (mssg.subscriptionType != 0 && mssg.subscriptionType != 4) {
							str += '<li class="Chat_list">';
							if (mssg.avatarfile == "") {
								str += '<img  data-name=' + dName + ' data-nickname=' + mssg.nickname + ' class="img_item_' + i + '" src="/img/first.png">';
							} else {
								str += '<img  data-name=' + dName + ' data-nickname=' + mssg.nickname + ' class="img_item_' + i + '" src="' + ImgHOST() + mssg.avatarfile + '">';
							}
							/*是否有备注名*/
							// if (mssg.markname == "" || mssg.markname == undefined) {
							// 	str += '<span>' + mssg.nickname + '</span>';
							// } else {
							// 	str += '<span>' + mssg.markname + '</span>';
							// }
							if (mssg.markname != undefined && mssg.markname != ''&& mssg.markname != null && mssg.markname != 'null' && mssg.markname != null) {
								str += '<span>' + mssg.markname + '</span>';
							} else {
								str += '<span>' + (mssg.nickname || shieldNumber(dName)) + '</span>';
							}
						}
					}
					$(".JSsee .list_01").html(str);;

				}
			},
			error: function() {
				console.log("error")
			}

		});
	}
	
	//选中选择联系人
	
	$(document).on("click", ".JSsee_xz .Chat_list,.JSsee_tj .Chat_list", function() {
		if($(this).hasClass("checkOn")) {
			$(this).removeClass("checkOn");
			var delImg = $(this).find("img").attr("class");
			$(this).parents(".JSsee").find(".xz_img_list ."+delImg).remove();
		} else {
			$(this).addClass("checkOn");
			var tpl = $(this).html().split("<span>")[0];
			$(this).parents(".JSsee").find(".xz_img_list").prepend(tpl);
		}
	})
	
	//标签展开 -  收起
	$(document).on("click",".JSsee_xz .label_t",function(){
		var txt = $(".JSsee_xz .label_t");
		if($(this).html() == "展开"){
			$(".JSsee_xz .labelIn").fadeIn(200,function(){txt.html("收起")});
		}else{
			$(".JSsee_xz .labelIn").fadeOut(200,function(){txt.html("展开")});
		}
	})


	/*
	操作用户帖子组handlerUserTopicGroup----
	handlertype
		0：创建用户帖子组；
		1，修改用户帖子组的组名；
		2，删除用户帖子组(删除组名和好友)；
		3，向用户帖子组中添加好友；
		4，查询用户帖子组中的好友列表；
		5，修改用户帖子组中的好友列表；
		6，查询用户好友分组及其好友
		7，修改用户好友分组及其分组下的好友
		String username	用户名	例如："张三丰"
String groupname	组名	例如:  "大学同学"
String rosternamelist	好友列表	例如：
{"rosternamelist":
	   ["zhangsang",
	    "lisi",
	    "wangwu",
	   "xiaoer"
	  ]
  }
String newgroupname	新组名	例如："工作同事"

	*/
	var rosterlist = [];

	function OperationUserPostGroup(type, groupname, rosterlist, newgroupname) {
		var rosternamelist = {
			"rosternamelist": rosterlist
		};
		var rosternamelists = JSON.stringify(rosternamelist); // 好友列表
		$.ajax({
			type: "post",
			url: serviceHOST() + "/userTopicgroup/handlerUserTopicGroup.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: {
				handlertype: type,
				username: UserName,
				groupname: groupname,
				rosternamelist: rosternamelists,
				newgroupname: newgroupname
			},
			success: function(msg) {
				var mssg = msg.data;
				if(msg.status == 0){
					if(type == 6){
						QueryTheUserGroupList(mssg);
						$(".JSsee_tj").hide();       
						$(".JSsee_xz").show();      //显示第一步
					}else if(type == 4){
						ModifyLabel(mssg,groupname,_this);
					}else if(!is){
						$(".JSsee_tj").hide();       
						$(".JSsee_xz").show();      //显示第一步
						$(".seeDynamic li.bf_visible").click();	
						if($(".clearfix").length > 3) $(".JSsee_xz .label_t").hide(); 					
					}
					
				}else if(msg.status==-3){
					getToken();
				}else{
					warningMessage(msg.info);
				}

			},
			error: function() {
				console.log("error");
			}

		});
	}
	
		/*标签列表*/
	function QueryTheUserGroupList(mssg){
		if(mssg.length == 0){
			$(".selectLabel_t").hide();
			return false;
		}else{
			$(".selectLabel_t").show();
		}

		var str = "";	
		for(var i = 0;i < mssg.length;i++){
			var tpl = "";
			if(i < 3){
				str += '<li class="clearfix">';
			}else{
				$(".label_t").html("展开").show();
				str += '<li class="clearfix labelIn">';
			}
			str += '<b></b><dl>'+
				'<dd class="friendType">' + mssg[i].groupname + '</dd>';
				for(var j = 0;j < mssg[i].rostermap.length;j++){
					if(j<mssg[i].rostermap.length-1){
						if(mssg[i].rostermap[j].nickname==undefined){
							tpl += '<span data-name=' + mssg[i].rostermap[j].username + '>' + mssg[i].rostermap[j].username + '</span>' + ",";
						}else{
							tpl += '<span data-name=' + mssg[i].rostermap[j].username + '>' + mssg[i].rostermap[j].nickname + '</span>' + ",";
						}
					}else{
						if(mssg[i].rostermap[j].nickname==undefined){
							tpl += '<span data-name=' + mssg[i].rostermap[j].username + '>' + mssg[i].rostermap[j].username + '</span>';
						}else{
							tpl += '<span data-name=' + mssg[i].rostermap[j].username + '>' + mssg[i].rostermap[j].nickname + '</span>';
						}
					}
				}
				
			str += '<dd class="friendName">' + tpl + '</dd>'+
			'</dl>'+
			'<a href="javascript:;" class="Modify redact">编辑</a>'+
			'<div class="editFriends">'+
			'<ul class="xzcontact">'+
			'</ul>'+
			'<ul>'+
				'<li class="add"><a href="javascript:;"><img src="/img/qz_pyq_tianjia.png" alt="" /></a></li>'+
				'<li class="ToLose"><a href="javascript:;"><img src="/img/qz_pyq_qudiao.png" alt="" /></a></li>'+
				'<li class="RemoveLabel">删除标签</li>'+
			'</ul>'+
			'</div>'+
		'</li>';
			
		};
		$(".JSsee .selectLabel_t ul").html(str);
	}

	//部分好友可见确定
	$(document).on("click",".JSsee_xz .confirmBtn",function(){
		var _list = $(".JSsee_xz .selectLabel_t ul li");
		var xz_img = $(".JSsee_xz .xz_img_list img");
		if(_list.find("b").hasClass("on") || $(".JSsee_xz .TagName em").hasClass("checkOn")){
			$.im.save("是否保存可见范围修改？", function() {
				rosterlist = [];
				$(".partiallyVisible i").html("部分好友可见");
				$(".partiallyVisible ul").hide();
				for(var j = 0;j < _list.length;j++){
					var _span = _list.eq(j).find("span");
					if(_list.eq(j).find("b").hasClass("on")){
						for(var m = 0;m < _span.length;m++){
							rosterlist.push(_span.eq(m).attr("data-name"));
						}
						
					}
				}
				if($(".JSsee_xz .TagName em").hasClass("checkOn")){
					console.log(xz_img.length)
					for(var i = 0;i < xz_img.length;i++){
						rosterlist.push(xz_img.eq(i).attr("data-name"));
					}
					multiFriendSelector();
				}else{
					$(".JSsee_xz .cancelBtn").click();
				}

			})
			
		}
		
	})

	/*选择好友*/
	$(document).on("click",".JSsee_xz .Edit_02_pyq .choose .pyq_determine",function(){
		multiFriendSelector(1);
	})


	function multiFriendSelector(type){
		var hyList = [];
		var imglist = $(".JSsee_xz .pyq_img_list img");
		var _val = html2Escape($(".Edit_02_pyq .TagName input").val());
		if(imglist.length == 0){
			warningMessage("请选择联系人");
			return false;
		}
		if(_val == ""){
			warningMessage("请填写标签名");
			return false
		}

		var groupname = html2Escape($(".JSsee .Edit_03_pyq .TagName input").val());
		var f_l = $(".JSsee .visibleBox .clearfix");
		for(var i = 0;i < f_l.length;i++){
			if(_val == f_l.eq(i).find(".friendType").html()){
				warningMessage("标签名不能重复");
				return false;
			}
		}

		for(var i = 0;i < imglist.length;i++){
			var imgName = imglist.eq(i).attr("data-name");
			hyList.push(imgName);
		}
		if(type){
			$.im.save("是否保存本次编辑？", function() {
				OperationUserPostGroup(0,_val,hyList,_val);
				$(".JSsee_xz .pyq_img_list").empty();
				$(".JSsee_xz .friend_list li").removeClass("checkOn");
				$(".JSsee_xz .TagName em").removeClass("checkOn");
				$(".JSsee .TagName input").val("");  // 清空标签名
				$(".JSsee .seeDynamic li.bf_visible").click();
			})
		}else{
			var _this = "";
			$(".JSsee_xz .cancelBtn").click();
			$(".JSsee_xz .pyq_img_list").empty();
			$(".JSsee_xz .friend_list li").removeClass("checkOn");
			$(".JSsee_xz .TagName em").removeClass("checkOn");
			$(".JSsee .TagName input").val("");  // 清空标签名
			OperationUserPostGroup(0,_val,hyList,_val,_this,1);
		}
	}
	




	//标签增加好友
	$(document).on("click",".JSsee_xz .add",function  () {
		var str = "";
		$(".JSsee_xz").hide();
		$(".JSsee_tj").show();
		var chatlist = $(".JSsee_tj .Chat_list");
		chatlist.removeClass("checkOn");
		$(".JSsee .xzcontact li .DeletePoint").hide();  //去除减号
		var _list = $(this).parents(".clearfix").find(".xzcontact li");
		
		for(var i = 0;i < _list.length;i++){
			var _listI = _list.eq(i);
			str += '<img data-name='+_list.eq(i).find("img").attr("data-name")+' data-nickname='+_listI.find("span").html()+' class='+_list.eq(i).find("img").attr("data-name")+' src='+_list.eq(i).find("img").attr("src")+'>'
			for(var j = 0;j < chatlist.length;j++){	
				var chatlistJ = chatlist.eq(j);
				if(chatlistJ.find("img").attr("data-name") == _listI.find("img").attr("data-name")){
					chatlistJ.addClass("checkOn");
					chatlistJ.find("img").attr("class",_listI.find("img").attr("data-name"));
				}
			}
		}
		$(".JSsee_tj .xz_img_list").html(str).attr("name",$(this).parents(".clearfix").find(".friendType").html());
	})


	/*
		删除标签
	*/
	$(document).on("click",".JSsee .visibleBox .RemoveLabel",function(){
		var groupname = $(this).parents(".clearfix").find("dl .friendType").html();
		$.im.determine("确定要删除此标签？", function() {
			OperationUserPostGroup(2,groupname,rosterlist,groupname);
		})
		
	})


	
	//显示去除好友
	$(document).on("click",".JSsee .ToLose",function  () {
		$(".JSsee .xzcontact li .DeletePoint").toggle();
	})


	// 点击去除好友

	$(document).on("click",".JSsee .DeletePoint",function(){
		var _index = $(this).parent("li").index();
		$(this).parent("li").remove();
		rosterlist.splice(_index, 1);
	})




	//搜索联系人
	$(".JSsee .Edit_02_pyq .choose_box .choose_list input").bind('input propertychange', function(){
		var list = $(".JSsee_xz .friend_list .list_01 .Chat_list");
		var word = html2Escape($(this).val());                  //搜索关键字
		$(".JSsee .friend_list .list_02").html("");
		if(word == ""){
			$(".JSsee .friend_list .list_01").show();
			$(".JSsee .friend_list .list_02").hide();
		}else{
			$(".JSsee .friend_list .list_01").hide();
			$(".JSsee .friend_list .list_02").show();
		}
		
		
		for(var i = 0;i < list.length;i++){
			if(list.eq(i).find("img").attr("data-name").indexOf(word) >= 0 || list.eq(i).find("span").text().indexOf(word) >= 0){
				$(".JSsee .friend_list .list_02").append('<li>'+list.eq(i).html()+'</li>')
			}
			
		}
	})
	/*
		编辑标签
	*/

	$(document).on("click",".JSsee_xz .selectLabel_t .Modify",function(){
		var groupname = $(this).parents("li").find(".friendType").html();
		var _this = $(this);
		_this.parents(".clearfix").find(".editFriends").fadeIn(200,function(){
			_this.addClass("bc_modify").removeClass("Modify").html("保存")
		});

		var rosterlist = [];
		var newgroupname = "";
		OperationUserPostGroup(4,groupname,rosterlist,newgroupname,_this);
	})

	
	//保存
	$(document).on("click",".JSsee .selectLabel_t .bc_modify",function(){
		var _this = $(this);
		var groupname = $(this).parents("li").find(".friendType").html();
		var kjList = _this.parents(".clearfix").find(".xzcontact li");
		_this.parents(".clearfix").find(".editFriends").fadeOut(200,function(){
			_this.addClass("Modify").removeClass("bc_modify").html("编辑")
		});
		for(var i = 0;i < kjList.length;i++){
			rosterlist.push(kjList.eq(i).find("img").attr("data-name"));
		}

		OperationUserPostGroup(5,groupname,rosterlist,groupname);
	})

	//标签名字
	$(document).on("click",".Edit_02_pyq .TagName em",function(){
		$(this).toggleClass("checkOn");
	})


	/*
		加载修改标签页
	*/
	function ModifyLabel(mssg,groupname,_this){
		var str = "";
		rosterlist = []; 
		var imglist_02 = $(".JSsee_xz .Edit_02_pyq .friend_list .list_01 li");
		$(".JSsee_tj .xz_img_list").html("");
		for(var i = 0;i < mssg.length;i++){
			for(var j = 0;j < imglist_02.length;j++){

				var name = imglist_02.eq(j).find("img").attr("data-name");
				//  查找用户名和头像
				if(mssg[i] == name){
					var img = imglist_02.eq(j).find("img").attr("src");
					var name = imglist_02.eq(j).find("img").attr("data-name");
					var nickname = imglist_02.eq(j).find("img").attr("data-nickname");
				 	str += '<li><img src="'+img+'" data-name='+name+' align="bottom"/><span>'+nickname.substring(0,2)+'</span><i class="DeletePoint"></i></li>';	
				}
				_this.parents(".clearfix").find(".xzcontact").html(str);
			}
		}
	}






	/*
		编辑标签保存
	*/
	$(document).on("click",".JSsee_tj .showFriendTop .confirmBtn",function(){
		rosterlist = [];
		var newgroupname = $(".JSsee_tj .xz_img_list").attr("name");
		var xzList = $(".JSsee_tj .xz_img_list img");
		for(var i = 0;i < xzList.length;i++){
			rosterlist.push(xzList.eq(i).attr("data-name"));
		}
		
		// 5，修改用户帖子组中的好友列表；
		OperationUserPostGroup(5,newgroupname,rosterlist,newgroupname);


	})



	



	/**************************朋友圈好友可见性结束***********************/

	function shareFcircles(datas) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/topic/createRosterTopic.do",
			data: datas,
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				if(msg.status==-3){
					getToken();
				};
				$(".successAlert").show();
				setTimeout(function() {
					$(".successAlert").hide();
					$("#textArea_01,#textArea_02,#textArea_03,#textArea_04").val("");
					$(".centetCon,.fixBoxs").hide();
				}, 1000);
			},
			error: function() {
				console.log("error");
			}
		});
	}
	//点击朋友圈转发按钮
	$(document).on("click", ".Fcircles", function() {
		if(rosterlist == ""){
			var list = $(".JSsee_xz .Chat_list");
			for(var i =0;i < list.length;i++){
				rosterlist.push(list.eq(i).find("img").attr("data-name"));
			}
		}
		da.fc = html2Escape($("#textArea_01").val());
		var shareCon = {
			"shareImageType": da.shareType,
			"shareType": da.shareType,
			"content": da.fc,
			"shareTitle": da.shareTit,
			"shareFrom": "....",
			"shareUrl": serHOST()+"/Page/videoShare/index.html?uid=" + UserName + "&amp;vmid=" + da.topicNo,
			"shareImageUrl": da.ImgName
		};
		var shareC = shareCon;
		var topic = {
			username: UserName,
			userNo: da.userNo,
			title: "",
			content: shareC,
			imagecount: 1 || 0, //图片数量
			videourl: "",
			visiblity: "公有",
			machine: "webpc", //"来自iphone 6s"--必填
			themeNo: "", //""--发生活圈的帖子必填，其他帖子不填
			code: "", //""--不填
			category: 0, //4,--必填0：朋友圈，2：行业圈，4：生活圈，8：首页
			topictype: 8 //0:纯文本帖子,2:视频帖子,4:带图片帖子         8代表转发
		};
		var topicc = JSON.stringify(topic);
		var rosternamelist = {
			"rosterList": rosterlist
		}; //好友可见性     传用户自己名getCookie("username")，为用户自己可见。。传空位全部好友可见，不为空为部分好友可见
		var rosternamelists = JSON.stringify(rosternamelist); // 好友列表
		var PicList = {
			"imageList": []
		};
		var Images = JSON.stringify(PicList);
		var data = {
			topic: topicc,
			rosterList: rosternamelists,
			imageList: Images
		};
		shareFcircles(data);
	});
	
	//点击首页热门转发按钮
	$(document).on("click",".indexhotshares", function() {
//			if (da.ImgName) {
//				var _urlImg = da.ImgName.split("=")[1].split("-")[0];
//			}
			da.fc = html2Escape($("#textArea_04").val());
			var shareCon = {
				"shareImageType": da.shareType,
				"shareType": da.shareType,
				"content": da.fc || "",
				"shareTitle": da.shareTit,
				"shareFrom": "....",
				"shareUrl": serHOST()+"/Page/videoShare/index.html?uid=" + UserName + "&amp;vmid=" + da.topicNo,
				"shareImageUrl":da.ImgName
			};
			//var shareC = JSON.stringify(shareCon);
			var shareC =shareCon;
			var topic = {
				topic:{
					username: da.username,
					userNo: da.userNo,
					title: "",
					content: shareCon,
					imagecount: 1 || 0, //图片数量
					videourl: "",
					visiblity: "公有",
					machine: "webpc", //"来自iphone 6s"--必填
					themeNo: "", //""--发生活圈的帖子必填，其他帖子不填
					code: "", //""--不填
					category:8, //4,--必填0：朋友圈，2：行业圈，4：生活圈，8：首页
					topictype: 8 //0:纯文本帖子,2:视频帖子,4:带图片帖子         8代表转发
				}
			};
			var topicc = JSON.stringify(topic);
			var PicList = {
				"imageList": []
			};
			var Images = JSON.stringify(PicList);
			var data = {
				"topic": topicc,
				"isRosterAccess": 0, //0:表示朋友圈不可见，1：表示朋友圈可见 
				"imageList":Images,
				"isShare":1,
			}
			shareindexhots(data);
			
		});
		function shareindexhots(datas) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/createTopic/shareIndexTopic.do",
			data: datas,
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				$(".successAlert").show();
				setTimeout(function() {
					$(".successAlert").hide();
					$("#textArea_01,#textArea_02,#textArea_03,#textArea_04").val("");
					$(".centetCon,.fixBoxs").hide();
					//window.location.reload();
				}, 1000);
			},
			error: function() {
				console.log("error");
			}
		});
	}

	//圈子好友
	$(document).on("click", ".share2", function() {
		if (getCookie("username")) {
			$(".fixBoxs,.centetCon").show();
			$(".tab_2").siblings("li").removeClass("on");
			$(".tab_2").addClass("on");
			$(".hail-fellow").show().siblings().hide();
			if ($(this).parents().hasClass("spacVideoShare")) {
				da.shareTit = $(this).parents('.video_left').find(".info_title").attr("data-content");
				da.topicNo = $(this).parents('.content_items').attr('data-id');
				da.ImgName = $(this).parents('.video_left').find(".info_top").attr("data-imgurl"); //封面图
			} else {
				da.shareTit = $(this).parents(".sharelink").siblings(".brief").attr("data-content");
				da.topicNo = $(this).parents(".sharelink").siblings(".brief").attr("data-id");
				da.ImgName = $(this).parents(".sharelink").siblings(".videoBox").find(".videoImg").find("img").attr("src");
			}
		}
		console.log(da.shareTit)
	});

	$(document).on("click", ".goodFriends", function() {
		if ($(".JSfriendsList").css("display") == "none") {
			$(".JSfriendsList").show();
			getFriendList();
		} else {
			$(".JSfriendsList").hide();
		}
	})
	$(document).on("click", ".JSfriendsList li", function() {
			var nameText = $(this).text();
			$(".goodFriends").val(nameText);
			$(".goodFriends").attr("getName", $(this).attr("data-username"))
			$(".JSfriendsList").hide();
		})
		//好友列表
	function getFriendList() {
		var str = "";
		im.localLoadingOn(".JSfriendsList ul") //局部开启
		$.ajax({
			type: "get",
			url: RestfulHOST() + "/users/roster?username=" + getCookie("username"),
			dataType: "json",
			headers: {
				"Authorization": "AQAa5HjfUNgCr27x",
				"Accept": "application/json"
			},
			success: function(msg) {
				im.localLoadingOff(".JSfriendsList ul") //关闭
				if (msg.status == 0) {
					var rostLen = msg.rosterItem;
					var ImgFile = "";
					if (rostLen.length != 0) { //1，2,3是好友      0是没有关系     4，是拒绝
						for (var i = 0; i < rostLen.length; i++) {
							var dName = rostLen[i].username.split("@")[0];
							ImgFile = rostLen[i].avatarfile;
							if (ImgFile != "" && ImgFile != null) {
								if (ImgFile.indexOf("http") > -1) {
									ImgFile = rostLen[i].avatarfile;
								} else {
									ImgFile = ImgHOST() + rostLen[i].avatarfile;
								}
							} else {
								ImgFile = "/img/first.png"
							};
							if (rostLen[i].subscriptionType == 1 || rostLen[i].subscriptionType == 2 || rostLen[i].subscriptionType == 3) {
								if (rostLen[i].markname != undefined && rostLen[i].markname != ''&& rostLen[i].markname != null && rostLen[i].markname != 'null' && rostLen[i].markname != null) {
									str += '<li data-username="' + rostLen[i].username + '">' + '<span><img src="' + ImgFile + '"/></span>' + rostLen[i].markname + '</li>';
								} else {
									str += '<li data-username="' + rostLen[i].username + '">' + '<span><img src="' + ImgFile + '"/></span>' + (rostLen[i].nickname || shieldNumber(dName)) + '</li>';
								}
							}
						}
						$(".JSfriendsList ul").html(str);
						if (!$(".JSfriendsList ul").has("li").length) { //判断有没有好友
							var strs = '<p style="line-height:202px;color:#333;font-size:16px;text-align:center;">暂无好友</p>'
							$(".JSfriendsList ul").html(strs);
						}
					} else {
						var strs = '<p style="line-height:202px;color:#333;font-size:16px;text-align:center;">暂无好友</p>'
						$(".JSfriendsList ul").html(strs);
					}
				}
			},
			error: function() {
				console.log("error");
			}
		});
	}

	/*圈子转发到好友*/
	$(document).on("click", ".friendsShare", function() {
		if ($('.goodFriends').attr('getname') != '') {
			var vname =$('.goodFriends').attr('getname');
		} else {
			return false;
		}
		var msgs = html2Escape($('#textArea_02').val()) || '';
		var objData = {
			"type": '1',
			"shareImageType": da.shareType, //判断是图文还是视频	1视频 0图文
			"content": msgs,
			"shareTitle": da.shareTit, //文字
			"shareUrl": serHOST()+"/Page/videoShare/index.html?uid=" + UserName + "&amp;vmid=" + da.topicNo,
			"shareImageUrl": da.ImgName, //图片
			'data': {
				myusername: getCookie("username"), //我的用户名
				myheadimg: getCookie("headImgkz"), //我的头像
				nickname: getCookie("nickname"), //我的昵称                 
			}
		};
		var msgData = JSON.stringify(objData);
		console.log(msgData)
		//sendPrivateText('[链接]', vname, objData); //转发等于是给用户发消息         这是发消息函数
		sendMessage(msgData, 'chat', 22, vname);
		if (msgs != '') {
			//sendPrivateText(msgs, vname, dataObj); //转发等于是给用户发消息         这是发消息函数
			sendMessage(msgs, 'chat', 0, vname);
		}
		$(".successAlert").show();
		setTimeout(function() {
			$(".successAlert").hide();
			$("#textArea_01,#textArea_02,#textArea_03").val("");
			$(".goodFriends").val("");
			$('.goodFriends').attr('getname', "");
			$(".JSfriendsList").hide();
			$(".centetCon,.fixBoxs").hide();
		}, 1000);
	});

	//转发给圈子群组
	$(document).on("click", ".share3", function() {
		if (getCookie("username")) {
			$(".fixBoxs,.centetCon").show();
			$(".tab_3").siblings("li").removeClass("on");
			$(".tab_3").addClass("on");
			$(".circleGroup").show().siblings().hide();
		}
	})
	$(document).on("click", ".JSgroup", function() {
		if ($(".JS_gtoupList").css("display") == "none") {
			$(".JS_gtoupList").show();
			getGroupList({
				"username": getCookie("username"),
				"grouptype": 1, //1是群组    2 是群聊 讨论组
				"cursor": 0
					//"stepsize":100
			});
		} else {
			$(".JS_gtoupList").hide();
		}
	})
	$(document).on("click", ".JS_gtoupList li", function() {
			var nameText = $(this).text();
			$(".JSgroup").val(nameText);
			$(".JSgroup").attr("getName", $(this).attr("data-id"));
			$(".JS_gtoupList").hide();
		})
		//获取群组列表
	function getGroupList(datas) {
		var str = "";
		im.localLoadingOn(".JS_gtoupList ul") //局部开启
		$.ajax({
			type: "get",
			url: RestfulHOST() + "/mucgroup/my",
			dataType: "json",
			headers: {
				"Authorization": "AQAa5HjfUNgCr27x",
				"Accept": "application/json"
			},
			data: datas,
			success: function(msg) {
				if (msg.status == 0) {
					im.localLoadingOff(".JS_gtoupList ul") //关闭
					var chatLen = msg.chatRoom;
					var ImgFile = "";
					if (chatLen.length != 0) {
						for (var i = 0; i < chatLen.length; i++) {
							ImgFile = chatLen[i].avatarlist;
							if (ImgFile.length != 0) {
								if (ImgFile[0].indexOf("http") > -1) {
									ImgFile = ImgFile
								} else {
									ImgFile = ImgHOST() + ImgFile[0];
								}
							} else {
								ImgFile = "/img/first.png"
							};
							str += '<li data-id="' + chatLen[i].roomid + '">' + '<span><img src="' + ImgFile + '"/></span>' + chatLen[i].naturalName + '</li>';
						}
						$(".JS_gtoupList ul").html(str);
						if (!$(".JSfriendsList ul").has("li").length) { //判断有没有好友
							var strs = '<p style="line-height:202px;color:#333;font-size:16px;text-align:center;">暂无群组</p>'
							$(".JS_gtoupList ul").html(strs);
						}
					} else {
						var strs = '<p style="line-height:202px;color:#333;font-size:16px;text-align:center;">暂无群组</p>'
						$(".JS_gtoupList ul").html(strs);
					}
				}
			},
			error: function() {
				console.log("error");
			}
		});
	};

	/*圈子转发到群组*/
	//	$(document).on("click",".skirtForwarding",function(){
	//		if($('.JSgroup').attr('getname')!=''){
	//			var vname = $.md5($('.JSgroup').attr('getname'));
	//		}
	//		var msgs = $('#textArea_03').val();
	//		var objData = {			//此处添加			转发			
	//			"type":'1',
	//			"shareImageType":da.shareType,             //判断是图文还是视频	1视频 0图文
	//    		"content":da.fc,           
	//    		"shareTitle":da.shareTit,             //文字    转发的标题
	//    		"shareUrl":serHOST()+"/Page/news_details/newsDetails.html?topicNo="+da.topicNo,
	//    		"shareImageUrl":da.ImgName,             //图片
	//    		'data':{
	//				myusername:getCookie("username"),	//我的用户名
	//				myheadimg:getCookie("headImgkz"),	//我的头像
	//				nickname:getCookie("nickname"),		//我的昵称                 
	//			}
	//		};
	//		// console.log(objData);
	//		sendPrivateText('[链接]',vname,objData);            //转发等于是给用户发消息         这是发消息函数
	//		if(msgs != ''){
	//			// console.log('zou')
	//			sendPrivateText(msgs,vname,dataObj);            //转发等于是给用户发消息         这是发消息函数
	//		}
	//		$(".successAlert").show();
	//		setTimeout(function(){
	//			$(".successAlert").hide();
	//			$("#textArea_01,#textArea_02,#textArea_03").val("");
	//			$(".JSgroup").val("");
	//			$('.JSgroup').attr('getname',"");
	//			$(".JS_gtoupList").hide();
	//			$(".centetCon,.fixBoxs").hide();
	//		},1000);
	//	})
	//转发朋友圈 圈子好友字数限制
	$("#textArea_01").on("keyup", function() {
		checkNum($(this), '140', "#num_01");
	});
	$("#textArea_02").on("keyup", function() {
		checkNum($(this), '140', "#num_02");
	});
	$("#textArea_04").on("keyup", function() {
		checkNum($(this), '140', "#num_04");
	})

})