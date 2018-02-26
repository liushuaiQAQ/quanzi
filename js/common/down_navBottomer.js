$(function() {
	if (getCookie("username")) {
		$(".headss").load("/html/header.html");
		$(".footerss").load("/html/bottomer.html");
		$(".Addressbook_box").load("/html/AddressBook.html", function() {

			$(".rightRecommondFriends .recmdList").css("height", $(window).height() - 206);
			$(".rightRecommondFriends .SearchResults").css("height", $(window).height() - 130);
			$(".AddressBook").css("height", $(window).height() - 130);
			$(".AddressBook .CommunicationsGroup,.AddressBook .addressContent .SearchResults").css("height", $(window).height() - 130);

			//浏览器窗口变化
			WindowAdjustment();


			/*var oDiv = document.getElementById('textBox');
			oDiv.ondragover = function(ev) {
				ev.preventDefault();
			}
			oDiv.ondrop = function(ev) {
				ev.preventDefault();
				var fs = ev.dataTransfer.files;
				for (var i = 0; i < fs.length; i++) {
					if (fs[i].type.indexOf('image') != -1) { //利用返回的type属性值字符串包含image来判断文件类型
						var fd = new FileReader(); //读取文件信息
						fd.readAsDataURL(fs[i]); //参数为读取的文件对象，将文件读取为DataURL
						fd.onload = function() { //当读取文件成功完成的时候触onload事件
							sendDrgImg(this.result);
						}
					} else {
						alert('请上传图片类型！');
					}
				}
			}*/

			// 回车搜索
			$("#Communications").click(function() {
				var act = $(document.activeElement).attr("id")
				if (act == "Communications") {
					$("#Communications").on("keyup", function(e) {
						var code = (e ? e.keyCode : e.which);
						if (code == 13) {
							$(".CommunicationsSearch .searchOn").click();
							return false;
						};
					});
				}
			});
			$("#searching").click(function() {
				var act = $(document.activeElement).attr("id");
				if (act == "searching") {
					$("#searching").on("keyup", function(e) {
						var code = (e ? e.keyCode : e.which);
						if (code == 13) {
							$(".rightRecommondFriends .searchOn").click();
							return false;
						};
					});
				}
			});

		});

	} else {
		$(".headss").load("/html/nloginh.html");
		$(".footerss").load("/html/nologin_bottomer.html");
		$(".Addressbook_box").load("/html/pushMessage.html", function() {
			$(".ChatContent").css("height", $(window).height() - 189);
		});
	}


	if (getCookie("username")) {
		$(".left_sideBar").load("/html/center_left.html");
		$(".right_sideBar").load("/html/center_rightPerson.html", function() {
			var h = $(".right_sideBar").height();
			rightH(h);
		});
	} else {
		$(".left_sideBar").load("/html/nologin_leftBar.html");
		$(".right_sideBar").load("/html/index_rightLogin.html", function() {
			var h = $(".right_sideBar").height();
			rightH(h);
		});
	}


})