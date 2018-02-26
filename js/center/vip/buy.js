$(function(){

	//选中
	$(".buy_center dd").on("click",function(){
		$(this).parents("dl").find("dd").removeClass("designate");
		$(this).addClass("designate");

		var serve = $(".serve dd").hasClass("designate");
		var duration = $(".duration dd").hasClass("designate");
		var buyManner = $(".buyManner dd").hasClass("designate");

		//选中之后显示金额
		if(serve && duration && buyManner){
			var v = $(".serve .designate").attr("data-v");
			var y = $(".duration .designate").attr("data-y");
			paymentAmount(Number(v),Number(y));
			$(".btn_primary .btn_buy").addClass("buy_confirm");

			//购买会员等级不能低于本身会员等级
			if(getURIArgs("v") > Number(v) + 1){
				$(".buy_center .explain").html("说明:当前会员尚未到期,无法转为低级别会员。");
			}
//			else{
//				$(".buy_center .explain").html("说明:支付成功后,您的会员期限将延长至2017年9月1日。");
//			}
		}
	})


	//协议
	$(".buy_b_xy").on("click",function(event){
		$(".main_vip").fadeIn(200);
		$("body").css("overflow","hidden");
		event.stopPropagation();
	})
	$(".main_vip .del").on("click",function(){
		$(".main_vip").fadeOut(200);
		$("body").css("overflow","auto");
	})
	$(document).on("click",function(event){
		$(".main_vip").fadeOut(200);
		$("body").css("overflow","auto");
		event.stopPropagation();
	})

	//判断开通 || 续费
	if(getURIArgs("type") == 1){
		$(".buy_center h3").html("会员续费");
	}





	// 计算支付金额
	// v: 0,10,20  
	// y: 1,3,6,12
	function paymentAmount(v,y){
		var pay;
		switch(v + y) {
			case 1:
				pay = 10;
				break;
			case 3:
				pay = 27;
				break;
			case 6:
				pay = 50;
				break;
			case 12:
				pay = 95;
				break;
			case 11:
				pay = 15;
				break;
			case 13:
				pay = 40;
				break;
			case 16:
				pay = 75;
				break;
			case 22:
				pay = 145;
				break;
			case 21:
				pay = 20;
				break;
			case 23:
				pay = 55;
				break;
			case 26:
				pay = 100;
				break;
			case 32:
				pay = 190;
				break;
			default:
				break;
		}
		$(".buy_center .money").html(pay);
	}



	//确认支付
	var  pays={
		widbody:"",         //商品描述
		widoutTradeNo:"",   //订单编号
		widsubject:"",      //订单名称
		widtotalAmount:""   //付款金额
	}
	$(document).on("click",".btn_primary .buy_confirm",function(){
		var mouthtime=$(".duration").find(".designate").attr("data-y");     //开通时长
		var vipClass=$(".serve").find(".designate").attr("data-vip");      //开通vip等级
		var paytype=$(".buyManner").find(".designate").attr("data-t");   //0未选择   1支付宝 2微信  3其他
		$.ajax({
			type:"post",
			url:serviceHOST()+"/pay/createOrder.do",
//			dataType:"json",
			headers: {
				"token": qz_token()
			},
			data:{
				username:getCookie("username"),
				viptype:vipClass,
				time:mouthtime,
				paytype:paytype
			},
			success:function(msg){
				if(msg.status==0){
					pays.widbody=msg.data.widbody;
					pays.widoutTradeNo=msg.data.widoutTradeNo;
					pays.widsubject=msg.data.widsubject;
					pays.widtotalAmount=msg.data.widtotalAmount;
					setCookie("widoutTradeNo",pays.widoutTradeNo,24 * 60);
					if(paytype==1){    //支付宝扫描
//						requestAlipay({
//							username:getCookie("username"),     //用户名
//							widoutTradeNo:widoutTradeNo,        //订单编号
//							widsubject:widsubject,              //订单名称
//							widtotalAmount:widtotalAmount,      //付款金额
//							widbody:widbody                     //商品描述
//						},"/pay/requestALIpay.do");
		window.location.href=serviceHOST()+"/pay/requestALIpay.do?username="+getCookie("username")+'&widoutTradeNo='+pays.widoutTradeNo+'&widsubject='+pays.widsubject+'&widtotalAmount='+pays.widtotalAmount+'&widbody='+pays.widbody;
					}else{          //微信扫描
						requestAlipay({
							username:getCookie("username"),
							widoutTradeNo:pays.widoutTradeNo,
							widsubject:pays.widsubject,
							widtotalAmount:pays.widtotalAmount,
							widbody:pays.widbody
						},"/pay/requestWXpay.do");
						
					}
				}else if(msg.status==-3){
					getToken();
				};
			},
			error:function(){
				console.log("error");
			}
		});
	});
	
	//请求扫描支付    获取微信二维码接口
	var closeT = "";      //定时器变量
	function requestAlipay(datas,urls){
		$.ajax({
			type:"post",
			url:serviceHOST()+urls,
			dataType:"json",
			headers: {
				"token": qz_token()
			},
			data:datas,
			success:function(msg){
				if(msg.status==-3){
					getToken();
				}else if(msg.status==-2){
					warningMessage("系统错误，请重新支付");
				}else if(msg.status==0){
					$("#payBg,#pay_wechat").show();
					$("#pay_wechat .imgBox img").attr("src",msg.data);
					clearInterval(closeT);
					//微信扫码监听
					closeT = setInterval(function(){ //校验验证码  
						WXdoOrderQuery({
							widoutTradeNo:datas.widoutTradeNo
						})
					}, 5000);
				}
			},
			error:function(){
				console.log("error");
			}
		});
	};
	//	微信支付扫描监听接口
	function WXdoOrderQuery(datas){
		$.ajax({
			type:"post",
			url:serviceHOST()+"/pay/doOrderQuery.do",
			headers: {
				"token": qz_token()
			},
			data:datas,
			success:function(msg){
				if(msg.status==0){      //0 支付成功   1查询中  -2支付失败
					$("#payBg,#pay_wechat").hide();
					friendlyMessage("您已开通会员成功",function(){
						clearInterval(closeT);
						getinfoViplevel({     //获取vip等级
							username:getCookie("username"),
							widoutTradeNo:getCookie("widoutTradeNo"),
							isaliOrwx:2       //2是微信
						})
			
					},3000);
				}else if(msg.status==-2){
					$("#payBg,#pay_wechat").hide();
					clearInterval(closeT);
					warningMessage("支付失败，请重新支付",function(){
						location.reload();
					});
				}
			},
			error:function(){
				$("#payBg,#pay_wechat").hide();
				warningMessage("支付失败");
				clearInterval(closeT);
			}
		});
	};
	//	获取支付成功后的会员等级
	function getinfoViplevel(datas){
		$.ajax({
			type:"post",
			url:serviceHOST()+"/pay/getbuyviplevel.do",
			headers: {
				"token": qz_token()
			},
			data:datas,
			success:function(msg){
				if(msg.status==0){      //0 支付成功  -1失败  
					setCookie("viplevel",msg.data.viplevel,24 * 60);
					window.location.href="/center/vipCentre.html"
				}else if(msg.status==-1){
					warningMessage("系统错误");
				}
			},
			error:function(){
				warningMessage("获取等级失败");
			}
		});
	}
	
	//支付宝成功后的成功提示  在路径上加一个参数
	if(getURIArgs("types")==1){
		friendlyMessage("您已开通会员成功",function(){
			getinfoViplevel({
				username:getCookie("username"),
				widoutTradeNo:getCookie("widoutTradeNo"),        //订单编号
				isaliOrwx:1      //1是支付宝
			});
		},3000);
	};
	
	//微信支付弹窗差号点击去除
	$(document).on("click","#pay_wechat .hideBtn",function(){
		clearInterval(closeT);   //关掉监听
		$("#payBg,#pay_wechat").hide();
	})

})