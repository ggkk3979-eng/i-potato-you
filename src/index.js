const PASSWORD = "ipotatoyou11"; 

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ===== API =====
    if (url.pathname === "/api" && request.method === "POST") {
      const body = await request.json();
      if (body.password !== PASSWORD) {
        return new Response("unauthorized", { status: 401 });
      }
      await env.MOVIE_TABLE.put("data", JSON.stringify(body.data));
      return new Response("ok");
    }

    let store = { movies: {} };
    const saved = await env.MOVIE_TABLE.get("data");
    if (saved) store = JSON.parse(saved);

    const moviesHtml = Object.entries(store.movies).map(
      ([name, info]) => `
      <div class="movie">
        <div>
          <span class="${info.watched ? "watched" : ""}">${info.watched ? "✅ " : ""}${name}</span>
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
.watched{text-decoration:line-through;color:#999}
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
  data.movies[name] = { watched:false, note:"" };
  location.reload();
}

function removeMovie(name){
  delete data.movies[name];
  location.reload();
}

function toggle(name){
  data.movies[name].watched = !data.movies[name].watched;
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
      headers: { "content-type": "text/html;charset=utf-8" }
    });
  }
};
