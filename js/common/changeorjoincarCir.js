//点击变更职业差号
$(document).on("click",".viewBoxocc .parBox span",function(){
	$("#mskocc").hide();
});

//至少保留一个职业圈的提示差号和取消开始
$(document).on("click",".viewBoxocc4 .parBox4 span,.viewBoxocc4 .viewBot .choosecan",function(){
	$("#mskocc4").hide();
});
$(document).on("click",".viewBoxocc4 .choosecoo",function(){
	$("#mskocc4").hide();
	$("#maskss").css("z-index","9999").show();
	$(".workBoxs").show();
	$(".ProfessionalSearch input").val("");
	getpesonWork2({
		username:getCookie("username")
	});
	
	getCareercircle({          //获取职业圈分类
		username:getCookie("username"),    
		pageNum: 1,
		pageSize:63
	});
})
//至少保留一个职业圈的提示差号和取消结束
//变更职业按钮点击
$(document).on("click",".changework",function(){
	$("#mskocc").hide();
	$("#maskss").css("z-index","9999").show();
	$(".workBoxs").show();
	$(".ProfessionalSearch input").val("");
	getpesonWork2({
		username:getCookie("username")
	});
	
	getCareercircle({          //获取职业圈分类
		username:getCookie("username"),    
		pageNum: 1,
		pageSize:63
	});
})
// 查询用户加入的职业圈
function getpesonWork2(datas){
	$.ajax({
		type:"post",
		url:serviceHOST()+"/jobstree/findJoinedJobstree.do",
		headers: {
			"token": qz_token()
		},
		data:datas,
		dataType:"json",
		success:function(msg){
			if(msg.status==0){
				var str="";
				if(msg.data!=""||msg.data!=undefined){
					for(var i=0;i<msg.data.length;i++){
						str+='<span class="gz_label industry" data-id="'+ msg.data[i].code +'"  data-name="'+msg.data[i].name+'">' + msg.data[i].name + '<i class="label_del labeldel02"></i></span>';
					}
					$(".Tojoin_content .label_list").html(str);
				};
			}else if(msg.status==-3){
				getToken();
			};
		},
		error:function(){
			console.log("error");
		}
	});
}
//修改职业圈弹窗上的差号
$(document).on("click", ".protit i", function() {
	$("#maskss").hide();
	$(".workBoxs").hide();
	$(".ProfessionalSearch input").val("");
});
//一个职业也没有的时候提示
$(document).on("click", ".prompt .cancel,.prompt .del", function() {
	$("#maskss").css("z-index","9999");
	$(".prompt").hide();
	getpesonWork2({
		username:getCookie("username")
	})
	if($(".label_list").has("span").length>0){
		$(".xg_saveBox .xg_save").css("background","#3FA435");
	}else{
		$(".xg_saveBox .xg_save").css("background","#999999");
	}
	
});


//拿到职业分类的接口
function getCareercircle(datas){
	im.localLoadingOn(".autoType ul");
	$.ajax({
		type: "post",
		url: serviceHOST() + "/jobstree/recommendJobStreeCircleByUsernameEX.do",
		data: datas,
		headers: {
			"token": qz_token()
		},
		success: function(msg) {
			im.localLoadingOff(".autoType ul");
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
};
function getCarInfo(mssg){
	var str = "";
	if(mssg.length>0){
		for (var i = 0; i < mssg.length; i++) {
			var dataNames = mssg[i].themename;
		 	if (dataNames.indexOf("\/") > -1) {
		 		dataNames = dataNames.replace(/\//g, "_");
		 	} else {
		 		dataNames = dataNames;
		 	};
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
			'<div class="wordPos clearfix">'+
				'<div>'+
					'<p>'+mssg[i].themename+'<span>圈子<i>'+activeCount+'</i>人</span></p>';
					if(mssg[i].circletopicanynickname!=""){
						str+='<b>'+mssg[i].circletopicanynickname+':'+subStr+'</b>';
					}
					
				str+='</div>';
				if(mssg[i].isAttention == 1 || mssg[i].isAttention == 2){       //0和1二种状态  1是已加入   0 是未加入        2是创建
					str+='<a class="joinorenter" data-status="'+mssg[i].isAttention+'" href="/center/zhiye/mydynamic.html?code='+mssg[i].code+'">进入</a>';
				}else{
					str+='<a class="joinorenter on" href="javascript:;">加入</a>';
				};
			str+='</div>'+
				'<div class="imglis">'+
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
		}else{
			str+='<li style="text-align:center;font-size:14px;color:#666;">暂无搜索结果</li>';
		}
		$(".autoType ul").html(str);
};

/*加入职业圈
	 */
	$(document).on("click", ".joinorenter", function() {
		var _this=$(this);
		if($(this).hasClass("on")){
			var codeId = $(this).parents("li").attr("data-code");
			//var pcodes=$(this).parents("li").attr("data-pcode");
			var names = $(this).parents("li").attr("data-name");
			//var descritions=$(this).parents("li").attr("data-descrition");
			if(getCookie("viplevel")==1){     //会员1 加入二个职业圈      会员2加入3个    会员三加入4个
				if($(".label_list span").length==2){
					warningMessage("加入圈子已达最大限度，请升级为VIP","",2000);
				}else{
					if($(".label_list").text().indexOf(names)==-1){         //防止重复添加
						$(".Tojoin_content .label_list").append('<span class="gz_label industry" data-id="'+ codeId +'"  data-name="'+names+'">' + names + '<i class="label_del labeldel02"></i></span>');
					}else{
						warningMessage("请勿重复添加","",2000);
					}
				}
			}else if(getCookie("viplevel")==2){
				if($(".label_list span").length==3){
					warningMessage("加入圈子已达最大限度，请升级为VIP","",2000);
				}else{
					if($(".label_list").text().indexOf(names)==-1){         //防止重复添加
						$(".Tojoin_content .label_list").append('<span class="gz_label industry" data-id="'+ codeId +'"  data-name="'+names+'">' + names + '<i class="label_del labeldel02"></i></span>');
					}else{
						warningMessage("请勿重复添加","",2000);
					}
				}
			}else if(getCookie("viplevel")==3){
				if($(".label_list span").length==4){
					warningMessage("加入圈子已达最大限度，请升级为VIP","",2000);
				}else{
					if($(".label_list").text().indexOf(names)==-1){         //防止重复添加
						$(".Tojoin_content .label_list").append('<span class="gz_label industry" data-id="'+ codeId +'"  data-name="'+names+'">' + names + '<i class="label_del labeldel02"></i></span>');
					}else{
						warningMessage("请勿重复添加","",2000);
					}
				}
			}else{
				if($(".label_list span").length==1){
					warningMessage("加入圈子已达最大限度，请升级为VIP","",2000);
				}else{
					$(".Tojoin_content .label_list").append('<span class="gz_label industry" data-id="'+ codeId +'"  data-name="'+names+'">' + names + '<i class="label_del labeldel02"></i></span>');
				}
			};
			$(".xg_saveBox .xg_save").css("background","#3FA435");
		}
		
	});
/*取消加入的行业圈
	 */
	$(document).on("click", ".industry .labeldel02", function() {
		var lavbe = $(this).parents(".industry").text();
		$(this).parents(".industry").remove();
		if($(".label_list").has("span").length==0){
			$(".xg_saveBox .xg_save").css("background","#999999");
		}
	});
//保存加入的圈子
$(document).on("click", ".xg_saveBox .save", function() {
//	if($(".chooseWork").hasClass("on")){
//		$(".workBoxs").hide();
//		$(".MoreLivings").css("z-index","9999").show();
//		$(".MoreLivings_01").show();
//	}
	if($(".label_list").has("span").length>0){
		var arrCode = []; //关注职业圈数组
		for(var i=0;i<$(".label_list span").length;i++){
			var dataIds=$(".label_list span").eq(i).attr("data-id");
			arrCode.push(dataIds)
		}
		var codeId = JSON.stringify(arrCode);
		$.ajax({
			type: "post",
			url: serviceHOST() + "/jobstree/updateJobStreeByCodes.do",
			headers: {
				"token": qz_token()
			},
			data: {
				"username":getCookie("username"),
				"codes": codeId
			},
			success: function(msg) {
				if (msg.status == 0) { //0是加入  -1是已经加入    1是          等级不够
						var chatRoom=msg.data;
						friendlyMessage("加入成功", function() {
							//退出聊天室接口调取操作
							if(chatRoom!=""){
								$.each(chatRoom, function(k,v) {
									moveChatroom(chatRoom[k]);
								});
							}
							if($(".chooseWork").hasClass("on")){  //未加入职业圈时，刚登陆进来弹出加入职业圈 ，然后弹出职业圈分类 
								$(".workBoxs").hide();
								$(".MoreLivings").css("z-index","9999").show();
								$(".MoreLivings_01").show();
								//生活圈分类接口
								ClassificationInterface();
							}else{
								window.location.reload();
							}
							
						})
				}else if (msg.status == -1) { 
					warningMessage("您已是圈子成员，请勿重复加入");
				}else if (msg.status == 1) { //加入个数限制已满  需开通会员加入；
					warningMessage("您的等级不够，请升级会员");
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error");
			}
		});

	}else{
		$("#maskss").css("z-index","20000").show();
		$(".prompt").show();
	}
});


$(document).on("click", ".prompt .determine", function() {
	$("#maskss").css("z-index","9999");
	$(".prompt").hide();
});

/*
	 
	 * 
	 * 职业圈搜索
	 * 
	 * keyword   关键字
	 * */

	$(".workBoxs .ProfessionalSearch input").bind('input propertychange', function() {
		var keyword = html2Escape($(this).val());
		if(keyword == ""){
			getCareercircle({
				username:getCookie("username"),    
				pageNum: 1,
				pageSize:63
			});
			return false;
		}
		$.ajax({
			type: "post",
			url: serviceHOST() + "/jobstree/searchJobstreeByKeyWord.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: {
				username:getCookie("username"),
				keyWord:keyword,
				pageNum:1,
				pageSize:50
			},
			success: function(msg) {
				if(msg.status==0){
					var mssg=msg.data;
					getCarInfo(mssg);
				}else if(msg.status==-3){
					getToken();
				};
				
			},
			error: function() {
				console.log("error")
			}
	
		});
	});
	
	
	//第三方登录如果用户没有加入职业圈,提醒用户加入职业圈弹窗
	//	点击差号和取消按钮

	$(document).on("click",".viewBoxocc2 .choosecan,.viewBoxocc2 .parBox2 span",function(){
		$("#mskocc2").hide();
	});
	
	//选择职业按钮
	$(document).on("click",".viewBoxocc2 .choosecoo",function(){
		$("#mskocc2").hide();
		$("#maskss").css("z-index","9999").show();
		$(".workBoxs").show();
		$(".ProfessionalSearch input").val("");
		$(".protit span").html("加入职业圈");
		getCareercircle({          //获取职业圈分类
			username:getCookie("username"),    
			pageNum: 1,
			pageSize:63
		});
		$(".xg_saveBox .xg_save").css("background","#999999");
	});

	function getpesonWs2(datas) {
		$.ajax({
			type: "post",
			url: serviceHOST() + "/jobstree/findJoinedJobstree.do",
			headers: {
				"token": qz_token()
			},
			data: datas,
			dataType: "json",
			success: function(msg) {
				if (msg.status == 0) {
					if (msg.data == "" || msg.data == undefined) {
						$("#maskss").css("z-index","9999").show();
						$(".chooseWork").addClass("on");
						$(".workBoxs .importantTit").show();
						$(".workBoxs").show();
						$(".workBoxs .protit i").hide();
						$(".ProfessionalSearch input").val("");
						$(".protit span").html("加入职业圈");
						getCareercircle({          //获取职业圈分类
							username:getCookie("username"),    
							pageNum: 1,
							pageSize:63
						});
						$(".xg_saveBox .xg_save").css("background","#999999");
					}else{
						$(".chooseWork").removeClass("on");
					}
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error");
			}
		});
	}
	if(getCookie("username")){
		getpesonWs2({ //用来判断第三方登录有没有加入职业圈    posit==false没有加入，是true已加入
			username: getCookie("username")
		});
	}

	//关闭 生活圈分类接口
	$(".MoreLivings .Mores_l_del").on("click",function  () {
		$(".MoreLivings").hide();
		$("#maskss").hide();
		window.location.reload();
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
	var themeCatetoryIdList=[]
	$(document).on("click","a.keepss",function(){
		   var cid=""; 
		   $(".MoreLivings .Livings_list li.on").each(function(index, element) { 
		      cid=$(this).attr("data-id"); 
		      themeCatetoryIdList.push(cid)
		   }); 
		   if(cid.length!=0){
				themeCatetoryIdList=JSON.stringify(themeCatetoryIdList);
		   		insertUserThemeCatetory({
		   			username:getCookie("username"),
		   			category:themeCatetoryIdList
		   		})
		   }else{
		   		warningMessage("您未选择兴趣分类");
		   }
	});
	//保存加入的生活圈分类   增加用户和生活圈分类关系
	function insertUserThemeCatetory(datas){
		$.ajax({
			type: "post",
			url: serviceHOST() + "/themeCatetory/insertUserThemeCatetory.do",
			headers: {
				"token": qz_token()
			},
			data: datas,
			dataType: "json",
			success: function(msg) {
				if (msg.status == 0) {
					friendlyMessage("保存成功",function(){
						$("#maskss").hide();
						window.location.reload();
					})
				}if (msg.status == -1) {
					warningMessage("保存失败，请重试");
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error");
			}
		});
	}
	// 生活圈分类图路径
	var LifeImg = serHOST()+"/res/pics/theme_type/";
	function ClassificationInterface() {
		im.localLoadingOn(".MoreLivings .Livings_list")
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
				im.localLoadingOff(".MoreLivings .Livings_list");
				var str = "";
				for(var i = 0; i < mssg.data.length; i++) {
					var msg = mssg.data[i];
					str += '<li class="Category" data-id=' + msg.id + ' data-name='+msg.name+'>';
					str += '<img src="' + LifeImg + msg.url + '" align="top" />' +
						'<h5>' + msg.name + '</h5>';
					if(msg.circlecount!=null){
						if(msg.circlecount>10000){
							str += '<span>'+change2(msg.circlecount)+'个圈子</span>';
						}else{
							str += '<span>'+msg.circlecount+'个圈子</span>';
						}
					}else{
						str +='<span>0个圈子</span>';
					};
					
					str+='<br>'
						if(msg.count!=null){
							if(msg.count>10000){
								str += '<span>'+change2(msg.count)+'人</span>';
							}else{
								str += '<span>'+msg.count+'人</span>';
							}
						}else{
							str += '<span>0人</span>';
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
	
	
	
	














