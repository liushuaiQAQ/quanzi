
$(function(){
	$('.range-slider').jRange({
        from:16,
        to:65,
        step: 1,
        scale: [16,65],
        format: '%s',
        width:255,
        showLabels: true,
        isRange: true
  });
	var UserName=getCookie("username")||""; 
	//条件筛选
	var objType={
		"sex":0,
		"active":4,
		"age":"",
		"minAge":16,
		"maxAge":200,
		"other":"",
		"myindustry":"",
		"interestlabel":"",
		"address":""
	}
	$(document).on("click",".bgbtnBox",function(){
		$(".xhnq").toggle();
		$(".listTy1 li").removeClass("on");
		$(".listTy1 li").eq(0).addClass("on");
		$(".listTy2 li").removeClass("on");
		$(".listTy4 li").removeClass("on");
		if(!getCookie("username")){
			$(".listTy4 li").css("color","#c3c0c0").removeClass("on");
		}
	})
	//	性别
	$(document).on("click",".listTy1 ol li",function(){
		$(this).siblings().removeClass("on");
		if($(this).hasClass("on")){
			$(this).removeClass("on");
		}else{
			$(this).addClass("on");
		}
	})
	//	活跃
	$(document).on("click",".listTy2 ol li",function(){
		$(this).siblings().removeClass("on");
		if($(this).hasClass("on")){
			$(this).removeClass("on");
		}else{
			$(this).addClass("on");
		}
	})
	
	//	其他
	$(document).on("click",".listTy4 ol li",function(){
		if(getCookie("username")){
			if($(this).hasClass("on")){
				$(this).removeClass("on");
			}else{
				$(this).addClass("on");
			}
		}
	})
	//下拉加载动态
	var nw=1;
	searchCondition({
		username:UserName,
		pageNum:nw,
		sex:objType.sex,
		activeTime:objType.active,      //传4就是不选活跃
		minAge:objType.minAge,
		maxAge:objType.maxAge,
		interestlabel:"",
		myindustry:"",
		address:""
	})
//	$(document).on("click",".listTy3 span i",function(){
//		if($(this).hasClass("on")){
//			$(this).removeClass("on");
//		}else{
//			$(this).addClass("on");
//		}
//	})
	//	取消按钮
//	var minAge="";
//	var maxAge="";
	$(document).on("click",".cancleBtn",function(){
		// $(".listTy").find(".on").removeClass("on");
		$(".xhnq").hide();
	})
	//	确定按钮
	$(document).on("click",".conBtn",function(){
		//$(".listTy").find(".on").removeClass("on");
		$(".xhnq").hide();
		//		性别
		objType.sex=$(".listTy1").find(".on").attr("dataSex");
		//活跃
		if($(".listTy2").find(".on").length>0){
			objType.active=$(".listTy2").find(".on").attr("dataTime");
		}else{
			objType.active=4;
		}
		
		//		年龄
		var age=$(".range-slider").val();
		var ageObj=age.split(",")
		objType.minAge=ageObj[0];
		objType.maxAge=ageObj[1];
		if(objType.maxAge==65){
			objType.maxAge=200;  
		}

		if($(".type1").hasClass("on")){
			objType.myindustry="同职业";
		}else{
			objType.myindustry=""
		}
		if($(".type2").hasClass("on")){
			objType.interestlabel="同兴趣";
		}else{
			objType.interestlabel=""
		}
		if($(".type3").hasClass("on")){
			objType.address="同城";
		}else{
			objType.address=""
		}

		$(".centerlist ul").html("");
		$(".centerlist").css({
			"background": "transparent",
			"height":"0px"
		});
		$(".jiazai").show();
		nw=1;
		searchCondition({
			username:UserName,
			pageNum:1,
			sex:objType.sex,
			activeTime:objType.active,
			minAge:objType.minAge,
			maxAge:objType.maxAge,
			interestlabel:objType.interestlabel,
			myindustry:objType.myindustry,
			address:objType.address
		})
	});
//	var page = 1;
//	//触发开关，防止多次调用事件 
//	var stop = false; 
//	$(window).scroll(function(event) {
//		var scrollTop = $(this).scrollTop();
//		//整个文档的高度
//		var scrollHeight = $(document).height(); 
//		var windowHeight = $(this).height();
//		if(scrollTop + windowHeight + 2 >= scrollHeight) {
//			if(stop == true) {
//				stop = false;
//				$("#dynamic_list").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
//				page = page + 1;
//				searchCondition({
//					username:UserName,
//					pageNum:page,
//					sex:objType.sex||0,
//					activeTime:objType.active||4,
//					minAge:minAge||16,
//					maxAge:maxAge||200,
//					interestlabel:objType.interestlabel,
//					myindustry:objType.myindustry,
//					address:objType.address
//				})
//			}
//
//		}
//	})

	//换一批
	$(document).on("click",".batch",function(){
		nw++;
		$(".centerlist ul").html("");
		$(".centerlist").css({
			"background": "transparent",
			"height":"0px"
		});
		$(".jiazai").show();
		searchCondition({
			username:UserName,
			pageNum:nw,
			sex:objType.sex,
			activeTime:objType.active,
			minAge:objType.minAge,
			maxAge:objType.maxAge,
			interestlabel:objType.interestlabel,
			myindustry:objType.myindustry,
			address:objType.address
		});
	})
	//条件筛选接口
	function searchCondition(datas){
		$.ajax({
			type:"post",
			url:serviceHOST()+"/user/searchUser.do",
			dataType:"json",
			headers: {
				"token": qz_token()
			},
			data:datas,
			success:function(msg){
				$(".Toloadmore").remove();
				$(".jiazai").hide();
				if(msg.status==0){
					if(msg.data==""&&nw!=1){
						nw=0;
						$(".batch").click();
					}
					stop = true;
					getStrss(msg.data);
					$(".centerlist").css({
						"background": "#fff",
						"min-height":"774px",
						"height":"auto"
					})
				}else if(msg.status==-3){
					getToken();
				};
			},
			error:function(){
				console.log('error');  
			}
		});
	}
	function getStrss(msg){
		var datas=msg;
		var str="";
		//if(datas.length>0){
			for(var i=0;i<datas.length;i++){
				str+='<li>'+'<div class="lists">'+
							'<a class="headI jingtai" href="javascript:;" data-name="'+datas[i].user.username+'">';
								if(datas[i].user.avatarfile=='"null"'||datas[i].user.avatarfile==''||datas[i].user.avatarfile==null) {
									str += '<img src="/img/first.png" alt="">';
								} else {
									if(datas[i].user.avatarfile.indexOf("http") > -1) {
										str += '<img src="' + datas[i].user.avatarfile + '" alt="">';
									} else {
										str += '<img src="' + ImgHOST() + datas[i].user.avatarfile + '" alt="">';
									}
								}
								if(UserName!=""){
									if(datas[i].user.realname != null &&datas[i].user.realname!=""){
										var useName=datas[i].user.realname;
									}else{
										var useName=datas[i].user.nickname;
									}
								}else{
									var useName=datas[i].user.nickname;
								}
								str+='</a>'+
								'<div class="msgs">'+
									'<dl>'+
										'<dd>'+ useName+'<span class="grade">';
										if(datas[i].user.sex != ""){
											if(datas[i].user.level==null){
												str+='<img src="/img/h/sj_'+user_level[datas[i].user.sex.charCodeAt()]+'_0.png" alt="" />';
											}else{
												if(datas[i].user.level<=15){
													str+='<img src="/img/h/sj_'+user_level[datas[i].user.sex.charCodeAt()]+'_'+datas[i].user.level+'.png" alt="" />';
												}else{
													str+='<img src="/img/h/sj_'+user_level[datas[i].user.sex.charCodeAt()]+'_N.png" alt="" />';
												}
											}
										} else {
											if(datas[i].user.level<=15){
												str += '<img src="/img/h/sj_gril_' + datas[i].user.level + '.png"/>';
											}else{
												str += '<img src="/img/h/sj_gril_N.png"/>';
											}
										}
										str+='</span>';
										if(datas[i].user.viplevel != "0"){
											str+='<span class="sexss">'+'<img src="/img/h/sj_VIP_'+datas[i].user.viplevel+'.png" alt="" />'+'</span>';
										};
										if(datas[i].user.age!=null&&$.trim(datas[i].user.age)!=""){
											if(datas[i].user.sex != ""||datas[i].user.sex != null){
												if(datas[i].user.sex=="男"){
														str+='<span class="ages on">'+datas[i].user.age+'</span>';
													}else{
														str+='<span class="ages">'+datas[i].user.age+'</span>';
													}
											}else{
												str+='<span class="ages">'+datas[i].user.age+'</span>';
											}
										}
										str+='</dd>';
										if(datas[i].user.realindustry==""||datas[i].user.realindustry==null){
											str+='<dd class="workPos">'+datas[i].user.myindustry+'</dd>';
										}else{
											if(datas[i].user.realindustry.length>15){
												var realWork=datas[i].user.realindustry.substr(0,15)+"...";
											}else{
												var realWork=datas[i].user.realindustry;
											};
											//0 代表未认证  -1 代表认证失败     1代表认证中     3代表再次提交审核认证    2代表已认证
											if(datas[i].certificateStatus == 2){
												str+='<dd class="workPos">'+datas[i].user.realindustry+'<i></i>'+'</dd>';
											}else{
												str+='<dd class="workPos">'+datas[i].user.realindustry+'</dd>';
											}
										}
										str+='<dd class="fromCircle">';
										if(datas[i].fromCircle==1){
											var dataNames=datas[i].fromCircleName;
											if(dataNames.indexOf("\/")>-1){
												dataNames=dataNames.replace(/\//g, "_");
											}else{
												dataNames=dataNames;
											}
											str+='<a href="/center/zyq.html">职业圈</a>'+'|'+'<a href="/center/zhiye/mydynamic.html?code='+datas[i].fromCircleid+'&dataName='+dataNames+'">'+datas[i].fromCircleName+'</a>';
										}else if(datas[i].fromCircle==2){
											str+='<a href="/center/qqq.html">全球圈</a>'+'|'+'<a href="/center/global/mydynamic.html?code='+datas[i].fromCircleid+'">'+datas[i].fromCircleName+'</a>';
										}else if(datas[i].fromCircle==3){
											str+='<a href="/center/shq.html">生活圈</a>'+'|'+'<a href="/center/life/mydynamic.html?code='+datas[i].fromCircleid+'">'+datas[i].fromCircleName+'</a>';
										}
										str+='</dd>';
									str+='</dl>'+
								'</div>'+
								'<div class="times">'+formatTime(datas[i].user.lastlogintime)+'</div>'+
								'<br class="clear" />'+
							'</div>'+
					'</li>'
				}
//			}else{
//				str='<li class="nonConformity">暂无符合查找条件的人</li>'
//			}
			$(".centerlist ul").html(str);
	}
	
	$(document).on('click',".jingtai",function(){
		var strangename = $(this).attr("data-name");
		getInfo({
				myname:getCookie("username")||"nouser",
				username:strangename,
				templetName:"pageJingtai"
			})
	})
	
//	function findUserNear(){
//		var user_level = {
//			30007: "boy",
//			22899: "gril"
//		}
//		im.localLoadingOn(".centerlist ul");
//		$.ajax({
//			type:"get",
//			url:RestfulHOST()+"/users",
//			data:{
//				search:"",
//				myname:getCookie("username")||""
//			},
//			headers:{
//				"Authorization":"AQAa5HjfUNgCr27x"
//			},
//			success:function(msg){
//				im.localLoadingOff(".centerlist ul");
//				if(msg.status==0){
//					getStrs(msg.user);
//				}
//			},
//			error:function(){
//				console.log("error");
//			}
//		});
//	}
//	findUserNear()
//	
//	function getStrs(msg){
//		var datas=msg;
//		var str="";
//		for(var i=0;i<datas.length;i++){
//			str+='<li>'+'<div class="lists">'+
//					'<a class="headI" href="/center/u/page.html?from='+datas[i].username+'">';
//							if(datas[i].avatarfile=='"null"'||datas[i].avatarfile==''||datas[i].avatarfile==null) {
//								str += '<img src="/img/first.png" alt="">';
//							} else {
//								if(datas[i].avatarfile.indexOf("http") > -1) {
//									str += '<img src="' + datas[i].avatarfile + '" alt="">';
//								} else {
//									str += '<img src="' + ImgHOST() + datas[i].avatarfile + '" alt="">';
//								}
//							}
//							if(datas[i].realname!=null){
//								var useName=datas[i].realname;
//							}else{
//								var useName=datas[i].nickname;
//							}
//							str+='</a>'+
//							'<div class="msgs">'+
//								'<dl>'+
//									'<dd>'+ useName+'<span class="grade">';
//									if(datas[i].sex != ""){
//										if(datas[i].level==null){
//											str+='<img src="/img/h/sj_'+user_level[datas[i].sex.charCodeAt()]+'_0.png" alt="" />';
//										}else{
//											if(datas[i].level<=15){
//												str+='<img src="/img/h/sj_'+user_level[datas[i].sex.charCodeAt()]+'_'+datas[i].level+'.png" alt="" />';
//											}else{
//												str+='<img src="/img/h/sj_'+user_level[datas[i].sex.charCodeAt()]+'_15.png" alt="" />';
//											}
//										}
//									} else {
//										str += '<span class="gradeImg"><img src="/img/h/sj_gril_' + datas[i].level + '.png"/></span>';
//									}
//									str+='</span>';
//									if(datas[i].viplevel != "0"){
//										str+='<span class="sexss">'+'<img src="/img/h/sj_VIP_'+datas[i].viplevel+'.png" alt="" />'+'</span>';
//									};
//									if(datas[i].age!=null){
//										if(datas[i].sex != ""||datas[i].sex != null){
//											if(datas[i].sex=="男"){
//													str+='<span class="ages on">'+datas[i].age+'</span>';
//												}else{
//													str+='<span class="ages">'+datas[i].age+'</span>';
//												}
//										}else{
//											str+='<span class="ages">'+datas[i].age+'</span>';
//										}
//									}
//									str+='</dd>';
//									if(datas[i].realindustry==""||datas[i].realindustry==null){
//										str+='<dd class="workPos">'+datas[i].myindustry+'</dd>';
//									}else{
//										if(datas[i].realindustry.length>15){
//											var realWork=datas[i].realindustry.substr(0,15)+"...";
//										}else{
//											var realWork=datas[i].realindustry;
//										};
//										//0 代表未认证  -1 代表认证失败     1代表认证中     3代表再次提交审核认证    2代表已认证
//										if(datas[i].certificateStatus == 2){
//											str+='<dd class="workPos">'+datas[i].realindustry+'<i></i>'+'</dd>';
//										}else{
//											str+='<dd class="workPos">'+datas[i].realindustry+'</dd>';
//										}
//									}
//									str+='<dd>'+datas[i].sign+'</dd>'+
//								'</dl>'+
//							'</div>'+
//							'<div class="times">'+formatTime(datas[i].lastlogintime)+'</div>'+
//							'<br class="clear" />'+
//						'</div>'+
//				'</li>'
//		}
//		$(".centerlist ul").html(str);
//	}
})
