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

    // ===== 图片代理处理 =====
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

    // ===== 修改请求（需要密码）=====
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

    // ===== 页面读取（不需要密码）=====
    const states = {};
    for (const m of movies) {
      let v = await env.MOVIE_TABLE.get(m, { type:"json" });
      if (!v) v = DEFAULT_STATE[m] || { status:0, note:"" };
      states[m] = v;
    }

    return new Response(`<!DOCTYPE html>
<!DOCTYPE html>
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

h1 {
  display: flex;
  align-items: center;
  gap: 8px;
}

button {
  margin: 12px 0;
  padding: 6px 14px;
}

.movie {
  border-bottom: 1px dashed #ddd;
  padding: 10px 0;
}

.watched .title {
  text-decoration: line-through;
  color: #999;
}

.together .title {
  color: #e91e63;
  font-weight: bold;
}

.note {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.timestamp {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.page { display: none; }
.page.active { display: block; }

.timer {
  font-size: 20px;
  margin: 20px 0;
  color: #e91e63;
}

.photos {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.photo-img {
  width: 48%;
  border-radius: 10px;
}

.footer-text {
  margin-top: 28px;
  text-align: center;
  font-size: 14px;
  color: #e91e63;
  opacity: 0.85;
}
</style>
</head>

<body>

<!-- 页面 1 -->
<div id="page1" class="page active">
  <h1>🎬 课程表</h1>
  <p>i potato you 🥔❤️</p>
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

  <button onclick="goPage(1)">← 返回</button>

  <div class="footer-text">记得每天要 kiss 哦</div>
</div>

<script>
const movies = ${JSON.stringify(movies)};
let state = ${JSON.stringify(states)};

function goPage(n) {
  document.querySelectorAll(".page")
    .forEach(p => p.classList.remove("active"));
  document.getElementById("page" + n).classList.add("active");
}

async function updateMovie(name, action, note) {
  const password = prompt("请输入密码修改:");
  if (!password) return;

  const res = await fetch("", {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({ name, action, note, password })
  });

  const data = await res.json();
  if (data.error) return alert(data.error);
  state[name] = data;
  render();
}

function render() {
  const box = document.getElementById("list");
  box.innerHTML = "";

  movies.forEach(name => {
    const s = state[name] || { status:0, note:"" };
    const div = document.createElement("div");

    div.className =
      "movie " +
      (s.status === 1 ? "watched" :
       s.status === 2 ? "together" : "");

    div.innerHTML = \`
      <div class="title"
        onclick="updateMovie('\${name}','toggle')">
        🎬 \${s.status===2?'💕 ':s.status===1?'✅ ':''}\${name}
      </div>

      <div class="note"
        onclick="updateMovie('\${name}','note',
          prompt('编辑备注：','\${s.note||''}'))">
        \${s.note || ''}
      </div>

      \${s.timestamp
        ? '<div class="timestamp">'+s.timestamp+'</div>'
        : ''}
    \`;

    box.appendChild(div);
  });
}

function startTimer() {
  const start = new Date("2026-01-04T00:00:00");
  setInterval(() => {
    const now = new Date();
    let diff = Math.floor((now - start) / 1000);

    const d = Math.floor(diff / 86400); diff %= 86400;
    const h = Math.floor(diff / 3600); diff %= 3600;
    const m = Math.floor(diff / 60);
    const s = diff % 60;

    document.getElementById("timer").innerText =
      d + " 天 " + h + " 小时 " + m + " 分 " + s + " 秒";
  }, 1000);
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
