/*jshint esversion: 6 */

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

    var lookup = {};
    var items = response;

    for (var item, i = 0; item = items[i++];) {
        var name = item.weatherMain;

        if (!(name in lookup)) {
            lookup[name] = 1;
            legends.push(name);
        }
    }

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

    tempChart.setOption({
        series: [{
            data: temps
        }]});
    windChart.setOption({
        series: [{
            data: winds
        }]});
    humidChart.setOption({
        series: [{
            data: humids
        }]});
    cloudChart.setOption({
        series: [{
            data: clouds
        }]});
    weatherTypeChart.setOption({
        legend: [{
            data: legends
        }],
        series: [{
            data: weatherTypes
        }]});
}

function drawGraphs() {

    tempChart = echarts.init(document.getElementById('Temperature'));
    windChart = echarts.init(document.getElementById('WindSpeed'));
    humidChart = echarts.init(document.getElementById('Humidity'));
    cloudChart = echarts.init(document.getElementById('Clouds'));
    weatherTypeChart = echarts.init(document.getElementById('WeatherTypes'));

    var tempOption = {
        title: {
            text: 'Temperature'
        },
        tooltip: {},
        legend: {
            data:['Temperature (Celsius)']
        },
        xAxis: {
            type: 'time',
            maxInterval: 3600 * 1000 * 24,
            name: "Time",
            nameLocation: 'middle'
        },
        yAxis: {
            min: '-30',
            max: '30',
            name: "Celcius"
        },
        series: [{
            name: 'Temperature',
            type: 'bar',
            data: temps,
            smooth: true
        }]
    };

    var windOption = {
        title: {
            text: 'Wind Speed'
        },
        tooltip: {},
        legend: {
            data:['Wind Speed']
        },
        xAxis: {
            type: 'time',
            maxInterval: 3600 * 1000 * 24
        },
        yAxis: {},
        series: [{
            name: 'Wind Speed',
            type: 'line',
            data: winds,
            smooth: true
        }]
    };

    var humidOption = {
        title: {
            text: 'Humidity'
        },
        tooltip: {},
        legend: {
            data:['Humidity']
        },
        xAxis: {
            type: 'time',
            maxInterval: 3600 * 1000 * 24
        },
        yAxis: {
            min: 'dataMin',
            max: '100'
        },
        series: [{
            name: 'Humidity',
            type: 'line',
            data: humids
        }]
    };

    var cloudOption = {
        title: {
            text: 'Clouds'
        },
        tooltip: {},
        legend: {
            data:['Clouds (Percent)']
        },
        xAxis: {
            type: 'time',
            maxInterval: 3600 * 1000 * 24
        },
        yAxis: {},
        series: [{
            name: 'Clouds',
            type: 'line',
            data: clouds
        }]
    };

    var weatherTypeOption = {
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
            radius : '55%',
            center: ['40%', '50%'],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            data: weatherTypes
        }]
    };

    // use configuration item and data specified to show chart
    tempChart.setOption(tempOption);
    windChart.setOption(windOption);
    humidChart.setOption(humidOption);
    cloudChart.setOption(cloudOption);
    weatherTypeChart.setOption(weatherTypeOption);
}

function GetData() {
    var uri = "https://prod-23.northeurope.logic.azure.com:443/workflows/567da3699ec840fdb9a3a24a256933f3/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2-ThVVPxBbVEHQUEwLU9EZHc1MlsEsfvnmx-UZvl15I";

    var data = 
    {
        "dateEnd": yyyymmdd(),
        "dateStart": "2018-11-07T00:00:00"
    };

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
});