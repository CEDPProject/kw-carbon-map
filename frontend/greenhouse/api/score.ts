import { AIR_LEVELS } from './airLevel.js';

import type { AirLevel } from './types.js';

/** 연속 점수 범위: 0 … LEVEL_COUNT. 구간 i(= AIR_LEVELS[i])는 [i, i+1) 이다. */
export const LEVEL_COUNT = AIR_LEVELS.length;

/** 측정값이 없어 grade 로 대체할 때 쓰는 대표 점수 (해당 구간의 중앙) */
export function scoreFromLevel(level: AirLevel): number {
  const index = AIR_LEVELS.findIndex((def) => def.level === level);
  return Math.max(0, index) + 0.5;
}

/** 연속 점수가 속한 범례 단계 */
export function levelFromScore(score: number): AirLevel {
  const index = Math.min(LEVEL_COUNT - 1, Math.max(0, Math.floor(score)));
  return AIR_LEVELS[index]?.level ?? 'VERY_GOOD';
}
