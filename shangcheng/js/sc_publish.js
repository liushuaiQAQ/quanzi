
$(function(){
	if(!getCookie("username")){
		$(".masks,.viewBox1").show();
		return false;
	};
	var loc={
		x:"",
		y:"",
		code:"",
		iden:"",//id
		flag:true,//视频取消
		sc:false
	};
	var err_info={
		t:true,//标题
		d:true,//描述
		p:true,//价格
		i:true,//图片/视频
		a:false,//地址
		m:true,//联系-总
		m_l:true,//联系人-分
		m_p:true//联系电话-分
	};
	var typeName={
		1:"职位",
		2:"租房",
		3:"二手物品",
		4:"家政",
		5:"商家服务"
	}
	$(".classify_val").attr("data-id",getURIArgs("typeId"));//一级id
	$(".classify_val").val(getURIArgs("className"));//二级name
	if(getURIArgs("typeId")){
		$(".classify").html(typeName[getURIArgs("typeId")]+"-"+getURIArgs("className"));
	}
	
	switch ($(".classify_val").attr("data-id")){
		case "1"://职业
			$(".JS_price_up").hide();
			$(".JS_price_down").show();
			break;
			default:
			$(".JS_price_up").show();
			$(".JS_price_down").hide();
			break;
	}
	if($(".classify_val").attr("data-id")=="3"){//二手上传必传标志
		$(".wrap_localUpload").parents("dd").prev("dt").find(".JS_isMust").show();
	}else{
		$(".wrap_localUpload").parents("dd").prev("dt").find(".JS_isMust").hide();
	}	
	var rep= /^[1-9]+[0-9]*]*$/;
	//分类
	getlist_info();
	function getlist_info(){
		$.ajax({
			type:"post",
			url:serviceHOST()+"/tcProduct/selectTcProductType.do",
			dataType:"json",
			headers: {
				"token": qz_token()
			},
			success:function(msg){
				getClass_do(msg);
			}
		});
	};
	
	function getClass_do(msg){
		getClass_l(msg);
		getClass_r(msg,0);
		$(document).on("mouseenter",".cate_mainmenu_l li",function(){
			var index=$(this).attr("data-index");
			$(this).addClass("active").siblings("li").removeClass("active");
			getClass_r(msg,index);
		})
		
	}
	function getClass_l(msg){
		var str="";
		for(var i=0;i<msg.data.length;i++){
			str+='<li data-index='+i+' data-id='+msg.data[i].id+'><span>'+msg.data[i].classname+'</span><i></i></li>'
		}
		$(".cate_mainmenu_l").html(str);
		$(".cate_mainmenu_l li").eq(0).addClass("active");
	}
	function getClass_r(msg,D){
		var str="";
		var msg_list=msg.data[D];
		for(var i=0;i<msg_list.subTcProductTypes.length;i++){
			var cur=msg_list.subTcProductTypes[i];
			str+='<li><a href="javascript:;">'+cur.classname+'</a></li>'
		}
		$(".cate_mainmenu_r ul").html(str);
	};
	//地图经纬度
	 	var map = new BMap.Map("Bmap_main"); 
	  	map.centerAndZoom("北京", 12); 
	   	var localSearch = new BMap.LocalSearch(map);		
		function searchByStationName(D) { 
	       	localSearch.setSearchCompleteCallback(function (searchResult) { 
		        var poi = searchResult.getPoi(0); 
		        loc.x=poi.point.lng;
		        loc.y=poi.point.lat;
		        //console.log( poi.point.lng + "," + poi.point.lat); 
		    }); 
		    localSearch.search(D); 
		} 
	//发布
	$(document).on("click",".JS_btn",function(){
			if(!getCookie("username")){
				$(".masks,.viewBox").show();
				return false;
			};
			if($(".JS_title").val()==""){//标题
				$(".JS_title").parent("dd").next(".Err_Tip").html("标题不能为空").show();
				err_info.t=false;
			}else if($(".JS_title").val().length<8){
				$(".JS_title").parent("dd").next(".Err_Tip").html("标题不足8个字").show();
				err_info.t=false;
			}else{
				$(".JS_title").parent("dd").next(".Err_Tip").html("").hide();
				err_info.t=true;
			}
			if($(".JS_desi").val()==""){//描述
				$(".JS_desi").parents("dd").next(".Err_Tip").html("描述不能为空").show();
				err_info.d=false;
			}else if($(".JS_desi").val().length<10){
				$(".JS_desi").parents("dd").next(".Err_Tip").html("描述不足10个字").show();
				err_info.d=false;
			}else{
				$(".JS_desi").parents("dd").next(".Err_Tip").html("").hide();
				err_info.d=true;
			}
			switch ($(".classify_val").attr("data-id")){
				case "1"://职业
					var thatval=$(".wrap_down").find("option:selected").val();
					if(thatval==""){
						$(".JS_price_down").parents("dd").nextAll(".Err_Tip").html("请选择价格").show();
						err_info.p=false;
					}else{
						$(".JS_price_down").parents("dd").nextAll(".Err_Tip").html("").hide();
						err_info.p=true;
					}
					break;
				default:
					if($(".JS_price").val()==""){//价格 up
						$(".JS_price").parents("dd").nextAll(".Err_Tip").html("价格不能为空").show();
						err_info.p=false;
					}else  if(!rep.test($(".JS_price").val())&&$(".JS_price").val()!="面议"){//是否是正整数和面议
						$(".JS_price").parents("dd").nextAll(".Err_Tip").html("只能填写正整数和面议").show();
						err_info.p=false;
					}else{
						$(".JS_price").parents("dd").nextAll(".Err_Tip").html("").hide();
						err_info.p=true;
					}
					break;
			}
			
			if($(".JS_linkUser").val()==""){//联系人
				$(".JS_linkUser").parents("dd").next(".Err_Tip").html("联系人不能为空").show();
				err_info.m=false;
				err_info.m_l=false;
			}else if($(".JS_linkUser").val().length<2||$(".JS_linkUser").val().length>6){
				$(".JS_linkUser").parents("dd").next(".Err_Tip").html("联系人有误").show();
				err_info.m=false;
				err_info.m_l=false;
			}else{
				$(".JS_linkUser").parents("dd").next(".Err_Tip").html("").hide();
				err_info.m_l=true;
			}
			if($(".JS_linkPhone").val()==""){//联系电话
				$(".JS_linkPhone").parents("dd").next(".Err_Tip").html("联系电话不能为空").show();
				err_info.m=false;
				err_info.m_p=false;
			}else if($(".JS_linkPhone").val().length!=11){
				$(".JS_linkPhone").parents("dd").next(".Err_Tip").html("联系电话有误").show();
				err_info.m=false;
				err_info.m_p=false;
			}else{
				$(".JS_linkPhone").parents("dd").next(".Err_Tip").html("").hide();
				err_info.m_p=true;
			}
			if(err_info.m_l&&err_info.m_p){
				$(".JS_linkUser,.JS_linkPhone").parents("dd").next(".Err_Tip").html("").hide();
				err_info.m=true;
			}
			if(!err_info.a){//地址
				$(".z_Street").parents("dd").nextAll(".Err_Tip").html("地址不能为空").show();
			}else{
				$(".z_Street").parents("dd").nextAll(".Err_Tip").html("").hide();
			}
			//填写有误弹窗
			if($(".JS_title").val()==""||$(".JS_title").val().length<8){//标题填写有误
				warningMessage("标题填写有误");
				return false;
			}
			if($(".JS_desi").val()==""||$(".JS_desi").val().length<10){//描述填写有误
				warningMessage("描述填写有误");
				return false;
			}
			switch ($(".classify_val").attr("data-id")){//价格填写有误
				case "1"://职业
					var thatval=$(".wrap_down").find("option:selected").val();
					if(thatval==""){
						warningMessage("价格填写有误");
						return false;
					}
					break;
				default:
					if($(".JS_price").val()==""){//价格 up
						warningMessage("价格填写有误");
						return false;
					}else  if(!rep.test($(".JS_price").val())&&$(".JS_price").val()!="面议"){//是否是正整数和面议
						warningMessage("价格填写有误");
						return false;
					}
					break;
			}
			if($(".classify_val").attr("data-id")==3){//二手图片/视频必传—图片不能为空
				if(!$(".update_con").find("div").hasClass("videoCon")&&!$(".update_con li").hasClass("JS_delimg")){
					warningMessage("图片不能为空");
					return false;
				}
			}
			if(!err_info.a){//地址
				warningMessage("地址填写不完整");
				return false;
			}
			if($(".JS_linkUser").val()==""){//联系人未填写
				warningMessage("联系人不能为空");
				return false;
			}else if($(".JS_linkUser").val().trim().length<2||$(".JS_linkUser").val().trim().length>6){
				warningMessage("联系人有误");
				return false;
			}
			if($(".JS_linkPhone").val()==""){//联系电话
				warningMessage("联系电话不能为空");
				return false;
			}else if($(".JS_linkPhone").val().length!=11){
				warningMessage("联系电话有误");
				return false;
			}			
		var J_address={
			p:$(".z_provinces").find("option:selected").text()||"",
			c:$(".z_cities").find("option:selected").text()||"",
			d:$(".z_districts").find("option:selected").text()||"",
			t:$(".z_Street").find("option:selected").text()||"",
			a:$(".z_ad_info").val()||"",
			lot:"",
			all:"",
		};
		//console.log(J_address)
		if(J_address.p!="请选择省"){
			switch (J_address.p){
				case "北京市":
					J_address.lot="";
					break;
				case "天津市":
					J_address.lot="";
					break;
				case "上海市":
					J_address.lot="";
					break;
				default:
					J_address.lot+=J_address.p+"|";
					break;
			}
			J_address.all+=J_address.p;
		}
		if(J_address.c!="请选择市"){
			J_address.lot+=J_address.c;
			J_address.all+=J_address.c;
		}
		if(J_address.d!="请选择区"){
			J_address.lot+="|"+J_address.d;
			J_address.all+=J_address.d;
		}
		if(J_address.t!="请选择街道"){
			J_address.lot+="|"+J_address.t;
			J_address.all+=J_address.t;
		}
		J_address.all=J_address.all+J_address.a;
		if(loc.x==""||loc.y==""){
			searchByStationName(J_address.all);
		}
		var data={
				productType:$(".classify_val").val(),
				type:$(".classify_val").attr("data-id"),
				title:$(".JS_title").val().trim(),
				content:$(".JS_desi").val().trim(),
				//price:getPrice,//面议 0
				longitude:loc.x,
				dimensionality:loc.y,
				location:J_address.lot,
				address:J_address.a,
				username:getCookie("username"),
				mobile:$(".JS_linkPhone").val().trim(),
				otMobile:$(".JS_other").val().trim(),
				isCommit:true,
				business:loc.code,
				contacts:$(".JS_linkUser").val().trim(),
//				id:314,
				videourl:$(".videoCon").attr("data-url"),
				id:loc.iden
		}
		switch ($(".classify_val").attr("data-id")){//价格
			case "1":
			data["price"]=0;
				data["originalPrice"]=$(".wrap_down").find("option:selected").val();
				break;
			default:
				var getPrice="";
				if($(".JS_price").val()=="面议"){//价格 price
					getPrice=0
					data["price"]=getPrice;
				}else{
					getPrice=$(".JS_price").val()||"";
					data["price"]=getPrice;
				};
				break;
		}
		var dataN = JSON.stringify(data);
		console.log(dataN)
		if($(".classify_val").attr("data-id")==3){//二手图片/视频必传
			if(!$(".update_con").find("div").hasClass("videoCon")&&!$(".update_con li").hasClass("JS_delimg")){
				$(".wrap_localUpload").parents("dd").nextAll(".Err_Tip").html("图片不能为空").show();
				$(".wrap_localUpload").parents("dd").prev("dt").find(".JS_isMust").show();
				err_info.i=false;
			}else{
				$(".wrap_localUpload").parents("dd").prev("dt").find(".JS_isMust").hide();
				$(".wrap_localUpload").parents("dd").nextAll(".Err_Tip").html("").hide();
				err_info.i=true;
			}
		}else{
			$(".wrap_localUpload").parents("dd").nextAll(".Err_Tip").html("").hide();
			$(".wrap_localUpload").parents("dd").prev("dt").find(".JS_isMust").hide();
			err_info.i=true;
		}
		console.log(err_info.t&&err_info.d&&err_info.p&&err_info.a&&err_info.m&&err_info.i)
		if(err_info.t&&err_info.d&&err_info.p&&err_info.a&&err_info.m&&err_info.i){	
			post_data(dataN);
		}
	});
	function post_data(D){
		$.ajax({
			type:"post",
			url:serviceHOST()+"/tcProduct/createProductTWO.do",
			dataType:"json",
			headers: {
				"token": qz_token()
			},
			data:{tcProduct:D},
			success:function(msg){
				if(msg.status==0){
					loc.sc=true;
					$("input,textarea,#uploadMass").val("");
					
					$(".z_provinces").html("<option value=''>请选择省</option>");
					$(".z_cities").html("<option value=''>请选择市</option>");
					$(".z_districts").html("<option value=''>请选择区</option>");
					$(".z_Street").html("<option value=''>请选择街道</option>");
					
					$(".postAchieve,#mask").show();
					$(".postAchieve .pub_info").attr("href","/center/shopDetails.html?id="+loc.iden);
					$(".postAchieve .pub_admin").attr("href","/center/me/release.html");
				}else{
					knowMessage(msg.info);
				}
			},
			error:function(){
				console.log("error")
			}
		});	
	}
	$(document).on("click",".postAchieve .pub_add",function(){
		$(".postAchieve").hide();
		$(".postCategory").show();
		$(".postCategory").find(".z_close").addClass("on");
	});
	
	//blur 交互	
	$(document).on("blur",".JS_title",function(){//标题
		if($(this).val().trim()==""){
			$(this).val("");
			$(this).parents("dd").next(".Err_Tip").html("标题不能为空").show();
		}else if($(this).val().trim().length<8){
			$(this).val($(this).val().trim());
			$(this).parents("dd").next(".Err_Tip").html("标题不足8个字").show();
		}else{
			$(this).val($(this).val().trim());
			$(this).parents("dd").next(".Err_Tip").html("").hide();
		}
	});		
	$(document).on("blur",".JS_desi",function(){//描述
		if($(this).val().trim()==""){
			$(this).val("");
			$(this).parents("dd").next(".Err_Tip").html("描述不能为空").show();
		}else if($(this).val().trim().length<8){
			$(this).val($(this).val().trim());
			$(this).parents("dd").next(".Err_Tip").html("描述不足10个字").show();
		}else{
			$(this).val($(this).val().trim());
			$(this).parents("dd").next(".Err_Tip").html("").hide();
		}
	});	
	$(document).on("blur",".JS_price",function(){//价格
		if($(this).val().trim()==""){
			$(this).val("");
			$(this).parents("dd").nextAll(".Err_Tip").html("价格不能为空").show();
		}else  if (!rep.test($(this).val())&&$(this).val()!="面议"){//是否是正整数和面议
			$(this).val($(this).val().trim());
			$(this).parents("dd").nextAll(".Err_Tip").html("只能填写正整数和面议").show();
		}else{
			$(this).val($(this).val().trim());
			$(this).parents("dd").nextAll(".Err_Tip").html("").hide();
		}
	});	
	$(document).on("blur",".JS_linkUser",function(){//联系人
		if($(this).val().trim()==""){
			$(this).val("");
			$(this).parents("dd").next(".Err_Tip").html("联系人不能为空").show();
		}else if($(this).val().trim().length<2||$(this).val().trim().length>6){
			$(this).parents("dd").next(".Err_Tip").html("联系人有误").show()
		}else{
			$(this).val($(this).val().trim());
			$(this).parents("dd").next(".Err_Tip").html("").hide();
		}
	});
	$(document).on("blur",".JS_linkPhone",function(){//联系电话
		if($(this).val().trim()==""){
			$(this).val("");
			$(this).parents("dd").next(".Err_Tip").html("联系电话不能为空").show();
		}else if($(this).val().length!=11){
			$(this).val($(this).val().trim());
			$(this).parents("dd").next(".Err_Tip").html("联系电话有误").show();
		}else{
			$(this).val($(this).val().trim());
			$(this).parents("dd").next(".Err_Tip").html("").hide();
		}
	});
	$(document).on("blur",".JS_other",function(){//其他
		$(this).val($(this).val().trim());
	});
	$('.JS_linkUser').keyup(function(){
		var val=$(this).val().replace(/[^a-zA-Z\u4e00-\u9fa5]/g,'');
		$(this).val(val);
   });
	$('.JS_linkPhone').keyup(function(){  
            var _this=$(this);  
            if(/[^\d]/.test(_this.val())){//替换非数字字符  
              var temp_amount=_this.val().replace(/[^\d]/g,'');
              $(this).val(temp_amount);  
            } 
   });
	
	//手写地址 获取xy
	$(document).on("keyup",".z_ad_info",function(){
		var J_address={
			p:$(".z_provinces").find("option:selected").text()||"",
			c:$(".z_cities").find("option:selected").text()||"",
			d:$(".z_districts").find("option:selected").text()||"",
			t:$(".z_Street").find("option:selected").text()||"",
			a:$(".z_ad_info").val()||"",
			lot:"",
			all:"",
		};
		if(J_address.p!="请选择省"){
			J_address.lot+=J_address.p+"|";
			J_address.all+=J_address.p;
		}
		if(J_address.c!="请选择市"){
			J_address.lot+=J_address.c;
			J_address.all+=J_address.c;
		}
		if(J_address.d!="请选择区"){
			J_address.lot+="|"+J_address.d;
			J_address.all+=J_address.d;
		}
		if(J_address.t!="请选择街道"){
			J_address.all+=J_address.t;
		}
		J_address.all=J_address.all+J_address.a;
		//console.log(J_address)
		searchByStationName(J_address.all)
	})	
	$(document).on("click",".change_class",function(){
		$(".postCategory,#mask").show();
	});
	$(document).on("click",".z_close",function(){
		if($(this).hasClass("on")){//发布成功后新发关闭
			$.im.confirm("确定关闭吗？", function() {
				$(".postCategory,.commonNotice").hide();
				window.location.href="/shangcheng/prd/hot.html";
			})			
		}else{
			$(".postCategory,#mask").hide();
		}
	});	
	
	$(document).on("click",".cate_mainmenu_r li",function(){
		var hason=$(".postCategory .z_close").hasClass("on");
		var parent_id=$(".cate_mainmenu_l li.active").attr("data-id");
		var parent_txt=$(".cate_mainmenu_l li.active span").html();
		var child_txt=$(this).find("a").html();
		$(".classify").html(parent_txt+"-"+child_txt);
		
		$(".classify_val").attr("data-id",parent_id);
		$(".classify_val").val(child_txt);
		if(hason){
			window.location.href="/shangcheng/publish/index.html?typeId="+parent_id+"&className="+child_txt;
		}else{
			$(".postCategory,#mask").hide();
		}
		if(parent_id=="1"){//职位价格为区间
			$(".JS_price_up").hide();
			$(".JS_price_down").show();
		}else{
			$(".JS_price_up").show();
			$(".JS_price_down").hide();
		}
		
		if(parent_id=="3"){//二手上传必传标志
			$(".wrap_localUpload").parents("dd").prev("dt").find(".JS_isMust").show();
		}else{
			$(".wrap_localUpload").parents("dd").prev("dt").find(".JS_isMust").hide();
		}
		
	});
	
	getMyci();
	//职业圈
	function getMyci(){
		$.ajax({
			type:"get",
			url:serviceHOST()+"/jobstree/findJoinedJobstree.do",
			dataType:"json",
			async:false,
			headers: {
				"token": qz_token()
			},
			data:{username:getCookie("username")},
			success:function(msg){
				var mmsg=msg.data[msg.data.length-1];
				loc.code=mmsg.code;
			},
			error:function(msg){
				console.log("error")
			}
		});
	};	
	//字数
	$(".JS_title").on("keyup", function() {//标题
		checkNum2($(this), '20', ".JS_titleNum>i")
	})
	$(".JS_desi").on("keyup", function() {//描述
		checkNum2($(this), '500', ".JS_desiNum>i")
	})
	
	//判断字数
	function checkNum2(which, count, name) {
		var maxChars = count;
		if (which.val().trim().length > maxChars)
			which.val(which.val().substring(0, maxChars)).trim();
		var curr =  which.val().trim().length;
		$(name).html(curr.toString());
	};

    //读取所在地
    function readAddress(p,c,d,t){
        var P=p||"";
        var C=c||"";
        var D=d||"";
        var T=t||"";
        getAreaSelect_new(area_pub,//静态导出js
            {
                provinceClass:	"z_provinces",//省份select class名称
                cityClass:		"z_cities",//市select class名称
                districtClass:	"z_districts",//县区select class名称
                townClass:		"z_Street"//街区select class名称
            },
            //本组数据可选
            {
                pId:P, //省份ID
                cId:C, //市ID
                dId:D,  //县区ID
                tId:t  //街区ID
            })
    }

	//导出地址
	getAreaSelect_new(area_pub,//静态导出js
	{
		provinceClass:	"z_provinces",//省份select class名称
		cityClass:		"z_cities",//市select class名称
		districtClass:	"z_districts",//县区select class名称
		townClass:		"z_Street"//街区select class名称
	});	
	//获取地址
	function getAreaSelect_new(Data, CObj, AId) {
		var pS = CObj.provinceStr || "请选择省";
		var cS = CObj.cityStr || "请选择市";
		var dS = CObj.districtStr || "请选择区";
		var tS = CObj.townStr || "请选择街道";
		$("." + CObj.provinceClass).html("<option value=''>" + pS + "</option>");
		!CObj.cityClass || $("." + CObj.cityClass).html("<option value=''>" + cS + "</option>");
		!CObj.districtClass || $("." + CObj.districtClass).html("<option value=''>" + dS + "</option>");
		!CObj.townClass || $("." + CObj.townClass).html("<option value=''>" + tS + "</option>");
		var aObj = "";
		var s = "";
		for (var i = 0, len = Data.length; i < len; i++) {
			aObj = Data[i];
			s += addOption(aObj.id, aObj.name);
		}
		$("." + CObj.provinceClass).append(s);
		$("." + CObj.provinceClass).find("option").eq(1).hide();
		$(document).on("change", "." + CObj.provinceClass, function() {
			var _i = $(this).get(0).selectedIndex - 1;
			$(".z_ad_info").val("");
			$(document).off("change", "." + CObj.cityClass);
			if (_i < 0) {
				$("." + CObj.cityClass).html("<option value=''>" + cS + "</option>");
				$("." + CObj.districtClass).html("<option value=''>" + dS + "</option>");
				$("." + CObj.townClass).html("<option value=''>" + tS + "</option>");
				err_info.a=false;
				return false;
			}
			getCity(Data[_i].children);
			$("." + CObj.districtClass).html("<option value=''>" + dS + "</option>");
			$("." + CObj.townClass).html("<option value=''>" + tS + "</option>");
			err_info.a=false;
		});
		if (AId) {
			if (AId.pId) {
				$("." + CObj.provinceClass).find("option[value='" + AId.pId + "']").attr("selected", true);
				var _i = $("." + CObj.provinceClass).get(0).selectedIndex - 1;
				getCity(Data[_i].children);
			}
			if (AId.cId) {
				$("." + CObj.cityClass).find("option[value='" + AId.cId + "']").attr("selected", true);
				var _j = $("." + CObj.cityClass).get(0).selectedIndex - 1;
				//console.log(Data[_i].children[_j])
				if(Data[_i].children[_j]&&Data[_i].children[_j].children.length>1){
					getDistricts(Data[_i].children[_j].children);
				}else{
					$("." + CObj.districtClass).hide();
					$("." + CObj.townClass).hide();
				}
				
			}
			if (AId.dId) {
				$("." + CObj.districtClass).find("option[value='" + AId.dId + "']").attr("selected", true);
				var _k = $("." + CObj.districtClass).get(0).selectedIndex - 1;
//				console.log(Data[_i].children[_j].children[_k])
				if(Data[_i].children[_j].children[_k].children.length!=0&&Data[_i].children[_j].children[_k].children[0]&&Data[_i].children[_j].children[_k].children[0].content&&Data[_i].children[_j].children[_k].children[0].content.sub){
					getTown(Data[_i].children[_j].children[_k].children[0].content.sub);
				}else{
					$("." + CObj.townClass).hide();
				}
				
			}if (AId.tId) {
				$("." + CObj.townClass).find("option[value='" + AId.tId + "']").attr("selected", true);
			}
			err_info.a=true;
		}		
	
		function getCity(_D) {
			$("." + CObj.cityClass).html("<option value=''>" + cS + "</option>");
			var aObj2 = null;
			var s = "";
			for (var j = 0, len = _D.length; j < len; j++) {
				aObj2 = _D[j];
				s += addOption(aObj2.id, aObj2.name);
			}
			$("." + CObj.cityClass).append(s);
			$("." + CObj.cityClass).find("option").eq(1).hide();
			$(document).on("change", "." + CObj.cityClass, function() {
				var _j = $(this).get(0).selectedIndex - 1;
				$(".z_ad_info").val("");
				if (_j < 0) {
					$("." + CObj.districtClass).html("<option value=''>" + dS + "</option>");
					$("." + CObj.townClass).html("<option value=''>" + tS + "</option>");
					err_info.a=false;
					return false;
				}
				if(_D[_j].children.length==1&&_D[_j].children[0].name=="全部"){
					var proname=$("." + CObj.provinceClass).find("option:selected").text();
					searchByStationName(proname+_D[_j].name);
					$("." + CObj.districtClass).hide();
					$("." + CObj.townClass).hide();
					err_info.a=true;
				}else{
					getDistricts(_D[_j].children);
					$("." + CObj.districtClass).show();
					$("." + CObj.townClass).show();
					err_info.a=false;
				}
				$("." + CObj.townClass).html("<option value=''>" + tS + "</option>");
			});
		}
	
		function getDistricts(_D) {
			$("." + CObj.districtClass).html("<option value=''>" + dS + "</option>");
			var _data = "";
			var s = "";
			for (var k = 0, len = _D.length; k < len; k++) {
				_data = _D[k];
				s += addOption(_data.id, _data.name);
			}
			$("." + CObj.districtClass).append(s);
			$("." + CObj.districtClass).find("option").eq(1).hide();
			$(document).off("change", "." + CObj.districtClass);
			$(document).on("change", "." + CObj.districtClass, function() {
				var _k = $(this).get(0).selectedIndex - 1;
				$(".z_ad_info").val("");
				if (_k < 0) {
					$("." + CObj.townClass).html("<option value=''>" + dS + "</option>");
					err_info.a=false;
					return false;
				}
				//console.log(_D[_k].children)
				if(_D[_k].children.length!=0){
					if(_D[_k].children[0]&&_D[_k].children[0].content&&_D[_k].children[0].content.sub){
						//console.log(_D[_k].children[0].content.sub)
						getTown(_D[_k].children[0].content.sub);
						$("." + CObj.townClass).show();
						err_info.a=false;
					}
				}
				else{
					var proname=$("." + CObj.provinceClass).find("option:selected").text();
					var cityname=$("." + CObj.cityClass).find("option:selected").text();
					var disname=$("." + CObj.districtClass).find("option:selected").text();
					if(proname==cityname){
						proname="";
					}
					searchByStationName(proname+cityname+disname);
					$("." + CObj.townClass).html("<option value=''>" + tS + "</option>");
					$("." + CObj.townClass).hide();
					err_info.a=true;
				}
			});
		}
		function getTown(_D) {
			$("." + CObj.townClass).html("<option value=''>" + tS + "</option>");
			var _data = "";
			var s = "";
			for (var h = 0, len = _D.length; h < len; h++) {
				_data = _D[h];
				s += addOption(_data.area_code , _data.area_name);
			}
			$("." + CObj.townClass).append(s);
			$(document).on("change", "." + CObj.townClass, function() {
				var _h = $(this).get(0).selectedIndex - 1;
				$(".z_ad_info").val("");
				if (_h < 0) {
					err_info.a=false;
					return false;
				}
				var proname=$("." + CObj.provinceClass).find("option:selected").text();
				var cityname=$("." + CObj.cityClass).find("option:selected").text();
				var disname=$("." + CObj.districtClass).find("option:selected").text();
				var townname=$("." + CObj.townClass).find("option:selected").text();				
				searchByStationName(proname+cityname+disname+townname);
				
				err_info.a=true;
			});
		}
	
		function addOption(k, v, aeraId) {
			var option = "<option value='" + k + "'>" + v + "</option>";
			return option;
		}
	}
	
	//获取id
	if(!getURIArgs("productId")){
		getPUbID();
	};
	function getPUbID(){
		var data={
			"username":getCookie("username"),
			"business":loc.code,
		};
		var odata = JSON.stringify(data);
		$.ajax({
			type:"post",
			async:false,
			url:serviceHOST()+"/tcProduct/createProduct.do",
			data:{tcProduct:odata},
			dataType:"json",
			headers: {
				"token": qz_token()
			},
			success:function(msg){
				loc.iden=msg.data;
			},
			error:function(){
				console.log("error");
			}
		});
	}

	
	
 window.onbeforeunload = function(){
 	if(loc.sc==false){
  		return "此页面要求您确认想要离开 - 您输入的数据可能不会被保存。";
 	}
  }


//上传图片、视频
var fileNames="";
document.domain = "quanzinet.com";
$(document).on("change", "#uploadMass", function() {
	if(!getCookie("username")){
		$(".masks,.viewBox").show();
		return false;
	};
	var _this = this;
	//获取上传的文件大小
	if(navigator.userAgent.indexOf("MSIE 6.0") < 0) {
		if(navigator.userAgent.indexOf("MSIE 7.0") < 0) {
			if(navigator.userAgent.indexOf("MSIE 8.0") < 0) {
				if(navigator.userAgent.indexOf("MSIE 9.0") < 0) {
					var file = $(this)[0].files[0];
					var fileSize = (Math.round(file.size / (1024 * 1024)));
				}
			}
		}
	}
	
	if($(".update_con li").hasClass("JS_delimg")){
		if(!isFileType(["jpg", "png", "gif"], _this)) {
			knowMessage("请上传jpg、png、gif格式的文件");
			return false;
		};
	}
	if($(".update_con").find("div").hasClass("videoCon")){
		if(!isFileType(["mp4"], _this)) {
			knowMessage("仅支持mp4格式的文件");
			return false;
		};
	}
		if(!isFileType(["jpg", "png", "gif"], _this)&&!isFileType(["mp4"], _this)) {
			knowMessage("请上传jpg、png、gif格式的文件");
			return false;
		};
	
	if(isFileType(["jpg", "png", "gif"], _this)){
		if(!checkFileSize(_this, 5)) {
			knowMessage("上传文件大于5M，请重新上传");
			return false;
		};
		var files = _this.files;
		if($(".update_con li").length >= 9) {
			knowMessage("上传的文件数量不能超过9个！请重新选择！");
			return false;
		}
		imgUpload("uploadMass", {
			"type": 1024, 
			"size": fileSize,
			"id":loc.iden
		});
		
	}else if(isFileType(["mp4"], _this)){
		if(!checkFileSize(_this, 20)) {
			knowMessage("仅能上传小于20M的视频");
			return false;
		}
		loc.flag=true;
		fileNames = isFileName(_this);
		var vsign=$(this).val();
		$(".update_finish,.upStatus").show();
		imgUploadVideo("uploadMass",vsign, {
			"size": fileSize,
			"type": 512, 
//			"id":loc.iden
		});		
		
	}


});

	function imgUpload(id, data) {
	if($(".update_con li").length>=9){
			$(".wrap_localUpload").hide();
			knowMessage("上传的文件数量不能超过9个！请重新选择！");
			return false;
		}
		//  计算上传多张图片  默认图
			$(".update_con").append('<li class="JS_seat" style="height:122px;border:1px solid #e5e5e5;"><i class="upload_img_i"></i></li>'); //未加载时默认图片
		//最多上传九张
		//console.log($(".update_con li").length)
		
	
		$.ajaxFileUpload({
			//type:"post",
			url: serviceHOST() + "/file/uploadFile1.do",
			secureuri: false,
			fileElementId: id,
			dataType: 'json',
			headers: {
				"token": qz_token()
			},
			timeout: 100000, //超时时间设置
			data: data,
			success: function(msg) {
				$(".wrap_localUpload").parents("dd").nextAll(".Err_Tip").html("").hide();
				$(".update_con").show();
				$(".update_con .JS_seat").remove();
				console.log($(".update_con li").length+"----793")
				//显示图片数量
				if($(".update_con li").length>=8){
					$(".wrap_localUpload").hide();
				}
				var imglen=$(".update_con li").length;
				$(".update_con").attr("data-l",imglen);
				$(".update_con").append('<li class="JS_delimg" data-url='+msg.filename+'>'+
										'<img src=' + ImgHOST() + msg.filename + ' />'+
										'<p class="bottom">'+
										//'<span class="changeEedit">编辑</span>'+
										'<span class="changDel">删除</span>'+
										'</p>'+
										'</li>'
				);
			},
			error: function(msg) {
				console.log(msg)
				console.log("error");
			}
		});
	
	};
	
	// 上传视频
	var timer = null;
	function imgUploadVideo(id,D, data) {
		$(".uploadGro .barBg").css("width","0px");
		var pro = 0.01;
		var i = 0;
		var str = "";
		
//		console.log(D)
		var videoUrl = "";
		$.ajaxFileUpload({
			//type:"post",
			url: serviceHOST() + "/file/uploadVideoWeb.do",
			secureuri: false,
			fileElementId: id,
			dataType: 'json',
			headers: {
				"token": qz_token()
			},
			timeout: 100000, //超时时间设置
			data: data,
			success: function(msg) {
				if(msg.status == 0) {
					$(".wrap_localUpload").parents("dd").nextAll(".Err_Tip").html("").hide();
					//console.log(loc.flag)
					//进度条加载
					if(loc.flag==false){
						return false;
					}else{
						if(D.indexOf(fileNames+".mp4")!=-1){
							window.clearInterval(timer);
							timer = window.setInterval(startTime, 1);
			
							function startTime() {
								pro += 0.0058;
								if(pro >= 1) {
									pro = 1;
									window.clearInterval(timer);
								}
								$(".NumPro").html((pro * 100).toFixed(2) + "%");
								$(".uploadGro .barBg").css("width", pro * 360 + "px");
							}
							
							$(".videoUpLoading").html("视频上传成功");
							$(".msgWord span").hide();
							$(".upStatus").hide();
							$(".upSuccess").show(); //上传成功界面
							$(".wrap_localUpload").hide();
							update_sucess();
							$(".update_con").html('<div class="videoCon clearfix" data-url='+msg.filename+'><li>'+
							//http://quanzinet.com:9090/plugins/restapi/v1/files/download?filename=  视频名称+"-start"
									'<img src=http://quanzinet.com:9090/plugins/restapi/v1/files/download?filename='+msg.filename+'-start />'+
									'<p class="bottom">'+
									//'<span class="changeEedit">编辑</span>'+
									'<span class="changDel">删除</span>'+
									'</p>'+
									'<span class="play_btn"></span>'+
									'</li>'+
									'<p class="fileName">'+fileNames+'</p>'+
									'</div>'
							);					
						}
					}
	
				}
			},
			error: function(msg) {
				window.clearInterval(timer);
				console.log("error");
				console.log(msg)
			}
		});
	
		//执行进度条加载
		timer = window.setInterval(function() {
			pro = 1 - 300 / (300 + i++);
			$(".NumPro").html((pro * 100).toFixed(2) + "%");
			$(".uploadGro .barBg").css("width", pro * 360 + "px");
		}, 100);	
	}

	//得到视频文件的名字
	function isFileName(obj) {
		var ar = $(obj).val().split(".");
		var _t = ar[0];
		var _n = _t.split("\\");
		var _m = _n[_n.length - 1];
		return _m;
	}	

	//获取详情
	if(getURIArgs("productId")){
		getPUbinfor();
	};
	function getPUbinfor(){
		var data={
			"username":getCookie("username"),
			"productId":getURIArgs("productId"),
		};
		$.ajax({
			type:"post",
			url:serviceHOST()+"/tcProduct/selectTcProductByProductId.do",
			data:data,
			dataType:"json",
			headers: {
				"token": qz_token()
			},
			success:function(msg){
				if(msg.status==0){
					if(msg.data.tcProduct){
						var cur=msg.data.tcProduct;
						if(cur.username!=getCookie("username")){
							window.location.href="/index.html"
						}
						$(".classify").html(typeName[cur.type]+"-"+cur.productType);
						$(".classify_val").val(cur.productType);
						$(".classify_val").attr("data-id",cur.type);
						$(".JS_title").val(cur.title);
						$(".JS_desi").val(cur.content);
						$(".JS_titleNum i").html(cur.title.length);
						$(".JS_desiNum i").html(cur.content.length);
						if(cur.type==1){
							$(".JS_price_up").hide();
							$(".JS_price_down").show();
							$(".wrap_down").val(cur.originalPrice||"0");
						}else{
							$(".JS_price_up").show();
							$(".JS_price_down").hide();
							if(cur.price==0){
								$(".JS_price").val("面议");
							}else{
								$(".JS_price").val(cur.price);
							}
						}
						$(".JS_linkUser").val(cur.contacts||"");
						$(".JS_linkPhone").val(cur.mobile||"");
						$(".JS_other").val(cur.otMobile||"");
						
						$(".z_ad_info").val(cur.address||"");
						loc.x=cur.longitude;
						loc.y=cur.dimensionality;
						loc.iden=cur.id;
						//图片
						if(cur.imagepath&&cur.imagepath!=""){
							var str="";
							for(i=0;i<cur.imagepath.length;i++){
								str+='<li class="JS_delimg" data-url='+cur.imagepath[i]+'>'+
									'<img src=' + ImgHOST() + cur.imagepath[i] + ' />'+
									'<p class="bottom">'+
									//'<span class="changeEedit">编辑</span>'+
									'<span class="changDel">删除</span>'+
									'</p>'+
									'</li>'
							}
							$(".update_con").append(str).show();
							if(cur.imagecount>=9){
								$(".wrap_localUpload").hide();
							}
						}
						//视频
						if(cur.videourl&&cur.videourl!=""){
							var strV="";
								strV+='<div class="videoCon clearfix on" data-url='+cur.videourl+'><li>'+
									//http://quanzinet.com:9090/plugins/restapi/v1/files/download?filename=  视频名称+"-start"
									'<img src=http://quanzinet.com:9090/plugins/restapi/v1/files/download?filename='+cur.videourl+'-start />'+
									'<p class="bottom">'+
									//'<span class="changeEedit">编辑</span>'+
									'<span class="changDel">删除</span>'+
									'</p>'+
									'<span class="play_btn"></span>'+
									'</li>'+
									//'<p class="fileName"></p>'+
									'</div>'
							$(".update_con").append(strV).show();
							$(".wrap_localUpload").hide();
						}

						//省市县街start
						var add=cur.location;
						if(add!=""&&add!=undefined){
							var proId="";      //省的id;
							var cityId="";     //市的id;
							var distId="";     //县或区的id;
							var twnId="";     //街区的id;
							var pro=add.split("|")[0]       //省
							var mar=add.split("|")[1]       //市
							var cou=add.split("|")[2]       //区县
							var twn=add.split("|")[3]       //区县
							//console.log(area_pub)
							for(var i=0;i<area_pub.length;i++){    //获取省的id
								if(area_pub[i].name==pro){
									//得到省的id
									if(pro=="北京市"||pro=="天津市"||pro=="上海市"){
										if(add.split("|")[3]!=""&&add.split("|")[3]!=undefined){//4级存在
											proId=area_pub[i].id;  
											var childLen=area_pub[i].children;
										}else if(add.split("|")[2]!=""&&add.split("|")[2]!=undefined){//3级存在
											if(add.split("|")[1]=="北京市"||add.split("|")[1]=="天津市"||add.split("|")[1]=="上海市"){//兼容pc之前数据 市
												proId=area_pub[i].id;  
												var childLen=area_pub[i].children;
											}else{//兼容pc之前数据 只有市县或街
												switch (pro){
													case "北京市":
														mar="北京市";
														cou=add.split("|")[1];
														twn=add.split("|")[2];
														proId="110000";
														var childLen=area_pub[1].children;
														break;
													case "天津市":
														mar="天津市";
														cou=add.split("|")[1];
														twn=add.split("|")[2];
														proId="120000";
														var childLen=area_pub[2].children;
														break;
													case "上海市":
														mar="上海市";
														cou=add.split("|")[1];
														twn=add.split("|")[2];
														proId="310000";
														var childLen=area_pub[9].children;
														break;
													default:
														break;
												}
											}
											
											//console.log(childLen)
										}else{
											switch (pro){
												case "北京市":
													mar="北京市";
													cou=add.split("|")[1];
													twn=add.split("|")[2];
													proId="110000";
													var childLen=area_pub[1].children;
													break;
												case "天津市":
													mar="天津市";
													cou=add.split("|")[1];
													twn=add.split("|")[2];
													proId="120000";
													var childLen=area_pub[2].children;
													break;
												case "上海市":
													mar="上海市";
													cou=add.split("|")[1];
													twn=add.split("|")[2];
													proId="310000";
													var childLen=area_pub[9].children;
													break;
												default:
													break;
											}
										}
									}else{
										proId=area_pub[i].id;  
										var childLen=area_pub[i].children;
									}
									
									for(var a=0;a<childLen.length;a++){
										//console.log(childLen[a])
										if(childLen[a].name==mar){
											cityId=childLen[a].id;    //得到市的id;
										};
										for(var j=0;j<childLen[a].children.length;j++){
											//console.log(childLen[a].children[j])
											if(cou=="其它区"){
//												console.log(childLen[a].name)
												if(childLen[a].name==mar){
													if(childLen[a].children[j].name=="其它区"){
														distId=childLen[a].children[j].id;
													}
													//console.log(childLen[a].children[j].name)
													//console.log(childLen[a].name)   
												};
											}else{
												if(childLen[a].children[j].name==cou){
													distId=childLen[a].children[j].id;   //得到区或县的id;
												}
											}
											
											var thid_child=childLen[a].children[j];
											if(thid_child.children&&thid_child.children[0]&&thid_child.children[0].content&&thid_child.children[0].content.sub){
												for(var k=0;k<thid_child.children[0].content.sub.length;k++){
													//console.log(thid_child.children[0].content.sub[k])
													if(thid_child.children[0].content.sub[k].area_name==twn){
														twnId=thid_child.children[0].content.sub[k].area_code;   //得到街区域的id
														//console.log(twnId)
													}
												}
											}
										}
									}
								}
							};
							readAddress(proId,cityId,distId,twnId);      //读取省市县街
						};//省市县街end						
					}
				}else{
					console.log("error");
				}
			},
			error:function(){
				console.log("error");
			}
		});
	}
	
	// 删除视频
	$(document).on("click", ".videoCon .changDel", function() {
		var list = $(this).parents(".videoCon");
		var name=list.attr("data-url");
		if(list.hasClass("on")){//编辑
			$.im.confirm("确定要删除视频吗？", function() {
				delV(list,"512",name);
				$(".wrap_localUpload").show();
			})
		}else{//尚未发布
			$.im.confirm("确定要删除视频吗？", function() {
				list.remove();
				$(".wrap_localUpload").show();
			})
		}
		
	});
	//删除图片
	$(document).on("click", ".JS_delimg .changDel", function() {
		var list = $(this).parents("li");
		var name=$(this).parents("li").attr("data-url");
		var liLen=list.find("li").length;
			$.im.confirm("确定要删除图片吗？", function() {
				delV(list,"1024",name);
				if(liLen<=7){
					$(".wrap_localUpload").show();
				}else{
					$(".wrap_localUpload").hide();
				}
			})
	});

	function delV(_this,type,img){
		$.ajax({
			type:"post",
			url:serviceHOST()+"/file/delImage.do",
			headers: {
				"token": qz_token()
			},
			data:{type:type,id:loc.iden,imageName:img},
			dataType:"json",
			success:function(msg){
				_this.remove();
			},
			error:function(){
				_this.remove();
				console.log("error");
			}
		});
	}
	//取消视频上传
	$(document).on("click", ".msgWord span,.upload2 .backErr", function() {
		$(".alertMsgBox").show();
		$(".alertMsg").show();
	    
	})
	//取消视频上传   确定和取消按钮
	$(document).on("click", ".btnYes", function() {
		$(".update_finish,.alertMsgBox,.alertMsg").hide();
		$("#uploadMass").val("");
		window.clearInterval(timer);
		loc.flag=false;
		console.log(loc.flag)
		
	//	location.reload();
	});

	$(document).on("click", ".btnNo", function() {
		$(".alertMsgBox").hide();
		$(".alertMsg").hide();
	});
	
	function update_sucess(){
		setTimeout(function(){
			$(".update_finish,.upSuccess").fadeOut(300, function() {
				$(".update_finish,.upSuccess").hide();
				$("#uploadMass").val("");
				$(".videoUpLoading").html("视频上传中...");
				$(".upStatus .msgWord>span").show();
			})
		},2000)	
	}
	
	//上传视频成功界面
	$(document).on('click', ".upSuccess .kMsg", function() {
		$(".upSuccess,.fileBox").hide();
		$(".publish_video").show();
		$("#videoUpload,.videoUpload").addClass("on");
		$(".fileNameVideo").show().html(fileNames + '<span></span>')
	})

	//右侧
	//热门商品
	hot_shop();
	function hot_shop(){
		$.ajax({
			type: "post",
			url: serviceHOST() + "/tcProduct/tcHotProduct.do",
			headers: {
				"token": qz_token()
			},
			data: {pageSize:6,myname:getCookie("username")||""},
			dataType: "json",
			success: function(msg) {
				if(msg.status==0){
					if(msg.data[0]){
				        hot_shopList(msg);
	                    $(".hot_prd").slide({
							mainCell: ".hot_prd_list ul",
							autoPlay: true,
							autoPage: true,
							effect: "leftLoop",
							vis: 1,
							autoPlay: true,
							delayTime: 1000,
							interTime: 3000
						});
						for(var i=0; i < $(".hot_prd_list li").length; i+=1){
							//console.log(i)
							var imgWidth = $(".hot_prd_list li:eq("+i+") img").width();
							var imgHeight = $(".hot_prd_list li:eq("+i+") img").height();
							//console.log($(".hot_prd_list li:eq("+i+") img").width())
							//console.log($(".hot_prd_list li:eq("+i+") img").height())
							if(imgWidth<imgHeight){
								$(".hot_prd_list li:eq("+i+") img").css("width","100%")
							}else if(imgWidth>imgHeight){
								$(".hot_prd_list li:eq("+i+") img").css("height","100%")
							}else{
								$(".hot_prd_list li:eq("+i+") img").css("width","100%")
								$(".hot_prd_list li:eq("+i+") img").css("height","100%")
							}
						}						
					}else{
						$(".hot_prd_list ul").html("暂无相关商品。").css("textAlign","center")
					}
				}
	        },
			error: function() {
				console.log("error")
			}
	
		});		
	}
	function hot_shopList(msg) {
		var str = "";
		msg=msg.data;
		for(var i in msg){
			str+='<li>'+
				'<a href="/center/shopDetails.html?id='+msg[i].tcProduct.id+'">'+
				'<div class="img_box">'+
				'<img src="'+ImgHOST()+msg[i].tcProduct.imagepath[0]+'" alt="圈子商城" />'+
				'</div>'+
				'<p>'+msg[i].tcProduct.title+'</p>'+
				'</a>'+
				'</li>';	
		}
		$(".hot_prd_list ul").html(str);
		
	}
	//推荐
	recommend_shop();
	function recommend_shop(){
		$.ajax({
			type: "post",
			url: "https://api.map.baidu.com/location/ip?ak=gcLLgpc9GLakQTBQzfeNDZaeHM31Vyz2",
			data: {},
			dataType: "jsonp",
			success: function(msg) {
				if(getCookie("locationName")&&getCookie("locationName")!=""){
					var city=getCookie("locationName");
				}else{
					var city=msg.content.address;
				}
//				console.log(msg.content.address);
				$.ajax({
					type: "post",
					async:false,
					url: serviceHOST() + "/tcProduct/tcHotRecommend.do",
					headers: {
						"token": qz_token()
					},
					data: {pageNum:1,pageSize:10,myname:getCookie("username")||"",cityName:city},
					dataType: "json",
					success: function(msg) {
						if(msg.status==0&&msg.data!=""){
							recommend_shopList(msg);
							$(".cityHot").show();
						}else{
							$(".cityHot").hide();
						}
			        },
					error: function() {
						console.log("error")
					}
			
				});	
	        },
			error: function() {
				console.log("error")
			}
	
		});		
	};
	
	function recommend_shopList(msg) {
		var str = "";
		var price="";
		var Photo="";
		var getprice={
			0:"面议",
			1:"1000元以下",
			2:"1000-2000元",
			3:"2000-3000元",
			4:"3000-5000元",
			5:"5000-8000元",
			6:"8000-12000元",
			7:"12000-20000元",
			8:"20000-25000元",
			9:"25000元以上",
		}
		for(var i in msg.data){
			var cur=msg.data[i].tcProduct;
			if(i<3){
				
				if(cur.type==1){//职位 价格
					if(cur.originalPrice){
						cur.originalPrice!=0?price=getprice[cur.originalPrice]+"/月":price=getprice[cur.originalPrice];
					}else{
						price="面议";
					}
					
				}else{
					cur.price!=0?price=cur.price+"元":price="面议";
				}
				if(msg.data[i].user.imgforheadlist[0]&&msg.data[i].user.imgforheadlist[0]!=""){
					if(msg.data[i].user.imgforheadlist[0].imagepath){
						Photo='<img src="'+ImgHOST()+msg.data[i].user.imgforheadlist[0].imagepath+'" alt="头像" />';
					}
				}else{
					Photo='<img src="/img/first.png" alt="头像" />'
				}
				str +='<div class="cityHot_container">'+
						'<h3><a href="/center/shopDetails.html?id='+cur.id+'">'+cur.title+'</a></h3>';
						if(cur.imagepath&&cur.imagepath!=""){
							str+='<ul data-i='+cur.imagepath+'>';
	//						console.log(cur.imagepath.length+"length")
							for(var j=0;j<cur.imagepath.length;j++){
								if(j<2){
									str+='<li><a href="/center/shopDetails.html?id='+cur.id+'"><img src="'+ImgHOST()+cur.imagepath[j]+'" alt="圈子商城" /></a></li>';
								}
							}
							str+='</ul>';
						}
						
					str+='<div class="cityHot_price"><span>'+price+'</span></div>'+
						'<div class="cityHot_address"><span>'+cur.location+'</span></div>'+
						'<p class="content"><a href="/center/shopDetails.html?id='+cur.id+'">'+cur.content+'</a></p>'+
						'<div class="cityHot_person">'+
						'<div class="user_info" data-name='+cur.username+'>'+
							Photo+
						'<span class="name">'+msg.data[i].user.nickname+'</span>'+
						'</div>'+
						'<span class="pro_name">'+cur.productType+'</span>'+
						'</div>'+
						'</div>';	
					
			}
		}
		$(".cityHotList").html(str);
		
	}
	//推荐头像跳转介绍信息页
	$(document).on("click", ".cityHot_person .user_info", function() {
		var strangename = $(this).attr("data-name");
		console.log(strangename)
		getInfo({
			myname: getCookie("username") || "nouser",
			username: strangename,
			templetName: "pageJingtai"
		});
	});
	
	

})


