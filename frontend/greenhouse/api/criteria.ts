import { LEVEL_COUNT } from './score.js';

import type { PollutantKey } from './types.js';

/**
 * 등급 경계값 (오름차순, 단위 ppm).
 *
 * API 응답의 `criteria` 는 실제 등급 기준과 달라 사용하지 않는다.
 * (예: CO₂ 636ppm 을 API 는 "보통" 으로 주지만 실제 기준으로는 "나쁨")
 *
 * 경계 4개 = 닫힌 구간 3개 + 열린 마지막 구간.
 *   CO₂  매우좋음 <450, 좋음 <520, 나쁨 <650, 매우나쁨 650 이상
 *   CH₄  매우좋음 <2.10, 좋음 <2.40, 나쁨 <3.00, 매우나쁨 3.00 이상
 */
export const POLLUTANT_THRESHOLDS: Readonly<Record<PollutantKey, readonly number[]>> = {
  co2: [0, 450, 520, 650],
  ch4: [0, 2.1, 2.4, 3.0],
};

/** 범례 표기 자릿수. CH₄ 는 2.10 / 2.40 / 3.00 처럼 소수 두 자리로 맞춘다. */
export const THRESHOLD_FRACTION_DIGITS: Readonly<Record<PollutantKey, number>> = {
  co2: 0,
  ch4: 2,
};

/**
 * 측정값을 보간용 연속 점수 0 … LEVEL_COUNT 로 환산한다.
 *
 * 닫힌 구간 i 는 [i, i+1) 로 선형 보간하고, 마지막 경계 이상은 최댓값으로 포화시킨다.
 * 예) CO₂ 636 → 2 + (636-520)/130 = 2.89 (나쁨), 650 → 4 (매우나쁨)
 */
export function scoreFromThresholds(value: number, thresholds: readonly number[]): number {
  const first = thresholds[0] ?? 0;
  const last = thresholds[thresholds.length - 1] ?? first;
  if (value >= last) {
    return LEVEL_COUNT;
  }
  if (value <= first) {
    return 0;
  }
  for (let band = 0; band < thresholds.length - 1; band += 1) {
    const lower = thresholds[band] ?? first;
    const upper = thresholds[band + 1] ?? last;
    if (value < upper) {
      return band + (value - lower) / (upper - lower);
    }
  }
  return LEVEL_COUNT;
}
