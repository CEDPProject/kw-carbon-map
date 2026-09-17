import type { GeoBounds } from '../api/index.js';

/**
 * 각 방향으로 가로/세로 폭의 ratio 만큼 범위를 넓힌다.
 * 예) ratio 0.2 → 좌우 각각 경도 폭의 20%, 상하 각각 위도 폭의 20%
 */
export function padBounds(bounds: GeoBounds, ratio: number): GeoBounds {
  const lonPad = (bounds.east - bounds.west) * ratio;
  const latPad = (bounds.north - bounds.south) * ratio;
  return {
    west: bounds.west - lonPad,
    south: bounds.south - latPad,
    east: bounds.east + lonPad,
    north: bounds.north + latPad,
  };
}
