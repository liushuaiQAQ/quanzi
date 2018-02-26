/*******陌生人主页页面上半部分********/
var strangename = getURIArgs('from');
//主页 ， 粉丝 ， 关注跳转
$(document).on('click', '.nav>ul>li', function() {
	var _index = $(this).index();
	if (_index == 0) {
		getInfo({
			myname: getCookie("username") || "nouser",
			username: strangename,
			templetName: "pageJingtai"
		});
	} else if (_index == 1) {
		from = "quanzi";
	} else if (_index == 2) {
		from = "release";
	} else if (_index == 3) {
		from = "focus";
	} else if (_index == 4) {
		from = "funs";
	}
	if(_index != 0 && UserName){
		window.location.href = '/center/u/'+ from +'.html?from=' + strangename;
	}
})

$(document).on('mouseenter', '.personal_like ul li', function(e) {
	$('.cancel_more').hide();
	var relation = $('.friendStatus').attr('data-relation');
	var index = $(this).index();
	if (index == 0) {
		$('.personal_cancel').hide();
		if ($('.concern').attr('data-status') == 1) { //判断一下是不是已经关注，刚开始没有关注
			$(this).find('.personal_cancel').show();
		}
	} else if (index == 2) {
		//判断好友关系
		if (relation == 1 || relation == 2 || relation == 3) {
			$(this).find('.remove_friend').show();
		}
	} else if (index == 3) {
		$('.personal_cancel').hide();
		$(this).find('.cancel_more').show();
	}
	e.stopPropagation();
});

$(document).on('mouseleave', '.personal_like ul li', function(e) {
	$('.personal_cancel').hide();
	$('.cancel_more').hide();
	$('.remove_friend').hide();
	e.stopPropagation();
});


/*
 * 删除好友 users/roster
 * */
$(document).on("click", ".remove_friend", function() {
	var _this = $(this);
	RemovBuddys(UserName, strangename, _this);
})

/*删除好友 users/roster
 
 * */
function RemovBuddys(UserName, jid2add, attention) {
	var params = {
		username: UserName,
		jid2delete: jid2add
	};
	var par = $.param(params);
	$.ajax({
		type: "DELETE",
		url: RestfulHOST() + '/users/roster?' + par,
		dataType: "json",
		headers: {
			"Authorization": "AQAa5HjfUNgCr27x",
			"Accept": "application/json"
		},
		success: function(msg) {
			if (msg.status == 0) {
				friendlyMess("删除成功");
				attention.prev('.friendStatus').html('<i class="personal_jiahaoyou"></i>加为好友').attr('data-relation', 5);
			}
		},
		error: function() {
			console.log("error")
		}

	});
}

//点击关注的时候
$(document).on('click', '.concern', function() {
	if (UserName) {
		if ($(this).attr('data-status') == 0) {
			setFocus(UserName, strangename,'',3);
		}
	}
});

//点击取消的时候
$(document).on('click', '.personal_cancel', function() {
	$('.concern').attr('data-status', 0);
	unsetFocus(UserName, strangename,$(this),3);
});

//好友请求
$(document).on('click', '.friendBtn', function() {
	if ($(this).attr('data-relation') == 5) {
		var _this = $(this);
		AddfriendRequest(UserName, strangename, _this);
	}
})

/*******页面上半部分********/
/*
 * 
 * 修改好友备注名字 users/roster/update_markname
 * */
$(document).on("click", ".like_more .cancel_more .setting_remark", function() {
	if (UserName) {
		update_markname(UserName, strangename);
	}
})


//拉黑  加入黑名单
function set_Blacklist(herNickname,herImghead,herSex,herLevel,htmlItem){
	var timestamp = new Date().getTime();   //时间戳
	var  privacyList='<query xmlns="jabber:iq:privacy">'+
						'<list name="public">'+
							'<item action="deny" order="1" type="jid" nickName="'+herNickname+'" imgHead="'+herImghead+'" time="'+timestamp+'" sex="'+herSex+'" level="'+herLevel+'" value="'+strangename+'@imsvrdell1" />'+htmlItem+
						'</list>'+
					'</query>';
	var params = {
			username: UserName,
			privacyList:privacyList
		};
	var par = $.param(params);
	
	$.ajax({
		type: "post",
		url: RestfulHOST() + '/privacyList/update?'+par,
		headers: {
			"Authorization": "AQAa5HjfUNgCr27x",
			"Content-Type": "multipart/form-data"
		},
		success: function(msg) {
			if (msg.status == 0) {
				friendlyMessage(herNickname+"已添加至黑名单，您将不再收到对方的消息","",1000);
			}
		},
		error: function() {
			warningMessage("拉黑失败");
		}

	});
}
function sarch_Blacklist(datas){
	var herNickname=$('.personal_nikename').attr("data-nickname")||shieldNumber(strangename);
	var herImghead=$('.personal_nikename').attr("data-imgHead");
	var herSex=$('.personal_nikename').attr("data-sex");
	var herLevel=$('.personal_nikename').attr("data-level");
	$.ajax({
		type: "get",
		url: RestfulHOST() + '/privacyList/get',
		data:datas,
		headers: {
			"Authorization": "AQAa5HjfUNgCr27x",
			"Content-Type": "multipart/form-data"
		},
		success: function(msg) {
			if (msg.status == 0) {
				var items=msg.data;
				var dataXml=loadXML(items);
				var htmlItem=$(dataXml).find("list").html();
				var lens=$(dataXml).find("list item");
				var tag = true;
				for(var i=0;i<lens.length;i++){
					var userValue=lens.eq(i).attr("value").split("@")[0];
					if(userValue==strangename){ //等于的话证明已拉黑
						tag = false;
					}
				}
				if(tag){       
					set_Blacklist(herNickname,herImghead,herSex,herLevel,htmlItem)
				}else{
					friendlyMessage(herNickname+"已添加至黑名单，您将不再收到对方的消息","",1000);
				}
			}
		},
		error: function() {
			warningMessage("拉黑失败");
		}

	});
}
$(document).on('click',".set_Blacklist",function(){
	if(getCookie("username")){
		$.im.shieldHint('拉黑后，将不会收到对方发来的消息，可在"设置->黑名单"中解除',function(){
			sarch_Blacklist({
				username: UserName
			});		
		});
	};
})


//投诉用户
$(document).on('click', '.complain', function() {
	doTipExcomplaint(UserName, strangename, 2)
})

//投诉他关注的 或者粉丝
$(document).on('click', '.complaint', function() {
	var doTipEx = $(this).parents("li").attr("data-username");
	doTipExcomplaint(UserName, doTipEx, 2)
})