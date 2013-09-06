$(function() {
    "use strict";

    /*
     ----------------------------
     Tooltip
     ----------------------------
     */
    $(document.getElementById('tooltip')).animate({
        top:    '-45px',
        opacity: 1
    }, 600);

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

    $(window).on('scroll', function () {
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

    /*
     ----------------------------
     Fadein
     ----------------------------
     */
    $('#fadein').on('click', function () {
        $.fn.custombox( this, {
            effect: 'fadein'
        });
        return false;
    });

    /*
     ----------------------------
     Fadein
     ----------------------------
     */
    var slide_position = ['top','right','bottom'];

    $('#slide').on('click', function () {
        $.fn.custombox( this, {
            effect:     'slide',
            position:   slide_position[Math.floor((Math.random()*3))]
        });
        return false;
    });

    /*
     ----------------------------
     Newspaper
     ----------------------------
     */
    $('#newspaper').on('click', function () {
        $.fn.custombox( this, {
            effect: 'newspaper'
        });
        return false;
    });

    /*
     ----------------------------
     Fall
     ----------------------------
     */
    $('#fall').on('click', function () {
        $.fn.custombox( this, {
            effect: 'fall'
        });
        return false;
    });

    /*
     ----------------------------
     Sidefall
     ----------------------------
     */
    $('#sidefall').on('click', function () {
        $.fn.custombox( this, {
            effect: 'sidefall'
        });
        return false;
    });

    /*
     ----------------------------
     Flip
     ----------------------------
     */
    var flip_position = ['vertical','horizontal'];

    $('#flip').on('click', function () {
        $.fn.custombox( this, {
            effect:     'flip',
            position:   flip_position[Math.floor((Math.random()*2))]
        });
        return false;
    });

    /*
     ----------------------------
     Sign
     ----------------------------
     */
    $('#sign').on('click', function () {
        $.fn.custombox( this, {
            effect: 'sign'
        });
        return false;
    });

    /*
     ----------------------------
     Sign
     ----------------------------
     */
    $('#superscaled').on('click', function () {
        $.fn.custombox( this, {
            effect: 'superscaled'
        });
        return false;
    });

    /*
     ----------------------------
     Slit
     ----------------------------
     */
    $('#slit').on('click', function () {
        $.fn.custombox( this, {
            effect: 'slit'
        });
        return false;
    });

    /*
     ----------------------------
     Rotate
     ----------------------------
     */
    var rotate_position = ['bottom','left'];

    $('#rotate').on('click', function () {
        $.fn.custombox( this, {
            effect:     'rotate',
            position:   rotate_position[Math.floor((Math.random()*2))]
        });
        return false;
    });

    /*
     ----------------------------
     Letmein
     ----------------------------
     */
    $('#letmein').on('click', function () {
        $.fn.custombox( this, {
            effect: 'letmein',
            // Remove style attribute.
            open: function () {
                $('#sidebar').removeAttr('style');
            }
        });
        return false;
    });

    /*
     ----------------------------
     Makeway
     ----------------------------
     */
    $('#makeway').on('click', function () {
        $.fn.custombox( this, {
            effect: 'makeway',
            // Remove style attribute.
            open: function () {
                $('#sidebar').removeAttr('style');
            }
        });
        return false;
    });

    /*
     ----------------------------
     Slip
     ----------------------------
     */
    $('#slip').on('click', function () {
        $.fn.custombox( this, {
            effect: 'slip',
            // Remove style attribute.
            open: function () {
                $('#sidebar').removeAttr('style');
            }
        });
        return false;
    });

    /*
     ----------------------------
     Custom - Without overlay
     ----------------------------
     */
    $('#example1').on('click', function () {
        $.fn.custombox( this, {
            overlay: false,
            effect: 'fadein'
        });
        return false;
    });

    /*
     ----------------------------
     Custom - Ajax
     ----------------------------
     */
    $('#example2').on('click', function () {
        $.fn.custombox( this, {
            effect: 'newspaper'
        });
        return false;
    });

    /*
     ----------------------------
     Custom - Error :(
     ----------------------------
     */
    $('#example3').on('click', function () {
        $.fn.custombox( this, {
            effect: 'slit',
            error: 'OPS! File not found'
        });
        return false;
    });

    /*
     ----------------------------
     Custom - Callbacks
     ----------------------------
     */
    $('#example4').on('click', function () {
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
        return false;
    });



});