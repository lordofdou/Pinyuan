$(document).ready(function(){
	
	$('.glyphicon-trash').click(function(){
         // alert("nasdf");
        var flag=window.confirm("确定删除此用户吗？");
        if (flag) {

  		window.location.href = "/admin_dataman/delete?id="+$(this).attr('id');

        }else{
          return;
        }
      });

	$('#btn_add_user').click(function(){
		
		var username = $('#username').val();
		var password = $('#password').val();
		var password1 = $('#password1').val();
		if (username.trim().length == 0 || password.trim().length == 0 || password.trim().length == 0)
		 {
		 	alert('输入的内容不能为空');
		 }else if(password1!=password){
		 	alert('两次输入的密码不一致');

		 }else{
		 	var hash = $.md5(password);
			$('#password').val(hash);
			$('#add_user_form').submit();
		 }
			
	});



});