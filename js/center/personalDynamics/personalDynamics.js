$(function() {
	
	//下拉加载动态
	findOneUserAllTopic(1)
	var page = 1;
	var stop = false; //触发开关，防止多次调用事件 
	$(window).scroll(function(event) {
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height(); //整个文档的高度
		var windowHeight = $(this).height();

		if(scrollTop + windowHeight + 2 >= scrollHeight) {
			if(stop == true) {
				stop = false;
				$(".dynamic_list").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
				page = page + 1;
				findOneUserAllTopic(page);
			}

		}
	})
	

	//加载所有动态
	function findOneUserAllTopic(page) {
		var str = "";
		$.ajax({
			type: "post",
			url: serviceHOST() + "/topic/getPersonDynamic.do",
			data: {
				username: UserName,
				pageNum: page
			},
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				$(".Toloadmore").remove();
				if(msg.status == 0) {
					stop = true;
					var mssg = msg.data;

					if($(".content_items").length == 0 && mssg == "") {
						$(".dynamic_list").html('<div class="no_collect" style="height:406px"><img src="/img/nodata.png"/ align="top"><p>尚未发布</p><a href="#">立即发布</a></div>');
						stop = false;
						return false;
					}else if(mssg == "") {
						stop = false;
						return false;
					}  
					for(var i = 0; i < mssg.length; i++) {
						var nums = (page - 1) * mssg.length + i;
						var imagepath = mssg[i].topic.imagepath; 				//文章图片
						var commentlist = mssg[i].commentlist; 					//评论人列表
						var clickMaplist = mssg[i].clickMaplist; 				//点赞人头像
						
						str = PostDynamicUserDetails(mssg[i]);					//帖子用户信息


						// 加载帖子文章内容
						
						str += DynamicPostArticles (mssg[i]);
    
							
						//文章图片
						
						str += TheArticleShowUs(mssg[i],imagepath);

						
						//判断是否赞过
						//加载点赞人头像
						
						str += DetermineWhetherPraise(mssg[i],clickMaplist);


						//帖子评论动态  评论
						str += PostCommentsContent(mssg[i],commentlist,nums,str,$(".dynamic_list"));

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
	

	//  立即发布
	$(document).on("click",".no_collect a",function(){
		$("#FaceBoxText").focus();
	})
		

})