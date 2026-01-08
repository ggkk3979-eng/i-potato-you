export default {
  async fetch(request) {
    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>i potato you</title>
</head>
<body>
  <h1>i potato you 🥔❤️</h1>
  <p>For you. 这是新添加的内容~</p> <!-- 这里是新增的内容 -->
</body>
</html>
    `;
    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
};
