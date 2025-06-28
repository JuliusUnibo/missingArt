// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 140, left: 70},
    width = 510 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#missingArt2")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Create a DSV parser for semicolon-separated values
var dsv = d3.dsvFormat(";");

// Read the data with semicolon as delimiter
d3.text("https://raw.githubusercontent.com/JuliusUnibo/missingArt/main/missingArt2.csv", function(text) {
  var data = dsv.parse(text);

// sort data
data.sort(function(b, a) {
  return a.anzahl_artworks - b.anzahl_artworks;
});


// limit to top 10 values
data = data.slice(0, 25);


  // X axis
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.namen_neu; }))
    .padding(1);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("fill", "white"); // Set the color of the x-axis labels to white

  // Set the color of the x-axis to white
  svg.selectAll(".domain, .tick line")
    .attr("stroke", "white")
    .attr("stroke-width", "1"); // Make the axis line thinner

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 45])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
      .style("fill", "white"); // Set the color of the y-axis labels to white

  // Set the color of the y-axis to white
  svg.selectAll(".domain, .tick line")
    .attr("stroke", "white")
    .attr("stroke-width", "1"); // Make the axis line thinner

  // Lines
  svg.selectAll("myline")
    .data(data)
    .enter()
    .append("line")
      .attr("x1", function(d) { return x(d.namen_neu); })
      .attr("x2", function(d) { return x(d.namen_neu); })
      .attr("y1", function(d) { return y(d.anzahl_artworks); })
      .attr("y2", y(0))
      .attr("stroke", "lightgrey");

  // Circles
  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function(d) { return x(d.namen_neu); })
      .attr("cy", function(d) { return y(d.anzahl_artworks); })
      .attr("r", "4")
      .style("fill", "#69b3a2")
      .attr("stroke", "white");
});
