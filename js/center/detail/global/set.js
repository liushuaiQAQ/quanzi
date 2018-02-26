$(function() {
	var cityId = getURIArgs("code");
	//推荐可能认识的人
	recommendRosters(getCookie("username"));
	getCircleDetail(username, code); //详情	
	//	全球圈设置地点更改
	//选择框弹出按钮
	$(document).on("click", '.setAdd', function(e) {
		$(".fixedMask").show();
		$('.choseArea').show();
		e.stopPropagation();
	});
	//选择框结束按钮
	$(document).on("click", '.areaBtn', function(e) {
		$(".fixedMask").hide();
		$('.choseArea').hide();
		e.stopPropagation();
	});
	var countryStr = '';
	//先将所有的国家插入页面当中
	for (var i = 0; i < globalArea_normal.length; i++) {
		countryStr = '<li data-id="' + globalArea_normal[i].id + '">' + globalArea_normal[i].name + '</li>';
		$('.areaCountry').append(countryStr);
	};
	//国家地区点击的时候
	$(document).on("mouseenter", '.areaCountry>li', function(e) {
		var _index = $(this).index();
		$('.areaProvince').empty();
		$('.areaCity').empty()
		$('.areaCountry>li').removeClass('choseActive');
		$(this).addClass('choseActive');
		for (var i = 0; i < globalArea_normal[_index].children.length; i++) {
			var secondStr = '<li data-id="' + globalArea_normal[_index].children[i].id + '" data-pid="' + globalArea_normal[_index].children[i].pid + '">' + globalArea_normal[_index].children[i].name + '</li>';
			$('.areaProvince').append(secondStr);
		};
		e.stopPropagation();
	});
	//省份
	$(document).on("mouseenter", '.areaProvince>li', function(e) {
		$('.areaProvince>li').removeClass('colorActive');
		$(this).addClass('colorActive');
		if ($(this).parent().children().eq(0).text() == '北京市') {
			var _index = $(this).index();
			$('.areaCity').empty();
			for (var i = 0; i < globalArea_normal[0].children[_index].children.length; i++) {
				var s = globalArea_normal[0].children[_index].children[i];
				var thirdStr = '<li data-id="' + s.id + '" data-pid="' + s.pid + '">' + s.name + '</li>';
				$('.areaCity').append(thirdStr);
			};
		}
		e.stopPropagation();
	})

	//如果第一个不是北京市的时候
	$(document).on("click", '.areaProvince>li', function(e) {
		$('.areaProvince>li').removeClass('colorActive');
		$(this).addClass('colorActive');
		if ($(this).parent().children().eq(0).text() != '北京市') {
			var _pName = $(this).text();
			var _cName = $(this).parent().prev().children('.choseActive').text();
			var pid = $(this).attr('data-pid');
			var id = $(this).attr('data-id');
			$('.create_i').attr('data-pid', pid);
			$('.create_i').attr('data-id', id);
			$(".fixedMask").hide();
			$('.choseArea').hide();
			$('.addresss').html(_cName + '-' + _pName);
			$('.addresss').attr("data-code", $(this).attr("data-id"));
			$('.addresss').attr("data-pcode", $(this).attr("data-pid"));
		}
		e.stopPropagation();
	})

	//城市点击的时候
	$(document).on("click", '.areaCity>li', function(e) {
		var _cityName = $(this).text();
		var _pName = $(this).parent().prev().children('.colorActive').text();
		var pid = $(this).attr('data-pid');
		var id = $(this).attr('data-id');
		$('.create_i').attr('data-pid', pid);
		$('.create_i').attr('data-id', id);
		$(".fixedMask").hide();
		$('.choseArea').hide();
		$('.addresss').html('中国-' + _pName + '-' + _cityName);
		$('.addresss').attr("data-code", $(this).attr("data-id"));
		$('.addresss').attr("data-pcode", $(this).attr("data-pid"));
		e.stopPropagation();
	});


	//	圈子详情接口
	function searchCirMsg(datas) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/userCircle/searchCircle.do",
			headers: {
				"token": qz_token()
			},
			data: datas,
			success: function(jsons) {
				if (jsons.status == 0) {
					var pcode = jsons.data.pcode;
					var code = jsons.data.code;
					var areaText = findArear(pcode, code);
					$(".join_num").html(jsons.data.userCount); //加入人数
					$(".dynamic_num").html(jsons.data.topicCount); //动态数量
					$(".circle_name").val(jsons.data.circleName); //名称
					$(".addresss").html(areaText); //地址
					$(".addresss").attr("data-code", jsons.data.code);
					$(".addresss").attr("data-pcode", jsons.data.pcode);
					$(".creatname").html(jsons.data.createusername); //创建人
					$(".creatntime").html(formatTime(jsons.data.createtime, true)); //创建时间
					//聊天室开通与否
					if (jsons.data.candiscoverjid == 0) { //1是开通   0是关闭
						$("#chatOn").attr("checked", false);
						$("#chatOff").attr("checked", true);
					} else {
						$("#chatOff").attr("checked", false);
						$("#chatOn").attr("checked", true);
					}
					$(".introduce").val(jsons.data.content); //圈子介绍
				} else if (msg.status == -3) {
					getToken();
				};
			},
			error: function() {
				console.log("error");
			}
		});
	}
	searchCirMsg({
		username: getCookie("username"),
		circleName: cityId,
		catetory: 2 //全球圈
	})

	//根据code,pcode来查询对应的地区
	function findArear(pcode, code) {
		var areaText = '';
		for (var i = 0; i < globalArea_normal.length; i++) {
			for (var j = 0; j < globalArea_normal[i].children.length; j++) {
				if (globalArea_normal[i].children[j].pid == pcode && globalArea_normal[i].children[j].id == code) {
					areaText = globalArea_normal[i].children[j].pname + ',' + globalArea_normal[i].children[j].name;
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

	//圈子设置保存接口
	$(document).on('click', ".sub .sub_active", function() {
		var circleName = html2Escape($(".circle_name").val()); //圈子名称
		var code = $(".addresss").attr("data-code");
		var pcode = $(".addresss").attr("data-pcode");
		var contents = $.trim(html2Escape($(".introduce").val())) ||"-2"; //圈子介绍
		if ($("#chatOn").is(":checked")) { //聊天室开通与否    1开通  0关闭
			var switchs = 1;
		} else {
			var switchs = 0;
		};

		if (circleName == "") {
			$(".settingBox .titWord").html("圈子名称不能为空").show();
			return false;
		};
		if (circleName.length > 20) {
			$(".settingBox .titWord").html("名称不能大于20个字符").show();
			return false;
		}
		getMSGS({
			id: cityId, //圈子编号(全球圈：citycircleIdOrThemeNo=cityCircleId;生活圈：citycircleIdOrThemeNo=themeNo)
			themename: circleName, //圈子名称
			catetory: -1, //圈子分类 (生活圈有，全球圈传-1)
			code: code, //圈子城市(全球圈有，生活圈圈传-1)
			pcode: pcode, //圈子国家(全球圈有，生活圈圈传-1)
			candiscoverjid: switchs, //聊天室     1开通  0关闭
			content: contents,
			isCityCircleOrTheme: 2 //1:表示生活圈，2：表示全球圈  
		})
	})

	function getMSGS(datas) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/citycircle/modifyCityCircleOrThemeInfo.do",
			data: datas,
			headers: {
				"token": qz_token()
			},
			success: function(jsonss) {
				// var jsonss = JSON.parse(msg);
				if (jsonss.status == 0) {
					friendlyMessage(jsonss.info, function() {
						location.reload();
					});
				} else if (joinss.status == -3) {
					getToken();
				} else {
					warningMessage(jsonss.info, function() {
						location.reload();
					})
				}
			},
			error: function() {
				console.log("error");
			}
		});
	};

	//取消圈子设置
	$(document).on("click", ".cancel", function() {
		location.reload();
	})
})