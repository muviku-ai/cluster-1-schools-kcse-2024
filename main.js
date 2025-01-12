//initialize
let map = L.map("map", {
  center: [0.068001, 37.648034],
  zoom: 7,
});
let schools;

// add base maps
let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy: OpenStreetMap",
}).addTo(map);

let esriImagery = L.tileLayer(
  "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: `Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, 
      IGN, IGP, UPR-EGP, and the GIS User Community`,
  }
);

let baseMaps = {
  OpenStreetMap: osm,
  "ESRI World Imagery": esriImagery,
};

// styles
let schoolIcon = L.icon({
  iconUrl: "images/school.png",
  iconSize: [25, 25],
  iconAnchor: [12, 12],
  popupAnchor: [0, -10],
});

Promise.all([
  fetch(
    "data/national_schools_in_kenya_cluster_1_with_mean_grades.geojson"
  ).then((response) => {
    return response.json();
  }),
])
  .then((data) => {
    schools = L.geoJSON(data[0], {
      pointToLayer: (feature, latlng) => {
        return L.marker(latlng, { icon: schoolIcon });
      },
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`
          <div>
          <b>Name:</b>  ${feature.properties.SCHOOL} <br />
          <b>COUNTY:</b>  ${feature.properties.COUNTY} <br />
          <b>Type:</b>  ${feature.properties.TYPE} School <br />
          <b>Mean Grade:</b> ${feature.properties.MEAN_GRADE}
          </div>
        `);
      },
    }).addTo(map);
    let overlays;
    //add a layer control button to the map
    L.control.layers(baseMaps, overlays).addTo(map);
  })
  .catch((err) => console.error(err));

// map elements
// map description
let description = L.control({
  position: "bottomright",
});
description.onAdd = function () {
  let div = L.DomUtil.create("div", "description");
  div.innerHTML =
    "<p><b>KENYA CLUSTER 1 NATIONAL SCHOOLS</b></p><hr>" +
    "<p>This map shows the mean grades for KCSE 2024 for national schools which are classified as Cluster 1.<br /></p>" +
    "<p>Clustering has been done based on the human resource and infrastructure found in these national schools. Infrastructure determines the population of students that the institutions can contain.</p>" +
    '<img src="images/leaflet.png">';

  return div;
};
description.addTo(map);
