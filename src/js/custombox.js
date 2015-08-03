(function( global, factory ) {
    if ( typeof exports === 'object' && typeof module !== 'undefined' ) {
        module.exports = factory();
    } else if ( typeof define === 'function' && define.amd ) {
        define(factory);
    } else {
        global.Custombox = factory();
    }
}(this, function() {
    'use strict';
    /*
     ----------------------------
     Settings
     ----------------------------
     */
    var _defaults = {
        target:         null,                   // Set the URL, ID or Class.
        cache:          false,                  // If set to false, it will force requested pages not to be cached by the browser only when send by AJAX.
        escKey:         true,                   // Allows the user to close the modal by pressing 'ESC'.
        zIndex:         9999,                   // Overlay z-index: Auto or number.
        overlay:        true,                   // Show the overlay.
        overlayColor:   '#000',                 // Overlay color.
        overlayOpacity: 0.8,                    // The overlay opacity level. Range: 0 to 1.
        overlayClose:   true,                   // Allows the user to close the modal by clicking the overlay.
        overlaySpeed:   300,                    // Sets the speed of the overlay, in milliseconds.
        overlayEffect:  'auto',                 // Combine any of the effects.
        width:          null,                   // Set a fixed total width or 'full'.
        effect:         'fadein',               // fadein | slide | newspaper | fall | sidefall | blur | flip | sign | superscaled | slit | rotate | letmein | makeway | slip | corner | slidetogether | scale | door | push | contentscale | swell | rotatedown | flash.
        position:       ['center', 'center'],   // Set position of modal. First position 'x': left, center and right. Second position 'y': top, center, bottom.
        animation:      null,                   // Only with effects: slide, flip and rotate (top, right, bottom, left and center) | (vertical or horizontal) and output position. Example: ['top', 'bottom'].
        speed:          500,                    // Sets the speed of the transitions, in milliseconds.
        loading:        false,                  // Show loading.
        open:           null,                   // Callback that fires right before begins to open.
        complete:       null,                   // Callback that fires right after loaded content is displayed.
        close:          null                    // Callback that fires once is closed.
    },
    /*
     ----------------------------
     Config
     ----------------------------
     */
    _config = {
        oldIE:              navigator.appVersion.indexOf('MSIE 8.') > -1 || navigator.appVersion.indexOf('MSIE 9.') > -1,       // Check if is a old IE.
        oldMobile:          /(iPhone|iPad|iPod)\sOS\s6/.test(navigator.userAgent),                                              // Check if is a old browser mobile.
        overlay: {
            perspective:    ['letmein', 'makeway', 'slip'],                                                                     // Custom effects overlay.
            together:       ['corner', 'slidetogether', 'scale', 'door', 'push', 'contentscale', 'simplegenie', 'slit', 'slip'] // Animation together (overlay and modal).
        },
        modal: {
            position:       ['slide', 'flip', 'rotate'],                                                                        // Custom animation of the modal.
            animationend:   ['swell', 'rotatedown', 'flash']                                                                    // Type of animation.
        }
    },
    /*
     ----------------------------
     Private methods
     ----------------------------
     */
    _private = {
        set: function( val ) {
            if ( !this.cb || !this.cb.length ) {
                this.cb = [];
                this.item = -1;
            }

            this.item++;

            if ( val && val.zIndex === 'auto' ) {
                for ( var zIndex = 0, x = 0, elements = document.getElementsByTagName('*'), xLen = elements.length; x < xLen; x += 1 ) {
                    var value = window.getComputedStyle(elements[x]).getPropertyValue('z-index');
                    if ( value ) {
                        value =+ value;
                        if ( value > zIndex ) {
                            zIndex = value;
                        }
                    }
                }
                val.zIndex = zIndex;
            }

            this.cb.push({
                settings: _config.oldIE && typeof cbExtendObjects !== 'undefined' ? cbExtendObjects( {}, _defaults, val ) : Object.assign( {}, _defaults, val )
            });

            if ( this.cb[this.item].settings.overlayEffect === 'auto' ) {
                this.cb[this.item].settings.overlayEffect = this.cb[this.item].settings.effect;
            }
        },
        get: function() {
            return this.cb[this.cb.length - 1] || null;
        },
        init: function() {
            // Add class open.
            document.documentElement.classList.add('custombox-open');
            document.documentElement.classList.add('custombox-open-' + this.cb[this.item].settings.overlayEffect);

            // Add class perspective.
            if ( _config.overlay.perspective.indexOf( this.cb[this.item].settings.overlayEffect ) > -1 ) {
                this.cb[this.item].scroll = document.documentElement && document.documentElement.scrollTop || document.body && document.body.scrollTop || 0;
                document.documentElement.classList.add('custombox-perspective');
                window.scrollTo(0, 0);
            }

            // Create main.
            if ( !this.main ) {
                this.built('container');
            }

            // Create loading.
            if ( this.cb[this.item].settings.loading && this.cb[this.item].settings.loading.parent ) {
                this.built('loading');
            }

            // Create overlay.
            if ( this.cb[this.item].settings.overlay ) {
                this.built('overlay').built('modal').open();
            } else {
                this.built('modal').open();
            }

            // Listeners.
            this.binds();
        },
        zIndex: function() {
            for ( var zIndex = 0, x = 0, elements = document.getElementsByTagName('*'), xLen = elements.length; x < xLen; x += 1 ) {
                var val = window.getComputedStyle(elements[x]).getPropertyValue('z-index');
                if ( val ) {
                    val =+ val;
                    if ( val > zIndex ) {
                        zIndex = val;
                    }
                }
            }
            return zIndex;
        },
        built: function( item ) {
            var cb;
            if ( typeof this.item !== 'undefined' ) {
                cb = this.cb[this.item];
            }

            // Container.
            switch ( item ) {
                case 'container':
                    this.main = document.createElement('div');
                    while ( document.body.firstChild ) {
                        this.main.appendChild(document.body.firstChild);
                    }
                    document.body.appendChild(this.main);
                    break;
                case 'overlay':
                    if ( !cb.overlay ) {
                        cb.overlay = {};
                    }
                    cb.overlay = document.createElement('div');
                    cb.overlay.classList.add('custombox-overlay');
                    cb.overlay.classList.add('custombox-overlay-' + cb.settings.overlayEffect);
                    cb.overlay.style.zIndex = cb.settings.zIndex + 2;
                    cb.overlay.style.backgroundColor = cb.settings.overlayColor;

                    // Add class perspective.
                    if ( _config.overlay.perspective.indexOf( cb.settings.overlayEffect ) > -1 || _config.overlay.together.indexOf( cb.settings.overlayEffect ) > -1 ) {
                        cb.overlay.style.opacity = cb.settings.overlayOpacity;
                    } else {
                        cb.overlay.classList.add('custombox-overlay-default');
                    }

                    if ( _config.overlay.together.indexOf( cb.settings.overlayEffect ) > -1 ) {
                        cb.overlay.style.transitionDuration = cb.settings.speed + 'ms';
                    } else {
                        cb.overlay.style.transitionDuration = cb.settings.overlaySpeed + 'ms';
                    }

                    // Append overlay in to the DOM.
                    document.body.insertBefore(cb.overlay, document.body.lastChild.nextSibling);
                    break;
                case 'modal':
                    if ( cb.settings.overlayEffect === 'push' ) {
                        this.main.style.transitionDuration = cb.settings.speed + 'ms';
                    }

                    this.main.classList.add('custombox-container');
                    this.main.classList.add('custombox-container-' + cb.settings.overlayEffect);

                    cb.wrapper = document.createElement('div');
                    cb.wrapper.classList.add('custombox-modal-wrapper');
                    cb.wrapper.classList.add('custombox-modal-wrapper-' + cb.settings.effect);
                    cb.wrapper.style.zIndex = cb.settings.zIndex + 3;
                    document.body.insertBefore(cb.wrapper, document.body.lastChild.nextSibling);

                    cb.container = document.createElement('div');
                    cb.container.classList.add('custombox-modal-container');
                    cb.container.classList.add('custombox-modal-container-' + cb.settings.effect);
                    cb.container.style.zIndex = cb.settings.zIndex + 4;

                    if ( _config.modal.position.indexOf(cb.settings.effect) > -1 && cb.settings.animation === null ) {
                        // Defaults.
                        if ( cb.settings.effect === 'slide' ) {
                            cb.settings.animation = ['top'];
                        } else if ( cb.settings.effect === 'flip' ) {
                            cb.settings.animation = ['horizontal'];
                        } else {
                            cb.settings.animation = ['bottom'];
                        }
                    }

                    cb.modal = document.createElement('div');
                    cb.modal.classList.add('custombox-modal');
                    cb.modal.classList.add(
                        'custombox-modal-' + cb.settings.effect + ( _config.modal.position.indexOf( cb.settings.effect ) > -1 ? '-' + cb.settings.animation[0].trim() : '' )
                    );
                    cb.modal.style.transitionDuration = cb.settings.speed + 'ms';
                    cb.modal.style.zIndex = cb.settings.zIndex + 4;
                    cb.wrapper.appendChild(cb.container).appendChild(cb.modal);
                    break;
                case 'loading':
                    this.loading = document.createElement('div');
                    this.loading.classList.add('custombox-loading');

                    var wrapper = document.createElement('div');
                    for ( var i = 0, t = this.cb[this.item].settings.loading.parent.length; i < t; i++ ) {
                        wrapper.classList.add(this.cb[this.item].settings.loading.parent[i]);
                    }

                    this.loading.appendChild(wrapper);
                    this.loading.style.zIndex = cb.settings.zIndex + 3;

                    if ( this.cb[this.item].settings.loading.childrens ) {
                        for ( var e = 0, te = this.cb[this.item].settings.loading.childrens.length; e < te; e++ ) {
                            var tmp = document.createElement('div');
                            for ( var r = 0, tr = this.cb[this.item].settings.loading.childrens[e].length; r < tr; r++ ) {
                                tmp.classList.add(this.cb[this.item].settings.loading.childrens[e][r]);
                            }
                            wrapper.appendChild(tmp);
                        }
                    }

                    document.body.appendChild(this.loading);
                    break;
            }

            return this;
        },
        load: function() {
            var cb = this.cb[this.item];

            // Check if callback 'open'.
            if ( typeof cb.settings.open === 'function' ) {
                cb.settings.open.call();
            }

            // Trigger open.
            if ( document.createEvent ) {
                var topen = document.createEvent('Event');
                topen.initEvent('custombox.open', true, true);
                document.dispatchEvent(topen);
            }

            // Convert the string to array.
            if ( cb.settings.target !== null && Array.isArray(cb.settings.position) ) {
                if ( cb.settings.target.charAt(0) === '#' || ( cb.settings.target.charAt(0) === '.' && cb.settings.target.charAt(1) !== '/' ) ) {
                    if ( document.querySelector(cb.settings.target) ) {
                        cb.inline = document.createElement('div');
                        cb.content = document.querySelector(cb.settings.target);
                        cb.display = cb.content.style.display === 'none';
                        cb.content.style.display = 'block';
                        cb.content.parentNode.insertBefore(cb.inline, cb.content);
                        this.size();
                    } else {
                        this.error();
                    }
                } else {
                    this.ajax();
                }
            } else {
                this.error();
            }
            return this;
        },
        size: function() {
            var cb = this.cb[this.item],
                customw = cb.content.offsetWidth;

            if ( _config.oldIE ) {
                window.innerHeight = document.documentElement.clientHeight;
            }

            if ( !cb.inline ) {
                if ( _config.oldIE ) {
                    cb.content.style.styleFloat = 'none';
                } else {
                    cb.content.style.cssFloat = 'none';
                }
            }

            // Check width.
            if ( cb.settings.width !== null ) {
                if ( !isNaN( cb.settings.width ) ) {
                    customw = parseInt( cb.settings.width, 0);
                } else {
                    customw = window.innerWidth;
                    cb.content.style.height = window.innerHeight + 'px';
                }
            }

            // Storage.
            cb.size = customw;

            // Width.
            if ( cb.size + 60 >= window.innerWidth ) {
                cb.container.style.width = 'auto';
                if ( cb.settings.width !== 'full' ) {
                    cb.container.style.margin = '5%';
                }
                cb.wrapper.style.width = window.innerWidth + 'px';
                for ( var i = 0, elements = cb.content.querySelectorAll(':scope > *'), t = elements.length; i < t; i++ ) {
                    if ( elements[i].offsetWidth > window.innerWidth ) {
                        elements[i].style.width = 'auto';
                    }
                }
            } else {
                switch ( cb.settings.position[0].trim() ) {
                    case 'left':
                        cb.container.style.marginLeft = 0;
                        break;
                    case 'right':
                        cb.container.style.marginRight = 0;
                        break;
                }
                cb.container.style.width = cb.size + 'px';
            }

            cb.content.style.width = 'auto';
            cb.modal.appendChild(cb.content);

            // Top.
            if ( cb.content.offsetHeight >= window.innerHeight && cb.settings.width !== 'full' ) {
                cb.container.style.marginTop = '5%';
                cb.container.style.marginBottom = '5%';
            } else {
                var result;
                switch ( cb.settings.position[1].trim() ) {
                    case 'top':
                        result = 0;
                        break;
                    case 'bottom':
                        result = window.innerHeight - cb.content.offsetHeight + 'px';
                        break;
                    default:
                        result = window.innerHeight / 2 - cb.content.offsetHeight / 2 + 'px';
                        break;
                }
                cb.container.style.marginTop = result;
            }

            if ( this.loading ) {
                document.body.removeChild(this.loading);
                delete this.loading;
            }
            cb.wrapper.classList.add('custombox-modal-open');
        },
        ajax: function() {
            var _this = this,
                cb = _this.cb[_this.item],
                xhr = new XMLHttpRequest(),
                modal = document.createElement('div');

            xhr.onreadystatechange = function() {
                if ( xhr.readyState === 4 ) {
                    if( xhr.status === 200 ) {
                        modal.innerHTML = xhr.responseText;
                        cb.content = modal;
                        cb.content.style.display = 'block';
                        if ( _config.oldIE ) {
                            cb.content.style.styleFloat = 'left';
                        } else {
                            cb.content.style.cssFloat = 'left';
                        }
                        cb.container.appendChild(cb.content);
                        _this.size();
                    } else {
                        _this.error();
                    }
                }
            };
            xhr.open('GET', cb.settings.target + ( cb.settings.cache ? '' : ( /[?].+=/.test(cb.settings.target) ? '&_=' : '?_=' ) + Date.now() ), true);
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.send(null);
        },
        scrollbar: function() {
            var scrollDiv = document.createElement('div');
            scrollDiv.classList.add('custombox-scrollbar');
            document.body.appendChild(scrollDiv);
            var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
            return scrollbarWidth;
        },
        open: function() {
            var _this = this,
                cb = _this.cb[_this.item],
                scrollbar = _this.scrollbar();

            if ( scrollbar ) {
                document.body.style.paddingRight = scrollbar + 'px';
            }

            _this.main.classList.add('custombox-container-open');

            if ( cb.settings.overlay ) {
                if ( _config.overlay.perspective.indexOf(cb.settings.overlayEffect) > -1 || _config.overlay.together.indexOf( cb.settings.overlayEffect ) > -1 ) {
                    // Add class perspective.
                    cb.overlay.classList.add('custombox-overlay-open');
                } else {
                    cb.overlay.style.opacity = cb.settings.overlayOpacity;
                }

                if ( _config.overlay.together.indexOf( cb.settings.overlayEffect ) > -1 || _config.oldIE ) {
                    // Load target.
                    _this.load();

                    if ( cb.inline) {
                        cb.wrapper.classList.add('custombox-modal-open');
                    }
                } else {
                    var open = function() {
                        cb.overlay.removeEventListener('transitionend', open);

                        // Load target.
                        _this.load();

                        if ( cb.inline) {
                            cb.wrapper.classList.add('custombox-modal-open');
                        }
                    };
                    cb.overlay.addEventListener('transitionend', open, false);
                }
            } else {
                // Load target.
                _this.load();

                if ( cb.inline) {
                    cb.wrapper.classList.add('custombox-modal-open');
                }
            }
            return _this;
        },
        clean: function( item ) {
            var _this = this,
                cb = this.cb[item];

            document.documentElement.classList.remove('custombox-open-' + cb.settings.overlayEffect);

            if ( cb.settings.overlay ) {
                if ( cb.overlay.style.opacity ) {
                    cb.overlay.style.opacity = 0;
                }

                cb.overlay.classList.remove('custombox-overlay-open');
                _this.main.classList.remove('custombox-container-open');
            }

            // Listener overlay.
            if ( _config.oldIE || _config.oldMobile || !cb.overlay ) {
                _this.remove(item);
            } else {
                var overlay = function() {
                    cb.overlay.removeEventListener('transitionend', overlay);
                    _this.remove(item);
                };
                cb.overlay.addEventListener('transitionend', overlay, false);
            }
        },
        remove: function( item ) {
            var _this = this,
                cb = this.cb[item];

            // Remove classes from html tag.
            if ( _this.cb.length === 1 ) {
                document.documentElement.classList.remove('custombox-open', 'custombox-perspective');
                if ( _this.scrollbar() ) {
                    document.body.style.paddingRight = 0;
                }

                if ( typeof cb.scroll !== 'undefined' ) {
                    window.scrollTo(0, cb.scroll);
                }
            }

            if ( cb.inline ) {
                // Remove property width and display.
                if ( _config.oldIE ) {
                    cb.content.style.removeAttribute('width');
                    cb.content.style.removeAttribute('height');
                    cb.content.style.removeAttribute('display');
                } else {
                    cb.content.style.removeProperty('width');
                    cb.content.style.removeProperty('height');
                    cb.content.style.removeProperty('display');
                }

                if ( cb.display ) {
                    cb.content.style.display = 'none';
                }

                // Insert restore div.
                cb.inline.parentNode.replaceChild(cb.content, cb.inline);
            }

            _this.main.classList.remove('custombox-container-' + cb.settings.overlayEffect);

            // Remove modal.
            cb.wrapper.parentNode.removeChild(cb.wrapper);

            // Remove overlay.
            if ( cb.settings.overlay ) {
                cb.overlay.parentNode.removeChild(cb.overlay);
            }

            // Callback close.
            if ( typeof cb.settings.close === 'function' ) {
                cb.settings.close.call();
            }

            // Trigger close.
            if ( document.createEvent ) {
                var tclose = document.createEvent('Event');
                tclose.initEvent('custombox.close', true, true);
                document.dispatchEvent(tclose);
            }

            // Unwrap.
            if ( _this.cb.length === 1 ) {
                for ( var contents = document.querySelectorAll('.custombox-container > *'), i = 0, t = contents.length; i < t; i++ ) {
                    document.body.insertBefore(contents[i], _this.main);
                }
                if ( _this.main.parentNode ) {
                    _this.main.parentNode.removeChild(_this.main);
                }
                delete _this.main;
            }

            // Remove items.
            _this.cb.splice(item, 1);
        },
        close: function( target ) {
            var _this = this,
                item;

            if ( target ) {
                for ( var i = 0, t = this.cb.length; i < t; i++ ) {
                    if ( this.cb[i].settings.target === target ) {
                        item = i;
                        break;
                    }
                }
            } else {
                item = _this.cb.length - 1;
            }

            var cb = _this.cb[item];

            // Modal
            if ( _config.modal.position.indexOf( cb.settings.effect ) > -1 && cb.settings.animation.length > 1 ) {
                cb.modal.classList.remove('custombox-modal-' + cb.settings.effect + '-' + cb.settings.animation[0]);
                cb.modal.classList.add('custombox-modal-' + cb.settings.effect + '-' + cb.settings.animation[1].trim());
            }

            // Remove classes.
            cb.wrapper.classList.remove('custombox-modal-open');

            if ( _config.oldIE || _config.oldMobile || _config.overlay.together.indexOf( cb.settings.overlayEffect ) > -1 ) {
                _this.clean(item);
            } else {
                // Listener wrapper.
                var wrapper = function() {
                    cb.wrapper.removeEventListener('transitionend', wrapper);
                    _this.clean(item);
                };

                if ( _config.modal.animationend.indexOf(cb.settings.effect) > -1 ) {
                    cb.wrapper.addEventListener('animationend', wrapper, false);
                } else {
                    cb.wrapper.addEventListener('transitionend', wrapper, false);
                }
            }
        },
        responsive: function() {
            if ( _config.oldIE ) {
                window.innerHeight = document.documentElement.clientHeight;
            }

            for ( var i = 0, t = this.cb.length, result; i < t; i++ ) {
                // Width.
                if ( this.cb[i].size + 60 >= window.innerWidth ) {
                    if ( this.cb[i].settings.width !== 'full' ) {
                        this.cb[i].container.style.marginLeft = '5%';
                        this.cb[i].container.style.marginRight = '5%';
                    }
                    this.cb[i].container.style.width = 'auto';
                    this.cb[i].wrapper.style.width = window.innerWidth + 'px';
                } else {
                    switch ( this.cb[i].settings.position[0].trim() ) {
                        case 'left':
                            this.cb[i].container.style.marginLeft = 0;
                            break;
                        case 'right':
                            this.cb[i].container.style.marginRight = 0;
                            break;
                        default:
                            this.cb[i].container.style.marginLeft = 'auto';
                            this.cb[i].container.style.marginRight = 'auto';
                            break;
                    }
                    this.cb[i].container.style.width = this.cb[i].size + 'px';
                    this.cb[i].wrapper.style.width = 'auto';
                }

                // Top.
                if ( this.cb[i].content.offsetHeight >= window.innerHeight && this.cb[i].settings.width !== 'full' ) {
                    this.cb[i].container.style.marginTop = '5%';
                    this.cb[i].container.style.marginBottom = '5%';
                } else {
                    switch ( this.cb[i].settings.position[1].trim() ) {
                        case 'top':
                            result = 0;
                            break;
                        case 'bottom':
                            result = window.innerHeight - this.cb[i].content.offsetHeight + 'px';
                            break;
                        default:
                            result = window.innerHeight / 2 - this.cb[i].content.offsetHeight / 2 + 'px';
                            break;
                    }
                    this.cb[i].container.style.marginTop = result;
                }
            }
        },
        binds: function() {
            var _this = this,
                cb = _this.cb[_this.item],
                stop = false;

            // Esc.
            if ( _this.cb.length === 1 ) {
                _this.esc = function( event ) {
                    if ( _this.cb.length === 1 ) {
                        document.removeEventListener('keydown', _this.esc);
                    }
                    event = event || window.event;
                    if ( !stop && event.keyCode === 27 && _this.get() && _this.get().settings.escKey ) {
                        stop = true;
                        _this.close();
                    }
                };
                document.addEventListener('keydown', _this.esc, false);

                // Listener responsive.
                window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', function() {
                    _this.responsive();
                }, false);
            }

            // Overlay close.
            cb.wrapper.event = function ( event ) {
                if ( _this.cb.length === 1 ) {
                    document.removeEventListener('keydown', cb.wrapper.event);
                }
                if ( !stop && event.target === cb.wrapper && _this.get() && _this.get().settings.overlayClose ) {
                    stop = true;
                    _this.close();
                }
            };
            cb.wrapper.addEventListener('click', cb.wrapper.event, false);

            document.addEventListener('custombox.close', function() {
                stop = false;
            });

            var callback = function() {
                // Execute the scripts.
                if ( !cb.inline ) {
                    for ( var i = 0, script = cb.modal.getElementsByTagName('script'), t = script.length; i < t; i++ ) {
                        new Function( script[i].text )();
                    }
                }

                if ( cb.settings && typeof cb.settings.complete === 'function' ) {
                    cb.settings.complete.call();
                }

                // Trigger complete.
                if ( document.createEvent ) {
                    var tcomplete = document.createEvent('Event');
                    tcomplete.initEvent('custombox.complete', true, true);
                    document.dispatchEvent(tcomplete);
                }
            };

            // Callback complete.
            var complete = function() {
                callback();
                cb.modal.removeEventListener('transitionend', complete);
            };

            if ( _config.oldIE || _config.oldMobile ) {
                setTimeout(function() {
                    callback();
                }, cb.settings.overlaySpeed);
            } else {
                if ( cb.settings.effect !== 'slit' ) {
                    cb.modal.addEventListener('transitionend', complete, false);
                } else {
                    cb.modal.addEventListener('animationend', complete, false);
                }
            }
        },
        error: function() {
            var _this = this,
                item = _this.cb.length - 1;

            alert('Error to load this target: ' + _this.cb[item].settings.target);
            _this.remove(item);
        }
    };

    return {
        /**
         * @desc Set options defaults.
         * @param {object} options - Auto built.
         */
        set: function( options ) {
            if ( options.autobuild ) {
                _private.built('container');
            }
        },
        /**
         * @desc Open Custombox.
         * @param {object} options - Options for the custombox.
         */
        open: function( options ) {
            _private.set(options);
            _private.init();
        },
        /**
         * @desc Close Custombox.
         * @param {string} options - Target.
         */
        close: function( target ) {
            _private.close(target);
        }
    };
}));