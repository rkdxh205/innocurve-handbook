/* 용어집 링크 — 본문의 <code> 용어 칩(흰 박스·빨간 글씨)을 메인 페이지 용어집으로 연결.
   규칙:
   - 칩 '전체 텍스트'가 아래 용어와 정확히 일치할 때만 링크 (부분 일치·문장 중간 매칭 없음)
   - 같은 용어가 여러 번 나와도 '모든 등장' 칩을 링크(중복 포함)
   - 이미 <a> 안에 있거나 용어집(#glossary) 내부의 칩은 제외
   - 목록에 없는 값·명령어·파일명 토큰은 자동 제외 */
(function () {
  'use strict';

  // 칩 텍스트(소문자) → { id: 용어집 앵커, desc: 툴팁 설명 }
  var TERMS = {
    'generative ai':   { id: 'g-genai',          desc: '기존 데이터를 분류·예측하는 데 그치지 않고 새 결과물을 만들어 내는 AI.' },
    'llm':             { id: 'g-llm',            desc: '방대한 글로 학습해 사람처럼 말을 이해하고 만들어 내는 AI 모델.' },
    'context':         { id: 'g-context',        desc: 'AI가 답을 만들 때 참고하는 대화·첨부 파일 같은 배경 정보.' },
    'hallucination':   { id: 'g-hallucination',  desc: 'AI가 사실이 아닌 내용을 그럴듯하게 지어내는 현상.' },
    'ai trend':        { id: 'g-ai-trend',       desc: '주요 AI 모델·서비스의 최신 동향.' },
    'prompt':          { id: 'g-prompt',         desc: 'AI에게 주는 지시문.' },
    'vibe coding':     { id: 'g-vibe',           desc: '자연어로 지시해 AI가 코드를 대신 짜게 하는 방식.' },
    'deploy':          { id: 'g-deploy',         desc: '내 컴퓨터의 결과물을 인터넷에 올려 누구나 접속할 수 있게 하는 것.' },
    'api key':         { id: 'g-apikey',         desc: '프로그램이 외부 AI·서비스를 불러 쓸 때 신원을 증명하는 비밀 열쇠.' },
    '.env':            { id: 'g-env',            desc: 'API 키 같은 비밀 값을 코드와 분리해 보관하는 파일.' },
    '.gitignore':      { id: 'g-gitignore',      desc: 'Git이 저장소에 올리지 않을 파일 목록.' },
    'html':            { id: 'g-html',           desc: '웹페이지의 구조를 만드는 마크업 언어(HyperText Markup Language).' },
    'setinterval':     { id: 'g-setinterval',    desc: '자바스크립트에서 정해진 시간마다 코드를 반복 실행하는 명령. 시계가 1초마다 스스로 갱신되게 합니다.' },
    'index.html':      { id: 'g-index',          desc: '웹사이트 접속 시 가장 먼저 열리는 시작 페이지.' },
    'api/chat.js':     { id: 'g-api-relay',      desc: '브라우저가 못 읽는 .env 키를 대신 읽어 OpenAI를 호출해 주는 작은 연결 파일. 키가 화면으로 노출되지 않게 함.' },
    'node.js':         { id: 'g-nodejs',         desc: '브라우저 밖에서도 자바스크립트를 실행하게 해주는 도구.' },
    'npm':             { id: 'g-npm',            desc: 'Node.js용 프로그램(패키지)을 설치·관리하는 도구.' },
    'git':             { id: 'g-git',            desc: '파일 변경 이력을 기록·관리하는 버전 관리 도구.' },
    'github':          { id: 'g-github',         desc: 'Git 저장소를 인터넷에 올려 보관·공유하는 서비스.' },
    'vercel':          { id: 'g-vercel',         desc: '웹페이지를 인터넷 주소로 올려주는 배포·호스팅 서비스.' },
    '서버리스 함수':     { id: 'g-serverless',     desc: '서버를 직접 관리하지 않아도 요청이 올 때만 잠깐 실행되는 코드 조각.' },
    'vercel dev':      { id: 'g-vercel-dev',     desc: '로컬에서 Vercel 개발 서버를 띄워 배포 전에 미리 보는 명령.' },
    'localhost':       { id: 'g-localhost',      desc: '인터넷이 아니라 내 컴퓨터 안에서만 도는 상태/주소.' },
    'http://localhost:3000': { id: 'g-localhost', desc: '내 컴퓨터에서만 도는 로컬 서버 미리보기 주소.' },
    'mcp':             { id: 'g-mcp',            desc: 'AI가 외부 도구·데이터에 연결되게 하는 표준 규격.' },
    'ai application':  { id: 'g-ai-app',         desc: '프로그램 안에 LLM을 얹어 "생각이 필요한 일"을 처리하는 프로그램.' },
    'rag':             { id: 'g-rag',            desc: '내 문서를 근거로 답하게 하는 방식.' },
    '청크(chunk)':      { id: 'g-chunk',          desc: '문서를 검색하기 좋은 크기로 나눈 조각.' },
    '임베딩(embedding)': { id: 'g-embedding',      desc: '글을 의미가 담긴 숫자(벡터)로 바꾼 것.' },
    '벡터 검색':         { id: 'g-vector-search',  desc: '임베딩끼리 비교해 의미가 가까운 청크를 찾는 검색 방식.' },
    '컨텍스트(context)': { id: 'g-context',        desc: 'AI가 답을 만들 때 참고하는 배경 정보·근거 조각.' },
    'prd':             { id: 'g-prd',            desc: '무엇을 왜 어떻게 만들지 정리한 제품요구사항 문서.' },
    'prd lite':        { id: 'g-prd-lite',       desc: '정식 PRD 전에 핵심만 다섯 항목으로 가볍게 정리하는 짧은 기획서.' },
    'review':          { id: 'g-review',         desc: 'PRD 초안을 AI에게 검토받아 빠진 것·모호한 것을 짚어 받는 것.' },
    'iterate':         { id: 'g-iterate',        desc: '초안→AI 피드백→보완을 반복하며 문서를 다듬는 과정.' },
    'pdca':            { id: 'g-pdca',           desc: '계획-실행-점검-개선을 반복하며 완성해 가는 방법론.' },
    'skill':           { id: 'g-skill',          desc: '반복 절차를 한 번 정의해 재사용하는 능력 꾸러미.' },
    'plugin':          { id: 'g-plugin',         desc: '명령·에이전트·스킬·MCP·훅을 묶은 확장 패키지.' },
    'harness':         { id: 'g-harness',        desc: '모델을 규칙·도구·절차·검증으로 둘러싸 안정적 결과를 내게 하는 틀.' },
    'claude.md':       { id: 'g-claude-md',      desc: '프로젝트 규칙을 적어 Claude Code가 매번 자동으로 읽는 마크다운 파일.' },
    '검증 루프':         { id: 'g-verify-loop',    desc: '통과할 때까지 반복 확인하게 만드는 절차(루프 엔지니어링).' },
    'hook':            { id: 'g-hook',           desc: '특정 사건에 자동 실행되어 검증이 빠지지 않게 하는 명령.' },
    'bkit':            { id: 'g-bkit',           desc: '이 과정에서 쓰는 하네스 플러그인(PDCA·스킬·서브에이전트 묶음).' },
    'my-app':          { id: 'g-myapp',          desc: '이 과정에서 만드는 내 앱(프로젝트)을 가리키는 이름.' },
    'slash 명령':       { id: 'g-slash',          desc: 'Claude Code에서 /이름 형태로 부르는 미리 정해진 명령.' },
    '/이름':            { id: 'g-slash',          desc: 'Claude Code 슬래시 명령을 부르는 형태(/이름).' },
    'subagent':        { id: 'g-subagent',       desc: '특정 일을 위임받아 대신 처리하는 보조 AI 일꾼.' },
    'plan':            { id: 'g-plan',           desc: 'PDCA 계획 단계. 작업 목록·순서를 정한 문서(PLAN.md).' },
    'plan.md':         { id: 'g-plan',           desc: 'PDCA 계획 단계 문서. 작업 목록·순서를 정함.' },
    'design':          { id: 'g-design',         desc: 'PDCA 설계 단계. 각 작업을 어떻게 구현할지 정한 문서(DESIGN.md).' },
    'design.md':       { id: 'g-design',         desc: 'PDCA 설계 단계 문서. 구조·데이터 흐름·화면을 정함.' },
    'gap 분석':         { id: 'g-gap',            desc: '설계와 구현의 차이(틈)를 찾는 작업. PDCA Check의 핵심 도구.' },
    'check.md':        { id: 'g-gap',            desc: 'PDCA 점검 단계 문서. 설계-구현 차이(Gap)를 기록.' },
    'mvp':             { id: 'g-mvp',            desc: '핵심 기능만 담아 가장 빠르게 만드는 최소 기능 제품.' },
    'prd.md':          { id: 'g-prd',            desc: '무엇을 왜 어떻게 만들지 정리한 제품요구사항 문서 파일.' },
    'prd_lite.md':     { id: 'g-prd-lite',       desc: '정식 PRD 전에 핵심만 가볍게 정리하는 짧은 기획서 파일.' },
    '.md':             { id: 'g-md',             desc: '제목·목록 등을 기호로 표시하는 마크다운 텍스트 문서 형식.' },
    'hello-page':      { id: 'g-hello-page',     desc: '이 과정의 실습 작업 폴더 이름.' },
    'api/':            { id: 'g-api-folder',     desc: '서버리스 함수(예: api/chat.js)를 두는 폴더. Vercel이 서버 기능으로 실행.' },
    '환경변수':          { id: 'g-env-var',        desc: '프로그램이 읽어 쓰는 설정 값. 배포에서는 Vercel 환경변수를 사용.' },
    'openai_api_key':  { id: 'g-apikey',         desc: 'OpenAI를 호출할 때 쓰는 비밀 API 키(환경변수 이름).' },
    'vercel login':    { id: 'g-vercel-cli',     desc: '터미널에서 Vercel에 로그인하는 명령.' },
    'vercel env add':  { id: 'g-vercel-cli',     desc: 'Vercel에 환경변수(비밀 키)를 등록하는 명령.' },
    'vercel --prod':   { id: 'g-vercel-cli',     desc: 'Vercel에 인터넷 공개(프로덕션) 배포하는 명령.' },
    'npm install':     { id: 'g-npm',            desc: '필요한 프로그램(패키지)을 내려받아 설치하는 명령.' },
    'node -v':         { id: 'g-nodejs',         desc: '설치된 Node.js 버전을 확인하는 명령.' },
    'git --version':   { id: 'g-git',            desc: '설치된 Git 버전을 확인하는 명령.' },
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

    var codes = root.querySelectorAll('code');
    for (var i = 0; i < codes.length; i++) {
      var el = codes[i];
      if (el.closest('a') || el.closest('#glossary')) continue; // 기존 링크·용어집 내부 제외

      var key = (el.textContent || '').trim().toLowerCase();
      var t = TERMS[key];
      if (!t) continue;

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
