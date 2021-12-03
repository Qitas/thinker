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

function autoTheme() {
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

function loadExternalResource(url, type, is_defer = false, is_async = true) {
    return new Promise((resolve, reject) => {
        let tag;

        if (type === "css") {
            tag = document.createElement("link");
            tag.rel = "stylesheet";
            tag.href = url;
            tag.defer = is_defer;
            tag.async = is_async;
        }
        else if (type === "js") {
            tag = document.createElement("script");
            tag.src = url;
            tag.defer = is_defer;
            tag.async = is_async;
        }
        if (tag) {
            tag.onload = () => resolve(url);
            tag.onerror = () => reject(url);
            document.head.appendChild(tag);
        }
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function nextISU() {
    var friend_btn = document.getElementsByClassName('friend-rand')
    if (friend_btn.length < 1) return;
    friend_btn = friend_btn[0];
    const max_time = 3000; //ms
    const max_loop = 2;
    const time_time = 1.2;
    let is_run = false;
    let friends = document.getElementsByClassName("frind-real");
    if (friends.length < 1) return;
    let urls = friends[0].getElementsByClassName("frined-url");
    let arr = [...new Array(urls.length).keys()]
    let all_loop = arr.length * max_loop;
    let each_p = new Array(all_loop);
    each_p[0] = 1;
    let each_sum = each_p[0];
    for (let i = 1; i < all_loop; i++) {
        each_p[i] = each_p[i - 1] * time_time;
        each_sum += each_p[i];
    }
    let sleep_time = max_time / each_sum;
    let lucky_url = urls[0];

    function chose(url) {
        url.style.opacity = 0.4;
    }
    function unchose(url) {
        url.style.opacity = 1;
    }

    friend_btn.addEventListener('click', async function () {
        if (is_run) {
            return;
        }
        is_run = true;
        for (let i = 0; i < urls.length; i++) {
            urls[i].style.opacity = 1;
        }
        // console.log(each_p)
        let last_url = undefined;
        for (let i = 0; i < max_loop; i++) {
            arr.sort(function () {
                return (0.5 - Math.random());
            });
            for (let j = 0; j < arr.length; j++) {
                if (last_url != undefined) {
                    unchose(last_url);
                }
                chose(urls[arr[j]]);
                last_url = urls[arr[j]];
                lucky_url = urls[arr[j]];
                let st = sleep_time * each_p[i * arr.length + j];
                // console.log(st)
                await sleep(st);
            }
        }
        for (let i = 0; i < 3; i++) {
            unchose(lucky_url);
            await sleep(100);
            chose(lucky_url);
            await sleep(100);
        }
        lucky_url.click();
        unchose(lucky_url);
        is_run = false;
    }, false);
}

function isPC() {
    var agents_info = navigator.userAgent;
    var agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var ispc = true;
    for (var v = 0; v < agents.length; v++) {
        if (agents_info.indexOf(agents[v]) > 0) {
            ispc = false;
            break;
        }
    }
    return ispc;
}

loadExternalResource("https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js", "js");
function template_friend(url, name, word, logo) {
    return '<a target="_blank" href=' + url + ' title=' + name + '--' + word + ' class="friend url frined-url">' +
        '<div class="friend block whole">' +
        '<div class="friend block left">' +
        '<img class="friend logo" src=' + logo + ' onerror="this.src=\'https://gravatar.loli.net/avatar/c02f8b813aa4b7f72e32de5a48dc17a7?d=retro&v=1.4.14\'" />' +
        '</div>' +
        '<div class="friend block right">' +
        '<div class="friend name">' + name + '</div>' +
        '<div class="friend info">"' + word + '"</div>' +
        '</div>' +
        '</div>' +
        '</a>'
}

const friends_json = "https://gist.githubusercontent.com/caibingcheng/2515bc064b4043c4e1b858cac70e3ad6/raw/friends.json"
const uptime_robot = "https://api.bbing.com.cn/uptimerobot?jsoncallback=?"

$(function () {
    $.getJSON(uptime_robot, function (data) {
        monitors = eval(data["data"])
        $.getJSON(friends_json, function (data) {
            if (data.length < 1) return;
            status_ok = new Array();
            status_failed = new Array();
            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < monitors.length; j++) {
                    url_match = data[i]["url"] == monitors[j]["url"];
                    status_match = monitors[j]["status"] != 0;
                    if (url_match) {
                        if (status_match) {
                            status_ok.push(data[i])
                        }
                        else {
                            status_failed.push(data[i])
                        }
                        break;
                    }
                }
            }

            // console.log(status_ok, status_failed);

            $('a[title="随机拜访一位朋友吧~"]').on("click", function () {
                let rand_id = Math.floor(Math.random() * status_ok.length);
                let target_url = status_ok[rand_id]["url"];
                window.open(target_url);
            });

            $.each(status_ok, function (infoIndex, info) {
                let friends = template_friend(info['url'], info['name'], info['word'], info['logo']);
                $('.friend-list-div.frind-real').append(friends);
            });
            if (status_ok.length > 0) {
                nextISU();
            }
            if (status_failed.length > 0) {
                $('h3#无法访问').css('display', 'block');
            } else {
                $('h3#无法访问').css('display', 'none');
            }
            $.each(status_failed, function (infoIndex, info) {
                let friends = template_friend(info['url'], info['name'], info['word'], info['logo']);
                $('.friend-list-div.frind-real-noreach').append(friends);
            });
        })
    })
});

$(document).ready(function () {
    // 看板娘
    // if (isPC()) {
    //     loadExternalResource("/live2d/autoload.js", "js");
    // }

    if ($("#dogdog").length > 0) {
        loadExternalResource("https://api.bbing.com.cn/dog?identify=dogdog&method=js", "js");
    }
    if ($("#hitokoto").length > 0) {
        loadExternalResource("https://v1.hitokoto.cn/?encode=js&select=%23hitokoto", "js");
    }
    loadExternalResource("https://hm.baidu.com/hm.js?19d1992f36a0a1272d7bf51277fb4fb0", "js");
    // loadExternalResource("http://127.0.0.1:5000/dog?identify=dogdog&method=js", "js");
})
