var promises = [
  d3.csv("./data/rotten_tomatoes_movies.csv",parseCSV), 
  d3.csv("./data/CertifiedFresh.csv",parseCSV),
  d3.csv("./data/Fresh.csv",parseCSV),
  d3.csv("./data/Rotten.csv",parseCSV),
];

/*
Using Promise.all() method to load all the data files
*/
Promise.all(promises).then(function(data) {

    var movieData = data[0];
    var certifiedFresh = data[1];
    var Fresh = data[2];
    var Rotten = data[3];


// Bubble chart 
    // adjust to the window width on devices
    var width = document.querySelector("#chart").clientWidth;
    var height = document.querySelector("#chart").clientHeight;
    var margin = {top:50, left: 150, right: 50, bottom: 150};

    // set the scale of the svg we're going to build
    var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

    var svg2 = d3.select("#legend")

    // Make legends
    svg2.append("circle").attr("cx",20).attr("cy",20).attr("r", 5).style("fill", "#d71f43")
    svg2.append("circle").attr("cx",20).attr("cy",40).attr("r", 5).style("fill", "#ec6b1a")
    svg2.append("circle").attr("cx",20).attr("cy",60).attr("r", 5).style("fill", "#51395e")
   
    svg2.append("text").attr("x", 40).attr("y", 20).text("Certified Fresh").style("font-size", "15px").attr("alignment-baseline","middle")
    svg2.append("text").attr("x", 40).attr("y", 40).text("Fresh").style("font-size", "15px").attr("alignment-baseline","middle")
    svg2.append("text").attr("x", 40).attr("y", 60).text("Rotten").style("font-size", "15px").attr("alignment-baseline","middle")

    svg2.append("circle").attr("cx",40).attr("cy",120).attr("r",30 )
    .style("fill", "#e04662")
    .style("opacity",0.7)
    svg2.append("circle").attr("cx",40).attr("cy",145).attr("r",5 )
    .style("fill", "#e04662")
    .style("stroke","white")

    svg2.append("text").attr("x", 20).attr("y", 120).text("Max Audience: 36,000,000")
    .style("font-size", "8px").attr("alignment-baseline","middle")
    svg2.append("text").attr("x", 20).attr("y", 145).text("min Audience: 10,000").style("font-size", "8px").attr("alignment-baseline","middle")
    

    // filter dataset: only show the data under "Comedy","Horror" and "Drama" categories
    var filtered_Comedydata = movieData.filter(function(d){
        return d.genre === "Comedy";
    });
    
    var filtered_Horrordata = movieData.filter(function(d){
      return d.genre === "Horror" ;
    });

    var filtered_Dramadata = movieData.filter(function(d){
      return d.genre === "Drama";
    });
  
  // for setting y-axis
    var audience_Rating = {
      minRating: d3.min(movieData, function(d) { return +d.audience_rating; }),
      maxRating: d3.max(movieData, function(d) { return +d.audience_rating; }),
  };
 
  // for setting r-scale
  var audience_count = {
    minCount: d3.min(movieData, function(d) { return +d.audience_count; }),
    maxCount: d3.max(movieData, function(d) { return +d.audience_count; }),

  };
  
  // for setting x-axis
  var year = {
    minYear: d3.min(movieData, function(d) { return +d.year; }),
    maxYear: d3.max(movieData, function(d) { return +d.year; }),

  };

  // set x scale based on the min/max of year
  var xScale = d3.scaleLinear()
    .domain([year.minYear, year.maxYear])
    .range([margin.left, width-margin.right]);

  // set y-scale based on the min/max of Rating
  var yScale = d3.scaleLinear()
    .domain([0, audience_Rating.maxRating])
    .range([height-margin.bottom, margin.top]);

   
  var rScale = d3.scaleSqrt()
    .domain([audience_count.minCount, audience_count.maxCount])
    .range([5, 30]);

  //create customized color scale (scale on certain order) for movie categories
  var colorScale = d3.scaleOrdinal()
    .domain(["Certified Fresh", "Fresh", "Rotten"])
    .range([ "#d71f43", "#ec6b1a","#51395e" ]);

// grab the whole element "g" and move it to the left bottom of the chart with "transform" as one of the attributes and call the x-axis
  var xAxis = svg.append("g")
   .attr("transform",`translate(0,${height-margin.bottom})`)
   .call(d3.axisBottom().scale(xScale).tickFormat(d3.format("Y")));


// grab the whole element "g" and move it to the left bottom of the chart with "transform" as one of the attributes and call the y-axis
  var yAxis = svg.append("g")
   .attr("transform",`translate(${margin.left},0)`)
   .call(d3.axisLeft().scale(yScale))
  

//create lables for x-axis
  var xAxisLabel = svg.append("text")
    //assign style to it
    .attr("class", "axisLabel")
    .attr("x", width/2)
    .attr("y", height - margin.bottom/2-30)
    .text("Year");

//create lables for y-axis
  var yAxisLabel = svg.append("text")
    //assign style to it
    .attr("class", "axisLabel")
    //y label text has to rotate 90 degrees
    .attr("transform", "rotate(-90)")
    .attr("x", -height/2)
    .attr("y", margin.left/2+30)
    .text("Audience Rating");


// create default points
  var points = svg.selectAll("circle")
  .data(filtered_Comedydata)
  .enter()
  .append("circle")
      .attr("cx", function(d) { return xScale(d.year); })
      .attr("cy", function(d) { return yScale(d.audience_rating); })
      .attr("fill", function(d) { return colorScale(d.tomato_status); })
      .attr("opacity","0.5")
      .attr("r", function(d) { return rScale(d.audience_count); })
      .attr("stroke", "white")


// click on COMEDY
d3.select("#Comedy")
.on("click", function(){

  var Points = svg.selectAll("circle")
  .data(filtered_Comedydata)

  Points.enter().append("circle")
    .attr("cx", function(d) { return xScale(d.year); })
    .attr("cy", function(d) { return yScale(d.audience_rating); })
    .attr("fill", function(d) { return colorScale(d.tomato_status); })
    .attr("opacity","0.5")
    .attr("r", 0)
    .attr("stroke", "white")

.merge(Points)
.transition()
.duration(1500)

    .attr("cx", function(d) { return xScale(d.year); })
    .attr("cy", function(d) { return yScale(d.audience_rating); })
    .attr("fill", function(d) { return colorScale(d.tomato_status); })
    .attr("opacity","0.5")
    .attr("r", function(d) { return rScale(d.audience_count); })
    .attr("stroke", "white")

Points.exit()
.transition()
.duration(1500)
.attr("r",0)
.remove();

 });

// Click on HORROR
d3.select("#Horror")
    .on("click", function(){
    
  var newPoints = svg.selectAll("circle")
  .data(filtered_Horrordata)
  newPoints.enter().append("circle")
    .attr("cx", function(d) { return xScale(d.year); })
    .attr("cy", function(d) { return yScale(d.audience_rating); })
    .attr("fill", function(d) { return colorScale(d.tomato_status); })
    .attr("opacity","0.5")
    .attr("r", 0)
    .attr("stroke", "white")

// update data
.merge(newPoints)
.transition()
.duration(1500)

    .attr("cx", function(d) { return xScale(d.year); })
    .attr("cy", function(d) { return yScale(d.audience_rating); })
    .attr("opacity","0.5")
    .attr("r", function(d) { return rScale(d.audience_count); })
    .attr("stroke", "white")
    .attr("fill", function(d) { return colorScale(d.tomato_status); });   

newPoints.exit()
.transition()
.duration(1500)
.attr("r",0)
.remove();

    });

// Click on DRAMA
d3.select("#Drama")
    .on("click", function(){
    
  var dramaPoints = svg.selectAll("circle")
  .data(filtered_Dramadata)
  dramaPoints.enter().append("circle")
    .attr("cx", function(d) { return xScale(d.year); })
    .attr("cy", function(d) { return yScale(d.audience_rating); })
    .attr("fill", function(d) { return colorScale(d.tomato_status); })
    .attr("opacity","0.5")
    .attr("r", 0)
    .attr("stroke", "white")

// update data
.merge(dramaPoints)
.transition()
.duration(1500)

    .attr("cx", function(d) { return xScale(d.year); })
    .attr("cy", function(d) { return yScale(d.audience_rating); })
    .attr("opacity","0.5")
    .attr("r", function(d) { return rScale(d.audience_count); })
    .attr("stroke", "white")
    .attr("fill", function(d) { return colorScale(d.tomato_status); });   

dramaPoints.exit()
.transition()
.duration(1500)
.attr("r",0)
.remove();
    });


  var tooltip = d3.select("#chart")
    .append("div")
    .attr("class","tooltip");
 
  // d is the object that binds those circles
  // when mouseover the circles, the tooltip will show up
  points.on("mouseover", function(d) {
    
  var cx = +d3.select(this)
    .attr("cx");

  var cy = +d3.select(this)
    .attr("cy");

  tooltip.style("visibility","visible")
    // the position of the toolip
    .style("left",(d3.event.pageX + 25) + "px")
    .style("top", (d3.event.pageY - 28) +"px")
    .html((d.year)+ "<br>"+ (d.title) + "<br>" +"Genre: "+(d.genre) + "<br>"  +"Tomatometer Status: "+(d.tomato_status)+"<br>"+"Audience Rating: "+(d.audience_rating))

  d3.select(this)
    .attr("stroke","aliceblue")
    .attr("stroke-width",2)
    .attr("opacity", 1)

  })
  .on("mouseout", function(d){
        
    tooltip.style("visibility","hidden")
    d3.select(this)
      .attr("stroke","none")
      .attr("stroke-width","none")
      .attr("opacity","0.5")
    })



// PIE chart-1969
  var width = document.querySelector("#chart2").clientWidth;
  var height = document.querySelector("#chart2").clientHeight;
  var svg3 = d3.select("#chart2")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  var filtered_1969 = movieData.filter(function(d){
      return d.year == "1969";
  });
  
  var nested1969 = d3.nest()
    .key(function(d) { return d.rating; })
    // show the number of each property-> show in value as count number
    .rollup(function(d) {return d.length; })
    .entries(filtered_1969)

  var g = svg3.append("g")
    .attr("transform",`translate(${width/2},${height/2})`);

  var pie = d3.pie()
    // decide what value to use. the wedges will be propotional to the corresponding values
    .value(function(d) {return d.value;});

// create a customized color palette to assign each wedge a unique color with d3.scaleOrdinal()
  var color = d3.scaleOrdinal()
    .domain(["R", "PG-13", "PG","G"])
    .range(["#41395c", "#525e8b","#6d84ab","#b6e8ec"]);


// create the arc using d3.arc()
var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(120);

var arcs = g.selectAll(".arc")
    .data(pie(nested1969))
    .enter()
    // start drawing the arc and append it as a g
    .append("g")
        .attr("class","arc");


// start drawing the arc and append it as a g
arcs.append("path")
    .attr("d", function(d) {return arc(d); })
    // i is the reference of the objects that bind into the elements
    .attr("fill",function(d,i){
        return color(i)
    })
    .attr("opacity",0.8)
    ;


// create tooltip for donut chart
  var tooltip2 = d3.select("#chart2")
    .append("div")
    .attr("class","tooltip");


  arcs.on("mousemove", function(d){
  

    // new function: d3.mouse. set the center-x & center-y for positioning tooltips
  var mouse = d3.mouse(this);
  var cx = mouse[0] +width/2;
  var cy = mouse[1] +height/2;
  var total = 0;
    nested1969.forEach(function(d){total += d.value});
  
    tooltip.style("visibility", "visible")
      .style("left",(d3.event.pageX + 25) + "px")
      .style("top", (d3.event.pageY - 28) +"px")
      .html("Rating: " + (d.data.key) + "<br>" + "Count: "+ (d.value) + "<br>" + "Percentage: "  + Math.round(d.value/total*100)+ "%");
  
    d3.select(this)
      .attr("stroke","aliceblue")
      .attr("stroke-width",5)
      .attr("opacity",1)
  // put the stroke on the top of the chart
      .raise()
       })
  
  // remove the tooltip when mouseout
    .on("mouseout", function(d){
        tooltip.style("visibility","hidden")
        d3.select(this)
        .attr("stroke","none")
        .attr("stroke-width",0)
        .attr("opacity",0.8);
        
        })


 // PIE chart-2018 
    var width = document.querySelector("#chart4").clientWidth;
    var height = document.querySelector("#chart4").clientHeight;
    var svg5= d3.select("#chart4")
          .append("svg")
          .attr("width", width)
          .attr("height", height);
 
    var filtered_2018 = movieData.filter(function(d){
          return d.year == "2018";
        });
        
        console.log(filtered_2018);
        
    var nested2018 = d3.nest()
        .key(function(d) { return d.rating; })
        // show the number of each property-> show in value as count number
        .rollup(function(d) {return d.length; })
        .entries(filtered_2018)

 console.log(filtered_2018);
    var g2 = svg5.append("g")
        .attr("transform",`translate(${width/2},${height/2})`);
    
    var pie2 = d3.pie()
        // decide what value to use. the wedges will be propotional to the corresponding values
        .value(function(d) {return d.value;});
    
    // create a customized color palette to assign each wedge a unique color with d3.scaleOrdinal()
    var color2 = d3.scaleOrdinal()
        .domain(["R", "PG-13", "PG","G"])
        .range(["#41395c", "#525e8b","#6d84ab","#b6e8ec"]);
     
    
    // create the arc using d3.arc()
    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(120);
  
    
    var arcs = g2.selectAll(".arc")
        .data(pie2(nested2018))
        .enter()
        // start drawing the arc and append it as a g
        .append("g")
            .attr("class","arc");       

  // start drawing the arc and append it as a g
  arcs.append("path")
      .attr("d", function(d) {return arc(d); })
      // i is the reference of the objects that bind into the elements
      .attr("fill",function(d,i){
          return color(i)
      })
      
      .attr("opacity",0.8)
      ;
    


  // create tooltip for pie char
    var tooltip3 = d3.select("#chart4")
    .append("div")
    .attr("class","tooltip");

    arcs.on("mousemove", function(d){
    
    // console.log(d)
    // new function: d3.mouse. set the center-x & center-y for positioning tooltips
    var mouse = d3.mouse(this);
    var cx = mouse[0] +width/2;
    var cy = mouse[1] +height/2;
    var total = 0;
      nested2018.forEach(function(d){total += d.value});
      console.log(total);



      tooltip3.style("visibility", "visible")
        .style("left",(d3.event.pageX + 25) + "px")
        .style("top", (d3.event.pageY - 28) +"px")
        .html("Rating: " + (d.data.key) + "<br>" + "Count: "+ (d.value) + "<br>" + "Percentage: "  + Math.round(d.value/total*100)+ "%");

      d3.select(this)
        .attr("stroke","aliceblue")
        .attr("stroke-width",5)
        .attr("opacity",1)
    // put the stroke on the top of the chart
        .raise()
          })

    // remove the tooltip when mouseout
      .on("mouseout", function(d){
        
          tooltip3.style("visibility","hidden")
          d3.select(this)
          .attr("stroke","none")
          .attr("stroke-width",0)
          .attr("opacity",0.8);
       
       
       })



// LINE chart

  var width = document.querySelector("#chart3").clientWidth;
  var height = document.querySelector("#chart3").clientHeight;
  
  var svg4 = d3.select("#chart3")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

  var filtered_CertifiedFreshData = movieData.filter(function(d){
    return d.tomato_status === "Certified Fresh";
  });

  var filtered_FreshData = movieData.filter(function(d){
    return d.tomato_status === "Fresh";
  });

  var filtered_RottenData = movieData.filter(function(d){
    return d.tomato_status === "Rotten";
  });



  var nestedcertified = d3.nest()
      .key(function(d) { return d.year; })
      
    // show the number of each property-> show in value as count number
      .rollup(function(d) {return d.length; })
      .entries(filtered_CertifiedFreshData);

  var nestedFresh = d3.nest()
    .key(function(d) { return d.year; })
   
    // show the number of each property-> show in value as count number
    .rollup(function(d) {return d.length; })
    .entries(filtered_FreshData)
  
  var nestedRotten = d3.nest()
    .key(function(d) { return d.year; })
    
    // show the number of each property-> show in value as count number
    .rollup(function(d) {return d.length; })
    .entries(filtered_RottenData)
    
  
  var CertifiedFresh_Year ={
      min:d3.min(certifiedFresh, function(d) {return +d.CertifiedFresh_Year; }),
      max:d3.max(certifiedFresh, function(d) {return +d.CertifiedFresh_Year; })
  };


  var CertifiedFresh_Count ={
    min:d3.min(certifiedFresh, function(d) {return +d.CertifiedFresh_Count; }),
    max:d3.max(certifiedFresh, function(d) {return +d.CertifiedFresh_Count; })

  }


  var Fresh_Year ={
    min:d3.min(Fresh, function(d) {return +d.Fresh_Year; }),
    max:d3.max(Fresh, function(d) {return +d.Fresh_Year; })
};


  var Fresh_Count ={
    min:d3.min(Fresh, function(d) {return +d.Fresh_Count; }),
    max:d3.max(Fresh, function(d) {return +d.Fresh_Count; })

  }



  var Rotten_Count ={
    min:d3.min(Rotten, function(d) {return +d.Rotten_Count; }),
    max:d3.max(Rotten, function(d) {return +d.Rotten_Count; })

}


// set x,y scale
  var xScaleLine = d3.scaleLinear()
      .domain([CertifiedFresh_Year.min, CertifiedFresh_Year.max])
      .range([margin.left, width-margin.right]);
  
  var yScaleLine = d3.scaleLinear()
      .domain([Rotten_Count.min,Rotten_Count.max])
      .range([height-margin.bottom, margin.top]);


// draw lines
  var line1 = d3.line()
      .x(function(d) { return xScaleLine(d.CertifiedFresh_Year); })
      .y(function(d) { return yScaleLine(d.CertifiedFresh_Count); })
      .curve(d3.curveLinear);

  var line2 = d3.line()
      .x(function(d) { return xScaleLine(d.Fresh_Year); })
      .y(function(d) { return yScaleLine(d.Fresh_Count); })
      .curve(d3.curveLinear);
     
  var line3 = d3.line()
      .x(function(d) { return xScaleLine(d.Rotten_Year); })
      .y(function(d) { return yScaleLine(d.Rotten_Count); })
      .curve(d3.curveLinear);
    
  var xAxisLine = svg4.append("g")
      .attr("class","axis")
      .attr("transform", `translate(0,${height-margin.bottom})`)
      .call(d3.axisBottom().scale(xScaleLine).tickFormat(d3.format("Y")));

  var yAxisLine = svg4.append("g")
      .attr("class","axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft().scale(yScaleLine));
      

  var path= svg4.append("path")
      .datum(certifiedFresh)
      .attr("stroke","#d71f43")
      .attr("fill","none")
      .attr("stroke-width",2)
      .attr("d", line1);

  var path2= svg4.append("path")
      .datum(Fresh)
      .attr("stroke","#ec6b1a")
      .attr("fill","none")
      .attr("stroke-width",2)
      .attr("d", line2);
  
  var path3= svg4.append("path")
      .datum(Rotten)
      .attr("stroke","#51395e")
      .attr("fill","none")
      .attr("stroke-width",2)
      .attr("d", line3);

  var xAxisLabel = svg4.append("text")
      .attr("class","axisLabel")
      .attr("x", width/2)
      .attr("y", height-margin.bottom/2)
      .text("Year");

  var yAxisLabel = svg4.append("text")
      .attr("class","axisLabel")
      .attr("transform","rotate(-90)")
      .attr("x",-height/2)
      .attr("y",margin.left/2)
      .text("Count");


});


function parseCSV(data) {
  var d = {};
    d.title = data.movie_title;
    d.rating = data.rating;
    d.genre = data.genre;
    d.length = +data.runtime_in_minutes;
    d.tomato_status = data.tomatometer_status;
    d.tomato_rating = +data.tomatometer_rating;
    d.tomato_count = +data.tomatometer_count;
    d.audience_rating = +data.audience_rating;	
    d.audience_count = +data.audience_count;	
    d.audience_top_critics_count = +data.audience_top_critics_count;	
    d.audience_fresh_critics_count = +data.audience_fresh_critics_count;	
    d.audience_rotten_critics_count =+data.audience_rotten_critics_count;
    d.date = new Date(data.in_theaters_date);
    d.year = d.date.getFullYear();
    d.CertifiedFresh_Year= +data.CertifiedFresh_Year;
    d.CertifiedFresh_Count= +data.CertifiedFresh_Count;
    d.Fresh_Year = +data.Fresh_Year;
    d.Fresh_Count = +data.Fresh_Count;
    d.Rotten_Year= +data.Rotten_Year;
    d.Rotten_Count = +data.Rotten_Count;

    return d;

}
