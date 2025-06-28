// The svg
var svg = d3.select("#missingArt1"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
console.log("SVG selected");

// Map and projection
var projection = d3.geoMercator()
    .scale(290)
    .translate([width / 2, height / 2 * 1.3])
    .center([10, 45]);
console.log("Projection set");

// A path generator
var path = d3.geoPath()
    .projection(projection);
console.log("DSV parser created");

// Create a DSV parser for semicolon-separated values
var dsv = d3.dsvFormat(";");

// Read the data with semicolon as delimiter
d3.text("http://localhost/missingArt/missingArt1.csv", function (text) {
    var data = dsv.parse(text);
    console.log("CSV Data:", data);

    // Filter out rows with null values
    data = data.filter(function (row) {
        return Object.values(row).every(function (value) {
            return value !== null;
        });
    });
    console.log("Filtered Data:", data);

    // Load world shape AND list of connection
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

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(dataGeo.features)
            .enter().append("path")
            .attr("fill", "#b8b8b8")
            .attr("d", d3.geoPath().projection(projection))
            .style("stroke", "#fff")
            .style("stroke-width", 0);

        // Add the paths
        svg.selectAll("myPath")
            .data(links)
            .enter()
            .append("path")
            .attr("d", function (d) { return path(d); })
            .style("fill", "none")
            .style("stroke", "#69b3a2")
            .style("stroke-width", 1)
            .style("opacity", 0.5);

        
        // Annotations
        var berlinCoords = projection([13.4050, 52.5200]); // Coordinates of Berlin
        var amsterdamCoords = projection([4.883333, 52.366667]); // Coordinates of Amsterdam
        var romeCoords = projection([12.482778, 41.893056]); // Coordinates of Rome

        // Rectangle for Berlin
        svg.append("rect")
            .attr("x", berlinCoords[0] - 5)
            .attr("y", berlinCoords[1] - 5)
            .attr("width", 5)
            .attr("height", 5)
            .attr("fill", "red")
            .attr("stroke", "black")
            .attr("stroke-width", 0.5);

        // Add text "Berlin"
        svg.append("text")
            .attr("x", berlinCoords[0] + 5)
            .attr("y", berlinCoords[1])
            .text("Berlin")
            .attr("font-size", "14px")
            .attr("fill", "black")
            .attr("font-weight", "bold");
        
        // Rectangle for Amsterdam
        svg.append("rect")
            .attr("x", amsterdamCoords[0] - 5)
            .attr("y", amsterdamCoords[1] - 5)
            .attr("width", 5)
            .attr("height", 5)
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", 0.5);

        // Add text "Amsterdam"
        svg.append("text")
            .attr("x", amsterdamCoords[0] - 4)
            .attr("y", amsterdamCoords[1] + 7)
            .text("Amsterdam")
            .attr("font-size", "7px")
            .attr("fill", "black")
            .attr("font-weight", "bold");
        
        // Rectangle for Rome
        svg.append("rect")
            .attr("x", romeCoords[0] - 2)
            .attr("y", romeCoords[1] - 5)
            .attr("width", 5)
            .attr("height", 5)
            .attr("fill", "white")
            .attr("stroke", "black")
            .attr("stroke-width", 0.5);

        // Add text "Rome"
        svg.append("text")
            .attr("x", romeCoords[0] - 12)
            .attr("y", romeCoords[1] - 8)
            .text("Rome")
            .attr("font-size", "7px")
            .attr("fill", "black")
            .attr("font-weight", "bold");

    }

});