const PASSWORD = " ipotatoyou11"; // 

const DEFAULT_MOVIES = [
  "南方车站的聚会","仲夏夜惊魂","厄运遗传","博很恐惧","某种物质",
  "丑陋的继姐","霸王别姬","末代皇帝","大红灯笼高高挂","天国王朝",
  "疯狂的麦克斯","猛鬼追魂","加勒比海盗","阿凡达","瞬息全宇宙",
  "沉默的羔羊","红龙","查理的巧克力工厂","杀妻总动员","阿甘正传"
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ===== API 保存 =====
    if (url.pathname === "/api" && request.method === "POST") {
      const body = await request.json();
      if (body.password !== PASSWORD) {
        return new Response("unauthorized", { status: 401 });
      }
      await env.MOVIE_TABLE.put("data", JSON.stringify(body.data));
      return new Response("ok");
    }

    // ===== 读取 KV =====
    let store = { movies: {} };
    const saved = await env.MOVIE_TABLE.get("data");

    if (saved) {
      store = JSON.parse(saved);
    } else {
      DEFAULT_MOVIES.forEach(name => {
        store.movies[name] = { status: 0, note: "" }; // 0未看 1已看 2一起看过
      });
      await env.MOVIE_TABLE.put("data", JSON.stringify(store));
    }

    const moviesHtml = Object.entries(store.movies).map(
      ([name, info]) => `
      <div class="movie ${info.status === 2 ? "together" : info.status === 1 ? "watched" : ""}">
        <div>
          <span>
            ${info.status === 2 ? "💕 " : info.status === 1 ? "✅ " : ""}
            ${name}
          </span>
          <button onclick="toggle('${name}')">切换</button>
          <button onclick="removeMovie('${name}')">删除</button>
        </div>
        <textarea onchange="note('${name}', this.value)" placeholder="备注…">${info.note || ""}</textarea>
      </div>`
    ).join("");

    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>i potato you</title>
<style>
body{font-family:sans-serif;background:#fff7f7;padding:20px}
.movie{border-bottom:1px dashed #ddd;padding:10px 0}
.watched span{text-decoration:line-through;color:#999}
.together span{color:#e91e63;font-weight:bold}
textarea{width:100%;margin-top:6px}
button{margin-left:4px}
</style>
</head>
<body>

<h1>📚「课程表」</h1>
<p>i potato you 🥔❤️</p>

<div id="lock">
  <input id="pw" type="password" placeholder="密码"/>
  <button onclick="unlock()">进入</button>
</div>

<div id="app" style="display:none">
  <input id="newMovie" placeholder="新增电影名"/>
  <button onclick="addMovie()">添加</button>

  <div id="list">${moviesHtml}</div>

  <button onclick="save()">保存并同步</button>
</div>

<script>
let password = "";
let data = ${JSON.stringify(store)};

function unlock(){
  password = pw.value;
  lock.style.display="none";
  app.style.display="block";
}

function addMovie(){
  const name = newMovie.value.trim();
  if(!name || data.movies[name]) return;
  data.movies[name] = { status:0, note:"" };
  location.reload();
}

function removeMovie(name){
  delete data.movies[name];
  location.reload();
}

function toggle(name){
  data.movies[name].status = (data.movies[name].status + 1) % 3;
  location.reload();
}

function note(name, val){
  data.movies[name].note = val;
}

async function save(){
  await fetch("/api",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ password, data })
  });
  alert("已同步");
}
</script>
</body>
</html>
`;

    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" }
    });
  }
};
