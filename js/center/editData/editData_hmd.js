$(function(){
	function add0(m){return m<10?'0'+m:m }  
  function formatDate(needTime){  
     //needTime是整数，否则要parseInt转换  
       var time = new Date(needTime);  
       var y = time.getFullYear();  
       var m = time.getMonth()+1;  
       var d = time.getDate();  
       var h = time.getHours();  
      var mm = time.getMinutes();  
      var s = time.getSeconds();  
      return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);  
  }
  
	//查询黑名单列表
	var itemList = [];//黑名单数组
	function sarch_Blacklist(datas){
		im.localLoadingOn(".pblist ul");
		var str="";
		$.ajax({
			type: "get",
			url: RestfulHOST() + '/privacyList/get',
			data:datas,
			headers: {
				"Authorization": "AQAa5HjfUNgCr27x",
				"Content-Type": "multipart/form-data"
			},
			success: function(msg) {
				im.localLoadingOff(".pblist ul");
				if (msg.status == 0) {
					var items=msg.data;
					var dataXml=loadXML(items);        //在common.js里面写的函数
					var htmlItem=$(dataXml).find("list").html();   
					var lens=$(dataXml).find("list item");
					if(lens.length>0){
						var tag = true;
						for(var i=0;i<lens.length;i++){
							itemList.push(lens.eq(i)[0].outerHTML);  //黑名单数组
							console.log(itemList)
							var userValue=lens.eq(i).attr("value").split("@")[0];
							var nickN=lens.eq(i).attr("nickName")||shieldNumber(userValue);
							var headSrc=lens.eq(i).attr("imgHead");
							var hersex=lens.eq(i).attr("sex");
							var herlevel=lens.eq(i).attr("level");
							var times=lens.eq(i).attr("time");
							if(headSrc!=""){       //头像
								if(headSrc.indexOf('http')>-1){
									headSrcs=headSrc;
								}else{
									headSrcs=ImgHOST()+headSrc;
								}
							}else{
								headSrcs='/img/first.png';
							};
							//昵称
							if(nickN.length>12){
								nickN=nickN.substr(0,12)+"...";
							};
							str+='<li class="blackList" username="'+userValue+'" imgHead="'+headSrc+'" time="'+times+'">'+
								'<div class="conBox clearfix">'+
									'<div class="imgs"><img src="'+headSrcs+'"/></div>'+
									'<dl>'+
										'<dt>'+nickN+'<i>';
										if(hersex=="男"){
											str+='<img src="/img/h/sj_boy_' + herlevel+ '.png" alt="">';
										}else{
											str+='<img src="/img/h/sj_gril_' + herlevel + '.png" alt="">';
										}
										str+='</i></dt>'+
//										'<dt>'+nickN+'</dt>'+
										'<dd class="wordDre">拉黑时间<span>'+formatDate(Number(times))+'</span></dd>'+
										'<dd class="jcBtn">解除</dd>'+
									'</dl>'+
								'</div>'+
							'</li>';
						}
					}else{
						str+='<li class="nodata">';
						str+='<div></div>'
						str+='<p>还没有被拉黑的人</p>'
						str+='</li>'
					};
					$(".pblist ul").html(str);
				}
			},
			error: function() {
				warningMessage("加载黑名单列表失败");
			}
	
		});
	}
	
	sarch_Blacklist({
		username: UserName
	});	
	
	function set_Blacklist(_index,_this){     //更新黑名单
		var timestamp = new Date().getTime();   //时间戳
		itemList.splice(_index,1);       //数组去除一个
		var htmlItem = ""
		for(var i = 0;i < itemList.length;i++){
			htmlItem += itemList[i];
		}
		var strs='<li class="nodata"><div></div><p>还没有被拉黑的人</p></li>';
		var  privacyList='<query xmlns="jabber:iq:privacy">'+
							'<list name="public">'+
								htmlItem +
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
					friendlyMessage("解除成功",function(){
						_this.parents("li").remove();
						if($(".pblist ul li").length==0){
							$(".pblist ul").html(strs);
						}
					});
				}
			},
			error: function() {
				warningMessage("拉黑失败");
			}
	
		});
	}
	
	//解除 更新黑名单
	$(document).on("click",".pblist .jcBtn",function(){
		var _index = $(this).parents(".blackList").index();
		var _this=$(this);
		$.im.shieldHint("确定解除黑名单吗？",function(){
			set_Blacklist(_index,_this);
		})
		
	})
	
})
