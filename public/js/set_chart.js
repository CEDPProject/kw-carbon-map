import * as convert from '/convert.js'


am4core.addLicense("CH205407412");


function drawMultiGauge0To320OneColor(reportIdx, chartName, chart, strokeWidth, textSize, dataTextSize, valueTextSize, textPaddingBottom, dataPaddingTop, valuePaddingTop, handRadius, handInRadius, targetValue, targetData, dataUnit) {
    chart.hiddenState.properties.opacity = 0;
    chart.startAngle = 0;
    chart.endAngle = 320;

    if (typeof targetData === "number") {
        targetData = targetData.toString();
    }

    function createAxis(min, max, start, end, color, width, label) {
        var axis = chart.xAxes.push(new am4charts.ValueAxis());
        axis.min = min;
        axis.max = max;
        axis.strictMinMax = false;
        axis.renderer.useChartAngles = false;
        axis.renderer.startAngle = start;
        axis.renderer.endAngle = end;
        axis.renderer.minGridDistance = 70;

        axis.renderer.line.strokeOpacity = 1;
        axis.renderer.line.strokeWidth = width;
        axis.renderer.line.stroke = am4core.color(color);

        axis.renderer.ticks.template.disabled = true;
        axis.renderer.labels.template.disabled = true;
        axis.renderer.grid.template.disabled = true;
        axis.renderer.ticks.template.length = 10;

        var range = axis.axisRanges.create();
        range.label.text = label;
        range.grid.disabled = true;

        return axis;
    }

    function createHand(axis) {
        var hand = chart.hands.push(new am4charts.ClockHand());
        hand.fill = axis.renderer.line.stroke;
        hand.stroke = axis.renderer.line.stroke;
        hand.axis = axis;
        hand.pin.disabled = true;
        hand.startWidth = 10;
        hand.endWidth = 0;
        hand.radius = am4core.percent(84);
        hand.innerRadius = am4core.percent(70);
        hand.value = 0;
        return hand;
    }

    var targetText = "";
    var targetColor = "";
    /*
    if(targetValue == "-1") {
        targetText = "-";
    } else if(0 <= targetValue && targetValue <= 49) {
        targetText = "매우나쁨";
        targetColor = "#FF0000";
    } else if(50 <= targetValue && targetValue <= 79) {
        targetText = "나쁨";
        targetColor = "#FFA800";
    } else if(80 <= targetValue && targetValue <= 89) {
        targetText = "보통";
        targetColor = "#00D27A";
    } else {
        targetText = "좋음";
        targetColor = "#4595FF";
    }
    */



    if (chartName.substring(0, 4) == "temp") {
        if (targetValue == "-1") {
            targetText = "-";
        } else if (0 <= targetValue && targetValue <= 49) {
            targetText = "추움";
            targetColor = "#FF0000";
        } else if (50 <= targetValue && targetValue <= 79) {
            targetText = "더움";
            targetColor = "#FFA800";
        } else if (80 <= targetValue && targetValue <= 89) {
            targetText = "서늘";
            targetColor = "#00D27A";
        } else {
            targetText = "쾌적";
            targetColor = "#4595FF";
        }
    } else if (chartName.substring(0, 4) == "humi") {
        if (targetValue == "-1") {
            targetText = "-";
        } else if (0 <= targetValue && targetValue <= 49) {
            targetText = "건조";
            targetColor = "#FF0000";
        } else if (50 <= targetValue && targetValue <= 79) {
            targetText = "습합";
            targetColor = "#FFA800";
        } else if (80 <= targetValue && targetValue <= 89) {
            targetText = "매우습함";
            targetColor = "#00D27A";
        } else {
            targetText = "쾌적";
            targetColor = "#4595FF";
        }
    } else {
        if (targetValue == "-1") {
            targetText = "-";
        } else if (0 <= targetValue && targetValue <= 49) {
            targetText = "매우나쁨";
            targetColor = "#FF0000";
        } else if (50 <= targetValue && targetValue <= 79) {
            targetText = "나쁨";
            targetColor = "#FFA800";
        } else if (80 <= targetValue && targetValue <= 89) {
            targetText = "보통";
            targetColor = "#00D27A";
        } else {
            targetText = "좋음";
            targetColor = "#4595FF";
        }
    }
    var axis1 = createAxis(0, 100, -249, 69, targetColor, strokeWidth - 2, 0);
    var axis2 = createAxis(0, 0, (targetValue - 100) * 3.2 + 70, 70, "#EBEBEB", strokeWidth);
    var axis2 = createAxis(0, 0, 70, 70, "#EBEBEB", strokeWidth, 100);

    if (targetValue != '-1') {
        var hand = createHand(axis1);

        hand.fill = am4core.color(targetColor);
        hand.stroke = am4core.color(targetColor);

        var _showValue = targetValue * 1;
        hand.showValue(_showValue, am4core.ease.cubicOut);
    }

    var label1 = chart.radarContainer.createChild(am4core.Label);
    label1.isMeasured = false;
    label1.fontSize = valueTextSize;
    label1.x = am4core.percent(50);
    label1.paddingBottom = 15;
    label1.horizontalCenter = "middle";
    label1.verticalCenter = "middle";
    label1.paddingTop = valuePaddingTop;
    label1.text = "[bold]" + targetValue;
    label1.fill = am4core.color(targetColor);

    var label2 = chart.radarContainer.createChild(am4core.Label);
    label2.isMeasured = false;
    label2.fontSize = textSize;
    label2.horizontalCenter = "middle";
    label2.verticalCenter = "bottom";
    label2.paddingBottom = textPaddingBottom;
    label2.text = "[bold]" + targetText;
    label2.fill = am4core.color(targetColor);

    // 데이터 row 값
    if (targetData != null && targetData != '') {
        var label3 = chart.radarContainer.createChild(am4core.Label);
        label3.isMeasured = false;
        label3.fontSize = dataTextSize;
        label3.horizontalCenter = "middle";
        label3.verticalCenter = "top";
        label3.paddingTop = dataPaddingTop;
        label3.text = targetData + " " + dataUnit;
        label3.fill = am4core.color("#000");
    }


}
function drawMultiGauge0To320OneColor2(reportIdx, chartName, chart, strokeWidth, textSize, dataTextSize, valueTextSize, textPaddingBottom, dataPaddingTop, valuePaddingTop, handRadius, handInRadius, targetValue, targetData, dataUnit, deviceType) {

    chart.hiddenState.properties.opacity = 0;
    chart.startAngle = 0;
    chart.endAngle = 320;

    function createAxis(min, max, start, end, color, width, label) {
        var axis = chart.xAxes.push(new am4charts.ValueAxis());
        axis.min = min;
        axis.max = max;
        axis.strictMinMax = false;
        axis.renderer.useChartAngles = false;
        axis.renderer.startAngle = start;
        axis.renderer.endAngle = end;
        axis.renderer.minGridDistance = 70;

        axis.renderer.line.strokeOpacity = 1;
        axis.renderer.line.strokeWidth = width;
        axis.renderer.line.stroke = am4core.color(color);

        axis.renderer.ticks.template.disabled = true;
        axis.renderer.labels.template.disabled = true;
        axis.renderer.grid.template.disabled = true;
        axis.renderer.ticks.template.length = 10;

        var range = axis.axisRanges.create();
        range.label.text = label;
        range.grid.disabled = true;

        return axis;
    }

    function createHand(axis) {
        var hand = chart.hands.push(new am4charts.ClockHand());
        hand.fill = axis.renderer.line.stroke;
        hand.stroke = axis.renderer.line.stroke;
        hand.axis = axis;
        hand.pin.disabled = true;
        hand.startWidth = 10;
        hand.endWidth = 0;
        hand.radius = am4core.percent(84);
        hand.innerRadius = am4core.percent(70);
        hand.value = 0;
        return hand;
    }

    var targetText = "";
    var targetColor = "";
    if (chartName == 'tempChart') {
        if (deviceType == 'IAQ') {
            if (targetValue == '-1') {
                targetText = "-";
            } else if (13.9 >= targetData) {
                targetText = "매우추움";
                targetColor = "#FF0000";
            } else if (15.9 >= targetData) {
                targetText = "추움";
                targetColor = "#FFA800";
            } else if (17.9 >= targetData) {
                targetText = "서늘";
                targetColor = "#00D27A";
            } else if (24.0 >= targetData) {
                targetText = "쾌적";
                targetColor = "#4595FF";
            } else if (27.0 >= targetData) {
                targetText = "따뜻";
                targetColor = "#00D27A";
            } else if (30.0 >= targetData) {
                targetText = "더움";
                targetColor = "#FFA800";
            } else if (34.0 >= targetData) {
                targetText = "매우더움";
                targetColor = "#FF0000";
            } else {
                targetText = "-";
                targetColor = "#FFFFFF";
            }
        } else {
            if (targetValue == '-1') {
                targetText = "-";
            } else if (-5.1 >= targetData) {
                targetText = "매우추움";
                targetColor = "#FF0000";
            } else if (-0.1 >= targetData) {
                targetText = "추움";
                targetColor = "#FFA800";
            } else if (8.9 >= targetData) {
                targetText = "서늘";
                targetColor = "#00D27A";
            } else if (18.0 >= targetData) {
                targetText = "쾌적";
                targetColor = "#4595FF";
            } else if (25.0 >= targetData) {
                targetText = "따뜻";
                targetColor = "#00D27A";
            } else if (33.0 >= targetData) {
                targetText = "더움";
                targetColor = "#FFA800";
            } else if (50.0 >= targetData) {
                targetText = "매우더움";
                targetColor = "#FF0000";
            } else {
                targetText = "-";
                targetColor = "#FFFFFF";
            }
        }
    } else if (chartName == 'humiChart') {
        if (deviceType == 'IAQ') {
            if (targetValue == '-1') {
                targetText = "-";
            } else if (19.9 >= targetData) {
                targetText = "매우건조";
                targetColor = "#FF0000";
            } else if (34.9 >= targetData) {
                targetText = "건조";
                targetColor = "#FFA800";
            } else if (39.9 >= targetData) {
                targetText = "약간건조";
                targetColor = "#00D27A";
            } else if (60.0 >= targetData) {
                targetText = "쾌적";
                targetColor = "#4595FF";
            } else if (75.0 >= targetData) {
                targetText = "약간습함";
                targetColor = "#00D27A";
            } else if (90.0 >= targetData) {
                targetText = "습함";
                targetColor = "#FFA800";
            } else if (100.0 >= targetData) {
                targetText = "매우습함";
                targetColor = "#FF0000";
            } else {
                targetText = "-";
                targetColor = "#FFFFFF";
            }
        } else {
            if (targetValue == '-1') {
                targetText = "-";
            } else if (29.9 >= targetData) {
                targetText = "매우건조";
                targetColor = "#FF0000";
            } else if (39.9 >= targetData) {
                targetText = "건조";
                targetColor = "#FFA800";
            } else if (49.9 >= targetData) {
                targetText = "약간건조";
                targetColor = "#00D27A";
            } else if (70.0 >= targetData) {
                targetText = "쾌적";
                targetColor = "#4595FF";
            } else if (80.0 >= targetData) {
                targetText = "약간습함";
                targetColor = "#00D27A";
            } else if (90.0 >= targetData) {
                targetText = "습함";
                targetColor = "#FFA800";
            } else if (100.0 >= targetData) {
                targetText = "매우습함";
                targetColor = "#FF0000";
            } else {
                targetText = "-";
                targetColor = "#FFFFFF";
            }
        }
    }

    var axis1 = createAxis(0, 100, -249, 69, targetColor, strokeWidth - 2, 0);
    var axis2 = createAxis(0, 0, (targetValue - 100) * 3.2 + 70, 70, "#EBEBEB", strokeWidth);
    var axis2 = createAxis(0, 0, 70, 70, "#EBEBEB", strokeWidth, 100);

    if (targetValue != '-1') {
        var hand = createHand(axis1);

        hand.fill = am4core.color(targetColor);
        hand.stroke = am4core.color(targetColor);

        var _showValue = targetValue * 1;
        hand.showValue(_showValue, am4core.ease.cubicOut);
    }

    var label1 = chart.radarContainer.createChild(am4core.Label);
    label1.isMeasured = false;
    label1.fontSize = valueTextSize;
    label1.x = am4core.percent(50);
    label1.paddingBottom = 15;
    label1.horizontalCenter = "middle";
    label1.verticalCenter = "middle";
    label1.paddingTop = valuePaddingTop;
    label1.text = "[bold]" + targetValue;
    label1.fill = am4core.color(targetColor);

    var label2 = chart.radarContainer.createChild(am4core.Label);
    label2.isMeasured = false;
    label2.fontSize = textSize;
    label2.horizontalCenter = "middle";
    label2.verticalCenter = "bottom";
    label2.paddingBottom = textPaddingBottom;
    label2.text = "[bold]" + targetText;
    label2.fill = am4core.color(targetColor);

    // 데이터 row 값
    if (targetData != null && targetData != '') {
        var label3 = chart.radarContainer.createChild(am4core.Label);
        label3.isMeasured = false;
        label3.fontSize = dataTextSize;
        label3.horizontalCenter = "middle";
        label3.verticalCenter = "top";
        label3.paddingTop = dataPaddingTop;
        label3.text = targetData + " " + dataUnit;
        label3.fill = am4core.color("#000");
    }
}
function drawBaseLine(reportIdx, chartName, chart, data, dataValues, formatType, opposite, unit, checkData, elementUnitList) {
    //colorSet.startIndex = 1;
    if (formatType == 'day') {
        chart.dateFormatter.inputDateFormat = "dd";
    } else if (formatType == 'min') {
        chart.dateFormatter.inputDateFormat = "yyyyMMddHHmm";
    }

    chart.data = data;
    chart.language.locale = am4lang_ko_KR;
    chart.fontSize = 13;
    //	chart.colors.step = 4;
    chart.colors.step = 2;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.5;
    dateAxis.renderer.minGridDistance = 60;
    dateAxis.dateFormats.setKey("date", "ddHHmm");
    //dateAxis.title.text = "시간";
    dateAxis.tooltipDateFormat = "MM월 dd일 HH:mm";


    function createSeries(field, name, color, visible, opposite, unit, seq) {
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        if (chart.yAxes.indexOf(valueAxis) != 0) {
            var idx = chart.yAxes.indexOf(valueAxis);

            valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
        }

        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = field;
        series.dataFields.dateX = "tm";
        series.tooltipText = "{name} : {valueY} " + unit;
        series.name = name;
        series.strokeWidth = 2;
        series.minBulletDistance = 15;
        series.connect = false;
        series.yAxis = valueAxis;
        series.hidden = false;

        series.tensionX = 0.8;
        series.showOnInit = true;
        series.legendSettings.labelText = "[{stroke}]{name}";
        series.legendSettings.size = 11;
        series.fill = color;

        // Drop-shaped tooltips
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.strokeOpacity = 0;
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.label.minWidth = 40;
        series.tooltip.label.minHeight = 40;
        series.tooltip.label.textAlign = "middle";
        series.tooltip.label.textValign = "middle";
        // series.label.text = series.label.text+unit;

        series.events.on("hidden", toggleAxes);
        series.events.on("shown", toggleAxes);

        function toggleAxes(ev) {
            let axis = ev.target.yAxis;
            let disabled = true;
            axis.series.each(function (series) {
                if (!series.isHiding && !series.isHidden) {
                    disabled = false;
                }
            });
            axis.disabled = disabled;
        }

        // Make bullets grow on hover
        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 2;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");

        var bullethover = bullet.states.create("hover");
        bullethover.properties.scale = 1.3;

        valueAxis.renderer.line.strokeOpacity = 1;
        valueAxis.renderer.line.strokeWidth = 2;
        valueAxis.renderer.line.stroke = series.stroke;
        valueAxis.renderer.labels.template.fill = series.stroke;
        valueAxis.renderer.opposite = opposite;

        // Set up axis title
        valueAxis.title.text = unit;
        valueAxis.title.rotation = 0;
        valueAxis.title.dy = -30;
        if (seq / 2 % 2 == 0)
            valueAxis.title.dx = 50;
        else
            valueAxis.title.dx = -40;
        valueAxis.title.align = "center";
        valueAxis.title.valign = "top";
        valueAxis.title.fontWeight = 300;

    }

    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor();

    let tmpCheckCount = 0;
    var colorSet = new am4core.ColorSet();


    for (var i = 0; i < Object.keys(dataValues).length; i += 2) {
        var opposite = (i / 2 % 2 == 1) ? true : false;

        // for (var j = 0; j < checkData.length; j++) {
        //     tmpCheckCount++;
        // }
        /*
        for(var j = 0; j < checkData.length; j++) {
            if(checkData[j] == dataValues[i+1]) {
                tmpCheckCount++;
                if(tmpCheckCount > 2) opposite = true;
                 break;
            }
        }
        */
        createSeries(dataValues[i], dataValues[i + 1], colorSet.next(), true, opposite, elementUnitList[i / 2], i);
    }
    checkData = []
    if (checkData.length == 0) {
        checkData.push(dataValues[1]);
        checkData.push(dataValues[3]);
        for (var i = 0; i < dataValues.length / 2 - 2; i++) {
            checkData.push("");
        }
    }
    chart.paddingLeft = -20;
    chart.paddingRight = -20;

    chart.legend = new am4charts.Legend();
    chart.legend.useDefaultMarker = true;
    chart.legend.position = "top";
    chart.legend.contentAlign = "center";
    chart.legend.marginBottom = 20;

    // true -> checkbox 표시

    const marker = chart.legend.markers.template;
    const markerColumn = marker.children.getIndex(0);

    var m_states = markerColumn.states;

    const markerColumnActiveState = m_states.getKey("active");
    const markerColumnDefaultState = m_states.getKey("default");

    markerColumnActiveState.properties.strokeWidth = 1;
    markerColumnActiveState.properties.stroke = am4core.color("#999999");
    markerColumnActiveState.properties.strokeOpacity = 1;
    markerColumnActiveState.properties.fillOpacity = 0;
    markerColumnActiveState.properties.width = 15;
    markerColumnActiveState.properties.height = 15;

    markerColumn.cornerRadius(0, 0, 0, 0);
    markerColumn.defaultState.properties.strokeWidth = 1;
    markerColumn.defaultState.properties.stroke = am4core.color("#000000");
    markerColumn.defaultState.properties.strokeOpacity = 1;
    markerColumn.defaultState.properties.fillOpacity = 0;

    markerColumn.defaultState.properties.width = 15;
    markerColumn.defaultState.properties.height = 15;


    const checkbox = marker.createChild(am4core.Image);
    checkbox.width = 13;
    checkbox.height = 13;
    checkbox.verticalCenter = "top";
    checkbox.horizontalCenter = "left";

    checkbox.href = "data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24'%3E%3Cpath d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z'/%3E%3C/svg%3E";
    //checkbox.dx = 2;
    //checkbox.dy = 3;

    checkbox.dx = 1;
    checkbox.dy = 1;

    //checkbox.states.default.

    const checkboxActiveState = checkbox.states.create("active");
    checkboxActiveState.properties.opacity = 0;


    chart.legend.itemContainers.template.events.on("hit", function (ev) {
        var name = ev.target.dataItem.dataContext.name;
        for (var i = 1; i < dataValues.length; i += 2) {
            var idx = Math.floor(i / 2);
            if (dataValues[i] == name) {
                if (checkData[idx].includes(name)) {
                    checkData[idx] = "";
                    break;
                } else {
                    checkData[idx] = dataValues[i];
                    break;
                }
            }
        }

        var tmpCount = 0;

        for (var i = 0; i < checkData.length; i++) {
            chart.yAxes.values[idx].title.align = "center";
            chart.yAxes.values[idx].title.valign = "top";
            chart.yAxes.values[idx].title.rotation = 0;
            chart.yAxes.values[idx].title.fontWeight = 300;
            if (checkData[i] != "") {
                if (tmpCount % 2 == 0) {
                    for (var j = 1; j < dataValues.length; j += 2) {
                        var idx = Math.floor(j / 2);
                        if (dataValues[j] == checkData[i]) {
                            chart.yAxes.values[idx].renderer.opposite = false;
                            break;
                        }
                    }
                } else {
                    for (var j = 1; j < dataValues.length; j += 2) {
                        var idx = Math.floor(j / 2);
                        if (dataValues[j] == checkData[i]) {
                            chart.yAxes.values[idx].renderer.opposite = true;
                            break;
                        }
                    }
                }
                if (tmpCount % 2 == 0) {
                    chart.yAxes.values[idx].title.dy = -30;
                    chart.yAxes.values[idx].title.dx = 50;
                } else {
                    chart.yAxes.values[idx].title.dy = -30;
                    chart.yAxes.values[idx].title.dx = -40;
                }
                tmpCount++;
            }
        }
        if (tmpCount > 4) {
            alert("최대 4개까지 선택 가능합니다.");
            chart.legend.itemContainers.template.togglable = false;
            const index = checkData.indexOf(name);

            for (var i = 1; i < dataValues.length; i += 2) {
                var idx = Math.floor(i / 2);
                if (dataValues[i] == name) {
                    checkData[idx] = "";
                    break;
                }
            }
            chart.legend.itemContainers.template.togglable = true;
        }
    });
    for (var i = 0; i < checkData.length; i++) {
        if (checkData[i] == "") {
            chart.series.getIndex(i).hidden = true;
        }
    }


    // if (reportIdx != null && reportIdx != '') {
    //     var exportOptions = chart.exporting.getFormatOptions("png");
    //     exportOptions.minHeight = 1400;
    //     exportOptions.minWidth = 1000;
    //     chart.exporting.backgroundColor = "transparent";
    //     chart.exporting.frameOptions = ("png", exportOptions);
    //     setTimeout(function () {
    //         chart.exporting.getImage("png").then(function (imgData) {
    //             reportImageSave(reportIdx, imgData, chartName);
    //         });
    //     }, 6000);
    // }
}
function drawSmoothLineChart(reportIdx, chartName, chart, data, xyTitle, deviceType, unit) {
    chart.data = data;
    chart.marginTop = 0;
    chart.marginBottom = 0;
    chart.paddingBottom = 0;
    chart.paddingTop = 0;
    chart.marginLeft = 0;
    chart.paddingLeft = 0;
    chart.paddingRight = 0;

    chart.marginRight = 0;
    chart.dateFormatter.inputDateFormat = "yyyyMMddHHmm";

    //chart.language.locale = locale;
    //chart.dateFormatter.inputDateFormat = "yyyyMMdd";

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "time";
    if ($('#standard option:selected').val() == "1min") {
        categoryAxis.renderer.minGridDistance = 61.2;
    } else if ($('#standard option:selected').val() == "5min") {
        categoryAxis.renderer.minGridDistance = 120;
    } else if ($('#standard option:selected').val() == "1hour") {
        categoryAxis.renderer.minGridDistance = 200;
    }

    categoryAxis.renderer.grid.template.location = 0.5;

    categoryAxis.startLocation = 0.5;
    categoryAxis.endLocation = 0.5;

    // Create value axis
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.baseValue = 0;


    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.paddingLeft = 10;
    valueAxis.paddingRight = 10;
    valueAxis.layout = "absolute";

    // Set up axis title
    valueAxis.title.text = unit;
    valueAxis.title.rotation = 0;
    valueAxis.title.align = "center";
    valueAxis.title.valign = "top";
    valueAxis.title.dy = -40;
    valueAxis.title.fontWeight = 600;


    // Create series
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "time";
    series.strokeWidth = 2;
    series.tensionX = 0.77;
    series.connect = false;

    // // 평균선
    // var rangeDefault = valueAxis.axisRanges.create();
    // rangeDefault.value = middelvalue;
    // rangeDefault.grid.stroke = am4core.color("#396478");
    // rangeDefault.grid.strokeDasharray = "3,3";
    // rangeDefault.grid.strokeWidth = 2;
    // rangeDefault.grid.strokeOpacity = 0.3;
    // rangeDefault.label.inside = true;
    // rangeDefault.label.text = "평균 : " + middelvalue + " " + unit;
    // rangeDefault.label.verticalCenter = "bottom";

    function createRanges(value, endValue, color, pattern) {
        var range = valueAxis.createSeriesRange(series);
        range.value = value;
        range.endValue = endValue;
        range.contents.stroke = am4core.color(color);
        range.contents.fill = range.contents.stroke;
        if (pattern == true) {
            range.grid.strokeDasharray = "3,3";
        }
    }

    if (reportIdx == "pm25") {
        createRanges(0, 15, "#4595FF");
        createRanges(16, 35, "#00D27A");
        createRanges(36, 75, "#FFA800");
        createRanges(76, 100000, "#FF0000");
    } else if (reportIdx == "pm10") {
        createRanges(0, 30, "#4595FF");
        createRanges(31, 80, "#00D27A");
        createRanges(81, 150, "#FFA800");
        createRanges(151, 100000, "#FF0000");
    } else if (reportIdx == "co2") {
        createRanges(0, 500, "#4595FF");
        createRanges(501, 1000, "#00D27A");
        createRanges(1001, 1500, "#FFA800");
        createRanges(1501, 100000, "#FF0000");
    } else if (reportIdx == "voc") {
        createRanges(0, 200, "#4595FF");
        createRanges(201, 400, "#00D27A");
        createRanges(401, 1000, "#FFA800");
        createRanges(1001, 100000, "#FF0000");
    } else if (reportIdx == "temp") {
        if (deviceType == "OAQ") {
            createRanges(-100, -4.9, "#FF0000");
            createRanges(-5, 0, "#FFA800");
            createRanges(0, 8.9, "#00D27A");
            createRanges(9, 18, "#4595FF");
            createRanges(18.1, 25, "#00D27A");
            createRanges(25.1, 33, "#FFA800");
            createRanges(33.1, 150, "#FF0000");
        } else {
            createRanges(-100, 14, "#FF0000");
            createRanges(14, 15.9, "#FFA800");
            createRanges(16, 17.9, "#00D27A");
            createRanges(18, 24, "#4595FF");
            createRanges(24.1, 27, "#00D27A");
            createRanges(27.1, 30, "#FFA800");
            createRanges(30.1, 150, "#FF0000");
        }
    } else if (reportIdx == "humi") {
        if (deviceType == "OAQ") {
            createRanges(0, 29.9, "#FF0000");
            createRanges(30, 39.9, "#FFA800");
            createRanges(40, 49.9, "#00D27A");
            createRanges(50, 70, "#4595FF");
            createRanges(70.1, 80, "#00D27A");
            createRanges(80.1, 90, "#FFA800");
            createRanges(90.1, 1000, "#FF0000");
        } else {
            createRanges(0, 19.9, "#FF0000");
            createRanges(20, 34.9, "#FFA800");
            createRanges(35, 39.9, "#00D27A");
            createRanges(40, 60, "#4595FF");
            createRanges(60.1, 75, "#00D27A");
            createRanges(75.1, 90, "#FFA800");
            createRanges(90.1, 1000, "#FF0000");
        }
    } else if (reportIdx == "noise") {
        createRanges(0, 30, "#4595FF");
        createRanges(31, 55, "#00D27A");
        createRanges(56, 70, "#FFA800");
        createRanges(71, 100, "#FF0000");
    }


    var title = chart.titles.create();
    title.text = xyTitle;
    title.fontSize = 15;
    title.marginBottom = 30;
    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor();


    var bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.stroke = am4core.color("#fff");
    bullet.circle.strokeWidth = 0.1;
    bullet.circle.opacity = 0;
    bullet.tooltipText = "( {time} ) [bold]{valueY}[/] " + unit;

    // Tooltip
    series.tooltip.label.textAlign = "middle";
    series.tooltip.pointerOrientation = "down";
    series.tooltip.dy = -5;

    // bullet.propertyFields.showTooltipOn = "showTooltip";
    series.tooltip.propertyFields.pointerOrientation = "orientation";
    series.tooltip.propertyFields.dy = "offset";

}


function drawBaseLine3(reportIdx, chartName, chart, data, formatType, yTitle) {

    chart.data = data;
    chart.language.locale = am4lang_ko_KR;
    if (formatType == "day") {
        chart.dateFormatter.inputDateFormat = "yyyyMMdd";
    } else if (formatType == "hour") {
        chart.dateFormatter.inputDateFormat = "yyyyMMddHHmm";
    }

    // Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.startLocation = 0.3;
    dateAxis.endLocation = 0.7;
    dateAxis.renderer.minGridDistance = 60;
    if (formatType == "day") {
        dateAxis.dateFormats.setKey("day", "dd일");
    } else if (formatType == "hour") {
        dateAxis.dateFormats.setKey("hour", "HH:mm");
    }

    dateAxis.tooltipDateFormat = "MM월 dd일 HH:mm";
    if (formatType == "day") dateAxis.title.text = "날짜(일)";
    else if (formatType == "hour") dateAxis.title.text = "날짜(시간)";
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    valueAxis.title.text = yTitle;


    function createRanges(value, endValue, color) {
        var range = valueAxis.axisRanges.create();
        range.value = value;
        range.endValue = endValue;
        range.axisFill.fill = color;
        range.axisFill.fillOpacity = 0.4;
    }

    // createRanges(-100, likeBoundary, am4core.color("#5ABEF5"));
    // createRanges(likeBoundary, normalBoundary, am4core.color("#91CF56"));
    // createRanges(normalBoundary, badBoundary, am4core.color("#F97b47"));
    // createRanges(badBoundary, maximum, am4core.color("#F93F3E"));

    function createSeries(field, name, color) {
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = field;
        series.dataFields.dateX = "date";
        series.tooltipText = "{valueY}"
        series.name = name;
        series.strokeWidth = 3;
        series.minBulletDistance = 15;
        series.fill = am4core.color(color);
        series.stroke = am4core.color(color);
        series.connect = false;

        // Drop-shaped tooltips
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.strokeOpacity = 0;
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.label.minWidth = 40;
        series.tooltip.label.minHeight = 40;
        series.tooltip.label.textAlign = "middle";
        series.tooltip.label.textValign = "middle";
        series.tooltip.label.fill = am4core.color(color);
        series.tooltip.background.strokeWidth = 2;
        series.tooltip.getFillFromObject = false;
        //series.tooltip.getStrokeFromObject = true;

        // Make bullets grow on hover
        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 2;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");

        var bullethover = bullet.states.create("hover");
        bullethover.properties.scale = 1.3;
    }

    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor();

    chart.legend = new am4charts.Legend();
    //chart.legend.useDefaultMarker = true;
    chart.legend.position = "top";

    createSeries("min", "최저값", "blue");
    createSeries("avg", "평균값", "black");
    createSeries("max", "최고값", "red");

    if (reportIdx != null && reportIdx != '') {
        var exportOptions = chart.exporting.getFormatOptions("png");
        exportOptions.minHeight = 1400;
        exportOptions.minWidth = 1000;
        chart.exporting.backgroundColor = "transparent";
        chart.exporting.frameOptions = ("png", exportOptions);
        setTimeout(function () {
            chart.exporting.getImage("png").then(function (imgData) {
                reportImageSave(reportIdx, imgData, chartName);
            });
        }, 6000);
    }
}

function drawBaseLine3WithUnits(reportIdx, chartName, chart, data, formatType, yTitle, unitKor, unitEng) {
    chart.data = data;
    chart.language.locale = am4lang_ko_KR;
    if (formatType == "day") {
        chart.dateFormatter.inputDateFormat = "yyyyMMdd";
    } else if (formatType == "hour") {
        chart.dateFormatter.inputDateFormat = "yyyyMMddHHmm";
    }

    // Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.startLocation = 0.3;
    dateAxis.endLocation = 0.7;
    dateAxis.renderer.minGridDistance = 60;
    if (formatType == "day") {
        dateAxis.dateFormats.setKey("day", "dd일");
    } else if (formatType == "hour") {
        dateAxis.dateFormats.setKey("hour", "HH:mm");
    }

    dateAxis.tooltipDateFormat = "MM월 dd일 HH:mm";
    if (formatType == "day") dateAxis.title.text = "날짜(일)";
    else if (formatType == "hour") dateAxis.title.text = "날짜(시간)";
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    valueAxis.title.text = yTitle;

    function createSeries(field, name, color) {
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = field;
        series.dataFields.dateX = "date";
        series.tooltipText = "{name}: {valueY}"
        series.name = name;
        series.strokeWidth = 3;
        series.minBulletDistance = 15;
        series.fill = am4core.color(color);
        series.stroke = am4core.color(color);
        series.connect = false;

        // Drop-shaped tooltips
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.strokeOpacity = 0;
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.label.minWidth = 40;
        series.tooltip.label.minHeight = 40;
        series.tooltip.label.textAlign = "middle";
        series.tooltip.label.textValign = "middle";
        series.tooltip.label.fill = am4core.color(color);
        series.tooltip.background.strokeWidth = 2;
        series.tooltip.getFillFromObject = false;

        // Make bullets grow on hover
        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 2;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");

        var bullethover = bullet.states.create("hover");
        bullethover.properties.scale = 1.3;
    }

    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor();

    chart.legend = new am4charts.Legend();
    chart.legend.position = "top";

    // 각 usedDataUnit 항목에 대해 색상 지정
    var colors = [
        "#4595FF", // 파란색 - 환기실측유효전력
        "#5ABEF5", // 밝은 파란색 - 환기예측유효전력
        "#FFA800", // 주황색 - 냉난방실측유효전력
        "#FF8C00", // 다크 오렌지 - 냉난방예측유효전력
        "#00D27A", // 녹색 - 전체실측유효전력
        "#32CD32", // 라임 그린 - 전체예측유효전력
        "#FF6B6B", // 빨간색 (추가)
        "#9B59B6", // 보라색 (추가)
        "#3498DB", // 하늘색 (추가)
        "#E74C3C"  // 진한 빨강 (추가)
    ];

    // usedDataUnit의 각 항목에 대해 min, avg, max 시리즈 생성
    for (var i = 0; i < unitEng.length; i++) {
        var engName = unitEng[i];
        var korName = unitKor[i];
        var colorIndex = i % colors.length;
        var color = colors[colorIndex];
        
        var minField = engName + '_min';
        var avgField = engName + '_avg';
        var maxField = engName + '_max';

        // min, avg, max 시리즈 생성
        createSeries(minField, korName + " (최저값)", am4core.color(color).lighten(0.3).toCSSHex());
        createSeries(avgField, korName + " (평균값)", color);
        createSeries(maxField, korName + " (최고값)", am4core.color(color).darken(0.3).toCSSHex());
    }

    if (reportIdx != null && reportIdx != '') {
        var exportOptions = chart.exporting.getFormatOptions("png");
        exportOptions.minHeight = 1400;
        exportOptions.minWidth = 1000;
        chart.exporting.backgroundColor = "transparent";
        chart.exporting.frameOptions = ("png", exportOptions);
        setTimeout(function () {
            chart.exporting.getImage("png").then(function (imgData) {
                reportImageSave(reportIdx, imgData, chartName);
            });
        }, 6000);
    }
}

function setChartData(data, stat, divName, isMarker) {
    // for (var i in data) {
    //     data[i].date_time = (getUseApiDate(getDetailDateInNewDate(new Date(new Date(data[i].tm * 1000).toISOString().slice(0, -1)))));
    // }
    var useData = []
    am4core.addLicense("CH205407412");
    var chart = am4core.create(divName, am4charts.XYChart);
    if (!isMarker) {
        // var objectKeys = Object.entries(data)
        // var objectKeys = data
        for (var i in data) {
            var json = {
                // 'date_time': convert.getChartXValue(convert.getDetailMapDateInNewDate(data[i]['tm'])),
                'date_time': convert.convertMapChartDataTM(data[i]['tm']),
                'element': data[i][stat]
            }
            useData.push(json)
        }
        // Add data
        chart.data = useData

        // Create axes
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "date_time";
        categoryAxis.title.text = convert.getChartXTitle(convert.getDetailDateInNewDate(new Date($("#datetimepicker").val())))

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        valueAxis.title.text = window.type;



        var series = chart.series.push(new am4charts.LineSeries());
        series.name = "Units";
        // series.stroke = am4core.color("#CDA2AB");
        series.strokeWidth = 3;
        series.dataFields.valueY = "element";
        series.dataFields.categoryX = "date_time";


        chart.cursor = new am4charts.XYCursor();
    }
    else {
        for (var i in data) {
            var json = {}
            json.pm10 = [];
            json.pm25 = [];
            json.temp = [];
            json.humi = [];
            for (var j in stat) {
                json[stat[j]].push(data[i][stat[j]])
            }
            json['date_time'] = convert.convertMapChartDataTM(data[i].tm)
            useData.push(json)
        }

        // Add data
        chart.data = useData

        // Create axes

        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "date_time";


        categoryAxis.title.text = convert.getChartXTitle(convert.getDetailDateInNewDate(new Date($("#datetimepicker").val())))

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        // valueAxis.title.paddingBottom = 0;
        // valueAxis.title.marginBottom = 5;
        // valueAxis.title.dy = -10;
        // valueAxis.title.text = window.type;

        var series1 = createSeries("pm10", "pm10");
        var series2 = createSeries("pm25", "pm25");
        var series3 = createSeries("temp", "temp");
        var series4 = createSeries("humi", "humi");

        function createSeries(field, name) {

            var series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = field;
            series.dataFields.categoryX = "date_time";
            series.name = name;

            series.tooltipText = "{name}: {valueY}";
            series.strokeWidth = 3;

            return series;
        }
        chart.legend = new am4charts.Legend();

        // chart.legend.position = 'left'
        chart.legend.position = 'left';
        chart.legend.marginTop = -5; // 범례의 위쪽 여백을 줄임
        chart.legend.paddingTop = -5; // 범례의 내부 위쪽 패딩을 줄임
        chart.legend.itemContainers.template.dy = -20; // 각 범례 아이템의 Y축 위치 조정
        chart.cursor = new am4charts.XYCursor();

    }




}
function drawMultiGauge0To320OneColor3(chartName, chart, strokeWidth, textSize, dataTextSize, valueTextSize, textPaddingBottom, dataPaddingTop, valuePaddingTop, handRadius, handInRadius, targetValue, targetData, dataUnit) {

    chart.hiddenState.properties.opacity = 0;
    chart.startAngle = 0;
    chart.endAngle = 320;

    if (typeof targetData === "number") {
        targetData = targetData.toString();
    }

    function createAxis(min, max, start, end, color, width, label) {
        var axis = chart.xAxes.push(new am4charts.ValueAxis());
        axis.min = min;
        axis.max = max;
        axis.strictMinMax = false;
        axis.renderer.useChartAngles = false;
        axis.renderer.startAngle = start;
        axis.renderer.endAngle = end;
        axis.renderer.minGridDistance = 70;

        axis.renderer.line.strokeOpacity = 1;
        axis.renderer.line.strokeWidth = width;
        axis.renderer.line.stroke = am4core.color(color);

        axis.renderer.ticks.template.disabled = true;
        axis.renderer.labels.template.disabled = true;
        axis.renderer.grid.template.disabled = true;
        axis.renderer.ticks.template.length = 10;

        var range = axis.axisRanges.create();
        range.label.text = label;
        range.grid.disabled = true;

        return axis;
    }

    function createHand(axis) {
        var hand = chart.hands.push(new am4charts.ClockHand());
        hand.fill = axis.renderer.line.stroke;
        hand.stroke = axis.renderer.line.stroke;
        hand.axis = axis;
        hand.pin.disabled = true;
        hand.startWidth = 10;
        hand.endWidth = 0;
        hand.radius = am4core.percent(84);
        hand.innerRadius = am4core.percent(70);
        hand.value = 0;
        return hand;
    }

    var targetText = "";
    var targetColor = "";


    if (chartName.substring(0, 4) == "temp") {
        if (targetValue == "-1") {
            targetText = "-";
        } else if (0 <= targetValue && targetValue <= 49) {
            targetText = "추움";
            targetColor = "#FF0000";
        } else if (50 <= targetValue && targetValue <= 79) {
            targetText = "더움";
            targetColor = "#FFA800";
        } else if (80 <= targetValue && targetValue <= 89) {
            targetText = "서늘";
            targetColor = "#00D27A";
        } else {
            targetText = "쾌적";
            targetColor = "#4595FF";
        }
    } else if (chartName.substring(0, 4) == "humi") {
        if (targetValue == "-1") {
            targetText = "-";
        } else if (0 <= targetValue && targetValue <= 49) {
            targetText = "건조";
            targetColor = "#FF0000";
        } else if (50 <= targetValue && targetValue <= 79) {
            targetText = "습함";
            targetColor = "#FFA800";
        } else if (80 <= targetValue && targetValue <= 89) {
            targetText = "매우습함";
            targetColor = "#00D27A";
        } else {
            targetText = "쾌적";
            targetColor = "#4595FF";
        }
    } else {
        if (targetValue == "-1") {
            targetText = "-";
        } else if (0 <= targetValue && targetValue <= 49) {
            targetText = "매우나쁨";
            targetColor = "#FF0000";
        } else if (50 <= targetValue && targetValue <= 79) {
            targetText = "나쁨";
            targetColor = "#FFA800";
        } else if (80 <= targetValue && targetValue <= 89) {
            targetText = "보통";
            targetColor = "#00D27A";
        } else {
            targetText = "좋음";
            targetColor = "#4595FF";
        }
    }
    var axis1 = createAxis(0, 100, -249, 69, targetColor, strokeWidth - 2, 0);
    var axis2 = createAxis(0, 0, (targetValue - 100) * 3.2 + 70, 70, "#EBEBEB", strokeWidth);
    var axis2 = createAxis(0, 0, 70, 70, "#EBEBEB", strokeWidth, 100);

    if (targetValue != '-1') {
        var hand = createHand(axis1);

        hand.fill = am4core.color(targetColor);
        hand.stroke = am4core.color(targetColor);

        var _showValue = targetValue * 1;
        hand.showValue(_showValue, am4core.ease.cubicOut);
    }

    var label1 = chart.radarContainer.createChild(am4core.Label);
    label1.isMeasured = false;
    label1.fontSize = valueTextSize;
    label1.x = am4core.percent(50);
    label1.paddingBottom = 15;
    label1.horizontalCenter = "middle";
    label1.verticalCenter = "middle";
    label1.paddingTop = valuePaddingTop;
    label1.text = "[bold]" + targetValue;
    label1.fill = am4core.color(targetColor);

    var label2 = chart.radarContainer.createChild(am4core.Label);
    label2.isMeasured = false;
    label2.fontSize = textSize;
    label2.horizontalCenter = "middle";
    label2.verticalCenter = "bottom";
    label2.paddingBottom = textPaddingBottom;
    label2.text = "[bold]" + targetText;
    label2.fill = am4core.color(targetColor);

    // 데이터 row 값
    if (targetData != null && targetData != '') {
        var label3 = chart.radarContainer.createChild(am4core.Label);
        label3.isMeasured = false;
        label3.fontSize = dataTextSize;
        label3.horizontalCenter = "middle";
        label3.verticalCenter = "top";
        label3.paddingTop = dataPaddingTop;
        label3.text = targetData + " " + dataUnit;
        label3.fill = am4core.color("#000");
    }

    // if(reportIdx != null && reportIdx != '') {
    // 	var exportOptions = chart.exporting.getFormatOptions("png");
    // 	exportOptions.minHeight = 1400;
    // 	exportOptions.minWidth = 1000;
    // 	chart.exporting.backgroundColor = "transparent"; 
    // 	chart.exporting.frameOptions = ("png", exportOptions);
    // }
}
function drawPie(chartName, chart, data, category, value, unUseLabel, text, textFontSize, colorList, innerRadius) {
    chart.data = data;
    chart.radius = 30;
    chart.innerRadius = innerRadius;
    if (!unUseLabel) {
        var label = chart.seriesContainer.createChild(am4core.Label);
        label.text = text;
        label.horizontalCenter = "middle";
        label.verticalCenter = "middle";
        label.fontSize = textFontSize;
    }

    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = value;
    pieSeries.dataFields.category = category;

    pieSeries.labels.template.disabled = false;
    pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%\n({category})";
    pieSeries.labels.template.fill = am4core.color("black");
    pieSeries.labels.template.fontSize = 10
    pieSeries.colors.list = colorList;
    // pieSeries.slices.template.dx = 5;
    // pieSeries.slices.template.dy = 5;
}

function draw2pageCircleChart(chartName, chart, strokeWidth, textSize, dataTextSize, valueTextSize, textPaddingBottom, dataPaddingTop, valuePaddingTop, handRadius, handInRadius, targetValue, targetData, dataUnit) {

    chart.hiddenState.properties.opacity = 0;
    chart.startAngle = 0;
    chart.endAngle = 320;

    if (typeof targetData === "number") {
        targetData = targetData.toString();
    }

    function createAxis(min, max, start, end, color, width, label) {
        var axis = chart.xAxes.push(new am4charts.ValueAxis());
        axis.min = min;
        axis.max = max;
        axis.strictMinMax = false;
        axis.renderer.useChartAngles = false;
        axis.renderer.startAngle = start;
        axis.renderer.endAngle = end;
        axis.renderer.minGridDistance = 70;

        axis.renderer.line.strokeOpacity = 1;
        axis.renderer.line.strokeWidth = width;
        axis.renderer.line.stroke = am4core.color(color);

        axis.renderer.ticks.template.disabled = true;
        axis.renderer.labels.template.disabled = true;
        axis.renderer.grid.template.disabled = true;
        axis.renderer.ticks.template.length = 10;

        var range = axis.axisRanges.create();
        range.label.text = label;
        range.label.fontSize = 12;
        range.grid.disabled = true;

        return axis;
    }

    function createHand(axis) {
        var hand = chart.hands.push(new am4charts.ClockHand());
        hand.fill = axis.renderer.line.stroke;
        hand.stroke = axis.renderer.line.stroke;
        hand.axis = axis;
        hand.pin.disabled = true;
        hand.startWidth = 7;
        hand.endWidth = 0;
        hand.radius = am4core.percent(84);
        hand.innerRadius = am4core.percent(70);
        hand.value = 0;
        return hand;
    }

    var targetText = "";
    var targetColor = "";


    if (chartName.substring(0, 4) == "temp") {
        if (targetValue == "-1") {
            targetText = "-";
        } else if (0 <= targetValue && targetValue <= 49) {
            targetText = "추움";
            targetColor = "#FF0000";
        } else if (50 <= targetValue && targetValue <= 79) {
            targetText = "더움";
            targetColor = "#FFA800";
        } else if (80 <= targetValue && targetValue <= 89) {
            targetText = "서늘";
            targetColor = "#00D27A";
        } else {
            targetText = "쾌적";
            targetColor = "#4595FF";
        }
    } else if (chartName.substring(0, 4) == "humi") {
        if (targetValue == "-1") {
            targetText = "-";
        } else if (0 <= targetValue && targetValue <= 49) {
            targetText = "건조";
            targetColor = "#FF0000";
        } else if (50 <= targetValue && targetValue <= 79) {
            targetText = "습함";
            targetColor = "#FFA800";
        } else if (80 <= targetValue && targetValue <= 89) {
            targetText = "매우습함";
            targetColor = "#00D27A";
        } else {
            targetText = "쾌적";
            targetColor = "#4595FF";
        }
    } else {
        if (targetValue == "-1") {
            targetText = "-";
        } else if (0 <= targetValue && targetValue <= 49) {
            targetText = "매우나쁨";
            targetColor = "#FF0000";
        } else if (50 <= targetValue && targetValue <= 79) {
            targetText = "나쁨";
            targetColor = "#FFA800";
        } else if (80 <= targetValue && targetValue <= 89) {
            targetText = "보통";
            targetColor = "#00D27A";
        } else {
            targetText = "좋음";
            targetColor = "#4595FF";
        }
    }
    var axis1 = createAxis(0, 100, -249, 69, targetColor, strokeWidth - 2, 0);
    var axis2 = createAxis(0, 0, (targetValue - 100) * 3.2 + 70, 70, "#EBEBEB", strokeWidth);
    var axis2 = createAxis(0, 0, 70, 70, "#EBEBEB", strokeWidth, 100);

    if (targetValue != '-1') {
        var hand = createHand(axis1);

        hand.fill = am4core.color(targetColor);
        hand.stroke = am4core.color(targetColor);

        var _showValue = targetValue * 1;
        hand.showValue(_showValue, am4core.ease.cubicOut);
    }

    var label1 = chart.radarContainer.createChild(am4core.Label);
    label1.isMeasured = false;
    label1.fontSize = valueTextSize;
    label1.x = am4core.percent(50);
    label1.paddingBottom = 15;
    label1.horizontalCenter = "middle";
    label1.verticalCenter = "middle";
    label1.paddingTop = valuePaddingTop;
    label1.text = "[bold]" + targetValue;
    label1.fill = am4core.color(targetColor);

    var label2 = chart.radarContainer.createChild(am4core.Label);
    label2.isMeasured = false;
    label2.fontSize = textSize;
    label2.horizontalCenter = "middle";
    label2.verticalCenter = "bottom";
    label2.paddingBottom = textPaddingBottom;
    label2.text = "[bold]" + targetText;
    label2.fill = am4core.color(targetColor);

    // 데이터 row 값
    if (targetData != null && targetData != '') {
        var label3 = chart.radarContainer.createChild(am4core.Label);
        label3.isMeasured = false;
        label3.fontSize = dataTextSize;
        label3.horizontalCenter = "middle";
        label3.verticalCenter = "top";
        label3.paddingTop = dataPaddingTop;
        label3.text = targetData + " " + dataUnit;
        label3.fill = am4core.color("#000");
    }

    // if(reportIdx != null && reportIdx != '') {
    // 	var exportOptions = chart.exporting.getFormatOptions("png");
    // 	exportOptions.minHeight = 1400;
    // 	exportOptions.minWidth = 1000;
    // 	chart.exporting.backgroundColor = "transparent"; 
    // 	chart.exporting.frameOptions = ("png", exportOptions);
    // }
}
function drawLineChart(reportIdx, chartName, chart, data, istemp) {
    // chart.data = data;
    // value가 0인 데이터 지우는 부분

    var filteredData = data.filter(function (item) {
        return item.val !== 0;
    });
    chart.padding(20, 0);  // top, right, bottom, left
    chart.data = filteredData;
    // Create axes
    var yAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    yAxis.dataFields.category = "category";
    yAxis.renderer.grid.template.disabled = true;
    yAxis.renderer.labels.template.disabled = true;

    var xAxis = chart.xAxes.push(new am4charts.ValueAxis());
    xAxis.dataFields.category = "name";
    xAxis.renderer.grid.template.disabled = true;
    xAxis.renderer.labels.template.disabled = true;
    xAxis.min = 0;
    xAxis.max = 100;

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = "to";
    series.dataFields.openValueX = "from";
    series.dataFields.categoryY = "category";
    series.columns.template.strokeOpacity = 0;
    series.columns.template.height = am4core.percent(100);

    series.columns.template.background.fillOpacity = 0.1;

    var label = series.columns.template.createChild(am4core.Label);
    label.text = "{val} %";
    label.align = "center";
    label.valign = "middle";
    label.fontSize = 12
    label.zIndex = 2;

    series.columns.template.adapter.add("fill", function (fill, target) {
        var patternValue = target.dataItem.dataContext.pattern;
        if (patternValue) {
            var pattern = new am4core.LinePattern();
            pattern.width = 10;
            pattern.height = 10;
            pattern.strokeWidth = 1;
            pattern.stroke = am4core.color(target.dataItem.dataContext.color); // Use am4core.color() for proper color parsing
            pattern.rotation = 135;
            return pattern;
        } else {
            return target.dataItem.dataContext.color;
        }
    });

}


function drawBaseLineReport(reportIdx, chartName, chart, data, badBoundary, normalBoundary, likeBoundary, maximum, yTitle, locale, min, max) {

    chart.data = data;

    chart.language.locale = locale;
    chart.dateFormatter.inputDateFormat = "yyyyMMdd";


    // Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.5;
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.dateFormats.setKey("day", "dd");
    dateAxis.title.text = "날짜(일)";
    dateAxis.tooltipDateFormat = "dd일";
    dateAxis.title.fontSize = 11; // x축 제목 폰트 크기 설정
    dateAxis.renderer.labels.template.fontSize = 11; // x축 레이블 폰트 크기 설정

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = yTitle;
    valueAxis.title.fontSize = 11; // y축 제목 폰트 크기 설정
    valueAxis.renderer.labels.template.fontSize = 11; // y축 레이블 폰트 크기 설정
    valueAxis.min = min - 20; // 최소값 설정
    valueAxis.max = max + 20; // 최대값 설정
    valueAxis.strictMinMax = true;

    function createRanges(value, endValue, color) {
        var range = valueAxis.axisRanges.create();
        range.value = value;
        range.endValue = endValue;
        range.axisFill.fill = color;
        range.axisFill.fillOpacity = 0.4;
        range.grid.strokeOpacity = 0;
    }

    createRanges(-100, likeBoundary, am4core.color("#5ABEF5"));
    createRanges(likeBoundary, normalBoundary, am4core.color("#91CF56"));
    createRanges(normalBoundary, badBoundary, am4core.color("#FFA800"));
    createRanges(badBoundary, maximum, am4core.color("#F93F3E"));

    function createSeries(field, name, color) {
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = field;
        series.dataFields.dateX = "fullDate";
        series.tooltipText = "{valueY}"
        series.name = name;
        series.strokeWidth = 3;
        series.minBulletDistance = 15;
        series.fill = am4core.color(color);
        series.stroke = am4core.color(color);
        series.connect = false;

        // Drop-shaped tooltips
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.strokeOpacity = 0;
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.label.minWidth = 40;
        series.tooltip.label.minHeight = 40;
        series.tooltip.label.textAlign = "middle";
        series.tooltip.label.textValign = "middle";
        series.tooltip.label.fill = am4core.color(color);
        series.tooltip.background.strokeWidth = 2;
        series.tooltip.getFillFromObject = false;
        series.tooltip.label.fontSize = 10; // 툴팁 폰트 크기 설정

        // Make bullets grow on hover
        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 2;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");

        var bullethover = bullet.states.create("hover");
        bullethover.properties.scale = 1.3;
    }

    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor();

    createSeries("min", "최저값", "blue");
    createSeries("avg", "평균값", "black");
    createSeries("max", "최고값", "red");

    chart.legend = new am4charts.Legend();
    chart.legend.position = "top";
    chart.legend.labels.template.fontSize = 10; // 범례 폰트 크기 설정


}

function drawBaseLineReport_seven(reportIdx, chartName, chart, data, veryLow, low, normal, like, normalHigh, high, miximum, yTitle, locale, min, max) {

    chart.data = data;

    chart.language.locale = locale;
    chart.dateFormatter.inputDateFormat = "yyyyMMdd";

    // Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.5;
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.dateFormats.setKey("day", "dd");
    dateAxis.title.text = "날짜(일)";
    dateAxis.title.fontSize = 11; // x축 제목 폰트 크기 설정
    dateAxis.renderer.labels.template.fontSize = 11; // x축 레이블 폰트 크기 설정

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = yTitle;
    valueAxis.title.fontSize = 11; // y축 제목 폰트 크기 설정
    valueAxis.renderer.labels.template.fontSize = 11; // y축 레이블 폰트 크기 설정
    valueAxis.min = min - 5; // 최소값 설정
    valueAxis.max = max + 5; // 최대값 설정
    valueAxis.strictMinMax = true;

    function createRanges(value, endValue, color, pattern) {
        var range = valueAxis.axisRanges.create();
        range.value = value;
        range.endValue = endValue;
        range.grid.strokeOpacity = 0;
        if (pattern) {
            var pattern = new am4core.LinePattern();
            pattern.width = 10;
            pattern.height = 10;
            pattern.strokeWidth = 3;
            pattern.stroke = color;
            //pattern.rotation = 45;
            pattern.rotation = 135;
            range.axisFill.fill = pattern;
        } else {
            range.axisFill.fill = color;
        }

        range.axisFill.fillOpacity = 0.4;
    }

    createRanges(-100, veryLow, am4core.color("#F93F3E"), true);
    createRanges(veryLow, low, am4core.color("#FFA800"), true);
    createRanges(low, normal, am4core.color("#91CF56"), true);
    createRanges(normal, like, am4core.color("#5ABEF5"));
    createRanges(like, normalHigh, am4core.color("#91CF56"));
    createRanges(normalHigh, high, am4core.color("#FFA800"));
    createRanges(high, miximum, am4core.color("#F93F3E"));

    function createSeries(field, name, color) {
        var series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = field;
        series.dataFields.dateX = "fullDate";
        series.tooltipText = "{valueY}"
        series.name = name;
        series.strokeWidth = 3;
        series.minBulletDistance = 15;
        series.fill = am4core.color(color);
        series.stroke = am4core.color(color);
        series.connect = false;

        // Drop-shaped tooltips
        series.tooltip.background.cornerRadius = 20;
        series.tooltip.background.strokeOpacity = 0;
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.label.minWidth = 40;
        series.tooltip.label.minHeight = 40;
        series.tooltip.label.textAlign = "middle";
        series.tooltip.label.textValign = "middle";
        series.tooltip.label.fill = am4core.color(color);
        series.tooltip.background.strokeWidth = 2;
        series.tooltip.getFillFromObject = false;
        series.tooltip.label.fontSize = 10; // 툴팁 폰트 크기 설정

        // Make bullets grow on hover
        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.strokeWidth = 2;
        bullet.circle.radius = 4;
        bullet.circle.fill = am4core.color("#fff");

        var bullethover = bullet.states.create("hover");
        bullethover.properties.scale = 1.3;
    }

    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor();

    createSeries("min", "최저값", "blue");
    createSeries("avg", "평균값", "black");
    createSeries("max", "최고값", "red");

    chart.legend = new am4charts.Legend();
    //chart.legend.useDefaultMarker = true;
    chart.legend.position = "top";
    chart.legend.labels.template.fontSize = 10; // 범례 폰트 크기 설정


}


function drawRadar(reportIdx, chartName, chart, data, max) {
    chart.data = data;

    /* Create axes */
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "indicator";
    categoryAxis.renderer.labels.template.fontSize = 10; // 카테고리 축의 텍스트 크기 설정


    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.fillOpacity = 0;
    valueAxis.renderer.labels.template.fontSize = 10; // 값 축의 텍스트 크기 설정
    valueAxis.min = 0; // 최소값 설정
    valueAxis.max = max; // 최대값 설정
    valueAxis.strictMinMax = true;
    // Disable the default grid lines
    valueAxis.renderer.grid.template.disabled = true;
    // valueAxis.renderer.ticks.template.disabled = true;
    // Create grid intervals at 0, half of the max value, and the max value
    var intervals = [0, max / 2, max];
    intervals.forEach(function (interval) {
        var range = valueAxis.axisRanges.create();
        range.value = interval;
        range.grid.stroke = am4core.color("#b8b8b8");
        range.grid.strokeOpacity = 0.5;
    });

    /* Create and configure series */
    var series = chart.series.push(new am4charts.RadarSeries());
    series.dataFields.valueY = "litres";
    series.dataFields.categoryX = "indicator";
    series.name = "percent";
    series.fillOpacity = 0.4;
    series.strokeWidth = 0;
    series.tooltip.label.fontSize = 10; // 툴팁 폰트 크기 설정
    series.fill = am4core.color("#4595ff"); // 그래프의 채우기 색 설정

    var labelBullet = series.bullets.push(new am4charts.LabelBullet());
    labelBullet.label.verticalCenter = "bottom";
    labelBullet.label.dy = 15;
    labelBullet.label.text = "{values.valueY.value}";
    labelBullet.label.fontSize = 11; // 레이블 텍스트 크기 설정	
    labelBullet.label.hidden = true; // 모든 labelBullet.label 숨기기

    categoryAxis.renderer.labels.template.adapter.add("textOutput", function (text, target) {
        var category = target.dataItem.category;
        var dataItem = chart.data.find(item => item.indicator === category);
        var value = dataItem ? dataItem.litres : "";
        return value !== "" ? `${category}: ${value} %` : category;
    });

}





export { drawMultiGauge0To320OneColor, drawMultiGauge0To320OneColor2, drawBaseLine, drawSmoothLineChart, drawBaseLine3, drawBaseLine3WithUnits, setChartData, drawMultiGauge0To320OneColor3, drawPie, draw2pageCircleChart, drawLineChart, drawBaseLineReport, drawBaseLineReport_seven, drawRadar }