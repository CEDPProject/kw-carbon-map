import * as set_table from '/set_table.js'
import * as set_chart from '/set_chart.js'

import * as get_api from '/get_api.js'
import * as convert from '/convert.js'

var graphChart = '';
var _today = new Date();
var textArr = ['max', 'avg', 'min']
var deviceInfo;
var graphData = {}
var chartData = {}
var originData;
var statisticsChart;
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

var sensorTages = await convert.convertGraphTags(usedDataUnit)

setRadioBtn(sensorTages.data, sensorTages.elementUnit)
var prevData;
var checkData = [];


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


$("#graphSearch").click(function () {
    getSearchData()
})


getInitData()





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

$("#graphDownloadBtn").click(function () {
    statisticsChart.exporting.filePrefix = "textsss";
    statisticsChart.exporting.export("jpg");
})


async function getInitData() {

    var data = await get_api.getStatisticsData(deviceInfo[0].deviceType, deviceInfo[0].serialNum, _today, _today, '1h');
    originData = data;
    if (data['avg'].length > 0 && data['max'].length > 0 && data['min'].length > 0) {

        for (var i in textArr) {
            graphData[textArr[i]] = convert.convertPrevData(data[textArr[i]], true)
            chartData[textArr[i]] = convert.convertPrevData(data[textArr[i]], false)
        }

        $("#data_table").show()
        $("#data_not").hide()
        $("input[type='radio']").click(function () {
            setGraph(graphData)
        })

        setGraph(graphData)

        setTable(graphData, sensorTages.data, sensorTages.unit)
    }
    else {
        $("#data_table").hide()
        $("#data_not").show()
    }

}


async function getSearchData() {
    $('.wrap-loading').show()
    var startDt = $("#searchFromDate").val();
    var endDt = $("#searchToDate").val();
    var searchDevice = $("#deviceSelector").val();
    var timeInterval = $("#time-interval").val()
    var selectedOption = $('input[name="check[]"]:checked').attr('value')
    var deviceType = $("#deviceSelector").find('option:selected').attr('data-devicetype');
    var data = await get_api.getStatisticsData(deviceType, searchDevice, startDt, endDt, timeInterval);

    originData = data;

    if (data['avg'].length > 0 && data['max'].length > 0 && data['min'].length > 0) {

        for (var i in textArr) {
            graphData[textArr[i]] = convert.convertPrevData(data[textArr[i]], true)
            chartData[textArr[i]] = convert.convertPrevData(data[textArr[i]], false)
        }
        var sensorTages = await convert.convertGraphTags(usedDataUnit)

        $("#data_table").show()
        $("#data_not").hide()
        // setRadioBtn(graphData['avg'], sensorTages.data, sensorTages.elementUnit)

        setGraph(graphData)

        setTable(graphData, sensorTages.data, sensorTages.unit)
    }
    else {
        alert("데이터가 없습니다")
        $("#data_table").hide()
        $("#data_not").show()
        $('.wrap-loading').hide();
        return;
    }

}

function setRadioBtn(tags, elementUnit) {
    console.log('tags', tags)
    $("#element_area").html("");
    var elementHTML = '<ul>';

    for (var k = 0; k < tags.length; k += 2) {
        var engName = tags[k];
        var viewName = tags[k + 1]
        var isChecked = k == 0 ? 'checked' : ''
        // elementHTML += '<input type="radio" name="elementRadio" value="' + searchElements[i] + '" onclick="fn_setChart(\'' + searchElements[i] + '\');" />';
        elementHTML += '<li><input type="radio" value="' + engName + '" id="check_' + engName + '" name="check[]"' + isChecked + '/><label for="check_' + engName + '" data-unit="' + elementUnit[k / 2] + '">' + viewName + '</label></li>'
    }
    elementHTML += '</ul>';

    $("#element_area").html(elementHTML)

}


function setGraph(data) {
    var checkedUnit = document.querySelector('input[name="check[]"]:checked').value;
    var convertData = [];
    var dataUnit = $("label[for='check_" + checkedUnit + "']").data('unit');
    var timeInterval = $("#time-interval").val() == '1h' ? 'hour' : 'day'
    for (var i in data['avg']) {
        var json = {
            'date': convert.convertAvgChartDataTM(data['avg'][i]['tm'])
        }
        if (data['avg'][i][checkedUnit] != null && data['avg'][i][checkedUnit] != undefined) {
            json['avg'] = data['avg'][i][checkedUnit];
        }
        if (data['min'][i][checkedUnit] != null && data['min'][i][checkedUnit] != undefined) {
            json['min'] = data['min'][i][checkedUnit];
        }
        if (data['max'][i][checkedUnit] != null && data['max'][i][checkedUnit] != undefined) {
            json['max'] = data['max'][i][checkedUnit];
        }

        convertData.push(json)
    }

    am4core.ready(function () {
        statisticsChart = am4core.create("graphChart", am4charts.XYChart);

        // var dataFormat = $("#searchTypeSelector").val();-----
        set_chart.drawBaseLine3("", "graphChart", statisticsChart, convertData, timeInterval, dataUnit);
    });
}
function setTable(data, unit) {
    var checkedUnit = document.querySelector('input[name="check[]"]:checked').value;
    var convertData = [];
    for (var i in data['avg']) {
        var json = {};

        json['tm'] = []
        for (var j = 0; j < unit.length; j += 2) {
            json[unit[j]] = {}

            json[unit[j]]['avg'] = data['avg'][i][unit[j]] == undefined ? '-' : data['avg'][i][unit[j]]
            json[unit[j]]['min'] = data['min'][i][unit[j]] == undefined ? '-' : data['min'][i][unit[j]]
            json[unit[j]]['max'] = data['max'][i][unit[j]] == undefined ? '-' : data['max'][i][unit[j]]
        }
        json['tm'] = convert.convertGetTablePrevDataTm(data['avg'][i]['tm'])

        convertData.push(json)

    }

    set_table.setStatisticTable('data_table', convertData, unit)
    $('.wrap-loading').hide()

} 