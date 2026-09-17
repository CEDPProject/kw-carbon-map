import { buildColorLut, lutIndexForScore } from './colorRamp.js';
import { gridSizeForBounds, interpolateIdw } from './interpolate.js';

import type { GeoBounds, PollutantKey, SensorDataset } from '../api/index.js';
import type { ScalarGrid, ScalarSample } from './interpolate.js';

const GRID_LONG_SIDE = 512;
const COLOR_LUT = buildColorLut();

export function samplesFor(dataset: SensorDataset, key: PollutantKey): ScalarSample[] {
  return dataset.stations.flatMap((station) => {
    const reading = station.pollutants[key];
    if (!reading) {
      return [];
    }
    return [{ lon: station.lon, lat: station.lat, value: reading.score }];
  });
}

export function paintGrid(canvas: HTMLCanvasElement, grid: ScalarGrid): void {
  canvas.width = grid.width;
  canvas.height = grid.height;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas 2D 컨텍스트를 만들 수 없습니다.');
  }
  const image = context.createImageData(grid.width, grid.height);
  grid.values.forEach((score, pixel) => {
    const lut = lutIndexForScore(score) * 3;
    const offset = pixel * 4;
    image.data[offset] = COLOR_LUT[lut] ?? 0;
    image.data[offset + 1] = COLOR_LUT[lut + 1] ?? 0;
    image.data[offset + 2] = COLOR_LUT[lut + 2] ?? 0;
    image.data[offset + 3] = 255;
  });
  context.putImageData(image, 0, 0);
}

/** 선택한 물질의 보간 필드를 bounds 범위로 canvas 에 그린다. */
export function renderPollutantField(
  canvas: HTMLCanvasElement,
  dataset: SensorDataset,
  key: PollutantKey,
  bounds: GeoBounds,
): void {
  // bounds 밖의 측정소도 샘플로 포함해 가장자리 값이 끊기지 않게 한다.
  const size = gridSizeForBounds(bounds, GRID_LONG_SIDE);
  const grid = interpolateIdw(samplesFor(dataset, key), bounds, size);
  paintGrid(canvas, grid);
}
