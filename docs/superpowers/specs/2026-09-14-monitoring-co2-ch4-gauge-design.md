# /monitoring 페이지 CO2·CH4 게이지 차트 추가 설계

- **작성일**: 2026-09-14
- **대상 페이지**: `/monitoring` (`public/html/monitoring/index.html`)
- **작성자**: Claude Code (요청자: teamoper2@kweather.co.kr)

## 1. 배경 및 문제

`/monitoring` 페이지에서 온도(temp), 습도(humi), 미세먼지(pm10), 초미세먼지(pm25), VOC, 소음(noise)은
amCharts4 게이지 차트(`drawMultiGauge0To320OneColor`)로 시각화되지만, **이산화탄소(CO2)와 메탄(CH4)은
숫자 텍스트만 표시**되고 있었다 (`<span id="main-co2">`, `<span id="main-ch4">`).

코드 조사 결과 `monitoring-main.js`에는 이미 `co2Chart` 게이지 렌더링 코드가 존재했지만,
HTML에 대응하는 `<div id="co2Chart">`가 없어 실제로 그려지지 않는 죽은 코드 경로였다.
CH4는 게이지 차트 코드 자체가 없었다.

담당자가 제공한 등급기준(안) 이미지에 따라, CO2·CH4에 대해 "일반 실외" / "공업단지" 두 세트의 등급 구간이
정의되어 있으나, 현재 시스템(`Device`, `MemberDeviceManage` 엔티티 등)에는 스테이션이 공업단지인지
구분하는 필드가 없다. 따라서 이번 작업 범위는 **"일반 실외" 기준만 적용**한다.

## 2. 목표

- CO2·CH4를 온도/습도/미세먼지와 동일한 스타일의 게이지 차트로 표시
- 신규 등급 기준(일반 실외)을 적용한 지수(0~100) 계산 로직 추가
- 기존 통계/분석 페이지(`set_table.js`)에서 쓰이는 `convertCo2`/`convertCo2Color`에는 영향을 주지 않음 (Breaking Change 없음)

## 3. 등급 기준 (일반 실외, 이미지 근거)

| 등급 | CO2 (ppm) | CH4 (ppm) |
| --- | --- | --- |
| 매우좋음 | 425 미만 | 1.95 미만 |
| 좋음 | 425 이상 ~ 450 미만 | 1.95 이상 ~ 2.10 미만 |
| 나쁨 | 450 이상 ~ 550 미만 | 2.10 이상 ~ 2.50 미만 |
| 매우나쁨 | 550 이상 | 2.50 이상 |

- 출처: 담당자 제공 등급기준(안) 이미지 (WMO GAW Bulletin No.21, Copernicus CAMS, 안면도 관측소 등 근거)
- "공업단지" 기준은 이번 범위에서 제외. 추후 스테이션 타입 구분 필드가 추가되면 별도 함수로 확장 가능하도록
  함수명에 `Outdoor`를 명시해 구분해 둔다.

## 4. 변경 파일 및 상세 내용

### 4.1 `public/html/monitoring/index.html`

이산화탄소/메탄 패널을 텍스트(`align_middle`)에서 게이지 차트(`wgrah`) 패널로 교체한다.
온도/습도 패널과 동일한 마크업 패턴을 따른다.

```html
<!-- Before -->
<div class="w_panel">
  <h4 class="wtitl">이산화탄소 (PPM)</h4>
  <div class="align_middle">
    <span id="main-co2"></span><span>ppm</span>
  </div>
</div>
<div class="w_panel">
  <h4 class="wtitl">메탄 (PPM)</h4>
  <div class="align_middle">
    <span id="main-ch4"></span><span>ppm</span>
  </div>
</div>

<!-- After -->
<div class="w_panel">
  <h4 class="wtitl">이산화탄소 (PPM)</h4>
  <div class="wgrah">
    <div id="co2Chart"></div>
  </div>
</div>
<div class="w_panel">
  <h4 class="wtitl">메탄 (PPM)</h4>
  <div class="wgrah">
    <div id="ch4Chart"></div>
  </div>
</div>
```

패널 순서(위치)는 변경하지 않는다.

### 4.2 `public/js/convert.js`

기존 `convertCo2`/`convertCo2Color`는 그대로 유지한다 (분석/통계 테이블 `set_table.js`에서 사용 중,
500/1000/1500ppm 기준 — 이번 작업과 무관).

신규 함수 2개를 추가한다. 기존 `convertCo2`와 동일한 수식 패턴(구간 내에서 100→0으로 선형 매핑)을 따른다.

```js
// 일반 실외 기준 CO2 지수 (매우좋음 425 / 좋음 450 / 나쁨 550 ppm 경계)
function convertCo2Outdoor(value) {
    var cipi = "";
    if (value >= 0 && value < 425) {
        cipi = 100 - 11 * (value / 425);
    } else if (value >= 425 && value < 450) {
        cipi = 89 - 9 * ((value - 425) / 25);
    } else if (value >= 450 && value < 550) {
        cipi = 79 - 29 * ((value - 450) / 100);
    } else {
        // 550ppm 이상: 550~2000 구간에서 49→0, 그 이상은 0으로 고정
        cipi = Math.max(0, 49 - 49 * ((value - 550) / 1450));
    }
    return Math.round(cipi);
}

// 일반 실외 기준 CH4 지수 (매우좋음 1.95 / 좋음 2.10 / 나쁨 2.50 ppm 경계)
function convertCh4Outdoor(value) {
    var cipi = "";
    if (value >= 0 && value < 1.95) {
        cipi = 100 - 11 * (value / 1.95);
    } else if (value >= 1.95 && value < 2.10) {
        cipi = 89 - 9 * ((value - 1.95) / 0.15);
    } else if (value >= 2.10 && value < 2.50) {
        cipi = 79 - 29 * ((value - 2.10) / 0.40);
    } else {
        // 2.50ppm 이상: 2.50~5.00 구간에서 49→0, 그 이상은 0으로 고정
        cipi = Math.max(0, 49 - 49 * ((value - 2.50) / 2.50));
    }
    return Math.round(cipi);
}

```

파일 하단에 이미 있는 단일 `export { convertPm25, ..., convertCo2, convertCo2Color, ... }` 목록에
`convertCo2Outdoor`, `convertCh4Outdoor` 두 이름만 추가한다 (다른 export는 그대로 유지).

> 정확한 계수는 구현 단계에서 최종 조정 가능. 핵심은 "매우좋음=90~100 / 좋음=80~89 / 나쁨=50~79 / 매우나쁨=0~49"
> 지수 매핑을 유지해 `set_chart.js`의 범용 등급 텍스트/색상 분기(90~100=쾌적/파랑, 80~89=보통/초록,
> 50~79=나쁨/주황, 0~49=매우나쁨/빨강)와 맞아떨어지도록 하는 것이다.

### 4.3 `public/js/monitoring/monitoring-main.js`

- 최상단 변수 선언부에 `var ch4Chart = "";` 추가
- `resetChart()` 내부에 `if (ch4Chart != "") ch4Chart.dispose();` 추가
- 기존 co2Chart 렌더링 블록의 `convert.convertCo2(data.co2)` → `convert.convertCo2Outdoor(data.co2)`로 교체
- ch4Chart 렌더링 블록 신규 추가 (co2Chart와 동일한 가드/파라미터 패턴):

```js
if ($("#ch4Chart").length && data.ch4 != undefined) {
    ch4Chart = am4core.create("ch4Chart", am4charts.GaugeChart);
    set_chart.drawMultiGauge0To320OneColor(
        "", "ch4Chart", ch4Chart, 12, "1.4em", "1.1em", "2.4em",
        -21, 22, -20, 84, 70,
        convert.convertCh4Outdoor(data.ch4), data.ch4.toFixed(2), "ppm"
    );
}
```

### 4.4 `public/js/set_chart.js`

**변경 없음.** `drawMultiGauge0To320OneColor`는 `chartName`이 `temp`/`humi`로 시작하지 않으면
매우나쁨(0~49)/나쁨(50~79)/보통(80~89)/좋음(90~100) 4단계 범용 분기를 이미 사용하므로,
CO2/CH4의 0~100 지수만 넘겨주면 기존 로직을 그대로 재사용한다.

## 5. 데이터 흐름 (변경 없음, 기존 흐름 재사용)

1. `setInitRecentData(serial, deviceType)` → `get_api.getRecentData()`로 K-Weather API에서
   `recentData.co2`, `recentData.ch4` 조회 (이미 존재하는 필드, API/백엔드 변경 불필요)
2. `setChart(recentData, deviceType)` 호출 → `co2Chart`/`ch4Chart` 게이지 렌더링
3. 슬라이더 이동(`afterChange`) 또는 스테이션 셀렉터 변경(`#deviceSelector change`) 시
   기존과 동일하게 `setInitRecentData()` → `resetChart()` → 재렌더링

## 6. 영향도 분석 (Breaking Change 검토)

| 항목 | 영향 |
| --- | --- |
| `convertCo2`/`convertCo2Color` | 변경 없음 → `set_table.js`(분석/통계 테이블) 영향 없음 |
| `main-co2`/`main-ch4` id 제거 | grep 확인 결과 `monitoring-main.js` 외 참조 없음 → 안전 |
| CH4 미탑재 기기 | 기존 다른 게이지와 동일하게 `data.ch4 != undefined` 가드로 자동 스킵, 에러 없음 |
| 공업단지 기준 | 이번 범위 제외. `Outdoor` 접미사로 함수를 분리해 추후 스테이션 타입 구분 필드 추가 시 확장 용이 |
| IAQ/OAQ 기기 구분 | CO2/CH4는 (PM10/PM25/VOC/noise와 동일하게) deviceType 구분 없이 동일 기준 적용 |

## 7. 에러 처리

- `data.co2`/`data.ch4`가 `undefined`인 경우 차트를 그리지 않음 (기존 다른 게이지와 동일 패턴)
- 값이 음수이거나 상한을 초과하는 비정상 데이터는 `Math.max(0, ...)`으로 지수 0 하한을 보장 (기존 `convertCo2`에는 없던 방어 로직을 신규 함수에 추가)

## 8. 테스트

수동 확인 항목:
- `/monitoring` 페이지 로드 시 CO2/CH4 게이지 차트가 정상 렌더링되는지
- 스테이션 셀렉터 변경 시 CO2/CH4 게이지가 기존 차트들과 함께 정상적으로 dispose/재생성되는지
- CH4 값이 없는 기기 선택 시 에러 없이 차트 영역이 비어 있는지
- 각 등급 경계값(425, 450, 550 / 1.95, 2.10, 2.50) 부근에서 색상/텍스트가 올바르게 전환되는지
