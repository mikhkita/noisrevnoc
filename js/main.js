$(document).ready(function(){	
    function resize(){
       if( typeof( window.innerWidth ) == 'number' ) {
            myWidth = window.innerWidth;
            myHeight = window.innerHeight;
        } else if( document.documentElement && ( document.documentElement.clientWidth || 
        document.documentElement.clientHeight ) ) {
            myWidth = document.documentElement.clientWidth;
            myHeight = document.documentElement.clientHeight;
        } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
            myWidth = document.body.clientWidth;
            myHeight = document.body.clientHeight;
        }
    }
    $(window).resize(resize);
    resize();

    $.fn.placeholder = function() {
        if(typeof document.createElement("input").placeholder == 'undefined') {
            $('[placeholder]').focus(function() {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                    input.removeClass('placeholder');
                }
            }).blur(function() {
                var input = $(this);
                if (input.val() == '' || input.val() == input.attr('placeholder')) {
                    input.addClass('placeholder');
                    input.val(input.attr('placeholder'));
                }
            }).blur().parents('form').submit(function() {
                $(this).find('[placeholder]').each(function() {
                    var input = $(this);
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });
            });
        }
    }
    $.fn.placeholder();

    calcHeight();

    $(".b-atlant-slider").slick({
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        cssEase: 'ease', 
        speed: 500,
        arrows: false
    }); 

    $(".b-atlant-slider").on('beforeChange', function(event, slick, currentSlide, nextSlide){
        $(".b-adv-list").removeClass("open");
        calcHeight();
    });

    $(".b-show-adv-more").click(function(){
        var $list = $(this).parents(".b-adv-list");
        $list.toggleClass("open");

        calcHeight();

        return false;
    });

    function calcHeight(){
        $(".b-7 .b-adv").filter(function( index ) { return $(this).index() >= 3; }).each(function(){
            var $list = $(this).parents(".b-adv-list");

            if( !$(this).parents(".open").length ){
                $(this).css({
                    "margin-top" : -1 * ($(this).height() + 29)
                });
            }else{
                $(this).css({
                    "margin-top" : 0
                });
            }

            if( $list.hasClass("open") ){
                $list.find(".b-show-adv-more div").text("Свернуть преимущества");
            }else{
                $list.find(".b-show-adv-more div").text("Раскрыть все преимущества");
            }
        });
    }

    calcActive();

    function calcActive(){
        $(".b-tabs-line").each(function(){
            var $line = $(this).find("span"),
                $tabs = $(this).prev(".b-tabs"),
                $active = $tabs.find("li.active");

            $line.css({
                "left" : $active.offset().left - $tabs.offset().left,
                "width" : $active.width() + $active.css("padding-left").replace(/\D+/g,"")*1 + $active.css("padding-right").replace(/\D+/g,"")*1
            });
        });
    }

    $(".b-tabs li").click(function(){
        var $tabs = $(this).parents(".b-tabs"),
            index = $(this).index();

        $($tabs.attr("data-tabs")).find(".slick-dots li").eq(index).find("button").click();

        if( $($tabs.attr("data-tabs")).find(".slick-dots li").eq(index).hasClass("slick-active") ){
            $tabs.find("li").removeClass("active");
            $(this).addClass("active");

            calcActive();
        }
    });

    $(".b-land-tabs-cont").slick({
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        cssEase: 'ease', 
        speed: 500,
        arrows: false
    });

    $(".b-sms-butt").click(function(){
        $( $(this).attr("data-block") ).parent().children().removeClass("active");
        $( $(this).attr("data-block") ).addClass("active");

        $(this).parent().children().removeClass("active");
        $(this).addClass("active");

        return false;
    });

    $(".b-lesson-tabs-cont").slick({
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        cssEase: 'ease', 
        speed: 500,
        arrows: true,
        prevArrow: '<div class="slick-arrow slick-prev icon-arrow-left-big"></div>',
        nextArrow: '<div class="slick-arrow slick-next icon-arrow-right-big"></div>',
        adaptiveHeight: true
    });

    $(".b-lesson-tabs-cont .b-tab[data-slick-index='0']").find(".b-right-text").addClass("show");

    $(".b-lesson-tabs-cont").on('beforeChange', function(event, slick, currentSlide, nextSlide){
        $(".b-lesson-tabs li.active").removeClass("active");
        $(".b-lesson-tabs li").eq(nextSlide).addClass("active");

        calcActive();
    });

    $(".b-lesson-tabs-cont").on('afterChange', function(event, slick, currentSlide){
        $(".b-lesson-tabs-cont .b-tab[data-slick-index!='"+currentSlide+"']").find(".b-right-text").removeClass("show");

        $(".b-lesson-tabs-cont .b-tab[data-slick-index='"+currentSlide+"']").find(".b-right-text").addClass("show");
    });

    // Блок с большими отзывами
    var reviewsCount = $(".b-big-review").length;
    $(".b-big-reviews-count").text("1 из "+reviewsCount);
    $(".b-big-reviews-slider").slick({
        dots: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        cssEase: 'ease', 
        // fade: true,
        speed: 500,
        arrows: true,
        prevArrow: '<div class="slick-arrow slick-prev icon-arrow-left-big"></div>',
        nextArrow: '<div class="slick-arrow slick-next icon-arrow-right-big"></div>',
        adaptiveHeight: true
    });

    $(".b-big-reviews-slider").on('beforeChange', function(event, slick, currentSlide, nextSlide){
        $(".b-big-review .b-review-right p span:not(.hidden)").parent("p").next(".b-read-more").click();
        $(".b-big-reviews-count").text((nextSlide+1)+" из "+reviewsCount);
    });

    $(".b-read-more").click(function(){
        var $span = $(this).prev("p").find("span");
        $span.toggleClass("hidden");

        if( $span.hasClass("hidden") ){
            $(this).html("<b>Читать</b> дальше");
        }else{
            $(this).html("<b>Свернуть</b> отзыв");
        }

        $('.b-big-reviews-slider').resize();
        return false;
    });

    $(".b-iphone-slider").slick({
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        cssEase: 'ease', 
        speed: 500,
        arrows: false,
        vertical: true
    });

    $("#type").chosen({
        disable_search_threshold : 10
    }).change(function(){
        var $option = $(this).find("option[value='"+$(this).val()+"']");
            click = $option.attr("data-click"),
            price = $option.attr("data-price");
        $(".b-19 h2.b-title span").text(price);

        $(".b-pay-click").attr("href", $(click).attr("href"));
        return false;
    });

    $(".b-pay-click").attr("href", $(".b-start-link").attr("href"));

    /*----------------------------------*/

    var isWindows = false;
    if (navigator.userAgent.indexOf ('Windows') != -1) isWindows = true;

    /*$(document).mouseleave(function(){
        if(!$(".fancybox-slide .b-popup-leave").length){
            $(".b-btn-leave").click();
        }
    });*/

    $(".b-btn-500lux").on('click', function(){
        $(".b-500lux").addClass("show");
        $(".b-menu-overlay").addClass("show");
        if(isWindows)
            $("body").addClass("no-scroll");
        return false;
    });

    $(".b-btn-research").on('click', function(){
        $(".b-research").addClass("show");
        $(".b-menu-overlay").addClass("show");
        if(isWindows)
            $("body").addClass("no-scroll");
        return false;
    });

    $(".b-menu-overlay, .b-btn-close").on('click', function(){
        $(".b-500lux, .b-research").removeClass("show");
        $(".b-menu-overlay").removeClass("show");
        if(isWindows)
            $("body").removeClass("no-scroll");
        return false;
    });

    $(".b-btn-count").on('click', function(){
        $(".b-count-start").toggleClass("show no-active");
        $(".b-count-ext").toggleClass("show no-active");
        var $active = $(".b-count.show");
        var $noactive = $(".b-count.no-active");
        var delay = 1;
        $active.children(".b-count-item").each(function(){
            var el = this;
            setTimeout(function(){
                $(el).addClass("show");
            }, 100 * delay + 200);
            delay++;
        });
        $noactive.children(".b-count-item").each(function(){
            $(this).removeClass("show");
        });
        if($(".b-count-start.show").length){
            console.log("b-count-start.show");
            $(".b-btn-count").html($(".b-btn-count").attr("data-start"));
        }else{
            console.log("no");
            $(".b-btn-count").html($(".b-btn-count").attr("data-ext"));
        }
        return false;
    });

    $(".b-btn-email").on('click', function(){
        if(!$(this).hasClass("form-open")){
            $(this).addClass("move form-open");
            $(".b-popup-leave .b-input-cont").addClass("show");
            $(".b-popup-leave .b-btn-vk").addClass("hide-opacity");
            $(".b-popup-leave .b-popup-buttons").addClass("more-height");
            return false;
        }
    });

    /*Senler.ButtonSubscribe("senlerBtn-1518010629", { 
        completeCallback: function ($e) { 
            console.log('Запрос пришел успешно'); 
        }, 
        cancelCallback: function ($e) { 
            console.log('Пользователь отписался'); 
        }, 
        successCallback: function ($e) {
            $(".b-vk-s-link").click();
            console.log('Пользователь подписался'); 
        }, 
        errorCallback: function ($e, jqXHR, textStatus, errorThrown) { 
            $(".b-vk-e-link").click();
            console.log('Ошибка при запросе'); 
        } 
    });*/

    /*----------------------------------*/

    // $(".b-pay-click").click(function(){
    //     $($(this).attr("data-click")).click();
    // });
    
	// var myPlace = new google.maps.LatLng(55.754407, 37.625151);
 //    var myOptions = {
 //        zoom: 16,
 //        center: myPlace,
 //        mapTypeId: google.maps.MapTypeId.ROADMAP,
 //        disableDefaultUI: true,
 //        scrollwheel: false,
 //        zoomControl: true
 //    }
 //    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions); 

 //    var marker = new google.maps.Marker({
	//     position: myPlace,
	//     map: map,
	//     title: "Ярмарка вакансий и стажировок"
	// });

    //  var options = {
    //     $AutoPlay: true,                                
    //     $SlideDuration: 500,                            

    //     $BulletNavigatorOptions: {                      
    //         $Class: $JssorBulletNavigator$,             
    //         $ChanceToShow: 2,                           
    //         $AutoCenter: 1,                            
    //         $Steps: 1,                                  
    //         $Lanes: 1,                                  
    //         $SpacingX: 10,                              
    //         $SpacingY: 10,                              
    //         $Orientation: 1                             
    //     }
    // };

    // var jssor_slider1 = new $JssorSlider$("slider1_container", options);

});