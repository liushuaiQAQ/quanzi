$(function() {
	var texts = "";
	var word = getURIArgs("word"); //搜索关键字
	var code = getURIArgs("code");
	var type = getURIArgs("type");
	var form = getURIArgs("form");
	$("#TextID").val(word);

	var jg = '<div class="ineffectiveness_top">' +
		'<h3>抱歉，未找到"' + word + '"相关结果。</h3>' +
		'<p>建议:</p>' +
		'<p>您可以尝试更换关键词，再次搜索。</p>' +
		'</div>' +
		'<div class="ineffectiveness_bottom">' +
		'</div>';


	//  点击选择几个圈子动态
	$(document).on('click', '.dynamic_text', function(e) {
		$('.drop_menu').show();
		e.stopPropagation();
	});
	$(document).on('mouseenter', '.drop_menu ul li', function() {
		$('.drop_menu ul li').removeClass('menu_active');
		$('.drop_menu ul li a').removeClass('menu_text');
		$(this).addClass('menu_active');
		$(this).find('a').addClass('menu_text');

	});
	$(document).on('click', function() {
		$('.drop_menu').hide();
	});



	//  生活圈  全球圈  职业圈 搜索
	$(document).on("click", ".dynamic_text .drop_menu li", function() {
		var Txt = html2Escape($("#TextID").val());
		$("#dynamic_list").empty();
		$(".ineffectiveness").empty();
		word = getURIArgs("word");
		code = "";
		type = $(this).attr("data-id");
		window.location.href = '/center/searchresult.html?word=' + Txt + '&code=' + code + '&type=' + type + '&form=1';
	});


	//视频搜索
	$(".VideoSearch").on("click", function() {
		var Txt = html2Escape($("#TextID").val());
		$("#dynamic_list").empty();
		$(".ineffectiveness").empty();
		window.location.href = '/center/searchresult.html?word=' + Txt + '&code=' + code + '&form=2';
	})



	//用户搜索
	$(".FriendsSearch").on("click", function() {
		var Txt = html2Escape($("#TextID").val());
		$("#dynamic_list").empty();
		$(".ineffectiveness").empty();
		window.location.href = '/center/searchresult.html?word=' + Txt + '&form=3';
	})
	
	


	//闪聊搜索
	$(".flashChatSearch").on("click",function(){
		var Txt = html2Escape($("#TextID").val());
		$("#dynamic_list").empty();
		$(".ineffectiveness").empty();
		window.location.href = '/center/searchresult.html?word=' + Txt + '&form=4';
	});
	
	//圈子搜索
	$(".navSearchcircle").on("click",function(){
		var Txt = html2Escape($("#TextID").val());
		$("#dynamic_list").empty();
		$(".ineffectiveness").empty();
		window.location.href = '/center/searchresult.html?word=' + Txt + '&form=5';
	})
	//同城服务搜索
	$(".urbanServerSearch").on("click",function(){
		var Txt = html2Escape($("#TextID").val());
		$("#dynamic_list").empty();
		$(".ineffectiveness").empty();
		window.location.href = '/center/searchUrbanResult.html?word=' + Txt + '&form=6';
	})
	//圈子
	if (form == 5) {
		$(".navSearchcircle>a").addClass("navwrap_active");
		$(".navSearchcircle>span").addClass("bg_br");
		getSarchCircle({
			username:UserName,
			keyword:word,
			pageNum:1,
			pageSize:5
		});
	};
	
	//闪聊
	if (form == 4) {
		$(".flashChatSearch>a").addClass("navwrap_active");
		$(".flashChatSearch>span").addClass("bg_br");
		getHotChat(5,word);
	}

	//同城服务
	if (form == 6) {
		$(".urbanServerSearch>a").addClass("navwrap_active");
		$(".urbanServerSearch>span").addClass("bg_br");
		$("#dynamic_list").html('<ul class="urban_lists clearfix"></ul>');
		// findTopicListOfRosterCircle(1)
	}

	//用户搜索
	if (form == 3) {
		$(".FriendsSearch>a").addClass("navwrap_active");
		$(".FriendsSearch>span").addClass("bg_br");
		if (word != "") {
			FriendsSearch(1);
		} else {
			$(".ineffectiveness").html(jg);
		}
	}



	//视频搜索
	if (form == 2) {
		$(".VideoSearch>a").addClass("navwrap_active");
		$(".VideoSearch>span").addClass("bg_br");
		$("#dynamic_list").html('<ul class="collectionVideo"></ul>');
		getVmcollection(1);
	}



	//关键字搜索
	if (form == 1) {
		$(".dynamic_text .active").addClass("navwrap_active");
		$(".dynamic_text .search_active").css("background", "url('/img/active_xiala.png') 0 0 no-repeat");
		$(".dynamic_text>span").addClass("bg_br");
		//下拉加载动态
		findIndexTopics(1);
	}


	var page = 1;
	var stop = false;
	$(window).scroll(function(event) {
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if (scrollTop + windowHeight + 2 >= scrollHeight && UserName != "") {
			if (stop == true) {
				stop = false;
				$("#dynamic_list").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
				page = page + 1;
				if(form == 1){
					findIndexTopics(page);
				}else if(form == 2){
					getVmcollection(page);
				}else if(form == 3){
					FriendsSearch(page)
				}else if(form == 5){
					getSarchCircle({
						username:UserName,
						keyword:word,
						pageNum:page,
						pageSize:5
					});
				}
			}

		}
	})


	//好友搜索结果
	function FriendsSearch(page) {
		var nickname = "";
		var str = "";
		$("#dynamic_list .hy_search").removeClass("on");
		$.ajax({
			type: "post",
			url: serviceHOST() + "/user/searchUser.do",
			dataType: "json",
			data: {
				keyword: word,
				username: UserName,
				pageNum:page
			},
			headers: {
				token:qz_token()
			},
			success: function(msg) {
				if (msg.status == 0) {
					$(".Toloadmore").remove();
					$(".jiazai").hide();
					if (msg.data == "" && $(".hy_search li").length == 0) {
						$(".ineffectiveness").html(jg);
						stop = false;
						return false;
					}else if(msg.data == ""){
						stop = false;
						return false;
					}
					stop = true;
					for (var i = 0; i < msg.data.length; i++) {
						var mssg = msg.data[i].user;
						if (mssg.nickname != null&&mssg.nickname != "") {
							str += '<li data-nam="' + mssg.username + '">' + '<a class="jingtai" href="javascript:;" data-name="'+mssg.username+'">' +
								'<dl>';
							if (mssg.avatarfile == undefined||mssg.avatarfile == "") {
								str += '<dt><img src="/img/first.png"/></dt>';
							} else {
								str += '<dt><img src="' + ImgHOST() + mssg.avatarfile + '"/></dt>';
							}
							if (mssg.nickname.indexOf(word) >= 0) {
								nickname = mssg.nickname.replace(word, "<span style='color:#ff8a00;'>" + word + "</span>");
							} else {
								nickname = mssg.nickname;
							}
							str += '<dd class="informationk">' + nickname + '</dd>' +
								'<dd>' + (mssg.myindustry || "--") + '</dd>' +
								'</dl>' + '</a>' +
								'<div class="search_accept">';
							if(UserName != mssg.username){
								//关注状态
								if(mssg.isfollowing == 1){
									str += '<a class="search_att_y" href="javascript:;">取消关注</a>';
								}else{
									str += '<a class="search_att '+ no_login +'" href="javascript:;">关注</a>';
								}


								//好友添加状态
								if (mssg.relation == 0) {
									str += '<a class="Isfriends" href="javascript:;">请求已发送</a>';
								} else if (mssg.relation == 1 || mssg.relation == 2 || mssg.relation == 3) {
									str += '<a class="Isfriends" href="javascript:;">已添加</a>';
								} else if (mssg.relation == 4) {
									str += '<a class="Isfriends" href="javascript:;">已拒绝</a>';
								} else {
									str += '<a class="accept_s '+ no_login +'" href="javascript:;"><i></i>好友</a>';
								};
								
							}
							str += '</div>' +
								'</li>';
						}

					}
					$("#dynamic_list .hy_search").addClass("on").append(str);
					if(page != 1) AfterTheLoadCompleted();   //侧导航下移 
					if(!UserName) $(".rightOnLogin").show();
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}

		});
	};
	
	


	//用户跳转详情
	$(document).on("click", "#dynamic_list .hy_search dt", function() {
		var strangename = $(this).parents("li").attr("data-nam");
		getInfo({
			myname:getCookie("username")||"nouser",
			username:strangename,
			templetName:"pageJingtai"
		});

	})



	//搜索视频结果
	function getVmcollection(page) {
		var vname = getURIArgs("word");
		var userId = UserName;
		var str = "";
		$.ajax({
			type: "post",
			url: serviceHOST() + '/videoMaterial/getVmByPage.do',
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: {
				uid: userId,
				vname: vname,
				pageNum: page
			},
			success: function(msg) {
				$(".Toloadmore").remove();
				if (msg.data == "" && $(".collectionVideo li").length == 0) {
					$(".ineffectiveness").html(jg);
					$(".ineffectiveness_bottom").html("<h3>推荐视频</h3>");
					VideoResults(1);
					stop = false;
					return false;
				}
				if (msg.status == 0) {
					stop = true;
					VideoSearchResults(msg);
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}
		});



		//鼠标悬浮     收藏和播放按钮变化
		$(document).on("mouseover", ".videoBox", function() { //移入
			$(this).find(".playimg").css("background", "url(/img/qz_sp_bofang_xuanzhong.png) no-repeat")
		})
		$(document).on("mouseleave", ".videoBox", function() { //移出
			$(this).find(".playimg").css("background", "url(/img/qz_sp_bofang.png) no-repeat")
		})
		$(document).on("click", ".videoImg,.brief,.playimg", function() {
			var videoId = $(this).attr("data-id")
			window.location.href = "/center/videodetail.html?id=" + videoId;
		})



		//视频转发
		$(document).on("click", ".share,.sharelink", function(e) {
			$(this).parents("li").siblings().find(".sharelink").hide();
			var transmit="";
			if(UserName){
				transmit+= '<a class="share1" href="javascript:;">圈子朋友圈</a>' +
				'<a class="share2" href="javascript:;">圈子好友</a>' +
				//'<a class="share3" href="javascript:;">圈子群组</a>' +
				'<a class="share9" href="javascript:;">首页热门</a>';
			}else{
				transmit+= '<a class="share1 login_window" href="javascript:;">圈子朋友圈</a>' +
				'<a class="share2 login_window" href="javascript:;">圈子好友</a>' +
				//'<a class="share3 login_window" href="javascript:;">圈子群组</a>' +
				'<a class="share9 login_window" href="javascript:;">首页热门</a>';
			};
			
			transmit+='<a class="share5" href="javascript:;">' +
			'<span>微信朋友圈</span>' +
			'<div class="qrodeBox">' +
			'<p>分享到微信朋友圈</p>' +
			'<div></div>' +
			'</div>' +
			'</a>' +
			'<a class="share6" href="javascript:;">QQ空间</a>' +
			'<a class="share7" href="javascript:;">QQ好友</a>' +
			'<a class="share8" href="javascript:;">新浪微博</a>';
			$(this).parents("li").find(".sharelink").html(transmit);
			$(this).parents("li").find(".sharelink").css("padding", "15px 20px");
			//生成微信朋友圈二维码
			var viId = $(this).parents("dl").siblings(".brief").attr("data-id");
			var urls = serHOST()+"/Page/videoShare/index.html?uid=" + UserName + "&vmid=" + viId
			$(this).parents("dl").siblings(".sharelink").find(".qrodeBox div").qrcode({
				render: "canvas",
				width: 30 * 4,
				height: 30 * 4,
				text: urls
			});
			$(this).parents("li").find(".sharelink").toggle();

			//转发弹窗位置
			if ($(this).offset().top - $(window).scrollTop() + 290 > $(window).height()) {
				$(this).parents("li").find(".sharelink").css("top", "24px");
			} else {
				$(this).parents("li").find(".sharelink").css("top", "270px");
			}

			e.stopPropagation();
		})


		$(document).on("click", function(e) {
			$(".sharelink").hide();
			e.stopPropagation();
		})
	}



	/*
	 
	 *搜索视频无结果时 
	 * */

	function VideoResults(page) {
		var vname = getURIArgs("word");
		var userId = UserName;
		$.ajax({
			type: "post",
			url: serviceHOST() + '/videoMaterial/getVmByPage.do',
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: {
				uid: UserName,
				vname: "",
				pageNum: page
			},
			success: function(msg) {
				if (msg.status == 0) {
					stop = false;
					VideoSearchResults(msg);
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}
		});
	}



	//按关键字查询
	function findIndexTopics(page) {
		var URL = "/topic/getHomePageSearch.do";
		if ($("#dynamic_list .collectionVideo li").length != 0) {
			return false;
		}
		var str = "";
		$.ajax({
			type: "post",
			url: serviceHOST() + URL,
			data: {
				pageNum: page,
				username: UserName,
				word: word, //当用关键字搜索时传 
				code: code, //当按职业搜索时传
				type: type //1：表示首页，2：表示职业圈，3:表示生活圈，4：表示全球圈
			},
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				$(".Toloadmore").remove();
				if (msg.status == 0) {
					var mssg = msg.data;
					/*
					 * 是搜索为空时
					 */
					if (msg.data == "" && $(".content_items").length == 0) {
						$(".ineffectiveness").html(jg);
						$(".ineffectiveness_bottom").html("<h3>推荐动态</h3>");
						TheSearchIsEmpty(1);
						stop = false;
						return false;
					}
					if (msg.data == "") {
						stop = false;
						return false;
					}
					stop = true;
					$(".jiazai").hide();
					TheSearchResults(mssg);
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}

		});

	}



	/*
	 *
	 *搜索为空时 加载推荐动态 
	 * */
	function TheSearchIsEmpty(page) {
		var str = "";
		$.ajax({
			type: "post",
			url: serviceHOST() + "/topic/findIndexTopics.do",
			headers: {
				"token": qz_token()
			},
			data: {
				username: UserName,
				pageNum: page,
			},
			dataType: "json",
			success: function(msg) {
				$(".Toloadmore").remove();
				$(".jiazai").hide();
				if (msg.status == 0) {
					stop = false;
					var mssg = msg.data;
					TheSearchResults(mssg);
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}
		});
	};
	
	
	//	圈子搜索结果    标记
	function getSarchCircle(datas) {
		var str = "";
		$.ajax({
			type: "post",
			url: serviceHOST() + "/userCircle/searchCircleByKeyWord.do",
			headers: {
				"token": qz_token()
			},
			data: datas,
			success: function(msg) {
				$(".Toloadmore").remove();
				$(".jiazai").hide();
				if (msg.data == "" && $(".professional .professional_list li").length == 0) {
					$(".ineffectiveness").html(jg);
					$(".ineffectiveness_bottom").html("<h3>推荐圈子</h3>");
					tjshq()
					stop = false;
					return false;
				}else if(msg.data == ""){
					stop = false;
					return false;
				}
//				if(msg.data == ""&&datas.pageNum==1){
//					stop = false;
//					$('.professional').html("<div class='Isempty'><p>暂无搜索结果</p></div>");
//					return false;
//				}
				if (msg.status == 0&&msg.data!= "") {
					stop = true;
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
						 	};
						 	if(mssg[i].category==1){     //职业圈
						 		var codes=mssg[i].code;
						 		var hrefs="/center/zhiye/mydynamic.html?code="+codes;
						 	}else if(mssg[i].category==2){      //全球圈   
						 		var codes=mssg[i].cityCircleId;
						 		var hrefs="/center/global/mydynamic.html?code="+codes;
						 	}else if(mssg[i].category==3){      //生活圈
						 		var codes=mssg[i].themeNo;
						 		var hrefs="/center/life/mydynamic.html?code="+codes;
						 	}
								str += '<li class="pf_list" data-code="'+codes+'" data-name="'+dataNames+'" types="'+mssg[i].category+'">' +
										'<ul>' +
											'<li class="zy zyhover">'+
												'<a href="'+hrefs+'">'+mssg[i].themename+'</a>'+
												'<span>圈子<i>'+activeCount+'</i>人</span>'+
											'</li>' +
											'<li class="zy qz_num">';
											if(mssg[i].circletopicanynickname!=""){
												str+='<span>'+mssg[i].circletopicanynickname+':<i>'+subStr+'</i>'+'</span>';
											}
												
												if (UserName != "") {
													if (mssg[i].isAttention == 1||mssg[i].isAttention == 2) { //0和1二种状态  1是已加入   0 是未加入         //全球圈  1是创建   0 是未加入        2是加入
														str += '<a class="join off" href="'+hrefs+'">进入</a>';
													} else {
														str += '<a class="join on" href="javascript:;">加入</a>';
													}
												} else {
													str += '<a class="join login_window" href="javascript:;">加入</a>';
												}
											str += '</li>';
											if (mssg[i].imagePathList.length > 0) {
												str += '<li class="pf_img"><a href="'+hrefs+'"><dl>';
												for (var a = 0; a < mssg[i].imagePathList.length; a++) {
													if(a<5){
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
//						if(page != 1) AfterTheLoadCompleted();   //侧导航下移 
					}else if(msg.status==-3){
						getToken();
					};

				},
			error: function() {
				console.log('error')
			}
		})
	}


//	搜索圈子没有结果,推荐圈子   生活圈
	function tjshq() {
		var str = "";
		$(".jiazai").show()
		$.ajax({
			type: "post",
			url: serviceHOST() + "/userCircle/recommendCircleByUsernameEX.do",
			headers: {
				"token": qz_token()
			},
			data:{
				username:UserName,
				category:3,
				pageNum:1,
				pageSize:10
			},
			success: function(msg) {
				$(".Toloadmore").remove();
				$(".jiazai").hide()
				if (msg.status == 0&&msg.data!= "") {
					stop = true;
					var mssg = msg.data;
					str += '<div class="conList">'+
							'<ul class="professional_list">';
					for (var i = 0; i < mssg.length; i++) {
						 	var dataNames = mssg[i].circlecategoryList[0].themename;
						 	if (dataNames.indexOf("\/") > -1) {
						 		dataNames = dataNames.replace(/\//g, "_");
						 	} else {
						 		dataNames = dataNames;
						 	}
							var activeCount=mssg[i].circlecategoryList[0].activecount;
						 	if(activeCount>10000){
						 		activeCount=change (activeCount);
						 	};
						 	var subStr="";
						 	if(mssg[i].circlecategoryList[0].circletopicanycontent.indexOf("content")>-1||mssg[i].circlecategoryList[0].circletopicanycontent.indexOf("shareUrl")>-1){
						 		subStr="";
						 	}else{
						 		subStr=mssg[i].circlecategoryList[0].circletopicanycontent;
						 	};
						 	//生活圈
					 		var codes=mssg[i].circlecategoryList[0].themeNo;
					 		var hrefs="/center/life/mydynamic.html?code="+codes;
								str += '<li class="pf_list" data-code="'+codes+'" data-name="'+dataNames+'" types="'+mssg[i].circlecategoryList[0].category+'">' +
										'<ul>' +
											'<li class="zy zyhover">'+
												'<a href="'+hrefs+'">'+mssg[i].circlecategoryList[0].themename+'</a>'+
												'<span>圈子<i>'+activeCount+'</i>人</span>'+
											'</li>' +
											'<li class="zy qz_num">';
//											if(mssg[i].circletopicanynickname!=""){
//												str+='<span>'+mssg[i].circletopicanynickname+':<i>'+subStr+'</i>'+'</span>';
//											}
												
												if (UserName != "") {
													if (mssg[i].circlecategoryList[0].isAttention == 1||mssg[i].circlecategoryList[0].isAttention == 2) { //0和1二种状态  1是已加入   0 是未加入         //全球圈  1是创建   0 是未加入        2是加入
														str += '<a class="join off" href="'+hrefs+'">进入</a>';
													} else {
														str += '<a class="join on" href="javascript:;">加入</a>';
													}
												} else {
													str += '<a class="join login_window" href="javascript:;">加入</a>';
												}
											str += '</li>';
											if (mssg[i].circlecategoryList[0].imagePathList.length > 0) {
												str += '<li class="pf_img"><a href="'+hrefs+'"><dl>';
												for (var a = 0; a < mssg[i].circlecategoryList[0].imagePathList.length; a++) {
													if(a<5){
														str += '<dd><img src="' + ImgHOST() + mssg[i].circlecategoryList[0].imagePathList[a] + '"></dd>';
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
						if(!UserName) $(".rightOnLogin").show();
					}else if(msg.status==-3){
						getToken();
					};

				},
			error: function() {
				console.log('error')
			}
		})
	};
	

	/*
	 *加好友
	 *
	 */
	$(document).on("click", ".search_accept .accept_s", function() {
		var jid2add = $(this).parents("li").attr("data-nam");
		var _this = $(this);
		if(UserName) AddfriendRequest(UserName, jid2add, _this);
	})



	/*
	 *
	 *视频搜索无结果时 
	 * 
	 * */

	function VideoSearchResults(msg) {
		var author = "";
		var len = msg.data.length;
		var subLen = "";
		var mssg = msg.data;
		if (msg.data == "") {
			stop = false;
		}
		for (var i = 0; i < len; i++) {
			var briefs = mssg[i].brief
			if (briefs.length > 36) {
				subLen = briefs.substr(0, 36) + "..."
			} else {
				subLen = briefs
			};
			var visite = (Math.round((mssg[i].visites / 10000) * 100) / 100).toFixed(1);
			str = '<li>' +
				'<div class="videoBox">' +
				'<div class="videoImg" data-collection="' + mssg[i].iscollection + '" data-id="' + mssg[i].id + '">' +
				'<img src="' + mssg[i].vpicurl + '"/>' +
				'</div>' +
				'<span class="playNum">'+visite+'万</span>'+
				//'<span class="times">' + "12:15" + '</span>' +
				'<div class="playimg" data-id="' + mssg[i].id + '"></div>';
			
		
			str += '<div class="opacityBg"></div>' +
				'</div>';
			if (subLen.indexOf(word) >= 0) {
				subLen = subLen.replace(word, "<span style='color:#ff8a00;'>" + word + "</span>");
			}
			str += '<a class="brief" data-id="' + mssg[i].id + '" href="javascript:;">' + subLen + '</a>';
			if (mssg[i].author.indexOf(word) >= 0) {
				author = mssg[i].author.replace(word, "<span style='color:#ff8a00;'>" + word + "</span>");
			} else {
				author = mssg[i].author;
			}
			if (mssg[i].authoravatar=='"null"'||mssg[i].authoravatar==''||mssg[i].authoravatar==null||mssg[i].authoravatar=='null') {
				str += '<div class="userName" style="background:url(/img/first.png) no-repeat 10px center;background-size:20px 20px;">' + author + '</div>';
			} else {
				var urls=ImgHOST()+mssg[i].authoravatar;        //用户头像
				if(mssg[i].authoravatar.indexOf("http")>-1){
					str += '<div class="userName" style="background:url(' +mssg[i].authoravatar+ ') no-repeat 10px center;background-size:20px 20px;">' + author + '</div>';
				}else{
					str += '<div class="userName" style="background:url(' + urls + ') no-repeat 10px center;background-size:20px 20px;">' + author + '</div>';
				}
				
			}
			var commentNum=mssg[i].comments;
				if(commentNum>10000){
					commentNum=change (commentNum);
				}else{
					commentNum=commentNum||0;
				}
			str += '<dl>';
//				'<dt>' + visite + '万' + '</dt>';
				if(mssg[i].iscollection==1){     // 1是已收藏
					str+='<dd class="collect" data-id="'+mssg[i].id+'" data_isCol="'+mssg[i].iscollection+'">取消收藏</dd>';
					str+='<dd class="colloction">'+commentNum+'</dd>'+
							'<dd class="share">分享</dd>';
				}else{
					str+='<dd class="collect" data-id="'+mssg[i].id+'" data_isCol="'+mssg[i].iscollection+'">收藏</dd>';
					str+='<dd class="colloction">'+commentNum+'</dd>'+
							'<dd class="share">分享</dd>';
				}
				str+='<br class="clear" />' +
				'</dl>' +
				'<div class="sharelink" style="display: none;">' +
				'</div>' +
				'</li>';
			$("#dynamic_list ul").append(str);
			if(!UserName) $(".rightOnLogin").show();
			if(page != 1) AfterTheLoadCompleted();   //侧导航下移 
		}
	}



	/*
	 *  用户收藏视频vmcollection
	 */
	$(document).on("click", ".videoBox .NotCollect", function() {
		var _this = $(this);
		var vmid = $(this).parents(".videoBox").find(".playimg").attr("data-id");
		if(UserName) vmcollection(vmid, _this);
	})

	function vmcollection(vmid, _this) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/videoMaterial/vmcollection.do",
			data: {
				uid: UserName,
				vmid: vmid,
			},
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				if (msg.status == 0) {
					friendlyMessage("收藏成功");
					_this.removeClass("NotCollect");
					_this.addClass("AlreadyCollected");
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}
		});
	}



	/*
	 * 取消视频收藏cancelVmCollection
	 */
	$(document).on("click", ".videoBox .AlreadyCollected", function() {
		var _this = $(this);
		var vmid = $(this).parents(".videoBox").find(".playimg").attr("data-id");
		cancelVmCollection(vmid, _this);
	})

	function cancelVmCollection(vmid, _this) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/videoMaterial/cancelVmCollection.do",
			data: {
				uid: UserName,
				vmid: vmid,
			},
			headers: {
				"token": qz_token()
			},
			dataType: "json",
			success: function(msg) {
				if (msg.status == 0) {
					friendlyMessage("取消收藏成功");
					_this.addClass("NotCollect");
					_this.removeClass("AlreadyCollected");
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}
		});
	}

	/**************点击下方视频收藏取消接口开始*********************/
	$(document).on("click", ".collectionVideo .collect", function() {
		var _this=$(this);
			if (getCookie("username")) {
				var _thisCollction = $(this).attr("data_isCol"); //获取当前收藏的状态
				var _id=$(this).attr("data-id");
				if (_thisCollction == 0) { //未收藏
					$.ajax({
						type: "post",
						url: serviceHOST() + "/videoMaterial/vmcollection.do",
						dataType: "json",
						headers: {
							"token": qz_token()
						},
						data: {
							uid: getCookie("username"),
							vmid:_id
						},
						success: function(msg) {
							if (msg.status == 0) {
								if (msg.data == 1) { //1代表收藏成功     0表示已经收藏过，不可以再收藏
									friendlyMessage("收藏成功", function() {
										_this.html("取消收藏").attr("data_isCol", 1);
										_this.parents("dl").find("dd").css("margin-left","5px");
										_this.parents("li").find(".videoBox").find(".videoImg").attr("data-collection",1);
									});
								}
							}else if(msg.status==-3){
								getToken();
							};
						},
						error: function() {
							console.log("error")
						}

					});
				} else if (_thisCollction == 1) { //取消收藏
					$.im.confirm("确定要取消收藏吗？", function() {
						$.ajax({
							type: "post",
							url: serviceHOST() + "/videoMaterial/cancelVmCollection.do",
							dataType: "json",
							headers: {
								"token": qz_token()
							},
							data: {
								uid: getCookie("username"),
								vmid:_id
							},
							success: function(msg) {
								if (msg.status == 0) {
									if (msg.data == 1) {
										_this.html("收藏").attr("data_isCol", 0);
										_this.parents("dl").find("dd").css("margin-left","15px");
										_this.parents("li").find(".videoBox").find(".videoImg").attr("data-collection",0);
									}
								}else if(msg.status==-3){
									getToken();
								};
							},
							error: function() {
								console.log("error")
							}

						});
					})

				}
			} else {
				$(".userLogin a").click();
			}
		})
	/**************视频收藏接口结束*********************/

	/*
	 *  加载关键字搜索动态
	 * 
	 * */
	function TheSearchResults(mssg) {
		stop = true;
		for (var i = 0; i < mssg.length; i++) {
			var nums = (page - 1) * mssg.length + i;
			var imagepath = mssg[i].topic.imagepath; //文章图片
			var commentlist = mssg[i].commentlist; //评论人列表
			var clickMaplist = mssg[i].clickMaplist; //点赞人头像

			str = PostDynamicUserDetails(mssg[i]); //帖子用户信息

			str += '<div class="article">';

			if (mssg[i].topic.topictype == 8) { //转发		
				var msg = JSON.parse(mssg[i].topic.content);
				var content = '';
				if (msg.content != undefined && msg.content != ""){
					if (msg.content.indexOf("\n") > -1) { //判断有否有回车符  有则换行
						content = msg.content.replace(/\n/g, "</br>");
					} else {
						content = msg.content;
					};
				};
				/*
				 * 对搜索关键字标注
				 */
				if(content.indexOf(word) > -1){
					content = content.replace(word, "<span style='color:#ff8a00;'>" + word + "</span>");
				}
				str += '<div class="article_content" data-content="' + msg.content + '">' + toFaceImg(content) + '</div></div>';
			} else {
				if (mssg[i].topic.content != undefined && mssg[i].topic.content.indexOf("\n") > -1) { //判断有否有回车符  有则换行
					content = mssg[i].topic.content.replace(/\n/g, "</br>");
				} else {
					content = mssg[i].topic.content;
				};
				if(content.indexOf(word) > -1){
					content = content.replace(word, "<span style='color:#ff8a00;'>" + word + "</span>");
				};
				str += '<div class="article_content" data-content="' + mssg[i].topic.content + '">' + toFaceImg(content) + '</div></div>';
			}

			/*
			 * 对搜索关键字标注
			 */
			// if (mssg[i].topic.content.indexOf(word) > -1) {
			// 	texts = mssg[i].topic.content.replace(word, "<span style='color:#ff8a00;'>" + word + "</span>");
			// } else {
			// 	texts = mssg[i].topic.content;
			// }


			/*
			 *判断有否有回车符  有则换行
			 */
			// if (mssg[i].topic.content.indexOf("\n") > -1) {
			// 	str += '<div class="article_content" data-content="' + texts + '">' + toFaceImg(texts.replace(/\n/g, "</br>")) + '</div></div>';
			// } else {
			// 	str += '<div class="article_content" data-content="' + texts + '">' + toFaceImg(texts) + '</div></div>';
			// }

			//topictype==2  动态为视频
			if (mssg[i].topic.topictype == 2) {
				str += '<div class="article_video">' + addVideo(ImgHOST() + mssg[i].topic.videourl, mssg[i].topic.id, ImgHOST() + mssg[i].topic.videourl + "-start-s") +
					'</div>';
			}

			str += '<div class="onDisplay"></div>' +
				'<div class="pictureShow photoblock-many">' +
				'<ul>';



			//文章图片

			str += TheArticleShowUs(mssg[i], imagepath);


			//判断是否赞过
			//加载点赞人头像

			str += DetermineWhetherPraise(mssg[i], clickMaplist, 2);


			//帖子评论动态  评论
			str += PostCommentsContent(mssg[i], commentlist, nums, str, $("#dynamic_list"));

			if(!UserName) $(".rightOnLogin").show();
		}
	}
	
	
	$(document).on("click",".jingtai",function(){
		var strangename=$(this).attr('data-name');
		getInfo({
			myname:getCookie("username")||"nouser",
			username:strangename,
			templetName:"pageJingtai"
		});
	})
	


	//关注用户
	$(document).on("click",".search_att",function(){
		var following = $(this).parents("li").attr("data-nam");
		if(UserName) setFocus(UserName, following,$(this),2)
	})

	//取消关注用户
	$(document).on("click",".search_att_y",function(){
		var following = $(this).parents("li").attr("data-nam");
		unsetFocus(UserName, following,$(this),2)
	});
//	if(mssg[i].category==1){     //职业圈
//						 		var codes=mssg[i].code;
//						 		var hrefs="/center/zhiye/mydynamic.html?code="+codes;
//						 	}else if(mssg[i].category==2){      //全球圈   
//						 		var codes=mssg[i].cityCircleId;
//						 		var hrefs="/center/global/mydynamic.html?code="+codes;
//						 	}else if(mssg[i].category==3){      //生活圈
//						 		var codes=mssg[i].themeNo;
//						 		var hrefs="/center/life/mydynamic.html?code="+codes;
//						 	}
	//	职业圈加入
	
	$(document).on("click", ".professional_list .join.on", function() {
		var code = $(this).parents(".pf_list").attr("data-code");
		var types= $(this).parents(".pf_list").attr("types");
		var _this = $(this);
		if(types==1){    //职业圈
				var arrCode = []; //关注职业圈数组
				arrCode.push(code);
				var codeId = JSON.stringify(arrCode);
				$.ajax({
					type: "post",
					url: serviceHOST() + "/jobstree/joinedJobStree.do",
					headers: {
						"token": qz_token()
					},
					data: {
						"username": getCookie("username"),
						"codes": codeId
					},
					success: function(msg) {
						if (msg.status == 0) { //0是加入  -1是已经加入    1是          等级不够
							if (msg.data == 1) {
								_this.removeClass("on");
								_this.addClass("off");
								friendlyMessage("加入成功", function() {
		//							_this.parent().append('<a class="join goCircle" href="javascript:;" style="margin-right:10px;">进入圈子</a>')
									_this.html("进入").attr("href","/center/zhiye/mydynamic.html?code="+code);
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
			}else if(types==2){    //全球圈
				$.ajax({
					type:"post",
					url:serviceHOST()+"/citycircleusermap/joinCitycircle.do",
					data:{
						"username":getCookie("username"),
						"citycircleId":code
					},
					headers: {
						"token": qz_token()
					},
					success:function(msg){
						if(msg.status==0){
							if(msg.data==1){
								_this.removeClass("on");
								_this.addClass("off");
								friendlyMessage("加入成功",function(){
									_this.html("进入");
									_this.attr("href","/center/global/mydynamic.html?code="+code);
								})
							}
						}else if(msg.status==-1){
							warningMessage(msg.info);
						}else if(msg.status==-3){
							getToken();
						};
					},
					error:function(){
						console.log("error");
					}
				});
			}else if(types==3){    //生活圈
				$.ajax({
					type: "post",
					url: serviceHOST() + "/theme/createThemeofusermap.do",
					dataType: "json",
					headers: {
						"token": qz_token()
					},
					data: {
						username:getCookie("username"),
						themeNo:code
					},
					success: function(msg) {
						if(msg.status == 0) {
							_this.removeClass("on");
							_this.addClass("off");
							friendlyMessage("加入成功", function() {
								_this.html("进入");
								_this.attr("href","/center/life/mydynamic.html?code="+code);
							})
						}else if(msg.status == -1){
							warningMessage(msg.info);
						}else if(msg.status==-3){
							getToken();
						};
					},
					error: function() {
						warningMessage(msg.info);
					}
				});
			}
		});
		

})