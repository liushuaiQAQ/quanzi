$(function(){
	var themeid= getURIArgs("dataid");            //城市id
	var address=getURIArgs("conName").replace(/-/g, ',');      //国家地址
	var UserName = getCookie("username")||""; //用户名
	var types=getURIArgs("type");      //区分境内城市和境外国家    1 代表国内城市    2代表境外国家
	//根据code,pcode来查询对应的地区
	function findArear(pcode, code) {
		var areaText = '';
		for(var i = 0; i < globalArea_normal.length; i++) {
			for(var j = 0; j < globalArea_normal[i].children.length; j++) {
				if(globalArea_normal[i].children[j].pid == pcode && globalArea_normal[i].children[j].id == code) {
					areaText = globalArea_normal[i].children[j].pname + ',' + globalArea_normal[i].children[j].name;
				} else {
					for(var k = 0; k < globalArea_normal[i].children[j].children.length; k++) {
						if(globalArea_normal[i].children[j].children[k].pid == pcode && globalArea_normal[i].children[j].children[k].id == code) {
							areaText = '中国'+','+ globalArea_normal[i].children[j].children[k].pname + ',' + globalArea_normal[i].children[j].children[k].name;
						}
					};
				}
			};
		};
		return areaText;
	};
	//判断境内境外
//	if(address.split(",")[0]!="中国"){
//		var str="";
//		$(".churchyard").removeClass("areaActive");
//		$(".overseas").addClass("areaActive");
//		for(var a=1;a<globalArea.length;a++){
//			var arrCity=globalArea[a].children;
//			for(var i in arrCity){
//				var han=arrCity[i].han;
//				if(han!=""){
//					if(han=="a"||han=="b"||han=="c"||han=="d"||han=="e"){
//						str+='<li data_pid="'+arrCity[i].pid+'">'+
//						'<a href="/center/qqqlist.html?dataid='+arrCity[i].id+'&conName='+arrCity[i].pname+"-"+arrCity[i].name+'">'+arrCity[i].name+'</a>'+
//						'</li>';
//					}
//				}
//			}
//		}
//		$(".area ul").html(str);
//	}else{
//		var str="";
//		$(".churchyard").addClass("areaActive");
//		$(".overseas").removeClass("areaActive");
//		var arrCity=globalArea[0].children;
//		for(var i in arrCity){
//			if(arrCity[i].children.length>0){
//				var courName=arrCity[i].children;
//				for(var j in courName){
//					var han=courName[j].han;
//					if(han=="a"||han=="b"||han=="c"||han=="d"||han=="e"){
//						str+='<li data_pid="'+courName[j].pid+'">'+
//						'<a href="/center/qqqlist.html?dataid='+courName[j].id+'&conName='+"中国-"+courName[j].pname+"-"+courName[j].name+'">'+courName[j].name+'</a>'+
//						'</li>';
//					}
//				}
//			}
//		}
//		$(".area ul").html(str);
//	}
	
	//获取某个地区下的的所有圈子
	var page = 1;
	var tag = false; //触发开关，防止;多次调用事件 
	var tag1=false;
	if(types==1){
		findCitycirclebycode({
			pageNum:1,
			pageSize:15,
			username:UserName,
			code:themeid
		},"/citycircle/findCitycircleByCode.do");
	}else if(types==2){
		findCitycirclebycode({
			pageNum:1,
			pageSize:15,
			username:UserName,
			pcode:themeid
		},"/citycircle/findCitycircleByPcode.do");
	}
	
	$(window).scroll(function(event) {
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height(); //整个文档的高度
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 2 >= scrollHeight) {
			if(tag == true) {
				tag = false;
				$("#dynamic_list").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
				page = page + 1;
				if(types==1){
					findCitycirclebycode({
						pageNum:page,
						pageSize:15,
						username:UserName,
						code:themeid
					},"/citycircle/findCitycircleByCode.do");
				}else if(types==2){
					findCitycirclebycode({
						pageNum:page,
						pageSize:15,
						username:UserName,
						pcode:themeid
					},"/citycircle/findCitycircleByPcode.do");
				}
			}

		}
	});
	//下拉加载推荐
	$(window).scroll(function(event) {
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height(); //整个文档的高度
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 2 >= scrollHeight) {
			if(tag1 == true) {
				tag1 = false;
				$("#dynamic_list2").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
				page = page + 1;
				findCitycircle({
					username:UserName,
					pageNum:page,
					pageSize:15
				})
			}

		}
	})
	function findCitycircle(datas){
		var strs="";
		$.ajax({
			type:"post",
			url:serviceHOST()+"/citycircle/findCityCircle.do",
			data:datas,
			headers: {
				"token": qz_token()
			},
			success:function(msg){
				$(".Toloadmore").remove();
				if(msg.status==0){
					$(".jiazai").hide();
					$("#dynamic_list2 .centerlist").show();
					if(msg.data == "" ){
						tag1 = false;
						return false;
					} 
					tag1 = true;
					var mssg=msg.data;
					if(UserName!=""){
						$("#dynamic_list2 .centerlist .addresss").html("猜你感兴趣");
					}else{
						$("#dynamic_list2 .centerlist .addresss").html("推荐");
					}
					
					for(var i=0;i<mssg.length;i++){
						var usercount=mssg[i].usercount;
					 	if(usercount>10000){
					 		usercount=change (usercount);
					 	}else{
					 		usercount=mssg[i].usercount;
					 	};
					 	var subStr="";
					 	if(mssg[i].circletopicanycontent.indexOf("content")>-1){
					 		subStr="";
					 	}else{
					 		subStr=toFaceImg(mssg[i].circletopicanycontent);
					 	}
					 	strs+='<li>'+
				  			'<div class="words clearfix">'+
				  				'<a class="addre" href="/center/global/mydynamic.html?code='+mssg[i].cityCircleId+'">'+
				  					'<p>'+mssg[i].themename+'<span>圈子<i>'+usercount+'</i>人</span></p>';
				  					if(mssg[i].circletopicanynickname!=""){
				  						'<span class="circleNames">'+mssg[i].circletopicanynickname+':<b>'+subStr+'</b></span>';
				  					};
				  				strs+='</a>';
				  				if(UserName!=""){
				  					if(mssg[i].isAttention==0){      //  1是创建   0 是未加入        2是加入
				  						strs+='<a class="joinCir on" themeno="'+mssg[i].cityCircleId+'" href="javascript:;">加入</a>';
				  					}else{
				  						strs+='<a class="joinCir off" href="/center/global/mydynamic.html?code='+mssg[i].cityCircleId+'">进入</a>';
				  					}
				  				}else{
				  					strs+='<a class="joinCir login_window" href="javascript:;">加入</a>';
				  				}
				  			strs+='</div>';
				  			if(mssg[i].imagePathList!=""){
				  				strs+='<div class="imglis clearfix">';
				  				for(var a=0;a<mssg[i].imagePathList.length;a++){
				  					if(a<4){
				  						strs+='<a href="/center/global/mydynamic.html?code='+mssg[i].cityCircleId+'"><img src="'+ImgHOST()+mssg[i].imagePathList[a]+'" alt="" /></a>';
				  					}
				  				}
				  				strs+='</div>';
				  			}
				  			
				  		strs+='<p class="circleAddress">'+findArear(mssg[i].citypcode, mssg[i].citycode)+'</p>'+'</li>';
					}
					$("#dynamic_list2 .tjlist ul").append(strs);
					if(page != 1) AfterTheLoadCompleted();   //侧导航下移 
					
				}else if(msg.status==-3){
					getToken();
				};
			},
			error:function(){
				console.log("err");
			}
		});
	}
	
	//城市下的圈子列表
	function findCitycirclebycode(datas,urls) {
		var str = "";
		var per = ""; //活跃人数为加入人数的一半
		var joinCount="";
		$.ajax({
			type: "post",
			url: serviceHOST() + urls,
			dataType: "json",
			data:datas,
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				$(".Toloadmore").remove();
				if(msg.status == 0) {
					$("#dynamic_list .centerlist .addresss").html(address);
					$(".jiazai").hide();
					$("#dynamic_list .centerlist").show();
					tag = true;
					if(msg.data == "" || msg.data.citycirclelist == ""){
						tag = false;
					}
					var lens=msg.data.citycirclelist;
					console.log(msg.data.citycirclelist != "")
					if(msg.data.pages.total!=0){
						for(var i = 0; i < lens.length; i++) {
							var usercount=lens[i].usercount;
							if(usercount>10000){
						 		usercount=change (usercount);
						 	}else{
						 		usercount=lens[i].usercount;
						 	};
							str+='<li>'+
						  			'<div class="words clearfix">'+
						  				'<a class="addre" href="/center/global/mydynamic.html?code='+lens[i].citycircle.citycircleId+'">'+
						  					'<p>'+lens[i].citycircle.themename+'<span>圈子<i>'+lens[i].citycircle.usercount+'</i>人</span></p>';
						  					if(lens[i].topic!=null){
						  						var subStr="";
											 	if(lens[i].topic.content.indexOf("content")>-1){
											 		subStr="";
											 	}else{
											 		subStr=lens[i].topic.content;
											 	}
						  						str+='<span class="circleNames">'+lens[i].topic.nickname+':<b>'+subStr+'</b></span>';
						  					}
						  				str+='</a>';
						  				if(UserName!=""){
						  					if(lens[i].citycircle.iscreateorjoin==0){       //  1是创建   0 是未加入        2是加入
						  						str+='<a class="joinCir on" themeno="'+lens[i].citycircle.citycircleId+'" href="javascript:;">加入</a>';
						  					}else{
						  						str+='<a class="joinCir off" href="/center/global/mydynamic.html?code='+lens[i].citycircle.citycircleId+'">进入</a>';
						  					}
						  				}else{
						  					str+='<a class="joinCir login_window" href="javascript:;">加入</a>';
						  				}
						  			str+='</div>';
						  			if(lens[i].citycircle.imagepathList!=""&&lens[i].citycircle.imagepathList!=null){
						  				str+='<div class="imglis clearfix">';
						  					for(var a=0;a<lens[i].citycircle.imagepathList.length;a++){
						  						if(a<4){
						  							str+='<a href="javascript:;"><img src="'+ImgHOST()+lens[i].citycircle.imagepathList[a]+'" alt="" /></a>';
						  						};
						  					}
							  			str+='</div>';
						  			}
						  		str+='<p class="circleAddress">'+findArear(lens[i].citycircle.pcode,lens[i].citycircle.code)+'</p>'+'</li>'
							
						}
						$("#dynamic_list .tjlist ul").append(str);
					}else{
						str='<div class="datanull">'+
						  		'<span><img src="/img/qz_quanqiuquanLOGO.png"/></span>'+
						  		'<i>暂无圈子</i>'+
						  		'<div class="btns">'+
						  			'<a class="creatcir" href="/center/cjqz.html">创建圈子</a><a class="tjcir" href="/center/qqq.html">推荐圈子</a>'+	
						  		'</div>'+
						  	'</div>';
						$("#dynamic_list .tjlist").html(str);
						tag1=false;
						$("#dynamic_list2").show();
						findCitycircle({
							username:UserName,
							pageNum:1,
							pageSize:15
						})
					}
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("err")
			}
		});
	}
	
	
	//退出加入的全球圈
//	$(document).on("click",".lists .qq_joins.off",function(){
//		var code=$(this).attr("themeno");
//		var _this=$(this);
//		$.ajax({
//			type:"post",
//			url:serviceHOST()+"/citycircleusermap/deletejoinCitycircle.do",
//			data:{
//				"username":UserName,
//				"citycircleId":code
//			},
//			headers: {
//				"token": qz_token()
//			},
//			success:function(msg){
//				var joinS=JSON.parse(msg)
//				if(joinS.status==0){
//					if(joinS.data==1){
//						_this.removeClass("off");
//						_this.addClass("on");
//						friendlyMessage("退出成功",function(){
//							_this.html("加入")
//						})
//					}
//				}
//			},
//			error:function(){
//				console.log("error");
//			}
//		});
//	})
	
})
