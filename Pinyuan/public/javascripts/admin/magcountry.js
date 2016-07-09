/**$(document).ready(function(){
	
	
);**/

$(document).ready(function(){
	
	$('.btn-cou').click(function(){	
		$('#myModalLabel').html('添加村庄');
		$("#labelcountry").html("村庄名");			
	})
	$('.btnxz').click(function(){	
		$('#myModalLabel').html('添加乡镇');
		$("#labelcountry").html("乡镇名");
	})
	var townid;
	$('.addvillage').click(function(){
		// window.location.href="/admin_region/add?name="+$('#inputEmail3').val()+
		// 					 "&super="+$(this).attr('super');
		townid = $(this).attr('super');
		// alert($('#inputEmail3').val()+"&super="+$(this).attr('super'));
	});

	$('#addtown').click(function(){	
		if($("#labelcountry").html() == "乡镇名"){
			window.location.href="/admin_region/add?name="+$('#inputEmail3').val();
		} else {
			window.location.href="/admin_region/add?name="+$('#inputEmail3').val()+
							 "&super="+townid;
		}
		
	});

	$('#deltown').click(function(){
		var value = $('select[name="regionid"]').val();
		window.location.href = "/admin_region/delete?id=" + value;
	});
	
});
		


