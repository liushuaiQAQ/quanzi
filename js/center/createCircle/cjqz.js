$(function() {
	var _circleImg;
	//imgurl
	var LifeImg = serHOST()+"/res/pics/theme_type/";
	//选择圈子
	$(".create .qz_choose label").on("click", function() {
		$(".create .qz_choose span").removeClass("checked");
		$(this).find("span").addClass("checked");
		var fl = $(this).parent().attr("data-id");
		if ($(".create .qz_choose span").eq(1).hasClass("checked")) {
			$(".qz_place .qz_qq").hide();
			$(".qz_place .qz_sh").fadeIn(200);
			$(this).parent().attr("data-id", "1");
		} else {
			$(".qz_place .qz_sh").hide();
			$(".qz_place .qz_qq").fadeIn(200);
			$(this).parent().attr("data-id", "2");
		}
	})


	$(".qz_name_cj").on("click", function() {
		$(this).find("input").focus();
	})

	$(".qz_name_cj input").bind('input propertychange', function() {
		if($(this).val() != ""){
			$(".quan_name").show();
		}else{
			$(".quan_name").hide();
		}
	})

	//选择开通聊天室
	$(".create .qz_chatroom label").on("click", function() {
		$(".create .qz_chatroom span").removeClass("checked");
		$(this).find("span").addClass("checked");
		$(this).parents(".qz_chatroom").attr("data-id", $(this).attr("data-id"));
	})



	//打开上传图标
	$(".create_img").on("click", function() {
		$(".maskFix").show();
		$(".maskCenter").fadeIn(300);
		$(".previewImg").html("");
	})

	//关闭
	$(".errors").on("click", function() {
		$(".maskFix").hide();
		$(".maskCenter").fadeOut(200);
	})

	// 上传图标切换
	$(".icon_txt span").on("click", function() {
		$(".icon_txt span").removeClass("on");
		$(this).addClass("on");
		if ($(".icon_txt .zdy").hasClass("on")) {
			$(".maskCenter .uploads").show();
			$(".maskCenter .custom").hide();
		} else {

			$(".maskCenter .uploads").hide();
			$(".maskCenter .custom").show();
		}
	})


	//推荐图标切换
	$(document).on("click", ".custom ul li", function() {
		$(".custom i").removeClass("xz_icon");
		$(this).find("i").addClass("xz_icon");
		var xz_img = $(this).attr("data-img");
		$(".determine button").attr("data-img", xz_img);
	})
	
	// 圈子介绍
	$(".Introduces").on("keyup", function() {
		checkNum($(this), '140', "#cj_num")
	})



	//生活圈分类接口
	$(".qz_sh a").on("click", function() {
		$(".maskFix").show();
		if ($(".Living_list li").length == 0) {
			ClassificationInterface();
		} else {
			$(".MoreLiving").fadeIn(300);
		}
	})

	function ClassificationInterface() {
		$(".MoreLiving").fadeIn(300);
		$.ajax({
			type: "post",
			url: serviceHOST() + "/themeCatetory/getAllThemeCatetories.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			success: function(mssg) {
				var str = "";
				for (var i = 0; i < mssg.data.length; i++) {
					var msg = mssg.data[i];
					str += '<li class="Category" data-id=' + msg.id + '>' +
						'<img src=' + LifeImg + msg.url + ' align="top" />' +
						'<h5>' + msg.name + '</h5>' +
						'</li>';
				}
				$(".Living_list").html(str);
				//创建生活圈分类样式
				$(".Living_list li.Category").css({
					width: "64px",
					padding: "7px",
					margin: "0",
					border: "1px solid #fff"
				})
				$(".Living_list li.Category:first-child").css({
					borderColor: "red"
				})
			},
			error: function() {
				console.log("error")
			}

		});
	};

	$(document).on("click", ".MoreLiving .Living_list li.Category", function() {
		$(".MoreLiving .Living_list li.Category").css("borderColor", "#fff");
		$(this).css("borderColor", "red");
		$(".createlife p a.classification span").html($(this).find("h5").html());
		catetoryID = $(this).attr("data-id");
		$(".qz_place .qz_sh").attr("data-id", catetoryID);
		$(".MoreLiving .More_l_del").click();
	})

	//关闭生活分类
	$(".MoreLiving .More_l_del").on("click", function() {
		$(".MoreLiving").fadeOut(200);
		$(".maskFix").hide();
	})



	//选择地区
	var countryStr = '';
	//先将所有的国家插入页面当中
	for (var i = 0; i < globalArea_normal.length; i++) {
		countryStr = '<li data-id="' + globalArea_normal[i].id + '">' + globalArea_normal[i].name + '</li>';
		$('.areaCountry').append(countryStr);
	};

	//国家地区点击的时候
	$(document).on("mouseenter", '.areaCountry>li', function(e) {
		var _index = $(this).index();
		$('.areaProvince').empty();
		$('.areaCity').empty()
		$('.areaCountry>li').removeClass('choseActive');
		$(this).addClass('choseActive');
		for (var i = 0; i < globalArea_normal[_index].children.length; i++) {
			var secondStr = '<li data-id="' + globalArea_normal[_index].children[i].id + '" data-pid="' + globalArea_normal[_index].children[i].pid + '">' + globalArea_normal[_index].children[i].name + '</li>';
			$('.areaProvince').append(secondStr);
		};
		e.stopPropagation();
	});



	//省份
	$(document).on("mouseenter", '.areaProvince>li', function(e) {
		$('.areaProvince>li').removeClass('colorActive');
		$(this).addClass('colorActive');
		if ($(this).parent().children().eq(0).text() == '北京市') {
			var _index = $(this).index();
			$('.areaCity').empty();
			for (var i = 0; i < globalArea_normal[0].children[_index].children.length; i++) {
				var s = globalArea_normal[0].children[_index].children[i];
				var thirdStr = '<li data-id="' + s.id + '" data-pid="' + s.pid + '">' + s.name + '</li>';
				$('.areaCity').append(thirdStr);
			};
		}
		e.stopPropagation();
	})

	//如果第一个不是北京市的时候
	$(document).on("click", '.areaProvince>li', function(e) {
		$('.areaProvince>li').removeClass('colorActive');
		$(this).addClass('colorActive');
		if ($(this).parent().children().eq(0).text() != '北京市') {
			var _pName = $(this).text();
			var _cName = $(this).parent().prev().children('.choseActive').text();
			var pid = $(this).attr('data-pid');
			var id = $(this).attr('data-id');
			$('.qz_qq').attr('data-pid', pid);
			$('.qz_qq').attr('data-id', id);
			$('.areaBtn').click();
			$('.choseBtn').html(_cName + '-' + _pName);
		}
		e.stopPropagation();
	})

	//城市点击的时候
	$(document).on("click", '.areaCity>li', function(e) {
		var _cityName = $(this).text();
		var _pName = $(this).parent().prev().children('.colorActive').text();
		var pid = $(this).attr('data-pid');
		var id = $(this).attr('data-id');
		$('.qz_qq').attr('data-pid', pid);
		$('.qz_qq').attr('data-id', id);
		$(".areaBtn").click();
		$('.choseBtn').html('中国-' + _pName + '-' + _cityName);
		e.stopPropagation();
	});
	$(document).on("click", '.qz_qq a', function(e) {
		$('.choseArea').fadeIn(300);
		$(".maskFix").show();
		if($(window).height() <= $(".choseArea").height()){
			$(".choseArea").css({
				marginTop:0,
				top:"0"
			})
		}
	});
	//选择框结束按钮
	$(document).on("click", '.areaBtn', function(e) {
		$('.choseArea').fadeOut(200);
		$(".maskFix").hide();
	});

	$(document).on("click", ".maskFix", function(e) {
		if ($(".maskCenter").css("display") == 'none') {
			$(".MoreLiving .More_l_del").click();
			$(".areaBtn").click();
		}
	})



	var imgType = "";
	$(document).on('click', '.circle_img', function(e) {
		$(".maskFix,.maskCenter").show();
		e.stopPropagation();
	})
	$(document).on("change", ".headImg", function() {
			var _this = this;
			if (!isFileType(["jpg", "png", "gif"], _this)) {
				friendlyMess("请上传jpg、png、gif格式的文件", "Y");
				return false;
			};
			if (!checkFileSize(_this, 3)) {
				friendlyMess("上传文件大于5M，请重新上传", "Y");
				return false;
			};
			imgType = isFileTypes(_this) //得到图片格式    裁剪用
				//获取上传的文件大小
			if (navigator.userAgent.indexOf("MSIE 6.0") < 0) {
				if (navigator.userAgent.indexOf("MSIE 7.0") < 0) {
					if (navigator.userAgent.indexOf("MSIE 8.0") < 0) {
						if (navigator.userAgent.indexOf("MSIE 9.0") < 0) {
							var file = $(this)[0].files[0];
							var fileSize = (Math.round(file.size / (1024 * 1024)));
						}
					}
				}
			}
			getUploadFileSize(this.id);
			imgUpload("headImg", {
				"type": 1,
				"size": fileSize
			});
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
			if (uploadFileH > uploadFileW && uploadFileH > 280) { //判断宽有没有二次缩放
				if (uploadFileW > 440) {
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

	function isFileType(arr, obj) {
		var ar = $(obj).val().split(".");
		var t = ar[ar.length - 1];
		for (var i in arr) {
			if (t == arr[i]) return true;
		};
		return false;
	};
	//得到文件类型     裁剪用
	function isFileTypes(obj) {
		var ar = $(obj).val().split(".");
		var t = (ar[ar.length - 1]);
		return t;
	};

	//上传
	var path = "",
		filename = "",
		jcropApi, imgForm = "";
	document.domain = "quanzinet.com";

	function imgUpload(id, data) {
		var pro = 0.01;
		var i = 0;
		var timer = null;
		$(".upLoading").show();
		$(".upLoading>span.name").html(html2Escape($("#" + id).val()));
		im.loadingOn();
		$.ajaxFileUpload({
			//type:"post",
			url: RestfulHOST() + "/files/uptopicfilesWeb", //处理文件上传操作的服务器端地址
			secureuri: false,
			fileElementId: id,
			dataType: 'json',
			timeout: 100000, //超时时间设置
			data: data,
			crossDomain: true,
			success: function(msg) {
				im.loadingOff();
				if (msg.status == 0) {
					//进度条加载
					window.clearInterval(timer);
					timer = window.setInterval(startTime, 1);

					function startTime() {
						pro += 0.0058;
						if (pro >= 1) {
							pro = 1;
							window.clearInterval(timer);
							$(".upLoading").hide();
							$(".headImgBox").show();
							$(".headImgBox").html('<img id="img" src="' + ImgHOST() + msg.filename + '">');
							$(".previewImg").html('<img src="' + ImgHOST() + msg.filename + '">');
							//获取图片名字
							path = $(".headImgBox img").attr("src"); //得到图片路径
							//从路径中截取图片名[包括后缀名]
							if (path.indexOf("/") > 0) //如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
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
								if (parseInt(coords.w) > 0) {
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
		if ($(".headImgBox").html().indexOf("img") > -1) { //判断是否有图片存在
			jcropApi.destroy(); //销毁裁剪
			$(".headImgBox").empty();
			$(".headImgBox").hide();
			$(".previewImg").empty();
			$(".maskFix,.maskCenter").hide();
		} else {
			$(".maskFix,.maskCenter").hide();
		}
	})
	
	//裁剪接口
	function hdadImgconfirm(datas) {
		im.loadingOn();
		$.ajax({
			type: "post",
			url: serviceHOST() + '/utils/cutCircleImage.do',
			async: true,
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: datas,
			success: function(msg) {
				im.loadingOff();
				if (msg.status == 0) {
					var personHeadImg = ImgHOST() + msg.data
					$(".create_img").attr("data-img", msg.data).html('<img src="' + personHeadImg + '"/>');
					friendlyMess("保存头像成功", "", function() {
						jcropApi.destroy(); //销毁裁剪
						$(".errors").click();
					})
				} else if (msg.status == -1 || msg.status == 1) {
					jcropApi.destroy(); //销毁裁剪
					$(".headImgBox").html("");
					$(".headImgBox").hide();
					$(".previewImg").html("");
					friendlyMess("保存头像失败", "Y", function() {
						$(".maskFix,.maskCenter").hide();
					}, 2000)
				}
			},
			error: function() {
				console.log("error")
			}
		});
	}

	//裁剪保存头像
	$(".rightBar p").on("click", function() {
		if ($(".headImgBox").html().indexOf("img") > -1) { //判断是否有图片存在    ,没有时
			nowImgW = $(".headImgBox>div>img").width();
			beforeW = beforeW || nowImgW;
			var zom = uploadFileW / beforeW;
			var x1 = Math.floor($("input[name='x1']").val() * zom);
			var y1 = Math.floor($("input[name='y1']").val() * zom);
			var w1 = Math.floor(($("input[name='x2']").val() - $("input[name='x1']").val()) * zom);
			w1 = Math.min(w1, uploadFileW); //宽不大于原始尺寸
			var h1 = Math.floor(($("input[name='y2']").val() - $("input[name='y1']").val()) * zom);
			h1 = Math.min(h1, uploadFileH); //高不大于原始尺寸

			hdadImgconfirm({
				"imagename": filename,
				"x": x1,
				"y": y1,
				"width": w1,
				"height": h1,
				"postfix": filename
			})

		} else {
			friendlyMess("您还没有上传图片,请上传图片", "Y");
		}
	})



	//保存推荐图标
	$(".determine button").on("click", function() {
		var _img = $(this).attr("data-img");
		//未选择图片时，默认第一张
		if (_img == "" || _img == undefined) {
			_img = 'PGRXC-f65f9b9f-ab73-43cf-8c91-d805906fca49';
		}
		$(".create_img").html('<img src="' + ImgHOST() + _img + '">');
		$(".create_img").attr("data-img", _img);
		$(".errors").click();
	})



	//选择圈子分类
	$(document).on("click", ".createlife p a.classification", function() {
		if ($("li.Category").length == 0) {
			ClassificationInterface();
		} else {
			$(".MoreLiving").show();
			$(".MoreLiving_01").show();
		}

	})
	$(document).on("click", ".MoreLiving .Living_list li.Category", function() {
		$(".MoreLiving .Living_list li.Category").css("borderColor", "#fff");
		$(this).css("borderColor", "red");
		$(".qz_place .qz_sh .cj_r a").html($(this).find("h5").html());
		$(".MoreLiving").hide();
	})



	// 创建圈子
	$(document).on("click", ".create_btn", function() {
		var fl = ""; //生活圈分类 	catetory
		var csbh = " "; //城市编号    	code
		var gjbh = ' '; //国家编号   	 pcode
		var mc = html2Escape($(".qz_name_cj input").val()) + "圈"; //圈子名称    	circlename
		var tx = $(".create_img").attr("data-img") || 'PGRXC-f65f9b9f-ab73-43cf-8c91-d805906fca49'; //用户头像
		var ms = html2Escape($(".Introduces").val()) || ""; //描述		  	content、
		var lts = $(".qz_chatroom").attr('data-id'); //是否创建聊天室Integer 
		var xz = $(".qz_choose .cj_r").attr("data-id");


		if ($(".qz_name_cj input").val() == "") {
			warningMessage('请填写圈子名称');
			return false;
		}

		// 选择圈子   1 生活圈    2 全球圈
		if (xz == 1) {
			var fl = $(".qz_place .qz_sh").attr("data-id");
		} else {
			var csbh = $(".qz_place .qz_qq").attr("data-id");
			var gjbh = $(".qz_place .qz_qq").attr("data-pid");
			if (csbh == undefined || gjbh == undefined) {
				warningMessage('请选择圈子地点');
				return false;
			}
		}
		createTheme(mc, tx, fl, ms, xz, csbh, gjbh, lts);
	})


	/*
	 
	 * 
	 *  创建圈子接口

	 	String username	用户名	17301379857
		String circlename	创建的圈子名称	
		String imagepath	圈子图像路径	
		Integer catetory	生活圈分类	1
		String content	圈子描述	打老虎
		Integer choose	选择圈子 1 ：生活圈   2：全球圈	1/ 2
		String code	城市编号	Null/ 2003
		String pcode	城市所在的国家编号	Null/20168
		Integer isCreategroup	是否创建聊天室
		 1：是
		 0 ：否	1

	 * */
	function createTheme(mc, tx, fl, ms, xz, csbh, gjbh, lts) {
		$.ajax({
			type: "post",
			url: serviceHOST() + '/userCircle/createCricle.do',
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: {
				username: UserName,
				circlename: mc,
				imagepath: tx,
				catetory: fl,
				content: ms,
				choose: xz,
				code: csbh,
				pcode: gjbh,
				isCreategroup: lts
			},
			success: function(msg) {
				if (msg.status == 0) {
					friendlyMessage("创建圈子成功", function() {
						$(".qz_name_cj input").val("");
						$(".Introduces").val("");
						var code = msg.data.circleId;
						if (xz == 1) {
							window.location.href = "/center/life/mydynamic.html?code=" + code
						} else {
							window.location.href = "/center/global/mydynamic.html?code=" + code
						}
					})
				} else {
					friendlyMessage(msg.info);
				}
			},
			error: function() {
				console.log("error")
			}

		});
	}


})