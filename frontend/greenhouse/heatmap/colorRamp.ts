import { AIR_LEVELS, LEVEL_COUNT } from '../api/index.js';

export type Rgb = readonly [number, number, number];

const RAMP_RESOLUTION = 256;

export function hexToRgb(hex: string): Rgb {
  const match = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!match) {
    throw new Error(`잘못된 hex 색상: ${hex}`);
  }
  const [, r = '0', g = '0', b = '0'] = match;
  return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
}

/**
 * 범례 색은 각 구간의 중앙(i + 0.5)에 두고 그 사이를 선형 보간한다.
 * 구간 경계(예: CO₂ 500ppm)에서 두 색이 반반 섞여 계단 없이 이어진다.
 */
export const COLOR_STOPS = AIR_LEVELS.map((def, i) => ({ score: i + 0.5, color: def.color, rgb: hexToRgb(def.color) }));
const MIN_SCORE = 0;
const MAX_SCORE = LEVEL_COUNT;

/** 연속 점수(0 … LEVEL_COUNT)에 해당하는 RGB. 첫/끝 중앙 바깥은 끝 색으로 고정 */
export function colorForScore(score: number): Rgb {
  const firstStop = COLOR_STOPS[0];
  const lastStop = COLOR_STOPS[COLOR_STOPS.length - 1];
  if (!firstStop || !lastStop) {
    return [0, 0, 0];
  }
  const clamped = Math.min(lastStop.score, Math.max(firstStop.score, score));
  for (let i = 1; i < COLOR_STOPS.length; i += 1) {
    const lower = COLOR_STOPS[i - 1];
    const upper = COLOR_STOPS[i];
    if (!lower || !upper || clamped > upper.score) {
      continue;
    }
    const t = (clamped - lower.score) / (upper.score - lower.score);
    return [
      Math.round(lower.rgb[0] + (upper.rgb[0] - lower.rgb[0]) * t),
      Math.round(lower.rgb[1] + (upper.rgb[1] - lower.rgb[1]) * t),
      Math.round(lower.rgb[2] + (upper.rgb[2] - lower.rgb[2]) * t),
    ];
  }
  return lastStop.rgb;
}

/** 픽셀마다 보간을 반복하지 않도록 미리 계산한 RGB 룩업 테이블 */
export function buildColorLut(resolution: number = RAMP_RESOLUTION): Uint8ClampedArray {
  const lut = new Uint8ClampedArray(resolution * 3);
  for (let i = 0; i < resolution; i += 1) {
    const score = MIN_SCORE + ((MAX_SCORE - MIN_SCORE) * i) / (resolution - 1);
    lut.set(colorForScore(score), i * 3);
  }
  return lut;
}

export function lutIndexForScore(score: number, resolution: number = RAMP_RESOLUTION): number {
  const t = (score - MIN_SCORE) / (MAX_SCORE - MIN_SCORE);
  return Math.round(Math.min(1, Math.max(0, t)) * (resolution - 1));
}
