/*
 * @Author: anchen
 * @Date:   2016-12-21 14:22:32
 * @Last Modified by:   anchen
 * @Last Modified time: 2017-11-18 10:54:14
 */
/**
 * 配置文件存放通用URL
 */
$.config = {
    router:false,    //默认Router功能  默认true
    showPageLoadingIndicator:true,   //在加载新页面过程中显示一个加载指示器。 默认true
    swipePanel:"right",               //是否可以通过左右滑动打开侧栏，一次只能指定一个方向。
    swipePanelOnlyClose:false         //只允许滑动关闭侧栏，不允许滑动打开。
}  
var isApp = localStorage.getItem("app") != "1" ? false : true;  
var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端   
$setHeader() 
function $setHeader(){
    if(isiOS && isApp){
        $('body').addClass('isIOS') 
        $('.iosheader').length == 0 && $('header').before('<div class="iosheader"></div>');
    }  
}
var ipAddress = 'http://39.104.56.218/'
var ip = localStorage.getItem("ipAddress")
if(ip != null){
    ipAddress = ip
}else{
    localStorage.setItem("ipAddress",ipAddress)
}
var mainURL    =  ipAddress + "app/";
var dbURL      =  mainURL   + "?MethodName=";

