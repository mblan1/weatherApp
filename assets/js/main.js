const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// input
const searchText = $('.search-text');

// render city
const countryName = $('.country-name');
const cityName = $('.city_name');

// render temp
const tempMax = $('.temp_max');
const tempMin = $('.temp_min');
const weatherTempTitle = $$('.weather-temp-title');
const cityTemp = $('.city_temp');

// render wind-speed
const windDirection = $('.wind-direction');

// desc
const statusDesc = $$('.status-desc');

// wind percent
const windValue = $('.wind_value');
const windPercent = $('.wind-percent');
const windBlockPercent = $('.wind_block-range-percent');

// position fixed
const weatherStatus = $('.weather-status');
const forcast = document.getElementById('forecast');
const content = document.getElementById('content');
const nav = document.getElementById('nav');

// media
const a = window.matchMedia('(max-width: 1023px)');
const x = window.matchMedia('(max-width: 900px)');
const y = window.matchMedia('(max-width: 610px)');

// toast
const toastMain = document.getElementById('toast');

// test
const weatherIcon = $('.weather-icon');

console.log(weatherIcon);

// toast info
const types = {
    success: {
        type: 'success',
        title: 'Success',
        desc: 'Load thanh cong',
        icon: 'check',
    },
    error: {
        type: 'error',
        title: 'error',
        desc: 'Tính năng đang cập nhật',
        icon: 'exclamation',
        findError: 'Không tìm thấy vùng cần tìm!',
    },
};

const app = {
    apiKey: '3951debfc7837f0ed4957d5c6361c419',

    render: function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                let lon = position.coords.longitude;
                let lat = position.coords.latitude;
                let apiCurrent = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
                fetch(apiCurrent)
                    .then((res) => {
                        return res.json();
                    })
                    .then((data) => this.weatherReport(data));
            });
        }
    },

    weatherReport: function (data) {
        const urlWeatherReport = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${this.apiKey}`;
        fetch(urlWeatherReport)
            .then((res) => {
                return res.json();
            })
            .then((forecastData) => {
                // log
                console.group('data');
                console.log('data: ');
                console.log(data);
                console.log('forecast: ');
                console.log(forecastData);
                console.groupEnd();

                // props
                const cityData = forecastData.city;
                const mainData = data.main;
                const statusData = data.weather[0];
                const windData = data.wind;

                // render city
                countryName.innerText = cityData.name;
                cityName.innerText = `${cityData.name}, ${cityData.country}`;

                // render temp
                const maxTempC = Math.floor(mainData.temp_max - 273);
                const minTempC = Math.floor(mainData.temp_min - 273);
                const tempDefault = Math.floor(mainData.temp - 273);
                const maxTempCText = `${maxTempC}<sup>o</sup>C`;
                const minTempCText = `${minTempC}<sup>o</sup>C`;
                const tempDefaultText = `${tempDefault}<sup>o</sup>C`;
                tempMax.innerHTML = `${maxTempCText}`;
                tempMin.innerHTML = `${minTempCText}`;
                cityTemp.innerHTML = `${tempDefaultText}`;

                // render status
                weatherTempTitle.forEach((item) => {
                    item.innerText = statusData.description;
                });

                // render wind-speed
                const windSpeed = Math.floor((windData.speed * 18) / 5);
                windDirection.innerText = `${windSpeed}km`;

                // render weather desc
                const pressure = mainData.pressure;
                const visibility = data.visibility;
                const humidity = mainData.humidity;

                statusDesc[0].innerText = `${pressure} hPa`;
                statusDesc[1].innerText = `${visibility / 1000} km`;
                statusDesc[2].innerText = `${humidity} %`;

                // render clouds percent
                const cloudPecent = data.clouds.all;
                windValue.innerText = `${cloudPecent}%`;
                windPercent.style.left = `calc(${cloudPecent}% - 18px)`;
                windBlockPercent.style.width = `${cloudPecent}%`;
            });
    },

    // handler
    handleInput: function () {
        searchText.addEventListener('keyup', (e) => {
            if (e.keyCode === 13) {
                const value = searchText.value;
                this.renderSearch(value);
                searchText.value = '';
            }
        });
    },

    renderSearch: function (input) {
        if (input) {
            const apiSearch = `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${this.apiKey}`;
            fetch(apiSearch)
                .then((res) => {
                    return res.json();
                })
                .then((searchData) => {
                    // error 404
                    if (searchData.cod == 404) {
                        this.handleToast(types.error);
                        return;
                    }
                    this.weatherReport(searchData);
                });
        }
    },

    handleScroll: function () {
        window.onscroll = () => {
            const windowTop = window.scrollY;
            const weatherStatusTop = weatherStatus.offsetTop;

            if (a.matches) {
                if (windowTop >= weatherStatusTop) {
                    forcast.classList.add('forecast-fixed');

                    nav.classList.add('nav-fixed');

                    content.classList.add('content-margin');
                } else {
                    forcast.classList.remove('forecast-fixed');

                    nav.classList.remove('nav-fixed');

                    content.classList.remove('content-margin');
                    content.style.paddingLeft = '0';
                }
            }

            if (x.matches) {
                if (forcast.classList.contains('forecast-fixed')) {
                    forcast.classList.remove('forecast-fixed');
                    content.classList.remove('content-margin');
                    content.style.paddingLeft = '105px';
                }
            } else {
                console.log(321);
            }

            if (y.matches) {
                if (nav.classList.contains('nav-fixed')) {
                    nav.classList.remove('nav-fixed');
                    content.style.paddingLeft = '0';
                } else {
                    console.log(321);
                }
            }
        };
    },

    handleToast: function (type) {
        if (toastMain) {
            const delayTime = 3;

            const toast = document.createElement('div');
            toast.classList.add('toast', `toast_${type.type}`);

            toast.style.animation = `toastSlideIn 1s ease, toastFadeOut 1s ${delayTime}s forwards`;

            toast.innerHTML = `
                <div class="toast_icon toast_icon-${type.type}">
                   <i class="fa-solid fa-${type.icon} toast_icon-img"></i>
                   <!-- <i class="fa-solid fa-exclamation"></i> -->
               </div>
               <div class="toast_contains">
                   <div class="toast_title">
                       ${type.title}
                   </div>
                   <div class="toast_desc">
                       ${type.findError}
                   </div>
               </div>
                <div class="toast_close">
                   <i class="fa-solid fa-xmark toast_close-img"></i>
                </div>`;

            toastMain.appendChild(toast);
            setTimeout(() => {
                toastMain.removeChild(toast);
            }, (delayTime + 1) * 1000);
        }
    },

    handleClick: function () {
        weatherIcon.addEventListener('click', () => {
            console.log(123);
            // this.handleToast();
        });
    },

    start: function () {
        this.render();
        this.handleInput();
        this.handleScroll();
        this.handleClick();
    },
};
app.start();
