(function () {


    'use strict';
    
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent
.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    var contentWayPoint = function () {
        var i = 0;
        $('.animate-box').waypoint(function (direction) {

            if (direction === 'down' && !$(this.element).hasClass('animated')) {

                i++;

                $(this.element).addClass('item-animate');
                setTimeout(function () {

                    $('body .animate-box.item-animate').each(function (k) {
                        var el = $(this);
                        setTimeout(function () {
                            var effect = el.data('animate-effect');
                            if (effect === 'fadeIn') {
                                el.addClass('fadeIn animated');
                            } else if (effect === 'fadeInLeft') {
                                el.addClass('fadeInLeft animated');
                            } else if (effect === 'fadeInRight') {
                                el.addClass('fadeInRight animated');
                            } else {

                                el.addClass('fadeInUp animated');
                            }

                            el.removeClass('item-animate');
                        }, k * 200, 'easeInOutExpo');
                    });

                }, 100);

            }

        }, { offset: '85%' });
    };

    var isotopeImageLoaded = function () {
        $('.isotope').imagesLoaded(function () {
            $('.isotope').isotope({
                itemSelector: '.grid-item',
                percentPosition: true,
            });
        });
    };

    var toggleAside = function () {
        $(document).ready(function () {
            $('.side-nav-btn, .aside-bg').click(function () {
                $('aside').toggleClass('active');
                $('.aside-bg').toggleClass('active');
            });
        });
    }

    var buttonsCustom = function () {
        $(document).ready(function () {
            $('.toggle-btn, .side-nav-btn').click(function () {
                $(this).toggleClass('active');
            });
        });
    }
    
    $(document).ready(function () {
        // Check if we are on draw.html and exit early if so
        if (window.location.pathname.endsWith('draw.html')) {
            return;
        }
    
        if (isMobile.any()) {
            console.log("Is mobile");
            if (window.orientation != 0 || window.innerWidth < 1024) {
                $('.device-notification').show();
                $('.content-blocks').hide();
                console.log('show');
            } else {
                $('.device-notification').hide();
                $('.content-blocks').show();
                console.log('hide');
            }
        }
    
        $(window).resize(function () {
            if (isMobile.any()) {
                if (window.orientation != 0 || window.innerWidth < 1024) {
                    $('.device-notification').show();
                    $('.content-blocks').hide();
                    console.log('show');
                } else {
                    $('.device-notification').hide();
                    $('.content-blocks').show();
                    console.log('hide');
                }
            }
        });
    });

    $(function () {
        contentWayPoint();
        isotopeImageLoaded();
        toggleAside();
        buttonsCustom();
    });


}());
