import { describe, expect, test } from 'vitest';

import { padBounds } from '../../frontend/greenhouse/heatmap/bounds';

describe('padBounds', () => {
  test('expands each side by ratio of the span', () => {
    const padded = padBounds({ west: 128, south: 35, east: 129, north: 35.5 }, 0.2);
    expect(padded.west).toBeCloseTo(127.8);
    expect(padded.east).toBeCloseTo(129.2);
    expect(padded.south).toBeCloseTo(34.9);
    expect(padded.north).toBeCloseTo(35.6);
  });

  test('returns the same bounds for ratio 0', () => {
    const bounds = { west: 1, south: 2, east: 3, north: 4 };
    expect(padBounds(bounds, 0)).toEqual(bounds);
  });
});
