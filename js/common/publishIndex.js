
/*
*
*  上传图片=========
*/
$(document).on("change", "#uploadMass", function() {
	var _this = this;
	if(!isFileType(["jpg", "png", "gif"], _this)) {
		knowMessage("请上传jpg、png、gif格式的文件");
		return false;
	};
	if(!checkFileSize(_this, 5)) {
		knowMessage("上传文件大于5M，请重新上传");
		return false;
	};
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
	var files = _this.files;
	var fs = files.length;
	if(fs > 9) {
		alert("上传的文件数量不能超过9个！请重新选择！");
		return false;
	}
	imgUpload("uploadMass", fs, {
		"type": 64, 
		"size": fileSize
	});
})


/*
 
 * 图片帖 上传插件
 * */
var ImageList = [];
document.domain = "quanzinet.com";

function imgUpload(id, fs, data) {

	//  计算上传多张图片  默认图
	if((9 - $(".picture_list li").length) <= fs) {
		fs = 9 - $(".picture_list li").length;
	}

	for(var i = 0; i < fs; i++) {
		$(".fx_picture .picture_list").append('<li class="exhibition_d"><i class="upload_img_i"></i></li>'); //未加载时默认图片
	}

	//最多上传九张
	if(ImageList.length + fs >= 9){
		$(".kind .fx_plus").hide();
	}

	$.ajaxFileUpload({
		//type:"post",
		url: RestfulHOST() + "/files/uptopicfilesWeb",
		secureuri: false,
		fileElementId: id,
		dataType: 'json',
		timeout: 100000, //超时时间设置
		data: data,
		success: function(msg) {
			var filenames = "";
			$(".exhibition_d").remove();
			if($("#FaceBoxText").val() == "") {
				$("#FaceBoxText").val("#分享图片#");
			}
			var num = ImageList.length;

			//显示图片数量
			
			if((9 - num) >= msg.filename.length) {
				filenames = msg.filename.length
			} else {
				filenames = 9 - num;
			}

			for(var i = 0; i < filenames; i++) {
				ImageList.push(msg.filename[i]);

				$(".fx_picture .picture_list").append('<li class="exhibition"><img src=' + ImgHOST() + msg.filename[i] + ' /><div class="del_upload_box"><i class="del_upload">×</i></li>');
			}

			$(".fx_picture .altogether").html(ImageList.length); 	//共几张
			$(".fx_picture .gpce").html(9 - (ImageList.length)); 	//还能上传多少张
			if(ImageList.length >= 9) {
				$(".kind .fx_plus").hide();
			}
			ImageList = ImageList.slice(0, 9); 						//只保存前九个
		},
		error: function() {
			console.log("error");
		}
	});

}

/*
 * 发帖
 */
function createIndexTopicN(data, PostingURL) {
	
	$.ajax({
		type: "post",
		url: serviceHOST() + PostingURL,
		dataType: "json",
		data: data,
		headers: {
			"token": qz_token()
		},
		success: function(msg) {
			if(msg.status == 0) {
				friendlyMessage("发布成功", function() {
					 location.reload();
					$("#FaceBoxText").val("");
				});
				$(".fx_shut").click();
			}else if(msg.status == 1001){     //缺少职业圈
				circlethirdlogin();
			}else if(msg.status==-3){
				getToken();
			};
		},
		error: function() {
			console.log("error");
		}

	});
}



/*
 
 * 关闭发布图片
 * */
$(document).on("click", ".fx_shut", function(event) {
	ImageList.splice(0, ImageList.length); 			//清空数组
	$(".picture_list").empty();
	var txt = html2Escape($("#FaceBoxText").val());
	if(txt) $("#FaceBoxText").val(txt.replace("#分享图片#",""))
	$(".fx_inbox1").hide();
	event.stopPropagation();
	$(".fx_picture .altogether").html(0); 			//共几张
	$(".fx_picture .gpce").html(9); 				//还能上传多少张
	$(".fx_inbox1 .fx_plus").show();
})



/*
 
 * 删除发布图片
 * */
$(document).on("click", ".kind .exhibition .del_upload", function() {
	var list = $(this).parents("li");
	var _index = $(this).parents("li").index();
	$.im.confirm("确定要删除这张图片吗？", function() {
		ImageList.splice(_index, 1);
		list.remove();
		$(".fx_picture .altogether").html(ImageList.length); //共几张
		$(".fx_picture .gpce").html(9 - (ImageList.length)); //还能上传多少张
		// 图片少于九张显示上传
		if(ImageList.length < 9) {
			$(".kind .fx_plus").show();
		}
	})
	
});






// 上传视频
$(document).on("click", ".upSuccess .backErr,.videoParent .fx_shut", function() {
	$(".videoParent ").hide();
	$(".fileNameVideo").hide();
	$(".fileBox").show();
	$("#uploadVideo").val("");
	$(".text_part_v textarea").val("");
	$(".upSuccess").hide();
	$("#videoUpload,.videoUpload").removeClass("on");
	$(".videoUpLoading").html("视频上传中...");
	$(".upStatus .msgWord>span").show();
})

//得到视频文件的名字
function isFileName(obj) {
	var ar = $(obj).val().split(".");
	var _t = ar[0];
	var _n = _t.split("\\");
	var _m = _n[_n.length - 1].substring(0, 8) + "...";
	return _m;
}
var fileSizeV = "",
fileNames="";
$(document).on("change", "#uploadVideo", function() {
	var _this = this;
	fileNames = isFileName(_this);
	if ($(".circleDetail_main").attr('data-cj') == 0 || $('.joinUs').attr('data-status') == 0) {
		warningMessage("请先加入圈子");
		return false;
	}
	if(!isFileType(["mp4"], _this)) {
		knowMessage("仅支持mp4格式的文件");
		return false;
	};
	if(!checkFileSize(_this, 20)) {
		knowMessage("仅能上传小于20M的视频");
		return false;
	};

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
	}

	$(".publish_video").hide();
	$(".upStatus").show();

	imgUploadVideo("uploadVideo", {
		"type": 8, //8为上传帖子视频
		"size": fileSizeV
	});
	// 同步到朋友圈
	visibleFriendCircle = $(".publish_video_b label").attr("data-id");

})

var urlV = "",videoU = "",
visibleFriendCircle = 0;	//同步到朋友圈
$(document).on("click", ".fileNameVideo span", function() {
	$("#uploadVideo").val("");
	$(".fileNameVideo").hide();
	$(".fileBox").show();
	$("#videoUpload,.videoUpload").removeClass("on");
})

// 上传视频
$(document).on("click", "#videoUpload", function() {
	if($(this).hasClass("on")){
		rostSuccess();
	}
})


function imgUploadVideo(id, data) {
	$(".uploadGro .barBg").css("width","0px");
	var pro = 0.01;
	var i = 0;
	var str = "";
	var timer = null;
	var videoUrl = "";
	$.ajaxFileUpload({
		//type:"post",
		url: RestfulHOST() + "/files/uptopicfilesWeb",
		secureuri: false,
		fileElementId: id,
		dataType: 'json',
		timeout: 100000, //超时时间设置
		data: data,
		success: function(msg) {
			if(msg.status == 0) {
				//进度条加载
				window.clearInterval(timer);
				timer = window.setInterval(startTime, 1);

				function startTime() {
					pro += 0.0058;
					if(pro >= 1) {
						pro = 1;
						window.clearInterval(timer);
					}
					$(".NumPro").html((pro * 100).toFixed(2) + "%");
					$(".uploadGro .barBg").css("width", pro * 360 + "px");
				}
				
				videoUrl = msg.filename[0];
				var urls = videoUrl.split("/");
				videoU = urls[urls.length - 1];
				urlV = [videoU];
				
				$(".videoUpLoading").html("视频上传成功");
				$(".msgWord span").hide();
				$(".upStatus").hide();
				$(".upSuccess").show(); //上传成功界面

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
		$(".NumPro").html((pro * 100).toFixed(2) + "%");
		$(".uploadGro .barBg").css("width", pro * 360 + "px");
	}, 100);
}

// 视频发帖
function rostSuccess(){
	var videoText =html2Escape($(".text_part_v textarea").val()) || "";
	var isRosterAccess = $(".publish_video_b label").attr("data-id");
	//首页帖子
	var type = $(".publish_video_b .t_xz_classify").attr("type") || $(".circle_name").attr("data-category");    //1 职业圈 2 全球圈 3 生活圈
	var code = $(".publish_video_b .t_xz_classify").attr("data-code");
	// 职业圈
	if(type == 1) {
		var topic = {
			username: UserName,
			userNo: getCookie("userNo"),
			title: "",
			content: videoText,
			imagecount: 0, //图片数量
			videourl: videoU,
			visiblity: "公有",
			machine: "webpc", //"来自iphone 6s"--必填
			themeNo: "", //""--发生活圈的帖子必填，其他帖子不填
			code: getURIArgs("code") || code, //""--不填
			category: 2, //4,--必填0：朋友圈，2：行业圈，4：生活圈，8：首页
			topictype: 2 //0:纯文本帖子,2:视频帖子,4:带图片帖子
		};
		var PicList = {
			"imageList": urlV
		};
		var Images = JSON.stringify(PicList)
		var topicc = JSON.stringify(topic)
		createIndexVideoN({
			topic: topicc,
			isRosterAccess: isRosterAccess || 0, //0:表示朋友圈不可见，1：表示朋友圈可见 
			isIndexAccess: 0,
			imageList: Images
		}, "/topic/createIndustryTopic");
	} else if(type == 3) {   
		//生活圈
		var topic = {
			username: UserName,
			userNo: getCookie("userNo"),
			themename:"",
			title:"" ,
			content: videoText,
			imagecount: 0, //图片数量
			videourl: videoU,
			visiblity: "公有",
			machine: "webpc", //"来自iphone 6s"--必填
			themeNo: getURIArgs("code") || code, //""--发生活圈的帖子必填，其他帖子不填
			code: "", //""--不填
			category: 4, //4,--必填0：朋友圈，2：行业圈，4：生活圈，8：首页
			topictype: 2 //0:纯文本帖子,2:视频帖子,4:带图片帖子
		};

		var PicList = {
			"imageList": urlV
		};
		var Images = JSON.stringify(PicList)
		var topicc = JSON.stringify(topic)
		createIndexVideoN({
			topic: topicc,
			isRosterAccess: isRosterAccess || 0, //0:表示朋友圈不可见，1：表示朋友圈可见 
			isIndexAccess:0,
			imageList: Images
		}, "/topic/createThemeTopic");
	} else if(type == 2) {
		//全球圈
		var topic = {
			username: UserName,
			userNo: getCookie("userNo"),
			title: "",
			content: videoText,
			imagecount: 0, //图片数量
			videourl: videoU,
			visiblity: "公有",
			machine: "webpc", //"来自iphone 6s"--必填
			themeNo: "", //""--发生活圈的帖子必填，其他帖子不填
			code: "", //""--不填
			category: 16, //4,--必填0：朋友圈，2：行业圈，4：生活圈，8：首页
			topictype: 2 //0:纯文本帖子,2:视频帖子,4:带图片帖子
		};

		var PicList = {
			"imageList": urlV
		};
		var code = getURIArgs("code") || code;
		var gList = {
			"citycircleIdList":[code]
		};
		var Images = JSON.stringify(PicList);
		var topicc = JSON.stringify(topic);
		var ThemeNO = JSON.stringify(gList);    //选中全球圈
		createIndexVideoN({
			"topic": topicc,
			"isRosterAccess": isRosterAccess || 0,
			"citycircleIdList":ThemeNO,
			"imageList": Images
		}, "/topic/createCircleTopic");
	}else {
		// 首页
		var topic = {
			username: UserName,
			userNo: getCookie("userNo"),
			title: "",
			content: videoText,
			imagecount: 0, //图片数量
			videourl: videoU,
			visiblity: "公有",
			machine: "webpc", //"来自iphone 6s"--必填
			themeNo: "", //""--发生活圈的帖子必填，其他帖子不填
			code: "", //""--不填
			category: 8, //4,--必填0：朋友圈，2：行业圈，4：生活圈，8：首页
			topictype: 2 //0:纯文本帖子,2:视频帖子,4:带图片帖子
		};

		var PicList = {
			"imageList": urlV
		};
		var Images = JSON.stringify(PicList)
		var topicc = JSON.stringify(topic)
		createIndexVideoN({
			topic: topicc,
			isRosterAccess: isRosterAccess || 0, //0:表示朋友圈不可见，1：表示朋友圈可见 
			imageList: Images
		}, "/topic/createIndexTopic");
	}
}




function createIndexVideoN(datas, urlName) {
	$.ajax({
		type: "post",
		url: serviceHOST() + urlName + ".do",
		dataType: "json",
		data: datas,
		headers: {
			"token": qz_token()
		},
		success: function(msg) {
			if(msg.status == 0){
				friendlyMessage("发帖成功!",function(){
					location.reload();
				})
			}else if(msg.status==-3){
				getToken();
			}else{
				warningMessage(msg.info);
			}
		},
		error: function() {
			console.log("error")
		}

	});
}

//上传进度条页面的差号
$(document).on("click", ".upload2 .backErr", function() {
	$(".alertMsgBox,.stayLeave").show();
	//	$(".videoParent").hide(function(){
	//		location.reload();
	//	});
})
	/**********************离开页面   留在页面*********************/
$(document).on("click", ".leavePage", function() { //离开页面
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

$(document).on("click", ".stayPage", function() {
	$(".stayLeave,.alertMsgBox").hide();
})
$(document).on("click", ".msgWord span", function() {
	$(".alertMsgBox").show();
	$(".alertMsg").show();
})

//取消视频上传   确定和取消按钮
$(document).on("click", ".btnYes", function() {
	location.reload();
});
$(document).on("click", ".btnNo", function() {
	$(".alertMsgBox").hide();
	$(".alertMsg").hide();
})

//上传视频成功界面
$(document).on('click', ".upSuccess .kMsg", function() {
	$(".upSuccess,.fileBox").hide();
	$(".publish_video").show();
	$("#videoUpload,.videoUpload").addClass("on");
	$(".fileNameVideo").show().html(fileNames + '<span></span>')
})