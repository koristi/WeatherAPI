/*jshint esversion: 6 */
global.jQuery = require("jquery");
global.$ = require("jquery");
require('bootstrap');
require('popper.js');

var uri = "https://prod-23.northeurope.logic.azure.com:443/workflows/567da3699ec840fdb9a3a24a256933f3/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2-ThVVPxBbVEHQUEwLU9EZHc1MlsEsfvnmx-UZvl15I";

var data = 
{
    "dateEnd": yyyymmdd(),
    "dateStart": "2018-11-07T00:00:00"
};

function setEndDateForData(date) {

}

var legends = [];
var winds = [];
var humids = [];
var clouds = [];
var temps = [];
var weatherTypes = [];

var tempChart;
var windChart;
var humidChart;
var cloudChart;
var weatherTypeChart;

const tempOptions = {
    title: {
        text: 'Temperature'
    },
    tooltip: {},
    legend: {
        data: ['Temperature (Celsius)']
    },
    xAxis: {
        type: 'time',
        minInterval: 3600 * 1000 * 24,
        maxInterval: 3600 * 1000 * 24,
        name: "Time",
        nameLocation: 'middle',
        splitLine: {
            show: true
        },
        splitArea: {
            show: true
        },
        z: 10
    },
    yAxis: {
        name: "Celcius",
        boundaryGap: [0, '100%'],
        maxInterval: 1,
        splitLine: {
            show: true
        }
    },
    series: [{
        name: 'Temperature',
        type: 'bar',
        data: temps,
        smooth: true
    }]
};

const windOptions = {
    title: {
        text: 'Wind Speed'
    },
    tooltip: {},
    legend: {
        data: ['Wind Speed (m/s)']
    },
    xAxis: {
        name: "Time",
        nameLocation: 'middle',
        type: 'time',
        maxInterval: 3600 * 1000 * 24
    },
    yAxis: {
        name: "m/s",
        boundaryGap: [0, '100%']
    },
    series: [{
        name: 'Wind Speed',
        type: 'bar',
        data: winds
    }]
};

const humidOptions = {
    title: {
        text: 'Humidity'
    },
    tooltip: {},
    legend: {
        data: ['Humidity (Percentage)']
    },
    xAxis: {
        name: "Time",
        nameLocation: 'middle',
        type: 'time',
        maxInterval: 3600 * 1000 * 24
    },
    yAxis: {
        name: "%",
        boundaryGap: [0, '100%'],
    },
    series: [{
        name: 'Humidity',
        type: 'bar',
        data: humids
    }]
};

const cloudOptions = {
    title: {
        text: 'Clouds'
    },
    tooltip: {},
    legend: {
        data: ['Clouds (Percent)']
    },
    xAxis: {
        name: "Time",
        nameLocation: 'middle',
        type: 'time',
        maxInterval: 3600 * 1000 * 24
    },
    yAxis: {
        name: "%",
        boundaryGap: [0, '100%']
    },
    series: [{
        name: 'Clouds',
        type: 'bar',
        data: clouds
    }]
};

const weatherTypeOptions = {
    title: {
        text: 'Weather'
    },
    tooltip: {},
    legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        data: legends
    },
    series: [{
        name: 'Weather',
        type: 'pie',
        radius: '55%',
        center: ['40%', '50%'],
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        },
        data: weatherTypes,
        roseType: 'radius'
    }]
};

function yyyymmdd() {
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var d = now.getDate();
    var hour = now.getHours();
    var min = now.getMinutes();
    var sec = now.getSeconds();
    var mm = m < 10 ? '0' + m : m;
    var dd = d < 10 ? '0' + d : d;
    hour = hour < 10 ? '0' + hour : hour;
    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec;
    return y + '-' + mm + '-' + dd + 'T' + hour + ':' + min + ':' + sec;
}

function toFixed(value, precision) {
    var power = Math.pow(10, precision || 0);
    return Math.round(value * power) / power;
}

function clearData() {
    legends = [];
    winds = [];
    humids = [];
    clouds = [];
    temps = [];
    weatherTypes = [];
}

function updateData(response) {

    clearData();

    updateLegend(response);

    updateTemps(response);

    updateWinds(response);

    updateHumids(response);

    updateClouds(response);

    updateWeatherTypes(response);

    setDataToCharts();
}

function setDataToCharts() {
    tempChart.setOption({
        series: [{
            data: temps
        }]
    });
    windChart.setOption({
        series: [{
            data: winds
        }]
    });
    humidChart.setOption({
        series: [{
            data: humids
        }]
    });
    cloudChart.setOption({
        series: [{
            data: clouds
        }]
    });
    weatherTypeChart.setOption({
        legend: [{
            data: legends
        }],
        series: [{
            data: weatherTypes
        }]
    });
}

function updateWeatherTypes(response) {
    legends.forEach(weatherName => {
        var count = 0;
        response.forEach(weather => {
            if (weather.weatherMain == weatherName) {
                count++;
            }
        });
        var dataPoint = {
            name: weatherName,
            value: count
        };
        weatherTypes.push(dataPoint);
    });
}

function updateClouds(response) {
    response.forEach(weather => {
        var now = new Date(weather.Timestamp);
        var dataPoint = {
            name: now.toString(),
            value: [
                now,
                weather.cloudsPercent
            ]
        };
        clouds.push(dataPoint);
    });
}

function updateHumids(response) {
    response.forEach(weather => {
        var now = new Date(weather.Timestamp);
        var dataPoint = {
            name: now.toString(),
            value: [
                now,
                weather.humidity
            ]
        };
        humids.push(dataPoint);
    });
}

function updateWinds(response) {
    response.forEach(weather => {
        var now = new Date(weather.Timestamp);
        var dataPoint = {
            name: now.toString(),
            value: [
                now,
                weather.windSpeed
            ]
        };
        winds.push(dataPoint);
    });
}

function updateTemps(response) {
    response.forEach(weather => {
        var now = new Date(weather.Timestamp);
        var dataPoint = {
            name: now.toString(),
            value: [
                now,
                toFixed((weather.temperature - 273.15), 2)
            ]
        };
        temps.push(dataPoint);
    });
}

function updateLegend(response) {
    var lookup = {};
    var items = response;
    for (var item, i = 0; item = items[i++];) {
        var name = item.weatherMain;
        if (!(name in lookup)) {
            lookup[name] = 1;
            legends.push(name);
        }
    }
}

function initCharts() {
    tempChart = echarts.init(document.getElementById('Temperature'));
    windChart = echarts.init(document.getElementById('WindSpeed'));
    humidChart = echarts.init(document.getElementById('Humidity'));
    cloudChart = echarts.init(document.getElementById('Clouds'));
    weatherTypeChart = echarts.init(document.getElementById('WeatherTypes'));
}

function drawGraphs() {

    initCharts();

    // use configuration item and data specified to show chart
    tempChart.setOption(tempOptions);
    windChart.setOption(windOptions);
    humidChart.setOption(humidOptions);
    cloudChart.setOption(cloudOptions);
    weatherTypeChart.setOption(weatherTypeOptions);
}

global.getDataForCharts = function() {
    $.ajax({
        url: uri,
        type: "POST",
        data: JSON.stringify(data),
        contentType:"application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            updateData(response);
        }
    });
}

$( document ).ready(function() {

    drawGraphs();

    setVisible("Temperature");

    setInterval(function() {
        updateData(); 
    }, 600000);
    
});

global.setVisible = function(chartName) {
    $('.graph:visible').css("display", "none");
    $('#' + chartName).css("display", "block");
}