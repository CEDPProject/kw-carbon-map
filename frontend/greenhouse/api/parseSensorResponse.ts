import { FALLBACK_LEVEL, levelFromGrade, toGrade } from './airLevel.js';
import { POLLUTANT_THRESHOLDS, scoreFromThresholds } from './criteria.js';
import { levelFromScore, scoreFromLevel } from './score.js';

import type { GeoBounds, PollutantKey, PollutantReading, SensorDataset, Station } from './types.js';

export const TARGET_POLLUTANTS: readonly PollutantKey[] = ['co2', 'ch4'];

/** 원본 응답이 계약을 어겨 데이터를 만들 수 없을 때 */
export class SensorResponseError extends Error {
  override name = 'SensorResponseError';
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/** "202609140927" → "2026-09-14T09:27:00+09:00" */
export function parseKstTimestamp(raw: unknown): string | null {
  const match = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/.exec(toText(raw));
  if (!match) {
    return null;
  }
  const [, year, month, day, hour, minute] = match;
  return `${year}-${month}-${day}T${hour}:${minute}:00+09:00`;
}

function findElement(sensor: UnknownRecord, key: PollutantKey): UnknownRecord | null {
  // CO₂ 는 element, CH₄ 는 elementAddition 에 들어있어 두 배열을 모두 본다.
  const lists = [sensor.element, sensor.elementAddition];
  for (const list of lists) {
    if (!Array.isArray(list)) {
      continue;
    }
    const found = list.find((item): item is UnknownRecord => isRecord(item) && item.nameEng === key);
    if (found) {
      return found;
    }
  }
  return null;
}

function parsePollutant(
  sensor: UnknownRecord,
  key: PollutantKey,
  serial: string,
  warnings: string[],
): PollutantReading | null {
  const element = findElement(sensor, key);
  if (!element) {
    return null;
  }
  const value = toFiniteNumber(element.value);
  const grade = toGrade(element.grade);
  const gradeLevel = levelFromGrade(element.grade);
  // API 의 criteria/grade 는 실제 등급 기준과 다른 값으로 산출되므로 고정 경계값을 쓴다.
  const criteria = POLLUTANT_THRESHOLDS[key];
  const base = { key, value, unit: toText(element.unit), criteria, grade, rawIndex: toText(element.index) };

  // 측정값이 있으면 경계값으로 직접 판정한다.
  if (value !== null) {
    const score = scoreFromThresholds(value, criteria);
    const level = levelFromScore(score);
    const conflicts = gradeLevel !== null && gradeLevel !== level;
    if (conflicts) {
      warnings.push(`[${serial}] ${key}: API grade ${grade} 와 경계값 판정(${level}) 이 달라 경계값을 따름`);
    }
    return { ...base, score, scoreSource: 'value', gradeConflictsValue: conflicts, level };
  }

  // 측정값이 없으면 API grade 로 대체한다.
  if (gradeLevel === null) {
    warnings.push(`[${serial}] ${key}: 측정값과 grade 가 모두 없음`);
  }
  const level = gradeLevel ?? FALLBACK_LEVEL;
  return { ...base, score: scoreFromLevel(level), scoreSource: 'grade', gradeConflictsValue: false, level };
}

function parseStation(serialKey: string, entry: unknown, warnings: string[]): Station | null {
  if (!isRecord(entry) || !isRecord(entry.device)) {
    warnings.push(`[${serialKey}] device 정보 없음 → 제외`);
    return null;
  }
  const { device } = entry;
  const lat = toFiniteNumber(device.lat);
  const lon = toFiniteNumber(device.lon);
  if (lat === null || lon === null) {
    warnings.push(`[${serialKey}] 좌표 없음 → 제외`);
    return null;
  }

  const serial = toText(device.serial) || serialKey;
  const sensor = isRecord(entry.sensor) ? entry.sensor : {};
  const pollutants = Object.fromEntries(
    TARGET_POLLUTANTS.map((key) => [key, parsePollutant(sensor, key, serial, warnings)]),
  ) as Record<PollutantKey, PollutantReading | null>;

  return {
    serial,
    name: toText(device.stationName) || serial,
    lat,
    lon,
    address: [device.state, device.city, device.city2].map(toText).filter(Boolean).join(' '),
    measuredAt: parseKstTimestamp(sensor.timestamp),
    pollutants,
  };
}

export function computeBounds(stations: readonly Pick<Station, 'lat' | 'lon'>[]): GeoBounds {
  if (stations.length === 0) {
    throw new SensorResponseError('좌표가 있는 측정소가 없어 범위를 계산할 수 없습니다.');
  }
  const lats = stations.map((s) => s.lat);
  const lons = stations.map((s) => s.lon);
  return {
    west: Math.min(...lons),
    south: Math.min(...lats),
    east: Math.max(...lons),
    north: Math.max(...lats),
  };
}

/**
 * 센서 API 원본 응답을 히트맵용 정형 데이터로 변환한다.
 * 봉투(error/data)가 깨졌으면 throw, 개별 측정소 문제는 warnings 에 기록하고 계속한다.
 */
export function parseSensorResponse(raw: unknown): SensorDataset {
  if (!isRecord(raw)) {
    throw new SensorResponseError('응답이 JSON 객체가 아닙니다.');
  }
  if (raw.error !== 0) {
    throw new SensorResponseError(`API 오류 (error=${String(raw.error)}): ${toText(raw.message)}`);
  }
  if (!isRecord(raw.data)) {
    throw new SensorResponseError('응답에 data 객체가 없습니다.');
  }

  const warnings: string[] = [];
  const stations = Object.entries(raw.data)
    .map(([serialKey, entry]) => parseStation(serialKey, entry, warnings))
    .filter((station): station is Station => station !== null);

  return { stations, bounds: computeBounds(stations), warnings };
}
