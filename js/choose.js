$(document).ready(function(){	
   
    $(".b-btn-choose").click(function(){
        setCookie("type", $(this).attr("data-type"), { expires : 94608000, path : "/" });

        window.location.href = $(this).attr("data-href");

        return false;
    });

});