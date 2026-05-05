const map = L.map('map').setView(
  [listingData.coordinates[1], listingData.coordinates[0]],
  12
);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

L.marker([listingData.coordinates[1], listingData.coordinates[0]])
  .addTo(map)
  .bindPopup(`<b>${listingData.title}</b>`)
  .openPopup();