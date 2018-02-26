var dragNum = true;
var getCss = function(o, key) {
	return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key];
};
var params = {
		left: 0,
		top: 0,
		currentX: 0,
		currentY: 0,
		flag: false
	};
var startDrag = function(bar, target,_this, callback) {
	
	/*var t = ($(window).height() - 590) / 2;
	var l = ($(window).width() - 800) / 2;
	params.left = l;
	params.top = t;*/
	bar.onmousedown = function(event) {
		dragNum = false;
		params.flag = true;
		if (!event) {
			event = window.event;
			bar.onselectstart = function() {
				return false;
			}
		}
		var e = event;
		params.currentX = e.clientX;
		params.currentY = e.clientY;
		//改变聊天窗口z-index
		$('.qzchat_frame').css({"zIndex":"0"});
		_this.css({"zIndex":"1"});
	};
	document.onmouseup = function() {
		params.flag = false;
		if (getCss(target, "left") !== "auto") {
			params.left = getCss(target, "left");
		}
		if (getCss(target, "top") !== "auto") {
			params.top = getCss(target, "top");
		}
		
		dragNum = true;
	};
	document.onmousemove = function(event) {
		var e = event ? event : window.event;
		if (params.flag) {
			var nowX = e.clientX,
				nowY = e.clientY;
			var disX = nowX - params.currentX,
				disY = nowY - params.currentY;
			var left = parseInt(params.left) + disX;
			var top = parseInt(params.top) + disY;

			// 262: 聊天框宽度   57 聊天框left 0 距离右侧距离57
			var window_W = $(window).width() - 262 - 57;
			var window_H = - $(window).height();
			if(left <= -window_W){
				left = -window_W;
			} else if (left >= 57) {
				left = 57;
			}

			if(top <= window_H){
				top = window_H;
			} else if (top >= -336) {     //336 聊天框高度
				top = -336;
			}

			target.style.left = left + "px";
			target.style.top = top + "px";
			bar.style.cursor = "move";

		}

		if (typeof callback == "function") {
			callback();
		}
		e.stopPropagation();
	}
};




