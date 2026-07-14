/* 자동 링크 — 본문(main)의 평문 URL·도메인을 클릭 가능한 링크로 변환.
   안전장치:
   - 이미 <a>·<code>·<pre>·<button> 안에 있는 텍스트는 건드리지 않음
   - 허용된 실제 TLD만 링크(그래서 Node.js·index.html·PRD.md·버전번호 5.6 등은 제외)
   - 이메일(@ 뒤)·단어 중간 도메인은 제외, 문장부호로 끝나면 잘라냄 */
(function () {
  'use strict';

  // 허용 TLD (실제 최상위 도메인만) — 필요 시 여기에 추가
  var TLD = 'com|org|net|io|ai|dev|app|co|kr|gov|edu|me|xyz|cloud|tech|sh';
  // 경로 부분은 ASCII URL 문자만 허용 → 한글 조사("에", "에서" 등)가 URL에 붙지 않음
  var RE = new RegExp(
    '(?:https?:\\/\\/)?(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+(?:' + TLD + ')(?![a-z])' +
    '(?:\\/[A-Za-z0-9\\-._~:\\/?#\\[\\]@!$&\'*+,;=%]*)?',
    'gi'
  );
  var SKIP = { A: 1, CODE: 1, PRE: 1, SCRIPT: 1, STYLE: 1, BUTTON: 1, TEXTAREA: 1, KBD: 1, SAMP: 1 };

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function replaceNode(node) {
    var text = node.nodeValue;
    RE.lastIndex = 0;
    var frag = null, last = 0, m;
    while ((m = RE.exec(text))) {
      var url = m[0];
      var start = m.index;

      // 앞 글자가 영숫자/@/./-/ 면 단어 중간·이메일·기존 URL 일부 → 건너뜀
      var prev = start > 0 ? text.charAt(start - 1) : '';
      if (prev === '@' || prev === '/' || prev === '.' || prev === '-' || /[a-z0-9]/i.test(prev)) continue;

      // 뒤따르는 문장부호는 링크에서 제외
      var trail = url.match(/[.,;:!?)\]}'"]+$/);
      if (trail) url = url.slice(0, -trail[0].length);
      if (!url) continue;

      if (!frag) frag = document.createDocumentFragment();
      frag.appendChild(document.createTextNode(text.slice(last, start)));

      var a = document.createElement('a');
      a.href = /^https?:\/\//i.test(url) ? url : 'https://' + url;
      a.textContent = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      frag.appendChild(a);

      last = start + url.length; // 잘라낸 문장부호는 다음 텍스트 조각으로 남김
    }
    if (!frag) return;
    frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(frag, node);
  }

  ready(function () {
    var root = document.querySelector('main');
    if (!root) return;

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || node.nodeValue.indexOf('.') < 0) return NodeFilter.FILTER_REJECT;
        for (var p = node.parentNode; p && p !== root.parentNode; p = p.parentNode) {
          if (p.nodeType === 1 && SKIP[p.nodeName]) return NodeFilter.FILTER_REJECT;
        }
        RE.lastIndex = 0;
        return RE.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });

    var targets = [], n;
    while ((n = walker.nextNode())) targets.push(n);
    for (var i = 0; i < targets.length; i++) replaceNode(targets[i]);
  });
})();
