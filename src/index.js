export default {
  async fetch(request) {

    // ===== 🔐 修改密码（只在代码里）=====
    const EDIT_PASSWORD = " ipotatoyou11";
    // ===================================

    const url = new URL(request.url);
    const canEdit = url.searchParams.get("edit") === EDIT_PASSWORD;

    // status: 0=未看  1=已看  2=一起看过
    const MOVIES = [
      { name: "霸王别姬", status: 2, note: "看完很久没说话" },
      { name: "南方车站的聚会", status: 2, note: "第一次一起看的" },
      { name: "花样年华", status: 2, note: "音乐太上头" },
      { name: "瞬息全宇宙", status: 1, note: "" },
      { name: "盗梦空间", status: 1, note: "" },

      { name: "星际穿越", status: 0, note: "" },
      { name: "寄生虫", status: 1, note: "" },
      { name: "楚门的世界", status: 2, note: "" },
      { name: "无间道", status: 1, note: "" },
      { name: "这个杀手不太冷", status: 2, note: "" },

      { name: "海边的曼彻斯特", status: 0, note: "" },
      { name: "美丽人生", status: 1, note: "" },
      { name: "重庆森林", status: 2, note: "" },
      { name: "泰坦尼克号", status: 1, note: "" },
      { name: "少年派的奇幻漂流", status: 1, note: "" },

      { name: "爱在黎明破晓前", status: 2, note: "" },
      { name: "怦然心动", status: 1, note: "" },
      { name: "阿甘正传", status: 1, note: "" },
      { name: "小丑", status: 0, note: "" },
      { name: "猛鬼追魂", status: 0, note: "" }
    ];

    const listHtml = MOVIES.map(m => `
      <div class="movie ${m.status === 2 ? "together" : m.status === 1 ? "watched" : ""}">
        <div class="title">
          ${m.status === 2 ? "💕 " : m.status === 1 ? "✅ " : ""}
          ${m.name}
        </div>
        ${m.note ? `<div class="note">📝 ${m.note}</div>` : ""}
      </div>
    `).join("");

    const editTip = canEdit
      ? `<p style="color:#e91e63">🔓 当前为【可修改模式】</p>`
      : `<p style="color:#999">🔒 只读模式</p>`;

    return new Response(`
<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>i potato you</title>
<style>
body{font-family:sans-serif;background:#fff7f7;padding:20px}
.movie{border-bottom:1px dashed #ddd;padding:10px 0}
.watched .title{text-decoration:line-through;color:#999}
.together .title{color:#e91e63;font-weight:bold}
.note{font-size:14px;color:#666;margin-top:4px}
</style>
</head>
<body>

<h1>🎬 课程表</h1>
<p>i potato you 🥔❤️</p>
${editTip}

${listHtml}

</body>
</html>
    `, {
      headers: { "content-type": "text/html; charset=utf-8" }
    });
  }
};
