/**
 * 원본(archaive)은 Vite 의 `import.meta.env` 로 주입받았지만,
 * 이 프로젝트는 번들러가 없어 빌드 타임 치환이 불가능하므로 상수로 고정한다.
 */

/** Express 프록시 경로. 서버(src/routes/api/kweather.ts)가 게이트웨이로 전달하며 api_key 를 붙인다. */
export const SENSOR_API_PATH = '/api/kweather/last-all';

/** 게이트웨이 미연결 상태에서 화면을 확인할 때 쓰는 고정 응답 (public/data/greenhouse/response.json) */
export const MOCK_PATH = '/greenhouse/response.json';

/** 'mock' 으로 바꾸면 MOCK_PATH 의 고정 응답을 읽는다. */
export const SENSOR_SOURCE: 'api' | 'mock' = 'api';

/** 조회 대상 계정. 서버 프록시가 동일 값을 강제하므로 여기 값은 참고용이다. */
export const SENSOR_USER_ID = 'busantp@btp.or.kr';
export const SENSOR_USER_TYPE = 'group';
