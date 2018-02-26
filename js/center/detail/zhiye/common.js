/*职业圈的公共部分*/
var code = getURIArgs('code');
var qNo = getURIArgs('qno');
var username = getCookie('username');
var page = 1;
var dataNames = getURIArgs("dataName");
var cache = getCatetory();
getCircleDetail(username,code); //详情

if (dataNames.indexOf("_") > -1) {
	dataNames = dataNames.replace(/\_/g, "/");
} else {
	dataNames = dataNames;
}
//导航点击的时候
$(document).on('click', '.left_nav ul li', function() {
	var _index = $(this).index('.left_nav ul li');
	var str = getTypeStr();
	if (_index == 0) {
		var navURL = 'mydynamic';
	} else {
		var navURL = 'active';
	}
	window.location.href = '/center/zhiye/'+navURL+'.html?code=' + code;
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

//得到圈子详情
function getCircleDetail(username, code) {
	$.ajax({
		type: "post",
		url: serviceHOST() + "/userCircle/searchCircle.do",
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			username: username,
			circleName: code,
			catetory: 1
		},
		success: function(msg) {
			if (msg.status == 0) {
				var circleName = msg.data.circleName;
				var userCount = msg.data.userCount; //成员
				if (userCount > 10000) {
					userCount = change(userCount);
				} else {
					userCount = userCount || 0;
				};
				var topicCount = msg.data.topicCount; //动态
				if (topicCount > 10000) {
					topicCount = change(topicCount);
				} else {
					topicCount = topicCount || 0;
				}
				var ansNum = msg.data.questioncount;
				if (ansNum > 10000) {
					ansNum = change(ansNum);
				} else {
					ansNum = ansNum || 0;
				}
				var descrition = msg.data.content;
				var naturalname = msg.data.naturalname;
				var roomName = msg.data.roomName;
				var roomId = msg.data.roomId;
				var chatOff = msg.data.candiscoverjid;
				if (chatOff == 0) {
					$('.chatRoom').remove();
					$('.right_top>ul').css('paddingLeft', '72px');
					$('.no_class').remove();
				}
				$('.chatRoom').attr({
					'data-roomname': roomName,
					'data-naturalname': naturalname,
					'data-off': 0,
					'data-type': 1,
					'data-roomid': roomId
				})
				if (descrition == null || descrition == 'null') {
					descrition = '';
				}
				$(".joinUs").attr("joinedJobCount", msg.data.joinedJobCount); //加入职业圈的数量
				if (msg.data.iscreateorjoin == 1) {
					$('.joinUs a').html('退出圈子');
					$('.joinUs').attr('data-status', 1);
				} else {
					$('.joinUs a').html('加入圈子');
					$('.joinUs').attr('data-status', 0);
				}
				$(".dayNum").html(topicCount); //动态
				$(".ansNum").html(ansNum);
				$('.join_num').text(' ' + (userCount)); //成员 和加入
				$('.nav_num').text('成员 ' + (userCount));
				$('.dynamic_num').text(topicCount);
				$('.circle_name').text(circleName).attr("data-category", msg.data.category);
				$('.circle_img img').attr('src', '/img/zhiyequan.png');
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
 * 职业圈发帖 
 * topic 帖子
 * isRosterAccess   是否在朋友圈可见： 1可见    0不可见
 * imageList    图片地址列表  {"imageList":["http://xxx","http://xxx"]}
 * 
 * */
$(document).on("click", ".InDynamic .func_publish", function() {
		var topictype = "";
		var content = html2Escape($("#FaceBoxText").val());
		if (ImageList.length == 0) {
			topictype = 0; //0:纯文本帖子
		} else {
			topictype = 4; //4:带图片帖子
		}
		var isRosterAccess = $(".InDynamic label").attr("data-id"); //朋友圈是否可见
		var imagecount = ImageList.length; //帖子图片数量
		if (!UserName) {
			$(".masks,.viewBox").show();
			return false;
		}
		if ($('.joinUs').attr('data-status') != 1) {
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
			title: "",
			content: content,
			imagecount: imagecount, //图片数量
			videourl: "",
			visiblity: "公有",
			machine: "webpc", //"来自iphone 6s"--必填
			themeNo: "", //""--发生活圈的帖子必填，其他帖子不填
			code: code, //""--不填
			category: 2, //4,--必填0：朋友圈，2：行业圈，4：生活圈，8：首页
			topictype: topictype //0:纯文本帖子,2:视频帖子,4:带图片帖子
		};
		var PicList = {
			"imageList": ImageList
		};
		var Images = JSON.stringify(PicList);
		var topicc = JSON.stringify(topic);
		var PostingURL = "/topic/createIndustryTopic.do";
		var data = {
			topic: topicc,
			isRosterAccess: isRosterAccess, //0:表示朋友圈不可见，1：表示朋友圈可见 
			isIndexAccess: 0,
			imageList: Images
		}

		createIndexTopicN(data, PostingURL);
	})
	/*加载所有动态
	 */
var stop = false; //触发开关，防止;多次调用事件
function findTopicListOfIndustryCircle(username, page, code) {
	var str = "";
	$.ajax({
		type: "post",
		url: serviceHOST() + "/topic/findTopicListOfIndustryCircle.do",
		headers: {
			"token": qz_token()
		},
		data: {
			username: username,
			pageNum: page,
			type: 3,
			filtercode: code
		},
		dataType: "json",
		success: function(msg) {
			if (msg.status == -3) {
				getToken();
			};
			$(".Toloadmore").remove();
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
	var mssg = msg.data;
	if (msg.status == 0) {
		if (mssg.length == 0) {
			stop = false;
		}
		stop == true;
		for (var i = 0; i < mssg.length; i++) {
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

		if ($(".content_items").length == 0) {
			var _emptyStr = '<div class="Isempty"><p>圈子里尚无动态</p></div>';
			$('.bottom_left').html(_emptyStr);
			stop = false;
		}
	}

}
//加入职业圈
$(document).on("click", ".joinUs", function() {
	var arrCode = [code]; //加入职业圈数组
	var codeId = JSON.stringify(arrCode);
	if (!username) {
		$(".masks,.viewBox").show();
		return false;
	}
	if ($(this).attr('data-status') == 0) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/jobstree/joinedJobStree.do",
			headers: {
				"token": qz_token()
			},
			data: {
				"username": username,
				"codes": codeId
			},
			success: function(msg) {
				if (msg.status == 0) {
					$('.joinUs a').html('退出圈子');
					$('.joinUs').attr('data-status', 1);
					friendlyMessage('加入成功', function() {
						location.reload();
					});
				} else if (msg.status == -3) {
					getToken();
				} else if (msg.status == 1) {
					circlelimit(); //加入上限提示
				} else if(msg.status == -1) {
					warningMessage("加入失败，你已经是圈子成员！");
				}else{
					warningMessage("加入行业圈操作异常！");
				}
			},
			error: function() {
				console.log("error");
			}
		});
	} else {
		if ($(this).attr("joinedjobcount") == 1) {
			keeponeCircle() //至少保留一个职业圈
		} else if ($(this).attr("joinedjobcount") > 1) {
			$.ajax({
				type: "post",
				url: serviceHOST() + "/jobstree/deleteJoinedJobStree.do",
				headers: {
					"token": qz_token()
				},
				data: {
					"username": username,
					"code": code
				},
				success: function(msg) {
					if (msg.status == 0) {
						$('.joinUs a').html('加入圈子');
						$('.joinUs').attr('data-status', 0);
						var roomName = $('.chatRoom').attr('data-roomname');
						if (isJoinChatRoom(roomName)) {
							deleteChatroom(roomName);
						}
						friendlyMessage('退出圈子成功', function() {
							location.reload();
						});
					} else if (msg.status == -3) {
						getToken();
					};
				},
				error: function() {
					console.log("error");
				}
			});
		}
	}
});

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



//热门问题 - 换一批
var num = 1;
$(document).on("click", ".inbatch", function() {
	num = num + 1;
	if ($(".hotItem").length >= 10) {
		findAllQuestionList(num);
		$(".hotContent").html("");
	}
})


if (!qNo) {
	findAllQuestionList(1);
}


similarCircles({
	username: username,
	circleNo: code,
	category: 1, //分类1-职业圈帖子；2-全球圈帖子；3-生活圈帖子
	pageNum: 1,
	pageSize: 8
})

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
				$(".recommon_circle .recommon_head a").attr("href", "/center/zyq.html")
					//				var datlen=msg.data.circlecategoryList;
					//				if(datlen.length!=0){
				for (var i = 0; i < msg.data.circlecategoryList.length; i++) {
					var lists = msg.data.circlecategoryList[i];
					str += '<li>' +
						'<a href="/center/zhiye/mydynamic.html?code=' + lists.code + '&dataName=' + lists.themename + '">';
					if (lists.imagePathList == "") {
						str += '<img src="/img/zhiyequan.png">';
					} else {
						str += '<img src="' + ImgHOST() + lists.imagePathList[0] + '">';
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
				//}
				//				else{
				//					str = '<li>暂无圈子推荐</li>';
				//				}
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

//热门问题
function findAllQuestionList(page) {
	$.ajax({
		type: "post",
		url: serviceHOST() + "/question/findAllQuestionList.do",
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			username: username,
			pageNum: page,
			catetory: 1,
			jobcode: code
		},
		success: function(msg) {
			if (msg.status == 0) {
				var hot = "";
				if (msg.data != "") {
					for (var i = 0; i < msg.data.length; i++) {
						var mssg = msg.data[i];
						if (mssg.title != "") {
							hot += '<div class="hotItem"><a href="/center/zhiye/wentixq.html?qno=' + mssg.questionNo + '&code=' + code + '">' + mssg.title + '</a><span>' + (mssg.followcount || 0) + '人关注</span></div>';
						}
						$(".hotContent").html(hot);
					};
				};
				if (msg.data == "" && page != 1) {
					num = 0;
					findAllQuestionList(1);
				}
			} else if (msg.status == -3) {
				getToken();
			};
			if (msg.data == "" && $(".hotItem").length == 0) {
				$(".hotContent").html("<div class='no_comments'><p>暂无热门问题</p></div>");
			} else if (msg.data.length < 10) {
				$(".inbatch").hide();
			}
		},
		error: function() {
			console.log("error")
		}
	});
};
//同城热推
$(".cityHot_head>span").html("同城热推");
//推荐同类视频
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

					$(".recommon_video .vBox").html(str);
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
	category: 1, //分类1-职业圈帖子；2-全球圈帖子；3-生活圈帖子
	pageNum: 1,
	pageSize: 3
})