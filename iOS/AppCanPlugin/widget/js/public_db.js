//打开常用意见
function openOpinion() {
    $.popup('.popupOpinion');
    $.showIndicator();
    loadQueryOpinionName();
}

//获取当前页面附件的方法
function loadGetOAAttachPath() {
    dataGetOAOpinion = JSON.stringify(ParamJson_GetOAOpinion(db_docid));
    var filename = '';
    var filepath = '';
    var recordid = '';
    var savepath = '';
    var inTypeFile = ['png', 'jpg', 'gif', 'jpeg', 'bmp'];
    console.log(dataGetOAOpinion)
    $.https({
        type: "post",
        url: dbURL + "GetOAAttachPath&ClassName=DocToDo",
        data: {
            ParamJson: dataGetOAOpinion
        },
        success: function (data) {
            $.hideIndicator();
            console.info(data);
            // 附件多个 正文一个docFile
            var f = data.AttachList.AttachList,
                fc = data.AttachList.code,
                z = data.docFile.docFile,
                zc = data.docFile.code;
            if (Number(fc) == 1) {
                var n = '',
                    s = '',
                    e = '',
                    p = '';
                $.each(f, function (k, v) {
                    n = v.name + '.';
                    p = v.ptah;
                    e = p.substr(p.lastIndexOf('.') + 1);
                    n += e;
                    //console.log(p.substr(0,p.lastIndexOf('.')))
                    if ($.inArray(e, inTypeFile) == -1 && e != "txt") p = p.substr(0, p.lastIndexOf('.')) + '.pdf';
                    //console.log(p)
                    s += html_GetOAAttachPath(n, p);
                })
                $("#getOAAttachPath2").html(s);//附件显示
            } else {
                $("#getOAAttachPath2").html('<div class="apply_img_none ub ub-f1 ub-ac">无附件</div>');
            }

            if (Number(zc) == 1) {
                console.log(z)
                var n2 = z.filename,
                    p2 = z.path,
                    e2 = p2.substr(p2.lastIndexOf('.') + 1);
                if ($.inArray(e2, inTypeFile) == -1) p2 = p2.substr(0, p2.lastIndexOf('.')) + '.pdf';
                //console.log(p2)
                var s2 = html_GetOAAttachPath(n2, p2);
                $("#getOAAttachPath").html(s2);//正文显示
            } else {
                $("#getOAAttachPath").html('<div class="apply_img_none ub ub-f1 ub-ac">无正文</div>');
            }
            html_start();
        },
        error: function () {

        }
    });
}
//拼接当前页面附件html的方法
function html_GetOAAttachPath(filename, savepath) {
    var str = '';
    str += '<div class="apply_img ub ub-f1 ub-ac" savepath="' + savepath + '">' + decodeURIComponent(filename) + '</div>';
    return str;
}

var suffix = '';
var filename_ = '';
var myPhotoBrowserPopup = '';
//点击附件

$(document).on('click', '.apply_img', function () {

    //var picArr = [];
    //var filepath = $(this).attr("filepath");
    //var recordid = $(this).attr("recordid");

    var savepath = ipAddress + '/' + $(this).attr("savepath");
    var filename = $(this).html().split(".")[0];
    console.log(filename)

    filename_ = filename;
    suffix = $(this).attr("savepath").split(".")[1].toLowerCase();
    if (suffix) {
        $.showIndicator();
    }
    if (suffix == "txt") {
        $.uexOpen2(savepath.substr(0, savepath.lastIndexOf('.')))
        $.hideIndicator();
        return;
    } else if (suffix == "doc") {
        suffix = "word";
    } else if (suffix == "docx") {
        suffix = "wordx";
    } else if (suffix == "xls" || suffix == "xlsx") {
        suffix = "excel";
    } else if (suffix == "ppt" || suffix == "pptx") {
        suffix = "ppt";
    } else if (suffix == "pdf") {
        suffix = "pdf";
    } else if (suffix == "bmp" || suffix == "jpg" || suffix == "jpeg" || suffix == "png" || suffix == "gif") {
        $.hideIndicator();
        $.photoBrowser({
            photos: [savepath],
            type: 'popup'
        }).open();
        $('.bar.bar-nav .title .center.sliding').text('图片浏览');
        return;
    } else {
        $.hideIndicator();
        $.toast("不支持打开此类型附件！", 1000);
        return;
    }

    console.info("dsdsdsd" + savepath + "--" + filename + "--" + suffix);
    //下载并查看
    downLoadPath(savepath, filename, suffix);

})
//下载附件
function downLoadPath(savepath, filename, suffix) {
    //alert(savepath+'---'+filename_+'---01---'+suffix)
    uexOffice.onDownloadDocuments(savepath, filename, suffix);
    console.info("dsdsdsd" + savepath + "--" + filename + "--" + suffix);

    uexOffice.cbDocDownload = function (code, type, data) {
        $.hideIndicator();
        if (code == 200 || type == 200) {
            // alert(savepath+'---'+filename_+'---1.5---'+suffix)
            if (suffix == "word" || suffix == "wordx") {
                // alert(savepath+'---'+filename_+'---02---'+suffix)

                uexOpenFile.onOpenWord(filename_, suffix);
            } else if (suffix == "excel") {
                uexOpenFile.onOpenExcel(filename_);
            } else if (suffix == "ppt") {
                uexOpenFile.onOpenPPT(filename_);
            } else if (suffix == "pdf") {
                uexOpenFile.onOpenPDF(filename_);
            }
            console.info("dsdsdsd" + data + suffix + filename_);
        } else if (code == 403 || type == 403) {
            $.toast("服务器未返回内容", 1000);
            console.info("dsdsdsd" + data);
        }
    }
}

//点击选择常用意见
$(document).on('click', '.opinion_text', function (index, el) {
    var opinion_text = $(this).html();
    $("#opinion_text").val(opinion_text);
    $.closeModal(".popupOpinion");//opinion_del_icon

})


//点击删除常用意见
$(document).on('click', '.opinion_del_icon', function (index, el) {
    //$.closeModal(".popupOpinion");
    var id = $(this).attr("id");
    $.confirm('确定删除此条常用意见吗？',
        function () {
            //此处执行确定回调
            $.showIndicator();
            loadDeleteOpinion(id);
        },
        function () {
            //此处执行取消回调
        }
    );
    console.info(id);

})


function html_start() {
    var o = $('.organize_list').height(),
        n = $('.content').height(),
        t = $('#getOAAttachPath').parent().height(),
        t = t !== undefined && t !== "" && t !== null && t !== 0 ? t : 0,
        c = $('#getOAAttachPath2').parent().height(),
        c = c !== undefined && c !== "" && c !== null && c !== 0 ? c : 0,
        b = $('#button_sub').height(),
        b = b !== undefined && b !== "" && b !== null && b !== 0 ? b - 6 : 0,
        h = $('.apply_load_bottom .apply_content:last-child').height() / 2,
        g = $("#getOAOpinion").height(),
        d = $('#xian');
    d.height((n - o - t - c) > g ? (n - o - t - c) : g)
    console.log(n + '--' + t + '--' + c + '--' + o + '--' + h + '--' + b)
}

//获取公文流转日志参数json信息
function ParamJson_GetOAOpinion(docid) {
    var jsonData = new Object();
    getLocal = localStorage.getItem('SessionId');
    jsonData.docid = docid == null ? "" : docid;
    jsonData.SessionId = typeof(getLocal) == "Object" ? "" : getLocal;
    return jsonData;
}
//获取当前页面公文流转日志的方法
function loadGetOAOpinion() {
    dataGetOAOpinion = JSON.stringify(ParamJson_GetOAOpinion(db_docid));
    var username = '';
    var deptname = '';
    var content = '';
    var ctime = '';
    var str = '';
    $.https({
        type: "post",
        url: dbURL + "GetOAOpinion&ClassName=DocToDo",
        data: {
            ParamJson: dataGetOAOpinion
        },
        success: function (data) {
            $.hideIndicator();
            if (data.Code == 1) {
                $.each(data.Row, function (index, el) {
                    username = el.username;
                    deptname = el.deptname;
                    content = el.content;
                    ctime = el.ctime;
                    child = el.cccontent;
                    str += html_GetOAOpinion(username, deptname, content, ctime, child, child.length > 0 ? 'icon-menu' : '');
                });
                $("#getOAOpinion").html(str);
                html_start();
            }
            console.info(data);
            html_start();
        },
        error: function () {

        }
    });
}


$(document).on("click", ".my-btn", function () {//点击打开panel
    var _that = $(this),
        _data = _that.attr('data'),
        _hass = _data == "" ? "" : JSON.parse(_data);
    if (_hass == '' || _hass.length < 0) return $.toast('无内容');

    $("#panel-left-demo").attr('data', _data);
    $.openPanel("#panel-left-demo");
    console.log(_hass)
});

var _ht_html_template = '';
function _eachJson(data) {
    console.log(data)
    var temp = "";
    $.each(data, function (k, v) {
        var c = v.content + '(抄送给：' + v.ccusername + ')',
            n = v.username,
            d = v.deptname,
            t = v.ctime,
            e = v.cccontent.length;
        _ht_html_template += html_GetOAOpinion(n, d, c, t);
        if (e > 0) {
            _eachJson(v.cccontent)
        } else {
            console.log(_ht_html_template)
            return temp = _ht_html_template;
        }
    })
    return temp;
}

function openPanelLeftPoP(d) {//打开panel时加载的fun
    var _that = $(this),
        _hass = d == "" ? "" : JSON.parse(d),
        _cont = $('#panelPop'),
        _html = '';
    /// _hCon = _hass.cccontent;
    $.each(_hass, function (i, v) {
        var c = v.content + '(抄送给：' + v.ccusername + ')',
            c = v.sendtype == 2 ? c : v.sendtype == 1 ? v.content : '',
            n = v.username,
            d = v.deptname,
            t = v.ctime;
        _html += html_GetOAOpinion(n, d, c, t, 1);
        /*  if(v.child.length >0){
         $.each(v.child,function(k,d){
         var s = d.cccontent;
         if(s.length >0) _html +=_eachJson(s);
         })
         }*/
    })
    _cont.html(_html);
}

function closedPanelLeftPoP() {//关闭panel时加载的fun
    $('#panelPop').html('');
}

$('#panel-left-demo').on("open closed close", function (e) {//绑定打开关闭事件
    var data = $(this).attr('data');
    if (e.type == 'open')   return openPanelLeftPoP(data);
    if (e.type == 'closed' || e.type == 'close') return closedPanelLeftPoP();
});


//拼接当前页面公文流转日志html的方法
function html_GetOAOpinion(username, deptname, content, ctime, Attr, className) {
    var str = '',
        art = typeof(Attr) != 'undefined' && Attr == 1 ? '' : JSON.stringify(Attr),
        hrt = Attr != 1 ? 'my-btn' : '';
    console.log(hrt)
    str += '<div class="apply_content ' + hrt + ' ub" style="position:relative;" data=\'' + art + '\'>'
        + '<div class="ub ub-f1 ub-ver">'
        + '<div class="apply_top">' + content + '</div>'
        + '<div class="apply_time">' + username + '(' + deptname + ')</div>'
        + '<div class="apply_time">' + ctime + '</div>'
        + '</div>'
        + '<em class="ub ub-ac ub-pc icon ' + (className ? 'icon-menu' : '') + '" style="color:#23ceac;font-size:1rem;"></em>'
        + '<i></i><span class="apply_guo"></span></div>';
    return str;
}


//获取按钮需求的参数json信息
function ParamJson_button(docid, todoid, billtype) {
    var jsonData = new Object();
    getLocal = localStorage.getItem('SessionId');
    jsonData.billtype = billtype == null ? "" : billtype;
    jsonData.docid = docid == null ? "" : docid;
    jsonData.todoid = todoid == null ? "" : todoid;
    jsonData.SessionId = typeof(getLocal) == "Object" ? "" : getLocal;
    return jsonData;
}
//获取当前页面按钮的方法
function loadButon(NumberStr) {
    console.info("!");
    dataButton = JSON.stringify(ParamJson_button(db_docid, db_id, NumberStr));
    var doctplid_ = ''
    var covernodeid_ = '';
    var nodeid_ = '';
    var newname_ = '';
    var str = '';
    $.https({
        type: "post",
        url: dbURL + "GetMyToDoButton&ClassName=DocToDo",
        data: {
            ParamJson: dataButton
        },
        success: function (data) {
            console.info(data);
            if (data == '') {
                $("#opinion_txbu").hide();
                $('.bar-tab ~ .content').css('bottom', 0).find('div.apply_load_bottom').css('margin-bottom', 0)
                $('.bar-tab2 ~ .content').css('bottom', 0).find('div.apply_load_bottom').css('margin-bottom', 0)
                return;
            }
            //var data = JSON.parse(data);
            if (data.Code == 1) {
                $.each(data.UserBtn, function (index, el) {
                    doctplid_ = el.doctplid;
                    covernodeid_ = el.covernodeid;
                    nodeid_ = el.nodeid;
                    newname_ = el.newname;
                    str += html_button(doctplid_, covernodeid_, nodeid_, newname_);
                });
                $.each(data.AuthBtn, function (index, el) {
                    newname_ = el.name;
                    str += html_button(doctplid_, covernodeid_, nodeid_, newname_);
                });
                if (data.UserBtn.length == 0 && data.AuthBtn.length == 0) {
                    $("#opinion_txbu").hide();
                    $('.bar-tab ~ .content').css('bottom', 0).find('div.apply_load_bottom').css('margin-bottom', 0)
                    $('.bar-tab2 ~ .content').css('bottom', 0).find('div.apply_load_bottom').css('margin-bottom', 0)
                } else {
                    $("#opinion_txbu").show();
                }
            }
            if (data.Code == 2) {
                $.each(data.ccBtn, function (index, el) {
                    newname_ = el.ccn;
                    str += html_button(doctplid_, covernodeid_, nodeid_, newname_);
                });
                if (data.ccBtn.length == 0) {
                    $("#opinion_txbu").hide();
                    $('.bar-tab ~ .content').css('bottom', 0).find('div.apply_load_bottom').css('margin-bottom', 0)
                    $('.bar-tab2 ~ .content').css('bottom', 0).find('div.apply_load_bottom').css('margin-bottom', 0)
                } else {
                    $("#opinion_txbu").show();
                }
            }
            //$("#opinion_txbu").show();
            $("#button_sub").html(str);
            html_start();
            console.info(data);
        },
        error: function () {
            console.info("error");
        }
    });
}
//拼接当前页面按钮html的方法
function html_button(doctplid, covernodeid, nodeid, newname) {
    var str = '';
    str += '<a class="toact_active" doctplid="' + doctplid + '" covernodeid="' + covernodeid + '" nodeid="' + nodeid + '" >' + newname + '</a>';
    return str;
}
//获取接收者信息参数json信息
function ParamJson_SendToInfo(docid, doctplid, covernodeid, nodeid) {
    var jsonData = new Object();
    getLocal = localStorage.getItem('SessionId');
    jsonData.docid = docid == null ? "" : docid;
    jsonData.doctplid = doctplid == null ? "" : doctplid;
    jsonData.covernodeid = covernodeid == null ? "" : covernodeid;
    jsonData.nodeid = nodeid == null ? "" : nodeid;
    jsonData.SessionId = typeof(getLocal) == "Object" ? "" : getLocal;
    return jsonData;
}
//获取接收者信息参数json信息
function ParamJson_SendToInfo(docid, doctplid, covernodeid, nodeid) {
    var jsonData = new Object();
    getLocal = localStorage.getItem('SessionId');
    jsonData.docid = docid == null ? "" : docid;
    jsonData.doctplid = doctplid == null ? "" : doctplid;
    jsonData.covernodeid = covernodeid == null ? "" : covernodeid;
    jsonData.nodeid = nodeid == null ? "" : nodeid;
    jsonData.SessionId = typeof(getLocal) == "Object" ? "" : getLocal;
    return jsonData;
}
//获取接收者信息
function LoadSendToInfo(doctplid, covernodeid, nodeid, opinion_text) {
    dataSendToInfo = JSON.stringify(ParamJson_SendToInfo(db_docid, doctplid, covernodeid, nodeid));
    var nodename = '', receiveuserset = '', selectrange = '', selectsectype = '', selecttype = '', selectname = '', selectvalue = '';
    $.https({
        type: "post",
        url: dbURL + "LoadSendToInfo&ClassName=DocToDo",
        data: {
            ParamJson: dataSendToInfo
        },
        success: function (data) {
            //var data = JSON.parse(data);
            if (data.Msg == "办结操作" && data.Code == "SendOA") {
                console.info("办结");
                loadSendOA(doctplid, covernodeid, null, null, opinion_text);
                return;
            }
            nodename = data.Row.nodename;
            receiveuserset = data.Row.receiveuserset;
            selectrange = data.Row.selectrange;
            selectsectype = data.Row.selectsectype;
            selecttype = data.Row.selecttype;
            selectname = data.Row.selectname;
            selectvalue = data.Row.selectvalue;
            if (selectvalue == undefined) {
                selectvalue = null;
            }

            if (data.Code == "SendOA") {
                //调用sendOA
                loadSendOA(doctplid, covernodeid, selectvalue, selectrange, opinion_text);
            }
            if (data.Code == "1") {
                //调用待办通知选人接口
                LoadPerSelectTInfo(doctplid, covernodeid, nodeid, receiveuserset, selectrange, selectvalue, opinion_text, selectname, selecttype);
            }
            console.info(data);
        },
        error: function () {

        }
    });
}
//待办通知选人参数json信息
function ParamJson_PerSelectTInfo(doctplid, covernodeid, nodeid, docid, processinstid, id, cuuentNodeId, receiveuserset, selectrange, selectvalue, contentEditor, selecttype) {
    var jsonData = new Object();
    getLocal = localStorage.getItem('SessionId');
    //按钮接口返回
    jsonData.doctplid = doctplid == null ? "" : doctplid;
    jsonData.covernodeid = covernodeid == null ? "" : covernodeid;
    jsonData.nodeid = nodeid == null ? "" : nodeid;
    //列表接口返回
    jsonData.id = docid == null ? "" : docid;
    jsonData.docid = docid == null ? "" : docid;
    jsonData.todtoId = id == null ? "" : id;
    jsonData.todoid = id == null ? "" : id;
    jsonData.processinstid = processinstid == null ? "" : processinstid;
    jsonData.cuuentNodeId = cuuentNodeId == null ? "" : cuuentNodeId;
    // 接收者信息接口返回
    jsonData.selectvalue = selectvalue == null ? "" : selectvalue;
    jsonData.receiveuserset = receiveuserset == null ? "" : receiveuserset;
    jsonData.sendId = selectvalue == null ? "" : selectvalue;
    jsonData.sendType = selectrange == null ? "" : selectrange;
    jsonData.selectrange = selectrange == null ? "" : selectrange;
    jsonData.selecttype = selecttype == null ? "" : selecttype;
    //审批意见
    jsonData.contentEditor = contentEditor == null ? "" : contentEditor;

    jsonData.SessionId = typeof(getLocal) == "Object" ? "" : getLocal;
    return jsonData;
}

//获取待办通知选人的方法
function LoadPerSelectTInfo(doctplid, covernodeid, nodeid, receiveuserset, selectrange, selectvalue, contentEditor, selectname, selecttype) {
    dataPerSelectTInfo = JSON.stringify(ParamJson_PerSelectTInfo(doctplid, covernodeid, nodeid, db_docid, db_processinstid, db_id, db_currnodeid, receiveuserset, selectrange, selectvalue, contentEditor, selecttype));
    var peopleListData = '';
    var userid = '';
    var username = '';
    var str = '';
    var selectName = '';
    $.https({
        type: "post",
        url: dbURL + "PerSelectTInfo&ClassName=DocToDo",
        data: {
            ParamJson: dataPerSelectTInfo
        },
        success: function (data) {
            //console.info(data);
            //var data = JSON.parse(data);
            if (data.Code == 1) {
                $.modal({
                    title: '提示',
                    text: data.Row.msg,
                    buttons: [
                        {
                            text: '确定',
                            onClick: function () {
                                $.uexBack();
                                localStorage.setItem("db_list", "1");
                            }
                        }
                    ]
                })
            }
            if (data.Code == "SelectPer" || data.Code == "SelectAllPer") {
                selectName = "选择人员"
            } else if (data.Code == "SelectDep" || data.Code == "SelectAllDep") {
                selectName = "选择机构"
            } else if (data.Code == "SelectPost" || data.Code == "SelectAllPost") {
                selectName = "选择岗位"
            } else if (data.Code == "SelectRole" || data.Code == "SelectAllRole") {
                selectName = "选择角色"
            }
            $(".popup2").find("h1").html(selectName);
            if (data.Code == "SelectAllPer" || data.Code == "SelectAllDep" || data.Code == "SelectAllPost" || data.Code == "SelectAllRole") {
                localStorage.setItem("peopleListType", data.Code);
                doctplid_0 = doctplid, covernodeid_0 = covernodeid, selectrange_0 = selectrange, contentEditor_0 = contentEditor;

                if (data.Code == "SelectAllPer") {
					$.hideIndicator();
                    ProcessingService();//解密通讯录 $.hideIndicator();
                    selectrange_0 = 1;
                } else if (data.Code == "SelectAllDep") {
                    loadQueryDeptTreeForQUI();
                } else if (data.Code == "SelectAllPost") {
                    loadQueryDeptTreeForQUI();
                } else if (data.Code == "SelectAllRole") {
                    loadQueryDeptTreeForQUI();
                }
            }
            if (data.Code == "SelectPer" || data.Code == "SelectDep" || data.Code == "SelectPost" || data.Code == "SelectRole") {
                localStorage.setItem("peopleListType", data.Code);
                doctplid_0 = doctplid, covernodeid_0 = covernodeid, selectrange_0 = selectrange, contentEditor_0 = contentEditor;
                $.hideIndicator();
				var depName = selectname.split(",");
                var depId = selectvalue.split(",");
                for (var i = 0; i < depName.length; i++) {
                    username = depName[i];
                    userid = depId[i];
                    str += html_popup2(username, userid, 1);
                }
                $("#radio_list1").html(str);
                $.popup('.popup2');
            }

            console.info(data);
        },
        error: function () {

        }
    });
}

//点击选人发送按钮
$(document).on('click', '.oaSend', function (index, el) {
    var username = '', userid = '';
    $(".popup2").find('input[name="people"]:checked').each(function (i, e) {
        username += ',' + $(e).attr('username');
        userid += ',' + $(e).attr('userid');
    });
    username = username.replace(",", "");
    userid = userid.replace(",", "");
    console.info(username + "---" + userid);

    if (userid == '') {
        $.alert("你还没有选择");
        return;
    }
    $.closeModal(".popup2");
    $("#radio_list1").html("");
    $.showIndicator();
    var peopleListType = localStorage.getItem("peopleListType");
    //判断是抄送还是其他流转选人
    if (peopleListType == "抄送") {
        loadSaveCCOpinion(db_currnodeid, opinion_text_0, userid, username);
    } else if (peopleListType == "分配") {
        loadSaveOrUpdateTodo(userid, username);
    } else {
        loadSendOA(doctplid_0, covernodeid_0, userid, selectrange_0, contentEditor_0);
    }
    //$.closeModal(".popupOpinion");opinion_del_icon
})

//拼接选人的方法
function html_popup2(username, userid, num) {
    var radioStyle = '';
    var str = '';
    //抄送时为多选，其他流转为单选
    if (num == 1) {
        radioStyle = "radio";
    } else {
        radioStyle = "checkbox";
    }
    str += '<label class="label-checkbox item-content ub label_"><div style="margin-left: 1rem;">' + username + '</div><div class="ub-f1"></div>'
        + '<input type="' + radioStyle + '" name="people" username="' + username + '" userid="' + userid + '">'
        + '<div class="item-media" style="margin-right: 1.8rem;"><i class="icon icon-form-checkbox radio_hw"></i></div></label><div class="border_"></div>';
    return str;
}

//公文流转参数json信息
function ParamJson_SendOA(doctplid, covernodeid, docid, processinstid, id, cuuentNodeId, selectrange, selectvalue, contentEditor) {
    var jsonData = new Object();
    getLocal = localStorage.getItem('SessionId');
    //按钮接口返回
    jsonData.doctplid = doctplid == null ? "" : doctplid;
    jsonData.covernodeid = covernodeid == null ? "" : covernodeid;
    //列表接口返回
    jsonData.id = docid == null ? "" : docid;
    jsonData.docid = docid == null ? "" : docid;
    jsonData.todtoId = id == null ? "" : id;
    jsonData.todoid = id == null ? "" : id;
    jsonData.processinstid = processinstid == null ? "" : processinstid;
    jsonData.cuuentNodeId = cuuentNodeId == null ? "" : cuuentNodeId;
    // 接收者信息接口返回
    jsonData.sendId = selectvalue == null ? "" : selectvalue;
    jsonData.sendType = selectrange == null ? "" : selectrange;
    //审批意见
    jsonData.contentEditor = contentEditor == null ? "" : contentEditor;

    jsonData.SessionId = typeof(getLocal) == "Object" ? "" : getLocal;
    var isLeave = localStorage.getItem("isLeave");
    if (isLeave == 1) {
        localStorage.setItem("isLeave", "2");
        jsonData.filepaths = localStorage.getItem("filepaths");
        jsonData.filenames = localStorage.getItem("filenames");
        jsonData.filetypes = localStorage.getItem("filetypes");
        jsonData.qjkssj = localStorage.getItem("qjkssj");
        jsonData.qjjssj = localStorage.getItem("qjjssj");
        jsonData.title = localStorage.getItem("qjyy");
        jsonData.qjlx = localStorage.getItem("qjlx");
        jsonData.leaveDay = localStorage.getItem("leaveDay");
        localStorage.setItem("filepaths", "");
        localStorage.setItem("filenames", "");
        localStorage.setItem("filetypes", "");
    }
    return jsonData;
}
//公文流转的方法
function loadSendOA(doctplid, covernodeid, selectvalue, selectrange, contentEditor, back) {
    console.info(contentEditor);
    dataSendOA = JSON.stringify(ParamJson_SendOA(doctplid, covernodeid, db_docid, db_processinstid, db_id, db_currnodeid, selectrange, selectvalue, contentEditor));
    $.https({
        type: "post",
        url: dbURL + "SendOA&ClassName=DocToDo",
        data: {
            ParamJson: dataSendOA
        },
        success: function (data) {
            //console.info(data);
            //var data = JSON.parse(data);
            $.hideIndicator();
            if (data.Code == 1) {

                $.modal({
                    title: '提示',
                    text: data.Row.msg,
                    buttons: [
                        {
                            text: '确定',
                            onClick: function () {
                                !back ? $.uexBack() : $.uexOpen('application')
                                localStorage.setItem("org_list", "1");
                            }
                        }
                    ]
                })
            } else if (data.success == false) {
                $.modal({
                    title: '提示',
                    text: data.msg,
                    buttons: [
                        {
                            text: '确定',
                            onClick: function () {
                                !back ? $.uexBack() : $.uexOpen('application')
                                localStorage.setItem("org_list", "1");
                            }
                        }
                    ]
                })
            }
            console.info(data);
        },
        error: function () {

        }
    });
}

//抄送参数json信息
function ParamJson_SaveCCOpinion(nodeid, docid, id, contentEditor, cid, cname) {
    var jsonData = new Object();
    getLocal = localStorage.getItem('SessionId');
    //按钮接口返回
    jsonData.currnodeid = nodeid == null ? "" : nodeid;
    //列表接口返回
    jsonData.docid = docid == null ? "" : docid;
    jsonData.todoid = id == null ? "" : id;
    // 选人
    jsonData.cid = cid == null ? "" : cid;
    jsonData.cname = cname == null ? "" : cname;
    //审批意见
    jsonData.opinion = contentEditor == null ? "" : contentEditor;

    jsonData.SessionId = typeof(getLocal) == "Object" ? "" : getLocal;
    return jsonData;
}
//抄送的方法
function loadSaveCCOpinion(nodeid, contentEditor, cid, cname, back) {
    console.info(contentEditor);
    dataSaveCCOpinion = JSON.stringify(ParamJson_SaveCCOpinion(nodeid, db_docid, db_id, contentEditor, cid, cname));
    $.https({
        type: "post",
        url: dbURL + "SaveCCOpinion&ClassName=DocToDo",
        data: {
            ParamJson: dataSaveCCOpinion
        },
        success: function (data) {
            //var data = JSON.parse(data);
            console.info("dfdfdfdf:" + JSON.stringify(data));
            if (data.success == true) {

                $.modal({
                    title: '提示',
                    text: data.msg,
                    buttons: [
                        {
                            text: '确定',
                            onClick: function () {
                                window.location.reload();
                                localStorage.setItem("org_list", "1");
                            }
                        }
                    ]
                })

            } else if (data.success == false) {
                $.modal({
                    title: '提示',
                    text: data.msg,
                    buttons: [
                        {
                            text: '确定',
                            onClick: function () {
                                loadSaveCC(nodeid, contentEditor, cid, cname);
                            }
                        }, {
                            text: '取消',
                            onClick: function () {

                            }
                        }
                    ]
                })
            }


            console.info(data);
        },
        error: function () {

        }
    });
}

//确认再次抄送的方法
function loadSaveCC(nodeid, contentEditor, cid, cname) {
    console.info(contentEditor);
    dataSaveCCOpinion = JSON.stringify(ParamJson_SaveCCOpinion(nodeid, db_docid, db_id, contentEditor, cid, cname));
    $.https({
        type: "post",
        url: dbURL + "SaveCC&ClassName=DocToDo",
        data: {
            ParamJson: dataSaveCCOpinion
        },
        success: function (data) {
            //var data = JSON.parse(data);
            $.modal({
                title: '提示',
                text: data.msg,
                buttons: [
                    {
                        text: '确定',
                        onClick: function () {
                            $.uexBack();
                            localStorage.setItem("org_list", "1");
                        }
                    }
                ]
            })
            console.info(data);
        },
        error: function () {

        }
    });
}

//查询常用意见的方法
function loadQueryOpinionName() {
    var getLocal = localStorage.getItem('SessionId');
    var SessionId = typeof(getLocal) == "Object" ? "" : getLocal;
    var data = '{"SessionId":"' + SessionId + '"}';
    var content = '', id = '', str = '';
    $.https({
        type: "post",
        url: dbURL + "QueryOpinionName&ClassName=DocToDo",
        data: {
            ParamJson: data
        },
        success: function (data) {
            if (data.length <= 0) {
                return;
            }
            //var data = JSON.parse(data);

            if (data.Code == 1) {
                $.each(data.Result.Rows, function (index, el) {
                    content = el.content;
                    id = el.id;
                    str += html_QueryOpinionName(content, id);
                });
                $("#radio_list").html(str);
                $.hideIndicator();
            }
            console.info(data);
        },
        error: function () {

        }
    });
}

//拼接常用意见选项
function html_QueryOpinionName(content, id) {
    //console.info(content+'---'+id);
    var str = '';
    str += '<div id="opinionId' + id + '"><div class="ub" style="height: auto;"><div class="opinion_text">' + content + '</div>'
        + '<div class="ub ub-ver opinion_del_icon" id="' + id + '"><div class="ub-f1"></div><div class="opinion_del"></div>'
        + '<div class="ub-f1"></div></div></div><div class="border_"></div></div>';
    return str;
}

//删除常用意见的方法
function loadDeleteOpinion(ids) {
    var getLocal = localStorage.getItem('SessionId');
    var SessionId = typeof(getLocal) == "Object" ? "" : getLocal;
    var data = '{"SessionId":"' + SessionId + '","ids":"' + ids + '"}';
    console.info(data);
    $.https({
        type: "post",
        url: dbURL + "DeleteOpinion&ClassName=DocToDo",
        data: {
            ParamJson: data
        },
        success: function (data) {
            if (data.length <= 0) {
                return;
            }
            //var data = JSON.parse(data);
            if (data.Code == 1) {
                $.hideIndicator();
                $("#opinionId" + ids).hide();
                $.toast("删除成功", 1000);
            }
            console.info(data);
        },
        error: function () {

        }
    });
}

//新增常用意见的方法
function loadSavaOrUpdateOpinion() {
    var opinion_text = $("#opinion_text").val().replace(/\s/g, "");
    if (opinion_text == "") {
        $.alert("请输入您的意见！");
        return;
    }
    opinion_text = $("#opinion_text").val();
    //$.closeModal(".popupOpinion");
    var getLocal = localStorage.getItem('SessionId');
    var SessionId = typeof(getLocal) == "Object" ? "" : getLocal;
    var data = '{"SessionId":"' + SessionId + '","content":"' + opinion_text + '","id":"","orderid":"0"}';
    console.info(data);
    $.https({
        type: "post",
        url: dbURL + "SavaOrUpdateOpinion&ClassName=DocToDo",
        data: {
            ParamJson: data
        },
        success: function (data) {
            if (data.length <= 0) {
                return;
            }
            //var data = JSON.parse(data);
            if (data.Code == 1) {
                loadQueryOpinionName();
                $.toast("新增成功", 1000);
            }
            console.info(data);
        },
        error: function () {

        }
    });
}

//任意选择机构的方法
function loadQueryDeptTreeForQUI() {
    var getLocal = localStorage.getItem('SessionId');
    var SessionId = typeof(getLocal) == "Object" ? "" : getLocal;
    var data = '{"SessionId":"' + SessionId + '"}';
    var username = '';
    var userid = '';
    var chindren = '';
    var str = '';
    console.info(data);
    $.https({
        type: "post",
        url: dbURL + "QueryDeptTreeForQUI&ClassName=DocToDo",
        data: {
            ParamJson: data
        },
        success: function (data) {
            $.hideIndicator();
            //var data = JSON.parse(data);
            var peopleListType = localStorage.getItem("peopleListType");
            var jsonData = eval(JSON.stringify(data.treeNodes));
            var jsonDataTree = transData(jsonData, 'id', 'parentId', 'chindren');
            if ($("#radio_list1").html() != '') {
                $.popup('.popup2');
            } else {
                html_rec(JSON.stringify(jsonDataTree));
                $.popup('.popup2');
            }
        },
        error: function () {

        }
    });
}

//递归拼接机构树形
function html_rec(arr) {
    var username = '';
    var userid = '';
    var chindren = '';
    var chindrenArr = '';
    var parentid = '';
    var str = '';
    $.each(JSON.parse(arr), function (index, el) {
        username = el.name;
        userid = el.id;
        chindren = el.chindren;
        chindrenArr = el.chindren;
        parentid = el.parentId;
        if (chindren == undefined) {
            chindren = 0;
        } else {
            chindren = 1;
        }
        str += html_Tree_popup2(username, userid, chindren, parentid);
        if (chindren == 1) {
            html_rec(JSON.stringify(chindrenArr));
        }
    });
}


//任意选择岗位的方法
function loadGetPostByDeptIdQUI(deptid) {
    $.showIndicator();
    var getLocal = localStorage.getItem('SessionId');
    var SessionId = typeof(getLocal) == "Object" ? "" : getLocal;
    var data = '{"SessionId":"' + SessionId + '","deptid":"' + deptid + '"}';
    var username = '';
    var userid = '';
    var str = '';
    console.info(data);
    $.https({
        type: "post",
        url: dbURL + "GetPostByDeptIdQUI&ClassName=DocToDo",
        data: {
            ParamJson: data
        },
        success: function (data) {
            console.info(data);
            $.hideIndicator();
            //var data = JSON.parse(data);
            $.each(data, function (index, el) {
                username = el.key;
                userid = el.value;
                str += html_child_popup2(username, userid, 1);
            });
            $("#radio_list2").html(str);
            $("#radio_list1").css("height", "45%");
            $("#radio_list2").show();
            console.info(data);
        },
        error: function () {

        }
    });
}

//任意选择角色的方法
function loadgetRoleByDeptIdQUI(deptid) {
    $.showIndicator();
    var getLocal = localStorage.getItem('SessionId');
    var SessionId = typeof(getLocal) == "Object" ? "" : getLocal;
    var data = '{"SessionId":"' + SessionId + '","deptid":"' + deptid + '"}';
    var username = '';
    var userid = '';
    var str = '';
    console.info(data);
    $.https({
        type: "post",
        url: dbURL + "getRoleByDeptIdQUI&ClassName=DocToDo",
        data: {
            ParamJson: data
        },
        success: function (data) {
            console.info(data);
            $.hideIndicator();
            //var data = JSON.parse(data);
            $.each(data, function (index, el) {
                username = el.key;
                userid = el.value;
                str += html_child_popup2(username, userid, 1);
            });
            $("#radio_list2").html(str);
            $("#radio_list1").css("height", "45%");
            $("#radio_list2").show();
            console.info(data);
        },
        error: function () {

        }
    });
}

//拼接岗位/角色的方法
function html_child_popup2(username, userid, num) {
    var radioStyle = '';
    var str = '';
    //抄送时为多选，其他流转为单选
    if (num == 1) {
        radioStyle = "radio";
    } else {
        radioStyle = "checkbox";
    }
    str += '<label class="label-checkbox item-content ub label_">'
        + '<div style="margin-left: 2rem;">' + username + '</div><div class="ub-f1"></div>'
        + '<input type="' + radioStyle + '" name="people" username="' + username + '" userid="' + userid + '">'
        + '<div class="item-media" style="margin-right: 1.8rem;"><i class="icon icon-form-checkbox radio_hw"></i></div>'
        + '</label><div style="margin-left: 2rem;" class="border_"></div>';
    return str;
}

//拼接岗位/角色的父级机构的方法
function html_parent_popup2(username, userid) {
    var str = '';
    str += '<div onclick="toggleChild(\'' + userid + '\')" style="margin-left: 1rem;" class="ub"><div>' + username + '</div><div class="ub-f1"></div>'
        + '<span class="icon icon-down" style="margin-right: 1.8rem;"></span></div><div class="border_"></div><div id="child_toggle' + userid + '" style="display: none;"></div>';
    return str;
}

//拼接机构树形的方法
function html_Tree_popup2(username, userid, chindren, parentid) {
    var margin = '';
    var lable_ = '';
    var onclick_ = '';
    var peopleListType = localStorage.getItem("peopleListType");
    if (userid.length == 1) {
        margin = '0';
    }
    if (userid.length == 3) {
        margin = '1rem';
    }
    if (userid.length == 6) {
        margin = '1.8rem';
    }
    if (userid.length == 9) {
        margin = '2.6rem';
    }
    if (userid.length == 12) {
        margin = '3.4rem';
    }
    if (userid.length == 15) {
        margin = '4.2rem';
    }
    if (chindren == 1) {
        chindren = '<span class="icon icon-down" style=""></span>';
    } else {
        chindren = '';
    }
    if (peopleListType == "SelectAllPost" || peopleListType == "SelectAllRole") {
        lable_ = 'peopleRP';
        onclick_ = 'onclick="peopleRPchange()"';
    } else if (peopleListType == "SelectAllDep") {
        lable_ = "people";
        onclick_ = '';
    }
    var str = '';
    str += '<div class="ub border_"><div style="width:' + margin + '"></div>'
        + '<label class="label-checkbox item-content label_" ' + onclick_ + '>'
        + '<input type="radio" name="' + lable_ + '" username="' + username + '" userid="' + userid + '">'
        + '<div class="item-media"><i class="icon icon-form-checkbox radio_hw"></i></div></label>'
        + '<div class="ub-f1 ub" onclick="toggleChild(\'' + userid + '\')" style="margin-left: 1rem;">'
        + '<div>' + username + '</div><div class="ub-f1"></div>'
        + chindren + '</div></div>'
        + '<div id="child_toggle' + userid + '" style="display: none;"></div>';

    if (parentid == 0) {
        $("#radio_list1").append(str);
    } else {
        $("#child_toggle" + parentid).append(str);
    }
    return str;
}

function peopleRPchange() {
    $("#radio_list1").find('input[name="peopleRP"]:checked').each(function (index, el) {
        var id = $(el).attr("userid");
        var peopleListType = localStorage.getItem("peopleListType");
        if (peopleListType == "SelectAllPost") {
            loadGetPostByDeptIdQUI(id);
        } else if (peopleListType == "SelectAllRole") {
            loadgetRoleByDeptIdQUI(id);
        }
    });
}


//切换子级显示
function toggleChild(id) {
    var peopleListType = localStorage.getItem("peopleListType");
    var str = $("#child_toggle" + id).html();
//		  	if(str == ''){
//		  		if(peopleListType == "SelectAllPost"){
//		  			loadGetPostByDeptIdQUI(id);
//			  	}else if(peopleListType == "SelectAllRole"){
//			  		loadgetRoleByDeptIdQUI(id);
//			  	}
//		  	}else{
    $("#child_toggle" + id).toggle();
//		  	}
}
//转换普通对象为树形对象
function transData(a, idStr, pidStr, chindrenStr) {
    var r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0, len = a.length;
    for (; i < len; i++) {
        hash[a[i][id]] = a[i];
    }
    for (; j < len; j++) {
        var aVal = a[j], hashVP = hash[aVal[pid]];
        if (hashVP) {
            !hashVP[children] && (hashVP[children] = []);
            hashVP[children].push(aVal);
        } else {
            r.push(aVal);
        }
    }
    return r;
}
		
  
  
