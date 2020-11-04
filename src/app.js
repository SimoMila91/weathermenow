const api = "0b1209a54d4160c220294614d34d91d4";
const uri = "https://api.openweathermap.org/data/2.5/forecast?q=";
let screenWidth = $(window).width();
let city = $('#city');
let temp = $('#temp');
let description = $('#des');
let tempFeels = $('#tempFeels');
let humidity = $('#hum');
let wind = $('#wind');
let deg = $('#deg');
let humIcon = $('#humIcon');
let firstIcon = $('#firstIcon');
let visibility = $('#vis');
let tmpBtn = $('#tmpBtn div');
const textDate = $('#dateText');


// geolocation 
$(document).ready(() => {
    if (screenWidth == 1024 || screenWidth < 1024) {
        $('#form').removeClass('col-lg-6').addClass('col-lg-12');
        $('#cardStyle').removeClass('col-lg-6').addClass('col-lg-12');
        $('.style-mobile-card').css('padding', '0 3% 3% 3%');
    }
    let weekDay = screenWidth < 500 ? 'short' : 'long';
    const options = { weekday: weekDay, year: 'numeric', month: 'long', day: 'numeric' };
    let now = new Date();
    let data = now.toLocaleDateString(undefined, options);
    textDate.text(data);
    let cityLocal = localStorage.getItem('city');
    if (cityLocal) {
        requestCity(cityLocal);
    } else {
        requestCity("Turin");
        localStorage.setItem('city', 'Turin');
    }

});

// display result function 
let displayResult = (data, i) => {
    let kpm;
    let temperature = Math.round(data.list[i].main.temp);
    if (temperature > 9) {
        $('p.margin-change').css('margin-left', '11px');
        if (screenWidth <= 360) {
            $('#divTemp').css('left', '4px');
            $('#firstIcon').css('right', '8px');
        }
    } else {
        $('p.margin-change').css('margin-left', '3px');
    };
    if (screenWidth < 500) {
        $('#imgHeight').removeClass('img-height');
    };
    if ($('#btnCel').hasClass('btn-click')) {
        kpm = 1.609 * data.list[i].wind.speed;
        $('#kmMil').text(' km/h');
        $('#unitType').text(' C°');
        $('#secUnitType').text(' C°');

    } else {
        kpm = data.list[i].wind.speed;
        $('#kmMil').text(' mil/h');
        $('#unitType').text(' F°');
        $('#secUnitType').text(' F°');
    };
    let humResp = data.list[i].main.humidity;
    let lastClass = humIcon.attr('class').split(' ').pop();
    let idTemp = data.list[i].weather[0].id;
    let vis = data.list[i].visibility / 1000.0;
    city.text(data.city.name + ' - ' + data.city.country);
    temp.text(temperature);
    wind.text(Math.round(kpm));
    deg.text(getDirection(data.list[i].wind.deg));
    description.text(data.list[i].weather[0].description);
    tempFeels.text(Math.round(data.list[i].main.feels_like));
    visibility.text(vis);
    humidity.text(humResp);



    firstIcon.attr('src', `${getFiveWeatherIcon(idTemp)}`);

    if (dayTime(data.list[i].sys.pod)) {
        $('#dayNight').attr('src', './src/image/day.jpg');
    } else {
        $('#dayNight').attr('src', './src/image/night.jpg');
    }

    if (lastClass === 'fas') {
        if (humResp < 20) {
            humIcon.addClass('fa-thermometer-empty');
        } else if (humResp < 50) {
            humIcon.addClass('fa-thermometer-quarter');
        } else if (humResp < 60) {
            humIcon.addClass('fa-thermometer-half');
        } else if (humResp < 90) {
            humIcon.addClass('fa-thermometer-three-quarters');
        } else {
            humIcon.addClass('fa-thermometer-full');
        };
    } else {
        if (humResp < 20) {
            humIcon.removeClass(lastClass).addClass('fa-thermometer-empty');
        } else if (humResp < 50) {
            humIcon.removeClass(lastClass).addClass('fa-thermometer-quarter');
        } else if (humResp < 60) {
            humIcon.removeClass(lastClass).addClass('fa-thermometer-half');
        } else if (humResp < 90) {
            humIcon.removeClass(lastClass).addClass('fa-thermometer-three-quarters');
        } else {
            humIcon.removeClass(lastClass).addClass('fa-thermometer-full');
        };
    }
};

let showForecast = (data) => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const goOnDays = 4;
    let d = new Date();
    let today = d.getDate();
    let nowHour = d.getHours();
    let day = [];
    let todayMax = [];
    let secondDay = [];
    let thirdDay = [];
    let fourthDay = [];
    let fifthDay = [];
    let daysSorted = [];
    let minMax = [];
    let icon = [];
    let dataTemp = [];
    let label = [];


    for (let i = 0; i < data.list.length; i += 8) {
        day.push(data.list[i].dt_txt.slice(8, 10));
    };

    let now = new Date(d.setDate(d.getDate()));
    for (let i = 0; i < goOnDays; i++) {
        let newDate = new Date(d.setDate(d.getDate() + 1));
        daysSorted.push(days[newDate.getDay()]);
    }
    daysSorted.unshift(days[now.getDay()]);
    for (let i = 0; i < data.list.length; i++) {
        if (nowHour < 23) {
            let search = data.list[i].dt_txt.slice(8, 10);
            let hour = data.list[i].dt_txt.slice(11, 13);
            if (search.includes(today)) {
                todayMax.push(data.list[i].main.temp_max);
                if (nowHour == hour || hour == (nowHour + 1) || hour == (nowHour + 2)) {
                    icon.push(data.list[i].weather[0].id);
                }
            } else if (search.includes(today + 1)) {
                secondDay.push(data.list[i].main.temp);
            } else if (search.includes(today + 2)) {
                thirdDay.push(data.list[i].main.temp);
            } else if (search.includes(today + 3)) {
                fourthDay.push(data.list[i].main.temp);
            } else if (search.includes(today + 4)) {
                fifthDay.push(data.list[i].main.temp);
            }
            for (let i = 0; i < data.list.length; i++) {
                let search = data.list[i].dt_txt.slice(8, 10);
                let hour = data.list[i].dt_txt.slice(11, 13);
                if (hour == 12 && !search.includes(today)) {
                    icon.push(data.list[i].weather[0].id);
                }
            };
        } else {
            icon.push(data.list[0].weather[0].id);
            today.push([data.list[0].main.temp_max, data.list[7].main.temp_min]);
            secondDay.push([data.list[8].main.temp, data.list[15].main.temp]);
            thirdDay.push([data.list[16].main.temp, data.list[23].main.temp]);
            fourthDay.push([data.list[24].main.temp, data.list[31].main.temp]);
            fifthDay.push([data.list[32].main.temp, data.list[39].main.temp]);
        };
    };

    for (let i = 0; i < data.list.length; i++) {
        let search = data.list[i].dt_txt.slice(8, 10);
        if (search.includes(today)) {
            dataTemp.push(data.list[i].main.temp);
            label.push(data.list[i].dt_txt.slice(11, 16));
        };
    };

    minMax.push([Math.round(Math.max(...todayMax)) + "°", Math.round(Math.min(...todayMax)) + "°"]);
    minMax.push([Math.round(Math.max(...secondDay)) + "°", Math.round(Math.min(...secondDay)) + "°"]);
    minMax.push([Math.round(Math.max(...thirdDay)) + "°", Math.round(Math.min(...thirdDay)) + "°"]);
    minMax.push([Math.round(Math.max(...fourthDay)) + "°", Math.round(Math.min(...fourthDay)) + "°"]);
    minMax.push([Math.round(Math.max(...fifthDay)) + "°", Math.round(Math.min(...fifthDay)) + "°"]);

    tmpBtn.attr('id', `${day[0]}`);
    scrollMobile(label);
    for (let i = 0; i < label.length; i++) {
        tmpBtn.append(
            `<div class="box-btn">${label[i]}</div>`
        )
    };

    for (let i = 0; i <= 4; i++) {
        $('#boxForecast').append(
            `<div id="${day[i]}" class="box">
                <span>${daysSorted[i]}</span><br>
                <img id="wicon" src="${getFiveWeatherIcon(icon[i])}" height="40px" alt="weather icon"><br>             
                <span><span class="strong">${minMax[i][0]}</span>/ ${minMax[i][1]}</span>
            </div>`
        )
    };

    dataTempControl(dataTemp);

    if (nowHour > 18 && nowHour < 23) {
        $('.box-btn:last').addClass('myClickBtn');
        $('.box-btn').css('color', 'darkgrey');
        $('.box-btn:last').css('color', 'black');
    } else {
        $('.box-btn:first').addClass('myClickBtn');
    }
    $('.box:first').addClass('myClickState');

    let myChart = $('#myChart');
    Chart.plugins.unregister(ChartDataLabels);
    let myLineChart = new Chart(myChart, {
        plugins: [ChartDataLabels],
        type: 'line',
        data: {
            // da sistemare colori 
            datasets: [{
                label: 'Temperature',
                data: dataTemp,
                pointBackgroundColor: "#55bae7",
                pointBorderColor: "#55bae7",
                backgroundColor: "#F29191",
                borderColor: "#F29191",
                pointHoverBackgroundColor: "#55bae7",
                pointHoverBorderColor: "#55bae7",
                datalabels: {
                    align: 'top',
                    anchor: 'top'
                }
            }],
            labels: label
        },
        options: {
            aspectRatio: 4 / 3,
            tooltips: false,
            layout: {
                padding: {
                    top: 20,
                    right: 14,
                }
            },
            elements: {
                line: {
                    fill: false
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                datalabels: {
                    backgroundColor: function (context) {
                        return context.dataset.backgroundColor;
                    },
                    borderRadius: 3,
                    color: 'black',
                    font: {
                        size: 15,
                        weight: 'bold'
                    },
                    formatter: Math.round
                },
                legend: false
            },
            scales: {
                xAxes: [{
                    ticks: {
                        display: false
                    }
                }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        display: false
                    }
                }]
            }
        }
    });

    $(".box").on("click", function (e) {
        e.preventDefault();
        tmpBtn.empty();
        removeData(myLineChart);
        dataTemp.splice(0, dataTemp.length);
        label.splice(0, label.length);
        if (!$(this).hasClass("myClickState")) {
            $(".box").removeClass("myClickState");
            $(this).addClass("myClickState");
        };
        if ($(this).hasClass("myClickState")) {
            let weekDay = $(this).find('span:first').text();

            let id = $(this).attr('id');
            for (let i = 0; i < data.list.length; i++) {
                if (data.list[i].dt_txt.slice(8, 10) == id) {
                    let month = data.list[i].dt_txt.slice(5, 7);
                    let year = data.list[i].dt_txt.slice(0, 4);
                    dateBuilder(weekDay, id, month, year);
                    tmpBtn.attr('id', `${id}`);
                    dataTemp.push(data.list[i].main.temp);
                    label.push(data.list[i].dt_txt.slice(11, 16));
                    // aggiorno
                    if (data.list[i].dt_txt.slice(11, 13) == '00') {
                        displayResult(data, i);
                    } else if (data.list[i].dt_txt.slice(11, 13) != '00' && id == today) {
                        displayResult(data, 0);
                    }
                };

            };
            dataTempControl(dataTemp);
            scrollMobile(label);
            for (let i = 0; i < label.length; i++) {
                tmpBtn.append(
                    `<div class="box-btn">${label[i]}</div>`
                )
            };

            myClickBtnFunction(data);
            if (nowHour > 18 && nowHour < 23 && today == id) {
                $('.box-btn').css('color', 'darkgrey');
                $('.box-btn:last').addClass('myClickBtn');
                $('.box-btn:last').css('color', 'black');
            } else {
                $('.box-btn:first').addClass('myClickBtn');
            }
        }
        addData(myLineChart, label, dataTemp);
    });
    myClickBtnFunction(data);
};

let myClickBtnFunction = (data) => {
    $('.box-btn').on("click", function () {
        let id = tmpBtn.attr('id');
        let hour = $(this).text();
        if (!$(this).hasClass('myClickBtn')) {
            $('.box-btn').removeClass('myClickBtn');
            $(this).addClass('myClickBtn');
        };
        for (let i = 0; i < data.list.length; i++) {
            if (data.list[i].dt_txt.slice(8, 10) == id && data.list[i].dt_txt.slice(11, 16) == hour) {
                displayResult(data, i);
            };
        };
    });
};

$('#geoClick').on('click', function () {
    let query;
    if ($('#btnCel').hasClass('btn-click')) {
        query = "metric";
    } else {
        query = "imperial";
    };
    try {
        var getIP = 'https://ip-api.com/json/';
        let openWeatherMap = 'https://api.openweathermap.org/data/2.5/forecast'
        $.getJSON(getIP).done(function (location) {
            $.getJSON(openWeatherMap, {
                lat: location.lat,
                lon: location.lon,
                units: query,
                APPID: api
            }).done(function (weather) {
                tmpBtn.empty();
                $('#boxForecast').empty();
                displayResult(weather, 0);
                showForecast(weather);
                localStorage.removeItem('city');
                localStorage.setItem('city', weather.city.name);
            })
        });
    } catch (error) {
        requestCity("Turin");
        localStorage.setItem('city', 'Turin');
    };
});


let addData = (chart, label, data) => {
    chart.data.labels = label;
    chart.data.datasets[0].data = data;
    chart.update();
};

let removeData = (chart) => {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
};

// write and search a city 

$("#submitForm").on('click', function (e) {
    let input = $('#inputForm');
    if (input.val() === "") {
        e.preventDefault();
        e.stopPropagation();
        $('.hide').css('display', 'none');
    } else {
        localStorage.setItem('city', input.val());
        e.preventDefault();
        requestCity(input.val());
        input.val('');
    };
});

$('.btn-type').on('click', function () {
    if (!$(this).hasClass('btn-click')) {
        $('.btn-type').removeClass('btn-click');
        $(this).addClass('btn-click');
    };
    let city = localStorage.getItem('city');
    requestCity(city);
});

// search city function 
let requestCity = async (c) => {
    let query;
    if ($('#btnCel').hasClass('btn-click')) {
        query = "&units=metric&appid=" + api;
    } else {
        query = "&units=imperial&appid=" + api;
    };
    try {
        const resp = await axios.get(uri + c + query);
        $('#boxForecast').empty();
        tmpBtn.empty();
        displayResult(resp.data, 0);
        showForecast(resp.data);
        console.log(resp.data);
        $('.hide').css('display', 'none');
    } catch (err) {
        console.log(err);
        if (err.response.status === 404) {
            $('.hide').css('display', 'block');
        }
    };
};

// I want to use this control function to return different day's images. 

let dayTime = (sys) => {
    if (sys.includes('d')) {
        return true;
    } else {
        return false;
    }
};

// date function 

let dateBuilder = (weekDay, date, m, year) => {
    let response;
    let month;
    let day;

    switch (weekDay) {
        case 'MON':
            day = screenWidth < 500 ? "Mon" : "Monday"; break;
        case 'TUE':
            day = screenWidth < 500 ? "Tue" : "Tuesday"; break;
        case 'WED':
            day = screenWidth < 500 ? "Wed" : "Wednesday"; break;
        case 'THU':
            day = screenWidth < 500 ? "Thu" : "Thursday"; break;
        case 'FRI':
            day = screenWidth < 500 ? "Fri" : "Friday"; break;
        case 'SAT':
            day = screenWidth < 500 ? "Sat" : "Saturday"; break;
        case 'SUN':
            day = screenWidth < 500 ? "Sun" : "Sunday"; break;
    };

    switch (m) {
        case '01': month = "January"; break;
        case '02': month = "February"; break;
        case '03': month = "March"; break;
        case '04': month = "April"; break;
        case '05': month = "May"; break;
        case '06': month = "June"; break;
        case '07': month = "July"; break;
        case '08': month = "August"; break;
        case '09': month = "September"; break;
        case '10': month = "October"; break;
        case '11': month = "November"; break;
        case '12': month = "December"; break;

    }
    response = day + ", " + date + " " + month + " " + year;
    textDate.text(response);
};

// function to get direction of wind 
let getDirection = angle => {
    var directions = ['N', 'NW', 'W', 'SW', 'S', 'SE', 'E', 'NE'];
    return directions[Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8];
};

let getFiveWeatherIcon = (idTemp) => {
    if (idTemp >= 200 && idTemp <= 232) {
        return './src/image/thunderstorm.svg';
    } else if (idTemp >= 300 && idTemp <= 321) {
        return './src/image/drizzle.svg';
    } else if (idTemp >= 500 && idTemp <= 531) {
        return './src/image/rain.svg';
    } else if (idTemp >= 600 && idTemp <= 622) {
        return './src/image/snow.svg';
    } else if (idTemp >= 701 && idTemp <= 781) {
        return './src/image/atmosphere.svg';
    } else if (idTemp === 800) {
        return './src/image/sun.svg';
    } else {
        return './src/image/cloudy.svg';
    }
};

let scrollMobile = (label) => {
    let hour = ['18:00', '15:00', '12:00', '09:00', '06:00', '03:00', '00:00'];
    if (screenWidth < 375) {
        if (label < 6) {
            $('.scroll-item').css('width', '300px');
        } else {
            $('.scroll-item').css('width', '500px');
        }
    }
    if (label.length == 1) {
        for (let i = 0; i < hour.length; i++) {
            label.unshift(hour[i]);
        };
    }
};

let dataTempControl = (dataTemp) => {
    if (dataTemp.length == 1) {
        let count = 0;
        while (count < 7) {
            dataTemp.unshift(Math.round(Math.random() * 2));
            count++;
        };
    };
};
