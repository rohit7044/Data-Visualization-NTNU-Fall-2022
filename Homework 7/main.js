function main(){
    // Dimension
    const FWidth = 600, FHeight = 550;
    const FLeftTopX = 50, FLeftTopY = 80;
    const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 }
    const WIDTH = FWidth - (MARGIN.LEFT + MARGIN.RIGHT)
    const HEIGHT = FHeight - (MARGIN.TOP + MARGIN.BOTTOM)
    // ScatterPlot
   // LoAd CSV
    d3.csv("NBA1516.csv",d3.autoType).then(function (data){    
      
      const svg = d3.select("#scatterchart").append("svg").attr("position", "relative")
      .attr("width", FWidth).attr("height", FHeight)
      
      const ScatterPlotg = svg.append("g")
      .attr("transform", `translate(${FLeftTopX + MARGIN.LEFT}, ${FLeftTopY + MARGIN.TOP})`)

      // create a tooltip
      var Tooltip = d3.select("#scatterchart")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("font-size", "16px")

      function mouseover(event,d){
          Tooltip
          .transition()
          .duration(200)
          .style("opacity", 1);
      };
     function mousemove(event,d){ 
        Tooltip
          .html("name: " + d.player_name + "<br/>" 
                + "pts: " + d.pts + "<br/>"
                + "reb : " + d.reb + "<br/>"
                + "ast: " + d.ast )
          .style("position", "absolute")
          .style("top", (event.pageY)+"px").style("left",(event.pageX)+"px")
          
      };
      function mouseleave(event,d){
        Tooltip
        // .transition()
        .style("opacity", 0)
      }
      
        // Brushing      
      var brush = d3.brush()
      .extent([[0,0],[FWidth,FHeight]])
      .on("start",brushed)
      .on("brush",brushed)
      .on("end",brushend);

      function brushed({selection}) {
        const [[x0, y0],[x1, y1]] = selection;
        // If within the bounds of the brush, select it
        dots.classed("brushed", d =>
          x0 <= x(d.umapX) && 
          x(d.umapX) <= x1 && 
          y0 <= y(d.umapY) && 
          y(d.umapY) <= y1
        );
      }
      let brushedData = null;
      function brushend({selection}){
        if (selection == null){
          updatebarchart(data,1);
        }
        else{
          const [[x0, y0],[x1, y1]] = selection;
          brushedData = data.filter(d =>
            x0 <= x(d.umapX) && 
            x(d.umapX) <= x1 && 
            y0 <= y(d.umapY) && 
            y(d.umapY) <= y1);
            updatebarchart(brushedData,0);
        }
      }      
      ScatterPlotg.call(brush);
      
      
      function updatebarchart(brushedData,count){
        // Chart 1 = age
        // And apply this function to data to get the bins
        const brushed_age_bins = age_histogram(brushedData);
        // Y axis: scale and draw: Brushed
        const brushed_age_y = d3.scaleLinear()
        .range([HEIGHT, 0]);
        brushed_age_y.domain([0,d3.max(brushed_age_bins,function(d){return d.length})]);   
        // append the bar rectangles to the svg element
       g3.selectAll(".rect")
        .data(age_bins)
        .enter().append("rect")
        .attr('class', 'rect')
        .attr("transform", function(d) { return "translate(" + age_x(d.x0) + "," + age_y(d.length) + ")"; })
        .attr("width", function(d) { return age_x(d.x1) - age_x(d.x0)-1 ; })
        .transition()
        .duration(1000)
        .attr("height", function(d) { return HEIGHT - age_y(d.length); })
        .style("fill", 'white')
        .style("stroke", "black")// append the bar rectangles to the svg element
      g3.selectAll(".rect1").remove()
       g3.selectAll(".rect1")
        .data(brushed_age_bins)
        .enter().append("rect")    
        .attr("transform", function(d) { return "translate(" + age_x(d.x0) + "," + age_y(d.length) + ")"; })
        .attr("width", function(d) { return age_x(d.x1) - age_x(d.x0)-1 ; })
        .attr('class', 'rect1')
        .transition()
        .duration(1000)               
        .attr("height", function(d) { return HEIGHT - age_y(d.length); })
        .style("fill", "#69b3a2")
        .style("stroke", "black")
      
      // Chart 2 = Draft Number 
      // And apply this function to data to get the bins
      const brushed_draft_bins = draft_histogram(brushedData);
      // Y axis: scale and draw: Brushed
      const brushed_draft_y = d3.scaleLinear()
      .range([HEIGHT, 0]);
      brushed_draft_y.domain([0,d3.max(brushed_draft_bins,function(d){return d.length})]);

        g4.selectAll(".rect")
        .data(draft_bins)
        .enter().append("rect")
        .attr('class', 'rect')
        .attr("transform", function(d) { return "translate(" + draft_x(d.x0) + "," + draft_y(d.length) + ")"; })
        .attr("width", function(d) { return draft_x(d.x1) - draft_x(d.x0)-1 ; })
        .transition()
        .duration(1000)
        .attr("height", function(d) { return HEIGHT - draft_y(d.length); })
        .style("fill", "white")
        .style("stroke", "black")
      g4.selectAll(".rect1").remove()
        g4.selectAll(".rect1")
        .data(brushed_draft_bins)
        .enter().append("rect")        
        .attr("transform", function(d) { return "translate(" + draft_x(d.x0) + "," + draft_y(d.length) + ")"; })
        .attr("width", function(d) { return draft_x(d.x1) - draft_x(d.x0)-1 ; })
        .attr('class', 'rect1')
        .transition()
        .duration(1000)
        .attr("height", function(d) { return HEIGHT - draft_y(d.length); })
        .style("fill", "#69b3a2")
        .style("stroke", "black")

      // Chart 3 = gp 
      // And apply this function to data to get the bins
      const brushed_gp_bins = gp_histogram(brushedData);
      // Y axis: scale and draw: Brushed
      const brushed_gp_y = d3.scaleLinear()
      .range([HEIGHT, 0]);
      brushed_gp_y.domain([0,d3.max(brushed_gp_bins,function(d){return d.length})]);
      
      g5.selectAll(".rect")
        .data(gp_bins)
        .enter().append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + gp_x(d.x0) + "," + gp_y(d.length) + ")"; })
        .attr("width", function(d) { return gp_x(d.x1) - gp_x(d.x0)-1 ; })
        .transition()
        .duration(1000)
        .attr("height", function(d) { return HEIGHT - gp_y(d.length); })
        .style("fill", "white")
        .style("stroke", "black")
      g5.selectAll(".rect1").remove()
      g5.selectAll(".rect1")
      .data(brushed_gp_bins)
      .enter().append("rect")
      .attr("x", 1)
      .attr("transform", function(d) { return "translate(" + gp_x(d.x0) + "," + gp_y(d.length) + ")"; })
      .attr("width", function(d) { return gp_x(d.x1) - gp_x(d.x0)-1 ; })
      .attr('class', 'rect1')
      .transition()
      .duration(1000)
      .attr("height", function(d) { return HEIGHT - gp_y(d.length); })
      .style("fill", "#69b3a2")
      .style("stroke", "black")

      
      // Chart 3 = pts
      // And apply this function to data to get the bins
      const brushed_pts_bins = pts_histogram(brushedData);
      // Y axis: scale and draw: Brushed
      const brushed_pts_y = d3.scaleLinear()
      .range([HEIGHT, 0]);
      brushed_pts_y.domain([0,d3.max(brushed_pts_bins,function(d){return d.length})]);
      
      g6.selectAll(".rect")
        .data(pts_bins)
        .enter().append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + pts_x(d.x0) + "," + pts_y(d.length) + ")"; })
        .attr("width", function(d) { return pts_x(d.x1) - pts_x(d.x0)-1 ; })
        .transition()
        .duration(1000)
        .attr("height", function(d) { return HEIGHT - pts_y(d.length); })
        .style("fill", "white")
        .style("stroke", "black")
      g6.selectAll(".rect1").remove()
      g6.selectAll(".rect1")
      .data(brushed_pts_bins)
      .enter().append("rect")
      .attr("x", 1)
      .attr("transform", function(d) { return "translate(" + pts_x(d.x0) + "," + pts_y(d.length) + ")"; })
      .attr("width", function(d) { return pts_x(d.x1) - pts_x(d.x0)-1 ; })
      .attr('class', 'rect1')
      .transition()
      .duration(1000)
      .attr("height", function(d) { return HEIGHT - pts_y(d.length); })
      .style("fill", "#69b3a2")
      .style("stroke", "black")

      // Chart 3 = reb
      // And apply this function to data to get the bins
      const brushed_reb_bins = reb_histogram(brushedData);
      // Y axis: scale and draw: Brushed
      const brushed_reb_y = d3.scaleLinear()
      .range([HEIGHT, 0]);
      brushed_reb_y.domain([0,d3.max(brushed_reb_bins,function(d){return d.length})]);
      
      g7.selectAll(".rect")
        .data(reb_bins)
        .enter().append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + reb_x(d.x0) + "," + reb_y(d.length) + ")"; })
        .attr("width", function(d) { return reb_x(d.x1) - reb_x(d.x0)-1 ; })
        .transition()
        .duration(1000)
        .attr("height", function(d) { return HEIGHT - reb_y(d.length); })
        .style("fill", "white")
        .style("stroke", "black")
      g7.selectAll(".rect1").remove()
      g7.selectAll(".rect1")
      .data(brushed_reb_bins)
      .enter().append("rect")
      .attr("x", 1)
      .attr("transform", function(d) { return "translate(" + reb_x(d.x0) + "," + reb_y(d.length) + ")"; })
      .attr("width", function(d) { return reb_x(d.x1) - reb_x(d.x0)-1 ; })
      .attr('class', 'rect1')
      .transition()
      .duration(1000)
      .attr("height", function(d) { return HEIGHT - reb_y(d.length); })
      .style("fill", "#69b3a2")
      .style("stroke", "black")

      // Chart 3 = ast
      // And apply this function to data to get the bins
      const brushed_ast_bins = ast_histogram(brushedData);
      // Y axis: scale and draw: Brushed
      const brushed_ast_y = d3.scaleLinear()
      .range([HEIGHT, 0]);
      brushed_ast_y.domain([0,d3.max(brushed_ast_bins,function(d){return d.length})]);  
      
      if (count == 1){
        g8.selectAll(".rect1").remove()
        g8.selectAll(".rect")
        .data(ast_bins)
        .enter().append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + ast_x(d.x0) + "," + ast_y(d.length) + ")"; })
        .attr("width", function(d) { return ast_x(d.x1) - ast_x(d.x0)-1 ; })
        .transition()
        .duration(1000)
        .attr("height", function(d) { return HEIGHT - ast_y(d.length); })
        .style("fill", "#69b3a2")
        .style("stroke", "black")}
      else{
      g8.selectAll(".rect")
      .data(ast_bins)
      .enter().append("rect")
      .attr("x", 1)
      .attr("transform", function(d) { return "translate(" + ast_x(d.x0) + "," + ast_y(d.length) + ")"; })
      .attr("width", function(d) { return ast_x(d.x1) - ast_x(d.x0)-1 ; })
      .transition()
      .duration(1000)
      .attr("height", function(d) { return HEIGHT - ast_y(d.length); })
      .style("fill", "white")
      .style("stroke", "black")
      g8.selectAll(".rect1").remove()
      g8.selectAll(".rect1")
      .data(brushed_reb_bins)
      .enter().append("rect")
      .attr("x", 1)
      .attr("transform", function(d) { return "translate(" + ast_x(d.x0) + "," + ast_y(d.length) + ")"; })
      .attr("width", function(d) { return ast_x(d.x1) - ast_x(d.x0)-1 ; })
      .attr('class', 'rect1')
      .transition()
      .duration(1000)
      .attr("height", function(d) { return HEIGHT - ast_y(d.length); })
      .style("fill", "#69b3a2")
      .style("stroke", "black")
      }
      // Change the map value
      // d3.csv("TeamLoc.csv",d3.autoType).then(function (data){
      //   if (count == 1){
      //   circle.selectAll('circle').remove().exit();
      //   circle.selectAll('g')
      //   .data(data).enter().append('circle')
      //   .attr("cx",function(data){return projection([data.lon, data.lat ])[0];})
      //   .attr("cy",function(data){return projection([data.lon, data.lat ])[1];})
      //   .transition()
      //   .duration(1000)
      //   .attr('fill', 'red')
      //   .style("stroke", "black")
      //   var temp = countplayers().then(function (count){
      //     return circle.data(data).attr('r', function(data){return count.get(data.team_abbreviation)})
      //     .attr('opacity', 0.6);
      //   })
      //   async function countplayers(){
      //     var nbcsv = await d3.csv("NBA1516.csv",d3.autoType).then(function (data){            
      //         var count = d3.rollup(data,d=> d.length,e=> e.team_abbreviation)
      //         return(count);
      //       });              
      //       return nbcsv;
        
      //           }     
      //   }
      // })
    }
      // X ticks
      const x = d3.scaleLinear()
      .domain([d3.min(data, d => d.umapX), d3.max(data, d => d.umapX)])
      .range([0, HEIGHT])
  
      //x axis
      const xAxisCall = d3.axisBottom(x)
      ScatterPlotg.append("g")
      .attr("transform", `translate(0, ${HEIGHT})`)
      .call(xAxisCall)
      .selectAll("text").remove()
         
      
      // Y ticks
      const y = d3.scaleLinear()
      .domain([d3.min(data, d => d.umapY), d3.max(data, d => d.umapY)])
      .range([HEIGHT, 0])
      //y axis
      const yAxisCall = d3.axisLeft(y)
      ScatterPlotg.append("g").call(yAxisCall).selectAll("text").remove()
      

      // circle
      // Color scale: give me a specie name, I return a color
      var color = d3.scaleOrdinal()
      .domain(["ptsNorm", "rebNorm", "astNorm" ])
      .range([ "red", "green", "blue"])

      const radiussize = d3.scaleLinear()
      .domain([-2,0])
      .range([1,3])

      // Add dots
      var dots = ScatterPlotg.selectAll("dot")
      .data(data).join("circle")
      .attr("cx", function (d) { return x(d.umapX); } )
      .attr("cy", function (d) { return y(d.umapY); } )
      .attr("r", function (d) {return radiussize((d.ptsNorm+ d.rebNorm+d.astNorm)/3);})
      .style("fill",  function (d) { return color(getMaxValue(d) )})
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);   

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
      svg.append("circle").attr("cx",170).attr("cy",70).attr("r", 6).style("stroke", "black").style("fill", "red")
      svg.append("circle").attr("cx",250).attr("cy",70).attr("r", 6).style("stroke", "black").style("fill", "green")
      svg.append("circle").attr("cx",330).attr("cy",70).attr("r", 6).style("stroke", "black").style("fill", "blue")
      svg.append("text").attr("x", 180).attr("y", 70).text("ptsNorm").style("font-size", "15px").attr("alignment-baseline","middle")
      svg.append("text").attr("x", 260).attr("y", 70).text("rebNorm").style("font-size", "15px").attr("alignment-baseline","middle")
      svg.append("text").attr("x", 340).attr("y", 70).text("astNorm").style("font-size", "15px").attr("alignment-baseline","middle")
      svg.append("text").attr("x", 420).attr("y", 70).text("r: avg").style("font-size", "15px").attr("alignment-baseline","middle")




    let circle = null
    let projection = null
    // Map
    d3.json("us-states.json").then(drawUsa);
    function drawUsa(usa) {
        var width = 800;
        var height = 500;
        // Adds the svg canvas
        const svg2 = d3.select("#mapchart").append("svg")
            .attr("width", 950).attr("height", 550)
        
        const g2 = svg2.append("g")
            .attr("transform", `translate(${FLeftTopX + MARGIN.LEFT}, ${FLeftTopY + MARGIN.TOP})`)
        
         projection = d3.geoMercator()
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
             circle = g2.selectAll('g')
                .data(data).enter().append('circle')
                .attr("cx",function(data){return projection([data.lon, data.lat ])[0];})
                .attr("cy",function(data){return projection([data.lon, data.lat ])[1];})
                .attr('fill', 'red')
                
                .style("stroke", "black")
                var temp = countplayers().then(function (count){
                  return circle.data(data).transition()
                  .duration(1000).attr('r', function(data){return count.get(data.team_abbreviation)})
                  .attr('opacity', 0.6);
                })
            async function countplayers(){
              var nbcsv = await d3.csv("NBA1516.csv",d3.autoType).then(function (data){            
                      var count = d3.rollup(data,d=> d.length,e=> e.team_abbreviation)
                      return(count);
                    });              
                    return nbcsv;
      
              }           
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
        
    }
    //Histogram    
      // Chart 1 = age
        // append the svg object to the body of the page
        const svg3 = d3.select("#barchart").append("svg")
        .attr("width", FWidth).attr("height", FHeight);
        const g3 = svg3.append("g")
        .attr("transform","translate(" + MARGIN.LEFT + "," + MARGIN.TOP + ")");
       
        // X axis: scale and draw:
        const age_x = d3.scaleLinear()
        .domain([d3.min(data, d => d.age), d3.max(data, d => d.age)])     
        .range([0, WIDTH]);
        g3.append("g")
        .attr("transform", "translate(0," + HEIGHT + ")")
        .call(d3.axisBottom(age_x));

        // set the parameters for the histogram
        const age_histogram = d3.histogram()
        .value(function(d) { return d.age; })   
        .domain(age_x.domain())  // then the domain of the graphic
        .thresholds(age_x.ticks(20)); // then the numbers of bins

        // And apply this function to data to get the bins
        const age_bins = age_histogram(data);
        // Y axis: scale and draw:
        const age_y = d3.scaleLinear()
        .range([HEIGHT, 0]);
        age_y.domain([0,d3.max(age_bins,function(d){return d.length})]);   
        g3.append("g")
        .call(d3.axisLeft(age_y));

        // append the bar rectangles to the svg element
         g3.selectAll("rect")
        .data(age_bins)
        .enter().append("rect")
        .attr("transform", function(d) { return "translate(" + age_x(d.x0) + "," + age_y(d.length) + ")"; })
        .attr("width", function(d) { return age_x(d.x1) - age_x(d.x0)-1 ; })
        .attr("height", function(d) { return HEIGHT - age_y(d.length); })
        .style("fill", "#69b3a2")
        .style("stroke", "black")
        
        svg3.append("text").attr("x", 400).attr("y", 80).text("Age").style("font-size", "50px").attr("alignment-baseline","middle")
        
      // Chart 2 = draft_number
        // append the svg object to the body of the page
        const svg4 = d3.select("#barchart").append("svg")
        .attr("width", FWidth).attr("height", FHeight);
        const g4 = svg4.append("g")
        .attr("transform","translate(" + MARGIN.LEFT + "," + MARGIN.TOP + ")");
       // Fix the undrafted part
       data.forEach(function(d) {
        d.draft_number =d.draft_number;
        if(d.draft_number == "Undrafted"){
          d.draft_number =61;
        }
        });
        // X axis: scale and draw:
        const draft_x = d3.scaleLinear()
        .domain([d3.min(data, d => d.draft_number), d3.max(data, d => d.draft_number)])     
        .range([0, WIDTH]);
        g4.append("g")
        .attr("transform", "translate(0," + HEIGHT + ")")
        .call(d3.axisBottom(draft_x));

        // set the parameters for the histogram
        const draft_histogram = d3.histogram()
        .value(function(d) { return d.draft_number; })   
        .domain(draft_x.domain())  // then the domain of the graphic
        .thresholds(draft_x.ticks(30)); // then the numbers of bins

        // And apply this function to data to get the bins
        const draft_bins = draft_histogram(data);
        // Y axis: scale and draw:
        const draft_y = d3.scaleLinear()
        .range([HEIGHT, 0]);
        draft_y.domain([0,d3.max(draft_bins,function(d){return d.length})]);   
        g4.append("g")
        .call(d3.axisLeft(draft_y));

        // append the bar rectangles to the svg element
        g4.selectAll("rect")
        .data(draft_bins)
        .enter().append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + draft_x(d.x0) + "," + draft_y(d.length) + ")"; })
        .attr("width", function(d) { return draft_x(d.x1) - draft_x(d.x0)-1 ; })
        .attr("height", function(d) { return HEIGHT - draft_y(d.length); })
        .style("fill", "#69b3a2")
        .style("stroke", "black")

        svg4.append("text").attr("x", 300).attr("y", 80).text("Draft Number").style("font-size", "30px").attr("alignment-baseline","middle")
        
      // Chart 3 = gp
        // append the svg object to the body of the page
        const svg5 = d3.select("#barchart").append("svg")
        .attr("width", FWidth).attr("height", FHeight);
        const g5 = svg5.append("g")
        .attr("transform","translate(" + MARGIN.LEFT + "," + MARGIN.TOP + ")");
       
        // X axis: scale and draw:
        const gp_x = d3.scaleLinear()
        .domain([d3.min(data, d => d.gp), d3.max(data, d => d.gp)])     
        .range([0, WIDTH]);
        g5.append("g")
        .attr("transform", "translate(0," + HEIGHT + ")")
        .call(d3.axisBottom(gp_x));

        // set the parameters for the histogram
        const gp_histogram = d3.histogram()
        .value(function(d) { return d.gp; })   
        .domain(gp_x.domain())  // then the domain of the graphic
        .thresholds(gp_x.ticks(50)); // then the numbers of bins

        // And apply this function to data to get the bins
        const gp_bins = gp_histogram(data);
        // Y axis: scale and draw:
        const gp_y = d3.scaleLinear()
        .range([HEIGHT, 0]);
        gp_y.domain([0,d3.max(gp_bins,function(d){return d.length})]);   
        g5.append("g")
        .call(d3.axisLeft(gp_y));

        // append the bar rectangles to the svg element
        g5.selectAll("rect")
        .data(gp_bins)
        .enter().append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + gp_x(d.x0) + "," + gp_y(d.length) + ")"; })
        .attr("width", function(d) { return gp_x(d.x1) - gp_x(d.x0)-1 ; })
        .attr("height", function(d) { return HEIGHT - gp_y(d.length); })
        .style("fill", "#69b3a2")
        .style("stroke", "black")
        
        svg5.append("text").attr("x", 300).attr("y", 80).text("gp").style("font-size", "50px").attr("alignment-baseline","middle")
        
      // Chart 4 = pts
        // append the svg object to the body of the page
        const svg6 = d3.select("#barchart").append("svg")
        .attr("width", FWidth).attr("height", FHeight);
        const g6 = svg6.append("g")
        .attr("transform","translate(" + MARGIN.LEFT + "," + MARGIN.TOP + ")");
       
        // X axis: scale and draw:
        const pts_x = d3.scaleLinear()
        .domain([d3.min(data, d => d.pts), d3.max(data, d => d.pts)])     
        .range([0, WIDTH]);
        g6.append("g")
        .attr("transform", "translate(0," + HEIGHT + ")")
        .call(d3.axisBottom(pts_x));

        // set the parameters for the histogram
        const pts_histogram = d3.histogram()
        .value(function(d) { return d.pts; })   
        .domain(pts_x.domain())  // then the domain of the graphic
        .thresholds(pts_x.ticks(50)); // then the numbers of bins

        // And apply this function to data to get the bins
        const pts_bins = pts_histogram(data);
        // Y axis: scale and draw:
        const pts_y = d3.scaleLinear()
        .range([HEIGHT, 0]);
        pts_y.domain([0,d3.max(pts_bins,function(d){return d.length})]);   
        g6.append("g")
        .call(d3.axisLeft(pts_y));

        // append the bar rectangles to the svg element
        g6.selectAll("rect")
        .data(pts_bins)
        .enter().append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + pts_x(d.x0) + "," + pts_y(d.length) + ")"; })
        .attr("width", function(d) { return pts_x(d.x1) - pts_x(d.x0)-1 ; })
        .attr("height", function(d) { return HEIGHT - pts_y(d.length); })
        .style("fill", "#69b3a2")
        .style("stroke", "black")
        
        svg6.append("text").attr("x", 400).attr("y", 80).text("pts").style("font-size", "50px").attr("alignment-baseline","middle")
        
      // Chart 5 = reb
        // append the svg object to the body of the page
        const svg7 = d3.select("#barchart").append("svg")
        .attr("width", FWidth).attr("height", FHeight);
        const g7 = svg7.append("g")
        .attr("transform","translate(" + MARGIN.LEFT + "," + MARGIN.TOP + ")");
       
        // X axis: scale and draw:
        const reb_x = d3.scaleLinear()
        .domain([d3.min(data, d => d.reb), d3.max(data, d => d.reb)])     
        .range([0, WIDTH]);
        g7.append("g")
        .attr("transform", "translate(0," + HEIGHT + ")")
        .call(d3.axisBottom(reb_x));

        // set the parameters for the histogram
        const reb_histogram = d3.histogram()
        .value(function(d) { return d.reb; })   
        .domain(reb_x.domain())  // then the domain of the graphic
        .thresholds(reb_x.ticks(50)); // then the numbers of bins

        // And apply this function to data to get the bins
        const reb_bins = reb_histogram(data);
        // Y axis: scale and draw:
        const reb_y = d3.scaleLinear()
        .range([HEIGHT, 0]);
        reb_y.domain([0,d3.max(reb_bins,function(d){return d.length})]);   
        g7.append("g")
        .call(d3.axisLeft(reb_y));

        // append the bar rectangles to the svg element
        g7.selectAll("rect")
        .data(reb_bins)
        .enter().append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + reb_x(d.x0) + "," + reb_y(d.length) + ")"; })
        .attr("width", function(d) { return reb_x(d.x1) - reb_x(d.x0)-1 ; })
        .attr("height", function(d) { return HEIGHT - reb_y(d.length); })
        .style("fill", "#69b3a2")
        .style("stroke", "black")
        svg7.append("text").attr("x", 400).attr("y", 80).text("reb").style("font-size", "50px").attr("alignment-baseline","middle")
        
      // Chart 6 = ast
        // append the svg object to the body of the page
        const svg8 = d3.select("#barchart").append("svg")
        .attr("width", FWidth).attr("height", FHeight);
        const g8 = svg8.append("g")
        .attr("transform","translate(" + MARGIN.LEFT + "," + MARGIN.TOP + ")");
       
        // X axis: scale and draw:
        const ast_x = d3.scaleLinear()
        .domain([d3.min(data, d => d.ast), d3.max(data, d => d.ast)])     
        .range([0, WIDTH]);
        g8.append("g")
        .attr("transform", "translate(0," + HEIGHT + ")")
        .call(d3.axisBottom(ast_x));

        // set the parameters for the histogram
        const ast_histogram = d3.histogram()
        .value(function(d) { return d.ast; })   
        .domain(ast_x.domain())  // then the domain of the graphic
        .thresholds(ast_x.ticks(50)); // then the numbers of bins

        // And apply this function to data to get the bins
        const ast_bins = ast_histogram(data);
        // Y axis: scale and draw:
        const ast_y = d3.scaleLinear()
        .range([HEIGHT, 0]);
        ast_y.domain([0,d3.max(ast_bins,function(d){return d.length})]);   
        g8.append("g")
        .call(d3.axisLeft(ast_y));

        // append the bar rectangles to the svg element
        g8.selectAll("rect")
        .data(ast_bins)
        .enter().append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + ast_x(d.x0) + "," + ast_y(d.length) + ")"; })
        .attr("width", function(d) { return ast_x(d.x1) - ast_x(d.x0)-1 ; })
        .attr("height", function(d) { return HEIGHT - ast_y(d.length); })
        .style("fill", "#69b3a2")
        .style("stroke", "black")
        svg8.append("text").attr("x", 400).attr("y", 80).text("ast").style("font-size", "50px").attr("alignment-baseline","middle")
        
        g3.call(brush); 
    
    })

}  