$(function(){
	var urls=getURIArgs("qno");
	//时间戳转化为月-日
	function   formatDates(now){     
              var   year=now.getYear();     
              var   month=now.getMonth()+1;     
              var   date=now.getDate();     
              var   hour=now.getHours();     
              var   minute=now.getMinutes();     
              var   second=now.getSeconds();     
              return   month+"-"+date  
            } 
    //处理评论内容转化表情
	function getlist(){
		var str="";
		$.ajax({
			type:"post",
			url:serviceHOST()+"/question/findQuestionByQuestionNo.do",
			headers: {
				"token": qz_token()
			},
			data:{
				username:17718435020,
				questionNo:urls
			},
			success:function(msg){
				var jsons=JSON.parse(msg);
				if(jsons.status==0){
					$(".autoCon h3").html(jsons.data.title);
					$(".autoCon span").html("来自职业圈"+"|"+jsons.data.fromtheme);
					$(".autoCon p").html(toFaceImg(jsons.data.content));
					$(".autoCon i").html(jsons.data.isfollow+"人关注");
					if(jsons.data.questionCommentlist.length==0){
						str+='<p class="noComment">'+"暂无评论"+'</p>'
					}else{
						var msgs=jsons.data.questionCommentlist;
						for(var i=0;i<msgs.length;i++){
							var times=msgs[i].createtime;
							var d=new Date(times)
							str+='<li>'+
								'<div class="userList">'+
									'<div class="headImg">'
									if(msgs[i].commentuser.userimagepath==""){
										str+='<img src="/img/first.png"/>'
									}else{
										str+='<img src="'+ImgHOST()+msgs[i].commentuser.userimagepath+'"/>'
									}
									str+='</div>'+
									'<div class="posText">'+
										'<p class="useName">'+msgs[i].commentuser.nickname+'</p>'+
										'<p class="times">'+formatDates(d)+'</p>'+
									'</div>'+
									'<br class="clear"/>'+
								'</div>'+
								'<div class="word">'+toFaceImg(msgs[i].content)+'</div>'+
							'</li>'
						}
						$(".ullist ul").html(str);
					}
					
				}else if(jsons.status==-3){
					getToken();
				};
			},
			error:function(){
				console.log("error");
			}
		});
	};
	getlist()
})
