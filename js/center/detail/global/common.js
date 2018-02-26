/*全球圈的公共部分*/
var code = getURIArgs('code');
var username = getCookie('username') || "";
var cache = getCatetory();
var page = 1;


//导航点击的时候
$(document).on('click', '.left_nav ul li', function() {
	var _index = $(this).index('.left_nav ul li');
	var str = getTypeStr();
	if (_index == 0) {
		window.location.href = '/center/' + str + '/mydynamic.html?code=' + code;
	}else {
		window.location.href = '/center/' + str + '/active.html?code=' + code;
	}
})


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
//加入
$(document).on('click', '.joinUs', function() {
	if (!username) {
		$(".masks,.viewBox").show();
		return false;
	}
	if ($(this).attr('data-status') == 0) {
		joinGlobalCircle(code, username);
	} else {
		cancelGlobalCircle(code, username);
	}
})


//圈子设置
$(document).on('click', '.circle_setting', function() {
	window.location.href = '/center/global/setting.html?code=' + code;
	return false;
})


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
			catetory: 2
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
					'data-src': msg.data.imagePath,
					"data-category": msg.data.category
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

//加入全球圈
function joinGlobalCircle(id, username) {
	var str = '';
	$.ajax({
		type: "post",
		url: serviceHOST() + '/citycircleusermap/joinCitycircle.do',
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			citycircleId: id,
			username: username
		},
		success: function(msg) {
			if (msg.status == 0) {
				$('.joinUs a').html('退出圈子');
				$('.joinUs').attr('data-status', 1);
				MucgroupMy(1);
				friendlyMessage('加入成功', function() {
					location.reload();
				});
			} else if (msg.status == -3) {
				getToken();
			};
		},
		error: function() {
			console.log("error")
		}
	})
};
//取消全球圈
function cancelGlobalCircle(id, username) {
	var str = '';
	$.ajax({
		type: "post",
		url: serviceHOST() + '/citycircleusermap/deletejoinCitycircle.do',
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			citycircleId: id,
			username: username
		},
		success: function(msg) {
			var info = msg.info;
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
			console.log("error")
		}
	})
};


//（根据圈子号的id来进行查询） 查询全球圈帖子
function findTopicListOfCityCircle(username, pageNum, pageSize, citycircleId) {
	$.ajax({
		type: "post",
		url: serviceHOST() + '/createTopic/findTopicListOfCityCircle.do',
		dataType: "json",
		data: {
			username: username,
			pageNum: pageNum,
			pageSize: pageSize,
			citycircleId: citycircleId
		},
		headers: {
			"token": qz_token()
		},
		success: function(msg) { //先清空动态里面的东西，再添加进去
			$(".Toloadmore").remove();
			if (msg.status == -3) {
				getToken();
			};
			insertCircleContent(msg)
		},
		error: function() {
			console.log("error")
		}
	})
};



/*加载职业圈所有动态
 */
function findTopicListOfIndustryCircle(username, page, code) {
	var str = "";
	$.ajax({
		type: "post",
		url: serviceHOST() + "/topic/findTopicListOfIndustryCircle.do",
		data: {
			username: username,
			pageNum: page,
			type: 3,
			filtercode: code
		},
		headers: {
			"token": qz_token()
		},
		dataType: "json",
		success: function(msg) {
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
	$('.remember').show();
	var mssg = msg.data;
	if (msg.status == 0) {
		if (mssg == "") {
			stop = false;
		}
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



//根据code,pcode来查询对应的地区
function findArear(pcode, code) {
	var areaText = '';
	for (var i = 0; i < globalArea_normal.length; i++) {
		for (var j = 0; j < globalArea_normal[i].children.length; j++) {
			if (globalArea_normal[i].children[j].pid == pcode && globalArea_normal[i].children[j].id == code) {
				areaText = globalArea_normal[i].children[j].pname + '-' + globalArea_normal[i].children[j].name;
			} else {
				for (var k = 0; k < globalArea_normal[i].children[j].children.length; k++) {
					if (globalArea_normal[i].children[j].children[k].pid == pcode && globalArea_normal[i].children[j].children[k].id == code) {
						areaText = '中国-' + globalArea_normal[i].children[j].children[k].pname + '-' + globalArea_normal[i].children[j].children[k].name;
					}
				};
			}
		};
	};
	return areaText;
};

/* 
 * 全球圈发帖 
 * topic 帖子
 * isRosterAccess   是否在朋友圈可见： 1可见    0不可见
 * imageList    图片地址列表  {"imageList":["http://xxx","http://xxx"]}
 * 
 * */
$(document).on("click", ".InDynamic .func_publish", function(e) {
	var topictype = "";
	//var content = $("#FaceBoxText").val();
	var content =  html2Escape($("#FaceBoxText").val());
	var imagecount = ImageList.length; //帖子图片数量
	if (!username) {
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

	if (ImageList.length == 0) {
		topictype = 0; //0:纯文本帖子
	} else {
		topictype = 4; //4:带图片帖子
	}

	var isRosterAccess = $(".InDynamic label").attr("data-id"); //朋友圈是否可见
	var topic = {
		username: username,
		userNo: getCookie("userNo"),
		title: "",
		content: content,
		imagecount: imagecount, //图片数量
		videourl: "",
		visiblity: "",
		machine: "webpc", //"来自iphone 6s"--必填
		themeNo: "", //""--发生活圈的帖子必填，其他帖子不填
		code: "", //""--不填
		category: "16", //4,--必填0：朋友圈，2：行业圈，4：生活圈，8：首页   16: 全球圈
		topictype: topictype //0:纯文本帖子,2:视频帖子,4:带图片帖子
	};
	var PicList = {
		"imageList": ImageList
	};
	var gList = {
		"citycircleIdList": [code]
	}
	var Images = JSON.stringify(PicList);
	var topicc = JSON.stringify(topic);
	var ThemeNO = JSON.stringify(gList); //选中全球圈

	var PostingURL = "/topic/createCircleTopic.do";
	var data = {
		"topic": topicc,
		"citycircleIdList": ThemeNO,
		"isRosterAccess": isRosterAccess,
		"imageList": Images
	}

	createIndexTopicN(data, PostingURL);
	e.stopPropagation();
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
	$.ajax({ ///center/qqqlist.html?dataid=110100&conName=中国-北京市-北京市
		type: "post",
		url: serviceHOST() + "/userCircle/recommendCircleByCategory.do",
		data: datas,
		headers: {
			"token": qz_token()
		},
		success: function(msg) {
			im.localLoadingOff(".recommon_circle ul") //关闭*/
			if (msg.status == 0) {
				var code = msg.data.circlecategory;
				var pcode = msg.data.circlecategoryid;
				$(".recommon_circle .recommon_head a").attr("href", "/center/qqq.html");
				var lens = msg.data.categorycirclelist;
				if (lens != "") {
					for (var i = 0; i < lens.length; i++) {
						var lists = lens[i];
						str += '<li>' +
							'<a href="/center/global/mydynamic.html?code=' + lists.cityCircleId + '">';
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
	username: username,
	circleNo: code,
	category: 2, //分类1-职业圈帖子；2-全球圈帖子；3-生活圈帖子
	pageNum: 1,
	pageSize: 8
})
//同城热推
$(".cityHot_head>span").html("同城热推");
//全球圈推荐同类视频
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
	category: 2, //分类1-职业圈帖子；2-全球圈帖子；3-生活圈帖子
	pageNum: 1,
	pageSize: 3
})

//右侧栏目固定
$(window).scroll(function(){
	var rightHeight=$(".detail_right").height();
	var leftHeight=$(".detail_left").height();
	var parInt=Math.round(rightHeight/3)*2;
	//获取右边除去推荐视频和推荐圈子和推荐同城的高
	var spaH=rightHeight-($(".recommon_circle").height()+$(".recommon_video").height())-180;
	if(leftHeight>rightHeight){
		if($(document).scrollTop()>=parInt){
			$(".spaPosition").css({
				position:"fixed",
				top:-spaH+"px",
				"margin-left":'700px'
			});
			$(".cityHot").hide();
		}else{
			$(".spaPosition").css({
				position:"static",
				top:"0px",
				"margin-left":"0px"
			});
			$(".cityHot").show();
		}
	}
})
