export default {
  async fetch() {
    return new Response(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>我们认识了 1 天</title>

<style>
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff7f7;
    font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
                 "Microsoft YaHei", sans-serif;
    color: #e91e63;
  }

  .box {
    text-align: center;
    padding: 32px 24px;
  }

  h1 {
    font-size: 28px;
    margin-bottom: 24px;
  }

  .timer {
    font-size: 22px;
    line-height: 1.8;
    letter-spacing: 1px;
  }

  .tip {
    margin-top: 20px;
    font-size: 14px;
    opacity: 0.75;
  }
</style>
</head>

<body>
  <div class="box">
    <h1>我们认识了 1 天</h1>
    <div class="timer" id="timer">计算中…</div>
    <div class="tip">从 2026 年 1 月 20 日 00:00 开始</div>
  </div>

<script>
  const start = new Date("2026-01-20T00:00:00");

  function updateTimer() {
    const now = new Date();
    let diff = Math.floor((now - start) / 1000);
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / 86400);
    diff %= 86400;
    const hours = Math.floor(diff / 3600);
    diff %= 3600;
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    document.getElementById("timer").innerText =
      days + " 天 " +
      hours + " 小时 " +
      minutes + " 分 " +
      seconds + " 秒";
  }

  updateTimer();
  setInterval(updateTimer, 1000);
</script>
</body>
</html>`, {
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      }
    });
  }
};
