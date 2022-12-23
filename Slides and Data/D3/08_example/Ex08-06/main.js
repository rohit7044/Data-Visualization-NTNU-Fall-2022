var svg = d3.select("svg");
var margin = {top: 20, right: 20, bottom: 30, left: 50};
var width = +svg.attr("width") - margin.left - margin.right-300;
var height = +svg.attr("height") - margin.top - margin.bottom-300;

var g = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var random = d3.randomNormal();
var points = d3.range(1000).map(function() {
    return {
      x: random(), 
      y: random()
    };
  });

var xScale = d3.scaleLinear()
  .domain(
    d3.extent(points, function(d) { 
      return d.x; 
    })
    )
    .rangeRound([0, width]);

var yScale = d3.scaleLinear()
  .domain(
    d3.extent(points, function(d) { 
      return d.y; 
    })
    )
    .rangeRound([height, 0]);

var xScaleOri = xScale.copy();
var yScaleOri = yScale.copy();

var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

var circleG = g.append('g');
var circles = circleG.selectAll('circle')
    .data(points).enter()
    .append('circle')
    .attr('fill', 'steelblue')
    .attr('r', 5)
    .attr('cx', function(d) {
      return xScale(d.x);
    })
    .attr('cy', function(d) {
      return yScale(d.y);
    });

var axisG = g.append('g');
var axisXG = axisG.append("g")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

var axisYG = axisG.append("g")
              .call(yAxis);

var zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

svg.call(zoom);

function zoomed() {
  var t = d3.event.transform;

  circleG.attr("transform", t);
  xScale = t.rescaleX(xScaleOri);
  yScale = t.rescaleY(yScaleOri);
  axisXG.call(xAxis.scale(xScale))
  axisYG.call(yAxis.scale(yScale))

  circles
    .attr('display', function(d) {
      if(xScale(d.x) < 0 || xScale(d.x) > width || 
        yScale(d.y) < 0 || yScale(d.y) > height) {
        return 'none';
      }
      return '';
    });
}
