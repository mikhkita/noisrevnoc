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

    $("input[name='tovar_id']").change(function(){
        $(this).parents("form").find("input[name='form_id']").val($(this).attr("data-form-id"));
    });

    $('#player').mediaelementplayer({
        success: function(mediaElement, originalNode, instance) {
            // do things
        }
    });

    $('#player2').mediaelementplayer({
        success: function(mediaElement, originalNode, instance) {
            // do things
        }
    });

    var videoScroll = false;
    $(".b-video-block .b-play").click(function(){
        var $cont = $(this).parents(".b-video-block");
        $cont.addClass("play");
        $cont.find("iframe").attr("src", $cont.find("iframe").attr("src")+"&autoplay=1"); 

        if( $(".b-audio-butt").hasClass("play") ){
            $(".b-audio-butt").click();
        }

        if( $(this).parents(".b-main-video-block").length ){
            videoScroll = true;
        }

        return false;
    });

    $(".b-main-video-cont a.b-btn-close").click(function(){
        videoScroll = false;
        videoStatic();
        return false;
    });

    // $("#b-show-10").click(function(){
    //     $(".b-instruct-10").each(function(){
    //         var $this = $(this);

    //         $this.css("display", "inline-block");
    //         setTimeout(function(){
    //             setTimeout(function(){
    //                 $this.addClass($this.attr("data-anim")+"-show");
    //             }, 10);
    //         }, $this.attr("data-delay")*1);
    //     });
    //     $(this).hide();

    //     return false;
    // });

    $("#b-show-10").click(function(){
        $(".b-note-show-all").addClass("show-note");
        return false;
    });
    $("#b-note-hide").click(function(){
        $(".b-note-show-all").removeClass("show-note");
        return false;
    })

    customHandlers["onScroll"] = function(scroll){
        // alert(scroll);
        if( videoScroll ){
            var videoTop = $(".b-main-video-block").offset().top,
                videoBottom = videoTop + $(".b-main-video-block").height(),
                scrollBottom = scroll + myHeight;

            if( scroll > videoTop || scrollBottom < videoBottom ){
                if( !isVideoFixed() ){
                    videoFixed();
                }
            }else{
                if( isVideoFixed() ){
                    videoStatic();
                }
            }
        }
    }

    function isVideoFixed(){
        return $(".b-main-video-cont.fixed").length;
    }

    function videoFixed(){
        $(".b-main-video-cont").addClass("fixed");
        console.log("fixed");
    }

    function videoStatic(){
        $(".b-main-video-cont").removeClass("fixed");
        console.log("static");
    }

    calcHeight();

    $(".b-atlant-slider").slick({
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        cssEase: 'ease', 
        speed: 500,
        arrows: false,
        touchThreshold: 100
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
        arrows: false,
        touchThreshold: 100
    });

    $(".b-land-tabs-cont").on('beforeChange', function(event, slick, currentSlide, nextSlide){
        $(".b-land-tabs li.active").removeClass("active");
        $(".b-land-tabs li").eq(nextSlide).addClass("active");

        calcActive();
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
        adaptiveHeight: true,
        touchThreshold: 100
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

    $(".b-temp-tabs-cont").slick({
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        cssEase: 'ease', 
        speed: 500,
        arrows: false,
        touchThreshold: 100
    });

    $(".b-temp-tabs-cont").on('beforeChange', function(event, slick, currentSlide, nextSlide){
        $(".b-temp-tabs li.active").removeClass("active");
        $(".b-temp-tabs li").eq(nextSlide).addClass("active");

        calcActive();
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
        fade: true,
        speed: 500,
        arrows: true,
        prevArrow: '<div class="slick-arrow slick-prev icon-arrow-left-big"></div>',
        nextArrow: '<div class="slick-arrow slick-next icon-arrow-right-big"></div>',
        adaptiveHeight: true,
        touchThreshold: 100
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
        vertical: true,
        autoplay: true,
        autoplaySpeed: 3000,
        touchThreshold: 100
    });

    $("#type").chosen({
        disable_search_threshold : 10
    }).change(function(){
        var $option = $(this).find("option[value='"+$(this).val()+"']");
            click = $option.attr("data-id"),
            price = $option.attr("data-price");
        $(".b-19 h2.b-title span").text(price);

        $(".b-pay-click").attr("data-id", $option.attr("data-id"));
        return false;
    });

    $("#type1").chosen({
        disable_search_threshold : 10
    }).change(function(){
        var $option = $(this).find("option[value='"+$(this).val()+"']");
            click = $option.attr("data-id"),
            price = $option.attr("data-price");
        $(".b-form-price").text(price);

        $(".b-pay-click").attr("data-id", $option.attr("data-id"));
        return false;
    });

    $("#type2").chosen({
        disable_search_threshold : 10
    }).change(function(){
        var $option = $(this).find("option[value='"+$(this).val()+"']");
            click = $option.attr("data-id"),
            name = $option.attr("data-name"),
            price = $option.attr("data-price"),
            oldPrice = $option.attr("data-old-price");

        $(".b-footer-title b").text(price);
        $(".b-footer-title span").text(oldPrice);
        $(".b-footer-title div").text(name);

        if( $option.attr("value") == "364138" ){
            $(".b-footer-title span").hide();
        }else{
            $(".b-footer-title span").show();
        }
        return false;
    });

    $(".b-pay-click").click(function(){
        return false;
    });
    // $(".b-pay-click").attr("data-id", $(".b-start-link").attr("data-id"));

    /*----------------------------------*/

    var isWindows = false,
        timerLeave = 0,
        showLeave = true;

    if (navigator.userAgent.indexOf ('Windows') != -1) isWindows = true;

    setInterval(function() {
        timerLeave++;
        if(timerLeave > 120){
            showLeave = true;
            timerLeave = 0;
        }
    }, 1000);

    $("input").focus(function() {
        showLeave = false;
    }).blur(function() {
        showLeave = true;
    });

    $(window).enllax();

    $(".b-audio-butt").click(function(){
        curAudio = $(".b-audio")[0];

        $(this).toggleClass("play");
        $(this).find(".icon-audio").toggleClass("icon-pause");

        if( $(this).hasClass("play") ){
            curAudio.play();
        }else{
            curAudio.pause();
        }

        return false;
    });

    // $(document).mouseleave(function(){
    //     if(!$(".fancybox-slide .b-popup-leave").length && showLeave){
    //         $(".b-btn-leave").click();
    //         showLeave = false;
    //         timerLeave = 0;
    //     }
    // });

    $(".b-btn-500lux").on('click', function(){
        $(".b-500lux").addClass("show");
        $(".b-menu-overlay").addClass("show");
        $("body").addClass("no-scroll");
        if(isWindows)
            $("body").addClass("margin-scroll");
        return false;
    });

    $(".b-btn-research").on('click', function(){
        $(".b-research").addClass("show");
        $(".b-menu-overlay").addClass("show");
        $("body").addClass("no-scroll");
        if(isWindows)
            $("body").addClass("margin-scroll");
        return false;
    });

    $(".b-btn-kind").on('click', function(){
        $(".b-kind").addClass("show");
        $(".b-menu-overlay").addClass("show");
        $("body").addClass("no-scroll");
        if(isWindows)
            $("body").addClass("margin-scroll");
        return false;
    });

    $(".b-btn-form").on('click', function(){
        $(".b-form").addClass("show");
        $(".b-menu-overlay").addClass("show");
        $("body").addClass("no-scroll");
        if( $(this).attr("data-id") ){
            // $("#"+$(this).attr("data-id")).click();
            var value = $("#type1").find("[data-id='"+$(this).attr("data-id")+"']").attr("value"),
                price = $("#type1").find("[data-id='"+$(this).attr("data-id")+"']").attr("data-price");
            $("#type1").val(value).trigger("chosen:updated");
            $(".b-form-price").text(price);
        }else{
            $("#platinum-radio-1").click();
        }
        if(isWindows)
            $("body").addClass("margin-scroll");
        return false;
    });

    $(".b-menu-overlay, .b-btn-close").on('click', function(){
        $(".b-500lux, .b-research, .b-kind, .b-form").removeClass("show");
        $(".b-menu-overlay").removeClass("show");
        $("body").removeClass("no-scroll");
        if(isWindows)
            $("body").removeClass("margin-scroll");
        return false;
    });

    $(".b-btn-count").on('click', function(){
        // $(".b-count-start").toggleClass("show no-active");
        $(".b-count-ext").toggleClass("show no-active");
        var $active = $(".b-count.show");
        var $noactive = $(".b-count.no-active");
        $active.children(".b-count-item").each(function(){
            var $el = $(this);
            setTimeout(function(){
                $el.addClass("show");
            }, 100 * $el.index());
        });
        $noactive.children(".b-count-item").each(function(){
            $(this).removeClass("show");
        });
        if(!$(".b-count-ext.show").length){
            $(".b-btn-count").html($(".b-btn-count").attr("data-start"));
        }else{
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

    Senler.ButtonSubscribe("senlerBtn-1518010629", { 
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
    });

    $(".price-add").slideUp();

    $(".price-left").click(function(){
        var $target = $(this).parents(".b-new-price-item").find(".price-add");
        if($target.hasClass("show")){
            $target.removeClass("show").slideUp();
        }else{
            $target.addClass("show").slideDown();
        }
    });

    $(".b-show-reviews").on('click', function(){
        if ($(".b-add-reviews").hasClass("hide-rev")) { 
            $(".b-add-reviews").removeClass("hide-rev")
            $(".b-add-reviews").addClass("show-rev");
            $(".b-show-reviews").remove();
        }
        return false;
    });

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