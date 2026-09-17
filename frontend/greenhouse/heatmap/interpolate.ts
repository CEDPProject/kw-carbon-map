import type { GeoBounds } from '../api/index.js';

export interface ScalarSample {
  lon: number;
  lat: number;
  value: number;
}

export interface ScalarGrid {
  width: number;
  height: number;
  /** row-major, row 0 = 북쪽(north) 가장자리 */
  values: Float32Array;
}

export interface IdwOptions {
  width: number;
  height: number;
  /** 거리 가중 지수. 클수록 측정소 주변만 강조된다. */
  power?: number;
}

const DEFAULT_POWER = 2;
const COINCIDENT_EPSILON = 1e-12;

/** 위경도 차이를 대략적인 등거리 평면으로 보정하기 위한 경도 축척 */
function lonScaleAt(bounds: GeoBounds): number {
  const midLat = (bounds.north + bounds.south) / 2;
  return Math.cos((midLat * Math.PI) / 180);
}

/** 격자 크기를 bounds 의 실제 가로세로 비율에 맞춘다. */
export function gridSizeForBounds(bounds: GeoBounds, longSide: number): { width: number; height: number } {
  const lonSpan = Math.max(bounds.east - bounds.west, COINCIDENT_EPSILON) * lonScaleAt(bounds);
  const latSpan = Math.max(bounds.north - bounds.south, COINCIDENT_EPSILON);
  if (lonSpan >= latSpan) {
    return { width: longSide, height: Math.max(1, Math.round((longSide * latSpan) / lonSpan)) };
  }
  return { width: Math.max(1, Math.round((longSide * lonSpan) / latSpan)), height: longSide };
}

/** 역거리가중(IDW) 보간으로 산점 측정값을 연속 격자로 만든다. */
export function interpolateIdw(
  samples: readonly ScalarSample[],
  bounds: GeoBounds,
  { width, height, power = DEFAULT_POWER }: IdwOptions,
): ScalarGrid {
  const values = new Float32Array(width * height);
  if (samples.length === 0) {
    return { width, height, values };
  }

  const lonScale = lonScaleAt(bounds);
  const halfPower = power / 2;
  const lonStep = width > 1 ? (bounds.east - bounds.west) / (width - 1) : 0;
  const latStep = height > 1 ? (bounds.north - bounds.south) / (height - 1) : 0;

  for (let row = 0; row < height; row += 1) {
    const lat = bounds.north - row * latStep;
    for (let col = 0; col < width; col += 1) {
      const lon = bounds.west + col * lonStep;
      values[row * width + col] = weightedValueAt(samples, lon, lat, lonScale, halfPower);
    }
  }
  return { width, height, values };
}

function weightedValueAt(
  samples: readonly ScalarSample[],
  lon: number,
  lat: number,
  lonScale: number,
  halfPower: number,
): number {
  let weightSum = 0;
  let valueSum = 0;
  for (const sample of samples) {
    const dx = (sample.lon - lon) * lonScale;
    const dy = sample.lat - lat;
    const distanceSq = dx * dx + dy * dy;
    if (distanceSq < COINCIDENT_EPSILON) {
      return sample.value;
    }
    const weight = 1 / distanceSq ** halfPower;
    weightSum += weight;
    valueSum += weight * sample.value;
  }
  return valueSum / weightSum;
}
