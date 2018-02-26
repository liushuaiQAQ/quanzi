$(function(){
	getCircleDetail(username,code,cache);				//详情

	//动态下拉
	findTopicListOfCityCircle(username, 1, 10, code);	//帖子动态
	$(window).scroll(function(event) {
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height(); //整个文档的高度
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 2 >= scrollHeight) {
			if(stop == true) {
				stop = false;
				$(".bottom_left").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
				page = page + 1;
				findTopicListOfCityCircle(username,page, 10, code);	//帖子动态
			}

		}
	})
})