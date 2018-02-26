$(function(){
	// 判断会员
	if (getCookie("headImgkz") != ""&&getCookie("headImgkz")!=undefined) {
		if (getCookie("headImgkz").indexOf("http") > -1) {
			$(".top_message dt img").attr("src", getCookie("headImgkz"));
		} else {
			var srcImg = ImgHOST() + getCookie("headImgkz")
			$(".top_message dt img").attr("src", srcImg);
		}
	} else {
		$(".top_message dt img").attr("src", "/img/first.png");
	}

	$(".top_message .nickname").html(($.trim(getCookie("nickname")) == "" ? shieldNumber(UserName) : getCookie("nickname")));
	$(".top_message .yh_profession span").html(getCookie("myindustry"));




	var Vlevel = getCookie("viplevel");
	if(Vlevel != 0 && Vlevel != ""){
		$(".presentPrivilege").show();
		$(".top_message .nickname").html('<span style="color:red;">'+ getCookie("nickname") +'</span>');
		$(".top_message .viplevel").html("<img src='/img/h/sj_VIP_"+ Vlevel +".png'/>")
		$(".top_message .ktVip").addClass("renew").html("续费");
		$(".top_message .yellow").html("");
		leaguerGetlevels();
	}else{
		$(".domesticConsumer").show();
	}



	//点击开通会员 || 续费
	$(document).on("click",".ktVip",function(){
		if($(".top_message .ktVip").hasClass("renew")){
			window.location.href = "/center/buy.html?type=1&v="+Vlevel;
		}else{
			window.location.href = "/center/buy.html";
		}
	})


	//用戶等级特权
	function leaguerGetlevels(){
		$.ajax({
			type:"get",
			url: serviceHOST() + "/utils/leaguerGetlevels.do",
			data:{
				"username":UserName
			},
			headers: {
				"token": qz_token()
			},
			dataType:"json",
			success:function(msg){
				if(msg.status==0){
					var level=Number(msg.data.level)     //获取等级级别
					var vipLevel=msg.data.viplevel;      //获取vip等级
					$(".presentPrivilege .level").html("Lv" + level);
					$(".presentPrivilege .viplevel").html("VIP" + vipLevel);

					//用户等级
					var jr_level_01,jr_level_02,jr_level_03,jr_level_04;
					if(level <= 2){
						jr_level_01 = 2;
						jr_level_02 = 1;
						jr_level_03 = 4;
						jr_level_04 = 2;
					}else if(level > 2 && level <= 5){
						jr_level_01 = 2;
						jr_level_02 = 1;
						jr_level_03 = 4;
						jr_level_04 = 3;
					}else if(level > 5 && level <= 10){
						jr_level_01 = 2;
						jr_level_02 = 1;
						jr_level_03 = 4;
						jr_level_04 = 4;
					}else if(level > 10){
						jr_level_01 = 2;
						jr_level_02 = 1;
						jr_level_03 = 4;
						jr_level_04 = 5;
					}

					$(".zyq_fl .jr_level_01").html(jr_level_01);
					$(".zmt_fl .jr_level_02").html(jr_level_02);
					$(".fb_cs .jr_level_03").html(jr_level_03);
					$(".wz_ps .jr_level_04").html(jr_level_04);



					//vip 等级
					var jr_viplevel_01,jr_viplevel_02,jr_viplevel_03,jr_viplevel_04;
					switch(vipLevel) {
						case 1:
							jr_viplevel_01 = 1;
							jr_viplevel_02 = 1;
							jr_viplevel_03 = 1;
							jr_viplevel_04 = 2;	
							break;
						case 2:
							jr_viplevel_01 = 2;
							jr_viplevel_02 = 3;
							jr_viplevel_03 = 2;
							jr_viplevel_04 = 4;
							break;
						case 3:
							jr_viplevel_01 = 3;
							jr_viplevel_02 = 5;
							jr_viplevel_03 = 3;
							jr_viplevel_04 = 6;
							break;
						default:
							break;
					}
					$(".zyq_fl .jr_viplevel_01").html('+' + jr_viplevel_01);
					$(".zmt_fl .jr_viplevel_02").html('+' + jr_viplevel_02);
					$(".fb_cs .jr_viplevel_03").html('+' + jr_viplevel_03);
					$(".wz_ps .jr_viplevel_04").html('+' + jr_viplevel_04);

					$(".zyq_fl .total").html(jr_level_01 + jr_viplevel_01);
					$(".zmt_fl .total").html(jr_level_02 + jr_viplevel_02);
					$(".fb_cs .total").html(jr_level_03 + jr_viplevel_03);
					$(".wz_ps .total").html(jr_level_04 + jr_viplevel_04);
					
				}
			},
			error:function(){
				console.log("err");
			}
		});
	}

	


})