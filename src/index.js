const PASSWORD = "ipotatoyou11";

// ===== 资源代理映射（图片 + 音频） =====
const ASSET_MAP = {
  "/img/1.jpg":
    "https://raw.githubusercontent.com/ggkk3979-eng/i-potato-you/main/mmexport1768016148958.jpg",
  "/img/2.jpg":
    "https://raw.githubusercontent.com/ggkk3979-eng/i-potato-you/main/mmexport1768016141932.jpg",

  // 第三页背景图
  "/sleep/bg.jpg":
    "https://raw.githubusercontent.com/ggkk3979-eng/i-potato-you/main/grok_image_dypgr9.jpg",

  // 第三页录音
  "/sleep/audio.m4a":
    "https://raw.githubusercontent.com/ggkk3979-eng/i-potato-you/main/%E9%99%AA%E4%BD%A0%E5%BA%A6%E8%BF%87%E9%9A%BE%E5%85%B3.m4a"
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ===== 静态资源代理 =====
    if (ASSET_MAP[url.pathname]) {
      const res = await fetch(ASSET_MAP[url.pathname]);
      return new Response(res.body, {
        headers: {
          "Content-Type": res.headers.get("Content-Type"),
          "Cache-Control": "public, max-age=86400"
        }
      });
    }

    // ===== 电影列表 & KV 状态逻辑（不变） =====
    const movies = [
      "南方车站的聚会","仲夏夜惊魂","厄运遗传","博很恐惧","某种物质",
      "丑陋的继姐","霸王别姬","末代皇帝","大红灯笼高高挂","天国王朝",
      "疯狂的麦克斯","猛鬼追魂","加勒比海盗","阿凡达","瞬息全宇宙",
      "沉默的羔羊","红龙","查理的巧克力工厂","杀妻总动员","阿甘正传"
    ];

    const DEFAULT_STATE = {
      "南方车站的聚会": {status:2, timestamp:"2026年1月7日"},
      "厄运遗传": {status:2, timestamp:"2026年1月7日"},
      "丑陋的继姐": {status:2, timestamp:"2026年1月7日"}
    };

    if (request.method === "POST") {
      const data = await request.json();
      if (data.password !== PASSWORD) {
        return new Response(JSON.stringify({error:"密码错误"}), {
          headers: {"Content-Type":"application/json"}
        });
      }

      const key = data.name;
      const cur = await env.MOVIE_TABLE.get(key, { type:"json" }) || {status:0, note:""};
      if (data.action === "toggle") cur.status = (cur.status + 1) % 3;
      if (data.action === "note") cur.note = data.note || "";
      if (DEFAULT_STATE[key] && !cur.timestamp) cur.timestamp = "2026年1月7日";
      await env.MOVIE_TABLE.put(key, JSON.stringify(cur));
      return new Response(JSON.stringify(cur), {
        headers: {"Content-Type":"application/json"}
      });
    }

    const states = {};
    for (const m of movies) {
      let v = await env.MOVIE_TABLE.get(m, { type:"json" });
      if (!v) v = DEFAULT_STATE[m] || {status:0, note:""};
      states[m] = v;
    }

    // ===== HTML 页面 =====
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

.note {
  font-size:14px;
  color:#666;
  margin-top:4px;
}

.timestamp {
  font-size:12px;
  color:#999;
}

.page { display:none; }
.page.active { display:block; }

.timer {
  font-size:20px;
  margin:20px 0;
  color:#e91e63;
}

.photos {
  display:flex;
  gap:12px;
}

.photo-img {
  width:48%;
  border-radius:10px;
}

/* 转盘 */
.wheel {
  width:220px;height:220px;
  border-radius:50%;
  border:6px solid #e91e63;
  margin:20px auto;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:bold;
  transition:transform 3s cubic-bezier(.17,.67,.35,1);
}

/* 第三页 背景 + 央对布局 */
.sleep-wrap {
  min-height:100vh;
  background:
    linear-gradient(rgba(0,0,0,.3), rgba(0,0,0,.3)),
    url("/sleep/bg.jpg") center / cover no-repeat;
  color:#fff;
  padding:40px 20px;
  text-align:center;
}

.sleep-card {
  background:rgba(0,0,0,.45);
  border-radius:14px;
  padding:24px;
  max-width:480px;
  margin:0 auto;
}

.sleep-card h1 { margin-bottom:18px; }

.sleep-tip {
  font-size:12px;
  opacity:.9;
  margin-top:8px;
}
</style>
</head>

<body>

<!-- 页面 1：电影 -->
<div id="page1" class="page active">
  <h1>🎬 课程表</h1>
  <button onclick="goPage(2)">下一页 →</button>
  <div id="list"></div>
</div>

<!-- 页面 2：纪念 + 转盘 -->
<div id="page2" class="page">
  <h1>我们认识 7 天</h1>
  <div class="timer" id="timer"></div>

  <div class="photos">
    <img class="photo-img" src="/img/1.jpg">
    <img class="photo-img" src="/img/2.jpg">
  </div>

  <div class="wheel" id="wheel">🎡</div>
  <button onclick="spin()">试试今天的运气</button>

  <button onclick="goPage(3)">下一页 →</button>
</div>

<!-- 页面 3：数 🐭 羊 -->
<div id="page3" class="page">
  <div class="sleep-wrap">
    <div class="sleep-card">
      <h1>数 🐭 羊</h1>

      <audio controls src="/sleep/audio.m4a"></audio>

      <div class="sleep-tip">
        当你坚持不住的时候听听它
      </div>

      <button onclick="goPage(1)">← 回到首页</button>
    </div>
  </div>
</div>

<script>
const movies = ${JSON.stringify(movies)};
let state = ${JSON.stringify(states)};

function goPage(n) {
  document.querySelectorAll(".page")
    .forEach(p=>p.classList.remove("active"));
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
      \${s.timestamp ? '<div class="timestamp">'+s.timestamp+'</div>' : ''}
    \`;
    box.appendChild(div);
  });
}

function startTimer() {
  const start = new Date("2026-01-04T00:00:00");
  setInterval(() => {
    let diff = Math.floor((Date.now() - start)/1000);
    const d = Math.floor(diff/86400); diff%=86400;
    const h = Math.floor(diff/3600); diff%=3600;
    const m = Math.floor(diff/60); const s=diff%60;
    timer.innerText = d+" 天 "+h+" 小时 "+m+" 分 "+s+" 秒";
  },1000);
}

// 转盘逻辑
const prizes = [
  ["今天吃个好点的",30],
  ["今天对自己好点",30],
  ["今天摆烂",1],
  ["各自亲对方一口",30],
  ["现在喝一大口水憋住",5],
  ["谢谢惠顾",4]
];
function spin(){
  const r = Math.random()*100;
  let total=0, result="谢谢惠顾";
  for(const p of prizes){
    total+=p[1];
    if(r<=total){ result=p[0]; break; }
  }
  wheel.style.transform =
    "rotate("+(360*5 + Math.random()*360)+"deg)";
  setTimeout(()=> alert(result), 3000);
}

render();
startTimer();
</script>

</body>
</html>`, {
      headers: { "Content-Type":"text/html" }
    });
  }
};
