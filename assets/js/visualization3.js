// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 70, left: 140},
    width = 460 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#missingArt3")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Create a DSV parser for semicolon-separated values
var dsv = d3.dsvFormat(";");

// Read the data with semicolon as delimiter
d3.text("http://localhost/missingArt/missingArt3.csv", function(text) {
    var data = dsv.parse(text);

  // sort data
  data.sort(function(a, b) {
    return b.anzahl_artworks - a.anzahl_artworks;
  });
  
// limit to top 10 values
data = data.slice(0, 12);



  // X axis
  var x = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.anzahl_artworks; })])
    .domain([0, 65])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    // .call(d3.axisBottom(x).tickFormat(d3.format("d"))) // Remove commas klappt so nicht
    .call(d3.axisBottom(x).tickFormat(d3.format(".0f"))) // Remove commas
    .call(d3.axisBottom(x))
    .selectAll("text")
      .style("fill", "white");

  // Y axis
  var y = d3.scaleBand()
    .range([0, height])
    .domain(data.map(function(d) { return d.genre; }))
    .padding(1);
  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
      .style("fill", "white");

  // Set the color of the axes to white
  svg.selectAll(".domain, .tick line")
    .attr("stroke", "white")
    .attr("stroke-width", "1"); // Make the axis line thinner

  // Lines
  svg.selectAll("myline")
    .data(data)
    .enter()
    .append("line")
      .attr("x1", x(0))
      .attr("x2", function(d) { return x(d.anzahl_artworks); })
      .attr("y1", function(d) { return y(d.genre); })
      .attr("y2", function(d) { return y(d.genre); })
      .attr("stroke", "lightgrey");

// Circles
svg.selectAll("mycircle")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", function(d) { return x(d.anzahl_artworks); })
    .attr("cy", function(d) { return y(d.genre); })
    .attr("r", "4")
    .style("fill", "#69b3a2")
    .attr("stroke", "white")

});