$(function(){
	var uses = getCookie("username")||""; //用户名
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
	//向用户推荐圈子
	var page = 1;
	var tag = false; //触发开关，防止;多次调用事件
	findCitycircle({  
		username:uses,
		pageNum:1,
		pageSize:15
	});
	$(window).scroll(function(event) {
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height(); //整个文档的高度
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 2 >= scrollHeight) {
			if(tag == true) {
				tag = false;
				$("#dynamic_list").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
				page = page + 1;
				findCitycircle({
					username:uses,
					pageNum:page,
					pageSize:15
				});
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
					$(".centerlist").show();
					if(msg.data == "" ){
						tag = false;
						return false;
					} 
					tag = true;
					var mssg=msg.data;
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
				  						strs+='<span class="circleNames">'+mssg[i].circletopicanynickname+':<b>'+subStr+'</b></span>';
				  					}
				  					
				  				strs+='</a>';
				  				if(uses!=""){
				  					if(mssg[i].isAttention==0){       //  1是创建   0 是未加入        2是加入
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
				  			
				  		strs+='<p class="circleAddress">'+findArear(mssg[i].citypcode, mssg[i].citycode)+'</p>'+
				  		'</li>';
					}
					$(".tjlist ul").append(strs);
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
	
	
})