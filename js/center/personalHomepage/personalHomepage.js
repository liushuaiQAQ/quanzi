$(function() {
	var _username = getCookie('username');
	//console.log(_username);
	//获取个人信息资料
	findUserInformation(_username, _username);
	var user_level = {
		30007: "boy",
		22899: "gril"
	};

	//可能认识的人
	recommendRosters(_username);
	//大图轮播展示
	ByShowingPictures();

	//立即发布点击
	$(document).on('click', '.releaseBtn', function(e) {
		window.location.href = '/center/index.html?posting=1'
		e.stopPropagation();
	})

	$(document).on('click', '.publish_close', function(e) {
		$('.publish_box').hide();
		e.stopPropagation();
	})

	/*$(document).click(function(e){
		if(e.target.className == 'publish_box'){
			$('.publish_box').hide();
		}
	})*/

	//下拉加载动态
	getAllUserinfo(_username, 1)
	var page = 1;
	var stop = false; //触发开关，防止多次调用事件 
	$(window).scroll(function(event) {
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height(); //整个文档的高度
		var windowHeight = $(this).height();

		if (scrollTop + windowHeight + 2 >= scrollHeight) {
			if (stop == true) {
				stop = false;
				$(".personal_right").append('<div class="jiazai"></i>正在加载中，请稍后</div>');
				page = page + 1;
				getAllUserinfo(_username, page)
			}

		}
	})

	//获取个人所有动态
	function getAllUserinfo(username, page) {
		$.ajax({
			type: "post",
			url: serviceHOST() + '/topic/getPersonDynamic.do',
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: {
				username: username,
				pageNum: page
			},
			success: function(msg) {
				$('.jiazai').remove();
				if (msg.status == 0) {
					var mssg = msg.data;
					for (var i = 0; i < mssg.length; i++) {
						var nums = (page - 1) * mssg.length + i;
						var imagepath = mssg[i].topic.imagepath; //文章图片
						var commentlist = mssg[i].commentlist; //评论人列表
						var clickMaplist = mssg[i].clickMaplist; //点赞人头像
						if (mssg[i].user != null && mssg[i].user != "") {
							//帖子用户信息
							str = PostDynamicUserDetails(mssg[i]);


							// 加载帖子文章内容

							str += DynamicPostArticles(mssg[i]);


							//文章图片
							str += TheArticleShowUs(mssg[i], imagepath);


							//判断是否赞过
							//加载点赞人头像

							str += DetermineWhetherPraise(mssg[i], clickMaplist, 1);

							//帖子评论动态  评论
							str += PostCommentsContent(mssg[i], commentlist, nums, str, $(".personal_right"));
							stop = true;

						}

					}
					if (mssg == "" && $(".content_items").length == 0) {
						$(".no_publish").show();
						stop = false;
						return false;
					}
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}
		})
	}



})