(function () {
  'use strict';

  var STORAGE_KEY = 'shiyi-theme'; // 'dark' | 'light' | null
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');

  function setTheme(isDark) {
    root.classList.toggle('dark', isDark);
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveTheme(isDark) {
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch (e) {
      // localStorage 不可用时静默失败
    }
  }

  // 初始化：优先读取用户手动选择，其次跟随系统偏好
  var saved = getSavedTheme();
  if (saved === 'dark') {
    setTheme(true);
  } else if (saved === 'light') {
    setTheme(false);
  } else {
    // 无保存记录时跟随系统
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark);
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = !root.classList.contains('dark');
      setTheme(next);
      saveTheme(next);
    });
  }
})();
