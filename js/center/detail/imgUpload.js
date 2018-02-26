$(function(){
	var imgType = "";
	var fileSize = "";
	
	
	$(document).on('click','.founder',function(e){
		$(".maskFix,.maskCenter").show();
		e.stopPropagation();
	})

	$(document).on("change",".headImg",function(){
		var _this = this;
		if(!isFileType(["jpg","png","gif"],_this)){
			friendlyMess("请上传jpg、png、gif格式的文件","Y");
			return false;
		};
		if(!checkFileSize(_this,5)){
			friendlyMess("上传文件大于5M，请重新上传","Y");
			return false;
		};
		imgType = isFileTypes(_this)      //得到图片格式    裁剪用
		//获取上传的文件大小
		if(navigator.userAgent.indexOf("MSIE 6.0") < 0 ){
			if(navigator.userAgent.indexOf("MSIE 7.0") < 0 ){
				if(navigator.userAgent.indexOf("MSIE 8.0") < 0 ){
					if(navigator.userAgent.indexOf("MSIE 9.0") < 0 ){
						var file = $(this)[0].files[0];
						fileSize = (Math.round(file.size/ (1024 * 1024)));
					}
				}
			}
		}
		getUploadFileSize(this.id);
		imgUpload("headImg",{
			"type":1,     
			"size":fileSize
		});
	})
	//获取上传图片宽度
	var uploadFileW="";//上传图片的原始宽度
	var uploadFileH="";//上传图片的原始宽度
	var nowImgW="";//图片加载完成后的尺寸
	var beforeW="";//图片未加载完成前的宽度
	function getUploadFileSize(id){
		var f = document.getElementById(id).files[0];
		var img = document.createElement("img");
		img.file = f;
		img.onload=function(){
			uploadFileW = this.width;
			uploadFileH = this.height;
			if(uploadFileH > uploadFileW && uploadFileH > 280){//判断宽有没有二次缩放
				if(uploadFileW > 440){
					beforeW = 440;
				}else{
					beforeW = uploadFileW;
				};
			};
		}
		var reader = new FileReader();
		reader.onload = function(e){
			img.src = e.target.result;
		};
		reader.readAsDataURL(f);
	};

	function isFileType(arr,obj){
		var ar=$(obj).val().split(".");
		var t=ar[ar.length-1];
		for(var i in arr){
			if(t==arr[i]) return true;
		};
		return false;
	};
	//得到文件类型     裁剪用
	function isFileTypes(obj){
		var ar=$(obj).val().split(".");
		var t=(ar[ar.length-1]);
		return t;
	};
	//上传
	var path = "",filename = "",jcropApi,imgForm = "";
	document.domain="quanzinet.com";
	function imgUpload(id,data){
		var pro = 0.01;
		var i = 0;
		var timer = null;
		$(".upLoading").show();
		$(".upLoading>span.name").html($("#" + id).val());
		im.loadingOn();
		$.ajaxFileUpload({
			//type:"post",
			url:RestfulHOST()+"/files/uptopicfilesWeb",//处理文件上传操作的服务器端地址
			secureuri:false,
			fileElementId: id,
			dataType:'json',
			timeout:100000, //超时时间设置
			data:data,
			crossDomain : true,
			success:function( msg ){
				im.loadingOff();
				if( msg.status == 0 ){
					//进度条加载
					window.clearInterval(timer);
					timer = window.setInterval(startTime, 1);
					function startTime(){
						pro += 0.0058;
						if(pro >= 1) {
							pro = 1;
							window.clearInterval(timer);
							$(".upLoading").hide();
							$(".headImgBox").show();
							$(".headImgBox").html('<img id="img" src="'+ImgHOST()+msg.filename+'">');
							$(".previewImg").html('<img src="'+ImgHOST()+msg.filename+'">');
							//获取图片名字
							path = $(".headImgBox img").attr("src");  //得到图片路径
							//从路径中截取图片名[包括后缀名]
							if(path.indexOf("/")>0)//如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
							{
								filename = path.substring(path.lastIndexOf("/")+1,path.length);
							}
							else
							{
								filename = path;
							}

							/****************图片裁剪*****************/
							$(".headImgBox img").Jcrop({
								onChange:showPreview,
								onSelect:showPreview,
								setSelect:[ 0, 0,80,80],
								aspectRatio:1,
								boxWidth:440,
								boxHeight:280
							},function() {
								jcropApi = this;
							});
							function showPreview(coords){
								$('input[name="x1"]').val(coords.x);
								$('input[name="y1"]').val(coords.y);
								$('input[name="x2"]').val(coords.x2);
								$('input[name="y2"]').val(coords.y2);
								$('input[name="w"]').val(coords.w);
								$('input[name="h"]').val(coords.h);
								if(parseInt(coords.w) > 0){
									//计算预览区域图片缩放的比例，通过计算显示区域的宽度(与高度)与剪裁的宽度(与高度)之比得到
									var rx = $(".previewImg").width() / coords.w;
									var ry = $(".previewImg").height() / coords.h;
									//通过比例值控制图片的样式与显示
									$(".previewImg img").css({
										width:Math.round(rx * $(".headImgBox img").width()) + "px",	//预览图片宽度为计算比例值与原图片宽度的乘积
										height:Math.round(ry * $(".headImgBox img").height()) + "px",  //预览图片高度为计算比例值与原图片高度的乘积
										marginLeft:"-" + Math.round(rx * coords.x) + "px",
										marginTop:"-" + Math.round(ry * coords.y) + "px"
									});
								};
								//让图片居中显示
								var divh=Number($(".headImgBox>div").height());
								var divw=Number($(".headImgBox>div").width());
								$(".headImgBox>div").css({"left":(440-divw)/2+"px","top":(280-divh)/2+"px"});
							}
						};
						$(".upLoading .pro").html((pro * 100).toFixed(2) + "%");
						$(".upLoading .progress .bar").css("width", pro * 146 + "px");
					}


				}
			},
			error:function(){ //服务器响应失败时的处理函数
				window.clearInterval(timer);
				console.log("error");
			}
		});
		$(".stopErr").on("click",function(){
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
	$(".errors").on("click",function(){
		if($(".headImgBox").html().indexOf("img")>-1){   //判断是否有图片存在
			jcropApi.destroy();    //销毁裁剪
			$(".headImgBox").html("");
			$(".headImgBox").hide();
			$(".previewImg").html("");
			$(".maskFix,.maskCenter").hide();
		}else{
			$(".maskFix,.maskCenter").hide();
		}
	})
	//裁剪接口
	function hdadImgconfirm(datas){
		im.loadingOn();
		$.ajax({
			type:"post",
			url:serviceHOST()+'/utils/cutCircleImage.do',
			async:true,
			dataType:"json",
			headers: {
				"token": qz_token()
			},
			data:datas,
			success:function(msg){
				im.loadingOff();
				if(msg.status==-3){
					getToken();
				};
				updateCircleImage(msg.data)
			},
			error:function(){
				console.log("error")
			}
		});
	}

	//裁剪保存头像
	$(".rightBar p").on("click",function(){
		if($(".headImgBox").html().indexOf("img") > -1){   //判断是否有图片存在    ,没有时
			nowImgW=$(".headImgBox>div>img").width();
			beforeW = beforeW || nowImgW;
			var zom = uploadFileW / beforeW;
			var x1 = Math.floor($("input[name='x1']").val()*zom);
			var y1 = Math.floor($("input[name='y1']").val()*zom);
			var w1= Math.floor(($("input[name='x2']").val()-$("input[name='x1']").val())*zom);
			w1 = Math.min(w1,uploadFileW);//宽不大于原始尺寸
			var h1 = Math.floor(($("input[name='y2']").val()-$("input[name='y1']").val())*zom);
			h1 = Math.min(h1,uploadFileH);//高不大于原始尺寸
			var w1 = Math.floor(($("input[name='x2']").val()-$("input[name='x1']").val())*zom);
			w1 = Math.min(w1,uploadFileW);//宽不大于原始尺寸
			var h1 = Math.floor(($("input[name='y2']").val()-$("input[name='y1']").val())*zom);
			h1 = Math.min(h1,uploadFileH);//高不大于原始尺寸
			

			hdadImgconfirm({
				"imagename":filename,
				"x":x1,
				"y":y1,
				"width":w1,
				"height":h1,
				"postfix":filename
			})

		}else{
			friendlyMess("您还没有上传图片,请上传图片","Y");
		}
	})





	//修改圈子头像 updateCircleImage
	function updateCircleImage(img){
		var _oldimg = $(".circle_img img").attr("data-src");
		var category = $(".right_top .circle_name").attr("data-category");
		$.ajax({
			type:"post",
			url:serviceHOST()+'/utils/updateCircleImage.do',
			async:true,
			dataType:"json",
			headers: {
				"token": qz_token()
			},
			data:{
				circleNo:getURIArgs("code"),
				imagename:img,
				oldimagename:_oldimg,
				size:fileSize,
				category:Number(category)
			},
			success:function(msg){
				im.loadingOff();
				if(msg.status == 0){
					friendlyMessage("修改头像成功",function(){
						$(".errors").click();
						$('.circle_img img').attr('src',ImgHOST() + msg.data);
					})
				}else if(msg.status==-3){
					getToken();
				}else{
					warningMessage(msg.info);
				}
			},
			error:function(){
				console.log("error")
			}
		});
	}





})