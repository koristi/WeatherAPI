/*jshint esversion: 6 */
global.jQuery = require("jquery");
global.$ = require("jquery");
require('bootstrap');
require('popper.js');

var countDownDate;

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
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    dataZoom: [
        {
            id: 'dataZoomX',
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'filter'
        }
    ],
    xAxis: {
        type: 'time',
        minInterval: 3600 * 1000,
        maxInterval: 3600 * 1000 * 24,
        splitLine: {
            show: false
        },
        splitArea: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#eee'
            }
        }
    },
    yAxis: {
        name: "Celcius",
        boundaryGap: [0, '100%'],
        maxInterval: 1,
        splitLine: {
            show: true
        },
        axisLine: {
            lineStyle: {
                color: '#eee'
            }
        }
    },
    series: [{
        name: 'Temperature',
        type: 'line',
        symbol: 'none',
        sampling: 'average',
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'red' // color at 0% position
                }, {
                    offset: 1, color: 'blue' // color at 100% position
                }],
                globalCoord: false // false by default
            }
        },
        data: temps,
        smooth: true,
        lineStyle: {
            normal: {
                color: 'rgb(255, 70, 131)',
                width: 1
            }
        }
    }]
};

const windOptions = {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    dataZoom: [
        {
            id: 'dataZoomX',
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'filter'
        }
    ],
    xAxis: {
        type: 'time',
        minInterval: 3600 * 1000,
        maxInterval: 3600 * 1000 * 24,
        splitLine: {
            show: false
        },
        splitArea: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#eee'
            }
        }
    },
    yAxis: {
        name: "Wind (m/s)",
        boundaryGap: [0, '100%'],
        maxInterval: 0.5,
        splitLine: {
            show: true
        },
        axisLine: {
            lineStyle: {
                color: '#eee'
            }
        }
    },
    series: [{
        name: 'Wind Speed',
        type: 'line',
        data: winds,
        symbol: 'none',
        sampling: 'average',
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'red' // color at 0% position
                }, {
                    offset: 1, color: 'green' // color at 100% position
                }],
                globalCoord: false // false by default
            }
        },
        lineStyle: {
            normal: {
                color: 'rgb(255, 70, 131)',
                width: 1
            }
        }
    }]
};

const humidOptions = {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    dataZoom: [
        {
            id: 'dataZoomX',
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'filter'
        }
    ],
    xAxis: {
        type: 'time',
        minInterval: 3600 * 1000,
        maxInterval: 3600 * 1000 * 24,
        splitLine: {
            show: false
        },
        splitArea: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#eee'
            }
        }
    },
    yAxis: {
        name: "Humidity %",
        max: 100,
        maxInterval: 5,
        boundaryGap: [0, '100%'],
        axisLine: {
            lineStyle: {
                color: '#eee'
            }
        }
    },
    series: [{
        name: 'Humidity',
        type: 'line',
        data: humids,
        symbol: 'none',
        sampling: 'average',
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'blue' // color at 0% position
                }, {
                    offset: 1, color: 'white' // color at 100% position
                }],
                globalCoord: false // false by default
            }
        },
        lineStyle: {
            normal: {
                color: 'blue',
                width: 1
            }
        },
    }]
};

const cloudOptions = {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    dataZoom: [
        {
            id: 'dataZoomX',
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'filter'
        }
    ],
    xAxis: {
        type: 'time',
        minInterval: 3600 * 1000,
        maxInterval: 3600 * 1000 * 24,
        splitLine: {
            show: false
        },
        splitArea: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#eee'
            }
        }
    },
    yAxis: {
        name: "Clouds %",
        max: 100,
        maxInterval: 5,
        boundaryGap: [0, '100%'],
        axisLine: {
            lineStyle: {
                color: '#eee'
            }
        }
    },
    series: [{
        name: 'Clouds',
        type: 'line',
        data: clouds,
        symbol: 'none',
        lineStyle: {
            normal: {
                color: 'white',
                width: 1
            }
        },
        sampling: 'average',
        areaStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'grey' // color at 0% position
                }, {
                    offset: 1, color: 'blue' // color at 100% position
                }],
                globalCoord: false // false by default
            }
        }
    }]
};

const weatherTypeOptions = {
    tooltip: {},
    legend: {
        type: 'scroll',
        orient: 'horizontal',
        top: 20,
        bottom: 20,
        data: legends,
        textStyle: {
            color: '#fff',
            fontSize: 12
        }
    },
    series: [{
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        },
        data: weatherTypes,
        label: {
            normal: {
                textStyle: {
                    color: 'white'
                }
            }
        },
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
            setCountdownTimeAfterMinutes(10);
        }
    });
}

function setCountdownTimeAfterMinutes(minutes) {
    countDownDate = new Date(Date.now()).getTime() + minutes*60000;
}

var setRefreshCountDown = function setRefreshCountDown() {

    // Get todays date and time
    var now = new Date(Date.now()).getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element
    document.getElementById("countdown").innerHTML = "Autorefresh in "
    + minutes + " minutes " + seconds + " seconds.";

    // If the count down is finished, add time
    if (distance < 0) {
        getDataForCharts();
        setCountdownTimeAfterMinutes(10);
    }
}

$( document ).ready(function() {
    $("#countdown").css("display", "none");
    setCountdownTimeAfterMinutes(10);
    drawGraphs();
    setVisible("Info");
    setInterval(setRefreshCountDown, 1000);
});

global.setVisible = function(chartName) {
    $('.graph:visible').css("display", "none");
    $('#' + chartName).css("display", "block");
}