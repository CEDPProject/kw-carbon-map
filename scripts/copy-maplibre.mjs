/**
 * node_modules/maplibre-gl/dist 의 배포 파일을 public/js/lib/maplibre 로 복사한다.
 *
 * 이 프로젝트는 프론트엔드 번들러가 없어 브라우저가 직접 파일을 받아간다.
 * dist 의 파일 배치를 그대로 유지해야 다음 두 가지가 성립한다.
 *   1. maplibre-gl.mjs 가 상대경로로 maplibre-gl-shared.mjs 를 불러온다.
 *   2. 워커를 import.meta.url 기준으로 찾으므로 maplibre-gl-worker.mjs 가 자동 해석된다.
 *      (원본 archaive 의 setWorkerUrl shim 이 필요 없는 이유)
 *
 * 실행: npm run sync:maplibre
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FROM = join(ROOT, 'node_modules', 'maplibre-gl', 'dist');
const TO = join(ROOT, 'public', 'js', 'lib', 'maplibre');

/** .map 파일(합계 약 5MB)은 커밋하지 않으므로 참조 주석을 지워 개발자도구 404 를 막는다. */
const SCRIPTS = ['maplibre-gl.mjs', 'maplibre-gl-shared.mjs', 'maplibre-gl-worker.mjs'];
const ASSETS = ['maplibre-gl.css'];

mkdirSync(TO, { recursive: true });

for (const name of SCRIPTS) {
  const code = readFileSync(join(FROM, name), 'utf8').replace(/\n?\/\/# sourceMappingURL=.*\s*$/, '\n');
  writeFileSync(join(TO, name), code);
}
for (const name of ASSETS) {
  copyFileSync(join(FROM, name), join(TO, name));
}

const version = JSON.parse(readFileSync(join(ROOT, 'node_modules', 'maplibre-gl', 'package.json'), 'utf8')).version;
writeFileSync(join(TO, 'VERSION'), `maplibre-gl ${version}\n`);
console.log(`maplibre-gl ${version} → public/js/lib/maplibre (${SCRIPTS.length + ASSETS.length} files)`);
