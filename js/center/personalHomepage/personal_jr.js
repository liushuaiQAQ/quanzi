$(function(){
	var _username = getCookie('username');
	//获取个人信息
	findUserInformation(_username,_username);
	//可能认识的人
	recommendRosters(_username);

	var dataList = [];
	var optionss = JSON.parse(localStorage.getItem(_username));
	
//	点击我的圈子
$(document).on("click",".wdqz p",function(){
	$(".wdqz .citType").toggle();
});

$(document).on('click',".citType a",function(){
	var data_type=$(this).attr("data-type");
	var _words=$(this).text();
	$(".wdqz p b").text(_words);
	$(".wdqz .citType").hide();
//	$('.jiazai').show();
	getQuestionList({
		username:_username,
		category:data_type           //category 分类 0 全部 1 职业圈 2 全球圈 3生活圈 4创建
	});
})
	
	
	getQuestionList({
		username:_username,
		category:0
	});
	function getQuestionList(datas){
		$('.circleContent>ul').html("");
		$('.no_publish').hide();
		var str = "";
		$.ajax({
			type: "post",
			url: serviceHOST() + "/userCircle/findJoinedAllCircleByUsernameAndCategory.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data:datas,
			success: function(msg) {
				console.log(msg);
				if(msg.status == 0){
					$('.jiazai').hide();
					if(msg.data.length == 0){
						$('.no_publish').show();
					}else{
						var str = '';
						for (var i = 0; i < msg.data.length; i++) {
							var circleType = msg.data[i].category;
							var code = '';
							if(circleType == 1){
								code = msg.data[i].code;
							}else if(circleType == 2){
								code = msg.data[i].cityCircleId;
							}else{
								code = msg.data[i].themeNo;
							}

							//未存储时
							if(optionss == "" || optionss == null){
								console.log(msg.data[i].topicCount + 1)
								dataList.push(msg.data[i].topicCount + 1);
							}else{
								//加入圈子数量发生改变
								if(optionss.length != msg.data.length){
									if(optionss[i] != msg.data[i].topicCount + 1 && optionss[i] != msg.data[i].topicCount){
										//console.log(optionss)
										optionss.splice(i,0, msg.data[i].topicCount);
									}
								}
								
							}

							str += '<li class="attention" data-code="'+ code +'" data-name="'+msg.data[i].themename+'" data-num="'+ msg.data[i].topicCount +'" data-type="'+ circleType +'" data-attention="'+msg.data[i].isAttention+'">'+		//type--category 1-职业圈帖子；2-全球圈帖子；3-生活圈帖子
							    '<a class="AttentionProfessional" href="javascript:;">'+
							       ' <div class="Imgheader">';
							           	if(msg.data[i].imagepath=="" || msg.data[i].imagepath == "null" || msg.data[i].imagepath == null){
								       		str+='<img src="/img/first.png" alt="">';
								       	}else{
								       		str+='<img src="'+ ImgHOST() + msg.data[i].imagepath+'" alt="">';
								       	}
							        str+='</div>'+
							        '<p><span class="themename">'+ msg.data[i].themename +'</span>';
							if(msg.data[i].isAttention == 1){
								str += '<span class="create"></span>';
							}else{
								str += '<span class="create on"></span>';
							}
							str += '</p><span class="attentioncount">'+ msg.data[i].usercount +'人加入</span>'+
							        '<span class="segmentation">|</span><span class="topiccount">'+ msg.data[i].activecount +'人活跃</span>';

							 // 第一次  存储小于返回 
								if(optionss == undefined || optionss == null || optionss == "" || optionss[i] > msg.data[i].topicCount){
									topiccount = msg.data[i].topicCount;

								// 点击进去之后  返回数据大于存储数据时 相减得到新数据

								}else if(optionss[i] < msg.data[i].topicCount){

									topiccount = msg.data[i].topicCount - optionss[i];
								}else{
									topiccount = 0;
								}
								
								if(topiccount != 0){
									str += '<i class="topiccnt">' + topiccount + '</i>';
								}

							'</li>';
						}
						$('.circleContent>ul').html(str);
						//  存储一次就不在存储，   只有点击进去会重新覆盖
						 if(optionss == "" || optionss == null){
							var str = JSON.stringify(dataList);  
							localStorage.setItem(_username,str);
						}
						optionss = JSON.parse(localStorage.getItem(_username));						
					}
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}
		})
	};

	$(document).on('click','.circleContent .attention',function(){
		var type = $(this).attr('data-type');		//1-职业圈帖子；2-全球圈帖子；3-生活圈帖子
		var isJoin = $(this).attr('data-attention');
		var _code = $(this).attr('data-code');
		var dataNames=$(this).attr('data-name');
		//  获取下标
		var _index = $(this).index();
		//  获取动态数量
		var _num = parseInt($(this).attr("data-num"));
		// 点击之后存储新的数据
		console.log(optionss)
		optionss.splice(_index,1, _num);
		var str = JSON.stringify(optionss);
		localStorage.setItem(_username,str);

		if(type == 1){
			if(dataNames.indexOf("\/")>-1){
				dataNames=dataNames.replace(/\//g, "_");
			}else{
				dataNames=dataNames;
			};
			window.location.href = '/center/zhiye/mydynamic.html?code=' + _code+"&dataName="+dataNames;
		}else if(type == 2){
			window.location.href = '/center/global/mydynamic.html?code=' + _code;
		}else{
			window.location.href = '/center/life/mydynamic.html?code=' + _code;
		}
	})

})