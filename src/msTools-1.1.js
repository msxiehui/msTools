/**
 * @author msxiehui <msxiehui@163.com> and Team
 * @author chenhongyu <chenghongyu>
 * form 北京耀启网络科技有限责任公司
 * form 北京百孚思传实网络营销机构
 *
 * 工具类，部分功能需要 jquery 或者 zepto
 *
 * Time: 2016/8/8
 * updateTime:2018-12-25 msxiehui;
 * 移植了部分  Zepto 的源码（选择器等）attr,find,ajax,等
 *
 */

var ms = (function () {
    var ms = {}, $$, key, document = window.document,
        simpleSelectorRE = /^[\w-]*$/,
        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
        singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        rootNodeRE = /^(?:body|html)$/i,
        capitalRE = /([A-Z])/g,
        camelize,uniq,
        methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],
        emptyArray = [], concat = emptyArray.concat, filter = emptyArray.filter, slice = emptyArray.slice,
        cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
        table = document.createElement('table'),
        tableRow = document.createElement('tr'),
        containers = {
            'tr': document.createElement('tbody'),
            'tbody': table, 'thead': table, 'tfoot': table,
            'td': tableRow, 'th': tableRow,
            '*': document.createElement('div')
        },

        isArray = Array.isArray ||
            function (object) {
                return object instanceof Array
            },
        class2type = {},
        toString = class2type.toString,
        adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ]

    ;
    ms.buildversion = "1.1";
    ms.internalversion = "0-181225";
    ms.version = ms.buildversion + "." + ms.internalversion;

    /*----------------------------zepto.js--------公共函数-------------*/
    function isFunction(obj) {
        return typeof obj == "function";
    }
    function isWindow(obj) {
        return obj != null && obj == obj.window
    }
    function isDocument(obj) {
        return obj != null && obj.nodeType == obj.DOCUMENT_NODE
    }
    function isObject(obj) {
        return typeof obj == "object"
    }
    function funcArg(context, arg, idx, payload) {
        return isFunction(arg) ? arg.call(context, idx, payload) : arg
    }
    function setAttribute(node, name, value) {
        value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
    }
    function compact(array) {
        return filter.call(array, function (item) {
            return item != null
        })
    }
    function flatten(array) {
        return array.length > 0 ? $$.fn.concat.apply([], array) : array
    }
    function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
    }
    function likeArray(obj) {
        var length = !!obj && 'length' in obj && obj.length,
            type = $$.type(obj)

        return 'function' != type && !isWindow(obj) && (
            'array' == type || length === 0 ||
            (typeof length == 'number' && length > 0 && (length - 1) in obj)
        )
    }

    function type(obj) {
        return obj == null ? String(obj) :
            class2type[toString.call(obj)] || "object"
    }
    function className(node, value) {
        var klass = node.className || '',
            svg = klass && klass.baseVal !== undefined

        if (value === undefined) return svg ? klass.baseVal : klass
        svg ? (klass.baseVal = value) : (node.className = value)
    }
    camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
    function dasherize(str) {
        return str.replace(/::/g, '/')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/_/g, '-')
            .toLowerCase()
    }
    uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }
    // function classRE(name) {
    //     return name in classCache ?
    //         classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
    // }

    function maybeAddPx(name, value) {
        return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
    }

    //原型方法。
    function M(dom, selector) {
        var i, len = dom ? dom.length : 0
        for (i = 0; i < len; i++) this[i] = dom[i]
        this.length = len
        this.selector = selector || ''
    }
    // `$.zepto.fragment` takes a html string and an optional tag name
    // to generate DOM nodes from the given html string.
    // The generated DOM nodes are returned as an array.
    // This function can be overridden in plugins for example to make
    // it compatible with browsers that don't support the DOM fully.
    ms.fragment = function(html, name, properties) {
        var dom, nodes, container

        // A special case optimization for a single tag
        if (singleTagRE.test(html)) dom = $$(document.createElement(RegExp.$1))

        if (!dom) {
            if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
            if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
            if (!(name in containers)) name = '*'

            container = containers[name]
            container.innerHTML = '' + html
            dom = $$.each(slice.call(container.childNodes), function(){
                container.removeChild(this)
            })
        }

        if (isPlainObject(properties)) {
            nodes = $(dom)
            $.each(properties, function(key, value) {
                if (methodAttributes.indexOf(key) > -1) nodes[key](value)
                else nodes.attr(key, value)
            })
        }

        return dom
    }



    //------------------------公共函数end

    //原型对象
    ms.M = function (dom, selector) {
        return new M(dom, selector)
    }

    //判断是否是 M 对象
    ms.isM = function (object) {
        return object instanceof ms.M
    }

    //初始化函数  -摘自 Zepto
    ms.init = function (selector, context) {
        var dom
        if (!selector) {
            return ms.M();
        } else if (typeof selector == 'string') {
            selector = selector.trim()
            if (context !== undefined) {
                return $$(context).find(selector)
            } else {
                dom = ms.qsa(document, selector)
            }
        } else if (isFunction(selector)) {
            return $$(document).ready(selector)
        } else if (ms.isM(selector)) {
            return selector
        } else {
            if (isArray(selector)) dom = compact(selector)
            else if (isObject(selector))
                dom = [selector], selector = null
            else if (fragmentRE.test(selector))
                dom = ms.fragment(selector.trim(), RegExp.$1, context), selector = null
            else if (context !== undefined) return $$(context).find(selector)
            else dom = ms.qsa(document, selector)
        }
        return ms.M(dom, selector)
    }

    //声明主要方法。
    $$ = function (selector, context) {
            return ms.init(selector, context)
    }

    //    对象合并
    function extend(target, source, deep) {
        for (key in source)
            if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                if (isPlainObject(source[key]) && !isPlainObject(target[key]))
                    target[key] = {}
                if (isArray(source[key]) && !isArray(target[key]))
                    target[key] = []
                extend(target[key], source[key], deep)
            }
            else if (source[key] !== undefined) target[key] = source[key]
    }

    // 对象合并函数。
    $$.extend = function (target) {
        var deep, args = slice.call(arguments, 1)
        if (typeof target == 'boolean') {
            deep = target
            target = args.shift()
        }
        args.forEach(function (arg) {
            extend(target, arg, deep)
        })
        return target
    }
    $$.contains = document.documentElement.contains ?
        function(parent, node) {
            return parent !== node && parent.contains(node)
        } :
        function(parent, node) {
            while (node && (node = node.parentNode))
                if (node === parent) return true
            return false
        }
    $$.type = type
    $$.isFunction = isFunction
    $$.isWindow = isWindow
    $$.isArray = isArray
    $$.isPlainObject = isPlainObject

    /*
     *  ****************************内置属性
     */
    $$.fn = {
        forEach: emptyArray.forEach,
        reduce: emptyArray.reduce,
        push: emptyArray.push,
        sort: emptyArray.sort,
        splice: emptyArray.splice,
        indexOf: emptyArray.indexOf,

        concat: function(){
            var i, value, args = []
            for (i = 0; i < arguments.length; i++) {
                value = arguments[i]
                args[i] = ms.isM(value) ? value.toArray() : value
            }
            return concat.apply(ms.isM(this) ? this.toArray() : this, args)
        },
        get: function (idx) {
            return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
        },
        on:function(event,callback,useCapture){
            $$.on(this,event,callback,useCapture);
        },
        toArray: function () {
            return this.get()
        },
        size: function () {
            return this.length
        },
        remove: function () {
            return this.each(function () {
                if (this.parentNode != null)
                    this.parentNode.removeChild(this)
            })
        },
        css: function(property, value){
            if (arguments.length < 2) {
                var element = this[0]
                if (typeof property == 'string') {
                    if (!element) return
                    return element.style[camelize(property)] || getComputedStyle(element, '').getPropertyValue(property)
                } else if (isArray(property)) {
                    if (!element) return
                    var props = {}
                    var computedStyle = getComputedStyle(element, '')
                    $.each(property, function(_, prop){
                        props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
                    })
                    return props
                }
            }

            var css = ''
            if (type(property) == 'string') {
                if (!value && value !== 0)
                    this.each(function(){ this.style.removeProperty(dasherize(property)) })
                else
                    css = dasherize(property) + ":" + maybeAddPx(property, value)
            } else {
                for (key in property)
                    if (!property[key] && property[key] !== 0)
                        this.each(function(){ this.style.removeProperty(dasherize(key)) })
                    else
                        css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
            }

            return this.each(function(){ this.style.cssText += ';' + css })
        },
        each: function (callback) {
            emptyArray.every.call(this, function (el, idx) {
                return callback.call(el, idx, el) !== false
            })
            return this
        },
        map: function (fn) {
            return $$($$.map(this, function (el, i) {
                return fn.call(el, i, el)
            }))
        },
        // 加载完成后的回调
        ready: function (callback) {
            // don't use "interactive" on IE <= 10 (it can fired premature)
            if (document.readyState === "complete" ||
                (document.readyState !== "loading" && !document.documentElement.doScroll))
                setTimeout(function () {
                    callback($$)
                }, 0)
            else {
                var handler = function () {
                    document.removeEventListener("DOMContentLoaded", handler, false)
                    window.removeEventListener("load", handler, false)
                    callback($$)
                }
                document.addEventListener("DOMContentLoaded", handler, false)
                window.addEventListener("load", handler, false)
            }
            return this
        },
        find: function (selector) {
            var result, $this = this
            if (!selector) {
                result = $$()
            }
            else if (typeof selector == 'object') {
                result = $$(selector).filter(function () {
                    var node = this
                    return emptyArray.some.call($this, function (parent) {
                        return $$.contains(parent, node)
                    })
                })
            }
            else if (this.length == 1) {
                result = $$(ms.qsa(this[0], selector))
            }
            else {
                result = this.map(function () {
                    return ms.qsa(this, selector)
                })
            }
            return result
        },
        empty: function(){
            return this.each(function(){ this.innerHTML = '' })
        },
        html: function(html){
            return 0 in arguments ?
                this.each(function(idx){
                    var originHtml = this.innerHTML
                    $$(this).empty().append( funcArg(this, html, idx, originHtml) )
                }) :
                (0 in this ? this[0].innerHTML : null)
        },
        attr: function (name, value) {
            var result
            return (typeof name == 'string' && !(1 in arguments)) ?
                (0 in this && this[0].nodeType == 1 && (result = this[0].getAttribute(name)) != null ? result : undefined) :
                this.each(function (idx) {
                    if (this.nodeType !== 1) return
                    if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
                    else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
                })
        },
        fadeOut:function (speed) {
            if(!speed){speed=200};
            var n=speed/25;
            var alpha_speed=1/n;
            var _this=this;
            if(_this.css("display")=="none"){
                return;
                _this.css("display","block")
            }

            if(_this.css("visibility")=="hidden"){
                return;
                _this.css("visibility","visible")
            }


            var alpha= parseFloat(_this.css("opacity"));
            if(alpha==0){
                return;
                _this.css("opacity","0");
            }
            var c=0;
            var timer=setInterval(function () {
                alpha= parseFloat(_this.css("opacity"));
                _this.css("opacity",alpha-alpha_speed);
                if(alpha+alpha_speed<=0){
                    _this.css("opacity","0");
                    _this.css("visibility","hidden")
                    clearInterval(timer);
                }
                if(c>n){
                    clearInterval(timer);
                }
                c++;
            },25);

        },
        fadeIn:function (speed) {
            if(!speed){speed=200};
            var n=speed/25;
            var alpha_speed=1/n;
            var _this=this;
            if(_this.css("display")=="none"){
                _this.css("display","block")
            }

            if(_this.css("visibility")=="hidden"){
                _this.css("visibility","visible")
            }
            var alpha= parseFloat(_this.css("opacity"));
            if(alpha==1){
                _this.css("opacity","0");
            }
            var c=0;
            var timer=setInterval(function () {
                alpha= parseFloat(_this.css("opacity"));
                _this.css("opacity",alpha+alpha_speed);
                if(alpha+alpha_speed>=1){
                    _this.css("opacity","1");
                    clearInterval(timer);
                }
                if(c>n){
                    clearInterval(timer);
                }
                c++;
            },25);
        }
    };

    //CSS 选择器   Zepto.js
    ms.qsa = function (element, selector) {
        var found,
            maybeID = selector[0] == '#',
            maybeClass = !maybeID && selector[0] == '.',
            nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
            isSimple = simpleSelectorRE.test(nameOnly)
        return (element.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
            ((found = element.getElementById(nameOnly)) ? [found] : []) :
            (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
                slice.call(
                    isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
                        maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
                            element.getElementsByTagName(selector) : // Or a tag
                        element.querySelectorAll(selector) // Or it's not simple, and we need to query all
                )
    }

    //----------------------------Zepto.js 方法
    $$.map = function (elements, callback) {
        var value, values = [], i, key
        if (likeArray(elements))
            for (i = 0; i < elements.length; i++) {
                value = callback(elements[i], i)
                if (value != null) values.push(value)
            }
        else
            for (key in elements) {
                value = callback(elements[key], key)
                if (value != null) values.push(value)
            }
        return flatten(values)
    }

    $$.each = function (elements, callback) {
        var i, key
        if (likeArray(elements)) {
            for (i = 0; i < elements.length; i++)
                if (callback.call(elements[i], i, elements[i]) === false) return elements
        } else {
            for (key in elements)
                if (callback.call(elements[key], key, elements[key]) === false) return elements
        }

        return elements
    }

    // Populate the class2type map
    $$.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase()
    })

    function traverseNode(node, fun) {
        fun(node)
        for (var i = 0, len = node.childNodes.length; i < len; i++)
            traverseNode(node.childNodes[i], fun)
    }

// Generate the `after`, `prepend`, `before`, `append`,
    // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
    adjacencyOperators.forEach(function(operator, operatorIndex) {
        var inside = operatorIndex % 2 //=> prepend, append

        $$.fn[operator] = function(){
            // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
            var argType, nodes = $$.map(arguments, function(arg) {

                    var arr = []
                    argType = type(arg)
                    if (argType == "array") {
                        arg.forEach(function(el) {
                            if (el.nodeType !== undefined) return arr.push(el)
                            else if ($$.ms.isM(el)) return arr = arr.concat(el.get())
                            arr = arr.concat(ms.fragment(el))
                        })
                        return arr
                    }
                    return argType == "object" || arg == null ?
                        arg : ms.fragment(arg)
                }),
                parent, copyByClone = this.length > 1
            if (nodes.length < 1) return this

            return this.each(function(_, target){
                parent = inside ? target : target.parentNode

                // convert all methods to a "before" operation
                target = operatorIndex == 0 ? target.nextSibling :
                    operatorIndex == 1 ? target.firstChild :
                        operatorIndex == 2 ? target :
                            null

                var parentInDocument = $$.contains(document.documentElement, parent)

                nodes.forEach(function(node){
                    if (copyByClone) node = node.cloneNode(true)
                    else if (!parent) return $$(node).remove()

                    parent.insertBefore(node, target)
                    if (parentInDocument) traverseNode(node, function(el){
                        if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
                            (!el.type || el.type === 'text/javascript') && !el.src){
                            var target = el.ownerDocument ? el.ownerDocument.defaultView : window
                            target['eval'].call(target, el.innerHTML)
                        }
                    })
                })
            })
        }

        // after    => insertAfter
        // prepend  => prependTo
        // before   => insertBefore
        // append   => appendTo
        $$.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
            $(html)[operator](this)
            return this
        }
    })



    /*----------------------------------------通用方法和全局变量------------------------------------------------*/
    /**
     * 判断当前函数是否需要 jQuery 或 Zepto 的支持
     * @since 1.0.1
     * @returns {Boolean} 布尔值是否存在jQuery或Zepto
     */
    $$.jQueryOrZepto = function () {
        if (!window.jQuery && !window.Zepto) {
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

    $$.height = window.innerHeight;
    /**
     * 窗口宽度
     * @since 1.0.1
     * @type {Number}
     */
    $$.width = window.innerWidth;

    /*---------------------------------------独立方法-----------------------------------------*/

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

    $$.log = new function log() {
        this.ready = false;
        this.id = "msLog";
        this.content = "msCon";
        this.tool = "msTool";
        this.pos = 1;
        var _log = this;
        this.init = function (elm) {
            if (elm == null) {
                elm = $$("body");
            }
            if ($$("#msLog").length > 0) {
                this.id = "ms_msLog";
            }
            if ($$("#msCon").length > 0) {
                this.content = "ms_msCon";
            }
            if ($$("#msTool").length > 0) {
                this.tool = "ms_msTool";
            }
            elm.prepend('<div id="' + this.id + '" style="width: 50%;height: 30%;position: absolute;z-index: 999999; background: rgba(0,0,0,0.3);;">' +
                '<div id="' + this.content + '" style="padding: 6px;height: 80%;width: 90%;overflow: auto;position: relative;"></div>' +
                '<div id="' + this.tool + '" style="position: absolute;width: 100%;z-index: 999; bottom: 0;text-align: center">' +
                '<input type="button" value="切换位置" id="log_postion" style="z-index: 9999999;margin-right: 5px">' +
                '<input type="button" value="清空" id="log_clear" style="z-index: 9999999;margin-right: 5px">' +
                '<input type="button" value="关闭" id="log_close" style="z-index: 9999999;margin-right: 5px">' +
                ' </div>' +
                '</div>');

            this.ready = true;
            this.position();

            this.btn_postion=window.document.getElementById("log_postion");
            console.log(this.btn_postion);

            $$("#log_postion").on("touchstart", function (e) {
                e.stopPropagation();
                if (_log.pos < 5) {
                    _log.pos += 1;
                } else {
                    _log.pos = 1;
                }
                _log.position(_log.pos);
            });


            $$("#log_clear").on("touchstart mousedown", function (e) {
                e.stopPropagation();
                _log.clear();
            });

            $$("#log_close").on("touchstart mousedown", function (e) {
                e.stopPropagation();
                _log.close();
            });

            // 停止内容冒泡 防止 上层 事件影响滚动效果。
            $$("#" + this.content).on("touchstart", function (e) {
                e.stopPropagation();
            });
            $$("#" + this.content).on("touchmove", function (e) {
                e.stopPropagation();
            });
        }

        this.position = function (type) {
            if (this.ready == false) {
                console.warn("请初始化Log");
                return;
            }
            var log = $$("#" + this.id);
            switch (type) {
                case 2:
                    //顶 右
                    log.css({
                        "left": "",
                        "right": "0px",
                        "top": "0px",
                        "bottom": "",
                        "margin-left": "",
                        "margin-top": ""
                    });
                    this.pos = 2;
                    break;
                case 3:
                    //居中
                    log.css({
                        "left": "50%",
                        "right": "",
                        "top": "50%",
                        "bottom": "",
                        "margin-left": "-25%",
                        "margin-top": "-25%"
                    });
                    this.pos = 3;
                    break;
                case 4:
                    //底  左
                    log.css({
                        "left": "0px",
                        "right": "",
                        "top": "",
                        "bottom": "10px",
                        "margin-left": "",
                        "margin-top": ""
                    });
                    this.pos = 4;
                    break;
                case 5:
                    //底  右
                    log.css({
                        "left": "",
                        "right": "0px",
                        "top": "",
                        "bottom": "10px",
                        "margin-left": "",
                        "margin-top": ""
                    });
                    this.pos = 5;
                    break;
                default:
                    log.css({
                        "left": "0px",
                        "right": "",
                        "top": "0px",
                        "bottom": "",
                        "margin-left": "",
                        "margin-top": ""
                    });
                    this.pos = 1;
                    break;
            }
        }
        this.log = function (str) {
            if (str != "") {
                $$("#" + this.content).prepend("<pre style='color: #fff;white-space: pre-wrap;word-wrap: break-word;'>LOG:" + str + "</pre>");
                console.log("msLog.log:" + str);
            }
        }
        this.error = function (str) {
            if (str != "") {
                $$("#" + this.content).prepend("<pre style='color: #ff0000;white-space: pre-wrap;word-wrap: break-word;'>ERROR:" + str + "</pre>");
                console.error("msLog.error:" + str);
            }
        }
        this.warn = function (str) {
            if (str != "") {
                $$("#" + this.content).prepend("<pre style='color: #fff700;white-space: pre-wrap;word-wrap: break-word;'>WARN:" + str + "</pre>");
                console.warn("msLog.warn:" + str);
            }
        }
        this.info = function (str) {
            if (str != "") {
                $$("#" + this.content).prepend("<pre style='color: #54b8ff;white-space: pre-wrap;word-wrap: break-word;'>INFO:" + str + "</pre>");
                console.info("msLog.info:" + str);
            }
        }
        this.trace = function (str) {
            if (str != "") {
                $$("#" + this.content).prepend("<pre style='color: #4bff50;white-space: pre-wrap;word-wrap: break-word;'>TRACE:" + str + "</pre>");
                console.trace("msLog.trace:" + str);
            }
        }
        this.clear = function () {
            $$("#" + this.content).html("");
        }
        this.close = function () {
            $$("#" + this.id).fadeOut(200);
        }
        this.show = function () {
            $$("#" + this.id).fadeIn(200);
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
    $$.loadings = function (img, elem, callback) {
        var imgArr = new Array();
        if (Array.isArray(img)) {
            imgArr = img;
        }
        if (elem) {
            var htmlImages = document.getElementsByTagName("img");
            var htmlImages_length = htmlImages.length;
            for (var i = 0; i < htmlImages_length; i++) {
                if (htmlImages[i].src) {
                    imgArr.push(htmlImages[i].src);
                }
            }
        }

        for (var i = 0; i < imgArr.length; i++) {
            var newImages = new Image();
            newImages.src = imgArr[i];
            newImages.imgid = i;
            newImages.onload = imgload;
        }

        var currenter = 0;

        function imgload(ev) {
            currenter++;
            if (callback != null) {
                var data = new Object;
                data.total = imgArr.length;
                /**
                 * 图片的ID值（也是加载序列的顺序值）
                 * @type {int} data.id
                 */
                data.id = ev.target.imgid;
                data.currenter = currenter;
                data.bfb = parseInt(currenter / imgArr.length * 100);
                callback(data);
            }
        }
    }

    /**
     * 注册事件
     * @since 1.1.0
     * @param ele  事件触发的主体，默认使用 $$ 选择器对象
     * @param event  所注册的事件，支持多事件，空格间隔
     * @param callback 回调函数。
     * @param useCapture 是否冒泡
     */
    $$.on = function(ele,event,callback,useCapture){
        var events=event.split(" ");
        if(!useCapture){useCapture=false}

        if(isObject(ele)){
            ele.forEach(function (_ele) {
                events.forEach(function (_event) {
                    _ele.addEventListener(_event,callback,useCapture);
                })
            })
        }else{
            events.forEach(function (_event) {
                ele.addEventListener(_event,callback,useCapture);
            })
        }
    }

    /**
     * 判断字符串 状态
     * @since 1.0.5
     * @param str string 需要判断的 字符串
     * @param min number 需要判断的长度，如果小于此长度 依然返回 true 认为其为空
     * @param max bumber 需要判断的长度，如果大于此长度 依然返回 true 认为其为空
     * @param sub array  是否排除 子字符串 如果包含 子串 返回 true  认为其为空
     * @param exc boolean 默认为 true 是否排除 sub 的字符串，如果包含 返回 true 认为 其为 空
     * @return {boolean}  当 str 不符合条件是 返回 true 符合条件时 返回 false
     *
     */


    $$.isNullStr = function (str, min, max, sub, exc) {
        if (typeof str != "string" && typeof str != "number") {
            console.log("str 类型：", typeof str);
            return true;
        } else {
            var str_str = str.toString();
            console.log(str_str);
            if (str_str == "" || str_str == "null" || str_str == "undefined") {
                return true
            } else {
                if (min != null) {
                    console.log("判断最小长度")
                    if (str_str.length < min) {
                        return true;
                    }
                }
                if (max != null) {
                    console.log("判断最大长度")
                    if (str_str.length > max) {
                        return true;
                    }
                }
                if (sub != null) {
                    exc = exc == null ? true : exc;
                    if (Array.isArray(sub)) {
                        for (var s in sub) {
                            if (str_str.indexOf(sub[s]) != -1) {
                                return exc ? true : false;
                            }
                        }
                    } else {
                        if (str_str.indexOf(sub) != -1) {
                            return exc ? true : false;
                        }
                    }
                }
            }
        }

        return false;
    };


    /**
     * 获取项目目录（域名.com/ 后的部分 以及去掉 index.html的部分）
     * @since 1.0.5
     * @return {string}
     */

    $$.getPathName = function () {
        var webPath = window.location.pathname;
        var num = webPath.indexOf(".");
        if (num != -1) {
            webPath = webPath.substring(0, num);
        }
        var newPath = webPath.substring(0, webPath.lastIndexOf("/"));
        return newPath
    }


    /**
     * 获取项目链接（域名+目录）不包含  文件名 /index.html
     * @since 1.0.5
     * @return {string}
     *
     */

    $$.getHost = function () {
        return window.location.protocol + "//" + window.location.host + ms.getPathName() + "/";
    }


    /**
     * 判断是否 是IphoneX  机型
     * @since  1.0.5
     * @return {boolean}
     */
    $$.isIphoneX = function () {
        var ios = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
        var scale = window.innerWidth / window.innerHeight;
        if (ios && scale < 0.52) {
            return true;
        } else {
            return false;
        }
    }


    /**
     * 获取小数点后 几位函数。
     * @since  1.0.5
     * @param n   需要转换的数值
     * @param x 2 需要保留的位数
     * @param str false  是否需要返回 字符串型 如果是整数，是没有小数点的，所以需要返回字符型
     * @return Float/String
     * @example  ms.getFloat(100,4,true) 返回：'100.0000'
     * ms.getFloat(100,4) 返回：100
     */
    $$.getFloat = function (n, x, str) {

        var b = isNaN(Number(x)) ? x = 2 : x = Number(x);
        b == 0 ? b = 2 : b = b;

        var num = parseFloat(n);
        if (isNaN(num)) {
            console.error("需要填写正确的转换数值");
            return false;
        }

        var pow = Math.pow(10, b);
        var f_x = Math.round(num * pow) / pow;
        if (str == true) {
            var s_x = f_x.toString();
            var pos_decimal = s_x.indexOf('.');
            if (pos_decimal < 0) {
                s_x += '.';
            }
            while (s_x.length <= b + 2) {
                s_x += '0';
            }
            f_x = s_x;
        }
        ;
        return f_x;
    }


    /**
     *自动缩放和定位页面中的元素
     * @since  1.0.1
     * @version 0.3
     * @param {Object}
     *          target:".csBox",  需要缩放的元素。 支持 # 和 . 号
     *          dw:900,  设计稿宽度
     *          dh:1624, 设计稿高度
     *          sw:750,  缩放规则宽度
     *          sh:1200, 缩放规则高度
     *          safeW:750, 安全区的宽度
     *          safeH:1200,安全区的高度
     *          offx:null,  页面宽度偏移值 默认为 null 自动计算 (sw-dw) /2 不建议设置
     *          offy:null, 页面高度偏移值 默认为 null 自动计算 (sh-dh) /2  不建议设置
     *          scaleAutoWidth:true, 当页面宽度超出安全范围时，是否自动缩放页面，以保证页面内容完整显示
     *          scaleAutoHeight:true,当页面高度超出安全范围时，是否自动缩放页面，以保证页面内容完整显示（当宽度已经缩放时，高度不进行缩放）
     *          change:function (data) {}, 改变回调每完成一个元素的适配回调一次
     *          complete:function (data) {},完成回调 当target 所有的元素全部适配完成时 回调
     *          scale:null,整体的缩放系数。默认为 null 自动计算。不建议设置
     *          width:window.innerWidth, 页面的宽度。 自动取值，不建议设置
     *          height:window.innerHeight, 页面高度。自动取值，不建议设置
     *
     *
     * 新增：iforce-type  iforce-x  iforce-y 三个标签
     * 当 设置iforce-type 标签时，忽略 left 和 top 的位置信息，根据  iforce-x，iforce-x 重新计算元素位置。
     * 且 元素位置 依据 窗口大小 进行定位。
     *
     *
     * @example
     * 页面元素设置  宽 高 x y cs-name 等内容；
     * <div class="csBox" iforce-type="left top" iforce-x="10" iforce-y="10" width="100" height="100" left="75" top="210"></div>
     * ms.reSet({
     *      dw:900,
     *      dh:1624,
     *      sw:750,
     *      sh:1200,
     *      change:function (data) {
     *                data.target  -当前缩放元素
     *                data.Eheight  -原始高度
     *                data.Ewidth 原始宽度
     *                data.scale 缩放系数
     *                data.Eleft原始 left
     *                data.Etop 原始 top
     *                data.newWidth 新的宽度度
     *                data.newHeight 新的高度
     *                data.marginLeft 新的margin-left
     *                data.marginTop 新的margin-top
     *      },
     *      complete:function (data) {
     *        //
     *
     *        data.targets 缩放元素列表（包含缩放信息）
     *        data.default 所有的缩放设置
     *        data.param 用户设置
     *        data.autoScaleW 宽度自动缩放的信息
     *        data.autoScaleH 高度自动缩放的信息
     *      }
     *  });
     *
     */
    $$.reSet = function (param) {
        // if(!ms.jQueryOrZepto()){
        //     return;
        // }

        var _this = {};
        _this.default = {
            target: ".csBox",
            dw: 900,
            dh: 1624,
            sw: 750,
            sh: 1200,
            safeW: 750,
            safeH: 1200,
            offx: null,
            offy: null,
            offy: null,
            transformOrigin: "50%",
            rotate: 0,
            scaleAutoWidth: true,
            scaleAutoHeight: true,
            change: function (data) {
            },
            complete: function (data) {
            },
            scale: null,
            width: window.innerWidth,
            height: window.innerHeight,
        }

        _this.targets = [];
        _this.param = param || {}

        for (var key in _this.param) {
            _this.default[key] = _this.param[key]
            for (var s in _this.param[key]) {
                _this.default[key][s] = _this.param[key][s]
            }
        }


        if (_this.default.scale == null) {
            _this.default.scale = _this.default.height / _this.default.sh;
            _this.default.scale = ms.getFloat(_this.default.scale, 4);
        }


        if (_this.default.offx == null) {
            _this.default.offx = (_this.default.sw - _this.default.dw) / 2
        }

        if (_this.default.offy == null) {
            _this.default.offy = (_this.default.sh - _this.default.dh) / 2
        }


        var strOne = _this.default.target.slice(0, 1);
        if (strOne == "#") {
            console.log("使用 ID 选择器")
            var targets = document.getElementById(_this.default.target.slice(1));
        } else if (strOne == ".") {
            console.log("使用 类 选择器")
            var targets = document.getElementsByClassName(_this.default.target.slice(1));
        } else {
            console.log("默认：使用类 选择器")
            var targets = document.getElementsByClassName(_this.default.target);
        }


        var autoScaleW = {}

        if (_this.default.scaleAutoWidth == true) {
            //整体的偏移值 X
            autoScaleW.offsetX = (_this.default.width - _this.default.dw * _this.default.scale) / 2
            autoScaleW.offsetX = ms.getFloat(autoScaleW.offsetX, 4);

            //新的安全区域左侧坐标起点
            autoScaleW.safaX = (_this.default.safeW - _this.default.dw) / 2 * _this.default.scale
            autoScaleW.safaX = ms.getFloat(autoScaleW.safaX, 4)

            //安全区是否被裁剪
            autoScaleW.isX = autoScaleW.offsetX < autoScaleW.safaX;

            //修正缩放系数，保证安全区显示
            autoScaleW.reScaleW = (autoScaleW.offsetX - autoScaleW.safaX) / _this.default.width
            autoScaleW.reScaleW = ms.getFloat(autoScaleW.reScaleW, 4)
            if (autoScaleW.isX) {
                _this.default.scale += autoScaleW.reScaleW
                _this.default.scale = ms.getFloat(_this.default.scale, 4);
                console.warn("根据宽度-缩放系数重新修订：", _this.default.scale)
            }
        }


        var autoScaleH = {}

        // 如果 允许自动缩放且宽度没有进行缩放，再进行高度的检测。节省资源。
        if (autoScaleW.isX == false && _this.default.scaleAutoHeight == true) {
            autoScaleH.newHeight = parseFloat((_this.default.dh * _this.default.scale).toFixed(3));
            //整体的偏移值 Y
            autoScaleH.offsetY = (_this.default.height - _this.default.dh * _this.default.scale) / 2
            autoScaleH.offsetY = ms.getFloat(autoScaleH.offsetY, 4);
            autoScaleH.safaY = (_this.default.dh - _this.default.safeH) / 2 * _this.default.scale
            autoScaleH.safaY = ms.getFloat(autoScaleH.safaY, 4);
            autoScaleH.isY = autoScaleH.offsetY < autoScaleH.offsetY;
            //修正缩放系数，保证安全区显示
            autoScaleH.reScaleH = (autoScaleH.offsetY - autoScaleH.safaY) / _this.default.height
            autoScaleH.reScaleH = ms.getFloat(autoScaleH.reScaleH, 4);

            if (autoScaleH.isY) {
                _this.default.scale += autoScaleH.reScaleH
                console.warn("根据高度-缩放系数重新修订：", _this.default.scale)
            }
        }

        _this.autoScaleW = autoScaleW;
        _this.autoScaleH = autoScaleH;


        for (var i = 0; i < targets.length; i++) {
            // console.log(i,targets[i]);
            var ele = targets[i];

            var cb = elemScale(ele);
            _this.targets.push(cb)
            ele.style.width = cb.newWidth + "px";
            ele.style.height = cb.newHeight + "px";
            ele.style.position = "absolute";
            ele.style.marginLeft = cb.marginLeft + "px";
            ele.style.marginTop = cb.marginTop + "px";
            ele.style.transformOrigin = _this.default.transformOrigin;
            ele.style.transform = "rotate(" + _this.default.rotate + "deg)";

            _this.default.change(cb);
        }
        _this.default.complete(_this);

        //自定义 工具对象。
        function elemScale(ele) {
            var obj = {}
            obj.target = ele;

            obj.Eheight = parseFloat(ele.getAttribute("height"));
            obj.Ewidth = parseFloat(ele.getAttribute("width"));

            obj.Eleft = parseFloat(ele.getAttribute("left"));
            obj.Etop = parseFloat(ele.getAttribute("top"));

            obj.scale = _this.default.scale;
            obj.newWidth = obj.Ewidth * _this.default.scale;
            obj.newHeight = obj.Eheight * _this.default.scale;
            obj.marginLeft = (_this.default.width - _this.default.sw * _this.default.scale) / 2 + (obj.Eleft + _this.default.offx) * _this.default.scale;
            obj.marginTop = (_this.default.height - _this.default.sh * _this.default.scale) / 2 + (obj.Etop + _this.default.offy) * _this.default.scale;


            obj.Etype = ele.getAttribute("iforce-type");
            if (obj.Etype != null && obj.Etype != "") {
                //console.log("特殊配置")
                if (obj.Etype.indexOf(" ") != -1) {
                    var type = obj.Etype.split(" ");
                    obj.Tx = type[0] != null && type[0] != "" ? type[0] : null
                    obj.Ty = type[1] != null && type[1] != "" ? type[1] : null
                } else {
                    obj.Tx = obj.Etype;
                    if (obj.Etype == "center") {
                        obj.Ty = "center";
                    } else {
                        obj.Ty = "top";
                    }
                }


                //X 轴 Y轴 的距离值。

                obj.Xaxis = ele.getAttribute("iforce-x");
                obj.Yaxis = ele.getAttribute("iforce-y");


                obj.Xaxis = obj.Xaxis == null ? obj.Xaxis = 0 : obj.Xaxis.indexOf("%") != -1 ? parseInt(obj.Xaxis) / 100 * _this.default.width : parseInt(obj.Xaxis);

                obj.Yaxis = obj.Yaxis == null ? obj.Yaxis = 0 : obj.Yaxis.indexOf("%") != -1 ? parseInt(obj.Yaxis) / 100 * _this.default.height : parseInt(obj.Yaxis);


                console.log("-------------:" + obj.Xaxis, obj.Yaxis);

                //obj.Xaxis=parseInt(ele.getAttribute("iforce-x"));
                // obj.Yaxis=parseInt(ele.getAttribute("iforce-y"));


                // 值为空时 赋值为 0
                // obj.Xaxis=isNaN(obj.Xaxis) ? 0 : obj.Xaxis;
                // obj.Yaxis=isNaN(obj.Yaxis) ? 0 : obj.Yaxis;


                switch (obj.Tx) {
                    case "left":
                        obj.marginLeft = obj.Xaxis
                        break;
                    case "center":
                        obj.marginLeft = (_this.default.width - obj.newWidth) / 2 + obj.Xaxis
                        break;
                    case "right":
                        obj.marginLeft = (_this.default.width - obj.newWidth) - obj.Xaxis
                        break;
                    default:
                        obj.marginLeft = obj.Xaxis
                        break
                }
                switch (obj.Ty) {
                    case "top":
                        obj.marginTop = obj.Yaxis;
                        break;
                    case "center":
                        obj.marginTop = (_this.default.height - obj.newHeight) / 2 + obj.Yaxis;
                        break;
                    case "bottom":
                        obj.marginTop = _this.default.height - obj.newHeight - obj.Yaxis;
                        break;
                    default:
                        obj.marginTop = obj.Yaxis;
                        break;
                }
            }

            return obj;
        }
    }

    $$.reSetV = function (param) {

        // if(!ms.jQueryOrZepto()){
        //     return;
        // }

        var _this = {};
        _this.default = {
            target: ".csBox",
            dw: 900,
            dh: 1624,
            sw: 750,
            sh: 1200,
            safeW: 750,
            safeH: 1200,
            offx: null,
            offy: null,
            transformOrigin: "0px 0px 0px",
            rotate: -90,
            scaleAutoWidth: true,
            scaleAutoHeight: true,
            change: function (data) {
            },
            complete: function (data) {
            },
            scale: null,
            width: window.innerWidth,
            height: window.innerHeight
        };

        _this.targets = [];
        _this.param = param || {}

        for (var key in _this.param) {
            _this.default[key] = _this.param[key]
            for (var s in _this.param[key]) {
                _this.default[key][s] = _this.param[key][s]
            }
        }


        if (_this.default.scale == null) {
            _this.default.scale = _this.default.width / _this.default.sh;
            _this.default.scale = ms.getFloat(_this.default.scale, 4);
        }

        console.log(_this.default.scale);


        if (_this.default.offy == null) {
            _this.default.offy = (_this.default.sw - _this.default.dw) / 2
        }

        if (_this.default.offx == null) {
            _this.default.offx = (_this.default.sh - _this.default.dh) / 2
        }


        var strOne = _this.default.target.slice(0, 1);
        if (strOne == "#") {
            console.log("使用 ID 选择器")
            var targets = document.getElementById(_this.default.target.slice(1));
        } else if (strOne == ".") {
            console.log("使用 类 选择器")
            var targets = document.getElementsByClassName(_this.default.target.slice(1));
        } else {
            console.log("默认：使用类 选择器")
            var targets = document.getElementsByClassName(_this.default.target);
        }
        var autoScaleW = {}
        // 如果 允许自动缩放且进行宽度的检测。
        if (_this.default.scaleAutoWidth == true) {
            autoScaleW.newWidth = parseFloat((_this.default.dw * _this.default.scale).toFixed(3));
            //整体的偏移值 X
            autoScaleW.offsetX = (_this.default.width - _this.default.dh * _this.default.scale) / 2
            autoScaleW.offsetX = ms.getFloat(autoScaleW.offsetX, 4);
            autoScaleW.safaX = (_this.default.safeH - _this.default.dh) / 2 * _this.default.scale;

            autoScaleW.safaX = ms.getFloat(autoScaleW.safaX, 4);
            autoScaleW.isX = autoScaleW.offsetX < autoScaleW.offsetX;

            //修正缩放系数，保证安全区显示
            autoScaleW.reScaleW = (autoScaleW.offsetX - autoScaleW.safaX) / _this.default.width;
            autoScaleW.reScaleW = ms.getFloat(autoScaleW.reScaleW, 4);

            if (autoScaleW.isX) {
                _this.default.scale += autoScaleW.reScaleW;
                console.warn("根据宽度-缩放系数重新修订：", _this.default.scale)
            }
        }

        var autoScaleH = {};

        // 横屏状态下，优先根据高度（及设计稿的宽度） 进行缩放计算
        if (autoScaleW.isX == false && _this.default.scaleAutoHeight == true) {
            //整体的偏移值 Y --横屏状态下，高度相当于设计稿的宽度。因此使用 页面的高度-设计宽度
            autoScaleH.offsetY = (_this.default.height - _this.default.dw * _this.default.scale) / 2;
            autoScaleH.offsetY = ms.getFloat(autoScaleH.offsetY, 4);

            //新的安全区域顶部坐标起点
            autoScaleH.safaY = (_this.default.safeW - _this.default.dw) / 2 * _this.default.scale

            //  console.log(_this.default.safeW,_this.default.dw);

            autoScaleH.safaY = ms.getFloat(autoScaleH.safaY, 4);

            //安全区是否被裁剪
            autoScaleH.isY = autoScaleH.offsetY < autoScaleH.safaY;

            //修正缩放系数，保证安全区显示
            autoScaleH.reScaleH = (autoScaleH.offsetY - autoScaleH.safaY) / _this.default.height;

            autoScaleH.reScaleH = ms.getFloat(autoScaleH.reScaleH, 4);
            if (autoScaleH.isY) {
                _this.default.scale += autoScaleH.reScaleH;
                _this.default.scale = ms.getFloat(_this.default.scale, 4);
                console.warn("横屏-根据高度-缩放系数重新修订：", _this.default.scale)
            }
        }


        _this.autoScaleW = autoScaleW;
        _this.autoScaleH = autoScaleH;

        for (var i = 0; i < targets.length; i++) {
            // console.log(i,targets[i]);
            var ele = targets[i];

            var cb = elemScale(ele);
            _this.targets.push(cb);
            // ele.style.transformOrigin="0% 50% 0";

            ele.style.width = cb.newWidth + "px";
            ele.style.height = cb.newHeight + "px";
            ele.style.position = "absolute";
            ele.style.marginLeft = cb.marginLeft + "px";
            ele.style.marginTop = cb.marginTop + "px";
            ele.style.transformOrigin = _this.default.transformOrigin;
            ele.style.transform = "rotate(" + _this.default.rotate + "deg)";


            _this.default.change(cb);
        }
        _this.default.complete(_this);

        //自定义 工具对象。
        function elemScale(ele) {
            var obj = {}
            obj.target = ele;

            obj.Eheight = parseFloat(ele.getAttribute("height"));
            obj.Ewidth = parseFloat(ele.getAttribute("width"));

            obj.Eleft = parseFloat(ele.getAttribute("left"));
            obj.Etop = parseFloat(ele.getAttribute("top"));

            obj.scale = _this.default.scale;
            obj.newWidth = obj.Ewidth * _this.default.scale;
            obj.newHeight = obj.Eheight * _this.default.scale;

            obj.Etype = ele.getAttribute("iforce-type");
            if (obj.Etype != null && obj.Etype != "") {
                //console.log("特殊配置")
                if (obj.Etype.indexOf(" ") != -1) {
                    var type = obj.Etype.split(" ");
                    obj.Tx = type[0] != null && type[0] != "" ? type[0] : null
                    obj.Ty = type[1] != null && type[1] != "" ? type[1] : null
                } else {
                    obj.Tx = obj.Etype;
                    if (obj.Etype == "center") {
                        obj.Ty = "center";
                    } else {
                        obj.Ty = "top";
                    }
                }


                //X 轴 Y轴 的距离值。
                obj.Xaxis = parseInt(ele.getAttribute("iforce-y"));
                obj.Yaxis = parseInt(ele.getAttribute("iforce-x"));


                // 值为空时 赋值为 0
                obj.Xaxis = isNaN(obj.Xaxis) ? 0 : obj.Xaxis;
                obj.Yaxis = isNaN(obj.Yaxis) ? 0 : obj.Yaxis;


                switch (obj.Tx) {
                    case "left":
                        obj.marginLeft = obj.Xaxis;
                        break;
                    case "center":
                        obj.marginLeft = (_this.default.width - obj.newWidth) / 2 + obj.Xaxis;
                        break;
                    case "right":
                        obj.marginLeft = (_this.default.width - obj.newWidth) - obj.Xaxis;
                        break;
                    default:
                        obj.marginLeft = obj.Xaxis;
                        break
                }
                switch (obj.Ty) {
                    case "top":
                        obj.marginTop = obj.Yaxis;
                        break;
                    case "center":
                        obj.marginTop = (_this.default.height - obj.newHeight) / 2 + obj.Yaxis;
                        break;
                    case "bottom":
                        obj.marginTop = _this.default.height - obj.newHeight - obj.Yaxis;
                        break;
                    default:
                        obj.marginTop = obj.Yaxis;
                        break;
                }
                //旋转后，修正50%的高度值
                obj.marginTop = obj.marginTop + obj.newHeight;
            } else {
                obj.marginTop = (_this.default.height - _this.default.sw * _this.default.scale) / 2 + (obj.Eleft + _this.default.offy) * _this.default.scale;
                //横屏后，left 变为 top 值，但横屏后 top ，计算起点为底部，因此需要使用页面高度减去当前的top值作为新的top值;
                obj.marginTop = _this.default.height - obj.marginTop;
                obj.marginLeft = (_this.default.width - _this.default.sh * _this.default.scale) / 2 + (obj.Etop + _this.default.offx) * _this.default.scale;


            }


            return obj;
        }
    }
    /**
     * 横屏事件，带回调
     * @param cb Function 回调函数
     * @param time Number 默认 400 回调时间毫秒 ，横屏事件会有400ms左右的延迟，第一次立即回调，第二次开始使用延迟时间
     */
    $$.orientation = function (cb, time) {
        var _this = {};
        _this.currnum = 0;
        _this.time = isNaN(Number(time)) ? 400 : time;

        var supportOrientation = (typeof window.orientation === 'number' &&
            typeof window.onorientationchange === 'object');
        var htmlNode = document.body.parentNode,
            orientation;

        var updateOrientation = function () {
            if (supportOrientation) {
                _this.event = "orientationchange";
                orientation = window.orientation;
                switch (orientation) {
                    case 90:
                    case -90:
                        orientation = 'landscape';
                        break;
                    default:
                        orientation = 'portrait';
                        break;
                }
            } else {
                orientation = (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait';
                _this.event = "resize";
            }

            htmlNode.setAttribute('class', orientation);
            _this.orientation = orientation;
            _this.status = orientation == "landscape" ? 0 : 1;
            _this.msg = orientation == "landscape" ? "横" : "竖";

            if (cb != null) {
                var _time = _this.time;
                if (_this.currnum == 0) {
                    _time = 10;
                }
                setTimeout(function () {
                    _this.currnum++;
                    cb(_this);
                }, _time);
            }
        };


        if (supportOrientation) {
            window.addEventListener('orientationchange', updateOrientation, false);
        } else {
            //监听resize事件
            window.addEventListener('resize', updateOrientation, false);
        }
        updateOrientation();

    };

    /**------------------------------------------------字符串操作*/

    /**
     * 取出中间文本
     *    @since  1.0.1
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
    $$.getStrCenter = function (str, start, end) {
        var s1, s2;
        s1 = str.indexOf(start);
        s2 = str.indexOf(end);
        return str.substring(s1 + 1, s2);
    }

    /**------------------------------------------------数组操作*/

    /**
     * 判断是否为数组
     *    @since  1.0.1
     * @param {Obj} 判断的对象
     * @return {Boolean}
     *  @example
     *  <p>    obj = [1,2,3]
     *  <p>    obj = false
     *  <p>    obj = "sdklf"
     */
    $$.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    /**
     *  取元素在数组中的位置
     *    @since  1.0.1
     * @param {Array} 数组
     * @param {String} 元素
     * @return {*} 不存在返回  -1
     * @return {Number} 存在返回 元素所在的位置
     * @example
     * <p>  arr= [1,2,3,56,2,16,2,18,21,23,12],str = "18" 返回18在数组中是第几个
     */
    $$.arrIndexOf = function (arr, str) {
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
     *    @since  1.0.1
     * @param {Number} Min  最小值
     * @param {Number} Max  最大值
     * @return {Number} 返回随机数值
     * @example
     * <p>  Min = 1,Max = 25 返回值为1-25之间的随机数字
     */
    $$.rand = function (Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    }

    /**------------------------------------------------时间日期操作*/

    /**
     *    @since  1.0.1
     * @description 返回当前日期时间的文本格式
     * @param type  数字  1：日期 、2： 时间 、其他：日期时间
     *          格式 1：2016-09-21
     *          格式 2：13:51:43
     *          其他   ：2016-09-21 13:51:39
     * @returns {*} 返回时间格式
     */

    $$.getNowFormatDate=function (type,date) {
        if(!date){
            date=new Date();
        }
        var seperator1 = "-";
        var seperator2 = ":";
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString();
        var strDate = date.getDate().toString();
        var hours =date.getHours().toString()
        var minutes =date.getMinutes().toString()
        var sconds =date.getSeconds().toString()


        month=month.length==1 ? "0"+month :month;
        strDate=strDate.length==1 ? "0"+strDate :strDate;

        hours=hours.length==1 ? "0"+hours :hours;
        minutes=minutes.length==1 ? "0"+minutes :minutes;
        sconds=sconds.length==1 ? "0"+sconds :+sconds;

        var currentdate;
        if (type == 1) {
            currentdate = year + seperator1 + month + seperator1 + strDate
        } else if (type == 2) {
            currentdate = hours + seperator2 + minutes + seperator2 + sconds;
        } else {
            currentdate = year + seperator1 + month + seperator1 + strDate + " " + hours + seperator2 + minutes + seperator2 + sconds;
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
    $$.isEmail = function (str) {
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
    $$.isName = function (name) {
        if (name != "" || name.search(/^[\u0391-\uFFE5\w]+$/) != -1) {
            return true;
        }
        return false;
    }

    /**
     * 验证是否是手机号
     * @since  1.0.1
     * @param  {String} 手机号的字符串。
     * @returns {Boolean}
     * @example
     * <p>    str = 18801333342
     */
    $$.isPhone = function (str) {
        var pattern = /^1[3456789]\d{9}$/;
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
    $$.browser = function () {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) == " qq",//是否QQ
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
    $$.isPC = function () {
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
    $$.getALL = function () {
        var querystr = window.location.href.split("?");
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
    $$.getArg = function (name) {
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
    $$.setCookie = function (name, value) {
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
    $$.getCookie = function (name) {
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
    $$.delCookie = function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = ms.getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    }


    ms.M.prototype = M.prototype = $$.fn;
    $$.ms = ms;
    return $$;
    // console.log("msTools:"+ms.version);
})();
window.ms = ms
window.$$ === undefined && (window.$$ = ms)