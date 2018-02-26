$(function() {
	var _username = getCookie('username');
	var pages = getURIArgs('pageno');
	//获取个人信息
	findUserInformation(_username, _username);
	//可能认识的人
	recommendRosters(_username);
	// $(".no_publish").show();
	getQuestionList(_username)



	function getQuestionList(username) {
		var str = "";
		var pagenum = (getURIArgs('pageno') || 1)
		$.ajax({
			type: "get",
			url: serviceHOST() + "/question/findQuestionByUsername.do",
			dataType: "json",
			headers: {
				"token": qz_token()
			},
			data: {
				username: username,
				pageNum: pagenum
			},
			success: function(msg) {
				if (msg.status == 0) {
					var str = '';
					$('.jiazai').remove();
					if (msg.data.questionList.length == 0) {
						$(".no_publish").show();
					} else {
						for (var i = 0; i < msg.data.questionList.length; i++) {
							var mssg = msg.data.questionList[i];
							str += '<li data-quesno="' + mssg.questionNo + '">\
								<p><a href="/center/zhiye/wentixq.html?qno=' + mssg.questionNo + '&code=' + mssg.code + '">' + mssg.title + '</a></p>\
							<div class="questionFrom">\
								<span>来自职业圈</span>\
								<span>|</span>\
								<span>' + mssg.fromtheme + '</span>\
								</div>\
								<div class="questionInfo">\
								<span>' + mssg.answercount + '人回答</span>\
							<span>' + mssg.followcount + '人关注</span>\
							</div>\
							</li>';
						}
						$('.questionBox').html(str);
						var pageStr = printPage({
							pageNo: getURIArgs('pageno') || 1,
							pageSize: 10,
							dataSum: msg.data.total
						});
						$(".page").empty().append(pageStr);
					}
				}else if(msg.status==-3){
					getToken();
				};
			},
			error: function() {
				console.log("error")
			}
		})
	};

	$(document).on('click', '#page>a', function() {
		var pageNo = $(this).attr('pageno');
		window.location.href = '/center/me/wenti.html?pageno=' + pageNo;
	})



})