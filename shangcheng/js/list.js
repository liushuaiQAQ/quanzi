$(document).ready(function() {
	var UserImg = getCookie("headImgkz"); //用户头像
	var page = 1;
	var totalPage = 0;
	var insertFlag = false;
	var href = window.location.href;
	var prdType = "";
	var prdHtml = {
		"hot": 0,
		"occupation": 1,
		"rent": 2,
		"housekeep": 4,
		"secondPrd": 3,
		"businessService": 5
	}
	$.each(prdHtml, function(key, val) {
		if(href.indexOf(key) >= 0) {
			prdType = val;
		}
	});
	//定位当前位置
	var cityName = "";
	if(getCookie("locationName")) {
		var locationName = getCookie("locationName");
		prdLists(prdType, page, locationName, username);
		if(locationName.charAt(locationName.length - 1) == "市") {
			locationName = locationName.substr(0, locationName.length - 1);
		}
		cityName = locationName;
		$(".now_location").html(locationName);
		getAreaSelect(areaPlace, ".place .city", cityName);
		if(location.href.indexOf("rent.html") > 0) {
			getSub(subWay, ".sub_way .sub_city", cityName);
		}
		areaDefault();
		lineDefault();
	} else {
		$.ajax({
			type: "post",
			url: "https://api.map.baidu.com/location/ip?ak=QG92622BdULt3KsqzgpQRHOnWThbWgHN",
			data: {},
			dataType: "jsonp",
			success: function(msg) {
				prdLists(prdType, page, msg.content.address_detail.city, username);
				setCookie("locationName",msg.content.address_detail.city,24 * 60);
				cityName = msg.content.address_detail.city.substr(0, msg.content.address_detail.city.length - 1);
				$(".now_location").html(msg.content.address_detail.city.substr(0, msg.content.address_detail.city.length - 1));
				getAreaSelect(areaPlace, ".place .city", cityName);
				if(location.href.indexOf("rent.html") > 0) {
					getSub(subWay, ".sub_way .sub_city", cityName);
				}
				areaDefault();
				lineDefault();
			},
			error: function() {
				console.log("error")
			}

		});
	}

	//地区，薪资切换
	$(".select_list li").click(function() {
		var len = $(".select_list li").length;
		var index = $(this).index();
		$(".select_list li").removeClass("select_active").removeClass("active");
		if(index == 0) {
			$(this).addClass("select_active");
		} else {
			$(this).addClass("active");
		}
		$(".content_top>div").hide().eq(index).show();
	})

	//地区筛选
	var num = 0;

	function areaDefault() {
		if(getURIArgs("pName")) {
			$(".city li").each(function(index) {
				if($(this).attr("data-name") == getURIArgs("pName")) {
					num = index;
					$(this).addClass("select");
				}
			})
			if(getURIArgs("areaName")) {
				$(".county").eq(num).show();
				$(".county").eq(num).find("li").each(function(index) {
					if($(this).attr("data-name") == getURIArgs("areaName")) {
						$(this).addClass("select");
					}
				})
			}
		} else {
			$(".city li").eq(0).addClass("select");
		}
		$(".city li").hover(function() {
			$(this).addClass("active").siblings("li").removeClass("active")
			$(".county").eq($(this).index()).show().siblings(".county").hide();
		}, function() {})

		$(".place").mouseleave(function() {
			$(".city li").removeClass("active");
			$(".county").hide().eq(num).show();
		})
	}

	$(document).on("click", ".place li", function() {
		var href = location.href;
		href = delQueryStringArgs(delQueryStringArgs(href, "subName"), "stopName");
		if(!$(this).attr("data-pname")) {
			if(getURIArgs("areaName")) {
				if($(this).attr("data-name") == "全部") {
					window.location.href = delQueryStringArgs(delQueryStringArgs(href, "pName"), "areaName");
				} else {
					window.location.href = changeURI(delQueryStringArgs(href, "areaName"), "pName", $(this).attr("data-name"));
				}
			} else {
				if($(this).attr("data-name") == "全部") {
					window.location.href = delQueryStringArgs(href, "pName");
				} else {
					window.location.href = changeURI(href, "pName", $(this).attr("data-name"));
				}
			}
		} else {
			window.location.href = changeURI(changeURI(href, "pName", $(this).attr("data-pname")), "areaName", $(this).attr("data-name"));
		}

	})

	//地铁路线
	function lineDefault() {
		if(getURIArgs("subName")) {
			$(".select_list li").eq(0).removeClass("select_active");
			$(".select_list li").eq(1).addClass("active");
			$(".content_top>div").eq(0).hide();
			$(".content_top>div").eq(1).show();
			var num = 0;
			$(".sub_city li").each(function(index) {
				if($(this).attr("data-name") == getURIArgs("subName")) {
					$(this).addClass("active").siblings("li").removeClass("active");
					num = index;
					if(index) {
						$(".stop_way").eq($(this).index() - 1).show();
					}
				}
			})
			if(getURIArgs("stopName")) {
				$(".stop_way").eq(num - 1).find("li").each(function(index) {
					if($(this).attr("data-name") == getURIArgs("stopName")) {
						$(this).addClass("active").siblings("li").removeClass("active");
					}
				})
			}
		}
	}

	$(document).on("click", ".sub_way li", function() {
		var href = location.href;
		href = delQueryStringArgs(delQueryStringArgs(href, "pName"), "areaName");
		if($(this).attr("data-pname")) {
			window.location.href = changeURI(changeURI(href, "subName", $(this).attr("data-pname")), "stopName", $(this).attr("data-name"));
		} else {
			window.location.href = changeURI(delQueryStringArgs(href, "stopName"), "subName", $(this).attr("data-name"));
		}

	})

	//筛选后价格和发布时间
	if(getURIArgs("salaryType")) { //薪资范围
		defaultSelect(getURIArgs("salaryType"), ".salary_range li", "data-salary");
	}
	if(getURIArgs("timeType")) { //发布时间
		defaultSelect(getURIArgs("timeType"), ".publish_time li", "data-time");
	}
	if(getURIArgs("priceType")) { //家政，二手物品价格
		defaultSelect(getURIArgs("priceType"), ".price_range li", "data-price");
	}
	if(getURIArgs("businessType")) { //家政，二手物品价格
		defaultSelect(getURIArgs("businessType"), ".price_range li", "data-price");
	}
	if(getURIArgs("charterType")) { //租房
		defaultSelect(getURIArgs("charterType"), ".price_range li", "data-price");
	}
	if(getURIArgs("sortType")) { //排序
		defaultSelect(getURIArgs("sortType"), ".sort li", "data-sort");
	}
	if(getURIArgs("stratPrice")) { //起始租金值
		$(".price_range  .start").val(getURIArgs("stratPrice"))
	}
	if(getURIArgs("endPrice")) { //结束租金值
		$(".price_range  .end").val(getURIArgs("endPrice"))
	}

	function defaultSelect(type, el, className) {
		$(el).each(function() {
			if($(this).attr(className) == type) {
				$(this).addClass("active");
			}
		})
	}

	//点击筛选
	$(".content_top li").click(function() {
		var parentObj = $(this).parent().parent();
		if($(parentObj).hasClass("price_range")) {
			if($(parentObj).hasClass("business")) { //商务服务价格
				range(this, 5, "businessType", "data-price");
			} else if($(parentObj).hasClass("rent")) {
				range(this, 9, "charterType", "data-price");
			} else { //二手，家政价格
				range(this, 8, "priceType", "data-price");
			}
		}
		if($(parentObj).hasClass("salary_range")) {
			window.location.href = changeURI(location.href, "salaryType", $(this).attr("data-salary"));
		} else if($(parentObj).hasClass("publish_time")) {
			window.location.href = changeURI(location.href, "timeType", $(this).attr("data-time"));
		} else if($(parentObj).hasClass("sort")) {
			window.location.href = changeURI(location.href, "sortType", $(this).attr("data-sort"));
		}
	})

	function range(el, index, urlArg, selfName) { //价格区间
		if($(el).index() == index) {
			return;
		}
		var href = delQueryStringArgs(location.href, "stratPrice");
		href = delQueryStringArgs(href, "endPrice");
		window.location.href = changeURI(href, urlArg, $(el).attr(selfName));
	}
	//价格区间筛选
	$(".price_range input").on("input propertychange", function() {
		var val = $.trim($(this).val());
		if(val.indexOf("0") == 0) {
			$(this).val(val.substr(0, 1));
		}
		if(val.indexOf(".")>0){
			$(this).val(val.split(".")[0]);
		}
	})
	$(".price_range span").click(function() {
		if(!$.trim($(".price_range .start").val()) && !$.trim($(".price_range .end").val())) {
			warningMessage("请输入筛选价格");
			return;
		}
		var href = location.href;
		var parentObj = $(this).parents("div.price_range");
		if($(parentObj).hasClass("business")) {
			href = changeURI(location.href, "businessType", 5);
		} else if($(parentObj).hasClass("rent")) {
			href = changeURI(location.href, "charterType", 9);
		} else {
			href = changeURI(location.href, "priceType", 8);
		}
		href = changeURI(href, "stratPrice", $(".price_range .start").val());
		window.location.href = changeURI(href, "endPrice", $(".price_range .end").val())
	})

	//只看有图
	if(location.href.indexOf("rent.html") > 0) {
		$(".rent_photo").show();
	}
	if(getURIArgs("onlyImg")) {
		$(".rent_photo").addClass("checked");
	}
	$(".rent_photo").click(function() {
		if($(this).hasClass("checked")) {
			$(this).removeClass("checked");
			window.location.href = delQueryStringArgs(location.href, "onlyImg");;
		} else {
			$(this).addClass("checked");
			window.location.href = changeURI(location.href, "onlyImg", 1);
		}
	})

	//产品列表
	function prdLists(type, page, cityName, username) { //type:产品类型
		$.ajax({
			type: "post",
			url: serviceHOST() + "/tcProduct/tcHotRecommendProductsList.do",
			headers: {
				"token": qz_token()
			},
			data: formatJson({
				pageNum: page,
				username: username,
				type: type,
				cityName: cityName,
				publishTime: getURIArgs("timeType") || "", //发布时间
				salaryRange: getURIArgs("salaryType") || "", //薪酬范围
				position: getURIArgs("keyWord") || "", //关键字
				charter: getURIArgs("charterType") || "", //租金
				stratPrice: getURIArgs("stratPrice") || "", //起始租金值
				endPrice: getURIArgs("endPrice") || "", //结束租金值
				housewiferyPrice: getURIArgs("priceType") || "", //家政薪资/价格  || 二手产品价格
				sort: getURIArgs("sortType") || "", //排序
				businessService: getURIArgs("businessType") || "", //商务服务薪资/价格，
				areaName: getURIArgs("areaName") || getURIArgs("pName"), //地区筛选
				lineUid: getURIArgs("subName") || "", //地铁线路id
				stopNames: getURIArgs("stopName") || "", //地铁站点名称
				picOnly: getURIArgs("onlyImg") || "", //只看有图
			}),
			dataType: "json",
			success: function(msg) {
				$(".Toloadmore").remove();
				if(msg.total) {
					$(".bottom_left .jiazai").remove();
					insertFlag = true;
					totalPage = msg.total;
					insertPrdContent(msg, $(".bottom_left"));
				} else {
					$(".bottom_left .jiazai").remove();
					insertFlag = false;
					var _emptyStr = '<div class="Isempty"><p>抱歉，圈子尚无此类商品</p></div>';
					$('.bottom_left').html(_emptyStr);
					$.ajax({
						type: "post",
						url: serviceHOST() + "/tcProduct/tcHotRecommendProductsList.do",
						headers: {
							"token": qz_token()
						},
						data: formatJson({
							username: username,
							type: type,
							cityName: cityName,

						}),
						dataType: "json",
						success: function(msg) {
							if(msg.total) {
								$(".interest_box").show();
								$(".interest_list .jiazai").remove();
								insertFlag = true;
								insertPrdContent(msg, $(".interest_list"));
							} else {
								$(".interest_list .jiazai").remove();
								$(".interest_box").hide();
							}

						},
						error: function() {
							console.log("error")
						}

					})
				}
			},
			error: function() {
				console.log("error")
			}

		});
	}

	function insertPrdContent(msg, el) {
		var mssg = msg.data;
		if(msg.status == 0) {
			for(var i = 0; i < mssg.length; i++) {
				var str = "";
				var nums = i;
				if(mssg[i].tcProduct.imagepath) {
					var imagepath = mssg[i].tcProduct.imagepath; //文章图片
				}

				var commentlist = mssg[i].tcLeaveWordList; //评论人列表
				var clickMaplist = mssg[i].clickMaplist; //点赞人头像

				//用户信息
				str += publisherInfo(mssg[i]);

				//文章内容

				str += publishContent(mssg[i]);

				//图片视频
				str += imgVideo(mssg[i], imagepath);
				//加载点赞人头像
				str += publishBottom(mssg[i], clickMaplist);

				//留言
				str += commentsContent(mssg[i], commentlist, nums, str, el);
			}
		}
	}

	//快速联系
	$(document).on('click', '.fast_contact', function(ev) {
		var ev = ev || event;
		if(!username) {
			$(".masks,.viewBox").show();
			ev.stopPropagation();
			return false;
		}
		var $this = $(this);
		var t = "chat";
		var imgSrc = $this.attr('data-img');
		var type = $this.attr('data-nick');
		var _oldname = $this.attr('data-oldname');
		var _myindustry = $this.attr('data-myindustry');
		var magicno = $(this).attr('data-magicno');
		var strangename = '';
		if(getURIArgs('strangename')) {
			strangename = getURIArgs('strangename');
		}
		$('#image').removeAttr('disabled'); //将文件可点击
		if(isShowChatBox(_oldname)) { //判斷是否在内存中 true为没有在内存里面
			createChatWindow(_oldname, _myindustry, type, imgSrc, 1, t);
			var recent = '<li class="Chat_list" data-off="0" data-magicno="' + magicno + '" data-myindustry="">' +
				'<dl><dt><img class="img" src="' + imgSrc + '"></dt><dd class="nickname">' + type + '</dd></dl><div class="recmdCircle"></div></li>'
			//陌生人主页的最近联系人通讯录
			$('.recentChat>ul').prepend(recent);
			var c_obj = storeChatStatus(_oldname, type, imgSrc, _myindustry, t);
			changeChatBoxStatus(c_obj);
		} else {
			createCommon(_oldname, _myindustry, type, imgSrc, 1, t);
		}

		storeFocusChatBox(_oldname);
		Gab.make_top_zero(_oldname);
		Gab.getMessageCount();
	})

	//商品下架
	$(document).on("click", ".js_commodityFrame", function() {
		var id = $(this).parent().attr("proId");
		var _this = this;
		commodityFrameFun(id, _this);
	});
	$(".postAchieve .sure_btn").click(function() {
		$(".postAchieve,#maskss").hide();
		window.location.reload();
	})
	//举报
	$(document).on("mouseover", ".more_box", function() {
		$(this).find(".fl_menu_list").show();
	}).mouseout(function() {
		$(this).find(".fl_menu_list").hide();
	})

	//动态下拉
	document.documentElement.scrollTop=document.body.scrollTop=0;
	$(window).scroll(function(event) {
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height(); //整个文档的高度
		var footerTop = $(".footerss").offset().top;
		var windowHeight = $(this).height();
		var leftH=$(".list_left").height();//左侧内容的高度
		var rightH=$(".list_right").height();//右侧内容的高度
        if(leftH<rightH){
        	if(scrollTop>10){
        		if(leftH+scrollTop>rightH){
        			$(".list_left").addClass("leftFixedBottom").removeClass("leftFixed");
        		}else{
        			$(".list_left").addClass("leftFixed").removeClass("leftFixedBottom");
        		}
        	}else{
        		$(".list_left").removeClass("leftFixedBottom").removeClass("leftFixed");
        	}
        }
		
		if(href.indexOf("hot.html") > 0) {
			prdFixed(0, scrollTop, footerTop,leftH,rightH, "hotFixed");
		} else if(href.indexOf("occupation.html") > 0) {
			var moreLess = $(".hot_word li.showmore");
			if(moreLess.css("display") == "none") {
				prdFixed(844, scrollTop, footerTop,leftH,rightH, "rightLessFixed");
			} else {
				prdFixed(280, scrollTop, footerTop,leftH,rightH, "rightFixed");
			}

		} else if(href.indexOf("rent.html") > 0) {
			prdFixed(110, scrollTop, footerTop,leftH,rightH, "rentFixed");
		} else if(href.indexOf("housekeep.html") > 0) {
			prdFixed(195, scrollTop, footerTop,leftH,rightH, "houseFixed");
		} else if(href.indexOf("secondPrd.html") > 0) {
			prdFixed(255, scrollTop, footerTop,leftH,rightH, "secFixed");
		} else {
			prdFixed(200, scrollTop, footerTop,leftH,rightH, "businessFixed");
		}
		if(scrollTop + windowHeight + 2 >= scrollHeight) {
			if(insertFlag&&leftH>rightH) {
				page = page + 1;
				if(page <= Math.ceil(totalPage / 10)) {
					$(".bottom_left").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
					prdLists(prdType, page, getCookie("locationName"), username);
					insertFlag = false;
				}
			}
        }
	})
    function prdFixed(limitTop, scrollTop, footerTop,leftH,rightH,fixedClass) {
		if(insertFlag&&leftH>rightH) {
			if(scrollTop > limitTop) {
				$(".list_right").addClass(fixedClass).removeClass("rightAbsolute");
				if(scrollTop >=footerTop - 915) {
					if(Math.ceil(totalPage / 10) > 1) {
						if(page >= Math.ceil(totalPage / 10)) {
							$(".list_right").addClass("rightAbsolute").removeClass(fixedClass);
						} else {
							$(".list_right").addClass(fixedClass).removeClass("rightAbsolute");
						}
					} else {
						$(".list_right").addClass("rightAbsolute").removeClass(fixedClass);
					}
				} else {
					$(".list_right").addClass(fixedClass).removeClass("rightAbsolute");
				}
			} else {
				$(".list_right").removeClass("rightAbsolute").removeClass(fixedClass);
			}
		}
	}
})

function getAreaSelect(Data, el, area) { //Data:地区数据；area：市;
	var area = area;
	for(var i = 0; i < Data.length; i++) {
		var data = Data[i].children;
		for(var j = 0; j < data.length; j++) {
			if(data[j].name.indexOf(area) >= 0) {
				data = data[j].children;
				var str = "",
					hasCon = "";
				for(var k = 0; k < data.length; k++) {
					str += '<li data-name="' + data[k].name + '">' + data[k].name + '</li>';
					if(data[k].children[0]) {
						hasCon = "conTrue"
					} else {
						hasCon = "";
					}
					var countyStr = '<ul class="county ' + hasCon + '">';
					if(data[k].children[0]) {
						var result = data[k].children[0].content.sub;
						for(var m = 0; m < result.length; m++) {
							countyStr += '<li data-pName="' + data[k].name + '" data-name="' + result[m].area_name + '">' + result[m].area_name + '</li>';
						}
						countyStr += '</ul>';
					}
					$(".place").append(countyStr);
				}
				$(el).html(str);
			}
		}

	}
}

function getSub(Data, el, area) { //Data:地铁数据；area:市;
	var area = area;
	var flag = false;
	for(var i = 0; i < Data.subway.length; i++) {
		if(Data.subway[i].cityname.indexOf(area) >= 0) {
			flag = true;
			var data = Data.subway[i].content;
			var str = "";
			str += '<li data-name="" class="active">不限</li>';
			for(var k = 0; k < data.length; k++) {
				str += '<li data-name="' + data[k].line_uid + '">' + data[k].line_name + '</li>';
				var countyStr = '<ul class="stop_way">' +
					'<li data-pName="' + data[k].line_uid + '" data-name="" class="active">整条线路</li>';
				var result = data[k].stops;
				for(var m = 0; m < result.length; m++) {
					countyStr += '<li data-pName="' + data[k].line_uid + '" data-name="' + result[m].name + '">' + result[m].name + '</li>';
				}
				countyStr += '</ul>';
				$(".sub_way").append(countyStr);
			}
			$(el).html(str);
		}

	}
	if(!flag) {
		$(".select_list .sub_line,.sub_way").remove();
	}

}

function formatJson(D, flag) {
	var D = D || {};
	for(var i in D) {
		if(D[i] === "" || D[i] == null) {
			delete(D[i]);
		}
	}
	return D;
}