/* 공통 4일 로드맵 스텝퍼 — 모든 일차별 문서(day1~4) 상단에 자동 주입.
   현재 파일이 위치한 폴더(dayN)를 감지해 해당 일차를 active(파란 핀 + 깜빡임)로 표시한다.
   ★ 일차 정보/상태를 바꿀 곳은 아래 DAYS 배열 하나뿐. */
(function () {
  'use strict';

  var DAYS = [
    { n: 1, title: 'AI 개념과 환경 구축', desc: 'Node.js·Git·Claude Desktop 설치, 헬로페이지 배포', status: 'confirmed' },
    { n: 2, title: 'AI 앱 개념과 PRD 작성', desc: 'RAG 챗봇 이해, 내 앱 PRD 작성·검토', status: 'confirmed' },
    { n: 3, title: 'Claude Code 심화와 PDCA', desc: '스킬·플러그인·MCP·하네스, PRD 기반 계획·설계', status: 'confirmed' },
    { n: 4, title: 'PDCA 완성과 배포·발표', desc: 'Do·Check·Act로 앱 완성, Vercel 배포·발표·수료', status: 'confirmed' }
  ];

  var CSS = [
    '.rm-figure{margin:8px 0 34px;padding:0;}',
    '.rm-roadmap{position:relative;display:flex;justify-content:space-between;gap:6px;padding:6px 2px 4px;}',
    '.rm-roadmap::before{content:"";position:absolute;top:21px;left:9%;right:9%;height:2px;background:#d0d7de;z-index:0;}',
    '.rm-step{position:relative;z-index:1;flex:1;text-align:center;padding:0 6px;text-decoration:none;color:inherit;display:block;}',
    '.rm-step:hover .rm-title{color:#0969da;}',
    '.rm-circle{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12.5px;font-weight:700;margin:0 auto 10px;border:2px solid #d0d7de;background:#fff;color:#636c76;transition:transform .15s;}',
    '.rm-step.confirmed .rm-circle{border-color:#3b82f6;background:#3b82f6;color:#fff;}',
    '.rm-step.tbd .rm-circle{border-color:#d97706;background:#fff;color:#d97706;}',
    '.rm-step.active .rm-circle{border-color:#3b82f6;background:#3b82f6;color:#fff;position:relative;animation:rm-throb 1.1s ease-in-out infinite;}',
    '.rm-step.active .rm-circle::after{content:"";position:absolute;inset:-2px;border-radius:50%;border:2px solid #3b82f6;z-index:-1;animation:rm-ripple 1.4s ease-out infinite;}',
    '.rm-day{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#636c76;margin-bottom:4px;}',
    '.rm-step.active .rm-day{color:#3b82f6;}',
    '.rm-title{font-size:13.5px;font-weight:700;color:#1f2328;margin-bottom:6px;line-height:1.4;}',
    '.rm-desc{font-size:12px;color:#636c76;line-height:1.5;}',
    '.rm-badge{display:inline-block;margin-top:8px;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;letter-spacing:.03em;}',
    '.rm-step.confirmed .rm-badge{background:#ddf4ff;color:#0550ae;border:1px solid #a5d5f7;}',
    '.rm-step.tbd .rm-badge{background:#fff8c5;color:#7d4e00;border:1px solid #d4a72c;}',
    '@keyframes rm-throb{',
      '0%{transform:scale(1);box-shadow:0 0 6px 1px rgba(59,130,246,.5),0 0 0 0 rgba(59,130,246,.5);}',
      '45%{transform:scale(1.22);box-shadow:0 0 22px 7px rgba(59,130,246,.9),0 0 0 7px rgba(59,130,246,.2);}',
      '100%{transform:scale(1);box-shadow:0 0 6px 1px rgba(59,130,246,.5),0 0 0 0 rgba(59,130,246,.5);}',
    '}',
    '@keyframes rm-ripple{',
      '0%{transform:scale(1);opacity:.75;}',
      '100%{transform:scale(2.3);opacity:0;}',
    '}',
    '@media (prefers-reduced-motion: reduce){.rm-step.active .rm-circle{animation:none;box-shadow:0 0 0 4px rgba(59,130,246,.25);}.rm-step.active .rm-circle::after{animation:none;display:none;}}',
    '@media (max-width:640px){',
      '.rm-roadmap{flex-direction:column;gap:14px;}',
      '.rm-roadmap::before{display:none;}',
      '.rm-step{text-align:left;display:flex;align-items:center;flex-wrap:wrap;gap:4px 12px;padding:0;}',
      '.rm-circle{margin:0;flex-shrink:0;}',
      '.rm-day{width:100%;order:-1;margin:0 0 0 42px;}',
    '}'
  ].join('');

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var main = document.querySelector('main');
    if (!main || document.querySelector('.rm-roadmap')) return;

    var m = location.pathname.match(/day([1-5])/i);
    var active = m ? parseInt(m[1], 10) : 0;

    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var html = '<div class="rm-roadmap" role="img" aria-label="4일 로드맵 — 현재 Day ' + active + '">';
    for (var i = 0; i < DAYS.length; i++) {
      var d = DAYS[i];
      var cls = 'rm-step ' + d.status + (d.n === active ? ' active' : '');
      var href = '../day' + d.n + '/day' + d.n + '_Manual.html';
      var aria = d.n === active ? ' aria-current="page"' : '';
      html += '<a class="' + cls + '" href="' + href + '"' + aria + '>' +
        '<div class="rm-circle">' + d.n + '</div>' +
        '<div class="rm-day">Day ' + d.n + '</div>' +
        '<div class="rm-title">' + d.title + '</div>' +
        '<div class="rm-desc">' + d.desc + '</div>' +
      '</a>';
    }
    html += '</div>';

    var fig = document.createElement('figure');
    fig.className = 'rm-figure';
    fig.innerHTML = html;

    var subtitle = main.querySelector('.subtitle');
    if (subtitle) subtitle.parentNode.insertBefore(fig, subtitle.nextSibling);
    else main.insertBefore(fig, main.firstChild);
  });
})();
