$(function(){
	
	//提交反馈
	$(".submit button").on('click',function(){
		var conTextarea=$.trim(html2Escape($(".question textarea").val()));
		var phoneBox=$.trim(html2Escape($(".telephone input").val()));
		
		if(conTextarea==""){
//			$(".conTit").show();
//			$(".conTit span").html("请输入反馈");
//			setTimeout(function(){
//				$(".conTit").hide()
//			},1000)
			warningMessage("请输入反馈问题");
			return false;
		}
		if(phoneBox!=""&&!(/^1[34578]\d{9}$/.test(phoneBox))){
//			$(".conTit").show();
//			$(".conTit span").html("手机号码有误,请重填");
//			setTimeout(function(){
//				$(".conTit").hide()
//			},1000)
			warningMessage("手机号有误，请重填");
			return false;
		}
		$.ajax({
			type:"post",
			url:serHOST()+"/feedback/addFeedBack.do",
			data:{
				"magicno":getCookie("magicnos"),
				"content":conTextarea,
				"mobile":phoneBox
			},
			dataType:"json",
			success:function(msg){
				if(msg.status==0){
					$(".question textarea").val("");
					$(".telephone input").val("");
					$("#numkq").html("0")
//					$(".conTit").find("span").addClass("on").html("问题已提交成功!");
//					$(".conTit").show();
//					setTimeout(function(){
//						$(".conTit").hide();
//					},1000)
				friendlyMessage("提交成功");
				}
			},
			error:function(){
				console.log("error")
			}
		});
	})
	
	//判断字数
	$(".edit_question").on("keyup",function(){
		checkLengths($(this),'200',"#numkq")
	})
})

