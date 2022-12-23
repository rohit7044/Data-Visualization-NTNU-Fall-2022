import { updateWeather } from "./beeWeather.js";
import { drawGermany } from "./beeMap.js";
import { rtforecast } from "./weatherForecast.js";
import { activateTooltip } from './beeTooltip.js';

// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const FWidth = 450, FHeight = 400;
const FLeftTopX = 10, FLeftTopY = 10;
const MARGIN = { LEFT: 50, RIGHT: 10, TOP: 10, BOTTOM: 20 };
const WIDTH = FWidth - (MARGIN.LEFT + MARGIN.RIGHT);
const HEIGHT = FHeight - (MARGIN.TOP + MARGIN.BOTTOM);

// Generate all svgs and groups for each plot
// append the svg object to the body of the page
const svg = d3.select("#bee-temp")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        `translate(${margin.left}, ${margin.top})`);

const svg1 = d3.select("#bee-weight")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        `translate(${margin.left}, ${margin.top})`);

const svg2 = d3.select("#bee-humi")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        `translate(${margin.left}, ${margin.top})`);

const h6 = d3.select("#timerange")

const svg4 = d3.select("#bee-weather").append("svg")
    .attr("width", FWidth)
    .attr("height", FHeight - 100)
const g4 = svg4.append("g")
    .attr("transform", `translate(${FLeftTopX + MARGIN.LEFT}, ${FLeftTopY + MARGIN.TOP})`)

const svg5 = d3.select("#weather-forecast").append("svg")
    .attr("width", FWidth)
    .attr("height", FHeight - 150)
const g5 = svg5.append("g")
    .attr("transform", `translate(${FLeftTopX + MARGIN.LEFT}, ${FLeftTopY + MARGIN.TOP})`)

// Story
d3.select("#story").html("Maintaining beehives can be a time consuming and tedious process. This tool saves time during the beekeeping process by utilizing data visualization on the Bee Happy Dashboard to inform actions and enhance convenience while performing beekeeping tasks.<br><br>Traditionally, beekeepers will monitor the health of their beehive using the following method: <br>1. Wear protection and prepare equipment. <br>2. Monitor activity levels of bees and observe the number of bees travelling in and out of the hive. <br>3. Open beehive. <br>4. Look at the bees, look at the brood of bees, looking for food, locate the queen. <br>i. It is common to lift the bee hive to obtain a general feeling of its weight.  <br>5. Based on this subjective finding, the beekeeper decides to do proactive measurements such as feeding, harvesting, parasite treatment, etc. <br><br>The Bee Happy Dashboard simplifies the beekeeping process by visualising sensor data from beehives. Sensor data includes temperature, humidity and weight of the hive. This information informs beekeepers of the activity occurring within a hive and can assist them in deciding what actions to take to ensure the wellbeing of their hive. Local weather and air pollution data is also visualised to allow the beekeeper to watch for correlation between these factors and their hive status. <br><br>The dashboard provides data-driven support for decision making such as finding the optimal timepoint of harvesting, feeding, parasite treatment, etc. for beekeeping. This is helpful as there is a lack of information on these topics during the traditional beekeeping process.  <br>");

var timerange1 = new Date("2022-12-12T00:00:00")
var timerange2 = new Date("2022-01-12T00:00:00")
//Read the data
d3.csv("/data/beedata.csv", d3.autoType)
    .then(function (data) {
        data.forEach(e => {
            // timeparsing          
            // console.log(e)
            const [dateValues, timeValues] = e.created_at.split(' ');
            const [day, month, year] = dateValues.split('.');
            // const [year, month, day] = dateValues.split('-');
            const [hours, minutes, seconds] = timeValues.split(':');
            const date = new Date(+year, month - 1, +day, +hours, +minutes, +seconds);
            e.created_at = date
        });


        // ---------------------------CHART 2----------------------------------

        /// X-AXIS
        // X label
        svg.append('g').append("text")
            .attr("x", width / 2)
            .attr("y", height + 25)
            .attr("font-size", "10px")
            .attr("text-anchor", "middle")
            .text("timestamp")
        /// Add X axis --> it is a date format
        const x = d3.scaleTime()
            .domain(d3.extent(data, function (d) { return d.created_at; }))
            .range([0, width]);
        var xAxis = svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));
        // Y-AXIS
        svg.append("g").append("text")
            .attr("x", -(height / 2))
            .attr("y", -40)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Temperature [°C]")
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return +d.field3; })])
            .range([height, 0]);
        var yAxis = svg.append("g")
            .call(d3.axisLeft(y));


        // Add a clipPath: everything out of this area won't be drawn.
        const clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0);

        // Add brushing
        const brush = d3.brushX()                   // Add the brush feature using the d3.brush function
            .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("end", updateChart)             // Each time the brush selection changes, trigger the 'updateChart' function

        // Create the line variable: where both the line and the brush take place
        const line = svg.append('g')
            .attr("clip-path", "url(#clip)")
        // Add the brushing
        line
            .append("g")
            .attr("class", "brush")
            .call(brush);
        // Add the line
        line.append("path")
            .datum(data)
            .attr("class", "line")  // I add the class line to be able to modify this line later on.
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 2.0)
            .attr("d", d3.line()
                .x(function (d) { return x(d.created_at) })
                .y(function (d) { return y(d.field3) })
            )
        // If user double click, reinitialize the chart
        svg.on("dblclick", function () { reinitialize() });
        // Add the Tooltip
        activateTooltip(data,svg,"field3",x)


        // ---------------------------CHART 1----------------------------------
        /// X-AXIS
        // X label
        svg1.append('g').append("text")
            .attr("x", width / 2)
            .attr("y", height + 25)
            .attr("font-size", "10px")
            .attr("text-anchor", "middle")
            .text("timestamp")
        /// Add X axis --> it is a date format
        var xAxis1 = svg1.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));
        // Y-AXIS
        svg1.append("g").append("text")
            .attr("x", -(height / 2))
            .attr("y", -40)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Total Weight [kg]")
        const y1 = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return +d.field1; })])
            .range([height, 0]);
        var yAxis1 = svg1.append("g")
            .call(d3.axisLeft(y1));


        // Add a clipPath: everything out of this area won't be drawn.
        const clip1 = svg1.append("defs").append("svg:clipPath")
            .attr("id", "clip1")
            .append("svg:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0);

        // Add brushing
        const brush1 = d3.brushX()                   // Add the brush feature using the d3.brush function
            .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

        // Create the line variable: where both the line and the brush take place
        const line1 = svg1.append('g')
            .attr("clip-path", "url(#clip1)")
        // Add the brushing
        line1
            .append("g")
            .attr("class", "brush1")
            .call(brush1);

        // Add the line
        line1.append("path")
            .datum(data)
            .attr("class", "line1")  // I add the class line to be able to modify this line later on.
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2.0)
            .attr("d", d3.line()
                .x(function (d) { return x(d.created_at) })
                .y(function (d) { return y1(d.field1) })
            )        

        // If user double click, reinitialize the chart
        svg1.on("dblclick", function () { reinitialize() });
        activateTooltip(data,svg1,"field1",x)

        // ---------------------------CHART 3----------------------------------
        /// X-AXIS
        // X label
        svg2.append('g').append("text")
            .attr("x", width / 2)
            .attr("y", height + 25)
            .attr("font-size", "10px")
            .attr("text-anchor", "middle")
            .text("timestamp")
        var xAxis2 = svg2.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));
        // Y-AXIS
        svg2.append("g").append("text")
            .attr("x", -(height / 2))
            .attr("y", -40)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Humidity [%]")
        const y2 = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return +d.field2; })])
            .range([height, 0]);
        var yAxis2 = svg2.append("g")
            .call(d3.axisLeft(y2));


        // Add a clipPath: everything out of this area won't be drawn.
        const clip2 = svg2.append("defs").append("svg:clipPath")
            .attr("id", "clip2")
            .append("svg:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0);

        // Add brushing
        const brush2 = d3.brushX()                   // Add the brush feature using the d3.brush function
            .extent([[0, 0], [width, height]])  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("end", updateChart)             // Each time the brush selection changes, trigger the 'updateChart' function

        // Create the line variable: where both the line and the brush take place
        const line2 = svg2.append('g')
            .attr("clip-path", "url(#clip2)")
        // Add the brushing
        line2
            .append("g")
            .attr("class", "brush2")
            .call(brush2);

        // Add the line
        line2.append("path")
            .datum(data)
            .attr("class", "line2")  // I add the class line to be able to modify this line later on.
            .attr("fill", "none")
            .attr("stroke", "Blue")
            .attr("stroke-width", 2.0)
            .attr("d", d3.line()
                .x(function (d) { return x(d.created_at) })
                .y(function (d) { return y2(d.field2) })
            )

        

        // If user double click, reinitialize the chart
        svg2.on("dblclick", function () { reinitialize() });
        activateTooltip(data,svg2,"field2",x)

        // -------------------------Global helper functions------------------------------
        // A function that set idleTimeOut to null
        let idleTimeout
        function idled() { idleTimeout = null; }
        // A function that update the chart for given boundaries
        function updateChart(event, d) {

            // What are the selected boundaries?
            var extent = event.selection

            // If no selection, back to initial coordinate. Otherwise, update X axis domain
            if (!extent) {
                if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
                x.domain([4, 8])
            } else {
                //Update selected Range on Chart
                timerange1 = x.invert(extent[0])
                timerange2 = x.invert(extent[1])
                h6.selectAll('text').remove()
                h6.append('text')
                    .text("Selected range: " + timerange1 + " - " + timerange2)
                //Filter day based on selection
                var dataFiltered = data.filter(function (d, i) {
                    return ((d.created_at >= timerange1) && (d.created_at <= timerange2))
                })

                updateWeather(timerange1, timerange2, g4)//Update Weather
                y.domain([d3.min(dataFiltered, function (d) { return +d.field3; }), d3.max(dataFiltered, function (d) { return +d.field3; })])
                y1.domain([d3.min(dataFiltered, function (d) { return +d.field1; }), d3.max(dataFiltered, function (d) { return +d.field1; })])
                y2.domain([d3.min(dataFiltered, function (d) { return +d.field2; }), d3.max(dataFiltered, function (d) { return +d.field2; })])
                x.domain([x.invert(extent[0]), x.invert(extent[1])])//update x axis
                line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
                // line1.select(".brush1").call(brush1.move, null)
                // line2.select(".brush2").call(brush2.move, null)
            }

            // Update axis and line position
            xAxis.transition().duration(1000).call(d3.axisBottom(x))
            yAxis.transition().duration(1000).call(d3.axisLeft(y))
            line
                .select('.line')
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.created_at) })
                    .y(function (d) { return y(d.field3) })
                )
            // Update axis and line 1 position
            xAxis1.transition().duration(1000).call(d3.axisBottom(x))
            yAxis1.transition().duration(1000).call(d3.axisLeft(y1))
            line1
                .select('.line1')
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.created_at) })
                    .y(function (d) { return y1(d.field1) })
                )
            // Update axis and line 1 position
            xAxis2.transition().duration(1000).call(d3.axisBottom(x))
            yAxis2.transition().duration(1000).call(d3.axisLeft(y2))
            line2
                .select('.line2')
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.created_at) })
                    .y(function (d) { return y2(d.field2) })
                )



        }


        function reinitialize() {
            y.domain([0, d3.max(data, function (d) { return +d.field3; })])
            y1.domain([0, d3.max(data, function (d) { return +d.field1; })])
            y2.domain([0, d3.max(data, function (d) { return +d.field2; })])
            x.domain(d3.extent(data, function (d) { return d.created_at; }))
            xAxis.transition().call(d3.axisBottom(x))
            yAxis.transition().call(d3.axisLeft(y))
            line
                .select('.line')
                .transition()
                .attr("d", d3.line()
                    .x(function (d) { return x(d.created_at) })
                    .y(function (d) { return y(d.field3) })
                )
            xAxis1.transition().call(d3.axisBottom(x))
            yAxis1.transition().call(d3.axisLeft(y1))
            line1
                .select('.line1')
                .transition()
                .attr("d", d3.line()
                    .x(function (d) { return x(d.created_at) })
                    .y(function (d) { return y1(d.field1) })
                )
            xAxis2.transition().call(d3.axisBottom(x))
            yAxis2.transition().call(d3.axisLeft(y2))
            line2
                .select('.line2')
                .transition()
                .attr("d", d3.line()
                    .x(function (d) { return x(d.created_at) })
                    .y(function (d) { return y2(d.field2) })
                )
        }



    })

// Bee Average Weather Data
g4.append('rect')
    .attr('x', -20)
    .attr('y', 0)
    .attr('width', 350)
    .attr('height', 250)
    .style("fill", "white")
    .style("stroke", "black")
    .attr("stroke-width", "2px");
// input the brushed data date here
var start_Date = timerange1
var end_Date = timerange1
g4.append('text').attr('x', 60).attr('y', 20)
        .text("Average Weather Data Approx.") 



// This link will work for only 500 requests per day. Use Wisely
d3.json("http://api.worldweatheronline.com/premium/v1/weather.ashx?key=1b75e691dafd477598412430221112&q=hamburg&format=json&fx24=yes").then(json=>{
// Use this for local use
// d3.json("/data/weatherForecast.json").then(json => {
    // Pre-Process the JSON file and pass the data individually
    const { temperature, humidity, windspeed, uvIndex, precipitation } = rtforecast(json);
    // Weather Forecast
    g5.append('rect')
        .attr('x', -20)
        .attr('y', 0)
        .attr('width', 350)
        .attr('height', 200)
        .style("fill", "white")
        .style("stroke", "black")
        .attr("stroke-width", "2px");
    g5.append('text').attr('x', 90).attr('y', 20)
        .text("Today's Forecast Approx.")
    g5.append('text').attr('x', 10).attr('y', 45)
        .text("Temperature: " + temperature + " \u00B0 C")
    g5.append('text').attr('x', 10).attr('y', 75)
        .text("Humidity: " + humidity)
    g5.append('text').attr('x', 10).attr('y', 105)
        .text("Windspeed: " + windspeed + " m/s")
    g5.append('text').attr('x', 10).attr('y', 135)
        .text("uvIndex: " + uvIndex)
    g5.append('text').attr('x', 10).attr('y', 165)
        .text("Precipitation: " + precipitation + " mm")
})
//Map Data
d3.json("/data/federal_states.json").then(drawGermany);
