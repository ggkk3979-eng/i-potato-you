export default {
  async fetch(request, env) {
    const EDIT_PASSWORD = "ipotatoyou11";
    const url = new URL(request.url);
    const canEdit = url.searchParams.get("edit") === EDIT_PASSWORD;

    const movies = [
      "南方车站的聚会","仲夏夜惊魂","厄运遗传","博很恐惧","某种物质",
      "丑陋的继姐","霸王别姬","末代皇帝","大红灯笼高高挂","天国王朝",
      "疯狂的麦克斯","猛鬼追魂","加勒比海盗","阿凡达","瞬息全宇宙",
      "沉默的羔羊","红龙","查理的巧克力工厂","杀妻总动员","阿甘正传"
    ];

    // 处理状态修改请求
    if (canEdit && request.method === "POST") {
      const data = await request.json();
      if(data.action === "toggle") {
        const key = data.name;
        const cur = await env.MOVIE_TABLE.get(key, { type: "json" }) || { status:0, note:"" };
        cur.status = (cur.status + 1) % 3;
        await env.MOVIE_TABLE.put(key, JSON.stringify(cur));
        return new Response(JSON.stringify(cur), { headers: { "Content-Type": "application/json" } });
      }
      if(data.action === "note") {
        const key = data.name;
        const cur = await env.MOVIE_TABLE.get(key, { type: "json" }) || { status:0, note:"" };
        cur.note = data.note || "";
        await env.MOVIE_TABLE.put(key, JSON.stringify(cur));
        return new Response(JSON.stringify(cur), { headers: { "Content-Type": "application/json" } });
      }
    }

    // 读取所有状态
    const states = {};
    for(const m of movies){
      const v = await env.MOVIE_TABLE.get(m, { type:"json" }) || { status:0, note:"" };
      states[m] = v;
    }

    return new Response(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>i potato you</title>
<style>
body{font-family:sans-serif;background:#fff7f7;padding:20px;}
h1{display:flex;align-items:center;gap:8px;}
.movie{border-bottom:1px dashed #ddd;padding:10px 0;cursor:pointer;}
.watched .title{text-decoration:line-through;color:#999;}
.together .title{color:#e91e63;font-weight:bold;}
.note{font-size:14px;color:#666;margin-top:4px;}
.readonly{cursor:default;}
</style>
</head>
<body>

<h1>🎬 课程表</h1>
<p>i potato you 🥔❤️</p>
<p>${canEdit ? "🔓 编辑模式：可点击电影切换状态、双击修改备注" : "🔒 只读模式"}</p>

<div id="list"></div>

<script>
const canEdit = ${canEdit};
const movies = ${JSON.stringify(movies)};
let state = ${JSON.stringify(states)};

function render(){
  const box = document.getElementById("list");
  box.innerHTML = "";
  movies.forEach(name=>{
    const s = state[name] || {status:0,note:""};
    const div = document.createElement("div");
    div.className = "movie " + (s.status===1?"watched":s.status===2?"together":"") + (!canEdit?" readonly":"");
    div.innerHTML = \`
      <div class="title">\${s.status===2?"💕 ":s.status===1?"✅ ":""}\${name}</div>
      <div class="note">\${s.note || ""}</div>
    \`;

    if(canEdit){
      div.onclick = async ()=>{
        const res = await fetch("", {
          method:"POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({action:"toggle", name})
        });
        state[name] = await res.json();
        render();
      };
      div.ondblclick = async ()=>{
        const n = prompt("备注：", s.note || "");
        if(n!==null){
          const res = await fetch("", {
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({action:"note", name, note:n})
          });
          state[name] = await res.json();
          render();
        }
      };
    }

    box.appendChild(div);
  });
}

render();
</script>

</body>
</html>`, { headers: { "Content-Type":"text/html; charset=utf-8" } });
  }
};
