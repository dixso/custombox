/**
 * Add getComputedStyle support to elements
 */
(function ( w ) {
    if ( !w.getComputedStyle ) {
        w.getComputedStyle = function( el ) {
            this.el = el;
            this.getPropertyValue = function( prop ) {
                var re = /(\-([a-z]){1})/g;
                if ( prop == 'float' ) prop = 'styleFloat';
                if ( re.test(prop) ) {
                    prop = prop.replace(re, function () {
                        return arguments[2].toUpperCase();
                    });
                }
                return el.currentStyle[prop] ? el.currentStyle[prop] : null;
            };
            return this;
        };
    }
})(window);

/**
 * Add dataset support to elements
 * No globals, no overriding prototype with non-standard methods,
 *   handles CamelCase properly, attempts to use standard
 *   Object.defineProperty() (and Function bind()) methods,
 *   falls back to native implementation when existing
 * Inspired by http://code.eligrey.com/html5/dataset/
 *   (via https://github.com/adalgiso/html5-dataset/blob/master/html5-dataset.js )
 * Depends on Function.bind and Object.defineProperty/Object.getOwnPropertyDescriptor (shims below)
 * Licensed under the X11/MIT License
 */

// Inspired by https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Function/bind#Compatibility
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        'use strict';
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            FNOP = function () {},
            fBound = function () {
                return fToBind.apply(
                    this instanceof FNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments))
                );
            };

        FNOP.prototype = this.prototype;
        fBound.prototype = new FNOP();

        return fBound;
    };
}

/*
 * Xccessors Standard: Cross-browser ECMAScript 5 accessors
 * http://purl.eligrey.com/github/Xccessors
 * 
 * 2010-06-21
 * 
 * By Eli Grey, http://eligrey.com
 * 
 * A shim that partially implements Object.defineProperty,
 * Object.getOwnPropertyDescriptor, and Object.defineProperties in browsers that have
 * legacy __(define|lookup)[GS]etter__ support.
 * 
 * Licensed under the X11/MIT License
 *   See LICENSE.md
 */

// Removed a few JSLint options as Notepad++ JSLint validator complaining and 
//   made comply with JSLint; also moved 'use strict' inside function
/*jslint white: true, undef: true, plusplus: true,
 bitwise: true, regexp: true, newcap: true, maxlen: 90 */

/*! @source http://purl.eligrey.com/github/Xccessors/blob/master/xccessors-standard.js*/

(function () {
    'use strict';
    var ObjectProto = Object.prototype,
        defineGetter = ObjectProto.__defineGetter__,
        defineSetter = ObjectProto.__defineSetter__,
        lookupGetter = ObjectProto.__lookupGetter__,
        lookupSetter = ObjectProto.__lookupSetter__,
        hasOwnProp = ObjectProto.hasOwnProperty;

    if (defineGetter && defineSetter && lookupGetter && lookupSetter) {

        if (!Object.defineProperty) {
            Object.defineProperty = function (obj, prop, descriptor) {
                if (arguments.length < 3) { // all arguments required
                    throw new TypeError("Arguments not optional");
                }

                prop += ""; // convert prop to string

                if (hasOwnProp.call(descriptor, "value")) {
                    if (!lookupGetter.call(obj, prop) && !lookupSetter.call(obj, prop)) {
                        // data property defined and no pre-existing accessors
                        obj[prop] = descriptor.value;
                    }

                    if ((hasOwnProp.call(descriptor, "get") ||
                        hasOwnProp.call(descriptor, "set")))
                    {
                        // descriptor has a value prop but accessor already exists
                        throw new TypeError("Cannot specify an accessor and a value");
                    }
                }

                // can't switch off these features in ECMAScript 3
                // so throw a TypeError if any are false
                if (!(descriptor.writable && descriptor.enumerable &&
                    descriptor.configurable))
                {
                    throw new TypeError(
                        "This implementation of Object.defineProperty does not support" +
                        " false for configurable, enumerable, or writable."
                    );
                }

                if (descriptor.get) {
                    defineGetter.call(obj, prop, descriptor.get);
                }
                if (descriptor.set) {
                    defineSetter.call(obj, prop, descriptor.set);
                }

                return obj;
            };
        }

        if (!Object.getOwnPropertyDescriptor) {
            Object.getOwnPropertyDescriptor = function (obj, prop) {
                if (arguments.length < 2) { // all arguments required
                    throw new TypeError("Arguments not optional.");
                }

                prop += ""; // convert prop to string

                var descriptor = {
                        configurable: true,
                        enumerable  : true,
                        writable    : true
                    },
                    getter = lookupGetter.call(obj, prop),
                    setter = lookupSetter.call(obj, prop);

                if (!hasOwnProp.call(obj, prop)) {
                    // property doesn't exist or is inherited
                    return descriptor;
                }
                if (!getter && !setter) { // not an accessor so return prop
                    descriptor.value = obj[prop];
                    return descriptor;
                }

                // there is an accessor, remove descriptor.writable;
                // populate descriptor.get and descriptor.set (IE's behavior)
                delete descriptor.writable;
                descriptor.get = descriptor.set = undefined;

                if (getter) {
                    descriptor.get = getter;
                }
                if (setter) {
                    descriptor.set = setter;
                }

                return descriptor;
            };
        }

        if (!Object.defineProperties) {
            Object.defineProperties = function (obj, props) {
                var prop;
                for (prop in props) {
                    if (hasOwnProp.call(props, prop)) {
                        Object.defineProperty(obj, prop, props[prop]);
                    }
                }
            };
        }
    }
}());

// Begin dataset code

if (!document.documentElement.dataset &&
        // FF is empty while IE gives empty object
    (!Object.getOwnPropertyDescriptor(Element.prototype, 'dataset')  ||
    !Object.getOwnPropertyDescriptor(Element.prototype, 'dataset').get)
) {
    var propDescriptor = {
        enumerable: true,
        get: function () {
            'use strict';
            var i,
                that = this,
                HTML5_DOMStringMap,
                attrVal, attrName, propName,
                attribute,
                attributes = this.attributes,
                attsLength = attributes.length,
                toUpperCase = function (n0) {
                    return n0.charAt(1).toUpperCase();
                },
                getter = function () {
                    return this;
                },
                setter = function (attrName, value) {
                    return (typeof value !== 'undefined') ?
                        this.setAttribute(attrName, value) :
                        this.removeAttribute(attrName);
                };
            try { // Simulate DOMStringMap w/accessor support
                // Test setting accessor on normal object
                ({}).__defineGetter__('test', function () {});
                HTML5_DOMStringMap = {};
            }
            catch (e1) { // Use a DOM object for IE8
                HTML5_DOMStringMap = document.createElement('div');
            }
            for (i = 0; i < attsLength; i++) {
                attribute = attributes[i];
                // Fix: This test really should allow any XML Name without 
                //         colons (and non-uppercase for XHTML)
                if (attribute && attribute.name &&
                    (/^data-\w[\w\-]*$/).test(attribute.name)) {
                    attrVal = attribute.value;
                    attrName = attribute.name;
                    // Change to CamelCase
                    propName = attrName.substr(5).replace(/-./g, toUpperCase);
                    try {
                        Object.defineProperty(HTML5_DOMStringMap, propName, {
                            enumerable: this.enumerable,
                            get: getter.bind(attrVal || ''),
                            set: setter.bind(that, attrName)
                        });
                    }
                    catch (e2) { // if accessors are not working
                        HTML5_DOMStringMap[propName] = attrVal;
                    }
                }
            }
            return HTML5_DOMStringMap;
        }
    };
    try {
        // FF enumerates over element's dataset, but not 
        //   Element.prototype.dataset; IE9 iterates over both
        Object.defineProperty(Element.prototype, 'dataset', propDescriptor);
    } catch (e) {
        propDescriptor.enumerable = false; // IE8 does not allow setting to true
        Object.defineProperty(Element.prototype, 'dataset', propDescriptor);
    }
}

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-12-13
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js */

if ("document" in self) {

// Full polyfill for browsers with no classList support
    if (!("classList" in document.createElement("_"))) {

        (function (view) {

            "use strict";

            if (!('Element' in view)) return;

            var
                classListProp = "classList"
                , protoProp = "prototype"
                , elemCtrProto = view.Element[protoProp]
                , objCtr = Object
                , strTrim = String[protoProp].trim || function () {
                        return this.replace(/^\s+|\s+$/g, "");
                    }
                , arrIndexOf = Array[protoProp].indexOf || function (item) {
                        var
                            i = 0
                            , len = this.length
                            ;
                        for (; i < len; i++) {
                            if (i in this && this[i] === item) {
                                return i;
                            }
                        }
                        return -1;
                    }
            // Vendors: please allow content code to instantiate DOMExceptions
                , DOMEx = function (type, message) {
                    this.name = type;
                    this.code = DOMException[type];
                    this.message = message;
                }
                , checkTokenAndGetIndex = function (classList, token) {
                    if (token === "") {
                        throw new DOMEx(
                            "SYNTAX_ERR"
                            , "An invalid or illegal string was specified"
                        );
                    }
                    if (/\s/.test(token)) {
                        throw new DOMEx(
                            "INVALID_CHARACTER_ERR"
                            , "String contains an invalid character"
                        );
                    }
                    return arrIndexOf.call(classList, token);
                }
                , ClassList = function (elem) {
                    var
                        trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
                        , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
                        , i = 0
                        , len = classes.length
                        ;
                    for (; i < len; i++) {
                        this.push(classes[i]);
                    }
                    this._updateClassName = function () {
                        elem.setAttribute("class", this.toString());
                    };
                }
                , classListProto = ClassList[protoProp] = []
                , classListGetter = function () {
                    return new ClassList(this);
                }
                ;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
            DOMEx[protoProp] = Error[protoProp];
            classListProto.item = function (i) {
                return this[i] || null;
            };
            classListProto.contains = function (token) {
                token += "";
                return checkTokenAndGetIndex(this, token) !== -1;
            };
            classListProto.add = function () {
                var
                    tokens = arguments
                    , i = 0
                    , l = tokens.length
                    , token
                    , updated = false
                    ;
                do {
                    token = tokens[i] + "";
                    if (checkTokenAndGetIndex(this, token) === -1) {
                        this.push(token);
                        updated = true;
                    }
                }
                while (++i < l);

                if (updated) {
                    this._updateClassName();
                }
            };
            classListProto.remove = function () {
                var
                    tokens = arguments
                    , i = 0
                    , l = tokens.length
                    , token
                    , updated = false
                    , index
                    ;
                do {
                    token = tokens[i] + "";
                    index = checkTokenAndGetIndex(this, token);
                    while (index !== -1) {
                        this.splice(index, 1);
                        updated = true;
                        index = checkTokenAndGetIndex(this, token);
                    }
                }
                while (++i < l);

                if (updated) {
                    this._updateClassName();
                }
            };
            classListProto.toggle = function (token, force) {
                token += "";

                var
                    result = this.contains(token)
                    , method = result ?
                    force !== true && "remove"
                        :
                    force !== false && "add"
                    ;

                if (method) {
                    this[method](token);
                }

                if (force === true || force === false) {
                    return force;
                } else {
                    return !result;
                }
            };
            classListProto.toString = function () {
                return this.join(" ");
            };

            if (objCtr.defineProperty) {
                var classListPropDesc = {
                    get: classListGetter
                    , enumerable: true
                    , configurable: true
                };
                try {
                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                } catch (ex) { // IE 8 doesn't support enumerable:true
                    if (ex.number === -0x7FF5EC54) {
                        classListPropDesc.enumerable = false;
                        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                    }
                }
            } else if (objCtr[protoProp].__defineGetter__) {
                elemCtrProto.__defineGetter__(classListProp, classListGetter);
            }

        }(self));

    } else {
// There is full or partial native classList support, so just check if we need
// to normalize the add/remove and toggle APIs.

        (function () {
            "use strict";

            var testElement = document.createElement("_");

            testElement.classList.add("c1", "c2");

            // Polyfill for IE 10/11 and Firefox <26, where classList.add and
            // classList.remove exist but support only one argument at a time.
            if (!testElement.classList.contains("c2")) {
                var createMethod = function(method) {
                    var original = DOMTokenList.prototype[method];

                    DOMTokenList.prototype[method] = function(token) {
                        var i, len = arguments.length;

                        for (i = 0; i < len; i++) {
                            token = arguments[i];
                            original.call(this, token);
                        }
                    };
                };
                createMethod('add');
                createMethod('remove');
            }

            testElement.classList.toggle("c3", false);

            // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
            // support the second argument.
            if (testElement.classList.contains("c3")) {
                var _toggle = DOMTokenList.prototype.toggle;

                DOMTokenList.prototype.toggle = function(token, force) {
                    if (1 in arguments && !this.contains(token) === !force) {
                        return force;
                    } else {
                        return _toggle.call(this, token);
                    }
                };

            }

            testElement = null;
        }());

    }

}

/**
 * Running the following code before any other code will create trim() if it's not natively available.
 */
if (!String.prototype.trim) {
    (function() {
        // Make sure we trim BOM and NBSP
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function() {
            return this.replace(rtrim, '');
        };
    })();
}

/**
 * The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present.
 */
// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {

        var k;

        // 1. Let O be the result of calling ToObject passing
        //    the this value as the argument.
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get
        //    internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If len is 0, return -1.
        if (len === 0) {
            return -1;
        }

        // 5. If argument fromIndex was passed let n be
        //    ToInteger(fromIndex); else let n be 0.
        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }

        // 6. If n >= len, return -1.
        if (n >= len) {
            return -1;
        }

        // 7. If n >= 0, then Let k be n.
        // 8. Else, n<0, Let k be len - abs(n).
        //    If k is less than 0, then let k be 0.
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        // 9. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the
            //    HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            //    i.  Let elementK be the result of calling the Get
            //        internal method of O with the argument ToString(k).
            //   ii.  Let same be the result of applying the
            //        Strict Equality Comparison Algorithm to
            //        searchElement and elementK.
            //  iii.  If same is true, return k.
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}

/**
 * EventListener | CC0 | github.com/jonathantneal/EventListener
 * https://github.com/jonathantneal/EventListener
 */
this.Element && Element.prototype.attachEvent && !Element.prototype.addEventListener && (function () {
    function addToPrototype(name, method) {
        Window.prototype[name] = HTMLDocument.prototype[name] = Element.prototype[name] = method;
    }

    // add
    addToPrototype("addEventListener", function (type, listener) {
        var
          target = this,
          listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
          typeListeners = listeners[type] = listeners[type] || [];

        // if no events exist, attach the listener
        if (!typeListeners.length) {
            target.attachEvent("on" + type, typeListeners.event = function (event) {
                var documentElement = target.document && target.document.documentElement || target.documentElement || { scrollLeft: 0, scrollTop: 0 };

                // polyfill w3c properties and methods
                event.currentTarget = target;
                event.pageX = event.clientX + documentElement.scrollLeft;
                event.pageY = event.clientY + documentElement.scrollTop;
                event.preventDefault = function () { event.returnValue = false };
                event.relatedTarget = event.fromElement || null;
                event.stopImmediatePropagation = function () { immediatePropagation = false; event.cancelBubble = true };
                event.stopPropagation = function () { event.cancelBubble = true };
                event.target = event.srcElement || target;
                event.timeStamp = +new Date;

                // create an cached list of the master events list (to protect this loop from breaking when an event is removed)
                for (var i = 0, typeListenersCache = [].concat(typeListeners), typeListenerCache, immediatePropagation = true; immediatePropagation && (typeListenerCache = typeListenersCache[i]); ++i) {
                    // check to see if the cached event still exists in the master events list
                    for (var ii = 0, typeListener; typeListener = typeListeners[ii]; ++ii) {
                        if (typeListener == typeListenerCache) {
                            typeListener.call(target, event);

                            break;
                        }
                    }
                }
            });
        }

        // add the event to the master event list
        typeListeners.push(listener);
    });

    // remove
    addToPrototype("removeEventListener", function (type, listener) {
        var
          target = this,
          listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
          typeListeners = listeners[type] = listeners[type] || [];

        // remove the newest matching event from the master event list
        for (var i = typeListeners.length - 1, typeListener; typeListener = typeListeners[i]; --i) {
            if (typeListener == listener) {
                typeListeners.splice(i, 1);

                break;
            }
        }

        // if no events exist, detach the listener
        if (!typeListeners.length && typeListeners.event) {
            target.detachEvent("on" + type, typeListeners.event);
        }
    });

    // dispatch
    addToPrototype("dispatchEvent", function (eventObject) {
        var
          target = this,
          type = eventObject.type,
          listeners = target.addEventListener.listeners = target.addEventListener.listeners || {},
          typeListeners = listeners[type] = listeners[type] || [];

        try {
            return target.fireEvent("on" + type, eventObject);
        } catch (error) {
            if (typeListeners.event) {
                typeListeners.event(eventObject);
            }

            return;
        }
    });

    // CustomEvent
    Object.defineProperty(Window.prototype, "CustomEvent", {
        get: function () {
            var self = this;

            return function CustomEvent(type, eventInitDict) {
                var event = self.document.createEventObject(), key;

                event.type = type;
                for (key in eventInitDict) {
                    if (key == 'cancelable'){
                        event.returnValue = !eventInitDict.cancelable;
                    } else if (key == 'bubbles'){
                        event.cancelBubble = !eventInitDict.bubbles;
                    } else if (key == 'detail'){
                        event.detail = eventInitDict.detail;
                    }
                }
                return event;
            };
        }
    });

    // ready
    function ready(event) {
        if (ready.interval && document.body) {
            ready.interval = clearInterval(ready.interval);

            document.dispatchEvent(new CustomEvent("DOMContentLoaded"));
        }
    }

    ready.interval = setInterval(ready, 1);

    window.addEventListener("load", ready);
})();

(!this.CustomEvent || typeof this.CustomEvent === "object") && (function() {
    // CustomEvent for browsers which don't natively support the Constructor method
    this.CustomEvent = function CustomEvent(type, eventInitDict) {
        var event;
        eventInitDict = eventInitDict || {bubbles: false, cancelable: false, detail: undefined};

        try {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(type, eventInitDict.bubbles, eventInitDict.cancelable, eventInitDict.detail);
        } catch (error) {
            // for browsers which don't support CustomEvent at all, we use a regular event instead
            event = document.createEvent('Event');
            event.initEvent(type, eventInitDict.bubbles, eventInitDict.cancelable);
            event.detail = eventInitDict.detail;
        }

        return event;
    };
})();

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.com/#x15.4.4.18
if (!Array.prototype.forEach) {

    Array.prototype.forEach = function forEach(callback, thisArg) {
        'use strict';
        var T, k;

        if (this == null) {
            throw new TypeError("this is null or not defined");
        }

        var kValue,
        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
            O = Object(this),

        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
            len = O.length >>> 0; // Hack to convert O.length to a UInt32

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if ({}.toString.call(callback) !== "[object Function]") {
            throw new TypeError(callback + " is not a function");
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length >= 2) {
            T = thisArg;
        }

        // 6. Let k be 0
        k = 0;

        // 7. Repeat, while k < len
        while (k < len) {

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[k];

                // ii. Call the Call internal method of callback with T as the this value and
                // argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined
    };
}

/**
 * :scope polyfill
 * http://stackoverflow.com/questions/6481612/queryselector-search-immediate-children
 */
(function(doc, proto) {
    try { // check if browser supports :scope natively
        doc.querySelector(':scope body');
    } catch (err) { // polyfill native methods if it doesn't
        ['querySelector', 'querySelectorAll'].forEach(function(method) {
            var native = proto[method];
            proto[method] = function(selectors) {
                if (/(^|,)\s*:scope/.test(selectors)) { // only if selectors contains :scope
                    var id = this.id; // remember current element id
                    this.id = 'ID_' + Date.now(); // assign new unique id
                    selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id); // replace :scope with #ID
                    var result = doc[method](selectors);
                    this.id = id; // restore previous id
                    return result;
                } else {
                    return native.call(this, selectors); // use native code for other selectors
                }
            }
        });
    }
})(window.document, Element.prototype);

if (navigator.appVersion.indexOf('MSIE 8.') === -1 && navigator.appVersion.indexOf('MSIE 9.') === -1) {
    /**
     * The Object.assign() method is used to copy the values of all enumerable own properties from one or more source objects to a target object. It will return the target object.
     * https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Object/assign
     */
    if (!Object.assign) {
        Object.defineProperty(Object, 'assign', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function(target, firstSource) {
                'use strict';
                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert first argument to object');
                }

                var to = Object(target);
                for (var i = 1; i < arguments.length; i++) {
                    var nextSource = arguments[i];
                    if (nextSource === undefined || nextSource === null) {
                        continue;
                    }

                    var keysArray = Object.keys(Object(nextSource));
                    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                        var nextKey = keysArray[nextIndex];
                        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                        if (desc !== undefined && desc.enumerable) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
                return to;
            }
        });
    }
}

/*
 * The Array.isArray() method returns true if an object is an array, false if it is not.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
 */
if (!Array.isArray) {
    Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

function cbExtendObjects () {
    for ( var i = 1, arg = arguments.length; i < arg; i++ ) {
        for ( var key in arguments[i] ) {
            if( arguments[i].hasOwnProperty(key) ) {
                arguments[0][key] = arguments[i][key];
            }
        }
    }
    return arguments[0];
}