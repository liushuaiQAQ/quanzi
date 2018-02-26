$(function(){
	function findUserScreenTopiclist(datas){
		im.localLoadingOn(".pblist ul");
		var str="";
		$.ajax({
			type:"post",
			url:serviceHOST()+"/topic/findUserScreenTopic.do",
			data:datas,
			headers: {
				"token": qz_token()
			},
			dataType:"json",
			success:function(msg){
				im.localLoadingOff(".pblist ul");
				if(msg.status==0){
					var msg=msg.data;
					if(msg!=""){
						for(var i=0;i<msg.length;i++){
							str+='<li data-type="'+msg[i].type+'" data-topic="'+msg[i].topic.topicNo+'" data-screenUsername="'+msg[i].user.username+'">'+
								'<div class="conBox clearfix">'+
									'<div class="imgs">';
									if(msg[i].user.imgforheadlist.length==0){
										var imagepath = '/img/first.png';
									}else{
										var imagepath = ImgHOST() + msg[i].user.imgforheadlist[0].imagepath;
									}
									str+='<img src="'+imagepath+'"/>';
									str+='</div>'+'<dl>';
									//设置备注名或者昵称
									if (!msg[i].user.remark|| msg[i].user.remark == "null") {      //没有备注名字的时候
										var nickna=msg[i].user.nickname;
										if(nickna.length>12){
											nickna=nickna.substr(0,13)+"...";
										}
										str+='<dt>'+ (nickna || shieldNumber(msg[i].user.username)) +'</dt>';
									} else {
										if(msg[i].user.remark==msg[i].user.username){
											var nickna=msg[i].user.nickname;
											if(nickna.length>12){
												nickna=nickna.substr(0,13)+"...";
											}
											str+='<dt>'+(nickna || shieldNumber(msg[i].user.username))+'</dt>';
										
										}else{
											str+='<dt>'+msg[i].user.remark+'</dt>';
										};
									};
									var conTit="";
									if(msg[i].topic.topictype==8){
										var conTopic=JSON.parse(msg[i].topic.content);
										conTit=conTopic.content || "";
									}else{
										conTit=msg[i].topic.content || "";
									}
									if(conTit.length>38){
										var shareTitle = conTit.substring(0, 38) + "...";
									}else{
										var shareTitle = conTit;
									}
									 str+='<dd class="wordDre">'+shareTitle+'</dd>';
									str+='<dd class="jcBtn">解除</dd>'+
									'</dl>'+
								'</div>'+
							'</li>';
						};
					}else{
						str+='<li class="nodata">';
						str+='<div></div>'
						str+='<p>还没有被屏蔽的动态</p>'
						str+='</li>'
					}
					$(".pblist ul").html(str);
				}
			},
			error:function(){
				warningMessage("加载屏蔽列表失败");
			}
		});
	};
	findUserScreenTopiclist({
		username:getCookie("username")
	})
	//用户解除屏蔽
	function deleteScreenTopic(datas,_this){
		var strs='<li class="nodata"><div></div><p>还没有被屏蔽的动态</p></li>';
		$.ajax({
			type:"post",
			url:serviceHOST()+"/topic/deleteScreenTopic.do",
			data:datas,
			headers: {
				"token": qz_token()
			},
			dataType:"json",
			success:function(msg){
				if(msg.status==0){
					friendlyMessage("解除屏蔽动态成功",function(){
						_this.parents("li").remove();
						if($(".pblist ul li").length==0){
							$(".pblist ul").html(strs);
						}
					});
				}
			},
			error:function(){
				warningMessage("解除失败");
			}
		});
	}
	$(document).on("click",".conBox .jcBtn",function(){
		var dataType=$(this).parents("li").attr("data-type");
		var dataTopic=$(this).parents("li").attr("data-topic");
		var dataScreenusername=$(this).parents("li").attr("data-screenusername");
		var _this=$(this);
		if(dataType==0){  //屏蔽单一个帖子
			$.im.shieldHint("确定解除屏蔽的此条动态吗？",function(){
				deleteScreenTopic({
					username:UserName,
					topicno:dataTopic,
					screenUsername:"",
					type:dataType
				},_this)
			});
		}else{   //屏蔽用户所有帖子
			$.im.shieldHint("确定解除屏蔽的此人动态吗？",function(){
				deleteScreenTopic({
					username:UserName,
					topicno:dataTopic,
					screenUsername:dataScreenusername,
					type:dataType
				},_this)
			});
		}
	})



})
