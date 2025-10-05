// Finite map setup
const southWest = L.latLng(-90, -180);
const northEast = L.latLng(90, 180);
const bounds = L.latLngBounds(southWest, northEast);

const map = L.map("map", {
  worldCopyJump: false,
  maxBounds: bounds,
  maxBoundsViscosity: 1.0
}).setView([20, 0], 2);

// Load map tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 8,
  minZoom: 2,
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
}).addTo(map);

// Function to simulate impact
async function simulateImpact() {
  const locationName = document.getElementById("locationInput").value.trim();
  const impactResults = document.getElementById("impactResults");

  if (!locationName) {
    alert("Please enter a location name!");
    return;
  }

  const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`;
  const response = await fetch(geoUrl);
  const data = await response.json();

  if (data.length === 0) {
    alert("Location not found! Try another name.");
    return;
  }

  const lat = parseFloat(data[0].lat);
  const lon = parseFloat(data[0].lon);
  map.setView([lat, lon], 6);

  L.circle([lat, lon], {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.5,
    radius: 50000
  }).addTo(map).bindPopup(`💥 Impact near ${locationName}`).openPopup();

  // Generate statistical data (simulated)
  const energy = (Math.random() * 80 + 20).toFixed(1); // megatons
  const crater = (energy * 0.25).toFixed(1); // crater diameter (km)
  const shockwave = (energy * 0.5).toFixed(1); // shockwave radius (km)
  const population = Math.floor(Math.random() * 2_000_000 + 500_000);
  const economicLoss = (energy * population * 0.05).toFixed(0);
  const severity = energy > 80 ? "🌍 Global" : energy > 50 ? "🌋 Severe" : "💥 Moderate";

  // Update results
  impactResults.innerHTML = `
    <h3>Impact Analysis for ${locationName}</h3>
    <p><b>Coordinates:</b> ${lat.toFixed(2)}, ${lon.toFixed(2)}</p>
    <div class="stats">
      <div class="stat-box">
        <div class="stat-value">${energy}</div>
        <div>Energy (Megatons)</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${crater}</div>
        <div>Crater Diameter (km)</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${shockwave}</div>
        <div>Shockwave Radius (km)</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">${population.toLocaleString()}</div>
        <div>Population Affected</div>
      </div>
      <div class="stat-box">
        <div class="stat-value">$${(economicLoss / 1e9).toFixed(2)}B</div>
        <div>Economic Loss</div>
      </div>
    </div>
    <br>
    <b>Overall Severity:</b> ${severity}
    <div class="severity-bar"></div>
    <p style="margin-top:10px;">The asteroid impact near <b>${locationName}</b> could cause widespread damage
    with an estimated <b>${crater} km crater</b> and <b>${shockwave} km</b> shockwave radius.</p>
  `;
}
