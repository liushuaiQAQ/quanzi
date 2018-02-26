/*生活圈的公共部分*/
var code = getURIArgs('code');
var cache = getCatetory();
var page = 1;
//生活圈推荐同类视频
function similarVideo(datas) {
	var str = "";
	$.ajax({
		type: "post",
		url: serviceHOST() + "/videoMaterial/recommendVideoByCircle.do",
		data: datas,
		headers: {
			"token": qz_token()
		},
		success: function(msg) {
			if (msg.status == 0) {
				var dataLen = msg.data;
				if (dataLen.length == 0) {
					str = '暂无视频推荐';
					$(".vBox").html(str);
					$(".recommon_video .recommon_head a").hide();
					$(".vBox").css({
						"text-align": "center",
						"line-height": "50px"
					})
				} else if (dataLen.length == 1) {
					$(".suggestedVideoBox").hide();
					var visites = (Math.round((dataLen[0].visites / 10000) * 100) / 100).toFixed(1);
					str = '<a class="video1" href="/center/videodetail.html?id=' + dataLen[0].id + '">' +
						'<img src="' + dataLen[0].vpicurl + '" />' +
						'<span class="playBtn"></span>' +
						'<div class="personTime clearfix">' +
						'<span class="person">' + visites + '万</span>' +
						//              			<span class="time">03:12</span>
						'</div>' +
						'</a>'
					$(".listVideo").html(str)
				} else if (dataLen.length == 2) {
					$(".listVideo").hide();
					for (var i = 0; i < dataLen.length; i++) {
						var visites = (Math.round((dataLen[i].visites / 10000) * 100) / 100).toFixed(1);
						str += '<a class="video2" href="/center/videodetail.html?id=' + dataLen[i].id + '">' +
							'<img src="' + dataLen[i].vpicurl + '"/>' +
							'<div class="personTime clearfix">' +
							'<span class="person">' + visites + '万</span>' +
							//'<span class="time">03:12</span>'+
							'</div>' +
							'</a>';
					}
					$(".suggestedVideoBox").html(str);
				} else if (dataLen.length > 2) {
					var visites1 = (Math.round((dataLen[0].visites / 10000) * 100) / 100).toFixed(1);
					var visites2 = (Math.round((dataLen[1].visites / 10000) * 100) / 100).toFixed(1);
					var visites3 = (Math.round((dataLen[2].visites / 10000) * 100) / 100).toFixed(1);
					str += '<div class="listVideo">' +
						'<a class="video1" href="/center/videodetail.html?id=' + dataLen[0].id + '">' +
						'<img src="' + dataLen[0].vpicurl + '"/>' +
						'<span class="playBtn"></span>' +
						'<div class="personTime clearfix">' +
						'<span class="person">' + visites1 + '万</span>' +
						//	                			'<span class="time">03:12</span>'+
						'</div>' +
						'</a>' +
						'</div>' +
						'<div class="suggestedVideoBox clearfix">' +
						'<a class="video2" href="/center/videodetail.html?id=' + dataLen[1].id + '">' +
						'<img src="' + dataLen[1].vpicurl + '"/>' +
						'<div class="personTime clearfix">' +
						'<span class="person">' + visites2 + '万</span>' +
						//'<span class="time">03:12</span>'+
						'</div>' +
						'</a>' +
						'<a class="video3" href="/center/videodetail.html?id=' + dataLen[2].id + '">' +
						'<img src="' + dataLen[2].vpicurl + '"/>' +
						'<div class="personTime clearfix">' +
						'<span class="person">' + visites3 + '万</span>' +
						//'<span class="time">03:12</span>'+
						'</div>' +
						'</a>' +
						'</div>';
					$(".vBox").html(str)
				}
			} else if (msg.status == -3) {
				getToken();
			};
		},
		error: function() {
			console.log("err");
		}
	});
}

similarVideo({
	ciecleNo: code,
	category: 3, //分类1-职业圈帖子；2-全球圈帖子；3-生活圈帖子
	pageNum: 1,
	pageSize: 3
})