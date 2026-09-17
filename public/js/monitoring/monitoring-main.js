import * as get_api from '/get_api.js'
import * as set_chart from '/set_chart.js'
import * as convert from '/convert.js'



var ciciChart = "";
var vocsChart = "";
var pm25Chart = "";
var tempChart = "";
var humiChart = "";
var pm10Chart = "";
var co2Chart = "";
var ch4Chart = "";
var noiseChart = "";
var recentData = {};
var deviceInfo = await get_api.getInitSerial()
var usedDataUnit = [
    "이산화탄소", "co2",
    "메탄", "ch4",
    "온도", "temp",
    "습도", "humi",
    "풍향", "windd",
    "풍속", "winds",
    "미세먼지", "pm10",
    "초미세먼지", "pm25",
    "자외선", "uv",
    "오존", "o3",
    "이산화질소", "no2",
    "이산화황", "so2",
    "일산화탄소", "co",
    "황화수소", "h2s",
    "암모니아", "nh3",
    "조도", "lux",
    "온열지수", "wbgt",
    "소음", "noise"
]

deviceInfo.sort((a, b) => {
    if (a.memberId < b.memberId) {
        return -1;
    }
    if (a.memberId > b.memberId) {
        return 1;
    }
    return 0;
});

$("#deviceCountZone strong").html(deviceInfo.length)
var unitKor = []
var unitEng = []
for (var i = 0; i < usedDataUnit.length; i += 2) {
    unitKor.push(usedDataUnit[i])
    unitEng.push(usedDataUnit[i + 1])
}
usedDataUnit = [
    "이산화탄소", "co2",
    "메탄", "ch4",
    "온도", "temp",
    "습도", "humi",
    "풍향", "windd",
    "풍속", "winds",
    "미세먼지", "pm10",
    "초미세먼지", "pm25",
    "자외선", "uv",
    "오존", "o3",
    "이산화질소", "no2",
    "이산화황", "so2",
    "일산화탄소", "co",
    "황화수소", "h2s",
    "암모니아", "nh3",
    "조도", "lux",
    "온열지수", "wbgt",
    "소음", "noise"
]

localStorage.setItem('deviceInfo', JSON.stringify(deviceInfo));
localStorage.setItem('usedDataUnit', usedDataUnit);
window.deviceInfo = deviceInfo
$('#memberSelector').html()

var selectIdList = [];
for (var i in deviceInfo) {
    var listData = {
        memberId: deviceInfo[i].memberId,
        serial: deviceInfo[i].serialNum,
        spaceName: deviceInfo[i].stationName,
        deviceType: deviceInfo[i].deviceType
    }
    selectIdList.push(listData)
}
$('#deviceSelector').empty()
for (var i in selectIdList) {
    $('#deviceSelector').append($("<option></option>").attr({ "value": selectIdList[i].serial, "data-devicetype": selectIdList[i].deviceType }).text(selectIdList[i].spaceName));
}
setInitRecentData(deviceInfo[0].serialNum, deviceInfo[0].deviceType);
async function setInitRecentData(serial, deviceType) {
    recentData = await get_api.getRecentData(serial, deviceType)
    $("#updateTime").html("데이터 시간 : " + convert.convertDataTM(recentData.tm))
    $("#dataUpdateTime").html("업데이트 시간 : " + convert.convertUpdateTM())
    var limitDate = new Date(new Date().setMinutes(new Date().getMinutes() - 5));
    var cssRed = ""
    var htmlText = ""
    if (limitDate > new Date(convert.convertDataTM(recentData.tm))) {

        cssRed = 'bads'
        htmlText = '나쁨'
    }
    else {
        cssRed = 'oks'
        htmlText = '양호'
    }
    $("#deviceStatus").removeClass();
    $("#deviceStatus").addClass(cssRed);
    $("#deviceStatus").text(htmlText)



    setChart(recentData, deviceType)
}
// recentData = await get_api.getInitSerial()

$(document).ready(function () {
    setSlider()
    function setSlider() {
        var $slider = $('#sliderZone');
        $slider.slick('unslick'); // Remove Slick initialization
        $slider.empty(); // Clear existing slides
        // // 슬라이더를 위한 새로운 요소 생성
        var newSlider = '';

        // 각 슬라이드를 추가할 때마다, 슬라이더에 슬라이드 요소를 추가
        for (var i in deviceInfo) {
            var image = deviceInfo[i].deviceType == 'OAQ' ? 'OAQ-C3-010.png' : 'IAQ.png'
            var dom =
                '<div class="slick-slide">' +
                '<div class="iaq_home">' +
                '    <h5>실외공기측정기(<p class="device-type">' + deviceInfo[i].deviceType + '</p>)</h5>' +
                '    <div class="device">' +
                '        <img src="/' + image + '" alt="" class="router_pic">' +
                '            <div class="iaq_infor">' +
                '                <dl class="statis">' +
                '                    <dt>스테이션 이름</dt>' +
                '                        <dd><strong class="station-name">' + deviceInfo[i].stationName + '</strong></dd>' +
                '                </dl>' +
                '                <dl class="prod_num">' +
                '                    <dt>기기고유번호</dt>' +
                '                       <dd><strong class="serial-num">' + deviceInfo[i].serialNum + '</strong></dd>' +
                '                </dl>' +
                '                <dl class="smap">' +
                '                    <dt>위치</dt>' +
                '                    <dd><strong>다중이용시설</strong></dd>' +
                '                </dl>' +
                '            </div>' +
                '    </div>' +
                '</div>' +
                '</div>';

            $slider.append(dom);
            // $slider.append('<div class="slick-slide">' + dom + '</div>');
            // newSlider += slide
        }
        // Reinitialize Slick slider
        $slider.slick({
            infinite: true,
            lazyLoad: 'ondemand',
            speed: 500,
            autoplaySpeed: 10000,
            pauseOnHover: false,
            pauseOnFocus: true,
            fade: false,
            arrows: true,
            cssEase: 'linear',
            swipe: true,
            autoplay: true,
            swipeToSlide: true,
            touchThreshold: 10,
            draggable: false,
            appendArrows: '.sslideer_controler'


        });

    }


})

// $('#sliderZone').on('afterChange', function (e) {
// })
$('#sliderZone').on('afterChange', function (event, slick, currentSlide, nextSlider) {
    var devcieElement = $(".device-type")[currentSlide + 1];
    var deviceValue = $(devcieElement).text();
    var serialNumElement = $(".serial-num")[currentSlide + 1];
    $(".current").html(currentSlide + 1)
    // Get the text content from the selected element
    var serialNumValue = $(serialNumElement).text();

    var selectOptions = $("#deviceSelector option")
    for (var i in selectOptions) {
        if (selectOptions[i].value == serialNumValue) {
            $("#deviceSelector").val(serialNumValue)
        }
    }



    setInitRecentData(serialNumValue, deviceValue);

});
$('#deviceSelector').change(function (e, a) {
    // var selectedOption = $(this).find('option:selected').val();
    var deviceType = $('option:selected', this).data('devicetype')
    setInitRecentData(this.value, deviceType)
})



function setChart(data, deviceType) {
    am4core.addLicense("CH205407412");
    am4core.options.queue = true;
    am4core.ready(function () {
        resetChart()
        function resetChart() {
            if (ciciChart != "") ciciChart.dispose();
            if (vocsChart != "") vocsChart.dispose();
            if (pm25Chart != "") pm25Chart.dispose();
            if (tempChart != "") tempChart.dispose();
            if (humiChart != "") humiChart.dispose();
            if (pm10Chart != "") pm10Chart.dispose();
            if (co2Chart != "") co2Chart.dispose();
            if (ch4Chart != "") ch4Chart.dispose();
            if (noiseChart != "") noiseChart.dispose();
        }
        var isCici = deviceType == 'IAQ' ? 'cici' : 'coci'
        if ($("#vocsChart").length && data.voc != undefined) {
            vocsChart = am4core.create("vocsChart", am4charts.GaugeChart);
            set_chart.drawMultiGauge0To320OneColor("", "vocsChart", vocsChart, 12, "1.4em", "1.1em", "2.4em", -21, 22, -20, 84, 70, convert.convertVOCs(data.voc), data.voc, "ppb");
        }

        if ($("#co2Chart").length && data.co2 != undefined) {
            co2Chart = am4core.create("co2Chart", am4charts.GaugeChart);
            // 일반 실외 기준(convertCo2Outdoor) 적용 — 통계/분석 페이지용 convertCo2와는 별개 기준
            set_chart.drawMultiGauge0To320OneColor("", "co2Chart", co2Chart, 12, "1.4em", "1.1em", "2.4em", -21, 22, -20, 84, 70, convert.convertCo2Outdoor(data.co2), data.co2, "ppm");
        }

        if ($("#ch4Chart").length && data.ch4 != undefined) {
            ch4Chart = am4core.create("ch4Chart", am4charts.GaugeChart);
            set_chart.drawMultiGauge0To320OneColor("", "ch4Chart", ch4Chart, 12, "1.4em", "1.1em", "2.4em", -21, 22, -20, 84, 70, convert.convertCh4Outdoor(data.ch4), data.ch4.toFixed(2), "ppm");
        }

        if ($("#pm10Chart").length && data.pm10 != undefined) {
            pm10Chart = am4core.create("pm10Chart", am4charts.GaugeChart);
            set_chart.drawMultiGauge0To320OneColor("", "pm10Chart", pm10Chart, 12, "1.4em", "1.1em", "2.4em", -21, 22, -20, 84, 70, convert.convertPm10(data.pm10), data.pm10, "㎍/m³");
        }
        if ($("#pm25Chart").length && data.pm25 != undefined) {
            pm25Chart = am4core.create("pm25Chart", am4charts.GaugeChart);
            set_chart.drawMultiGauge0To320OneColor("", "pm25Chart", pm25Chart, 12, "1.4em", "1.1em", "2.4em", -21, 22, -20, 84, 70, convert.convertPm25(data.pm25), data.pm25, "㎍/m³");
        }
        if ($("#tempChart").length && data.temp != undefined) {
            tempChart = am4core.create("tempChart", am4charts.GaugeChart);
            set_chart.drawMultiGauge0To320OneColor2("", "tempChart", tempChart, 12, "1.4em", "1.1em", "2.4em", -21, 22, -20, 84, 70, deviceType == 'IAQ' ? convert.convertTempIAQ(data.temp) : convert.convertTempOAQ(data.temp), data.temp, "℃", deviceType);
        }
        if ($("#humiChart").length && data.humi != undefined) {
            humiChart = am4core.create("humiChart", am4charts.GaugeChart);
            set_chart.drawMultiGauge0To320OneColor2("", "humiChart", humiChart, 12, "1.4em", "1.1em", "2.4em", -21, 22, -20, 84, 70, deviceType == 'IAQ' ? convert.convertHumiIAQ(data.humi) : convert.convertHumiOAQ(data.humi), data.humi, "%", deviceType);
        }
        if ($("#noiseChart").length && data.noise != undefined) {
            noiseChart = am4core.create("noiseChart", am4charts.GaugeChart);
            set_chart.drawMultiGauge0To320OneColor("", "noiseChart", noiseChart, 12, "1.4em", "1.1em", "2.4em", -21, 22, -20, 84, 70, convert.convertNoise(data.noise), data.noise, "dB");
        }

        if ($("#ciciChart").length && data[isCici] != undefined) {
            ciciChart = am4core.create("ciciChart", am4charts.GaugeChart);
            // set_chart.drawMultiGauge0To320OneColor("", "ciciChart", ciciChart, 14, "1.6em", "", "2.4em", -24, 0, -20, 84, 66, deviceType == 'IAQ' ? data.cici : data.coci, "", "");
            set_chart.drawMultiGauge0To320OneColor("", "ciciChart", ciciChart, 12, "1.4em", "1.1em", "2.4em", -21, 22, -20, 84, 70, data[isCici], '', "");


        }
        for (var i = 0; i < unitEng.length; i++) {

            if (unitEng[i] == 'ch4') {
                data[unitEng[i]] = data[unitEng[i]].toFixed(1)
            }
            var domId = 'main-' + unitEng[i]
            if ($("#" + domId).length > 0) {
                $("#" + domId).html(data[unitEng[i]])

            }

        }

    })

}

