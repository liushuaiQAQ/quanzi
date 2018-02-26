/*
 @ 文本框插入表情插件
 @ 作者：水墨寒 Smohan.net
 @ 日期：2013年1月28日
*/
function smohanfacebox(_this,divid,textid) {
	var $facepic = $("#SmohanFaceBox li img");
	var context = divid[0].className;
	//先删除在创建
	$("#SmohanFaceBox").remove();
	//创建表情框
	var faceimg = '';
	for (var i in smohanFace) { //通过循环创建105个表情，可扩展
		faceimg += '<li><a title="' + smohanFace[i].substring(1, smohanFace[i].length - 1) + '" href="javascript:void(0)"><img src="/img/face/' + i + '@2x.png" face="' + smohanFace[i] + '"/></a></li>';
	};
	divid.prepend("<div id='SmohanFaceBox'><span class='Corner'></span><div class='Content'><h3><span>常用表情</span><a class='close' title='关闭'></a></h3><ul>" + faceimg + "</ul></div></div>");
	$('#SmohanFaceBox').css("display", 'none'); //创建完成后先将其隐藏
	//创建表情框结束
	if (context == "allFace") {
		$('.Corner').hide();
		$('#SmohanFaceBox').css({
			'top': '-284px',
			'left': '-129px'
		})
	}
	if ($('#SmohanFaceBox').is(":hidden")) {
		$('#SmohanFaceBox').show(500);
		_this.addClass('in');
	} else {
		$('#SmohanFaceBox').hide(500);
		_this.removeClass('in');
	}


	//插入表情
	$(document).off("click", "#SmohanFaceBox li img");
	$(document).on("click", "#SmohanFaceBox li img", function() {
		$("#" + textid).die();
		$("#" + textid).insertContent($(this).attr("face"), '', $("#" + textid).die());
		if (textid == "textArea_01") {
			checkNum($("#" + textid), '140', "#num_01");
		} else if (textid == "textArea_02") {
			checkNum($("#" + textid), '140', "#num_02");
		}else if (textid == "textArea_04") {
			checkNum($("#" + textid), '140', "#num_04");
		}
		_this.removeClass('in');

		// 插入表情  字数改变
		if (textid == 'FaceBoxText') {
			checkNum($("#FaceBoxText"), '2000', ".limit_num");
		}
	});

	//关闭表情层
	$(document).on("click", '#SmohanFaceBox h3 a.close', function() {
		$('#SmohanFaceBox').hide(500, function() {
			_this.removeClass('in');
			$("#SmohanFaceBox").remove();

		});

	});

	//当鼠标移开时，隐藏表情层，如果不需要，可注释掉
	$(document).on("mouseleave", '#SmohanFaceBox', function() {
		$('#SmohanFaceBox').hide(600, function() {
			_this.removeClass('in');
			$("#SmohanFaceBox").remove();
		});

	});

}

// 【漫画】 光标定位插件
$.fn.extend({
	insertContent: function(myValue, t) {
		var $t = $(this)[0];
		if (document.selection) {
			this.focus();
			var sel = document.selection.createRange();
			sel.text = myValue;
			this.focus();
			sel.moveStart('character', -l);
			var wee = sel.text.length;
			if (arguments.length == 2) {
				var l = $t.value.length;
				sel.moveEnd("character", wee + t);
				t <= 0 ? sel.moveStart("character", wee - 2 * t - myValue.length) : sel.moveStart("character", wee - t - myValue.length);
				sel.select();
			}
		} else if ($t.selectionStart || $t.selectionStart == '0') {
			var startPos = $t.selectionStart;
			var endPos = $t.selectionEnd;
			var scrollTop = $t.scrollTop;
			$t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
			this.focus();
			$t.selectionStart = startPos + myValue.length;
			$t.selectionEnd = startPos + myValue.length;
			$t.scrollTop = scrollTop;
			if (arguments.length == 2) {
				$t.setSelectionRange(startPos - t, $t.selectionEnd + t);
				this.focus();
			}
		} else {
			this.value += myValue;
			this.focus();
		}
	}
});

//表情解析
$.fn.extend({
	replaceface: function(faces) {
		for (i = 0; i < 105; i++) {
			faces = faces.replace('<emt>' + (i + 1) + '</emt>', '<img src="/img/face2/' + (i + 1) + '.gif">');
		}
		$(this).html(faces);
	}
});