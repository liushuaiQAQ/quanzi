$(function() {
	//下拉加载动态
	var page = 1;
	var stop = false; //触发开关，防止多次调用事件 
	$(window).scroll(function(event) {
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height(); //整个文档的高度
		var windowHeight = $(this).height();

		if(scrollTop + windowHeight + 2 >= scrollHeight) {
			if(stop == true) {
				stop = false;
				$("#dynamic_list").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
				page = page + 1;
				findTopicListOfRosterCircle(page);
			}
		}
	})

	//加载所有动态
	findTopicListOfRosterCircle(1)
	function findTopicListOfRosterCircle(page) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/topic/findTopicListOfRosterCircle.do",
			data: {
				username: UserName,
				pageNum: page,
			},
			headers: {
				"token": qz_token()
			},
			dataType: "json",
			success: function(msg) {
				$(".Toloadmore").remove();
				$(".jiazai").remove();
				if(msg.status == 0) {
					stop = true;
					var mssg = msg.data;
					var nums = "";
					// 无动态时
					if(mssg == "" && $(".content_items").length == 0){
						$("#dynamic_list").html('<div class="Isempty"><p>圈子里尚无动态</p></div>');
						stop = false;
					}else if(mssg == ""){
						stop = false;
					}
					loadTheCircleOfFriends(mssg);
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}
		})
	}

	


	function loadTheCircleOfFriends(mssg){
		for(var i = 0; i < mssg.length; i++) {
			var str = '';
			var nums = (page - 1) * mssg.length + i;
			var imagepath = mssg[i].topic.imagepath; 		//文章图片
			var commentlist = mssg[i].commentlist; 			//评论人列表
			var clickMaplist = mssg[i].clickMaplist; 		//点赞人头像
			

			//帖子用户信息
			str = PostDynamicUserDetails(mssg[i]);			 
		

			// 加载帖子文章内容
			str += DynamicPostArticles (mssg[i]);


			//文章图片
			str += TheArticleShowUs(mssg[i],imagepath);

			
			//用户文章发布位置
			if(mssg[i].topic.address != "" && mssg[i].topic.address != null) {
				str += '<div class = "location"><p> ' + mssg[i].topic.address + ' <span> </span></p></div>';
			}
			str += '</div>' +
				'<div class="qz_handle">' +
				'<ul class="qz_row_line">' +
				'<li>';
			//判断是否赞过
			var clickcout = mssg[i].topic.clickcout;
			var commentcount = mssg[i].topic.commentcount;
			if(clickcout == 0) clickcout = ""
			if(commentcount == 0) commentcount = ""
			if(mssg[i].isClickOrCannel == 1) {
				str += '<a class="like_praise like_yizan like_zan" href="javascript:;"><i></i>赞<span>' + clickcout + '</span></a>';
			} else {
				str += '<a class="like_praise like_zan" href="javascript:;"><i></i>赞<span>' + clickcout + '</span></a>';
			}
			str += '</li>' +
				'<li>|</li>' +
				'<li>' +
				'<a class="review" href="javascript:;"><i></i>评论<span>' + commentcount + '</span></a>' +
				'</li>' ;
				
			//判断自己发的帖子 可见性
			str += FriendsVisibility (mssg[i]);
			
			//点赞人头像		
			if(clickMaplist != "") {
				str += '<div class="click_portrait clear">' +
					'<div class="click_portrait_l">' +
					'<img src="/img/dianzan_10.png" />';
				str += '</div>' +
					'<div class="click_portrait_c">';
				for(var m = 0; m < clickMaplist.length; m++) {
					if(clickMaplist[m].headimg == undefined) {
						if(clickMaplist[m].username == UserName) {
							str += '<a class="Myhead clickPersonpage" data-name="'+clickMaplist[m].username+'" href="javascript:;"><img src="/img/first.png"alt="" /></a>';
						} else {
							str += '<a class="clickPersonpage" data-name="'+clickMaplist[m].username+'" href="javascript:;"><img src="/img/first.png"alt="" /></a>';
						}
					} else {
						if(clickMaplist[m].username == UserName) {
							str += '<a class="Myhead clickPersonpage" data-name="'+clickMaplist[m].username+'" href="javascript:;"><img src="' + ImgHOST() + clickMaplist[m].headimg + '"alt="" /></a>'
						} else {
							str += '<a class="clickPersonpage" data-name="'+clickMaplist[m].username+'" href="javascript:;"><img src="' + ImgHOST() + clickMaplist[m].headimg + '"alt="" /></a>'
						}

					}
				};
				str += '</div>';

				//所有点赞人
				if(clickcout >= 12) {
					str += AllTheThumbUp(clickMaplist);
				}
				str += '</div>';
			} else {
				str += '<div class="click_portrait clear"></div>';
			}

			//帖子评论动态  评论
			str += PostCommentsContent(mssg[i],commentlist,nums,str,$("#dynamic_list"));

		}
	}


	
	
	// 关闭动态可见好友弹窗
	$(document).on("click",".VisibleFriends p a",function  () {
		$(".VisibleFriends").hide(200);
		$("body").removeClass("modal-open");
	})
	
	// 查看动态可见好友弹窗
	$(document).on("click",".qz_handle .qz_row_line li a.friendImg",function  () {
		$(".VisibleFriends").hide(200);
		$("body").toggleClass("modal-open");
		$(this).parents(".content_items").find(".VisibleFriends").toggle();
	})
	
	
})
