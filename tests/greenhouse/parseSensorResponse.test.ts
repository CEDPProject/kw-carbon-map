import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

import {
  levelFromGrade,
  parseSensorResponse,
  POLLUTANT_THRESHOLDS,
  SensorResponseError,
} from '../../frontend/greenhouse/api';

const fixture: unknown = JSON.parse(
  readFileSync(new URL('../../public/data/greenhouse/response.json', import.meta.url), 'utf8'),
);

/** API 가 함께 주는 criteria. 실제 등급 기준과 달라 무시되어야 한다. */
const API_CRITERIA = [0, 500, 1000, 1500, 10000];

function element(nameEng: string, grade: unknown, value: unknown = 1, index = '') {
  return { nameEng, grade, index, value, unit: 'ppm', criteria: API_CRITERIA };
}

function station(serial: string, lat: unknown, lon: unknown, sensor: Record<string, unknown> = {}) {
  return { device: { serial, stationName: `st-${serial}`, lat, lon }, sensor };
}

describe('levelFromGrade', () => {
  test.each([
    [1, 'VERY_GOOD'],
    [2, 'GOOD'],
    [3, 'BAD'],
    [4, 'VERY_BAD'],
  ])('grade %d → %s', (grade, level) => {
    expect(levelFromGrade(grade)).toBe(level);
  });

  test.each([0, 5, 1.5, 'NA', '', null, undefined])('rejects %j', (grade) => {
    expect(levelFromGrade(grade)).toBeNull();
  });
});

describe('parseSensorResponse', () => {
  test('throws on API error envelope', () => {
    expect(() => parseSensorResponse({ error: 1, message: '실패', data: {} })).toThrow(SensorResponseError);
  });

  test('throws when data is missing', () => {
    expect(() => parseSensorResponse({ error: 0 })).toThrow(SensorResponseError);
  });

  test('reads co2 from element and ch4 from elementAddition', () => {
    const raw = {
      error: 0,
      data: {
        A: station('A', 35.1, 129.0, {
          timestamp: '202609140927',
          element: [element('co2', 1, 320, '좋음')],
          elementAddition: [element('ch4', 'NA', 'NA', 'NA')],
        }),
      },
    };
    const [parsed] = parseSensorResponse(raw).stations;
    expect(parsed?.measuredAt).toBe('2026-09-14T09:27:00+09:00');
    expect(parsed?.pollutants.co2).toMatchObject({ value: 320, grade: 1, level: 'VERY_GOOD' });
    expect(parsed?.pollutants.ch4).toMatchObject({ value: null, grade: null, level: 'VERY_GOOD' });
  });

  describe('등급 판정', () => {
    function readingFor(grade: unknown, value: unknown) {
      const raw = { error: 0, data: { A: station('A', 35.1, 129.0, { element: [element('co2', grade, value)] }) } };
      const dataset = parseSensorResponse(raw);
      return { reading: dataset.stations[0]?.pollutants.co2, warnings: dataset.warnings };
    }

    test('API 의 criteria 대신 고정 경계값을 쓴다', () => {
      expect(readingFor(1, 320).reading?.criteria).toEqual(POLLUTANT_THRESHOLDS.co2);
    });

    test('측정값이 있으면 경계값으로 판정한다', () => {
      expect(readingFor(1, 320).reading).toMatchObject({
        score: 320 / 450,
        scoreSource: 'value',
        gradeConflictsValue: false,
        level: 'VERY_GOOD',
      });
    });

    test('grade 가 경계값 판정과 달라도 경계값을 따르고 경고를 남긴다', () => {
      // 636ppm 은 API criteria 로는 "보통"(grade 2) 이지만 실제 기준으로는 나쁨이다.
      const { reading, warnings } = readingFor(2, 636);
      expect(reading).toMatchObject({
        score: 2 + 116 / 130,
        scoreSource: 'value',
        gradeConflictsValue: true,
        level: 'BAD',
      });
      expect(warnings).toHaveLength(1);
    });

    test('마지막 경계 이상은 매우나쁨으로 포화한다', () => {
      expect(readingFor(4, 5000).reading).toMatchObject({ score: 4, level: 'VERY_BAD' });
    });

    test('측정값이 없으면 grade 로 대체한다', () => {
      expect(readingFor(3, 'NA').reading).toMatchObject({
        score: 2.5,
        scoreSource: 'grade',
        gradeConflictsValue: false,
        level: 'BAD',
      });
    });

    test('측정값도 grade 도 없으면 매우좋음으로 두고 경고한다', () => {
      const { reading, warnings } = readingFor('NA', 'NA');
      expect(reading).toMatchObject({ score: 0.5, scoreSource: 'grade', level: 'VERY_GOOD' });
      expect(warnings).toHaveLength(1);
    });
  });

  test('skips stations without coordinates and records a warning', () => {
    const raw = {
      error: 0,
      data: { A: station('A', 35.1, 129.0), B: station('B', null, 129.1) },
    };
    const dataset = parseSensorResponse(raw);
    expect(dataset.stations.map((s) => s.serial)).toEqual(['A']);
    expect(dataset.warnings).toHaveLength(1);
  });

  test('computes bounds from min/max coordinates', () => {
    const raw = {
      error: 0,
      data: { A: station('A', 35.0, 129.2), B: station('B', 35.3, 128.9) },
    };
    expect(parseSensorResponse(raw).bounds).toEqual({ west: 128.9, south: 35.0, east: 129.2, north: 35.3 });
  });

  test('parses the sample response.json', () => {
    const dataset = parseSensorResponse(fixture);
    const levels = (key: 'co2' | 'ch4', level: string) =>
      dataset.stations.filter((s) => s.pollutants[key]?.level === level).length;

    expect(dataset.stations).toHaveLength(20);
    // CO₂ 614~636ppm 4곳은 API 가 "보통"(grade 2) 으로 주지만 실제 기준으로는 나쁨이다.
    expect(levels('co2', 'VERY_GOOD')).toBe(15);
    expect(levels('co2', 'GOOD')).toBe(1);
    expect(levels('co2', 'BAD')).toBe(4);
    // CH₄ 0ppm 19곳은 grade 4 로 오지만 실제 기준으로는 매우좋음이다.
    expect(levels('ch4', 'VERY_GOOD')).toBe(19);
    expect(levels('ch4', 'VERY_BAD')).toBe(1);
    // co2 측정값 없음 1곳 + grade 불일치 24곳
    expect(dataset.warnings).toHaveLength(25);
    expect(dataset.stations.filter((s) => s.pollutants.co2?.scoreSource === 'grade')).toHaveLength(1);
    expect(dataset.bounds).toEqual({ west: 128.957912, south: 35.05011443, east: 129.0075609, north: 35.103943 });
    expect(dataset.stations.every((s) => s.pollutants.co2 && s.pollutants.ch4)).toBe(true);
  });
});
