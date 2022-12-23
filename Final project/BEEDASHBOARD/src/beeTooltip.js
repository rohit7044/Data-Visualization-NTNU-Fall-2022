// create a tooltip
export function activateTooltip(data,g,beedata,x){
    if (beedata == 'field1'){
        
        var weightTooltip = d3.select("#bee-weight")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("font-size", "16px")
        function mouseover(event,d){
            weightTooltip
            .style("opacity", 0.7);
            };
        function mousemove(event, d) {
            const i = d3.bisectCenter(d.map(x => x.created_at), x.invert(d3.pointer(event)[0]))
            weightTooltip .html("Date: " + d[i].created_at + "<br/>"
                    + "Weight: " + d[i].field1 +" Kg"+ "<br/>"
                    + "Temperature : " + d[i].field3 +" \u00B0 C"+ "<br/>"
                    + "Humidity: " + d[i].field2)
                .style("position", "absolute")
                .style("top", (event.pageY)+"px").style("left",(event.pageX)+"px")
        }
        function mouseleave(event,d){
            weightTooltip
            // .transition()
            .style("opacity", 0) 
        }
        g.selectAll("path")
        .on("mouseover", mouseover)
        .on("mousemove",mousemove)
        .on("mouseleave",mouseleave)
    }
    if (beedata == 'field2'){
        var humidityTooltip = d3.select("#bee-humi")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("font-size", "16px")
        function mouseover(event,d){
            humidityTooltip
            .style("opacity", 0.7);
            };
        function mousemove(event, d) {
            const i = d3.bisectCenter(d.map(x => x.created_at), x.invert(d3.pointer(event)[0]))
            humidityTooltip .html("Date: " + d[i].created_at + "<br/>"
                    + "Weight: " + d[i].field1 +" Kg"+ "<br/>"
                    + "Temperature : " + d[i].field3 +" \u00B0 C"+ "<br/>"
                    + "Humidity: " + d[i].field2)
                .style("position", "absolute")
                .style("top", (event.pageY)+"px").style("left",(event.pageX)+"px")
        }
        function mouseleave(event,d){
            humidityTooltip
            // .transition()
            .style("opacity", 0) 
        }
        g.selectAll("path")
        .on("mouseover", mouseover)
        .on("mousemove",mousemove)
        .on("mouseleave",mouseleave)
    }
    if (beedata == 'field3'){
        var temperatureTooltip = d3.select("#bee-temp")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("font-size", "16px")
        function mouseover(event,d){
            temperatureTooltip
            .style("opacity", 0.7);
            };
            function mousemove(event, d) {
                const i = d3.bisectCenter(d.map(x => x.created_at), x.invert(d3.pointer(event)[0]))
                temperatureTooltip .html("Date: " + d[i].created_at + "<br/>"
                        + "Weight: " + d[i].field1 +" Kg"+ "<br/>"
                        + "Temperature : " + d[i].field3 +" \u00B0 C"+ "<br/>"
                        + "Humidity: " + d[i].field2)
                    .style("position", "absolute")
                    .style("top", (event.pageY)+"px").style("left",(event.pageX)+"px")
            }
            function mouseleave(event,d){
                temperatureTooltip
                // .transition()
                .style("opacity", 0) 
            }
        g.selectAll("path")
        .on("mouseover", mouseover)
        .on("mousemove",mousemove)
        .on("mouseleave",mouseleave)
    }
}