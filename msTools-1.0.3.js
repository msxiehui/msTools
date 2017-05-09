/**
 * @author msxiehui and Team { chenhongyu }
 * form 北京耀启网络科技有限责任公司
 * form 北京百孚思传实网络营销机构
 *
 * 工具类，部分功能需要 jquery 或者 zepto
 *
 * time: 2016-10-01 22:27
 * updateTime:2016-11-5 msxiehui; 
 *
 */

(function () {
    var ms = window.ms = window.$$ = function (selector, context) {
        return new ms.fn.init(selector, context);
    };
    ms.version = "1.0.3";

    /*
     *  ****************************内置属性  不做太多设置，
     */
    ms.fn = ms.prototype = {
        init: function (selector) {
            if (selector) this.selector = selector;
            return this;
        }
    };


    /*----------------------------------------通用方法和全局变量------------------------------------------------*/
    /**
     * 判断当前函数是否需要 jQuery 或 Zepto 的支持
     * @since 1.0.1
     * @returns {Boolean} 布尔值是否存在jQuery或Zepto
     */
    ms.jQueryOrZepto=function(){
        if(!window.jQuery && !window.Zepto){
            console.error("此功能需要 jQuery或 Zepto 支持");
            return false;
        }
        return true;
    }
    /**
     * 窗口高度
     * @since 1.0.1
     * @type {Number}
     */

    ms.height=window.innerHeight;
    /**
     * 窗口宽度
     * @since 1.0.1
     * @type {Number}
     */
    ms.width=window.innerWidth;

    /*---------------------------------------独立方法-----------------------------------------*/
    /**
     * 输出页面值
     * @since  1.0.2
     * @example
     * <p>   ms.log.init()  默认是空值，直接显示到页面body
     * <p>   ms.log.log()   页面输出，console输出：返回值
     * <p>   ms.log.error() 页面输出，console输出：输出一条带有“错误”图标的消息和一个指向代码调用位置的超链接
     * <p>   ms.log.warn()  页面输出，console输出：输出一条带有“警告”图标的消息和一个指向代码调用位置的超链接
     * <p>   ms.log.trace() 页面输出，console输出：输出一条消息，并打开一个嵌套块，块中的内容都会缩进
     * <p>   ms.log.info()  页面输出，console输出：输出一条带有“信息”图标的消息和一个指向代码调用位置的超链接
     */

    ms.log = new function log() {
        this.ready=false;
        this.id="msLog";
        this.content="msCon";
        this.tool="msTool";
        this.pos=1;
        var _log = this;
        this.init = function (elm) {
            if (elm == null) {
                elm = $("body");
            }
            if($("#msLog").length>0){
                this.id="ms_msLog";
            }
            if($("#msCon").length>0){
                this.content="ms_msCon";
            }
            if($("#msTool").length>0){
                this.tool="ms_msTool";
            }
            elm.prepend('<div id="'+this.id+'" style="width: 50%;height: 30%;position: absolute;z-index: 999999; background: rgba(0,0,0,0.3);;">' +
                '<div id="'+this.content+'" style="padding: 6px;height: 80%;width: 90%;overflow: auto;position: relative;"></div>' +
                '<div id="'+this.tool+'" style="position: absolute;width: 100%;z-index: 999; bottom: 0;text-align: center">' +
                '<input type="button" value="切换位置" id="log_postion" style="z-index: 9999999;margin-right: 5px">' +
                '<input type="button" value="清空" id="log_clear" style="z-index: 9999999;margin-right: 5px">' +
                '<input type="button" value="关闭" id="log_close" style="z-index: 9999999;margin-right: 5px">' +
                ' </div>' +
                '</div>');
            this.ready=true;
            this.position();
            $("#log_postion").on("touchstart mousedown",function (e) {
                e.stopPropagation();
                if(_log.pos<5){
                    _log.pos+=1;
                }else{
                    _log.pos=1;
                }
                _log.position(_log.pos);
            });

            $("#log_clear").on("touchstart mousedown",function (e) {
                e.stopPropagation();
                _log.clear();
            });

            $("#log_close").on("touchstart mousedown",function (e) {
                e.stopPropagation();
                _log.close();
            });

            // 停止内容冒泡 防止 上层 事件影响滚动效果。
            $("#"+this.content).on("touchstart",function (e) {
                e.stopPropagation();
            });
            $("#"+this.content).on("touchmove",function (e) {
                e.stopPropagation();
            });
        }

        this.position=function(type){
            if(this.ready==false){
                console.warn("请初始化Log");
                return;
            }
            var log=$("#"+this.id);
            switch (type){
                case 2:
                    //顶 右
                    log.css({
                        "left":"",
                        "right":"0px",
                        "top":"0px",
                        "bottom":"",
                        "margin-left": "",
                        "margin-top": ""
                    });
                    this.pos=2;
                    break;
                case 3:
                    //居中
                    log.css({
                        "left":"50%",
                        "right":"",
                        "top":"50%",
                        "bottom":"",
                        "margin-left": "-25%",
                        "margin-top": "-25%"
                    });
                    this.pos=3;
                    break;
                case 4:
                    //底  左
                    log.css({
                        "left":"0px",
                        "right":"",
                        "top":"",
                        "bottom":"10px",
                        "margin-left": "",
                        "margin-top": ""
                    });
                    this.pos=4;
                    break;
                case 5:
                    //底  右
                    log.css({
                        "left":"",
                        "right":"0px",
                        "top":"",
                        "bottom":"10px",
                        "margin-left": "",
                        "margin-top": ""
                    });
                    this.pos=5;
                    break;
                default:
                    log.css({
                        "left":"0px",
                        "right":"",
                        "top":"0px",
                        "bottom":"",
                        "margin-left": "",
                        "margin-top": ""
                    });
                    this.pos=1;
                    break;
            }
        }
        this.log=function(str) {
            if (str != "") {
                $("#"+this.content).prepend("<pre style='color: #fff;white-space: pre-wrap;word-wrap: break-word;'>LOG:"+str+"</pre>");
                console.log("msLog.log:" + str);
            }
        }
        this.error=function(str){
            if(str!=""){
                $("#"+this.content).prepend("<pre style='color: #ff0000;white-space: pre-wrap;word-wrap: break-word;'>ERROR:"+str+"</pre>");
                console.error("msLog.error:"+str);
            }
        }
        this.warn=function(str) {
            if (str != "") {
                $("#" + this.content).prepend("<pre style='color: #fff700;white-space: pre-wrap;word-wrap: break-word;'>WARN:" + str + "</pre>");
                console.warn("msLog.warn:" + str);
            }
        }
        this.info=function(str){
            if(str!=""){
                $("#"+this.content).prepend("<pre style='color: #54b8ff;white-space: pre-wrap;word-wrap: break-word;'>INFO:"+str+"</pre>");
                console.info("msLog.info:"+str);
            }
        }
        this.trace=function(str){
            if(str!=""){
                $("#"+this.content).prepend("<pre style='color: #4bff50;white-space: pre-wrap;word-wrap: break-word;'>TRACE:"+str+"</pre>");
                console.trace("msLog.trace:"+str);
            }
        }
        this.clear=function () {
            $("#"+this.content).html("");
        }
        this.close=function () {
            $("#"+this.id).fadeOut(200);
        }
        this.show=function () {
            $("#"+this.id).fadeIn(200);
        }

    }

    /**
     * 加载进度百分比
	 * @since  1.0.1
	 * @param  {Array}  img      - 数组。需要加载的图片地址。
	 * @param {Boolean} elem     - 布尔值，是否加载页面中 img 标签中的图片。
     * @param{function} callback - 传回参数 data
     * <p>
     * <p>          data.id        当前完成图片的 ID号
     * <p>          data.total     总图片数
     * <p>          data.currenter 第几个完成的图片
     * <p>          data.bfb       加载序列的百分比。
     * @function
     */
	ms.loadings = function (img, elem,callback) {
		var imgArr=new Array();
		if(Array.isArray(img)){
			imgArr=img;
		}
		if(elem){
			var htmlImages = document.getElementsByTagName("img");
			var htmlImages_length = htmlImages.length;
			for(var i = 0; i < htmlImages_length; i++) {
				imgArr.push(htmlImages[i].src);
			}
		}

		for(var i = 0; i < imgArr.length; i++) {
			var newImages = new Image();
			newImages.src = imgArr[i];
			newImages.imgid = i;
			newImages.onload = imgload;
		};

		var currenter = 0;

		function imgload(ev) {
			currenter++;
			if(callback != null) {
    			var data = new Object;
                data.total = imgArr.length;
                /**
                 * 图片的ID值（也是加载序列的顺序值）
                 * @type {int} data.id
                 */
                data.id = ev.target.imgid;
                data.currenter = currenter;
                data.bfb = parseInt(currenter / imgArr.length * 100);
                callback (data);
			}
		}
	}


    /**
	 *自动缩放和定位页面中的元素
	 * @since  1.0.1
     * @param {String}[_elem=".csBox"]  需要视频的元素 可以是 类，ID 等，如果为空则默认为 类：.csBox
     * @param callback {Function} 回调函函数，data 当前元素的 缩放值，系数等，i 当前循环中的第几个(0开始)，num 当前总循环数
     * @param _w 设计图宽度  默认为 750；
     * @param _h 设计图高度   默认为 1136 如果想内容放大就修改 此值。缩放比例以此值为准。
     * @example
     * 页面元素设置  宽 高 x y cs-name 等内容；
     * <div class="csBox" width="100" height="100" left="130" top="64" cs-name="namebox"></div>
     * 如果没有 cs-name 属性则 name 为 src 内容;
     * ms.rest("ID/class",function(data,i,total){
     * data.target  -当前缩放元素
     * data.Eheight  -原始高度
     * data.Ewidth 原始宽度
     * data.scale 缩放系数
     * data.Eleft原始 left
     * data.Etop 原始 top
     * data.newWidth 新的宽度度
     * data.newHeight 新的高度
     * data.marginLeft 新的margin-left
     * data.marginTop 新的margin-top
     * data.name 元素名称 取 cs-name 值 为空则取 src 的值。
     * },750,1136);
     *
     */

    ms.reSet=function(_elem,callback,_w,_h){
         if(!ms.jQueryOrZepto()){
             return;
         }
         var elem,ww,hh;
        elem=_elem;
        ww=_w;
        hh=_h;
         if(typeof(elem)=="undefined" || elem==""){
            elem=".csBox";
        }
        if(typeof(ww)=="undefined" || ww=="" || ww<=0){
           ww=750;
        }
        if(typeof(hh)=="undefined" || hh=="" || hh<=0){
            hh=1136;
        }

        $(elem).each(function(i) {
            var data = elemScale($(this));
            $(this).css({
                "position": "absolute",
                "width": data.newWidth,
                "height": data.newHeight,
                "margin-left":data.marginLeft,
                "margin-top": data.marginTop
            });

            if (callback != null) {

                callback(data,i,$(elem).length);

            }
        });
        //自定义 工具对象。
        function elemScale(ele) {
            this.target=ele;
            this.Eheight =  ele.attr("height");
            this.Ewidth = ele.attr("width");
            this.scale=window.innerHeight/hh;
            this.Eleft = ele.attr("left");
            this.Etop =  ele.attr("top");
            this.newWidth =  this.Ewidth*this.scale;
            this.newHeight = this.Eheight*this.scale;
            //左右位置： （窗口宽度 - 设置宽度*缩放系数 ）/2 + 坐标位置*缩放系数

            this.marginLeft =(window.innerWidth-ww*this.scale)/2+this.Eleft*this.scale;
            this.marginTop = this.Etop*this.scale;
            var name=ele.attr("cs-name");
            if(name!=""){
                this.name=name;
            }else{
                this.name=ele.attr("src");
            }

            return this;
        }
    }


    /**------------------------------------------------字符串操作*/

    /**
     * 取出中间文本
     * 	@since  1.0.1
     * @param {String} str     - 欲取的全文本
     * @param {String} start   -前面文本
     * @param {String} end     -后面文本
     * @return{String} 中间文本
     * @example
     * <p>    str="12345";
     * <p>     start="2";
     * <p>     end="5";
     *  <p>    var str2=ms.getStrCenter(str,start,end);
     * <p>      str2 : 34;
     */
    ms.getStrCenter=function(str,start,end){
        var s1,s2;
        s1=str.indexOf(start);
        s2=str.indexOf(end);
        return str.substring(s1+1,s2);
    }

    /**------------------------------------------------数组操作*/

    /**
     * 判断是否为数组
     * 	@since  1.0.1
     * @param {Obj} 判断的对象
     * @return {Boolean}
     *  @example
     *  <p>    obj = [1,2,3]
     *  <p>    obj = false
     *  <p>    obj = "sdklf"
     */
    ms.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    /**
     *  取元素在数组中的位置
     * 	@since  1.0.1
     * @param {Array} 数组
     * @param {String} 元素
     * @return {*} 不存在返回  -1
     * @return {Number} 存在返回 元素所在的位置
     * @example
     * <p>  arr= [1,2,3,56,2,16,2,18,21,23,12],str = "18" 返回18在数组中是第几个
     */
    ms.arrIndexOf = function (arr, str) {
        // 如果可以的话，调用原生方法
        if (arr && arr.indexOf) {
            return arr.indexOf(str);
        }
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            // 定位该元素位置
            if (arr[i] == str) {
                return i;
            }
        }
        // 数组中不存在该元素
        return -1;
    }

    /**------------------------------------------------数字操作*/

    /**
     *  取最小数到最大数之间的随机数
     * 	@since  1.0.1
     * @param {Number} Min  最小值
     * @param {Number} Max  最大值
     * @return {Number} 返回随机数值
     * @example
     * <p>  Min = 1,Max = 25 返回值为1-25之间的随机数字
     */
    ms.rand = function (Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    }

    /**------------------------------------------------时间日期操作*/

    /**
     * 	@since  1.0.1
     * @description 返回当前日期时间的文本格式
     * @param type  数字  1：日期 、2： 时间 、其他：日期时间
     *          格式 1：2016-09-21
     *          格式 2：13:51:43
     *          其他   ：2016-09-21 13:51:39
     * @returns {*} 返回时间格式
     */
    ms.getNowFormatDate = function (type) {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate;
        if (type == 1) {
            currentdate = year + seperator1 + month + seperator1 + strDate
        } else if (type == 2) {
            currentdate = date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
        } else {
            currentdate = year + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
        }
        return currentdate;
    }

    /**------------------------------------------------验证操作*/
    /**
     * 验证是否是邮箱
     * @since  1.0.1
     * @param  {String} 邮箱的字符串。
     *@returns {Boolean}
     * @example
     * <p> str = "626099226@qq.com"
     */
    ms.isEmail = function (str) {
        var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        if (re.test(str)) {
            return true;
        }
        return false;
    }
    /**
     * 验证是否是用户姓名
     * @since  1.0.1
     * @param  {String} 用户名的字符串。
     ** @returns {Boolean}
     * @example
     * <p>    str = "失联飞机看到了"
     */
    ms.isName = function (name) {
        if (name != "" || name.search(/^[\u0391-\uFFE5\w]+$/) != -1) {
            return true;
        }
        return false;
    }

    /**
     * 验证是否是手机号
     * @since  1.0.1
     * @param  {String} 手机号的字符串。
     ** @returns {Boolean}
     * @example
     * <p>    str = 18801333342
     */
    ms.isPhone = function (str) {
        var pattern = /^1[34578]\d{9}$/;
        if (pattern.test(str)) {
            return true;
        }
        return false;
    }

    /**------------------------------------------------浏览器操作*/

    /**
     * 判断浏览器
     * @since  1.0.1
     * @param  {String} [some=Hide]
     ** @returns {Boolean}
     * @example
     * <p>    ms.browser.ios
     */
    ms.browser = function () {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        return {
            webKit: u.indexOf('AppleWebKit') > -1,
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
            weixin: u.indexOf('MicroMessenger') > -1,
            txnews: u.indexOf('qqnews') > -1,
            sinawb: u.indexOf('weibo') > -1,
            mqq: u.indexOf('QQ') > -1
        };
    }();

    /**
     * 判断是否 为电脑
     * @since  1.0.1
     * @param {String} [some=Hide]
     ** @returns {Boolean}
     * @example
     * <p>    ms.isPC.iPad
     */
    ms.isPC = function () {
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }();

    /**
     * 获取 URL get 参数
     * @since  1.0.1
     * @param  {}
     ** @returns {Array}
     */
    ms.getALL = function () {
        querystr = window.location.href.split("?");
        var GET = new Array();
        if (querystr[1]) {
            var GETs = querystr[1].split("&");
            for (i = 0; i < GETs.length; i++) {
               var tmp_arr = GETs[i].split("=");
              var key = tmp_arr[0];
                GET[key] = tmp_arr[1];
            }
        }
        return GET;
    }

    /**
     * 根据 参数名 获取 URL 参数值
     * @since  1.0.1
     * @param {String} 传入的参数名
     ** @returns {String} 参数值
     * @example
     * <p>   str = "2"
     */
    ms.getArg = function (name) {
        var url = document.location.href;
        var arrStr = url.substring(url.indexOf("?") + 1).split("&");
        for (var i = 0; i < arrStr.length; i++) {
            var loc = arrStr[i].indexOf(name + "=");
            if (loc != -1) {
                return arrStr[i].replace(name + "=", "").replace("?", "");
                break;
            }
        }
        return "";
    }

    /**------------------------------------------------cookies操作*/
    /**
     * 写cookies
     * @since  1.0.1
     * @param {String}[name]传入的cookies 名
     * @param {String} [value]传入的cookies 值
     * @example
     * <p>   name = "name",value = "Mis.Liu"
     */
    ms.setCookie = function (name, value) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }

    /**
     * 取Cookies
     * @since  1.0.1
     * @param {String} name需要取出的cookies 名
     ** @returns {String} cookies 的value值
     * @example
     * <p>   name = "name"
     */
    ms.getCookie = function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        } else {
            return null;
        }
    }

    /**
     *  删除 Cookie
     * @since  1.0.1
     * @param {String} name 需要删除的cookies 名
     * @example
     * <p>   name = "name"
     */
    ms.delCookie = function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = ms.getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    }
	
	
	
	
	
    ms.fn.init.prototype = ms.fn;

})();
