const FWith = 450, FHeight = 400;
const FLeftTopX = 10, FLeftTopY = 10;
const MARGIN = { LEFT: 50, RIGHT: 10, TOP: 10, BOTTOM: 20 };
const WIDTH = FWith - (MARGIN.LEFT + MARGIN.RIGHT);
const HEIGHT = FHeight - (MARGIN.TOP + MARGIN.BOTTOM);

const svg = d3.select("#bee-map").append("svg")
    .attr("width", FWith + 300)
    .attr("height", FHeight + 300)

const g = svg.append("g")
    .attr("transform", `translate(${FLeftTopX + MARGIN.LEFT}, ${FLeftTopY + MARGIN.TOP})`)

export function drawGermany(germany) {
    var width = 600;
    var height = 600;

    //Drawing out the map
    var projection = d3.geoMercator()
    .fitExtent([[0,0], [width, height]], germany);
   
    var geoGenerator = d3.geoPath()
    .projection(projection);
    g.append('g')
    .selectAll('path')
    .data(germany.features)
    .enter()
    .append('path')
    .attr('stroke', "black")
    .attr('fill', 'white')
    .attr('d', geoGenerator);
    var coordinates = projection([10.391839, 53.564388])
    var circle  = g.selectAll('g')
    .append('circle').attr("cx",coordinates[0]).attr("cy",coordinates[1]).attr("r",5).style('fill', 'red')
}


  //53.564388, 10.391839
  