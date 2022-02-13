async function setRenderBackground() {
    //https://picsum.photos/200/300
    const result = await axios.get("https://picsum.photos/1920/1080", {
        responseType: "blob" //텍스트와 이진데이터로 표현
    })
    const data = URL.createObjectURL(result.data)
    document.querySelector("body").style.backgroundImage = `url(${data})` //style.css말고 여기서 동적으로 실행
}

function setTime() {
    const timer = document.querySelector(".timer");
    const timerContent = document.querySelector(".timer-content");
    setInterval(() => {
        const date = new Date();
        if (date.getHours() >= 0 && date.getHours() <= 11) {
            timerContent.textContent = "Good morning, Haewon";
        } else {
            timerContent.textContent = "Good evening, Haewon";
        }
        const hour = "0" + date.getHours();
        const minute = "0" + date.getMinutes();
        const second = "0" + date.getSeconds();
        timer.textContent = `${hour.slice(-2)}:${minute.slice(-2)}:${second.slice(-2)}`;
        //const times = new Date().toLocaleTimeString().split(" ")[1];
        //timer.textContent = `${times}`;
    }, 1000)
}

function getMemo() {
    const memo = document.querySelector(".memo");
    const memoValue = localStorage.getItem("todo");
    memo.textContent = memoValue;
}

function setMemo() {
    const memoInput = document.querySelector(".memo-input");
    memoInput.addEventListener("keyup", function (e) {
        console.log(e.currentTarget.value);
        if (e.code === "Enter" && e.currentTarget.value) {
            localStorage.setItem("todo", e.currentTarget.value);
            getMemo();
            memoInput.value = "";
        }
    })
}

function deleteMemo() {
    document.querySelector(".memo").addEventListener("click",
        function (e) {
            if (e.target.classList.contains("memo")) {
                localStorage.removeItem("todo");
                e.target.textContent = "";
            }
        })
}

function getPosition(options) {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options)
    })
}

async function getWeather(latitude, longitude) {
    if (latitude && longitude) {
        const data = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=3fec28603b8296a26050a333ad7ae078`);
        return data;
    }
    const data = await axios.get("http://api.openweathermap.org/data/2.5/forecast?q=Seoul&appid=3fec28603b8296a26050a333ad7ae078")
    return data;
}

async function renderWeather() {
    let latitude = "";
    let longitude = "";

    try {
        const position = await getPosition();
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    } catch {

    }
    const result = await getWeather(latitude, longitude);
    const weatherData = result.data;
    //console.log(weatherData); //배열이 너무 많아 복잡 -> 오전 오후만 남기자
    const weatherList = weatherData.list.reduce((acc, cur) => {
        if (cur.dt_txt.indexOf("18:00:00") > 0) {
            acc.push(cur);
        }
        return acc;
    }, [])
    const modalBody = document.querySelector(".modal-body");
    modalBody.innerHTML = weatherList.map((e) => {
        return weatherWrapperComponent(e);
    })

    const modalbutton = document.querySelector(".modal-button");
    modalbutton.style.backgroundImage = `url(${matchIcon(weatherList[0].weather[0].main)})`;


}

function weatherWrapperComponent(e) {
    //  console.log(e.dt_txt.split(" ")[0]);
    const changeToCelsius = (temp) => (temp - 273.15).toFixed(1)
    console.log(e.weather[0].main);
    return `
    <div div class="card" style = "width: 18rem;">
        <div class="card-header>
            ${e.dt_txt.split(" ")[0]}
        </div>
        <div class="card-body" style="color:black">
            <h5>${e.weather[0].main}</h5>
            <img src="${matchIcon(e.weather[0].main)}" class="card-img-top" alt="날씨 이미지">
            <p class="card-text">${changeToCelsius(e.main.temp)}</p>
        </div>
    </div>
    `
}

function matchIcon(weatherData) {
    if (weatherData === "Clear") return "/images/039-sun.png"
    if (weatherData === "Clouds") return "/images/001-cloud.png"
    if (weatherData === "Rain") return "/images/003-rainy.png"
    if (weatherData === "Snow") return "/images/006-snowy.png"
    if (weatherData === "Thousandstorm") return "/images/009-storm-1.png"
    if (weatherData === "Drizzle") return "/images/034-cloudy-1.png"
    if (weatherData === "Atmosphere") return "/images/033-huricane.png"
}

renderWeather();
deleteMemo();
getMemo();
setTime();
setRenderBackground();
setInterval(() => {
    setRenderBackground();
}, 5000)
setMemo();