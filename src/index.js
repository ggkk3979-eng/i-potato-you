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
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity .3s ease;
}

.page.active {
  opacity: 1;
  pointer-events: auto;
}

.box {
  text-align: center;
  padding: 32px 24px;
}

h1 {
  font-size: 28px;
  margin-bottom: 14px;
}

.timer {
  font-size: 22px;
  line-height: 1.8;
}

.tip {
  margin-top: 10px;
  font-size: 14px;
  opacity: .75;
}

button {
  margin-top: 26px;
  padding: 10px 22px;
  border: none;
  border-radius: 999px;
  background: #e91e63;
  color: #fff;
  font-size: 15px;
}

/* 图片 */
.photos {
  display: flex;
  gap: 18px;
  justify-content: center;
  margin-top: 22px;
}

.photo-item img {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border-radius: 26px;
  box-shadow: 0 6px 16px rgba(0,0,0,.12);
}

.photo-item div {
  margin-top: 6px;
  font-size: 13px;
  opacity: .85;
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
</style>
</head>

<body>

<div id="page1" class="page active">
  <div class="box">
    <h1 id="title">我们认识了 0 天</h1>
    <div class="timer" id="timer">0 天 0 小时 0 分 0 秒</div>
    <div class="tip">从 2026 年 1 月 20 日 00:00 开始</div>

    <div class="photos">
      <div class="photo-item">
        <img src="https://cdn.jsdelivr.net/gh/ggkk3979-eng/i-potato-you@main/Image_1769861714861_705.jpg">
        <div>孟秘书</div>
      </div>
      <div class="photo-item">
        <img src="https://cdn.jsdelivr.net/gh/ggkk3979-eng/i-potato-you@main/Image_1769861702241_781.jpg">
        <div>小蛋糕</div>
      </div>
    </div>

    <button onclick="goPage(2)">去试试今天的运气 →</button>
  </div>
</div>

<div id="page2" class="page">
  <div class="box">
    <div class="wheel" id="wheel">🎡</div>
    <div class="tip">测试你今天的运气</div>
    <button onclick="spin()">试试今天的运气</button><br>
    <button onclick="goPage(1)">← 返回</button>
  </div>
</div>

<script>
function goPage(n){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page'+n).classList.add('active');
}

const start=new Date(2026,0,20,0,0,0);
function updateTimer(){
  let diff=Math.floor((new Date()-start)/1000);
  if(diff<0) diff=0;
  const d=Math.floor(diff/86400);
  diff%=86400;
  const h=Math.floor(diff/3600);
  diff%=3600;
  const m=Math.floor(diff/60);
  const s=diff%60;
  title.innerText="我们认识了 "+d+" 天";
  timer.innerText=\`\${d} 天 \${h} 小时 \${m} 分 \${s} 秒\`;
}
updateTimer();
setInterval(updateTimer,1000);

function spin(){
  alert("今天也要对自己好一点 💗");
}
</script>

</body>
</html>`, {
      headers: { "Content-Type":"text/html; charset=utf-8" }
    });
  }
};
