//本地存储sessionstorage数据
function session() {
    sessionStorage.setItem(arguments[0], arguments[1])
    console.log(arguments[0] + "--" + arguments[1])
}

//本地存储localstorage数据
function local() {
    localStorage.setItem(arguments[0], arguments[1])
    //console.log(arguments[0]+"--"+arguments[1])
}
//本地获取localstorage数据
function getlocalVal(locName) {
    var val = localStorage.getItem(locName);
    //console.log(val);
    return val;
}

//变量替换
String.prototype.temp = function (obj) {
    return this.replace(/\$\w+\$/gi, function (matchs) {
        var returns = obj[matchs.replace(/\$/g, "")];
        return (returns + "") == "undefined" ? "" : returns;
    });
};

function SuiPicSelect(dom, title, arr, fn) {
    $(dom).picker({
        toolbarTemplate: '<header class="bar bar-nav">\
		  <button class="button button-link pull-right close-picker">确定</button>\
		  <h1 class="title">' + title + '</h1>\
		  </header>',
        cols: [
            {
                textAlign: 'center',
                values: arr
            }
        ],
        formatValue: function (picker, value, displayValue) {
            if (typeof(fn) == "function") {
                fn(value);
            }
            return value;
        }
    });
}
var SuiTimeSelectHours = function () {
        var arr = new Array();
        for (var i = 0; i <= 23; i++) {
            if (i < 10) {
                arr[i] = '0' + i;
            } else {
                arr[i] = i;
            }
        }
        return arr;
    },
    SuiTimeSelectMinute = function () {
        var arr = new Array();
        for (var i = 0; i <= 59; i++) {
            if (i < 10) {
                arr[i] = '0' + i;
            } else {
                arr[i] = i;
            }
        }
        return arr;
    },
    SuiTimeSelectSecond = function () {
        var arr = new Array();
        for (var i = 0; i <= 59; i++) {
            if (i < 10) {
                arr[i] = '0' + i;
            } else {
                arr[i] = i;
            }
        }
        return arr;
    };

function SuiTimeSelect(dom, title) {
    $(dom).picker({
        toolbarTemplate: '<header class="bar bar-nav">\
		  <button class="button button-link pull-right close-picker">确定</button>\
		  <h1 class="title">' + title + '</h1>\
		  </header>',
        cols: [
            {
                textAlign: 'center',
                values: SuiTimeSelectHours()
            },
            {
                textAlign: 'center',
                values: ':'
            },
            {
                textAlign: 'center',
                values: SuiTimeSelectMinute()
            },
            {
                textAlign: 'center',
                values: ':'
            },
            {
                textAlign: 'center',
                values: SuiTimeSelectSecond()
            }
        ]
    });
}


function MemoSeesionJsonInRo(dom) {
    local("MemoLocal_id", $(dom).attr('id'))
    local("MemoLocal_filepaths", $(dom).attr('filepaths'))
    local("MemoLocal_frequencytime", $(dom).attr('frequencytime'))
    local("MemoLocal_frequencyday", $(dom).attr('frequencyday'))
    local("MemoLocal_memostt", $(dom).attr('memostt'))
    local("MemoLocal_content", $(dom).attr('content'))
    local("MemoLocal_frequency", $(dom).attr('frequency'))
    local("MemoLocal_remind", $(dom).attr('remind'))
    local("MemoLocal_sentremindtime", $(dom).attr('sentremindtime'))
    local("MemoLocal_shareids", $(dom).attr('shareids'))
    local("MemoLocal_memos", $(dom).attr('memos'))
    local("MemoLocal_memoid", $(dom).attr('memoid'))
    local("MemoLocal_name", $(dom).attr('name'))
    local("MemoLocal_filenames", $(dom).attr('filenames'))
    local("MemoLocal_state", $(dom).attr('state'))
    local("FxUserId", $(dom).attr('shareids'))
    local("FxUserName", $(dom).attr('sharenames'))
}

$.ready(function () {
    $('.back').on('click', function () {
        $.uexBack();
    })
    $.uexhttpss();
    $.init()
})


function createTextRangeMoveEnd(obj) {//文本框光标跳最后
    obj.focus();
    var len = obj.value.length;
    if (document.selection) {
        var sel = obj.createTextRange();
        sel.moveStart('character', len);
        sel.collapse();
        sel.select();
    } else if (typeof obj.selectionStart == 'number'
        && typeof obj.selectionEnd == 'number') {
        obj.selectionStart = obj.selectionEnd = len;
    }
}

function isOnLineFun() {//检测浏览器是否离线
    var isOn = navigator.onLine;
    return isOn;
}

function clearIntervalTime() {
    typeof setInterTimeGlobal != null && typeof setInterTimeGlobal != 'undefined' ? clearInterval(setInterTimeGlobal) : 0;
}
