//发布
$(document).on("click", ".publish_btn", function() {
	if(!getCookie("username")){
		$(".masks,.viewBox").show();
		e.stopPropagation();
		return false;
	}
	$(".postCategory,#maskss").show();
	getlist_info();
});
//分类
$(document).on("click", ".cate_mainmenu_r li", function() {
	var parent_id = $(".cate_mainmenu_l li.active").attr("data-id");
	//	var parent_txt = $(".cate_mainmenu_l li.active span").html();
	var child_txt = $(this).find("a").html();
	window.location.href = "/shangcheng/publish/index.html?typeId=" + parent_id + "&className=" + child_txt;

});
$(document).on("click", ".z_close", function() {
	$(".postCategory,#maskss").hide();
});


function getlist_info() {
	$.ajax({
		type: "post",
		headers: {
			"token": qz_token()
		},
		url: serviceHOST() + "/tcProduct/selectTcProductType.do",
		dataType: "json",
		success: function(msg) {
			if(msg.status==0){
				getClass_do(msg);
			}else if(msg.status==-3){
				getToken();
				
			}
			
		}
	});
};

function getClass_do(msg) {
	getClass_l(msg);
	getClass_r(msg, 0);
	$(document).on("mouseenter", ".cate_mainmenu_l li", function() {
		var index = $(this).attr("data-index");
		$(this).addClass("active").siblings("li").removeClass("active");
		getClass_r(msg, index);
	})

}

function getClass_l(msg) {
	var str = "";
	for(var i = 0; i < msg.data.length; i++) {
		str += '<li data-index=' + i + ' data-id=' + msg.data[i].id + '><span>' + msg.data[i].classname + '</span><i></i></li>'
	}
	$(".cate_mainmenu_l").html(str);
	$(".cate_mainmenu_l li").eq(0).addClass("active");
}

function getClass_r(msg, D) {
	var str = "";
	var msg_list = msg.data[D];
	for(var i = 0; i < msg_list.subTcProductTypes.length; i++) {
		var cur = msg_list.subTcProductTypes[i];
		str += '<li><a href="javascript:;">' + cur.classname + '</a></li>'
	}
	$(".cate_mainmenu_r ul").html(str);
};