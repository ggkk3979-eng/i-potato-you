const PASSWORD = "ipotatoyou11"; 

export default {
  async fetch(request, env) {
    const movies = [
      "南方车站的聚会","仲夏夜惊魂","厄运遗传","博很恐惧","某种物质",
      "丑陋的继姐","霸王别姬","末代皇帝","大红灯笼高高挂","天国王朝",
      "疯狂的麦克斯","猛鬼追魂","加勒比海盗","阿凡达","瞬息全宇宙",
      "沉默的羔羊","红龙","查理的巧克力工厂","杀妻总动员","阿甘正传"
    ];

    const DEFAULT_STATE = {
      "南方车站的聚会": {status:2, note:"", timestamp:"2026年1月7日"},
      "厄运遗传": {status:2, note:"", timestamp:"2026年1月7日"},
      "丑陋的继姐": {status:2, note:"", timestamp:"2026年1月7日"}
    };

    if (request.method === "POST") {
      const data = await request.json();
      if(data.password !== PASSWORD) {
        return new Response(JSON.stringify({error:"密码错误"}), { headers: {"Content-Type":"application/json"} });
      }
      const key = data.name;
      const cur = await env.MOVIE_TABLE.get(key, { type: "json" }) || { status:0, note:"" };

      if (data.action === "toggle") {
        cur.status = (cur.status + 1) % 3;
      }
      if (data.action === "note") {
        cur.note = data.note;
        // 如果是三部“一起看”电影，备注修改时也更新时间戳
        if (DEFAULT_STATE[key]) cur.timestamp = "2026年1月7日";
      }

      if(DEFAULT_STATE[key] && !cur.timestamp) cur.timestamp = "2026年1月7日";

      await env.MOVIE_TABLE.put(key, JSON.stringify(cur));
      return new Response(JSON.stringify(cur), { headers: { "Content-Type": "application/json" } });
    }

    // 读取 KV 状态
    const states = {};
    for (const m of movies) {
      let v = await env.MOVIE_TABLE.get(m, { type:"json" });
      if(!v) v = DEFAULT_STATE[m] || { status:0, note:"" };
      states[m] = v;
    }

    return new Response(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>i potato you</title>
<style>
body { font-family:sans-serif; background:#fff7f7; padding:20px; }
h1 { display:flex; align-items:center; gap:8px; }
.movie { border-bottom:1px dashed #ddd; padding:10px 0; cursor:pointer; }
.watched .title { text-decoration:line-through; color:#999; }
.together .title { color:#e91e63; font-weight:bold; }
.note { font-size:14px; color:#666; margin-top:4px; }
.timestamp { font-size:12px; color:#999; margin-top:2px; }
</style>
</head>
<body>

<h1>🎬 课程表</h1>
<p>i potato you 🥔❤️</p>

<div id="list"></div>

<script>
const movies = ${JSON.stringify(movies)};
let state = ${JSON.stringify(states)};

async function updateMovie(name, action, note) {
  const password = prompt("请输入密码修改状态或备注:");
  if(!password) return;
  const res = await fetch("", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ name, action, note, password })
  });
  const data = await res.json();
  if(data.error) return alert(data.error);
  state[name] = data;
  render();
}

function render() {
  const box = document.getElementById("list");
  box.innerHTML = "";
  movies.forEach(name => {
    const s = state[name] || { status:0, note:"" };
    const div = document.createElement("div");
    div.className = "movie " + (s.status===1?"watched":s.status===2?"together":"");
    div.innerHTML = \`
      <div class="title" onclick="updateMovie('\${name}','toggle')">🎬 \${s.status===2?'💕 ':s.status===1?'✅ ':''}\${name}</div>
      <div class="note" onclick="updateMovie('\${name}','note', prompt('编辑备注:','\${s.note||''}'))">\${s.note || ''}</div>
      \${s.timestamp ? '<div class="timestamp">'+s.timestamp+'</div>' : ''}
    \`;
    box.appendChild(div);
  });
}

render();
</script>

</body>
</html>`, { headers: { "Content-Type":"text/html; charset=utf-8" } });
  }
};
