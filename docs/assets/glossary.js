/* 용어집 링크 — 본문의 <code> 용어 칩(흰 박스·빨간 글씨)을 메인 페이지 용어집으로 연결.
   규칙:
   - 칩 '전체 텍스트'가 아래 용어와 정확히 일치할 때만 링크 (부분 일치·문장 중간 매칭 없음)
   - 페이지당 각 용어의 '첫 등장' 칩만 링크
   - 이미 <a> 안에 있거나 용어집(#glossary) 내부의 칩은 제외
   - 'API Key' 등 값·명령어·파일명 토큰은 목록에 없으므로 자동 제외 */
(function () {
  'use strict';

  // 칩 텍스트(소문자) → { id: 용어집 앵커, desc: 툴팁 설명 }
  var TERMS = {
    '.env':            { id: 'g-env',            desc: 'API 키 같은 비밀 값을 코드와 분리해 보관하는 파일.' },
    '.gitignore':      { id: 'g-gitignore',      desc: 'Git이 저장소에 올리지 않을 파일 목록.' },
    'node.js':         { id: 'g-nodejs',         desc: '브라우저 밖에서도 자바스크립트를 실행하게 해주는 도구.' },
    'npm':             { id: 'g-npm',            desc: 'Node.js용 프로그램(패키지)을 설치·관리하는 도구.' },
    'git':             { id: 'g-git',            desc: '파일 변경 이력을 기록·관리하는 버전 관리 도구.' },
    'github':          { id: 'g-github',         desc: 'Git 저장소를 인터넷에 올려 보관·공유하는 서비스.' },
    'vercel':          { id: 'g-vercel',         desc: '웹페이지를 인터넷 주소로 올려주는 배포·호스팅 서비스.' },
    'localhost':       { id: 'g-localhost',      desc: '인터넷이 아니라 내 컴퓨터 안에서만 도는 상태/주소.' },
    'mcp':             { id: 'g-mcp',            desc: 'AI가 외부 도구·데이터에 연결되게 하는 표준 규격.' },
    'rag':             { id: 'g-rag',            desc: '내 문서를 근거로 답하게 하는 방식.' },
    'prd':             { id: 'g-prd',            desc: '무엇을 왜 어떻게 만들지 정리한 제품요구사항 문서.' },
    'pdca':            { id: 'g-pdca',           desc: '계획-실행-점검-개선을 반복하며 완성해 가는 방법론.' },
    'claude desktop':  { id: 'g-claude-desktop', desc: '내 컴퓨터에 설치해 쓰는 Claude 앱(파일·도구 연결 가능).' },
    'claude code':     { id: 'g-claude-code',    desc: '코드를 읽고 쓰고 실행하는 Claude 개발 도구.' }
  };

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var root = document.querySelector('main') || document.querySelector('.wrap');
    if (!root) return;

    // 용어집 페이지(glossary.html)면 같은 문서 앵커, 아니면 용어집 페이지로 이동
    var onGlossary = !!document.getElementById('glossary');
    var base = onGlossary ? ''
             : (/\/day\d/.test(location.pathname) ? '../glossary.html' : 'glossary.html');
    var seen = {};

    var codes = root.querySelectorAll('code');
    for (var i = 0; i < codes.length; i++) {
      var el = codes[i];
      if (el.closest('a') || el.closest('#glossary')) continue; // 기존 링크·용어집 내부 제외

      var key = (el.textContent || '').trim().toLowerCase();
      var t = TERMS[key];
      if (!t) continue;
      if (seen[t.id]) continue;   // 페이지당 첫 등장만
      seen[t.id] = 1;

      var a = document.createElement('a');
      a.className = 'gloss-term';
      a.href = base + '#' + t.id;
      a.title = t.desc + '  (눌러서 용어집에서 보기)';
      if (!onGlossary) { a.target = '_blank'; a.rel = 'noopener'; } // 다른 문서면 새 탭(읽던 위치 유지)
      el.parentNode.insertBefore(a, el);
      a.appendChild(el);
    }

    // 스타일 주입(각 페이지 CSS를 건드리지 않기 위해 스크립트에서 삽입)
    var css = 'a.gloss-term{text-decoration:none}' +
              'a.gloss-term code{border-bottom:1px dashed #cf222e;cursor:pointer}' +
              'a.gloss-term:hover code{background:#ffeef0;border-bottom-style:solid}';
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
  });
})();
