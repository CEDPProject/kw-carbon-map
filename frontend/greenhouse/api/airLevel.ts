import type { AirLevel } from './types.js';

export interface AirLevelDefinition {
  level: AirLevel;
  label: string;
  color: string;
}

/** 범례 정의. 좋은 순서 → 나쁜 순서. API 의 grade 1…4 와 순서가 같다. */
export const AIR_LEVELS: readonly AirLevelDefinition[] = [
  { level: 'VERY_GOOD', label: '매우좋음', color: '#4595FF' },
  { level: 'GOOD', label: '좋음', color: '#00D27A' },
  { level: 'BAD', label: '나쁨', color: '#FFA800' },
  { level: 'VERY_BAD', label: '매우나쁨', color: '#FF0000' },
];

export const AIR_LEVEL_BY_KEY = Object.fromEntries(
  AIR_LEVELS.map((def) => [def.level, def]),
) as Readonly<Record<AirLevel, AirLevelDefinition>>;

/** 측정값도 grade 도 없을 때 적용하는 단계 */
export const FALLBACK_LEVEL: AirLevel = 'VERY_GOOD';

/**
 * API 의 grade(1…4) 를 범례 단계로 바꾼다.
 * grade 는 API 자체 criteria 로 산출되므로 측정값이 없을 때의 대체 수단으로만 쓴다.
 * 숫자가 아니거나 범위를 벗어나면 null.
 */
export function levelFromGrade(grade: unknown): AirLevel | null {
  const numeric = typeof grade === 'number' ? grade : Number(grade);
  if (!Number.isInteger(numeric) || numeric < 1 || numeric > AIR_LEVELS.length) {
    return null;
  }
  return AIR_LEVELS[numeric - 1]?.level ?? null;
}

/** grade 를 그대로 보존할 때 쓰는 정규화. 유효하지 않으면 null. */
export function toGrade(raw: unknown): number | null {
  const numeric = typeof raw === 'number' ? raw : Number(raw);
  return Number.isInteger(numeric) && numeric >= 1 && numeric <= AIR_LEVELS.length ? numeric : null;
}
