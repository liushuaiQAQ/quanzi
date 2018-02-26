$(function(){
     //读取年月日
//  var reg = /[\u4e00-\u9fa5]+/g
//  var infos = '2015年10月20日'
//  var last=infos.substring(0,infos.length-1)
//  var ret =bb.replace(reg ,"-") 
//  console.log(ret)
     
	  function isChineseChar(str){            //判断某个字符串中是否含有汉字
	   var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
	   return reg.test(str);
	} 
    function readbirthDay(D){
        if(D){
        	if(isChineseChar(D)==true){     //年月日格式                判断出生日期格式是xxxx-xx-xx   还是xxxx年xx月xx日 
        		//把汉字替换成横杠     年月日日期换成xxxx-xx-xx
        		var reg = /[\u4e00-\u9fa5]+/g          //中文字符正则
        		var last=D.substring(0,D.length-1)     //截掉字符串最后一个字符      日
			    var ret =last.replace(reg,"-");        //把年月日替换成-
	            var array=ret.split("-");
        	}else{           // xxxx-xx-xx 格式
         	 	var array=D.split("-");
	         }
	        var month="";
            var day="";
            var year=array[0];
	
            if(array[0]=="3000"){
                year="-1";
                month="-1";
                day="-1";
            }else{
                if(array[1].substr(0,1)=="0"){
                    month=array[1].substr(1,2);
                }else{
                    month=array[1]||"";
                }

                if(array[2].substr(0,1)=="0"){
                    day=array[2].substr(1,2);
                }else{
                    day=array[2]||"";

                }
            }
            getDateSelect({
                YClass:"birthYearS",//年obj
                MClass:"birthMonthS",//月obj
                DClass:"birthDayS",//日obj
                year:year,//设置年份
                month:month,//设置月份
                day:day//设置日期
            });
        }
    }
//   function readbirthDay(D){
//      if(D){
//       	 	var array=D.split("-");
//	            var month="";
//	            var day="";
//	            var year=array[0];
//	
//	            if(array[0]=="3000"){
//	                year="-1";
//	                month="-1";
//	                day="-1";
//	            }else{
//	                if(array[1].substr(0,1)=="0"){
//	                    month=array[1].substr(1,2);
//	                }else{
//	                    month=array[1]||"";
//	                }
//	
//	                if(array[2].substr(0,1)=="0"){
//	                    day=array[2].substr(1,2);
//	                }else{
//	                    day=array[2]||"";
//	
//	                }
//	            }
//          getDateSelect({
//              YClass:"birthYearS",//年obj
//              MClass:"birthMonthS",//月obj
//              DClass:"birthDayS",//日obj
//              year:year,//设置年份
//              month:month,//设置月份
//              day:day//设置日期
//          });
//      }
//  }

    //获取年月日
    function birthDayAll(){
        var  birthDate="";
        if($("#birthYear").val()>"-1"){
            birthDate+=$("#birthYear").val();
            if($("#birthMonth").val()>"-1"){
                if($("#birthMonth").val()>9){
                    birthDate+="-"+$("#birthMonth").val();
                    if($("#birthDay").val()>"-1"){
                        if($("#birthDay").val()>9){
                            birthDate+="-"+$("#birthDay").val();
                        }else{
                            birthDate+="-0"+$("#birthDay").val();
                        }
                    }
                }else{
                    birthDate+="-0"+$("#birthMonth").val();
                    if($("#birthDay").val()>"-1"){
                        if($("#birthDay").val()>9){
                            birthDate+="-"+$("#birthDay").val();
                        }else{
                            birthDate+="-0"+$("#birthDay").val();
                        }
                    }
                }

            }
        }
        return birthDate;
    }
    //读取所在地
    function readAddress(p,c,d){
        var P=p||"";
        var C=c||"";
        var D=d||"";
//      var arrayP=P.split("|");
//      var arrayC=C.split("|");
//      var arrayD=D.split("|");
        getAreaSelect(area,//静态导出js
            {
                provinceClass:	"JS_province",//省份select class名称
                cityClass:		"JS_city",//市select class名称
                districtClass:	"JS_district"//县区select class名称
            },
            //本组数据可选
            {
                pId:P, //省份ID
                cId:C, //市ID
                dId:D  //县区ID
            })
    }
// function readAddress(p,c,d){
//      var P=p||"";
//      var C=c||"";
//      var D=d||"";
//      var arrayP=P.split("|");
//      var arrayC=C.split("|");
//      var arrayD=D.split("|");
//      getAreaSelect(area,//静态导出js
//          {
//              provinceClass:	"JS_province",//省份select class名称
//              cityClass:		"JS_city",//市select class名称
//              districtClass:	"JS_district"//县区select class名称
//          }
//      )
// }

    //获取所在地的id
    function placeAddress(){
        var address="";
        var provinces=$("#provinces").val();
        var cities=$("#cities").val();
        var districts=$("#districts").val();
        if(districts>"-1"){
            address=districts;
        }else if(cities>"-1"){
            address=cities;
        }else{
            address=provinces;
        };
        return address;
    }
	//生日日期调用
	getDateSelect({ 
		   YClass:"birthYearS",//年obj 
		   MClass:"birthMonthS",//月obj 
		   DClass:"birthDayS",//日obj 
		   year:"",//设置年份 
		   month:"",//设置月份 
		   day:""//设置日期 
		}); 

	//导出省市县
	getAreaSelect(area,//静态导出js
	{
		provinceClass:	"JS_province",//省份select class名称
		cityClass:		"JS_city",//市select class名称
		districtClass:	"JS_district"//县区select class名称
	});
	/************************查询个人资料信息************************/
	findUserInformation({
		" myname":getCookie("username"),
		"username":getCookie("username")
	})
	var positionStatus="";
	var realuserName="";
	function findUserInformation(datas){
		//im.localLoadingOn(".main_right")    //局部开启
		$.ajax({
			type:"post",
			url:serviceHOST()+"/user/findUserInformationEx.do",
			dataType:"json",
			headers: {
				"token": qz_token()
			},
			data:datas,
			success:function(msg){
				//im.localLoadingOff(".main_right")        //关闭
				if(msg.status==0){
					setCookie("viplevel",msg.data.viplevel, 24 * 60);
					$(".accout_box input.nicknamess").val(msg.data.nickname);     //昵称
					$(".info").html(msg.data.magicno);                //圈子号
					positionStatus=msg.data.certificateStatus;
					$(".company").val(msg.data.company);               //公司
					$(".positions").val(msg.data.realindustry);          //职位   
					//$(".zhiye b").html(msg.data.myindustry);           //职业圈
					$(".zhiye b").attr("data-code",msg.data.code);
//					$(".qrcode").qrcode({      //生成二维码   暂时去除
//				         render: "table", 
//		                 width: 25*4, 
//		                 height:25*4, 
//				         text: serviceHOST()+"/center/editbjzl.html"
//			         });
					if(msg.data.certificateStatus==1||msg.data.certificateStatus==3){         //职位正在审核中，不允许修改公司和职位   否则接口异常
						$(".company").attr("readonly","true");
						$(".positions").attr("readonly","true");
					}
					realuserName=msg.data.realname;                //更新个人资料要用      职位认证匹配真实名字   公司   职位
					$(".level").html("Lv."+msg.data.level)     //圈子等级
					if(msg.data.sex=="男"){                  //判断性别
						$("#man").attr("checked","true");
						$(".level").css("background","#b7d9fc");
					}else{
						$("#women").attr("checked","true");
						$(".level").css("background","#ffbacf");
					}
					if(msg.data.birthday!="null"){
						readbirthDay(msg.data.birthday);      //读取年 月日
					}
					//地区
					/***********地区注释开始7.31*************/
					var add=msg.data.hometown;
					if(add!=""&&add!=undefined){
						var proId="";      //省的id;
						var cityId="";     //市的id;
						var distId="";     //现或区的id;
						var pro=add.split("|")[0]       //省
						var mar=add.split("|")[1]       //市
						var cou=add.split("|")[2]       //区县
						for(var i=0;i<area.length;i++){    //获取省的id
							if(area[i].name==pro){
								proId=area[i].id;      //得到省的id
								var childLen=area[i].children;
								for(var a=0;a<childLen.length;a++){
									if(childLen[a].name==mar){
										cityId=childLen[a].id;    //得到市的id;
									};
									for(var j=0;j<childLen[a].children.length;j++){
										if(childLen[a].children[j].name==cou){
											distId=childLen[a].children[j].id;   //得到区或县的id;
										}
									}
								}
							}
						};
						readAddress(proId,cityId,distId);      //读取省市县
//						$(".JS_province option").eq(0).text(pro);
//						$(".JS_city option").eq(0).text(mar);
//						$(".JS_district option").eq(0).text(cou);
					}
					/***********地区注释结束*************/
					//个性签名
					$(".edit").val(msg.data.sign)
					$("#numkq").html($(".edit").val().length);
					if(getCookie("username").indexOf("wx_")==0||getCookie("username").indexOf("qq_uid_")==0||getCookie("username").indexOf("xl_")==0){  //判断用户名开头字符串是不是第三方账号
						$(".bindMobile").show();
						var mobiles=$.trim(msg.data.mobiles);    //去除空格
						if(mobiles!=""){
							$(".bindMobile .phone").html(mobiles);
						}else{
							$(".bindMobile .phone").html("绑定手机号").addClass("on");
						}
					}
					//var _p=$(".JS_province option").eq(0).text("1222")
					//var pro=$(".JS_province option[value='"+_p+"']").text();  //获取省的值
				}else if(msg.status==-3){
					getToken();
				};
			},
			error:function(){
				console.log("error");
			}
		});
	}
	$(document).on("click",".company,.positions",function(){
		if(positionStatus==1||positionStatus==3){
			$(".successTit").show();
			$(".successTit span").css("background","#eeeeee url(/img/jingshi.png) no-repeat 10px center")
			$(".successTit span").html("职位认证中，公司和职位不可更改")
				setTimeout(function(){
					$(".successTit").hide();
			},1000);
		}
	})
	
	//保存修改个人信息
	$(".main_right input").on("keyup",function(){
		$(this).css("border-color","#a8a8a8");
		$(this).siblings(".titWord").hide();
	});
	var sexs="";
	$(".sub .sub_active").on('click',function(){
		var nickN=html2Escape($(".nicknamess").val());    //昵称
		var companys=html2Escape($(".company").val());   //公司
		var positionss=html2Escape($(".positions").val());   //职位
		//var zhiye=$(".zhiye b").html();        //职业圈
		//var zhiyeCode=$(".zhiye b").attr("data-code");
		if($("#man").attr("checked")=="checked"){
			sexs=$("#man").val();
			$(".level").css("background","#b7d9fc");
		}else{
			sexs=$("#women").val();
			$(".level").css("background","#ffbacf");
		}
		var _p=$(".JS_province").val();
		var _pro=$(".JS_province option[value='"+_p+"']").text();  //获取省的值
		var _c=$(".JS_city").val();
		var _city=$(".JS_city option[value='"+_c+"']").text();       //获取市的值
		var _d=$(".JS_district").val();
		var _county=$(".JS_district option[value='"+_d+"']").text();       //获取区县的值
		if(_pro=="请选择省"&&_city=="请选择市"&&_county=="请选择区"){
			var homes="";
		}else if(_city=="请选择市"&&_county=="请选择区"){
			var homes=_pro;
		}else if(_county=="请选择区"){
			var homes=_pro+"|"+_city;
		}
		else{
			var homes=_pro+"|"+_city+"|"+_county;
		}
		var conEdit=$.trim(html2Escape($(".edit").val()));         //个性签名
		if($(".nicknamess").val()==""){
			$(".titWord").show();
			$(".nicknamess").css("border-color","#f9533d")
			return false;
		}else if($(".nicknamess").val().length>16){
			$(".titWord").html("昵称不能多于16字").show();
			$(".nicknamess").css("border-color","#f9533d")
			return false;
		};
		if($(".company").val().length>20||$(".positions").val().length>20){
			$(".successTit").show();
			$(".successTit span").css("background","#eeeeee url(/img/jingshi.png) no-repeat 10px center")
			$(".successTit span").html("公司和职位不能超过20个字符")
				setTimeout(function(){
					$(".successTit").hide();
			},1000);
			return false;
		};
		if($(".zhiye i").html()=="加入"){
			warningMessage("职业圈不能为空，请先加入");
			return false;
		}
		if(!($(".birthYearS").val()=="-1"&&$(".birthMonthS").val()=="-1"&&$(".birthDayS").val()=="-1")){
			if($(".birthYearS").val()=="-1"){
				$(".dataTit").show();
				$(".birthYearS").css("border-color","#f9533d");
				$(".birthYearS").siblings("select").css("border-color","#e5e5e5");
				return false;
			}
			if($(".birthMonthS").val()=="-1"){
				$(".dataTit").show();
				$(".birthMonthS").css("border-color","#f9533d");
				$(".birthMonthS").siblings("select").css("border-color","#e5e5e5");
				return false;
			}
			if($(".birthDayS").val()=="-1"){
				$(".dataTit").show();
				$(".birthDayS").css("border-color","#f9533d");
				$(".birthDayS").siblings("select").css("border-color","#e5e5e5");
				return false;
			}
		}
		if($(".birthYearS").val()!="-1"&&$(".birthMonthS").val()!="-1"&&$(".birthDayS").val()!="-1"){
			$(".dataTit").hide();
			$(".births select").css("border-color","#e5e5e5");
		}
		//第一个职业圈的code
		var posCode=$(".zhiye b").eq(0).attr("data-code");
		var posnames=$(".zhiye b").eq(0).html();
		var mobilePrivacy = {          //手机公开与否      看注册的更新接口
			phones: "",
			mobileMsg:""
		}
		//console.log(realuserName)
		//更改个人资料信息
		var  paramuserVO={
	            "user": {
	                "birthday":birthDayAll(),
	                "sex": sexs,
	                "hometown":homes,
	                "nickname":nickN,
	                "locationX":"",
	                "code":posCode,
	                "locationY":"",
	                "sign":conEdit,
	                "username":getCookie("username"),    //必填
	                "myindustry":posnames,             //职业一个
	                "userNo": "",
	                "age": "",
	                "hot": "",
	                "starsign": "",
	                "interestlabel": "",
	                "imgcountforhead":"",
	                "mobiles":mobilePrivacy,
	                "realname":realuserName,
	                "company":companys,
	                "realindustry":positionss
	            },
	            "picturebeanList": [
	                {"imagepath":"","imagetype":"","size":0,"username":""},
					{"imagepath":"","imagetype":"","size":0,"username":""}
	            ],
	            "lawroleBeanList": [
	                {"industry":"","lawroleNo":"","rolename":"","type":""},
					{"industry":"","lawroleNo":"","rolename":"","type":""}
	            ]
       }
		 
		var paramuserVOval = JSON.stringify(paramuserVO);
		$.ajax({
			type:"post",
			url:serviceHOST()+"/user/updateUserInformation.do",
			dataType:"json",
			headers: {
				"token": qz_token()
			},
			data:{
				paramuserVO:paramuserVOval
			},
			success:function(msg){
				//im.localLoadingOff(".main")     //关闭*/
				if(msg.status==0){
					setCookie('nickname',nickN, 24 * 60);
					$('.nicknames').text(nickN);
					//$(".successTit").show();
					//$(".successTit span").css("background","#eeeeee url(/img/duihaoG.png) no-repeat 10px center");
					$(".births select").css("border-color","#e5e5e5");
					$(".dataTit").hide();
//					$(".successTit span").html("您已保存成功！");
//						setTimeout(function(){
//							$(".successTit").hide();
//					},1000);
					friendlyMessage("保存成功",function(){
						location.reload();
					});
				}else if(msg.status==-3){
					getToken();
				}else if(msg.status==-90){
					warningMessage("职位认证中，资料不可更改");
				}
			},
			error:function(){
				console.log("error")
			}
		});
	})
	
	$(".sub .cancel").on("click",function(){
		location.reload();
	})
	
	// 查询用户加入的职业圈
	function getpesonWork(datas){
		$.ajax({
			type:"post",
			url:serviceHOST()+"/jobstree/findJoinedJobstree.do",
			headers: {
				"token": qz_token()
			},
			data:datas,
			dataType:"json",
			success:function(msg){
				if(msg.status==0){
					var str="";
					if(msg.data!=undefined){
						$(".zhiye i").html("修改");
						if(msg.data.length>0){
							for(var i=0;i<msg.data.length;i++){
								str+='<b data-code="'+msg.data[i].code+'">'+msg.data[i].name+'</b>';
							}
							$(".zhiye i").before(str);
						};
					}else{
						$(".zhiye i").html("加入");
					}
				}else if(msg.status==-3){
					getToken();
				};
			},
			error:function(){
				console.log("error");
			}
		});
	}
	getpesonWork({
		username:getCookie("username")
	})
	/***********************职业圈修改开始*********************************/
	function getpesonWork2(datas){
		$.ajax({
			type:"post",
			url:serviceHOST()+"/jobstree/findJoinedJobstree.do",
			headers: {
				"token": qz_token()
			},
			data:datas,
			dataType:"json",
			success:function(msg){
				if(msg.status==0){
					var str="";
					if(msg.data!=""||msg.data!=undefined){
						for(var i=0;i<msg.data.length;i++){
							str+='<span class="gz_label industry" data-id="'+ msg.data[i].code +'"  data-name="'+msg.data[i].name+'">' + msg.data[i].name + '<i class="label_del labeldel02"></i></span>';
						}
						$(".Tojoin_content .label_list").html(str);
					};
				}else if(msg.status==-3){
					getToken();
				};
			},
			error:function(){
				console.log("error");
			}
		});
	}
	
	$(document).on("click",".zhiye i",function(){
		$(".workBoxs").show();
		$(".ProfessionalSearch input").val("");
		getpesonWork2({
			username:getCookie("username")
		});
		getCareercircle({          //获取职业圈分类
			username:getCookie("username"),    
			pageNum: 1,
			pageSize:63
		});
	})
	$(document).on("click", ".protit i", function() {
		$(".workBoxs").hide();
		$(".ProfessionalSearch input").val("");
	})
	$(document).on("click", ".prompt .cancel,.prompt .del", function() {
		$("#maskss").hide();
		$(".prompt").hide();
		getpesonWork2({
			username:getCookie("username")
		});
		$(".xg_saveBox .xg_save").css("background","#3FA435");
	})
	
	function getCareercircle(datas){
		im.localLoadingOn(".autoType ul");
		$.ajax({
			type: "post",
			url: serviceHOST() + "/jobstree/recommendJobStreeCircleByUsernameEX.do",
			data: datas,
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				im.localLoadingOff(".autoType ul");
				if (msg.status == 0) {
					var mssg = msg.data;
					getCarInfo(mssg);
				}else if(msg.status==-3){
					getToken();
				};
					
			},
			error: function() {
				console.log('error')
			}
		})
	}
	
	function getCarInfo(mssg){
		var str = "";
		if(mssg.length>0){
			for (var i = 0; i < mssg.length; i++) {
				var dataNames = mssg[i].themename;
			 	if (dataNames.indexOf("\/") > -1) {
			 		dataNames = dataNames.replace(/\//g, "_");
			 	} else {
			 		dataNames = dataNames;
			 	};
			 	var activeCount=mssg[i].activecount;
			 	if(activeCount>10000){
			 		activeCount=change (activeCount);
			 	}else{
			 		activeCount=mssg[i].activecount;
			 	}
			 	var subStr="";
			 	if(mssg[i].circletopicanycontent.indexOf("content")>-1||mssg[i].circletopicanycontent.indexOf("shareUrl")>-1){
			 		subStr="";
			 	}else{
			 		subStr=mssg[i].circletopicanycontent;
			 	}
			str+='<li data-code="'+mssg[i].code+'" data-name="'+dataNames+'">'+
				'<div class="wordPos clearfix">'+
					'<div>'+
						'<p>'+mssg[i].themename+'<span>圈子<i>'+activeCount+'</i>人</span></p>';
						if(mssg[i].circletopicanynickname!=""){
							str+='<b>'+mssg[i].circletopicanynickname+':'+subStr+'</b>';
						}
					str+='</div>';
					if(mssg[i].isAttention == 1 || mssg[i].isAttention == 2){       //0和1二种状态  1是已加入   0 是未加入        2是创建
						str+='<a class="joinorenter" data-status="'+mssg[i].isAttention+'" href="/center/zhiye/mydynamic.html?code='+mssg[i].code+'">进入</a>';
					}else{
						str+='<a class="joinorenter on" href="javascript:;">加入</a>';
					};
				str+='</div>'+
					'<div class="imglis">'+
						'<ol class="clearfix">';
						if (mssg[i].imagePathList.length > 0) {
							for (var a = 0; a < mssg[i].imagePathList.length; a++) {
								if(a<5){
									str+='<li><img src="'+ImgHOST()+mssg[i].imagePathList[a]+'" alt=""></li>';
								}
							}
						}
						str+='</ol>'+
					'</div>'+
				'</li>';
				}
			}else{
				str+='<li style="text-align:center;font-size:14px;color:#666;">暂无搜索结果</li>';
			}
			$(".autoType ul").html(str);
	}
	/*加入职业圈
	 */
	$(document).on("click", ".joinorenter", function() {
		var _this=$(this);
		if($(this).hasClass("on")){
			var codeId = $(this).parents("li").attr("data-code");
			//var pcodes=$(this).parents("li").attr("data-pcode");
			var names = $(this).parents("li").attr("data-name");
			//var descritions=$(this).parents("li").attr("data-descrition");
			if(getCookie("viplevel")==1){     //会员1 加入二个职业圈      会员2加入3个    会员三加入4个
				if($(".label_list span").length==2){
					warningMessage("加入圈子已达最大限度，请升级为VIP","",2000);
				}else{
					if($(".label_list").text().indexOf(names)==-1){         //防止重复添加
						$(".Tojoin_content .label_list").append('<span class="gz_label industry" data-id="'+ codeId +'"  data-name="'+names+'">' + names + '<i class="label_del labeldel02"></i></span>');
					}else{
						warningMessage("请勿重复添加","",2000);
					}
				}
			}else if(getCookie("viplevel")==2){
				if($(".label_list span").length==3){
					warningMessage("加入圈子已达最大限度，请升级为VIP","",2000);
				}else{
					if($(".label_list").text().indexOf(names)==-1){         //防止重复添加
						$(".Tojoin_content .label_list").append('<span class="gz_label industry" data-id="'+ codeId +'"  data-name="'+names+'">' + names + '<i class="label_del labeldel02"></i></span>');
					}else{
						warningMessage("请勿重复添加","",2000);
					}
				}
			}else if(getCookie("viplevel")==3){
				if($(".label_list span").length==4){
					warningMessage("加入圈子已达最大限度，请升级为VIP","",2000);
				}else{
					if($(".label_list").text().indexOf(names)==-1){         //防止重复添加
						$(".Tojoin_content .label_list").append('<span class="gz_label industry" data-id="'+ codeId +'"  data-name="'+names+'">' + names + '<i class="label_del labeldel02"></i></span>');
					}else{
						warningMessage("请勿重复添加","",2000);
					}
				}
			}else{
				if($(".label_list span").length==1){
					warningMessage("加入圈子已达最大限度，请升级为VIP","",2000);
				}else{
					$(".Tojoin_content .label_list").append('<span class="gz_label industry" data-id="'+ codeId +'"  data-name="'+names+'">' + names + '<i class="label_del labeldel02"></i></span>');
				}
			};
			$(".xg_saveBox .xg_save").css("background","#3FA435");
		}
		
	})
	/*取消加入的行业圈
	 */
	$(document).on("click", ".industry .labeldel02", function() {
		var lavbe = $(this).parents(".industry").text();
		$(this).parents(".industry").remove();
		if($(".label_list").has("span").length==0){
			$(".xg_saveBox .xg_save").css("background","#999999");
		}
	});
	//保存加入的圈子
	$(document).on("click", ".xg_saveBox .xg_save", function() {
		if($(".label_list").has("span").length>0){
			var arrCode = []; //关注职业圈数组
			for(var i=0;i<$(".label_list span").length;i++){
				var dataIds=$(".label_list span").eq(i).attr("data-id");
				arrCode.push(dataIds)
			}
			var codeId = JSON.stringify(arrCode);
			$.ajax({
				type: "post",
				url: serviceHOST() + "/jobstree/updateJobStreeByCodes.do",
				headers: {
					"token": qz_token()
				},
				data: {
					"username":getCookie("username"),
					"codes": codeId
				},
				success: function(msg) {
					if (msg.status == 0) { //0是加入  -1是已经加入    1是          等级不够
							var chatRoom=msg.data;
							friendlyMessage("加入成功", function() {
								$(".zhiye i").html("修改")
								//退出聊天室接口调取操作
								if(chatRoom!=""){
									$.each(chatRoom, function(k,v) {
										moveChatroom(chatRoom[k]);
									});  
								}
								window.location.reload();
							})
					}else if (msg.status == -1) { 
						warningMessage("您已是圈子成员，请勿重复加入");
					}else if (msg.status == 1) { //加入个数限制已满  需开通会员加入；
						warningMessage("您的等级不够，请升级会员");
					}else if(msg.status==-3){
						getToken();
					};
				},
				error: function() {
					console.log("error");
				}
			});

		}else{
			$("#maskss").css("z-index","20000").show();
			$(".prompt").show();
		}
	})
	$(document).on("click", ".prompt .determine", function() {
		$("#maskss").hide();
		$(".prompt").hide();
	})
	/*
	 
	 * 
	 * 职业圈搜索
	 * 
	 * keyword   关键字
	 * */

	$(".workBoxs .ProfessionalSearch input").bind('input propertychange', function() {
		var keyword = $(this).val();
		if(keyword == ""){
			getCareercircle({
				username:getCookie("username"),    
				pageNum: 1,
				pageSize:63
			});
			return false;
		}
		$.ajax({
			type: "post",
			url: serviceHOST() + "/jobstree/searchJobstreeByKeyWord.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: {
				username:getCookie("username"),
				keyWord:keyword,
				pageNum:1,
				pageSize:50
			},
			success: function(msg) {
				if(msg.status==0){
					var mssg=msg.data;
					getCarInfo(mssg);
				}else if(msg.status==-3){
					getToken();
				};
				
			},
			error: function() {
				console.log("error")
			}
	
		});
	});
	
	/***********************职业圈修改结束*********************************/
	/************************个性签名字数限制开始***********************************/
	//判断字数
	$(".edit").on("keyup",function(){
		checkLengths($(this),'30',"#numkq")
	})
	/************************个性签名字数限制结束***********************************/
	
	/************************绑定手机号开始*************************/
	$(document).on("click",".bindMobile .phone.on",function(){
		bindPhone();   //第三方登录绑定手机号
	})
	$(".binderrors").on('click',function(){
		$(".bg_mask,.viewbindPhone").hide();
	})
	/************************绑定手机号结束*************************/
//获取职业认证信息
getCertInfo();
function getCertInfo(){
	$.ajax({
		url: serviceHOST() + "/certification/getCertificationInfo.do",
		type: 'post',
		data:{
			username:getCookie("username")
		},
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		success:function(msg){
			if(msg.status==0){
				if(msg.data!=undefined){
					//验证我的身份状态
					if(msg.data.company!=""&&msg.data.realindustry!=""){
						$(".pidentity").show();
					}else{
						$(".pidentity").hide();
					} ;
					$(".pidentity span").attr("data-status",msg.data.certificateStatus);
					if(msg.data.certificateStatus==0||msg.data.certificateStatus==-2){
						$(".pidentity span").html("【未认证】");
					}else if(msg.data.certificateStatus==1||msg.data.certificateStatus==3){
						$(".pidentity span").html("【认证中】");
					}else if(msg.data.certificateStatus==2){
						$(".pidentity span").html("【已认证】");
					}else if(msg.data.certificateStatus==-1){
						$(".pidentity span").html("【认证失败】");
					};
				};
			}else if(msg.status==-3){
				getToken();
			};
		},
		error:function(){
			console.log("error");
		}
	})
};
//点击验证我的身份
$(document).on("click",".pidentity",function(){
	if($(".pidentity span").attr("data-status")!=-1){     //不是认证失败的状态时
		$(".bgtilt,.conposition").show();
		$(".conAuto").show();
		$(".positstepbox").hide();     //认证攻略
		if (getCookie("headImgkz") != ""||getCookie("headImgkz")!=undefined) {
			if (getCookie("headImgkz").indexOf("http") > -1) {
				$(".useImgHead img").attr("src", getCookie("headImgkz"));
			} else {
				var srcImg = ImgHOST() + getCookie("headImgkz")
				$(".useImgHead img").attr("src", srcImg);
			}
		} else {
			$(".useImgHead img").attr("src", "/img/first.png");
		};
		//根据用户名获取职业认证信息
		getCertificationInfo();
	}else{      //认证失败时
		$(".bgtilt,.autoerrBox").show();
	}
});

// 认证失败时的弹窗点击差号   点击取消
$(document).on("click",".errBack2 span,.btns .cancels",function(){
	$(".bgtilt,.autoerrBox").hide();
});
// 认证失败时的重新上传按钮
$(document).on("click",".btns .reUpload",function(){
	$(".autoerrBox").hide();
	$(".conposition").show();
	$(".conAuto").show();
	if (getCookie("headImgkz") != ""||getCookie("headImgkz")!=undefined) {
		if (getCookie("headImgkz").indexOf("http") > -1) {
			$(".useImgHead img").attr("src", getCookie("headImgkz"));
		} else {
			var srcImg = ImgHOST() + getCookie("headImgkz")
			$(".useImgHead img").attr("src", srcImg);
		}
	} else {
		$(".useImgHead img").attr("src", "/img/first.png");
	};
	//根据用户名获取职业认证信息
	getCertificationInfo();
})

function getCertificationInfo(){
	$.ajax({
		url: serviceHOST() + "/certification/getCertificationInfo.do",
		type: 'post',
		data:{
			username:getCookie("username")
		},
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		success:function(msg){
			if(msg.status==0){          //只有是在已认证的情况下再次提交才会出现材料再次审核的状态
				var certPath=ImgHOST()+msg.data.certificatePath;
				$(".useImgHead").attr("data-status",msg.data.certificateStatus);
				$(".useImgHead").attr("data-code",msg.data.code);
				$(".useImgHead").attr("data-company",msg.data.company);
				$(".useImgHead").attr("data-indust",msg.data.industryname);
				$(".JsuploadImg").hide();
				if(msg.data.certificateStatus!=2){     //2表示已认证 认证成功
					$(".positStatus p span").html(($.trim(getCookie("nickname")) == "" ? shieldNumber(UserName) : getCookie("nickname")));
					$(".positStatus .companyName").html(msg.data.company);
					$(".positStatus .corporateJobs").html(msg.data.realindustry);
					if(msg.data.certificateStatus==0||msg.data.certificateStatus==-2){
						$(".positStatus .cerStatus b").html("未认证");
						$(".realNamebox input").show();
						$(".realNamebox i").hide();
						$(".Jsexplain").show();
						$(".pictureShow").hide();
						$(".pictureShow .uploadImg").hide();
						$(".ulList li").removeClass("on").removeClass("noClick");
						$(".type1").addClass("on").siblings("li").removeClass("on");
						$(".updataBtns").hide();
						$(".updatesPos").hide();
						$(".subBtnss").removeClass("on").show();
					}else{
						if(msg.data.certificateStatus==-1){
							$(".positStatus .cerStatus b").html("认证失败");
						}else if(msg.data.certificateStatus == 1){
							$(".positStatus .cerStatus b").html("认证中");
						}else if(msg.data.certificateStatus == 3){
							$(".positStatus .cerStatus b").html("新材料审核中");
						}
						$(".realNamebox input").hide();
						$(".realNamebox i").html(msg.data.realname).show();
						$(".Jsexplain").hide();
						$(".pictureShow").show();
						$(".JSimgshow").show();
						$(".imgshow2").attr("src",certPath);
						$(".subBtnss").hide();
						$(".updataBtns").show();
						if(msg.data.certificateType==1){  //1是名片 2是在职证明 3是工牌 4是企业邮箱
							$(".type1").addClass("on").siblings("li").removeClass("on").addClass("noClick");
						}else if(msg.data.certificateType==2){
							$(".type2").addClass("on").siblings("li").removeClass("on").addClass("noClick");
						}else if(msg.data.certificateType==3){
							$(".type3").addClass("on").siblings("li").removeClass("on").addClass("noClick");
						}else if(msg.data.certificateType==4){
							$(".type4").addClass("on").siblings("li").removeClass("on").addClass("noClick");
						}
					}
					$(".positStatus p i img").attr("src","/img/rz_weirenzheng.png");
					$(".cerStatus i img").attr("src","/img/rz_renzhengtubiao.png");

				}else if(msg.data.certificateStatus==2){
						$(".positStatus p span").html(msg.data.company);
						$(".corporateJobs").html(msg.data.realindustry)
						$(".positStatus p i img").attr("src","/img/zy_renzheng.png");
						$(".positStatus .companyName").hide();
						$(".positStatus .cerStatus b").html("已认证");
						$(".cerStatus i img").attr("src","/img/rz_yirenzhengtubiao.png");
						$(".realNamebox input").hide();
						$(".realNamebox i").html(msg.data.realname).show();
						$(".Jsexplain").hide();
						$(".pictureShow").show();
						$(".JSimgshow").show();
						$(".imgshow2").attr("src",certPath);
						$(".subBtnss").hide();
						$(".updataBtns").show();
						if(msg.data.certificateType==1){  //1是名片 2是在职证明 3是工牌 4是企业邮箱
							$(".type1").addClass("on").siblings("li").removeClass("on").addClass("noClick");
						}else if(msg.data.certificateType==2){
							$(".type2").addClass("on").siblings("li").removeClass("on").addClass("noClick");
						}else if(msg.data.certificateType==3){
							$(".type3").addClass("on").siblings("li").removeClass("on").addClass("noClick");
						}else if(msg.data.certificateType==4){
							$(".type4").addClass("on").siblings("li").removeClass("on").addClass("noClick");
						}
					}
				
				
			}else if(msg.status==-3){
				getToken();
			};
		},
		error:function(){
			console.log("error");
		}
	})
}
// 点击差号退出
$(document).on("click",".conposition .errBack span",function(){
	if(!$(".positstepbox").is(":hidden")){
		$(".positstepbox").hide();
		$(".conAuto").show();
	}else{
		$(".bgtilt,.conposition").hide();
		$(".submitSuccess").hide();
		getCertInfo();     //获取认证信息
	}
});

//名片，在职证明，工牌，企业邮箱tab切换
$(document).on("click",".ulList li",function(){
	var _index=$(this).index();
	if(!$(this).siblings("li").hasClass("noClick")){
		$(this).addClass("on").siblings("li").removeClass("on");
		$(".explainBox .explain").eq(_index).addClass("on").siblings().removeClass("on");
	}

});

// 更新认证资料
$(document).on("click",".updataBtns",function(){
	var certPath=$(".imgshow2").attr("src");
	$(".JSimgshow").hide();
	$(".Jsexplain").show();
	// $(".JSupdateshow").show();
	// $(".imgshow3").attr("src",certPath);
	$(".updataBtns").hide();
	$(".updatesPos").hide();
	$(".subBtnss").show();
	$(".realNamebox input").val($(".realNamebox i").html()).show();
	$(".realNamebox i").hide();
	$(".ulList").find("li").removeClass("noClick");
	$(".ulList").find(".type1").addClass("on").siblings("li").removeClass("on");
});
//点击更新认证资料图片的差号按钮
$(document).on("click",".JScha2",function(){
	$(".pictureShow").hide();
	$(".JSupdateshow").hide();
	$(".Jsexplain").show();
	$(".ulList li").removeClass("on");
	$(".ulList li").removeClass("noClick");
	$(".type1").addClass("on").siblings("li").removeClass("on");
})

// 认证上传图片
// 
 document.domain = "quanzinet.com";
// 名片图片上传
$(document).on("change","#visitCard",function(){
	var _this = $(this);
	getUPimg(_this,"visitCard");
});
// 在职证明图片上传
$(document).on("change","#inCert",function(){
	var _this = $(this);
	getUPimg(_this,"inCert");
});
// 工牌图片上传
$(document).on("change","#hammer",function(){
	var _this =$(this);
	getUPimg(_this,"hammer");
});
// 企业邮箱图片上传
$(document).on("change","#workEmail",function(){
	var _this =$(this);
	getUPimg(_this,"workEmail");
});

function getUPimg(_this,ids){
	if(!isFileType(["jpg", "png", "gif"], _this)) {
		warningMessage("请上传jpg、png、gif格式的文件",1000);
		return false;
	};
	if(!checkFileSize(_this, 5)) {
		warningMessage("上传文件大于5M，请重新上传",1000);
		return false;
	};
	//获取上传的文件大小
	if(navigator.userAgent.indexOf("MSIE 6.0") < 0) {
		if(navigator.userAgent.indexOf("MSIE 7.0") < 0) {
			if(navigator.userAgent.indexOf("MSIE 8.0") < 0) {
				if(navigator.userAgent.indexOf("MSIE 9.0") < 0) {
					var file = _this[0].files[0];
					var fileSize = (Math.round(file.size / (1024 * 1024)));
				}
			}
		}
	}
	if(FileReader){
		var reader = new FileReader();
		file = _this[0].files[0];
		reader.onload = function(e){
				var image = new Image();
				image.src = e.target.result;
				image.onload=function(){
					if(image.width < 440&&image.height<280){
						warningMessage("头像宽高不能小于440",1000);
						return false;
					}else{
						updateimgSrc(ids,{
							"type":64,       //2为上传头像
							"size":fileSize
						});
					}
				}
			};
		reader.readAsDataURL(file);
	}

}

function updateimgSrc(id,datas){
		$.ajaxFileUpload({
			//type:"post",
			url: RestfulHOST() + "/files/uptopicfilesWeb", //处理文件上传操作的服务器端地址
			secureuri: false,
			fileElementId: id,
			dataType: 'json',
			timeout: 100000, //超时时间设置
			data: datas,
			crossDomain: true,
			success: function(msg){
				if(msg.status==0){
					var fileUrl=ImgHOST()+msg.filename;
					$(".useImgHead").attr("data-file",msg.filename);
					$(".Jsexplain").hide();
					$(".pictureShow").show();
					$(".JsuploadImg").show();
					$(".subBtnss").addClass("on");
					$(".JsuploadImg").show();
					$(".imgshow1").attr("src",fileUrl);
					$(".successMsg").show();
					setTimeout(function(){
						$(".successMsg").hide();
					},3000);
					$(".ulList").find(".on").siblings("li").addClass("noClick");
				}
			},
			error:function(){
					warningMessage("上传图片失败",1000);
			}

	})
};

// 未认证的上传的图片上的差号点击
$(document).on("click",".JScha1",function(){
	$(".ulList").find(".on").siblings("li").removeClass("noClick");
	$(".Jsexplain").show();
	$(".pictureShow").hide();
	$(".JsuploadImg").hide();
	$(".subBtnss").removeClass("on");
	$(".imgshow1").attr("src","");
});

// 提交认证资料
$(document).on("click",".subBtnss.on",function(){
	if(!$(".realNamebox input").is(":hidden")){
		if($(".realNamebox input").val()==""){
			warningMessage("请上传真实姓名");
			return false;
		};
		if($(".realNamebox input").val().length>15){
			warningMessage("姓名不能大于15个字符");
			return false;
		};
		var realnS=$(".realNamebox input").val();   //真实姓名
	}else{
		var realnS=$(".realNamebox i").html();   //真实姓名
	}
	
	if($(".useImgHead").attr("data-code")!=""&&$(".useImgHead").attr("data-indust")!=""){
		var positcode=$(".useImgHead").attr("data-code");    //职业编号
		var positindust=$(".useImgHead").attr("data-indust");     //职业名称
	}else{
		var positcode=$(".zhiye b").eq(0).attr("data-code");                                           //当执业编号和职业名称有一个返回为空时取职业圈的第一个编号和职业名称
		var positindust=$(".zhiye b").eq(0).html();                               //当执业编号和职业名称有一个返回为空时取职业圈的第一个编号和职业名称
	}
	
	var positcompany=$(".useImgHead").attr("data-company");    //公司名称
	var positPath=$(".useImgHead").attr("data-file");     //上传的图片地址
	var positType=$(".ulList").find(".on").attr("data-num");   //上传的证件类型
	var relindust=$(".corporateJobs").html();  //真实职业
	$(".loadGif").show();
	subhandlerCertification({
		username:getCookie("username"),
		code:positcode,        //用户认证的职业编号
		industryname:positindust,     //用户认证的职业名称
		certificateType:positType,  // 职业认证上传的证件类型
		certificatePath:positPath,   //职业认证证件图片地址
		realname:realnS,       //用户真实姓名
		company:positcompany,        //公司名称
		realindustry:relindust    //用户填写的职业
	})

})

// 提交职业认证信息接口
function subhandlerCertification(datas){
	$.ajax({
		type:"post",
		url:serviceHOST()+"/certification/handlerCertification.do", 
		data:datas,
		dataType:"json",
		headers: {
			"token": qz_token()
		},
		success:function(msg){
			if(msg.status==0){
				$(".loadGif").hide();
				$(".conAuto").hide();
				$(".submitSuccess").show();
			}else if(msg.status==-3){
				getToken();
			};
		},
		error:function(){
			warningMessage("提交认证信息失败",1000);
		}
	})
}

// 提交成功之后的确定按钮
$(document).on("click",".submitSuccess div",function(){
	$(".bgtilt,.conposition").hide();
	$(".submitSuccess").hide();
	getCertInfo();    //获取认证信息
});

// 认证攻略点击被点击时
$(document).on("click",".positStatus p b",function(){
	$(".conAuto,.submitSuccess").hide();
	$(".positstepbox").show();
})



})