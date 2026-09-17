import * as set_table from '/set_table.js'
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
        "온열지수", "wbgt",
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

    $(function () {

    });
});


$(document).ready(function () {
    $('.mode_box').hide()
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

    getInitData();


})


async function getInitData() {
    var prevOriginData = await get_api.getPrevData(convert.convertGetPrevDataTm(_today, true), convert.convertGetPrevDataTm(_today, false), deviceInfo[0].serialNum, deviceInfo[0].deviceType, '1m-avg-none')
    if (prevOriginData.length > 0) {
        prevData = convertWithPreservedValues(convert.convertPrevDataTable(prevOriginData, false))
        console.log(prevData)

    }
    else {
        alert("해당 날짜에 데이터가 없습니다");
        return;
    }
    var sensorTages = await convert.convertGraphTags(usedDataUnit)
    setTable(prevData, sensorTages.data)
}

async function getSearchData() {
    var startDt = $("#searchFromDate").val()
    var endDt = $("#searchToDate").val()
    var timeInterval = '1m-avg-none' //여기선 무조건 1분단위 데이터
    var selectedDeviceSerial = $("#deviceSelector").find('option:selected').val();
    var selectedDeviceType = $("#deviceSelector").find('option:selected').attr('data-devicetype');
    prevData = convertWithPreservedValues(convert.convertPrevDataTable(await get_api.getPrevData(convert.convertGetPrevDataTm(startDt, true), convert.convertGetPrevDataTm(endDt, false), selectedDeviceSerial, selectedDeviceType, timeInterval), false))
    console.log(prevData)
    var sensorTages = await convert.convertGraphTags(usedDataUnit)

    setTable(prevData, sensorTages.data)
}
function convertWithPreservedValues(origin) {
    const parseDate = (str) => {
        const [date, time] = str.split(' ');
        const [y, m, d] = date.split('/').map(Number);
        const [hh, mm] = time.split(':').map(Number);
        return new Date(y, m - 1, d, hh, mm);
    };

    // origin 데이터를 Map으로 변환 → tm 기준으로 빠른 접근
    const originMap = {};
    origin.forEach(item => {
        originMap[item.tm] = item; // value까지 포함
    });

    // 범위 결정
    const sorted = origin.slice().sort((a, b) => parseDate(a.tm) - parseDate(b.tm));
    const startDate = new Date(parseDate(sorted[0].tm));
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(parseDate(sorted[sorted.length - 1].tm));
    endDate.setHours(23, 59, 0, 0);

    const result = [];
    const current = new Date(startDate);

    while (current <= endDate) {
        const y = current.getFullYear();
        const m = String(current.getMonth() + 1).padStart(2, '0');
        const d = String(current.getDate()).padStart(2, '0');
        const h = String(current.getHours()).padStart(2, '0');
        const min = String(current.getMinutes()).padStart(2, '0');

        const tmStr = `${y}/${m}/${d} ${h}:${min}`;

        // 기존 데이터가 있다면 복원, 없으면 tm만
        if (originMap[tmStr]) {
            result.push(originMap[tmStr]);
        } else {
            result.push({ tm: tmStr });
        }

        current.setMinutes(current.getMinutes() + 1);
    }

    return result;
}



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
$('#deviceSelector').change(function (e, a) {
    var selectedOption = $(this).find('option:selected');
    var deviceType = selectedOption.attr('data-devicetype');
    getSearchData();
})

function setTable(chartData, dataValues) {
    set_table.setTable('data_table', chartData, dataValues)

}