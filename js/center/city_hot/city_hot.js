$(function(){
	cityHot()
	function cityHot() {
		$.ajax({
			type: "get",
			dataType:"jsonp",
			url: "//api.map.baidu.com/location/ip?ak=gcLLgpc9GLakQTBQzfeNDZaeHM31Vyz2",
			success: function(addressmsg) {
				if(getCookie("locationName")){
					var address_detail = getCookie("locationName")||"北京市";
				}else{
					var address_detail = addressmsg.content.address_detail.city||"北京市";
				}
				
				$.ajax({
					url: serviceHOST() + "/tcProduct/tcHotRecommend.do",
					data: {"pageNum":1,"pageSize":3,"cityName":address_detail,"myname":getCookie("username")},
					dataType: "json",
					headers: {
						"token": qz_token()
					},
					type: "post",
					async: false,
					success: function(msg) {
						var peiceShowAllAry= {
						    0: "面议",
						    1: "1000元以下",
						    2: "1000-2000元",
						    3: "2000-3000元",
						    4: "3000-5000元",
						    5: "5000-8000元",
						    6: "8000-12000元",
						    7: "12000-20000元",
						    8: "20000-25000元",
						    9: "25000元以上"
						}
						if(msg.data.length>0){
							var msg = msg.data;
							var str = "";
							for(var i=0; i<3; i+=1){
								var productImgs = "";
								if(msg[i].tcProduct.imagepath){
									if(msg[i].tcProduct.imagepath.length>2){
										var tcImgLen = 2;
									}else{
										var tcImgLen = msg[i].tcProduct.imagepath.length;
									}
									for(var j = 0; j<tcImgLen; j++){
										productImgs += '<li><img src="' + ImgHOST()+msg[i].tcProduct.imagepath[j]+'" alt="同城热点" /></li>'
									}
								}
								if(msg[i].user.imgforheadlist.length){
									var urban_headimg = ImgHOST()+msg[i].user.imgforheadlist[0].imagepath;
								}else{
									var urban_headimg = "/img/bgHead.png"
								}
								if(msg[i].tcProduct.type==1){
									var urban_price = peiceShowAllAry[msg[i].tcProduct.originalPrice]||"面议";
								}else if(msg[i].tcProduct.price==0){
									var urban_price = "面议"
								}else{
									if(msg[i].tcProduct.type==3){
										var urban_price = msg[i].tcProduct.price+"元"
									}else{
										var urban_price = msg[i].tcProduct.price+"元/月"
									}
								}
								console.log(msg[i].tcProduct.content.length)
								if(msg[i].tcProduct.content.length>33){
									var tcConLen = msg[i].tcProduct.content.slice(0, 33)+"...";
								}else{
									var tcConLen = msg[i].tcProduct.content;
								}
								if(msg[i].tcProduct.location.split("|")[0].slice(-1)=="市"&&msg[i].tcProduct.location.split("|")[1].slice(-1)=="市"){
									var tcLocation = msg[i].tcProduct.location.replace(msg[i].tcProduct.location.split("|")[0]+"|","").replace("|","-").replace("|","-").replace("|","-")
								}else{
									var tcLocation = msg[i].tcProduct.location.replace("|","-").replace("|","-").replace("|","-")
								}
								if(msg[i].tcProduct.contacts!==""&&msg[i].tcProduct.contacts){
									var tcProCon = msg[i].tcProduct.contacts;
								}else{
									var tcProCon = msg[i].tcProduct.username;
								}
								str+=
								'<li class="cityHot_container">'+
							        '<h3><a href="/center/shopDetails.html?id='+msg[i].tcProduct.id+'">'+msg[i].tcProduct.title+'</a></h3>'+
							        '<ul>'+productImgs+'</ul>'+
							        '<div class="cityHot_price"><span>'+urban_price+'</span></div>'+
							        '<div class="cityHot_address"><span>'+tcLocation+'</span></div>'+
							        '<p>'+tcConLen+'</p>'+
							        '<div class="cityHot_person">'+
							        	'<img src="'+urban_headimg+'" alt="头像" />'+
							        	'<span>'+tcProCon+'</span>'+
							        	'<span class="tcProType">'+msg[i].tcProduct.productType+'</span>'+
							        '</div>'+
							    '</li>';
							}
							console.log(msg[0].tcProduct.imagepath)
							$(".cityHotList").html("").html(str)
						}else{
							// $(".cityHot").css({paddingBottom: '0'});
							$(".cityHot").remove()
						}
					},
					error: function() {
						console.log("错误，请重试！");
					}
				});
			}
		})








		
	}
})
//"pageNum":1,"pageSize":3,"type":"0",