import { parseSensorResponse, SensorResponseError } from './parseSensorResponse.js';
import {
  MOCK_PATH,
  SENSOR_API_PATH,
  SENSOR_SOURCE,
  SENSOR_USER_ID,
  SENSOR_USER_TYPE,
} from '../config.js';

import type { SensorDataset } from './types.js';

export interface SensorRequest {
  userId: string;
  userType: string;
}

export interface FetchSensorOptions {
  request?: SensorRequest;
  signal?: AbortSignal;
}

export function defaultSensorRequest(): SensorRequest {
  return {
    userId: SENSOR_USER_ID,
    userType: SENSOR_USER_TYPE,
  };
}

function requestFailureMessage(status: number): string {
  if (status === 401 || status === 403) {
    return `센서 API 인증 실패 (HTTP ${status}): 서버 .env 의 API_KEY 를 확인하세요.`;
  }
  return `센서 API 요청 실패: HTTP ${status}`;
}

async function requestRaw({ request = defaultSensorRequest(), signal }: FetchSensorOptions): Promise<Response> {
  if (SENSOR_SOURCE === 'mock') {
    return fetch(MOCK_PATH, { signal, headers: { Accept: 'application/json' } });
  }
  return fetch(SENSOR_API_PATH, {
    method: 'POST',
    signal,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
}

/** Air365 last-all API 호출 → 정형화된 SensorDataset 반환 */
export async function fetchSensorData(options: FetchSensorOptions = {}): Promise<SensorDataset> {
  const response = await requestRaw(options);
  if (!response.ok) {
    throw new SensorResponseError(requestFailureMessage(response.status));
  }
  const json: unknown = await response.json();
  return parseSensorResponse(json);
}
