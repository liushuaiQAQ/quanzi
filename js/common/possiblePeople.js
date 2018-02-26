//好友推荐翻页
$(function(){
	$(".main_bottom_ad_next").on("click", function() {
		var li_w = $("#main_bottom_ad>li").width();
		var left = -li_w;
		$("#main_bottom_ad").animate({
			left: left + "px"
		}, function() {
			$("#main_bottom_ad>li").eq(0).appendTo("#main_bottom_ad"); //把第一个LI搬到尾部
			$("#main_bottom_ad").stop().css("left", "0px");
		});

	})
	
	$(".main_bottom_ad_prev").on("click", function() {
		var li_w = $("#main_bottom_ad>li").width();
		var li_length = $("#main_bottom_ad>li").length - 1;
		$("#main_bottom_ad>li").eq(li_length).prependTo("#main_bottom_ad"); //移动前先把最后一个LI搬到UL前面，补齐UL向右移动后前面的缺口
		$("#main_bottom_ad").stop().css("left", -li_w + "px").animate({left: "0px"});
	})
	
	//隐藏
	$(".HideRecommended .hidden").on("click",function  () {
		$(".center_push").fadeOut();
	})
	
	
})