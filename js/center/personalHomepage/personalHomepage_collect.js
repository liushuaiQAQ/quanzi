//tab切换     动态      视频
$(function() {
	//调用获取个人信息
	findUserInformation(UserName,UserName);
	//可能认识的人
	recommendRosters(UserName);

	$('.dynamic .home').click(function() {
		window.location.href = "/center/me/collect.html";
	});
	//下拉加载动态
	$(".dynamic .professionalCircle").on("click", function() {
		window.location.href = "/center/me/collect.html?type=1"
	})
	
	//加载所有动态
	if(getURIArgs("type") == "") {
		$('.dynamic .home').addClass('list_bg');
		$('.dynamic .home').find(".bg_br").show();
		findIndexTopics(1);
	}
	if(getURIArgs("type") == 1) {
		$('.jiazai').remove();
		$(".dynamic .professionalCircle").addClass('list_bg');
		$(".home").removeClass('list_bg');
		$(".dynamic .professionalCircle").find(".bg_br").show();
		$(".home .bg_br").hide();
		$(".Collect_list").html("");
		getVmcollection(1);
		var page = 1;
		var stop = false; //触发开关，防止多次调用事件 
		$(window).scroll(function(event) {
			var scrollTop = $(this).scrollTop();
			var scrollHeight = $(document).height(); //整个文档的高度
			var windowHeight = $(this).height();
			if(scrollTop + windowHeight + 2 >= scrollHeight) {
				if(stop == true) {
					stop = false;
					$(".collectionVideo").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
					page = page + 1;
					getVmcollection(page);
				}
			}
		})
	}
});