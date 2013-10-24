$(function() {
    "use strict";

    /*
     ----------------------------
     Tooltip
     ----------------------------
     */
    var $window = $(window);

    if ( $window.width() < 360 ) {
        $(document.getElementById('tooltip')).css('right', 0);
    }

    if( navigator.appVersion.indexOf("MSIE 8.") == -1 ) {
        $(document.getElementById('tooltip')).animate({
            top:    '-45px',
            opacity: 1
        }, 600);
    }

    /*
     ----------------------------
     Show code without jQuery
     ----------------------------
     */
    $(document.getElementById('actiontutorial')).on('click', function () {
        $(document.getElementById('tutorial')).slideToggle();
    });

    /*
     ----------------------------
     Custom sidebar
     ----------------------------
     */
    var $sidebar = $(document.getElementById('sidebar')),
        sidebar_width = $sidebar.width();

    if ( $window.width() > 1170 && $sidebar.height() < $window.height() ) {
        $window.on('scroll', function () {
            var $this = $(this);
            if( $this.scrollTop() > 155 && $this.width() > 980 ) {
                $(document.getElementById('tooltip')).hide();
                $sidebar.css({
                    position:   'fixed',
                    top:        '20px',
                    width:      sidebar_width + 'px'
                });
            } else if ( $this.scrollTop() <= 155 ) {
                $(document.getElementById('tooltip')).show();
                $sidebar.removeAttr('style');
            }
        });
    }

    /*
     ----------------------------
     Fadein
     ----------------------------
     */
    $('#fadein').on('click', function ( e ) {
        $.fn.custombox( this, {
            effect: 'fadein'
        });
        e.preventDefault();
    });

    /*
     ----------------------------
     Slide
     ----------------------------
     */
    var slide_position = ['top','right','bottom','center','left'];

    $('#slide').on('click', function ( e ) {
        $.fn.custombox( this, {
            effect:     'slide',
            position:   slide_position[Math.floor( Math.random() * slide_position.length )]
        });
        e.preventDefault();
    });

    /*
     ----------------------------
     Newspaper
     ----------------------------
     */
    $('#newspaper').on('click', function ( e ) {
        $.fn.custombox( this, {
            effect: 'newspaper'
        });
        e.preventDefault();
    });

    /*
     ----------------------------
     Fall
     ----------------------------
     */
    $('#fall').on('click', function ( e ) {
        $.fn.custombox( this, {
            effect: 'fall'
        });
        e.preventDefault();
    });

    /*
     ----------------------------
     Sidefall
     ----------------------------
     */
    $('#sidefall').on('click', function ( e ) {
        $.fn.custombox( this, {
            effect: 'sidefall'
        });
        e.preventDefault();
    });

    /*
     ----------------------------
     Flip
     ----------------------------
     */
    var flip_position = ['vertical','horizontal'];

    $('#flip').on('click', function ( e ) {
        $.fn.custombox( this, {
            effect:     'flip',
            position:   flip_position[Math.floor((Math.random()*2))]
        });
        e.preventDefault();
    });

    /*
     ----------------------------
     Sign
     ----------------------------
     */
    $('#sign').on('click', function ( e ) {
        $.fn.custombox( this, {
            effect: 'sign'
        });
        e.preventDefault();
    });

    /*
     ----------------------------
     Sign
     ----------------------------
     */
    $('#superscaled').on('click', function ( e ) {
        $.fn.custombox( this, {
            effect: 'superscaled'
        });
        e.preventDefault();
    });

    /*
     ----------------------------
     Slit
     ----------------------------
     */
    $('#slit').on('click', function ( e ) {
        $.fn.custombox( this, {
            effect: 'slit'
        });
        e.preventDefault();
    });

    /*
     ----------------------------
     Rotate
     ----------------------------
     */
    var rotate_position = ['bottom','left'];

    $('#rotate').on('click', function ( e ) {
        $.fn.custombox( this, {
            effect:     'rotate',
            position:   rotate_position[Math.floor((Math.random()*2))]
        });
        e.preventDefault();
    });

    /*
     ----------------------------
     Letmein
     ----------------------------
     */
    $('#letmein').on('click', function ( e ) {
        $.fn.custombox( this, {
            effect: 'letmein',
            // Remove style attribute.
            open: function () {
                $('#sidebar').removeAttr('style');
            }
        });
        e.preventDefault();
    });

    /*
     ----------------------------
     Makeway
     ----------------------------
     */
    $('#makeway').on('click', function ( e ) {
        $.fn.custombox( this, {
            effect: 'makeway',
            // Remove style attribute.
            open: function () {
                $('#sidebar').removeAttr('style');
            }
        });
        e.preventDefault();
    });

    /*
     ----------------------------
     Slip
     ----------------------------
     */
    $('#slip').on('click', function ( e ) {
        $.fn.custombox( this, {
            effect: 'slip',
            // Remove style attribute.
            open: function () {
                $('#sidebar').removeAttr('style');
            }
        });
        e.preventDefault();
    });

    /*
     ----------------------------
     Blur
     ----------------------------
     */
    $('#blur').on('click', function ( e ) {
        $.fn.custombox( this, {
            effect: 'blur'
        });
        e.preventDefault();
    });
    /*
     ----------------------------
     Custom - Without overlay
     ----------------------------
     */
    $('#example1').on('click', function ( e ) {
        $.fn.custombox( this, {
            overlay: false,
            effect: 'fadein'
        });
        e.preventDefault();
    });

    /*
     ----------------------------
     Custom - Ajax
     ----------------------------
     */
    $('#example2').on('click', function ( e ) {
        $.fn.custombox( this, {
            effect: 'newspaper'
        });
        e.preventDefault();
    });

    /*
     ----------------------------
     Custom - Auto start
     ----------------------------
     */
    $('#example3').on('click', function ( e ) {
        var clock = 5,
            countdownId = 0,
            eCountdown = document.getElementById('countdown');

        eCountdown.style.display = 'inline';

        var countdown = setInterval( function() {
            if(clock > 0) {
                clock = clock - 1;
                eCountdown.innerHTML = clock;
            } else {
                eCountdown.innerHTML = "Initiating...";
                $.fn.custombox({
                    url:    'demo/xhr/ajax.html',
                    close:  function () {
                                eCountdown.style.display = 'none';
                    }
                });
                // Stop timer
                clearInterval(countdown);
            }
        }, 1000);
        e.preventDefault();
    });

    /*
     ----------------------------
     Custom - Error :(
     ----------------------------
     */
    $('#example4').on('click', function ( e ) {
        $.fn.custombox( this, {
            effect: 'slit',
            error: 'OPS! File not found'
        });
        e.preventDefault();
    });

    /*
     ----------------------------
     Custom - Callbacks
     ----------------------------
     */
    $('#example5').on('click', function ( e ) {
        $.fn.custombox( this, {
            open: function () {
                alert('open');
            },
            complete: function () {
                alert('complete');
            },
            close: function () {
                alert('close');
            }
        });
        e.preventDefault();
    });

    /*
     ----------------------------
     Custom - Other style
     ----------------------------
     */
    $('#example6').on('click', function ( e ) {
        $.fn.custombox( this );
        e.preventDefault();
    });

    /*
     ----------------------------
     Custom effect 1
     ----------------------------
     */
    $('#example7').on('click', function ( e ) {
        $.fn.custombox( this, {
            effect:         'fadein',
            overlayColor:   '#FFF',
            overlayOpacity: 1,
            customClass:    'justme',
            speed:          200
        });
        e.preventDefault();
    });

    /*
     ----------------------------
     Custom effect 2
     ----------------------------
     */
    $('#example8').on('click', function ( e ) {
        $.fn.custombox( this, {
            effect:         'slide',
            position:       'center',
            customClass:    'customslide',
            speed:          200
        });
        e.preventDefault();
    });

    /*
     ----------------------------
     Custom open and close position
     ----------------------------
     */
    $('#example9').on('click', function ( e ) {
        $.fn.custombox( this, {
            effect:     'slide',
            position:   'left, right'
        });
        e.preventDefault();
    });

});