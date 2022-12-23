const FWidth = 450, FHeight = 400;
const FLeftTopX = 10, FLeftTopY = 10;
const MARGIN = { LEFT: 50, RIGHT: 10, TOP: 10, BOTTOM: 20 };
const WIDTH = FWidth - (MARGIN.LEFT + MARGIN.RIGHT);
const HEIGHT = FHeight - (MARGIN.TOP + MARGIN.BOTTOM);

export function drawChartBee(data, g1, field, title) {
    
    try {
        
        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, function (d) { return d.created_at; }))
            .range([0, WIDTH]);
        // X label
        g1.append("text")
            .attr("x", WIDTH / 2)
            .attr("y", HEIGHT + 10)
            .attr("font-size", "10px")
            .attr("text-anchor", "middle")
            .text("time")
        g1.append("g")
            .attr("transform", "translate(0," + HEIGHT + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("y", "10")
            .attr("x", "-5")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-40)");

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return d[field]; })])
            .range([HEIGHT, 0]);

        // Y label
        g1.append("text")
            .attr("x", -(HEIGHT / 2))
            .attr("y", -40)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text(title)
        g1.append("g")
            .call(d3.axisLeft(y));
        // console.log(data)


        // Add the line
        g1.append('g').append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function (d) { return x(d.created_at) })
                .y(function (d) { return y(d[field]) })
            // .on("mouseover", mouseover)
            // .on("mousemove",mousemove)
            // .on("mouseleave",mouseleave)
            )

    }
    catch (error) {
        console.error(error)
    }

}

