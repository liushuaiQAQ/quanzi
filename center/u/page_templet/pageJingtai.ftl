<!--#include virtual="/html/doctype.html"-->
<title>陌生人主页-圈子</title>
<!--#include virtual="/html/mate.html"-->
<link rel="stylesheet" type="text/css" href="/css/center/index/index.css" />
<link rel="stylesheet" type="text/css" href="/css/center/index/triends.css"/>
<link rel="stylesheet" type="text/css" href="/css/center/personalHomepage/personalHomepage.css"/>
<link rel="stylesheet" type="text/css" href="/css/center/strangeHomepage/strangeHomepage.css"/>
<script type="text/javascript" src="/js/center/index/index.js"></script>
<script type="text/javascript" src="/js/center/strangeHomepage/strangeHomepage.js"></script>
<script type="text/javascript" src="/js/center/strangeHomepage/strange_common.js"></script>
</head>
<body>
	<!--顶部导航容器，区分登录和未登录的头部开始-->
	<div class="headss"></div>
	<!--顶部导航容器，区分登录和未登录的头部end-->
	<div class="homepage_main">
		<div class="homepage_top">
			${msg.data.imgforuserbglist}<!--1背景图像-->
			<!--if ("${msg.data.imgforuserbglist}".length == 0) {
				<div class="user_bj" style="width: 100%;height: 100%;background-size:100%;background: url("/img/strangedefault.png") no-repeat;"></div>
			} else {
				<div class="user_bj" style="width: 100%;height: 100%;background-size:100%;background: url("${msg.data.imgforuserbglist[0].imagepath}") no-repeat;"></div>
			};-->

			<div class="nav" id="strangeNav">
				<ul>
					<!--下面主页新增主页动态数量-->
					<li style=""><a href="javascript:;" class="nav_active">动态<span class="dynamic_num">${msg.data.topictotal}</span></a></li>
					<!--***************************xxxbegin*****************************-->
					<li><a href="javascript:;">Ta的圈子<span class="circle_num">${msg.data.myjoinedcirclecnt}</span></a></li>
					<!--***************************xxxend*****************************-->
					<li><a href="javascript:;">Ta发布的&nbsp;<span class="release_num"></span></a></li>

				</ul>
			</div>
			<div class="personal_info">
				
					<!--<img src="/img/first.png">-->
					${msg.data.imgforheadlist}<!--2图像-->
					<!--if ("${msg.data.imgforheadlist}".length == 0) {
						<a href="javascript:;" class="userImg"><img src="/img/first.png"></a>
					}else{
						<a href="javascript:;" class="userImg"><img src="${msg.data.imgforuserbglist[0].imagepath}"></a>
					}-->

				<dl>
					<dd class="personal_title">
						${msg.data.followingcnt}<!--3-->
						<!--<span class="personal_nikename" data-guanzhu="${msg.data.followingcnt}" data-funs="${msg.data.followercnt}">${msg.data.nickname}</span>-->

				 		${msg.data.sex}<!--4-->
						<!--if ("${msg.data.sex}"== '女') {
							<i class="sex" style="background:url("/img/women_img.png") center center no-repeat #ff7cb6;"></i>
							<i class="level" style="background: url("/img/h/sj_gril_${msg.data.level}.png") 0 bottom no-repeat;background-size: 35px 14px"></i>
						}else{
							<i class="sex" style="background:url("/img/men_img.png") center center no-repeat #ff7cb6;"></i>
							<i class="level" style="background: url("/img/h/sj_boy_${msg.data.level}.png") 0 bottom no-repeat;background-size: 35px 14px"></i>
						}-->
						
						
						${msg.data.viplevel}<!--5-->
						<!--if (${msg.data.viplevel} != 0) {
							<i class="viplevel" style="background: url("/img/h/sj_VIP_${msg.data.viplevel}.png") center center no-repeat;backgroundSize:35px 14px;"></i>
						}-->
						
					</dd>

					<dd>
						<span style="float: left;">圈子号:</span>
						<span class="personal_code" style="float: left;margin-right: 30px;">${msg.data.magicno}<!--6--></span>
						${msg.data.realindustry}<!--7-->
						<!--if("${msg.data.realindustry}"==""){
							<span class="job" style="float: left;">未设置</span>
						}else{
							 下面这个需截取字符串 ，只保留前九位
							<span class="job" style="float: left;">${msg.data.realindustry}</span>    
						}-->
						
						
						${msg.data.certificateStatus}<!--8-->
						<!--if (${msg.data.certificateStatus} == 0 || ${msg.data.certificateStatus} == -1) {
							<span class="pass" style="background: url("/img/zy_renzhengtishi.png") 0 center no-repeat;float: left;margin-right: 5px;></span>
							<span style="color:#ccc">未认证</span>
						}else if(${msg.data.certificateStatus} == 1 || ${msg.data.certificateStatus} == 3) {
							<span class="pass" style="background: url("/img/zy_renzhengtishi.png") 0 center no-repeat;float: left;margin-right: 5px;></span>
							<span style="color:#ccc">认证中</span>
						}else{
							<span class="pass"></span>
							<span class="identification"></span>
						}-->
						
						<div class="clear"></div>
					</dd>
					<dd class="remark" style="display: none;">
						昵称：<span class="remark_nikename"></span>
					</dd>
					<dd class="sign"></dd>
				</dl>
				<div class="personal_like">
					<ul>
						<li class="like_guanzhu">
							${msg.data.isfollowing}<!--9-->
							<!--if (${msg.data.isfollowing} == 0) {
								<a href="javascript:;" class="concern" data-status="0"><i></i>关注</a>
							}else{
								<a href="javascript:;" class="concern" data-status="1"><i style="background: url("/img/duihao1.png") center center no-repeat"></i>已关注</a>
								<p class="personal_cancel">取消关注</p>
							}-->
						</li>
						<li class="like_message" data-off="0">
							<a href="javascript:;"><i class="personal_message"></i>消息</a>
						</li>
						<li class="like_addfriend">
							${msg.data.relation} <!--10-->
							<!--if (${msg.data.relation} == 0) {
								<a href="javascript:;" class="friendStatus friendBtn" data-relation='${msg.data.relation}'>已请求</a>
							}else if (${msg.data.relation} == 3 || ${msg.data.relation} == 1 || ${msg.data.relation} == 2) {
								<a href="javascript:;" class="friendStatus friendBtn" data-relation='${msg.data.relation}'><i style="background-image: url("/img/duihao1.png")"></i>好友</a>								
							} else if (${msg.data.relation} == 4) {
								<a href="javascript:;" class="friendStatus friendBtn" data-relation='${msg.data.relation}'>对方已拒绝</a>
							} else {
								<a href="javascript:;" class="friendStatus friendBtn" data-relation='${msg.data.relation}'><i class="personal_jiahaoyou"></i>加为好友</a>
							};	
							<div class="remove_friend">删除好友</div>
							<div class="cancel_more" style="display: none;">
								if (${msg.data.relation} == 3 || ${msg.data.relation} == 1 || ${msg.data.relation} == 2) {
									<p class="setting_remark">确认请求</p><p class="recommend_friends">删除请求</p>
								}
							</div>-->
						</li>
						<li class="like_more">
							<a href="javascript:;"><i class="personal_sanheng"></i></a>
							<div class="cancel_more">
								${msg.data.relation-2}<!--11-->
								<!--if (${msg.data.relation} == 3 || ${msg.data.relation} == 1 || ${msg.data.relation} == 2) {
									<p class="setting_remark">设置备注名</p>
									<p class="recommend_friends">推荐好友给TA</p>
								}-->
								<p class="set_Blacklist">拉黑</p>
								<p class="complain">投诉</p>
							</div>
						</li>
					</ul>
				</div>
				<div class="clear"></div>
			</div>
		</div>
		<div class="homepage_bottom">
			<!-- <div id="slider_bar_fixed" style="width: 300px;"></div> -->
			<div class="homepage_left">
				<!--#include virtual="/center/u/hisFoucsFuns.html"-->
				<div class="personal_data">
					<ul>
						<li class="lawchat_logo">
							<i class="logo"></i>
							<span>圈子号</span>
							<span class="personal_code" style="float: left;">${msg.data.magicno-2}<!--19--></span>
						</li>
						<li class="personal_job">
							<i class="logo"></i>
							<span>职位</span>
							${msg.data.realindustry-15}<!--15-->
							<!--if("${msg.data.realindustry}"==""){
								<span class="job" style="float: left;">未设置</span>
							}else{
								<span class="job" style="float: left;">${msg.data.realindustry}</span>        //截取字符串 ，只保留前九位
							}-->
							
							${msg.data.certificateStatus-21}<!--21-->
						</li>
						<li class="personal_pros">
							<i class="logo"></i>
							<span>职业圈</span>
							<span class="myindustry">${msg.data.myindustry}<!--16--></span>
						</li> 
						<li class="personal_hometown">
							<i class="logo"></i>
							<span>地区</span>
							${msg.data.hometown}<!--17-->
							<!--if ("${msg.data.hometown}" == '') {
								<span class="homeTown">未设置</span>
							}else{
								按照上面的注释内容截取
								<span class="homeTown">${msg.data.hometown}</span>
							}-->
						</li>
						<li class="personal_tel">
							<i class="logo"></i>
							<span>手机号</span>
							${msg.data.mobiles}<!--18-->
							<!--if (${msg.data.mobiles} == '') {
								<span class="tel">未设置</span>
							}else{
								<span class="tel">${msg.data.mobiles}</span>
							}-->
							
						</li>
					</ul>
					<div class="signature">
						<span><i class="logo" style="height: 14px;"></i>签名</span>
						<p class="sign">${msg.data.sign}<!--20--></p>
						<div class="clear"></div>
					</div>
				</div>
				<!--左侧推荐start-->
				<div class="recommend">
				    <p><i>可能认识</i><a href="javascript:;">查看更多</a>
				 
				    </p>
				    <div class="clear"></div>
					    <ul>
					       
					    </ul>
				    <div class="clear"></div>
				</div>
				<!--左侧推荐end-->

		</div>
		<div class="personal_right">
			<div class="jiazai"><i class="loading"></i>正在加载中，请稍后</div>
			
			<div class="no_publish">
				<div class="noPublishBox">
					<img src="/img/nopublish.png">
					<p>此人尚未发布过动态哦</p>
				</div>
			</div>
		</div>
		<br class="clear"/>
	</div>
	</div>
	<!--底部start-->
	<div class="footerss"></div>
	<!--底部end-->
	<!--遮盖弹窗-->
	<div class="addFriend" style="display: none">
		<div class="addWrap" style="">
			<p class="addTitle">添加朋友</p>
			<p>请输入验证信息</p>
			<textarea class="addInformation"></textarea>
			<div class="addInfo">你需要发送验证请求，对方通知后你才能添加其为好友</div>
			<div class="confirm">
				<button class="confirm_active">确定</button>
				<button class="confirm_cancel">取消</button>
			</div>
		</div>
		<div class="addConfirm" style="display: none;">
			<img src="/img/addFriend_success.png">
			<p>好友请求已发送</p>
		</div>
	</div>
	<!--转发分享圈子朋友圈  圈子好友   圈子群组开始-->
	<!--#include virtual="/html/dynamicSharing.html"-->
	<!--转发分享圈子朋友圈  圈子好友   圈子群组结束-->
	<!-- 通讯录 -->
	<div class="Addressbook_box"></div>
	<div id="mask"></div>
</body>
</html>
