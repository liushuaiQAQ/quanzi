// JavaScript Document
//相对路径
var localUrl=window.location.href.split("//")[1].split('/')[0];
if(localUrl.indexOf("-")>-1){
	var oneUrl=localUrl.split("-")[0]+"-";
	var noUrl=localUrl.split("-")[0]+".";
}else{
	var oneUrl="";
	var noUrl="";
}
var serviceHOST = function(s) {
	s = s ||"http://"+ oneUrl+"facechat.quanzinet.com"
	return s;
}
var serviceHOSTs = function(s) {
	s = s ||"http://"+oneUrl+"wm.quanzinet.com/utils/soap";
	return s;
}
var serHOST = function(s) {
	s = s || "http://"+oneUrl+"wm.quanzinet.com";
	return s;
}
var RestfulHOST = function(s) {
		s = s || "http://im.quanzinet.com/plugins/restapi/v1";
		return s;
	}
	//收到消息的图片路径
	// var msgImgHOST = function(s) {
	// 	s = s || "http://im.quanzinet.com/plugins/restapi/v1/files/download?filename=";
	// 	return s;
	// }
	//图片路径
	var ImgHOST = function(s) {
		s = s || "http://img.quanzinet.com/files/";
		return s;
	}
// var ImgHOST = function(s) {
// 		s = s || "http://"+oneUrl+"www.quanzinet.com/plugins/restapi/v1/files/download?filename=";
// 		return s;
// 	}

	// xmpp
var xmppHOST = function(s){
	var im="im.quanzinet.com";
	s = s ||"http://"+im+'/http-bind';
	return s;
}

	//token
var qz_token = function(s) {
	s = s || getCookie("tokens");
	return s;
};

//获取token值， soap接口的headers里面都要有token,token跟登录无关
getToken()
if (getCookie("tokens") == "") {
	getToken()
};

function getToken() {
	$.ajax({
		type: "POST",
		url: serviceHOST()+"/token/getToken.do",
		dataType: "json",
		success: function(msg) {
			if (msg.status == 0) {
				setCookie("tokens", msg.data);
			}
		},
		error: function() {
			console.log("error");
		}
	})
}

// 性别
var user_level = {
	30007: "boy",
	22899: "gril"
};
var UserName = getCookie("username"); //用户名
var UserImg = getCookie("headImgkz"); //用户头像
var Nickname = getCookie("nickname"); //用户昵称
// 未登录
var no_login = "";
if (!UserName) no_login = "login_window";

//头部大图轮播
var iTimer = null,
	num = 0,
	headImg = ['qz_PC_banner.png', 'qz_PC_banner2.png', 'qz_PC_banner3.png'];
$(function() {
	clearInterval(iTimer);
	time();
})


function time() {
	num++;
	num %= headImg.length;
	$('.advertImg img').attr('src', '/img/' + headImg[num])
	iTimer = setTimeout(time, 1500);
}

//cookie
function setCookie(c_name, value, expiresTime) {
	var t = expiresTime || 30; //设置date为当前时间+30分
	var date = new Date();
	date.setTime(date.getTime() + t * 60 * 1000);
	document.cookie = c_name + "=" + escape(value) + ";expires=" + date.toGMTString() + ";path=/;domain=.quanzinet.com";
}

function getCookie(c_name) {
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(c_name + "=")
		if (c_start != -1) {
			c_start = c_start + c_name.length + 1
			c_end = document.cookie.indexOf(";", c_start)
			if (c_end == -1)
				c_end = document.cookie.length
			return unescape(document.cookie.substring(c_start, c_end))
		}
	}
	return "";
}

function clearCookie(c_name) {
	document.cookie = c_name + "=" + "" + ";expires=-1" + ";path=/;domain=.quanzinet.com";
}



// 获取查询字符串参数
function getQueryStringArgs() {
	var qs = window.location.search.length > 0 ? location.search.substring(1) : "",
		args = {},
		items = qs.split("&"),
		len = items.length,
		name = null,
		value = null,
		item = null;
	if (qs.length == 0) {
		return args;
	};
	for (var i = 0; i < len; i++) {
		item = items[i].split("=");
		name = decodeURIComponent(item[0]);
		value = decodeURIComponent(item[1]);
		args[name] = value;
	}
	return args;
}

//查询字符串参数
function getURIArgs(args) {
	var s = "";
	window.location.search.length && getQueryStringArgs()[args] ? s = getQueryStringArgs()[args] : s = "";
	return s;
}

//修改url参数值 
function changeURLArg(url, arg, arg_val) {
	var pattern = arg + '=([^&]*)';
	var replaceText = arg + '=' + arg_val;
	if (url.match(pattern)) {
		var tmp = '/(' + arg + '=)([^&]*)/gi';
		tmp = url.replace(eval(tmp), replaceText);
		return tmp;
	} else {
		if (url.match('[\?]')) {
			return url + '&' + replaceText;
		} else {
			return url + '?' + replaceText;
		}
	}
	return url + '\n' + arg + '\n' + arg_val;

}



//删除url参数值
function delQueryStringArgs(url, ref) {
	var str = "";
	if (url.indexOf('?') != -1) {
		str = url.substr(url.indexOf('?') + 1);
	} else {
		return url;
	}
	var arr = "";
	var returnurl = "";
	var setparam = "";
	if (str.indexOf('&') != -1) {
		arr = str.split('&');
		for (i in arr) {
			if (arr[i].split('=')[0] != ref) {
				returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
			}
		}
		return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
	} else {
		arr = str.split('=');
		if (arr[0] == ref) {
			return url.substr(0, url.indexOf('?'));
		} else {
			return url;
		}
	}
}


//添加or修改url参数
function changeURI(uri, uriName, uriVar) {
	if (uri.indexOf("?") >= 0) {
		getURIArgs(uriName) ? uri = changeURLArg(uri, uriName, uriVar) : uri = uri + "&" + uriName + "=" + uriVar;
	} else {
		uri = uri + "?" + uriName + "=" + uriVar;
	}
	return uri;
}


//获取系统当前时间		有参数得到的是有月份的时间
function getNowFormatDate(t) {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	var h = date.getHours();
	var m = date.getMinutes();
	var currentdate = "";
	// if (month >= 1 && month <= 9) {
	//     month = "0" + month;
	// }
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	if (h >= 0 && h <= 9) {
		h = "0" + h;
	}
	if (m >= 0 && m <= 9) {
		m = "0" + m;
	}
	if (t) {
		currentdate = month + "." + strDate + " " + h + seperator2 + m;
	} else {
		currentdate = h + seperator2 + m;
	}
	return currentdate;
}

//formatTime(t)   lz
function formatTime(t, flag) {
	function fun(_sT) {
		var _ss = "";
		_sT < 10 ? _ss = "0" + _sT : _ss = _sT;
		return _ss;
	}
	var time = new Date(t);
	var Y = time.getFullYear();
	var M = fun(time.getMonth() + 1);
	var D = fun(time.getDate());
	var h = fun(time.getHours());
	var m = fun(time.getMinutes());
	var s = fun(time.getSeconds());
	var nowTime = new Date();

	var _Y = nowTime.getFullYear();
	var _M = nowTime.getMonth();
	var _D = nowTime.getDate();

	var _time = new Date(_Y, _M, _D, 23, 59, 59);
	var _t = _time.getTime() - t;
	var __t = Math.floor(_t / (24 * 60 * 60 * 1000));
	var str = "";
	if (flag) {
		str = Y + "-" + M + "-" + D + " " + h + ":" + m;
	} else {
		if (__t == 0) {
			str = h + ":" + m;
		} else if (__t == 1) {
			str = "昨天 " + h + ":" + m;
		} else {
			str = Y + "-" + M + "-" + D + " " + h + ":" + m;
		}
	}
	return str;
}
/*im.loadingOn()全局开启
im.loadingOff()关闭
im.localLoadingOn(d)局部开启
im.localLoadingOff(d)关闭*/
function huntlawLoadFn() {
	var _this = this;
}
huntlawLoadFn.prototype = {
	constructor: huntlawLoadFn,
	loadingOn: function() {
		var loadingObj = "<div id='loadingObj' style=\" position:fixed;width:100%;height:100%;top:0px;left:0px;z-index:99999;filter: Alpha(opacity=70);opacity:0.7; \">" +
			"<img src='/img/loading.gif' style='width:32px;height:32px;position:fixed;top:50%;left:50%;margin-left:-16px;margin-top:16px;z-index:999999;'/>" +
			"</div>";
		$("body").append(loadingObj);
	},
	loadingOff: function() {
		$("#loadingObj").remove();
	},
	localLoadingOn: function(c) {
		var loadingImg = "<img class='loadingImgAjax' src='/img/loading.gif' style='width:32px;height:32px;position:absolute;top:50%;left:50%;margin-left:-16px;margin-top:16px;z-index:9998;'/>";
		$(c).html(loadingImg);
	},
	localLoadingOff: function(c) {
		$("" + c + " .loadingImgAjax").remove();
	}
}

var im = new huntlawLoadFn();

//当无数据时调用
function showNoData(objEle, str) {
	var _str = str || "暂无数据";
	var oDiv = "<div style='margin-top:120px;'>" +
		"<img style='display:block;margin:0 auto;'src=\"/img/nodata.png\">" +
		"<span style='display:block;text-align:center;font-size:14px;margin-top:10px;'>" + _str + "</span>" +
		"</div>"
	$(objEle).html(oDiv);
}

//成功信息 弹窗
function friendlyMessage(msg, callback, t) {
	var t = t || 600;
	$("#msk").remove();
	$("body").append('<div id="msk"><div class="masks1"></div><div class="viewBox1"><span><img src="/img/addFriend_success.png"/></span><p>' + msg + '</p></div></div>');
	setTimeout(function() {
		$("#msk").fadeOut(300, function() {
			$("#msk").remove();
			if (typeof(callback) == 'function') callback();
		})
	}, t);
};

//保存成功信息 弹窗
function friendlySuccessMsg(msg, callback, t) {
	var t = t || 600;
	$("body").append('<div id="msk"><div class="masks2"></div><div class="viewBox2"><p>' + msg + '</p></div></div>');
	setTimeout(function() {
		$("#msk").fadeOut(600, function() {
			$("#msk").remove();
		})
		if (typeof(callback) == 'function') callback();
	}, t);
};
//保存失败信息 弹窗
function friendlyErrsMsg(msg, callback, t) {
	var t = t || 600;
	$("body").append('<div id="msk"><div class="masks3"></div><div class="viewBox3"><p>' + msg + '</p></div></div>');
	setTimeout(function() {
		$("#msk").fadeOut(600, function() {
			$("#msk").remove();
		})
		if (typeof(callback) == 'function') callback();
	}, t);
	var vWidth = $(".viewBox3").width();
	var mLeft = -(vWidth / 2) + "px"
	$(".viewBox3").css({
		"width": vWidth + "px",
		"margin-left": mLeft
	})
};
//警告框
function warningMessage(msg, callback, t) {
	$("#msk").remove();
	var t = t || 1000;
	$("body").append('<div id="msk"><div class="masks1"></div><div class="viewBox1"><span><img src="/img/qz_qqq_!.png"/></span><p>' + msg + '</p></div></div>');
	setTimeout(function() {
		$("#msk").fadeOut(600, function() {
			$("#msk").remove();
		})
		if (typeof(callback) == 'function') callback();
	}, t);
};


//友情提示
function friendlyMess(msg, color, callback, t, place) {
	//提示信息，背景颜色（不写是绿色，“Y”是黄色，也可以输入任意颜色），回调函数，t是显示停留时间（默认1500毫秒），显示位置（不写是顶部显示，“B”是底部显示）
	color = color || "#1bbc10";
	place = place || "top:0";
	t = t || 1500;
	if (color == "Y") color = "#eaa000";
	if (place == "B") place = "bottom:0";
	$("body").append('<div class="friendlyMessage" style="position:fixed; height:30px; line-height:30px; width:100%; z-index:99999; text-align:center; left:0; ' + place + ';"><span style="font-size:14px; padding:8px 60px; color:#fff; background-color:' + color + ';">' + msg + '</span></div>');
	setTimeout(function() {
		$(".friendlyMessage").remove();
	}, t);
	if (typeof(callback) == 'function') callback();
};



/*******************视频上传的各种提示start*************************************/
//支持什么样的视频文件       我知道啦
function knowMessage(msg) {
	$("body").append('<div id="msk"><div class="masks4"></div><div class="viewBox4"><p class="msg"><b></b>' + msg + '</p><p class="knowMsg">我知道啦</p></div></div>');
	$(document).on('click', ".knowMsg", function() {
		$("#msk,.masks4,.viewBox4").hide();
	})
};
//终止视频上传弹窗
//function friendlyGiveup(msg, callback, t) {
//	$("body").append('<div id="msk"><div class="masks5"></div><div class="viewBox5"><p class="msg">' + msg + '</p><p class="btnsMsg"><span>确定</span><span>取消</span></p></div></div>');
//	$(document).on('click',".knowMsg",function(){
//		$("#msk,.masks4,.viewBox4").hide();
//	})
//};
/*******************视频上传的各种提示end*************************************/

//判断文件大小
function checkFileSize(obj, size) {
	if (navigator.userAgent.indexOf("MSIE 6.0") < 0) {
		if (navigator.userAgent.indexOf("MSIE 7.0") < 0) {
			if (navigator.userAgent.indexOf("MSIE 8.0") < 0) {
				if (navigator.userAgent.indexOf("MSIE 9.0") < 0) {
					var file = $(obj)[0].files[0];
					var fileSize = (Math.round(file.size / (1024 * 1024))).toFixed(2);
					if (fileSize > size) {
						return false;
					} else {
						return true;
					}
				}
			}
		}
	}
};
//判断文件类型
function isFileType(arr, obj) {
	var ar = $(obj).val().split(".");
	var t = ar[ar.length - 1];
	for (var i in arr) {
		if (t == arr[i]) return true;
	};
	return false;
};
//处理评论内容转化表情
function toFaceImg(c) {
	if (!c) return "";
	for (var i in smohanFace) {
		for (var j = 0; j < c.length / 3; j++) {
			if (c.indexOf(smohanFace[i]) > -1) {
				c = c.replace(smohanFace[i], '<img class="face-p" src="/img/face/' + i + '@2x.png" alt="">');
			};
		};
	};
	return c;
};
//获取年月日 LZ201601291331
/*
getDateSelect({
YClass:"Y",//年obj
MClass:"M",//月obj
DClass:"D",//日obj
year:"",//设置年份
month:"",//设置月份
day:""//设置日期
});
*/

function getDateSelect(v) {
	var date = new Date();
	addYear(date);
	var _str = "<option value='-1'>请选择</option>";
	$("." + v.MClass).html(_str);
	$("." + v.DClass).html(_str);

	if (v.year) //设置日期
	{
		$("." + v.YClass).find("option[value='" + v.year + "']").attr("selected", true);
		addMonth();
		if (v.month) {
			$("." + v.MClass).find("option[value='" + v.month + "']").attr("selected", true);
			addDay(v.year, v.month);
			if (v.day) {
				$("." + v.DClass).find("option[value='" + v.day + "']").attr("selected", true);
			}
		}
	}

	$(document).on("change", "." + v.YClass, function() { //切换年
		var _y = $(this).val();
		if (_y) {
			addMonth();
		} else {
			$("." + v.MClass).html(_str);
			$("." + v.DClass).html(_str);
		}
	});
	$(document).on("change", "." + v.MClass, function() { //切换月
		var _y = $("." + v.YClass).val();
		var _m = $("." + v.MClass).val();
		addDay(_y, _m);
	});

	function addYear(date) //获取年
	{
		var Y = date.getFullYear();
		var minY = Y - 60;
		var maxY = Y;
		var str = "<option value='-1'>请选择</option>";
		for (maxY; maxY > minY; maxY--) {
			str += "<option value='" + maxY + "'>" + maxY + "</option>";
		}
		$("." + v.YClass).html(str);
	}

	function addMonth() //获取月
	{
		var str = "<option value='-1'>请选择</option>";
		for (i = 1; i < 13; i++) {
			str += "<option value='" + i + "'>" + i + "</option>";
		}
		$("." + v.MClass).html(str);
	}

	function addDay(Y, M) //获取日
	{
		var DList = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
		if (leapyear(Y)) DList[2] = 29;
		var str = "<option value='-1'>请选择</option>";
		for (var i = 1; i <= DList[M]; i++) {
			str += "<option value='" + i + "'>" + i + "</option>";
		}
		$("." + v.DClass).html(str);
	}

	function leapyear(intyear) //判断是否闰年
	{
		var result = false;
		((intyear % 400 == 0) && (intyear % 100 != 0)) || (intyear % 4 == 0) ? result = true: result = false;
		return result;
	}
}

//LZBTH 设置省市区 201601151400
/*
getAreaSelect(area,//静态导出js
	{
		provinceClass:	"",//省份select class名称
		cityClass:		"",//市select class名称
		districtClass:	"",//县区select class名称
		provinceStr:	"",//省默认提示
		cityStr:		"",//市默认提示
		districtStr:	"",//县区默认提示
	},
	//本组数据可选
	{
		pId:"",//省份ID
		cId:"",//市ID
		dId:""//县区ID
	})
*/
function getAreaSelect(Data, CObj, AId) {
	var pS = CObj.provinceStr || "请选择省";
	var cS = CObj.cityStr || "请选择市";
	var dS = CObj.districtStr || "请选择区";
	$("." + CObj.provinceClass).html("<option value=''>" + pS + "</option>");
	!CObj.cityClass || $("." + CObj.cityClass).html("<option value=''>" + cS + "</option>");
	!CObj.districtClass || $("." + CObj.districtClass).html("<option value=''>" + dS + "</option>");
	var aObj = "";
	var s = "";
	for (var i = 0, len = Data.length; i < len; i++) {
		aObj = Data[i];
		s += addOption(aObj.id, aObj.name);
	}
	$("." + CObj.provinceClass).append(s);
	$(document).on("change", "." + CObj.provinceClass, function() {
		var _i = $(this).get(0).selectedIndex - 1;
		$(document).off("change", "." + CObj.cityClass);
		if (_i < 0) {
			$("." + CObj.cityClass).html("<option value=''>" + cS + "</option>");
			$("." + CObj.districtClass).html("<option value=''>" + dS + "</option>");
			return false;
		}
		getCity(Data[_i].children);
		$("." + CObj.districtClass).html("<option value=''>" + dS + "</option>");
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
			getDistricts(Data[_i].children[_j].children);
		}
		if (AId.dId) {
			$("." + CObj.districtClass).find("option[value='" + AId.dId + "']").attr("selected", true);
		}

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
		$(document).on("change", "." + CObj.cityClass, function() {
			var _j = $(this).get(0).selectedIndex - 1;
			if (_j < 0) {
				$("." + CObj.districtClass).html("<option value=''>" + dS + "</option>");
				return false;
			}
			getDistricts(_D[_j].children);
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
	}

	function addOption(k, v, aeraId) {
		var option = "<option value='" + k + "'>" + v + "</option>";
		return option;
	}
}

//确定弹出框      
//$.im.confirm("确定要取消收藏吗？", function() {}
(function() {
	$.im = {
		"alert": function(msg, callback, btnValue) {
			createHtml("alert", msg, btnValue);
			btnSure(callback);
			btnCancel();
		},
		"confirm": function(msg, callback) {
			createHtml("confirm", msg);
			btnSure(callback);
			btnCancel();
		},
		"determine": function(msg, callback) {
			createHtml("determine", msg);
			btnSure(callback);
			btnCancel();
		},
		"save": function(msg, callback) {
			createHtml("save", msg);
			btnSure(callback);
			btnCancel();
		},
		"problem": function(msg, callback) {
			createHtml("problem", msg);
			btnSure(callback);
			btnCancel();
		},
		"shieldHint": function(msg, callback) {     //屏蔽设置提示
			shieldHint("shieldHint", msg);
			btnSure(callback);
			btnCancel();
		} 

	}

	var createHtml = function(type, msg, btnValue) {
		var oDiv = "";
		oDiv += "<div class='popMask'></div>";
		oDiv += "<div class='commonNotice'>" +
			"<a class='huntClose' href='javascript:;'></a>" +
			"<div class='friendNotice hint'></div>" +
			"<p class='noticeArtic'>" + msg + "</p>" +
			"<div class='controlAreaa'>"
		if (type == "alert") {
			oDiv += "<input id='btnSure' type='button' value='" + (btnValue || "确定") + "' />";
		} else if (type == "confirm" || type == "determine") {
			oDiv += "<button id='btnSure'>确定</button>";
			oDiv += "<button id='btnCancel'>取消</button>";
		} else if (type == "save") {
			oDiv += "<div class='controlArea'>" +
				"<button id='btnSure'>保存</button>" +
				"<button id='btnCancel'>不保存</button>" +
				"</div>"
		} else if (type == "problem" || type == "shieldHint") {
			oDiv += "<div class='controlArea'>" +
				"<button id='btnSure'>确定</button>" +
				"<button id='btnCancel'>取消</button>" +
				"</div>"
		}
		oDiv += '</div></div>';
		$("body").css("overflow", "hidden").append(oDiv);
		if (type == "confirm" || type == "determine") {
			createCss();
		}
		$("#btnSure").focus();
	}

	var shieldHint = function (type, msg, btnValue){
		$("#mskocc2").remove();
		var hint = '<div id="mskocc2">' +
		'<div class="maskocc2"></div>' +
		'<div class="viewBoxocc2">' +
		'<p class="parBox2"><span class="hintCancel">×</span></p>' +
		'<div class="viewTop">' +
		'<h3>提示</h3>' +
		'<p>'+ msg +'</p>' +
		'</div>' +
		'<div class="viewBot">' +
		'<a class="btnSure" href="javascript:;">确定</a><a class="choosecan hintCancel" href="javascript:;">取消</a>' +
		'</div>' +
		'</div>' +
		'</div>';
		$("body").css("overflow", "hidden").append(hint);
		createCss();
	}


	var createCss = function() {
		var h = $(document).height();
		$(".popMask").css("height", h);
		$(".popMask").css({
			width: '100%',
			zIndex: '99999',
			position: 'absolute',
			filter: 'Alpha(opacity=70)',
			backgroundColor: '#000',
			top: '0',
			left: '0',
			opacity: '0.5'
		});
		$(".huntClose").css({
			display: 'inline-block',
			width: '12px',
			height: '12px',
			float: 'right',
			margin: '10px',
			background: 'url(/img/chahao.png) no-repeat center'
		});
		$(".commonNotice").css({
			zIndex: '999999',
			width: '280px',
			height: '186px',
			position: 'absolute',
			backgroundColor: '#fff',
			borderRadius: '5px',
			position: 'fixed',
			top: '50%',
			left: '50%',
			marginLeft: '-127px'
		});
		$(".hint").css({
			width: '40px',
			height: '40px',
			margin: '0 auto',
			marginTop: '38px',
			fontWeight: '600',
			fontSize: '16px'
		});
		$(".friendNotice").css({
			background: 'url(/img/wenhao.png) no-repeat',
		});
		$(".noticeArtic").css({
			padding: '16px 0 24px 0',
			fontSize: '12px',
			textAlign: 'center',
			height: '12px',
			margin: '0 10px'
		});
		$(".controlAreaa").css({
			textAlign: 'center'
		});
		$("#btnSure,#btnCancel").css({
			width: '68px',
			height: '28px',
			color: 'white',
			border: 'none',
			cursor: "pointer",
			borderRadius: '3px',
			margin: '0 18px'
		});
		$("#btnSure").css({
			backgroundColor: '#3fa535'
		});
		$("#btnCancel").css({
			backgroundColor: '#999'
		});
	}
	var btnSure = function(callback) {
		$("#btnSure,.btnSure").click(function() {
			$(".commonNotice").remove();
			$(".popMask").remove();
			$("#mskocc2").remove();
			$("body").css("overflow", "");
			if (typeof(callback) == 'function') {
				callback();
			}
		});
	}
	var btnCancel = function() {
		$("#btnCancel,.huntClose,.hintCancel").click(function() {
			$('.recmdList .Chat_list').attr('data-off', 0);
			$('.recmdList .Chat_list').find('.recmdCircle').css('background', 'url(/img/noChoseCircle.png) 0 center no-repeat');
			$(".commonNotice").remove();
			$(".popMask").remove();
			$("#mskocc2").remove();
			$("body").css("overflow", "");
		});
	}
})();

//获取个人信息资料
function findUserInformation(myname, username) {
	$.ajax({
		type: "post",
		url: serviceHOST() + '/user/findUserInformationEx.do',
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		data: {
			myname: myname,
			username: username
		},
		success: function(msg) {
			if (msg.status == -3) {
				getToken();
			};
			//个人主页
			if(msg.data.level<=15){
				var levelBoyImage = 'url("/img/h/sj_boy_' + msg.data.level + '.png") 0 bottom no-repeat';
				var levelGrilImage = 'url("/img/h/sj_gril_' + msg.data.level + '.png") 0 bottom no-repeat';
			}else{
				var levelBoyImage = 'url("/img/h/sj_boy_N.png") 0 bottom no-repeat';
				var levelGrilImage = 'url("/img/h/sj_gril_N.png") 0 bottom no-repeat';
			}
			var href = window.location.href;

			if (msg.data.imgforheadlist.length == 0) {
				var imagepath = '/img/first.png';
			} else {
				var imagepath = ImgHOST() + msg.data.imgforheadlist[0].imagepath;
			}
			if (href.indexOf('/me/') > -1) {
				if (msg.data.imgforuserbglist.length == 0) {
					var userPic = '/img/userdefault.png';
				} else {
					var userPic = ImgHOST() + msg.data.imgforuserbglist[0].imagepath;
				}
			} else {
				if (msg.data.imgforuserbglist.length == 0) {
					var userPic = '/img/strangedefault.png';
				} else {
					var userPic = ImgHOST() + msg.data.imgforuserbglist[0].imagepath;
				}
			}
			$('.user_bj').css({
				'background': "url(" + userPic + ") no-repeat center center",
				"backgroundSize": "100%"
			});
			//生日的判断
			if (msg.data.birthday == '' || msg.data.birthday == null||msg.data.birthday == "null") {
				var birth = '未设置';
			} else {
				var birth = msg.data.birthday /*.replace('-', '年').replace('-', '月') + '日'*/ ;
			}
			//设置备注名或者昵称
			if (msg.data.remark == "null" || msg.data.remark == "" || msg.data.remark == undefined) {
				var nickna=msg.data.nickname;
				if(nickna.length>12){
					nickna=nickna.substr(0,13)+"...";
				}
				$('.personal_nikename').text(nickna || shieldNumber(UserName));
			} else {
				$('.remark').show();
				if(msg.data.remark==username){
					var nickna=msg.data.nickname;
					if(nickna.length>12){
						nickna=nickna.substr(0,13)+"...";
					}
					$('.personal_nikename').text(nickna || shieldNumber(UserName));
				}else{
					$('.personal_nikename').text(msg.data.remark);
				};
				$('.remark_nikename').text(msg.data.nickname || shieldNumber(UserName));
			}
			$('.personal_code').text(msg.data.magicno);
			var _sign = msg.data.sign;
			if (_sign != "") {
				if (_sign.length > 30) {
					_sign = _sign.substring(0, 29) + '...'
				}
				$('.sign').text(_sign);
			}
			//性别的判断
			if (msg.data.sex == '') {
				$('.data_sex').text('未设置')
			} else {
				$('.data_sex').text(msg.data.sex);
			}
			//家乡的判断
			if (msg.data.hometown != undefined) {
				if (msg.data.hometown == '') {
					$('.homeTown').text('未设置');
				} else {
					var town = msg.data.hometown;
					if (town.split("|")[0] == "请选择省" && town.split("|")[1] == "请选择市" && town.split("|")[2] == "请选择区") {
						$('.homeTown').text("未设置");
					} else {
						town = town.replace(/\|/g, ' ');
						$('.homeTown').text(town);
					}
				};
			}

			$('.birthday').text(birth);
			if (msg.data.imgforheadlist == '') {
				$('.userImg img').attr('src', '/img/first.png');
				$('.personal_nikename').attr("data-imgHead",'');    //加入黑名单使用
			} else {
				$('.userImg img').attr('src', imagepath)
				$('.personal_nikename').attr("data-imgHead",msg.data.imgforheadlist[0].imagepath);   //加入黑名单使用
			}
			//判断职位
			var job = msg.data.realindustry
			if (job == '' || job == null) {
				$('.job').text('未设置');
			} else {
				if (job.length > 9) {
					var jobs = msg.data.realindustry.substr(0, 9) + "...";
				} else {
					var jobs = msg.data.realindustry;
				}
				$('.job').text(jobs);
			}
			//判断职位任证
			//0 代表未认证  -1 代表认证失败     1代表认证中     3代表再次提交审核认证    2代表已认证
			if (job != undefined || job != "" || job != null) {
				if (msg.data.certificateStatus == 0 || msg.data.certificateStatus == -1) {
					$('.pass').css({
						'background': 'url(/img/zy_renzhengtishi.png) 0 center no-repeat',
						'float': 'left',
						'marginRight': '5px'
					});
					$('.identification').removeClass('identification').css({
						'color': '#ccc',
					}).text('未认证');
				} else if (msg.data.certificateStatus == 1 || msg.data.certificateStatus == 3) {
					$('.pass').css({
						'background': 'url(/img/zy_renzhengtishi.png) 0 center no-repeat',
						'float': 'left',
						'marginRight': '5px'
					});
					$('.identification').removeClass('identification').css({
						'color': '#ccc',
					}).text('认证中');
				}
			}

			//判断手机号
			if (msg.data.mobiles == '') {
				$('.tel').text('未设置');
			}
			//性别的图标判断
			if (msg.data.sex == '女') {
				if(msg.data.level<=15){
					$(".top_message .level").html('<img scr="/img/h/sj_gril_' + msg.data.level + '.png">');
				}else{
					$(".top_message .level").html('<img scr="/img/h/sj_gril_N.png">');
				}
				$('.sex').css('background', 'url(/img/women_img.png) center center no-repeat #ff7cb6');
				$('.level').css({
					'background': levelGrilImage,
					"backgroundSize": "35px 14px"
				});
			} else {
				if(msg.data.level<=15){
					$(".top_message .level").html('<img scr="/img/h/sj_boy_' + msg.data.level + '.png">');
				}else{
					$(".top_message .level").html('<img scr="/img/h/sj_boy_N.png">');
				}
				$('.sex').css('background', 'url(/img/men_img.png) center center no-repeat #ff7cb6');
				$('.level').css({
					'background': levelBoyImage,
					"backgroundSize": "35px 14px"
				});
			}

			//等级
			if (msg.data.viplevel != 0) {
				$('.personal_title .viplevel').css({
					'background': 'url(/img/h/sj_VIP_' + msg.data.viplevel + '.png) center center no-repeat',
					"backgroundSize": "35px 14px"
				});
				$(".top_message .viplevel").html('<img scr="/img/h/sj_VIP_' + msg.data.viplevel + '.png">');
			}

			//如果是陌生人主页
			$('.personal_nikename').attr('data-guanzhu', msg.data.followingcnt)
			.attr('data-funs', msg.data.followercnt)
			.attr("data-nickname",msg.data.nickname)
			.attr("data-sex",msg.data.sex)
			.attr("data-level",msg.data.level)
			$('.myindustry').text(msg.data.myindustry);
			$('.dynamic_num').text(msg.data.topictotal);
			$('.focus_num').text(msg.data.followingcnt);
			$(".reply_num").html(msg.data.questioncnt);
			$('.funs_num').text(msg.data.followercnt);
			$('.circle_num').text(msg.data.myjoinedcirclecnt);
			$('.collect_num').text(msg.data.mycollectiontotal);
			$(".release_num").text(msg.data.commitCount);

			//判断是否关注
			if (msg.data.isfollowing == 0) {
				$('.concern').html('<i></i>关注');
				$('.concern').attr('data-status', 0);
			} else {
				$('.concern').html('<i style="background: url(/img/duihao1.png) center center no-repeat"></i>已关注')
				$('.concern').attr('data-status', 1);
			}
			//好友添加状态
			var relation = msg.data.relation;
			$('.recommend_friends,.setting_remark').hide();
			if (msg.data.relation == 0) {
				$('.friendStatus').html('已请求');
			} else if (msg.data.relation == 3 || msg.data.relation == 1 || msg.data.relation == 2) {
				$('.recommend_friends,.setting_remark').show();
				$('.friendStatus').html('<i style="background-image: url(/img/duihao1.png)"></i>好友')
			} else if (msg.data.relation == 4) {
				$('.friendStatus').html('对方已拒绝');
			} else {
				$('.friendStatus').html('<i class="personal_jiahaoyou"></i>加为好友')
			};
			$('.friendStatus').attr('data-relation', relation);
		},
		error: function() {
			console.log("error")
		}
	})
};

//	把大于10000的转化为小数点,保留小数点后二位
function change(x) {
	if(x > 10000){
		x = (x / 10000).toFixed(2);
		var y = x + "万";
		return y;
	}else{
		return x;
	}
	
}

/****************添加好友验证***************************/

//取消关注
function unsetFocus(username, following, _this, type) {
	var params = {
		username: username,
		following: following
	};
	var str = $.param(params);
	$.ajax({
		type: "get",
		url: serviceHOST() + "/following/unsetfollowing.do",
		dataType: "json",
		data: {
			username: username,
			following: following
		},
		headers: {
			"token": qz_token()
		},
		success: function(msg) {
			$('.more_box').hide();
			if (msg.status == 0 || msg.status == 410) {
				friendlyMessage('取消成功', function() {
					if (type == 2) {
						_this.addClass('search_att').removeClass('search_att_y').html("关注");
					}else if (type == 1) {
						_this.addClass('attention').removeClass('attention_yg').html("关注");
					}else if (type == 3) {
						_this.prev().html('<i></i>关注');
					}else if (type == 4) {    //个人主页取消关注
						_this.parents(".funsList").remove();
					}else if (type == 5) {
						_this.removeClass().addClass('funs_guanzhu').html('<i></i>关注');
					}
				});
			}
		},
		error: function() {
			console.log("error")
		}
	})
};
//设置关注
function setFocus(username, following, _this, type) {
	var params = {
		username: username,
		following: following
	};
	var str = $.param(params);
	$.ajax({
		type: "get",
		url: serviceHOST() + "/following/setfollowing.do",
		dataType: "json",
		data: {
			username: username,
			following: following
		},
		headers: {
			"token": qz_token()
		},
		success: function(msg) {
			friendlyMessage('关注成功', function() {
				if (type == 1) {
					_this.addClass('attention_yg').removeClass('attention').html("取消关注");
				} else if (type == 2) {
					_this.addClass('search_att_y').removeClass('search_att').html("取消关注");
				} else if (type == 3) {
					$('.concern').attr('data-status', 1).html('<i style="background: url(/img/duihao1.png) center center no-repeat;"></i>已关注').css('margin-right', '6px');
				} else if(type == 5) {  // 圈子详情群成员
					_this.removeClass().addClass('cancelGuanzhu').html('取消关注');
				}
			});

		},
		error: function() {
			console.log("error")
		}
	})
};



//分页
/*var pageStr=printPage({
	dataSum:	"",				//总条数
	pageNo:		msg.pageNo, //当前页
	pageSize:	msg.pageSize //每页显示多少条数据
});
*/
function printPage(Data) {
	var str = "";
	var fristpage = "";
	var prepage = "";
	var nextpage = "";
	var lastpage = "";
	var pageCount = 1; //总页数 默认为1
	Data.pageNo = parseInt(Data.pageNo);
	if (Data.dataSum && Data.pageSize) {
		pageCount = Math.ceil((Data.dataSum || 1) / (Data.pageSize || 10));
	}
	if (Data.pageNo > pageCount) {
		var url = window.location.href;
		url = changeURI(url, "pageNo", pageCount);
		window.location.href = url;
	}
	if (pageCount == 1) return str;
	if (Data.pageNo == 1) {
		fristpage = "";
		prepage = "";
	} else {
		var prePageNo = Math.max(Data.pageNo - 1, 1);
		fristpage = "<a href=\"javascript:;\" pageNo=\"1\">\u9996\u9875</a>";
		prepage = "<a href=\"javascript:;\" pageNo=\"" + prePageNo + "\">\u4e0a\u4e00\u9875</a>";
	}
	if (pageCount == Data.pageNo) {
		nextpage = "";
		lastpage = "";
	} else {
		var nextPageNo = Math.min(Data.pageNo + 1, pageCount);
		nextpage = "<a href=\"javascript:;\" pageNo=\"" + nextPageNo + "\">\u4e0b\u4e00\u9875</a>";
		lastpage = "<a href=\"javascript:;\" pageNo=\"" + pageCount + "\">\u672b\u9875</a>";
	}

	//  
	if (pageCount <= 7) //小于7页
	{
		var startPage = 1;
		var endPage = pageCount;
		var beforeStr = "";
		var afterStr = "";
	} else if (pageCount > 7) //大于7页
	{
		if (Data.pageNo < 6) //当前页小于第六页
		{
			var startPage = 1;
			var endPage = 6;
			var beforeStr = "";
			var afterStr = "<em>...</em>";

		} else if (Data.pageNo >= 6 && Data.pageNo < pageCount - 2) //中间页，小于最后2页
		{
			var startPage = Data.pageNo - 2;
			var endPage = Data.pageNo + 2;
			var beforeStr = "<em>...</em>";
			var afterStr = "<em>...</em>";
		} else //最后
		{
			var startPage = pageCount - 5;
			var endPage = pageCount;
			var beforeStr = "<em>...</em>";
			var afterStr = "";
		}
	}
	//  
	for (var i = startPage; i < endPage + 1; i++) {
		if (Data.pageNo == i) {
			str += "<span>" + i + "</span>";
		} else {
			str += "<a href=\"javascript:;\" pageNo=\"" + i + "\">" + i + "</a>";
		}
	}
	str = "<div id=\"page\">" + fristpage + prepage + beforeStr + str + afterStr + nextpage + lastpage + "</div>";
	return str;
}



/*
 *个人主页的图片的轮播展示    (动态部分的图片轮播)
 *	
 */
//function ByShowingPictures (){
//	$(document).on('mouseenter','.pictureShow img',function(){
//		var picMain = $(this).parents(".pictureShow").find('img').length;
//		if(picMain!=1){
//			$(this).css('cursor','url(/img/big_scale.cur),auto');
//		}
//	})
//	var num = 0;
//	$(document).on('click','.pictureShow ul li img',function(){
//		var picMain = $(this).parents(".pictureShow").find('img').length;
//		var _picSrc = $(this).attr('src');
//		num = $(this).parent().index();
//		$(this).parents('.pictureShow').siblings('.pic_main').find('.imgs').children().css({
//			'border':"0px"
//		});
//		$(this).parents('.pictureShow').siblings('.pic_main').children('.imgs').find('img').css({
//			"width": "58px",
//			"height": "58px"
//		});
//		if(picMain!=1){
//			$(this).parents('.pictureShow').hide();
//			$(this).parents('.content_items').find('.wrap').children().eq(0).attr('src',_picSrc);
//			$(this).parents('.pictureShow').siblings('.pic_main').show();
//			$(this).parents('.pictureShow').siblings('.pic_main').find('.imgs').find('a').eq(num).css("border", "2px solid #ff8518");
//			$(this).parents('.pictureShow').siblings('.pic_main').find('.imgs').find('a').eq(num).children().css({
//				"width": "54px",
//				"height": "54px"
//			})
//		}
//
//	})
//	//包大图片鼠标也上去去的情况
//	$(document).on('mousemove','.wrap',function(ev) {
//		var ev = ev || event;
//		var minLeft = $(this).offset().left + $(this).outerWidth() / 5;
//		var midLeft = $(this).offset().left + $(this).outerWidth() / 2;
//		var maxLeft = $(this).offset().left + $(this).outerWidth() * 0.8;
//		if(ev.clientX > $(this).offset().left && ev.clientX < minLeft) {
//			$('.next_btn').hide();
//			$('.pre_btn').show();
//			$(this).css('cursor', '');
//		}else if(ev.clientX > maxLeft && ev.clientX < $(this).outerWidth()+$(this).offset().left) {
//			$('.pre_btn').hide();
//			$('.next_btn').show();
//			$(this).css('cursor', '');
//		}else if(ev.clientX > minLeft && ev.clientX < maxLeft){
//			//console.log('mide')
//			$(this).css('cursor', 'url(/img/small_scale.cur),auto');
//		}
//	});
//	//小放大镜鼠标点击
//	$(document).on('click','.wrap',function(ev) {
//		var ev = ev || event;
//		var minLeft = $(this).offset().left + $(this).outerWidth() / 5;
//		var midLeft = $(this).offset().left + $(this).outerWidth() / 2;
//		var maxLeft = $(this).offset().left + $(this).outerWidth() * 0.8;
//		if(ev.clientX > minLeft && ev.clientX < maxLeft){
//			$(this).parents('.pic_main').hide();
//			$(this).parents('.pic_main').siblings('.pictureShow').show();
//		}
//	});
//	$(document).on('mouseleave','.wrap', function() {
//		$('.pre_btn').hide();
//		$('.next_btn').hide();
//	})
//	
//	//初始化时候第一个有边，其他的没边
//
//
//	//点击上一张的时候
//	$(document).on('click','.pre_btn',function() {
//		var len = $(this).parent().siblings('.imgs').find('img').length;
//		num--;
//		num = (len + num) % len;
//		var img = $(this).parent().siblings('.imgs').find('img').eq(num).attr('src');
//		$(this).parent().siblings('.imgs').find('a').css("border", "0px");
//		$(this).parent().siblings('.imgs').find('img').css({
//			"width": "58px",
//			"height": "58px"
//		})
//		$(this).parent().siblings('.imgs').children().eq(num).css("border", "2px solid #ff8518");
//		$(this).parents('.wrap').siblings('.imgs').find('img').eq(num).css({
//		//$(".imgs img").eq(num)
//			"width": "54px",
//			"height": "54px"
//		})
//		$(this).siblings('img').attr('src', img)
//	});
//
//	//点击下一张的时候
//	$(document).on('click','.next_btn',function() {
//		var len = $(this).parent().siblings('.imgs').find('img').length;
//		num++;
//		num %= len;
//		var img = $(this).parent().siblings('.imgs').find('img').eq(num).attr('src');
//		$(this).parent().siblings('.imgs').find('a').css("border", "0px");
//		$(this).parent().siblings('.imgs').find('img').css({
//			"width": "58px",
//			"height": "58px"
//		})
//		$(this).parent().siblings('.imgs').children().eq(num).css("border", "2px solid #ff8518");
//		$(this).parents('.wrap').siblings('.imgs').find('img').eq(num).css({
//			"width": "54px",
//			"height": "54px"
//		})
//		$(this).siblings('img').attr('src', img)
//	});	
//
//	//点击图片的时候
//	$(document).on('click','.imgs img',function() {
//		var img = $(this).attr('src');
//		$(this).parent("a").css("border", "2px solid #ff8518");
//		$(this).css({
//			"width": "54px",
//			"height": "54px"
//		})
//		$(this).parent("a").siblings().find("img").css({
//			"width": "58px",
//			"height": "58px"
//		})
//		$(this).parent("a").siblings().css("border", "")
//		$(this).parents('.imgs').siblings('.wrap').find('img').attr('src', img);
//	});
//}

function ByShowingPictures() {
	$(document).on('mouseenter', '.pictureShow img', function() {
		var picMain = $(this).parents(".pictureShow").find('img').length;
		if ($(this).parents("li").hasClass("specialOn") == false) { //为朋友圈转发的消息做区别
			$(this).css('cursor', 'url(/img/big_scale.cur),auto');
		}
	})
	var num = 0;
	$(document).on('click', '.pictureShow ul li img', function() {
			var picMain = $(this).parents(".pictureShow").find('img').length;
			var _picSrc = $(this).attr('src').split("-s")[0];
			num = $(this).parent().index();
			if (picMain != 1) {
				$(this).parents('.pictureShow').siblings('.pic_main').find('.imgs').children().css({
					'border': "0px"
				});
				$(this).parents('.pictureShow').siblings('.pic_main').children('.imgs').find('img').css({
					"width": "58px",
					"height": "58px"
				});
				$(this).parents('.pictureShow').siblings('.pic_main').find('.imgs').find('a').eq(num).css("border", "2px solid #ff8518");
				$(this).parents('.pictureShow').siblings('.pic_main').find('.imgs').find('a').eq(num).children().css({
					"width": "54px",
					"height": "54px"
				})
			}
			if ($(this).parents("li").hasClass("specialOn") == false) {
				$(this).parents('.pictureShow').hide();
			}
			$(this).parents('.content_items').find('.wrap').children().eq(0).attr('src', _picSrc);
			$(this).parents('.pictureShow').siblings('.pic_main').show();

		})
		//包大图片鼠标也上去去的情况
	$(document).on('mousemove', '.wrap', function(ev) {
		var ev = ev || event;
		var minLeft = $(this).offset().left + $(this).outerWidth() / 5;
		var midLeft = $(this).offset().left + $(this).outerWidth() / 2;
		var maxLeft = $(this).offset().left + $(this).outerWidth() * 0.8;
		var picMain = $(this).parents(".pic_main").siblings(".pictureShow").find('img').length;
		if (picMain != 1) {
			if (ev.clientX > $(this).offset().left && ev.clientX < minLeft) {
				$('.next_btn').hide();
				$('.pre_btn').show();
				$(this).css('cursor', '');
			} else if (ev.clientX > maxLeft && ev.clientX < $(this).outerWidth() + $(this).offset().left) {
				$('.pre_btn').hide();
				$('.next_btn').show();
				$(this).css('cursor', '');
			} else if (ev.clientX > minLeft && ev.clientX < maxLeft) {
				$(this).css('cursor', 'url(/img/small_scale.cur),auto');
			}
		} else {
			$(this).css('cursor', 'url(/img/small_scale.cur),auto');
		}
	});
	//小放大镜鼠标点击
	$(document).on('click', '.wrap', function(ev) {
		var ev = ev || event;
		var minLeft = $(this).offset().left + $(this).outerWidth() / 5;
		var midLeft = $(this).offset().left + $(this).outerWidth() / 2;
		var maxLeft = $(this).offset().left + $(this).outerWidth() * 0.8;
		var picMain = $(this).parents(".pic_main").siblings(".pictureShow").find('img').length;
		if (picMain != 1) {
			if (ev.clientX > minLeft && ev.clientX < maxLeft) {
				$(this).parents('.pic_main').hide();
				$(this).parents('.pic_main').siblings('.pictureShow').show();
			}
		} else {
			$(this).parents('.pic_main').hide();
			$(this).parents('.pic_main').siblings('.pictureShow').show();
		}
	});
	$(document).on('mouseleave', '.wrap', function() {
		$('.pre_btn').hide();
		$('.next_btn').hide();
	})

	//初始化时候第一个有边，其他的没边


	//点击上一张的时候
	$(document).on('click', '.pre_btn', function() {
		var len = $(this).parent().siblings('.imgs').find('img').length;
		num--;
		num = (len + num) % len;
		var img = $(this).parent().siblings('.imgs').find('img').eq(num).attr('src').split("-s")[0];
		$(this).parent().siblings('.imgs').find('a').css("border", "0px");
		$(this).parent().siblings('.imgs').find('img').css({
			"width": "58px",
			"height": "58px"
		})
		$(this).parent().siblings('.imgs').children().eq(num).css("border", "2px solid #ff8518");
		$(this).parents('.wrap').siblings('.imgs').find('img').eq(num).css({
			//$(".imgs img").eq(num)
			"width": "54px",
			"height": "54px"
		})
		$(this).siblings('img').attr('src', img)
	});

	//点击下一张的时候
	$(document).on('click', '.next_btn', function() {
		var len = $(this).parent().siblings('.imgs').find('img').length;
		num++;
		num %= len;
		var img = $(this).parent().siblings('.imgs').find('img').eq(num).attr('src').split("-s")[0];
		$(this).parent().siblings('.imgs').find('a').css("border", "0px");
		$(this).parent().siblings('.imgs').find('img').css({
			"width": "58px",
			"height": "58px"
		})
		$(this).parent().siblings('.imgs').children().eq(num).css("border", "2px solid #ff8518");
		$(this).parents('.wrap').siblings('.imgs').find('img').eq(num).css({
			"width": "54px",
			"height": "54px"
		})
		$(this).siblings('img').attr('src', img)
	});

	//点击图片的时候
	$(document).on('click', '.imgs img', function() {
		var img = $(this).attr('src');
		$(this).parent("a").css("border", "2px solid #ff8518");
		$(this).css({
			"width": "54px",
			"height": "54px"
		})
		$(this).parent("a").siblings().find("img").css({
			"width": "58px",
			"height": "58px"
		})
		$(this).parent("a").siblings().css("border", "")
		$(this).parents('.imgs').siblings('.wrap').find('img').attr('src', img);
	});
}


//判断字数
function checkLength(which, count, name) {
	var maxChars = count;
	if (which.value.length > maxChars)
		which.value = which.value.substring(0, maxChars);
	var curr = maxChars - which.value.length;
	document.getElementById(name).innerHTML = curr.toString();
}


//判断字数        //投诉，编辑 、反馈
function checkLengths(which, count, name) {
	var maxChars = count;
	if (which.val().length > maxChars)
		which.val(which.val().substring(0, maxChars));
	var curr = /*maxChars -*/ which.val().length;
	$(name).html(curr.toString());
}

//判断字数
function checkNum(which, count, name) {
	var maxChars = count;
	if (which.val().length > maxChars)
		which.val(which.val().substring(0, maxChars));
	var curr = maxChars - which.val().length;
	$(name).html(curr.toString());
}



/*!
Autosize 2.0.0
license: MIT
textarea根据内容自动延伸，显示滚动条
*/
(function(root, factory) {
	'use strict';

	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define([], factory);
	} else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.autosize = factory();
	}
}(this, function() {
	function main(ta) {
		if (!ta || !ta.nodeName || ta.nodeName !== 'TEXTAREA' || ta.hasAttribute('data-autosize-on')) {
			return;
		}

		var maxHeight;
		var heightOffset;

		function init() {
			var style = window.getComputedStyle(ta, null);

			if (style.resize === 'vertical') {
				ta.style.resize = 'none';
			} else if (style.resize === 'both') {
				ta.style.resize = 'horizontal';
			}

			// horizontal overflow is hidden, so break-word is necessary for handling words longer than the textarea width
			ta.style.wordWrap = 'break-word';

			// Chrome/Safari-specific fix:
			// When the textarea y-overflow is hidden, Chrome/Safari doesn't reflow the text to account for the space
			// made available by removing the scrollbar. This workaround will cause the text to reflow.
			var width = ta.style.width;
			ta.style.width = '0px';
			// Force reflow:
			/* jshint ignore:start */
			ta.offsetWidth;
			/* jshint ignore:end */
			ta.style.width = width;

			maxHeight = style.maxHeight !== 'none' ? parseFloat(style.maxHeight) : false;

			if (style.boxSizing === 'content-box') {
				heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
			} else {
				heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
			}

			adjust();
		}

		function adjust() {
			var startHeight = ta.style.height;
			var htmlTop = document.documentElement.scrollTop;
			var bodyTop = document.body.scrollTop;

			ta.style.height = '16px';

			var endHeight = ta.scrollHeight + heightOffset;

			if (maxHeight !== false && maxHeight < endHeight) {
				endHeight = maxHeight;
				if (ta.style.overflowY !== 'scroll') {
					ta.style.overflowY = 'scroll';
				}
			} else if (ta.style.overflowY !== 'hidden') {
				ta.style.overflowY = 'hidden';
			}

			ta.style.height = endHeight + 'px';

			// prevents scroll-position jumping
			document.documentElement.scrollTop = htmlTop;
			document.body.scrollTop = bodyTop;

			if (startHeight !== ta.style.height) {
				var evt = document.createEvent('Event');
				evt.initEvent('autosize.resized', true, false);
				ta.dispatchEvent(evt);
			}
		}

		// IE9 does not fire onpropertychange or oninput for deletions,
		// so binding to onkeyup to catch most of those events.
		// There is no way that I know of to detect something like 'cut' in IE9.
		if ('onpropertychange' in ta && 'oninput' in ta) {
			ta.addEventListener('keyup', adjust);
		}

		window.addEventListener('resize', adjust);
		ta.addEventListener('focus', adjust);
		ta.addEventListener('input', adjust);
		ta.addEventListener('autosize.update', adjust);

		ta.addEventListener('autosize.destroy', function(style) {
			window.removeEventListener('resize', adjust);
			ta.removeEventListener('focus', adjust);
			ta.removeEventListener('input', adjust);
			ta.removeEventListener('keyup', adjust);
			ta.removeEventListener('autosize.destroy');

			Object.keys(style).forEach(function(key) {
				ta.style[key] = style[key];
			});

			ta.removeAttribute('data-autosize-on');
		}.bind(ta, {
			height: ta.style.height,
			overflow: ta.style.overflow,
			overflowY: ta.style.overflowY,
			wordWrap: ta.style.wordWrap,
			resize: ta.style.resize
		}));

		ta.setAttribute('data-autosize-on', true);
		ta.style.overflow = 'hidden';
		ta.style.overflowY = 'hidden';

		init();
	}

	// Do nothing in IE8 or lower
	if (typeof window.getComputedStyle !== 'function') {
		return function(elements) {
			return elements;
		};
	} else {
		return function(elements) {
			if (elements && elements.length) {
				Array.prototype.forEach.call(elements, main);
			} else if (elements && elements.nodeName) {
				main(elements);
			}
			return elements;
		};
	}
}));


//右侧可能认识的人
function recommendRosters(username, type) {
	if(!username){
		$(".center_p_t h3").html("推荐");
		$(".center_p_t a").attr("href","/center/lookForSb.html").html("查看更多用户");
		
		//		个人主页/陌生人主页可能认识栏目     未登录
		$(".recommend p i").html("推荐");
		$(".recommend p a").attr("href","/center/lookForSb.html");
	}else{
		$(".center_p_t a").attr("href","/center/acceptfriends.html").html("查看所有好友推荐");
		
		//		个人主页/陌生人主页可能认识栏目     已登录
		$(".recommend p i").html("可能认识");
		$(".recommend p a").attr("href","/center/acceptfriends.html");
	}
	if (!type) im.localLoadingOn(".recommend ul");
	im.localLoadingOn("#main_bottom_ad")
	var str = "";
	var tpl = "";
	var top_tj = "";
	$.ajax({
		type: "post",
		url: serviceHOST() + "/recommend/recommendRosters.do",
		data: {
			username: UserName
		},
		dataType: "json",
		headers: {
			"token": qz_token()
		},
		success: function(msg) {
			im.localLoadingOff(".recommend ul");
			if (msg.status == 0) {
				var mssg = msg.data;
				for (var i in mssg) {
					if (mssg[i].level > 15) {
						mssg[i].level = 15;
					}

					str += '<li class="AddBuddy_r ' + mssg[i].userNo + '" data-id=' + mssg[i].username + '  data-no=' + mssg[i].userNo + '>' +
						'<dl>';
					if (mssg[i].imgforheadlist[0] == undefined) {
						str += '<dt class="user_img"><img src="/img/first.png" alt="" /></dt>';
					} else {
						str += '<dt class="user_img"><img src="' + ImgHOST() + mssg[i].imgforheadlist[0].imagepath + '" onerror=javascript:this.src="/img/first.png"></dt>';
					}
					//昵称过长的处理
					if (mssg[i].nickname != null && mssg[i].nickname.length > 5) {
						var len5 = mssg[i].nickname.substr(0, 5) + "...";
					} else {
						var len5 = (mssg[i].nickname || mssg[i].username.substr(0, 10));
					}
					str += '<dd class="recommend_name">' + len5;
					//用户等级   和会员等级   性别'
					if (mssg[i].level >= 16) {
						mssg[i].level = "N";
					}
					if (mssg[i].sex == "男" || mssg[i].sex == "女") {
						str += '<span class="gradeImg"><img src="/img/h/sj_' + user_level[mssg[i].sex.charCodeAt()] + '_' + mssg[i].level + '.png"/></span>';
					} else {
						str += '<span class="gradeImg"><img src="/img/h/sj_boy_' + mssg[i].level + '.png"/></span>';
					}
					//加入的圈子字数过长进行处理
					if (mssg[i].myindustry.length > 8) {
						var myInd = mssg[i].myindustry.substr(0, 8) + "...";
					} else {
						var myInd = mssg[i].myindustry;
					}
					str += '</dd>' +
						'<dd>' + myInd + '</dd>' +
						'</dl>' +
						'<div class="dispose">' +
						'<a class="plus ' + no_login + '" data-id="' + mssg[i].id + '" href="javascript:;">加为好友</a>' +
						'<a class="dispose_del ' + no_login + '" data-id="' + mssg[i].id + '" href="javascript:;"></a>' +
						'</div>' +
						'</li>';

					tpl += '<li class="personage_list ' + mssg[i].userNo + '" data-id=' + mssg[i].username + '  data-no=' + mssg[i].userNo + '>';
					if (mssg[i].imgforheadlist[0] == undefined) {
						tpl += '<img class="pagePersons" data-name="' + mssg[i].username + '" src="/img/first.png" alt="" />';
					} else {
						tpl += '<img class="pagePersons" data-name="' + mssg[i].username + '" src="' + ImgHOST() + mssg[i].imgforheadlist[0].imagepath + '"/>';
					}
					tpl += '<div class="personage_b">' +
						'<h4 class="pagePersons" data-name="' + mssg[i].username + '">' + (mssg[i].nickname || mssg[i].username.substr(0, 10)) + '</h4>' +
						'<p>' + mssg[i].myindustry + '</p>' +
						'<a class="AddBuddy ' + no_login + '" href="javascript:;"><i></i>加为好友</a>' +
						'</div><a class="DeleteRecommended ' + no_login + '" href="javascript:;"></a>' +
						'</li>';

					//顶部导航可能认识的人
					if(i < 4){
						top_tj += '<li class="RequestList AddBuddy_r ' + mssg[i].userNo + '" data-id=' + mssg[i].username + '  data-no=' + mssg[i].userNo + '><dl><dt>';
						if (mssg[i].imgforheadlist[0] == undefined) {
							top_tj += '<img src="/img/first.png" />';
						} else {
							top_tj += '<img src="' + ImgHOST() + mssg[i].imgforheadlist[0].imagepath + '" />';
						}
						top_tj += '</dt>' +
							'<dd>' + mssg[i].nickname + '</dd>' +
							'<dd class="informationk">' + mssg[i].myindustry + '</dd>' +
							'</dl>' +
							'<div class="friend_m_accept qz' + mssg[i].username + '">' +
							'<a class="know_jhy" href="javascript:;">加好友</a>' +
							'<a class="know_gz attention" href="javascript:;">关注</a>' +
							'<a class="May_know_del del DeleteRecommended" href="javascript:;"></a>' +
							'</div>' +
							'</li>';
					}

				}
				if (!type){
					$(".recommend ul").html(str);
					$(".friend_message .May_know").html(top_tj);
				} 
				$("#main_bottom_ad").html(tpl);

			} else if (msg.status == -3) {
				getToken();
			};
		},
		error: function() {
			console.log("error")
		}

	});
}

//网页静态化接口
//进个人主页网页静态化接口
$(document).on("click", ".pagePersons", function() {
	var strangename = $(this).attr("data-name");
	getInfo({
		myname: getCookie("username") || "nouser",
		username: strangename,
		templetName: "pageJingtai"
	});
})

/*
 * 
 * 跳转到用户主页
 * 
 * */
$(document).on("click", ".user_img img,.recommend_name", function() {
	var strangename = $(this).parents('li').attr("data-id");
	var username = getCookie('username');
	if (strangename == username) {
		window.location.href = '/center/me/page.html';
	} else {
		getInfo({
			myname: getCookie("username") || "nouser",
			username: strangename,
			templetName: "pageJingtai"
		});
	}
})

/*
 
 * 
 * 跳转到用户主页
 * 
 * */
$(document).on("click", ".usermessage,.usermessage_t,.authorName>b", function() {
	var strangename = $(this).parents(".content_items").attr("data-name");
	if (strangename == UserName) {
		window.location.href = '/center/me/page.html';
	} else {
		getInfo({
			myname: getCookie("username") || "nouser",
			username: strangename,
			templetName: "pageJingtai"
		});
	}
});
$(document).on("click", ".message_mark>dt", function() {
	if(window.location.href.indexOf('videodetail.html')==-1){
		var strangename = $(this).parents(".content_items").attr("data-name");
		if (strangename == UserName) {
			window.location.href = '/center/me/page.html';
		} else {
			getInfo({
				myname: getCookie("username") || "nouser",
				username: strangename,
				templetName: "pageJingtai"
			});
		}
	}
})


//点赞人头像跳转
$(document).on("click", ".clickPersonpage", function() {
	var strangename = $(this).attr("data-name");
	if (strangename == UserName) {
		window.location.href = '/center/me/page.html';
	} else {
		getInfo({
			myname: getCookie("username") || "nouser",
			username: strangename,
			templetName: "pageJingtai"
		});
	}
})




var p = 0, t = 0;
$(window).scroll(function() {
	var s = $(this).scrollTop();
	var w = $(this).height();
	
	p = s;
	//个人主页定位
	if (w > 820 && s > 370 && $("body div").hasClass("personal_data") && $('.homepage_bottom').height() > 735) {
		if(window.location.href.indexOf("center/u")>-1){
			$('.homepage_left').css({
			'position': 'fixed',
				'top': '50px'
			});
		}else{
			$('.homepage_left').css({
				'position': 'fixed',
				'top': '70px'
			});
		}
	} else {
		$('.homepage_left').css({
			'position': 'static'
		});
	}

	//两侧边栏位置
	if(scrollTag || !hiddenHigh) sidebarAdjust()
});


function addCookIe() {
	$.ajax({
		type: "post",
		url: serHOST()+"/utils/addCookies.do",
		//				xhrFields: {
		//		            withCredentials: true
		//		        },
		//	        	crossDomain: true,
		async: true,
		success: function(msg) {
			var jsons = JSON.parse(msg);
			setCookie("keys", jsons.random);
		},
		error: function() {
			console.log("error");
		}
	});
};
addCookIe()

// 主页右侧load 返回高度
function rightH(h) {
	hiddenHigh = h + 275;
	sidebarAdjust()
	scrollTag = true;
	return false;
}


var scrollTag = false;
hiddenHigh_tag = true; 
order = true,
order1 = false,
order_m = true,
order1_m = false,
oneH = true,    //左第一次滑动
order_r = true,
order1_r = false,
oneH_r = true,     //右第一次滑动
topc = "",   //向上滚动时的高度
breakH = "", //左滚动到底距离
breakH_r = "", //右滚动到底距离
breakH_m = "",  //中间
polymerous = "", //生活圈和全球圈展开更多多出的距离
hiddenHigh = "",
mainHight = true;  //中间初始高度


function sidebarAdjust() {
	var f = $(".main");
	var c = $(window).scrollTop(); //滚动区的高度
	var clientH = window.screen.height; //屏幕的高度
	if((hiddenHigh - 275) != $(".right_sideBar").height() && hiddenHigh_tag){
		hiddenHigh = $(".right_sideBar").height();
		hiddenHigh_tag = false;
	} 
	var r = $("#sideBar").height() || $(".right_sideBar").height() || $(".search_tj_right").height()||$(".detail_right").height();;			//右边
	var rs = $("#sideBar,.right_sideBar,.search_tj_right");
	var l = $(".content_left"); //左边
	var m = $(".center_box");  //中间
	var left_H = l.height() + 10 - $(window).height();   //左侧显示多余高
	var right_H = r + 10 - $(window).height();    		 //右侧显示多余高
	var main_H = m.height() + 10 - $(window).height();  
	if(mainHight) $(".main").css("min-height",r + 130 + "px");
	if(m.height() >= $(".main").height()){
		mainHight = false;
		$(".main").css("height","auto");
		m.css("position","static");
	}

	//中间
	if(m.height() + 140 > $(window).height() && mainHight){
		var topc_m = c - (m.height() - $(window).height()) - 140;
		if(t > p){
			if(!order_m){	
				if(c < 0) c = 0;
				m.css({
					"position": "absolute",
					"top": topc_m
				});
				breakH_m = topc_m;
			}

			//向上滚动右侧完全露出时
			if((c < breakH_m  || c == 0)&& order_m == true){
				m.css({
					"position": "fixed",
					"top": 140
				});
				order1_m = true;
			}
			order_m = true;
		} else {
			if(c + $(window).height() - 130 >= l.height() && oneH){
				m.css({
					"position": "fixed",
					"top": -main_H
				});	
				oneH = false;
			}

			// 向下滑动
			if(order1_m){
				breakH_m = topc_m + main_H + 130;
				m.css({
					"position": "absolute",
					"top": breakH_m
				});
				order1_m = false;
			}

			//向下滑动到底时
			if(topc_m >= breakH_m){
				m.css({
					"position": "fixed",
					"top": -main_H
				});
				order_m = false;
			}
		}
	}




	//左
	if(l.height() + 140 > $(window).height()){
		topc_l = c - (l.height() - $(window).height()) - 140;
		// 滚动条向上滚动
		if(t > p){
			if(!order){	
				if(c < 0) c = 0;
				l.css({
					"position": "absolute",
					"top": topc_l
				});
				breakH = topc_l;
			}

			//向上滚动右侧完全露出时
			if((c < breakH  || c == 0)&& order == true){
				l.css({
					"position": "fixed",
					"top": 140
				});
				order1 = true;
			}
			order = true;
		} else {
			if(c + $(window).height() - 130 >= l.height() && oneH){
				l.css({
					"position": "fixed",
					"top": -left_H
				});	
				oneH = false;
			}

			// 向下滑动
			if(order1){
				breakH = topc_l + left_H + 130;
				l.css({
					"position": "absolute",
					"top": breakH
				});
				order1 = false;
			}

			//向下滑动到底时
			if(topc_l >= breakH){
				l.css({
					"position": "fixed",
					"top": -left_H
				});
				order = false;
			}
		}
		
	}else{
		l.css({"position": "fixed","top": "140px"});
	}

	//右
	if(r + 140 > $(window).height()){
		var topc_r = c - (r - $(window).height()) - 140;
		// 滚动条向上滚动
		if(t > p){
			if(order_r){	
				if(c < 0) c = 0;
				rs.css({
					"position": "absolute",
					"top": topc_r
				});
				breakH_r = topc_r;
			}

			//向上滚动右侧完全露出时
			if((c < breakH_r  || c == 0)&& order_r == false){
				rs.css({
					"position": "fixed",
					"top": 140
				});
				order1_r = true;
			}
			order_r = false;
		} else {
			if(c + $(window).height() - 130 >= r && oneH){
				rs.css({
					"position": "fixed",
					"top": -right_H
				});	
				oneH = false;
			}

			// 向下滑动
			if(order1_r){
				breakH_r = topc_r + right_H + 130;
				rs.css({
					"position": "absolute",
					"top": breakH_r
				});
				order1_r = false;
			}

			//向下滑动到底时
			if(topc_r >= breakH_r){
				rs.css({
					"position": "fixed",
					"top": -right_H
				});
				order_r = true;
			}
		}
		
	}else{
		rs.css({"position": "fixed","top": "140px"});
	}

	setTimeout(function(){
		t = p;
	},0);
	positionAdjustment(c, f, r, l,rs,m);
}



//滑到底部时  左右跟随上移
function positionAdjustment(c, f, r, l,rs,m) {
	//右
	var polymerous = 130;
	if(r + 140 < $(window).height()) polymerous = 130 -( $(window).height()- (r + 140))    
	if ($(document).height() - polymerous < c + $(window).height()) { //判断有没有底部导航并且滑动到底部
		if ($(window).height() < r + 260) {
			var rh = f.height() - r;
			rs.css({
				"position": "absolute",
				"top": rh 
			});
		}else {
			rs.css({"position": "fixed","top": "140px"});
		}
	}

	//左
	if ($(document).height() - 130 < c + $(window).height()) { 
		if (c > f.height() - l.height()) {
			c = f.height() - l.height();
		};
		l.css({
			"position": "absolute",
			"top": c
		})

		if (c > f.height() - m.height()) {
			c = f.height() - m.height();
		};

		if(mainHight){
			m.css({
				"position": "absolute",
				"top": c
			})
		}
	}
}

// 加载更多内容底部消失，两侧下移
function AfterTheLoadCompleted (){
	var r = hiddenHigh || $("#sideBar").height() || $(".right_sideBar").height() || $(".search_tj_right").height()||$(".detail_right").height();;			//右边
	var rs = $("#sideBar,.right_sideBar,.search_tj_right");
	var l = $(".content_left"); //左边
	var left_H = l.height() + 10 - $(window).height();   //左侧屏幕显示多余高
	var right_H = r + 10 - $(window).height();    		 //右侧屏幕显示多余高
	var m = $(".center_box");  //中间
	rs.css({"position": "fixed","top": -right_H});
	l.css({"position": "fixed","top": -left_H});
	if(m.height() > $(".main").height()){
		mainHight = false;
		$(".main").css("height","auto");
		m.css("position","static");
	}
}





//置顶效果
$(window).scroll(function() {
	if ($(window).scrollTop() >= 3000) {
		$('.returnTop').fadeIn(300);
	} else {
		$('.returnTop').fadeOut(300);
	}
});
$(document).on("click", ".returnTop", function() {
	var speed = 800; //滑动的速度
	$('body,html').animate({
		scrollTop: 0
	}, speed);
	return false;
});



//网页静态化后端返回的访问路径
function getInfo(datas) {
	//		{myname:"13401185183",username:"17701026478",templetName:"index"}
	$.ajax({
		type: "POST",
		url: serviceHOST() + "/jingtaihua/goUserInfoPageEX.do",
		headers: {
			"token": qz_token()
		},
		data: datas,
		dataType: "json",
		success: function(msg) {
			var mssg = msg.data;
			window.location.href = "/center/u/" + mssg + "?from=" + datas.username;
		},
		error: function() {
			console.log("error");
		}
	});
}



//加入圈子已达上限提示
function circlelimit(msg) {
	if (!msg) var msg = '您好，当前最多可加入圈子已达最大限度如需加入其它，请升级为VIP会员或变更职业圈。';
	$("#mskocc").remove();
	var str = '<div id="mskocc">' +
		'<div class="maskocc"></div>' +
		'<div class="viewBoxocc">' +
		'<p class="parBox"><span>×</span></p>' +
		'<div class="viewTop">' +
		'<h3>提示</h3>' +
		'<p>' + msg + '</p>' +
		'</div>' +
		'<div class="viewBot">' +
		'<a class="changework" href="javascript:;">变更职业</a><a class="entermember " href="/center/vipCentre.html">开通会员</a>' +
		'</div>' +
		'</div>' +
		'</div>'
	$("body").append(str);

};

// 第三方登录未加入职业圈提示窗口   提示至少加入一个圈子
function circlethirdlogin() {
	$("#mskocc2").remove();
	var str = '<div id="mskocc2">' +
		'<div class="maskocc2"></div>' +
		'<div class="viewBoxocc2">' +
		'<p class="parBox2"><span>×</span></p>' +
		'<div class="viewTop">' +
		'<h3>提示</h3>' +
		'<p>您好，您至少需要选择一个所属职业圈。</p>' +
		'</div>' +
		'<div class="viewBot">' +
		'<a class="choosecoo" href="javascript:;">选择职业</a><a class="choosecan" href="javascript:;">取消</a>' +
		'</div>' +
		'</div>' +
		'</div>'
	$("body").append(str);

};

// 第三方登录绑定手机号      当点击职业圈加入时
function thirdloginAlert() {
	$("#mskocc3").remove();
	var str = '<div id="mskocc3">' +
		'<div class="maskocc3"></div>' +
		'<div class="viewBoxocc3">' +
		'<p class="parBox3"><span>×</span></p>' +
		'<div class="viewTop">' +
		'<h3>提示</h3>' +
		'<p>验证手机号码，加入更多职业圈</p>' +
		'</div>' +
		'<div class="viewBot">' +
		'<a class="phoneTest" href="javascript:;">手机验证</a><a class="testcan" href="javascript:;">取消</a>' +
		'</div>' +
		'</div>' +
		'</div>'
	$("body").append(str);

};

// 当点击退出职业圈  提示至少保留一个圈子
function keeponeCircle() {
	$("#mskocc4").remove();
	var str = '<div id="mskocc4">' +
		'<div class="maskocc4"></div>' +
		'<div class="viewBoxocc4">' +
		'<p class="parBox4"><span>×</span></p>' +
		'<div class="viewTop">' +
		'<h3>提示</h3>' +
		'<p>您好，您至少需要选择一个所属职业圈。</p>' +
		'</div>' +
		'<div class="viewBot">' +
		'<a class="choosecoo" href="javascript:;">变更职业</a><a class="choosecan" href="javascript:;">取消</a>' +
		'</div>' +
		'</div>' +
		'</div>'
	$("body").append(str);

};
//第三方账号绑定手机号接口
function bindPhone() {
	var hrefs = window.location.href;
	$(".bg_mask,.viewbindPhone").show();
	//点击弹窗差号
	$(document).on("click", ".viewbindPhone .binderrors", function() {
		$(".bindinputLogin input").css("border-color", "#ddd").val("");
		$(".bindinputLogin .warn2").hide();
		$(".bg_mask,.viewbindPhone").hide();
	})
	$(".viewbindPhone .bindinputLogin input").on("keyup", function() {
		$(this).css("border-color", "#ddd");
		$(this).siblings(".warn2").hide();
	});
	$(".viewbindPhone .bindinputLogin input").on("focus", function() {
			$(this).parent("li").siblings().find(".warn2").hide();
			$(this).parent("li").siblings().find("input").css("border-color", "#ddd");
		})
		//获取验证码接口
	var phonenum = ""; //手机号
	var bindcode = ""; //验证码
	function getphoneCodebind() {
		$.ajax({
			url: serviceHOST() + "/checkUser/sendPhoneMsg.do",
			type: 'post',
			data: {
				"phnum": phonenum,
				"smeth": 2, //传2用的是修改密码。
				"random": getCookie("keys")
			},
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				if (msg.status == 0) {
					if (msg.data == 0) {
						friendlyMess("验证码发送成功");
						resetCodebind(); //倒计时
					} else if (msg.data == "M") {
						$(".viewbindPhone .point4").show()
						$(".viewbindPhone .point4 p").text("稍等片刻，才能再次发送");
						$("#bindcode").css("border", "1px solid #f9533d");
					}
				} else if (msg.status == -1) {
					friendlyMess("验证码获取失败，请再次点击获取", "Y")
				} else if (msg.status == -3) {
					getToken();
				};
			},
			error: function() {
				console.log('error!');
			}
		});
	}
	/*得到验证码*/
	var isPhonebind = 1;

	function getCodebind(e) {
		checkPhonebind(); //验证手机号码
		if (isPhonebind) {
			getphoneCodebind()
		} else {
			$('#bindphone').focus();
		}
	};

	$(".bindget-code").on("click", function() {
			if (!getCookie("keys")) {
				addCookIe()
			}
			getCodebind($(this))
		})
		/******验证手机号********/
	function checkPhonebind() {
		var pattern = /^1[34578]\d{9}$/;
		phonenum = $.trim(html2Escape($("#bindphone").val()));
		isPhonebind = 1;
		if (phonenum == '') {
			$(".viewbindPhone .point3 p").text("请输入手机号码");
			$(".viewbindPhone .point3").show()
			$("#bindphone").css("border", "1px solid #f9533d");
			isPhonebind = 0;
			return false;
		}
		if (!pattern.test(phonenum)) {
			$(".viewbindPhone .point3 p").text("手机号有误");
			$(".viewbindPhone .point3").show();
			$("#bindphone").css("border", "1px solid #f9533d")
			isPhonebind = 0;
			return false;
		}
	};
	/**************倒计时********************/
	function resetCodebind() {
		$('.viewbindPhone .bindidentifyingCode').css("display", "none");
		$('#J_bindsecond').html('60');
		$('#J_bindresetCode').show();
		var second = 60;
		var timer = null;
		timer = setInterval(function() {
			second -= 1;
			if (second > 0) {
				$('#J_bindsecond').html(second);
			} else {
				clearInterval(timer);
				$('.viewbindPhone .bindidentifyingCode').show();
				$('#J_bindresetCode').hide();
			}
		}, 1000);
	};
	//	验证发送的验证码正确与否
	var codeStatusbind = "";

	function checkCodebind(datas) {
		checkPhonebind();
		im.loadingOn()
		$.ajax({
			type: 'post',
			url: serviceHOST() + "/checkUser/checkPhoneMsg.do",
			async: false,
			data: datas,
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				im.loadingOff()
				if (msg.status == 0) {
					codeStatusbind = msg.data;
				} else if (msg.status == -1) {
					codeStatusbind = 3; //自定义
				} else if (msg.status == -3) {
					getToken();
				};
			},
			error: function() {
				console.log('error!');
			}
		});
	}
	//提交按钮点击
	$(document).on("click", ".bindclickLogin", function() {
		phonenum = $.trim(html2Escape($("#bindphone").val()));
		bindcode = $.trim(html2Escape($("#bindcode").val()));
		var passnum =$.trim(html2Escape($("#bindpassword").val()));
		var reg = /^[0-9a-zA-Z]*$/g;
		checkPhonebind();
		if (isPhonebind == 0) {
			return false;
		};
		if (!bindcode) {
			$(".viewbindPhone .point4 p").text("请输入验证码");
			$(".viewbindPhone .point4").show()
			$(".viewbindPhone #bindcode").css("border", "1px solid #f9533d");
			return false;
		} else {
			checkCodebind({
				"phnum": phonenum,
				"code": bindcode
			});
			if (codeStatusbind == -1) { //-1 错误   -2 过期      否则正确
				$(".viewbindPhone .point4").show()
				$(".viewbindPhone .point4 p").text("验证码有误");
				$(".viewbindPhone #bindcode").css("border", "1px solid #f9533d");
				return false;
			} else if (codeStatusbind == -2) {
				$(".viewbindPhone .point4").show()
				$(".viewbindPhone .point4 p").text("验证码已过期");
				$(".viewbindPhone #bindcode").css("border", "1px solid #f9533d");
				return false;
			} else if (codeStatusbind == 3) {
				$(".viewbindPhone .point4").show()
				$(".viewbindPhone .point4 p").text("验证码异常");
				$(".viewbindPhone #bindcode ").css("border", "1px solid #f9533d");
				return false;
			};
		};
		if (!passnum) {
			$(".viewbindPhone .point5 p").text("请设置密码");
			$(".viewbindPhone .point5").show()
			$("#bindpassword").css("border", "1px solid #f9533d");
			return false;
		} else {
			if (!reg.test(passnum)) {
				$(".viewbindPhone .point5").show();
				$(".viewbindPhone .point5 p").text("密码只能是数字和字母");
				$("#bindpassword").css("border", "1px solid #f9533d");
				return false;
			}
			if (passnum.length < 6) {
				$(".viewbindPhone .point5").show();
				$(".viewbindPhone .point5 p").text("密码不能少于6位");
				$("#bindpassword").css("border", "1px solid #f9533d");
				return false;
			};
			if (passnum.length > 20) {
				$(".viewbindPhone .point5").show();
				$(".viewbindPhone .point5 p").text("密码不能大于20位");
				$("#bindpassword").css("border", "1px solid #f9533d");
				return false;
			};

		};

		$.ajax({
			type: "post",
			url: serviceHOST() + "/user/bindPhoneToUser.do", //绑定手机号接口
			data: {
				"phnum": phonenum,
				"userName": getCookie("username"),
				"code": bindcode,
				"password": passnum
			},
			headers: {
				"token": qz_token()
			},
			success: function(msg) {
				if (msg.status == 0) { //1绑定手机号成功   0 绑定手机号失败   -1验证码错误   其他 验证码超时
					friendlyMessage("绑定手机号成功", function() {
						location.reload();
					});
					//下面对更改个人资料部分特殊处理
					if (hrefs.indexOf("editbjzl.html") > -1) {
						$(".bindMobile .phone").removeClass("on");
						$(".bindMobile .phone").html(phonenum);
					}
				} else if (msg.status == 1) {
					warningMessage("绑定手机号失败");
				} else if (msg.status == -1) {
					warningMessage("验证码错误");
				} else if (msg.status == -2) {
					warningMessage("手机号已使用，不能绑定");
				} else if (msg.status == -3) {
					getToken();
				} else {
					warningMessage("验证码超时");
				}
			},
			error: function() {
				console.log("error");
			}
		});


	});

	//键盘回车提交
	$("body,html").keydown(function(e) {
		var curKey = e ? e.keyCode : e.which;
		if (curKey == 13) {
			if (!$(".bg_mask").is(":hidden") && !$(".viewbindPhone").is(":hidden")) {
				$(".bindinputLogin input").blur();
				$(".bindclickLogin").click();
				return false;
			}
		}
	});

}

//首页发帖有焦点时候

$(document).on("focus", "#FaceBoxText", function(event) {
	$(this).attr('placeholder', '');
	event.stopPropagation();
})
$(document).on("blur", "#FaceBoxText", function(event) {
	if ($(this).val() == '') {
		$(this).attr('placeholder', '此时此刻想跟大家说点什么');
	}
	event.stopPropagation();
})

function Base64() {
	// private property 
	_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

	// public method for encoding 
	this.encode = function(input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		input = _utf8_encode(input);
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
			output = output +
				_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
				_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	}

	// public method for decoding 
	this.decode = function(input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = _keyStr.indexOf(input.charAt(i++));
			enc2 = _keyStr.indexOf(input.charAt(i++));
			enc3 = _keyStr.indexOf(input.charAt(i++));
			enc4 = _keyStr.indexOf(input.charAt(i++));
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			output = output + String.fromCharCode(chr1);
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
		}
		output = _utf8_decode(output);
		return output;
	}

	// private method for UTF-8 encoding 
	_utf8_encode = function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";
		for (var n = 0; n < string.length; n++) {
			var c = string.charCodeAt(n);
			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}
		return utftext;
	}

	// private method for UTF-8 decoding 
	_utf8_decode = function(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
		while (i < utftext.length) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}
}

//获取蜜蜜
function getmimi2(datass, base) {
	$.ajax({
		type: "get",
		url: serviceHOST() + "/user/findCommandByusername.do",
		data: datass,
		headers: {
			"token": qz_token()
		},
		success: function(msg) {
			if (msg.status == 0) {
				var msgs = msg.data;
				var pas = msgs.substr(msgs.length - 1, 1);
				var subpas = msgs.substr(pas);
				var aas=subpas.substr(0,subpas.length-1);
				var result = base.encode(aas);
				setCookie("xmpp_key", result, 24 * 60); //存储密
				friendlyMessage("登录成功", function() {
					window.location.href = "/center/index.html";
				});
			} else if (msg.status == -1) {
				warningMessage("登录失败，请重新登录", function() {
					window.location.href = "www.quanzinet.com/index.html";
				});
			} else if (msg.status == -3) {
				getToken();
			};
		},
		error: function() {
			console.log("errror");
		}
	});
}


//将页面的恶意html js代码转义输出    普通字符转换成转义符

function html2Escape(sHtml){
	if(sHtml) return sHtml.replace(/[<>&"]/g,function(c){ return  {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});
}

//删除圈子聊天室接口，供修改职业圈的updateJobStreeByCodes.do接口返回成功调用   ，修改职业圈成功后删除聊天室
function moveChatroom(roomName) {
	var params = {
		username: getCookie("username"),
		roomname: roomName
	};
	var str = $.param(params);
	$.ajax({
		type: "DELETE",
		url: RestfulHOST() + "/mucgroup/member?" + str,
		dataType: "json",
		headers: {
			"Authorization": "AQAa5HjfUNgCr27x"
		},
		success: function(msgs) {
			if (msgs.status == 0) {
				console.log("1")
			} 
		},
		error: function() {
			console.log("error");
		}
	})
}


//屏蔽用户名手机号中间四位
function shieldNumber(username){
	var pattern = /^1[34578]\d{9}$/;
	if(username.indexOf("@")) username = username.split("@")[0];
	if (pattern.test(username) == true) {
		return username.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'); //屏蔽手机号中间四位
	}else{
		if (username.length > 14) {
			return username.substr(0, 14) + "...";
		} else {
			return username;
		}	
	}
}


//使用二维码登录     
//创建登录二维码     获取二维码图片
	function createloginQrode() {
		$.ajax({
			type: "post",
			url: serHOST()+"/webqrcodel/createloginQrcode.do",
			success: function(msg) {
				var jsons = JSON.parse(msg);
				//console.log(jsons)
				if (jsons.status == 0) {
					im.localLoadingOff(".qrodeImg")
					var imgSrc = serHOST()+"/img/" + jsons.data.qrcodeImage;
					setCookie("qrodeNo", jsons.data.qrcodeNo);
//					$(".qrodeImg img").attr("src", imgSrc);
					$(".qrodeImg").html('<img src="'+imgSrc+'"/>');
				}
			},
			error: function() {
				console.log('error');
			}
		});
	};
	
var loadXML = function(xmlString){        //解析后台返回的xml字符串函数       加入解除黑名单
        var xmlDoc=null;
        //判断浏览器的类型
        //支持IE浏览器 
        if(!window.DOMParser && window.ActiveXObject){   //window.DOMParser 判断是否是非ie浏览器
            var xmlDomVersions = ['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];
            for(var i=0;i<xmlDomVersions.length;i++){
                try{
                    xmlDoc = new ActiveXObject(xmlDomVersions[i]);
                    xmlDoc.async = false;
                    xmlDoc.loadXML(xmlString); //loadXML方法载入xml字符串
                    break;
                }catch(e){
                }
            }
        }
        //支持Mozilla浏览器
        else if(window.DOMParser && document.implementation && document.implementation.createDocument){
            try{
                /* DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
                 * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
                 * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
                 * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
                 */
                domParser = new  DOMParser();
                xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
            }catch(e){
            }
        }
        else{
            return null;
        }

        return xmlDoc;
    }
