
/*
* 滑动删除
*/
var $Hewenqi = (function () {
    var _option = {
        id:"hewenqi"
    }
    var _hewenqi = function () {
        var h_obj;
        h_obj = document.getElementById(_option.id);
        if (h_obj){}
        else{return;}

        var initX;
        var moveX;
        var X = 0;
        var objX = 0;


        $('#hewenqi a').on('touchstart', function (event) {
            var obj = this;
			console.log(event.target)
			//console.log(obj)

            if ($(obj).hasClass("hewenqi-li")) {
                initX = event.targetTouches[0].pageX;
                objX = (obj.style.transform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
            }
            if (objX == 0) {
               $('#hewenqi a').on('touchmove', function (event) {
                    var obj = this;
                    if ($(obj).hasClass("hewenqi-li")) {
                        moveX = event.targetTouches[0].pageX;
                        X = moveX - initX;
                        if (X > 0) {
                            obj.style.transform = "translateX(" + 0 + "px)";
                        }
                        else if (X < 0) {
                            var l = Math.abs(X);
                            obj.style.transform = "translateX(" + -l + "px)";
                            if (l > 160) {
                                l = 160;
                                obj.style.transform = "translateX(" + -l + "px)";
                            }
                        }
                    }
                });
            }
            else if (objX < 0) {
                $('#hewenqi a').on('touchmove', function (event) {
                    var obj = this;
                    if ($(obj).hasClass("hewenqi-li")) {
                        moveX = event.targetTouches[0].pageX;
                        X = moveX - initX;
                        if (X > 0) {
                            var r = -160 + Math.abs(X);
                            obj.style.transform = "translateX(" + r + "px)";
                            if (r > 0) {
                                r = 0;
                                obj.style.transform = "translateX(" + r + "px)";
                            }
                        }
                        else {     //向左滑动
                            obj.style.transform = "translateX(" + -160 + "px)";
                        }
                    }
                });
            }

        })
        $('#hewenqi a').on('touchend', function (event) {
            var obj = this;
            if ($(obj).hasClass("hewenqi-li")) {

                var h_li = document.getElementsByClassName("hewenqi-li");
                var h_count = h_li.length;
                for (var i = 0; i < h_count; i++) {
                    if (obj != h_li[i])
                    h_li[i].style.transform = "translateX(" + 0 + "px)";
                }

                objX = (obj.style.transform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
                if (objX > -40) {
                    obj.style.transform = "translateX(" + 0 + "px)";
                } else {
                    obj.style.transform = "translateX(" + -160 + "px)";
                }
            }
        })

       /* var hewenqi_items = document.getElementsByClassName("hewenqi-btn");
        var h_count = hewenqi_items.length;
        for (var i = 0; i < h_count; i++) {
            hewenqi_items[i].addEventListener('click', function (event) {
                var hewenqi_items = event.target.parentNode;
                //hewenqi_items.style.display = 'none';//这里应该实现隐藏或者删除节点的功能
				hewenqi_items.parentNode.removeChild(hewenqi_items)
            })
        }*/
    }

    var _set=function(option)
    {
        _option = option;
    }

    return {
        Hewenqi: _hewenqi,
        Set:_set
    }
})();