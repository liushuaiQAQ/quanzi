	var page = 1;
	var stop = false;
	$(window).scroll(function(event) {
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if (scrollTop + windowHeight + 130 >= scrollHeight) {
			if (stop == true) {
				stop = false;
				$(".bottom_left").append('<div class="Toloadmore"><img src="/img/loading.gif" /> 加载更多...</div>');
				page = page + 1;
				findAllQuestionList_qb(page,code);
			}

		}
	})



	//创建问题createQuestion
	$(document).on("click",".subBtn button", function() {
		var Category = $(".right_top .circle_name").attr("data-cate");
		if(UserName){
			createQuestion(Category);
		}else{
			$(".masks,.viewBox").show();
		}
	});

	//查询问题详情findQuestionByQuestionNo
	$(document).on("click", ".askItem p,.writeReply", function() {
		var Category = $(".right_top .circle_name").attr("data-cate");
		var qNo = $(this).parents(".askItem").attr("data-id");
		if(Category == 1){
			window.location.href = "/center/zhiye/wentixq.html?qno=" + qNo + '&code=' + code;	
		}else if(Category == 2){
			window.location.href = "/center/global/wentixq.html?qno=" + qNo + '&code=' + code;	
		}else{
			window.location.href = "/center/life/wentixq.html?qno=" + qNo + '&code=' + code;	
		}
	})


	//查询所有问题findAllQuestionList
	findAllQuestionList_qb(1,code); //全部
