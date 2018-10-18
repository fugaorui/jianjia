/* 
 * @Author: anchen
 * @Date:   2016-06-08 11:21:49
 * @Last Modified by:   anchen
 * @Last Modified time: 2017-03-09 12:25:02
 */
;(function ($) {
    $.extend($, {
        /**
         * @param String a   新窗口名称
         * @param String b   打开动画
         */
        uexOpen: function (a, b) {
            var html = a + '.html'
            //isApp ? uexWindow.open(a,'0',html,(b)?b:2,'','',0,0,0,0) : window.location = html;
            isApp ? uexWindow.open(a, '0', html, (b) ? b : 2, '', '', 4) : window.location = html;
            console.log('&&&&&&&&&&page&&&&&' + html)
        },
        uexOpen2: function (a, b) {
            var html = a + '.html'
            isApp ? uexWindow.open(a, '0', html, (b) ? b : 2, '', '', 0, 0, 0, 0) : window.location = html;
			//if(isApp) setTimeout(function(){uexWindow.close()}, 4000)
            console.log('&&&&&&&&&&page&&&&&' + html)
        },
        uexBack: function (a, b, c) {
            !isApp ? history.go(-1) : uexWindow.close(-1);
        },
        uexClose: function () {
            uexWindow.close(-1);
        },
        /**
         * 在其他窗口中执行指定主窗口中的代码
         * @param String wn  需要执行代码窗口的名称
         * @param String scr 需要执行的代码
         */
        uescript: function (wn, scr) {
            uexWindow.evaluateScript(wn, '0', scr);
        },
        /**
         * 在其他窗口中执行指定浮动窗口中的代码
         * @param String wn  需要执行代码浮动窗口所在的主窗口的名称
         * @param String pn  需要执行代码的浮动窗口的名称
         * @param String scr 需要执行的代码
         */
        ueppscript: function (wn, pn, scr) {
            uexWindow.evaluatePopoverScript(wn, pn, scr);
        },
        log: function (a) {
            console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&=' + a)
        },
        getStorage: function (a) {
            return localStorage.getItem(a);
        },
        setStorage: function (a, b) {
            localStorage.setItem(a, b);
        },
        removeStorage: function () {
            localStorage.clear();
        },
        getSession: function (a) {
            return sessionStorage.getItem(a);
        },
        setSession: function (a, b) {
            sessionStorage.setItem(a, b);
        },
        /**
         * MD5 加密
         * @example $.md5('md5') return  1bc29b36f623ba82aaf6724fd3b16718
         */
        md5: function (string) {
            return $md5(string)
        },
        /**
         * 时间转换
         * @param   Date   date
         * @param   Number num
         * @example Number  0  data return  2016-7-4   时间戳转换日期
         * @example Number  1  time return  14:19:38   时间戳转换时分
         * @example Number  2  week return  星期一     时间戳转星期几
         * @example Number  3  unix return  星期一     日期转时间戳
         */
        time: function (time, num) {
            var a = {}
            var d = time ? new Date(time) : new Date(), str = '';
            a.data = d.getFullYear() + '-' + di((d.getMonth() + 1)) + '-' + di(d.getDate());
            a.time = di(d.getHours()) + ':' + di(d.getMinutes()) + ':' + di(d.getSeconds())
            a.minSecon = di(d.getMinutes()) + ':' + di(d.getSeconds())
            var date = a.data;
            var day = new Date(Date.parse(date.replace(/-/g, '/')));
            var today = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
            a.week = today[day.getDay()];
            if (num == 0) {
                return a.data
            } else if (num == 1) {
                return a.time
            } else if (num == 2) {
                return a.week
            } else if (num == 3) {
                var tmp_datetime = time.replace(/:/g, '-');
                tmp_datetime = tmp_datetime.replace(/ /g, '-');
                var arr = tmp_datetime.split("-");
                var now = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
                a.unix = parseInt(now.getTime() / 1000);
                return a.unix
            } else if (num == 4) {
                return a.minSecon
            }
            function di(n) {
                return n < 9 ? '0'+n : n;
            }
        },
        /**
         * IOS 日期转换
         * @param   Date date
         */
        iosNewData: function (date) {
            var time = isIOS ? date.replace(/-/g, '/').replace(/"/g, '') : date;
            return time
        },
        /**
         * 滑动删除，修改
         * @param object
         *{
     *  this : 绑定元素
     *  delete : 删除按钮事件
     *  change : 修改按钮事件
     *}
         */
        slideFun: function (obj) {
            $.loadScript('../js/flipsnap.js', function () {
                var flipsnap = [], flag = true, move, _this = obj.this, delOn = obj.delete, chaOn = obj.change;
                var addWidth = delOn && chaOn ? 200 : 100;
                var content = $('.content');
                content.css("width", "");
                $(_this).each(function (i, e) {
                    var item = $(e);
                    var height = parseFloat(item.css('height'));
                    if ((delOn && item.children('.deleteButton').length == 0) || (chaOn && item.children('.changeButton').length == 0)) {
                        var style = 'height: ' + height + 'px; line-height: ' + height + 'px;width:100px;text-align: center;color:#ffffff;position: absolute;z-index: 20;top:0;'
                        var delbtn = $('<div class="deleteButton" style="' + style + ';background: red;right:-' + addWidth + 'px;">删除</div>');
                        var chabtn = $('<div class="changeButton" style="' + style + ';background: #FDA619;right:-100px;">修改</div>');
                        item.children().each(function (i, child) {
                            $(child).width($(child).width());
                        });
                        chaOn && item.append(chabtn);
                        delOn && item.append(delbtn);
                        delOn && delbtn.on("click", delOn);
                        chaOn && chabtn.on("click", chaOn);
                        item.append('<div class="delete-overlay" style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;background: rgba(0, 0, 0, 0.4);z-index: 10;visibility: hidden;opacity: 0;"></div>');
                    }
                    ;
                    flipsnap[i] = Flipsnap(e, {
                        distance: addWidth,
                        maxPoint: 1
                    });
                    flipsnap[i].element.addEventListener('fstouchmove', function (ev) {
                        flag = true;
                        $.each(flipsnap, function (i, e) {
                            if (e.currentPoint == 1) {
                                flag = false;
                                $('.delete-overlay').css("visibility", "visible");
                                move && move.toPrev();
                                (move !== e) && (move = e);
                            }
                        });
                        if (flag) {
                            move = null;
                            $('.delete-overlay').css("visibility", "hidden");
                        }
                    }, false);

                });
                $(document).on("click", function () {
                    if (move) {
                        move.toPrev();
                        move = null;
                    }
                });
                $.refreshScroller();
            })
        },
        to_unix: function (time) { /*日期转时间戳*/

        },
        /**
         * 跳转浏览器
         */
        openBrowser: function (url, n) {
            isIOS ? uexVideo.openSafari(url) : uexOpenWebView.OpenWithWebView(url);
        },
        /*
         * @example $.setInterval(item, calback)
         * @param item：监听的localStorage属性，默认为"changeFlag"
         * @param calback：localStorage存在item属性时执行，默认刷新页面
         */
        monitorVal: function (obj) {
            alert(obj)
            $.each(obj, function (i, calback) {
                var interval = setInterval(function () {
                    if ($.getStorage(i) == '1') {
                        $.setStorage(i, '0')
                        calback == '' ? window.location.reload() : calback();
                    }
                }, 100);
            });
        },
        monitorVal2: function (obj) {
            $.each(obj, function (i, calback) {
                var interval = setInterval(function () {
                    if ($.getStorage(i) == '1') {
                        $.setStorage(i, '0')
                        calback == '' ? window.location.reload() : calback(interval);
                    }
                }, 0);
            });
        },
        /*
         * 动态加载JS
         * @param String   url     js文件URL
         * @param function callback  localStorage存在item属性时执行，默认刷新页面
         */
        loadScript: function (url, callback) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                }
            } else {
                script.onload = function () {
                    callback();
                }
            }
            if ($('[src="' + url + '"]').length == 0) {
                script.src = url;
                document.getElementsByTagName("head")[0].appendChild(script);
            } else {
                callback();
            }

        },
        uexhttpss: function (o) {
            window.uexAJAX = {
                callBack: {}, index: 1,
                https: function (o) {
                    var id = this.index++, data = o.data, type = o.type || 'get', url = o.url;
                    if ($.getStorage('app') == '1') {
                        var logData = ""
                        if (data) {
                            logData = uexAJAX.param(data);
                        }
                        console.log('uexXmlHttpMgr请求URL=&&&' + type + '=&&&=' + url + '?' + logData)
                        if (type == 'get') url = url + '?' + uexAJAX.param(data);
                        this.callBack[id] = [o.success, o.error];
                        uexXmlHttpMgr.open(id, type, url, (o.timeout || 0));
                        if (type == 'post' || type == 'POST') {
                            for (var k in data) {
                                uexXmlHttpMgr.setPostData(id, 0, k, data[k]);
                            }
                        }
                        this._send(id);
                    } else {
                        var logData = ""
                        if (data) {
                            logData = uexAJAX.param(data);
                        }
                        console.log('ajax请求URL=&&&' + type + '=&&&=' + url + '?' + logData)
                        $.ajax({
                            url: url,
                            type: type,
                            dataType: 'json',
                            data: data,
                            success: function (json) {
                                if (json.Code === 1 || json.Code === "1") {
                                    o.success && o.success(json);
                                } else if (json.Code === 0 || json.Code === "0") {
                                    setTimeout(function () {
                                        if (json.Msg == "请先登录") {
                                            $.loginReload();
                                            $.uexOpen('login')
                                            return;
                                        }
                                        o.success && o.success(json);
                                    }, 2000)
                                    $.toast(json.Msg || json.msg);
                                } else {
                                    o.success && o.success(json);
                                }
                            },
                            error: function (xhr) {
                                if (xhr.status == 0) {
                                    $.toast("服务器出车祸了");
                                } else if (xhr.status == 200) {
                                    setTimeout(function () {
                                        $.loginReload();
                                        $.uexOpen('login');
                                    }, 2000);
                                    $.toast(xhr.response);
                                }
                                o.error && o.error();
                            }
                        })
                    }

                },
                _send: function (id) {
                    uexXmlHttpMgr.onData = this.onData;
                    uexXmlHttpMgr.send(id);
                },
                onData: function (inOpCode, inStatus, inResult, requestCode) {
                    var that = uexAJAX, callBack = that.callBack[inOpCode] || [];
                    console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&inOpCode=' + inOpCode + 'inStatus=' + inStatus + 'inResult=' + inResult)
                    if (inStatus == -1) {
                        callBack[1] && callBack[1]();
                    } else if (inStatus == 1) {
                        var json = eval("(" + inResult + ")")
                        console.log(json)
                        if (json.Code === 1 || json.Code === "1") {
                            callBack[0] && callBack[0](json);
                        } else if (json.Code === 0 || json.Code === "0") {
                            setTimeout(function () {
                                if (json.Msg == "请先登录") {
                                    $.loginReload();
                                    isApp ? uexWindow.open('login', '0', 'login.html', 2, '', '', 0, 0, 0, 0) : window.location = html;
                                    return;
                                }
                                callBack[0] && callBack[0](json);
                            }, 2000)
                            $.toast(json.Msg || json.msg);
                        } else {
                            callBack[0] && callBack[0](json);
                        }

                    }
                    delete that.callBack[inOpCode];
                },
                param: function (param) {
                    var paramStr = "";
                    if (param != '') {
                        $.each(param, function (i, e) {
                            paramStr += '&' + i + '=' + (typeof e == "object" ? JSON.stringify(e) : e);
                        });
                        paramStr = paramStr.substr(1);
                    }
                    return paramStr;
                }
            };
        },
        /*
         * https 网络请求，与 Jquery 方法参数一样
         * @param object  o
         */
        https: function (o) {
            uexAJAX.https(o);
        },
        /*
         * @param object  callback
         */
        ready: function (callback) {
            setTimeout(function () {
                if (typeof uexWindow == "object") {
                    $.setStorage('app', '1');
                    isApp = true;
                    var notificationArray = {
                        1: 'my_pending_items',
                        2: 'in_email',
                        3: 'OrgList',
                        4: 'leave_list',
                        5: 'egression_list',
                        6: 'pendingDocList'
                    },a='';
                    uexJPush.onReceiveNotificationOpen = function (code, type, data) {
                        var typeValue = Number(JSON.parse(data).extras.type);
                            a = notificationArray[typeValue];
                        $.setStorage('notificationOpenUrl', a);
                        $.setStorage('notificationSwitch', 1);
                    }
                    $.monitorVal({
                        notificationSwitch: function () {
                            //var url = $.getStorage('notificationOpenUrl');
                            //if(a == 'my_pending_items') $.setStorage("isHas",1);
                            $.uexOpen('index');
                        }
                    });
                }
                //$setHeader()
                callback()
            }, 500)
        },
        getUserData: function (date) {
            var user = $.getStorage('userData');
            if (!user || user == "undefined") {
                $.loginReload();
                // $.uexOpen('login');
                // alert(1)
                return false;
            } else {
                user = JSON.parse(user);
                user.SessionId = $.getStorage('SessionId');
                return user;
            }
        },
        monitorVal: function (obj) {
            if (isApp) {
                $.each(obj, function (i, calback) {
                    var interval = setInterval(function () {
                        if ($.getStorage(i) == '1') {
                            $.setStorage(i, '0')
                            calback == '' ? window.location.reload() : calback();
                        }
                    }, 100);
                });
            }
        },
        loginReload: function () {
            var arrUrl = window.location.href.split("/");
            var strPage = arrUrl[arrUrl.length - 1].replace('.html', '');
            strPage = 'goLoginPage' + strPage;
            $.setStorage('goLoginPage', strPage);
            $.monitorVal(JSON.parse("{\"" + strPage + "\":\"\"}"));
        },
        toolBack: function () {
            uexWindow.setReportKey(0, 1);
            uexWindow.onKeyPressed = function () {
                $.uexOpen('index');
            };
        }
    });
})(Zepto);  

