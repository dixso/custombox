var Custombox = (function () {
    'use strict';
    /*
     ----------------------------
     Cache
     ----------------------------
     */
    var _cache = {
        w:          window,
        d:          document,
        h:          document.documentElement,
        b:          document.body,
        qS:         document.querySelector,
        create:     document.createElement,
        settings:   [],
        overlay:    [],
        wrapper:    [],
        container:  [],
        modal:      [],
        content:    [],
        inline:     [],
        size:       [],
        close:      [],
        open:       [],
        scroll:     [],
        item:       -1
    },
    /*
     ----------------------------
     Settings
     ----------------------------
     */
    _defaults = {
        target:         null,       // Set the URL, ID or Class.
        cache:          false,      // If set to false, it will force requested pages not to be cached by the browser only when send by AJAX.
        escKey:         true,       // Allows the user to close the modal by pressing 'ESC'.
        zIndex:         'auto',     // Overlay z-index: Auto or number.
        overlay:        true,       // Show the overlay.
        overlayColor:   '#000',     // Overlay color.
        overlayOpacity: 0.8,        // The overlay opacity level. Range: 0 to 1.
        overlayClose:   true,       // Allows the user to close the modal by clicking the overlay.
        overlaySpeed:   300,        // Sets the speed of the overlay, in milliseconds.
        overlayEffect:  'auto',     // fadein | letmein.
        width:          null,       // Set a fixed total width.
        effect:         'fadein',   // fadein | slide | newspaper | fall | sidefall | blur | flip | sign | superscaled | slit | rotate | letmein | makeway | slip | corner | slidetogether | scale | door | push | contentscale.
        position:       null,       // Only with effects: slide, flip and rotate. (top, right, bottom, left and center) | (vertical or horizontal) and output position separated by commas. Ex: 'top, bottom'.
        speed:          500,        // Sets the speed of the transitions, in milliseconds.
        open:           null,       // Callback that fires right before begins to open.
        complete:       null,       // Callback that fires right after loaded content is displayed.
        close:          null        // Callback that fires once is closed.
    },
    /*
     ----------------------------
     Config
     ----------------------------
     */
    _config = {
        isIE:               navigator.appVersion.indexOf('MSIE 8.') > -1 || navigator.appVersion.indexOf('MSIE 9.') > -1,
        overlay: {
            perspective:    ['letmein', 'makeway', 'slip'],
            together:       ['corner', 'slidetogether', 'scale', 'door', 'push', 'contentscale', 'simplegenie', 'slit']
        },
        modal: {
            position:       ['slide', 'flip', 'rotate']
        }
    },
    /*
     ----------------------------
     Private methods
     ----------------------------
     */
    _private = {
        /*
         ----------------------------
         Init
         ----------------------------
         */
        init: function () {
            this
                .merge()
                .built()
                .check()
                .binds();
        },
        merge: function () {
            _cache.item++;

            // Merge objects.
            _cache.settings.push(_utilities.extend( {}, _defaults, _cache.options ));
            delete _cache.options;

            if ( _cache.settings[_cache.item].overlayEffect === 'auto' ) {
                _cache.settings[_cache.item].overlayEffect = _cache.settings[_cache.item].effect;
            }

            return this;
        },
        built: function () {
            // Get zIndex.
            var zIndex = _utilities.zIndex();

            // Add class open.
            _cache.h.classList.add('custombox-open', 'custombox-open-' + _cache.settings[_cache.item].overlayEffect);

            // Add class perspective.
            if ( _config.overlay.perspective.indexOf( _cache.settings[_cache.item].overlayEffect ) > -1 ) {
                _cache.scroll.push(_cache.h && _cache.h.scrollTop || _cache.b && _cache.b.scrollTop || 0);
                _cache.h.classList.add('custombox-perspective');
                _cache.w.scrollTo(0, 0);
            }

            // Container
            if ( typeof _cache.main === 'undefined' ) {
                _cache.main = _cache.create.call(_cache.d, 'div');
                _cache.main.classList.add(
                    'custombox-container',
                    'custombox-container-' + _cache.settings[_cache.item].overlayEffect
                );
                while ( _cache.b.firstChild ) {
                    _cache.main.appendChild(_cache.b.firstChild);
                }
                _cache.b.appendChild(_cache.main);

                if ( _cache.settings[_cache.item].overlayEffect === 'push' ) {
                    _cache.main.style.transitionDuration = _cache.settings[_cache.item].speed + 'ms';
                }
            } else {
                _cache.main.classList.add(
                    'custombox-container-' + _cache.settings[_cache.item].overlayEffect
                );
            }

            // Overlay.
            if ( _cache.settings[_cache.item].overlay ) {
                _cache.overlay.push(_cache.create.call(_cache.d, 'div'));
                _cache.overlay[_cache.item].classList.add(
                    'custombox-overlay',
                    'custombox-overlay-' + _cache.settings[_cache.item].overlayEffect
                );
                _cache.overlay[_cache.item].style.zIndex = zIndex + 1;
                _cache.overlay[_cache.item].style.backgroundColor = _cache.settings[_cache.item].overlayColor;

                // Add class perspective.
                if ( _config.overlay.perspective.indexOf( _cache.settings[_cache.item].overlayEffect ) > -1 || _config.overlay.together.indexOf( _cache.settings[_cache.item].overlayEffect ) > -1 ) {
                    _cache.overlay[_cache.item].style.opacity = _cache.settings[_cache.item].overlayOpacity;
                } else {
                    _cache.overlay[_cache.item].classList.add('custombox-overlay-default');
                }

                if ( _config.overlay.together.indexOf( _cache.settings[_cache.item].overlayEffect ) > -1 ) {
                    _cache.overlay[_cache.item].style.transitionDuration = _cache.settings[_cache.item].speed + 'ms';
                } else {
                    _cache.overlay[_cache.item].style.transitionDuration = _cache.settings[_cache.item].overlaySpeed + 'ms';
                }

                // Append overlay in to the DOM.
                _cache.b.insertBefore(_cache.overlay[_cache.item], _cache.b.lastChild.nextSibling);
            }

            // Modal
            _cache.wrapper.push(_cache.create.call(_cache.d, 'div'));
            _cache.wrapper[_cache.item].classList.add(
                'custombox-modal-wrapper',
                'custombox-modal-wrapper-' + _cache.settings[_cache.item].effect
            );
            _cache.wrapper[_cache.item].style.zIndex = zIndex + 2;
            _cache.b.insertBefore(_cache.wrapper[_cache.item], _cache.b.firstChild);

            _cache.container.push(_cache.create.call(_cache.d, 'div'));
            _cache.container[_cache.item].classList.add(
                'custombox-modal-container',
                'custombox-modal-container-' + _cache.settings[_cache.item].effect
            );
            _cache.container[_cache.item].style.zIndex = zIndex + 3;

            // Position.
            if ( _config.modal.position.indexOf( _cache.settings[_cache.item].effect ) > -1 ) {
                if ( _cache.settings[_cache.item].position !== null ) {
                    if ( _cache.settings[_cache.item].position.indexOf(',') > -1 ) {
                        // Convert the string to array.
                        _cache.settings[_cache.item].position = _cache.settings[_cache.item].position.split(',');
                    } else {
                        _cache.settings[_cache.item].position = [_cache.settings[_cache.item].position];
                    }
                } else {
                    // Defaults.
                    if ( _cache.settings[_cache.item].effect === 'slide' ) {
                        _cache.settings[_cache.item].position = ['top'];
                    } else if ( _cache.settings[_cache.item].effect === 'flip' ) {
                        _cache.settings[_cache.item].position = ['horizontal'];
                    } else {
                        _cache.settings[_cache.item].position = ['bottom'];
                    }
                }
            }

            _cache.modal.push(_cache.create.call(_cache.d, 'div'));
            _cache.modal[_cache.item].classList.add(
                'custombox-modal',
                'custombox-modal-' + _cache.settings[_cache.item].effect + ( _config.modal.position.indexOf( _cache.settings[_cache.item].effect ) > -1 ? '-' + _cache.settings[_cache.item].position[0].trim() : '' )
            );
            _cache.modal[_cache.item].style.transitionDuration = _cache.settings[_cache.item].speed + 'ms';
            _cache.modal[_cache.item].style.zIndex = zIndex + 4;
            _cache.wrapper[_cache.item].appendChild(_cache.container[_cache.item]).appendChild(_cache.modal[_cache.item]);

            return this;
        },
        check: function () {
            // Check if callback 'open'.
            if ( typeof _cache.settings[_cache.item].open === 'function' ) {
                _cache.settings[_cache.item].open.call();
            }

            if ( _cache.settings[_cache.item].target.charAt(0) === '#' || _cache.settings[_cache.item].target.charAt(0) === '.' ) {
                if ( _cache.qS.call(_cache.d, _cache.settings[_cache.item].target) ) {
                    _cache.inline.push(_cache.create.call(_cache.d, 'div'));
                    _cache.content.push(_cache.qS.call(_cache.d, _cache.settings[_cache.item].target));
                    _cache.content[_cache.item].style.display = 'block';
                    _cache.content[_cache.item].parentNode.insertBefore(_cache.inline[_cache.item], _cache.content[_cache.item]);
                    this.size().open();
                } else {
                    this.error();
                }
            } else {
                this.ajax();
            }
            return this;
        },
        ajax: function () {
            var _this = this,
                xhr = new XMLHttpRequest(),
                modal = _cache.create.call(_cache.d, 'div');
            xhr.onreadystatechange = function () {
                if( xhr.readyState === 4 ) {
                    if( xhr.status === 200 ) {
                        modal.innerHTML = xhr.responseText;
                        _cache.content.push( ( modal.childNodes.length === 3 ? modal.childNodes[2] : modal ));
                        _cache.content[_cache.item].style.display = 'block';
                        _cache.container[_cache.item].appendChild(_cache.content[_cache.item]);
                        _this.size().open();
                    } else {
                        _this.error();
                    }
                }
            };
            xhr.open('GET', _cache.settings[_cache.item].target + ( !_cache.settings[_cache.item].cache ? '?_=' + Date.now() : '' ), true);
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.send(null);
        },
        size: function () {
            var w = _cache.content[_cache.item].offsetWidth,
                h = _cache.content[_cache.item].offsetHeight;

            // Check width.
            if ( !isNaN( _cache.settings[_cache.item].width ) && _cache.settings[_cache.item].width !== null ) {
                w = parseInt( _cache.settings[_cache.item].width, 0);
            }

            // Storage.
            _cache.size.push(w);

            if ( _cache.size[_cache.item] + 60 >= _cache.w.innerWidth ) {
                _cache.container[_cache.item].style.width = 'auto';
                _cache.container[_cache.item].style.margin = '5%';
            } else {
                _cache.container[_cache.item].style.width = _cache.size[_cache.item] + 'px';
            }

            _cache.content[_cache.item].style.width = 'auto';
            _cache.modal[_cache.item].appendChild(_cache.content[_cache.item]);

            // Height.
            if ( _cache.content[_cache.item].offsetHeight >= _cache.w.innerHeight ) {
                _cache.container[_cache.item].style.marginTop = '5%';
                _cache.container[_cache.item].style.marginBottom = '5%';
            } else {
                _cache.container[_cache.item].style.marginTop = _cache.w.innerHeight / 2 - _cache.content[_cache.item].offsetHeight / 2 + 'px';
            }

            return this;
        },
        open: function () {
            if ( _cache.settings[_cache.item].overlay ) {
                if ( _config.overlay.perspective.indexOf(_cache.settings[_cache.item].overlayEffect) > -1 || _config.overlay.together.indexOf( _cache.settings[_cache.item].overlayEffect ) > -1 ) {
                    // Add class perspective.
                    _cache.overlay[_cache.item].classList.add('custombox-overlay-open');
                } else {
                    _cache.overlay[_cache.item].style.opacity = _cache.settings[_cache.item].overlayOpacity;
                }

                _cache.main.classList.add('custombox-container-open');

                if ( _config.overlay.together.indexOf( _cache.settings[_cache.item].overlayEffect ) > -1 ) {
                    _cache.wrapper[_cache.item].classList.add('custombox-modal-open');
                } else {
                    _cache.overlay[_cache.item].addEventListener('transitionend', function ( event ) {
                        if ( ( event.propertyName === 'transform' || event.propertyName === '-webkit-transform' || event.propertyName === 'transform-origin' || event.propertyName === 'opacity' || event.propertyName.match('^-webkit-transform-origin') ) && _cache.close[_cache.item] === undefined ) {
                            _cache.wrapper[_cache.item].classList.add('custombox-modal-open');
                        }
                    }, false);
                }
            } else {
                _cache.wrapper[_cache.item].classList.add('custombox-modal-open');
                _cache.main.classList.add('custombox-container-open');
            }
            return this;
        },
        binds: function () {
            var _this = this;

            // Esc.
            if ( _cache.settings[_cache.item].escKey ) {
                _cache.d.onkeydown = function ( event ) {
                    event = event || _cache.w.event;
                    if ( event.keyCode === 27 ) {
                        _this.close();
                    }
                };
            }

            // Overlay close.
            if ( _cache.settings[_cache.item].overlayClose ) {
                _cache.wrapper[_cache.item].addEventListener('click', function ( event ) {
                    if ( event.target === _cache.wrapper[_cache.item] && _cache.close[_cache.item] === undefined ) {
                        _this.close();
                    }
                }, false);
            }

            // Listener responsive.
            _cache.w.addEventListener('onorientationchange' in _cache.w ? 'orientationchange' : 'resize', function () {
                _this.responsive();
            }, false);

            // Callback oncomplete.
            _cache.wrapper[_cache.item].addEventListener('transitionend', function ( event ) {
                if ( ( event.propertyName === 'transform' || event.propertyName === '-webkit-transform' || event.propertyName === 'opacity' ) && _cache.open[_cache.item] === undefined ) {
                    _cache.open[_cache.item] = true;
                    if ( _cache.settings[_cache.item] && typeof _cache.settings[_cache.item].complete === 'function' ) {
                        _cache.settings[_cache.item].complete.call();
                    }
                }
            }, false);
        },
        close: function () {
            var start = function () {
                _cache.h.classList.remove('custombox-open-' + _cache.settings[_cache.item].overlayEffect);

                if ( _cache.settings[_cache.item].overlay ) {
                    // Add class from overlay.
                    _cache.overlay[_cache.item].classList.add('custombox-overlay-close');

                    if ( _cache.overlay[_cache.item].style.opacity ) {
                        _cache.overlay[_cache.item].style.opacity = 0;
                    }

                    _cache.overlay[_cache.item].classList.remove('custombox-overlay-open');
                    _cache.main.classList.remove('custombox-container-open');

                    // Listener overlay.
                    if ( _config.isIE ) {
                        end();
                    } else {
                        _cache.overlay[_cache.item].addEventListener('transitionend', function ( event ) {
                            if ( ( event.propertyName === 'transform' || event.propertyName === '-webkit-transform' || event.propertyName === 'opacity' ) && _cache.close[_cache.item] === undefined ) {
                                end();
                            }
                        }, false );
                    }
                } else if ( _cache.close[_cache.item] === undefined ) {
                    if ( _config.isIE ) {
                        end();
                    } else {
                        _cache.modal[_cache.item].addEventListener('transitionend', function ( event ) {
                            if ( ( event.propertyName === 'transform' || event.propertyName === '-webkit-transform' || event.propertyName === 'opacity' ) && _cache.close[_cache.item] === undefined ) {
                                end();
                            }
                        });
                    }
                }
            },
            end = function () {
                // Remove classes from html tag.
                if ( !_cache.item ) {
                    _cache.h.classList.remove('custombox-perspective', 'custombox-open');
                    if ( typeof _cache.scroll[_cache.item] !== 'undefined' ) {
                        _cache.w.scrollTo(0, _cache.scroll[_cache.item]);
                    }
                }

                _cache.h.classList.remove('custombox-open-' + _cache.settings[_cache.item].overlayEffect);

                if ( _cache.inline[_cache.item] ) {
                    // Remove property width.
                    if ( _config.isIE ) {
                        _cache.content[_cache.item].removeAttribute('width');
                        _cache.content[_cache.item].removeAttribute('display');
                    } else {
                        _cache.content[_cache.item].style.removeProperty('width');
                        _cache.content[_cache.item].style.removeProperty('display');
                    }

                    // Insert restore div.
                    _cache.inline[_cache.item].parentNode.replaceChild(_cache.content[_cache.item], _cache.inline[_cache.item]);
                }

                _cache.main.classList.remove(
                    'custombox-container-' + _cache.settings[_cache.item].overlayEffect
                );

                // Remove modal.
                _cache.wrapper[_cache.item].parentNode.removeChild(_cache.wrapper[_cache.item]);

                // Remove overlay.
                if ( _cache.settings[_cache.item].overlay ) {
                    _cache.overlay[_cache.item].parentNode.removeChild(_cache.overlay[_cache.item]);
                    _cache.overlay.pop();
                }

                if ( typeof _cache.settings[_cache.item].close === 'function' ) {
                    _cache.settings[_cache.item].close.call();
                }

                // Remove items.
                _cache.wrapper.pop();
                _cache.close.pop();
                _cache.inline.pop();
                _cache.content.pop();
                _cache.container.pop();
                _cache.modal.pop();
                _cache.size.pop();
                _cache.settings.pop();
                _cache.scroll.pop();
                _cache.item--;
                _cache.close[_cache.item] = true;
            };

            if ( _cache.item > -1 ) {
                // Modal
                if ( _config.modal.position.indexOf( _cache.settings[_cache.item].effect ) > -1 && _cache.settings[_cache.item].position.length > 1 ) {
                    _cache.modal[_cache.item].classList.remove('custombox-modal-' + _cache.settings[_cache.item].effect + '-' + _cache.settings[_cache.item].position[0]);
                    _cache.modal[_cache.item].classList.add('custombox-modal-' + _cache.settings[_cache.item].effect + '-' + _cache.settings[_cache.item].position[1].trim());
                }

                // Remove classes.
                _cache.wrapper[_cache.item].classList.remove('custombox-modal-open');

                if ( _config.isIE || _config.overlay.together.indexOf( _cache.settings[_cache.item].overlayEffect ) > -1 ) {
                    start();
                } else {
                    // Listener overlay.
                    _cache.wrapper[_cache.item].addEventListener('transitionend', function ( event ) {
                        if ( event.propertyName === 'transform' || event.propertyName === '-webkit-transform' || event.propertyName === 'visibility' || event.propertyName === 'opacity' ) {
                            start();
                        }
                    }, false);
                }
            }
        },
        responsive: function () {
            for ( var i = 0, t = _cache.container.length; i < t; i++ ) {
                // Width.
                if ( _cache.size[i] + 60 >= _cache.w.innerWidth ) {
                    _cache.container[i].style.width = 'auto';
                    _cache.container[i].style.marginLeft = '5%';
                    _cache.container[i].style.marginRight = '5%';
                } else {
                    _cache.container[i].style.width = _cache.size[i] + 'px';
                    _cache.container[i].style.marginLeft = 'auto';
                    _cache.container[i].style.marginRight = 'auto';
                }

                // Height.
                if ( _cache.content[i].offsetHeight >= _cache.w.innerHeight ) {
                    _cache.container[i].style.marginTop = '5%';
                    _cache.container[i].style.marginBottom = '5%';
                } else {
                    _cache.container[i].style.marginTop = _cache.w.innerHeight / 2 - _cache.content[i].offsetHeight / 2 + 'px';
                }
            }
        },
        error: function () {
            alert('Error!');
        }
    },
    /*
     ----------------------------
     Utilities
     ----------------------------
     */
    _utilities = {
        /**
         * @desc Create dynamic external JavaScript file.
         * @param {string} url - URL to link the JavaScript file.
         * @param {function} callback - Callback function when is load.
         * @param {function} error - Callback function when an error.
         */
        script: function ( url, callback, error ) {
            // Adding the script tag to the head.
            var script = document.createElement('script');
            script.onload = script.onreadystatechange = function() {
                callback();
            };
            script.text = url;
            document.getElementsByTagName('head')[0].appendChild(script);
        },
        /**
         * @desc Get the highest z-index in the document.
         */
        zIndex: function () {
            if ( !window.getComputedStyle ) {
                window.getComputedStyle = function( el, pseudo ) {
                    this.el = el;
                    this.getPropertyValue = function(prop) {
                        var re = /(\-([a-z]){1})/g;
                        if (prop == 'float') prop = 'styleFloat';
                        if (re.test(prop)) {
                            prop = prop.replace(re, function () {
                                return arguments[2].toUpperCase();
                            });
                        }
                        return el.currentStyle[prop] ? el.currentStyle[prop] : null;
                    }
                    return this;
                }
            }
            var zIndex = 0;
            if ( isNaN ( _cache.settings[_cache.item].zIndex ) ) {
                for ( var x = 0, elements = _cache.d.getElementsByTagName('*'), xLen = elements.length; x < xLen; x += 1 ) {
                    var val = _cache.w.getComputedStyle(elements[x]).getPropertyValue('z-index');
                    if ( val ) {
                        val =+ val;
                        if ( val > zIndex ) {
                            zIndex = val;
                        }
                    }
                }
            } else {
                zIndex = _cache.settings[_cache.item].zIndex;
            }
            return zIndex;
        },
        /**
         * @desc Extend objects.
         */
        extend: function () {
            for ( var i = 1, arg = arguments.length; i < arg; i++ ) {
                for ( var key in arguments[i] ) {
                    if( arguments[i].hasOwnProperty(key) ) {
                        arguments[0][key] = arguments[i][key];
                    }
                }
            }
            return arguments[0];
        }
    };
    /*
     ----------------------------
     Public methods
     ----------------------------
     */
    return {
        /**
         * @desc Open Custombox.
         * @param {object} - Options.
         */
        open: function ( options ) {
            _cache.options = options;
            _private.init();
        },
        /**
         * @desc Close Custombox.
         */
        close: function () {
            _private.close();
        }
    };
})();