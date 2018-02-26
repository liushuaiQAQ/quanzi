$(function(){
		/*********************上传视频   发布视频****************************/
		if(getCookie("headImgkz")==""){
			$(".headPic img").attr("src","/img/first.png");
		}else{
			if(getCookie("headImgkz").indexOf("http")>-1){
				$(".headPic img").attr("src",getCookie("headImgkz"));
			}else{
				$(".headPic img").attr("src",ImgHOST()+getCookie("headImgkz"));
			}
		}
		var uses=getCookie("username")||"";
		var nicks=getCookie("nickname");
	if(getCookie("username")){            //用户已登录的视频                          //用户登录与否暂时用的是getCookie("username")
		var headImgsrs=getCookie("headImgkz")||"";        //用户头像
		/******************上传视频开始************************/
		function getcategoryList(){
			var str="";
			$.ajax({
				type:"post",
				url:serviceHOST()+"/videoCatetory/getAllVideoCatetories.do",
				headers: {
					"token": qz_token()
				},
				success:function(msg){
					if(msg.status==-3){
						getToken();
					};
						var len=msg.data.length;
						for(var i=0;i<len;i++){
							str+='<li data_id="'+msg.data[i].id+'" ><a href="javascript:;">'+msg.data[i].name+'</a></li>';
						}
						$(".libox ul").html(str)
				},
				error:function(){
					console.log("error");
				}
			});
		}
		getcategoryList();
		$(document).on('click',".libox ul li",function(){
			$(".chooseBtns").html("选择分类："+$(this).find("a").html());
			$(".chooseBtns").addClass("on");
			$(".chooseBtns").attr("dataId",$(this).attr("data_id"));
			if(getCookie("username")){
				if($(".chooseBtns").hasClass("on")&&!$(".fileNameVideo").is(":hidden")){
					$(".func a").addClass("on");
				}
			}
		})
		document.domain = "quanzinet.com";
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
		//判断文件类型
		function isFileType(arr, obj) {
			var ar = $(obj).val().split(".");
			var t = ar[ar.length - 1];
			for(var i in arr) {
				if(t == arr[i]) return true;
			};
			return false;
		};
		//	得到视频文件的名字
		function isFileName(obj) {
			var ar = $(obj).val().split(".");
			var _t = ar[0];
			var _n = _t.split("\\");
			var _m = _n[_n.length - 1].substring(0, 8) + "...";
			return _m;
		}
		//	上传视频
		$(".uploadVideo a,.fbsp").on('click',function(){
			$(".videoParent").toggle();
			$(".text_part_v textarea").val("");
			$(".fileNameVideo").hide();
			$(".fileBox").show();
			$("#uploadVideo").val("");
		})
		$(document).on("click", ".videoParent .fx_shut", function() {
			$(".videoParent").hide();
			$(".fileNameVideo").hide();
			$(".fileBox").show();
			$("#uploadVideo").val("");
			$(".text_part_v textarea").val("");
			$(".func a").removeClass('on');
			$(".chooseBtns").removeClass("on").attr("dataid","").html("选择分类");
			$(".videoUpLoading").html("视频上传中...");
			$(".msgWord span").show();
		})
			
		var fileSizeV = "";
		var videoDescribe="";
		var videoText="";     //内容
		var classIfy="";     //分类
		var videoName="";
		$(document).on("change", "#uploadVideo", function() {
			var _this = this;
			if(!isFileType(["mp4"],_this)) {
				knowMessage("仅支持mp4格式的文件");
				return false;
			};
			if(!checkFileSize(_this, 20)) {
				knowMessage("仅能上传小于20M的视频");
				return false;
			};
			var fileNames = isFileName(_this);
			$(".fileBox").hide();
			$(".fileNameVideo").show().html(fileNames + '<span></span>')
				//获取上传的文件大小
			if(navigator.userAgent.indexOf("MSIE 6.0") < 0) {
				if(navigator.userAgent.indexOf("MSIE 7.0") < 0) {
					if(navigator.userAgent.indexOf("MSIE 8.0") < 0) {
						if(navigator.userAgent.indexOf("MSIE 9.0") < 0) {
							var file = $(this)[0].files[0];
							fileSizeV = (Math.round(file.size / (1024 * 1024)));
						}
					}
				}
			};
			//上传视频
			imgUploadVideo("uploadVideo", {
				"size":fileSizeV
			});
		
		})
		
		$(document).on("click", ".fileNameVideo span", function() {
			$("#uploadVideo").val("");
			$(".fileNameVideo").hide();
			$(".fileBox").show();
			$(".func a").removeClass("on");
		});
		
	//	$(document).on("click",".special b",function(){
	//		if($(this).hasClass("on")){
	//			$(this).removeClass("on");
	//		}else{
	//			$(this).addClass("on");
	//		}
	//	})
		function imgUploadVideo(id, data) {    //视频上传
			$(".publish_video").hide();
			$(".upStatus").show();
			$(".uploadGro .barBg").css("width","0px");
			var pro = 0.01;
			var i = 0;
			var str = "";
			var timer = null;
			var videoUrl="";
			$.ajaxFileUpload({
				type:"post",
				url: RestfulHOST() + "/files/upVideoWeb",
				secureuri: false,
				fileElementId: id,
				dataType: 'json',
				timeout: 100000, //超时时间设置
				headers:{
					"Authorization":"AQAa5HjfUNgCr27x",
					"Content-Type":"multipart/form-data"
				},
				data: data,
				success: function(msg) {
					if(msg.status == 0) {
							//进度条加载
							window.clearInterval(timer);
							timer = window.setInterval(startTime, 1);
							function startTime(){
								pro += 0.0058;
								if(pro >= 1) {
									pro = 1;
									window.clearInterval(timer);
								}
								$(".NumPro").html((pro * 100).toFixed(2)+ "%");
								$(".uploadGro .barBg").css("width", pro * 360 + "px");
							}
							videoName=msg.filename;
							$(".videoUpLoading").html("视频上传成功");
							$(".msgWord span").hide();
							$(".upStatus").hide();
							$(".upSuccess").show();              //上传成功界面
						}
					},
					error: function() {
						window.clearInterval(timer);
						console.log("error");
					}
			})
			
			//执行进度条加载
			timer = window.setInterval(function() {
				pro = 1 - 300 / (300 + i++);
				$(".NumPro").html((pro * 100).toFixed(2)+ "%");
				$(".uploadGro .barBg").css("width", pro *360+ "px");
			}, 100);
		};
		
		function saveVideoWeb(parm){
			$.ajax({
				type:"post",
				url:RestfulHOST()+"/files/saveVideoWeb?"+parm,
//				data:datas,
				dataType: 'json',
				headers:{
					"Authorization":"AQAa5HjfUNgCr27x",
					"Content-Type":"multipart/form-data"
				},
				success:function(msg){
					if(msg.status==0){
						friendlyMessage("视频发表成功",function(){
							window.location.reload();
						});
					}else{
						warningMessage("发表视频失败");
					}
				},
				error:function(){
					warningMessage("发表视频失败");
				}
				
			});
		}
	
	$(document).on("click","#videoUpload",function(){
			videoText=html2Escape($(".text_part_v textarea").val());
			if($(".fileNameVideo").is(":hidden")){
				knowMessage("请上传视频文件");
				return false;
			};
			if(!$(".chooseBtns").hasClass("on")){
				knowMessage("请选择视频分类");
				return false;
			}
			classIfy=$(".chooseBtns").attr("dataid");
			if($(this).hasClass('on')){
				console.log(videoName)
				var datas={
					"username":getCookie("username"),
					"usernickname":getCookie("nickname"),
					"content":videoText,
					"locationX":"",
					"locationY":"",
					"address":"",
					"tag":classIfy,           //视频分类类型
					"filename":videoName,
					"avatar":headImgsrs,
					"size":fileSizeV
				};
				var parm=$.param(datas);
				saveVideoWeb(parm);
			};
		})
	
	
		//上传进度条页面的差号
		$(document).on("click",".upload2 .backErr",function(){
			$(".alertMsgBox,.stayLeave").show();
		//	$(".videoParent").hide(function(){
		//		location.reload();
		//	});
		})
		/**********************离开页面   留在页面*********************/
		$(document).on("click",".leavePage",function(){         //离开页面
		//	$(".stayLeave,.alertMsgBox").hide();
		//	$(".upStatus").hide();
		//	$(".publish_video").show();
		//	$(".videoParent").hide();
		//	$(".fileNameVideo").hide();
		//	$(".fileBox").show();
		//	$(".videoUpLoading").html("视频上传中...");
		//	$(".msgWord span").show();
		location.reload();
		})
		$(document).on("click",".stayPage",function(){
			$(".stayLeave,.alertMsgBox").hide();
		})
		$(document).on("click",".msgWord span",function(){
			$(".alertMsgBox").show();
			$(".alertMsg").show();
		})
		//取消视频上传   确定和取消按钮
		$(document).on("click",".btnYes",function(){
			location.reload();
		});
		$(document).on("click",".btnNo",function(){
			$(".alertMsgBox").hide();
			$(".alertMsg").hide();
		})
		//上传视频成功界面
		$(document).on('click',".upSuccess .backErr",function(){
			location.reload();
		})
		$(document).on('click',".upSuccess .kMsg",function(){
			$(".upSuccess").hide();              //上传成功界面
			$(".publish_video").show();
			if($(".chooseBtns").hasClass("on")&&!$(".fileNameVideo").is(":hidden")){
				$(".func a").addClass("on");
			}
		})
		/******************上传视频结束************************/
	} else{
		$(".uploadVideo a,.fbsp").addClass("login_window");
	}  //       用户已登录视频上传结束
	/*****视频分类列表接口开始*************/
	function getcategory(){
		var str="";
		$.ajax({
			type:"post",
			url:serviceHOST()+"/videoCatetory/getAllVideoCatetories.do",
			headers: {
				"token": qz_token()
			},
			success:function(msg){
					if(msg.status==-3){
						getToken();
					};
					var len=msg.data.length;
					for(var i=0;i<len;i++){
						str+='<li><a data_id="'+msg.data[i].id+'" href="javascript:;">'+msg.data[i].name+'</a></li>';
					}
					$(".videoClassification ul").html(str)
			},
			error:function(){
				console.log("error");
			}
		});
	}
	getcategory();
	/*****视频分类列表接口结束*************/
	/**************获取单个分类的视频列表开始***************/
	//下拉加载动态
	getVideolists(1,1);        //后面的1代表精选的id......
	var page = 1;
	var stop = false; //触发开关，防止多次调用事件 
	$(window).scroll(function(event) {
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height(); //整个文档的高度
		var windowHeight = $(this).height();

		if(scrollTop + windowHeight + 2 >= scrollHeight) {
			if(stop == true) {
				stop = false;
				$(".dynamic_list").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
				page = page + 1;
				getVideolists(page,catetoryIDs);
			}

		}
	})
	var catetoryIDs;
	$(document).on("click",".videoClassification ul li a",function(){
		$(".collectionVideo ul").empty();
		$(this).css("color","#ff8a00");
		$(this).parent("li").siblings("li").find("a").css("color","#666");
		catetoryIDs=$(this).attr("data_id");
		getVideolists(1,catetoryIDs);
	})
	
	function getVideolists(page,catetoryID){
		catetoryIDs = catetoryID;
		var useID="";
		if(getCookie("username")){
			useID=getCookie("username");
		}else{
			useID="";
		}
		$.ajax({
			type:"post",
			url:serviceHOST()+'/videoMaterial/getVideoByCatetory.do',
			dataType:"json",
			headers: {
				"token": qz_token()
			},
			data:{
				catetory:catetoryID,
				pageNum:page,
				username:uses
			},
			success:function(msg){
				$(".Toloadmore").remove();
				var str="";
				if(msg.status==0){
					stop = true;
					var len=msg.data.length;
					var subLen="";
					var mssg=msg.data
					var deailId="";
					if(mssg.length!=0){
						for(var i=0;i<len;i++){
							var briefs=mssg[i].brief
							deailId=mssg[i].id;
							if(briefs!="undefined"){
								if(briefs.length>34){
									subLen=briefs.substr(0,34)+"..."
								}else{
									subLen=briefs
								};
							}else{
								subLen="";
							}
							var visites = (Math.round((mssg[i].visites/ 10000) * 100)/100).toFixed(1)||0;
							str+='<li>'+
								'<div class="videoBox">';
							if(getCookie("username")){
								str+='<div class="videoImg" data-authorid="'+mssg[i].authorid+'" data-fromtype="'+mssg[i].fromtype+'" data-collection="'+mssg[i].iscollection+'" data-id="'+mssg[i].id+'">'+
										'<img src="'+mssg[i].vpicurl+'"/>'+
									'</div>';
							}else{
								str+='<div class="videoImg" data-collection="" data-id="'+mssg[i].id+'">'+
										'<img src="'+mssg[i].vpicurl+'"/>'+
								 	'</div>';
							}
							str+='<span class="playNum">'+visites+'万</span>'+
							'<span class="times"><i class="min"></i>'+":"+'<i class="sec"></i></span>'+
									'<div class="playimg" data-authorid="'+mssg[i].authorid+'" data-fromtype="'+mssg[i].fromtype+'" data-id="'+mssg[i].id+'"></div>'+
									'<div class="collectionIcon"></div>'+
									'<div class="opacityBg"></div>'+
								'</div>'+
								'<a class="brief" data-authorid="'+mssg[i].authorid+'" data-fromtype="'+mssg[i].fromtype+'" data-content="'+ (mssg[i].brief == 'undefined' ? '' : mssg[i].brief) +'" data-id="'+mssg[i].id+'" href="javascript:;">'+subLen+'</a>';
								if(mssg[i].authoravatar=='"null"'||mssg[i].authoravatar==''||mssg[i].authoravatar==null){
									str+='<p class="userName">'+'<i><img src="/img/first.png"/></i>'+mssg[i].author+'</p>';
								}else{
									var urls=ImgHOST()+mssg[i].authoravatar;        //用户头像
									if(mssg[i].authoravatar.indexOf("http")>-1){
										str+='<p class="userName">'+'<i><img src="'+mssg[i].authoravatar+'"/></i>'+mssg[i].author+'</p>';
									}else{
										str+='<p class="userName">'+'<i><img src="'+urls+'"/></i>'+mssg[i].author+'</p>'
									}
								}
								str+='<dl>';
//									'<dt>'+visites+'万'+'</dt>';
									var commentNum=mssg[i].comments;
									if(commentNum>10000){
										commentNum=change (commentNum);
									}else{
										commentNum=commentNum||0;
									}
									if(getCookie("username")){
										if(mssg[i].iscollection==1){     // 1是已收藏
											str+='<dd class="collect" data-id="'+mssg[i].id+'" data_isCol="'+mssg[i].iscollection+'">取消收藏</dd>';
											str+='<dd class="colloction">'+commentNum+'</dd>'+
													'<dd class="share">分享</dd>';
										}else{
											str+='<dd class="collect" data-id="'+mssg[i].id+'" data_isCol="'+mssg[i].iscollection+'">收藏</dd>';
											str+='<dd class="colloction">'+commentNum+'</dd>'+
													'<dd class="share">分享</dd>';
										}
										
									}else{
										str+='<dd class="collect" data-id="'+mssg[i].id+'" data_isCol="'+mssg[i].iscollection+'">收藏</dd>';
										str+='<dd class="colloction">'+commentNum+'</dd>'+
													'<dd class="share">分享</dd>';
									}
									
									str+='<br class="clear" />'+
								'</dl>'+
								'<div class="sharelink">'+
									'<div>'+
									'</div>'+
								'</div>'+
							'</li>'
						}
						$(".collectionVideo ul").append(str);
						if(page != 1) AfterTheLoadCompleted();   //侧导航下移 
					}else{
						stop = false;
						if($(".collectionVideo ul").has("li").length==0){
							$(".collectionVideo ul").append('<div class="data_null"><span></span><p>该分类尚无视频</p></div>');
//							$(".collectionVideo ul").css({
//								"background":"#fff",
//								"min-height":"719px",
//								"height":"auto"
//							})
						}
						
					}
				}else if(msg.status==-3){
					getToken();
				};
			},
			error:function(){
				console.log("error")
			}
		});
	};
	/**************获取单个分类的视频列表结束***************/

	/**************视频收藏接口开始*********************/
	$(document).on("click", ".collectionVideo .collect", function() {
		var _this=$(this);
			if (getCookie("username")) {
				var _thisCollction = $(this).attr("data_isCol"); //获取当前收藏的状态
				var _id=$(this).attr("data-id");
				if (_thisCollction == 0) { //未收藏
					$.ajax({
						type: "post",
						url: serviceHOST() + "/videoMaterial/vmcollection.do",
						dataType: "json",
						headers: {
							"token": qz_token()
						},
						data: {
							uid: getCookie("username"),
							vmid:_id
						},
						success: function(msg) {
							if (msg.status == 0) {
								if (msg.data == 1) { //1代表收藏成功     0表示已经收藏过，不可以再收藏
									friendlyMessage("收藏成功", function() {
										_this.html("取消收藏").attr("data_isCol", 1);
//										_this.parents("dl").find("dd").css("margin-left","10px");
										_this.parents("li").find(".videoBox").find(".videoImg").attr("data-collection",1);
									});
								}
							}else if(msg.status==-3){
								getToken();
							};
						},
						error: function() {
							console.log("error")
						}

					});
				} else if (_thisCollction == 1) { //取消收藏
					$.im.confirm("确定要取消收藏吗？", function() {
						$.ajax({
							type: "post",
							url: serviceHOST() + "/videoMaterial/cancelVmCollection.do",
							dataType: "json",
							headers: {
								"token": qz_token()
							},
							data: {
								uid: getCookie("username"),
								vmid:_id
							},
							success: function(msg) {
								if (msg.status == 0) {
									if (msg.data == 1) {
										_this.html("收藏").attr("data_isCol", 0);
//										_this.parents("dl").find("dd").css("margin-left","20px");
										_this.parents("li").find(".videoBox").find(".videoImg").attr("data-collection",0);
									}
								}else if(msg.status==-3){
									getToken();
								};
							},
							error: function() {
								console.log("error")
							}

						});
					})

				}
			} else {
				$(".userLogin a").click();
			}
		})
	/**************视频收藏接口结束*********************/
	/**************获取视频素材列表接口**********************/
	//下拉加载动态
//	getVideolists(1);
//	var page = 1;
//	var stop = false; //触发开关，防止多次调用事件 
//	$(window).scroll(function(event) {
//		var scrollTop = $(this).scrollTop();
//		var scrollHeight = $(document).height(); //整个文档的高度
//		var windowHeight = $(this).height();
//
//		if(scrollTop + windowHeight + 2 >= scrollHeight) {
//			if(stop == true) {
//				stop = false;
//				$(".collectionVideo").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
//				page = page + 1;
//				getVideolists(page);
//			}
//
//		}
//	})
//	function getVideolists(page){
//		var str="";
//		var useID="";
//		if(getCookie("username")){
//			useID=getCookie("username");
//		}else{
//			useID="";
//		}
//		$.ajax({
//			type:"post",
//			url:serviceHOST()+'/getVmByPage.do',
//			dataType:"json",
//			data:{
//				uid:useID,
//				vname:"",
//				pageNum:page
//			},
//			success:function(msg){
//				$(".Toloadmore").remove();
//				if(msg.status==0){
//					stop = true;
//					var len=msg.data.length;
//					var subLen="";
//					var mssg=msg.data
//					for(var i=0;i<len;i++){
//						var briefs=mssg[i].brief
//						if(briefs.length>36){
//							subLen=briefs.substr(0,36)+"..."
//						}else{
//							subLen=briefs
//						};
//						var visites = (Math.round((mssg[i].visites/ 10000) * 100)/100).toFixed(1);
//						str+='<li>'+
//							'<div class="videoBox">'+
//								'<video class="videoDur" src="'+mssg[i].vurl+'" style="display:none;"></video>';
//						if(getCookie("username")){
//							str+='<div class="videoImg" data-collection="'+mssg[i].iscollection+'" data-id="'+mssg[i].id+'">'+
//									'<img src="'+mssg[i].vpicurl+'"/>'+
//								'</div>';
//						}else{
//							str+='<div class="videoImg" data-collection="" data-id="'+mssg[i].id+'">'+
//									'<img src="'+mssg[i].vpicurl+'"/>'+
//								'</div>';
//						}
//						str+='<span class="times"><i class="min"></i>'+":"+'<i class="sec"></i></span>'+
//								'<div class="playimg" data-id="'+mssg[i].id+'"></div>'+
//								'<div class="collectionIcon"></div>'+
//								'<div class="opacityBg"></div>'+
//							'</div>'+
//							'<a class="brief" data-id="'+mssg[i].id+'" href="javascript:;">'+subLen+'</a>';
//							if(mssg[i].authoravatar=='"null"'||mssg[i].authoravatar==''||mssg[i].authoravatar==null){
//								str+='<p class="userName">'+'<i><img src="/img/first.png"/></i>'+mssg[i].author+'</p>';
//							}else{
//								var urls=ImgHOST()+mssg[i].authoravatar;        //用户头像
//								if(mssg[i].authoravatar.indexOf("http")>-1){
//									str+='<p class="userName">'+'<i><img src="'+mssg[i].authoravatar+'"/></i>'+mssg[i].author+'</p>';
//								}else{
//									str+='<p class="userName">'+'<i><img src="'+urls+'"/></i>'+mssg[i].author+'</p>'
//								}
//							}
//							str+='<dl>'+
//								'<dt>'+visites+'万次播放'+'</dt>'+
//								'<dd class="share">分享</dd>'+
//								'<dd class="colloction">'+mssg[i].comments+'</dd>'+
//								'<br class="clear" />'+
//							'</dl>'+
//							'<div class="sharelink">'+
//								'<a class="share1" href="javascript:;">圈子朋友圈</a>'+
//								'<a class="share2" href="javascript:;">圈子好友</a>'+
//								'<a class="share3" href="javascript:;">圈子群组</a>'+
//								'<a class="share4" href="javascript:;">微信好友</a>'+
//								'<a class="share5" href="javascript:;">微信朋友圈</a>'+
//								'<a class="share6" href="javascript:;">QQ空间</a>'+
//								'<a class="share7" href="javascript:;">QQ好友</a>'+
//								'<a class="share8" href="javascript:;">新浪微博</a>'+
//							'</div>'+
//						'</li>'
//					}
//					$(".collectionVideo ul").append(str+'<br class="clear">');
//					//获取视频时长；   太卡先去除
////					var durLen=$(".collectionVideo ul li video").length;
////					console.log(durLen)
////					var tol="";
////					for(var i=0;i<durLen;i++){
////						$("video")[i].addEventListener("loadedmetadata", function(){
////						    tol = this.duration;//获取总时长
////						    var minutes = parseInt(tol/ 60, 10);
////						    var seconds = parseInt(tol % 60);
////						    if(minutes<10){
////						    	var _m="0"+minutes
////						    }else{
////						    	var _m=minutes
////						    };
////						    if(seconds<10){
////						    	var _s="0"+seconds
////						    }else{
////						    	var _s=seconds
////						    }
////						 	$(this).siblings(".times").find(".min").text(_m);
////						 	$(this).siblings(".times").find(".sec").text(_s);
////					  });
////						 
////					}
//					
//				}
//			},
//			error:function(){
//				console.log("error")
//			}
//		});
//	};
	
	//鼠标悬浮     收藏和播放按钮变化
	$(document).on("mouseover",".videoImg",function(){     //移入
		$(this).parents(".videoBox").find(".playimg").css("background","url(/img/qz_sp_bofang_xuanzhong.png) no-repeat")
	})
	$(document).on("mouseout",".videoImg",function(){     //移出
		$(this).parents(".videoBox").find(".playimg").css("background","url(/img/qz_sp_bofang.png) no-repeat")
	})
	$(document).on("click",".videoImg,.brief,.playimg",function(){
		var videoId=$(this).attr("data-id");
		var userid=$(this).attr("data-authorid");
		var fromtype=$(this).attr("data-fromtype");
		window.location.href="/center/videodetail.html?id="+videoId+"&userid="+userid+"&fromtype="+fromtype;
	})
	//分享出现
	$(document).on("click",".share",function(e){
		e.stopPropagation();
		$(this).parents("li").siblings().find(".sharelink").hide();
		if(uses){
			var transmit='<a class="share1" href="javascript:;">圈子朋友圈</a>'+
			'<a class="share2" href="javascript:;">圈子好友</a>'+
			//'<a class="share3" href="javascript:;">圈子群组</a>';
			'<a class="share9" href="javascript:;">首页热门</a>'+
			'<a class="share5" href="javascript:;"><span>微信朋友圈</span>'+
			'<div class="qrodeBox">'+
				'<p>分享到微信朋友圈</p>'+
				'<div></div>'+
			'</div>'+
			'</a>'+
			'<a class="share6" href="javascript:;">QQ空间</a>'+
			'<a class="share7" href="javascript:;">QQ好友</a>'+
			'<a class="share8" href="javascript:;">新浪微博</a>';
		}else{
			var transmit='<a class="share1 login_window" href="javascript:;">圈子朋友圈</a>'+
			'<a class="share2 login_window" href="javascript:;">圈子好友</a>'+
			//'<a class="share3" href="javascript:;">圈子群组</a>';
			'<a class="share9 login_window" href="javascript:;">首页热门</a>'+
			'<a class="share5" href="javascript:;"><span>微信朋友圈</span>'+
			'<div class="qrodeBox">'+
				'<p>分享到微信朋友圈</p>'+
				'<div></div>'+
			'</div>'+
			'</a>'+
			'<a class="share6" href="javascript:;">QQ空间</a>'+
			'<a class="share7" href="javascript:;">QQ好友</a>'+
			'<a class="share8" href="javascript:;">新浪微博</a>';
		};
		
		$(this).parents("dl").siblings(".sharelink").toggle();
		$(this).parents("li").find(".sharelink").find("div").html(transmit);
		//生成微信朋友圈二维码
		var viId=$(this).parents("dl").siblings(".brief").attr("data-id");
		var urls=serHOST()+"/Page/videoShare/index.html?uid="+uses+"&vmid="+viId
		$(this).parents("dl").siblings(".sharelink").find(".qrodeBox div").qrcode({
			render: "canvas",
    		width: 30*4,
    		height:30*4,
			text: urls
		});
		$(this).parents("li").find(".sharelink").show();
		//让底部的转发下拉菜单定位到上边防止滑动到微信朋友圈时闪烁出现
		//console.log($(this).offset().top,$(document).height())
		if($(this).offset().top + 300 >= $(document).height()){
			$(".sharelink").css("top","-40px");
		}else{
			$(".sharelink").css("top","270px");
		}
	})
	$(document).on("click",function(e){
		e.stopPropagation();
		$(".sharelink").hide();
	})
	$(document).on("click",".sharelink",function(e){
		e.stopPropagation();
	})
	
	
	
		
})
