// page init

import $ from 'jquery'
import 'slick-carousel'

import WOW from "plugins";

/* eslint-disable */
$(function () {
    "use strict";
    // initTabs();
    // initIsoTop();
    initbackTop();
    // initLightbox();
    initGoogleMap();
    // initNavOpener();
    initPreLoader();
    //initCountDown();
    // initSlickSlider();
    initStickyHeader();
    // initCustomScroll();
    new WOW().init();

});

$(window).on('load', function () {
    "use strict";

    initPreLoader();
});


// PreLoader init
/*function initCountDown() {
	$("#countdown").countdown({
		date: "10 december 2017 12:00:00",
		format: "on"
    });
}*/

// PreLoader init
 export function initPreLoader() {
    $("#pre-loader").delay(1200).fadeOut();
}

// NavOpener init
export function initNavOpener() {
    $(".side-close , .side-opener , .mt-side-over").on('click',function () {
        $("body").toggleClass("side-col-active");
        $(".side-opener").toggleClass("active");
        $(".mt-side-over").toggleClass("active");
        return false;
    });
    $(".mobile-toggle").on('click',function () {
        $("body").toggleClass("mobile-active");
        $(".mobile-toggle").toggleClass("active");
        return false;
    });
    $(".cart-opener, .mt-mdropover").on('click',function () {
        $(this).parent().toggleClass("open");
        return false;
    });
    $(".search-close, .icon-magnifier, .fa-search").on('click',function () {
        $("body").toggleClass("search-active");
        // console.log("123")
        return false;
    });
    $('.drop-link , #nav > ul > li.drop > a').on('click',function () {
        $(this).next().toggleClass("open");
        return false;
    });
    $('.mt-subopener').on('click',function () {
        $(this).parent().next().toggleClass("open");
        return false;
    });
}

// SlickSlider init
export function initSlickSlider() {

    $('.banner-slider').slick({
        dots: true,
        arrows: false,
        infinite: true,
        adaptiveHeight: true
    });

    $('.tabs-slider').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 599,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 479,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });

    $('.tabs-sliderlg').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 599,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 479,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });

    $('.patner-slider').slick({
        autoplay: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 479,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });

    $('.work-slider').slick({
        dots: true,
        arrows: true,
        slidesToShow: 1,
        centerMode: true,
        centerPadding: '18%',
        responsive: [
            {
                breakpoint: 1840,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '10%',
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 1380,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '5%',
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '20%',
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    dots: false,
                    arrows: false,
                    centerMode: true,
                    centerPadding: '20%',
                    slidesToShow: 1
                }
            }
        ]
    });

    $(".centerslider-1").slick({
        dots: true,
        arrows: false,
        infinite: true,
        slidesToShow: 1,
        centerMode: true,
        slidesToScroll: 1,
        adaptiveHeight: true,
        centerPadding: '18.5%',
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    centerPadding: '4%',
                }
            }
        ]
    });

    $('.product-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        centerPadding: '0',
        asNavFor: '.pagg-slider'
    });

    $('.pagg-slider').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        centerPadding: '0',
        asNavFor: '.product-slider',
        focusOnSelect: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                }
            }
        ]
    });
 }

// fancybox modal popup init
// function initLightbox() {
//     $('a.lightbox, a[rel*="lightbox"]').fancybox({
//         helpers: {
//             overlay: {
//                 css: {
//                     background: 'rgba(0, 0, 0, 0.65)'
//                 }
//             }
//         },
//         afterLoad: function (current) {
//             // handle custom close button in inline modal
//             if (current.href.indexOf('#') === 0) {
//                 $(current.href).find('a.close').off('click.fb').on('click.fb', function (e) {
//                     e.preventDefault();
//                     $.fancybox.close();
//                 });
//             }
//         },
//         padding: 0
//     });
//     $("#newsletter-hiddenlink").fancybox().trigger('click');
// }

// sticky header init
export function initbackTop() {
    var jQuerybackToTop = $("#back-top");
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 100) {
            jQuerybackToTop.addClass('active');
        } else {
            jQuerybackToTop.removeClass('active');
        }
    });
    jQuerybackToTop.on('click', function () {
        $("html, body").animate({scrollTop: 0}, 1);
    });
}

// IsoTop init
// function initIsoTop() {
//     var isotopeHolder = $('#product-masonry .masonry-list');
//     // win = $(window);
//
//     isotopeHolder.isotope({transitionDuration: '0.75s'});
//     setTimeout(function () {
//         isotopeHolder.isotope('layout');
//     }, 100);
//     $('#product-filter a').on('click',function (e) {
//         e.preventDefault();
//
//         $('#product-filter li').removeClass('active');
//         $(this).parent('li').addClass('active');
//         var selector = $(this).attr('data-filter');
//         isotopeHolder.isotope({filter: selector});
//     });
//
//     $('#product-shuffle').on('click',function () {
//         isotopeHolder.isotope('updateSortData').isotope({
//             sortBy: 'random'
//         });
//     });
//     $('#blog-isotops').isotope({
//         // options
//         itemSelector: '.post-blog'
//     });
//     $('#blog-isotop').isotope({
//         // options
//         itemSelector: '.img'
//     });
// }

// GoogleMap init
function initGoogleMap() {
    $('.mt-map-holder').googleMapAPI({
        marker: 'images/map-logo.png',
        mapInfoContent: '.map-info',
        streetViewControl: false,
        mapTypeControl: false,
        scrollwheel: false,
        panControl: false,
        zoomControl: false
    });
}

// content tabs init
function initTabs() {
    $('ul.producttabs').tabset({
        tabLinks: 'a',
        defaultTab: false
    });
    $('ul.mt-tabs').tabset({
        tabLinks: 'a',
        defaultTab: false
    });
}

// sticky header init
export function initStickyHeader() {
    var win = $(window),
        stickyClass = 'sticky';

    $('#mt-header').each(function () {
        var header = $(this);
        var headerOffset = header.offset().top || 400;
        var flag = true;


        $(this).css('height', $(this).innerHeight());

        function scrollHandler() {
            if (win.scrollTop() > headerOffset) {
                if (flag) {
                    flag = false;
                    header.addClass(stickyClass);
                }
            } else {
                if (!flag) {
                    flag = true;
                    header.removeClass(stickyClass);
                }
            }

            ResponsiveHelper.addRange({
                '..767': {
                    on: function () {
                        header.removeClass(stickyClass);
                    }
                }
            });
        }

        scrollHandler();
        win.on('scroll resize orientationchange', scrollHandler);
    });
}

function initCustomScroll() {
    $("#mt-productscrollbar").mCustomScrollbar({
        axis: "x"
    });
}


/*!
 * Google Map module
 */

(function ($) {
    function GoogleMapAPI(options) {
        let google;
        this.options = $.extend({
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }, options);
        this.init();
    }

    GoogleMapAPI.prototype = {
        init: function () {
            this.findStructure();
            this.getInfoWindowContent();
            this.createMap();
            this.createMarker();
            this.createInfoWindow();
        },

        findStructure: function () {
            this.container = $(this.options.container);
            this.lat = parseFloat(this.container.attr('data-lat'));
            this.lng = parseFloat(this.container.attr('data-lng'));
            this.coords = new google.LatLng(this.lat, this.lng);
            this.zoom = parseInt(this.container.attr('data-zoom'));
            this.infoWindowContent = this.container.find('.map-info');
            this.mapOptions = {
                mapTypeId: this.options.mapTypeId,
                panControl: this.options.panControl,
                zoomControl: this.options.zoomControl,
                streetViewControl: this.options.streetViewControl,
                mapTypeControl: this.options.mapTypeControl,
                center: this.coords,
                scrollwheel: this.options.scrollwheel,
                zoom: this.zoom
            };
        },

        getInfoWindowContent: function () {
            this.infoWindowContent = this.container.find(this.options.mapInfoContent);
        },

        createMap: function () {
            this.map = new google.maps.Map(this.container.get(0), this.mapOptions);
        },

        createMarker: function () {
            this.marker = new google.maps.Marker({
                icon: this.options.marker,
                position: this.coords
            });

            this.marker.setMap(this.map);
        },

        createInfoWindow: function () {
            var self = this;
            this.infoWindow = new google.maps.InfoWindow({
                content: this.infoWindowContent.get(0)
            });
            this.marker.addListener('click', function () {
                self.infoWindow.open(self.map, self.marker);
            })
        }
    };

    $.fn.googleMapAPI = function (opt) {
        return this.each(function () {
            $(this).data('GoogleMapAPI', new GoogleMapAPI($.extend(opt, {container: this})));
        });
    };
}($));


/*
 * Responsive Layout helper
 */
let ResponsiveHelper;
ResponsiveHelper = (function ($) {
    // init variables
    var handlers = [],
        prevWinWidth,
        win = $(window),
        nativeMatchMedia = false;

    // detect match media support
    if (window.matchMedia) {
        if (window.Window && window.matchMedia === Window.prototype.matchMedia) {
            nativeMatchMedia = true;
        } else if (window.matchMedia.toString().indexOf('native') > -1) {
            nativeMatchMedia = true;
        }
    }

    // prepare resize handler
    function resizeHandler() {
        var winWidth = win.width();
        if (winWidth !== prevWinWidth) {
            prevWinWidth = winWidth;

            // loop through range groups
            $.each(handlers, function (index, rangeObject) {
                // disable current active area if needed
                $.each(rangeObject.data, function (property, item) {
                    if (item.currentActive && !matchRange(item.range[0], item.range[1])) {
                        item.currentActive = false;
                        if (typeof item.disableCallback === 'function') {
                            item.disableCallback();
                        }
                    }
                });

                // enable areas that match current width
                $.each(rangeObject.data, function (property, item) {
                    if (!item.currentActive && matchRange(item.range[0], item.range[1])) {
                        // make callback
                        item.currentActive = true;
                        if (typeof item.enableCallback === 'function') {
                            item.enableCallback();
                        }
                    }
                });
            });
        }
    }

    win.bind('load resize orientationchange', resizeHandler);

    // test range
    function matchRange(r1, r2) {
        var mediaQueryString = '';
        if (r1 > 0) {
            mediaQueryString += '(min-width: ' + r1 + 'px)';
        }
        if (r2 < Infinity) {
            mediaQueryString += (mediaQueryString ? ' and ' : '') + '(max-width: ' + r2 + 'px)';
        }
        return matchQuery(mediaQueryString, r1, r2);
    }

    // media query function
    function matchQuery(query, r1, r2) {
        if (window.matchMedia && nativeMatchMedia) {
            return matchMedia(query).matches;
        } else if (window.styleMedia) {
            return styleMedia.matchMedium(query);
        } else if (window.media) {
            return matchMedia().matches(query);
        } else {
            return prevWinWidth >= r1 && prevWinWidth <= r2;
        }
    }

    // range parser
    function parseRange(rangeStr) {
        var rangeData = rangeStr.split('..');
        var x1 = parseInt(rangeData[0], 10) || -Infinity;
        var x2 = parseInt(rangeData[1], 10) || Infinity;
        return [x1, x2].sort(function (a, b) {
            return a - b;
        });
    }

    // export public functions
    return {
        addRange: function (ranges) {
            // parse data and add items to collection
            var result = {data: {}};
            $.each(ranges, function (property, data) {
                result.data[property] = {
                    range: parseRange(property),
                    enableCallback: data.on,
                    disableCallback: data.off
                };
            });
            handlers.push(result);

            // call resizeHandler to recalculate all events
            prevWinWidth = null;
            resizeHandler();
        }
    };
}($));



