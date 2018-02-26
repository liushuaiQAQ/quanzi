$(function() {
	var imgUrls = ImgHOST();
	/*********************手机号验证*************************************/
	//插入全球各个国家
	var conuntaryName = "";
	var countaryN = "";
	var password02 = "";
	for(var i in words) {
		conuntaryName += "<option value='" + words[i].split("-")[0] + "'>" + words[i].split("-")[0] + "</option>"
	}
	$(".chooseBtn").html(conuntaryName);
	$(".chooseBtn").val("中国");
	$(".chooseBtn").on("change", function() {
		countaryN = html2Escape($(".chooseBtn").val());
		//console.log(countaryN);
		var _p = html2Escape($(".chooseBtn").val())
		if(_p == "中国") {
			$(".falg").show();
		} else {
			$(".falg").hide()
		}
	})
	/*****************************获取验证码start**************************/  
	$("input").on("keyup", function() {
		$(this).css("border-color", "#a8a8a8");
		$(this).parents("li").find(".warn").hide();
		$(this).parents("li").siblings("li").find(".warn").hide();
		$(this).parents("li").siblings("li").find("input").css("border-color", "#a8a8a8");
	});
	$(".get-code").on("click", function() {
		if(!getCookie("keys")){
			addCookIe()
		};
		getCode($(this)); 
	})
		//获取验证码接口
	var phone = ""; //手机号
	var code = ""; //验证码
	function getphoneCode() {
		//im.loadingOn();
		$.ajax({
			url: serviceHOST() + "/checkUser/sendPhoneMsg.do",
			type: 'post',
			data: {
				"phnum": phone,
				"smeth": 0,
				"random":getCookie("keys")
			},
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				//im.loadingOff();
				if(msg.status == 0) {
					if(msg.data == "N") {
						$(".point2").show()
						$(".point2 p").text("手机号已注册，不能再注册");
						$("#phone").css("border", "1px solid #f9533d");
					} else if(msg.data == "M") {
						$(".point2").show()
						$(".point2 p").text("稍等片刻，才能再次发送");
						$("#phone").css("border", "1px solid #f9533d");
					} else if(msg.data == 0) {
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
			$('#phone').focus();
		}

	}
	//	提示语的定时器
	function titSettime(tit) {
		setTimeout(function() {
			$(tit).hide()
		}, 3000)
	}
	/******验证手机号********/
	function checkPhone() {
		var pattern = /^1[34578]\d{9}$/;
		phone = $.trim(html2Escape($('#phone').val()));
		isPhone = 1;
		if(phone == '') {
			$(".point2 p").text("请输入手机号码");
			$(".point2").show()
			$("#phone").css("border", "1px solid #f9533d");
			isPhone = 0;
			return false;
		}
		if(!pattern.test(phone)) {
			$(".point2 p").text("手机号有误");
			$(".point2").show();
			$("#phone").css("border", "1px solid #f9533d")
			isPhone = 0;
			return false;
		}
	}

	/**************倒计时********************/
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
	/*****************************获取验证码end**************************/
	//	注册协议勾选
	$(".protocol span").on('click', function() {
			if($(this).hasClass("on")) {
				$(this).removeClass("on")
			} else {
				$(this).addClass("on")
			}
		})
		//	验证发送的验证码正确与否
	$(".btn").on("click", function() {
		var pattern = /^1[34578]\d{9}$/;
		phone = $.trim(html2Escape($('#phone').val()));
		code = $.trim(html2Escape($("#code").val()));
		checkPhone();
		if(!code) {
			if(phone == "" || !pattern.test(phone)) {
				return false;
			}
			$(".point3").show();
			$(".point3 p").text("请输入验证码");
			$("#code").css("border", "1px solid #f9533d");
			return false;
		}
		if(!$(".protocol span").hasClass("on")) {
			im.loadingOn()
			$.ajax({
				url: serviceHOST() + "/checkUser/checkPhoneMsg.do",
				type: 'post',
				data: {
					"phnum": phone,
					"code": code
				},
				dataType: "json",
				headers: {
					"token": qz_token()
				},
				success: function(msg) {
					im.loadingOff()
					if(msg.status == 0) {
						if(msg.data == -1) {
							$(".point3").show()
							$(".point3 p").text("验证码有误");
							$("#code").css("border", "1px solid #f9533d");
						} else if(msg.data == -2) {
							$(".point3").show()
							$(".point3 p").text("验证码已过期");
							$("#code").css("border", "1px solid #f9533d");
						} else {
							friendlyMess(msg.info, "", function() {
								setCookie("userNameLogin", phone); //为上传头像 职业圈传值      
								$(".stepCon01").hide();
								$(".stepCon2").show();
								$(".step i").addClass("on2");
								$(".step .step2").addClass("onbg2");
								//为回车键提交铺垫
								$(".stepCon01").removeClass("on1");
								$(".stepCon2").addClass("on2");
							})
						}
					} else if(msg.status == -1) {
						$(".point3").show()
						$(".point3 p").text("验证码有误");
						$("#code").css("border", "1px solid #f9533d");
					}else if(msg.status==-3){
						getToken();
					};
				},
				error: function() {
					console.log('error!');
				}
			});
		} else {
			friendlyMess("请同意注册协议", "Y")
		}
	})

	/****************设置密码********************************/
	var names = {
		"userName": "",
		"userNo": ""
	}
	$(".passNext").on("click", function() {
			var password01 = $.trim(html2Escape($("#password01").val()));
			password02 = $.trim(html2Escape($("#password02").val()));
			var reg = /^[0-9a-zA-Z]*$/g;
			if(!reg.test(password01)) {
				$(".point4").show();
				$(".point4 p").text("密码只能是数字和字母");
				$("#password01").css("border", "1px solid #f9533d");
				return false;
			};
			if(password01.length < 6) {
				$(".point4").show();
				$(".point4 p").text("密码不能少于6位");
				$("#password01").css("border", "1px solid #f9533d");
				return false;
			};
			if(password01.length > 20) {
				$(".point4").show();
				$(".point4 p").text("密码不能大于20位");
				$("#password01").css("border", "1px solid #f9533d");
				return false;
			};
			if(!password02) {
				$(".point4_02").show();
				$(".point4_02 p").text("请输入确认密码");
				$("#password02").css("border", "1px solid #f9533d");
				return false;
			}
			if(password02 != password01) {
				$(".point4").show();
				$(".point4 p").text("二次密码输入不一致");
				$("#password02").css("border", "1px solid #f9533d");
				return false;
			}

			$(".stepCon01").hide();
			$(".stepCon2").hide();
			$(".stepCon3").show();
			$(".step i").addClass("on3")
			$(".step .step3").addClass("onbg3")
			//为回车键提交铺垫
			$(".stepCon2").removeClass("on2");
			$(".stepCon3").addClass("on3");
		})
		/********************设置基本信息**************************/
		//上传头像照片
	document.domain = "quanzinet.com";
	$('.fileHeadImg').on("click", function() {

			if($(".headImgBox").html().indexOf("img") > -1) { //判断是否有图片存在
				$(".headImgBox").html("");
				$(".headImgBox").hide();
				$(".previewImg").html("");
				$(".maskFix,.maskCenter").show();
			} else {
				$(".maskFix,.maskCenter").show();
			}
		})
		//判断文件类型
	function isFileType(arr, obj) {
		var ar = $(obj).val().split(".");
		var t = ar[ar.length - 1];
		for(var i in arr) {
			if(t == arr[i]) return true;
		};
		return false;
	};
	//得到文件类型     裁剪用
	function isFileTypes(obj) {
		var ar = $(obj).val().split(".");
		var t = (ar[ar.length - 1]);
		return t;
	};
	var imgType = "";
	$(document).on("change", "#headImg", function() {
			var _this = this;
			if(!isFileType(["jpg", "png", "gif"], _this)) {
				friendlyMess("请上传jpg、png、gif格式的文件", "Y");
				return false;
			};
			if(!checkFileSize(_this, 5)) {
				friendlyMess("上传文件大于5M，请重新上传", "Y");
				return false;
			};
			imgType = isFileTypes(_this) //得到图片格式    裁剪用
				//获取上传的文件大小
			if(navigator.userAgent.indexOf("MSIE 6.0") < 0) {
				if(navigator.userAgent.indexOf("MSIE 7.0") < 0) {
					if(navigator.userAgent.indexOf("MSIE 8.0") < 0) {
						if(navigator.userAgent.indexOf("MSIE 9.0") < 0) {
							var file = $(this)[0].files[0];
							var fileSize = (Math.round(file.size / (1024 * 1024)));
						}
					}
				}
			}
			getUploadFileSize(this.id);
			if(FileReader){
				var reader = new FileReader(),
				file = this.files[0];
				reader.onload = function(e){
						var image = new Image();
						image.src = e.target.result;
						image.onload=function(){
							if(image.width < 440&&image.height<280){
								warningMessage("头像宽高不能小于440");
								return false;
							}else{
								imgUpload("headImg",{
								"id":getCookie("username"),
								"type":2,       //2为上传头像
								"size":fileSize
							});
							}
						}
					};
				reader.readAsDataURL(file);
			}
		})
		//获取上传图片宽度
	var uploadFileW = ""; //上传图片的原始宽度
	var uploadFileH = ""; //上传图片的原始宽度
	var nowImgW = ""; //图片加载完成后的尺寸
	var beforeW = ""; //图片未加载完成前的宽度
	function getUploadFileSize(id) {
		var f = document.getElementById(id).files[0];
		var img = document.createElement("img");
		img.file = f;
		img.onload = function() {
			uploadFileW = this.width;
			uploadFileH = this.height;
			//console.log(this.width+"-"+this.height);
			if(uploadFileH > uploadFileW && uploadFileH > 280) { //判断宽有没有二次缩放
				if(uploadFileW > 440) {
					beforeW = 440;
				} else {
					beforeW = uploadFileW;
				};
			};
		}
		var reader = new FileReader();
		reader.onload = function(e) {
			img.src = e.target.result;
		};
		reader.readAsDataURL(f);
	};

	//判断文件大小
	function checkFileSize2(obj, size) {
		if(navigator.userAgent.indexOf("MSIE 6.0") < 0) {
			if(navigator.userAgent.indexOf("MSIE 7.0") < 0) {
				if(navigator.userAgent.indexOf("MSIE 8.0") < 0) {
					if(navigator.userAgent.indexOf("MSIE 9.0") < 0) {
						var file = $(obj)[0].files[0];
						var fileSize = (Math.round(file.size / (1024 * 1024)));
						if(fileSize > size) {
							return false;
						} else {
							return fileSize;
						}
					}
				}
			}
		}
	}

	//上传
	var path = ""
	var filename = "";
	var jcropApi;
	var imgForm = "";
	document.domain = "quanzinet.com";

	function imgUpload(id, data) {
		var pro = 0.01;
		var i = 0;
		var timer = null;
		$(".upLoading").show();
		$(".upLoading>span.name").html($("#" + id).val());
		im.loadingOn();
		$.ajaxFileUpload({
			//type:"post",
			url: RestfulHOST() + "/files/uploadWeb", //处理文件上传操作的服务器端地址
			secureuri: false,
			fileElementId: id,
			dataType: 'json',
			timeout: 100000, //超时时间设置
			data: data,
			crossDomain: true,
			success: function(msg) {
				im.loadingOff();
				if(msg.status == 0) {
					//进度条加载
					window.clearInterval(timer);
					timer = window.setInterval(startTime, 1);

					function startTime() {
						pro += 0.0058;
						if(pro >= 1) {
							pro = 1;
							window.clearInterval(timer);
							$(".upLoading").hide();
							$(".headImgBox").show();
							$(".headImgBox").html('<img id="img" src="' + ImgHOST() + msg.filename + '">');
							$(".previewImg").html('<img src="' + ImgHOST() + msg.filename + '">');
							//获取图片名字
							path = $(".headImgBox img").attr("src"); //得到图片路径
							//从路径中截取图片名[包括后缀名]
							if(path.indexOf("/") > 0) //如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
							{
								filename = path.substring(path.lastIndexOf("/") + 1, path.length);
							} else {
								filename = path;
							}

							/****************图片裁剪*****************/
							$(".headImgBox img").Jcrop({
								onChange: showPreview,
								onSelect: showPreview,
								setSelect: [0, 0, 80, 80],
								aspectRatio: 1,
								boxWidth: 440,
								boxHeight: 280
							}, function() {
								jcropApi = this;
							});

							function showPreview(coords) {
								$('input[name="x1"]').val(coords.x);
								$('input[name="y1"]').val(coords.y);
								$('input[name="x2"]').val(coords.x2);
								$('input[name="y2"]').val(coords.y2);
								$('input[name="w"]').val(coords.w);
								$('input[name="h"]').val(coords.h);
								if(parseInt(coords.w) > 0) {
									//计算预览区域图片缩放的比例，通过计算显示区域的宽度(与高度)与剪裁的宽度(与高度)之比得到
									var rx = $(".previewImg").width() / coords.w;
									var ry = $(".previewImg").height() / coords.h;
									//通过比例值控制图片的样式与显示
									$(".previewImg img").css({
										width: Math.round(rx * $(".headImgBox img").width()) + "px", //预览图片宽度为计算比例值与原图片宽度的乘积
										height: Math.round(ry * $(".headImgBox img").height()) + "px", //预览图片高度为计算比例值与原图片高度的乘积
										marginLeft: "-" + Math.round(rx * coords.x) + "px",
										marginTop: "-" + Math.round(ry * coords.y) + "px"
									});
								};
								//让图片居中显示
								var divh = Number($(".headImgBox>div").height());
								var divw = Number($(".headImgBox>div").width());
								$(".headImgBox>div").css({
									"left": (440 - divw) / 2 + "px",
									"top": (280 - divh) / 2 + "px"
								});
							}
						};
						$(".upLoading .pro").html((pro * 100).toFixed(2) + "%");
						$(".upLoading .progress .bar").css("width", pro * 146 + "px");
					}

				}
			},
			error: function() { //服务器响应失败时的处理函数
				window.clearInterval(timer);
				console.log("error");
			}
		});
		$(".stopErr").on("click", function() {
			window.clearInterval(timer)
			$(".upLoading").hide();
			$(".headImgBox").hide();
			$(".previewImg").html();
		})

		//执行进度条加载
		timer = window.setInterval(function() {
			pro = 1 - 300 / (300 + i++);
			$(".upLoading .pro").html((pro * 100).toFixed(2) + "%");
			$(".upLoading .progress .bar").css("width", pro * 146 + "px");
		}, 100);
	};
	$(".errors").on("click", function() {
			if($(".headImgBox").html().indexOf("img") > -1) { //判断是否有图片存在
				jcropApi.destroy(); //销毁裁剪
				$(".headImgBox").html("");
				$(".headImgBox").hide();
				$(".previewImg").html("");
				$(".maskFix,.maskCenter").hide();
			} else {
				$(".maskFix,.maskCenter").hide();
			}
		})
		//裁剪接口
	function hdadImgconfirm() {
		nowImgW = $(".headImgBox>div>img").width();
		beforeW = beforeW || nowImgW;
		var zom = uploadFileW / 440;
		var x1 = Math.floor($("input[name='x1']").val() * zom);
		var y1 = Math.floor($("input[name='y1']").val() * zom);
		var w1 = Math.floor(($("input[name='x2']").val() - $("input[name='x1']").val()) * zom);
		w1 = Math.min(w1, uploadFileW); //宽不大于原始尺寸
		var h1 = Math.floor(($("input[name='y2']").val() - $("input[name='y1']").val()) * zom);
		h1 = Math.min(h1, uploadFileH); //高不大于原始尺寸
		var w1 = Math.floor(($("input[name='x2']").val() - $("input[name='x1']").val()) * zom);
		w1 = Math.min(w1, uploadFileW); //宽不大于原始尺寸
		var h1 = Math.floor(($("input[name='y2']").val() - $("input[name='y1']").val()) * zom);
		h1 = Math.min(h1, uploadFileH); //高不大于原始尺寸
		im.loadingOn();
		$.ajax({
			type: "post",
			url: serviceHOST() + '/utils/cutImage.do',
			async: true,
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: {
				"username": getCookie("userNameLogin"),
				"imagename": filename,
				"x": x1,
				"y": y1,
				"width": w1,
				"height": h1,
				"postfix": filename,
				"oldimagename": "",
			},
			success: function(msg) {
				im.loadingOff();
				if(msg.status == 0) {
					var personHeadImg = ImgHOST() + msg.data
					//console.log(personHeadImg)
					$(".headImg").html('<img src="' + personHeadImg + '"/>');
					$(".maskFix,.maskCenter").hide();
					$(".setHeadImg .imgTit").hide();
					$(".headImg").css("border","1px solid #a8a8a8");
					friendlyMess("保存头像成功", "", function() {
						jcropApi.destroy(); //销毁裁剪
					})
				}else if(msg.status ==-1||msg.status ==1){
					jcropApi.destroy(); //销毁裁剪
					$(".headImgBox").html("");
					$(".headImgBox").hide();
					$(".previewImg").html("");
					friendlyMess("保存头像失败","Y",function() {
						$(".maskFix,.maskCenter").hide();
					},2000)
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}
		});
	}

	//裁剪保存头像
	$(".rightBar p").on("click", function() {
		if($(".headImgBox").html().indexOf("img") > -1) { //判断是否有图片存在    ,没有时
			hdadImgconfirm()
		} else {
			friendlyMess("您还没有上传图片,请上传图片", "Y")
		}
	})

	
	//	点击选择职业圈
	$(document).on("click", "#work", function() {
		$(".workBoxR").show();
		getCareercircle({          //获取职业圈分类
			username:"",    
			pageNum: 1,
			pageSize:63
		});
	})
	$(document).on("click", ".protitR span", function() {
			$(".workBoxR").hide();
		})
		//加入职业圈按钮
	var codeId = ""; //职业的id
	$(document).on("click", ".joinorenterR", function() {
		$(this).html("已加入");
		var works = $(this).parents("li").attr("data-name");
		codeId = $(this).parents("li").attr("data-code");
		$(".point6").hide();
		$("#work").css("border-color", "#a8a8a8");
		$("#work").val(works);
		$("#work").attr("data-code",codeId);
		$(".workBoxR").hide();
	})
	/*******************职业圈新修改开始***********************/
	
	function getCareercircle(datas){
		im.localLoadingOn(".autoTypeR ul");
		$.ajax({
			type: "post",
			url: serviceHOST() + "/jobstree/recommendJobStreeCircleByUsernameEX.do",
			data: datas,
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				im.localLoadingOff(".autoTypeR ul");
				if (msg.status == 0) {
					var mssg = msg.data;
					getCarInfo(mssg);
				}else if(msg.status==-3){
					getToken();
				};
					
			},
			error: function() {
				console.log('error')
			}
		})
	}
	function getCarInfo(mssg){
		var str = "";
		if(mssg.length>0){
			for (var i = 0; i < mssg.length; i++) {
				var dataNames = mssg[i].themename;
			 	var activeCount=mssg[i].activecount;
			 	if(activeCount>10000){
			 		activeCount=change (activeCount);
			 	}else{
			 		activeCount=mssg[i].activecount;
			 	}
			 	var subStr="";
			 	if(mssg[i].circletopicanycontent.indexOf("content")>-1||mssg[i].circletopicanycontent.indexOf("shareUrl")>-1){
			 		subStr="";
			 	}else{
			 		subStr=mssg[i].circletopicanycontent;
			 	}
			str+='<li data-code="'+mssg[i].code+'" data-name="'+dataNames+'">'+
				'<div class="wordPosR clearfix">'+
					'<div>'+
						'<p>'+mssg[i].themename+'<span>圈子<i>'+activeCount+'</i>人</span></p>';
						if(mssg[i].circletopicanynickname!=""){
							str+='<b>'+mssg[i].circletopicanynickname+':'+subStr+'</b>';
						};
					str+='</div>';
					str+='<a class="joinorenterR" href="javascript:;">加入</a>';
				str+='</div>'+
					'<div class="imglisR">'+
						'<ol class="clearfix">';
						if (mssg[i].imagePathList.length > 0) {
							for (var a = 0; a < mssg[i].imagePathList.length; a++) {
								if(a<5){
									str+='<li><img src="'+ImgHOST()+mssg[i].imagePathList[a]+'" alt=""></li>';
								}
							}
						}
						str+='</ol>'+
					'</div>'+
				'</li>';
				}
			}
			$(".autoTypeR ul").html(str);
	}
	/*******************职业圈新修改结束***********************/
	//更改个人资料信息
	//生日日期调用
	getDateSelect({
		YClass: "birthYearS", //年obj 
		MClass: "birthMonthS", //月obj 
		DClass: "birthDayS", //日obj 
		year: "", //设置年份 
		month: "", //设置月份 
		day: "" //设置日期 
	});
	//读取年月日
	function readbirthDay(D) {
		if(D) {
			var array = D.split("-");
			var month = "";
			var day = "";
			var year = array[0];

			if(array[0] == "3000") {
				year = "-1";
				month = "-1";
				day = "-1";
			} else {
				if(array[1].substr(0, 1) == "0") {
					month = array[1].substr(1, 2);
				} else {
					month = array[1] || "";
				}

				if(array[2].substr(0, 1) == "0") {
					day = array[2].substr(1, 2);
				} else {
					day = array[2] || "";

				}
			}
			getDateSelect({
				YClass: "birthYearS", //年obj
				MClass: "birthMonthS", //月obj
				DClass: "birthDayS", //日obj
				year: year, //设置年份
				month: month, //设置月份
				day: day //设置日期
			});
		}
	}
	//获取年月日
	function birthDayAll() {
		var birthDate = "";
		if($("#birthYear").val() > "-1") {
			birthDate += $("#birthYear").val();
			if($("#birthMonth").val() > "-1") {
				if($("#birthMonth").val() > 9) {
					birthDate += "-" + $("#birthMonth").val();
					if($("#birthDay").val() > "-1") {
						if($("#birthDay").val() > 9) {
							birthDate += "-" + $("#birthDay").val();
						} else {
							birthDate += "-0" + $("#birthDay").val();
						}
					}
				} else {
					birthDate += "-0" + $("#birthMonth").val();
					if($("#birthDay").val() > "-1") {
						if($("#birthDay").val() > 9) {
							birthDate += "-" + $("#birthDay").val();
						} else {
							birthDate += "-0" + $("#birthDay").val();
						}
					}
				}

			}
		}
		return birthDate;
	}
	function updateUserInf() {
		var niceName = html2Escape($("#username").val()); //用户昵称
		//console.log(niceName)
		var ProfessionalCircle = html2Escape($("#work").val()); //职业圈
		var codeid= $("#work").attr("data-code");
		if($("#man").attr("checked") == "checked") { //性别
			var sexs = $("#man").val();
		} else {
			var sexs = $("#woman").val();
		}
		//		选择兴趣分类
	var vueid=$("#icInfo").attr("vueid");
   	var vuename=$("#icInfo").attr("vuename");
	var themeCatetoryIdList=vueid.split(",")||"";
	var themeCatetoryNameList=vuename.split(",")||"";
//	console.log(themeCatetoryIdList);
//	console.log(themeCatetoryNameList);
		if($("#openPhone").attr("checked") == "checked") { //
			var phoneNum = 1; //1 代表公开
		} else {
			var phoneNum = 0; //代表不公开         
		}
//				console.log(names.userName)
//				console.log(names.userNo)
		var homeTowns = countaryN || "中国";
		var mobilePrivacy = {
			phones:"",
			mobileMsg:phoneNum
		}
		//var phones=JSON.stringify(mobilePrivacy);     //将json对象转化为字符串
		//console.log(mobilePrivacy);
		var paramuserVO = {
			"user": {
				"birthday":birthDayAll(),
				"sex":sexs || "",
				//"hometown":homeTowns,
				"hometown":"",
				"nickname":niceName,
				"locationX":"",
				//"code":codeId,
				"code":codeid,
				"locationY": "",
				"sign": "",
				"username":getCookie("userNameLogin"),
				"myindustry":ProfessionalCircle,
				"userNo":"",
				"age":"",
				"hot":"",
				"starsign":"",
				"interestlabel":"",
				"imgcountforhead":"",
				"mobiles":mobilePrivacy,
				"realname": "",
				"company": "",
				"realindustry":"",
				"themeCatetoryIdList":themeCatetoryIdList,        //兴趣分类id列表       
				"themeCatetoryNameList":themeCatetoryNameList       //兴趣分类名字列表
			},"picturebeanList":[{
				"imagepath":"",
				"imagetype":"",
				"size":0,
				"username":""
			},{
				"imagepath":"",
				"imagetype":"",
				"size":0,
				"username":""
			}],
			"lawroleBeanList":[{
				"industry":"",
				"lawroleNo":"",
				"rolename":"",
				"type":""
			},
			{
				"industry": "",
				"lawroleNo": "",
				"rolename": "",
				"type": ""
			}]
		}

		var paramuserVOval = JSON.stringify(paramuserVO);
		// im.localLoadingOn(".main")    //局部开启
		$.ajax({
			type:"post",
			url:serviceHOST()+"/user/updateUserInformation.do",
			//url:"http://192.168.1.101:8080/lawchat_web/utils/soap/updateUserInformation.do", 
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: {
				paramuserVO: paramuserVOval
			},
			success: function(msg) {
				//im.localLoadingOff(".main")     //关闭*/
				if(msg.status == 0) {
					$(".stepCon01").hide();
					$(".stepCon2").hide();
					$(".stepCon3").hide();
					$(".birthLi select").css("border-color","#e8e8e8");
					$(".dateT").hide();
					$(".step i").addClass("on4");
					$(".step .step4").addClass("onbg4");
					$(".stepCon4").show();
					//为回车键提交铺垫
					$(".stepCon3").removeClass("on3");
					//定时器       停留4-5秒后跳转到登陆界面
					setTimeout(function() {
						window.location.href = "/index.html"; //注册完去登陆页   
					}, 3000)

				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}
		});
	}


	// 设置密码
	function createUserInformation() {
		$.ajax({
			url: serviceHOST() + "/user/createUserInformation.do",
			type: 'post',
			data: {
				"username": phone,
				"password": password02,
				"code": code
			},
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				im.loadingOff()
				if(msg.status == 0) {
					updateUserInf();
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error!")
			}
		})
	}
	
	//生活圈分类接口
	ClassificationInterface ();
	$(document).on("click","#icInfo",function() {
		$(".MoreLivings").show();
		$(".MoreLivings_01").show();
	})
	//关闭 生活圈分类接口
	$(".MoreLivings .Mores_l_del").on("click",function  () {
		$(".MoreLivings").hide();	
	})
	$(document).on("click",".MoreLivings .Livings_list li.Category",function(){
		$(this).find("i").toggleClass("on")
		if($(this).find("i").hasClass("on")){
			$(this).addClass("on")
		}else{
			$(this).removeClass("on")
		}
	})
	
	
	//多选状态下保存
	$(document).on("click","a.keepss",function(){
		   var cid=""; 
		   var cName=""; 
		   $(".MoreLivings .Livings_list li.on").each(function(index, element) { 
		      cid+=$(this).attr("data-id")+","; 
		      cName+=$(this).attr("data-name")+",";
		   }); 
		   if(cid.length!=0){
			   cName=cName.substring(0,cName.length-1);
			   cid=cid.substring(0,cid.length-1); 
			   $("#icInfo").attr("vueName", cName)
			   $("#icInfo").attr("vueId",cid)
			   $(".MoreLivings").hide();
			   if(cName.length>16){
			   		$("#icInfo").val(cName.substring(0,16)+"...");
			   }else{
			   		$("#icInfo").val(cName);
			   }
		   }
	});
	// 生活圈分类图路径
	var LifeImg = serHOST()+"/res/pics/theme_type/";
	function ClassificationInterface (type) {
//		$(".MoreLivings").show();
//		$(".MoreLivings_01").show();
		$.ajax({
			type: "post",
			url: serviceHOST() + "/themeCatetory/getAllThemeCatetories.do",
			headers: {
				"token": qz_token()
			},
			dataType: "json",
			success: function(mssg) {
				if(mssg.status==-3){
					getToken();
				};
				var str = "";
				for(var i = 0; i < mssg.data.length; i++) {
					var msg = mssg.data[i];
					str += '<li class="Category" data-id=' + msg.id + ' data-name='+msg.name+'>';
					str += '<img src="' + LifeImg + msg.url + '" align="top" />' +
						'<h5>' + msg.name + '</h5>';
						if(msg.count!=null){
							str += '<span>'+msg.count+'万人</span>';
						}else{
							str += '<span>20万人</span>';
						}
						str+='<i></i>'
						str +='</li>';
				}
				$(".MoreLivings .Livings_list").html(str);
			},
			error: function() {
				console.log("error")
			}

		});
	}

	$(document).on("click", ".confirmSub", function() {
		$(".workBoxR").hide();       //隐藏职业圈弹窗
		$(".MoreLivings").hide();      //兴趣爱好弹窗
		var nickName = $.trim(html2Escape($('#username').val())); //用户昵称
		var occupation = $.trim(html2Escape($("#work").val())); //选择职业圈
		if($(".headImg").has("img").length<1){
			$(".setHeadImg .imgTit").show();
			$(".headImg").css("border","1px solid #f95339");
			return false;
		}
		if(nickName == "") {
			$(".point5").show();
			$("#username").css("border", "1px solid #f9533d");
			return false;
		} else if(nickName.length > 16) {
			$(".point5 p").html("昵称最多16个字符");
			$("#username").css("border", "1px solid #f9533d");
			$(".point5").show();
			return false;
		};
		if(!($(".birthYearS").val()=="-1"&&$(".birthMonthS").val()=="-1"&&$(".birthDayS").val()=="-1")){
			if($(".birthYearS").val()=="-1"){
				$(".dateT").show();
				$(".birthYearS").css("border-color","#f9533d");
				$(".birthYearS").siblings("select").css("border-color","#a8a8a8");
				return false;
			}
			if($(".birthMonthS").val()=="-1"){
				$(".dateT").show();
				$(".birthMonthS").css("border-color","#f9533d");
				$(".birthMonthS").siblings("select").css("border-color","#a8a8a8");
				return false;
			}
			if($(".birthDayS").val()=="-1"){
				$(".dateT").show();
				$(".birthDayS").css("border-color","#f9533d");
				$(".birthDayS").siblings("select").css("border-color","#a8a8a8");
				return false;
			}
		}
		if($(".birthYearS").val()!="-1"&&$(".birthMonthS").val()!="-1"&&$(".birthDayS").val()!="-1"){
			$(".dateT").hide();
			$(".birthLi select").css("border-color","#a8a8a8");
		}
		if(occupation == "") {
			$(".point6").show();
			$("#work").css("border", "1px solid #f9533d");
			return false;
		}
		createUserInformation();
	});
	
	// 键盘回车自动提交
	$("body,html").keydown(function(e){ 
		var curKey =e?e.keyCode:e.which; 
		if(curKey == 13){
			if($(".commonD").hasClass("on1")){
				console.log("2")
				$(".stepCon01 input").blur();
				$(".btn").click();
				return false; 
			}else if($(".commonD").hasClass("on2")){
				console.log("3")
				$(".stepCon2 input").blur();
				$(".passNext").click();
				return false; 
			}else if($(".commonD").hasClass("on3")){
				console.log("4")
				$(".stepCon3 input").blur();
				$(".confirmSub").click();
				return false; 
			}
		} 
	}); 

})