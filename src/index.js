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
  <p>For you.</p>

  <h2>『课程表』</h2>
  <ul id="movieList">
    <li data-id="south-station"><div class="movie">《南方车站的聚会》</div><textarea placeholder="备注…"></textarea></li>
    <li data-id="midsommar"><div class="movie">《仲夏夜惊魂》</div><textarea placeholder="备注…"></textarea></li>
    <li data-id="hereditary"><div class="movie done">《厄运遗传》</div><textarea placeholder="备注…"></textarea></li>
    <li data-id="beau"><div class="movie">《博很恐惧》</div><textarea placeholder="备注…"></textarea></li>
    <li data-id="substance"><div class="movie">《某种物质》</div><textarea placeholder="备注…"></textarea></li>
    <li data-id="stepsister"><div class="movie">《丑陋的继姐》</div><textarea placeholder="备注…"></textarea></li>
    <li data-id="farewell"><div class="movie">《霸王别姬》</div><textarea placeholder="备注…"></textarea></li>
    <li data-id="emperor"><div class="movie">《末代皇帝》</div><textarea placeholder="备注…"></textarea></li>
    <li data-id="lantern"><div class="movie">《大红灯笼高高挂》</div><textarea placeholder="备注…"></textarea></li>
    <li data-id="kingdom"><div class="movie">《天国王朝》</div><textarea placeholder="备注…"></textarea></li>
    <li data-id="madmax"><div class="movie">《疯狂的麦克斯》</div><textarea placeholder="备注…"></textarea></li>
    <li data-id="hellraiser"><div class="movie">《猛鬼追魂》</div><textarea placeholder="备注…"></textarea></li>
    <li data-id="pirates"><div class="movie">《加勒比海盗》</div><textarea placeholder="备注…"></textarea></li>
    <li data-id="avatar"><div class="movie">《阿凡达》</div><textarea placeholder="备注…"></textarea></li>
    <li data-id="eeaao"><div class="movie">《瞬息全宇宙》</div><textarea placeholder="备注…"></textarea></li>
    <li data-id="lambs"><div class="movie">《沉默的羔羊》</div><textarea placeholder="备注…"></textarea></li>
    <li data-id="red-dragon"><div class="movie">《红龙》</div><textarea placeholder="备注…"></textarea></li>
    <li data-id="chocolate"><div class="movie">《查理的巧克力工厂》</div><textarea placeholder="备注…"></textarea></li>
    <li data-id="wife"><div class="movie">《杀妻总动员》</div><textarea placeholder="备注…"></textarea></li>
    <li data-id="forrest"><div class="movie">《阿甘正传》</div><textarea placeholder="备注…"></textarea></li>
  </ul>

  <script>
    document.querySelectorAll('#movieList li').forEach(li => {
      const id = li.dataset.id;
      const movie = li.querySelector('.movie');
      const textarea = li.querySelector('textarea');

      // 初始：如果是厄运遗传，默认已看
      if (id === 'hereditary') {
        localStorage.setItem(id + '-done', 'true');
      }

      // 恢复状态
      if (localStorage.getItem(id + '-done') === 'true') {
        movie.classList.add('done');
      }
      textarea.value = localStorage.getItem(id + '-note') || '';

      // 点击切换
      movie.addEventListener('click', () => {
        movie.classList.toggle('done');
        localStorage.setItem(id + '-done', movie.classList.contains('done'));
      });

      // 保存备注
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
