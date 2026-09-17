import * as convert from '/convert.js'

async function getInitSerial() {
    var res_data = [];

     var url = '/api/kweather/init-serial'

    await fetch(url, {
        "method": "GET",
        "headers": {

        },
    })
        .then(e => e.json())
        .then(d => {
            res_data = d.data
        })
        .catch((error) => {
            res_data = null
        })
    return res_data
}

async function getRecentData(serial, deviceTypes) {
    var res_data = [];
    var serial = serial
    var deviceType = deviceTypes == 'IAQ' ? 'kw-isk' : 'kw-osk';
    var url = '/api/kweather/recent-data/' + deviceType + '/' + serial
    await fetch(url, {
        "method": "GET",
        "headers": {

        },
    })
        .then(e => e.json())
        .then(d => {
            res_data = d.data
        })
        .catch((error) => {
            res_data = null
        })
    return res_data

}

async function getAllRecentData() {
    var res_data = [];
    var url = '/api/kweather/all-recent-data'

    await fetch(url, {
        "method": "GET",
        "headers": {

        },
    })
        .then(e => e.json())
        .then(d => {
            res_data = d
        })
        .catch((error) => {
            res_data = null
        })
    return res_data
}

async function getPrevData(startTm, endTm, serial, deviceType, timeInterval) {
    // OAQ: kw - oaq - sensor - kiot

    // 1분: "downsample": "1m-avg-none",
    // 10분: "downsample": "10m-avg-none",
    // 1시간: "downsample": "1h-avg-none",
    // 1일: "downsample": "1d-avg-none",
    var res_data = [];

    var url = '/api/kweather/tsdb/kiotdpd'
    var data = {
        "timezone": "Asia/Seoul",
        "useCalendar": true,
        "start": startTm, //"2023/05/13-12:00:00",
        "end": endTm, //"2023/05/13-23:59:59",
        "queries": [{
            "downsample": timeInterval, //"1m-avg-none",
            "aggregator": "sum",
            "metric": "kw-" + deviceType.toLowerCase() + "-sensor-kiot." + serial,
            "tags": { "sensor": "*" }
        }]
    }


    await fetch(url, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(data)
    })
        .then(e => e.json())
        .then(d => {
            res_data = d
        })
        .catch((error) => {
            res_data = null
        })
    return res_data
}


async function getPrevAirKoreaData(startTm, endTm, serial, deviceType, timeInterval) {
    // OAQ: kw - oaq - sensor - kiot

    // 1분: "downsample": "1m-avg-none",
    // 10분: "downsample": "10m-avg-none",
    // 1시간: "downsample": "1h-avg-none",
    // 1일: "downsample": "1d-avg-none",
    var res_data = [];

    var url = '/api/kweather/tsdb/kiotdpd';
    var data = {
        "timezone": "Asia/Seoul",
        "useCalendar": true,
        "start": startTm, //"2023/05/13-12:00:00",
        "end": endTm, //"2023/05/13-23:59:59",
        "queries": [{
            "metric": "kw-airkorea." + serial,
            "downsample": "1h-avg-none",
            "aggregator": "sum",
            "tags": { "sensor": "*" }
        }]
    }



    await fetch(url, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(data)
    })
        .then(e => e.json())
        .then(d => {
            res_data = d
        })
        .catch((error) => {
            res_data = null
        })
    return res_data
}
async function getPrevAirPointData(startTm, endTm, serial, timeInterval) {
    // OAQ: kw - oaq - sensor - kiot

    // 1분: "downsample": "1m-avg-none",
    // 10분: "downsample": "10m-avg-none",
    // 1시간: "downsample": "1h-avg-none",
    // 1일: "downsample": "1d-avg-none",
    var res_data = [];
    var serials = [15012, 15026]
    var url = '/api/kweather/tsdb/kiotdpd';


    for (var i in serials) {
        var data = {
            "timezone": "Asia/Seoul",
            "useCalendar": true,
            "start": startTm, //"2023/05/13-12:00:00",
            "end": endTm, //"2023/05/13-23:59:59",
            "queries": [{
                "metric": "kw-airkorea." + serials[i],
                "downsample": "1h-avg-none",
                "aggregator": "sum",
                "tags": { "sensor": "*" }
            }]
        }
        res_data[serials[i]] = {}
        await fetch(url, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(data)
        })
            .then(e => e.json())
            .then(d => {

                res_data[serials[i]] = convert.prevConvertedAirPointData(d, new Date($("#datetimepicker").val()).getTime())
            })
            .catch((error) => {
                res_data[serials[i]] = null
            })
    }

    return res_data
}
async function makeSenesorTags() {
    var res_data = [];
    var url = '/elements.json'
    await fetch(url, {
        "method": "GET",
        "headers": {

        }
    })
        .then(e => e.json())
        .then(d => {
            res_data = d
        })
        .catch((error) => {
            res_data = null
        })
    return res_data
}


async function makeMapPolygonLine(map) {
    var url = '/신평장림일반산업단지.json'
    await fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // GeoJSON으로부터 폴리곤 라인 그리기
            L.geoJSON(data, {
                style: function (feature) {
                    return {
                        color: 'white', // 선 색상
                        weight: 1     // 선 두께
                    };
                }
            }).addTo(map);
        })
        .catch(function (error) {
            console.error('Error loading GeoJSON:', error);
        });
}


function formatPickerDate(data, text) {
    var year = data.getFullYear();
    var month = data.getMonth() + 1;
    var day = data.getDate();

    return year + "/" + month + "/" + day;
}


async function getStatisticsData(deviceType, serial, startTm, endTm, timeInterval) {
    var res_data = {};
    var url = '/api/kweather/tsdb/kiotdpd'
    var res_data = [];
    var arrText = ['avg', 'min', 'max']
    for (var i in arrText) {
        var data = {
            "timezone": "Asia/Seoul",
            "useCalendar": true,
            "start": convert.convertGetPrevDataTm(startTm, true), //"2023/05/13-12:00:00",
            "end": convert.convertGetPrevDataTm(endTm, false), //"2023/05/13-23:59:59",
            // "start": "2023/04/26-00:00:00",
            // "end": "2023/04/26-23:59:59",
            "queries": [{
                "downsample": timeInterval + "-" + arrText[i] + "-none", //"1m-avg-none",
                "aggregator": "sum",
                "metric": "kw-" + deviceType.toLowerCase() + "-sensor-kiot." + serial,
                "tags": { "sensor": "*" }
            }]
        }


        await fetch(url, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(data)
        })
            .then(e => e.json())
            .then(d => {
                res_data[arrText[i]] = d
            })
            .catch((error) => {
                res_data = null
            })
    }

    return res_data
}

async function getRecentlyPointData() {
    var res_data = {};
    var url = '/api/kweather/recently-point-data'
    var res_data = [];
    await fetch(url, {
        "method": "GET",
        "headers": {
            // "Content-Type": "application/json",
            // "auth": "kweather-test"
        },
        // "body": JSON.stringify(data)
    })
        .then(e => e.json())
        .then(d => {
            res_data = d.data
        })
        .catch((error) => {
            res_data = null
        })


    return res_data;
}

async function getRecentlyAirKoreaPointData() {
    var res_data = {};
    var url = '/api/kweather/recently-airkorea-point-data'
    var res_data = {};
    await fetch(url, {
        "method": "GET",
        "headers": {
            // "Content-Type": "application/json",
            // "auth": "kweather-test"
        },
        // "body": JSON.stringify(data)
    })
        .then(e => e.json())
        .then(d => {
            res_data[15012] = d[15012]
            res_data[15026] = d[15026]
        })
        .catch((error) => {
            res_data = null
        })

    return res_data;


}

async function getHeatData() {
    var res_data = {};
     var url = '/api/kweather/heat-data'
    var res_data = [];
    await fetch(url, {
        "method": "GET",
        "headers": {
            // "Content-Type": "application/json",
            // "auth": "kweather-test"
        },
        // "body": JSON.stringify(data)
    })
        .then(e => e.json())
        .then(d => {
            res_data = d['kw-kgkw1']['data']
        })
        .catch((error) => {
            res_data = null
        })


    return res_data;
}

async function find_prev_heatData(selectedCode, date) {
    var res_data = [];
    var url = '/api/kweather/tsdb/kiototsdb'
    var newDate = new Date()
    var data = {
        "timezone": "Asia/Seoul",
        "useCalendar": true, 
        "start": convert.convertGetPrevDataTm(date, true),
        "end": convert.convertGetPrevDataTm(date, false),
        "queries": [{
            "downsample": "10m-avg-none",
            "aggregator": "sum",
            // "metric": "kw-kgkw1.26." + selectedCode,
            "metric": "kw-kgkw1." + selectedCode,

            "tags": { "sensor": "*" }
        }]
    }
    await fetch(url, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(data)
    })

        .then(e => e.json())
        .then(d => {
            res_data = d
        })
        .catch((error) => {
            console.log("에러")
            res_data = null
        })


    return res_data
}
async function get_grid_max_value(code, date) {

    var res_data = {};
    var unit = ['10m', '1h']
    var nowDate = new Date(date);
    var oneHourDate = nowDate.setHours((nowDate.getHours() - 1))
    var url = '/api/kweather/tsdb/kiototsdb'
    var newDate = new Date()
    var data = {
        "timezone": "Asia/Seoul",
        "useCalendar": true,
        "start": convert.convertGetPrevDataTm(date, true),
        "end": convert.convertGetPrevDataTm(date, false),
        // "start": "1h-ago",
        "queries": [
            {
                "aggregator": "sum",
                // "metric": "kw-kgkw1.26." + code,
                "metric": "kw-kgkw1." + code,
                "tags": { "sensor": "*" }
            }
        ]
    }
    for (var i in unit) {
        data.queries[0].downsample = unit[i] + "-avg-none"
        // data.start = unit[i] + "-ago"
        await fetch(url, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(data)
        })

            .then(e => e.json())
            .then(d => {
                if (d) {
                    res_data[unit[i]] = convert.convertMapGridPrevData(d, true, unit[i] == '10m' ? true : false)

                }
            })
            .catch((error) => {
                console.log("에러")
                res_data = null
            })
    }

    return res_data
}


async function getNowWeather(code) {
    //

    var res_data = {};
    var url = '/api/kweather/weather/kw-odam-c1/' + code
    var res_data = [];
    await fetch(url, {
        "method": "GET",
        "headers": {
            // "Content-Type": "application/json",
            // "auth": "kweather-test"
        },
        // "body": JSON.stringify(data)
    })
        .then(e => e.json())
        .then(d => {
            res_data = d.data
        })
        .catch((error) => {
            res_data = null
        })


    return res_data;

}

async function getShortForecastDay(code) {
    //

    var res_data = {};
    var url = '/api/kweather/weather/kw-3d24h1/' + code
    var res_data = [];
    await fetch(url, {
        "method": "GET",
        "headers": {
            // "Content-Type": "application/json",
            // "auth": "kweather-test"
        },
        // "body": JSON.stringify(data)
    })
        .then(e => e.json())
        .then(d => {
            res_data = d.data
        })
        .catch((error) => {
            res_data = null
        })


    return res_data;

}



async function getShortForecastSixHour(code) {
    //

    var res_data = {};
    var url = '/api/kweather/weather/kw-3d6h1/' + code

    var res_data = [];
    await fetch(url, {
        "method": "GET",
        "headers": {
            // "Content-Type": "application/json",
            // "auth": "kweather-test"
        },
        // "body": JSON.stringify(data)
    })
        .then(e => e.json())
        .then(d => {
            res_data = d.data
        })
        .catch((error) => {
            res_data = null
        })


    return res_data;

}


async function getShortForecastOneHour(code) {
    //

    var res_data = {};
    var url = '/api/kweather/weather/kw-3d1h1/' + code

    var res_data = [];
    await fetch(url, {
        "method": "GET",
        "headers": {
            // "Content-Type": "application/json",
            // "auth": "kweather-test"
        },
        // "body": JSON.stringify(data)
    })
        .then(e => e.json())
        .then(d => {
            res_data = d.data
        })
        .catch((error) => {
            res_data = null
        })


    return res_data;

}

async function getWeekForecastDay(code) {
    //

    var res_data = {};
    var url = '/api/kweather/weather/kw-7d12h1/' + code
    var res_data = [];
    await fetch(url, {
        "method": "GET",
        "headers": {
            // "Content-Type": "application/json",
            // "auth": "kweather-test"
        },
        // "body": JSON.stringify(data)
    })
        .then(e => e.json())
        .then(d => {
            res_data = d.data
        })
        .catch((error) => {
            res_data = null
        })


    return res_data;

}


async function getDustForecast(code) {
    //

    var res_data = {};
    var url = '/api/kweather/weather/kw-dust-f1/' + code
    var res_data = [];
    await fetch(url, {
        "method": "GET",
        "headers": {
            // "Content-Type": "application/json",
            // "auth": "kweather-test"
        },
        // "body": JSON.stringify(data)
    })
        .then(e => e.json())
        .then(d => {
            res_data = d.data
        })
        .catch((error) => {
            res_data = null
        })


    return res_data;

}

async function getReportData(deviceType, serial, startTm, endTm, timeInterval) {
    var res_data = {};
    var url = '/api/kweather/tsdb/kiotdpd'
    var res_data = [];
    var arrText = ['avg', 'min', 'max']
    for (var i in arrText) {
        var data = {
            "timezone": "Asia/Seoul",
            "useCalendar": true,
            "start": convert.convertGetPrevDataTm(startTm, true), //"2023/05/13-12:00:00",
            "end": convert.convertGetPrevDataTm(endTm, false), //"2023/05/13-23:59:59",
            // "start": "2023/04/26-00:00:00",
            // "end": "2023/04/26-23:59:59",
            "queries": [{
                "downsample": timeInterval + "-" + arrText[i] + "-none", //"1m-avg-none",
                "aggregator": "sum",
                "metric": "kw-" + deviceType.toLowerCase() + "-sensor-kiot." + serial,
                "tags": { "sensor": "tm|pm10|pm25|temp|humi|coci|coai" }
            }]
        }


        await fetch(url, {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(data)
        })
            .then(e => e.json())
            .then(d => {
                res_data[arrText[i]] = d
            })
            .catch((error) => {
                res_data = null
            })
    }

    return res_data
}


async function getReportOneMonthAvgData(deviceType, serial, startTm, endTm, timeInterval) {
    var res_data = {};
    var url = '/api/kweather/tsdb/kiotdpd'
    var res_data = [];

    var data = {
        "timezone": "Asia/Seoul",
        "useCalendar": true,
        "start": convert.convertGetPrevDataTm(startTm, true), //"2023/05/13-12:00:00",
        "end": convert.convertGetPrevDataTm(endTm, false), //"2023/05/13-23:59:59",
        // "start": "2023/04/26-00:00:00",
        // "end": "2023/04/26-23:59:59",
        "queries": [{
            "downsample": "1n-avg-none", //"1m-avg-none",
            "aggregator": "sum",
            "metric": "kw-" + deviceType.toLowerCase() + "-sensor-kiot." + serial,
            "tags": { "sensor": "tm|pm10|pm25|temp|humi|coci|coai" }
        }]
    }


    await fetch(url, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(data)
    })
        .then(e => e.json())
        .then(d => {
            res_data = d
        })
        .catch((error) => {
            res_data = null
        })


    return res_data
}


async function getDeviceMeta(serial) {


    var res_data = {};
    var url = '/getDeviceMetaApp'
    var res_data = [];
    var data = {
        serial : serial
    }
    await fetch(url, {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            // "api_key": "kw-web-internal"
        },
        "body": JSON.stringify(data)
    })
        .then(e => e.json())
        .then(d => {
            res_data = d.data
        })
        .catch((error) => {
            res_data = null
        })


    return res_data;
}
async function getHCode(lat, lng) {
    //

    var res_data = {};
    var url = '/api/kweather/hcode?lat=' + lat + '&lng=' + lng

    var res_data = [];
    await fetch(url, {
        "method": "GET",
        "headers": {
            // "Content-Type": "application/json",
            // "auth": "kweather-test"
        },
        // "body": JSON.stringify(data)
    })
        .then(e => e.json())
        .then(d => {
            res_data = d.data
        })
        .catch((error) => {
            res_data = null
        })


    return res_data;

}

async function getIsReciveData() {
    var res_data = {};
     var url = '/api/kweather/point-data-group'
    var res_data = [];
    await fetch(url, {
        "method": "GET",
        "headers": {
            // "Content-Type": "application/json",
            // "auth": "kweather-test"
        },
        // "body": JSON.stringify(data)
    })
        .then(e => e.json())
        .then(d => {
            res_data = d.data
        })
        .catch((error) => {
            res_data = null
        })


    return res_data;
}

async function getPrevPointData(date, selectedDate) {

    var res_data = {};
     var url = '/api/kweather/point-data-group'
    var res_data = [];
    await fetch(url, {
        "method": "GET",
        "headers": {
            // "Content-Type": "application/json",
            // "auth": "kweather-test"
        },
        // "body": JSON.stringify(data)
    })
        .then(e => e.json())
        .then(d => {
            res_data = convert.prevConvertedPointData(d.data, selectedDate)
        })
        .catch((error) => {
            res_data = null
        })


    return res_data;
}

async function getWindData(params) {
    // busan_tp_wind_202410160900
    // /usr/src/app/data/airmap/202410160900/busan_tp_wind_202410160900.json  

    var url = window.isLocal ? '/busan_tp_wind_202410160900.json' : '/airmap/' + params + '/busan_tp_wind_' + params + '.json'
    // var url =  // 테스트

    var res_data = {};
    await fetch(url, {
        "method": "GET",
        "headers": {
            // "Content-Type": "application/json",
            // "auth": "kweather-test"
        },
        // "body": JSON.stringify(data)
    })
        .then(e => e.json())
        .then(d => {
            res_data = d
        })
        .catch((error) => {
            res_data = null
        })


    return res_data;
}

export { getInitSerial, getRecentData, getAllRecentData, getPrevData, getPrevAirKoreaData, getPrevAirPointData, makeSenesorTags, makeMapPolygonLine, formatPickerDate, getStatisticsData, getRecentlyPointData, getRecentlyAirKoreaPointData, getHeatData, find_prev_heatData, get_grid_max_value, getNowWeather, getShortForecastDay, getShortForecastSixHour, getShortForecastOneHour, getWeekForecastDay, getDustForecast, getReportData, getReportOneMonthAvgData, getDeviceMeta, getHCode, getIsReciveData, getPrevPointData, getWindData }