$(function() {
	var base = new Base64();
	/************************登录******************************/
	$(".login_right input").on("keyup", function() {
		$(this).parents("div").css("border-color", "#ddd");
		$(this).siblings(".warn").hide();
	});
	$(".login_right input").on("focus", function() {
		$(this).parent("div").siblings().find(".warn").hide();
		$(this).parent("div").siblings().css("border-color", "#ddd")
	})
	$(".login_r_t .msgLogin input").on("keyup", function() {
		$(this).css("border-color", "#ddd");
		$(this).siblings(".warn1").hide();
	});
	$(".login_r_t .msgLogin input").on("focus", function() {
			$(this).parent("li").siblings().find(".warn1").hide();
			$(this).parent("li").siblings().find("input").css("border-color", "#ddd")
		})
		/*首页右侧登录************/
	$(".right_login").on('click', function() {
		var _this = $(this);
		var phoneNum = $.trim(html2Escape($(".login_phone input").val()));
		var passWordss = $.trim(html2Escape($(".login_password input").val()));
		var result = base.encode(passWordss);
		if (phoneNum == "" || passWordss == "") {
			$(this).parents(".login_right").find(".point1").show();
			$(".login_phone").css("border", "1px solid #f9533d");
		} else {
			var params = {
				username: phoneNum,
				password: passWordss
			};
			var par = $.param(params);
			$.ajax({
				type: "post",
				url: serviceHOST() + "/user/login.do?" + par,
				headers: {
					"token": qz_token()
				},
				success: function(jsons) {
					if (jsons.status == 0) {
						if (jsons.data.avatarfile == "" || jsons.data.avatarfile == undefined) {
							setCookie("headImgkz", "", 24 * 60); //头像
						} else {
							setCookie("headImgkz", jsons.data.avatarfile, 24 * 60); //头像	     不传默认是30分钟        24*60带表示一天
						}
						setCookie("xmpp_key", result, 24 * 60); //存储密码
						setCookie("magicnos", jsons.data.magicno, 24 * 60) //圈子号
						setCookie("nickname", jsons.data.nickname, 24 * 60) //昵称
						setCookie("username", jsons.data.username, 24 * 60) //用户名
						setCookie("myindustry", jsons.data.myindustry, 24 * 60) //用户职业
						setCookie("viplevel", jsons.data.viplevel, 24 * 60) //会员等级
						rememberUseInf(); //记住账号和密码  自动登录
						window.location.href = "/center/index.html";
					} else if (jsons.status == 404 || jsons.status == -1) { //-1用户名或密码错误
						var jsonsUnes = unescape(jsons.info)
						_this.parents(".login_right").find(".point1").show().find("p").html(jsonsUnes);
						$(".login_phone").css("border", "1px solid #f9533d");
					} else if (jsons.status == -3) {
						getToken();
					};


				},
				error: function() {
					console.log("error")
				}
			});
		};
	});
	// 键盘回车自动提交
	$(".login_phone input,.login_password input").keydown(function(e) {
		var curKey = e ? e.keyCode : e.which;
		if (curKey == 13) {
			$(".login_r_t input").blur();
			$(".right_login").click();
			return false;
		}
	});
	//自动登录
	$(document).on("click", ".login_z_w label span", function() {
		$(this).toggleClass("on");
	});
	//设定用户名、密码cookie
	function rememberUseInf() {
		if ($('.login_z_w label span').hasClass('on')) {
			setCookie("phoneOrmagicno", $(".login_phone input").val(), 30 * 24 * 60); //存储账号
			//setCookie("passwordS",$(".login_password input").val(),30*24*60);       //存储密码
		} else {
			clearCookie("phoneOrmagicno");
			//clearCookie("passwordS");
		};
	};
	//cookie 存储账号和密码
	getUserInf();

	function getUserInf() {
		if (getCookie("phoneOrmagicno")) {
			$(".login_phone input").val(getCookie("phoneOrmagicno"));
			$(".login_password input").val(getCookie("passwordS"));
			$('.login_z_w label span').addClass('on');
		};
	};

	//	手机号登录 短信快捷登录点击
	$(document).on("click", ".quickLogin", function() {
		$(".login_r_t .login_right input").val("");
		$(".login_r_t .login_right .login_phone").css("border", "1px solid #ddd");
		$(".login_r_t .point1").hide();
		$('.login_right').hide();
		$(".login_r_t .msgBox").show();
	});

	$(document).on("click", ".login_r_t .accpsdLogin span", function() {
			$(".login_r_t .msgLogin input").val("");
			$(".login_r_t .msgLogin input").css("border", "1px solid #ddd");
			$(".login_r_t .point9").hide();
			$('.login_r_t .login_right').show();
			$(".login_r_t .msgBox").hide();
		})
		//短信登录接口调取

	$(document).on('click', ".login_r_t .clickLoginbtn", function() {
		var telNum = $.trim(html2Escape($("#telPhones2").val())); //手机号
		var dynamicpsd = $.trim(html2Escape($("#dynamicpsd2").val())); //动态密码
		var pattern = /^1[34578]\d{9}$/;
		if (telNum == "" || dynamicpsd == "") {
			$(this).parents(".telphoneLogin").find(".point9").show();
			$(".login_r_t .point9 p").text("请输入手机号/动态密码");
			$(".login_r_t .phoneli input").css("border", "1px solid #f9533d");
		} else {
			if (!pattern.test(telNum)) {
				$(".login_r_t .point9 p").text("请输入正确手机号");
				$(".login_r_t .point9").show();
				$("#telPhones2").css("border", "1px solid #f9533d")
			} else {
				LoginByPhone({
					phnum: telNum,
					code: dynamicpsd
				})
			}
		}

	})

	function LoginByPhone(datas) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/user/checkPhoneCodeAndLoginByPhone.do", //短信登录接口
			data: datas,
			headers: {
				"token": qz_token()
			},
			success: function(jsons) {
				if (jsons.status == 0) {
					setCookie("headImgkz", jsons.data.avatarfile, 24 * 60); //头像
					setCookie("magicnos", jsons.data.user.magicno, 24 * 60) //圈子号
					setCookie("nickname", jsons.data.user.nickname, 24 * 60) //昵称
					setCookie("username", jsons.data.user.username, 24 * 60) //用户名
					setCookie("myindustry", jsons.data.user.myindustry, 24 * 60) //用户职业
					setCookie("viplevel", jsons.data.viplevel, 24 * 60) //会员等级
					setCookie("isphonelog",jsons.data.isphonelog, 24 * 60) //短信登录标记字段
					getmimi2({
						"username":jsons.data.user.username
					},base);
				} else if (jsons.status == -1) {
					$(".login_r_t .point9 p").text("动态密码错误");
					$(".login_r_t .point9").show();
					$("#telPhones2").css("border", "1px solid #f9533d");
					return false;
				} else if (jsons.status == -2) {
					$(".login_r_t .point9 p").text("动态密码超时");
					$(".login_r_t .point9").show();
					$("#telPhones2").css("border", "1px solid #f9533d");
					return false;
				} else if (joins.status == -3) {
					getToken();
				};
			},
			error: function() {
				console.log('error');
			}
		});
	};


	//获取动态密码开始
	$(".login_r_t .get-code2").on("click", function() {
		if (!getCookie("keys")) {
			addCookIe();
		};
		getCode3($(this));
	})


	/*得到验证码*/

	var isPhone2 = 1;

	function getCode3(e) {
		checkPhone2(); //验证手机号码
		if (isPhone2) {
			getphoneCode3()
		} else {
			$('#telPhones2').focus();
		}
	}
	/******验证手机号********/
	function checkPhone2() {
		var pattern = /^1[34578]\d{9}$/;
		phone2 = $.trim(html2Escape($('#telPhones2').val()));
		isPhone2 = 1;
		if (phone2 == '') {
			$(".login_r_t .point9 p").text("请输入手机号码");
			$(".login_r_t .point9").show()
			$("#telPhones2").css("border", "1px solid #f9533d");
			isPhone2 = 0;
			return false;
		}
		if (!pattern.test(phone2)) {
			$(".login_r_t .point9 p").text("手机号有误");
			$(".login_r_t .point9").show();
			$("#telPhones2").css("border", "1px solid #f9533d")
			isPhone2 = 0;
			return false;
		}
	}

	//获取验证码接口
	var phone2 = ""; //手机号
	var code2 = ""; //验证码
	function getphoneCode3() {
		$.ajax({
			url: serviceHOST() + "/checkUser/sendPhoneMsg.do",
			type: 'post',
			data: {
				"phnum": phone2,
				"smeth": 2, //传2用的是修改密码。
				"random": getCookie("keys")
			},
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				if (msg.status == 0) {
					if (msg.data == 0) {
						friendlyMessage("验证码发送成功");
						resetCode3(); //倒计时
					} else if (msg.data == "M") {
						$(".login_r_t .point9").show();
						$(".login_r_t .point9 p").text("稍等片刻，才能再次发送");
						$("#telPhones2").css("border", "1px solid #f9533d");
					}
				} else if (msg.status == -1) {
					warningMessage("验证码获取失败，请再次点击获取");
				} else if (msg.status == -3) {
					getToken();
				};
			},
			error: function() {
				console.log('error!');
			}
		});
	}

	/**************倒计时********************/
	function resetCode3() {
		$('.login_r_t .identifyingCode2').css("display", "none");
		$('#J_second4').html('60');
		$('#J_resetCode4').show();
		var second = 60;
		var timer = null;
		timer = setInterval(function() {
			second -= 1;
			if (second > 0) {
				$('#J_second4').html(second);
			} else {
				clearInterval(timer);
				$('.login_r_t .identifyingCode2').show();
				$('#J_resetCode4').hide();
			}
		}, 1000);
	};
	var closeTT = ""; //定时器开关
	function checkloginByQrcode2(datas) {
		$.ajax({
			type: "post",
			url: serHOST()+"/webqrcodel/checkloginByQrcode.do",
			data: datas,
			success: function(msg) {
				var jsons = JSON.parse(msg);
				if (jsons.status == 0) {
					var usess = jsons.data.username;
					var psd = jsons.data.password;
					var params = {
						username: usess,
						password: psd
					};
					var par = $.param(params);
					$.ajax({
						type: "post",
						url: serviceHOST() + "/user/login.do?" + par,
						headers: {
							"token": qz_token()
						},
						success: function(jsons) {
							if (jsons.status == 0) {
								var result = base.encode(psd);
								var jsonsUnes = unescape(jsons.info)
									//console.log(unescape(jsons.info));        //对字符串进行解码
								setCookie("xmpp_key", result, 24 * 60); //存储密码
								setCookie("headImgkz", jsons.data.avatarfile, 24 * 60); //头像
								setCookie("magicnos", jsons.data.magicno, 24 * 60) //圈子号
								setCookie("nickname", jsons.data.nickname, 24 * 60) //昵称
								setCookie("username", jsons.data.username, 24 * 60) //用户名
								setCookie("myindustry", jsons.data.myindustry, 24 * 60) //用户职业
								setCookie("viplevel", jsons.data.viplevel, 24 * 60) //会员等级
								friendlyMessage('登录成功', function() {
									window.location.href = "/center/index.html";
								})

							} else if (jsons.status == 404||jsons.status == -1) {
								warningMessage("登录失败");
							} else if (jsons.status == -3) {
								getToken();
							};
						},
						error: function() {
							console.log("error")
						}
					});
				}
			},
			error: function() {
				console.log('error');
			}
		});
	}


	// 点击右上角图案短信登录和二维码登录切换
	$(document).on("click", ".right_sideBar .rightImg", function() {
		if ($(this).hasClass("on")) { //二维码的登录
			im.localLoadingOn(".tit3 .qrodeImg");
			$(this).removeClass("on");
			$(".erCode").addClass("on").siblings(".accNum").removeClass("on");
			$(".login_right,.msgBox").hide();
			$(".tit3").show();
			$(".login_right input").val("");
			$(".login_phone,.login_password").css("border", "1px solid #ddd");
			$(".point1").hide();
			$(".msgLogin input").val("");
			$(".msgLogin input").css("border", "1px solid #ddd");
			$(".point9").hide();
			createloginQrode();
			closeTT = setInterval(function() { //校验验证码  
				checkloginByQrcode2({
					qrcodeNo: getCookie("qrodeNo")
				})
			}, 2000);
		} else { //短信登录
			$(this).addClass("on");
			$(".erCode").removeClass("on").siblings(".accNum").addClass("on");
			$(".quickLogin").click(); //短信登录
			$(".tit3").hide();
			clearInterval(closeTT); //关闭校验验证码
		}
	});
	//点击文字账号登录和二维码登录切换
	//账号登录
	$(document).on("click", ".login_top_d .accNum", function() {
		$(this).addClass("on").siblings().removeClass("on");
		$(".rightImg").addClass("on");
		$(".tit3").hide();
		$(".login_right").show();
		$(".msgBox").hide();
		clearInterval(closeTT); //关闭校验验证码
	});
	//二维码登录
	$(document).on("click", ".login_top_d .erCode", function() {
		im.localLoadingOn(".tit3 .qrodeImg");
		$(this).addClass("on").siblings().removeClass("on");
		$(".rightImg").removeClass("on");
		$(".login_right,.msgBox").hide();
		$(".tit3").show();
		$(".login_right input").val("");
		$(".login_phone,.login_password").css("border", "1px solid #ddd");
		$(".point1").hide();
		$(".msgLogin input").val("");
		$(".msgLogin input").css("border", "1px solid #ddd");
		$(".point9").hide();
		createloginQrode();
		closeTT = setInterval(function() { //校验验证码  
			checkloginByQrcode2({
				qrcodeNo: getCookie("qrodeNo")
			})
		}, 2000);
	})



	//推荐圈子
	function recommendedCircle() {
		im.localLoadingOn(".myCircle_t");
		$.ajax({
			type: "post",
			url: serviceHOST() + "/userCircle/recommendCircleByUsernameEX.do",
			data: {
				username: "",
				category: 3,
				pageNum: 1,
				pageSize: 3
			},
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				im.localLoadingOff(".myCircle_t");
				if (msg.status == -3) {
					getToken();
				};
				var str = "";
				for (var i = 0; i < msg.data.length; i++) {
					if (msg.data[i].circlecategoryList != "") {
						var mssg = msg.data[i].circlecategoryList[0];
						str += '<li>' +
							'<a href="/center/life/mydynamic.html?code=' + mssg.themeNo + '" class="boxs">' +
							'<span class="themeImg"><img src=' + ImgHOST() + mssg.imagepath + '></span>' +
							'<div class="themes">' +
							'<p>' + mssg.themename + '</p>' +
							'<div>' +
							'<span><i class="item_01">' + mssg.activecount + '</i>人加入</span><span>|</span><span>' +
							'<i class="item_02">' + mssg.activecount + '</i>人活跃</span></div>' +
							'</div>' +
							'</a>' +
							'<div class="noadd login_window">加入</div>' +
							'</li>';
					}
				}
				$(".myCircle_t").html(str);
			},
			error: function() {
				console.log("error");
			}
		});
	}
	recommendedCircle();

})