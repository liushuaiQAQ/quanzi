$(function(){
	//修改密码
	$(".main_right input").on("keyup",function(){
		$(this).css("border-color","#a8a8a8");
		$(this).siblings(".pointWord").hide();
	});
	$(".main_right input").on("focus", function() {
		$(this).parents(".commonDiv ").siblings(".commonDiv").find(".pointWord").hide();
		$(this).parents(".commonDiv ").siblings(".commonDiv").find('input').css("border-color", "#ddd")
	})
	/**************修改密码第三方开始******************/
	
	//	判断是否是第三方登录
	if(getCookie("username").indexOf("wx_")==0||getCookie("username").indexOf("qq_uid_")==0||getCookie("username").indexOf("xl_")==0){  //判断用户名开头字符串是不是第三方账号
		$(".current_password").hide();
		$(".third_login").show();
		//头像和昵称
		if(getCookie("headImgkz")!="") {
			if(getCookie("headImgkz").indexOf("http") > -1) { 
				$(".headI img").attr("src",getCookie("headImgkz"));
			} else {
				var srcImg = ImgHOST() + getCookie("headImgkz")
				$(".headI img").attr("src", srcImg);
			}
		}else {
			$(".headI img").attr("src", "/img/first.png");
		}
		$(".nicksN").html(getCookie("nickname"));
		$(".accNum").html(getCookie("magicnos"));
	}else if(getCookie("isphonelog")==1){       //短信登录标记
		$(".current_password").hide();
		$(".third_login").hide();
	}else{
		$(".current_password").show();
		$(".third_login").hide();
	}
	//	第三方账号验证
	$(document).on('click',".testBtn",function(){
		im.loadingOn();
		setTimeout(function(){
			im.loadingOff();
			$(".wordT").html("验证成功");
		},1000)
	});
	
	/**************修改密码第三方结束******************/
	//密码加密接口
	var pawjiami="";
	function getPasjiami(datas){
		$.ajax({
				type:"post",
				url:serHOST()+"/utils/encryption.do",
				data:datas,
			 	async:false,
				success:function(msg){
					pawjiami=msg;
				},
				error:function(){
					console.log("error");
				}
			});
	}
	$(".save button").on("click",function(){
		var curPass=$.trim(html2Escape($("#current_password").val()));     //当前密码
		var newPass=$.trim(html2Escape($("#new_password").val()));        //新密码
		var conPass=$.trim(html2Escape($("#confirm_password").val()));     //确认密码
		var reg = /^[0-9a-zA-Z]*$/g;
		if(!$(".current_password").is(":hidden")){
			if(curPass==""){
				$(".pointW1").show();
				$("#current_password").css("border-color","#ff1f05");
				return false;
			}
		};
		if(!$(".third_login").is(":hidden")&&$(".wordT").html()!="验证成功"){
			friendlyErrsMsg("验证失败，请先验证");
			return false;
		}
		if(newPass==""){
			$(".pointW2").show();
			$("#new_password").css("border-color","#ff1f05");
			return false;
		}else if(newPass.length<6){
			$(".pointW2").html("密码不能小于6位").show();
			$("#new_password").css("border-color","#ff1f05");
			return false;
		}else if(newPass.length>20){
			$(".pointW2").html("密码不能大于20位").show();
			$("#new_password").css("border-color","#ff1f05");
			return false;
		}else if(!reg.test(newPass)){
			$(".pointW2").html("密码只能是数字和字母").show();
			$("#new_password").css("border-color","#ff1f05");
			return false;
		}
		if(conPass==""){
			$(".pointW3").show();
			$("#confirm_password").css("border-color","#ff1f05");
			return false;
		}
		if(!$(".current_password").is(":hidden")){
			//console.log("111")
			changePassword({
				username:UserName,
				oldpwd:curPass,
				newpwd:newPass,
				confirmpwd:conPass
			})
		}else{   //第三方的登录修改密码接口
			if(conPass!=newPass){
				$(".pointW2").html("新密码输入不一致").show();
				$("#new_password").css("border-color","#ff1f05");
				return false;	
			}
			changePasswordThird({
				"username":UserName,
				"password":conPass
			})
		}	
	})


	//修改密码接口           注册圈子号
	function changePassword(datas){
		$.ajax({
			type:"post",
			url:serviceHOST()+"/user/changePassword.do",
			dataType:"json",
			headers: {
				"token": qz_token()
			},
			data:datas,
			success:function(msg){
				if(msg.status==0){
					friendlyMessage("修改密码成功",function(){
						location.reload();
					})
				}else if(msg.status == -1){
					if(msg.data == 1){
						$(".pointW1").html("当前密码有误").show();
						$("#current_password").css("border-color","#ff1f05");
						return false;
					}else{
						$(".pointW2").html("新密码输入不一致").show();
						$("#new_password").css("border-color","#ff1f05");
						return false;
					}
				}else if(msg.status == -2){
					$(".pointW2").html("新密码与旧密码不能相同").show();
					$("#new_password").css("border-color","#ff1f05");
				}else if(msg.status==-3){
					getToken();
				};
				
			},
			error:function(){
				console.log("error");
			}
		});
	}
	//	第三方登录修改密码接口
	function changePasswordThird(datas){
		$.ajax({
			type:"post",
			url:serviceHOST()+"/user/thirdUserSetPassword.do",
			dataType:"json",
			headers: {
				"token": qz_token()
			},
			data:datas,
			success:function(msg){
				if(msg.status==0){
					friendlyMessage("修改密码成功",function(){
						//location.reload();
					})
				}else if(msg.status==-3){
					getToken();
				};
			},
			error:function(){
				console.log("error");
			}
		});
	}
	
	//忘记密码  找回密码
	$(".current_password a").on("click",function(){
		$(".masks,.viewpasswordBox").show();
	})
	$(".errors").on("click",function(){
		$(".masks,.viewpasswordBox").hide();
	})
	
	$(".get-code").on("click", function() {
		if(!getCookie("keys")){
			addCookIe();
		}
		getCode($(this));
	})
//获取验证码接口
	var phone ="";     //手机号
	var code="";      //验证码
	function getphoneCode(){
		im.loadingOn();
		$.ajax({
			url: serviceHOST() + "/checkUser/sendPhoneMsg.do",
			type: 'post',
			data:{
				"phnum":phone,
				"smeth":2,                //0表示注册使用，1表示登录使用该接口，2表示重置密码使用
				"random":getCookie("keys")
			},
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				im.loadingOff();
				if(msg.status==0){
					if(msg.data=="M"){
						$(".point3").show()
						$(".point3 p").text("稍等片刻，才能再次发送");
						$("#phone2").css("border","1px solid #f9533d");
					}else if(msg.data==0){
						friendlyMess("验证码发送成功")
						resetCode(); //倒计时
					}
				}else if(msg.status == -1){
					friendlyMess("验证码获取失败，请再次点击获取","Y")
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log('error!');
			}
		});
	}	
/*得到验证码*/
	var isPhone = 1;
	function getCode(e) {
		checkPhone(); //验证手机号码
		if(isPhone) {
			getphoneCode()
		} else {
			$('#phone2').focus();
		}

	}
/******验证手机号********/
	function checkPhone() {
		var pattern = /^1[34578]\d{9}$/;
		phone=$.trim(html2Escape($('#phone2').val()));
		isPhone = 1;
		if(phone == '') {
			$(".point3 p").text("请输入手机号码");
			$(".point3").show();
			$("#phone2").css("border","1px solid #f9533d");
			isPhone = 0;
			return false;
		}
		if(!pattern.test(phone)) {
			$(".point3 p").text("手机号有误");
			$(".point3").show();
			$("#phone2").css("border","1px solid #f9533d")
			isPhone = 0;
			return false;
		}
	}
/**************验证码倒计时********************/
	function resetCode() {
		$('.identifyingCode').css("display", "none");
		$('#J_second').html('60');
		$('#J_resetCode').show();
		//		$(".point2").hide();
		var second = 60;
		var timer = null;
		timer = setInterval(function() {
			second -= 1;
			if(second > 0) {
				$('#J_second').html(second);
			} else {
				clearInterval(timer);
				$('.identifyingCode').show();
				$('#J_resetCode').hide();
			}
		}, 1000);
	}
	//	验证发送的验证码正确与否
	var codeStatus="";
	function  checkCode(){
		phone=$.trim(html2Escape($('#phone2').val()));
		code=$.trim(html2Escape($("#code2").val())); 
		checkPhone();
		im.loadingOn()
		$.ajax({
			url: serviceHOST() + "/checkUser/checkPhoneMsg.do",
			type: 'post',
			async:false,
			data:{
				"phnum":phone,
				"code":code
			},
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				im.loadingOff()
				if(msg.status==0){ 
					codeStatus=msg.data;
					
				}else if(msg.status==-1){
					codeStatus=3;
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log('error!');
			}
		});
	}
	//找回密码
	$(".passwordLogin input").on("keyup",function(){
		$(this).css("border-color","#a8a8a8");
		$(this).parent("li").find(".commontit").hide();
		
	});
	$(".clickLogin_end").on('click',function(){
		phone2=$.trim(html2Escape($("#phone2").val()));
		code2=$.trim(html2Escape($("#code2").val()));
		var password01=$.trim(html2Escape($("#password01").val()));
		var password02=$.trim(html2Escape($("#password02").val()));
		var reg = /^[0-9a-zA-Z]*$/g;
		checkPhone()      //校验手机号
		if(isPhone==0){
			return false;
		}
		if(!code2){
			$(".point4 p").text("请输入验证码");
			$(".point4").show()
			$("#code2").css("border","1px solid #f9533d");
			return false;
		}else{
			checkCode();
			console.log(codeStatus)
			if(codeStatus==-1){      //-1 错误   -2 过期      否则正确
						$(".point4").show()
						$(".point4 p").text("验证码有误");
						$("#code2").css("border","1px solid #f9533d");
						return false;
					}else if(codeStatus==-2){
						$(".point4").show()
						$(".point4 p").text("验证码已过期");
						$("#code2").css("border","1px solid #f9533d");
						return false;
					}else if(codeStatus==3){
					$(".point4").show()
					$(".point4 p").text("验证码异常");
					$("#code2").css("border","1px solid #f9533d");
					return false;
				}
		}
		if(!password01){
			$(".point5 p").text("请设置新密码");
			$(".point5").show()
			$("#password01").css("border","1px solid #f9533d");
			return false;
		}else{
				if(!reg.test(password01)){
					$(".point5").show();
					$(".point5 p").text("密码只能是数字和字母");
					$("#password01").css("border","1px solid #f9533d");
					return false;
				}
				if(password01.length < 6){
					$(".point5").show();
					$(".point5 p").text("密码不能少于6位");
					$("#password01").css("border","1px solid #f9533d");
					return false;
				};
				if(password01.length>20){
					$(".point5").show();
					$(".point5 p").text("密码不能大于20位");
					$("#password01").css("border","1px solid #f9533d");
					return false;
				}
				if(!password02){
					$(".point6 p").text("请输入确认密码");
					$(".point6").show()
					$("#password02").css("border","1px solid #f9533d");
					return false;
				}
		};
		if(password02!=password01){
			$(".point6").show();
			$(".point6 p").text("二次密码输入不一致");
			$("#password02").css("border","1px solid #f9533d");
			return false;
		}
		getPasjiami({                //密码加密
				"paw":password02,
				"code":code2
			})
		//忘记密码重置密码接口
		im.loadingOn()
		$.ajax({
			type:"post",
			url:serviceHOST() + "/user/chmodpwd.do",
			dataType:"json",
			headers: {
				"token": qz_token()
			},
			data:{
				"username":phone2,
				"password":pawjiami,
				"code":code2
			},
			success:function(msg){
				im.loadingOff()
				if(msg.status==0){
					if(msg.data==1){
						friendlyMess(msg.info,"",function(){
							$(".masks,.viewpasswordBox").hide();
							location.reload()
						});
					}
				}else if(msg.status==-1){
					$(".point3 p").text("用户名错误");
					$(".point3").show()
					$("#phone2").css("border","1px solid #f9533d");
				}else if(msg.status==-3){
					getToken();
				};
			},
			error:function(){
				console.log("error");
			}
		});
	})
	
})