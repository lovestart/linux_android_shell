let lottieEle = document.getElementById('lottie');

var fileName = ""; // json文件名
var animation = ""; // 动画对象

function OnToggle() {
    lottie.togglePause();
    // lottie.play();
    // lottie.pause();
}

function gotoFrame() {
    if (animation == "") {
        return;
    }
    var targetFrame = parseInt(document.getElementById("targetFrame").value);
    lottie.goToAndStop(targetFrame, true);
}

var c_width=$(lottieEle).width();
var c_height=$(lottieEle).height();


$("#lottie").after('<div style="position: absolute;font-size:14px;right: 16px;bottom: 16px;z-index: 9;text-align: center;background-color: #f2f2f2;border-radius: 5px;border: solid 1px #aaa;user-select: none;">' +
    '<span id="scale_min" style="display: inline-block;padding: 2px 4px;border-right: solid 1px #aaa;cursor: pointer;">－</span>' +
    '<input id="scale_val" style="display: inline-block;padding: 2px 4px;background-color: #fff;border: none;width: 52px;text-align: center;" />' +
    '<span id="scale_max" style="display: inline-block;padding: 2px 4px;border-left: solid 1px #aaa;cursor: pointer;">＋</span>' +
    '</div>');
$("#lottie").after('<span style="position: absolute;left: 16px;bottom: 12px;z-index: 9;font-size: 9px;color: #999" >文件可拖动到此区域</span>');

function set_lotti_obj(result,filesize,fileName) {
    // e.target.result = "data:application/json;base64,[base64字符]""
    var base64String = result.slice(29);
    var jsonData = JSON.parse(atob(base64String));

    // 检查是否为lottie文件
    // 属性w，表示动画的宽度（w）
    if (!jsonData.hasOwnProperty("w")) {
        msgError("此文件不是lottie动画文件！");
        return;
    }

    // 检查是否包含外置图片
    // 包含外置图片并不会导致动画加载失败，只是会显示不正常
    if (jsonData.hasOwnProperty("assets")) {
        for (var assObj of jsonData["assets"]) {
            if (assObj.hasOwnProperty("e") && assObj["e"] == 0 && !assObj["p"].startsWith("http") ) {
                msgError("检查动画有加载外置图片资源，本工具暂时不支持，动画显示可能不正确！")
            }
        }
    }


    // 加载动画
    animation = lottie.loadAnimation({
        container: lottieEle,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: result
    });


    // 绘制动画
    animation.addEventListener('drawnFrame', function () {
        //frameInfoEle.innerText = Math.floor(animation.currentFrame) + "/" + animation.totalFrames;

        $("#play_btn").text('播放/暂停 （'+Math.floor(animation.currentFrame) + "/" + animation.totalFrames+"）");

        $("#progress-bar").val(animation.currentFrame);

    });

    // 加载失败
    animation.addEventListener('data_failed', function () {
        msgError("数据加载失败！");
    });


    // 动画资源加载完成
    animation.addEventListener('data_ready', function () {


        if(isNaN(animation.totalFrames))
        {
            msgError('抱歉，无法正确读取该文件的帧数信息');
        }



        // 显示动画信息
        var infoArr = [
            "<b>基本信息</b>",
            "宽度：" + animation.animationData.w + " px",
            "高度：" + animation.animationData.h + " px",
            "帧率：" + animation.frameRate.toFixed(2) + " 帧/秒",
            "总帧数：" + animation.totalFrames + " 帧",
            "版本：" + animation.animationData.v,
            "文件大小：" + formatFileSize(filesize),
            "文件名称：" + fileName
        ];



        document.getElementById("info").innerHTML = infoArr.join("<br>");
        document.getElementById("targetFrame").value = 1;
        document.getElementById("targetFrame").max = animation.animationData.op;

        $("#progress-bar").attr("max",animation.totalFrames);


        //按animation宽高自动缩放lottieEle高度和宽度



        // 获取容器的宽度和高度
        const containerWidth = c_width;
        const containerHeight = c_height;

        // 获取图像的原始宽度和高度
        const originalWidth = animation.animationData.w;
        const originalHeight = animation.animationData.h;

        // 计算宽度和高度的比例
        const widthRatio = containerWidth / originalWidth;
        const heightRatio = containerHeight / originalHeight;

        // 选择较小的比例来确保图像适应容器
        var  scaleFactor1 = Math.min(widthRatio, heightRatio);
        scaleFactor1=scaleFactor1.toFixed(3);
        var scaleFactor=scaleFactor1;
        if(scaleFactor>1.0)
        {
            scaleFactor=1.0;
        }

        if(scaleFactor<0.1)
            scaleFactor=0.1;
        if(scaleFactor>10)
            scaleFactor=10;

        scaleFactor=Math.round(scaleFactor * 100) / 100;

        //$("#scale-bar").attr("min",scaleFactor*0.5);

        $("#scale_val").val(scaleFactor*100);

        //console.log(scaleFactor);

        /*
        if(scaleFactor1>1)
        {
            $("#scale-bar").attr("max",scaleFactor1);
        }
        else
        {
            $("#scale-bar").attr("max",1);
        }
        */

        //$("#scale-bar-s").text((scaleFactor*100).toFixed()+"%");

        // 计算新的宽度和高度，保持纵横比
        const newWidth = originalWidth * scaleFactor;
        const newHeight = originalHeight * scaleFactor;

        // 设置图像的新宽度和高度
        $("#lottie>svg").css({
            width: newWidth,
            height: newHeight,
            marginLeft :  (c_width - newWidth) / 2,
            marginTop : (c_height - newHeight) / 2,
        });

        const color = $("#getVHex").val();
        if(isValidColor(color))
        {
            $("#lottie>svg").css({'background-color':color});
        }


    });
}


// 加载json文件
function loadJson(event,file_drag) {

    if(event===null)
    {
        var file=file_drag;
    }
    else
    {
        var input = event.target;
        var file = input.files[0];
    }


    // 重置界面
    fileName = "";
    animation = "";
    document.getElementById("info").innerHTML = "";
    //var frameInfoEle = document.getElementById("maxFrames");
    //frameInfoEle.innerHTML = "";
    try{
        lottie.destroy();
    }
    catch (e) {
        console.log(e);
    }

    if (file) {
        var reader = new FileReader();
        fileName = file.name.split('.')[0];
        reader.onload = function (e) {


            set_lotti_obj(e.target.result,file.size,fileName); 



        }
        reader.readAsDataURL(file);
    }
}


function fdbl(){
    var scaleFactor=parseInt($("#scale_val").val())*0.01;

    if(scaleFactor<0.1)
        scaleFactor=0.1;
    if(scaleFactor>10)
        scaleFactor=10;

    // 计算新的宽度和高度，保持纵横比
    const newWidth = animation.animationData.w * scaleFactor;
    const newHeight = animation.animationData.h * scaleFactor;
    // 设置图像的新宽度和高度
    $("#lottie>svg").css({
        width: newWidth,
        height: newHeight,
        marginLeft :  (c_width - newWidth) / 2,
        marginTop : (c_height - newHeight) / 2,
    });
}

$("#scale_val")[0].addEventListener('change', function() {
    var scaleFactor=parseInt($("#scale_val").val());
    if(scaleFactor<10)
        scaleFactor=10;
    if(scaleFactor>1000)
        scaleFactor=1000;
    $("#scale_val").val(parseInt(scaleFactor));
    fdbl();
});

$("#scale_min")[0].addEventListener('click', function() {
    var scaleFactor=parseInt($("#scale_val").val());
    scaleFactor-=10;
    if(scaleFactor<10)
        scaleFactor=10;
    if(scaleFactor>1000)
        scaleFactor=1000;
    $("#scale_val").val(parseInt(scaleFactor));
    fdbl();
});

$("#scale_max")[0].addEventListener('click', function() {
    var scaleFactor=parseInt($("#scale_val").val());
    scaleFactor+=10;
    if(scaleFactor<10)
        scaleFactor=10;
    if(scaleFactor>1000)
        scaleFactor=1000;
    $("#scale_val").val(parseInt(scaleFactor));
    fdbl();
});


/*
$("#scale-bar")[0].addEventListener('input', function() {
    var scaleFactor=$("#scale-bar").val();
    // 计算新的宽度和高度，保持纵横比
    const newWidth = animation.animationData.w * scaleFactor;
    const newHeight = animation.animationData.h * scaleFactor;
    // 设置图像的新宽度和高度
    $("#lottie>svg").css({
        width: newWidth,
        height: newHeight,
        marginLeft :  (c_width - newWidth) / 2,
        marginTop : (c_height - newHeight) / 2,
    });
    $("#scale-bar-s").text((scaleFactor*100).toFixed()+"%");
});
*/


var svg_attr = {
    "width": "",
    "height": "",
    "margin-left": "",
    "margin-top": "",
    "background-color": "",
}

function svg_clq(svgElement)
{
    $.each(svg_attr, function (key, value) {
        svg_attr[key] = $(svgElement).css(key);
        $(svgElement).css(key,"")
    });
}


function svg_clh(svgElement)
{
    $.each(svg_attr, function (key, value) {
        $(svgElement).css(key,value);
    });
}

// 保存svg
function saveSVG() {
    var svgElement = $(lottieEle).find('svg')[0];
    if (svgElement === null) {
        msgError('处理错误：空对象');
        return;
    }

    svg_clq(svgElement);

    var svgData = new XMLSerializer().serializeToString(svgElement);

    var downloadLink = document.createElement("a");
    downloadLink.href = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
    downloadLink.download = fileName + "-" + Math.floor(animation.currentFrame).toString().padStart(3, '0') + ".svg";
    downloadLink.click();

    svg_clh(svgElement);

}

// 保存png
function savePNG() {
    var svgElement = $(lottieEle).find('svg')[0];
    //console.log(svgElement);
    if (svgElement === null) {
        msgError('处理错误：空对象');
        return;
    }

    svg_clq(svgElement);


    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    var img = new Image();

    // 将 SVG 转换为 Data URL
    var svgData = new XMLSerializer().serializeToString(svgElement);
    var svgUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);

    // 创建一个 Image 元素，并在加载完成后绘制到 Canvas 上
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        // 将 Canvas 转换为 Data URL
        var pngUrl = canvas.toDataURL("image/png");

        // 创建一个下载链接，并触发点击事件下载 PNG 图像
        var downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = fileName + "-" + Math.floor(animation.currentFrame).toString().padStart(3, '0') + ".png";
        downloadLink.click();

        svg_clh(svgElement);


    };
    img.src = svgUrl;
    //console.log(img);
}

function formatFileSize(fileSize) {
    if (fileSize < 1024) {
        return fileSize + ' bytes';
    } else if (fileSize < 1024 * 1024) {
        return (fileSize / 1024).toFixed(2) + ' KB';
    } else if (fileSize < 1024 * 1024 * 1024) {
        return (fileSize / (1024 * 1024)).toFixed(2) + ' MB';
    } else {
        return (fileSize / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
    }
}



const progressBar = document.getElementById('progress-bar');
const progressValue = document.getElementById('progress-value');

// 更新进度显示
progressBar.addEventListener('input', function() {
    const value = progressBar.value;

    $("#targetFrame").val(value);
    gotoFrame();


});

function isValidColor(color) {
    var s = "#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?"; // 匹配可选的透明度部分
    if(color.length !== 7 && color.length !== 9) // 颜色长度可以是7（没有透明度）或者9（带有透明度）
        return false;
    return color.match(new RegExp(s)) !== null;
}

$("#getVHex").change(function(){

    const color = $(this).val();

    if(!isValidColor(color))
    {
        msgError('不正确的颜色格式，示例: #dddddd');
        $("#colorpk").css({'background-color':'unset'});
        //$("#lottie").css({'cssText':'background-image:linear-gradient(45deg,#eee 25%,transparent 25%,transparent 75%,#eee 75%,#eee 100%),linear-gradient(45deg,#eee 25%,#fff 25%,#fff 75%,#eee 75%,#eee 100%)!important'});
        $("#lottie>svg").css({'background-color':'none'});
        $("#getVHex").val('');
        return;
    }

    $("#colorpk").css({'background-color':color});
    //$("#lottie").css({'cssText':'background-image:none  !important'});
    $("#lottie>svg").css({'background-color':color});

})






// 获取拖放区域的引用
var dropZone = document.getElementById('lottie');

// 添加拖放事件监听器
dropZone.addEventListener('dragover', function (e) {
    e.preventDefault(); // 阻止默认行为，使浏览器接受拖放操作
    dropZone.style.border = '2px dashed #ff0000'; // 可视化提示
});

dropZone.addEventListener('dragleave', function () {
    dropZone.style.border = 'none'; // 恢复默认样式
});

dropZone.addEventListener('drop', function (e) {
    e.preventDefault(); // 阻止默认行为，防止浏览器打开文件

    // 恢复默认样式
    dropZone.style.border = 'none';

    // 获取拖放的文件
    var files = e.dataTransfer.files;

    if(files.length>1)
    {
        msgError('拖入了多个文件，只处理第一个文件');
    }

    loadJson(null,files[0]);

});


$("#lottie_demo").click(function(){
    // 发起Ajax请求
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/static/bejson/lottie/lottie_demo.json', true); // 将'your-file-url'替换为文件URL
    xhr.responseType = 'blob'; // 设置返回类型为blob，以便获取二进制文件数据
    xhr.onload = function(event) {
        if (xhr.status === 200) {
            // 获取二进制文件数据
            var blob = xhr.response;

            // 创建FileReader对象
            var reader = new FileReader();

            // 定义文件加载完成后执行的回调函数
            reader.onload = function(e) {
                var result="data:application/json;base64,"+btoa(e.target.result);

                set_lotti_obj(result,25059,'demo');
            };

            // 读取文件数据
            reader.readAsText(blob);
        } else {
            console.error('请求文件失败');
        }
    };
    xhr.send();
})