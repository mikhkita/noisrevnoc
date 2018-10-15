$(document).ready(function(){	
   
    var type = getCookie("type");

    if( type == "b" || type == "m" ){
    	window.location.href = $(".b-btn-choose[data-type='"+type+"']").attr("data-href");
    }
   
    $(".b-btn-choose").click(function(){
        setCookie("type", $(this).attr("data-type"), { expires : 94608000, path : "/" });

        window.location.href = $(this).attr("data-href");

        return false;
    });

});