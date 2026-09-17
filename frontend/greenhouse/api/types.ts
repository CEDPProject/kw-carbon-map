/** 히트맵에 표출하는 오염물질. API 의 `nameEng` 값과 동일하다. */
export type PollutantKey = 'co2' | 'ch4';

/** 범례 4단계. 값이 클수록 나쁘다(0 = 매우좋음, 3 = 매우나쁨). */
export type AirLevel = 'VERY_GOOD' | 'GOOD' | 'BAD' | 'VERY_BAD';

export interface PollutantReading {
  key: PollutantKey;
  /** 측정값. `"NA"` 등 숫자가 아니면 null */
  value: number | null;
  unit: string;
  /** 판정에 쓴 등급 경계값 (POLLUTANT_THRESHOLDS). API 의 criteria 는 사용하지 않는다. */
  criteria: readonly number[];
  /**
   * 보간용 연속 점수 0 … 4. 구간 i 는 [i, i+1) 이며 AIR_LEVELS[i] 에 대응한다.
   * - 측정값이 있으면 경계값 사이의 위치(연속값), 마지막 경계 이상은 4 로 포화
   * - 측정값이 없으면 API grade 가 가리키는 단계의 중앙값
   */
  score: number;
  /** 'value' = 측정값 + 경계값, 'grade' = 측정값이 없어 API grade 로 대체 */
  scoreSource: 'value' | 'grade';
  /** API grade 로 본 단계가 경계값 판정과 다른가 (참고용) */
  gradeConflictsValue: boolean;
  level: AirLevel;
  /** API 원본 grade (1…4). 없으면 null */
  grade: number | null;
  /** API 원본 index 텍스트 (디버깅/툴팁용) */
  rawIndex: string;
}

export interface Station {
  serial: string;
  name: string;
  lat: number;
  lon: number;
  address: string;
  /** ISO 8601 (KST, +09:00). 파싱 불가 시 null */
  measuredAt: string | null;
  pollutants: Record<PollutantKey, PollutantReading | null>;
}

export interface GeoBounds {
  west: number;
  south: number;
  east: number;
  north: number;
}

export interface SensorDataset {
  stations: Station[];
  /** 전체 측정소 좌표의 최소/최대 */
  bounds: GeoBounds;
  /** 파싱은 계속했지만 확인이 필요한 항목 (알 수 없는 index 텍스트, 좌표 누락 등) */
  warnings: string[];
}
