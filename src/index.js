export default {
  async fetch(request) {
    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>i potato you</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont;
      padding: 24px;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      margin-bottom: 16px;
    }
    .movie {
      cursor: pointer;
      font-size: 16px;
    }
    .movie.done {
      color: #2ecc71;
      text-decoration: line-through;
    }
    textarea {
      width: 100%;
      margin-top: 6px;
      padding: 6px;
      font-size: 14px;
      resize: vertical;
    }
  </style>
</head>
<body>
  <h1>i potato you 🥔❤️</h1>
  <p>For you. 今天吃牛肉汤😍~</p>

  <h2>课程表（点电影，备注会自动保存）</h2>
  <ul id="movieList">
    <li data-id="nanche">
      <div class="movie">《南方车站的聚会》</div>
      <textarea placeholder="备注…"></textarea>
    </li>
    <li data-id="midsommar">
      <div class="movie">《仲夏夜惊魂》</div>
      <textarea placeholder="备注…"></textarea>
    </li>
    <li data-id="hereditary">
      <div class="movie">《厄运遗传》</div>
      <textarea placeholder="备注…"></textarea>
    </li>
    <li data-id="farewell">
      <div class="movie">《霸王别姬》</div>
      <textarea placeholder="备注…"></textarea>
    </li>
    <li data-id="forrest">
      <div class="movie">《阿甘正传》</div>
      <textarea placeholder="备注…"></textarea>
    </li>
  </ul>

  <script>
    const items = document.querySelectorAll('#movieList li');

    items.forEach(li => {
      const id = li.dataset.id;
      const movie = li.querySelector('.movie');
      const textarea = li.querySelector('textarea');

      // 恢复状态
      if (localStorage.getItem(id + '-done') === 'true') {
        movie.classList.add('done');
      }
      textarea.value = localStorage.getItem(id + '-note') || '';

      // 点击切换看过
      movie.addEventListener('click', () => {
        movie.classList.toggle('done');
        localStorage.setItem(id + '-done', movie.classList.contains('done'));
      });

      // 自动保存备注
      textarea.addEventListener('input', () => {
        localStorage.setItem(id + '-note', textarea.value);
      });
    });
  </script>
</body>
</html>
    `;
    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" }
    });
  }
};
