$(function() {
	var themeNo = getURIArgs("code");
	//推荐可能认识的人
	// recommendRosters(getCookie("username"));
	//生活圈分类接口
	ClassificationInterface2();
	$(document).on("click", ".amend", function() {
			$(".MoreLiving2").show();
			$(".MoreLiving_01").show();
		})
		//关闭 生活圈分类接口
	$(".MoreLiving2 .More_l_del").on("click", function() {
		$(".MoreLiving2").hide();
	})
	$(document).on("click", ".MoreLiving2 .Living_list li", function() {
		$(this).find("i").toggleClass("on")
		$(this).siblings().find("i").removeClass("on");
		$(this).addClass("on");
		$(this).siblings().removeClass("on");
		//		if($(this).find("i").hasClass("on")){
		//			$(this).addClass("on");
		//		}else{
		//			$(this).removeClass("on");
		//		}
	})


	//保存
	$(document).on("click", "a.keeps", function() {
		var cid = "";
		var cName = "";
		$(".MoreLiving2 .Living_list li.on").each(function(index, element) {
			cid = $(this).attr("data-id");
			cName = $(this).attr("data-name");
		});
		$(".MoreLiving2").hide();
		$(".classifications").html(cName);
		$(".classifications").attr("data-id", cid);
		$(".classifications").attr("data-name", cName);
	});
	// 生活圈分类图路径
	var LifeImg = serHOST()+"/res/pics/theme_type/";

	function ClassificationInterface2() {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/themeCatetory/getAllThemeCatetories.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			success: function(mssg) {
				if(mssg.status==-3){
					getToken();
				};
				var str = "";
				for (var i = 0; i < mssg.data.length; i++) {
					var msg = mssg.data[i];
					str += '<li class="Category" data-id=' + msg.id + ' data-name=' + msg.name + '>';
					str += '<img src="' + LifeImg + msg.url + '" align="top" />' +
						'<h5>' + msg.name + '</h5>';
					str += '<i></i>'
					str += '</li>';
				}
				$(".MoreLiving2 .Living_list").html(str);
			},
			error: function() {
				console.log("error")
			}

		});
	}
	//	圈子详情接口
	function searchCirMsg(datas) {
		$.ajax({
			type:"post",
			url:serviceHOST()+"/userCircle/searchCircle.do",
			data:datas,
			headers: {
				"token": qz_token()
			},
			success:function(jsons){
				//var jsons=JSON.parse(msg);
				if(jsons.status==0){
					$(".join_num").html(jsons.data.userCount);   //加入人数
					$(".dynamic_num").html(jsons.data.topicCount);  //动态数量
					$(".circle_name").val(jsons.data.circleName);  //圈子名称
					$(".classifications").html(jsons.data.categoryname);  //圈子类型
					$(".classifications").attr("data-id",jsons.data.themecategory)
					$(".creatname").html(jsons.data.createusername);         //创建人
					$(".creatntime").html(formatTime(jsons.data.createtime,true));      //创建时间
					//聊天室开通与否
					if (jsons.data.candiscoverjid == 0) { //1是开通   0是关闭
						$("#chatOff").attr("checked", true);
						$("#chatOn").attr("checked", false);
					} else {
						$("#chatOn").attr("checked", true);
						$("#chatOff").attr("checked", false);
					}
					$(".introduce").val(jsons.data.content); //圈子介绍
				}else if(jsons.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error");
			}
		});
	}
	searchCirMsg({
		username: UserName,
		circleName: getURIArgs("code"),
		catetory: 3 //生活圈
	});

	function getMSGS(datas) {
		$.ajax({
			type:"post",
			url:serviceHOST()+"/citycircle/modifyCityCircleOrThemeInfo.do",
			data:datas,
			headers: {
				"token": qz_token()
			},
			success:function(msg){
				if(msg.status==0){
					friendlyMessage(msg.info,function(){
						// location.reload();
					});
				}else if(msg.status==-3){
					getToken();
				}else {
					warningMessage(msg.info, function() {
						// location.reload();
					})
				}
			},
			error: function() {
				console.log("error");
			}
		});
	};
	//圈子设置保存接口
	$(document).on('click', ".sub .sub_active", function() {
		var circleName = html2Escape($(".circle_name").val()); //圈子名称
		var catetorys = $(".classifications").attr("data-id");
		var catetoryName = $(".classifications").attr("data-name");
		var contents = $.trim(html2Escape($(".introduce").val()))||"-2"; //圈子介绍
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
			id: themeNo, //圈子编号(全球圈：citycircleIdOrThemeNo=cityCircleId;生活圈：citycircleIdOrThemeNo=themeNo)
			themename: circleName, //圈子名称
			catetory: catetorys, //圈子分类 (生活圈有，全球圈传-1)
			code: -1, //圈子城市(全球圈有，生活圈圈传-1)
			pcode: -1, //圈子国家(全球圈有，生活圈圈传-1)
			candiscoverjid: switchs, //聊天室     1开通  0关闭
			content: contents,
			isCityCircleOrTheme: 1 //1:表示生活圈，2：表示全球圈  
		})
	})

	//取消圈子设置
	$(document).on("click", ".cancel", function() {
		location.reload();
	})

})