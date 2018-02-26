$(function(){
	//动态下拉
	findTopicListOfIndustryCircle(username,1,code);
	$(window).scroll(function(event) {
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height(); //整个文档的高度
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 2 >= scrollHeight) {
			if(stop == true) {
				stop = false;
				$(".bottom_left").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
				page = page + 1;
				findTopicListOfIndustryCircle(username,page,code);
			}

		}
	})
	
})