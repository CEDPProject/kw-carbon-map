import * as set_chart from '/set_chart.js'
import * as main from '/common.js'
import * as get_api from '/get_api.js'
import * as convert from '/convert.js'



var graphChart = '';
var deviceInfo;
var usedDataUnit;
if (localStorage.getItem('deviceInfo')) {
    deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));
} else {
    // If not in localStorage, make the API call
    deviceInfo = await get_api.getInitSerial();
}
if (localStorage.getItem('usedDataUnit')) {
    usedDataUnit = localStorage.getItem('usedDataUnit').split(",");
} else {
    // If not in localStorage, make the API call
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
        "흑구온도", "wbgt",
        "소음", "noise"
    ]

}
var unitKor = []
var unitEng = []
for (var i = 0; i < usedDataUnit.length; i += 2) {
    unitKor.push(usedDataUnit[i])
    unitEng.push(usedDataUnit[i + 1])
}
var prevData;
var checkData = [];


var _today = new Date();





jQuery(function ($) {
    $.datepicker.regional["ko"] = {
        closeText: "닫기",
        prevText: "이전달",
        nextText: "다음달",
        currentText: "오늘",
        monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        dayNames: ["일", "월", "화", "수", "목", "금", "토"],
        dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
        dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
        changeMonth: false, // month 셀렉트박스 사용
        changeYear: false, // year 셀렉트박스 사용
        weekHeader: "Wk",
        dateFormat: "yy-mm-dd",
        firstDay: 0,
        //stepMonths: 0,
        isRTL: false,
        showMonthAfterYear: true,
        yearSuffix: "년"
    };
    $.datepicker.setDefaults($.datepicker.regional["ko"]);

});
$(document).ready(function () {
    var memberList = ['all'];
    $('#memberSelector').append($("<option></option>").attr({ "value": 'all', "data-devicetype": 'all' }).text('전체'));

    for (var i in deviceInfo) {
        $('#memberSelector').append($("<option></option>").attr({ "value": deviceInfo[i].serialNum, "data-devicetype": deviceInfo[i].deviceType }).text(deviceInfo[i].memberId));
        $('#deviceSelector').append($("<option></option>").attr({ "value": deviceInfo[i].serialNum, "data-devicetype": deviceInfo[i].deviceType }).text(deviceInfo[i].stationName));
    }

    $("#searchFromDate").datepicker({
        dateFormat: "yy/mm/dd",
        onSelect: function (selectDate) {
            var dateFomats = new Date(selectDate);
            // dateFomats = new Date(dateFomats.setMonth(dateFomats.getMonth() + 6))

            if (dateFomats > new Date()) {
                $("#searchFromDate").datepicker('setDate', 'toDay');
            }
            if (dateFomats > new Date($("#searchToDate").val())) {
                $("#searchFromDate").datepicker("setDate", $("#searchToDate").val());
            }

            $("#searchToDate").datepicker("option", {
                minDate: selectDate,

            });

            // $("#endDt").focus();
        }
    });
    $("#searchToDate").datepicker({
        dateFormat: "yy/mm/dd",
        maxDate: new Date(),
        onSelect: function (selectDate) {
            var dateFomats = new Date(selectDate);
            // dateFomats = dateFomats.setMonth(dateFomats.getMonth() - 6)
            if (dateFomats < new Date($("#searchFromDate").val())) {
                $("#searchToDate").datepicker('setDate', $("#searchFromDate").val());
            }
            if (dateFomats > new Date()) {
                $("#searchToDate").datepicker('setDate', new Date());
            }

            $("#searchFromDate").datepicker("option", {
                maxDate: selectDate,

            });
        }
    });

    $('#searchFromDate').datepicker('setDate', 'today'); //(-1D:하루전, -1M:한달전, -1Y:일년전), (+1D:하루후,  -1M:한달후, -1Y:일년후)
    $('#searchToDate').datepicker('setDate', 'today');

    getSearchData()

})

$("#searchFunc").on('click', async function () {
    getSearchData();
})

$('#memberSelector').change(function () {
    var memberSeiral = $(this).val(); // Get the selected member
    if (memberSeiral != 'all') {
        $('#deviceSelector option').each(function () {
            var serial = $(this).val(); // Get the member value associated with the option

            // Show/hide options based on the selected member
            if (serial === memberSeiral) {
                $(this).show();
                $('#deviceSelector').val($(this).val())
            } else {
                $(this).hide();
            }
        })
    }
    else {

        $('#deviceSelector option').each(function () {
            $(this).show();


        })
        $('#deviceSelector').val($('#deviceSelector option').val())
    }
    getSearchData()
    // Filter deviceSelector options based on the selected member

})


$("#graphDownloadBtn").click(function () {
    graphChart.exporting.filePrefix = "textsss";
    graphChart.exporting.export("jpg");
})


$('#deviceSelector').change(function (e, a) {
    var selectedOption = $(this).find('option:selected');
    var deviceType = selectedOption.attr('data-devicetype');
    getSearchData();
})

async function getInitData() {
    prevData = convert.convertPrevData(await get_api.getPrevData(convert.convertGetPrevDataTm(_today, true), convert.convertGetPrevDataTm(_today, false), deviceInfo[1].serialNum, deviceInfo[1].deviceType, '10m-avg-none'), true)
    var sensorTages = await convert.convertGraphTags(usedDataUnit)

    setChart(prevData, sensorTages.data, sensorTages.elementUnit)
}

async function getSearchData() {
    var startDt = $("#searchFromDate").val()
    var endDt = $("#searchToDate").val()
    var timeInterval = $("#time-interval").val()
    var selectedDeviceSerial = $("#deviceSelector").find('option:selected').val();
    var selectedDeviceType = $("#deviceSelector").find('option:selected').attr('data-devicetype');
    prevData = convert.convertPrevData(await get_api.getPrevData(convert.convertGetPrevDataTm(startDt, true), convert.convertGetPrevDataTm(endDt, false), selectedDeviceSerial, selectedDeviceType, timeInterval), true)
    var sensorTages = await convert.convertGraphTags(usedDataUnit)
    setChart(prevData, sensorTages.data, sensorTages.elementUnit)
}
function setChart(chartData, dataValues, elementUnit) {
    if (graphChart) graphChart.dispose();

    am4core.ready(function () {
        am4core.useTheme(am4themes_material);
        graphChart = am4core.create("graphChart", am4charts.XYChart);
        checkData = [];
        set_chart.drawBaseLine("", "graphChart", graphChart, chartData, dataValues, "min", true, "", checkData, elementUnit);

    });
}

