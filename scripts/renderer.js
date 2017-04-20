const ipcRenderer = require('electron').ipcRenderer;
const $ = require('jquery');

const incomeView = require('../data/IncomeView.js').IncomeView;

ipcRenderer.on('income-data', function (event, data) {
    incomeView.setData(data);
    insertIncomeData();
});

ipcRenderer.on('orders-data', function (event, data) {
    insertOrdersData(data);
});

function insertIncomeData() {
    incomeView.getData().forEach(function (item) {
        var rowExample = $('.js-income-page .js-row');
        var row = rowExample.clone();
        row.removeClass('js-row');
        row.find('.js-date').text(moment.unix(item.date).format("DD.MM.YYYY"));
        row.find('.js-month').text(moment.unix(item.month).format("MM.YYYY"));
        row.find('.js-sum').text(item.sum);
        row.find('.js-payment-type').text(item.paymentType);
        row.find('.js-contact').text(item.contact);
        row.find('.js-description').text(item.description);
        row.insertBefore(rowExample);
    });

    google.charts.load("current", {packages:['corechart']});
    google.charts.setOnLoadCallback(drawChart);
}

function insertOrdersData(data) {
    data.forEach(function (item) {
        var rowExample = $('.js-orders-page .js-row');
        var row = rowExample.clone();
        row.removeClass('js-row');
        row.find('.js-month').text(item.month);
        row.find('.js-sum').text(item.sum);
        row.find('.js-prepayment').text(item.prepayment);
        row.find('.js-payment').text(item.payment);
        row.find('.js-expenses').text(item.expenses);
        row.find('.js-payment-type').text(item.paymentType);
        row.find('.js-contact').text(item.contact);
        row.find('.js-type').text(item.type);
        row.find('.js-description').text(item.description);
        row.find('.js-link').text(item.link);
        row.find('.js-status').text(item.status);
        row.insertBefore(rowExample);
    });
}

$(document).ready(function () {
    $('.js-tab').click(function () {
        var name = $(this).data('name');
        $('.js-page').removeClass('active');
        $('.js-tab').removeClass('active');
        $(this).addClass('active');
        $('.js-page[data-name="'+ name + '"]').addClass('active');
    });
});


function drawChart() {
    var data = [["Month", "Sum"]];
    var dataByMonth = incomeView.getDataByMonth();
    for (var property in dataByMonth) {
        if (dataByMonth.hasOwnProperty(property)) {
            data.push([property, dataByMonth[property]])
        }
    }

    var chartData = google.visualization.arrayToDataTable(data);
    var view = new google.visualization.DataView(chartData);

    var options = {
        title: "Income by month",
        width: 1200,
        height: 500,
        bar: {groupWidth: "95%"},
        legend: { position: "none" }
    };
    var chart = new google.visualization.ColumnChart(document.getElementById("js-income-chart"));
    chart.draw(view, options);
}