import { fetchSensorData } from './api/index.js';
import { padBounds } from './heatmap/bounds.js';
import { createHeatmapMap } from './map/heatmapMap.js';
import { legendScaleFor, renderLegend, renderPollutantToggle } from './ui/controls.js';

import type { PollutantKey } from './api/index.js';

const INITIAL_POLLUTANT: PollutantKey = 'co2';
/** 측정소 최대/최소 범위에 더하는 여유 (각 방향 폭의 비율) */
const BOUNDS_PADDING_RATIO = 0.2;

function requireElement(id: string): HTMLElement {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`#${id} 요소가 없습니다.`);
  }
  return element;
}

function formatMeasuredAt(iso: string | null): string {
  if (!iso) {
    return '측정시각 없음';
  }
  return new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Seoul' }).format(
    new Date(iso),
  );
}

async function bootstrap(): Promise<void> {
  const status = requireElement('status');
  try {
    const dataset = await fetchSensorData();
    if (dataset.warnings.length > 0) {
      console.warn('[sensor] 파싱 경고', dataset.warnings);
    }

    const heatmap = createHeatmapMap(requireElement('map'), dataset, {
      initialKey: INITIAL_POLLUTANT,
      fieldBounds: padBounds(dataset.bounds, BOUNDS_PADDING_RATIO),
    });
    const legend = requireElement('legend');
    renderLegend(legend, legendScaleFor(dataset, INITIAL_POLLUTANT));
    renderPollutantToggle(requireElement('pollutant-toggle'), INITIAL_POLLUTANT, (key) => {
      heatmap.setPollutant(key);
      renderLegend(legend, legendScaleFor(dataset, key));
    });

    const latest = dataset.stations.map((s) => s.measuredAt).filter((t): t is string => t !== null).sort().at(-1);
    status.textContent = `측정소 ${dataset.stations.length}곳 · ${formatMeasuredAt(latest ?? null)}`;
  } catch (error) {
    console.error('[sensor] 데이터 로드 실패', error);
    status.textContent = error instanceof Error ? error.message : '데이터를 불러오지 못했습니다.';
    status.dataset.state = 'error';
  }
}

void bootstrap();
