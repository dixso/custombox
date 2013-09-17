/*
 *  jQuery Custombox v0.1b - 2013-09-14
 *  jQuery Modal Window Effects.
 *  (c) 2013 Julio De La Calle - http://dixso.net - @dixso9
 *
 *  Under MIT License - http://www.opensource.org/licenses/mit-license.php
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {
    "use strict";
    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once.
    var cb = 'custombox',
        defaults = {
            url:            null,           // Set the URL, ID or Class.
            cache:          false,          // If set to false, it will force requested pages not to be cached by the browser only when send by AJAX.
            escKey:         true,           // Allows the user to close the modal by pressing 'ESC'.
            eClose:         null,           // Element ID or Class for to be close the modal.
            zIndex:         9999,           // Overlay z-index.
            overlay:        true,           // Show the overlay.
            overlayColor:   '#000',         // Overlay color.
            overlayOpacity: 0.8,            // The overlay opacity level. Range: 0 to 1.
            overlayClose:   true,           // Allows the user to close the modal by clicking the overlay.
            overlaySpeed:   200,            // Sets the speed of the overlay, in milliseconds.
            customClass:    null,           // Custom class to modal.
            width:          null,           // Set a fixed total width.
            height:         null,           // Set a fixed total height.
            effect:         'fadein',       // fadein | slide | newspaper | fall | sidefall | flip | sign | superscaled | slit | rotate | letmein | makeway | slip.
            position:       null,           // Only with effects: slide, flip and rotate. (top, right, bottom, left and center) | (vertical or horizontal).
            speed:          600,            // Sets the speed of the transitions, in milliseconds.
            open:           null,           // Callback that fires right before begins to open.
            complete:       null,           // Callback that fires right after loaded content is displayed.
            close:          null,           // Callback that fires once is closed.
            error:          'Error 404!'    // Text to be displayed when an error.
        };

    // The plugin constructor.
    function Plugin ( element, options ) {

        this.element = element;

        // Merge objects.
        this.settings = this._extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = cb;

        if ( typeof this.element === 'object' ) {
            // Private method.
            this._box.init( this );
        } else {
            // Public method.
            this[this.element]();
        }

    }

    Plugin.prototype = {
        /*
         ----------------------------
         Private methods
         ----------------------------
         */
        _overlay: function() {
            var rgba = this._hexToRgb(this.settings.overlayColor);

            document.getElementsByTagName('body')[0].appendChild(this._create({
                id:                 'overlay',
                class:              'overlay'
            }, {
                'background-color': 'rgba(' + rgba.r + ',' + rgba.g + ', ' + rgba.b + ',' + this.settings.overlayOpacity + ')',
                'z-index':          ( isNaN( this.settings.zIndex ) ? 9999 : this.settings.zIndex ),
                'transition':       'all ' + this.settings.overlaySpeed / 1000 + 's'
            }));
        },
        _box: {
            init: function ( obj ) {
                // Check if callback 'open'.
                if ( obj.settings.open && typeof obj.settings.open === 'function' ) {
                    obj.settings.open( undefined !== arguments[0] ? arguments[0] : '' );
                }

                // Add generic class custombox.
                obj._addClass( document.getElementsByTagName( 'html' )[0], 'html' );

                // Check if scrollbar is visible.
                var body = document.body,
                    html = document.documentElement;

                var bodyHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight),
                    windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;

                if ( bodyHeight > windowHeight ) {
                    obj._addClass( document.getElementsByTagName( 'body' )[0], 'scrollbar' );
                }

                // Check 'href'.
                if ( obj.settings.url === null ) {
                    obj.settings.url = obj.element.getAttribute('href');
                }

                if ( typeof obj.settings.url === 'string' ) {
                    if ( obj.settings.url.charAt(0) === '#' || obj.settings.url.charAt(0) === '.' ) {
                        // Inline.
                        if ( document.querySelector(obj.settings.url) ) {
                            obj._box.build( obj, document.querySelector(obj.settings.url).cloneNode(true) );
                        } else {
                            obj._box.build( obj, null );
                        }
                    } else {
                        // Ajax.
                        this.ajax( obj );
                    }
                } else {
                    obj._box.build( obj, null );
                }
            },
            create: function ( obj ) {
                var modal = obj._create({
                        id:                     'modal',
                        class:                  'modal ' + obj._box.effect( obj ) + ( obj.settings.customClass ? ' ' + obj.settings.customClass : '' )
                    }, {
                        'z-index':              ( isNaN( obj.settings.zIndex ) ? 10000 : obj.settings.zIndex + 1 )
                    }),
                    content = obj._create({
                        id:                     'modal-content',
                        class:                  'modal-content'
                    }, {
                        'transition-duration':  obj.settings.speed / 1000 + 's'
                    });

                modal.appendChild(content);

                // Insert modal just after the body.
                document.body.insertBefore(modal, document.body.firstChild);

                // Create overlay after the modal content.
                if ( obj.settings.overlay ) {
                    obj._overlay();
                }

                return [modal, content];
            },
            effect: function ( obj ) {
                var position = ['slide','flip','rotate'],
                    perspective = ['letmein','makeway','slip'],
                    effect = cb + '-' + obj.settings.effect;

                // Position.
                for ( var i = 0, len1 = position.length; i < len1; i++ ) {
                    if ( position[i] === obj.settings.effect ) {
                        effect = cb + '-' + obj.settings.effect + '-' + obj.settings.position;
                    }
                }

                // HTML head.
                for ( var x = 0, len2 = perspective.length; x < len2; x++ ) {
                    if ( perspective[x] === obj.settings.effect ) {

                        // Add class.
                        obj._addClass( document.getElementsByTagName( 'html' )[0], 'perspective' );

                        var div = document.createElement('div');
                            div.className = cb + '-container';

                        // Move the body's children into this wrapper
                        while ( document.body.firstChild ) {
                            div.appendChild(document.body.firstChild);
                        }

                        // Append the wrapper to the body
                        document.body.appendChild(div);
                    }
                }

                return effect;

            },
            build: function ( obj, modal ) {

                if ( obj.settings.error !== false && typeof obj.settings.error === 'string' ) {
                    // If is null, show message error.
                    if ( modal === null ) {
                        modal = document.createElement('div');
                        obj._addClass( modal, 'error' );
                        modal.innerHTML = obj.settings.error;
                    }

                    var tmp = obj._box.create( obj );

                    // Insert content to the modal.
                    tmp[1].appendChild(modal);

                    // Show the content.
                    modal.style.display = 'block';

                    // Temporal sizes.
                    var tmpSize = {
                        width:  parseInt(obj.settings.width, 0),
                        height: parseInt(obj.settings.height, 0)
                    };

                    // Check width: If it is a number and if not null.
                    if ( !isNaN( tmpSize.width ) && tmpSize.width === obj.settings.width && tmpSize.width.toString() === obj.settings.width.toString() && tmpSize.width !== null ) {
                        modal.style.width = tmpSize.width + 'px';
                    }

                    // Check height: If it is a number   and if not null.
                    if ( !isNaN( tmpSize.height ) && tmpSize.height === obj.settings.height && tmpSize.height.toString() === obj.settings.height.toString() && tmpSize.height !== null ) {
                        modal.style.height = tmpSize.height + 'px';
                    }

                    // Show modal.
                    setTimeout( function () {

                        // Init listeners.
                        obj._listeners();

                        // Show modal.
                        tmp[0].className += ' ' + cb + '-show';

                        setTimeout( function () {
                            // Check if callback 'complete'.
                            if ( obj.settings.complete && typeof obj.settings.complete === 'function' ) {
                                obj.settings.complete( undefined !== arguments[0] ? arguments[0] : '' );
                            }
                        }, obj.settings.speed );

                    }, ( obj.settings.overlay ? obj.settings.overlaySpeed : 200 ) );
                }
            },
            ajax: function ( obj ) {
                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    var completed = 4;
                    if( xhr.readyState === completed ) {
                        if( xhr.status === 200 ) {

                            var modal = document.createElement('div');
                            modal.innerHTML = xhr.responseText;

                            obj._box.build( obj, modal );

                        } else {
                            obj._box.build( obj, null );
                        }
                    }
                };
                xhr.open('GET', obj.settings.url + ( !obj.settings.cache ? '?_=' + new Date().getTime() : '' ), true);
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                xhr.send(null);
            }
        },
        _close: function () {
            var obj = this,
                d = document;
                obj._removeClass( d.getElementsByClassName(cb + '-modal')[0], cb + '-show' );
                obj._removeClass( d.getElementsByTagName( 'html' )[0], cb + '-perspective' );

            setTimeout( function () {
                obj._removeClass( d.getElementsByTagName( 'html' )[0], cb + '-html' );
                obj._removeClass( d.getElementsByTagName( 'body' )[0], cb + '-scrollbar' );

                // Remove modal.
                obj._remove( d.getElementsByClassName(cb + '-modal')[0] );

                // Remove overlay.
                if ( obj.settings.overlay ) {
                    obj._remove(d.getElementsByClassName(cb + '-overlay')[0]);
                }

                // Check if callback 'close'.
                if ( obj.settings.close && typeof obj.settings.close === 'function' ) {
                    obj.settings.close( undefined !== arguments[0] ? arguments[0] : '' );
                }
            }, obj.settings.speed );
        },
        _listeners: function () {
            var obj = this;

            // Listener overlay.
            if ( typeof document.getElementsByClassName(cb + '-overlay')[0] !== 'undefined' && obj.settings.overlayClose ) {
                document.getElementsByClassName( cb + '-overlay' )[0].addEventListener('click', function () {
                    obj._close();
                }, false );
            }

            // Listener on tab key esc.
            if ( obj.settings.escKey ) {
                document.onkeydown = function ( evt ) {
                    evt = evt || window.event;
                    if ( evt.keyCode === 27 ) {
                        obj._close();
                    }
                };
            }

            // Listener on element close.
            if ( obj.settings.eClose !== null && typeof obj.settings.eClose === 'string' && obj.settings.eClose.charAt(0) === '#' || typeof obj.settings.eClose === 'string' && obj.settings.eClose.charAt(0) === '.' && document.querySelector(obj.settings.eClose) ) {
                document.querySelector(obj.settings.eClose).addEventListener('click', function () {
                    obj._close();
                }, false );
            }
        },
        /*
         ----------------------------
         Utilities
         ----------------------------
         */
        _extend: function () {
            for( var i = 1, arg = arguments.length; i < arg; i++ ) {
                for( var key in arguments[i] ) {
                    if( arguments[i].hasOwnProperty(key) ) {
                        arguments[0][key] = arguments[i][key];
                    }
                }
            }
            return arguments[0];
        },
        _create: function ( attr, style, element ) {
            var div = ( element === undefined || element === null ? document.createElement('div') : element );

            if (  attr !== null ) {
                // Add the id.
                if ( attr.id !== null ) {
                    div.id = cb + '-' + attr.id + new Date().getTime();
                }

                // Add the class.
                if ( attr.class !== null ) {
                    this._addClass( div, attr.class );
                }
            }

            if ( style !== null ) {

                // Loop with styles (obj).
                for ( var obj in style ) {
                    if ( style.hasOwnProperty(obj) ) {
                        // Insert styles.
                        div.style.setProperty( obj, style[obj], null );

                        if ( obj === 'transition-duration' ) {

                            var prefix = [ '-webkit-', '-moz-', '-o-', '-cb-' ];

                            // Insert prefix.
                            for ( var x = 0, pre = prefix.length; x < pre; x++ ) {
                                div.style.setProperty( prefix[x] + obj, style[obj], null );
                            }
                        }
                    }
                }
            }

            return div;
        },
        _hexToRgb: function ( hex ) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF") - http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },
        _addClass: function ( element, eClass ) {
            if ( !this._hasClass( element, eClass ) ) {
                element.className = ( element.className.length ? element.className + ' ' + cb + '-' + eClass : cb + '-' + eClass );
            }
        },
        _removeClass: function ( element, eClass ) {
            if ( this._hasClass( element, eClass ) ) {
                var reg = new RegExp('(\\s|^)' + eClass + '(\\s|$)');
                element.className = element.className.replace(reg,' ');
            }
        },
        _hasClass: function ( element, eClass ) {
            return ( element !== undefined ? element.className.match(new RegExp('(\\s|^)' + eClass + '(\\s|$)')) : false );
        },
        _remove: function ( element ) {
            if ( element !== undefined ) {
                element.parentNode.removeChild(element);
            }
        },
        /*
         ----------------------------
         Public methods
         ----------------------------
         */
        close: function () {
            this._close();
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations with jQuery.
    $.fn[ cb ] = function ( options ) {
        var args = arguments;

        if ( options === undefined || typeof options === 'object' ) {
            if ( args.length > 1 ) {
                $(options).each( function () {
                    $.data( this, cb, new Plugin( this, args[1] ) );
                });
            } else {
                new Plugin( null, args[0] );
            }
        } else if ( typeof options === 'string' && options === 'close' ) {
            $.data( this, cb, new Plugin( args[0], args[1] ) );
        }

    };

})( jQuery, window, document );