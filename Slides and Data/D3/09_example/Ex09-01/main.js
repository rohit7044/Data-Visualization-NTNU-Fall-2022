var width = 300, height = 300; 
var nodes = [{value: 5}, {value: 10}, {value: 2}, {value: 6}, {value: 7}, {value: 8}];
// var nodes = [{value: 5}, {value: 10, fx: 170, fy:170}, {value: 2}, {value: 6}, 
//              {value: 7}, {value: 8}];

var value2radius = d3.scaleLinear()
	.domain([0, d3.max(nodes, function(d) {
		return d.value;
	})])
	.range([0, 50]);

var circles = d3.select('svg')
	.selectAll('circle')
	.data(nodes)
	.enter()
	.append('circle')
	.attr('r', function(d) {
		return value2radius(d.value);
	});

var texts = d3.select('svg')
	.selectAll('text')
	.data(nodes)
	.enter()
	.append('text')
	.attr('fill', 'white')
	.text(function(d) {
		return d.value;
	});

var simulation = d3.forceSimulation(nodes)
	.force('charge', d3.forceManyBody().strength(10))
	.force('center', d3.forceCenter(width / 2, height / 2))
	.force('collision', d3.forceCollide().radius(function(d) {
    	      return value2radius(d.value);
  	}))
	.on('tick', ticked);

function ticked() {
	d3.selectAll('circle')
		.attr('cx', function(d) {
		  return d.x
		})
		.attr('cy', function(d) {
		  return d.y
		});

	d3.selectAll('text')
		.attr('dx', -4)
		.attr('dy', 4)
		.attr('x', function(d) {
		  return d.x
		})
		.attr('y', function(d) {
		  return d.y
		});
}
