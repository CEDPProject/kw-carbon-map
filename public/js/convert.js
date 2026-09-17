import * as get_api from '/get_api.js'



// Kweather 각 측정값에 대한 지수계산 함수
var tempObject = new Object();
var badValues = [];

function getDetailDateInNewDate(data) {
    var year = data.getFullYear();
    var month = ((data.getMonth() + 1) + "").padStart(2, '0');
    var day = (data.getDate() + "").padStart(2, '0');
    var hour = (data.getHours() + "").padStart(2, '0');
    var min = (data.getMinutes() + "").padStart(2, '0');
    var sec = (data.getSeconds() + "").padStart(2, '0');

    var obj = {
        'year': year,
        'month': month,
        'day': day,
        'hour': hour,
        'min': min,
        'sec': sec
    }
    return obj;
}
function getDetailMapDateInNewDate(tm) {
    tm += ''
    var year = tm.substr(0, 4)
    var month = tm.substr(4, 2)
    var day = tm.substr(6, 2)
    var hour = tm.substr(8, 2)
    var min = tm.substr(10, 2)

    var obj = {
        'year': year,
        'month': month,
        'day': day,
        'hour': hour,
        'min': min
    }
    return obj;
}

function getHeatTmValue(date) {

    var returnValue = date.year + date.month + date.day + date.hour + (Math.floor(date.min / 10) + "0")
    return returnValue;
}

function getChartXValue(data) {
    var returnValue = data.hour + ":" + data.min;
    return returnValue;
    //2021/08/11-15:50:00
}

function getChartXTitle(data) {
    var returnValue = (data.year + "").substr(2, 3) + "/" + data.month + "/" + data.day;
    return returnValue;
}


function convertUpdateTM() {
    var newDate = new Date()
    var year = newDate.getFullYear()
    var month = ((newDate.getMonth() + 1) + '').padStart(2, '0')
    var day = (newDate.getDate() + '').padStart(2, '0')
    var hour = (newDate.getHours() + '').padStart(2, '0')
    var min = (newDate.getMinutes() + '').padStart(2, '0')
    var returnTm = year + '.' + month + '.' + day + ' ' + hour + ':' + min
    return returnTm
}
function convertListTM(date) {
    var newDate = date;
    var year = newDate.getFullYear()
    var month = ((newDate.getMonth() + 1) + '').padStart(2, '0')
    var day = (newDate.getDate() + '').padStart(2, '0')
    var hour = (newDate.getHours() + '').padStart(2, '0')
    var min = (newDate.getMinutes() + '').padStart(2, '0')
    var returnTm = year + '.' + month + '.' + day + ' ' + hour + ':' + min
    return returnTm
}

function convertGetPrevDataTm(date, isStart) {
    var time = isStart ? "00:00:00" : "23:59:59"
    var newDate = new Date(date);
    var year = newDate.getFullYear()
    var month = ((newDate.getMonth() + 1) + '').padStart(2, '0')
    var day = (newDate.getDate() + '').padStart(2, '0')
    var returnTm = year + '/' + month + '/' + day + '-' + time
    return returnTm
}

function convertChartDataTM(date) {
    var newDate = new Date(date * 1000);
    var year = newDate.getFullYear()
    var month = ((newDate.getMonth() + 1) + '').padStart(2, '0')
    var day = (newDate.getDate() + '').padStart(2, '0')
    var hour = (newDate.getHours() + '').padStart(2, '0')
    var min = (newDate.getMinutes() + '').padStart(2, '0')
    var returnTm = year + month + day + hour + min
    return returnTm
}
function convertTableDataTM(date) {
    var newDate = new Date(date * 1000);
    var year = newDate.getFullYear()
    var month = ((newDate.getMonth() + 1) + '').padStart(2, '0')
    var day = (newDate.getDate() + '').padStart(2, '0')
    var hour = (newDate.getHours() + '').padStart(2, '0')
    var min = (newDate.getMinutes() + '').padStart(2, '0')
    var returnTm = year + '/' + month + '/' + day + ' ' + hour + ':' + min
    return returnTm
}

function addConvertChartDataTM(date) {
    var newDate = new Date(date);
    var year = newDate.getFullYear()
    var month = ((newDate.getMonth() + 1) + '').padStart(2, '0')
    var day = (newDate.getDate() + '').padStart(2, '0')
    var hour = (newDate.getHours() + '').padStart(2, '0')
    var min = (newDate.getMinutes() + '').padStart(2, '0')
    var returnTm = year + month + day + hour + min
    return returnTm
}
function addConvertTableDataTM(date) {
    var newDate = new Date(date);
    var year = newDate.getFullYear()
    var month = ((newDate.getMonth() + 1) + '').padStart(2, '0')
    var day = (newDate.getDate() + '').padStart(2, '0')
    var hour = (newDate.getHours() + '').padStart(2, '0')
    var min = (newDate.getMinutes() + '').padStart(2, '0')
    var returnTm = year + '/' + month + '/' + day + ' ' + hour + ':' + min
    return returnTm
}
function convertGridApiTm(date) {
    var newDate = new Date(date);
    var year = newDate.getFullYear()
    var month = ((newDate.getMonth() + 1) + '').padStart(2, '0')
    var day = (newDate.getDate() + '').padStart(2, '0')
    var hour = (newDate.getHours() + '').padStart(2, '0')
    var time = "00:00"
    var returnTm = year + '/' + month + '/' + day + '-' + hour + ':' + time
    return returnTm
}

function convertGetTablePrevDataTm(tm) {
    var year = tm.substr(0, 4)
    var month = tm.substr(4, 2)
    var day = tm.substr(6, 2)
    var hour = tm.substr(8, 2)
    var min = tm.substr(10, 2)
    var returnTm = year + '/' + month + '/' + day + '-' + hour + ':' + min

    return returnTm
}

function convertDataTM(tm) {
    tm += ''
    var year = tm.substr(0, 4)
    var month = tm.substr(4, 2)
    var day = tm.substr(6, 2)
    var hour = tm.substr(8, 2)
    var min = tm.substr(10, 2)
    var returnTm = year + '.' + month + '.' + day + ' ' + hour + ':' + min

    return returnTm
}

function convertAvgChartDataTM(tm) {
    tm += ''
    var year = tm.substr(0, 4)
    var month = tm.substr(4, 2)
    var day = tm.substr(6, 2)
    var hour = tm.substr(8, 2)
    var min = tm.substr(10, 2)
    var returnTm = year + '-' + month + '-' + day + ' ' + hour + ':' + min

    return returnTm
}

function convertMapChartDataTM(tm) {
    tm += ''
    var year = tm.substr(0, 4)
    var month = tm.substr(4, 2)
    var day = tm.substr(6, 2)
    var hour = tm.substr(8, 2)
    var min = tm.substr(10, 2)
    var returnTm = hour + ':' + min

    return returnTm
}

function convertPm25(value) {
    var cipi = "";
    if (value >= 0 && value <= 15) {
        cipi = 100 - 10 * (value / 15);
    } else if (value > 15 && value <= 35) {
        cipi = 89 - 9 * ((value - 16) / 19);
    } else if (value > 35 && value <= 75) {
        cipi = 79 - (29) * ((value - 36) / 39);
        tempObject = { "초미세먼지": "나쁨" }
        if (badValues != null) badValues.push(tempObject);
    } else if (value > 75 && value <= 500) {
        cipi = 49 - (49) * ((value - 76) / 424);
        tempObject = { "초미세먼지": "매우나쁨" }
        if (badValues != null) badValues.push(tempObject);
    }

    return Math.round(cipi);
}

function convertPm25Normal(value) {
    var cipi = "";
    if (value >= 0 && value <= 15) {
        cipi = 100 - 10 * (value / 15);
    } else if (value >= 16 && value <= 35) {
        cipi = 89 - 9 * ((value - 16) / 19);
    } else if (value >= 36 && value <= 75) {
        cipi = 79 - (29) * ((value - 36) / 39);
    } else if (value >= 76 && value <= 500) {
        cipi = 49 - (49) * ((value - 76) / 424);
    }

    return Math.round(cipi);
}

function convertPm25Color(value) {
    if (value == null) {
        return "";
    }

    if (value >= 0 && value <= 15) {
        return "blue";
    } else if (value > 15 && value <= 35) {
        return "green";
    } else if (value > 35 && value <= 75) {
        return "orange";
    } else {
        return "red";
    }
}

function convertPm10(value) {
    var cipi = "";
    if (value >= 0 && value <= 30) {
        cipi = 100 - 10 * (value / 30);
    } else if (value > 30 && value <= 80) {
        cipi = 89 - 9 * ((value - 31) / 49);
    } else if (value > 80 && value <= 150) {
        cipi = 79 - (29) * ((value - 81) / 69);
        tempObject = { "미세먼지": "나쁨" }
        if (badValues != null) badValues.push(tempObject);
    } else if (value > 150 && value <= 1000) {
        cipi = 49 - (49) * ((value - 151) / 449);
        tempObject = { "미세먼지": "매우나쁨" }
        if (badValues != null) badValues.push(tempObject);
    }

    return Math.round(cipi);
}

function convertPm10Normal(value) {
    var cipi = "";
    if (value >= 0 && value <= 30) {
        cipi = 100 - 10 * (value / 30);
    } else if (value >= 31 && value <= 80) {
        cipi = 89 - 9 * ((value - 31) / 49);
    } else if (value >= 81 && value <= 150) {
        cipi = 79 - (29) * ((value - 81) / 69);
    } else if (value >= 151 && value <= 600) {
        cipi = 49 - (49) * ((value - 151) / 449);
    }

    return Math.round(cipi);
}

function convertPm10Color(value) {
    if (value == null) {
        return "";
    }

    if (value >= 0 && value <= 30) {
        return "blue";
    } else if (value > 30 && value <= 80) {
        return "green";
    } else if (value > 80 && value <= 150) {
        return "orange";
    } else {
        return "red";
    }
}

function convertCo2(value) {
    var cipi = "";

    if (value >= 0 && value <= 500) {
        cipi = 100 - 10 * (value / 500);
    } else if (value >= 501 && value <= 1000) {
        cipi = 89 - 9 * ((value - 501) / 499);
    } else if (value >= 1001 && value <= 1500) {
        cipi = 79 - (29) * ((value - 1001) / 499);
        tempObject = { "이산화탄소": "나쁨" }
        if (badValues != null) badValues.push(tempObject);
    } else if (value >= 1501 && value <= 10000) {
        cipi = 49 - (49) * ((value - 1501) / 8449);
        tempObject = { "이산화탄소": "매우나쁨" }
        if (badValues != null) badValues.push(tempObject);
    }

    return Math.round(cipi);
}

function convertCo2Color(value) {
    if (value == null) {
        return "";
    }

    if (value >= 0 && value <= 500) {
        return "blue";
    } else if (value >= 501 && value <= 1000) {
        return "green";
    } else if (value >= 1001 && value <= 1500) {
        return "orange";
    } else {
        return "red";
    }
}

// 일반 실외 기준 이산화탄소 지수 (매우좋음 425 / 좋음 450 / 나쁨 550 ppm 경계)
// monitoring 페이지 전용 — convertCo2(실내 기준, 통계/분석 페이지용)와는 별도로 사용한다
function convertCo2Outdoor(value) {
    var cipi = "";

    if (value >= 0 && value < 425) {
        cipi = 100 - 11 * (value / 425);
    } else if (value >= 425 && value < 450) {
        cipi = 89 - 9 * ((value - 425) / 25);
    } else if (value >= 450 && value < 550) {
        cipi = 79 - (29) * ((value - 450) / 100);
        tempObject = { "이산화탄소": "나쁨" }
        if (badValues != null) badValues.push(tempObject);
    } else {
        // 550ppm 이상: 550~2000 구간에서 49→0으로 매핑, 그 이상은 0으로 고정
        cipi = Math.max(0, 49 - (49) * ((value - 550) / 1450));
        tempObject = { "이산화탄소": "매우나쁨" }
        if (badValues != null) badValues.push(tempObject);
    }

    return Math.round(cipi);
}

// 일반 실외 기준 메탄 지수 (매우좋음 1.95 / 좋음 2.10 / 나쁨 2.50 ppm 경계)
function convertCh4Outdoor(value) {
    var cipi = "";

    if (value >= 0 && value < 1.95) {
        cipi = 100 - 11 * (value / 1.95);
    } else if (value >= 1.95 && value < 2.10) {
        cipi = 89 - 9 * ((value - 1.95) / 0.15);
    } else if (value >= 2.10 && value < 2.50) {
        cipi = 79 - (29) * ((value - 2.10) / 0.40);
        tempObject = { "메탄": "나쁨" }
        if (badValues != null) badValues.push(tempObject);
    } else {
        // 2.50ppm 이상: 2.50~5.00 구간에서 49→0으로 매핑, 그 이상은 0으로 고정
        cipi = Math.max(0, 49 - (49) * ((value - 2.50) / 2.50));
        tempObject = { "메탄": "매우나쁨" }
        if (badValues != null) badValues.push(tempObject);
    }

    return Math.round(cipi);
}

function convertVOCs(value) {
    var cipi = "";

    if (value >= 0 && value <= 200) {
        cipi = 100 - 10 * (value / 200);
    } else if (value >= 201 && value <= 400) {
        cipi = 89 - 9 * ((value - 201) / 199);
    } else if (value >= 401 && value <= 1000) {
        cipi = 79 - (29) * ((value - 401) / 599);
        tempObject = { "휘발성유기화합물": "나쁨" }
        if (badValues != null) badValues.push(tempObject);
    } else if (value >= 1001 && value <= 10000) {
        cipi = 49 - (49) * ((value - 1001) / 8999);
        tempObject = { "휘발성유기화합물": "매우나쁨" }
        if (badValues != null) badValues.push(tempObject);
    }

    return Math.round(cipi);
}

function convertVOCsColor(value) {
    if (value == null) {
        return "";
    }

    if (value >= 0 && value <= 200) {
        return "blue";
    } else if (value >= 201 && value <= 400) {
        return "green";
    } else if (value >= 401 && value <= 1000) {
        return "orange";
    } else {
        return "red";
    }
}

function convertNoise(value) {
    var cipi = "";

    if (value >= 0 && value <= 30) {
        cipi = 100 - 10 * (value / 30);
    } else if (value >= 31 && value <= 55) {
        cipi = 89 - 9 * ((value - 31) / 24);
    } else if (value >= 56 && value <= 70) {
        cipi = 79 - (29) * ((value - 56) / 14);
        tempObject = { "소음": "나쁨" }
        if (badValues != null) badValues.push(tempObject);
    } else if (value >= 71 && value <= 100) {
        cipi = 49 - (49) * ((value - 71) / 29);
        tempObject = { "소음": "매우나쁨" }
        if (badValues != null) badValues.push(tempObject);
    }

    return Math.round(cipi);
}

function convertNoiseColor(value) {
    if (value == null) {
        return "";
    }

    if (value >= 0 && value <= 30) {
        return "blue";
    } else if (value >= 31 && value <= 55) {
        return "green";
    } else if (value >= 56 && value <= 70) {
        return "orange";
    } else {
        return "red";
    }
}

function convertCiciColor(value) {
    if (value == null) {
        return "";
    }

    if (value >= 90 && value <= 100) {
        return "blue";
    } else if (value >= 80 && value < 90) {
        return "green";
    } else if (value >= 60 && value < 70) {
        return "orange";
    } else {
        return "red";
    }
}

function convertTempIAQ(value) {
    var cipi = "";
    //if(value >= 0.0 && value <= 13.9) {
    if (value >= -30.0 && value <= 13.9) {
        cipi = 49 - (49) * ((13.9 - value) / 43.9);
        tempObject = { "온도": "매우추움" }
        if (badValues != null) badValues.push(tempObject);
    } else if (value >= 30.1 && value <= 34.0) {
        cipi = 49 - (49) * ((value - 30.1) / 3.9);
        tempObject = { "온도": "매우더움" }
        if (badValues != null) badValues.push(tempObject);
    } else if (value >= 14.0 && value <= 15.9) {
        cipi = 79 - (29) * ((15.9 - value) / 1.9);
        tempObject = { "온도": "추움" }
        if (badValues != null) badValues.push(tempObject);
    } else if (value >= 27.1 && value <= 30.0) {
        cipi = 79 - (29) * ((value - 27.1) / 2.9);
        tempObject = { "온도": "더움" }
        if (badValues != null) badValues.push(tempObject);
    } else if (value >= 16.0 && value <= 17.9) {
        cipi = 89 - 9 * ((17.9 - value) / 1.9);
    } else if (value >= 24.1 && value <= 27.0) {
        cipi = 89 - 9 * ((value - 24.1) / 2.9);
    } else if (value >= 18.0 && value <= 21.0) {
        cipi = 100 - 10 * ((21.0 - value) / 3.0);
    } else if (value >= 21.0 && value <= 24.0) {
        cipi = 100 - 10 * ((value - 21.0) / 3.0);
    }

    return Math.round(cipi);
}

function convertTempIAQColor(value) {
    if (value == null) {
        return "";
    }

    if (value <= 13.9) {
        return "red";
    } else if (value >= 30.1 && value <= 34.0) {
        return "red";
    } else if (value >= 14.0 && value <= 15.9) {
        return "orange";
    } else if (value >= 27.1 && value <= 30.0) {
        return "orange";
    } else if (value >= 16.0 && value <= 17.9) {
        return "green";
    } else if (value >= 24.1 && value <= 27.0) {
        return "green";
    } else if (value >= 18.0 && value <= 21.0) {
        return "blue";
    } else if (value >= 21.0 && value <= 24.0) {
        return "blue";
    }
}

function convertTempOAQ(value) {
    var cipi = "";

    if (value >= -30.0 && value <= -5.1) {
        cipi = 49 - (49) * ((5.1 - value) / 24.9);
    } else if (value >= -5.0 && value <= -0.1) {
        cipi = 79 - (29) * ((0.1 - value) / 4.9);
    } else if (value >= 0.0 && value <= 8.9) {
        cipi = 89 - 9 * ((8.9 - value) / 8.9);
    } else if (value >= 9.0 && value <= 13.5) {
        cipi = 100 - 10 * ((13.5 - value) / 4.5);
    } else if (value >= 13.5 && value <= 18.0) {
        cipi = 100 - 10 * ((value - 13.5) / 4.5);
    } else if (value >= 18.1 && value <= 25.0) {
        cipi = 89 - 9 * ((value - 18.1) / 6.9);
    } else if (value >= 25.1 && value <= 33.0) {
        cipi = 79 - (29) * ((value - 25.1) / 4.9);
    } else if (value >= 33.1 && value <= 50.0) {
        cipi = 49 - (49) * ((value - 33.1) / 16.9);
    }

    return Math.round(cipi);
}

function convertTempOAQColor(value) {
    if (value == null) {
        return "";
    }

    if (value <= -5.1) {
        return "red";
    } else if (value >= 33.1 && value <= 50.0) {
        return "red";
    } else if (value >= -5.0 && value <= -0.1) {
        return "orange";
    } else if (value >= 25.1 && value <= 33.0) {
        return "orange";
    } else if (value >= 0.0 && value <= 8.9) {
        return "green";
    } else if (value >= 18.1 && value <= 25.0) {
        return "green";
    } else if (value >= 9.0 && value <= 13.5) {
        return "blue";
    } else if (value >= 13.5 && value <= 18.0) {
        return "blue";
    }
}

function convertTempOAQColorNew(value) {
    if (value == null) {
        return "";
    }

    if (value <= -5.1) {
        return "red";
    } else if (value >= 33.1 && value <= 50.0) {
        return "red";
    } else if (value >= -5.0 && value <= -0.1) {
        return "orange";
    } else if (value >= 25.1 && value <= 33.0) {
        return "orange";
    } else if (value >= 0.0 && value <= 8.9) {
        return "green";
    } else if (value >= 18.1 && value <= 25.0) {
        return "green";
    } else if (value >= 9.0 && value <= 13.5) {
        return "blue";
    } else if (value >= 13.5 && value <= 18.0) {
        return "blue";
    }
}

function convertHumiIAQ(value) {
    var cipi = "";

    if (value >= 0.0 && value <= 19.9) {
        cipi = 49 - (49) * ((19.9 - value) / 19.9);
        tempObject = { "습도": "매우건조" }
        if (badValues != null) badValues.push(tempObject);
    } else if (value >= 90.1 && value <= 100) {
        cipi = 49 - (49) * ((value - 90.1) / 9.9);
        tempObject = { "습도": "매우습함" }
        if (badValues != null) badValues.push(tempObject);
    } else if (value >= 20.0 && value <= 34.9) {
        cipi = 79 - (29) * ((34.9 - value) / 14.9);
        tempObject = { "습도": "건조" }
        if (badValues != null) badValues.push(tempObject);
    } else if (value >= 75.1 && value <= 90.0) {
        cipi = 79 - (29) * ((value - 75.1) / 24.9);
        tempObject = { "습도": "습함" }
        if (badValues != null) badValues.push(tempObject);
    } else if (value >= 35.0 && value <= 39.9) {
        cipi = 89 - 9 * ((39.9 - value) / 4.9);
    } else if (value >= 60.1 && value <= 75.0) {
        cipi = 89 - 9 * ((value - 60.1) / 14.9);
    } else if (value >= 40.0 && value <= 50.0) {
        cipi = 100 - 10 * ((50 - value) / 10.0);
    } else if (value >= 50.0 && value <= 60.0) {
        cipi = 100 - 10 * ((value - 50.0) / 10.0);
    }

    return Math.round(cipi);
}

function convertHumiIAQColor(value) {
    if (value == null) {
        return "";
    }

    if (value >= 0.0 && value <= 19.9) {
        return "red";
    } else if (value >= 90.1 && value <= 100) {
        return "red";
    } else if (value >= 20.0 && value <= 34.9) {
        return "orange";
    } else if (value >= 75.1 && value <= 90.0) {
        return "orange";
    } else if (value >= 35.0 && value <= 39.9) {
        return "green";
    } else if (value >= 60.1 && value <= 75.0) {
        return "green";
    } else if (value >= 40.0 && value <= 50.0) {
        return "blue";
    } else if (value >= 50.0 && value <= 60.0) {
        return "blue";
    }
}


function convertHumiOAQ(value) {
    var cipi = "";

    if (value >= 0.0 && value <= 29.9) {
        cipi = 49 - (49) * ((29.9 - value) / 29.9);
    } else if (value >= 30.0 && value <= 39.9) {
        cipi = 79 - (29) * ((39.9 - value) / 9.9);
    } else if (value >= 40.0 && value <= 49.9) {
        cipi = 89 - 9 * ((49.9 - value) / 9.9);
    } else if (value >= 50.0 && value <= 60.0) {
        cipi = 100 - 10 * ((60 - value) / 10.0);
    } else if (value >= 60.0 && value <= 70.0) {
        cipi = 100 - 10 * ((value - 60.0) / 10.0);
    } else if (value >= 70.1 && value <= 80.0) {
        cipi = 89 - 9 * ((value - 70.1) / 9.9);
    } else if (value >= 80.1 && value <= 90.0) {
        cipi = 79 - (29) * ((value - 80.1) / 9.9);
    } else if (value >= 90.1 && value <= 100) {
        cipi = 49 - (49) * ((value - 90.1) / 9.9);
    }

    return Math.round(cipi);
}

function convertHumiOAQColor(value) {
    if (value == null) {
        return "";
    }

    if (value >= 0.0 && value <= 29.9) {
        return "red";
    } else if (value >= 90.1 && value <= 100) {
        return "red";
    } else if (value >= 30.0 && value <= 39.9) {
        return "orange";
    } else if (value >= 80.1 && value <= 90.0) {
        return "orange";
    } else if (value >= 40.0 && value <= 49.9) {
        return "green";
    } else if (value >= 70.1 && value <= 80.0) {
        return "green";
    } else if (value >= 50.0 && value <= 60.0) {
        return "blue";
    } else if (value >= 60.0 && value <= 70.0) {
        return "blue";
    }
}

function convertHumiOAQColorNew(value) {
    if (value == null) {
        return "";
    }

    if (value >= 0.0 && value <= 29.9) {
        return "red";
    } else if (value >= 90.1 && value <= 100) {
        return "red";
    } else if (value >= 30.0 && value <= 39.9) {
        return "orange";
    } else if (value >= 80.1 && value <= 90.0) {
        return "orange";
    } else if (value >= 40.0 && value <= 49.9) {
        return "green";
    } else if (value >= 70.1 && value <= 80.0) {
        return "green";
    } else if (value >= 50.0 && value <= 60.0) {
        return "blue";
    } else if (value >= 60.0 && value <= 70.0) {
        return "blue";
    }
}
var tags = [];

/** prev data convert */
function convertPrevData(data, isGraph) {
    console.log(data, isGraph)

    if (data.length < 1) {
        $(".loader-box").empty()
        var html = '<div class="loader2">데이터가 없습니다.</div>'
        $(".loader-box").html(html)
    }
    if (tags.length > 0) {
        tags = [];
    }
    var dataTimeKeys = Object.keys(data[0].dps);
    var returnData = [];
    for (var i in dataTimeKeys) {
        var returnJson = {}
        for (var j in data) {
            if (data[j].tags.sensor != 'tm' && data[j].dps[dataTimeKeys[i]] != undefined && data[j].dps[dataTimeKeys[i]] != null) {
                returnJson[data[j].tags.sensor] = data[j].dps[dataTimeKeys[i]].toFixed(1)
            }
        }
        returnJson['tm'] = isGraph ? convertChartDataTM(dataTimeKeys[i]) : convertTableDataTM(dataTimeKeys[i])
        returnData.push(returnJson)
    }
    returnData = convertAddEmptyDate(returnData, ($("#time-interval").val() != undefined ? $("#time-interval").val().replace("-avg-none", "") : '1m'), isGraph)
    tags = Object.keys(returnData[0])
    return returnData;
}
/** prev data convert */
function convertPrevDataTable(data, isGraph) {
    console.log(data, isGraph)

    if (data.length < 1) {
        $(".loader-box").empty()
        var html = '<div class="loader2">데이터가 없습니다.</div>'
        $(".loader-box").html(html)
    }
    if (tags.length > 0) {
        tags = [];
    }
    var dataTimeKeys = Object.keys(data[0].dps);
    var returnData = [];
    for (var i in dataTimeKeys) {
        var returnJson = {}
        for (var j in data) {
            if (data[j].tags.sensor != 'tm' && data[j].dps[dataTimeKeys[i]] != undefined && data[j].dps[dataTimeKeys[i]] != null) {
                returnJson[data[j].tags.sensor] = data[j].dps[dataTimeKeys[i]].toFixed(1)
            }
        }
        returnJson['tm'] = isGraph ? convertChartDataTM(dataTimeKeys[i]) : convertTableDataTM(dataTimeKeys[i])
        returnData.push(returnJson)
    }
    tags = Object.keys(returnData[0])
    return returnData;
}


function convertMapPrevData(data, isGraph) {
    if (data.length < 1) {
        $(".loader-box").empty()
        var html = '<div class="loader2">데이터가 없습니다.</div>'
        $(".loader-box").html(html)
    }
    if (tags.length > 0) {
        tags = [];
    }
    var dataTimeKeys = Object.keys(data[0].dps);
    var returnData = [];
    for (var i in dataTimeKeys) {
        var returnJson = {}
        for (var j in data) {
            if (data[j].tags.sensor != 'tm' && data[j].dps[dataTimeKeys[i]] != undefined && data[j].dps[dataTimeKeys[i]] != null) {
                returnJson[data[j].tags.sensor] = data[j].dps[dataTimeKeys[i]].toFixed(1)
            }
        }
        returnJson['tm'] = isGraph ? convertChartDataTM(dataTimeKeys[i]) : convertTableDataTM(dataTimeKeys[i])
        returnData.push(returnJson)
    }
    returnData = convertAddEmptyDate(returnData, '1h-avg-none', isGraph)
    tags = Object.keys(returnData[0])
    return returnData;
}

function convertMapGridPrevData(data, isGraph, is10m) {
    if (data.length < 1) {
        $(".loader-box").empty()
        var html = '<div class="loader2">데이터가 없습니다.</div>'
        $(".loader-box").html(html)
    }
    if (tags.length > 0) {
        tags = [];
    }
    var dataTimeKeys = Object.keys(data[0].dps);
    var returnData = [];
    for (var i in dataTimeKeys) {
        var returnJson = {}
        for (var j in data) {
            if (data[j].tags.sensor != 'tm' && data[j].dps[dataTimeKeys[i]] != undefined && data[j].dps[dataTimeKeys[i]] != null) {
                returnJson[data[j].tags.sensor] = data[j].dps[dataTimeKeys[i]].toFixed(1)
            }
        }
        returnJson['tm'] = isGraph ? convertChartDataTM(dataTimeKeys[i]) : convertTableDataTM(dataTimeKeys[i])
        returnData.push(returnJson)
    }
    returnData = convertAddEmptyDate(returnData, is10m ? '10m' : '1h', isGraph)

    tags = Object.keys(returnData[0])
    return returnData;
}


function convertMultiPrevData(data) {
    if (tags.length > 0) {
        tags = [];
    }
    var dataTimeKeys = Object.keys(data[0].dps);
    var returnData = [];
    for (var i in data) {
        returnData[data[i].tags.sensor] = [];
        for (var j in dataTimeKeys) {
            returnData[data[i].tags.sensor].push(data[i].dps[dataTimeKeys[j]])
        }
    }


    tags = Object.keys(returnData)
    return returnData;
}

async function convertGraphTags(unit) {
    var unitKor = [];
    var unitEng = [];
    for (var i = 0; i < unit.length; i += 2) {
        unitKor.push(unit[i]);
        unitEng.push(unit[i + 1]);
    }
    var sensorTages = await get_api.makeSenesorTags();
    var makeArr = [];
    var returnJson = {
        'data': [],
        'elementUnit': []
    };
    // 필수 순서
    // var data = unit;
    var orderUnitArr = ["이산화탄소", "메탄", "온도", "습도", "풍향", "풍속", "미세먼지", "초미세먼지", "자외선", "오존", "이산화질소", "이산화황", "일산화탄소", "황화수소", "암모니아", "조도", "온열지수", "소음"]
    var data = [];
    var allElementUnit = {};
    var elementUnit = [];
    // for (var j in unitEng) {
    //     sensorTages.filter(function (e) {
    //         if (e.engName == unitEng[j]) {
    //             makeArr[(j * 2)] = e.engName;
    //             makeArr[(j * 2) + 1] = e.korName + " (" + e.viewName + ")";
    //             allElementUnit['' + e.engName] = e.elementUnit;
    //         }
    //     });
    // }
    for (var i in orderUnitArr) {
        sensorTages.filter(function (e) {
            if (orderUnitArr[i] == e.korName) {
                makeArr[(i * 2)] = e.engName;
                makeArr[(i * 2) + 1] = orderUnitArr[i] + " (" + e.viewName + ")";
                allElementUnit['' + e.engName] = e.elementUnit;
            }
        })
    }
    // for (var i = 0; i < unit.length; i += 2){

    // sensorTages.filter(function (e) {
    //     if (e.engName == unit[i + 1]) {
    //         makeArr[(i * 2)] = e.engName;
    //         makeArr[(i * 2) + 1] = e.korName + "<br> (" + e.viewName + ")";
    //         allElementUnit['' + e.engName] = e.elementUnit;
    //     }
    // } );

    // }


    for (var i in unitEng) {
        if (makeArr.indexOf(unitEng[i]) > -1) {
            elementUnit.push(allElementUnit[unitEng[i]])


        }
    }
    console.log('makeArr', makeArr)
    returnJson.data = makeArr;
    returnJson.elementUnit = elementUnit
    return returnJson
}

async function convertWindDir(val) {
    var $val = val;
    var $wdir_text = ''
    if ($val <= 22.5) {
        $wdir_text = "북";
    } else if ($val <= 67.5) {
        $wdir_text = "북동";
    } else if ($val <= 112.5) {
        $wdir_text = "동";
    } else if ($val <= 157.5) {
        $wdir_text = "남동";
    } else if ($val <= 202.5) {
        $wdir_text = "남";
    } else if ($val <= 247.5) {
        $wdir_text = "남서";
    } else if ($val <= 292.5) {
        $wdir_text = "서";
    } else if ($val <= 337.5) {
        $wdir_text = "북서";
    } else if ($val <= 360) {
        $wdir_text = "북";
    } else {
        $wdir_text = "-";
    }
    return $wdir_text;
}


/** 데이터 값에 빈 tm 채워넣는 함수 */
function convertAddEmptyDate(data, timeUnit, isChart) {
    console.log('data', data)
    var time = timeUnit == '1m' ? 1440 : timeUnit == '10m' ? 144 : timeUnit == '1h' ? 24 : 1;
    var addLength = data.length == time ? 0 : time - (data.length % time);
    // convertChartDataTM
    // convertTableDataTM
    var addDate = isChart ? convertGetTablePrevDataTm(data[data.length - 1]['tm']) : new Date(data[data.length - 1]['tm']);
    addDate = new Date(addDate)
    for (var i = 0; i < addLength; i++) {
        if (timeUnit == '1m') {
            if (isChart) {
                data.push({ 'tm': addConvertChartDataTM(addDate.setMinutes(addDate.getMinutes() + 1)) })
            }
            else {
                data.push({ 'tm': addConvertTableDataTM(addDate.setMinutes(addDate.getMinutes() + 1)) })
            }
        }
        else if (timeUnit == '10m') {
            if (isChart) {
                data.push({ 'tm': addConvertChartDataTM(addDate.setMinutes(addDate.getMinutes() + 10)) })
            }
            else {
                data.push({ 'tm': addConvertTableDataTM(addDate.setMinutes(addDate.getMinutes() + 10)) })
            }
        }
        if (timeUnit == '1h') {
            if (isChart) {
                data.push({ 'tm': addConvertChartDataTM(addDate.setHours(addDate.getHours() + 1)) })
            }
            else {
                data.push({ 'tm': addConvertTableDataTM(addDate.setHours(addDate.getHours() + 1)) })
            }
        }
    }
    console.log('data', data)
    return data;



}


function convertWeatherGetAPITime(dateString) {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    const hour = dateString.slice(8, 10);
    const minute = dateString.slice(10, 12);

    // Format the extracted parts
    const formattedDate = `${year}.${month}.${day} ${hour}:${minute}`;

    return formattedDate;
}



function degreeToAzimuth(degree) {
    const azimuths = [
        "북", "북북동", "북동", "동북동", "동", "동남동", "남동", "남남동",
        "남", "남남서", "남서", "서남서", "서", "서북서", "북서", "북북서"
    ];

    // Normalize the degree to be within [0, 360)
    let normalizedDegree = degree % 360;
    if (normalizedDegree < 0) {
        normalizedDegree += 360;
    }

    // Calculate the index for the azimuth array
    const index = Math.floor(normalizedDegree / 22.5);

    return azimuths[index];
}




function gradeColorText(grade) {
    var returnJson;
    var colorHex;
    var colorText;
    // #4595ff 좋음
    // #00d27a 보통
    // #ffa800 나쁨
    // #ff0000 매우나쁨
    switch (grade) {
        case 1:
            colorHex = '#4595ff'
            colorText = '좋음'
            break;
        case 2:
            colorHex = '#00d27a'
            colorText = '보통'
            break;
        case 3:
            colorHex = '#ffa800'
            colorText = '나쁨'
            break;
        case 4:
            colorHex = '#ff0000'
            colorText = '매우나쁨'
            break;
        default:
            colorHex = '#000000'
            colorText = '수신X'
            break;
    }

    returnJson = {
        'colorHex': colorHex,
        'colorText': colorText
    }
    return returnJson
}
function formatDateString(dateString) {
    // Extract year, month, and day from the date string
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);

    // Create a Date object for the given date
    const date = new Date(`${year}-${month}-${day}`);

    // Get day of the week in Korean
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

    // Function to format date and day of week
    const formatDate = (date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dayOfWeek = daysOfWeek[date.getDay()];
        return `${month}/${day} (${dayOfWeek})`;
    };

    // Create an array to store the formatted dates
    const formattedDates = [];

    // Format today's date
    formattedDates.push(`오늘 ${formatDate(date)}`);

    // Format the next 7 days
    for (let i = 1; i <= 6; i++) {
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + i);
        if (i == 1) {
            formattedDates.push(`내일 ${formatDate(nextDate)}`);

        }
        else {
            formattedDates.push(`${formatDate(nextDate)}`);

        }
    }

    // Return the formatted dates
    return formattedDates;
}

function formatDongDateString(dateString) {
    // Extract year, month, and day from the date string
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);

    // Create a Date object for the given date
    const date = new Date(`${year}-${month}-${day}`);

    // Get day of the week in Korean
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

    // Function to format date and day of week
    const formatDate = (date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dayOfWeek = daysOfWeek[date.getDay()];
        return `${month}/${day} (${dayOfWeek})`;
    };

    // Create an array to store the formatted dates
    const formattedDates = [];

    // Format today's date
    formattedDates.push(`오늘 ${formatDate(date)}`);

    // Format the next 7 days
    for (let i = 1; i <= 7; i++) {
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + i);
        if (i == 1) {
            formattedDates.push(`내일 ${formatDate(nextDate)}`);
        }
        else if (i == 2) {
            formattedDates.push(`모레 ${formatDate(nextDate)}`);
        }
        else {
            formattedDates.push(`${formatDate(nextDate)}`);

        }
    }

    // Return the formatted dates
    return formattedDates;
}


function convertReportData(data, dataTimeKeys, isGraph) {
    let returnData = [];
    for (let timeKey of dataTimeKeys) {
        let returnJson = {};
        for (let item of data) {
            if (item.tags.sensor !== 'tm') {
                let dpsValue = item.dps[timeKey];
                if (dpsValue !== undefined && dpsValue !== null) {
                    returnJson[item.tags.sensor] = dpsValue.toFixed(1);
                }
            }
        }

        returnJson['tm'] = timeKey;

        returnData.push(returnJson);
    }

    return returnData;
}

function convertReportDataGrade(data, type) {
    var returnCssText;
    if (type == 'pm25') {
        if (data < 15) {
            returnCssText = "cde3"
        }
        else if (data < 35) {
            returnCssText = "d9f"
        }
        else if (data < 75) {
            returnCssText = "ffd"
        }
        else {
            returnCssText = "aca"
        }

    }
    else if (type == 'pm10') {
        if (data < 30) {
            returnCssText = "cde3"
        }
        else if (data < 80) {
            returnCssText = "d9f"
        }
        else if (data < 150) {
            returnCssText = "ffd"
        }
        else {
            returnCssText = "aca"
        }

    }
    else if (type == 'temp') {
        if (data < -5) {
            returnCssText = "aca-line"
        }
        else if (data < 0) {
            returnCssText = "ffd-line"
        }
        else if (data < 9) {
            returnCssText = "d9f-line"
        }
        else if (data < 18) {
            returnCssText = "cde3"
        }
        else if (data < 25) {
            returnCssText = "d9f"
        }
        else if (data < 33) {
            returnCssText = "ffd"
        }
        else {
            returnCssText = "aca"
        }
    }
    else {
        if (data < 20) {
            returnCssText = "aca-line"
        }
        else if (data < 35) {
            returnCssText = "ffd-line"
        }
        else if (data < 40) {
            returnCssText = "d9f-line"
        }
        else if (data < 60) {
            returnCssText = "cde3"
        }
        else if (data < 75) {
            returnCssText = "d9f"
        }
        else if (data < 90) {
            returnCssText = "ffd"
        }
        else {
            returnCssText = "aca"
        }
    }
    return returnCssText;
}

function getConvertCoaiPerData(data, unit) {
    var returnData = [];
    var arr = ['좋음', '보통', '나쁨', '매우나쁨']
    var timeArr = Object.keys(data.find(e => e['tags']['sensor'] == 'tm')['dps'])
    var unitData = data.find(e => e['tags']['sensor'] == unit)['dps']
    var goodCount = 0;
    var nomalCount = 0;
    var badCount = 0;
    var varyBadCount = 0;
    var totalDataLength = timeArr.length;;
    for (var i in unitData) {
        if (unitData[i] >= 90) {
            goodCount++
        }
        else if (unitData[i] >= 80) {
            nomalCount++
        }
        else if (unitData[i] >= 50) {
            badCount++
        }
        else {
            varyBadCount++
        }
    }
    var gradeCount = [goodCount, nomalCount, badCount, varyBadCount]

    for (var j in arr) {
        var json = {
            size: ((gradeCount[j] / totalDataLength) * 100),
            sector: arr[j]
        }
        returnData.push(json)
    }
    return returnData;
}


function getConver2pageLineData(data, unit, time, countUnitData) {
    var returnData = [];
    var arr = ['좋음', '보통', '나쁨', '매우나쁨']
    var arr2 = ['매우추움', '추움', '서늘', '쾌적', '따뜻', '더움', '매우더움'];
    var arr3 = ['매우건조', '건조', '약간건조', '쾌적', '약간습함', '습함', '매우습함'];
    var colorArr1 = ["#4595FF", "#00D27A", "#FFA800", "#FF0000"];
    var colorArr2 = ["#FF0000", "#FFA800", "#00D27A", "#4595FF", "#00D27A", "#FFA800", "#FF0000"]
    var timeArr = time
    var unitData = data
    var totalDataLength = timeArr.length;
    var gradeCount = countUnitData;
    var forArr = (unit == 'pm25' || unit == 'pm10') ? arr : unit == 'temp' ? arr2 : arr3
    var forColorArr = (unit == 'pm25' || unit == 'pm10') ? colorArr1 : colorArr2;
    var addedPercent = 0;
    var fromPercent = 0;
    for (var j in forArr) {
        fromPercent = addedPercent;
        addedPercent += Math.floor((gradeCount[j] / totalDataLength) * 100)
        var json = {
            category: '',
            color: forColorArr[j],
            to: addedPercent,
            from: fromPercent,
            val: Math.floor((gradeCount[j] / totalDataLength) * 100),
            name: forArr[j],
            pattern: (forArr.length == 7 && (j == 0 || j == 1 || j == 2)) ? true : false
        }
        returnData.push(json)
    }
    return returnData;
}

function convertCountReportDataGrade(data, time) {
    var returnData = {};
    var timeArr = time
    var unitArr = ['pm25', 'pm10', 'temp', 'humi']
    var unitData;

    var totalDataLength = timeArr.length;
    for (var j in unitArr) {
        var grade1 = 0;
        var grade2 = 0;
        var grade3 = 0;
        var grade4 = 0;
        var grade5 = 0;
        var grade6 = 0;
        var grade7 = 0;
        unitData = (data['avg'].find(e => e['tags']['sensor'] == unitArr[j]))['dps']
        for (var i in unitData) {
            if (unitArr[j] == 'pm25') {
                if (unitData[i] <= 15) {
                    grade1 += 1
                }
                else if (unitData[i] <= 35) {
                    grade2 += 1
                }
                else if (unitData[i] <= 75) {
                    grade3 += 1
                }
                else {
                    grade4 += 1
                }

            }
            else if (unitArr[j] == 'pm10') {
                if (unitData[i] <= 30) {
                    grade1 += 1
                }
                else if (unitData[i] <= 80) {
                    grade2 += 1
                }
                else if (unitData[i] <= 150) {
                    grade3 += 1
                }
                else {
                    grade4 += 1
                }

            }
            else if (unitArr[j] == 'temp') {
                if (unitData[i] <= -5) {
                    grade1 += 1
                }
                else if (unitData[i] <= 0) {
                    grade2 += 1
                }
                else if (unitData[i] <= 9) {
                    grade3 += 1
                }
                else if (unitData[i] <= 18) {
                    grade4 += 1
                }
                else if (unitData[i] <= 25) {
                    grade5 += 1
                }
                else if (unitData[i] <= 33) {
                    grade6 += 1
                }
                else {
                    grade7 += 1
                }
            }
            else {
                if (unitData[i] <= 30) {
                    grade1 += 1
                }
                else if (unitData[i] <= 40) {
                    grade2 += 1
                }
                else if (unitData[i] <= 50) {
                    grade3 += 1
                }
                else if (unitData[i] <= 70) {
                    grade4 += 1
                }
                else if (unitData[i] <= 80) {
                    grade5 += 1
                }
                else if (unitData[i] <= 90) {
                    grade6 += 1
                }
                else {
                    grade7 += 1
                }

            }
        }
        var gradeCount = [grade1, grade2, grade3, grade4, grade5, grade6, grade7]
        returnData[unitArr[j]] = gradeCount
    }




    return returnData
}


function convertMaxMinAvgGraph(reportData, tmArr, year, month) {

    var firstDay = new Date(year, month - 1, 1).getDay();

    var weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    var time = reportData['avg'].find(e => e['tags']['sensor'] == 'tm')['dps']
    var timeArray = [];
    var unitArr = ['pm25', 'pm10', 'temp', 'humi']
    var returnJson = {
        'pm25': [],
        'pm10': [],
        'temp': [],
        'humi': []
    }

    tmArr.forEach((element) => timeArray.push((time[element] + "").substr(0, 8)));

    for (var i in unitArr) {
        for (var j in tmArr) {
            var initJson = {}


            initJson['avg'] = reportData['avg'].find(e => e['tags']['sensor'] == unitArr[i])['dps'][tmArr[j]].toFixed(1);
            initJson['max'] = reportData['max'].find(e => e['tags']['sensor'] == unitArr[i])['dps'][tmArr[j]].toFixed(1);
            initJson['min'] = reportData['min'].find(e => e['tags']['sensor'] == unitArr[i])['dps'][tmArr[j]].toFixed(1);
            initJson['fullDate'] = timeArray[j]
            initJson['day_week'] = weekdays[(firstDay + (j * 1)) % 7];
            initJson['date'] = (j * 1) + 1
            returnJson[unitArr[i]].push(initJson)
        }
    }
    return returnJson
}


function getRadarData(data, unit, monthDayLength) {
    var returnData = []
    var arr2 = ['매우추움', '추움', '서늘', '쾌적', '따뜻', '더움', '매우더움'];
    var arr3 = ['매우건조', '건조', '약간건조', '쾌적', '약간습함', '습함', '매우습함'];
    var arr = unit == 'temp' ? arr2 : arr3
    for (var i in arr) {
        var initJson = {
            'indicator': arr[i],
            'litres': ((data[i] / monthDayLength) * 100).toFixed(1) * 1
        }
        returnData.push(initJson)
    }
    return returnData;
}

function convertPm25ResultMinMaxText(data) {
    var returnText;
    if (data <= 15) {
        returnText = '<em class="blue_f"> \'좋음\'</em>'
    }
    else if (data <= 35) {
        returnText = '<em class="grn_f"> \'보통\' </em>'
    }
    else if (data <= 75) {
        returnText = '<em class="org_f"> \'나쁨\' </em>'
    }
    else {
        returnText = '<em class="red_f"> \'매우 나쁨\' </em>'
    }
    return returnText
}
function convertPm10ResultMinMaxText(data) {
    var returnText;
    if (data <= -5) {
        returnText = '<em class="red_f"> \'매우 추움\'</em>'
    }
    else if (data <= 0) {
        returnText = '<em class="org_f"> \'추움\' </em>'
    }
    else if (data <= 9) {
        returnText = '<em class="grn_f"> \'서늘\' </em>'
    }
    else if (data <= 18) {
        returnText = '<em class="blue_f"> \'쾌적\' </em>'
    }
    else if (data <= 25) {
        returnText = '<em class="grn_f"> \'따뜻\' </em>'
    }
    else if (data <= 33) {
        returnText = '<em class="org_f"> \'더움\' </em>'
    }
    else {
        returnText = '<em class="red_f"> \'매우 더움\' </em>'
    }
    return returnText


}
function convertTempResultMinMaxText(data) {
    var returnText;
    if (data <= -5) {
        returnText = '<em class="red_f"> \'매우 추움\'</em>'
    }
    else if (data <= 0) {
        returnText = '<em class="org_f"> \'추움\' </em>'
    }
    else if (data <= 9) {
        returnText = '<em class="grn_f"> \'서늘\' </em>'
    }
    else if (data <= 18) {
        returnText = '<em class="blue_f"> \'쾌적\' </em>'
    }
    else if (data <= 25) {
        returnText = '<em class="grn_f"> \'따뜻\' </em>'
    }
    else if (data <= 33) {
        returnText = '<em class="org_f"> \'더움\' </em>'
    }
    else {
        returnText = '<em class="red_f"> \'매우 더움\' </em>'
    }
    return returnText

}
function convertHumiResultMinMaxText(data) {
    var returnText;
    if (data <= 30) {
        returnText = '<em class="red_f"> \'매우 건조\'</em>'
    }
    else if (data <= 40) {
        returnText = '<em class="org_f"> \'건조\' </em>'
    }
    else if (data <= 50) {
        returnText = '<em class="grn_f"> \'약간 건조\' </em>'
    }
    else if (data <= 70) {
        returnText = '<em class="blue_f"> \'쾌적\' </em>'
    }
    else if (data <= 80) {
        returnText = '<em class="grn_f"> \'약간 습함\' </em>'
    }
    else if (data <= 90) {
        returnText = '<em class="org_f"> \'습함\' </em>'
    }
    else {
        returnText = '<em class="red_f"> \'매우 습함\' </em>'
    }
    return returnText
}

function prevConvertedPointData(data, selectedPrevTime) {
    var returnData = {}
    var serialArr = Object.keys(data);
    for (var i in serialArr) {
        returnData[serialArr[i]] = {}
        if (data[serialArr[i]].length > 0) {
            for (var j in data[serialArr[i]]) {

                returnData[serialArr[i]][data[serialArr[i]][j]['tags']['sensor']] = data[serialArr[i]][j]['dps'][selectedPrevTime / 1000]
            }
        }

    }
    return returnData
}
function prevConvertedAirPointData(data, selectedPrevTime) {
    var returnData = {}
    var filterdData = data.filter(function (e) {
        if (e.tags.sensor == 'pm10' || e.tags.sensor == 'pm25') {
            return e
        }
    })
    for (var i in filterdData) {
        if (filterdData[i].tags.sensor == 'pm10') {
            returnData['pm10'] = filterdData[i]['dps'][selectedPrevTime / 1000]
        }
        else {
            returnData['pm25'] = filterdData[i]['dps'][selectedPrevTime / 1000]
        }
    }
    return returnData
}

export { getDetailDateInNewDate, getDetailMapDateInNewDate, getHeatTmValue, getChartXValue, getChartXTitle, convertUpdateTM, convertListTM, convertGetPrevDataTm, convertDataTM, convertAvgChartDataTM, convertMapChartDataTM, convertPm25, convertPm25Normal, convertCo2, convertCo2Color, convertCo2Outdoor, convertCh4Outdoor, convertHumiIAQ, convertHumiIAQColor, convertHumiOAQ, convertHumiOAQColorNew, convertNoise, convertHumiOAQColor, convertNoiseColor, convertCiciColor, convertPm10, convertPm10Color, convertPm10Normal, convertPm25Color, convertTempIAQ, convertTempIAQColor, convertTempOAQ, convertTempOAQColor, convertTempOAQColorNew, convertVOCs, convertVOCsColor, convertPrevData, convertMapPrevData, convertMapGridPrevData, convertMultiPrevData, convertGraphTags, convertChartDataTM, convertGetTablePrevDataTm, convertGridApiTm, convertWindDir, convertAddEmptyDate, addConvertChartDataTM, addConvertTableDataTM, convertWeatherGetAPITime, degreeToAzimuth, gradeColorText, formatDateString, formatDongDateString, convertReportData, convertReportDataGrade, getConvertCoaiPerData, getConver2pageLineData, convertCountReportDataGrade, convertMaxMinAvgGraph, getRadarData, convertPm25ResultMinMaxText, convertPm10ResultMinMaxText, convertTempResultMinMaxText, convertHumiResultMinMaxText, prevConvertedPointData, prevConvertedAirPointData, convertPrevDataTable }