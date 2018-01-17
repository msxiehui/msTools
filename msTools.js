/**
 * @author msxiehui <msxiehui@163.com> and Team
 * @author chenhongyu <chenghongyu>
 * form 北京耀启网络科技有限责任公司
 * form 北京百孚思传实网络营销机构
 *
 * 工具类，部分功能需要 jquery 或者 zepto
 *
 * Time: 2016/8/8
 * updateTime:2016-11-5 msxiehui; 
 *
 */

(function () {
    var ms = window.ms = window.$$ = function (selector, context) {
        return new ms.fn.init(selector, context);
    };
    ms.version = "1.0.5";
    

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
     * ios微信音乐自动播放
     * @since  1.0.4
     * @example
     * <p>   ms.audioAutoPlay("id")  id为audio，能够让一些少许机型，音乐不能够在微信自动播放的，自动播放
     */

    // ms.audioAutoPlay = function (id) {
    //     if(id){
    //         var audio = document.getElementById(id);
    //
    //         document.addEventListener("WeixinJSBridgeReady", function() {
    //             audio.play();
    //         }, false);
    //         window.onload=function () {
    //             if(audio.paused){
    //                 audio.play();
    //             }
    //         }
    //         return true;
    //     }
    //    return false;
    // }

    /**
     * 输出页面提示值
     * @since  1.0.2
     * @deprecated since version 1.0.4  推荐使用 Vconsole.js  准备重写
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
    
    // 空数据判断
    ms.isOpenID=function(wxid) {
        if(wxid == null || typeof(wxid) == undefined || typeof(wxid) == null || wxid == "" || wxid <= 0 || wxid == "null" || wxid == "undefined") {
            return false;
        } else {
            return true;
        }
    }
    
    ms.getPathName=function(){
        // var webPath=window.location.pathname.substring(1);
        var webPath=window.location.pathname;
        var num=webPath.indexOf(".");
        if(num!=-1){
            webPath=webPath.substring(0,num);
        }
        var newPath=webPath.substring(0,webPath.lastIndexOf("/"));
        return newPath
    }
    ms.getHost=function () {
       return window.location.protocol+"//"+window.location.host +ms.getPathName()+"/";
    }
    
	ms.isIphoneX=function () {
        var ios=!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        var isX=false;
        var scale=window.innerWidth/window.innerHeight;
        if(ios && scale<0.52){
             return true;
        }else{
            return false;
        }
    }
    /**
     * @since  1.0.4
     * @param n   需要转换的数值
     * @param x 2 需要保留的位数
     * @param str false  是否需要返回 字符串型 如果是整数，是没有小数点的，所以需要返回字符型
     * @return Float/String
     * @example  ms.getFloat(100,4,true) 返回：'100.0000'
     * ms.getFloat(100,4) 返回：100
     */
    ms.getFloat =function(n,x,str){
	    
        var b= isNaN(Number(x))? x=2:x=Number(x);
        b==0 ? b=2:b=b;
        
        var num = parseFloat(n);
        if (isNaN(num)) {
            console.error("需要填写正确的转换数值");
            return false;
        }
        
        var pow=Math.pow(10,b);
        var f_x = Math.round(num * pow ) / pow;
        if(str==true){
            var s_x = f_x.toString();
            var pos_decimal = s_x.indexOf('.');
            if (pos_decimal < 0) {
                s_x += '.';
            }
            while (s_x.length <= b + 2) {
                s_x += '0';
            }
            f_x=s_x;
        };
        return f_x;
    }

    
    /**
	 *自动缩放和定位页面中的元素
	 * @since  1.0.1
     * @version 0.2
     * @requires msIphoneX  判断是否是 Iphone X
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
    
        var isX=false;
        var scale=window.innerWidth/window.innerHeight;
        if(scale<0.56){
            isX=true;
        }
        $(elem).each(function(i) {
            var cb = elemScale($(this));
            $(this).css({
                "position": "absolute",
                "width": cb.newWidth,
                "height": cb.newHeight,
                "margin-left":cb.marginLeft,
                "margin-top": cb.marginTop
            });
            if (callback != null) {
                callback(cb,i,$(elem).length);
            }
        });
    
        //自定义 工具对象。
        function elemScale(ele) {
            var obj={}
            obj.target=ele;
            obj.Eheight =  ele.attr("height");
            obj.Ewidth = ele.attr("width");
        
            obj.Eleft = ele.attr("left");
            obj.Etop =  ele.attr("top");
        
            obj.scale=window.innerHeight/hh;
            obj.Xtop=0;
            if(isX){
                console.log("矮小比例")
                 obj.scale=window.innerHeight*(1-(0.63-scale))/hh;
                 obj.Xtop=(window.innerHeight-hh*obj.scale)/2;
            }

            obj.newWidth =  obj.Ewidth*obj.scale;
            obj.newHeight = obj.Eheight*obj.scale;
            //左右位置： （窗口宽度 - 设置宽度*缩放系数 ）/2 + 坐标位置*缩放系数
            obj.marginLeft =(window.innerWidth-ww*obj.scale)/2+obj.Eleft*obj.scale;
            obj.marginTop = obj.Etop*obj.scale+obj.Xtop;

            var name=ele.attr("cs-name");
            if(name!=""){
                obj.name=name;
            }else{
                obj.name=ele.attr("src");
            }
        
            return obj;
        }
    }
    
    /**
     *
     *
     * 设计稿尺寸，缩放尺寸。自定义偏移值
     * @param _elem
     * @param callback
     * @param _w
     * @param _h
     * @param _offx
     * @param _offy
     */
    ms.reSet_test3=function(param){
        // if(!ms.jQueryOrZepto()){
        //     return;
        // }
   
        var _this={};
        _this.default={
            target:".csBox",
            dw:900,
            dh:1624,
            sw:750,
            sh:1204,
            safeW:750,
            safeH:1204,
            offx:null,
            offy:null,
            scaleAutoWidth:true,
            scaleAutoHeight:true,
            change:function (data) {},
            complete:function (data) {},
            scale:null,
            width:window.innerWidth,
            height:window.innerHeight,
        }
        
        _this.targets=[];
        _this.param = param || {}
        
        for (var key in _this.param)  {
            _this.default[key]=_this.param[key]
            for(var s in _this.param[key]){
                _this.default[key][s]=_this.param[key][s]
            }
        }
        
        
        
        if(_this.default.scale==null){
            _this.default.scale = _this.default.height/_this.default.sh;
            _this.default.scale=ms.getFloat(_this.default.scale,4);
        }
        
        
        if(_this.default.offx==null){
            _this.default.offx=(_this.default.sw-_this.default.dw)/2
        }

        if(_this.default.offy==null){
            _this.default.offy=(_this.default.sh-_this.default.dh)/2
        }
        
        
        var strOne=_this.default.target.slice(0,1);
        if(strOne=="#"){
            console.log("使用 ID 选择器")
            var targets=document.getElementById(_this.default.target.slice(1));
        }else if (strOne=="."){
            console.log("使用 类 选择器")
            var targets=document.getElementsByClassName(_this.default.target.slice(1));
        }else{
            console.log("默认：使用类 选择器")
            var targets=document.getElementsByClassName(_this.default.target);
        }

        
        var autoScaleW={}
    
        if(_this.default.scaleAutoWidth==true){
            //整体的偏移值 X
            autoScaleW.offsetX=(_this.default.width-_this.default.dw*_this.default.scale)/2
            autoScaleW.offsetX=ms.getFloat(autoScaleW.offsetX,4);
            
            //新的安全区域左侧坐标起点
            autoScaleW.safaX=(_this.default.safeW-_this.default.dw)/2*_this.default.scale
            autoScaleW.safaX=ms.getFloat(autoScaleW.safaX,4)
            
            //安全区是否被裁剪
            autoScaleW.isX=autoScaleW.offsetX<autoScaleW.safaX;
            
            //修正缩放系数，保证安全区显示
            autoScaleW.reScaleW=(autoScaleW.offsetX-autoScaleW.safaX)/_this.default.width
            autoScaleW.reScaleW=ms.getFloat(autoScaleW.reScaleW,4)
            if(autoScaleW.isX){
                 _this.default.scale+=autoScaleW.reScaleW
                _this.default.scale=ms.getFloat(_this.default.scale,4);
                console.warn("根据宽度-缩放系数重新修订：",_this.default.scale)
            }
        }

        
        var autoScaleH={}
        
        // 如果 允许自动缩放且宽度没有进行缩放，再进行高度的检测。节省资源。
        if(autoScaleW.isX==false && _this.default.scaleAutoHeight==true){
            autoScaleH.newHeight=parseFloat((_this.default.dh*_this.default.scale).toFixed(3));
            //整体的偏移值 Y
            autoScaleH.offsetY=(_this.default.height-_this.default.dh*_this.default.scale)/2
            autoScaleH.offsetY=ms.getFloat(autoScaleH.offsetY,4);
            autoScaleH.safaY=(_this.default.dh-_this.default.safeH)/2*_this.default.scale
            autoScaleH.safaY=ms.getFloat(autoScaleH.safaY,4);
            autoScaleH.isY=autoScaleH.offsetY<autoScaleH.offsetY;
            //修正缩放系数，保证安全区显示
            autoScaleH.reScaleH=(autoScaleH.offsetY-autoScaleH.safaY)/_this.default.height
            autoScaleH.reScaleH=ms.getFloat(autoScaleH.reScaleH,4);
    
            if(autoScaleH.isY){
                _this.default.scale+=autoScaleH.reScaleH
                console.warn("根据高度-缩放系数重新修订：",_this.default.scale)
            }
        }
        
        
    
        for (var i=0;i<targets.length;i++){
          // console.log(i,targets[i]);
            var ele=targets[i];
            _this.targets.push(ele);
            var cb=elemScale(ele);
            ele.style.width=cb.newWidth+"px";
            ele.style.height=cb.newHeight+"px";
            ele.style.position="absolute";
            ele.style.marginLeft=cb.marginLeft+"px";
            ele.style.marginTop=cb.marginTop+"px";
            _this.default.change(cb);
        }
        _this.default.complete(_this);
        
        //自定义 工具对象。
        function elemScale(ele) {
            var obj={}
            obj.target=ele;
    
            obj.Eheight = parseFloat(ele.getAttribute("height"));
            obj.Ewidth = parseFloat(ele.getAttribute("width"));
            
            obj.Eleft = parseFloat(ele.getAttribute("left"));
            obj.Etop =  parseFloat(ele.getAttribute("top"));
            
            obj.scale=_this.default.scale;
            obj.newWidth =  obj.Ewidth*_this.default.scale;
            obj.newHeight = obj.Eheight*_this.default.scale;
            obj.marginLeft =(_this.default.width -_this.default.sw*_this.default.scale)/2+(obj.Eleft+_this.default.offx)*_this.default.scale;
            obj.marginTop =(_this.default.height -_this.default.sh*_this.default.scale)/2+(obj.Etop+_this.default.offy)*_this.default.scale;

            
            obj.Etype=ele.getAttribute("iforce-type");
            if(obj.Etype!=null && obj.Etype!=""){
                console.log("特殊配置")
                
                if(obj.Etype.indexOf(" ")!=-1){
                    var type=obj.Etype.split(" ");
                    obj.Tx = type[0]!=null && type[0]!="" ? type[0]: null
                    obj.Ty = type[1]!=null && type[1]!="" ? type[1]: null
                }else{
                    
                    obj.Tx=obj.Etype;
                    if(obj.Etype=="center"){
                        obj.Ty="center";
                    }else{
                        obj.Ty="top";
                    }
                }

                
                //X 轴 Y轴 的距离值。
                obj.Xaxis=parseInt(ele.getAttribute("iforce-x"));
                obj.Yaxis=parseInt(ele.getAttribute("iforce-y"));
    
                
                // 值为空时 赋值为 0
                obj.Xaxis=isNaN(obj.Xaxis) ? 0 : obj.Xaxis;
                obj.Yaxis=isNaN(obj.Yaxis) ? 0 : obj.Yaxis;
    
                
                switch (obj.Tx){
                    case "left":
                        obj.marginLeft=obj.Xaxis
                        break;
                    case "center":
                        obj.marginLeft=(_this.default.width-obj.newWidth)/2+obj.Xaxis
                        console.log(obj.marginLeft);
                        break;
                    case "right":
                        obj.marginLeft=(_this.default.width-obj.newWidth)-obj.Xaxis
                        break;
                    default:
                        obj.marginLeft=obj.Xaxis
                        break
                }
                switch (obj.Ty){
                    case "top":
                        obj.marginTop =obj.Yaxis;
                        break;
                    case "center":
                        obj.marginTop =(_this.default.height-obj.newHeight)/2+obj.Yaxis;
                        break;
                    case "bottom":
                        obj.marginTop =_this.default.height-obj.newHeight-obj.Yaxis;
                        break;
                    default:
                        obj.marginTop =obj.Yaxis;
                        break;
                }
            }
            
            
            
            
            
            return obj;
        }
    }
    
    /**
	 *自动缩放和定位页面中的元素
	 * @since  1.0.1
     * @version 0.2
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

    ms.reSetW_test=function(_elem,callback,_w,_h){
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
    
    
        var ios=!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        var isX=false;
        console.log(ios);
        var scale=window.innerWidth/window.innerHeight;
        if(ios && scale<0.52){
            console.log("这是苹果X噢")
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
            this.scale=window.innerWidth/ww;
            if(ios && scale<0.52){
                console.log("这是苹果X噢")
                console.log(scale)
               // this.scale=window.innerHeight*(1-(0.63-scale))/hh;
            }
           
            this.Eleft = ele.attr("left");
            this.Etop =  ele.attr("top");
            this.newWidth =  this.Ewidth*this.scale;
            this.newHeight = this.Eheight*this.scale;
            //左右位置： （窗口宽度 - 设置宽度*缩放系数 ）/2 + 坐标位置*缩放系数
            
            this.marginLeft =this.Eleft*this.scale;
            this.marginTop =(window.innerHeight-hh*this.scale)/2+this.Etop*this.scale;
            
            
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
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) == " qq" ,//是否QQ
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端
            txnews: u.indexOf('qqnews') > -1, //腾讯新闻
            sinawb: u.indexOf('weibo') > -1, //新浪微博
            mqq: u.indexOf('QQ') > -1 //手机QQ
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
    console.log("msTools:"+ms.version);

})();
