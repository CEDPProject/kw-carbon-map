import * as convert from '/convert.js'

function setTable(tableTitle, tableData, dataValues) {
    tableTitle = '#' + tableTitle;
    var coulmns = {
        'eng': [],
        'kor': []
    }
    for (var i in dataValues) {
        if (i % 2 == 0) coulmns['eng'].push(dataValues[i])
        else coulmns['kor'].push(dataValues[i])
    }
    var coulmn = [{ data: 'tm', title: '데이터 시간', "defaultContent": "-" }]
    for (var i in coulmns['eng']) {
        coulmn.push({ data: coulmns['eng'][i], title: coulmns['kor'][i], "defaultContent": "-" })
    }
    $(tableTitle).DataTable({
        data: tableData,
        scrollX: true,
        scrollY: '450px', // tbody에만 세로 스크롤
        autoWidth: false,
        columns: coulmn,
        language: {
            emptyTable: "데이터가 없습니다.",
            lengthMenu: "페이지당 _MENU_ 개씩 보기",
            info: "현재 _START_ - _END_ / _TOTAL_건",
            zeroRecords: "일치하는 데이터가 없습니다.",
            loadingRecords: "로딩중...",
            processing: "잠시만 기다려 주세요.",
            paginate: {
                next: "다음",
                previous: "이전",
            },
        },
        dom: 'Blfrtip',
        searching: false,
        destroy: true,
        createdRow: function (row, data, index) {
            var unitArr = Object.keys(data);
            var deviceType = $("#deviceSelector").find('option:selected').attr('data-devicetype');
            var valueColor = '';
            // Here, data[1] corresponds to the second column. Adjust accordingly based on your datatable structure
            for (var i = 0; i < unitArr.length; i++) {

                var unitValue = unitArr[i]
                // $(row).find('td:nth-child(' + i + ')').addClass('table_'+unitValue);
                let cell = $('td', row).eq(i);
                if (unitValue == "temp") {
                    if (deviceType == "IAQ") valueColor = convert.convertTempIAQColor(data[unitValue]);
                    else valueColor = convert.convertTempOAQColorNew(data[unitValue]);

                } else if (unitValue == "humi") {
                    if (deviceType == "IAQ") valueColor = convert.convertHumiIAQColorNew(data[unitValue]);
                    else valueColor = convert.convertHumiOAQColorNew(data[unitValue]);

                } else if (unitValue == "co2") {
                    valueColor = convert.convertCo2Color(data[unitValue]);
                    $(row).find('td:eq(1)').css('color', valueColor);

                } else if (unitValue == "pm10") {
                    valueColor = convert.convertPm10Color(data[unitValue]);

                } else if (unitValue == "pm25") {
                    valueColor = convert.convertPm25Color(data[unitValue]);

                } else if (unitValue == "voc") {
                    valueColor = convert.convertVOCsColor(data[unitValue]);
                } else if (unitValue == "noise") {
                    valueColor = convert.convertNoiseColor(data[unitValue]);

                }
                else {
                    valueColor = 'black'
                }

                // check the range of each value and change the color accordingly
                // cell.find('.table_'+unitValue).css('color', valueColor);

                // if (colData.avg > 80) {
                //     cell.find('span.avg-value').css('color', 'red');
                // } else if (colData.avg > 60) {
                //     cell.find('span.avg-value').css('color', 'orange');
                // }


            }
        },
        buttons: [
            // 'csv',
            {
                extend: "csv",
                charset: "UTF-8",
                text: "엑셀 파일 다운로드",
                footer: false,
                bom: true,
                filename: 'csvTitle',
                className: "btn btn_sm btn_info text_right float_right",
            },
        ],

    });

    // $(".dt-buttons").addClass('clear')


}


function setStatisticTable(tableTitle, tableData, dataValues) {
    tableTitle = '#' + tableTitle;
    var coulmns = {
        'eng': [],
        'kor': []
    }
    // var tableData = []
    for (var i in dataValues) {
        if (i % 2 == 0) coulmns['eng'].push(dataValues[i])
        else coulmns['kor'].push(dataValues[i])
    }
    var titleJson = {};
    for (var i in coulmns['eng']) {
        titleJson[coulmns['eng'][i]] = coulmns['kor'][i]
    }
    // var coulmn = [{ data: 'tm', title: '데이터 시간', "defaultContent": "-" }]
    let formattedData = coulmns['eng'].map(label => {
        return {
            data: label,
            title: titleJson[label],
            render: function (tableData) {

                return `<span style=" color: gray;">Max:</span> ${tableData.max}<br> 
                        <span class="avg-title" style=" color: gray;">Avg:</span><span class="avg-value"> ${tableData.avg}</span><br> 
                        <span style=" color: gray;">Min:</span> ${tableData.min}`;
            }
        }
    });

    formattedData.unshift({ data: 'tm', title: '데이터 시간', "defaultContent": "-" });
    $(tableTitle).DataTable({
        data: tableData,
        scrollX: true,
        scrollY: "450px",
        autoWidth: false,
        columns: formattedData,
        language: {
            emptyTable: "데이터가 없습니다.",
            lengthMenu: "페이지당 _MENU_ 개씩 보기",
            info: "현재 _START_ - _END_ / _TOTAL_건",
            zeroRecords: "일치하는 데이터가 없습니다.",
            loadingRecords: "로딩중...",
            processing: "잠시만 기다려 주세요.",
            paginate: {
                next: "다음",
                previous: "이전",
            },
        },
        dom: 'Blfrtip',
        searching: false,
        destroy: true,
        createdRow: function (row, data, index) {
            var unitArr = Object.keys(data);
            var deviceType = $("#deviceSelector").find('option:selected').attr('data-devicetype');
            var valueColor = '';
            // Here, data[1] corresponds to the second column. Adjust accordingly based on your datatable structure
            for (var i = 0; i < unitArr.length; i++) {
                var unitValue = unitArr[i]
                let cell = $('td', row).eq(i);
                if (unitValue == "temp") {
                    if (deviceType == "IAQ") valueColor = convert.convertTempIAQColor(data[unitValue]['avg']);
                    else valueColor = convert.convertTempOAQColorNew(data[unitValue]['avg']);
                } else if (unitValue == "humi") {
                    if (deviceType == "IAQ") valueColor = convert.convertHumiIAQColorNew(data[unitValue]['avg']);
                    else valueColor = convert.convertHumiOAQColorNew(data[unitValue]['avg']);
                } else if (unitValue == "co2") {
                    valueColor = convert.convertCo2Color(data[unitValue]['avg']);
                } else if (unitValue == "pm10") {
                    valueColor = convert.convertPm10Color(data[unitValue]['avg']);
                } else if (unitValue == "pm25") {
                    valueColor = convert.convertPm25Color(data[unitValue]['avg']);
                } else if (unitValue == "voc") {
                    valueColor = convert.convertVOCsColor(data[unitValue]['avg']);
                } else if (unitValue == "noise") {
                    valueColor = convert.convertNoiseColor(data[unitValue]['avg']);
                }
                else {
                    valueColor = 'black'
                }
                // check the range of each value and change the color accordingly
                cell.find('span.avg-value').css({ 'color': valueColor, 'font-weight': 'bold' });
                cell.find('span.avg-title').css({ 'color': valueColor });


                // if (colData.avg > 80) {
                //     cell.find('span.avg-value').css('color', 'red');
                // } else if (colData.avg > 60) {
                //     cell.find('span.avg-value').css('color', 'orange');
                // }


            }
        },
        buttons: [
            // 'csv',
            {
                extend: "csv",
                charset: "UTF-8",
                text: "엑셀 파일 다운로드",
                footer: false,
                bom: true,
                filename: 'csvTitle',
                className: "btn btn_sm btn_info text_right float_right",
            },
        ],

    });
}
export { setTable, setStatisticTable }