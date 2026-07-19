(function () {
  'use strict';

  var modal = document.getElementById('shareModal');
  if (!modal) return;

  var openBtn = document.getElementById('shareDlBtn');
  var closeBtn = document.getElementById('shareClose');
  var overlay = modal.querySelector('.share-overlay');
  var themeToggle = document.getElementById('shareThemeToggle');
  var downloadBtn = document.getElementById('shareDownload');
  var card = document.getElementById('shareCard');
  var html2canvasReady = false;

  /* ---- 动态加载 html2canvas ---- */
  function loadHtml2canvas(cb) {
    if (html2canvasReady) return cb();
    if (window.html2canvas) { html2canvasReady = true; return cb(); }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    s.onload = function () { html2canvasReady = true; cb(); };
    s.onerror = function () { alert('图片库加载失败，请检查网络后重试。'); };
    document.head.appendChild(s);
  }

  /* ---- 打开 / 关闭 ---- */
  function openModal() {
    var siteIsDark = document.documentElement.classList.contains('dark');
    card.classList.toggle('dark', siteIsDark);
    updateThemeIcon(siteIsDark);
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* ---- 卡片主题图标 ---- */
  function updateThemeIcon(isDark) {
    var lightIcon = themeToggle.querySelector('.icon-light');
    var darkIcon = themeToggle.querySelector('.icon-dark');
    if (lightIcon) lightIcon.style.display = isDark ? 'none' : '';
    if (darkIcon) darkIcon.style.display = isDark ? '' : 'none';
  }

  /* ---- 下载 ---- */
  function downloadCard() {
    loadHtml2canvas(function () {
      // 解除滚动限制 + 正文截断，截图后再恢复
      var dialog = modal.querySelector('.share-dialog');
      var cardBody = card.querySelector('.share-card-body');
      var oldMaxH = dialog.style.maxHeight;
      var oldOverflow = dialog.style.overflow;
      var oldBodyMaxH = cardBody.style.maxHeight;
      var oldBodyOverflow = cardBody.style.overflow;

      dialog.style.maxHeight = 'none';
      dialog.style.overflow = 'visible';
      cardBody.style.maxHeight = 'none';
      cardBody.style.overflow = 'visible';
      cardBody.classList.add('capturing');  // 隐藏省略号

      var w = card.offsetWidth;
      var h = card.offsetHeight;
      var scale = Math.max(2, Math.floor(800 / Math.min(w, h)));
      html2canvas(card, {
        scale: scale,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        height: h,
        windowHeight: h + 200
      }).then(function (canvas) {
        dialog.style.maxHeight = oldMaxH;
        dialog.style.overflow = oldOverflow;
        cardBody.style.maxHeight = oldBodyMaxH;
        cardBody.style.overflow = oldBodyOverflow;
        cardBody.classList.remove('capturing');
        canvas.toBlob(function (blob) {
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = (pageTitle() || 'article') + '.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        }, 'image/png');
      }).catch(function () {
        dialog.style.maxHeight = oldMaxH;
        dialog.style.overflow = oldOverflow;
        cardBody.style.maxHeight = oldBodyMaxH;
        cardBody.style.overflow = oldBodyOverflow;
        cardBody.classList.remove('capturing');
        alert('截图生成失败，请重试。');
      });
    });
  }

  function pageTitle() {
    var h1 = document.querySelector('.article-title');
    return h1 ? h1.textContent.trim() : '';
  }

  /* ---- 事件绑定 ---- */
  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = !card.classList.contains('dark');
      card.classList.toggle('dark', next);
      updateThemeIcon(next);
    });
  }

  if (downloadBtn) downloadBtn.addEventListener('click', downloadCard);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });
})();
