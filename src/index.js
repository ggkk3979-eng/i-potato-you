export default {
  async fetch() {
    return new Response(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>我们认识了</title>

<style>
body {
  margin: 0;
  min-height: 100vh;
  background: #fff7f7;
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
               "Microsoft YaHei", sans-serif;
  color: #e91e63;
}

.page {
  min-height: 100vh;
  display: none;
  align-items: center;
  justify-content: center;
}

.page.active {
  display: flex;
}

.box {
  text-align: center;
  padding: 32px 24px;
}

h1 {
  font-size: 28px;
  margin-bottom: 20px;
}

.timer {
  font-size: 22px;
  line-height: 1.8;
}

.tip {
  margin-top: 16px;
  font-size: 14px;
  opacity: .75;
}

button {
  margin-top: 28px;
  padding: 10px 22px;
  border: none;
  border-radius: 999px;
  background: #e91e63;
  color: #fff;
  font-size: 15px;
}

/* 转盘 */
.wheel {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  border: 6px solid #e91e63;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  transition: transform 2.5s cubic-bezier(.17,.67,.3,1);
  margin: 0 auto;
}

.wheel-text {
  font-size: 14px;
  padding: 12px;
}

.wheel-tip {
  margin-top: 10px;
  font-size: 13px;
  opacity: .75;
}
</style>
</head>

<body>

<!-- 页面 1 -->
<div id="page1" class="page active">
  <div class="box">
    <h1 id="title">我们认识了</h1>
    <div class="timer" id="timer"></div>
    <div class="tip">从 2026 年 1 月 20 日 00:00 开始</div>
    <button onclick="goPage(2)">去试试今天的运气 →</button>
  </div>
</div>

<!-- 页面 2 -->
<div id="page2" class="page">
  <div class="box">
    <div class="wheel" id="wheel">
      <div class="wheel-text" id="wheelText">🎡</div>
    </div>
    <div class="wheel-tip">测试你今天的运气</div>
    <button onclick="spin()">试试今天的运气</button><br>
    <button onclick="goPage(1)">← 返回</button>
  </div>
</div>

<script>
function goPage(n) {
  document.querySelectorAll('.page')
    .forEach(p => p.classList.remove('active'));
  document.getElementById('page' + n).classList.add('active');
}

/* 计时（演示用：过去时间） */
const start = new Date("2025-01-20T00:00:00");

function updateTimer() {
  const now = new Date();
  let diff = Math.floor((now - start) / 1000);
  if (diff < 0) diff = 0;

  const d = Math.floor(diff / 86400); diff %= 86400;
  const h = Math.floor(diff / 3600); diff %= 3600;
  const m = Math.floor(diff / 60);
  const s = diff % 60;

  document.getElementById("title").innerText =
    "我们认识了 " + d + " 天";

  document.getElementById("timer").innerText =
    d + " 天 " + h + " 小时 " + m + " 分 " + s + " 秒";
}

updateTimer();
setInterval(updateTimer, 1000);

/* 转盘 */
const pool = [
  ["今天会有好事发生",10],
  ["今天请自己喝杯奶茶",5],
  ["今天多休息休息",5],
  ["今天适合出去走走",10],
  ["今天是平淡的一天",20],
  ["谢谢惠顾",5],
  ["听一首你想听的歌",10],
  ["今天中午吃顿好的",10],
  ["今天要多想规划",5],
  ["今晚会有好事发生",10],
  ["下午会有好事发生",10]
];

function todayKey(){
  const d=new Date();
  return d.toISOString().slice(0,10);
}

function draw(){
  const sum=pool.reduce((a,b)=>a+b[1],0);
  let r=Math.random()*sum;
  for(const [t,w] of pool){
    if(r<w) return t;
    r-=w;
  }
}

let angle=0;
function spin(){
  if(localStorage.getItem("spin")===todayKey()){
    alert("今天已经转过啦～");
    return;
  }
  localStorage.setItem("spin",todayKey());

  const res=draw();
  angle+=720+Math.random()*360;
  wheel.style.transform="rotate("+angle+"deg)";
  setTimeout(()=>alert("🎯 "+res),2500);
}
</script>

</body>
</html>`, {
      headers: { "Content-Type":"text/html; charset=utf-8" }
    });
  }
};
