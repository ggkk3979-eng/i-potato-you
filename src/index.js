const PASSWORD = "ipotatoyou11";

// ===== 图片代理映射（解决大陆 GitHub 图片不显示）=====
const IMAGE_MAP = {
  "/img/1.jpg":
    "https://raw.githubusercontent.com/ggkk3979-eng/i-potato-you/main/mmexport1768016148958.jpg",
  "/img/2.jpg":
    "https://raw.githubusercontent.com/ggkk3979-eng/i-potato-you/main/mmexport1768016141932.jpg"
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ===== 图片代理 =====
    if (IMAGE_MAP[url.pathname]) {
      const imgRes = await fetch(IMAGE_MAP[url.pathname]);
      return new Response(imgRes.body, {
        headers: {
          "Content-Type": imgRes.headers.get("Content-Type"),
          "Cache-Control": "public, max-age=86400"
        }
      });
    }

    const movies = [
      "南方车站的聚会","仲夏夜惊魂","厄运遗传","博很恐惧","某种物质",
      "丑陋的继姐","霸王别姬","末代皇帝","大红灯笼高高挂","天国王朝",
      "疯狂的麦克斯","猛鬼追魂","加勒比海盗","阿凡达","瞬息全宇宙",
      "沉默的羔羊","红龙","查理的巧克力工厂","杀妻总动员","阿甘正传"
    ];

    const DEFAULT_STATE = {
      "南方车站的聚会": { status:2, note:"", timestamp:"2026年1月7日" },
      "厄运遗传": { status:2, note:"", timestamp:"2026年1月7日" },
      "丑陋的继姐": { status:2, note:"", timestamp:"2026年1月7日" }
    };

    // ===== 修改（需要密码）=====
    if (request.method === "POST") {
      const data = await request.json();
      if (data.password !== PASSWORD) {
        return new Response(JSON.stringify({ error:"密码错误" }), {
          headers: { "Content-Type":"application/json" }
        });
      }

      const key = data.name;
      const cur =
        await env.MOVIE_TABLE.get(key, { type:"json" }) ||
        { status:0, note:"" };

      if (data.action === "toggle") {
        cur.status = (cur.status + 1) % 3;
      }

      if (data.action === "note") {
        cur.note = data.note || "";
        if (DEFAULT_STATE[key]) cur.timestamp = "2026年1月7日";
      }

      if (DEFAULT_STATE[key] && !cur.timestamp) {
        cur.timestamp = "2026年1月7日";
      }

      await env.MOVIE_TABLE.put(key, JSON.stringify(cur));
      return new Response(JSON.stringify(cur), {
        headers: { "Content-Type":"application/json" }
      });
    }

    // ===== 页面读取 =====
    const states = {};
    for (const m of movies) {
      let v = await env.MOVIE_TABLE.get(m, { type:"json" });
      if (!v) v = DEFAULT_STATE[m] || { status:0, note:"" };
      states[m] = v;
    }

    return new Response(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>i potato you</title>

<style>
body {
  font-family: sans-serif;
  background: #fff7f7;
  padding: 20px;
}

button {
  margin: 12px 0;
  padding: 8px 16px;
}

.movie {
  border-bottom: 1px dashed #ddd;
  padding: 10px 0;
}

.together .title {
  color: #e91e63;
  font-weight: bold;
}

.note { font-size:14px; color:#666; }
.timestamp { font-size:12px; color:#999; }

.page { display:none; }
.page.active { display:block; }

.timer {
  font-size: 20px;
  margin: 20px 0;
  color: #e91e63;
}

.photos {
  display:flex;
  gap:12px;
}

.photo-img {
  width:48%;
  border-radius:10px;
}

/* ===== 转盘 ===== */
.wheel-wrap {
  margin: 30px auto;
  text-align: center;
}

.wheel {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  border: 6px solid #e91e63;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background: #fff;
  transition: transform 3s cubic-bezier(.17,.67,.35,1);
}

.footer-text {
  margin-top: 28px;
  text-align: center;
  font-size: 14px;
  color: #e91e63;
}
</style>
</head>

<body>

<!-- 页面 1 -->
<div id="page1" class="page active">
  <h1>🎬 课程表</h1>
  <button onclick="goPage(2)">下一页 →</button>
  <div id="list"></div>
</div>

<!-- 页面 2 -->
<div id="page2" class="page">
  <h1>我们认识了</h1>

  <div class="timer" id="timer"></div>

  <div class="photos">
    <img class="photo-img" src="/img/1.jpg">
    <img class="photo-img" src="/img/2.jpg">
  </div>

  <!-- 🎡 转盘 -->
  <div class="wheel-wrap">
    <div id="wheel" class="wheel">🎡</div>
    <button onclick="spin()">试试今天的运气</button>
  </div>

  <button onclick="goPage(1)">← 返回</button>

  <div class="footer-text">记得每天要 kiss 哦</div>
</div>

<script>
const movies = ${JSON.stringify(movies)};
let state = ${JSON.stringify(states)};

function goPage(n) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById("page"+n).classList.add("active");
}

function render() {
  const box = document.getElementById("list");
  box.innerHTML = "";
  movies.forEach(name => {
    const s = state[name] || {};
    const div = document.createElement("div");
    div.className = "movie " + (s.status===2?"together":"");
    div.innerHTML = \`
      <div class="title">🎬 \${name}</div>
      \${s.timestamp?'<div class="timestamp">'+s.timestamp+'</div>':''}
    \`;
    box.appendChild(div);
  });
}

// ⏱ 计时
function startTimer() {
  const start = new Date("2026-01-04T00:00:00");
  setInterval(() => {
    const now = new Date();
    let d = Math.floor((now-start)/1000);
    const day=Math.floor(d/86400);d%=86400;
    const h=Math.floor(d/3600);d%=3600;
    const m=Math.floor(d/60);const s=d%60;
    timer.innerText = \`\${day} 天 \${h} 小时 \${m} 分 \${s} 秒\`;
  },1000);
}

// 🎡 转盘逻辑（严格按你给的概率）
const prizes = [
  { text:"今天吃个好点的", p:30 },
  { text:"今天对自己好点", p:30 },
  { text:"今天摆烂", p:1 },
  { text:"各自亲对方一口", p:30 },
  { text:"现在喝一大口水憋住", p:5 },
  { text:"谢谢惠顾", p:4 }
];

function spin(){
  const wheel = document.getElementById("wheel");
  const r = Math.random()*100;
  let sum = 0, result;
  for (const i of prizes) {
    sum += i.p;
    if (r <= sum) { result = i.text; break; }
  }
  wheel.style.transform =
    "rotate(" + (360*5 + Math.random()*360) + "deg)";
  setTimeout(()=>alert(result),3000);
}

render();
startTimer();
</script>

</body>
</html>`, {
      headers: { "Content-Type":"text/html; charset=utf-8" }
    });
  }
};
