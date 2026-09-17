import { describe, expect, test } from 'vitest';

import { levelFromScore } from '../../frontend/greenhouse/api';

describe('levelFromScore', () => {
  test.each([
    [0, 'VERY_GOOD'],
    [0.99, 'VERY_GOOD'],
    [1, 'GOOD'],
    [2.5, 'BAD'],
    [3.2, 'VERY_BAD'],
    [4, 'VERY_BAD'],
  ])('score %d → %s', (score, level) => {
    expect(levelFromScore(score)).toBe(level);
  });
});
