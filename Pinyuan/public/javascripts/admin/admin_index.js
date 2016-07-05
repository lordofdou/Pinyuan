$(document).ready(function(){

	//自动聚焦用户名input
	$('#username').focus();
	$('#loginButton').click(function(){

		//用户名密码验证
		var username = $('#username').val();
		var password = $('#password').val();

		 if(username.length == 0 || password.length == 0){
		 	$('.alert-danger').show();
			document.getElementById("u_error_info").innerHTML="用户名和密码不能为空";
		 	return false;
		 }
		 $('#loginForm').submit();
	});

	//回车键登录
	document.onkeydown = function(e){ 
	    var ev = document.all ? window.event : e;
	    if(ev.keyCode==13) {
	           $('#loginButton').click();
	     }
	}
});