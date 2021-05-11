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


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function nextISU()
{
    var friend_btn = document.getElementsByClassName('friend-rand')[0];
    const max_time = 3000; //ms
    const max_loop = 2;
    const time_time = 1.2;
    let is_run = false;
    let urls = document.getElementsByClassName("frind-real")[0].getElementsByClassName("frined-url");
    let arr = [...new Array(urls.length).keys()]
    let all_loop = arr.length * max_loop;
    let each_p = new Array(all_loop);
    each_p[0] = 1;
    let each_sum = each_p[0];
    for (let i = 1; i < all_loop; i++)
    {
        each_p[i] = each_p[i - 1] * time_time;
        each_sum += each_p[i];
    }
    let sleep_time = max_time / each_sum;
    let lucky_url = urls[0];

    function chose(url)
    {
        url.style.opacity = 0.4;
    }
    function unchose(url)
    {
        url.style.opacity = 1;
    }

    friend_btn.addEventListener('click', async function() {
        if (is_run)
        {
            return;
        }
        is_run = true;
        for (let i = 0; i < urls.length; i++)
        {
            urls[i].style.opacity = 1;
        }
        // console.log(each_p)
        let last_url = undefined;
        for (let i = 0; i < max_loop; i++)
        {
            arr.sort(function() {
                return (0.5-Math.random());
            });
            for (let j = 0; j < arr.length; j++)
            {
                if (last_url != undefined)
                {
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
        for (let i = 0; i < 3; i++)
        {
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
nextISU();

// 看板娘
// loadExternalResource("/live2d/autoload.js", "js");