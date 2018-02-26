
$(function() {
	var index = getURIArgs("t");
	var keyList = $(".classification li").eq(index);
	var _t = getURIArgs("t"); //标号
	var _w = getURIArgs("w"); //关键字
	var _p = getURIArgs("posting"); //关键字


	if (_p) {
		$('#FaceBoxText').focus();
	}

	//首页发帖选择
	$('.func>label').remove();
	var friendListStr = '<span class="seeDynamic publishArticle">\
						<span class="xz_classify t_xz_classify">职业圈</span>\
						<ul>\
						<li class="tacitly article_in">\
						<em>默认</em>\
						<span class="xz_classify">职业圈</span>\
						</li>\
						<li class="func_myCircle">我的圈子</li>\
						</ul>\
						</span>';
	$('.func .func_publish,#videoUpload').before(friendListStr);

	//打开我的圈子
	$(document).on("click", ".func_myCircle", function() {
		$("#mask").fadeIn(200, function() {
			$(".ft_my_circle").show()
		});
		$("body").css("overflow","hidden");
	});
	
	//关
	$(".ft_my_circle .ft_c_t>a").on("click", function() {
		$(".ft_my_circle").fadeOut(200, function() {
			$("#mask").hide()
		});
		$("body").css("overflow","auto");
	});

	//选择要发帖的圈子
	$(document).on("click", ".all_my_circle li", function() {
		var _this = $(this);
		var w = _this.text();
		var code = _this.attr("data-code");
		var type = _this.attr("type");
		$(".t_xz_classify").html(w).attr("data-code", code).attr("type", type);
		$(".ft_my_circle .ft_c_t>a").click();
	})
	$(document).on("click", ".article_in", function() {
		var _this = $(this).find("span");
		$(".t_xz_classify").html(_this.text()).attr("data-code", _this.attr("data-code")).attr("type", _this.attr("type"));
	})



	 
//	加载所有动态地区获取当前城市
	function findIndexTopics(catetory, page ,isRecommend) {
		if(isRecommend == 1){
			var tcKeyWord = "";
		}else{
			var tcKeyWord = getURIArgs("word")||"";
		}
		$.ajax({
			type: "get",
			dataType:"jsonp",
			url: "//api.map.baidu.com/location/ip?ak=gcLLgpc9GLakQTBQzfeNDZaeHM31Vyz2",
			success: function(addressmsg) {
				if(getCookie("locationName")){
					var address_detail = getCookie("locationName")||"北京市";
				}else{
					var address_detail = addressmsg.content.address_detail.city||"北京市";
				}
				var str = "";
				$.ajax({
					type: "post",
					url: serviceHOST() + "/tcProduct/tcHotRecommendProductsList.do",
					data:{"pageNum":page||1,"pageSize":10,"type":"0","keyWord":tcKeyWord,"cityName":address_detail,"username":getCookie("username"),},
					dataType: "json",
					headers: {
						"token": qz_token()
					},
					success: function(msg) {
						if(msg.status==-3){
							getToken();
						};
						if(isRecommend == 1 && msg.total == 0){
							$(".ineffectiveness_bottom").remove()
							return false;
						}
						displayFrontPageDynamics(msg,isRecommend);
					},
					error: function() {
						console.log("error")
					}
		
				});
			}
		})
	}



	//搜索关键字查询动态
	function keywordSearch(page, word) {
		var str = "";
		$.ajax({
			type: "post",
			url: serviceHOST() + "/topic/getHomePageSearch.do",
			data: {
				pageNum: page,
				username: UserName,
				word: word, //当用关键字搜索时传 
				code: "", //当按职业搜索时传
				type: 1 //1：表示首页，2：表示职业圈，3:表示生活圈，4：表示全球圈
			},
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				if (msg.status == 0) {
					var index = getURIArgs("t");
					var keyList = $(".classification li").eq(index);
					$(".classification li").removeClass("pitch");
					keyList.addClass("pitch");
					displayFrontPageDynamics(msg);
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}

		});

	}


	// 推荐动态
	// t 推荐圈子动态
	// w 搜索关键字查询动态
	if (_w || _t) {
		if (_w && _t) {
			keywordSearch(1, _w);
		} else if (_t) {
			var index = _t
			findIndexTopics(keyList.attr("data-fl"), 1);
		}

		$(".classification li").removeClass("pitch");
		keyList.addClass("pitch");
		$(".dynamic .list_bg").html(keyList.html() || getURIArgs("w"));
	} else if (getURIArgs("qz")) { //朋友圈
		var cf = '<div class="not_friends chartlet"><p>登录后，朋友圈消息会在这里展现</p><a class="registered" href="/center/register.html">注册</a><a class="userLogin login_window" href="javascript:;">登录</a></div>';
		$("#dynamic_list").html(cf);
		$(".bg_br").remove();
		$(".pyq").find("a").css("color", "#3ea436");
		$(".pyq").append('<span class="bg_br"></span>');
		$(".home a").css("color", "#bdbdbd");
		$(".nav_c_r").remove();
	} else {
		//推荐动态
		findIndexTopics(0, 1);
	}



	//下拉加载动态
	var page = 1;
	//触发开关，防止多次调用事件 
	var stop = false;
	var _Catetory;
	$(window).scroll(function(event) {
		var scrollTop = $(this).scrollTop();
		//整个文档的高度
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();

		if (scrollTop + windowHeight + 130 >= scrollHeight) {
			if (stop == true && _w && _t) {
				stop = false;
				$("#dynamic_list").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
				page = page + 1;
				keywordSearch(page, _w);
			} else if (stop == true || (stop == true && _t)) {
				stop = false;
				$("#dynamic_list").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
				page = page + 1;
				findIndexTopics(keyList.attr("data-fl"), page);
			}
		}
	})


	// 发帖选择  我的圈子
	myFindJoinedAllCircleBy();



	//展示动态
	function displayFrontPageDynamics(msg,isRecommend) {
		$(".Toloadmore").remove();
		$(".jiazai").remove();
		if (msg.status == 0 && msg.data != ""&&msg.data) {
			stop = true;
			var mssg = msg.data;
			var nums = "";
			for (var i = 0; i < mssg.length; i++) {//mssg.length
				var nums = (page - 1) * mssg.length + i;
				var imagepath = mssg[i].tcProduct.imagepath; //文章图片mssg[i].topic.imagepath;
				var commentlist = mssg[i].tcLeaveWordList; //评论人列表
				var clickMaplist = mssg[i].clickMaplist; //点赞人头像

				str = PostDynamicUserDetails(mssg[i]); //帖子用户信息		
				// 标题价格
				str += PostDynamicTitlePrice(mssg[i])
				// 加载帖子文章内容
				str += DynamicPostArticles(mssg[i]);


				//文章图片
				str += TheArticleShowUs(mssg[i], imagepath);


				//判断是否赞过
				//加载点赞人头像
				str += DetermineWhetherPraise(mssg[i], clickMaplist, 2);


				//帖子评论动态  评论
				str += PostCommentsContent(mssg[i], commentlist, nums, str, $("#dynamic_list"));


			}
		} else if ($(".content_items").length == 0) {
			stop = false;
			$("#dynamic_list").html('<div class="ineffectiveness"><div class="ineffectiveness_top"><h3>抱歉，未找到"'+getURIArgs("word")+'"相关结果。</h3><p>建议:</p><p>您可以尝试更换关键词，再次搜索。</p></div><div class="ineffectiveness_bottom"><h3>同城推荐</h3></div></div>')
			findIndexTopics(0, 1 , 1 );
			if(isRecommend==1){
				// alert(111);
			}
		}
	}

	/* 
	 * 发帖 
	 * topic 帖子
	 * isRosterAccess   是否在朋友圈可见： 1可见    0不可见
	 * imageList    图片地址列表  {"imageList":["http://xxx","http://xxx"]}
	 * 
	 * */
	//getpesonWs({username:"xl_6045674747"})
	//console.log(getpesonWs({username:"xl_6045674747"}))
	var posit = true;

	function getpesonWs(datas) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/jobstree/findJoinedJobstree.do",
			headers: {
				"token": qz_token()
			},
			data: datas,
			dataType: "json",
			success: function(msg) {
				if (msg.status == 0) {
					if (msg.data == "" || msg.data == undefined) {
						posit = false;
					}
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error");
			}
		});
	}
	getpesonWs({ //用来判断第三方登录有没有加入职业圈    posit==false没有加入，是true已加入
		username: getCookie("username")
	})
	$(document).on("click", ".InDynamic .func_publish", function() {
		if (getCookie("username").indexOf("wx_") == 0 || getCookie("username").indexOf("qq_uid_") == 0 || getCookie("username").indexOf("xl_") == 0) {
			//第三方登录
			if (posit == false) {
				circlethirdlogin();
				return false;
			}
		}
		var topictype = "";
		var content = html2Escape($("#FaceBoxText").val());
		if (ImageList.length == 0) {
			topictype = 0; //0:纯文本帖子
		} else {
			topictype = 4; //4:带图片帖子
		}
		var isRosterAccess = $(".InDynamic label").attr("data-id"); //朋友圈是否可见
		var imagecount = ImageList.length; //帖子图片数量

		if ($.trim(content) == "" && imagecount == 0) {
			warningMessage("必须要有文字、图片或视频");
			return false;
		}

		// 判别圈子
		var type = $(".t_xz_classify").attr("type");
		var Code = $(".t_xz_classify").attr("data-code");
		var w = $(".t_xz_classify").text();
		var code = "";
		var themeNo = "";
		var category = "";
		var PostingURL = "";
		if (type == 2) {
			category = 16;
			PostingURL = "/createTopic/createCircleTopic.do";
			var gList = {
				"citycircleIdList": [Code]
			}
			var ThemeNO = JSON.stringify(gList); //选中全球圈
		} else if (type == 3) {
			themeNo = Code;
			category = 4;
			PostingURL = "/topic/createThemeTopic.do";
		} else {
			code = Code;
			category = 2;
			PostingURL = "/topic/createIndustryTopic.do";
		}


		var topic = {
			username: UserName,
			userNo: getCookie("userNo"),
			title: "",
			content: content,
			imagecount: imagecount, //图片数量
			videourl: "",
			visiblity: "公有",
			machine: "webpc", //"来自iphone 6s"--必填
			themeNo: themeNo, //""--发生活圈的帖子必填，其他帖子不填
			code: code, //""--不填
			category: category, //4,--必填0：朋友圈，2：行业圈，4：生活圈，8：首页
			topictype: topictype //0:纯文本帖子,2:视频帖子,4:带图片帖子
		};
		var PicList = {
			"imageList": ImageList
		};
		var Images = JSON.stringify(PicList);
		var topicc = JSON.stringify(topic);

		if (type == 2) {
			var data = {
				"topic": topicc,
				"citycircleIdList": ThemeNO,
				"isRosterAccess": 0,
				"imageList": Images
			}
		} else {
			var data = {
				"topic": topicc,
				"isRosterAccess": 0, //0:表示朋友圈不可见，1：表示朋友圈可见 
				"isIndexAccess": 0,
				"imageList": Images
			}
		}

		createIndexTopicN(data, PostingURL);
	});




})