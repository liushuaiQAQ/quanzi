//表情
$(function(){
	//上传照片视频显示隐藏
	$(".fx_photo").on("click", function(event) {
		if(!UserName){
			$(".masks,.viewBox").show();
			return false;
		}
		$(".fx_picture").show();
		$(".fx_picture").siblings().hide();
		$("#SmohanFaceBox").hide();
		event.stopPropagation();
	})
	$(".fx_video").on("click", function(event) {
		if(!UserName){
			$(".masks,.viewBox").show();
			return false;
		}
		$(".videoParent").show();
		$(".videoParent .publish_video").show();
		$(".videoParent").siblings().hide();
		$("#SmohanFaceBox").hide();
		event.stopPropagation();
	})

	
	//选择同步到朋友圈
	$(".InDynamic label").on("click",function  () {
		if($(this).find("input").attr("checked")=="checked"){
			$(this).css("background","url(/img/checkOn.png) no-repeat left center");
			$(this).attr("data-id","1")
		}else{
			$(this).css("background","url(/img/check.png) no-repeat left center");
			$(this).attr("data-id","0")
		}
		
	})
	
	$(".publish_video_b  label").on("click",function  () {
		if($(this).find("input").attr("checked")=="checked"){
			$(this).css("background","url(/img/checkOn.png) no-repeat left center");
			$(this).attr("data-id","1")
		}else{
			$(this).css("background","url(/img/check.png) no-repeat left center");
			$(this).attr("data-id","0")
		}
		
	})

})