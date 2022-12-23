export function rtforecast(forecastdata){
    var temperature = forecastdata.data.current_condition[0].temp_C
    var humidity = forecastdata.data.current_condition[0].humidity
    // Converting the windspeed from km/h to m/s
    var windspeed = Math.round((5/18) * forecastdata.data.current_condition[0].windspeedKmph)
    var uvIndex = forecastdata.data.current_condition[0].uvIndex
    var precipitation = forecastdata.data.current_condition[0].precipMM
    return {temperature,humidity,windspeed,uvIndex,precipitation}
}