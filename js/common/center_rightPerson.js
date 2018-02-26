$(function() {
	//获取个人资料信息
	if(UserName) findUserInformationEx();
	function findUserInformationEx(){
		$.ajax({
			type: "post",
			url: serviceHOST() + "/user/findUserInformationEx.do",
			data: {
				username:getCookie("username")
			},
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				var str = "";
				var head_img = "";
				if(msg.status == 0) {
					var mssg = msg.data;
					var headImg = "";
					//右侧个人信息
					if(mssg.imgforheadlist == "" || mssg.imgforheadlist == undefined) {
						headImg = "/img/first.png";
						str = '<a href="/center/me/page.html"><img src="/img/first.png" class="portrait"  /></a>';
					} else {
						headImg = mssg.imgforheadlist[0].imagepath;
						if(headImg == ""){
							str = '<a href="/center/me/page.html"><img src="/img/first.png" class="portrait"  /></a>';
						}else{
							str = '<a href="/center/me/page.html"><img src="' + ImgHOST() + mssg.imgforheadlist[0].imagepath + '" class="portrait"  /></a>';
						}
					}
					if($.trim(mssg.nickname)!=""){
						if(mssg.nickname.length>10){
							var nickName=mssg.nickname.substr(0,10)+"...";
						}else{
							var nickName=mssg.nickname;
						}
					}
					str += '<p class="message_name">' + (nickName || shieldNumber(UserName)) + '<span class="ranks">';
					if(mssg.sex == ""){
						if(mssg.level<=15){
							str+='<img src="/img/h/sj_boy_' + mssg.level + '.png"/>';
							$(".top_message .level img").attr("src",'/img/h/sj_boy_' + mssg.level + '.png');
						}else{
							str+='<img src="/img/h/sj_boy_N.png"/>';
							$(".top_message .level img").attr("src",'/img/h/sj_boy_N.png');
						}
					}else{
						if(mssg.level<=15){
							str+='<img src="/img/h/sj_' + user_level[mssg.sex.charCodeAt()] + '_' + mssg.level + '.png"/>';
							$(".top_message .level img").attr("src",'/img/h/sj_' + user_level[mssg.sex.charCodeAt()] + '_' + mssg.level +'.png');
						}else{
							str+='<img src="/img/h/sj_' + user_level[mssg.sex.charCodeAt()] + '_N.png"/>';
							$(".top_message .level img").attr("src",'/img/h/sj_' + user_level[mssg.sex.charCodeAt()] + '_N.png');
						}
					}
					str += '</span>';
					if(mssg.viplevel!=0){
						str+='<span class="vipPerson">'+'<img src="/img/h/sj_VIP_'+mssg.viplevel+'.png" />'+'</span>';
					}
					str+='</p>';
					if(mssg.realindustry=="" || mssg.realindustry == null){
						str += '<p class="hometown">' + mssg.myindustry + '</p>';
					}else{      //0 代表未认证  -1 代表认证失败     1代表认证中     3代表再次提交审核认证    2代表已认证
						if(mssg.realindustry.length>15){
							var realWork=mssg.realindustry.substr(0,15)+"...";
						}else{
							var realWork=mssg.realindustry;
						}
						if(mssg.certificateStatus == 0 || mssg.certificateStatus == -1){     
							str+='<p class="hometown">' + realWork +'<span class="notCertified"></span>'+'<i>未认证</i>'+'</p>';
						}else if(mssg.certificateStatus == 1 || mssg.certificateStatus == 3){        //3代表再次审核
							str+='<p class="hometown">' + realWork +'<span class="notCertified"></span>'+'<i>认证中</i>'+'</p>';
						}else if(mssg.certificateStatus == 2){
							str+='<p class="hometown">' + realWork +'<span class="notCertified2"></span>'+'<b></b>'+'</p>';
						}
					}
						str += '<ul>' +
						'<li>' +
						'<a href="/center/me/focus.html">关注<span>' + mssg.followingcnt + '</span></a>' +
						'</li>' +
						'<li>' +
						'<a href="/center/me/funs.html">粉丝<span>' + mssg.followercnt + '</span></a>' +
						'</li>' +
						'<li>' +
						'<a href="/center/me/page.html">动态<span>' + mssg.topictotal + '</span></a>' +
						'</li>' +
						'</ul>';
					$("#my_message .message_top").append(str);
					setCookie("userNo", mssg.userNo, 24 * 60);
				
					// 更新头像
					
					if(headImg != UserImg && headImg != undefined){
						if(headImg.indexOf(".png") == -1){
							setCookie("headImgkz", headImg, 24 * 60);
						}
						$(".head_img_n img").attr("src", headImg);
						$(".content_data .item_1 img").attr("src", headImg);
					}
					//更新昵称
					if(mssg.nickname != Nickname){
						$(".nicknames").html(nickName);
						setCookie("nickname",nickName,24 * 60);
					}
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}
	
		});
		
	}


	//换一批
	$(document).on("click",".HideRecommended",function(){
		recommendRosters(UserName,1);
		$(".main_bottom_ad_change").show();
	})



	//滑过显示移除
	$(document).on("mouseover", ".my_message .dispose_del", function() {
		$(this).html('<span class="Accordingreply">移除</span>');
		$(this).addClass("on");
	})
	$(document).on("mouseout", ".my_message .dispose_del", function() {
		$(this).removeClass("on");
		$(this).find(".Accordingreply").remove();
	})
	$(document).on("mouseover", ".personage_list .DeleteRecommended", function() {
		$(this).addClass("on");
		$(this).html('<span class="Accordingreply">移除</span>');
	})
	$(document).on("mouseout", ".personage_list .DeleteRecommended", function() {
		$(this).removeClass("on");
		$(this).find(".Accordingreply").remove();
	})

	//加好友请求
	$(document).on("click", ".personage_list .AddBuddy", function() {
		var jid2add = $(this).parents("li").attr("data-id");
		if(UserName) AddfriendRequest(UserName,jid2add,$(this))
	})

	




})