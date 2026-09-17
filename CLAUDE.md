# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

IITP 탄소·기후 환경 모니터링 플랫폼. TypeScript + Express.js 백엔드로 실내외 공기질(IAQ/OAQ) 센서 데이터를 수집·시각화한다. 외부 K-Weather API에서 센서 데이터를 가져와 MySQL에 저장된 장치/회원 정보와 결합하여 대시보드를 제공한다.

- `memberIdx: 14430` (iitp-livinglab)은 현재 하드코딩 상태 — 리팩토링 제안 불필요

## 명령어

```bash
npm run dev    # 개발 서버 (nodemon + ts-node-dev)
npm run prd    # 프로덕션 실행
npm run build  # TypeScript 빌드 → ./build/
```

## 주요 파일

| 파일                             | 역할                                                                       |
| -------------------------------- | -------------------------------------------------------------------------- |
| `src/index.ts`                   | Express 앱 진입점, 세션·CORS·정적 파일 설정                                |
| `config/database.ts`             | TypeORM DataSource (synchronize: false — 스키마 변경 시 수동 마이그레이션) |
| `src/entities/`                  | TypeORM 엔티티 (Device, Member, MemberDeviceManage 등)                     |
| `src/services/StationService.ts` | 센서 데이터 조회 서비스 (TypeORM 조회 → K-Weather API 호출 → 가공)         |
| `src/routes/api/info.ts`         | IAQ/OAQ 데이터 API (`GET /info/chartData`, `/info/tableData`)              |
| `public/`                        | 프론트엔드 정적 자산 (HTML/JS/CSS)                                         |
| `src/views/`                     | EJS 템플릿 (info 페이지만 사용)                                            |

## 온실가스 지도 (`/greenhouse`)

CO₂ / CH₄ 를 IDW 보간해 MapLibre GL 지도 위에 히트맵으로 표출한다. 별도 프로젝트(archaive)에서 이식했으며 **프론트엔드 번들러 없이** 동작한다.

| 위치 | 역할 |
| ---- | ---- |
| `frontend/greenhouse/` | TypeScript 원본 (수정은 반드시 여기서) |
| `public/js/greenhouse/` | `tsc` 산출물 — **커밋 대상** |
| `public/js/lib/maplibre/` | maplibre-gl dist 사본 — **커밋 대상** |
| `public/css/greenhouse.css` | 지도 페이지 스타일 |
| `public/html/greenhouse/index.html` | 페이지 (import map 으로 `maplibre-gl` 매핑) |
| `public/data/greenhouse/response.json` | 목업 응답 + 테스트 픽스처 |

```bash
npm run build:greenhouse   # frontend/greenhouse → public/js/greenhouse (TS 수정 후 필수)
npm run sync:maplibre      # maplibre-gl 버전 올린 뒤에만 실행
npm test                   # vitest — tests/greenhouse/
```

> ⚠️ Docker/Jenkins 는 프론트엔드를 빌드하지 않는다. `frontend/greenhouse/` 를 고치면 `npm run build:greenhouse` 를 실행해 산출물까지 함께 커밋해야 반영된다.

### 등급 기준

API 응답의 `criteria` / `grade` / `index` 는 실제 등급 기준과 다른 값으로 산출되므로 **사용하지 않는다**.
등급 경계값은 `frontend/greenhouse/api/criteria.ts` 의 `POLLUTANT_THRESHOLDS` 하나로 관리한다.

| 물질 | 매우좋음 | 좋음 | 나쁨 | 매우나쁨 |
| ---- | -------- | ---- | ---- | -------- |
| CO₂ | <450 ppm | <520 | <650 | 650 이상 |
| CH₄ | <2.10 ppm | <2.40 | <3.00 | 3.00 이상 |

판정 우선순위는 **측정값 + 경계값**이고, 측정값이 `NA` 일 때만 API `grade` 로 대체한다. 둘이 다르면 경계값을 따르고 `dataset.warnings` 에 기록한다.

데이터는 `POST /api/kweather/last-all` → 게이트웨이 `/iot/air365/v1/last-all` 로 프록시한다. 목업으로 전환하려면 `frontend/greenhouse/config.ts` 의 `SENSOR_SOURCE` 를 `'mock'` 으로 바꾼 뒤 재빌드한다.

## 엔티티 매핑

- `TB_DEVICE` / `TB_DEVICE_MODEL` — 센서 장치 정보
- `TB_MEMBER` — 사용자
- `TB_MEMBER_DEVICE_MANAGE` — 회원별 장치 매핑 (station_name 포함)
- `TB_MEMBER_DEVICE_CONTROL_MANAGE` — IAQ ↔ 환기장치 매핑

## K-Weather 외부 API

- Endpoint: `https://datacenter.kweather.co.kr/api/collection/v2/history`
- 호출 방식: axios
- 응답 가공 후 JSON 반환 (주요 필드는 `StationService.ts` 참고)

## 환경변수 (.env)

```
DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_SCHEMA
SERVER_PORT   (기본: 8080)
NODE_ENV
```

## 인증 / 접근 제어

- `/private/inner_private`, `/private/inner_service` → `api-key: kweather` 헤더 필수
- 그 외 → express-session 기반 (sessionTimeout: 120분)
- 미인증 접근 → `external_access_error.ejs` 렌더링

## 배포

Jenkins → Kaniko → Harbor Registry → K8s 매니페스트 자동 업데이트 → Slack 알림
