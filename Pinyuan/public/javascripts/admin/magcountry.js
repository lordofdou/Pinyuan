/**$(document).ready(function(){
	
	
);**/

$(document).ready(function(){
	
	$('.btn-cou').click(function(){	
		$("#labelcountry").html("村庄名");			
	})
	$('.btnxz').click(function(){	
		$("#labelcountry").html("乡镇名");
	})

	$('#addvillage').click(function(){
		window.location.href="/admin_region/add?name="+$('#inputEmail3').val()+
							 "&super="+$(this).attr('super');
	});

	$('#addtown').click(function(){	
		window.location.href="/admin_region/add?name="+$('#inputEmail3').val();
	});
});
		


