(function ($) {
    "use strict";

    $(document).ready(function(){

        // Creates Captions from Alt tags
        $(".post-content img").each(function() {
            // Let's put a caption if there is one
            if($(this).attr("alt") && !$(this).hasClass("emoji"))
              $(this).wrap('<figure class="image"></figure>')
              .after('<figcaption>'+$(this).attr("alt")+'</figcaption>');
        });

        // Toggle mobile menu
        $('.menu-toggle').on('click', function() {
            $(this).toggleClass('active');
            $('.custom-links').toggleClass('active');
        });

        // Close menu when clicking outside
        $(document).on('click', function(event) {
            if (!$(event.target).closest('.menu-toggle, .custom-links').length) {
                $('.menu-toggle').removeClass('active');
                $('.custom-links').removeClass('active');
            }
        });

        // Close menu when clicking a link (for mobile)
        $('.custom-links a').on('click', function() {
            $('.menu-toggle').removeClass('active');
            $('.custom-links').removeClass('active');
        });

        // Dynamic background image loader
        const elements = document.querySelectorAll('[data-bg-image]');
        elements.forEach(function(element) {
            const imageUrl = element.getAttribute('data-bg-image');
            if (imageUrl) {
                element.style.backgroundImage = 'url(' + imageUrl + ')';
            }
        });

        // Article image padding adjustment
        var $window = $(window);
        var height = $('.article-image').height();
        $('.post-content').css('padding-top', height + 'px');

        // Smooth scroll for anchor links
        $('a[href*=#]:not([href=#])').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
             && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                if (target.length) {
                    $('html,body').animate({ scrollTop: target.offset().top }, 500);
                    return false;
                }
            }
        });

    });

}(jQuery));