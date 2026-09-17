import { AIR_LEVELS, LEVEL_COUNT, POLLUTANT_THRESHOLDS, THRESHOLD_FRACTION_DIGITS } from '../api/index.js';
import { COLOR_STOPS } from '../heatmap/colorRamp.js';

import type { PollutantKey, SensorDataset } from '../api/index.js';

export const POLLUTANT_OPTIONS: readonly { key: PollutantKey; label: string; unit: string }[] = [
  { key: 'co2', label: 'CO₂', unit: '이산화탄소' },
  { key: 'ch4', label: 'CH₄', unit: '메탄' },
];

export function renderPollutantToggle(
  container: HTMLElement,
  initialKey: PollutantKey,
  onChange: (key: PollutantKey) => void,
): void {
  const buttons = POLLUTANT_OPTIONS.map((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'toggle__option';
    button.setAttribute('aria-pressed', String(option.key === initialKey));
    const label = document.createElement('span');
    label.className = 'toggle__label';
    label.textContent = option.label;
    const sub = document.createElement('span');
    sub.className = 'toggle__sub';
    sub.textContent = option.unit;
    button.append(label, sub);
    return { option, button };
  });

  buttons.forEach(({ option, button }) => {
    button.addEventListener('click', () => {
      buttons.forEach((entry) => entry.button.setAttribute('aria-pressed', String(entry.option.key === option.key)));
      onChange(option.key);
    });
  });
  container.replaceChildren(...buttons.map((entry) => entry.button));
}

export interface LegendScale {
  /** 등급 경계값. 마지막 값은 열린 구간의 시작점이다. */
  criteria: readonly number[];
  unit: string;
  fractionDigits: number;
}

/** 선택한 물질의 등급 경계값과 단위 */
export function legendScaleFor(dataset: SensorDataset, key: PollutantKey): LegendScale {
  const reading = dataset.stations.map((s) => s.pollutants[key]).find((r) => r);
  return {
    criteria: POLLUTANT_THRESHOLDS[key],
    unit: reading?.unit ?? '',
    fractionDigits: THRESHOLD_FRACTION_DIGITS[key],
  };
}

export function renderLegend(container: HTMLElement, { criteria, unit, fractionDigits }: LegendScale): void {
  const labels = document.createElement('ol');
  labels.className = 'legend__labels';
  AIR_LEVELS.forEach((level) => {
    const item = document.createElement('li');
    item.style.setProperty('--level-color', level.color);
    item.textContent = level.label;
    labels.append(item);
  });

  // 지도와 같은 색 정지점(구간 중앙)을 써서 범례와 히트맵 색이 일치하게 한다.
  const gradient = document.createElement('div');
  gradient.className = 'legend__bar';
  const stops = COLOR_STOPS.map((stop) => `${stop.color} ${(stop.score / LEVEL_COUNT) * 100}%`);
  gradient.style.background = `linear-gradient(90deg, ${stops.join(', ')})`;

  const numberFormat = new Intl.NumberFormat('ko-KR', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  const ticks = document.createElement('div');
  ticks.className = 'legend__ticks';
  const lastIndex = criteria.length - 1;
  criteria.forEach((bound, i) => {
    const tick = document.createElement('span');
    // 경계값은 해당 등급 구간의 시작점이므로 점수 i 위치(= i / 4)에 놓는다.
    tick.style.left = `${(i / LEVEL_COUNT) * 100}%`;
    // 마지막 구간은 상한이 없다.
    tick.textContent = i === lastIndex ? `${numberFormat.format(bound)} 이상` : numberFormat.format(bound);
    ticks.append(tick);
  });

  const unitLabel = document.createElement('span');
  unitLabel.className = 'legend__unit';
  unitLabel.textContent = unit;

  container.replaceChildren(labels, gradient, ticks, unitLabel);
}
