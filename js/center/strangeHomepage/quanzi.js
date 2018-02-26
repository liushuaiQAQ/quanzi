$(function() {
	var _username = getCookie('username');
	//获取个人信息
	findUserInformation(_username, strangename);
	//可能认识的人
	recommendRosters(_username);
	getCircleList(_username, strangename);

	function getCircleList(username, findedusername) {
		var str = "";
		$.ajax({
			type: "post",
			url: serviceHOST() + "/userCircle/findOneUsernameJoinedAllCircle.do",
			dataType: "json",
			data: {
				findusername: username,
				findedusername: findedusername
			},
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				//console.log(msg);
				if (msg.status == 0) {
					$('.jiazai').remove();
					if (msg.data.length == 0) {
						$('.no_publish').show();
					} else {
						var str = '';
						for (var i = 0; i < msg.data.length; i++) {
							var circleType = msg.data[i].category;
							var code = '';
							var relation = msg.data[i].userCircleRelation;
							if (circleType == 1) {
								code = msg.data[i].code;
							} else if (circleType == 2) {
								code = msg.data[i].cityCircleId;
							} else {
								code = msg.data[i].themeNo;
							}

							str += '<li class="attention" style="background:none;" data-code="' + code + '" data-name="' + msg.data[i].themename + '" data-num="' + msg.data[i].topicCount + '" data-type="' + circleType + '" data-attention="' + msg.data[i].isAttention + '">' + //type--category 1-职业圈帖子；2-全球圈帖子；3-生活圈帖子
								'<a class="AttentionProfessional" href="javascript:;">' +
								' <div class="Imgheader">';
							if (msg.data[i].imagepath == "" || msg.data[i].imagepath == undefined) {
								str += '<img src="/img/zhiyequan.png" alt="">';
							} else {
								str += '<img src="' + ImgHOST() + msg.data[i].imagepath + '" alt="">';
							}
							str += '</div>' +
								'<p><span class="themename">' + msg.data[i].themename + '</span>';
							if (relation == 1) {
								str += '<span class="create"></span>';
							}
							str += '</p><span class="attentioncount">' + msg.data[i].usercount + '人加入</span>' +
								'<span class="segmentation">|</span><span class="topiccount">' + msg.data[i].activecount + '人活跃</span>';

							if (relation == 0) {
								str += '<div class="joinCircle">加入</div></li>';
							} else {
								str += '<div class="enterCircle">进入</div></li>'
							}
						}
						$('.circleContent>ul').html(str);

					}
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}
		})
	};

	$(document).on('click', '.circleContent .attention', function() {
		var type = $(this).attr('data-type'); //1-职业圈帖子；2-全球圈帖子；3-生活圈帖子
		var isJoin = $(this).attr('data-attention');
		var _code = $(this).attr('data-code');
		var dataNames = $(this).attr('data-name');
		//  获取下标
		var _index = $(this).index();
		//  获取动态数量
		var _num = parseInt($(this).attr("data-num"));
		// 点击之后存储新的数据

		if (type == 1) {
			if (dataNames.indexOf("\/") > -1) {
				dataNames = dataNames.replace(/\//g, "_");
			} else {
				dataNames = dataNames;
			};
			window.location.href = '/center/zhiye/mydynamic.html?code=' + _code + "&dataName=" + dataNames;
		} else if (type == 2) {
			window.location.href = '/center/global/mydynamic.html?code=' + _code;
		} else {
			window.location.href = '/center/life/mydynamic.html?code=' + _code;
		}
	})


	$(document).on('click', '.joinCircle', function(e) {
		var arrCode = []; //关注职业圈数组
		var _this=$(this);
		var codeId = $(this).parents('.attention').attr('data-code');
		var type = $(this).parents("li").attr('data-type'); //1-职业圈帖子；2-全球圈帖子；3-生活圈帖子
		if (type == 1) {
			arrCode.push(codeId);
			var codeId = JSON.stringify(arrCode);
			joinProfessionalCircle(_username, codeId,_this);
		} else if (type == 2) {
			joinGlobalCircle(_username, codeId,_this);
		} else {
			LoadLifeCircle(_username, codeId,_this);
		}
		e.stopPropagation();
	})

	//加入全球圈
	function joinGlobalCircle(username, id,_this) {
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
					friendlyMessage('加入成功');
					_this.removeClass().addClass('enterCircle').text('进入');
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}
		})
	};
	// 加入生活圈话题
	function LoadLifeCircle(username, themeNo,_this) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/theme/createThemeofusermap.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: {
				username: username,
				themeNo: themeNo
			},
			success: function(msg) {
				if (msg.status == 0) {
					_this.removeClass().addClass('enterCircle').text('进入');
					friendlyMessage('加入成功');
				}else if(msg.status==-3){
					getToken();
				}else {
					friendlyMessage(msg.info);
				}
			},
			error: function() {
				console.log("error")
			}
		});

	}

	//加入职业圈
	function joinProfessionalCircle(username, codeId,_this) {
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
					_this.removeClass().addClass('enterCircle').text('进入');
					friendlyMessage('加入成功');
				} else if (msg.status == -1) {
					warningMessage(msg.info);
				}else if(msg.status==-3){
					getToken();
				}else {
					warningMessage("您的等级不够，请重新加入！！！");
				}
			},
			error: function() {
				console.log("error");
			}
		});
	}

})