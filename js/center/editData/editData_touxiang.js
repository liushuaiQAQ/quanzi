$(function() {
	//头像上传
	$(".bgHead").on("click", function() {
		$(".maskFix,.maskCenter").show();
	})
	var flag = false;
	//页面加载默认头像
	/************************查询个人资料信息 头像************************/
	findUserInformation({
		"myname": UserName,
		"username": UserName
	})
	var sizeImg = "";
	var imgs = "";
	var lenHead = "";

	function findUserInformation(datas) {
		//im.localLoadingOn(".main_right")    //局部开启
		$.ajax({
			type: "post",
			url: serviceHOST() + "/user/findUserInformationEx.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: datas,
			success: function(msg) {
				//im.localLoadingOff(".main_right")        //关闭
				var str = "";
				var strBg = "";
				if (msg.status == 0) {
					//$("#head_subImgPath").attr("src",msg.data.subimgpath);     //顶部用户头像
					lenHead = msg.data.imgforheadlist;
					if (lenHead.length == 0) {
						str = '<div class="headIMG JSdel">' +
							'<div class="imgPer"><img src="/img/touxiang_default.png"></div>' +
							//								'<div class="chooses">'+
							//									'<span class="dels">删除</span>'+
							//									'<div class="uploadImg">'+
							//										'<span>上传</span>'+
							//										'<input type="file" name="file" id="file_qz"/>'+
							//									'</div>'+
							//								'</div>'+
							'</div>';
						$(".bgHead").before(str);
						setCookie("headImgkz", "");
					} else if (lenHead.length >= 1) {
						if (lenHead.length == 1 && lenHead[0].imagepath == "") {
							str = '<div class="headIMG JSdel">' +
								'<div class="imgPer"><img src="/img/touxiang_default.png"></div>' +
								'</div>';
							$(".bgHead").before(str);
							setCookie("headImgkz", "");
						} else {
							var lens = lenHead.length
							imgs = lenHead[lens - 1].imagepath
								//console.log(imgs)
							str += '<div class="headIMG" data_url="' + imgs + '" data_id="' + msg.data.imgforheadlist[0].pictureNo + '" data_size="' + msg.data.imgforheadlist[0].size + '">' +
								'<div class="imgPer"><img src="' + ImgHOST() + imgs + '"></div>' +
								'<div class="chooses">' +
								'<div class="uploadImg">' +
								'<span>上传</span>' +
								'</div>' +
								'</div>' +
								'</div>';
							$(".bgHead").before(str);
							$(".bgHead").hide();
						}
					}
					//					else if(lenHead.length>1){
					//						for(var i=0;i<lenHead.length;i++){
					//							imgs=lenHead[i].imagepath
					//							str+='<div class="headIMG" data_url="'+imgs+'" data_id="'+msg.data.imgforheadlist[i].pictureNo+'" data_size="'+msg.data.imgforheadlist[i].size+'">'+
					//									'<div class="imgPer"><img src="'+ImgHOST()+imgs+'"></div>'+
					//									'<div class="chooses">'+
					//										'<span class="dels">删除</span>'+
					//										'<div class="uploadImg">'+
					//											'<span>上传</span>'+
					//										'</div>'+
					//									'</div>'+
					//								'</div>';
					//						}
					//						
					//						$(".bgHead").before(str);
					//						setCookie("headImgkz",msg.data.imgforheadlist[0].imagepath,30*24*60);
					//							if($(".touxiang_default .headIMG").length>=8){
					//							$(".touxiang_default .bgHead").hide();
					//						}else{
					//							$(".touxiang_default .bgHead").show();
					//						}
					//					}
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error");
			}
		});
	}
	document.domain = "quanzinet.com";
	$(document).on("click", '.bgHead', function() {
			if ($(".headImgBox").html().indexOf("img") > -1) { //判断是否有图片存在
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
	var imgType = "";
	//	得到图片文件的名字
	//	function isFileName(obj) {
	//		var ar = $(obj).val().split(".");
	//		var _t = ar[0];
	//		var _n = _t.split("\\");
	//		var _m = _n[_n.length - 1].substring(0, 8) + "...";
	//		return _m;
	//	}
	$(document).on("change", ".headImg", function() {
			var _this = this;
			if (!isFileType(["jpg", "png", "gif"], _this)) {
				friendlyMess("请上传jpg、png、gif格式的文件", "Y");
				return false;
			};
			if (!checkFileSize(_this, 5)) {
				friendlyMess("上传文件大于5M，请重新上传", "Y");
				return false;
			};

			imgType = isFileTypes(_this) //得到图片格式    裁剪用
				//var fileNames = isFileName(_this);
				//console.log(fileNames);
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

			if (FileReader) {
				var reader = new FileReader(),
					file = this.files[0];
				reader.onload = function(e) {
					var image = new Image();
					image.src = e.target.result;
					image.onload = function() {
						if (image.width < 440 && image.height < 280) {
							warningMessage("头像宽高不能小于440");
							return false;
						} else {
							imgUpload("headImg", {
								"id": getCookie("username"),
								"type": 2, //2为上传头像
								"size": fileSize
							});
						}
					}
				};
				reader.readAsDataURL(file);
			}
			getUploadFileSize(this.id);

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

	//判断文件大小
	function checkFileSize2(obj, size) {
		if (navigator.userAgent.indexOf("MSIE 6.0") < 0) {
			if (navigator.userAgent.indexOf("MSIE 7.0") < 0) {
				if (navigator.userAgent.indexOf("MSIE 8.0") < 0) {
					if (navigator.userAgent.indexOf("MSIE 9.0") < 0) {
						var file = $(obj)[0].files[0];
						var fileSize = (Math.round(file.size / (1024 * 1024)));
						if (fileSize > size) {
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
				$(".headImgBox").html("");
				$(".headImgBox").hide();
				$(".previewImg").html("");
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
			url: serviceHOST() + '/utils/cutImage.do',
			async: true,
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: datas,
			success: function(msg) {
				im.loadingOff();
				if (msg.status == 0) {
					var str = "";
					var personHeadImg = msg.data;
					//				if($(".rightBar p").hasClass("onImg")){      //图片替换
					//					$.ajax({
					//						type:"post",
					//						url:serviceHOST()+"/handlerImage.do",
					//						dataType:"json",
					//						data:{
					//							type:2,
					//							primaryTalbeNo:getCookie("username"),
					//							imagepath:head.pictureUrl,
					//							size:head.pictureSize,
					//							branchTableNo:head.pictureNO,
					//							operation:2
					//						},
					//						success:function(msgs){
					//							if(msgs.status==0){
					//								head._this.parents(".chooses").siblings(".imgPer").find("img").attr("src",personHeadImg);
					//								head._this.parents(".chooses").siblings(".imgPer").find("img").attr("src");
					//								friendlySuccessMsg("您已保存成功",function(){
					//									location.reload();
					//								})
					//							}
					//						},
					//						error:function(){
					//							console.log('error');
					//						}
					//					});
					//				}else{ 
					//					if($(".headIMG").hasClass("JSdel")){
					//						$(".JSdel").hide()
					//					}
					//					str='<div class="headIMG">'+
					//							'<div class="imgPer"><img src="'+personHeadImg+'"></div>'+
					//							'<div class="chooses">'+
					//								'<div class="uploadImg">'+
					//									'<span>上传</span>'+
					//								'</div>'+
					//							'</div>'+
					//						'</div>';
					//					$(".bgHead").before(str)
					//					if($(".touxiang_default .headIMG").length>=8){
					//						$(".touxiang_default .bgHead").hide();
					//					}else{
					//						$(".touxiang_default .bgHead").show();
					//					}
					$(".maskFix,.maskCenter").hide();
					friendlySuccessMsg("您已保存成功", function() {
						jcropApi.destroy(); //销毁裁剪
						window.location.reload();
					})
					setCookie("headImgkz", personHeadImg, 24 * 60);
				} else if (msg.status == -1 || msg.status == 1) {
					friendlyErrsMsg("头像保存失败，请重新上传头像", function() {
						window.location.reload();
					}, 2000);
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
		if ($(".headImgBox").html().indexOf("img") > -1) { //判断是否有图片存在    ,没有时
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
			if ($(".rightBar p").hasClass("onImg")) { //图片替换
				hdadImgconfirm({
					"username": getCookie("username"),
					"imagename": filename,
					"x": x1,
					"y": y1,
					"width": w1,
					"height": h1,
					"postfix": filename,
					"oldimagename": head.pictureUrl,
				})
			} else {
				hdadImgconfirm({
					"username": getCookie("username"),
					"imagename": filename,
					"x": x1,
					"y": y1,
					"width": w1,
					"height": h1,
					"postfix": filename,
					"oldimagename": "",
				});
			}
		} else {
			friendlyMess("您还没有上传图片,请上传图片", "Y");
		}
	})


	//	图片删除接口
	//	$(document).on("click",".dels",function(){
	//		var _this=$(this);
	//		var pictureNO=$(this).parents(".headIMG").attr("data_id");
	//		var pictureSize=$(this).parents(".headIMG").attr("data_size");
	//		var pictureUrl=$(this).parents(".headIMG").attr("data_url");
	////		console.log(pictureNO)
	////		console.log(pictureSize)
	////		console.log(pictureUrl)
	//		var str="";
	//		$.ajax({
	//			type:"post",
	//			url:serviceHOST()+"/handlerImage.do",
	//			dataType:"json",
	//			data:{
	//				type:2,
	//				primaryTalbeNo:getCookie("username"),
	//				imagepath:pictureUrl,
	//				size:pictureSize,
	//				branchTableNo:pictureNO,
	//				operation:0
	//			},
	//			success:function(msg){
	//				if(msg.status==0){
	//					_this.parents(".headIMG").remove();
	//					friendlySuccessMsg("您已删除成功",function(){
	//						location.reload();
	//					})
	//				}else{
	//					friendlyErrsMsg("删除失败")
	//				}
	//			},
	//			error:function(){
	//				console.log('error');
	//			}
	//		});
	//	})

	//图片修改上传
	var head = {
		"_this": "",
		"pictureNO": "",
		"pictureSize": "",
		"pictureUrl": ""
	}
	$(document).on("click", '.headIMG .uploadImg span', function() {
		$(".rightBar p").addClass("onImg");
		head._this = $(this);
		head.pictureNO = $(this).parents(".headIMG").attr("data_id");
		head.pictureSize = $(this).parents(".headIMG").attr("data_size");
		head.pictureUrl = $(this).parents(".headIMG").attr("data_url");
		if ($(".headImgBox").html().indexOf("img") > -1) { //判断是否有图片存在
			$(".headImgBox").html("");
			$(".headImgBox").hide();
			$(".previewImg").html("");
			$(".maskFix,.maskCenter").show();
		} else {
			$(".maskFix,.maskCenter").show();
		}
	})



	//	图片修改接口
	//	var head={
	//		"_this":"",
	//		"pictureNO":"",
	//		"pictureSize":"",
	//		"pictureUrl":""
	//	}
	//	$(document).on("click",".headIMG .uploadImg span",function(){
	//		$(".rightBar p").addClass("onImg");
	//		head._this=$(this);
	//		head.pictureNO=$(this).parents(".headIMG").attr("data_id");
	//		head.pictureSize=$(this).parents(".headIMG").attr("data_size");
	//		head.pictureUrl=$(this).parents(".headIMG").attr("data_url");
	//	})

})