(function () {
  'use strict';

  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');

  function setTheme(isDark) {
    root.classList.toggle('dark', isDark);
  }

  // 初始主题：跟随系统偏好（仅内存中切换，不做持久化存储）
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark);

  if (toggle) {
    toggle.addEventListener('click', function () {
      setTheme(!root.classList.contains('dark'));
    });
  }
})();
