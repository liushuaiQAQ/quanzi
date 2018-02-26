$(function() {
	//获取陌生人资料
	if (UserName) {
		findUserInformation(UserName, strangename);
	} else {
		$('.concern').addClass('login_window');
		$('.like_message').addClass('login_window');
		$('.like_message').removeClass("like_message");
		$('.friendStatus').addClass('login_window');
		$('.setting_remark').addClass('login_window');
		$('.recommend_friends').addClass('login_window');
		$('.complain').addClass('login_window');
		$(".set_Blacklist").addClass('login_window');
		$('.nav>ul>li').eq(1).addClass('login_window');
		$('.nav>ul>li').eq(2).addClass('login_window');
		$('.nav>ul>li').eq(3).addClass('login_window');
		findUserInformation('', strangename);
	}
	//可能认识的人
	recommendRosters(UserName);

	//获取陌生人所有动态
	getAllUserinfo(1);
	var page = 1;
	var stop = false; //触发开关，防止多次调用事件 
	$(window).scroll(function(event) {
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height(); //整个文档的高度
		var windowHeight = $(this).height();
		if (scrollTop + windowHeight + 2 >= scrollHeight) {
			if (stop == true) {
				stop = false;
				$(".personal_right").append('<div class="jiazai"><i class="loading"></i>正在加载中，请稍后</div>');
				page = page + 1;
				getAllUserinfo(page);
			}

		}

	})
	
	//加载所有动态
	function getAllUserinfo(page) {
		var str = "";
		$.ajax({
			type: "post",
			url: serviceHOST() + "/topic/findOneUserAllTopic.do",
			data: {
				findusername: UserName || 'nouser',
				findedusername: strangename,
				pageNum: page,
			},
			headers: {
				"token": qz_token()
			},
			dataType: "json",
			success: function(msg) {
				$('.jiazai').remove();
				if (msg.status == 0) {
					stop = true;
					var mssg = msg.data;
					var nums = "";
					if (mssg.length == 0 && $('.content_items').length == 0) {
						$('.no_publish').show();
					}
					if (mssg == '') {
						stop = false;
						return false;
					}
					for (var i = 0; i < mssg.length; i++) {
						var nums = (page - 1) * mssg.length + i;
						var imagepath = mssg[i].topic.imagepath; //文章图片
						var commentlist = mssg[i].commentlist; //评论人列表
						var clickMaplist = mssg[i].clickMaplist; //点赞人头像

						str = PostDynamicUserDetails(mssg[i],1); //帖子用户信息


						// 加载帖子文章内容

						str += DynamicPostArticles(mssg[i]);


						//文章图片
						str += TheArticleShowUs(mssg[i], imagepath);


						//判断是否赞过
						//加载点赞人头像

						str += DetermineWhetherPraise(mssg[i], clickMaplist);


						//帖子评论动态  评论
						str += PostCommentsContent(mssg[i], commentlist, nums, str, $(".personal_right"));


					}
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}

		});

	}



	//投诉用户
	$(document).on('click', '.homepage_top .cancel_more .complain', function() {
		if (UserName) {
			doTipExcomplaint(UserName, strangename, 2)
		}
	})



	/*
	 *修改好友备注名字 users/roster/update_markname 
	 * username	本人的名字
	 * friendjid	要更改备注名称的好友jid
	 * markname	新的备注名称
	 * */
	var Setname = '<div class="SetNote"><h3>设置备注名<a href="javascript:;" class="del"></a></h3><div class="SetNote_input">备注名：<input type="text" maxlength="6"/></div>' +
		'<div class="SetNote_btn"><a class="determine" href="javascript:;">确定</a><a class="cancel del" href="javascript:;">取消</a></div></div>';

	function update_markname(Username, fId) {
		$("body").append(Setname);
		$("#mask").show();
		$(document).on("click", ".SetNote a.determine", function() {
			var Mar = html2Escape($(this).parents(".SetNote").find("input").val());
			if (Mar == "") {
				friendlyMess("请填写备注", "Y");
				return false;
			}
			var params = {
				"username": Username,
				"friendjid": fId,
				"markname": Mar
			};
			var par = $.param(params);
			$.ajax({
				type: "post",
				url: RestfulHOST() + '/users/roster/update_markname?' + par,
				dataType: "json",
				headers: {
					"Authorization": "AQAa5HjfUNgCr27x",
					"Accept": "application/json"
				},
				success: function(msg) {
					if (msg.status == 0) {
						friendlyMessage("设置备注名成功");
						$(".SetNote .del").click();
					}
				},
				error: function() {
					console.log("error")
				}

			});
		})

		//关闭      取消
		$(document).on("click", ".SetNote .del", function() {
			$("#mask").hide();
			$(".SetNote").remove();
		});
	}


})