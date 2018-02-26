$(function() {
//	var uses = getCookie("username") || ""; //用户名
//	var themeName = getURIArgs("t");  
//	//生活圈分类
//	getAllThemeCatetories()
//
//	//获取某个生活圈的所有话题
//	getCirclesByCatetory(1);
//	var page = 1;
//	var tag = false; //触发开关，防止;多次调用事件 
//	var stop = false; 
//	$(window).scroll(function(event) {
//		var scrollTop = $(this).scrollTop();
//		var scrollHeight = $(document).height(); //整个文档的高度
//		var windowHeight = $(this).height();
//		if(scrollTop + windowHeight + 2 >= scrollHeight) {
//			if(tag == true) {
//				tag = false;
//				$("#dynamic_list").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
//				page = page + 1;
//				getCirclesByCatetory(page);
//			}
//
//		}
//	})
//
//	function getCirclesByCatetory(page) {
//		var str = "";
//		var joinCount="";
//		$.ajax({
//			type: "post",
//			url: serviceHOST() + "/theme/getCirclesByCatetory.do",
//			dataType: "json",
//			headers: {
//				"token": qz_token()
//			},
//			data: {
//				username: uses,
//				pageNum: page,
//				catetory: getURIArgs("id")
//			},
//			success: function(msg) {
//				$(".Toloadmore").remove();
//				if(msg.status == 0) {
//					$(".jiazai").hide();
//					$(".dynamic").html(themeName);
//					$(".centerlist").css({
//						"background": "#fff",
//						"min-height":"854px",
//						"height": "auto"
//					})
//					tag = true;
//					if(msg.data == "" && page == 1){
//						var  str='<p style="font-size:16px;line-height:800px;text-align:center;">该分类下暂无圈子</p>'
//						$(".lists").html(str);
//						tag = false;
//					}
//					if(msg.data == ""){
//						tag = false;
//					}
//					
//					for(var i = 0; i < msg.data.length; i++) {
//						str = '<li data-id='+msg.data[i].themeNo+'>' +
//							'<a href="/center/life/mydynamic.html?code='+msg.data[i].themeNo+'" class="boxs">'
//						if(msg.data[i].imagepath == ""){
//							str += '<span class="themeImg"><img src="/img/first.png"/></span>';
//						}else if(msg.data[i].imagepath.indexOf("http") > -1) {
//							str += '<span class="themeImg"><img src="' + msg.data[i].imagepath + '" onerror=javascript:this.src="/img/first.png"></span>';
//						} else {
//							str += '<span class="themeImg"><img src="' + ImgHOST() + msg.data[i].imagepath +'" onerror=javascript:this.src="/img/first.png"></span>';
//						}
//						str += '<div class="themes">' +
//							'<p>' + msg.data[i].themename + '</p>' +
//							'<div><span><i class="item_01">' + msg.data[i].attentioncount + '</i>人加入</span><span>|</span><span><i class="item_02">' + msg.data[i].attentioncount + '</i>人活跃</span></div>' +
//							'</div>' +
//							'<br class="clear"/>' +
//							'</a>';
//							if(uses!=""){
//								if(msg.data[i].isAttention == 0 || msg.data[i].isAttention == 2) { 		// 0 未加入 1 已加入 2 自己创建
//									str += '<div class="sh_joins on" themeNo="' + msg.data[i].themeNo + '">加入</div>';
//								} else if(msg.data[i].isAttention == 1) {
//									str += '<div class="sh_joins off" themeNo="' + msg.data[i].themeNo + '">退出</div>';
//								}
//							}else{
//								str += '<div class="joins login_window" themeNo="' + msg.data[i].themeNo + '">加入</div>';
//							}
//						
//						str += '</li>'
//						$(".lists ul").append(str);
//						$(".item_shq").addClass("onbg");
//					}
//				}else if(msg.status==-3){
//					getToken();
//				};
//			},
//			error: function() {
//				console.log("err")
//			}
//		});
//	}
//	
//
//
//
//
//	
//
//	//用户加入话题接口
//	function createThemeofusermap(themes, thiss) {
//		$.ajax({
//			type: "post",
//			url: serviceHOST() + "/theme/createThemeofusermap.do",
//			dataType: "json",
//			headers: {
//				"token": qz_token()
//			},
//			data: {
//				username: uses,
//				themeNo: themes
//			},
//			success: function(msg) {
//				if(msg.status == 0) {
//					thiss.removeClass("on");
//					thiss.addClass("off");
//					friendlyMessage("加入成功", function() {
//						thiss.html("退出");
//					})
//				}else if(msg.status==-3){
//					getToken();
//				};
//			},
//			error: function() {
//				console.log("err")
//			}
//		});
//	}
//	$(document).on("click", ".centerlist .sh_joins.on", function() {
//		var themeNo = $(this).attr("themeNo");
//		var _this = $(this);
//		createThemeofusermap(themeNo, _this);
//	})
//
//	//用户取消加入
//	function dropThemeofusermap(themes, thiss) {
//		$.ajax({
//			type: "post",
//			url: serviceHOST() + "/theme/dropThemeofusermap.do",
//			dataType: "json",
//			headers: {
//				"token": qz_token()
//			},
//			data: {
//				username: uses,
//				themeNo: themes
//			},
//			success: function(msg) {
//				if(msg.status == 0) {
//					thiss.removeClass("off");
//					thiss.addClass("on");
//					friendlyMessage("退出成功", function() {
//						thiss.html("加入");
//					})
//				}else if(msg.status==-3){
//					getToken();
//				};
//			},
//			error: function() {
//				console.log("err");
//			}
//		});
//	}
//	$(document).on("click", ".centerlist .sh_joins.off", function() {
//		var themeNo = $(this).attr("themeNo");
//		var _this = $(this);
//		dropThemeofusermap(themeNo, _this);
//		
//	})
	

//以下是新改部分
	var uses = getCookie("username") || ""; //用户名
	var themeName = getURIArgs("t");  
	//生活圈分类
	getAllThemeCatetories()

	//获取某个生活圈的所有话题
	getCirclesByCatetory(1);
	var page = 1;
	var tag = false; //触发开关，防止;多次调用事件 
	$(window).scroll(function(event) {
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height(); //整个文档的高度
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 2 >= scrollHeight) {
			if(tag == true) {
				tag = false;
				$("#dynamic_list").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
				page = page + 1;
				getCirclesByCatetory(page);
			}

		}
	})

	function getCirclesByCatetory(page) {
		var str = "";
		var joinCount="";
		$.ajax({
			type: "post",
			url: serviceHOST() + "/theme/getCirclesByCatetory.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: {
				username: uses,
				pageNum: page,
				catetory: getURIArgs("id")
			},
			success: function(msg) {
				$(".Toloadmore").remove();
				if(msg.status == 0) {
					$(".jiazai").hide();
					$(".dynamic").html(themeName);
					if(msg.data == "" && page == 1){
						$(".professional").css({
							"background": "#fff",
							"min-height":"854px"
						})
						str='<p style="font-size:16px;line-height:800px;text-align:center;">该分类下暂无圈子</p>'
						$("#dynamic_list .professional").html(str);
						tag = false;
						return false;
					}
					tag = true;
					if(msg.data == ""){
						tag = false;
					}
					//	新添加 
					var mssg = msg.data;
					str += '<div class="conList">'+
							'<ul class="professional_list">';
					for (var i = 0; i < mssg.length; i++) {
						var dataNames = mssg[i].themename;
						 	if (dataNames.indexOf("\/") > -1) {
						 		dataNames = dataNames.replace(/\//g, "_");
						 	} else {
						 		dataNames = dataNames;
						 	}
							var attentioncount=mssg[i].attentioncount;
						 	if(attentioncount>10000){
						 		activeCount=change (attentioncount);
						 	}else{
						 		attentioncount=mssg[i].attentioncount;
						 	}
						 	var subStr="";
						 	if(mssg[i].circletopicanycontent.indexOf("content")>-1){
						 		subStr="";
						 	}else{
						 		subStr=mssg[i].circletopicanycontent;
						 	}
								str += '<li class="pf_list" data-code="'+mssg[i].themeNo+'" data-name="'+dataNames+'">' +
										'<ul>' +
											'<li class="zy zyhover">'+
												'<a href="/center/life/mydynamic.html?code='+mssg[i].themeNo+'">'+mssg[i].themename+'</a>'+
												'<span>圈子<i>'+attentioncount+'</i>人</span>'+
											'</li>' +
											'<li class="zy qz_num">';
												if(mssg[i].circletopicanynickname!=""){
													str+='<span>'+mssg[i].circletopicanynickname+':'+'<i>'+subStr+'</i>'+'</span>';
												};
												if (uses != "") {
													if (mssg[i].isAttention == 1) { //0和1二种状态  1是已加入   0 是未加入 
														str += '<a class="join off" href="/center/life/mydynamic.html?code='+mssg[i].themeNo+'">进入</a>';
													} else {
														str += '<a class="join on" href="javascript:;">加入</a>';
													}
												} else {
													str += '<a class="join login_window" href="javascript:;">加入</a>';
												}
											str += '</li>';
											if (mssg[i].imagePathList.length > 0) {
												str += '<li class="pf_img"><a href="/center/life/mydynamic.html?code='+mssg[i].themeNo+'">';
												for (var a = 0; a < mssg[i].imagePathList.length; a++) {
													if(a<4){
														str += '<img src="' + ImgHOST() + mssg[i].imagePathList[a] + '">';
													}
												}
												str += '</a></li>';
											}
											str += '</ul>'
						 			str+='</li>';
						}
						str += '</ul>'+'</div>';
						$("#dynamic_list .professional").append(str);
						if(page != 1) AfterTheLoadCompleted();   //侧导航下移 
					
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("err")
			}
		});
	}
	




	

	//用户加入话题接口
	function createThemeofusermap(themes, thiss) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/theme/createThemeofusermap.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: {
				username: uses,
				themeNo: themes
			},
			success: function(msg) {
				if(msg.status == 0) {
					thiss.removeClass("on");
					thiss.addClass("off");
					friendlyMessage("加入成功", function() {
						thiss.html("进入");
						thiss.attr("href","/center/life/mydynamic.html?code="+themes);
					})
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("err")
			}
		});
	}
	$(document).on("click", ".professional_list .join.on", function() {
		var themeNo = $(this).parents(".pf_list").attr("data-code");
		var _this = $(this);
		createThemeofusermap(themeNo, _this);
	});
	
	
	
	
})