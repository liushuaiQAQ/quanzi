$(function() {
	var UserName = getCookie("username") || ""; //用户名
	var code = getURIArgs("id"); //行业id

	//查找一级行业
	//	function findFirstLevel() { 	
	//		$.ajax({
	//			type: "post",
	//			url: serviceHOST() + "/findFirstLevelIndustry.do",
	//			dataType: "json",
	//			data: {
	//				pageNum: "1"
	//			},
	//			success: function(mssg) {
	//				var msg = mssg.data;
	//				var str = "";
	//				if(mssg.status == 0) {
	//					for(var i = 0; i < 53; i++) {
	//						str = '<li class="state" data-id=' + msg[i].code + '><div class="profession">' + msg[i].name + '</div></li>';
	//						$(".chooseWork .professional").append(str);
	//					}
	//
	//				}
	//				$(".professional .state:first-child .profession").css({
	//					"background": "#fff",
	//					"color": "#1fbd11",
	//					"border-left": "2px solid #1fbd11"
	//				})
	//				var firstchilds = $(".professional .state:first-child").attr("data-id") //上来页面加载二级职业 
	//			},
	//			error: function() {
	//				console.log("error")
	//			}
	//
	//		});
	//	}

	// 区分登录状态   职业圈二级分类动态
	if (code != "" && UserName != "") {
		findSecondLevelIndustry({
			pageNum: "1",
			pageSize: "15",
			username: UserName,
			pcode: code
		}, "/jobstree/findSecondLevelIndustryAndTopic.do")
	} else if (code) {
		findSecondLevelIndustry({
			pageNum: "1",
			pageSize: "15",
			pcode: code
		}, "/jobstree/findSecondLevelIndustryAndTopicForRegister.do")
	}
	//下拉加载分类列表
	var page = 1;
	//触发开关，防止多次调用事件 
	var stop = false;
	$(window).scroll(function(event) {
		var scrollTop = $(this).scrollTop();
		//整个文档的高度
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if (scrollTop + windowHeight + 2 >= scrollHeight) {
			if (stop == true) {
				stop = false;
				$("#dynamic_list").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
				page = page + 1;
				if (code != "" && UserName != "") {
					findSecondLevelIndustry({
						pageNum: page,
						pageSize: "15",
						username: UserName,
						pcode: code
					}, "/jobstree/findSecondLevelIndustryAndTopic.do")
				} else if (code) {
					findSecondLevelIndustry({
						pageNum: page,
						pageSize: "15",
						pcode: code
					}, "/jobstree/findSecondLevelIndustryAndTopicForRegister.do")
				}
			}

		}
	})

	//查二级行业和动态 及其最新的一条带图片的帖子
	function findSecondLevelIndustry(datas, Url) {
		var t = getURIArgs('t');
		var msgname = t;
		if (t.indexOf("_") > -1) {
			msgname = t.replace(/\_/g, "/")
		}
		$(".center_box .dynamic").html(msgname);
		$(".item_zyq").addClass("onbg");
		$.ajax({
			type: "post",
			url: serviceHOST() + Url,
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: datas,
			success: function(msg) {
				$(".Toloadmore").remove();
				if (msg.status == 0) {
					$(".jiazai").hide();
					$(".professional.bgPro").css({
						"background": "#fff",
						"padding": "0 14px",
						"min-height": "772px",
						"border": "1px solid #e5e5e5"
					})
					stop = true;
					SecondaryDynamicLoad(msg); //加载二级动态
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log('error')
			}
		});
	}



	/*
	 	加载二级行业动态 
	 * */
	function SecondaryDynamicLoad(msg) {
		var str = "";
		if(msg.data == ""){
			stop = false;
			return false;
		} 
		for (var j = 0; j < msg.data.length; j++) {
			var mssg = msg.data[j];
			var dataNames = mssg.name;
			if (dataNames.indexOf("\/") > -1) {
				dataNames = dataNames.replace(/\//g, "_");
			} else {
				dataNames = dataNames;
			}
			str += '<li class="pf_list" data-code=' + mssg.code + ' data-name="' + dataNames + '">' +
				'<ul>' +
				'<li class="zy zyhover"><a href="/center/zhiye/mydynamic.html?code=' + mssg.code + '&dataName=' + dataNames + '">' + mssg.name + '</a></li>' +
				'<li class="zy qz_num">' +
				'<span>圈子' + mssg.usercount + '人</span>';
			if (UserName != "") {
				if (mssg.isJoinOrAttention == 1) { //0和1二种状态  1是已加入   0 是未加入
					str += '<a class="join off" href="javascript:;">退出</a><a class="join goCircle" href="javascript:;" style="margin-right:10px;">进入圈子</a>';
				} else {
					str += '<a class="join on" href="javascript:;">加入</a>';
				}
			} else {
				str += '<a class="join login_window" href="javascript:;">加入</a>';
			}
			str += '</li>';
			if (mssg.topicVO) {
				str += '<li class="zy">' + mssg.topicVO.username + ':' + mssg.topicVO.themename + '</li>';
				if (mssg.topicVO.imagepath != "") {
					str += '<li class="pf_img">';
					for (var i = 0; i < mssg.topicVO.imagepath.length; i++) {
						str += '<img src=' + ImgHOST() + mssg.topicVO.imagepath[i] + '>'
					}
					str += '</li>';
				}
			}
			str += '</ul>' +
				'</li>';
		}
		$(".professional .professional_list").append(str);
	}



	//加入职业圈
	$(document).on("click", ".professional_list .join.on", function() {
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
				if (msg.status == 0) {
					if (msg.data == 1) {
						_this.removeClass("on");
						_this.addClass("off");
						friendlyMessage("加入成功", function() {
							//_this.parent().append('<a class="join goCircle" href="javascript:;" style="margin-right:10px;">进入圈子</a>')
							_this.html("退出");
						})
					}
				} else if (msg.status == 1) {
					warningMessage("您的等级不够，请重新加入！！！");
				}else if(msg.status==-3){
					getToken();
				};
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
//				var joinS = JSON.parse(msg)
//				if (joinS.status == 0) {
//					if (joinS.data == 1) {
//						_this.removeClass("off");
//						_this.addClass("on");
//						friendlyMessage("退出成功", function() {
//							_this.siblings('.goCircle').remove();
//							_this.html("加入");
//						})
//					}
//				}
//			},
//			error: function() {
//				console.log("error");
//			}
//		});
//	})

	$(document).on('click', '.pf_img>img,.goCircle', function() {
		var code = $(this).parents('.pf_list').attr('data-code');
		var name = $(this).parents('.pf_list').attr('data-name');
		window.location.href = '/center/zhiye/mydynamic.html?code=' + code + '&dataName=' + name;
	})

})