/*生活圈的公共部分*/
var code = getURIArgs('code');
var cache = getCatetory();
var page = 1;
getCircleDetail(username,code); //详情

//导航点击的时候
$(document).on('click', '.left_nav ul li', function() {
	var _index = $(this).index('.left_nav ul li');
	var str = getTypeStr();
	if (_index == 0) {
		window.location.href = '/center/' + str + '/mydynamic.html?code=' + code;
	} else {
		window.location.href = '/center/' + str + '/active.html?code=' + code;
	}
})

//圈子设置
$(document).on('click', '.circle_setting', function() {
	window.location.href = '/center/life/setting.html?code=' + code;
	return false;
})


//加入生活圈  用户关注话题
$(document).on("click", ".joinUs", function(event) {
	if (!UserName) {
		$(".masks,.viewBox").show();
		return false;
	}
	if ($(this).attr('data-status') == 0) {
		LoadLifeCircle(code)
	} else {
		CancelTheSubjectInterface(code)
	}
	event.stopPropagation();
})

// 加入生活圈话题
function LoadLifeCircle(themeNo) {
	$.ajax({
		type: "post",
		url: serviceHOST() + "/theme/createThemeofusermap.do",
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			username: UserName,
			themeNo: themeNo
		},
		success: function(msg) {
			if (msg.status == 0) {
				$('.joinUs a').html('退出圈子');
				$('.joinUs').attr('data-status', 1);
				friendlyMessage('加入成功');
			} else if (msg.status == -3) {
				getToken();
			} else {
				friendlyMessage(msg.info);
			}
		},
		error: function() {
			console.log("error")
		}
	});

}
//用户取消关注接口
function CancelTheSubjectInterface(themeNo) {
	$.ajax({
		type: "post",
		url: serviceHOST() + "/theme/dropThemeofusermap.do",
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			username: UserName,
			themeNo: themeNo
		},
		success: function(msg) {
			if (msg.status == 0) {
				$('.joinUs a').html('加入圈子');
				$('.joinUs').attr('data-status', 0);
				var roomName = $('.chatRoom').attr('data-roomname');
				if (isJoinChatRoom(roomName)) {
					deleteChatroom(roomName);
				}
				friendlyMessage('退出圈子成功');
			} else if (msg.status == -3) {
				getToken();
			};
		},
		error: function() {
			console.log("error")
		}
	});
}

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

function getTypeStr() {
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

//得到圈子详情
function getCircleDetail(UserName,code) {
	$.ajax({
		type: "post",
		url: serviceHOST() + "/userCircle/searchCircle.do",
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			username: UserName,
			circleName: code,
			catetory:3
		},
		success: function(msg) {
			if (msg.status == 0) {
				var circleName = msg.data.circleName;
				var imgPath = ImgHOST() + ((msg.data.imagePath!=""||msg.data.imagePath!=undefined)?　msg.data.imagePath : 'PGRXC-f65f9b9f-ab73-43cf-8c91-d805906fca49');
				var topicCount = msg.data.topicCount;
				var userCount = msg.data.userCount;
				var ansNum = msg.data.questioncount;
				var descrition = msg.data.content;
				var naturalname = msg.data.naturalname;
				var roomName = msg.data.roomName;
				var roomId = msg.data.roomId;
				var chatOff = msg.data.candiscoverjid;
				if (userCount > 10000) {
					userCount = change(userCount);
				} else {
					userCount = userCount || 0;
				};
				if (topicCount > 10000) {
					topicCount = change(topicCount);
				} else {
					topicCount = topicCount || 0;
				}
				if (ansNum > 10000) {
					ansNum = change(ansNum);
				} else {
					ansNum = ansNum || 0;
				}
				if (chatOff == 0) {
					$('.chatRoom').remove();
					$('.right_top>ul').css('paddingLeft', '72px');
					$('.no_class').remove();
				}
				$('.chatRoom').attr({
					'data-roomname': roomName,
					'data-naturalname': naturalname,
					'data-off': 0,
					'data-type': cache,
					'data-roomid': roomId
				})
				if (descrition == null || descrition == 'null') {
					descrition = '';
				}
				if (msg.data.iscreateorjoin == 1) {
					$(".lift_dt").attr("data-cj", "1");
					$(".circle_img").addClass("founder");
					$('.joinUs').siblings('.chatRoom').css('margin', '0 22px');
					$('.recommend_friends').css('marginLeft', '10px');
					$('.joinUs').remove();
					$('.no_class').remove();
				} else if (msg.data.iscreateorjoin == 2) {
					$('.joinUs a').text('退出圈子');
					$('.joinUs').attr('data-status', 1);
					$('.circle_setting').remove();
				} else {
					$('.joinUs').attr('data-status', 0);
					$('.circle_setting').remove();
				}
				$('.specific_name,.right_top .circle_name').text(circleName).attr("data-category", msg.data.category);
				$('.join_num').text(' ' + userCount);
				$('.nav_num').text('成员 ' + userCount);
				$('.circle_img img').attr({
					'src': imgPath,
					'data-src': msg.data.imagePath
				});
				$(".ansNum").html(ansNum);
				$(".dayNum").html(topicCount); //动态
				$('.dynamic_num').text(topicCount);
				$('.specific_intro').text(descrition);
				if (cache == 2) {
					var pcode = msg.data.pcode;
					var code = msg.data.code;
					var areaText = findArear(pcode, code);
					$('.circle_area i').css('background', 'url(/img/quanqiuquan.png) 0 center no-repeat');
					$('.specific_area').text('全球圈');
					$('.circle_item span').eq(0).text('地 区');
					$('.specific_item').text(areaText);
				} else if (cache == 3) {
					var catename = msg.data.categoryname;
					$('.circle_area i').css('background', 'url(/img/shenghuoquan.png) 0 center no-repeat');
					$('.specific_area').text('生活圈');
					$('.circle_item i').css('background', 'url(/img/qz_qzxq_fenlei.png) 0 center no-repeat');
					$('.specific_item').text(catename);
				}
				if ($('.right_top ul li').hasClass('chatRoom') == false && $('.right_top ul li').hasClass('joinUs') == false) {
					var str = '<li class="circle_setting" style="margin: 0px 22px;"><a href="/center/global/setting.html">圈子设置</a></li>';
					$('.right_top ul').prepend(str).css({
						'paddingLeft': '34px'
					});
					$('.detail_right>.circle_setting').remove();
				}
			} else if (msg.status == -3) {
				getToken();
			};
		},
		error: function() {
			console.log("error")
		}
	})
}

/*
 查询生活圈的帖子  findTopicListOfThemeCircle
 * */
var stop = false;

function findTopicListOfThemeCircle(pageNum, ThemeNo) {
	$.ajax({
		type: "post",
		url: serviceHOST() + "/topic/findTopicListOfThemeCircle.do",
		data: {
			username: UserName,
			pageNum: page,
			themeNo: ThemeNo
		},
		headers: {
			"token": qz_token()
		},
		dataType: "json",
		success: function(msg) {
			$(".Toloadmore").remove();
			if (msg.status == -3) {
				getToken();
			};
			insertCircleContent(msg)
		},
		error: function() {
			console.log("error")
		}
	});
}


//动态插入内容
function insertCircleContent(msg) {
	$(".jiazai").remove();
	if (msg.status == 0) {
		var mssg = msg.data
		if (mssg.length == 0) {
			stop = false;
		}
		if (msg.data.length != 0) {
			stop = true;
			for (var i = 0; i < mssg.length; i++) {
				var str = "";
				var nums = (page - 1) * mssg.length + i;
				var imagepath = mssg[i].topic.imagepath; //文章图片
				var commentlist = mssg[i].commentlist; //评论人列表
				var clickMaplist = mssg[i].clickMaplist; //点赞人头像

				//加载帖子用户信息
				str = PostDynamicUserDetails(mssg[i]);

				// 加载帖子文章内容

				str += DynamicPostArticles(mssg[i]);


				//文章图片
				str += TheArticleShowUs(mssg[i], imagepath);


				//判断是否赞过
				//加载点赞人头像

				str += DetermineWhetherPraise(mssg[i], clickMaplist);


				//帖子评论动态  评论
				str += PostCommentsContent(mssg[i], commentlist, nums, str, $(".bottom_left"));
				stop = true;

			}
		} else {
			if ($(".content_items").length == 0) {
				var _emptyStr = '<div class="Isempty"><p>圈子里尚无动态</p></div>';
				$('.bottom_left').html(_emptyStr);
				stop = false;
			}
		}
	}

}


/* 
 * 生活圈发帖 
 * topic 帖子
 * isRosterAccess   是否在朋友圈可见： 1可见    0不可见
 * imageList    图片地址列表  {"imageList":["http://xxx","http://xxx"]}
 * 
 * */
$(document).on("click", ".InDynamic .func_publish", function() {
	var topictype = "";
	var content = html2Escape($("#FaceBoxText").val()) || "";
	if (ImageList.length == 0) {
		topictype = 0; //0:纯文本帖子
	} else {
		topictype = 4; //4:带图片帖子
	}

	var isRosterAccess = $(".InDynamic label").attr("data-id"); //朋友圈是否可见
	var Title = $(".circle_title .shq_title").text(); //生活圈名称
	var imagecount = ImageList.length; //帖子图片数量
	if (!UserName) {
		$(".masks,.viewBox").show();
		return false;
	}

	if ($(".circleDetail_main").attr('data-cj') != 1 && $('.joinUs').attr('data-status') != 1) {
		warningMessage("请先加入圈子");
		return false;
	}
	if ($.trim(content) == "" && imagecount == 0) {
		warningMessage("必须要有文字、图片或视频");
		return false;
	}

	var topic = {
		username: UserName,
		userNo: getCookie("userNo"),
		themename: Title,
		title: "",
		content: content,
		imagecount: imagecount, //图片数量
		videourl: "",
		visiblity: "公有",
		machine: "webpc", //"来自iphone 6s"--必填
		themeNo: code, //""--发生活圈的帖子必填，其他帖子不填
		code: "", //""--不填
		category: 4, //4,--必填0：朋友圈，2：行业圈，4：生活圈，8：首页
		topictype: topictype //0:纯文本帖子,2:视频帖子,4:带图片帖子
	};
	var PicList = {
		"imageList": ImageList
	};
	var Images = JSON.stringify(PicList);
	var topicc = JSON.stringify(topic);
	var PostingURL = "/topic/createThemeTopic.do"; //接口地址
	var data = {
		topic: topicc,
		isRosterAccess: isRosterAccess, //0:表示朋友圈不可见，1：表示朋友圈可见 
		isIndexAccess: 0,
		imageList: Images
	}

	createIndexTopicN(data, PostingURL);
})

//推荐给好友圈子
$(document).on('mouseenter', '.sendFriend', function(e) {
	var str = '<div class="cancel_more">' +
		'<p class="recommend_friends ' + no_login + '">推荐给好友</p></div>';
	if ($(this).attr('data-off') == undefined) {
		$(this).append(str);
		$(this).attr('data-off', 1);
	}
	$('.cancel_more').show();
	e.stopPropagation();
});

$(document).on('mouseleave', '.sendFriend', function(e) {
	$('.cancel_more').hide();
	e.stopPropagation();
});

//推荐同类圈子
function similarCircles(datas) {
	im.localLoadingOn(".recommon_circle ul") //局部开启
	var str = "";
	$.ajax({
		type: "post",
		url: serviceHOST() + "/userCircle/recommendCircleByCategory.do",
		data: datas,
		headers: {
			"token": qz_token()
		},
		success: function(msg) {
			im.localLoadingOff(".recommon_circle ul") //关闭*/
			if (msg.status == 0) { //id="+msg.circlecategory+id+'&t=&n=4
				var num = (msg.data.circlecategoryid - 1);
				$(".recommon_circle .recommon_head a").attr("href", "/center/shq.html");
				var lens = msg.data.circlecategoryList;
				if (lens != "") {
					for (var i = 0; i < lens.length; i++) {
						var lists = lens[i];
						str += '<li>' +
							'<a href="/center/life/mydynamic.html?code=' + lists.themeNo + '">';
						if (lists.imagepath == "") {
							str += '<img src="/img/first.png">';
						} else {
							str += '<img src="' + ImgHOST() + lists.imagepath + '">';
						}
						if (lists.themename.length > 4) {
							var words = lists.themename.substr(0, 4) + "...";
						} else {
							var words = lists.themename
						}
						str += '<p>' + words + '</p>' +
							'<i>' + lists.usercount + '人</i>' +
							'</a>' +
							'</li>'
					}
				} else {
					str = "<li class='no_join' style='text-align:center;width:276px;height:150px;background:url(/img/nodata.png) center 20px no-repeat;'>" +
						'<span style="line-height: 150px;">暂无推荐圈子</span>' +
						"</li>";
				}
				$(".recommon_circle ul").html(str);
				var emptyH = $(".detail_right").height() - 230;
				$(".Isempty,.bottom_left").css("min-height",emptyH+"px");
				$(".bottom_left .no_comments").css("height",(emptyH - $(".askBox").height() - 10) +"px");
			} else if (msg.status == -3) {
				getToken();
			};
		},
		error: function() {
			console.log("error");
		}
	});
}
similarCircles({
	username: UserName,
	circleNo: code,
	category: 3, //分类1-职业圈帖子；2-全球圈帖子；3-生活圈帖子
	pageNum: 1,
	pageSize: 8
})
//同城热推
$(".cityHot_head>span").html("同城热推");
//生活圈推荐同类视频
function similarVideo(datas) {
	var str = "";
	$.ajax({
		type: "post",
		url: serviceHOST() + "/videoMaterial/recommendVideoByCircle.do",
		data: datas,
		headers: {
			"token": qz_token()
		},
		success: function(msg) {
			if (msg.status == 0) {
				var dataLen = msg.data;
				if (dataLen.length == 0) {
					str = '暂无视频推荐';
					$(".vBox").html(str);
					$(".recommon_video .recommon_head a").hide();
					$(".vBox").css({
						"text-align": "center",
						"line-height": "50px"
					})
				} else if (dataLen.length == 1) {
					$(".videoBox").hide();
					var visites = (Math.round((dataLen[0].visites / 10000) * 100) / 100).toFixed(1);
					str = '<a class="video1" href="/center/videodetail.html?id=' + dataLen[0].id + '">' +
						'<img src="' + dataLen[0].vpicurl + '" />' +
						'<span class="playBtn"></span>' +
						'<div class="personTime clearfix">' +
						'<span class="person">' + visites + '万</span>' +
						//              			<span class="time">03:12</span>
						'</div>' +
						'</a>'
					$(".listVideo").html(str)
				} else if (dataLen.length == 2) {
					$(".listVideo").hide();
					for (var i = 0; i < dataLen.length; i++) {
						var visites = (Math.round((dataLen[i].visites / 10000) * 100) / 100).toFixed(1);
						str += '<a class="video2" href="/center/videodetail.html?id=' + dataLen[i].id + '">' +
							'<img src="' + dataLen[i].vpicurl + '"/>' +
							'<div class="personTime clearfix">' +
							'<span class="person">' + visites + '万</span>' +
							//'<span class="time">03:12</span>'+
							'</div>' +
							'</a>';
					}
					$(".videoBox").html(str);
				} else if (dataLen.length > 2) {
					var visites1 = (Math.round((dataLen[0].visites / 10000) * 100) / 100).toFixed(1);
					var visites2 = (Math.round((dataLen[1].visites / 10000) * 100) / 100).toFixed(1);
					var visites3 = (Math.round((dataLen[2].visites / 10000) * 100) / 100).toFixed(1);
					str += '<div class="listVideo">' +
						'<a class="video1" href="/center/videodetail.html?id=' + dataLen[0].id + '">' +
						'<img src="' + dataLen[0].vpicurl + '"/>' +
						'<span class="playBtn"></span>' +
						'<div class="personTime clearfix">' +
						'<span class="person">' + visites1 + '万</span>' +
						//	                			'<span class="time">03:12</span>'+
						'</div>' +
						'</a>' +
						'</div>' +
						'<div class="videoBox clearfix">' +
						'<a class="video2" href="/center/videodetail.html?id=' + dataLen[1].id + '">' +
						'<img src="' + dataLen[1].vpicurl + '"/>' +
						'<div class="personTime clearfix">' +
						'<span class="person">' + visites2 + '万</span>' +
						//'<span class="time">03:12</span>'+
						'</div>' +
						'</a>' +
						'<a class="video3" href="/center/videodetail.html?id=' + dataLen[2].id + '">' +
						'<img src="' + dataLen[2].vpicurl + '"/>' +
						'<div class="personTime clearfix">' +
						'<span class="person">' + visites3 + '万</span>' +
						//'<span class="time">03:12</span>'+
						'</div>' +
						'</a>' +
						'</div>';
					$(".vBox").html(str)
				}
			} else if (msg.status == -3) {
				getToken();
			};
		},
		error: function() {
			console.log("err");
		}
	});
}

similarVideo({
	ciecleNo: code,
	category: 3, //分类1-职业圈帖子；2-全球圈帖子；3-生活圈帖子
	pageNum: 1,
	pageSize: 3
})