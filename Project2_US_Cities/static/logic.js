function createMap(citiesPlot) {

    // Create the tile layer that will be the background of our map
    const streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 17,
        id: "mapbox.streets",
        accessToken: API_KEY
      });

    // Create Darkmap background
    const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    // Create satellite Background
    const satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });
    
    // Create a baseMaps object to hold the lightmap layer
    const baseMaps = {
        "Satellite Image" : satellite,
        "Street Map": streetmap,
        "Dark Map" : darkmap
    };

    // Create an overlayMaps object to hold the quakePlot layer
    let overlayMaps = {
        "<b>US Cities</b><hr>Click a Circle for more info! <br> Note all data shown is from 2016<br>": citiesPlot
    };

    // Create the map object with options
    let map = L.map("map-id", {
        center: [32.73, -90],
        zoom: 5,
        layers: [streetmap, darkmap, satellite, citiesPlot]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    // Create and add Legend
};

function createCircleMarkers(response) {

    cities = response.keys
    // Pull the features from response
    const citiesMarkers = cities.map(city => {

        // For each city, create a marker and bind a popup with the city's name
        // coords from response contain a depth field, slice removes this
        // Reverse swaps lat and lng to map locations correctly

        const coords = city.coordinates

        // Change the values of these options to change the symbol's appearance    
        let options = {
            radius: Math.abs(city.biz_growth_Y)*3000,
            fillColor: colorCity(city.biz_growth_Y),
            color: colorCityRim(city.biz_growth_Y),
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5
          }
          
        // new Date parses Epoch time from JSON into human readable date&time
        const popupMsg = "<h4>" + city.city + ", " + city.state + "<hr></h4>" +"<h5><b> Business Growth: " + (city.biz_growth_Y).toFixed(2)+ "%</b>" + "<hr><li>Population: "+ numberWithCommas(city.population_2016) + "</li> " + "<li>Establishments: " + numberWithCommas(city.estab_2016) + "</li> " + "<li>Tax Law Rank: " + city.tax_rank + "</li> " +  "<li>Education: " + (city.bach_or_higher_percent).toFixed(2) + "%     completed undergrad" + "</li> </h5> ";
        const citiesMarkers = L.circle(coords, options).bindPopup(popupMsg); 

        // Add the marker to the quakeMarkers array
        return citiesMarkers;
    })

    // Create a layer group made from the quakeMarkers array, pass it into the createMap function
    createMap(L.layerGroup(citiesMarkers));
}

// Perform an API call to the USGS earthquake API to get quake info. Call createCircleMarkers when complete
(async function(){
    const metadataUrl = "/metadata"
    let response = await d3.json(metadataUrl)
    // console.log(response) For analysis in terminal
    console.log(response)
    createCircleMarkers(response)
})()
 
// this function will add commmas to numbers for human reading 
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
 };

 function colorCity(y) {
    if (y<= 0) {
        color = "red"
    } else {
        color = "green"
     }
     return color
};

function colorCityRim(y) {
    if (y<= 0) {
        color = "darkorange"
    } else {
        color = "lightgreen"
     }
     return color
};