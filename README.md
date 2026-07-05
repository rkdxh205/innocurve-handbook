# 내 이름 뉴스 알림 텔레그램 봇 만들기 — 5일 실습 핸드북

코딩 경험이 전혀 없는 정책 결정자도 5일이면 충분합니다. Claude와 함께, 내 이름이 들어간 뉴스를 자동으로 찾아 텔레그램으로 알려주는 봇을 PRD 작성부터 실제 배포까지 처음부터 끝까지 직접 완성하는 개인 실습형 핸드북입니다.

## Read it live
→ https://rkdxh205.github.io/innocurve-handbook/

## Contents

- **Day 1 — 환경 준비**: Claude.ai 가입, Claude Desktop·Cursor 설치, Claude Code 확장 연결, PRD(제품요구사항정의서) 작성
- **Day 2 — 텔레그램 봇 만들기**: BotFather로 봇 생성, 봇 토큰 발급, Telegram Bot API 기초(sendMessage·getUpdates)
- **Day 3 — 네이버 뉴스 API 연동**: 개발자센터 애플리케이션 등록, 뉴스검색 API 연동, 동명이인·중복 필터링
- **Day 4 — GitHub Actions 자동화 배포**: 저장소 생성, Secrets 등록, cron 스케줄로 하루 2회 자동 실행
- **Day 5 — 운영과 리더십 로드맵**: 오류 알림 설계, 셀프 리뷰, 보안 고려사항, 3–6–12개월 AI 도입 로드맵

각 Day는 **매뉴얼**(이론·빠른 참조)과 **실습 예시**(초·중·고급 시나리오)로 구성됩니다.

대상 버전: Claude.ai · Claude Desktop · Cursor · Claude Code 확장 · Telegram Bot API · 네이버 뉴스 검색 Open API · GitHub Actions — 2026년 7월 기준

Built with the Teach Me skill for Claude Code.
