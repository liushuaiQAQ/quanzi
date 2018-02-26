$(function() {
	codeTab(); 
	//字母点击查询
	$(document).on('click', '.areaBox a', function() {
		if($(this).hasClass("borderActive")) {
			return;
		}
		$('.areaBox a').removeClass('borderActive');
		$(this).addClass('borderActive');
		codeTab();

	});
	//点击城市切换
	$(document).on("click",".hotCity li,.area ul li,.searchCon a",function(){
		changeEvent($(this).attr("data-city"))
		
	})
    //点击打开和关闭tab
    $(".change_btn").click(function(){
    	$(".city_box,#maskss").show();
    })
    $(".cityClose").click(function(){
    	$(".city_box,#maskss").hide();
    })
	//搜索城市
	$(".searchCity .searchbox input").bind('input propertychange', function() {
		var flag = false;
		var str = ""
		var keyword = html2Escape($(this).val());
		if(keyword == "") {
			$(".searchCon").hide();
			$(".searchCon").html("");
		} else {
			$(".searchCon").show();
			for(var n in globalArea) {
				var zgcountry = globalArea[n].children; //查找中国 城市
				if(n == 0) {
					for(var i in zgcountry) {
						var cityN = zgcountry[i].children;
						for(var j in cityN) {
							var hans = cityN[j].han;
							if(hans != "") {
								if(cityN[j].name.indexOf(keyword) > -1) {
									flag = true;
									str += '<a  href="javascript:;" data-city="'+cityN[j].name+'">' + cityN[j].name + '</a>';
								}
							}
						}
					}
				} else if(n > 0) { //查找除中国外的国家
					var cityN = zgcountry[0];
					if(cityN.pname.indexOf(keyword) > -1) {
						flag = true;
						str += '<a data-id="' + cityN.pid + '" href="/center/qqqlist.html?dataid=' + cityN.pid + '&conName=' + cityN.pname + '&type=2">' + cityN.pname + '</a>';
					}
				}

			}
			if(flag == true) {
				$(".searchCon").html(str);
			} else {
				var strs = '<a class="nodata" href="javascript:;">无符合的搜索结果</a>';
				$(".searchCon").html(strs);
			}

		}
	});
	
	$(".searchbox a").click(function(){
		var val=$.trim($(".searchbox input").val());
		if(!val){
			warningMessage("请输入您要搜索城市的名称");
			return ;
		}
		var arrCity=globalArea[0].children;
		var flag=false;
		for(var i in arrCity) {
			if(arrCity[i].children.length > 0) {
				var courName = arrCity[i].children;
				for(var j in courName) {
					if(courName[j].name==val){
						flag=true;
						changeEvent(val);
					}
				}
			}
		}
		if(!flag){
		    warningMessage("对不起，没有找到该城市！");
		}
	})
})

function codeTab() {
	var arrClassify = [];
	var arrCity = globalArea[0].children;
	var codeArr = $(".borderActive").html().split("");
	for(var i in arrCity) {
		if(arrCity[i].children.length > 0) {
			var courName = arrCity[i].children;
			for(var j in courName) {
				var han = courName[j].han;
				for(var n = 0; n < codeArr.length; n++) {
					if(han == codeArr[n].toLocaleLowerCase()) {
						arrClassify[n] = arrClassify[n] || "";
						arrClassify[n] += courName[j].name + ",";
					}
				}
			}
		}
	}
	var str = "";
	for(var i = 0; i < arrClassify.length; i++) {
		if(arrClassify[i]) {
			str += "<li>" +
				"<h4>" + codeArr[i] + "</h4>" +
				"<ul>";
			var data = arrClassify[i].substring(0, arrClassify[i].length - 1).split(",");
			for(var j = 0; j < data.length; j++) {
				str += "<li data-city='"+data[j]+"'>" + data[j] + "</li>"
			}
			str += "</ul>" +
				"</li>"
		}

	}
	$(".area").html(str);
}

function changeEvent(val){
	setCookie("locationName",val,24 * 60);
	$(".city_box,#maskss").hide();
	window.location.href=location.href.split(".html")[0]+".html";
}
