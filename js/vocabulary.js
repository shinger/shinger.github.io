(function () {
  'use strict';

  // 把一段纯文字安全地转成可以放进 innerHTML 的字符串，避免单词/释义里出现 < & 等字符时出问题
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // 把一个一级 <li>（形如 "tier<ul><li>层级</li></ul>"）转换成一张翻转卡片
  function buildCard(li) {
    var frontText = '';
    var meanings = [];

    Array.prototype.forEach.call(li.childNodes, function (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        frontText += node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'UL') {
        Array.prototype.forEach.call(node.querySelectorAll(':scope > li'), function (innerLi) {
          var text = innerLi.textContent.trim();
          if (text) meanings.push(text);
        });
      }
    });

    frontText = frontText.trim();
    if (!frontText) return null;

    var card = document.createElement('div');
    card.className = 'vocab-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-pressed', 'false');
    card.setAttribute('aria-label', '单词卡片：' + frontText + '，点击查看释义');

    var inner = document.createElement('div');
    inner.className = 'vocab-card-inner';

    var front = document.createElement('div');
    front.className = 'vocab-card-face vocab-card-front';
    front.innerHTML = '<span class="vocab-word">' + escapeHtml(frontText) + '</span>';

    var back = document.createElement('div');
    back.className = 'vocab-card-face vocab-card-back';
    if (meanings.length) {
      back.innerHTML = meanings
        .map(function (m) { return '<span class="vocab-meaning">' + escapeHtml(m) + '</span>'; })
        .join('');
    } else {
      back.innerHTML = '<span class="vocab-meaning vocab-meaning-empty">暂无释义</span>';
    }

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    function toggle() {
      var flipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', flipped ? 'true' : 'false');
    }

    card.addEventListener('click', toggle);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        toggle();
      }
    });

    return card;
  }

  function init() {
    var body = document.querySelector('.vocab-body');
    if (!body) return;

    var topUl = body.querySelector(':scope > ul');
    if (!topUl) return;

    var grid = document.createElement('div');
    grid.className = 'vocab-grid';

    Array.prototype.forEach.call(topUl.querySelectorAll(':scope > li'), function (li) {
      var card = buildCard(li);
      if (card) grid.appendChild(card);
    });

    if (grid.children.length) {
      body.innerHTML = '';
      body.appendChild(grid);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
