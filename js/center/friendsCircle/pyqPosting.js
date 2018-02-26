
	//将同步到朋友圈去掉，替换为好友可见
	$('.func .seeDynamic,.func label').remove();
	//朋友圈列表;
	var friendListStr = '<span class="seeDynamic friendsCircle"><span>好友可见</span><ul><li class="visible">好友可见</li><li class="bf_visible">部分好友可见</li><li class="private">私密</li></ul></span>';
	$('.func .func_publish').before(friendListStr);

	
	//部分好友可见
	$(document).on("click",".seeDynamic li.bf_visible",function  (ev) {
		if($(".friends .theme span").html() == 0){
			warningMessage("您还没有好友");
			return false;
		}
		$('.JSsee_xz,#mask').fadeIn();
		$(".seeDynamic>span").html("部分好友可见");
		$("body").css("overflow","hidden");
		var groupname = "",newgroupname = "",rosterlist = "";
		OperationUserPostGroup(6,groupname,rosterlist,newgroupname);
		ev.stopPropagation();
	})
	
	//好友可见
	$(document).on("click",".seeDynamic li.visible",function  (ev) {
		$(".seeDynamic>span").html("好友可见");
		rosterlist = [];
		$(".seeDynamic ul").hide();
		ev.stopPropagation();
	})
	
	//私密
	$(document).on("click",".seeDynamic li.private",function  (ev) {
		$(".seeDynamic>span").html("私密");
		rosterlist = [UserName];
		$(".seeDynamic ul").hide();
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
	var rosterlength;
	SelectTheContact();
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
				if(msg.status == 0) {
					var str = "";
					var number = 0;
					for(var i = 0; i < msg.rosterItem.length; i++) {
						var mssg = msg.rosterItem[i];
						number = number + 1;
						var dName = mssg.username.split('@')[0];
						if(mssg.subscriptionType != 0 && mssg.subscriptionType != 4) {
							if(mssg.nickname!=null&&mssg.nickname!=""){
								str += '<li class="Chat_list">';
								if(mssg.avatarfile == "") {
									str += '<img  data-name=' + dName + ' data-nickname='+mssg.nickname+' class="img_item_'+i+'" src="/img/first.png">';
								} else {
									str += '<img  data-name=' + dName + ' data-nickname='+mssg.nickname+' class="img_item_'+i+'" src="' + ImgHOST() + mssg.avatarfile + '">';
								}
								/*是否有备注名*/
								if(mssg.markname == "" || mssg.markname == undefined) {
									str += '<span>' + mssg.nickname + '</span>';
								} else {
									str += '<span>' + mssg.markname + '</span>';
								}
							}
						}
					}
					$(".JSsee .list_01").html(str);
					rosterlength = $(".JSsee_xz .Chat_list");
				}
			},
			error: function() {
				console.log("error")
			}

		});
	}
	

	//  帖子的好友可见性
	function FriendsVisibility (mssg) {
		var str = "";
		if(mssg.user.username == UserName && rosterlength != undefined) {
			str += '<li>|</li>' +
					'<li>' +
					'<a class="delete" href="javascript:;"><i style="background:url(/img/delete.png) no-repeat center;"></i>删除</a>';
			 if(mssg.visibleusernames.length == 1 && mssg.visibleusernames[0].username == UserName && rosterlength.length != 0){            //私密
				str += '</li>' +
						'<li>|</li>' +
						'<li>' +
						'<a href="javascript:;"><i style="background:url(/img/qz_pyq_simi.png) no-repeat center;"></i>私密</a>' +				
						'</li><br class="clear"/></ul>';
			}else if(mssg.visibleusernames != "" && mssg.visibleusernames.length -1 < rosterlength.length){		          //部分人可见
				str += '</li>' +
						'<li>|</li>' +
						'<li>' +
						'<a class="friendImg" href="javascript:;"><i style="background:url(/img/friendImg.png) no-repeat center;"></i>部分人可见</a>' +
						'</li><br class="clear"/></ul>'+
						'<div class="VisibleFriends"><p>该动态可见好友<a href="javascript:;">关闭</a></p><ul>';
					for(var i = 0;i < mssg.visibleusernames.length;i++){	
						str += '<li><img src="'+ImgHOST()+mssg.visibleusernames[i].imagepath+'" align="left"/>'+mssg.visibleusernames[i].nickname+'</li>';
					}
					str += '</ul></div>';
			}else {						//好友可见
				str +='</li><br class="clear"/></ul>';
			}
		}else{
			str = '<br class="clear"/></ul>';
		}
		return str;
	}



	/*
	 * 选中选择联系人
	 */
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




	//好友可见列表
	var rosterlist = [];
   
   	function  OperationUserPostGroup(type,groupname,rosterlist,newgroupname,_this,is){
	 	var rosternamelist = {"rosternamelist":rosterlist};
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
					username:UserName,
					groupname:groupname,
					rosternamelist:rosternamelists,
					newgroupname:newgroupname
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
							_this.parents(".clearfix").find(".editFriends").fadeIn(200,function(){
								_this.addClass("bc_modify").removeClass("Modify").html("保存")
							});
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
					console.log("error")
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
					//tpl += '<span data-name='+mssg[i].rostermap[j].username+'>'+mssg[i].rostermap[j].nickname+'</span>';
					if(j < mssg[i].rostermap.length - 1){
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

		$(".JSsee_xz .pyq_img_list").empty();
		$(".JSsee_xz .friend_list li").removeClass("checkOn");
		$(".JSsee_xz .TagName em").removeClass("checkOn");
		$(".JSsee .TagName input").val("");  // 清空标签名

		if(type){
			$.im.save("是否保存本次编辑？", function() {
				OperationUserPostGroup(0,_val,hyList,_val);
				$(".JSsee .seeDynamic li.bf_visible").click();
			})
		}else{
			var _this = "";
			$(".JSsee_xz .cancelBtn").click();
			OperationUserPostGroup(0,_val,hyList,_val,_this,1);
		}
	}



	/*
	 
	 * 朋友圈发帖
	 * topic 帖子
	 * isRosterAccess   是否在朋友圈可见： 1可见    0不可见
	 * imageList    图片地址列表  {"imageList":["http://xxx","http://xxx"]}
	 * 
	 * */
	$(".InDynamic .func_publish").on("click", function() {
		var topictype = "";
		var content = html2Escape($("#FaceBoxText").val());
		var imagecount = ImageList.length;     // 发帖图片数量
		if(rosterlist == ""){
			var list = $(".JSsee_xz .Chat_list");
			for(var i =0;i < list.length;i++){
				rosterlist.push(list.eq(i).find("img").attr("data-name"));
			}
		}
		//部分好友可看
		var rosternamelist = {"rosterList":rosterlist};
	   	var rosternamelists = JSON.stringify(rosternamelist); // 好友列表
		
		if(ImageList.length == 0) {
			topictype = 0; //0:纯文本帖子
		} else {
			topictype = 4; //4:带图片帖子
		}

		var isRosterAccess = $(".InDynamic label").attr("data-id"); //朋友圈是否可见
		
		if ($.trim(content) == "" && imagecount == 0) {
			warningMessage("必须要有文字、图片或视频");
			return false;
		}
		
		var topic = {
			username: UserName,
			userNo: getCookie("userNo"),
			title: "",
			content: content,
			imagecount: imagecount, //图片数量
			videourl: "",
			visiblity:"公有",
			machine: "webpc", //"来自iphone 6s"--必填
			themeNo: "", //""--发生活圈的帖子必填，其他帖子不填
			code: "", //""--不填
			category: 0, //4,--必填0：朋友圈，2：行业圈，4：生活圈，8：首页
			topictype: topictype //0:纯文本帖子,2:视频帖子,4:带图片帖子
		};
		var PicList = {
			"imageList": ImageList
		};
		var Images = JSON.stringify(PicList);
		var topicc = JSON.stringify(topic);
		var PostingURL = "/topic/createRosterTopic.do";
		var data = {
			topic: topicc,
			rosterList:rosternamelists,
			imageList: Images
		}

		createIndexTopicN(data, PostingURL);
	})




	
	
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
		var list01 = $(".JSsee .friend_list .list_01");
		var list02 = $(".JSsee .friend_list .list_02");
		var word = html2Escape($(this).val());                  //搜索关键字
		list02.empty();
		if(word == "" || word == undefined){
			list01.show();
			list02.hide();
		}else{
			list01.hide();
			list02.show();
		}
		
		
		for(var i = 0;i < list.length;i++){
			if(list.eq(i).find("img").attr("data-name").indexOf(word) >= 0 || list.eq(i).find("span").text().indexOf(word) >= 0){
				list02.append('<li>'+list.eq(i).html()+'</li>')
			}
			
		}
	})

	

	/*
		编辑标签
	*/

	$(document).on("click",".JSsee_xz .selectLabel_t .Modify",function(){
		var groupname = $(this).parents("li").find(".friendType").html();
		var _this = $(this);
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
		$(".JSsee_tj .xz_img_list").empty();
		for(var i = 0;i < mssg.length;i++){
			for(var j = 0;j < imglist_02.length;j++){
				var img_list = imglist_02.eq(j).find("img");
				var name = img_list.attr("data-name");
				//  查找用户名和头像
				if(mssg[i] == name){
					var img = img_list.attr("src");
					var name = img_list.attr("data-name");
					var nickname = img_list.attr("data-nickname");
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





	$("#videoUpload").attr("id","friendsVideo");



	$(document).on("click", "#friendsVideo", function() {
		if($(this).hasClass("on")){
			videoText = html2Escape($(".text_part_v textarea").val());
			//部分好友可看
			if(rosterlist == ""){
				var list = $(".JSsee_xz .Chat_list");
				for(var i =0;i < list.length;i++){
					rosterlist.push(list.eq(i).find("img").attr("data-name"));
				}
			}
			var rosternamelist = {"rosterList":rosterlist};
		   	var rosternamelists = JSON.stringify(rosternamelist); // 好友列表
			
			var topic = {
				username: UserName,
				userNo: getCookie("userNo"),
				title: "",
				content: videoText,
				imagecount: 0, //图片数量
				videourl: videoU,
				visiblity: "公有",
				machine: "webpc", //"来自iphone 6s"--必填
				themeNo: "", //""--发生活圈的帖子必填，其他帖子不填
				code: "", //""--不填
				category: 0, //4,--必填0：朋友圈，2：行业圈，4：生活圈，8：首页
				topictype: 2 //0:纯文本帖子,2:视频帖子,4:带图片帖子
			};
		
			var PicList = {
				"imageList": urlV
			};
			var Images = JSON.stringify(PicList);
			var topicc = JSON.stringify(topic);
			createIndexVideoN({
				"topic": topicc,
				"rosterList":rosternamelists,
				"imageList": Images
			}, "/topic/createRosterTopic");
		}
	})


