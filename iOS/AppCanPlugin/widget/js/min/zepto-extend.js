/* 
 * @Author: anchen
 * @Date:   2016-07-04 11:23:18
 * @Last Modified by:   anchen
 * @Last Modified time: 2016-07-18 16:29:28
 */
/*===========================
            md5
===========================*/
var rotateLeft = function(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
};
var addUnsigned = function(lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = (lX & 2147483648);
    lY8 = (lY & 2147483648);
    lX4 = (lX & 1073741824);
    lY4 = (lY & 1073741824);
    lResult = (lX & 1073741823) + (lY & 1073741823);
    if (lX4 & lY4) {
        return (lResult ^ 2147483648 ^ lX8 ^ lY8)
    }
    if (lX4 | lY4) {
        if (lResult & 1073741824) {
            return (lResult ^ 3221225472 ^ lX8 ^ lY8)
        } else {
            return (lResult ^ 1073741824 ^ lX8 ^ lY8)
        }
    } else {
        return (lResult ^ lX8 ^ lY8)
    }
};
var F = function(x, y, z) {
    return (x & y) | ((~x) & z)
};
var G = function(x, y, z) {
    return (x & z) | (y & (~z))
};
var H = function(x, y, z) {
    return (x ^ y ^ z)
};
var I = function(x, y, z) {
    return (y ^ (x | (~z)))
};
var FF = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b)
};
var GG = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b)
};
var HH = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b)
};
var II = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b)
};
var convertToWordArray = function(string) {
    var lWordCount;
    var lMessageLength = string.length;
    var lNumberOfWordsTempOne = lMessageLength + 8;
    var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
    var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
    var lWordArray = Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
        lByteCount++
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (128 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray
};
var wordToHex = function(lValue) {
    var WordToHexValue = "",
        WordToHexValueTemp = "",
        lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
        lByte = (lValue >>> (lCount * 8)) & 255;
        WordToHexValueTemp = "0" + lByte.toString(16);
        WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2)
    }
    return WordToHexValue
};
var uTF8Encode = function(string) {
    string = string.replace(/\x0d\x0a/g, "\x0a");
    var output = "";
    for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
            output += String.fromCharCode(c)
        } else {
            if ((c > 127) && (c < 2048)) {
                output += String.fromCharCode((c >> 6) | 192);
                output += String.fromCharCode((c & 63) | 128)
            } else {
                output += String.fromCharCode((c >> 12) | 224);
                output += String.fromCharCode(((c >> 6) & 63) | 128);
                output += String.fromCharCode((c & 63) | 128)
            }
        }
    }
    return output
};
/*===========================
          IosSelect
===========================*/
var IScroll = (function() {
    var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000 / 60)
    };
    var utils = (function() {
        var me = {};
        var _elementStyle = document.createElement('div').style;
        var _vendor = (function() {
            var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
                transform, i = 0,
                l = vendors.length;
            for (; i < l; i++) {
                transform = vendors[i] + 'ransform';
                if (transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1)
            }
            return false
        })();

        function _prefixStyle(style) {
            if (_vendor === false) return false;
            if (_vendor === '') return style;
            return _vendor + style.charAt(0).toUpperCase() + style.substr(1)
        }
        me.getTime = Date.now || function getTime() {
            return new Date().getTime()
        };
        me.extend = function(target, obj) {
            for (var i in obj) {
                target[i] = obj[i]
            }
        };
        me.addEvent = function(el, type, fn, capture) {
            el.addEventListener(type, fn, !!capture)
        };
        me.removeEvent = function(el, type, fn, capture) {
            el.removeEventListener(type, fn, !!capture)
        };
        me.prefixPointerEvent = function(pointerEvent) {
            return window.MSPointerEvent ? 'MSPointer' + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10) : pointerEvent
        };
        me.momentum = function(current, start, time, lowerMargin, wrapperSize, deceleration) {
            var distance = current - start,
                speed = Math.abs(distance) / time,
                destination, duration;
            deceleration = deceleration === undefined ? 0.0006 : deceleration;
            destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
            duration = speed / deceleration;
            if (destination < lowerMargin) {
                destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
                distance = Math.abs(destination - current);
                duration = distance / speed
            } else if (destination > 0) {
                destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
                distance = Math.abs(current) + destination;
                duration = distance / speed
            }
            return {
                destination: Math.round(destination),
                duration: duration
            }
        };
        var _transform = _prefixStyle('transform');
        me.extend(me, {
            hasTransform: _transform !== false,
            hasPerspective: _prefixStyle('perspective') in _elementStyle,
            hasTouch: 'ontouchstart' in window,
            hasPointer: window.PointerEvent || window.MSPointerEvent,
            hasTransition: _prefixStyle('transition') in _elementStyle
        });
        me.isBadAndroid = /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion));
        me.extend(me.style = {}, {
            transform: _transform,
            transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
            transitionDuration: _prefixStyle('transitionDuration'),
            transitionDelay: _prefixStyle('transitionDelay'),
            transformOrigin: _prefixStyle('transformOrigin')
        });
        me.hasClass = function(e, c) {
            var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
            return re.test(e.className)
        };
        me.addClass = function(e, c) {
            if (me.hasClass(e, c)) {
                return
            }
            var newclass = e.className.split(' ');
            newclass.push(c);
            e.className = newclass.join(' ')
        };
        me.removeClass = function(e, c) {
            if (!me.hasClass(e, c)) {
                return
            }
            var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
            e.className = e.className.replace(re, ' ')
        };
        me.offset = function(el) {
            var left = -el.offsetLeft,
                top = -el.offsetTop;
            while (el = el.offsetParent) {
                left -= el.offsetLeft;
                top -= el.offsetTop
            }
            return {
                left: left,
                top: top
            }
        };
        me.preventDefaultException = function(el, exceptions) {
            for (var i in exceptions) {
                if (exceptions[i].test(el[i])) {
                    return true
                }
            }
            return false
        };
        me.extend(me.eventType = {}, {
            touchstart: 1,
            touchmove: 1,
            touchend: 1,
            mousedown: 2,
            mousemove: 2,
            mouseup: 2,
            pointerdown: 3,
            pointermove: 3,
            pointerup: 3,
            MSPointerDown: 3,
            MSPointerMove: 3,
            MSPointerUp: 3
        });
        me.extend(me.ease = {}, {
            quadratic: {
                style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fn: function(k) {
                    return k * (2 - k)
                }
            },
            circular: {
                style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
                fn: function(k) {
                    return Math.sqrt(1 - (--k * k))
                }
            },
            back: {
                style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                fn: function(k) {
                    var b = 4;
                    return (k = k - 1) * k * ((b + 1) * k + b) + 1
                }
            },
            bounce: {
                style: '',
                fn: function(k) {
                    if ((k /= 1) < (1 / 2.75)) {
                        return 7.5625 * k * k
                    } else if (k < (2 / 2.75)) {
                        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75
                    } else if (k < (2.5 / 2.75)) {
                        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375
                    } else {
                        return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375
                    }
                }
            },
            elastic: {
                style: '',
                fn: function(k) {
                    var f = 0.22,
                        e = 0.4;
                    if (k === 0) {
                        return 0
                    }
                    if (k == 1) {
                        return 1
                    }
                    return (e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1)
                }
            }
        });
        me.tap = function(e, eventName) {
            var ev = document.createEvent('Event');
            ev.initEvent(eventName, true, true);
            ev.pageX = e.pageX;
            ev.pageY = e.pageY;
            e.target.dispatchEvent(ev)
        };
        me.click = function(e) {
            var target = e.target,
                ev;
            if (!(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName)) {
                ev = document.createEvent('MouseEvents');
                ev.initMouseEvent('click', true, true, e.view, 1, target.screenX, target.screenY, target.clientX, target.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null);
                ev._constructed = true;
                target.dispatchEvent(ev)
            }
        };
        return me
    })();

    function IScroll(el, options) {
        this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
        this.scroller = this.wrapper.children[0];
        this.scrollerStyle = this.scroller.style;
        this.options = {
            resizeScrollbars: true,
            mouseWheelSpeed: 20,
            snapThreshold: 0.334,
            startX: 0,
            startY: 0,
            scrollY: true,
            directionLockThreshold: 5,
            momentum: true,
            bounce: true,
            bounceTime: 600,
            bounceEasing: '',
            preventDefault: true,
            preventDefaultException: {
                tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
            },
            HWCompositing: true,
            useTransition: true,
            useTransform: true
        };
        for (var i in options) {
            this.options[i] = options[i]
        }
        this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';
        this.options.useTransition = utils.hasTransition && this.options.useTransition;
        this.options.useTransform = utils.hasTransform && this.options.useTransform;
        this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
        this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;
        this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
        this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;
        this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
        this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;
        this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;
        this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;
        if (this.options.tap === true) {
            this.options.tap = 'tap'
        }
        if (this.options.shrinkScrollbars == 'scale') {
            this.options.useTransition = false
        }
        this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;
        if (this.options.probeType == 3) {
            this.options.useTransition = false
        }
        this.x = 0;
        this.y = 0;
        this.directionX = 0;
        this.directionY = 0;
        this._events = {};
        this._init();
        this.refresh();
        this.scrollTo(this.options.startX, this.options.startY);
        this.enable()
    }
    IScroll.prototype = {
        version: '5.1.3',
        _init: function() {
            this._initEvents();
            if (this.options.scrollbars || this.options.indicators) {
                this._initIndicators()
            }
            if (this.options.mouseWheel) {
                this._initWheel()
            }
            if (this.options.snap) {
                this._initSnap()
            }
            if (this.options.keyBindings) {
                this._initKeys()
            }
        },
        destroy: function() {
            this._initEvents(true);
            this._execEvent('destroy')
        },
        _transitionEnd: function(e) {
            if (e.target != this.scroller || !this.isInTransition) {
                return
            }
            this._transitionTime();
            if (!this.resetPosition(this.options.bounceTime)) {
                this.isInTransition = false;
                this._execEvent('scrollEnd')
            }
        },
        _start: function(e) {
            if (utils.eventType[e.type] != 1) {
                if (e.button !== 0) {
                    return
                }
            }
            if (!this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated)) {
                return
            }
            if (this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                e.preventDefault()
            }
            var point = e.touches ? e.touches[0] : e,
                pos;
            this.initiated = utils.eventType[e.type];
            this.moved = false;
            this.distX = 0;
            this.distY = 0;
            this.directionX = 0;
            this.directionY = 0;
            this.directionLocked = 0;
            this._transitionTime();
            this.startTime = utils.getTime();
            if (this.options.useTransition && this.isInTransition) {
                this.isInTransition = false;
                pos = this.getComputedPosition();
                this._translate(Math.round(pos.x), Math.round(pos.y));
                this._execEvent('scrollEnd')
            } else if (!this.options.useTransition && this.isAnimating) {
                this.isAnimating = false;
                this._execEvent('scrollEnd')
            }
            this.startX = this.x;
            this.startY = this.y;
            this.absStartX = this.x;
            this.absStartY = this.y;
            this.pointX = point.pageX;
            this.pointY = point.pageY;
            this._execEvent('beforeScrollStart')
        },
        _move: function(e) {
            if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                return
            }
            if (this.options.preventDefault) {
                e.preventDefault()
            }
            var point = e.touches ? e.touches[0] : e,
                deltaX = point.pageX - this.pointX,
                deltaY = point.pageY - this.pointY,
                timestamp = utils.getTime(),
                newX, newY, absDistX, absDistY;
            this.pointX = point.pageX;
            this.pointY = point.pageY;
            this.distX += deltaX;
            this.distY += deltaY;
            absDistX = Math.abs(this.distX);
            absDistY = Math.abs(this.distY);
            if (timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
                return
            }
            if (!this.directionLocked && !this.options.freeScroll) {
                if (absDistX > absDistY + this.options.directionLockThreshold) {
                    this.directionLocked = 'h'
                } else if (absDistY >= absDistX + this.options.directionLockThreshold) {
                    this.directionLocked = 'v'
                } else {
                    this.directionLocked = 'n'
                }
            }
            if (this.directionLocked == 'h') {
                if (this.options.eventPassthrough == 'vertical') {
                    e.preventDefault()
                } else if (this.options.eventPassthrough == 'horizontal') {
                    this.initiated = false;
                    return
                }
                deltaY = 0
            } else if (this.directionLocked == 'v') {
                if (this.options.eventPassthrough == 'horizontal') {
                    e.preventDefault()
                } else if (this.options.eventPassthrough == 'vertical') {
                    this.initiated = false;
                    return
                }
                deltaX = 0
            }
            deltaX = this.hasHorizontalScroll ? deltaX : 0;
            deltaY = this.hasVerticalScroll ? deltaY : 0;
            newX = this.x + deltaX;
            newY = this.y + deltaY;
            if (newX > 0 || newX < this.maxScrollX) {
                newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX
            }
            if (newY > 0 || newY < this.maxScrollY) {
                newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY
            }
            this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
            this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;
            if (!this.moved) {
                this._execEvent('scrollStart')
            }
            this.moved = true;
            this._translate(newX, newY);
            if (timestamp - this.startTime > 300) {
                this.startTime = timestamp;
                this.startX = this.x;
                this.startY = this.y;
                if (this.options.probeType == 1) {
                    this._execEvent('scroll')
                }
            }
            if (this.options.probeType > 1) {
                this._execEvent('scroll')
            }
        },
        _end: function(e) {
            if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                return
            }
            if (this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                e.preventDefault()
            }
            var point = e.changedTouches ? e.changedTouches[0] : e,
                momentumX, momentumY, duration = utils.getTime() - this.startTime,
                newX = Math.round(this.x),
                newY = Math.round(this.y),
                distanceX = Math.abs(newX - this.startX),
                distanceY = Math.abs(newY - this.startY),
                time = 0,
                easing = '';
            this.isInTransition = 0;
            this.initiated = 0;
            this.endTime = utils.getTime();
            if (this.resetPosition(this.options.bounceTime)) {
                return
            }
            this.scrollTo(newX, newY);
            if (!this.moved) {
                if (this.options.tap) {
                    utils.tap(e, this.options.tap)
                }
                if (this.options.click) {
                    utils.click(e)
                }
                this._execEvent('scrollCancel');
                return
            }
            if (this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100) {
                this._execEvent('flick');
                return
            }
            if (this.options.momentum && duration < 300) {
                momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : {
                    destination: newX,
                    duration: 0
                };
                momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : {
                    destination: newY,
                    duration: 0
                };
                newX = momentumX.destination;
                newY = momentumY.destination;
                time = Math.max(momentumX.duration, momentumY.duration);
                this.isInTransition = 1
            }
            if (this.options.snap) {
                var snap = this._nearestSnap(newX, newY);
                this.currentPage = snap;
                time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(newX - snap.x), 1000), Math.min(Math.abs(newY - snap.y), 1000)), 300);
                newX = snap.x;
                newY = snap.y;
                this.directionX = 0;
                this.directionY = 0;
                easing = this.options.bounceEasing
            }
            if (newX != this.x || newY != this.y) {
                if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
                    easing = utils.ease.quadratic
                }
                this.scrollTo(newX, newY, time, easing);
                return
            }
            this._execEvent('scrollEnd')
        },
        _resize: function() {
            var that = this;
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(function() {
                that.refresh()
            }, this.options.resizePolling)
        },
        resetPosition: function(time) {
            var x = this.x,
                y = this.y;
            time = time || 0;
            if (!this.hasHorizontalScroll || this.x > 0) {
                x = 0
            } else if (this.x < this.maxScrollX) {
                x = this.maxScrollX
            }
            if (!this.hasVerticalScroll || this.y > 0) {
                y = 0
            } else if (this.y < this.maxScrollY) {
                y = this.maxScrollY
            }
            if (x == this.x && y == this.y) {
                return false
            }
            this.scrollTo(x, y, time, this.options.bounceEasing);
            return true
        },
        disable: function() {
            this.enabled = false
        },
        enable: function() {
            this.enabled = true
        },
        refresh: function() {
            var rf = this.wrapper.offsetHeight;
            this.wrapperWidth = this.wrapper.clientWidth;
            this.wrapperHeight = this.wrapper.clientHeight;
            this.scrollerWidth = this.scroller.offsetWidth;
            this.scrollerHeight = this.scroller.offsetHeight;
            this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
            this.maxScrollY = this.wrapperHeight - this.scrollerHeight;
            this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
            this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;
            if (!this.hasHorizontalScroll) {
                this.maxScrollX = 0;
                this.scrollerWidth = this.wrapperWidth
            }
            if (!this.hasVerticalScroll) {
                this.maxScrollY = 0;
                this.scrollerHeight = this.wrapperHeight
            }
            this.endTime = 0;
            this.directionX = 0;
            this.directionY = 0;
            this.wrapperOffset = utils.offset(this.wrapper);
            this._execEvent('refresh');
            this.resetPosition()
        },
        on: function(type, fn) {
            if (!this._events[type]) {
                this._events[type] = []
            }
            this._events[type].push(fn)
        },
        off: function(type, fn) {
            if (!this._events[type]) {
                return
            }
            var index = this._events[type].indexOf(fn);
            if (index > -1) {
                this._events[type].splice(index, 1)
            }
        },
        _execEvent: function(type) {
            if (!this._events[type]) {
                return
            }
            var i = 0,
                l = this._events[type].length;
            if (!l) {
                return
            }
            for (; i < l; i++) {
                this._events[type][i].apply(this, [].slice.call(arguments, 1))
            }
        },
        scrollBy: function(x, y, time, easing) {
            x = this.x + x;
            y = this.y + y;
            time = time || 0;
            this.scrollTo(x, y, time, easing)
        },
        scrollTo: function(x, y, time, easing) {
            easing = easing || utils.ease.circular;
            this.isInTransition = this.options.useTransition && time > 0;
            if (!time || (this.options.useTransition && easing.style)) {
                this._transitionTimingFunction(easing.style);
                this._transitionTime(time);
                this._translate(x, y)
            } else {
                this._animate(x, y, time, easing.fn)
            }
        },
        scrollToElement: function(el, time, offsetX, offsetY, easing) {
            el = el.nodeType ? el : this.scroller.querySelector(el);
            if (!el) {
                return
            }
            var pos = utils.offset(el);
            pos.left -= this.wrapperOffset.left;
            pos.top -= this.wrapperOffset.top;
            if (offsetX === true) {
                offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2)
            }
            if (offsetY === true) {
                offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2)
            }
            pos.left -= offsetX || 0;
            pos.top -= offsetY || 0;
            pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
            pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top;
            time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x - pos.left), Math.abs(this.y - pos.top)) : time;
            this.scrollTo(pos.left, pos.top, time, easing)
        },
        _transitionTime: function(time) {
            time = time || 0;
            this.scrollerStyle[utils.style.transitionDuration] = time + 'ms';
            if (!time && utils.isBadAndroid) {
                this.scrollerStyle[utils.style.transitionDuration] = '0.001s'
            }
            if (this.indicators) {
                for (var i = this.indicators.length; i--;) {
                    this.indicators[i].transitionTime(time)
                }
            }
        },
        _transitionTimingFunction: function(easing) {
            this.scrollerStyle[utils.style.transitionTimingFunction] = easing;
            if (this.indicators) {
                for (var i = this.indicators.length; i--;) {
                    this.indicators[i].transitionTimingFunction(easing)
                }
            }
        },
        _translate: function(x, y) {
            if (this.options.useTransform) {
                this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ
                 this.scrollerStyle[utils.style.transform] = 'height:100px;'
            } else {
                console.log(0)
                x = Math.round(x);
                y = Math.round(y);
                this.scrollerStyle.left = x + 'px';
                this.scrollerStyle.top = y + 'px'
            }
            this.x = x;
            this.y = y;
            if (this.indicators) {
                for (var i = this.indicators.length; i--;) {
                    this.indicators[i].updatePosition()
                }
            }
        },
        _initEvents: function(remove) {
            var eventType = remove ? utils.removeEvent : utils.addEvent,
                target = this.options.bindToWrapper ? this.wrapper : window;
            eventType(window, 'orientationchange', this);
            eventType(window, 'resize', this);
            if (this.options.click) {
                eventType(this.wrapper, 'click', this, true)
            }
            if (!this.options.disableMouse) {
                eventType(this.wrapper, 'mousedown', this);
                eventType(target, 'mousemove', this);
                eventType(target, 'mousecancel', this);
                eventType(target, 'mouseup', this)
            }
            if (utils.hasPointer && !this.options.disablePointer) {
                eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
                eventType(target, utils.prefixPointerEvent('pointermove'), this);
                eventType(target, utils.prefixPointerEvent('pointercancel'), this);
                eventType(target, utils.prefixPointerEvent('pointerup'), this)
            }
            if (utils.hasTouch && !this.options.disableTouch) {
                eventType(this.wrapper, 'touchstart', this);
                eventType(target, 'touchmove', this);
                eventType(target, 'touchcancel', this);
                eventType(target, 'touchend', this)
            }
            eventType(this.scroller, 'transitionend', this);
            eventType(this.scroller, 'webkitTransitionEnd', this);
            eventType(this.scroller, 'oTransitionEnd', this);
            eventType(this.scroller, 'MSTransitionEnd', this)
        },
        getComputedPosition: function() {
            var matrix = window.getComputedStyle(this.scroller, null),
                x, y;
            if (this.options.useTransform) {
                matrix = matrix[utils.style.transform].split(')')[0].split(', ');
                x = +(matrix[12] || matrix[4]);
                y = +(matrix[13] || matrix[5])
            } else {
                x = +matrix.left.replace(/[^-\d.]/g, '');
                y = +matrix.top.replace(/[^-\d.]/g, '')
            }
            return {
                x: x,
                y: y
            }
        },
        _initIndicators: function() {
            var interactive = this.options.interactiveScrollbars,
                customStyle = typeof this.options.scrollbars != 'string',
                indicators = [],
                indicator;
            var that = this;
            this.indicators = [];
            if (this.options.scrollbars) {
                if (this.options.scrollY) {
                    indicator = {
                        el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
                        interactive: interactive,
                        defaultScrollbars: true,
                        customStyle: customStyle,
                        resize: this.options.resizeScrollbars,
                        shrink: this.options.shrinkScrollbars,
                        fade: this.options.fadeScrollbars,
                        listenX: false
                    };
                    this.wrapper.appendChild(indicator.el);
                    indicators.push(indicator)
                }
                if (this.options.scrollX) {
                    indicator = {
                        el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
                        interactive: interactive,
                        defaultScrollbars: true,
                        customStyle: customStyle,
                        resize: this.options.resizeScrollbars,
                        shrink: this.options.shrinkScrollbars,
                        fade: this.options.fadeScrollbars,
                        listenY: false
                    };
                    this.wrapper.appendChild(indicator.el);
                    indicators.push(indicator)
                }
            }
            if (this.options.indicators) {
                indicators = indicators.concat(this.options.indicators)
            }
            for (var i = indicators.length; i--;) {
                this.indicators.push(new Indicator(this, indicators[i]))
            }

            function _indicatorsMap(fn) {
                for (var i = that.indicators.length; i--;) {
                    fn.call(that.indicators[i])
                }
            }
            if (this.options.fadeScrollbars) {
                this.on('scrollEnd', function() {
                    _indicatorsMap(function() {
                        this.fade()
                    })
                });
                this.on('scrollCancel', function() {
                    _indicatorsMap(function() {
                        this.fade()
                    })
                });
                this.on('scrollStart', function() {
                    _indicatorsMap(function() {
                        this.fade(1)
                    })
                });
                this.on('beforeScrollStart', function() {
                    _indicatorsMap(function() {
                        this.fade(1, true)
                    })
                })
            }
            this.on('refresh', function() {
                _indicatorsMap(function() {
                    this.refresh()
                })
            });
            this.on('destroy', function() {
                _indicatorsMap(function() {
                    this.destroy()
                });
                delete this.indicators
            })
        },
        _initWheel: function() {
            utils.addEvent(this.wrapper, 'wheel', this);
            utils.addEvent(this.wrapper, 'mousewheel', this);
            utils.addEvent(this.wrapper, 'DOMMouseScroll', this);
            this.on('destroy', function() {
                utils.removeEvent(this.wrapper, 'wheel', this);
                utils.removeEvent(this.wrapper, 'mousewheel', this);
                utils.removeEvent(this.wrapper, 'DOMMouseScroll', this)
            })
        },
        _wheel: function(e) {
            if (!this.enabled) {
                return
            }
            e.preventDefault();
            e.stopPropagation();
            var wheelDeltaX, wheelDeltaY, newX, newY, that = this;
            if (this.wheelTimeout === undefined) {
                that._execEvent('scrollStart')
            }
            clearTimeout(this.wheelTimeout);
            this.wheelTimeout = setTimeout(function() {
                that._execEvent('scrollEnd');
                that.wheelTimeout = undefined
            }, 400);
            if ('deltaX' in e) {
                if (e.deltaMode === 1) {
                    wheelDeltaX = -e.deltaX * this.options.mouseWheelSpeed;
                    wheelDeltaY = -e.deltaY * this.options.mouseWheelSpeed
                } else {
                    wheelDeltaX = -e.deltaX;
                    wheelDeltaY = -e.deltaY
                }
            } else if ('wheelDeltaX' in e) {
                wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed;
                wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed
            } else if ('wheelDelta' in e) {
                wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed
            } else if ('detail' in e) {
                wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed
            } else {
                return
            }
            wheelDeltaX *= this.options.invertWheelDirection;
            wheelDeltaY *= this.options.invertWheelDirection;
            if (!this.hasVerticalScroll) {
                wheelDeltaX = wheelDeltaY;
                wheelDeltaY = 0
            }
            if (this.options.snap) {
                newX = this.currentPage.pageX;
                newY = this.currentPage.pageY;
                if (wheelDeltaX > 0) {
                    newX--
                } else if (wheelDeltaX < 0) {
                    newX++
                }
                if (wheelDeltaY > 0) {
                    newY--
                } else if (wheelDeltaY < 0) {
                    newY++
                }
                this.goToPage(newX, newY);
                return
            }
            newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
            newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);
            if (newX > 0) {
                newX = 0
            } else if (newX < this.maxScrollX) {
                newX = this.maxScrollX
            }
            if (newY > 0) {
                newY = 0
            } else if (newY < this.maxScrollY) {
                newY = this.maxScrollY
            }
            this.scrollTo(newX, newY, 0);
            if (this.options.probeType > 1) {
                this._execEvent('scroll')
            }
        },
        _initSnap: function() {
            this.currentPage = {};
            if (typeof this.options.snap == 'string') {
                this.options.snap = this.scroller.querySelectorAll(this.options.snap)
            }
            this.on('refresh', function() {
                var i = 0,
                    l, m = 0,
                    n, cx, cy, x = 0,
                    y, stepX = this.options.snapStepX || this.wrapperWidth,
                    stepY = this.options.snapStepY || this.wrapperHeight,
                    el;
                this.pages = [];
                if (!this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight) {
                    return
                }
                if (this.options.snap === true) {
                    cx = Math.round(stepX / 2);
                    cy = Math.round(stepY / 2);
                    while (x > -this.scrollerWidth) {
                        this.pages[i] = [];
                        l = 0;
                        y = 0;
                        while (y > -this.scrollerHeight) {
                            this.pages[i][l] = {
                                x: Math.max(x, this.maxScrollX),
                                y: Math.max(y, this.maxScrollY),
                                width: stepX,
                                height: stepY,
                                cx: x - cx,
                                cy: y - cy
                            };
                            y -= stepY;
                            l++
                        }
                        x -= stepX;
                        i++
                    }
                } else {
                    el = this.options.snap;
                    l = el.length;
                    n = -1;
                    for (; i < l; i++) {
                        if (i === 0 || el[i].offsetLeft <= el[i - 1].offsetLeft) {
                            m = 0;
                            n++
                        }
                        if (!this.pages[m]) {
                            this.pages[m] = []
                        }
                        x = Math.max(-el[i].offsetLeft, this.maxScrollX);
                        y = Math.max(-el[i].offsetTop, this.maxScrollY);
                        cx = x - Math.round(el[i].offsetWidth / 2);
                        cy = y - Math.round(el[i].offsetHeight / 2);
                        this.pages[m][n] = {
                            x: x,
                            y: y,
                            width: el[i].offsetWidth,
                            height: el[i].offsetHeight,
                            cx: cx,
                            cy: cy
                        };
                        if (x > this.maxScrollX) {
                            m++
                        }
                    }
                }
                this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);
                if (this.options.snapThreshold % 1 === 0) {
                    this.snapThresholdX = this.options.snapThreshold;
                    this.snapThresholdY = this.options.snapThreshold
                } else {
                    this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
                    this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold)
                }
            });
            this.on('flick', function() {
                var time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(this.x - this.startX), 1000), Math.min(Math.abs(this.y - this.startY), 1000)), 300);
                this.goToPage(this.currentPage.pageX + this.directionX, this.currentPage.pageY + this.directionY, time)
            })
        },
        _nearestSnap: function(x, y) {
            if (!this.pages.length) {
                return {
                    x: 0,
                    y: 0,
                    pageX: 0,
                    pageY: 0
                }
            }
            var i = 0,
                l = this.pages.length,
                m = 0;
            if (Math.abs(x - this.absStartX) < this.snapThresholdX && Math.abs(y - this.absStartY) < this.snapThresholdY) {
                return this.currentPage
            }
            if (x > 0) {
                x = 0
            } else if (x < this.maxScrollX) {
                x = this.maxScrollX
            }
            if (y > 0) {
                y = 0
            } else if (y < this.maxScrollY) {
                y = this.maxScrollY
            }
            for (; i < l; i++) {
                if (x >= this.pages[i][0].cx) {
                    x = this.pages[i][0].x;
                    break
                }
            }
            l = this.pages[i].length;
            for (; m < l; m++) {
                if (y >= this.pages[0][m].cy) {
                    y = this.pages[0][m].y;
                    break
                }
            }
            if (i == this.currentPage.pageX) {
                i += this.directionX;
                if (i < 0) {
                    i = 0
                } else if (i >= this.pages.length) {
                    i = this.pages.length - 1
                }
                x = this.pages[i][0].x
            }
            if (m == this.currentPage.pageY) {
                m += this.directionY;
                if (m < 0) {
                    m = 0
                } else if (m >= this.pages[0].length) {
                    m = this.pages[0].length - 1
                }
                y = this.pages[0][m].y
            }
            return {
                x: x,
                y: y,
                pageX: i,
                pageY: m
            }
        },
        goToPage: function(x, y, time, easing) {
            easing = easing || this.options.bounceEasing;
            if (x >= this.pages.length) {
                x = this.pages.length - 1
            } else if (x < 0) {
                x = 0
            }
            if (y >= this.pages[x].length) {
                y = this.pages[x].length - 1
            } else if (y < 0) {
                y = 0
            }
            var posX = this.pages[x][y].x,
                posY = this.pages[x][y].y;
            time = time === undefined ? this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(posX - this.x), 1000), Math.min(Math.abs(posY - this.y), 1000)), 300) : time;
            this.currentPage = {
                x: posX,
                y: posY,
                pageX: x,
                pageY: y
            };
            this.scrollTo(posX, posY, time, easing)
        },
        next: function(time, easing) {
            var x = this.currentPage.pageX,
                y = this.currentPage.pageY;
            x++;
            if (x >= this.pages.length && this.hasVerticalScroll) {
                x = 0;
                y++
            }
            this.goToPage(x, y, time, easing)
        },
        prev: function(time, easing) {
            var x = this.currentPage.pageX,
                y = this.currentPage.pageY;
            x--;
            if (x < 0 && this.hasVerticalScroll) {
                x = 0;
                y--
            }
            this.goToPage(x, y, time, easing)
        },
        _initKeys: function(e) {
            var keys = {
                pageUp: 33,
                pageDown: 34,
                end: 35,
                home: 36,
                left: 37,
                up: 38,
                right: 39,
                down: 40
            };
            var i;
            if (typeof this.options.keyBindings == 'object') {
                for (i in this.options.keyBindings) {
                    if (typeof this.options.keyBindings[i] == 'string') {
                        this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0)
                    }
                }
            } else {
                this.options.keyBindings = {}
            }
            for (i in keys) {
                this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i]
            }
            utils.addEvent(window, 'keydown', this);
            this.on('destroy', function() {
                utils.removeEvent(window, 'keydown', this)
            })
        },
        _key: function(e) {
            if (!this.enabled) {
                return
            }
            var snap = this.options.snap,
                newX = snap ? this.currentPage.pageX : this.x,
                newY = snap ? this.currentPage.pageY : this.y,
                now = utils.getTime(),
                prevTime = this.keyTime || 0,
                acceleration = 0.250,
                pos;
            if (this.options.useTransition && this.isInTransition) {
                pos = this.getComputedPosition();
                this._translate(Math.round(pos.x), Math.round(pos.y));
                this.isInTransition = false
            }
            this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;
            switch (e.keyCode) {
                case this.options.keyBindings.pageUp:
                    if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                        newX += snap ? 1 : this.wrapperWidth
                    } else {
                        newY += snap ? 1 : this.wrapperHeight
                    }
                    break;
                case this.options.keyBindings.pageDown:
                    if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                        newX -= snap ? 1 : this.wrapperWidth
                    } else {
                        newY -= snap ? 1 : this.wrapperHeight
                    }
                    break;
                case this.options.keyBindings.end:
                    newX = snap ? this.pages.length - 1 : this.maxScrollX;
                    newY = snap ? this.pages[0].length - 1 : this.maxScrollY;
                    break;
                case this.options.keyBindings.home:
                    newX = 0;
                    newY = 0;
                    break;
                case this.options.keyBindings.left:
                    newX += snap ? -1 : 5 + this.keyAcceleration >> 0;
                    break;
                case this.options.keyBindings.up:
                    newY += snap ? 1 : 5 + this.keyAcceleration >> 0;
                    break;
                case this.options.keyBindings.right:
                    newX -= snap ? -1 : 5 + this.keyAcceleration >> 0;
                    break;
                case this.options.keyBindings.down:
                    newY -= snap ? 1 : 5 + this.keyAcceleration >> 0;
                    break;
                default:
                    return
            }
            if (snap) {
                this.goToPage(newX, newY);
                return
            }
            if (newX > 0) {
                newX = 0;
                this.keyAcceleration = 0
            } else if (newX < this.maxScrollX) {
                newX = this.maxScrollX;
                this.keyAcceleration = 0
            }
            if (newY > 0) {
                newY = 0;
                this.keyAcceleration = 0
            } else if (newY < this.maxScrollY) {
                newY = this.maxScrollY;
                this.keyAcceleration = 0
            }
            this.scrollTo(newX, newY, 0);
            this.keyTime = now
        },
        _animate: function(destX, destY, duration, easingFn) {
            var that = this,
                startX = this.x,
                startY = this.y,
                startTime = utils.getTime(),
                destTime = startTime + duration;

            function step() {
                var now = utils.getTime(),
                    newX, newY, easing;
                if (now >= destTime) {
                    that.isAnimating = false;
                    that._translate(destX, destY);
                    if (!that.resetPosition(that.options.bounceTime)) {
                        that._execEvent('scrollEnd')
                    }
                    return
                }
                now = (now - startTime) / duration;
                easing = easingFn(now);
                newX = (destX - startX) * easing + startX;
                newY = (destY - startY) * easing + startY;
                that._translate(newX, newY);
                if (that.isAnimating) {
                    rAF(step)
                }
                if (that.options.probeType == 3) {
                    that._execEvent('scroll')
                }
            }
            this.isAnimating = true;
            step()
        },
        handleEvent: function(e) {
            switch (e.type) {
                case 'touchstart':
                case 'pointerdown':
                case 'MSPointerDown':
                case 'mousedown':
                    this._start(e);
                    break;
                case 'touchmove':
                case 'pointermove':
                case 'MSPointerMove':
                case 'mousemove':
                    this._move(e);
                    break;
                case 'touchend':
                case 'pointerup':
                case 'MSPointerUp':
                case 'mouseup':
                case 'touchcancel':
                case 'pointercancel':
                case 'MSPointerCancel':
                case 'mousecancel':
                    this._end(e);
                    break;
                case 'orientationchange':
                case 'resize':
                    this._resize();
                    break;
                case 'transitionend':
                case 'webkitTransitionEnd':
                case 'oTransitionEnd':
                case 'MSTransitionEnd':
                    this._transitionEnd(e);
                    break;
                case 'wheel':
                case 'DOMMouseScroll':
                case 'mousewheel':
                    this._wheel(e);
                    break;
                case 'keydown':
                    this._key(e);
                    break;
                case 'click':
                    if (!e._constructed) {
                        e.preventDefault();
                        e.stopPropagation()
                    }
                    break
            }
        }
    };

    function createDefaultScrollbar(direction, interactive, type) {
        var scrollbar = document.createElement('div'),
            indicator = document.createElement('div');
        if (type === true) {
            scrollbar.style.cssText = 'position:absolute;z-index:9999';
            indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px'
        }
        indicator.className = 'iScrollIndicator';
        if (direction == 'h') {
            if (type === true) {
                scrollbar.style.cssText += ';height:7px;left:2px;right:2px;bottom:0';
                indicator.style.height = '100%'
            }
            scrollbar.className = 'iScrollHorizontalScrollbar'
        } else {
            if (type === true) {
                scrollbar.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px';
                indicator.style.width = '100%'
            }
            scrollbar.className = 'iScrollVerticalScrollbar'
        }
        scrollbar.style.cssText += ';overflow:hidden';
        if (!interactive) {
            scrollbar.style.pointerEvents = 'none'
        }
        scrollbar.appendChild(indicator);
        return scrollbar
    }

    function Indicator(scroller, options) {
        this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
        this.wrapperStyle = this.wrapper.style;
        this.indicator = this.wrapper.children[0];
        this.indicatorStyle = this.indicator.style;
        this.scroller = scroller;
        this.options = {
            listenX: true,
            listenY: true,
            interactive: false,
            resize: true,
            defaultScrollbars: false,
            shrink: false,
            fade: false,
            speedRatioX: 0,
            speedRatioY: 0
        };
        for (var i in options) {
            this.options[i] = options[i]
        }
        this.sizeRatioX = 1;
        this.sizeRatioY = 1;
        this.maxPosX = 0;
        this.maxPosY = 0;
        if (this.options.interactive) {
            if (!this.options.disableTouch) {
                utils.addEvent(this.indicator, 'touchstart', this);
                utils.addEvent(window, 'touchend', this)
            }
            if (!this.options.disablePointer) {
                utils.addEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
                utils.addEvent(window, utils.prefixPointerEvent('pointerup'), this)
            }
            if (!this.options.disableMouse) {
                utils.addEvent(this.indicator, 'mousedown', this);
                utils.addEvent(window, 'mouseup', this)
            }
        }
        if (this.options.fade) {
            this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
            this.wrapperStyle[utils.style.transitionDuration] = utils.isBadAndroid ? '0.001s' : '0ms';
            this.wrapperStyle.opacity = '0'
        }
    }
    Indicator.prototype = {
        handleEvent: function(e) {
            switch (e.type) {
                case 'touchstart':
                case 'pointerdown':
                case 'MSPointerDown':
                case 'mousedown':
                    this._start(e);
                    break;
                case 'touchmove':
                case 'pointermove':
                case 'MSPointerMove':
                case 'mousemove':
                    this._move(e);
                    break;
                case 'touchend':
                case 'pointerup':
                case 'MSPointerUp':
                case 'mouseup':
                case 'touchcancel':
                case 'pointercancel':
                case 'MSPointerCancel':
                case 'mousecancel':
                    this._end(e);
                    break
            }
        },
        destroy: function() {
            if (this.options.interactive) {
                utils.removeEvent(this.indicator, 'touchstart', this);
                utils.removeEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
                utils.removeEvent(this.indicator, 'mousedown', this);
                utils.removeEvent(window, 'touchmove', this);
                utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
                utils.removeEvent(window, 'mousemove', this);
                utils.removeEvent(window, 'touchend', this);
                utils.removeEvent(window, utils.prefixPointerEvent('pointerup'), this);
                utils.removeEvent(window, 'mouseup', this)
            }
            if (this.options.defaultScrollbars) {
                this.wrapper.parentNode.removeChild(this.wrapper)
            }
        },
        _start: function(e) {
            var point = e.touches ? e.touches[0] : e;
            e.preventDefault();
            e.stopPropagation();
            this.transitionTime();
            this.initiated = true;
            this.moved = false;
            this.lastPointX = point.pageX;
            this.lastPointY = point.pageY;
            this.startTime = utils.getTime();
            if (!this.options.disableTouch) {
                utils.addEvent(window, 'touchmove', this)
            }
            if (!this.options.disablePointer) {
                utils.addEvent(window, utils.prefixPointerEvent('pointermove'), this)
            }
            if (!this.options.disableMouse) {
                utils.addEvent(window, 'mousemove', this)
            }
            this.scroller._execEvent('beforeScrollStart')
        },
        _move: function(e) {
            var point = e.touches ? e.touches[0] : e,
                deltaX, deltaY, newX, newY, timestamp = utils.getTime();
            if (!this.moved) {
                this.scroller._execEvent('scrollStart')
            }
            this.moved = true;
            deltaX = point.pageX - this.lastPointX;
            this.lastPointX = point.pageX;
            deltaY = point.pageY - this.lastPointY;
            this.lastPointY = point.pageY;
            newX = this.x + deltaX;
            newY = this.y + deltaY;
            this._pos(newX, newY);
            if (this.scroller.options.probeType == 1 && timestamp - this.startTime > 300) {
                this.startTime = timestamp;
                this.scroller._execEvent('scroll')
            } else if (this.scroller.options.probeType > 1) {
                this.scroller._execEvent('scroll')
            }
            e.preventDefault();
            e.stopPropagation()
        },
        _end: function(e) {
            if (!this.initiated) {
                return
            }
            this.initiated = false;
            e.preventDefault();
            e.stopPropagation();
            utils.removeEvent(window, 'touchmove', this);
            utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
            utils.removeEvent(window, 'mousemove', this);
            if (this.scroller.options.snap) {
                var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);
                var time = this.options.snapSpeed || Math.max(Math.max(Math.min(Math.abs(this.scroller.x - snap.x), 1000), Math.min(Math.abs(this.scroller.y - snap.y), 1000)), 300);
                if (this.scroller.x != snap.x || this.scroller.y != snap.y) {
                    this.scroller.directionX = 0;
                    this.scroller.directionY = 0;
                    this.scroller.currentPage = snap;
                    this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing)
                }
            }
            if (this.moved) {
                this.scroller._execEvent('scrollEnd')
            }
        },
        transitionTime: function(time) {
            time = time || 0;
            this.indicatorStyle[utils.style.transitionDuration] = time + 'ms';
            if (!time && utils.isBadAndroid) {
                this.indicatorStyle[utils.style.transitionDuration] = '0.001s'
            }
        },
        transitionTimingFunction: function(easing) {
            this.indicatorStyle[utils.style.transitionTimingFunction] = easing
        },
        refresh: function() {
            this.transitionTime();
            if (this.options.listenX && !this.options.listenY) {
                this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none'
            } else if (this.options.listenY && !this.options.listenX) {
                this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none'
            } else {
                this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none'
            }
            if (this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll) {
                utils.addClass(this.wrapper, 'iScrollBothScrollbars');
                utils.removeClass(this.wrapper, 'iScrollLoneScrollbar');
                if (this.options.defaultScrollbars && this.options.customStyle) {
                    if (this.options.listenX) {
                        this.wrapper.style.right = '8px'
                    } else {
                        this.wrapper.style.bottom = '8px'
                    }
                }
            } else {
                utils.removeClass(this.wrapper, 'iScrollBothScrollbars');
                utils.addClass(this.wrapper, 'iScrollLoneScrollbar');
                if (this.options.defaultScrollbars && this.options.customStyle) {
                    if (this.options.listenX) {
                        this.wrapper.style.right = '2px'
                    } else {
                        this.wrapper.style.bottom = '2px'
                    }
                }
            }
            var r = this.wrapper.offsetHeight;
            if (this.options.listenX) {
                this.wrapperWidth = this.wrapper.clientWidth;
                if (this.options.resize) {
                    this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
                    this.indicatorStyle.width = this.indicatorWidth + 'px'
                } else {
                    this.indicatorWidth = this.indicator.clientWidth
                }
                this.maxPosX = this.wrapperWidth - this.indicatorWidth;
                if (this.options.shrink == 'clip') {
                    this.minBoundaryX = -this.indicatorWidth + 8;
                    this.maxBoundaryX = this.wrapperWidth - 8
                } else {
                    this.minBoundaryX = 0;
                    this.maxBoundaryX = this.maxPosX
                }
                this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX))
            }
            if (this.options.listenY) {
                this.wrapperHeight = this.wrapper.clientHeight;
                if (this.options.resize) {
                    this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
                    this.indicatorStyle.height = this.indicatorHeight + 'px'
                } else {
                    this.indicatorHeight = this.indicator.clientHeight
                }
                this.maxPosY = this.wrapperHeight - this.indicatorHeight;
                if (this.options.shrink == 'clip') {
                    this.minBoundaryY = -this.indicatorHeight + 8;
                    this.maxBoundaryY = this.wrapperHeight - 8
                } else {
                    this.minBoundaryY = 0;
                    this.maxBoundaryY = this.maxPosY
                }
                this.maxPosY = this.wrapperHeight - this.indicatorHeight;
                this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY))
            }
            this.updatePosition()
        },
        updatePosition: function() {
            var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
                y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;
            if (!this.options.ignoreBoundaries) {
                if (x < this.minBoundaryX) {
                    if (this.options.shrink == 'scale') {
                        this.width = Math.max(this.indicatorWidth + x, 8);
                        this.indicatorStyle.width = this.width + 'px'
                    }
                    x = this.minBoundaryX
                } else if (x > this.maxBoundaryX) {
                    if (this.options.shrink == 'scale') {
                        this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
                        this.indicatorStyle.width = this.width + 'px';
                        x = this.maxPosX + this.indicatorWidth - this.width
                    } else {
                        x = this.maxBoundaryX
                    }
                } else if (this.options.shrink == 'scale' && this.width != this.indicatorWidth) {
                    this.width = this.indicatorWidth;
                    this.indicatorStyle.width = this.width + 'px'
                }
                if (y < this.minBoundaryY) {
                    if (this.options.shrink == 'scale') {
                        this.height = Math.max(this.indicatorHeight + y * 3, 8);
                        this.indicatorStyle.height = this.height + 'px'
                    }
                    y = this.minBoundaryY
                } else if (y > this.maxBoundaryY) {
                    if (this.options.shrink == 'scale') {
                        this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
                        this.indicatorStyle.height = this.height + 'px';
                        y = this.maxPosY + this.indicatorHeight - this.height
                    } else {
                        y = this.maxBoundaryY
                    }
                } else if (this.options.shrink == 'scale' && this.height != this.indicatorHeight) {
                    this.height = this.indicatorHeight;
                    this.indicatorStyle.height = this.height + 'px'
                }
            }
            this.x = x;
            this.y = y;
            if (this.scroller.options.useTransform) {
                this.indicatorStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ
            } else {
                this.indicatorStyle.left = x + 'px';
                this.indicatorStyle.top = y + 'px'
            }
        },
        _pos: function(x, y) {
            if (x < 0) {
                x = 0
            } else if (x > this.maxPosX) {
                x = this.maxPosX
            }
            if (y < 0) {
                y = 0
            } else if (y > this.maxPosY) {
                y = this.maxPosY
            }
            x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
            y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;
            this.scroller.scrollTo(x, y)
        },
        fade: function(val, hold) {
            if (hold && !this.visible) {
                return
            }
            clearTimeout(this.fadeTimeout);
            this.fadeTimeout = null;
            var time = val ? 250 : 500,
                delay = val ? 0 : 300;
            val = val ? '1' : '0';
            this.wrapperStyle[utils.style.transitionDuration] = time + 'ms';
            this.fadeTimeout = setTimeout((function(val) {
                this.wrapperStyle.opacity = val;
                this.visible = +val
            }).bind(this, val), delay)
        }
    };
    IScroll.utils = utils;
    return IScroll
})();
var iosSelectUtil = {
    isArray: function(arg1) {
        return Object.prototype.toString.call(arg1) === '[object Array]'
    },
    attrToData: function(dom, index) {
        var obj = {};
        for (var p in dom.dataset) {
            obj[p] = dom.dataset[p]
        }
        obj['dom'] = dom;
        obj['atindex'] = index;
        return obj
    },
    attrToHtml: function(obj) {
        var html = '';
        for (var p in obj) {
            html += 'data-' + p + '="' + obj[p] + '"'
        }
        return html
    }
};

function Layer(html, opts) {
    if (!(this instanceof Layer)) {
        return new Layer(html, opts)
    }
    this.html = html;
    this.opts = opts;
    var el = document.createElement('div');
    el.className = 'olay';
    var layer_el = document.createElement('div');
    layer_el.className = 'layer';
    this.el = el;
    this.layer_el = layer_el;
    this.init()
}
Layer.prototype = {
    init: function() {
        this.layer_el.innerHTML = this.html;
        document.getElementById('content').appendChild(this.el);
        this.el.appendChild(this.layer_el);
        this.el.style.height = Math.max(document.documentElement.getBoundingClientRect().height, window.innerHeight);
        if (this.opts.className) {
            this.el.className += ' ' + this.opts.className
        }
        this.bindEvent()
    },
    bindEvent: function() {
        var sureDom = this.el.querySelectorAll('.sure');
        var closeDom = this.el.querySelectorAll('.close');
        var self = this;
        for (var i = 0, len = sureDom.length; i < len; i++) {
            sureDom[i].addEventListener('click', function(e) {
                self.close()
            })
        }
        for (var i = 0, len = closeDom.length; i < len; i++) {
            closeDom[i].addEventListener('click', function(e) {
                self.close()
            })
        }
    },
    close: function() {
        if (this.el) {
            this.el.parentNode.removeChild(this.el);
            this.el = null
        }
    }
}

function IosSelect(level, data, options) {
    if (!iosSelectUtil.isArray(data) || data.length === 0 || !iosSelectUtil.isArray(data[0])) {
        return
    }
    this.data = data;
    this.level = level || 1;
    this.options = options;
    this.typeBox = this.level === 1 ? 'one-level-box' : (this.level === 2 ? 'two-level-box' : 'three-level-box');
    this.callback = options.callback;
    this.title = options.title || '';
    this.itemHeight = options.itemHeight || 35;
    this.headerHeight = options.headerHeight || 44;
    this.init()
};
IosSelect.prototype = {
    init: function() {
        this.initLayer();
        this.selectOneObj = {};
        this.selectTwoObj = {};
        this.selectThreeObj = {};
        this.setOneLevel(this.options.oneLevelId, this.options.twoLevelId, this.options.threeLevelId)
    },
    initLayer: function() {
        var self = this;
        var all_html = ['<div class="iosselect-header" style="display:block">', '<h2 id="iosSelectTitle"></h2>', '<a href="javascript:void(0)" class="close">取消</a>', '<a href="javascript:void(0)" class="sure">确定</a>', '</div>', '<section class="iosselect-box">', '<div class="one-level-contain" id="oneLevelContain">', '<ul class="select-one-level">', '</ul>', '</div>', '<div class="two-level-contain" id="twoLevelContain">', '<ul class="select-two-level">', '</ul>', '</div>', '<div class="three-level-contain" id="threeLevelContain">', '<ul class="select-three-level">', '</ul>', '</div>', '</section>', '<hr class="cover-area1"/>', '<hr class="cover-area2"/>'].join('\r\n');
        this.iosSelectLayer = new Layer(all_html, {
            className: 'ios-select-widget-box ' + this.typeBox + (this.options.addClassName ? ' ' + this.options.addClassName : '')
        });
        this.iosSelectTitleDom = document.querySelector('#iosSelectTitle');
        if (this.options.title) {
            this.iosSelectTitleDom.innerHTML = this.options.title
        }
        if (this.options.headerHeight && this.options.itemHeight) {
            this.coverArea1Dom = document.querySelector('.cover-area1');
            this.coverArea1Dom.style.top = this.headerHeight + this.itemHeight * 3 + 'px';
            this.coverArea2Dom = document.querySelector('.cover-area2');
            this.coverArea2Dom.style.top = this.headerHeight + this.itemHeight * 4 + 'px'
        }
        this.oneLevelContainDom = document.querySelector('#oneLevelContain');
        this.twoLevelContainDom = document.querySelector('#twoLevelContain');
        this.threeLevelContainDom = document.querySelector('#threeLevelContain');
        this.oneLevelUlContainDom = document.querySelector('.select-one-level');
        this.twoLevelUlContainDom = document.querySelector('.select-two-level');
        this.threeLevelUlContainDom = document.querySelector('.select-three-level');
        this.iosSelectLayer.el.querySelector('.layer').style.height = this.itemHeight * 7 + this.headerHeight + 'px';
        this.oneLevelContainDom.style.height = this.itemHeight * 7 + 'px';
        this.scrollOne = new IScroll('#oneLevelContain', {
            probeType: 3,
            bounce: false
        });
        this.scrollOne.on('scrollStart', function() {
            Array.prototype.slice.call(self.oneLevelContainDom.querySelectorAll('li')).forEach(function(v, i, o) {
                if (v.classList.contains('at')) {
                    v.classList.remove('at')
                } else if (v.classList.contains('side1')) {
                    v.classList.remove('side1')
                } else if (v.classList.contains('side2')) {
                    v.classList.remove('side2')
                }
            })
        });
        this.scrollOne.on('scroll', function() {
            var pa = Math.abs(this.y) / self.itemHeight;
            var plast = 1;
            plast = Math.round(pa) + 1;
            Array.prototype.slice.call(self.oneLevelContainDom.querySelectorAll('li')).forEach(function(v, i, o) {
                if (v.classList.contains('at')) {
                    v.classList.remove('at')
                } else if (v.classList.contains('side1')) {
                    v.classList.remove('side1')
                } else if (v.classList.contains('side2')) {
                    v.classList.remove('side2')
                }
            });
            var pdom = self.oneLevelContainDom.querySelector('li:nth-child(' + (plast + 3) + ')');
            pdom.classList.add('at');
            self.oneLevelContainDom.querySelector('li:nth-child(' + (plast + 2) + ')').classList.add('side1');
            self.oneLevelContainDom.querySelector('li:nth-child(' + (plast + 1) + ')').classList.add('side2');
            self.oneLevelContainDom.querySelector('li:nth-child(' + (plast + 4) + ')').classList.add('side1');
            self.oneLevelContainDom.querySelector('li:nth-child(' + (plast + 5) + ')').classList.add('side2')
        });
        this.scrollOne.on('scrollEnd', function() {
            var pa = Math.abs(this.y) / self.itemHeight;
            var plast = 1;
            var to = 0;
            if (Math.ceil(pa) === Math.round(pa)) {
                to = Math.ceil(pa) * self.itemHeight;
                plast = Math.ceil(pa) + 1
            } else {
                to = Math.floor(pa) * self.itemHeight;
                plast = Math.floor(pa) + 1
            }
            self.scrollOne.scrollTo(0, -to, 0);
            var pdom = self.oneLevelContainDom.querySelector('li:nth-child(' + (plast + 3) + ')');
            Array.prototype.slice.call(self.oneLevelContainDom.querySelectorAll('li')).forEach(function(v, i, o) {
                if (v.classList.contains('at')) {
                    v.classList.remove('at')
                } else if (v.classList.contains('side1')) {
                    v.classList.remove('side1')
                } else if (v.classList.contains('side2')) {
                    v.classList.remove('side2')
                }
            });
            pdom.classList.add('at');
            self.oneLevelContainDom.querySelector('li:nth-child(' + (plast + 2) + ')').classList.add('side1');
            self.oneLevelContainDom.querySelector('li:nth-child(' + (plast + 1) + ')').classList.add('side2');
            self.oneLevelContainDom.querySelector('li:nth-child(' + (plast + 4) + ')').classList.add('side1');
            self.oneLevelContainDom.querySelector('li:nth-child(' + (plast + 5) + ')').classList.add('side2');
            self.selectOneObj = iosSelectUtil.attrToData(pdom, plast);
            if (self.level > 1 && self.options.oneTwoRelation === 1) {
                self.setTwoLevel(self.selectOneObj.id)
            }
        });
        if (this.level >= 2) {
            this.twoLevelContainDom.style.height = this.itemHeight * 7 + 'px';
            this.scrollTwo = new IScroll('#twoLevelContain', {
                probeType: 3,
                bounce: false
            });
            this.scrollTwo.on('scrollStart', function() {
                Array.prototype.slice.call(self.twoLevelContainDom.querySelectorAll('li')).forEach(function(v, i, o) {
                    if (v.classList.contains('at')) {
                        v.classList.remove('at')
                    } else if (v.classList.contains('side1')) {
                        v.classList.remove('side1')
                    } else if (v.classList.contains('side2')) {
                        v.classList.remove('side2')
                    }
                })
            });
            this.scrollTwo.on('scroll', function() {
                var pa = Math.abs(this.y) / self.itemHeight;
                var plast = 0;
                plast = Math.round(pa) + 1;
                var cdom = self.twoLevelContainDom.querySelector('li:nth-child(' + (plast + 3) + ')');
                Array.prototype.slice.call(self.twoLevelContainDom.querySelectorAll('li')).forEach(function(v, i, o) {
                    if (v.classList.contains('at')) {
                        v.classList.remove('at')
                    } else if (v.classList.contains('side1')) {
                        v.classList.remove('side1')
                    } else if (v.classList.contains('side2')) {
                        v.classList.remove('side2')
                    }
                });
                cdom.classList.add('at');
                self.twoLevelContainDom.querySelector('li:nth-child(' + (plast + 2) + ')').classList.add('side1');
                self.twoLevelContainDom.querySelector('li:nth-child(' + (plast + 1) + ')').classList.add('side2');
                self.twoLevelContainDom.querySelector('li:nth-child(' + (plast + 4) + ')').classList.add('side1');
                self.twoLevelContainDom.querySelector('li:nth-child(' + (plast + 5) + ')').classList.add('side2')
            });
            this.scrollTwo.on('scrollEnd', function() {
                var pa = Math.abs(this.y) / self.itemHeight;
                var plast = 1;
                var to = 0;
                if (Math.ceil(pa) === Math.round(pa)) {
                    to = Math.ceil(pa) * self.itemHeight;
                    plast = Math.ceil(pa) + 1
                } else {
                    to = Math.floor(pa) * self.itemHeight;
                    plast = Math.floor(pa) + 1
                }
                self.scrollTwo.scrollTo(0, -to, 0);
                var cdom = self.twoLevelContainDom.querySelector('li:nth-child(' + (plast + 3) + ')');
                Array.prototype.slice.call(self.twoLevelContainDom.querySelectorAll('li')).forEach(function(v, i, o) {
                    if (v.classList.contains('at')) {
                        v.classList.remove('at')
                    } else if (v.classList.contains('side1')) {
                        v.classList.remove('side1')
                    } else if (v.classList.contains('side2')) {
                        v.classList.remove('side2')
                    }
                });
                cdom.classList.add('at');
                self.twoLevelContainDom.querySelector('li:nth-child(' + (plast + 2) + ')').classList.add('side1');
                self.twoLevelContainDom.querySelector('li:nth-child(' + (plast + 1) + ')').classList.add('side2');
                self.twoLevelContainDom.querySelector('li:nth-child(' + (plast + 4) + ')').classList.add('side1');
                self.twoLevelContainDom.querySelector('li:nth-child(' + (plast + 5) + ')').classList.add('side2');
                self.selectTwoObj = iosSelectUtil.attrToData(cdom, plast);
                if (self.level === 3 && self.options.twoThreeRelation === 1) {
                    self.setThreeLevel(self.selectOneObj.id, self.selectTwoObj.id)
                }
            })
        }
        if (this.level === 3) {
            this.threeLevelContainDom.style.height = this.itemHeight * 7 + 'px';
            this.scrollThree = new IScroll('#threeLevelContain', {
                probeType: 3,
                bounce: false
            });
            this.scrollThree.on('scrollStart', function() {
                Array.prototype.slice.call(self.threeLevelContainDom.querySelectorAll('li')).forEach(function(v, i, o) {
                    if (v.classList.contains('at')) {
                        v.classList.remove('at')
                    } else if (v.classList.contains('side1')) {
                        v.classList.remove('side1')
                    } else if (v.classList.contains('side2')) {
                        v.classList.remove('side2')
                    }
                })
            });
            this.scrollThree.on('scroll', function() {
                var pa = Math.abs(this.y) / self.itemHeight;
                var plast = 0;
                plast = Math.round(pa) + 1;
                var ddom = self.threeLevelContainDom.querySelector('li:nth-child(' + (plast + 3) + ')');
                Array.prototype.slice.call(self.threeLevelContainDom.querySelectorAll('li')).forEach(function(v, i, o) {
                    if (v.classList.contains('at')) {
                        v.classList.remove('at')
                    } else if (v.classList.contains('side1')) {
                        v.classList.remove('side1')
                    } else if (v.classList.contains('side2')) {
                        v.classList.remove('side2')
                    }
                });
                ddom.classList.add('at');
                self.threeLevelContainDom.querySelector('li:nth-child(' + (plast + 2) + ')').classList.add('side1');
                self.threeLevelContainDom.querySelector('li:nth-child(' + (plast + 1) + ')').classList.add('side2');
                self.threeLevelContainDom.querySelector('li:nth-child(' + (plast + 4) + ')').classList.add('side1');
                self.threeLevelContainDom.querySelector('li:nth-child(' + (plast + 5) + ')').classList.add('side2')
            });
            this.scrollThree.on('scrollEnd', function() {
                var pa = Math.abs(this.y) / self.itemHeight;
                var plast = 1;
                var to = 0;
                if (Math.ceil(pa) === Math.round(pa)) {
                    to = Math.ceil(pa) * self.itemHeight;
                    plast = Math.ceil(pa) + 1
                } else {
                    to = Math.floor(pa) * self.itemHeight;
                    plast = Math.floor(pa) + 1
                }
                self.scrollThree.scrollTo(0, -to, 0);
                var ddom = self.threeLevelContainDom.querySelector('li:nth-child(' + (plast + 3) + ')');
                Array.prototype.slice.call(self.threeLevelContainDom.querySelectorAll('li')).forEach(function(v, i, o) {
                    if (v.classList.contains('at')) {
                        v.classList.remove('at')
                    } else if (v.classList.contains('side1')) {
                        v.classList.remove('side1')
                    } else if (v.classList.contains('side2')) {
                        v.classList.remove('side2')
                    }
                });
                ddom.classList.add('at');
                self.threeLevelContainDom.querySelector('li:nth-child(' + (plast + 2) + ')').classList.add('side1');
                self.threeLevelContainDom.querySelector('li:nth-child(' + (plast + 1) + ')').classList.add('side2');
                self.threeLevelContainDom.querySelector('li:nth-child(' + (plast + 4) + ')').classList.add('side1');
                self.threeLevelContainDom.querySelector('li:nth-child(' + (plast + 5) + ')').classList.add('side2');
                self.selectThreeObj = iosSelectUtil.attrToData(ddom, plast)
            })
        }
        this.selectBtnDom = this.iosSelectLayer.el.querySelector('.sure');
        this.selectBtnDom.addEventListener('click', function(e) {
            self.callback && self.callback(self.selectOneObj, self.selectTwoObj, self.selectThreeObj);
            self.iosSelectLayer.close()
        })
    },
    getOneLevel: function() {
        return this.data[0]
    },
    setOneLevel: function(oneLevelId, twoLevelId, threeLevelId) {
        var oneLevelData = this.getOneLevel();
        if (!oneLevelId) {
            oneLevelId = oneLevelData[0]['id']
        }
        var oneHtml = '';
        var self = this;
        var atIndex = 0;
        oneHtml += '<li></li>';
        oneHtml += '<li></li>';
        oneHtml += '<li></li>';
        oneLevelData.forEach(function(v, i, o) {
            if (v.id === oneLevelId) {
                oneHtml += '<li ' + iosSelectUtil.attrToHtml(v) + ' class="at">' + v.value + '</li>';
                atIndex = i + 1 + 3
            } else {
                oneHtml += '<li ' + iosSelectUtil.attrToHtml(v) + '>' + v.value + '</li>'
            }
        });
        oneHtml += '<li></li>';
        oneHtml += '<li></li>';
        oneHtml += '<li></li>';
        this.oneLevelUlContainDom.innerHTML = oneHtml;
        this.scrollOne.refresh();
        this.scrollOne.scrollToElement('li:nth-child(' + (atIndex - 3) + ')', 0);
        if (this.level >= 2) {
            this.setTwoLevel(oneLevelId, twoLevelId, threeLevelId)
        }
        var pdom = this.oneLevelContainDom.querySelector('.at');
        this.oneLevelContainDom.querySelector('li:nth-child(' + (atIndex - 1) + ')').classList.add('side1');
        this.oneLevelContainDom.querySelector('li:nth-child(' + (atIndex - 2) + ')').classList.add('side2');
        this.oneLevelContainDom.querySelector('li:nth-child(' + (atIndex + 1) + ')').classList.add('side1');
        this.oneLevelContainDom.querySelector('li:nth-child(' + (atIndex + 2) + ')').classList.add('side2');
        this.selectOneObj = iosSelectUtil.attrToData(pdom, atIndex)
    },
    getTwoLevel: function(oneLevelId) {
        if (!iosSelectUtil.isArray(this.data[1])) {
            throw new Error('data format error');
        }
        var twoLevelData = [];
        if (this.options.oneTwoRelation === 1) {
            this.data[1].forEach(function(v, i, o) {
                if (v['parentId'] === oneLevelId) {
                    twoLevelData.push(v)
                }
            })
        } else {
            twoLevelData = this.data[1]
        }
        return twoLevelData
    },
    setTwoLevel: function(oneLevelId, twoLevelId, threeLevelId) {
        var twoLevelData = this.getTwoLevel(oneLevelId);
        var atIndex = 0;
        if (!twoLevelId) {
            twoLevelId = twoLevelData[0]['id']
        }
        var twoHtml = '';
        var self = this;
        twoHtml += '<li></li>';
        twoHtml += '<li></li>';
        twoHtml += '<li></li>';
        twoLevelData.forEach(function(v, i, o) {
            if (v.id === twoLevelId) {
                twoHtml += '<li ' + iosSelectUtil.attrToHtml(v) + ' class="at">' + v.value + '</li>';
                atIndex = i + 1 + 3
            } else {
                twoHtml += '<li ' + iosSelectUtil.attrToHtml(v) + '>' + v.value + '</li>'
            }
        });
        twoHtml += '<li></li>';
        twoHtml += '<li></li>';
        twoHtml += '<li></li>';
        this.twoLevelUlContainDom.innerHTML = twoHtml;
        this.scrollTwo.refresh();
        this.scrollTwo.scrollToElement(':nth-child(' + (atIndex - 3) + ')', 0);
        if (this.level === 3) {
            this.setThreeLevel(oneLevelId, twoLevelId, threeLevelId)
        }
        var cdom = self.twoLevelContainDom.querySelector('li:nth-child(' + atIndex + ')');
        cdom.classList.add('at');
        self.twoLevelContainDom.querySelector('li:nth-child(' + (atIndex - 1) + ')').classList.add('side1');
        self.twoLevelContainDom.querySelector('li:nth-child(' + (atIndex - 2) + ')').classList.add('side2');
        self.twoLevelContainDom.querySelector('li:nth-child(' + (atIndex + 1) + ')').classList.add('side1');
        self.twoLevelContainDom.querySelector('li:nth-child(' + (atIndex + 2) + ')').classList.add('side2');
        self.selectTwoObj = iosSelectUtil.attrToData(cdom, atIndex)
    },
    getThreeLevel: function(twoLevelId) {
        if (!iosSelectUtil.isArray(this.data[2])) {
            throw new Error('data format error');
        }
        var threeLevelData = [];
        if (this.options.twoThreeRelation === 1) {
            this.data[2].forEach(function(v, i, o) {
                if (v['parentId'] === twoLevelId) {
                    threeLevelData.push(v)
                }
            })
        } else {
            threeLevelData = this.data[2]
        }
        return threeLevelData
    },
    setThreeLevel: function(oneLevelId, twoLevelId, threeLevelId) {
        var threeLevelData = this.getThreeLevel(twoLevelId);
        var atIndex = 0;
        if (!threeLevelId) {
            threeLevelId = threeLevelData[0]['id']
        }
        var threeHtml = '';
        var self = this;
        threeHtml += '<li></li>';
        threeHtml += '<li></li>';
        threeHtml += '<li></li>';
        threeLevelData.forEach(function(v, i, o) {
            if (v.id === threeLevelId) {
                threeHtml += '<li ' + iosSelectUtil.attrToHtml(v) + ' class="at">' + v.value + '</li>';
                atIndex = i + 1 + 3
            } else {
                threeHtml += '<li ' + iosSelectUtil.attrToHtml(v) + '>' + v.value + '</li>'
            }
        });
        threeHtml += '<li></li>';
        threeHtml += '<li></li>';
        threeHtml += '<li></li>';
        this.threeLevelUlContainDom.innerHTML = threeHtml;
        this.scrollThree.refresh();
        this.scrollThree.scrollToElement(':nth-child(' + (atIndex - 3) + ')', 0);
        var ddom = self.threeLevelContainDom.querySelector('li:nth-child(' + atIndex + ')');
        ddom.classList.add('at');
        self.threeLevelContainDom.querySelector('li:nth-child(' + (atIndex - 1) + ')').classList.add('side1');
        self.threeLevelContainDom.querySelector('li:nth-child(' + (atIndex - 2) + ')').classList.add('side2');
        self.threeLevelContainDom.querySelector('li:nth-child(' + (atIndex + 1) + ')').classList.add('side1');
        self.threeLevelContainDom.querySelector('li:nth-child(' + (atIndex + 2) + ')').classList.add('side2');
        self.selectThreeObj = iosSelectUtil.attrToData(ddom, atIndex)
    }
}
if (typeof module != 'undefined' && module.exports) {
    module.exports = IosSelect
} else if (typeof define == 'function' && define.amd) {
    define(function() {
        return IosSelect
    })
} else {
    window.IosSelect = IosSelect
}

function $md5(string) {
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22;
    var S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20;
    var S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23;
    var S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;
    string = uTF8Encode(string);
    x = convertToWordArray(string);
    a = 1732584193;
    b = 4023233417;
    c = 2562383102;
    d = 271733878;
    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 3614090360);
        d = FF(d, a, b, c, x[k + 1], S12, 3905402710);
        c = FF(c, d, a, b, x[k + 2], S13, 606105819);
        b = FF(b, c, d, a, x[k + 3], S14, 3250441966);
        a = FF(a, b, c, d, x[k + 4], S11, 4118548399);
        d = FF(d, a, b, c, x[k + 5], S12, 1200080426);
        c = FF(c, d, a, b, x[k + 6], S13, 2821735955);
        b = FF(b, c, d, a, x[k + 7], S14, 4249261313);
        a = FF(a, b, c, d, x[k + 8], S11, 1770035416);
        d = FF(d, a, b, c, x[k + 9], S12, 2336552879);
        c = FF(c, d, a, b, x[k + 10], S13, 4294925233);
        b = FF(b, c, d, a, x[k + 11], S14, 2304563134);
        a = FF(a, b, c, d, x[k + 12], S11, 1804603682);
        d = FF(d, a, b, c, x[k + 13], S12, 4254626195);
        c = FF(c, d, a, b, x[k + 14], S13, 2792965006);
        b = FF(b, c, d, a, x[k + 15], S14, 1236535329);
        a = GG(a, b, c, d, x[k + 1], S21, 4129170786);
        d = GG(d, a, b, c, x[k + 6], S22, 3225465664);
        c = GG(c, d, a, b, x[k + 11], S23, 643717713);
        b = GG(b, c, d, a, x[k + 0], S24, 3921069994);
        a = GG(a, b, c, d, x[k + 5], S21, 3593408605);
        d = GG(d, a, b, c, x[k + 10], S22, 38016083);
        c = GG(c, d, a, b, x[k + 15], S23, 3634488961);
        b = GG(b, c, d, a, x[k + 4], S24, 3889429448);
        a = GG(a, b, c, d, x[k + 9], S21, 568446438);
        d = GG(d, a, b, c, x[k + 14], S22, 3275163606);
        c = GG(c, d, a, b, x[k + 3], S23, 4107603335);
        b = GG(b, c, d, a, x[k + 8], S24, 1163531501);
        a = GG(a, b, c, d, x[k + 13], S21, 2850285829);
        d = GG(d, a, b, c, x[k + 2], S22, 4243563512);
        c = GG(c, d, a, b, x[k + 7], S23, 1735328473);
        b = GG(b, c, d, a, x[k + 12], S24, 2368359562);
        a = HH(a, b, c, d, x[k + 5], S31, 4294588738);
        d = HH(d, a, b, c, x[k + 8], S32, 2272392833);
        c = HH(c, d, a, b, x[k + 11], S33, 1839030562);
        b = HH(b, c, d, a, x[k + 14], S34, 4259657740);
        a = HH(a, b, c, d, x[k + 1], S31, 2763975236);
        d = HH(d, a, b, c, x[k + 4], S32, 1272893353);
        c = HH(c, d, a, b, x[k + 7], S33, 4139469664);
        b = HH(b, c, d, a, x[k + 10], S34, 3200236656);
        a = HH(a, b, c, d, x[k + 13], S31, 681279174);
        d = HH(d, a, b, c, x[k + 0], S32, 3936430074);
        c = HH(c, d, a, b, x[k + 3], S33, 3572445317);
        b = HH(b, c, d, a, x[k + 6], S34, 76029189);
        a = HH(a, b, c, d, x[k + 9], S31, 3654602809);
        d = HH(d, a, b, c, x[k + 12], S32, 3873151461);
        c = HH(c, d, a, b, x[k + 15], S33, 530742520);
        b = HH(b, c, d, a, x[k + 2], S34, 3299628645);
        a = II(a, b, c, d, x[k + 0], S41, 4096336452);
        d = II(d, a, b, c, x[k + 7], S42, 1126891415);
        c = II(c, d, a, b, x[k + 14], S43, 2878612391);
        b = II(b, c, d, a, x[k + 5], S44, 4237533241);
        a = II(a, b, c, d, x[k + 12], S41, 1700485571);
        d = II(d, a, b, c, x[k + 3], S42, 2399980690);
        c = II(c, d, a, b, x[k + 10], S43, 4293915773);
        b = II(b, c, d, a, x[k + 1], S44, 2240044497);
        a = II(a, b, c, d, x[k + 8], S41, 1873313359);
        d = II(d, a, b, c, x[k + 15], S42, 4264355552);
        c = II(c, d, a, b, x[k + 6], S43, 2734768916);
        b = II(b, c, d, a, x[k + 13], S44, 1309151649);
        a = II(a, b, c, d, x[k + 4], S41, 4149444226);
        d = II(d, a, b, c, x[k + 11], S42, 3174756917);
        c = II(c, d, a, b, x[k + 2], S43, 718787259);
        b = II(b, c, d, a, x[k + 9], S44, 3951481745);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD)
    }
    var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    return tempValue.toLowerCase()
}