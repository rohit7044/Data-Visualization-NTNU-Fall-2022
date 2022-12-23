
export function updateWeather(start_Date, end_Date, g) {
    // reading the temperature dataset
    d3.dsv(";", "/data/produkt_zehn_min_tu_20210614_20221215_01975.txt", d3.autoType)
        .then(tempData => {
            const dateTimeParse = d3.timeParse("%Y%m%d%H%M");
            tempData.forEach(e => {
                e.MESS_DATUM = dateTimeParse(e.MESS_DATUM)
            });
            const filtered_temp_data = tempData.filter(function (d) { return (d.MESS_DATUM >= start_Date && d.MESS_DATUM <= end_Date) })
            // Temp Data
            const temp_value_data = filtered_temp_data.map(function (d) { return d.TT_10 });
            var temp_max_val = Math.round(d3.max(temp_value_data))
            var temp_min_val = Math.round(d3.min(temp_value_data))
            var avg_temp_value = Math.round(d3.mean(temp_value_data))
            console.log(temp_min_val)
            // Humidity Data
            const humid_value_data = filtered_temp_data.map(function (d) { return d.RF_10 });
            var avg_humid_value = Math.round(d3.mean(humid_value_data))           
            g.selectAll('text').remove()
            g.append('text').transition()
                .duration(1000).attr('x', 10).attr('y', 45)
                .text("Temperature: " + avg_temp_value + " \u00B0 C")
            g.append('text').transition()
                .duration(1000).attr('x', 10).attr('y', 75)
                .text("Max Temperature: " + temp_max_val + " \u00B0 C")
            g.append('text').transition()
                .duration(1000).attr('x', 10).attr('y', 105)
                .text("Min Temperature: " + temp_min_val + " \u00B0 C")
            g.append('text').transition()
                .duration(1000).attr('x', 10).attr('y', 135)
                .text("Humidity: " + avg_humid_value)
            g.append('text').attr('x', 70).attr('y', 20)
                .text("Average Weather Data Approx.")
        })


    // reading the wind dataset
    d3.dsv(";", "/data/produkt_zehn_min_ff_20210614_20221215_01975.txt", d3.autoType)
        .then(windData => {
            const dateTimeParse = d3.timeParse("%Y%m%d%H%M");
            windData.forEach(e => {
                e.MESS_DATUM = dateTimeParse(e.MESS_DATUM)
            });
            const filtered_wind_data = windData.filter(function (d) { return (d.MESS_DATUM >= start_Date && d.MESS_DATUM <= end_Date) })
            const wind_value_data = filtered_wind_data.map(function (d) { return d.FF_10 });
            var avg_wind_value = Math.round(d3.mean(wind_value_data))
            g.append('text').transition()
                .duration(1000).attr('x', 10).attr('y', 165)
                .text("Windspeed: " + avg_wind_value + " m/s")
        })

    // reading the solar dataset
    d3.dsv(";", "/data/produkt_zehn_min_sd_20210614_20221215_01975.txt", d3.autoType)
        .then(solarData => {
            const dateTimeParse = d3.timeParse("%Y%m%d%H%M");
            solarData.forEach(e => {
                e.MESS_DATUM = dateTimeParse(e.MESS_DATUM)
            });
            const filtered_solar_data = solarData.filter(function (d) { return (d.MESS_DATUM >= start_Date && d.MESS_DATUM <= end_Date) })
            const solar_value_data = filtered_solar_data.map(function (d) { return d.GS_10 });
            var avg_solar_value = Math.round(d3.mean(solar_value_data))
            g.append('text').transition()
                .duration(1000).attr('x', 10).attr('y', 195)
                .text("uvIndex: " + avg_solar_value)
        })

    // reading the precipitation dataset
    d3.dsv(";", "/data/produkt_zehn_min_rr_20210614_20221215_01975.txt", d3.autoType)
        .then(precipitationData => {
            const dateTimeParse = d3.timeParse("%Y%m%d%H%M");
            precipitationData.forEach(e => {
                e.MESS_DATUM = dateTimeParse(e.MESS_DATUM)
            });
            const filtered_precipitation_data = precipitationData.filter(function (d) { return (d.MESS_DATUM >= start_Date && d.MESS_DATUM <= end_Date) })
            const precipitation_value_data = filtered_precipitation_data.map(function (d) { return d.RWS_10 });
            var avg_precipitation_value = Math.round(d3.mean(precipitation_value_data))
            g.append('text').transition()
                .duration(1000).attr('x', 10).attr('y', 225)
                .text("Precipitation " + avg_precipitation_value + " mm")
        })

}