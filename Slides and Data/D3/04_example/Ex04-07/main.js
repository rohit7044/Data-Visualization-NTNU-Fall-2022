var data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var value2Color = d3.scaleThreshold()
                    .domain([6, 9])
                    .range(['lightblue', 'orange', 'lightgreen']);

d3.select("svg").selectAll("circle").data(data)
  .enter().append("circle")
  .attr("cx", (d, i)=>((d+1)*30))
  .attr("cy", 50)
  .attr("r", "10")
  .attr("fill", (d)=>value2Color(d));

  