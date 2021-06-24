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

const friends_json = "https://gist.githubusercontent.com/caibingcheng/2515bc064b4043c4e1b858cac70e3ad6/raw/0d20987c897c772e7c79f6b1ae490daa231f5bf2/friends.json"
if ($('.friend-list-div.frind-real').length > 0) {
    $(function () {
        $.getJSON(friends_json, function (data) {
            let friends = '';
            $.each(data, function (infoIndex, info) {
                friends += template_friend(info['url'], info['name'], info['word'], info['logo']);
            });
            $('.friend-list-div.frind-real').html(friends);
            nextISU();
        })
    })
}

$('a[title="随机拜访一位朋友吧~"]').on("click", function () {
    $.getJSON(friends_json, function (data) {
        if (data.length < 1) return;
        let rand_id = Math.floor(Math.random() * data.length);
        let target_url = data[rand_id]["url"];
        window.open(target_url);
    })
});


// 看板娘
if (isPC()) {
    loadExternalResource("/live2d/autoload.js", "js");
}