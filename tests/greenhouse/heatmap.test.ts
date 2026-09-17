import { describe, expect, test } from 'vitest';

import { colorForScore, hexToRgb, lutIndexForScore } from '../../frontend/greenhouse/heatmap/colorRamp';
import { gridSizeForBounds, interpolateIdw } from '../../frontend/greenhouse/heatmap/interpolate';

const bounds = { west: 0, south: 0, east: 1, north: 1 };

describe('interpolateIdw', () => {
  test('returns exact sample values at sample positions', () => {
    const grid = interpolateIdw(
      [
        { lon: 0, lat: 1, value: 0 },
        { lon: 1, lat: 0, value: 3 },
      ],
      bounds,
      { width: 3, height: 3 },
    );
    expect(grid.values[0]).toBe(0); // north-west corner
    expect(grid.values[8]).toBe(3); // south-east corner
    expect(grid.values[4]).toBeCloseTo(1.5, 1); // equidistant centre
  });

  test('stays within the sample value range', () => {
    const grid = interpolateIdw(
      [
        { lon: 0.2, lat: 0.3, value: 1 },
        { lon: 0.8, lat: 0.6, value: 2 },
      ],
      bounds,
      { width: 16, height: 16 },
    );
    expect(Math.min(...grid.values)).toBeGreaterThanOrEqual(1);
    expect(Math.max(...grid.values)).toBeLessThanOrEqual(2);
  });
});

describe('gridSizeForBounds', () => {
  test('keeps the long side and preserves aspect ratio', () => {
    expect(gridSizeForBounds({ west: 0, south: 0, east: 2, north: 1 }, 100)).toEqual({ width: 100, height: 50 });
  });
});

describe('colorRamp', () => {
  test('hits legend colours exactly at band centres', () => {
    expect(colorForScore(0.5)).toEqual(hexToRgb('#4595FF'));
    expect(colorForScore(1.5)).toEqual(hexToRgb('#00D27A'));
    expect(colorForScore(2.5)).toEqual(hexToRgb('#FFA800'));
    expect(colorForScore(3.5)).toEqual(hexToRgb('#FF0000'));
  });

  test('blends neighbouring colours at a band boundary', () => {
    const [blue, green] = [hexToRgb('#4595FF'), hexToRgb('#00D27A')];
    expect(colorForScore(1)).toEqual(blue.map((c, i) => Math.round(c + ((green[i] ?? 0) - c) / 2)));
  });

  test('clamps to end colours outside the outer band centres', () => {
    expect(colorForScore(0)).toEqual(hexToRgb('#4595FF'));
    expect(colorForScore(4)).toEqual(hexToRgb('#FF0000'));
  });

  test('clamps lut index', () => {
    expect(lutIndexForScore(-1)).toBe(0);
    expect(lutIndexForScore(99)).toBe(255);
  });
});
