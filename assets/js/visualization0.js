// Set the dimensions and margins of the graph and the svg object
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

var svg = d3.select("#missingArt0")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Semicolon-separated values
var dsv = d3.dsvFormat(";");

// Read the data
d3.text("https://raw.githubusercontent.com/JuliusUnibo/missingArt/main/missingArt0.csv", function(text) {
  var data = dsv.parse(text);
  console.log(text);


// Only numeric values

d3.text("http://localhost/missingArt/missingArt0.csv", function(text) {
  var data = dsv.parse(text, function(d) {
    return {
      spalte: +d.spalte,
      datum_neu: +d.datum_neu,
      datum_alt: +d.datum_alt,
    };
  });
  console.log(data); // Check that again
});


  // Initialize X axis
  var x = d3.scaleLinear()
    .domain([0, 4000])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .style("display", "none");

  // Initialize Y axis
  var y = d3.scaleLinear()
    .domain([1250, 1933])
    .range([height, 0]);
  var yAxis = svg.append("g")
    .attr("transform", "translate(" + width / 2 + ",0)")
    .call(d3.axisLeft(y).tickFormat(d3.format(".0f")));

  yAxis.selectAll("path")
    .style("stroke", "white");
  yAxis.selectAll("line")
    .style("stroke", "white");
  yAxis.selectAll("text")
    .style("fill", "white");
  
// Add dots second group
svg.append('g')
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
    .attr("cx", function(d) { return x(d.spalte) + width / 2; })
    .attr("cy", function(d) { return y(d.datum_alt); })
    .attr("r", 3)
    .style("fill", "DarkSlateBlue")
    .style("opacity", 0.5);

  // Add dots first group
  svg.append('g')
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function(d) { return x(d.spalte) + width / 2; })
      .attr("cy", function(d) { return y(d.datum_neu); })
      .attr("r", 3)
      .style("fill", "#8B008B")
      .style("opacity", 0.5);

// Annotations

var firstY = 1933;
var secondY = 1400;
var firstApex = 1667;
var thirdY = 1933;
var fourthY = 1825;
var secondApex = 1879;

// Red cross on top of y-axis
svg.append("path")
  .attr("d", d3.symbol().type(d3.symbolCross).size(100))
  .attr("transform", "translate(" + (width / 2) + "," + y(firstY) + ")rotate(-45)")
  .style("fill", "red");

  
// Line that leads to first text box
svg.append("line")
  .attr("x1", width / 2 - 165)
  .attr("y1", y(firstY))
  .attr("x2", width / 2 - 10)
  .attr("y2", y(firstY))
  .style("stroke", "white")
  .style("stroke-width", 1);


// First text box
svg.append("rect")
  .attr("x", width / 2 - 200)
  .attr("y", y(firstY) - 10)
  .attr("width", 120)
  .attr("height", 25)
  .style("fill", "white")
  .style("stroke", "black")
  .style("stroke-width", 1);

// Text in first text box
svg.append("text")
  .attr("x", width / 2 - 195)
  .attr("y", y(firstY) + 5)
  .text("National Socialist rule.")
  .style("font-size", "12px")
  .style("fill", "black");

// Coordinates for first curved line
const lineData1 = [
  { x: width / 2 + 30, y: firstY },
  { x: width / 2 + 100 + 10, y: (firstY + secondY) / 2 }, // This point changes curviness
  { x: width / 2 + 30, y: secondY }
];

const lineGenerator1 = d3.line()
  .x(d => d.x)
  .y(d => y(d.y))
  .curve(d3.curveBundle.beta(1));

svg.append('path')
  .datum(lineData1)
  .attr('d', lineGenerator1)
  .attr('stroke', 'white')
  .attr('stroke-width', 1)
  .attr('fill', 'none');
  
// Line for second text box for first curved line
svg.append("line")
  .attr("x1", width / 2 + 100)
  .attr("y1", y(firstApex))
  .attr("x2", width / 2 + 85)
  .attr("y2", y(firstApex))
  .style("stroke", "white")
  .style("stroke-width", 1);

// Second textbox for first curved line 
svg.append("rect")
  .attr("x", width / 2 + 100)
  .attr("y", y(firstApex) - 10)
  .attr("width", 130)
  .attr("height", 25)
  .style("fill", "white")
  .style("stroke", "black")
  .style("stroke-width", 1);

// Text for second text box (first curved line)
svg.append("text")
  .attr("x", width / 2 + 105)
  .attr("y", y(firstApex) + 5)
  .text("Older than 500 years.")
  .style("font-size", "12px")
  .style("fill", "black");

// Coordinates for second curved line
const lineData2 = [
  { x: width / 2 + 10, y: thirdY },
  { x: width / 2 + 20, y: (thirdY + fourthY) / 2 }, // Kontrollpunkt für stärkere Biegung
  { x: width / 2 + 10, y: fourthY }
];

const lineGenerator2 = d3.line()
  .x(d => d.x)
  .y(d => y(d.y))
  .curve(d3.curveBundle.beta(1)); // Beta-Wert auf 1 gesetzt für stärkere Biegung

svg.append('path')
  .datum(lineData2)
  .attr('d', lineGenerator2)
  .attr('stroke', 'white')
  .attr('stroke-width', 1)
  .attr('fill', 'none');

// Line for third text box
svg.append("line")
  .attr("x1", width / 2 + 18)
  .attr("y1", y(secondApex))
  .attr("x2", width / 2 + 80)
  .attr("y2", y(secondApex))
  .style("stroke", "white")
  .style("stroke-width", 1);

// Text box for second curved line
svg.append("rect")
  .attr("x", width / 2 + 80)
  .attr("y", y(secondApex) - 10)
  .attr("width", 140)
  .attr("height", 25)
  .style("fill", "white")
  .style("stroke", "black")
  .style("stroke-width", 1);

// Text for third text box
svg.append("text")
  .attr("x", width / 2 + 85)
  .attr("y", y(secondApex) + 5)
  .text("Main timeframe of lost art.")
  .style("font-size", "12px")
  .style("fill", "black");


});
