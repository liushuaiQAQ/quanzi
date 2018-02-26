$(function() {
	
	/***********导航颜色背景变化开始******************/
	/***********导航颜色背景变化结束******************/
	var user_level = {
			30007: "boy",
			22899: "gril"
		}
		/****************************登录  忘记密码 开始*****************************/
		//	用户未登录时悬浮字提示
	$(document).on("mouseover", ".noLogin li.login_window", function() {
		$(".LogView").remove();
		$(this).append('<span class="LogView">登录查看</span>');
		$(this).siblings().find("span").hide();
	})
	$(document).on("mouseout", ".noLogin li", function() {
		$(".LogView").remove();
	})

	/*******************用户未登录，统统弹出登录*****************************/
	$(document).on("click", ".login_window", function(e) {
		$(".masks,.viewBox").show();
		e.stopPropagation();
		return false;
	})

	/************************弹窗登录******************************/
	$(".viewBox .phoneLogin input").on("keyup", function() {
		$(this).css("border-color", "#ddd");
		$(this).siblings(".warn1").hide();
	});
	$(".viewBox .msgLogin input").on("keyup", function() {
		$(this).css("border-color", "#ddd");
		$(this).siblings(".warn1").hide();
	});
	$(".viewBox .phoneLogin input").on("focus", function() {
		$(this).parent("li").siblings().find(".warn1").hide();
		$(this).parent("li").siblings().find("input").css("border-color", "#ddd")
	});
	$(".viewBox .msgLogin input").on("focus", function() {
		$(this).parent("li").siblings().find(".warn1").hide();
		$(this).parent("li").siblings().find("input").css("border-color", "#ddd")
	})

	/*弹窗登录************/
	$(".viewBox .clickLogin").on('click', function() {
		var _this = $(this);
		var phoneNum = $.trim(html2Escape($(".phoneImg input").val()));
		var passWordss = $.trim(html2Escape($(".passwordImg input").val()));
		var result = base.encode(passWordss);
		if (phoneNum == "" || passWordss == "") {
			$(this).parents(".inputLogin").find(".point1").show();
			$(".phoneImg input").css("border", "1px solid #f9533d");
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
						var jsonsUnes = unescape(jsons.info)
							//console.log(unescape(jsons.info));        //对字符串进行解码
						if (jsons.data.avatarfile != "") {
							setCookie("headImgkz", jsons.data.avatarfile, 24 * 60); //头像	不传默认是30分钟        24*60带表示一天
						}
						setCookie("xmpp_key", result, 24 * 60); //存储密码
						setCookie("headImgkz", jsons.data.avatarfile, 24 * 60); //头像
						setCookie("magicnos", jsons.data.magicno, 24 * 60) //圈子号
						setCookie("nickname", jsons.data.nickname, 24 * 60) //昵称
						setCookie("username", jsons.data.username, 24 * 60) //用户名
						setCookie("myindustry", jsons.data.myindustry, 24 * 60) //用户职业
						setCookie("viplevel", jsons.data.viplevel, 24 * 60) //会员等级
						rememberUse() //记住账号和密码   自动登录
						window.location.href = "/center/index.html";
					} else if (jsons.status == 404 || jsons.status == -1) { //     -1用户名或密码错误
						var jsonsUnes = unescape(jsons.info) //对字符串进行解码
						_this.parents(".inputLogin").find(".point1").show().find("p").html(jsonsUnes);
						$(".phoneImg input").css("border", "1px solid #f9533d");
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
	$("body,html").keydown(function(e) {
		var curKey = e ? e.keyCode : e.which;
		if (curKey == 13) {
			if (!$(".viewBox").is(":hidden") && !$(".viewBox .telBox").is(":hidden")) {
				$(".phoneLogin input").blur();
				$(".clickLogin").click();
				return false;
			} else if (!$(".viewBox").is(":hidden") && !$(".viewBox .msgBox").is(":hidden")) {
				$(".viewBox .msgLogin input").blur();
				$(".viewBox .clickLoginbtn").click();
				return false;
			} else if ($(".viewBox").is(":hidden") && !$(".login_r_t .msgBox").is(":hidden")) {
				$(".login_r_t .msgLogin input").blur();
				$(".login_r_t .clickLoginbtn").click();
				return false;
			}
		}
	});
	//自动登录
	$(document).on("click", ".loginOrpass i", function() {
		$(this).toggleClass("on");
	});
	//设定用户名、密码cookie
	function rememberUse() {
		if ($('.loginOrpass i').hasClass('on')) {
			setCookie("phoneAlert", $(".phoneImg input").val(), 30 * 24 * 60); //存储账号
			//setCookie("passwordS",$(".passwordImg input").val(),30*24*60);       //存储密码
		} else {
			clearCookie("phoneAlert");
			//clearCookie("passwordS");
		};
	};
	//cookie 存储账号和密码
	UserInf();

	function UserInf() {
		if (getCookie("phoneAlert")) {
			$(".phoneImg input").val(getCookie("phoneAlert"));
			$(".passwordImg input").val(getCookie("passwordS"));
			$('.loginOrpass i').addClass('on');
		};
	}

	//头部登录点击
	var closeT = "";
	$(".userLogin a").on("click", function() {
		$(".masks,.viewBox").show();
	})

	$(".viewBox .errors").on('click', function() {
		$(".tit1 .commontit").hide();
		$(".inputLogin input").css("border", "1px solid #ddd");
		$(".inputLogin input").val("");
		$(".msgBox input").css("border", "1px solid #ddd");
		$(".msgBox input").val("");
		$(".masks,.viewBox").hide();
		clearInterval(closeT); //关闭校验验证码  
	})

	//	手机号 二维码tab切换
	$(document).on("click", ".tit .telphone", function() {
		$(".tit1").show();
		$(".tit2").hide();
		$(".telBox").show();
		$(".msgBox").hide();
		$(this).addClass("on").siblings().removeClass("on");
		clearInterval(closeT); //关闭校验验证码  
	})

	//点击二维码时
	$(document).on("click", ".tit .erweima", function() {
		$(".tit1").hide();
		$(".tit2").show();
		im.localLoadingOn(".tit2 .qrodeImg");
		$(this).addClass("on").siblings().removeClass("on");
		$(".phoneLogin input").val("");
		$(".inputLogin input").css("border", "1px solid #ddd");
		$(".point1").hide();
		$(".msgLogin input").val("");
		$(".msgLogin input").css("border", "1px solid #ddd");
		$(".point9").hide();
		createloginQrode();
		closeT = setInterval(function() { //校验验证码  
			checkloginByQrcode({
				qrcodeNo: getCookie("qrodeNo")
			})
		}, 2000);
	})

	//	手机号登录 短信快捷登录点击
	$(document).on("click", ".viewBox .titMsg", function() {
		$(".viewBox .phoneLogin input").val("");
		$(".viewBox .inputLogin input").css("border", "1px solid #ddd");
		$(".viewBox .point1").hide();
		$(".viewBox .telBox").hide();
		$(".viewBox .msgBox").show();
	});
	$(document).on("click", ".viewBox .accpsdLogin span", function() {
			$(".viewBox .msgLogin input").val("");
			$(".viewBox .msgLogin input").css("border", "1px solid #ddd");
			$(".viewBox .point9").hide();
			$(".viewBox .telBox").show();
			$(".viewBox .msgBox").hide();
		})
		//获取动态密码开始
	$(".viewBox .get-code2").on("click", function() {
		if (!getCookie("keys")) {
			addCookIe()
		};
		getCode2($(this));
	})

	//获取验证码接口
	var phone2 = ""; //手机号
	var code2 = ""; //验证码
	function getphoneCode2() {
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
						friendlyMess("验证码发送成功");
						resetCode2(); //倒计时
					} else if (msg.data == "M") {
						$(".viewBox .point9").show()
						$(".viewBox .point9 p").text("稍等片刻，才能再次发送");
						$("#telPhones").css("border", "1px solid #f9533d");
					}
				} else if (msg.status == -1) {
					friendlyMess("验证码获取失败，请再次点击获取", "Y")
				} else if (msg.status == -3) {
					getToken();
				};
			},
			error: function() {
				console.log('error!');
			}
		});
	}
	/*得到验证码*/
	var isPhone2 = 1;

	function getCode2(e) {
		checkPhone2(); //验证手机号码
		if (isPhone2) {
			getphoneCode2()
		} else {
			$('#telPhones').focus();
		}
	}
	/******验证手机号********/
	function checkPhone2() {
		var pattern = /^1[34578]\d{9}$/;
		phone2 = $.trim(html2Escape($('#telPhones').val()));
		isPhone2 = 1;
		if (phone2 == '') {
			$(".viewBox .point9 p").text("请输入手机号码");
			$(".viewBox .point9").show()
			$("#telPhones").css("border", "1px solid #f9533d");
			isPhone2 = 0;
			return false;
		}
		if (!pattern.test(phone2)) {
			$(".viewBox .point9 p").text("手机号有误");
			$(".viewBox .point9").show();
			$("#telPhones").css("border", "1px solid #f9533d")
			isPhone2 = 0;
			return false;
		}
	}

	/**************倒计时********************/
	function resetCode2() {
		$('.viewBox .identifyingCode2').css("display", "none");
		$('#J_second2').html('60');
		$('#J_resetCode2').show();
		//		$(".point2").hide();
		var second = 60;
		var timer = null;
		timer = setInterval(function() {
			second -= 1;
			if (second > 0) {
				$('#J_second2').html(second);
			} else {
				clearInterval(timer);
				$('.viewBox .identifyingCode2').show();
				$('#J_resetCode2').hide();
			}
		}, 1000);
	}
	//获取动态密码结束
	//短信登录接口调取

	$(document).on('click', ".viewBox .clickLoginbtn", function() {
		var telNum = $.trim(html2Escape($("#telPhones").val())); //手机号
		var dynamicpsd = $.trim(html2Escape($("#dynamicpsd").val())); //动态密码
		var pattern = /^1[34578]\d{9}$/;
		if (telNum == "" || dynamicpsd == "") {
			$(this).parents(".telphoneLogin").find(".point9").show();
			$(".viewBox .point9 p").text("请输入手机号/动态密码");
			$(".viewBox .phoneli input").css("border", "1px solid #f9533d");
		} else {
			if (!pattern.test(telNum)) {
				$(".viewBox .point9 p").text("请输入正确手机号");
				$(".viewBox .point9").show();
				$("#telPhones").css("border", "1px solid #f9533d")
			} else {
				LoginByPhone2({
					phnum: telNum,
					code: dynamicpsd
				})
			}
		}

	})

	function LoginByPhone2(datas) {
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
					$(".viewBox .point9 p").text("动态密码错误");
					$(".viewBox .point9").show();
					$("#telPhones").css("border", "1px solid #f9533d");
					return false;
				} else if (jsons.status == -2) {
					$(".viewBox .point9 p").text("动态密码超时");
					$(".viewBox .point9").show();
					$("#telPhones").css("border", "1px solid #f9533d");
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


	 
	
	

	//	校验二维码登录(刷新使用)；
	//	if(flag==true){
	//		setInterval(function(){
	//			checkloginByQrcode({
	//				qrcodeNo:getCookie("qrodeNo")
	//			})
	//		},2000);
	//	}

	function checkloginByQrcode(datas) {
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
								var jsonsUnes = unescape(jsons.info);
								setCookie("xmpp_key", result, 24 * 60); //存储密码
								//console.log(unescape(jsons.info));        //对字符串进行解码
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
							}else if (jsons.status == -3) {
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


	/********************同步到朋友圈******************************/
	$(document).on("click", ".func label", function() {
			if ($(this).hasClass("on")) {
				$(this).removeClass("on");
			} else {
				$(this).addClass("on")
			}
		})
		/*******************弹窗框的忘记密码********************/
	$(".loginOrpass a").on("click", function() {
			$(".viewBox").hide();
			$(".viewpasswordBox").show();
		})
		//忘记密码 找回密码
	$(document).on("click", ".login_z_w a", function() {
		$(".masks,.viewpasswordBox").show();
	})
	$(".viewpasswordBox .errors").on("click", function() {
		$(".masks,.viewpasswordBox").hide();
	})
	$(".inputLogin2 input").on("keyup", function() {
		$(this).css("border-color", "#a8a8a8");
		$(this).parent("li").find(".commontit").hide();
	});
	$(".inputLogin2 input").on("focus", function() {
		$(this).parent("li").siblings().find(".warn2").hide();
		$(this).parent("li").siblings().find("input").css("border-color", "#ddd")
	})

	$(".get-code").on("click", function() {
			if (!getCookie("keys")) {
				addCookIe()
			}
			getCode($(this))
		})
		//获取验证码接口
	var phone = ""; //手机号
	var code = ""; //验证码
	function getphoneCode() {
		im.loadingOn();
		$.ajax({
			url: serviceHOST() + "/checkUser/sendPhoneMsg.do",
			type: 'post',
			data: {
				"phnum": phone,
				"smeth": 2, //0表示注册使用，1表示登录使用该接口，2表示重置密码使用
				"random": getCookie("keys")
			},
			headers: {
				"token": qz_token()
			},
			dataType: "json",
			success: function(msg) {
				im.loadingOff();
				if (msg.status == 0) {
					if (msg.data == "M") {
						$(".point3").show()
						$(".point3 p").text("稍等片刻，才能再次发送");
						$("#phone2").css("border", "1px solid #f9533d");
					} else if (msg.data == 0) {
						friendlyMess("验证码发送成功")
						resetCode(); //倒计时
					}
				} else if (msg.status == -1) {
					friendlyMess("验证码获取失败，请再次点击获取", "Y")
				}
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
		if (isPhone) {
			getphoneCode()
		} else {
			$('#phone2').focus();
		}

	}
	/******验证手机号********/
	function checkPhone() {
		var pattern = /^1[34578]\d{9}$/;
		phone = $.trim(html2Escape($('#phone2').val()));
		isPhone = 1;
		if (phone == '') {
			$(".point3 p").text("请输入手机号码");
			$(".point3").show()
			$("#phone2").css("border", "1px solid #f9533d");
			isPhone = 0;
			return false;
		}
		if (!pattern.test(phone)) {
			$(".point3 p").text("手机号有误");
			$(".point3").show();
			$("#phone2").css("border", "1px solid #f9533d")
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
			if (second > 0) {
				$('#J_second').html(second);
			} else {
				clearInterval(timer);
				$('.identifyingCode').show();
				$('#J_resetCode').hide();
			}
		}, 1000);
	}
	//	验证发送的验证码正确与否
	var codeStatus = "";

	function checkCode(datas) {
		//		phone = $.trim($('#phone2').val());
		//		code = $.trim($("#code2").val());
		checkPhone();
		im.loadingOn()
		$.ajax({
			url: serviceHOST() + "/checkUser/checkPhoneMsg.do",
			type: 'post',
			async: false,
			data: datas,
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				im.loadingOff()
				if (msg.status == 0) {
					codeStatus = msg.data;
					//										if(msg.data==-1){      //-1 错误   -2 过期      否则正确
					//											$(".point4").show()
					//											$(".point4 p").text("验证码有误");
					//											$("#code2").css("border","1px solid #f9533d");
					//											return false;
					//										}else if(msg.data==-2){
					//											$(".point4").show()
					//											$(".point4 p").text("验证码已过期");
					//											$("#code2").css("border","1px solid #f9533d");
					//											return false;
					//										}

				} else if (msg.status == -1) {
					codeStatus = 3; //自定义
					//										$(".point4").show()
					//										$(".point4 p").text("验证码异常");
					//										$("#code2").css("border","1px solid #f9533d");
					//										return false;
				} else if (msg.status == -3) {
					getToken();
				};
			},
			error: function() {
				console.log('error!');
			}
		});
	}
	//密码加密接口
	var pawjiami = "";

	//	function getPasjiami(datas) {
	//		$.ajax({
	//			type: "post",
	//			url: serHOST() + "/utils/encryption.do",
	//			data: datas,
	//			async: false,
	//			success: function(msg) {
	//				pawjiami = msg;
	//			},
	//			error: function() {
	//				console.log("error");
	//			}
	//		});
	//	}
	function getPass(datas) {
		im.loadingOn()
		$.ajax({
			type: "post",
			url: serviceHOST() + "/user/chmodpwd.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: {
				"username": phone2,
				"password": pawjiami,
				"code": code2
			},
			success: function(msg) {
				im.loadingOff()
				if (msg.status == 0) {
					if (msg.data == 1) {
						friendlyMessage("恭喜您，密码找回成功", function() {
							$(".masks,.viewpasswordBox").hide();
							location.reload()
						});
					}
				} else if (msg.status == -1) {
					$(".point3 p").text("用户名错误");
					$(".point3").show()
					$("#phone2").css("border", "1px solid #f9533d");
				} else if (msg.status == -3) {
					getToken();
				};
			},
			error: function() {
				console.log("error");
			}
		});
	}
	$(".clickLogin_end").on('click', function() {
			phone2 = $.trim(html2Escape($("#phone2").val()));
			code2 = $.trim(html2Escape($("#code2").val()));
			var password01 = $.trim(html2Escape($("#password01").val()));
			var password02 = $.trim(html2Escape($("#password02").val()));
			var reg = /^[0-9a-zA-Z]*$/g;
			checkPhone() //校验手机号
			if (isPhone == 0) {
				return false;
			}
			if (!code2) {
				$(".point4 p").text("请输入验证码");
				$(".point4").show()
				$("#code2").css("border", "1px solid #f9533d");
				return false;
			} else {
				checkCode({
					"phnum": phone2,
					"code": code2
				});
				//console.log(codeStatus)
				if (codeStatus == -1) { //-1 错误   -2 过期      否则正确
					$(".point4").show()
					$(".point4 p").text("验证码有误");
					$("#code2").css("border", "1px solid #f9533d");
					return false;
				} else if (codeStatus == -2) {
					$(".point4").show()
					$(".point4 p").text("验证码已过期");
					$("#code2").css("border", "1px solid #f9533d");
					return false;
				} else if (codeStatus == 3) {
					$(".point4").show()
					$(".point4 p").text("验证码异常");
					$("#code2").css("border", "1px solid #f9533d");
					return false;
				}
			}
			if (!password01) {
				$(".point5 p").text("请设置新密码");
				$(".point5").show()
				$("#password01").css("border", "1px solid #f9533d");
				return false;
			} else {
				if (!reg.test(password01)) {
					$(".point5").show();
					$(".point5 p").text("密码只能是数字和字母");
					$("#password01").css("border", "1px solid #f9533d");
					return false;
				}
				if (password01.length < 6) {
					$(".point5").show();
					$(".point5 p").text("密码不能少于6位");
					$("#password01").css("border", "1px solid #f9533d");
					return false;
				};
				if (password01.length > 20) {
					$(".point5").show();
					$(".point5 p").text("密码不能大于20位");
					$("#password01").css("border", "1px solid #f9533d");
					return false;
				}
				if (!password02) {
					$(".point6 p").text("请输入确认密码");
					$(".point6").show()
					$("#password02").css("border", "1px solid #f9533d");
					return false;
				}
			};
			if (password02 != password01) {
				$(".point5").show();
				$(".point5 p").text("二次密码输入不一致");
				$("#password01").css("border", "1px solid #f9533d");
				return false;
			}
			//			getPasjiami({ //密码加密
			//				"paw": password02,
			//				"code": code2
			//			})
			$.ajax({
				type: "post",
				url: serHOST() + "/utils/encryption.do", //忘记密码加密接口
				data: {
					"paw": password02,
					"code": code2
				},
				success: function(msg) {
					pawjiami = msg;
					getPass({
						"username": phone2,
						"password": pawjiami,
						"code": code2
					})
				},
				error: function() {
					console.log("error");
				}
			});

		})
		/****************************登录  忘记密码 结束*****************************/
	var UserName = ""; //用户名
	var UserImg = getCookie("headImgkz"); //用户头像
	var Nickname = getCookie("nickname"); //用户昵称
	// 查看所有职业
	$(document).on("hover", ".professionalbox .state", function() {
		$(".region").hide();
		$(".state .profession").css({
			"background": "#eee",
			"color": "#666"
		})
		$(this).find(".region").show();
		$(this).find(".profession").css({
			"background": "#3fa435",
			"color": "#fff"
		});

	})

	$(document).on("hover", ".professionalbox .region ul li", function() {
		$(".professionalbox .region ul li").css({
			"background": "#fff",
			"color": "#666"
		})
		$(this).css({
			"background": "#3fa435",
			"color": "#fff"
		});
	})

	/**********************第三方登录开始********************************/
	//QQ登录
	$(document).on("click", ".thirdQQ", function() {
		$(this).attr('href', serHOST()+"/boundQQ/verifyQQ.do");
	});
	//微信登录
	$(document).on("click", ".thirdWX", function() {
		$(this).attr('href', serHOST()+"/boundWeixin/verifyWX.do");
	});
	//微博登录
	$(document).on("click", ".thirdWB", function() {
		$(this).attr('href', serviceHOST()+"/boundSina/verifySina.do");
		//			$.ajax({
		//					type:"get",
		//					url:serviceHOST()+"/boundSina/verifySina.do",
		//					headers: {
		//						"token": qz_token()
		//					},   
		//					success:function(msg){
		//						if(msg.status==0){
		//							
		//						}else if(msg.status==-3){
		//							getToken();
		//						};
		//					},
		//					error:function(){
		//						console.log("errror");
		//					}
		//				});
	})

	/**********************第三方登录结束********************************/

	//搜索框下拉

	//关键字  职业切换
	$(document).on("click", ".down_search_t .keyword", function() {
		/**************开始刘加的*************/
		//	$(".keywordbox").hide();
		//	$(".down_search").css({"min-height":"0px"});
		//	$(".down_search .down_search_content").css("height","0px");
		//	$(".down_search_content .keywordbox").show();
		/**************end刘加的*************/
		/**************实验的*************/
		$(".down_search_content .keywordbox").show();
		/**************实验的结束*************/
		$(this).addClass("color_label");
		$(".professional").removeClass("color_label");
		$(".down_search_content .professionalbox").hide();
	})
	$(document).on("click", ".down_search_t .professional", function() {
		$(this).addClass("color_label");
		$(".keyword").removeClass("color_label");
		$(".down_search_content .professionalbox").show();
		$(".down_search_content .keywordbox").hide();
	})

	//消息  好友  设置  下拉框
	function header_right() {
		var handle = null;
		$(".messageContent .item_o").on("mouseover", function() {
			var messageContent = $(this).parents(".messageContent").find(".item_in");
			handle = setTimeout(function() {
				messageContent.fadeIn();
			}, 400);
		}).mouseout(function() {
			clearTimeout(handle);
		});
		$(".messageContent").on("mouseleave", function() {
			$(".Message_box").fadeOut();
			$(this).find(".item_in").fadeOut();
		})

		$(document).on("hover", ".Setup a", function() {
			$(".Setup a").removeClass("Setup_color");
			$(this).addClass("Setup_color");
		})
		$(".messageContent .item_o").on("click", function() {
			$(this).parents(".messageContent").find(".item_in").fadeIn();
		})
	}
	header_right();



	//关键字搜索
	var arrs = [];
	var word = getURIArgs("word");
	var code = getURIArgs("code");
	var type = getURIArgs("type");
	var form = getURIArgs("form");
	$(document).on("click", ".search", function() {
			var word = $.trim(html2Escape($(".search_box input").val()));
			var code = "";
			var type = 1;
			var _str = '';
			var nowArr = store.get('key');
			if (word != "") {
				if (nowArr) {
					for (var i = 0; i < nowArr.length; i++) {
						_str += nowArr[i] + ',';
					}
					if (_str.indexOf(word) == -1) { //判断val值里面是否有重复    没有重复
						_str += word;
					} else {
						_str = _str.slice(0, -1);
					}
					arrs.push(_str);
					store.set('key', arrs)
				} else {
					arrs.push(word);
					store.set('key', arrs)
				}
				if (form == 2) {
					window.location.href = '/center/searchresult.html?word=' + word + '&code=' + code + '&type=' + type + '&form=2';
				} else if (form == 3) {
					window.location.href = '/center/searchresult.html?word=' + word + '&form=3';
				} else if (form == 4) {
					window.location.href = '/center/searchresult.html?word=' + word + '&form=4';
				} else {
					window.location.href = '/center/searchresult.html?word=' + word + '&code=' + code + '&type=' + type + '&form=1';
				}

			}
		})
		//循环本地存储的关键字
	function getKeyWord() {
		var str = "";
		if (store.get('key')) {
			var strs = store.get('key')[0];
			var arrLen = strs.split(",");
			for (var i = 0; i < arrLen.length; i++) {
				if (arrLen[i].length > 25) {
					str += '<li>' + arrLen[i].substr(0, 25) + '...' + '</li>';
				} else {
					str += '<li>' + arrLen[i] + '</li>';
				}
			}

		} else {
			str = '<li>动态</li>' +
				'<li>视频</li>' +
				'<li>用户</li>';
		}
		$(".down_search .keywordbox ol").html(str);
	}
	$(document).on("click", ".down_search .keywordbox ol li", function() {
		var word = $(this).html().trim();
		var code = "";
		var type = 1;
		$(".search_box input").val($(this).html());
		window.location.href = '/center/search.html?word=' + word + '&code=' + code + '&type=' + type + '&form=1';
	})


	//回车搜索
	$("#TextID").click(function() {
		var act = $(document.activeElement).attr("id")
		if (act == "TextID") {
			$("body,html").on("keyup", function(e) {
				var code = (e ? e.keyCode : e.which);
				if (code == 13) {
					$(".search").click();
					return false;
				};
			});
		}
	});

	if (getCookie("pushMsg")) $(".top_count,.messageCount").remove();

})