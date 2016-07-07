/**$(document).ready(function(){
	
	
);**/

$(document).ready(function(){
	
	$('.btn-cou').click(function(){	
		$("#labelcountry").html("村庄名");			
	})
	$('.btnxz').click(function(){	
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
			// alert("/admin_region/add?name="+$('#inputEmail3').val()+
							 // "&super="+townid)

		}
		
	});
});
		


