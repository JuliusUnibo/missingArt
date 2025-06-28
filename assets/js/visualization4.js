// Create a DSV parser for semicolon-separated values
var dsv = d3.dsvFormat(";");

// Read the data with semicolon as delimiter
d3.text("http://localhost/missingArt/missingArt4.csv", function(text) {
  var data = dsv.parse(text);

  // sort data
  data.sort(function(b, a) {
    return a.anzahl_artworks - b.anzahl_artworks;
  });

  // limit to top 6 values
  data = data.slice(0, 6);

  // Assign values to HTML elements
  for (var i = 0; i < data.length; i++) {
    var domain = data[i].domain;
    var count = data[i].count;
    var label_domain = data[i].label_domain;

    document.getElementById("link" + (i + 1)).href = domain;
    document.getElementById("zahl" + (i + 1)).innerText = count;
    document.getElementById("link" + (i + 1)).innerText = label_domain;
  }
});