function main(){
    // Dimension
    const FWidth = 500, FHeight = 500;
    const FLeftTopX = 50, FLeftTopY = 80;
    const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 }
    const WIDTH = FWidth - (MARGIN.LEFT + MARGIN.RIGHT)
    const HEIGHT = FHeight - (MARGIN.TOP + MARGIN.BOTTOM)
   // LoAd CSV
    d3.csv("NBA1516.csv",d3.autoType).then(function (data){    
      
      const svg = d3.select("#scatterchart").append("svg")
      .attr("width", FWidth).attr("height", FHeight)
      
      const g = svg.append("g")
      .attr("transform", `translate(${FLeftTopX + MARGIN.LEFT}, ${FLeftTopY + MARGIN.TOP})`)
      
           
      // X ticks
      const x = d3.scaleLinear()
      .domain([d3.min(data, d => d.umapX), d3.max(data, d => d.umapX)])
      .range([0, HEIGHT])
  
      //x axis
      const xAxisCall = d3.axisBottom(x)
      g.append("g")
      .attr("transform", `translate(0, ${HEIGHT})`)
      .call(xAxisCall)
      .selectAll("text").remove()
         
      
      // Y ticks
      const y = d3.scaleLinear()
      .domain([d3.min(data, d => d.umapY), d3.max(data, d => d.umapY)])
      .range([HEIGHT, 0])
      //y axis
      const yAxisCall = d3.axisLeft(y)
      g.append("g").call(yAxisCall).selectAll("text").remove()
      

      // circle
      // Color scale: give me a specie name, I return a color
      var color = d3.scaleOrdinal()
      .domain(["ptsNorm", "rebNorm", "astNorm" ])
      .range([ "#F8766D", "#00BA38", "#619CFF"])

      const radiussize = d3.scaleLinear()
      .domain([-1,0])
      .range([1,1.5])

      // Add dots
      var dots = g.selectAll("dot").data(data)
      dots.join("circle")
      .attr("cx", function (d) { return x(d.umapX); } )
      .attr("cy", function (d) { return y(d.umapY); } )
      .attr("r", function (d) {return radiussize((d.ptsNorm+ d.rebNorm+d.rebNorm)/3);})
      .style("fill",  function (d) { return color(getMaxValue(d) )})

      // Find the maximum number
      function getMaxValue(d) {
      if (d.ptsNorm >= d.rebNorm && d.ptsNorm >= d.astNorm) {
        return "ptsNorm";
      }
      else if (d.rebNorm >= d.rebNorm && d.rebNorm >= d.astNorm) {
        return "rebNorm";
      }
      else { return "astNorm" }
      }
      // Handmade legend
      svg.append("circle").attr("cx",170).attr("cy",80).attr("r", 6).style("fill", "#F8766D")
      svg.append("circle").attr("cx",250).attr("cy",80).attr("r", 6).style("fill", "#00BA38")
      svg.append("circle").attr("cx",330).attr("cy",80).attr("r", 6).style("fill", "#619CFF")
      svg.append("text").attr("x", 180).attr("y", 80).text("ptsNorm").style("font-size", "15px").attr("alignment-baseline","middle")
      svg.append("text").attr("x", 260).attr("y", 80).text("rebNorm").style("font-size", "15px").attr("alignment-baseline","middle")
      svg.append("text").attr("x", 340).attr("y", 80).text("astNorm").style("font-size", "15px").attr("alignment-baseline","middle")

    })



    // Map
    d3.json("us-states.json").then(drawUsa);
    function drawUsa(usa) {
        var width = 500;
        var height = 500;
        // Adds the svg canvas
        const svg2 = d3.select("#mapchart").append("svg")
            .attr("width", 800).attr("height", 550)
        
        const g2 = svg2.append("g")
            .attr("transform", `translate(${FLeftTopX + MARGIN.LEFT}, ${FLeftTopY + MARGIN.TOP})`)
        
        var projection = d3.geoMercator()
                .fitExtent([[0,0], [width, height]], usa);
        
        var geoGenerator = d3.geoPath()
                .projection(projection);
        
        var paths = g2.append('g')
                .selectAll('path')
                .data(usa.features)
                .enter()
                .append('path')
                .attr('stroke', "black")
                .attr('fill', 'white')
                .attr('d', geoGenerator);   
        d3.csv("TeamLoc.csv",d3.autoType).then(function (data){
           
          
            var circle = g2.selectAll('g')
                .data(data).enter().append('circle')
                .attr("cx",function(data){return projection([data.lon, data.lat ])[0];})
                .attr("cy",function(data){return projection([data.lon, data.lat ])[1];})
                .attr('fill', 'red')
                var temp = countplayers().then(function (count){
                  return circle.data(data).attr('r', function(data){return count.get(data.team_abbreviation)})
                  .attr('opacity', 0.5);
                })
                

                
            
            var texts = g2.selectAll('g')
                .selectAll('text')
                .data(data)
                .enter()
                .append('text')
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'middle')
                .attr('opacity', 0.5)
                .text(function(data){return data.team_abbreviation;})
                .attr('dx',function(data){return projection([data.lon, data.lat ])[0];})
                .attr('dy',function(data){return projection([data.lon, data.lat+1 ])[1];});
                

        });
        
        async function countplayers(){

         var nbcsv = await d3.csv("NBA1516.csv",d3.autoType).then(function (data){            
                var count = d3.rollup(data,d=> d.length,e=> e.team_abbreviation)
                return(count);
              });              
              return nbcsv;

        }
        
    
        
    }
    //Histogram
    
    
    d3.csv("NBA1516.csv",d3.autoType).then(function (data){
      // Chart 1 = age
        // append the svg object to the body of the page
        const svg3 = d3.select("#barchart1").append("svg")
        .attr("width", FWidth).attr("height", FHeight);
        const g3 = svg3.append("g")
        .attr("transform","translate(" + MARGIN.LEFT + "," + MARGIN.TOP + ")");
       
        // X axis: scale and draw:
        const x = d3.scaleLinear()
        .domain([d3.min(data, d => d.age), d3.max(data, d => d.age)])     
        .range([0, WIDTH]);
        g3.append("g")
        .attr("transform", "translate(0," + HEIGHT + ")")
        .call(d3.axisBottom(x));

        // set the parameters for the histogram
        const histogram = d3.histogram()
        .value(function(d) { return d.age; })   
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(20)); // then the numbers of bins

        // And apply this function to data to get the bins
        const bins = histogram(data);
        // Y axis: scale and draw:
        const y = d3.scaleLinear()
        .range([HEIGHT, 0]);
        y.domain([0,d3.max(bins,function(d){return d.length})]);   
        g3.append("g")
        .call(d3.axisLeft(y));

        // append the bar rectangles to the svg element
        g3.selectAll("rect")
        .data(bins)
        .enter().append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0)-1 ; })
        .attr("height", function(d) { return HEIGHT - y(d.length); })
        .style("fill", "#69b3a2")
        
        svg3.append("text").attr("x", 400).attr("y", 80).text("Age").style("font-size", "50px").attr("alignment-baseline","middle")
        
            
    })
    d3.csv("NBA1516.csv",d3.autoType).then(function (data){
      // Chart 3 = draft_number
        // append the svg object to the body of the page
        const svg3 = d3.select("#barchart1").append("svg")
        .attr("width", FWidth).attr("height", FHeight);
        const g3 = svg3.append("g")
        .attr("transform","translate(" + MARGIN.LEFT + "," + MARGIN.TOP + ")");
       // Fix the undrafted part
       data.forEach(function(d) {
        d.draft_number =d.draft_number;
        if(d.draft_number == "Undrafted"){
          d.draft_number =61;
        }
        });
        // X axis: scale and draw:
        const x = d3.scaleLinear()
        .domain([d3.min(data, d => d.draft_number), d3.max(data, d => d.draft_number)])     
        .range([0, WIDTH]);
        g3.append("g")
        .attr("transform", "translate(0," + HEIGHT + ")")
        .call(d3.axisBottom(x));

        // set the parameters for the histogram
        const histogram = d3.histogram()
        .value(function(d) { return d.draft_number; })   
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(30)); // then the numbers of bins

        // And apply this function to data to get the bins
        const bins = histogram(data);
        // Y axis: scale and draw:
        const y = d3.scaleLinear()
        .range([HEIGHT, 0]);
        y.domain([0,d3.max(bins,function(d){return d.length})]);   
        g3.append("g")
        .call(d3.axisLeft(y));

        // append the bar rectangles to the svg element
        g3.selectAll("rect")
        .data(bins)
        .enter().append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0)-1 ; })
        .attr("height", function(d) { return HEIGHT - y(d.length); })
        .style("fill", "#69b3a2")
        
        svg3.append("text").attr("x", 300).attr("y", 80).text("Draft Number").style("font-size", "30px").attr("alignment-baseline","middle")
        
            
    })
    d3.csv("NBA1516.csv",d3.autoType).then(function (data){
      // Chart 3 = gp
        // append the svg object to the body of the page
        const svg3 = d3.select("#barchart1").append("svg")
        .attr("width", FWidth).attr("height", FHeight);
        const g3 = svg3.append("g")
        .attr("transform","translate(" + MARGIN.LEFT + "," + MARGIN.TOP + ")");
       
        // X axis: scale and draw:
        const x = d3.scaleLinear()
        .domain([d3.min(data, d => d.gp), d3.max(data, d => d.gp)])     
        .range([0, WIDTH]);
        g3.append("g")
        .attr("transform", "translate(0," + HEIGHT + ")")
        .call(d3.axisBottom(x));

        // set the parameters for the histogram
        const histogram = d3.histogram()
        .value(function(d) { return d.gp; })   
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(50)); // then the numbers of bins

        // And apply this function to data to get the bins
        const bins = histogram(data);
        // Y axis: scale and draw:
        const y = d3.scaleLinear()
        .range([HEIGHT, 0]);
        y.domain([0,d3.max(bins,function(d){return d.length})]);   
        g3.append("g")
        .call(d3.axisLeft(y));

        // append the bar rectangles to the svg element
        g3.selectAll("rect")
        .data(bins)
        .enter().append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0)-1 ; })
        .attr("height", function(d) { return HEIGHT - y(d.length); })
        .style("fill", "#69b3a2")
        
        svg3.append("text").attr("x", 300).attr("y", 80).text("gp").style("font-size", "50px").attr("alignment-baseline","middle")
        
            
    })
    d3.csv("NBA1516.csv",d3.autoType).then(function (data){
      // Chart 4 = pts
        // append the svg object to the body of the page
        const svg3 = d3.select("#barchart1").append("svg")
        .attr("width", FWidth).attr("height", FHeight);
        const g3 = svg3.append("g")
        .attr("transform","translate(" + MARGIN.LEFT + "," + MARGIN.TOP + ")");
       
        // X axis: scale and draw:
        const x = d3.scaleLinear()
        .domain([d3.min(data, d => d.pts), d3.max(data, d => d.pts)])     
        .range([0, WIDTH]);
        g3.append("g")
        .attr("transform", "translate(0," + HEIGHT + ")")
        .call(d3.axisBottom(x));

        // set the parameters for the histogram
        const histogram = d3.histogram()
        .value(function(d) { return d.pts; })   
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(50)); // then the numbers of bins

        // And apply this function to data to get the bins
        const bins = histogram(data);
        // Y axis: scale and draw:
        const y = d3.scaleLinear()
        .range([HEIGHT, 0]);
        y.domain([0,d3.max(bins,function(d){return d.length})]);   
        g3.append("g")
        .call(d3.axisLeft(y));

        // append the bar rectangles to the svg element
        g3.selectAll("rect")
        .data(bins)
        .enter().append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0)-1 ; })
        .attr("height", function(d) { return HEIGHT - y(d.length); })
        .style("fill", "#69b3a2")
        
        svg3.append("text").attr("x", 400).attr("y", 80).text("pts").style("font-size", "50px").attr("alignment-baseline","middle")
        
            
    })
    d3.csv("NBA1516.csv",d3.autoType).then(function (data){
      // Chart 5 = reb
        // append the svg object to the body of the page
        const svg3 = d3.select("#barchart1").append("svg")
        .attr("width", FWidth).attr("height", FHeight);
        const g3 = svg3.append("g")
        .attr("transform","translate(" + MARGIN.LEFT + "," + MARGIN.TOP + ")");
       
        // X axis: scale and draw:
        const x = d3.scaleLinear()
        .domain([d3.min(data, d => d.reb), d3.max(data, d => d.reb)])     
        .range([0, WIDTH]);
        g3.append("g")
        .attr("transform", "translate(0," + HEIGHT + ")")
        .call(d3.axisBottom(x));

        // set the parameters for the histogram
        const histogram = d3.histogram()
        .value(function(d) { return d.reb; })   
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(50)); // then the numbers of bins

        // And apply this function to data to get the bins
        const bins = histogram(data);
        // Y axis: scale and draw:
        const y = d3.scaleLinear()
        .range([HEIGHT, 0]);
        y.domain([0,d3.max(bins,function(d){return d.length})]);   
        g3.append("g")
        .call(d3.axisLeft(y));

        // append the bar rectangles to the svg element
        g3.selectAll("rect")
        .data(bins)
        .enter().append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0)-1 ; })
        .attr("height", function(d) { return HEIGHT - y(d.length); })
        .style("fill", "#69b3a2")
        
        svg3.append("text").attr("x", 400).attr("y", 80).text("reb").style("font-size", "50px").attr("alignment-baseline","middle")
        
            
    })
    d3.csv("NBA1516.csv",d3.autoType).then(function (data){
      // Chart 6 = ast
        // append the svg object to the body of the page
        const svg3 = d3.select("#barchart1").append("svg")
        .attr("width", FWidth).attr("height", FHeight);
        const g3 = svg3.append("g")
        .attr("transform","translate(" + MARGIN.LEFT + "," + MARGIN.TOP + ")");
       
        // X axis: scale and draw:
        const x = d3.scaleLinear()
        .domain([d3.min(data, d => d.ast), d3.max(data, d => d.ast)])     
        .range([0, WIDTH]);
        g3.append("g")
        .attr("transform", "translate(0," + HEIGHT + ")")
        .call(d3.axisBottom(x));

        // set the parameters for the histogram
        const histogram = d3.histogram()
        .value(function(d) { return d.ast; })   
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(50)); // then the numbers of bins

        // And apply this function to data to get the bins
        const bins = histogram(data);
        // Y axis: scale and draw:
        const y = d3.scaleLinear()
        .range([HEIGHT, 0]);
        y.domain([0,d3.max(bins,function(d){return d.length})]);   
        g3.append("g")
        .call(d3.axisLeft(y));

        // append the bar rectangles to the svg element
        g3.selectAll("rect")
        .data(bins)
        .enter().append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0)-1 ; })
        .attr("height", function(d) { return HEIGHT - y(d.length); })
        .style("fill", "#69b3a2")
        
        svg3.append("text").attr("x", 400).attr("y", 80).text("ast").style("font-size", "50px").attr("alignment-baseline","middle")
        
            
    })

    

}

    