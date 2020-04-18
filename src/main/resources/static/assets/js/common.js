var basePath = $("#basePath").val();
var jumpPageLayerNum = null;
var authoriryJump = "jump/authority";
var noAuthorityJump = "jump/simple";
//直接跳转页面
function jumpPageNoAjax(pageUrl) {
    location.href = basePath + pageUrl;
}
function jumpPageNoAuthorityForHandler(pageUrl, jq_container, excuteFUN) {
    // /
    var param = {
        paramurl: basePath + noAuthorityJump,
        paramdata: {
            pageUrl: pageUrl
        },
        dataType: 'html',
        callbackFun: function (data) {
            var dataobj = isJson(data);
            if (dataobj) {// 是json格式
                if (dataobj.errorCode != 0) {
                    layerWindow('error.jsp?errorMsg='+dataobj.errorMsg,"",592,350,2);
                    return false;
                }
            }
            excuteFUN();
            jq_container.empty().html(data);
        }
    };
    ajaxRun(param);
    // //
}
// 不需要权限跳转
function jumpPageNoAuthority(pageUrl, jq_container) {
    // /
    var param = {
        paramurl: basePath + noAuthorityJump,
        paramdata: {
            pageUrl: pageUrl
        },
        dataType: 'html',
        callbackFun: function (data) {
            var dataobj = isJson(data);
            if (dataobj) {// 是json格式
                if (dataobj.errorCode != 0) {
                    layerWindow('error.jsp?errorMsg='+dataobj.errorMsg,"",592,350,2);
                    return false;
                }
            }
            jq_container.empty().html(data);
        }
    };
    ajaxRun(param);
    // //
}
// 跳转页面需要权限
function jumpPage(pageUrl, jq_container) {
    // /
    var param = {
        paramurl: basePath + authoriryJump,
        paramdata: {
            pageUrl: pageUrl
        },
        dataType: 'html',
        callbackFun: function (data) {
            var dataobj = isJson(data);
            if (dataobj) {// 是json格式
                if (dataobj.errorCode != 0) {
                    layerWindow('error.jsp?errorMsg='+dataobj.errorMsg,"",592,350,2);
                    return false;
                }
            }
            jq_container.empty().html(data);
        }
    };
    ajaxRun(param);
    // //
}
// 弹出窗口
function layerWindow(pageUrl, title, width, height, frame) {
    var type = 1;
    if (frame) {
        type = 2;
    }
    if (type == 2) {
        jumpPageLayerNum = layer.open({
            type: type,
            title: title,
            skin: 'layui-layer-rim', // 加上边框
            area: [width + 'px', height + 'px'], // 宽高
            content: basePath+pageUrl,
            success: function (index, layero) {
                // do something
                // layer.close(index); // 如果设定了yes回调，需进行手工关闭
                // layer.close(ii);
            }
        });
        return false;
    }
    var param = {
        paramurl: basePath + noAuthorityJump,
        paramdata: {
            pageUrl: pageUrl
        },
        dataType: 'html',
        callbackFun: function (data) {
            var dataobj = isJson(data);
            if (dataobj) {// 是json格式
                if (dataobj.errorCode != 0) {
                    layerWindow('error.jsp?errorMsg='+dataobj.errorMsg,"",592,350,2);
                    return false;
                }
            }
            jumpPageLayerNum = layer.open({
                type: type,
                title: title,
                skin: 'layui-layer-rim', // 加上边框
                area: [width + 'px', height + 'px'], // 宽高
                content: data,
                success: function (index, layero) {
                    // do something
                    // layer.close(index); // 如果设定了yes回调，需进行手工关闭
                    // layer.close(ii);
                }
            });
        }
    };
    ajaxRun(param);
    // /////////////////////////
}
function cloaseLayerWindow() {
    layer.close(jumpPageLayerNum);
}
// /////让form ajax提交
////validateState验证参数
/////validateFun  外部执行函数，用于处理完成后执行其他操作
function initAjaxForm(jq_form, jq_button, excuteResponse, validateState, validateFun) {
    var actionVal=jq_form.attr("action");
    if(!actionVal){
        //layer.alert("表单action属性不能为空！");
        return false;
    }
    // 禁止回车提交
    jq_form.submit(function () {
        return false;
    });
    var zzcid = null;

    function showResponse(data) {
        if (data.errorCode && data.errorCode != 0) {
            layer.close(zzcid);
            layer.close(options.zzcid);
            layer.alert(data.errorMsg);
            return false;
        } else {
            excuteResponse(data);
            layer.close(zzcid);
            layer.close(options.zzcid);
            if($("#jumpPageLayerNumKeepAliveID").val()==1){

            }else{
                layer.close(jumpPageLayerNum);
            }
        }
    }

    function showRequest() {
        if (validateState) {
            var flag = true;
            $("[required]").each(function () {
                var jq_this = $(this);
                if (jq_this.is("textarea")) {
                    if (jq_this.val()) {
                        flag = true;
                    } else {
                        handlerError(jq_this);
                        flag = false;
                        return false;
                    }
                }
                if (jq_this.is("input[type=text]")) {
                    if (jq_this.val()) {
                        flag = true;
                    } else {
                        handlerError(jq_this);
                        flag = false;
                        return false;
                    }
                }
                if (jq_this.is("input[type=password]")) {
                    if (jq_this.val()) {
                        flag = true;
                    } else {
                        handlerError(jq_this);
                        flag = false;
                        return false;
                    }
                }
            });
            return flag;
        }
        return true;
    }

    function formSubError(errorData) {
        layer.close(zzcid);
        layer.close(options.zzcid);
        if($("#jumpPageLayerNumKeepAliveID").val()==1){

        }else{
            layer.close(jumpPageLayerNum);
        }
        layer.alert("服务器出错！");
    }

    var options = {
        // target : '#mydiv', // 需要刷新的区域
        beforeSubmit: showRequest, // 提交前调用的方法
        success: showResponse, // 成功回调方法
        error: formSubError
        // 提交form失败调用的函数

        // other available options:
        // url : 'test/testTransaction', // 提交的URL, 默认使用FORM ACTION
        // type: type // 'get' or 'post', override for form's 'method' attribute
        // dataType : 'json' // 'xml', 'script', or 'json' (expected server
        // response type)
        // clearForm: true // 是否清空form
        // resetForm: true // 是否重置form

        // $.ajax options can be used here too, for example:
        // timeout: 3000
    };
    jq_button.unbind('click').click(function (event) {
        if (validateFun) {
            validateFun(jq_form, options);
        } else {
            zzcid = layer.load(0, {
                shade: [0.8, '#fff']
                // 0.1透明度的白色背景
            });
            jq_form.ajaxSubmit(options);
        }
        event.stopPropagation();
        return false;
    });
    function handlerError(jqobj) {
        layer.close(zzcid);
        layer.close(options.zzcid);
        if($("#jumpPageLayerNumKeepAliveID").val()==1){

        }else{
            layer.close(jumpPageLayerNum);
        }
        layer.alert(jqobj.attr("errInfo"));
    }
}
// //////////////////////////////////显示图片
function initDisplayImg(inputFileID, imageDIVID) {
    var input = document.getElementById(inputFileID); // 获取选择图片的input元素
    var imgdiv = document.getElementById(imageDIVID); // 获取显示图片的div元素
    // 这边是判断本浏览器是否支持这个API。
    if (typeof FileReader === 'undefined') {
        imgdiv.innerHTML = "抱歉，你的浏览器不支持 FileReader";
        input.setAttribute('disabled', 'disabled');
    } else {
        input.addEventListener('change', readFile, false); // 如果支持就监听改变事件，一旦改变了就运行readFile函数。
    }
    function readFile() {
        var file = this.files[0]; // 获取file对象
        // 判断file的类型是不是图片类型。
        if (!/image\/\w+/.test(file.type)) {
            alert("文件必须为图片！");
            return false;
        }
        var reader = new FileReader(); // 声明一个FileReader实例
        reader.readAsDataURL(file); // 调用readAsDataURL方法来读取选中的图像文件
        // 最后在onload事件中，获取到成功读取的文件内容，并以插入一个img节点的方式显示选中的图片
        reader.onload = function (e) {
            imgdiv.innerHTML = '<img src="' + this.result
                + '" alt="" style="width: 200px;height: 200px;"/>'
        }
    }
}
//初始化表格
function initTable(jq_ThisContent, jq_Table) {
    if (jq_Table) {
        // 隔行换色
        jq_Table.find("tr:odd").css("background-color", "#eeeeee");
        jq_Table.find("tr:even").css("background-color", "#ffffff");
        // 鼠标经过颜色变换
        jq_Table.find("tr").bind("mouseover", function () {
            var jq_this = $(this);
            var oldColor = jq_this.css("background-color");
            jq_this.attr("oldcolor", oldColor);
            jq_this.css("background-color", "#BCD2EE");
        });
        jq_Table.find("tr").bind("mouseout", function () {
            var oldColor = $(this).attr("oldcolor");
            $(this).css("background-color", oldColor);
        });
    } else {
        // 隔行换色
        $("tr:odd").css("background-color", "#eeeeee");
        $("tr:even").css("background-color", "#ffffff");
        // 鼠标经过颜色变换
        $("tr").bind("mouseover", function () {
            var jq_this = $(this);
            var oldColor = jq_this.css("background-color");
            jq_this.attr("oldcolor", oldColor);
            jq_this.css("background-color", "#BCD2EE");
        });
        $("tr").bind("mouseout", function () {
            var oldColor = $(this).attr("oldcolor");
            $(this).css("background-color", oldColor);
        });
    }
    // ///初始化ajax连接    start
    $("[ajaxLayerWindow]").click(function () {
        var href = $(this).attr("href");
        var title = $(this).attr("title");
        var width = $(this).attr("width");
        var height = $(this).attr("height");
        href = getURLByParams(href, $(this));
        layerWindow(href, title, width, height);
        return false;
    });
    // ///
    $("[ajaxdel]").click(function () {
        var hrefurl = $(this).attr("href");
        layer.confirm('确定删除吗？', {
            btn: ['确定']
            // 按钮
        }, function (index) {
            jumpPageNoAuthority(hrefurl, jq_ThisContent);
            layer.close(index)
        });
        return false;
    });
    // /// 连接当前主页面打开
    $("[ajaxthispage]").click(function () {
        var href = $(this).attr("href");
        href = getURLByParams(href, $(this));
        jumpPageNoAuthority(href, jq_ThisContent);
        return false;
    });
    // /// 连接当前主页面打开，附带标题
    $("[ajaxthispage_title]").click(function () {
        var href = $(this).attr("href");
        var titleVal = $(this).attr("title");
        $("#titleID").text(titleVal);
        href = getURLByParams(href, $(this));
        jumpPageNoAuthority(href, jq_ThisContent);
        return false;
    });
    // ///初始化ajax连接    end
}
function initSelect() {
    var jq_selects = $("select");
    jq_selects.each(function () {
        var jq_select = $(this);
        var name = jq_select.attr("name");
        var ajaxURL = jq_select.attr("ajaxURL");
        var jq_select_inputVal = $("#" + name + "_input").val();
        // /
        var param = {
            paramurl: ajaxURL,
            paramdata: null,
            dataType: 'json',
            callbackFun: function (data) {
                if (data.errorCode != 0) {
                    layerWindow('error.jsp?errorMsg='+dataobj.errorMsg,"",592,350,2);
                    return false;
                }
                var list = data.data.list;
                var jq_opt = $("<option></option>");
                jq_opt.val('');
                jq_opt.text('---请选择---');
                jq_select.append(jq_opt);
                for (var i = 0; i < list.length; i++) {
                    var obj = list[i];
                    var jq_opt = $("<option></option>");
                    jq_opt.val(obj.id);
                    jq_opt.text(obj.name);
                    jq_select.append(jq_opt);
                }
                if (jq_select_inputVal) { // 赋值操作
                    jq_select.val(jq_select_inputVal);
                }
            }
        };
        ajaxRun(param);
        // //
    });
}
// 是否是json，是的话返回json对象
function isJson(data) {
    if (typeof (data) == 'object') {
        return data;
    }
    try {
        var jsonObj = jQuery.parseJSON(data);
        return jsonObj;
    } catch (e) {
        // alert(e.message);
        return null;
    }
    return null;
}
// ajax方式请求
function ajaxRun(param) {
    var ii = layer.load(0, {
        shade: [0.8, '#fff']
        // 0.1透明度的白色背景
    });
    var paramurl = param.paramurl;
    var paramdata = param.paramdata;
    var callbackFun = param.callbackFun;
    var serverDataType = param.serverDataType;
    // /////////////////////////
    var request = $.ajax({
        url: paramurl,
        data: paramdata,
        method: "POST",
        dataType: serverDataType,
        statusCode: {
            404: function () {
                layer.alert("无此页面");
            },
            500: function (error) {
                layer.open({
                    type: 1,
                    title: '错误页面',
                    skin: 'layui-layer-rim', // 加上边框
                    area: ['1000px', '500px'], // 宽高
                    content: error.responseText,
                    success: function (index, layero) {
                        // do something
                        // layer.close(index); // 如果设定了yes回调，需进行手工关闭
                        // layer.close(ii);
                    }
                });
            }
        }
    });
    request.done(function (data) {
        callbackFun(data);
        layer.close(ii);
    });
    request.fail(function (jqXHR, textStatus) {
        //layer.alert("Request failed: " + textStatus);
        layer.close(ii);
    });
    // ///////////////
}
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
Date.prototype.format = function (fmt) { // author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 // 月份
        "d+": this.getDate(),                    // 日
        "h+": this.getHours(),                   // 小时
        "m+": this.getMinutes(),                 // 分
        "s+": this.getSeconds(),                 // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds()             // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
function fmtDateByHaomiao(haomiao) {
    var myDate = new Date();
    myDate.setTime(haomiao);
    return myDate.format("yyyy-MM-dd");
}
//初始化默认选中
function initSetData() {
    var vals = $("[id^=hiddenval_]");
    vals.each(function () {
        var jq_this = $(this);
        var id = jq_this.attr("id").split("_")[1];
        var jq_setModel = $("[name=" + id + "]");
        var firstModle = $(jq_setModel[0]);
        var setVal = jq_this.val();
        if (setVal) {
            if (firstModle.is("select")) {
                firstModle.val(setVal);
            } else if (firstModle.attr("type") == 'radio') {
                var setRadio = $("[name=" + id + "][value=" + setVal + "]");
                if (setRadio.length != 0) {
                    setRadio.prop('checked', true);
                }
            } else {
                layer.alert('未知类型')
            }
        }
    });
}
//获取带有参数的连接
function getURLByParams(href, jqObj) {
    var paramStr = "";
    var searFormID = jqObj.attr("searFormID");
    if (searFormID) {
        var formSerialize = $("#" + searFormID).serialize();
        paramStr = formSerialize;
    }
    var pageNum = jqObj.attr("pageNumParam");
    if (pageNum) {
        if (paramStr.length != 0) {
            paramStr = paramStr + "&pageNumParam=" + pageNum;
        } else {
            paramStr = "pageNumParam=" + pageNum;
        }
    }
    if (paramStr.length != 0) {
        if (href.indexOf('?') == -1) {
            //不包含？
            href = href + "?" + paramStr;
        } else {
            href = href + "&" + paramStr;
        }
    }
    return href;
}

function initBackBt(jq_bt, jq_content) {
    jq_bt.click(function () {
        var url = $(this).attr("href");
        if (url) {
            url = getURLByParams(url, $(this));
            jumpPageNoAuthority(url, jq_content);
        } else {
            layer.alert("href值为空！");
        }
        return false;
    });
}
function isPhone(phone){
    var regExp =/^1\d{10}$/;
    return regExp.test(phone);
}

