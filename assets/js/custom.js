var _hmt = _hmt || [];
(function () {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?19d1992f36a0a1272d7bf51277fb4fb0";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

function runtime() {
    let startTime = new Date('2021-1-3');
    let endTime = new Date();
    let usedTime = endTime - startTime;
    let days = Math.floor(usedTime / (24 * 3600 * 1000));
    let leavel = usedTime % (24 * 3600 * 1000);
    let hours = Math.floor(leavel / (3600 * 1000));
    let leavel2 = leavel % (3600 * 1000);
    let minutes = Math.floor(leavel2 / (60 * 1000));
    let leavel3 = leavel2 % (60 * 1000);
    let seconds = Math.floor(leavel3 / (1000));
    let runbox = document.getElementById('run-time');
    runbox.innerHTML = '本站已运行<i class="far fa-clock fa-fw"></i> '
        + ((days < 10) ? '0' : '') + days + ' 天 '
        + ((hours < 10) ? '0' : '') + hours + ' 时 '
        + ((minutes < 10) ? '0' : '') + minutes + ' 分 '
        + ((seconds < 10) ? '0' : '') + seconds + ' 秒 ';
}

function autoTheme()
{
    // let tm = new Date();
    // let hours = tm.getHours();
    // let theme = $('.menu-item theme-switch')[0];

    // // console.log(hours)
    // // if ((hours >= 18) || (hours < 7))
    // // {
    // //     $(theme).click();
    // // }
    // // else
    // // {
    // //     $(theme).click();
    // // }
    // $(theme).click();
}

function loop() {
    runtime();
    // autoTheme();
}

loop();
setInterval(loop, 1000);

// document.addEventListener('visibilitychange', function () {
//   if (document.visibilityState == 'hidden') {
//     normal_title = document.title;
//     document.title = 'w(ﾟДﾟ)w崩溃啦！';
//   } else {
//     document.title = '(ε￣ *)骗你哒！';
//     setTimeout(function () {
//       document.title = normal_title;
//     }, 1000)
//   }
// });

function loadExternalResource(url, type) {
    return new Promise((resolve, reject) => {
        let tag;

        if (type === "css") {
            tag = document.createElement("link");
            tag.rel = "stylesheet";
            tag.href = url;
        }
        else if (type === "js") {
            tag = document.createElement("script");
            tag.src = url;
        }
        if (tag) {
            tag.onload = () => resolve(url);
            tag.onerror = () => reject(url);
            document.head.appendChild(tag);
        }
    });
}

// 看板娘
// loadExternalResource("/live2d/autoload.js", "js");