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
  runbox.innerText = '本站已运行 ' + days + ' 天 ' + hours + ' 时 ' + minutes + ' 分 ' + seconds + ' 秒 ';
}
runtime();
setInterval(runtime, 1000);