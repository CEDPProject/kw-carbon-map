import { Map as MapLibreMap, NavigationControl, Popup } from "maplibre-gl";

import { AIR_LEVEL_BY_KEY, THRESHOLD_FRACTION_DIGITS } from "../api/index.js";
import { renderPollutantField } from "../heatmap/renderField.js";

import type { ImageSource, GeoJSONSource } from "maplibre-gl";
import type { GeoBounds, PollutantKey, PollutantReading, SensorDataset, Station } from "../api/index.js";

const BASEMAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
const FIELD_SOURCE_ID = "pollutant-field";
const FIELD_LAYER_ID = "pollutant-field";
const STATION_SOURCE_ID = "stations";
const STATION_LAYER_ID = "stations";
const FIELD_OPACITY = 0.72;
const FIT_PADDING_PX = 64;

type ImageCorners = [
  [number, number],
  [number, number],
  [number, number],
  [number, number],
];

function cornersOf(bounds: GeoBounds): ImageCorners {
  return [
    [bounds.west, bounds.north],
    [bounds.east, bounds.north],
    [bounds.east, bounds.south],
    [bounds.west, bounds.south],
  ];
}

function stationFeatures(
  dataset: SensorDataset,
  key: PollutantKey,
): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: "FeatureCollection",
    features: dataset.stations.flatMap((station) => {
      const reading = station.pollutants[key];
      if (!reading) {
        return [];
      }
      return [
        {
          type: "Feature",
          geometry: { type: "Point", coordinates: [station.lon, station.lat] },
          properties: {
            serial: station.serial,
            color: AIR_LEVEL_BY_KEY[reading.level].color,
          },
        },
      ];
    }),
  };
}

/** 팝업에 적는 등급 경계값. 범례와 같은 자릿수를 쓴다. 첫 값(0)은 하한이라 생략한다. */
function formatThresholds(reading: PollutantReading): string {
  const digits = THRESHOLD_FRACTION_DIGITS[reading.key];
  const format = new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return reading.criteria.slice(1).map((bound) => format.format(bound)).join(" / ");
}

function createPopupContent(station: Station, key: PollutantKey): HTMLElement {
  const reading = station.pollutants[key];
  const root = document.createElement("div");
  root.className = "station-popup";

  const title = document.createElement("strong");
  title.textContent = station.name;
  const address = document.createElement("span");
  address.className = "station-popup__meta";
  address.textContent = station.address;
  root.append(title, address);

  if (reading) {
    const level = AIR_LEVEL_BY_KEY[reading.level];
    const value = document.createElement("div");
    value.className = "station-popup__value";
    value.style.setProperty("--level-color", level.color);
    value.textContent = `${reading.value ?? "—"} ${reading.unit} · ${level.label}`;
    const raw = document.createElement("span");
    raw.className = "station-popup__meta";
    const basis =
      reading.scoreSource === "value"
        ? `등급 기준 ${formatThresholds(reading)} ${reading.unit}`
        : "측정값 없음 → API grade 사용";
    // API grade 는 자체 기준으로 산출돼 경계값 판정과 다를 수 있어 참고로만 덧붙인다.
    const note = reading.gradeConflictsValue ? ` · API 등급: ${reading.rawIndex}` : "";
    raw.textContent = `${basis}${note}`;
    root.append(value, raw);
  }
  return root;
}

export interface HeatmapMap {
  setPollutant(key: PollutantKey): void;
  destroy(): void;
}

export interface HeatmapMapOptions {
  initialKey: PollutantKey;
  /** 히트맵 이미지 범위 (측정소 좌표 최소/최대 + 여유) */
  fieldBounds: GeoBounds;
}

export function createHeatmapMap(
  container: HTMLElement,
  dataset: SensorDataset,
  { initialKey, fieldBounds }: HeatmapMapOptions,
): HeatmapMap {
  const stationsBySerial = new Map(dataset.stations.map((s) => [s.serial, s]));
  let activeKey = initialKey;

  const map = new MapLibreMap({
    container,
    style: BASEMAP_STYLE,
    bounds: [
      fieldBounds.west,
      fieldBounds.south,
      fieldBounds.east,
      fieldBounds.north,
    ],
    fitBoundsOptions: { padding: FIT_PADDING_PX },
    attributionControl: { compact: true },
  });
  map.addControl(new NavigationControl({ showCompass: false }), "bottom-right");

  const fieldCanvas = (): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    renderPollutantField(canvas, dataset, activeKey, fieldBounds);
    return canvas;
  };

  map.on("load", () => {
    map.addSource(FIELD_SOURCE_ID, {
      type: "image",
      coordinates: cornersOf(fieldBounds),
    });
    map
      .getSource<ImageSource>(FIELD_SOURCE_ID)
      ?.updateImage({ image: fieldCanvas() });
    map.addLayer({
      id: FIELD_LAYER_ID,
      type: "raster",
      source: FIELD_SOURCE_ID,
      paint: {
        "raster-opacity": FIELD_OPACITY,
        "raster-resampling": "linear",
        "raster-fade-duration": 0,
      },
    });

    map.addSource(STATION_SOURCE_ID, {
      type: "geojson",
      data: stationFeatures(dataset, activeKey),
    });
    map.addLayer({
      id: STATION_LAYER_ID,
      type: "circle",
      source: STATION_SOURCE_ID,
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 3, 15, 7],
        "circle-color": ["get", "color"],
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 1.5,
      },
    });
  });

  const popup = new Popup({
    closeButton: false,
    offset: 10,
    maxWidth: "260px",
  });

  map.on("click", STATION_LAYER_ID, (event) => {
    const feature = event.features?.[0];
    const serial = feature?.properties?.serial;
    const station =
      typeof serial === "string" ? stationsBySerial.get(serial) : undefined;
    if (!station) {
      return;
    }
    popup
      .setLngLat([station.lon, station.lat])
      .setDOMContent(createPopupContent(station, activeKey))
      .addTo(map);
  });
  map.on("mouseenter", STATION_LAYER_ID, () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", STATION_LAYER_ID, () => {
    map.getCanvas().style.cursor = "";
  });

  return {
    setPollutant(key) {
      activeKey = key;
      popup.remove();
      if (!map.getSource(FIELD_SOURCE_ID)) {
        return; // load 전이면 load 핸들러가 activeKey 로 그린다.
      }
      map
        .getSource<ImageSource>(FIELD_SOURCE_ID)
        ?.updateImage({ image: fieldCanvas() });
      map
        .getSource<GeoJSONSource>(STATION_SOURCE_ID)
        ?.setData(stationFeatures(dataset, key));
    },
    destroy() {
      popup.remove();
      map.remove();
    },
  };
}
