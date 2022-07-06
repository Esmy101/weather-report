let searchEL = $("#search-form")

function weatherSearch(search){
    fetch(`https://nominatim.openstreetmap.org/search.php?q=${search}&format=jsonv2`)
    .then(localtion_data_raw =>{return localtion_data_raw.json()})
    .then(location_data => {
        let lat = location_data[0].lat
        let lon = location_data[0].lon
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=bd2cab77252032bed05617b6bcfbd99c&units=imperial`)
        .then(weather_data_raw => {return weather_data_raw.json()})
        .then(weather_data=>{
            console.log(weather_data)
            let weatherEL = $("#weather")
            $("#weather").css({'visibility':'visible'})
            let today = moment()
            let today_weather = $(weatherEL).find("#today")

            //result for today
            $(today_weather).find("#place").find("p").html(`${search} (${today.format("M/D/Y")})`)
            $(today_weather).find("#temp").find("p").html(`Temp: ${weather_data.current.temp}°F`)
            $(today_weather).find('.img').attr(`src`,`http://openweathermap.org/img/wn/${weather_data.current.weather[0].icon}.png`)
            $(today_weather).find("#wind").find("p").html(`Wind: ${weather_data.current.wind_speed} MPH`)
            $(today_weather).find("#humidity").find("p").html(`Wind: ${weather_data.current.humidity}%`)
            let indexEL = $(today_weather).find("#uv").find(".index") 
            $(indexEL).html(`${weather_data.current.uvi}`)
            if (weather_data.current.uvi >= 6){
                $(indexEL).addClass('bg-danger')
            }
            else if (weather_data.current.uvi>=2 ){
                $(indexEL).addClass('bg-warning')
            }
            else{
                $(indexEL).addClass('bg-success')
            }

            //results for 5 day forcase
            let results = $(weatherEL).find("#5-day").find(".container");
            console.log(results)

            $(results).each((row, i) => {
                console.log(row,i);
                console.log(weather_data.daily[row+1])

                let dailyData = weather_data.daily[row+1]

                //humidity, wind, temp, date, img
                $(i).find(".humidity").html(`Humidity: ${dailyData.humidity} %`)

                $(i).find(".wind").html(`Wind: ${dailyData.wind_speed} MPH`)

                $(i).find(".temp").html(`Temp: ${dailyData.temp.day} °F`)

                $(i).find('.img').attr(`src`,`http://openweathermap.org/img/wn/${dailyData.weather[0].icon}.png`)

                $(i).find(".date").html(moment().add(1 + row, 'days').format('MM/DD/YY'))
            })

        })
    })
}

function historyBtn(){ //history buttons
    let searchHistory = localStorage.history?localStorage.history.split(','):[];
    let result = $("#result-content")
    $(result).empty();
    searchHistory.forEach((search)=>{
        console.log(search)
        let child = $("<button>")
        $(child).html(search)
        $(child).addClass("btn-info mb-2 w-100")
        $(child).on("click", ()=>weatherSearch(search))
        $(result).append(child)
    })
}

function handle_search(e){//store searches
    if (e.preventDefault) e.preventDefault();
    let data = $("#search-input").val()
    weatherSearch(data)
    let searchHistory = localStorage.history?localStorage.history.split(','):[];
    searchHistory.unshift(data)
    localStorage.setItem("history", searchHistory);
    historyBtn()
}

historyBtn()
searchEL.on("submit", handle_search)