$(function() {
	var uses = getCookie("username")||""; //用户名
	//右侧生活圈分类
	getAllThemeCatetories();

	//向用户推荐圈子
	var page = 1;
	var tag = false; //触发开关，防止;多次调用事件
	getHotLifeCircle({               //0-全部帖子；1-职业圈帖子；2-全球圈帖子；3-生活圈帖子
		username:uses,
		category:3,
		pageNum:1,
		pageSize:7
	})
	$(window).scroll(function(event) {
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height(); //整个文档的高度
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight + 2 >= scrollHeight) {
			if(tag == true) {
				tag = false;
				$("#dynamic_list").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
				page = page + 1;
				getHotLifeCircle({               //0-全部帖子；1-职业圈帖子；2-全球圈帖子；3-生活圈帖子
					username:uses,
					category:3,
					pageNum:page,
					pageSize:7
				})
			}

		}
	})
	function getHotLifeCircle(datas) {
		var str = "";
		$.ajax({
			type:"post",
			url:serviceHOST()+"/userCircle/recommendCircleByUsernameEX.do",
			data:datas,
			headers: {
				"token": qz_token()
			},
			success:function(msg){
				$(".Toloadmore").remove();
				if(msg.status==0){
					$(".jiazai").remove();
					tag = true;
					var mssg = msg.data;
					if(mssg == ""){
						tag = false;
						return false;
					} 
					for(var i=0;i<mssg.length;i++){
						if(mssg[i].circlecategoryList.length>0){
							var n = (datas.pageNum - 1) * mssg.length + i;
							str+='<div class="centerlist">'+
								'<div class="classify">'+
								'<p class="titles" data-id="'+mssg[i].circlecategoryid+'">'+
								'<a href="/center/shfl.html?id='+mssg[i].circlecategoryid+'&t='+mssg[i].circlecategory+'&n='+n+'">更多</a>';
								if(mssg[i].circlecategoryList.length>6){
									str+='<i>换一批</i>'
								};
								str+='<span>'+mssg[i].circlecategory+'</span><br class="clear" /></p>'+
								'<div class="lists">'+'<ul class="clearfix">';
							for(var j = 0;j < mssg[i].circlecategoryList.length;j++) {
								var joinCount=mssg[i].circlecategoryList[j].usercount;
								if(joinCount>10000){
									joinCount=change (joinCount);
								};
								if(j<6){
									str+= '<li>' +
										'<a href="/center/life/mydynamic.html?code='+mssg[i].circlecategoryList[j].themeNo+'">';
									if(mssg[i].circlecategoryList[j].imagepath == "") {
										str += '<span><img src="/img/first.png"/></span>';
									} else {
										str += '<span><img src="' + ImgHOST() + mssg[i].circlecategoryList[j].imagepath + '" onerror=javascript:this.src="/img/first.png"></span>';
									};
									str += '<p>' + mssg[i].circlecategoryList[j].themename + '</p>' +
										'<i>'+joinCount+'人</i>' +
										'</a>' +
										'</li>';
									}
								}
							str+='</ul>'+
								'</div>'+
								'</div>'+'</div>';
							if(page != 1) AfterTheLoadCompleted();   //侧导航下移 
						}
					}
					$("#dynamic_list").append(str);
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log('error')
			}
		});
	}
	
	//点击换一批
	var n=1;
	$(document).on("click",".classify .titles i",function(){
		var _this=$(this);
		var ids=$(this).parents(".titles").attr("data-id");
		n++;
		$.ajax({
			type:"post",
			url:serviceHOST()+"/theme/findThemeCircle.do",
			data:{
				username:uses,
				category:ids,
				pageNum:n,
				pageSize:6
			},
			headers: {
				"token": qz_token()
			},
			success:function(msg){
				var str="";
				if(msg.status==0){
					var mssg=msg.data.circlecategoryList;
					if(mssg==""&&n!=1){
						n=0;
						_this.click();
					};
					str+='<ul class="clearfix">';
					for(var i=0;i<mssg.length;i++){
							var joinCount=mssg[i].usercount;
								if(joinCount>10000){
									joinCount=change (joinCount);
								};
								str+= '<li>' +
									'<a href="/center/life/mydynamic.html?code='+mssg[i].themeNo+'">';
								if(mssg[i].imagepath == "") {
									str += '<span><img src="/img/first.png"/></span>';
								} else {
									str += '<span><img src="' + ImgHOST() + mssg[i].imagepath + '" onerror=javascript:this.src="/img/first.png"></span>';
								};
								str += '<p>' + mssg[i].themename + '</p>' +
									'<i>'+joinCount+'人</i>' +
									'</a>' +
									'</li>';
					}
					str+='</ul>';
					_this.parents(".titles").siblings(".lists").html(str);
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log('error')
			}
		});
	})
	
	
})