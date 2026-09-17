import { describe, expect, test } from 'vitest';

import {
  levelFromScore,
  POLLUTANT_THRESHOLDS,
  scoreFromThresholds,
} from '../../frontend/greenhouse/api';

const CO2 = POLLUTANT_THRESHOLDS.co2;
const CH4 = POLLUTANT_THRESHOLDS.ch4;

describe('POLLUTANT_THRESHOLDS', () => {
  test('CO₂ 매우좋음 <450 / 좋음 <520 / 나쁨 <650 / 매우나쁨 650 이상', () => {
    expect(CO2).toEqual([0, 450, 520, 650]);
  });

  test('CH₄ 매우좋음 <2.10 / 좋음 <2.40 / 나쁨 <3.00 / 매우나쁨 3.00 이상', () => {
    expect(CH4).toEqual([0, 2.1, 2.4, 3.0]);
  });
});

describe('scoreFromThresholds', () => {
  test.each([
    [0, 0],
    [225, 0.5],
    [450, 1],
    [485, 1.5],
    [520, 2],
    [585, 2.5],
    [636, 2 + 116 / 130],
    [649, 2 + 129 / 130],
    [650, 4],
    [5000, 4],
    [-10, 0],
  ])('CO₂ %d ppm → score %f', (value, score) => {
    expect(scoreFromThresholds(value, CO2)).toBeCloseTo(score, 5);
  });

  test.each([
    [0, 'VERY_GOOD'],
    [449, 'VERY_GOOD'],
    [450, 'GOOD'],
    [519, 'GOOD'],
    [520, 'BAD'],
    [649, 'BAD'],
    [650, 'VERY_BAD'],
    [10000, 'VERY_BAD'],
  ])('CO₂ %d ppm → %s', (value, level) => {
    expect(levelFromScore(scoreFromThresholds(value, CO2))).toBe(level);
  });

  test.each([
    [0, 'VERY_GOOD'],
    [2.09, 'VERY_GOOD'],
    [2.1, 'GOOD'],
    [2.39, 'GOOD'],
    [2.4, 'BAD'],
    [2.99, 'BAD'],
    [3, 'VERY_BAD'],
    [100, 'VERY_BAD'],
  ])('CH₄ %f ppm → %s', (value, level) => {
    expect(levelFromScore(scoreFromThresholds(value, CH4))).toBe(level);
  });

  test('마지막 경계 이상은 상한 없이 최대 점수로 포화한다', () => {
    expect(scoreFromThresholds(650, CO2)).toBe(scoreFromThresholds(1_000_000, CO2));
  });
});
