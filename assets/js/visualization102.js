// Set the dimensions and margins of the graph and the svg object
var svg = d3.select("#missingArt102"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
console.log("SVG selected");

// Map
var projection = d3.geoMercator()
    .scale(290)
    .translate([width / 2, height / 2 * 1.3])
    .center([125, 38]);
console.log("Projection set");

// Path generator
var path = d3.geoPath()
    .projection(projection);
console.log("DSV parser created");

// Semicolon-separated data
var dsv = d3.dsvFormat(";");

// Read the data
d3.text("https://raw.githubusercontent.com/JuliusUnibo/missingArt/main/missingArt1.csv", function (text) {
    var data = dsv.parse(text);
    console.log("CSV Data:", data);

    // Filter out rows with null values
    data = data.filter(function (row) {
        return Object.values(row).every(function (value) {
            return value !== null;
        });
    });
    console.log("Filtered Data:", data);

    // Load world shapes and list of connection
    d3.queue()
        .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")  // World shape
        .await(ready);

    function ready(error, dataGeo) {
        if (error) throw error;
        console.log("GeoJSON Data:", dataGeo);

        // Reformat the list of links. Note that columns in csv file are called long0, long1, lat0, lat1, etc.
        var links = [];
        data.forEach(function (row) {
            var coordinates = [];
            for (var i = 0; i <= 5; i++) {
                if (row['long' + i] && row['lat' + i]) {
                    coordinates.push([+row['long' + i], +row['lat' + i]]);
                }
            }
            if (coordinates.length > 1) {
                links.push({ type: "LineString", coordinates: coordinates });
            }
        });
        console.log("Links Data:", links);

        // Draw map
        svg.append("g")
            .selectAll("path")
            .data(dataGeo.features)
            .enter().append("path")
            .attr("fill", "#b8b8b8")
            .attr("d", d3.geoPath().projection(projection))
            .style("stroke", "#fff")
            .style("stroke-width", 0);

        // Add paths
        svg.selectAll("myPath")
            .data(links)
            .enter()
            .append("path")
            .attr("d", function (d) { return path(d); })
            .style("fill", "none")
            .style("stroke", "#69b3a2")
            .style("stroke-width", 1)
            .style("opacity", 0.5); 
    }
});
