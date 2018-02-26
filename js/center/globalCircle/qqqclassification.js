$(function(){
	var mores='<li class="showmore">展开更多<span><img src="/img/zyq_zhankuaigengduo.png" alt=""></span></li>';
	var lesss='<li class="showless">收起全部<span><img src="/img/zyq_shouqiquanbu.png" alt=""></span></li>';
	var windowUrl=window.location.href;
	 //	页面加载初始化
   var str="";
   if($(".churchyard").hasClass("areaActive")){
	   var arrCity=globalArea[0].children;
		for(var i in arrCity){
			if(arrCity[i].children.length>0){
				var courName=arrCity[i].children;
				for(var j in courName){
					var han=courName[j].han;
					if(han=="a"||han=="b"||han=="c"||han=="d"||han=="e"){
						str+='<li data_pid="'+courName[j].pid+'">'+
						'<a href="/center/qqqlist.html?dataid='+courName[j].id+'&conName='+"中国-"+courName[j].pname+"-"+courName[j].name+'&type=1">'+courName[j].name+'</a>'+
						'</li>';
					}
				}
			}
		}
		$(".area ul").html(str);
		$(".area ul li").eq(45).after(mores);   //插入展开更多   收起全部
		 $(".area ul").find(".showmore").nextAll().hide();
	}
	//右侧境内，境外的点击事件
	$(document).on('click','.areaTypeBox a',function(){
		$(".area ul").html("");
		 var str="";
		$('.areaTypeBox a').removeClass('areaActive');
		$(this).addClass('areaActive');
		if($(".overseas").hasClass("areaActive")){               //境外
			for(var a=1;a<globalArea.length;a++){
				var arrCity=globalArea[a].children[0];
				var cityid=globalArea[a].children[0].id
				var han=arrCity.han;
//				for(var i in arrCity){
//					var han=arrCity[i].han;
//					if(han!=""){
//						if(han=="a"||han=="b"||han=="c"||han=="d"||han=="e"){
//							str+='<li data_pid="'+arrCity[i].pid+'">'+
//							'<a href="/center/qqqlist.html?dataid='+arrCity[i].id+'&conName='+arrCity[i].pname+"-"+arrCity[i].name+'">'+arrCity[i].name+'</a>'+
//							'</li>';
//						}
//					}
//				}
				if(cityid==""){
					if(han=="a"||han=="b"||han=="c"||han=="d"||han=="e"){
						str+='<li data_pid="'+arrCity.pid+'">'+
						'<a href="/center/qqqlist.html?dataid='+arrCity.pid+'&conName='+arrCity.pname+'&type=2">'+arrCity.pname+'</a>'+
						'</li>';
					}
				}
			}
		}else{
			var arrCity=globalArea[0].children;                    //境内
			for(var i in arrCity){
				if(arrCity[i].children.length>0){
					var courName=arrCity[i].children;
					for(var j in courName){
						var han=courName[j].han;
						if(han=="a"||han=="b"||han=="c"||han=="d"||han=="e"){
							str+='<li data_pid="'+courName[j].pid+'">'+
									'<a href="/center/qqqlist.html?dataid='+courName[j].id+'&conName='+"中国-"+courName[j].pname+"-"+courName[j].name+'&type=1">'+courName[j].name+'</a>'+
								'</li>';
						}
					}
				}
			}
		}
		$(".area ul").html(str);
		$(".area ul li").eq(45).after(mores);   //插入展开更多   收起全部
		 $(".area ul").find(".showmore").nextAll().hide();
	});
	//字母点击查询
	$(document).on('click','.areaBox a',function(){
		$('.areaBox a').removeClass('borderActive');
		$(this).addClass('borderActive');
		var str="";
		//境内城市   根据字母分类
		if($(this).parent(".areaBox").siblings(".areaTypeBox").find(".areaActive").hasClass("churchyard")){
			var arrCity=globalArea[0].children;
			if($(this).hasClass("city1")){
				for(var i in arrCity){
					if(arrCity[i].children.length>0){
						var courName=arrCity[i].children;
						for(var j in courName){
							var han=courName[j].han;
							if(han=="a"||han=="b"||han=="c"||han=="d"||han=="e"){
								str+='<li data_pid="'+courName[j].pid+'">'+
								'<a href="/center/qqqlist.html?dataid='+courName[j].id+'&conName='+"中国-"+courName[j].pname+"-"+courName[j].name+'&type=1">'+courName[j].name+'</a>'+
								'</li>';
							}
						}
					}
				}
			}else if($(this).hasClass("city2")){
				for(var i in arrCity){
					if(arrCity[i].children.length>0){
						var courName=arrCity[i].children;
						for(var j in courName){
							var han=courName[j].han;
							if(han=="f"||han=="g"||han=="h"||han=="i"||han=="j"){
								str+='<li data_pid="'+courName[j].pid+'">'+
								'<a href="/center/qqqlist.html?dataid='+courName[j].id+'&conName='+"中国-"+courName[j].pname+"-"+courName[j].name+'&type=1">'+courName[j].name+'</a>'+
								'</li>';
							}
						}
					}
				}
			}else if($(this).hasClass("city3")){
				for(var i in arrCity){
					if(arrCity[i].children.length>0){
						var courName=arrCity[i].children;
						for(var j in courName){
							var han=courName[j].han;
							if(han=="k"||han=="l"||han=="m"||han=="n"||han=="o"){
								str+='<li conName="'+"中国,"+courName[j].pname+","+courName[j].name+'" data_id="'+courName[j].id+'" data_pid="'+courName[j].pid+'">'+
								'<a href="/center/qqqlist.html?dataid='+courName[j].id+'&conName='+"中国-"+courName[j].pname+"-"+courName[j].name+'&type=1">'+courName[j].name+'</a>'+
								'</li>';
							}
						}
					}
				}
			}else if($(this).hasClass("city4")){
				for(var i in arrCity){
					if(arrCity[i].children.length>0){
						var courName=arrCity[i].children;
						for(var j in courName){
							var han=courName[j].han;
							if(han=="p"||han=="q"||han=="r"||han=="s"||han=="t"){
								str+='<li conName="'+"中国,"+courName[j].pname+","+courName[j].name+'" data_id="'+courName[j].id+'" data_pid="'+courName[j].pid+'">'+
								'<a href="/center/qqqlist.html?dataid='+courName[j].id+'&conName='+"中国-"+courName[j].pname+"-"+courName[j].name+'&type=1">'+courName[j].name+'</a>'+
								'</li>';
							}
						}
					}
				}
			}else if($(this).hasClass("city5")){
				for(var i in arrCity){
					if(arrCity[i].children.length>0){
						var courName=arrCity[i].children;
						for(var j in courName){
							var han=courName[j].han;
							if(han=="u"||han=="v"||han=="w"||han=="x"||han=="y"||han=="z"){
								str+='<li conName="'+"中国,"+courName[j].pname+","+courName[j].name+'" data_id="'+courName[j].id+'" data_pid="'+courName[j].pid+'">'+
								'<a href="/center/qqqlist.html?dataid='+courName[j].id+'&conName='+"中国-"+courName[j].pname+"-"+courName[j].name+'&type=1">'+courName[j].name+'</a>'+
								'</li>';
							}
						}
					}
				}
			}
		}else if($(this).parent(".areaBox").siblings(".areaTypeBox").find(".areaActive").hasClass("overseas")){
			if($(this).hasClass("city1")){
//				for(var a=1;a<globalArea.length;a++){
//					var arrCity=globalArea[a].children;
//					for(var i in arrCity){
//						var han=arrCity[i].han;
//						if(han!=""){
//							if(han=="a"||han=="b"||han=="c"||han=="d"||han=="e"){
//								str+='<li data_pid="'+arrCity[i].pid+'">'+
//								'<a href="/center/qqqlist.html?dataid='+arrCity[i].id+'&conName='+arrCity[i].pname+"-"+arrCity[i].name+'">'+arrCity[i].name+'</a>'+
//								'</li>';
//							}
//						}
//					}
//				}
				for(var a=1;a<globalArea.length;a++){
					var arrCity=globalArea[a].children[0];
					var cityid=arrCity.id
					var han=arrCity.han;
					if(cityid==""){
						if(han=="a"||han=="b"||han=="c"||han=="d"||han=="e"){
							str+='<li data_pid="'+arrCity.pid+'">'+
							'<a href="/center/qqqlist.html?dataid='+arrCity.pid+'&conName='+arrCity.pname+'&type=2">'+arrCity.pname+'</a>'+
							'</li>';
						}
					}
				}
		}else if($(this).hasClass("city2")){
				for(var a=1;a<globalArea.length;a++){
					var arrCity=globalArea[a].children[0];
					var cityid=arrCity.id
					var han=arrCity.han;
					if(cityid==""){
						if(han=="f"||han=="g"||han=="h"||han=="i"||han=="j"){
							str+='<li data_pid="'+arrCity.pid+'">'+
							'<a href="/center/qqqlist.html?dataid='+arrCity.pid+'&conName='+arrCity.pname+'&type=2">'+arrCity.pname+'</a>'+
							'</li>';
						}
					}
				}
		}else if($(this).hasClass("city3")){
				for(var a=1;a<globalArea.length;a++){
					var arrCity=globalArea[a].children[0];
					var cityid=arrCity.id
					var han=arrCity.han;
					if(cityid==""){
						if(han=="k"||han=="l"||han=="m"||han=="n"||han=="o"){
							str+='<li data_pid="'+arrCity.pid+'">'+
							'<a href="/center/qqqlist.html?dataid='+arrCity.pid+'&conName='+arrCity.pname+'&type=2">'+arrCity.pname+'</a>'+
							'</li>';
						}
					}
				}
		}else if($(this).hasClass("city4")){
				for(var a=1;a<globalArea.length;a++){
					var arrCity=globalArea[a].children[0];
					var cityid=arrCity.id
					var han=arrCity.han;
					if(cityid==""){
						if(han=="p"||han=="q"||han=="r"||han=="s"||han=="t"){
							str+='<li data_pid="'+arrCity.pid+'">'+
							'<a href="/center/qqqlist.html?dataid='+arrCity.pid+'&conName='+arrCity.pname+'&type=2">'+arrCity.pname+'</a>'+
							'</li>';
						}
					}
				}
		}else if($(this).hasClass("city5")){
				for(var a=1;a<globalArea.length;a++){
					var arrCity=globalArea[a].children[0];
					var cityid=arrCity.id
					var han=arrCity.han;
					if(cityid==""){
						if(han=="u"||han=="v"||han=="w"||han=="x"||han=="y"||han=="z"){
							str+='<li data_pid="'+arrCity.pid+'">'+
							'<a href="/center/qqqlist.html?dataid='+arrCity.pid+'&conName='+arrCity.pname+'&type=2">'+arrCity.pname+'</a>'+
							'</li>';
						}
					}
				}
			}
		}
		$(".area ul").html(str);
		$(".area ul li").eq(35).after(mores);   //插入展开更多   收起全部
		$(".area ul").find(".showmore").nextAll().hide();
	});
	
	//点击展开更多
	$(document).on("click",".showmore",function(){
		$(this).hide();
		$(".area ul").find(".showless").remove();
		$(".area ul").append(lesss);
	 	$(".area ul").find(".showmore").nextAll().show();
	 	$(".showless").show();
	 	var top = $("#sideBar").css("top").split("px")[0];
	 	top = Number(top) - 297;
	 	$("#sideBar").css("top",top + "px");
	 	$(".center_box").css("min-height",$("#sideBar").height());
	});
	//点击收起全部
	$(document).on("click",".showless",function(){
	 	$(".area ul").find(".showmore").nextAll().hide();
	 	$(".showmore").show();
	 	$(".showless").hide();
	 	// $(".center_box").css("min-height","820px");
	})
	
	//	全球圈搜索城市
	$(".searchCity .searchbox input").bind('input propertychange', function() {
		var flag=false;
		var str=""
		var keyword = html2Escape($(this).val());
		if(keyword == ""){
			$(".searchCon").hide();
			$(".searchCon").html("");
		}else{
			$(".searchCon").show();
			for(var n in globalArea){
				var zgcountry=globalArea[n].children;     //查找中国 城市
				if(n==0){
					for(var i in zgcountry){
						var cityN=zgcountry[i].children;
						for(var j in cityN){
							var hans=cityN[j].han;
							if(hans!=""){
								if(cityN[j].name.indexOf(keyword)>-1){
									flag=true;
									str+='<a data-id="'+cityN[j].id+'" href="/center/qqqlist.html?dataid='+cityN[j].id+'&conName='+"中国-"+cityN[j].pname+"-"+cityN[j].name+'&type=1">'+cityN[j].name+'</a>';
								}
							}
						}
					}
				}else if(n>0){          //查找除中国外的国家
					var cityN=zgcountry[0];
					if(cityN.pname.indexOf(keyword)>-1){
						flag=true;
						str+='<a data-id="'+cityN.pid+'" href="/center/qqqlist.html?dataid='+cityN.pid+'&conName='+cityN.pname+'&type=2">'+cityN.pname+'</a>';
					}
//					else{
//						str+='<a class="nodata" href="javascript:;">无符合的搜索结果</a>';
//					}
				}
				
			}
			if(flag==true){
				$(".searchCon").html(str);
			}else{
				var strs='<a class="nodata" href="javascript:;">无符合的搜索结果</a>';
				$(".searchCon").html(strs);
			}
			
			
		}
	});
	
	//热门城市推荐
	if($(".churchyard1").hasClass("areaActive1")){     //境内
		jingneiguojia({
			type:1,
			pageNum:1,
			pageSize:28
		})
	}
	// 热门城市 境内 境外   1是境内    2是境外
	 function jingneiguojia(datas){
	 	var str="";
	 	$.ajax({
			type:"post",
			url:serviceHOST()+"/globalcity/findHotGlobalCountry.do",
			dataType:"json",
			headers: {
				"token": qz_token()
			},
			data:datas,
			success:function(msg){
				if(msg.status==0){
					if(windowUrl.indexOf("qqqlist.html")>-1){
						str='<li><a href="/center/qqq.html">推荐</a></li>';
					}else{
						str='<li><a style="color:#3ea436;" href="/center/qqq.html">推荐</a></li>';
					}
					
					for(var i=0;i<msg.data.length;i++){
						str+='<li><a href="/center/qqqlist.html?dataid='+msg.data[i].cityid+'&conName='+msg.data[i].name+'&type='+datas.type+'">'+msg.data[i].name+'</a></li>';
					};
					$(".hotcitylist ul").html(str);
				}else if(msg.status==-3){
					getToken();
				};
			},
			error:function(){
				console.log('error');  
			}
		});
	 }
	//右侧境内，境外的点击事件
	$(document).on('click','.areaTypeBox1 a',function(){
		$(".hotcitylist ul").html("");
		var str="";
		$(this).addClass("areaActive1").siblings("a").removeClass("areaActive1");
		if($(".churchyard1").hasClass("areaActive1")){               //境内
			jingneiguojia({
				type:1,
				pageNum:1,
				pageSize:28
			})
		}else{
			jingneiguojia({
				type:2,
				pageNum:1,
				pageSize:21
			})
		}
	
	});
	//加入全球圈
	$(document).on("click",".tjlist .joinCir.on",function(){
		var code=$(this).attr("themeno");
		var _this=$(this);
		$.ajax({
			type:"post",
			url:serviceHOST()+"/citycircleusermap/joinCitycircle.do",
			data:{
				"username":getCookie("username"),
				"citycircleId":code
			},
			headers: {
				"token": qz_token()
			},
			success:function(msg){
				if(msg.status==0){
					if(msg.data==1){
						_this.removeClass("on");
						_this.addClass("off");
						friendlyMessage("加入成功",function(){
							_this.html("进入");
							_this.attr("href","/center/global/mydynamic.html?code="+code);
						})
					}else if(msg.data==-1){
						warningMessage(msg.info);
					}
				}else if(msg.status==-3){
					getToken();
				};
			},
			error:function(){
				console.log("error");
			}
		});
	});
	
})
