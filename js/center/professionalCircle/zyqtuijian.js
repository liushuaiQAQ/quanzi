$(function() {
	//推荐的职业圈
	var page = 1;
	var tag = false; //触发开关，防止;多次调用事件
	getHotCircle({
		username:UserName,
		pageNum: 1,
		pageSize:10
	});
	$(window).scroll(function(event) {
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height(); //整个文档的高度
		var windowHeight = $(this).height();
		if (scrollTop + windowHeight + 2 >= scrollHeight) {
			if (tag == true) {
				tag = false;
				$("#dynamic_list").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
				page = page + 1;
				getHotCircle({
					username: UserName,
					pageNum: page,
					pageSize: 10
				});
			}

		}
	});

	function getHotCircle(datas) {
		var str = "";
		$.ajax({
			type: "post",
			url: serviceHOST() + "/jobstree/recommendJobStreeCircleByUsernameEX.do",
			headers: {
				"token": qz_token()
			},
			data: datas,
			success: function(msg) {
				$(".Toloadmore").remove();
				if(msg.data == "" ){
					tag = false;
					return false;
				}
				if (msg.status == 0) {
					$(".jiazai").hide();
					tag = true;
					var mssg = msg.data;
					str += '<div class="conList">'+
							'<ul class="professional_list">';
					for (var i = 0; i < mssg.length; i++) {
						// var n = (datas.pageNum - 1) * mssg.length + i;
						// if (mssg[i].circlecategory.indexOf("/") > -1) {
						// 	msgname = mssg[i].circlecategory.replace(/\//g, "_");
						// }
						
						 	
						 	var dataNames = mssg[i].themename;
						 	if (dataNames.indexOf("\/") > -1) {
						 		dataNames = dataNames.replace(/\//g, "_");
						 	} else {
						 		dataNames = dataNames;
						 	}
							var activeCount=mssg[i].activecount;
						 	if(activeCount>10000){
						 		activeCount=change (activeCount);
						 	}else{
						 		activeCount=mssg[i].activecount;
						 	}
						 	var subStr="";
						 	if(mssg[i].circletopicanycontent.indexOf("content")>-1||mssg[i].circletopicanycontent.indexOf("shareUrl")>-1){
						 		subStr="";
						 	}else{
						 		subStr=mssg[i].circletopicanycontent;
						 	}
								str += '<li class="pf_list" data-code="'+mssg[i].code+'" data-name="'+dataNames+'">' +
										'<ul>' +
											'<li class="zy zyhover">'+
												'<a href="/center/zhiye/mydynamic.html?code='+mssg[i].code+'">'+mssg[i].themename+'</a>'+
												'<span>圈子<i>'+activeCount+'</i>人</span>'+
											'</li>' +
											'<li class="zy qz_num">';
											if(mssg[i].circletopicanynickname!=""){
												str+='<span>'+mssg[i].circletopicanynickname+':<i>'+subStr+'</i>'+'</span>';
											}
												
												if (UserName != "") {
													if (mssg[i].isAttention == 1) { //0和1二种状态  1是已加入   0 是未加入 
														str += '<a class="join off" href="/center/zhiye/mydynamic.html?code='+mssg[i].code+'">进入</a>';
													} else {
														str += '<a class="join on" data-phone="'+mssg[i].isBingPhone+'" href="javascript:;">加入</a>';
													}
												} else {
													str += '<a class="join login_window" href="javascript:;">加入</a>';
												}
											str += '</li>';
											if (mssg[i].imagePathList.length > 0) {
												str += '<li class="pf_img"><a href="/center/zhiye/mydynamic.html?code='+mssg[i].code+'"><dl>';
												for (var a = 0; a < mssg[i].imagePathList.length; a++) {
													if(a<4){
														str += '<dd><img src="' + ImgHOST() + mssg[i].imagePathList[a] + '"></dd>';
													}
												}
												str += '</dl></a></li>';
											}
											str += '</ul>'
						 			str+='</li>';
						}
						str += '</ul>'+
							'</div>';
						$("#dynamic_list .professional").append(str);
						if(page != 1) AfterTheLoadCompleted();   //侧导航下移 
					}else if(msg.status==-3){
						getToken();
					};

				},
			error: function() {
				console.log('error')
			}
		})
	}

	$(document).on("click", ".professional_list .join.on", function() {
//		var isBingPhone=$(this).attr("data-phone");
//		if(getCookie("username").indexOf("wx_")==0||getCookie("username").indexOf("qq_uid_")==0||getCookie("username").indexOf("xl_")==0){
//			//第三方登录
//			if(isBingPhone=="false"){
//				thirdloginAlert()      //绑定手机号弹窗
//			 	return false;
//			}
//		}
		var arrCode = []; //关注职业圈数组
		var code = $(this).parents(".pf_list").attr("data-code");
		arrCode.push(code);
		var codeId = JSON.stringify(arrCode);
		var _this = $(this);
		$.ajax({
			type: "post",
			url: serviceHOST() + "/jobstree/joinedJobStree.do",
			headers: {
				"token": qz_token()
			},
			data: {
				"username": UserName,
				"codes": codeId
			},
			success: function(msg) {
				if (msg.status == 0) { //0是加入  -1是已经加入    1是          等级不够
					if (msg.data == 1) {
						_this.removeClass("on");
						_this.addClass("off");
						friendlyMessage("加入成功", function() {
//							_this.parent().append('<a class="join goCircle" href="javascript:;" style="margin-right:10px;">进入圈子</a>')
							_this.html("进入");
							_this.attr("href","/center/zhiye/mydynamic.html?code="+code);
						});
					}
				} else if (msg.status == -1) { //加入个数限制已满  需开通会员加入；
					circlelimit();         //加入上限提示
				}else if(msg.status==-3){
					getToken();
				}else if(msg.status==1){
//					warningMessage("当前等级加入已满，请升级vip会员");
					circlelimit(); 
				}else{
					warningMessage(msg.info);
				}
			},
			error: function() {
				console.log("error");
			}
		});
	});
	//取消加入的职业圈
//	$(document).on("click", ".professional_list .join.off", function() {
//		var code = $(this).parents(".pf_list").attr("data-code");
//		var _this = $(this);
//		$.ajax({
//			type: "post",
//			url: serviceHOST() + "/jobstree/deleteJoinedJobStree.do",
//			headers: {
//				"token": qz_token()
//			},
//			data: {
//				"username": UserName,
//				"code": code
//			},
//			success: function(msg) {
//				var joinS = JSON.parse(msg);
//				if (joinS.status == 0) {
//					if (joinS.data == 1) {
//						_this.removeClass("off");
//						_this.addClass("on");
//						_this.siblings('.goCircle').remove();
//						friendlyMessage("退出成功", function() {
//							_this.html("加入");
//						});
//					}
//				}
//			},
//			error: function() {
//				console.log("error");
//			}
//		});
//	});

	$(document).on('click', '.pf_img>img,.goCircle', function() {
		var code = $(this).parents('.pf_list').attr('data-code');
		var name = $(this).parents('.pf_list').attr('data-name');
		window.location.href = '/center/zhiye/mydynamic.html?code=' + code + '&dataName=' + name;
	});
	//第三方登录手机验证弹窗取消和差号点击
	$(document).on("click","#mskocc3 .testcan,#mskocc3 .parBox3 span",function(){
		$("#mskocc3").hide();
	})
	//第三方登录手机验证
	$(document).on("click",".phoneTest",function(){
		$("#mskocc3").hide();
		bindPhone();   //绑定手机号
	});
	
	
});
