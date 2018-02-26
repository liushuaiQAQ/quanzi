$(function() {
	var prdObj = {
		"occupation": {
			"type": 1,
			"text": "招聘"
		},
		"rent": {
			"type": 2,
			"text": "租房"
		},
		"secondPrd": {
			"type": 3,
			"text": "二手"
		},
		"housekeep": {
			"type": 4,
			"text": "家政"
		},
		"businessService": {
			"type": 5,
			"text": "商务服务"
		}
	}
	if(location.href.indexOf("hot.html") < 0) {
		var hotType = location.href.split("prd/")[1].split(".html")[0];
		$.ajax({
			type: "post",
			url: serviceHOST() + "/tcProduct/selectTcProductType.do",
			headers: {
				"token": qz_token()
			},
			data: {
				type: prdObj[hotType].type
			},
			dataType: "json",
			success: function(msg) {
				//热词
				hotWord(msg.data[0].subTcProductTypes, hotType);

			},
			error: function() {
				console.log("error")
			}

		});
	}

	//热门商品
	$.ajax({
		type: "post",
		url: serviceHOST() + "/tcProduct/tcHotProduct.do",
		headers: {
			"token": qz_token()
		},
		data: formatJson({
			pageSize:6,
			myname:getCookie("username")||""
		}),
		async:false,
		dataType: "json",
		success: function(msg) {
			if(msg.status==0){
				if(msg.data[0]){
			        hotPrd(msg);
                    $(".hot_prd").slide({
						mainCell: ".hot_prd_list ul",
						autoPlay: true,
						autoPage: true,
						effect: "leftLoop",
						vis: 1,
						autoPlay: true,
						delayTime: 1000,
						interTime: 3000
					});
					for(var i=0; i < $(".hot_prd_list li").length; i+=1){
						//console.log(i)
						var imgWidth = $(".hot_prd_list li:eq("+i+") img").width();
						var imgHeight = $(".hot_prd_list li:eq("+i+") img").height();
						//console.log($(".hot_prd_list li:eq("+i+") img").width())
						//console.log($(".hot_prd_list li:eq("+i+") img").height())
						if(imgWidth<imgHeight){
							$(".hot_prd_list li:eq("+i+") img").css("width","100%")
						}else if(imgWidth>imgHeight){
							$(".hot_prd_list li:eq("+i+") img").css("height","100%")
						}else{
							$(".hot_prd_list li:eq("+i+") img").css("width","100%")
							$(".hot_prd_list li:eq("+i+") img").css("height","100%")
						}
					}
				}else{
					$(".hot_prd_list ul").html("暂无相关商品。").css("textAlign","center")
				}
			}
        },
		error: function() {
			console.log("error")
		}

	});
	var mores = '<li class="showmore">展开更多<span><img src="/img/zyq_zhankuaigengduo.png" alt=""></span></li>';
	var lesss = '<li class="showless">收起全部<span><img src="/img/zyq_shouqiquanbu.png" alt=""></span></li>';

	//点击展开更多
	$(document).on("click", ".showmore", function() {
		$(this).hide();
		$(".hot_word ul").find(".showless").remove();
		$(".hot_word ul").append(lesss);
		$(".hot_word ul").find(".showmore").nextAll().show();
		$(".showless").show();
	});
	//点击收起全部
	$(document).on("click", ".showless", function() {
		$(".hot_word ul").find(".showmore").nextAll().hide();
		$(".showmore").show();
		$(".showless").hide();
	})

	//会员专区
	$(".vip_space a").click(function(){
		if(!getCookie("username")){
			$(".masks,.viewBox").show();
		    e.stopPropagation();
			return false;
		}
		window.location.href="/center/vipCentre.html";
	})
	function hotWord(msg, type) {
		var str = "";
		str += '<div class="hot_word">' +
			'<p>' + prdObj[type].text + '热词</p>' +
			'<ul>';
		for(var i = 0; i < msg.length; i++) {
			str += '<li><a href="/shangcheng/prd/' + type + '.html?keyWord=' + msg[i].classname + '">' + msg[i].classname + '</a></li>';
		}
		str += '</ul>' +
			'</div>';
		$(".list_right").prepend(str);
		if(type == "occupation") {
			$(".hot_word li").eq(12).after(mores);
			$(".hot_word").find(".showmore").nextAll().hide();
		}
	}

	function hotPrd(msg) {
		var str = "";
		msg=msg.data;
		for(var i in msg){
			str +='<li>'
				+'<a href="/center/shopDetails.html?id='+msg[i].tcProduct.id+'">'
				+'<div class="img_box">'
				+'<img src="'+ImgHOST()+msg[i].tcProduct.imagepath[0]+'"  alt="圈子商城" />'
				+'</div>'
				+'<p>'+msg[i].tcProduct.title+'</p>'
				+'</a>'
				+'</li>';
		}
		$(".hot_prd_list ul").html(str);
		
	}

})

	